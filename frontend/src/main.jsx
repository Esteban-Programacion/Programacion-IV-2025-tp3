import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@picocss/pico";
import "./index.css";

import { Layout } from "./Layout.jsx";
import { Home } from "./Home.jsx";
import { AuthPage, AuthProvider } from "./Auth.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Usuarios } from "./Usuarios.jsx";
import { DetallesUsuario } from "./DetallesUsuario.jsx";
import { CrearUsuario } from "./CrearUsuario.jsx";
import { ModificarUsuario } from "./ModificarUsuario.jsx";

import { Vehiculos } from "./Vehiculos.jsx";
import { DetallesVehiculo } from "./DetallesVehiculo.jsx";
import { CrearVehiculo } from "./CrearVehiculo.jsx";
import { ModificarVehiculo } from "./ModificarVehiculo.jsx";

import { Conductores } from "./Conductores.jsx";
import { DetallesConductor } from "./DetallesConductor.jsx";
import { CrearConductor } from "./CrearConductor.jsx";
import { ModificarConductor } from "./ModificarConductor.jsx";

import { Viajes } from "./Viajes.jsx";
import { DetallesViaje } from "./DetallesViaje.jsx";
import { CrearViaje } from "./CrearViaje.jsx";
import { ModificarViaje } from "./ModificarViaje.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            {/* Usuarios */}
            <Route
              path="usuarios"
              element={
                <AuthPage>
                  <Usuarios />
                </AuthPage>
              }
            />
            <Route
              path="usuarios/crear"
              element={
                <AuthPage>
                  <CrearUsuario />
                </AuthPage>
              }
            />
            <Route
              path="usuarios/:id"
              element={
                <AuthPage>
                  <DetallesUsuario />
                </AuthPage>
              }
            />
            <Route
              path="usuarios/:id/modificar"
              element={
                <AuthPage>
                  <ModificarUsuario />
                </AuthPage>
              }
            />

           
            <Route
              path="vehiculos"
              element={
                <AuthPage>
                  <Vehiculos />
                </AuthPage>
              }
            />
            <Route
              path="vehiculos/crear"
              element={
                <AuthPage>
                  <CrearVehiculo />
                </AuthPage>
              }
            />
            <Route
              path="vehiculos/:id"
              element={
                <AuthPage>
                  <DetallesVehiculo />
                </AuthPage>
              }
            />
            <Route
              path="vehiculos/:id/modificar"
              element={
                <AuthPage>
                  <ModificarVehiculo />
                </AuthPage>
              }
            />

           
            <Route
              path="conductores"
              element={
                <AuthPage>
                  <Conductores />
                </AuthPage>
              }
            />
            <Route
              path="conductores/crear"
              element={
                <AuthPage>
                  <CrearConductor />
                </AuthPage>
              }
            />
            <Route
              path="conductores/:id"
              element={
                <AuthPage>
                  <DetallesConductor />
                </AuthPage>
              }
            />
            <Route
              path="conductores/:id/modificar"
              element={
                <AuthPage>
                  <ModificarConductor />
                </AuthPage>
              }
            />

            {/* Viajes */}
            <Route
              path="viajes"
              element={
                <AuthPage>
                  <Viajes />
                </AuthPage>
              }
            />
            <Route
              path="viajes/crear"
              element={
                <AuthPage>
                  <CrearViaje />
                </AuthPage>
              }
            />
            <Route
              path="viajes/:id"
              element={
                <AuthPage>
                  <DetallesViaje />
                </AuthPage>
              }
            />
            <Route
              path="viajes/:id/modificar"
              element={
                <AuthPage>
                  <ModificarViaje />
                </AuthPage>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);