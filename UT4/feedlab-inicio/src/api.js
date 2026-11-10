import { API_BASE_URL } from "./config.js";
// Contrato: GET /posts devuelve { posts: Publicacion[] }.
// TODO sesión 1: implementar obtenerPublicaciones con fetch, response.ok y response.json().

export async function obtenerPublicaciones() {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: no se pudo cargar las publicaciones`);
    }
    const data = await response.json();
    renderizarPosts(data.posts);
  } catch (error) {
    mostrarError(error.message);
  }
  {
    throw new Error(`Pendiente: GET ${API_BASE_URL}/posts`);
  }
}
// TODO sesión 9: implementar registro, login, perfil, preferencias y likes según Swagger.
