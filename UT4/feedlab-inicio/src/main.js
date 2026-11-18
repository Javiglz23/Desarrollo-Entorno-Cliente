// Punto de entrada del proyecto. La interfaz inicial es estática y no hace peticiones.
import { API_BASE_URL } from "./config.js";

// TODO sesión 1: cargar y representar publicaciones (GET /posts) y temáticas (GET /topics). Contempla carga, vacío y error.
import { obtenerPublicaciones } from './api.js';
import { seleccionarPublicaciones, prepararTarjetas } from './feed.js';



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
contenedorEstado.textContent = 'Cargando publicaciones…';

//tengo q entender la sesion 2 y ver si está correcta, añadir sesion 3,añadir sesion 4,añadir sesion 5

// 2. Llamamos a obtenerPublicaciones() (que es la que tiene .then y .catch)
obtenerPublicaciones()
  .then(publicaciones => {
    // Filtramos usando tu función de feed.js
    const filtradas = seleccionarPublicaciones(publicaciones, post => post.likes >= 10);

    // Comprobación de inmutabilidad en consola
    console.log(`Originales: ${publicaciones.length} | Filtradas: ${filtradas.length}`);

    // Transformamos los datos con tu segunda función de feed.js
    const tarjetasPreparadas = prepararTarjetas(filtradas, post => ({
      autor: post.author,
      contenido: post.content,
      metadatos: `Tema: ${post.topic} · ${post.likes} likes`
    }));

    // Pintamos en el DOM
    if (tarjetasPreparadas.length === 0) {
      contenedorEstado.textContent = 'No hay publicaciones disponibles.';
      contenedorPosts.replaceChildren();
    } else {
      contenedorEstado.textContent = '';
      renderizarTarjetas(tarjetasPreparadas, contenedorPosts);
    }
  })
  .catch(err => {
    contenedorEstado.textContent = `Error al cargar publicaciones: ${err.message}`;
  });


// TODO sesión 4: filtros de publicaciones y comparación entre filtrado en cliente y en API.
// TODO sesión 5: ordenación, paginación con servidor (limit/offset), botón «Mostrar más» y vista de detalle (GET /posts/{id}).
// TODO sesión 6: estadísticas con reduce sobre las publicaciones cargadas.
// TODO sesión 9: autenticación (registro/login/logout), restaurar likes (GET /users/me/likes) y crear publicaciones (POST /posts).
// TODO sesión 10: cálculo del feed personalizado «Para ti» en el cliente según intereses.
// TODO sesiones 11 y 12: separación en módulos/repositorio y pruebas finales.
