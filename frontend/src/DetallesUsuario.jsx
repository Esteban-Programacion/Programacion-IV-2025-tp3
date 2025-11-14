import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./Auth";
import { useParams, Link } from "react-router";

export function DetallesUsuario() {
  const { fetchAuth } = useAuth();
  const { id } = useParams();

  const [usuario, setUsuario] = useState(null);

  const fetchUsuario = useCallback(async () => {
    const response = await fetchAuth(`http://localhost:8000/usuarios/${id}`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      console.log("Error al consultar usuario:", data.error);
      return;
    }

    setUsuario(data.usuario);
  }, [fetchAuth, id]);

  useEffect(() => {
    fetchUsuario();
  }, [fetchUsuario]);

  if (!usuario) return <p>Cargando usuario</p>;

  return (
    <article>
      <h2>Detalles del usuario</h2>
      <ul>
        <li><b>ID:</b> {usuario.id}</li>
        <li><b>Usuario:</b> {usuario.username}</li>
        <li><b>Nombre:</b> {usuario.nombre}</li>
        <li><b>Apellido:</b> {usuario.apellido}</li>
        <li><b>Activo:</b> {usuario.activo ? "Sí" : "No"}</li>
      </ul>
      <Link role="button" to={`/usuarios/${id}/modificar`}>
        Modificar usuario
      </Link>
    </article>
  );
}