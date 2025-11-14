import { Outlet, Link } from "react-router";
import { useAuth } from "./Auth";
import { Ingresar } from "./Ingresar";

export const Layout = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <main className="container">
      <nav>
        <ul>
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/vehiculos">Vehículos</Link>
          </li>
          <li>
            <Link to="/conductores">Conductores</Link>
          </li>
          <li>
            <Link to="/viajes">Viajes</Link>
          </li>
        </ul>

        <ul>
          <li>
            {isAuthenticated ? (
              <button onClick={logout}>Salir</button>
            ) : (
              <Ingresar />
            )}
          </li>
        </ul>
      </nav>
      <Outlet />
    </main>
  );
};