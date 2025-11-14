import { useEffect, useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate, useParams } from "react-router";

export const ModificarVehiculo = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState(null);

  useEffect(() => {
    const fetchVehiculo = async () => {
      const response = await fetchAuth(`http://localhost:3000/vehiculos/${id}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        return window.alert("Error al cargar datos del vehículo");
      }

      setValues(data.vehiculo);
    };

    fetchVehiculo();
  }, [fetchAuth, id]);

  if (!values) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchAuth(`http://localhost:3000/vehiculos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return window.alert("Error al modificar vehiculo");
    }

    navigate("/vehiculos");
  };

  return (
    <article>
      <h2>Modificar vehiculo</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Marca
            <input
              value={values.marca}
              onChange={(e) => setValues({ ...values, marca: e.target.value })}
            />
          </label>
          <label>
            Modelo
            <input
              value={values.modelo}
              onChange={(e) => setValues({ ...values, modelo: e.target.value })}
            />
          </label>
          <label>
            Patente
            <input
              value={values.patente}
              onChange={(e) => setValues({ ...values, patente: e.target.value })}
            />
          </label>
          <label>
            Año
            <input
              type="number"
              value={values.año}
              onChange={(e) => setValues({ ...values, año: e.target.value })}
            />
          </label>
          <label>
            Capacidad de carga (kg)
            <input
              type="number"
              value={values.capacidad_carga}
              onChange={(e) =>
                setValues({ ...values, capacidad_carga: e.target.value })
              }
            />
          </label>
        </fieldset>
        <input type="submit" value="Guardar cambios" />
      </form>
    </article>
  );
};