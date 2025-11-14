import { useEffect, useState } from "react";
import { useAuth } from "./Auth";
import { useParams, Link } from "react-router";

export const DetallesConductor = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams();
  const [conductor, setConductor] = useState(null);
  const [viajes, setViajes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const resp1 = await fetchAuth(`http://localhost:3000/conductores/${id}`);
      const data1 = await resp1.json();
      if (!resp1.ok || !data1.success) {
        console.log("Error:", data1.error);
      } else {
        setConductor(data1.conductor || data1);
      }

      const resp2 = await fetchAuth(`http://localhost:3000/viajes/conductor/${id}`);
      const data2 = await resp2.json();
      if (!resp2.ok) {
        console.log("Error al obtener viajes:", data2.error);
      } else {
        setViajes(data2.historial || data2);
      }
    };

    fetchData();
  }, [fetchAuth, id]);

  if (!conductor) return null;

  return (
    <article>
      <h2>Detalles del conductor</h2>
      <p><b>Nombre:</b> {conductor.nombre}</p>
      <p><b>Apellido:</b> {conductor.apellido}</p>
      <p><b>DNI:</b> {conductor.dni}</p>
      <p><b>Licencia:</b> {conductor.licencia}</p>
      <p><b>Vencimiento licencia:</b> {conductor.fecha_vencimiento_licencia}</p>

      <h3>Historial de viajes</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Vehiculo</th>
            <th>Fecha salida</th>
            <th>Fecha llegada</th>
            <th>Kms</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {viajes.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.vehiculo_id}</td>
              <td>{v.fecha_salida}</td>
              <td>{v.fecha_llegada}</td>
              <td>{v.kilometros}</td>
              <td>
                <Link role="button" to={`/viajes/${v.id}`}>Ver</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
};
