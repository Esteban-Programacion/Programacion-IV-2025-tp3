import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db.js";
import passport from "passport";
import authRouter, { authConfig } from "./auth.js";
import usuariosRouter from "./usuarios.js";
import conductoresRouter from "./conductores.js";
import vehiculosRouter from "./vehiculos.js";
import viajesRouter from "./viajes.js";

// Cargar variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Configurar autenticación JWT (passport-jwt)
authConfig();
app.use(passport.initialize());

// Prueba de conexión a la base de datos
try {
  await db.getConnection();
  console.log("Conectado a la base de datos");
} catch (err) {
  console.error("Error al conectar a la base de datos:", err);
}

// Rutas
app.get("/", (req, res) => {
  res.send("API de Transporte funcionando correctamente");
});

app.use("/auth", authRouter);
app.use("/usuarios", usuariosRouter);
app.use("/conductores", conductoresRouter);
app.use("/vehiculos", vehiculosRouter);
app.use("/viajes", viajesRouter);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor funcioando en http://localhost:${port}`);
});