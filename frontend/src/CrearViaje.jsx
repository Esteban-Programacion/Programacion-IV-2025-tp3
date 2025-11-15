import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router";

export const CrearViaje = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();

  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [values, setValues] = useState({
    vehiculo_id: "",
    conductor_id: "",
    fecha_salida: "",
    fecha_llegada: "",
    origen: "",
    destino: "",
    kilometros: "",
    observaciones: "",
  });

  const fetchOpciones = useCallback(async () => {
    const [resVeh, resCond] = await Promise.all([
      fetchAuth("http://localhost:3000/vehiculos"),
      fetchAuth("http://localhost:3000/conductores"),
    ]);
    const dataVeh = await resVeh.json();
    const dataCond = await resCond.json();
    setVehiculos(dataVeh.vehiculos || []);
    setConductores(dataCond.conductores || []);
  }, [fetchAuth]);

  useEffect(() => {
    fetchOpciones();
  }, [fetchOpciones]);

   const handleSubmit = async (e) => {
  e.preventDefault();

  const salida = new Date(values.fecha_salida);
  const llegada = new Date(values.fecha_llegada);

  if (isNaN(salida) || isNaN(llegada)) {
    return window.alert("Debe ingresar fechas validas.");
  }

  if (llegada < salida) {
    return window.alert("La fecha de llegada no puede ser anterior a la fecha de salida.");
  }

  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;

  if (!soloLetras.test(values.origen)) {
    return window.alert("El origen solo puede contener letras.");
  }

  if (!soloLetras.test(values.destino)) {
    return window.alert("El destino solo puede contener letras.");
  }

  const response = await fetchAuth("http://localhost:3000/viajes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    return window.alert("Error al crear viaje");
  }

  navigate("/viajes");
};


  return (
    <article>
      <h2>Registrar nuevo viaje</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Vehiculo
            <select
              required
              value={values.vehiculo_id}
              onChange={(e) =>
                setValues({ ...values, vehiculo_id: e.target.value })
              }
            >
              <option value="">Seleccione un vehiculo</option>
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
              <option value="">Seleccione un conductor</option>
              {conductores.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} {c.apellido}
                </option>
              ))}
            </select>
          </label>

          <label>
            Fecha de salida
            <input
              type="datetime-local"
              required
              value={values.fecha_salida}
              onChange={(e) =>
                setValues({ ...values, fecha_salida: e.target.value })
              }
            />
          </label>

          <label>
            Fecha de llegada
            <input
              type="datetime-local"
              required
              value={values.fecha_llegada}
              onChange={(e) =>
                setValues({ ...values, fecha_llegada: e.target.value })
              }
            />
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

        <input type="submit" value="Registrar viaje" />
      </form>
    </article>
  );
};