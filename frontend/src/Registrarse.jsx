import { useState } from "react";

export const Registrarse = () => {
  const [open, setOpen] = useState(false);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const response = await fetch("http://localhost:3000/auth/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, contraseña }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || data.error || "Error al registrarse");
        return;
      }

      setMensaje("Resgistrado exitosamente.");
      setNombre("");
      setEmail("");
      setContraseña("");
    } catch (err) {
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>Registrarse</button>

      <dialog open={open}>
        <article>
          <h2>Crear cuenta</h2>

          <form onSubmit={handleSubmit}>
            <fieldset>
              <label htmlFor="nombre">Nombre:</label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />

              <label htmlFor="email">Correo electrónico:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor="password">Contraseña:</label>
              <input
                id="password"
                type="password"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
              />

              {error && <p style={{ color: "red" }}>{error}</p>}
              {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
            </fieldset>

            <footer>
              <div className="grid">
                <input
                  type="button"
                  className="secondary"
                  value="Cancelar"
                  onClick={() => {
                    setOpen(false);
                    setMensaje("");
                    setError("");
                  }}
                />
                <input type="submit" value="Registrarse" />
              </div>
            </footer>
          </form>
        </article>
      </dialog>
    </>
  );
};