import { useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router";

export const CrearConductor = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const [errores, setErrores] = useState(null);

  const [values, setValues] = useState({
    nombre: "",
    apellido: "",
    DNI: "",
    licencia: "",
    fecha_vencimiento_licencia: "",
  });

 const handleSubmit = async (e) => {
  e.preventDefault();
  setErrores(null);

  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
  const soloNumeros = /^[0-9]+$/;
  const licenciaValida = /^[A-Za-z0-9]+$/;

  if (!soloLetras.test(values.nombre)) {
    return window.alert("El nombre solo puede contener letras y espacios.");
  }
  if (!soloLetras.test(values.apellido)) {
    return window.alert("El apellido solo puede contener letras y espacios.");
  }
  if (!soloNumeros.test(values.DNI)) {
    return window.alert("El DNI solo puede contener numeros.");
  }
  if (values.DNI.length < 7 || values.DNI.length > 8) {
    return window.alert("El DNI debe tener entre 7 y 8 digitos.");
  }
  if (!licenciaValida.test(values.licencia)) {
    return window.alert("La licencia solo puede contener letras y numeros (sin simbolos).");
  }

  const hoy = new Date();
  const vencimiento = new Date(values.fecha_vencimiento_licencia);
  if (isNaN(vencimiento)) {
    return window.alert("Fecha de vencimiento invalida.");
  } else if (vencimiento < hoy) {
    return window.alert("La licencia esta vencida.");
  }

  const response = await fetchAuth("http://localhost:3000/conductores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    if (response.status === 400) {
      return setErrores(data.errores);
    }
    return window.alert("Error al crear conductor");
  }

  navigate("/conductores");
};




  return (
    <article>
      <h2>Registrar conductor</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nombre
            <input
              required
              value={values.nombre}
              onChange={(e) => setValues({ ...values, nombre: e.target.value })}
            />
            {errores && (
              <small>
                {errores
                  .filter((er) => er.path === "nombre")
                  .map((er) => er.msg)
                  .join(", ")}
              </small>
            )}
          </label>

          <label>
            Apellido
            <input
              required
              value={values.apellido}
              onChange={(e) => setValues({ ...values, apellido: e.target.value })}
            />
            {errores && (
              <small>
                {errores
                  .filter((er) => er.path === "apellido")
                  .map((er) => er.msg)
                  .join(", ")}
              </small>
            )}
          </label>

          <label>
            DNI
            <input
              required
              value={values.DNI}
              onChange={(e) => setValues({ ...values, DNI: e.target.value })}
            />
            {errores && (
              <small>
                {errores
                  .filter((er) => er.path === "DNI" || er.path === "dni")
                  .map((er) => er.msg)
                  .join(", ")}
              </small>
            )}
          </label>

          <label>
            Licencia
            <input
              required
              value={values.licencia}
              onChange={(e) => setValues({ ...values, licencia: e.target.value })}
            />
            {errores && (
              <small>
                {errores
                  .filter((er) => er.path === "licencia")
                  .map((er) => er.msg)
                  .join(", ")}
              </small>
            )}
          </label>

          <label>
            Fecha vencimiento licencia
            <input
              required
              type="date"
              value={values.fecha_vencimiento_licencia}
              onChange={(e) =>
                setValues({ ...values, fecha_vencimiento_licencia: e.target.value })
              }
            />
            {errores && (
              <small>
                {errores
                  .filter((er) => er.path === "fecha_vencimiento_licencia")
                  .map((er) => er.msg)
                  .join(", ")}
              </small>
            )}
          </label>
        </fieldset>

        <input type="submit" value="Guardar" />
      </form>
    </article>
  );
};