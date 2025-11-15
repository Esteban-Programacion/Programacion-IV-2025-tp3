import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./Auth";
import { useParams, Link } from "react-router";

export const DetallesViaje = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams();
  const [viaje, setViaje] = useState(null);

  const fetchViaje = useCallback(async () => {
    const response = await fetchAuth(`http://localhost:3000/viajes/${id}`);
    const data = await response.json();
    if (!response.ok || !data.success) {
      console.error("Error al obtener el viaje");
      return;
    }
    setViaje(data.viaje);
  }, [fetchAuth, id]);

  useEffect(() => {
    fetchViaje();
  }, [fetchViaje]);

  if (!viaje) return null;

  return (
    <article>
      <h2>Detalles del viaje</h2>
      <ul>
        <li><b>ID:</b> {viaje.id}</li>

        <li><b>Vehiculo ID:</b> {viaje.vehiculo_id}</li>
        <li><b>Vehiculo:</b> {viaje.vehiculo_marca} {viaje.vehiculo_modelo}</li>
        <li><b>Patente:</b> {viaje.vehiculo_patente}</li>

        <li><b>Conductor ID:</b> {viaje.conductor_id}</li>
        <li><b>Conductor:</b> {viaje.conductor_nombre} {viaje.conductor_apellido}</li>
        <li><b>DNI Conductor:</b> {viaje.conductor_dni}</li>

        <li><b>Origen:</b> {viaje.origen}</li>
        <li><b>Destino:</b> {viaje.destino}</li>
        <li><b>Kilometros:</b> {viaje.kilometros}</li>
        <li><b>Fecha salida:</b> {viaje.fecha_salida}</li>
        <li><b>Fecha llegada:</b> {viaje.fecha_llegada}</li>
        <li><b>Observaciones:</b> {viaje.observaciones}</li>
      </ul>
      <Link role="button" to={`/viajes/${viaje.id}/modificar`}>Editar</Link>{" "}
      <Link role="button" to="/viajes">Volver al listado</Link>
    </article>
  );
};
