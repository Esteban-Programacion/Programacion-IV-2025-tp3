import { useEffect, useState } from "react";
import { useAuth } from "./Auth";
import { useParams, Link } from "react-router";

export const DetallesVehiculo = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams();
  const [vehiculo, setVehiculo] = useState(null);
  const [viajes, setViajes] = useState([]);
  const [totalKms, setTotalKms] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      
      const resp1 = await fetchAuth(`http://localhost:3000/vehiculos/${id}`);
      const data1 = await resp1.json();
      if (!resp1.ok || !data1.success) {
        console.log("Error:", data1.error);
      } else {
        setVehiculo(data1.vehiculo || data1);
      }

      const resp2 = await fetchAuth(`http://localhost:3000/viajes/vehiculo/${id}`);
      const data2 = await resp2.json();
      if (!resp2.ok) {
        console.log("Error al obtener viajes:", data2.error);
      } else {
        setViajes(data2.historial || data2);
      }

      
      const resp3 = await fetchAuth(`http://localhost:3000/viajes/kilometros/vehiculo/${id}`);
      const data3 = await resp3.json();
      if (!resp3.ok) {
        console.log("Error al calcular total de kms:", data3.error);
      } else {
        setTotalKms(data3.total_kilometros || 0);
      }
    };

    fetchData();
  }, [fetchAuth, id]);

  if (!vehiculo) return null;

  return (
    <article>
      <h2>Detalles del vehículo</h2>
      <p><b>Marca:</b> {vehiculo.marca}</p>
      <p><b>Modelo:</b> {vehiculo.modelo}</p>
      <p><b>Patente:</b> {vehiculo.patente}</p>
      <p><b>Año:</b> {vehiculo.año}</p>
      <p><b>Capacidad de carga:</b> {vehiculo.capacidad_carga} kg</p>
      <p><b>Total kilómetros recorridos:</b> {totalKms}</p>

      <h3>Historial de viajes</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Conductor</th>
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
              <td>{v.conductor_nombre} {v.conductor_apellido}</td> {}
              <td>{new Date(v.fecha_salida).toLocaleString()}</td>
              <td>{new Date(v.fecha_llegada).toLocaleString()}</td>
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
