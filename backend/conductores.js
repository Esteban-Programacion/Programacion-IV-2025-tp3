import express from "express";
import { db } from "./db.js";
import { body } from "express-validator";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { verificarAutenticacion, verificarAutorizacion } from "./auth.js";

const router = express.Router();


router.get("/", verificarAutenticacion, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM conductor ORDER BY id DESC");
    res.json({ success: true, conductores: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener conductores" });
  }
});

router.get(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const [rows] = await db.execute("SELECT * FROM conductor WHERE id = ?", [id]);

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "Conductor no encontrado" });
      }

      res.json({ success: true, conductor: rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al obtener el conductor" });
    }
  }
);


router.post(
  "/",
  verificarAutenticacion,
  verificarAutorizacion("admin"),
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
        "INSERT INTO conductor (nombre, apellido, DNI, licencia, fecha_vencimiento_licencia) VALUES (?,?,?,?,?)",
        [nombre, apellido, DNI, licencia, fecha_vencimiento_licencia]
      );

      res.status(201).json({
        success: true,
        data: { id: result.insertId, nombre, apellido, DNI, licencia, fecha_vencimiento_licencia },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al crear el conductor" });
    }
  }
);


router.put(
  "/:id",
  verificarAutenticacion,
  verificarAutorizacion("admin"),
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
        "UPDATE conductor SET nombre=?, apellido=?, DNI=?, licencia=?, fecha_vencimiento_licencia=? WHERE id=?",
        [nombre, apellido, DNI, licencia, fecha_vencimiento_licencia, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Conductor no encontrado" });
      }

      res.json({ success: true, message: "Conductor actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al actualizar el conductor" });
    }
  }
);

router.delete(
  "/:id",
  verificarAutenticacion,
  verificarAutorizacion("admin"),
  validarId,
  verificarValidaciones,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const [result] = await db.execute("DELETE FROM conductor WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Conductor no encontrado" });
      }

      res.json({ success: true, message: "Conductor eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al eliminar el conductor" });
    }
  }
);

export default router;