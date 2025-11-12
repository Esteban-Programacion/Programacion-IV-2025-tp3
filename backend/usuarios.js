import express from "express";
import { db } from "./db.js";
import { body, param } from "express-validator";
import bcrypt from "bcrypt";
import { validarId, verificarValidaciones } from "./validaciones.js";

const router = express.Router();

// 📘 Obtener todos los usuarios
router.get("/", async (req, res) => {
  const [rows] = await db.execute("SELECT id, nombre, email, creado_en FROM usuarios");
  res.json({ success: true, usuarios: rows });
});

// 📘 Obtener un usuario por ID
router.get(
  "/:id",
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

// 🟢 Crear un nuevo usuario
router.post(
  "/",
  body("nombre").isString().isLength({ min: 2 }).withMessage("Nombre invalido"),
  body("email").isEmail().withMessage("Email invalido"),
  body("contraseña")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, email, contraseña } = req.body;

    // Encriptamos la contraseña
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

// ✏️ Actualizar usuario
router.put(
  "/:id",
  param("id").isInt({ min: 1 }).withMessage("ID invalido"),
  body("nombre").optional().isString().isLength({ min: 2 }),
  body("email").optional().isEmail(),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, email } = req.body;

    await db.execute("UPDATE usuarios SET nombre=?, email=? WHERE id=?", [nombre, email, id]);
    res.json({ success: true, message: "Usuario actualizado correctamente" });
  }
);

//Eliminar usuario
router.delete(
  "/:id",
  param("id").isInt({ min: 1 }).withMessage("ID invalido"),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    await db.execute("DELETE FROM usuarios WHERE id=?", [id]);
    res.json({ success: true, message: "Usuario eliminado correctamente" });
  }
);

export default router;