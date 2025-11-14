import { useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router";

export function CrearUsuario() {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    nombre: "",
    apellido: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchAuth("http://localhost:8000/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return window.alert("Error al crear usuario");
    }

    navigate("/usuarios");
  };

  return (
    <article>
      <h2>Crear usuario</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nombre de usuario
            <input
              required
              value={values.username}
              onChange={(e) => setValues({ ...values, username: e.target.value })}
            />
          </label>
          <label>
            Nombre
            <input
              required
              value={values.nombre}
              onChange={(e) => setValues({ ...values, nombre: e.target.value })}
            />
          </label>
          <label>
            Apellido
            <input
              required
              value={values.apellido}
              onChange={(e) => setValues({ ...values, apellido: e.target.value })}
            />
          </label>
          <label>
            Contraseña
            <input
              required
              type="password"
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
            />
          </label>
        </fieldset>
        <input type="submit" value="Crear usuario" />
      </form>
    </article>
  );
}