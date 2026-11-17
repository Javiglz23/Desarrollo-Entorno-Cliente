// Punto de entrada del proyecto. La interfaz inicial es estática y no hace peticiones.
import { API_BASE_URL } from "./config.js";

// TODO sesión 1: cargar y representar publicaciones (GET /posts) y temáticas (GET /topics). Contempla carga, vacío y error.
import { obtenerPublicaciones } from './api.js';



function renderizarTarjetas(tarjetasPreparadas, contenedor) {
  const nodos = tarjetasPreparadas.map(tarjeta => {
    const articulo = document.createElement('article');
    articulo.className = 'post-card';

    const autor = document.createElement('h3');
    autor.textContent = tarjeta.autor;

    const contenido = document.createElement('p');
    contenido.textContent = tarjeta.contenido;

    const metadatos = document.createElement('footer');
    metadatos.textContent = tarjeta.metadatos;

    articulo.append(autor, contenido, metadatos);
    return articulo;
  });

  contenedor.replaceChildren(...nodos);
}



// TODO sesión 4: filtros de publicaciones y comparación entre filtrado en cliente y en API.
// TODO sesión 5: ordenación, paginación con servidor (limit/offset), botón «Mostrar más» y vista de detalle (GET /posts/{id}).
// TODO sesión 6: estadísticas con reduce sobre las publicaciones cargadas.
// TODO sesión 9: autenticación (registro/login/logout), restaurar likes (GET /users/me/likes) y crear publicaciones (POST /posts).
// TODO sesión 10: cálculo del feed personalizado «Para ti» en el cliente según intereses.
// TODO sesiones 11 y 12: separación en módulos/repositorio y pruebas finales.
