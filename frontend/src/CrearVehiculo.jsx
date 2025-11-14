import { useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router";

export const CrearVehiculo = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const [errores, setErrores] = useState(null);

  const [values, setValues] = useState({
    marca: "",
    modelo: "",
    patente: "",
    año: "",
    capacidad_carga: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores(null);

    const response = await fetchAuth("http://localhost:3000/vehiculos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return window.alert("Error al crear vehículo");
    }

    navigate("/vehiculos");
  };

  return (
    <article>
      <h2>Registrar vehículo</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Marca
            <input
              required
              value={values.marca}
              onChange={(e) => setValues({ ...values, marca: e.target.value })}
            />
          </label>
          <label>
            Modelo
            <input
              required
              value={values.modelo}
              onChange={(e) => setValues({ ...values, modelo: e.target.value })}
            />
          </label>
          <label>
            Patente
            <input
              required
              value={values.patente}
              onChange={(e) => setValues({ ...values, patente: e.target.value })}
            />
          </label>
          <label>
            Año
            <input
              type="number"
              required
              value={values.año}
              onChange={(e) => setValues({ ...values, año: e.target.value })}
            />
          </label>
          <label>
            Capacidad de carga (kg)
            <input
              type="number"
              required
              value={values.capacidad_carga}
              onChange={(e) =>
                setValues({ ...values, capacidad_carga: e.target.value })
              }
            />
          </label>
        </fieldset>
        <input type="submit" value="Guardar" />
      </form>
    </article>
  );
};