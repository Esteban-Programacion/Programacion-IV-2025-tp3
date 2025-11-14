import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./Auth";
import { Link } from "react-router";

export function Vehiculos() {
  const { fetchAuth } = useAuth();
  const [vehiculos, setVehiculos] = useState([]);
  const [buscar, setBuscar] = useState("");

  const fetchVehiculos = useCallback(
    async (buscar) => {
      const searchParams = new URLSearchParams();
      if (buscar) searchParams.append("buscar", buscar);

      const response = await fetchAuth(
        "http://localhost:3000/vehiculos" +
          (searchParams.size > 0 ? "?" + searchParams.toString() : "")
      );
      const data = await response.json();

      if (!response.ok) {
        console.log("Error:", data.error);
        return;
      }

      setVehiculos(data.vehiculos || data);
    },
    [fetchAuth]
  );

  useEffect(() => {
    fetchVehiculos();
  }, [fetchVehiculos]);

  const handleQuitar = async (id) => {
    if (window.confirm("¿Desea eliminar el vehiculo?")) {
      const response = await fetchAuth(`http://localhost:3000/vehiculos/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        return window.alert("Error al eliminar vehculo");
      }

      await fetchVehiculos();
    }
  };

  return (
    <article>
      <h2>Vehículos</h2>
      <Link role="button" to="/vehiculos/crear">
        Nuevo vehículo
      </Link>
      <div className="group">
        <input
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          placeholder="Buscar por marca o patente"
        />
        <button onClick={() => fetchVehiculos(buscar)}>Buscar</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Patente</th>
            <th>Año</th>
            <th>Capacidad (kg)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.marca}</td>
              <td>{v.modelo}</td>
              <td>{v.patente}</td>
              <td>{v.año}</td>
              <td>{v.capacidad_carga}</td>
              <td>
                <div>
                  <Link role="button" to={`/vehiculos/${v.id}`}>
                    Ver
                  </Link>
                  <Link role="button" to={`/vehiculos/${v.id}/modificar`}>
                    Modificar
                  </Link>
                  <button onClick={() => handleQuitar(v.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}