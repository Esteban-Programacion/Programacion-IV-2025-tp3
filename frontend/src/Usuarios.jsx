import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import { useAuth } from "./Auth";

export function Usuarios() {
  const { fetchAuth, isAuthenticated } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [buscar, setBuscar] = useState("");

  const fetchUsuarios = useCallback(
    async (buscar) => {
      try {
        const searchParams = new URLSearchParams();

        if (buscar) {
          searchParams.append("buscar", buscar);
        }

        const response = await fetchAuth(
          "http://localhost:8000/usuarios" +
            (searchParams.size > 0 ? "?" + searchParams.toString() : "")
        );

        const data = await response.json();

        if (!response.ok) {
          console.log("Error:", data.error);
          return;
        }

        setUsuarios(data.usuarios || []);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    },
    [fetchAuth]
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsuarios();
    }
  }, [fetchUsuarios, isAuthenticated]);

  const handleQuitar = async (id) => {
    if (window.confirm("¿Desea eliminar este usuario?")) {
      try {
        const response = await fetchAuth(`http://localhost:8000/usuarios/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
          return window.alert("Error al eliminar usuario");
        }

        await fetchUsuarios();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  if (!isAuthenticated) {
    return <p>Debe iniciar sesion para ver esta seccion.</p>;
  }

  return (
    <article>
      <h2>Usuarios</h2>

      <Link role="button" to="/usuarios/crear">
        Nuevo usuario
      </Link>

      <div className="group">
        <input
          placeholder="Buscar usuario"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />
        <button onClick={() => fetchUsuarios(buscar)}>Buscar</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Apellido</th>
            <th>Nombre</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.apellido}</td>
              <td>{u.nombre}</td>
              <td>{u.activo ? "Sí" : "No"}</td>
              <td>
                <div>
                  <Link role="button" to={`/usuarios/${u.id}`}>
                    Ver
                  </Link>
                  <Link role="button" to={`/usuarios/${u.id}/modificar`}>
                    Modificar
                  </Link>
                  <button onClick={() => handleQuitar(u.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
