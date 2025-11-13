import express from "express";
import { db } from "./db.js";
import { body } from "express-validator";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

// Obtener todos los conductores
router.get("/", verificarAutenticacion, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM conductores ORDER BY id DESC");
    res.json({ success: true, conductores: rows });
  } catch (error) {
    console.error("Error al obtener conductores:", error);
    res.status(500).json({ success: false, message: "Error al obtener conductores" });
  }
});

// Obtener un conductor por ID
router.get(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const [rows] = await db.execute("SELECT * FROM conductores WHERE id = ?", [id]);

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "Conductor no encontrado" });
      }

      res.json({ success: true, conductor: rows[0] });
    } catch (error) {
      console.error("Error al obtener conductor:", error);
      res.status(500).json({ success: false, message: "Error al obtener el conductor" });
    }
  }
);

// Crear un nuevo conductor
router.post(
  "/",
  verificarAutenticacion,
  body("nombre", "Nombre invalido").isString().isLength({ min: 1, max: 50 }),
  body("apellido", "Apellido invalido").isString().isLength({ min: 1, max: 50 }),
  body("DNI", "DNI invalido").isNumeric().isLength({ min: 7, max: 8 }),
  body("licencia", "Numero de licencia invalido").isString().isLength({ min: 3, max: 20 }),
  body("fecha_vencimiento_licencia", "Fecha de vencimiento invalida").isISO8601(),
  verificarValidaciones,
  async (req, res) => {
    try {
      const { nombre, apellido, DNI, licencia, fecha_vencimiento_licencia } = req.body;

      const [result] = await db.execute(
        "INSERT INTO conductores (nombre, apellido, DNI, licencia, fecha_vencimiento_licencia) VALUES (?,?,?,?,?)",
        [nombre, apellido, DNI, licencia, fecha_vencimiento_licencia]
      );

      res.status(201).json({
        success: true,
        data: { id: result.insertId, nombre, apellido, DNI, licencia, fecha_vencimiento_licencia },
      });
    } catch (error) {
      console.error("Error al crear conductor:", error);
      res.status(500).json({ success: false, message: "Error al crear el conductor" });
    }
  }
);

// Actualizar un conductor
router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  body("nombre").optional().isString().isLength({ min: 1, max: 50 }),
  body("apellido").optional().isString().isLength({ min: 1, max: 50 }),
  body("DNI").optional().isNumeric().isLength({ min: 7, max: 8 }),
  body("licencia").optional().isString().isLength({ min: 3, max: 20 }),
  body("fecha_vencimiento_licencia").optional().isISO8601(),
  verificarValidaciones,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { nombre, apellido, DNI, licencia, fecha_vencimiento_licencia } = req.body;

      const [result] = await db.execute(
        "UPDATE conductores SET nombre=?, apellido=?, DNI=?, licencia=?, fecha_vencimiento_licencia=? WHERE id=?",
        [nombre, apellido, DNI, licencia, fecha_vencimiento_licencia, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Conductor no encontrado" });
      }

      res.json({ success: true, message: "Conductor actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar conductor:", error);
      res.status(500).json({ success: false, message: "Error al actualizar el conductor" });
    }
  }
);

// Eliminar un conductor
router.delete(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const [result] = await db.execute("DELETE FROM conductores WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Conductor no encontrado" });
      }

      res.json({ success: true, message: "Conductor eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar conductor:", error);
      res.status(500).json({ success: false, message: "Error al eliminar el conductor" });
    }
  }
);

export default router;