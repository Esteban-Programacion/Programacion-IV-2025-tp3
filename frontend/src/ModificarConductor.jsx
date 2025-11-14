import { useEffect, useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate, useParams } from "react-router";

export const ModificarConductor = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState(null);
  const [errores, setErrores] = useState(null);

  useEffect(() => {
    const fetchConductor = async () => {
      const response = await fetchAuth(`http://localhost:3000/conductores/${id}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        return window.alert("Error al cargar datos del conductor");
      }

      setValues(data.conductor || data);
    };

    fetchConductor();
  }, [fetchAuth, id]);

  if (!values) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores(null);

    const response = await fetchAuth(`http://localhost:3000/conductores/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      if (response.status === 400) {
        return setErrores(data.errores);
      }
      return window.alert("Error al modificar conductor");
    }

    navigate("/conductores");
  };

  return (
    <article>
      <h2>Modificar conductor</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nombre
            <input
              value={values.nombre}
              onChange={(e) => setValues({ ...values, nombre: e.target.value })}
            />
          </label>

          <label>
            Apellido
            <input
              value={values.apellido}
              onChange={(e) => setValues({ ...values, apellido: e.target.value })}
            />
          </label>

          <label>
            DNI
            <input
              value={values.DNI}
              onChange={(e) => setValues({ ...values, DNI: e.target.value })}
            />
          </label>

          <label>
            Licencia
            <input
              value={values.licencia}
              onChange={(e) => setValues({ ...values, licencia: e.target.value })}
            />
          </label>

          <label>
            Fecha vencimiento licencia
            <input
              type="date"
              value={values.fecha_vencimiento_licencia}
              onChange={(e) =>
                setValues({ ...values, fecha_vencimiento_licencia: e.target.value })
              }
            />
          </label>
        </fieldset>

        <input type="submit" value="Guardar cambios" />
      </form>
    </article>
  );
};
