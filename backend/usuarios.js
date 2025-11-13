import express from "express";
import { db } from "./db.js";
import { body, param } from "express-validator";
import bcrypt from "bcrypt";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { verificarAutenticacion, verificarAutorizacion } from "./auth.js";

const router = express.Router();

// listar todos los usuarios
router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute("SELECT id, nombre, email, creado_en FROM usuarios");
  res.json({ success: true, usuarios: rows });
});

// obtener un usuario por id
router.get(
  "/:id",
  verificarAutenticacion,
  param("id").isInt({ min: 1 }).withMessage("ID invalido"),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await db.execute(
      "SELECT id, nombre, email, creado_en FROM usuarios WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    res.json({ success: true, usuario: rows[0] });
  }
);

// crear un usuario nuevo
router.post(
  "/",
  verificarAutenticacion,
  verificarAutorizacion("admin"),
  body("nombre").isString().isLength({ min: 2 }).withMessage("Nombre invalido"),
  body("email").isEmail().withMessage("Email invalido"),
  body("contraseña")
    .isLength({ min: 6 })
    .withMessage("La contrasena debe tener al menos 6 caracteres"),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, email, contraseña } = req.body;

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const [result] = await db.execute(
      "INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)",
      [nombre, email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: "Usuario creado correctamente",
      data: { id: result.insertId, nombre, email },
    });
  }
);

// modificar un usuario
router.put(
  "/:id",
  verificarAutenticacion,
  verificarAutorizacion("admin"),
  param("id").isInt({ min: 1 }).withMessage("ID invalido"),
  body("nombre").optional().isString().isLength({ min: 2 }),
  body("email").optional().isEmail(),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, email } = req.body;

    const [result] = await db.execute(
      "UPDATE usuarios SET nombre=?, email=? WHERE id=?",
      [nombre, email, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    res.json({ success: true, message: "Usuario actualizado correctamente" });
  }
);

// eliminar un usuario
router.delete(
  "/:id",
  verificarAutenticacion,
  verificarAutorizacion("admin"),
  param("id").isInt({ min: 1 }).withMessage("ID invalido"),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const [result] = await db.execute("DELETE FROM usuarios WHERE id=?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    res.json({ success: true, message: "Usuario eliminado correctamente" });
  }
);

export default router;
