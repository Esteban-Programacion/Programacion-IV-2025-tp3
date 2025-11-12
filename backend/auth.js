import express from "express";
import { db } from "./db.js";
import { verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const router = express.Router();

export function authConfig() {
  // Opciones de configuración de passport-jwt
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  // Creo estrategia jwt
  passport.use(
    new Strategy(jwtOptions, async (payload, next) => {
      // Si llegamos a este punto es porque el token es válido
      // Si hace falta realizar algún paso extra antes de llamar al handler de la API
      next(null, payload);
    })
  );
}

export const verificarAutenticacion = passport.authenticate("jwt", {
  session: false,
});

export const verificarAutorizacion = (rol) => {
  return (req, res, next) => {
    const roles = req.user.roles;
    if (!roles.includes(rol)) {
      return res
        .status(401)
        .json({ success: false, message: "Usuario no autorizado" });
    }
    next();
  };
};

router.post(
  "/login",
  body("email", "Email incorrecto").isEmail().isLength({ max: 100 }),
  body("contraseña", "Contraseña incorrecta").isStrongPassword({
    minLength: 8, // Mínimo de 8 caracteres
    minLowercase: 1, // Al menos una letra minúscula
    minUppercase: 0, // Mayúsculas opcionales
    minNumbers: 1, // Al menos un numero
    minSymbols: 0, // Símbolos opcionales
  }),
  verificarValidaciones,
  async (req, res) => {
    const { email, contraseña } = req.body;

    // Consultar por el usuario en la base de datos
    const [usuarios] = await db.execute(
      "SELECT * FROM usuarios WHERE email=?",
      [email]
    );

    if (usuarios.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Email no registrado" });
    }

    // Verificar la contraseña
    const hashedPassword = usuarios[0].contraseña;
    const passwordComparada = await bcrypt.compare(contraseña, hashedPassword);

    if (!passwordComparada) {
      return res
        .status(400)
        .json({ success: false, error: "Contraseña incorrecta" });
    }

    // Generar jwt
    const payload = { userId: usuarios[0].id, email: usuarios[0].email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    // Devolver jwt y otros datos
    res.json({
      success: true,
      token,
      nombre: usuarios[0].nombre,
      email: usuarios[0].email,
    });
  }
);

export default router;
