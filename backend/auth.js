import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { db } from "./db.js";

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "clave_secreta";

// Configuración de estrategia JWT
export const authConfig = () => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET_KEY,
  };

  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        const [rows] = await db.execute(
          "SELECT id, nombre, email FROM usuarios WHERE id = ?",
          [jwt_payload.id]
        );
        if (rows.length > 0) {
          return done(null, rows[0]);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );
};

// Registro
router.post("/register", async (req, res) => {
  const { nombre, email, contraseña } = req.body;

  if (!nombre || !email || !contraseña) {
    return res
      .status(400)
      .json({ success: false, error: "Faltan campos obligatorios" });
  }

  try {
    // Verificar si ya el email
    const [existing] = await db.execute("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, error: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    await db.execute(
      "INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)",
      [nombre, email, hashedPassword]
    );

    res.json({ success: true, message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("Error en /register:", err);
    res.status(500).json({ success: false, error: "Error al registrar usuario" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
    return res
      .status(400)
      .json({ success: false, error: "Faltan email o contraseña" });
  }

  try {
    const [rows] = await db.execute("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: "Usuario no encontrado" });
    }

    const usuario = rows[0];
    const match = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!match) {
      return res.status(401).json({ success: false, error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ success: true, token });
  } catch (err) {
    console.error("Error en /login:", err);
    res.status(500).json({ success: false, error: "Error al iniciar sesión" });
  }
});


export const verificarAutenticacion = passport.authenticate("jwt", { session: false });


export const verificarAutorizacion = (rol) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Token no valido o expirado" });
    }


    if (req.user.rol !== rol) {
      return res.status(403).json({ success: false, message: "Usuario no autorizado" });
    }

    next();
  };
};

export default router;