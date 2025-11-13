import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@picocss/pico";
import "./index.css";

import { Layout } from "./Layout.jsx";
import { Home } from "./Home.jsx";
import { AuthPage, AuthProvider, AuthRol } from "./Auth.jsx";
import { BrowserRouter, Route, Routes } from "react-router";

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
                  <AuthRol rol="admin">
                    <CrearUsuario />
                  </AuthRol>
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
                  <AuthRol rol="admin">
                    <ModificarUsuario />
                  </AuthRol>
                </AuthPage>
              }
            />

            {/* Vehiculos */}
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
                  <AuthRol rol="admin">
                    <CrearVehiculo />
                  </AuthRol>
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
                  <AuthRol rol="admin">
                    <ModificarVehiculo />
                  </AuthRol>
                </AuthPage>
              }
            />

            {/* Conductores */}
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
                  <AuthRol rol="admin">
                    <CrearConductor />
                  </AuthRol>
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
                  <AuthRol rol="admin">
                    <ModificarConductor />
                  </AuthRol>
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
                  <AuthRol rol="admin">
                    <CrearViaje />
                  </AuthRol>
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

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
