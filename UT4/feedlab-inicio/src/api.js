import { API_BASE_URL } from "./config.js";
// TODO sesión 1: implementar obtenerPublicaciones con fetch, response.ok y response.json().

export async function obtenerPublicaciones() {
  const response = await fetch(`${API_BASE_URL}/posts`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: no se pudieron cargar las publicaciones`);
  }

  const data = await response.json();

  if (!Array.isArray(data.posts)) {
    throw new TypeError('La respuesta de la API no contiene el array posts esperado');
  }

  return data.posts;
}
// TODO sesión 9: implementar registro, login, perfil, preferencias y likes según Swagger.
