// Punto de entrada del proyecto. La interfaz inicial es estática y no hace peticiones.
import { API_BASE_URL } from "./config.js";

// TODO sesión 1: cargar y representar publicaciones (GET /posts) y temáticas (GET /topics). Contempla carga, vacío y error.

async function consultarPublicaciones() {
  const url = `${API_BASE_URL}/posts`;

  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error(`Respuesta insatisfactoria del servidor: ${respuesta.status}`);
  }

  const datos = await respuesta.json();

  if (!Array.isArray(datos.posts)) {
    throw new TypeError('El contrato de la API no contiene el array posts esperado');
  }

  return datos.posts;
}

// Invocación y control de errores
consultarPublicaciones()
  .then(publicaciones => {
    console.log(`Se han recibido ${publicaciones.length} publicaciones:`, publicaciones);
  })
  .catch(err => {
    console.error('Error al cargar publicaciones:', err.message);
  });


  //aqui las obtengo asiq tengo q cambiar obtenerlas de la otra clase y hacer esto: 
  // Mientras se descargan los datos, muestra un mensaje de “Cargando publicaciones…”.
  //Si la petición falla, muestra el error en el contenedor de estado.  
  //Si se reciben publicaciones, genera las tarjetas con document.createElement y textContent.

  function renderizarTarjetas(publicaciones, contenedor) {
  // Generar las tarjetas en memoria
  const tarjetas = publicaciones.map(post => {
    const articulo = document.createElement('article');
    articulo.className = 'post-card';

    const autor = document.createElement('h3');
    // textContent garantiza proteccion contra inyeccion XSS
    autor.textContent = post.author;

    const contenido = document.createElement('p');
    contenido.textContent = post.content;

    const metadatos = document.createElement('footer');
    metadatos.textContent = `Tema: ${post.topic} · Likes: ${post.likes}`;

    articulo.append(autor, contenido, metadatos);
    return articulo;
  });

  // Reemplazar el contenido previo limpiamente
  contenedor.replaceChildren(...tarjetas);
}




// TODO sesión 4: filtros de publicaciones y comparación entre filtrado en cliente y en API.
// TODO sesión 5: ordenación, paginación con servidor (limit/offset), botón «Mostrar más» y vista de detalle (GET /posts/{id}).
// TODO sesión 6: estadísticas con reduce sobre las publicaciones cargadas.
// TODO sesión 9: autenticación (registro/login/logout), restaurar likes (GET /users/me/likes) y crear publicaciones (POST /posts).
// TODO sesión 10: cálculo del feed personalizado «Para ti» en el cliente según intereses.
// TODO sesiones 11 y 12: separación en módulos/repositorio y pruebas finales.
