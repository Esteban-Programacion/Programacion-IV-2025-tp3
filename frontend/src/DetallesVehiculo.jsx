import { useEffect, useState } from "react";
import { useAuth } from "./Auth";
import { useParams } from "react-router";

export const DetallesVehiculo = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams();
  const [vehiculo, setVehiculo] = useState(null);

  useEffect(() => {
    const fetchVehiculo = async () => {
      const response = await fetchAuth(`http://localhost:3000/vehiculos/${id}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        console.log("Error:", data.error);
        return;
      }

      setVehiculo(data.vehiculo || data);
    };

    fetchVehiculo();
  }, [fetchAuth, id]);

  if (!vehiculo) return null;

  return (
    <article>
      <h2>Detalles del vehículo</h2>
      <p>
        <b>Marca:</b> {vehiculo.marca}
      </p>
      <p>
        <b>Modelo:</b> {vehiculo.modelo}
      </p>
      <p>
        <b>Patente:</b> {vehiculo.patente}
      </p>
      <p>
        <b>Año:</b> {vehiculo.año}
      </p>
      <p>
        <b>Capacidad de carga:</b> {vehiculo.capacidad_carga} kg
      </p>
    </article>
  );
};