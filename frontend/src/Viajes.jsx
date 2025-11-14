import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./Auth";
import { Link, useNavigate } from "react-router";

export const Viajes = () => {
  const { fetchAuth } = useAuth();
  const [viajes, setViajes] = useState([]);
  const navigate = useNavigate();

  const fetchViajes = useCallback(async () => {
    try {
      const response = await fetchAuth("http://localhost:3000/viajes");
      const data = await response.json();
      if (!response.ok || !data.success) {
        console.error("Error al obtener los viajes");
        return;
      }
      setViajes(data.viajes);
    } catch (error) {
      console.error("Error de red:", error);
    }
  }, [fetchAuth]);

  useEffect(() => {
    fetchViajes();
  }, [fetchViajes]);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que desea eliminar este viaje?")) return;

    const response = await fetchAuth(`http://localhost:3000/viajes/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return window.alert("Error al eliminar viaje");
    }

    fetchViajes();
  };

  return (
    <article>
      <h2>Listado de viajes</h2>
      <Link role="button" to="/viajes/crear">Crear nuevo viaje</Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Vehiculo</th>
            <th>Conductor</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Kilometros</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {viajes.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.vehiculo_id}</td>
              <td>{v.conductor_id}</td>
              <td>{v.origen}</td>
              <td>{v.destino}</td>
              <td>{v.kilometros}</td>
              <td>
                <Link role="button" to={`/viajes/${v.id}`}>Ver</Link>
                <Link to={`/viajes/${v.id}/modificar`}>Editar</Link>
                <button onClick={() => handleEliminar(v.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
};