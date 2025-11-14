import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./Auth";
import { Link } from "react-router";

export function Conductores() {
  const { fetchAuth } = useAuth();
  const [conductores, setConductores] = useState([]);
  const [buscar, setBuscar] = useState("");

  const fetchConductores = useCallback(
    async (buscar) => {
      const searchParams = new URLSearchParams();
      if (buscar) searchParams.append("buscar", buscar);

      const response = await fetchAuth(
        "http://localhost:3000/conductores" +
          (searchParams.size > 0 ? "?" + searchParams.toString() : "")
      );
      const data = await response.json();

      if (!response.ok) {
        console.log("Error:", data.error);
        return;
      }

      setConductores(data.conductores || data);
    },
    [fetchAuth]
  );

  useEffect(() => {
    fetchConductores();
  }, [fetchConductores]);

  const handleQuitar = async (id) => {
    if (window.confirm("Desea eliminar el conductor?")) {
      const response = await fetchAuth(`http://localhost:3000/conductores/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        return window.alert("Error al eliminar conductor");
      }

      await fetchConductores();
    }
  };

  return (
    <article>
      <h2>Conductores</h2>
      <Link role="button" to="/conductores/crear">
        Nuevo conductor
      </Link>

      <div className="group">
        <input
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          placeholder="Buscar por nombre, apellido o DNI"
        />
        <button onClick={() => fetchConductores(buscar)}>Buscar</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Licencia</th>
            <th>Vencimiento licencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {conductores.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nombre}</td>
              <td>{c.apellido}</td>
              <td>{c.dni}</td>
              <td>{c.licencia}</td>

              {}
              <td>{new Date(c.fecha_vencimiento_licencia).toLocaleDateString()}</td>

              <td>
                <div>
                  <Link role="button" to={`/conductores/${c.id}`}>Ver</Link>
                  <Link role="button" to={`/conductores/${c.id}/modificar`}>Modificar</Link>
                  <button onClick={() => handleQuitar(c.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
