import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import { conectarDB } from "./db.js";
import authRouter, { authConfig } from "./auth.js";
import usuariosRouter from "./usuarios.js";
import conductoresRouter from "./conductores.js";
import vehiculosRouter from "./vehiculos.js";
import viajesRouter from "./viajes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
try {
  await conectarDB();
  console.log("Conectado a la base de datos");
} catch (err) {
  console.error("Error al conectar a la base de datos:", err);
  process.exit(1);
}

// Configurar autenticación JWT (passport-jwt)
authConfig();
app.use(passport.initialize());

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
  console.log(`Servidor funcionando en http://localhost:${port}`);
});