import express from "express";
import { db } from "./db.js";
import { body } from "express-validator";
import { verificarValidaciones, validarId } from "./validaciones.js";
import { verificarAutenticacion, verificarAutorizacion } from "./auth.js";

const router = express.Router();

router.get("/", verificarAutenticacion, async (req, res, next) => {
  try {
    const [rows] = await db.execute("SELECT * FROM vehiculos ORDER BY id DESC");
    res.json({ success: true, vehiculos: rows });
  } catch (err) {
    next(err);
  }
});

router.get(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const [rows] = await db.execute("SELECT * FROM vehiculos WHERE id = ?", [id]);

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "Vehiculo no encontrado" });
      }

      res.json({ success: true, vehiculo: rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/",
  verificarAutenticacion,
  verificarAutorizacion("admin"),
  body("marca", "Marca invalida").isString().isLength({ max: 50 }),
  body("modelo", "Modelo invalido").isString().isLength({ max: 50 }),
  body("patente", "Patente invalida").isString().isLength({ max: 20 }),
  body("año", "Año invalido").isInt({ min: 1900, max: new Date().getFullYear() }),
  body("capacidad_carga", "Capacidad de carga invalida").isFloat({ min: 0 }),
  verificarValidaciones,
  async (req, res, next) => {
    try {
      const { marca, modelo, patente, año, capacidad_carga } = req.body;

      const [result] = await db.execute(
        "INSERT INTO vehiculos (marca, modelo, patente, año, capacidad_carga) VALUES (?,?,?,?,?)",
        [marca, modelo, patente, año, capacidad_carga]
      );

      res.status(201).json({
        success: true,
        data: { id: result.insertId, marca, modelo, patente, año, capacidad_carga },
      });
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/:id",
  verificarAutenticacion,
  verificarAutorizacion("admin"),
  validarId,
  body("marca").optional().isString().isLength({ max: 50 }),
  body("modelo").optional().isString().isLength({ max: 50 }),
  body("patente").optional().isString().isLength({ max: 20 }),
  body("año").optional().isInt({ min: 1900, max: new Date().getFullYear() }),
  body("capacidad_carga").optional().isFloat({ min: 0 }),
  verificarValidaciones,
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const campos = req.body;

      const keys = Object.keys(campos);
      if (keys.length === 0) {
        return res.status(400).json({ success: false, message: "No se enviaron campos para actualizar" });
      }

      const setClause = keys.map(k => `${k} = ?`).join(", ");
      const values = keys.map(k => campos[k]);
      values.push(id);

      const [result] = await db.execute(`UPDATE vehiculos SET ${setClause} WHERE id = ?`, values);

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Vehiculo no encontrado" });
      }

      res.json({ success: true, message: "Vehiculo actualizado correctamente" });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/:id",
  verificarAutenticacion,
  verificarAutorizacion("admin"),
  validarId,
  verificarValidaciones,
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const [result] = await db.execute("DELETE FROM vehiculos WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Vehiculo no encontrado" });
      }

      res.json({ success: true, message: "Vehiculo eliminado correctamente" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;