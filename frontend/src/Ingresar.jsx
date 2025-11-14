import { useState } from "react";
import { useAuth } from "./Auth";

export const Ingresar = () => {
  const { error, login } = useAuth();

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, contraseña);
    if (result.success) {
      setOpen(false);
      setEmail("");
      setContraseña("");
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>Ingresar</button>

      <dialog open={open}>
        <article>
          <h2>Iniciar sesión</h2>
          <form onSubmit={handleSubmit}>
            <fieldset>
              <label htmlFor="login-email">Correo electrónico:</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor="login-password">Contraseña:</label>
              <input
                id="login-password"
                type="password"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
              />

              {error && <p style={{ color: "red" }}>{error}</p>}
            </fieldset>

            <footer>
              <div className="grid">
                <input
                  type="button"
                  className="secondary"
                  value="Cancelar"
                  onClick={() => setOpen(false)}
                />
                <input type="submit" value="Ingresar" />
              </div>
            </footer>
          </form>
        </article>
      </dialog>
    </>
  );
};
