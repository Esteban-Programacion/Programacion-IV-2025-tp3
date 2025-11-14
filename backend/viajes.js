import express from "express";
import { db } from "./db.js";
import { body } from "express-validator";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { verificarAutenticacion, verificarAutorizacion } from "./auth.js";

const router = express.Router();

// Historial de viajes por vehículo con datos del conductor
router.get(
  "/vehiculo/:id",
  verificarAutenticacion,
  validarId,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const [rows] = await db.execute(
        `SELECT v.*, c.nombre AS conductor_nombre, c.apellido AS conductor_apellido, c.licencia AS conductor_licencia
         FROM viajes v
         JOIN conductores c ON v.conductor_id = c.id
         WHERE v.vehiculo_id = ?
         ORDER BY v.fecha_salida DESC`,
        [id]
      );
      res.json({ success: true, historial: rows });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al obtener historial por vehiculo" });
    }
  }
);

// Historial de viajes por conductor con datos del vehículo
router.get(
  "/conductor/:id",
  verificarAutenticacion,
  validarId,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const [rows] = await db.execute(
        `SELECT v.*, veh.marca, veh.modelo, veh.patente
         FROM viajes v
         JOIN vehiculos veh ON v.vehiculo_id = veh.id
         WHERE v.conductor_id = ?
         ORDER BY v.fecha_salida DESC`,
        [id]
      );
      res.json({ success: true, historial: rows });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al obtener historial por conductor" });
    }
  }
);

// Calculo total de kilómetros por vehículo
router.get(
  "/kilometros/vehiculo/:id",
  verificarAutenticacion,
  validarId,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const [rows] = await db.execute(
        "SELECT SUM(kilometros) AS total_kilometros FROM viajes WHERE vehiculo_id = ?",
        [id]
      );
      res.json({ success: true, total_kilometros: rows[0].total_kilometros || 0 });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al calcular kilometros por vehiculo" });
    }
  }
);

// Calculo total de kilómetros por conductor
router.get(
  "/kilometros/conductor/:id",
  verificarAutenticacion,
  validarId,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const [rows] = await db.execute(
        "SELECT SUM(kilometros) AS total_kilometros FROM viajes WHERE conductor_id = ?",
        [id]
      );
      res.json({ success: true, total_kilometros: rows[0].total_kilometros || 0 });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al calcular kilometros por conductor" });
    }
  }
);

// Obtener todos los viajes
router.get("/", verificarAutenticacion, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM viajes ORDER BY id DESC");
    res.json({ success: true, viajes: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener los viajes" });
  }
});

// Obtener un viaje por id
router.get(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const [rows] = await db.execute("SELECT * FROM viajes WHERE id = ?", [id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "Viaje no encontrado" });
      }
      res.json({ success: true, viaje: rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al obtener el viaje" });
    }
  }
);

// Crear un nuevo viaje
router.post(
  "/",
  verificarAutenticacion,
  verificarAutorizacion("admin"),
  body("vehiculo_id", "Vehiculo invalido").isInt({ min: 1 }),
  body("conductor_id", "Conductor invalido").isInt({ min: 1 }),
  body("fecha_salida", "Fecha de salida invalida").isISO8601(),
  body("fecha_llegada", "Fecha de llegada invalida").isISO8601(),
  body("origen", "Origen invalido").isString().isLength({ min: 1, max: 100 }),
  body("destino", "Destino invalido").isString().isLength({ min: 1, max: 100 }),
  body("kilometros", "Kilometros invalidos").isFloat({ min: 0 }),
  body("observaciones").optional().isString().isLength({ max: 255 }),
  verificarValidaciones,
  async (req, res) => {
    try {
      const {
        vehiculo_id,
        conductor_id,
        fecha_salida,
        fecha_llegada,
        origen,
        destino,
        kilometros,
        observaciones,
      } = req.body;

      const [result] = await db.execute(
        "INSERT INTO viajes (vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones) VALUES (?,?,?,?,?,?,?,?)",
        [vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones]
      );

      res.status(201).json({
        success: true,
        data: {
          id: result.insertId,
          vehiculo_id,
          conductor_id,
          fecha_salida,
          fecha_llegada,
          origen,
          destino,
          kilometros,
          observaciones,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al crear el viaje" });
    }
  }
);

// Actualizar un viaje
router.put(
  "/:id",
  verificarAutenticacion,
  verificarAutorizacion("admin"),
  validarId,
  body("vehiculo_id").optional().isInt({ min: 1 }),
  body("conductor_id").optional().isInt({ min: 1 }),
  body("fecha_salida").optional().isISO8601(),
  body("fecha_llegada").optional().isISO8601(),
  body("origen").optional().isString().isLength({ min: 1, max: 100 }),
  body("destino").optional().isString().isLength({ min: 1, max: 100 }),
  body("kilometros").optional().isFloat({ min: 0 }),
  body("observaciones").optional().isString().isLength({ max: 255 }),
  verificarValidaciones,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const {
        vehiculo_id,
        conductor_id,
        fecha_salida,
        fecha_llegada,
        origen,
        destino,
        kilometros,
        observaciones,
      } = req.body;

      const [result] = await db.execute(
        "UPDATE viajes SET vehiculo_id=?, conductor_id=?, fecha_salida=?, fecha_llegada=?, origen=?, destino=?, kilometros=?, observaciones=? WHERE id=?",
        [vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Viaje no encontrado" });
      }

      res.json({ success: true, message: "Viaje actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al actualizar el viaje" });
    }
  }
);

// Eliminar un viaje
router.delete(
  "/:id",
  verificarAutenticacion,
  verificarAutorizacion("admin"),
  validarId,
  verificarValidaciones,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const [result] = await db.execute("DELETE FROM viajes WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Viaje no encontrado" });
      }
      res.json({ success: true, message: "Viaje eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al eliminar el viaje" });
    }
  }
);

export default router;