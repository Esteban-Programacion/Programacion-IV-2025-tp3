import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./Auth";
import { useParams, useNavigate } from "react-router";

export const ModificarViaje = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [values, setValues] = useState(null);

  const fetchDatos = useCallback(async () => {
    const [resViaje, resVeh, resCond] = await Promise.all([
      fetchAuth(`http://localhost:3000/viajes/${id}`),
      fetchAuth("http://localhost:3000/vehiculos"),
      fetchAuth("http://localhost:3000/conductores"),
    ]);

    const dataViaje = await resViaje.json();
    const dataVeh = await resVeh.json();
    const dataCond = await resCond.json();

    if (!resViaje.ok || !dataViaje.success) {
      console.error("Error al obtener datos del viaje");
      return;
    }

    setValues(dataViaje.viaje);
    setVehiculos(dataVeh.vehiculos || []);
    setConductores(dataCond.conductores || []);
  }, [fetchAuth, id]);

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchAuth(`http://localhost:3000/viajes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return window.alert("Error al modificar viaje");
    }

    navigate("/viajes");
  };

  if (!values) return null;

  return (
    <article>
      <h2>Modificar viaje</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Vehículo
            <select
              required
              value={values.vehiculo_id}
              onChange={(e) =>
                setValues({ ...values, vehiculo_id: e.target.value })
              }
            >
              {vehiculos.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.marca} {v.modelo} ({v.patente})
                </option>
              ))}
            </select>
          </label>

          <label>
            Conductor
            <select
              required
              value={values.conductor_id}
              onChange={(e) =>
                setValues({ ...values, conductor_id: e.target.value })
              }
            >
              {conductores.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} {c.apellido}
                </option>
              ))}
            </select>
          </label>

          <label>
            Origen
            <input
              required
              value={values.origen}
              onChange={(e) =>
                setValues({ ...values, origen: e.target.value })
              }
            />
          </label>

          <label>
            Destino
            <input
              required
              value={values.destino}
              onChange={(e) =>
                setValues({ ...values, destino: e.target.value })
              }
            />
          </label>

          <label>
            Kilómetros
            <input
              type="number"
              required
              min="0"
              value={values.kilometros}
              onChange={(e) =>
                setValues({ ...values, kilometros: e.target.value })
              }
            />
          </label>

          <label>
            Observaciones
            <textarea
              value={values.observaciones}
              onChange={(e) =>
                setValues({ ...values, observaciones: e.target.value })
              }
            />
          </label>
        </fieldset>

        <input type="submit" value="Guardar cambios" />
      </form>
    </article>
  );
};