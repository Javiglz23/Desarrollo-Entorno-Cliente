// Punto de entrada del proyecto. La interfaz inicial es estática y no hace peticiones.
import { API_BASE_URL } from "./config.js";

// TODO sesión 1: cargar y representar publicaciones (GET /posts) y temáticas (GET /topics). Contempla carga, vacío y error.
import { obtenerPublicaciones } from './api.js';
import { seleccionarPublicaciones, prepararTarjetas } from './feed.js';
import { puntuarPublicacion, crearPuntuador } from './recomendaciones.js';

const contenedorEstado = document.querySelector('#estado');
const contenedorPosts = document.querySelector('#posts-container');

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

function comprobarMotorRecomendaciones() {
  console.group('--- Comprobación del motor de recomendaciones ---');

  const postsMuestra = [
    { id: 1, author: 'Laura', topic: 'JavaScript', likes: 12, content: 'Closures en JS' },
    { id: 2, author: 'Mario', topic: 'Videojuegos', likes: 35, content: 'Análisis indie' },
    { id: 3, author: 'Sofía', topic: 'Diseño', likes: 8, content: 'Sistemas de color' }
  ];

  const snapshotOriginal = JSON.stringify(postsMuestra);

  // Perfiles independientes con closures
  const interesesAna = ['JavaScript'];
  const puntuarParaAna = crearPuntuador(interesesAna);
  const puntuarParaCarlos = crearPuntuador(['Videojuegos']);

  // Mutación externa para verificar aislamiento del closure
  interesesAna.push('Videojuegos');

  postsMuestra.forEach(post => {
    console.log(
      `Post #${post.id} [${post.topic}, ${post.likes} likes] -> Ana: ${puntuarParaAna(post)} pts | Carlos: ${puntuarParaCarlos(post)} pts`
    );
  });

  // Verificación de inmutabilidad
  console.log('¿Publicaciones originales intactas?:', JSON.stringify(postsMuestra) === snapshotOriginal);

  // Verificación de TypeError en entradas inválidas
  const casosInvalidos = [
    { desc: 'likes negativos', fn: () => puntuarPublicacion({ topic: 'JavaScript', likes: -1 }, ['JavaScript']) },
    { desc: 'publicación nula', fn: () => puntuarParaAna(null) },
    { desc: 'intereses no array', fn: () => crearPuntuador('JavaScript') }
  ];

  casosInvalidos.forEach(({ desc, fn }) => {
    try {
      fn();
      console.error(`FALLO: "${desc}" debería haber lanzado TypeError.`);
    } catch (error) {
      console.log(`OK (${desc}) -> Lanzó ${error.name}: ${error.message}`);
    }
  });

  console.groupEnd();
}

async function iniciar() {
  // 1. Estado de carga
  contenedorEstado.textContent = 'Cargando publicaciones…';

  try {
    const publicaciones = await obtenerPublicaciones();

    // 2. Filtrar con seleccionarPublicaciones
    const filtradas = seleccionarPublicaciones(publicaciones, post => post.likes >= 10);

    // Comprobación de inmutabilidad en consola
    console.log(`Inmutabilidad feed -> Original: ${publicaciones.length} | Filtradas: ${filtradas.length}`);

    // 3. Transformar datos con prepararTarjetas
    const tarjetasListas = prepararTarjetas(filtradas, post => ({
      autor: post.author,
      contenido: post.content,
      metadatos: `Tema: ${post.topic} · Likes: ${post.likes}`
    }));

    // 4. Estado vacío o renderizado
    if (tarjetasListas.length === 0) {
      contenedorEstado.textContent = 'No hay publicaciones disponibles.';
      contenedorPosts.replaceChildren();
      return;
    }

    contenedorEstado.textContent = '';
    renderizarTarjetas(tarjetasListas, contenedorPosts);
  } catch (error) {
    // 5. Estado de error
    contenedorEstado.textContent = `Error al cargar publicaciones: ${error.message}`;
  }
}

comprobarMotorRecomendaciones();
iniciar();

// TODO sesión 4: filtros de publicaciones y comparación entre filtrado en cliente y en API.
// TODO sesión 5: ordenación, paginación con servidor (limit/offset), botón «Mostrar más» y vista de detalle (GET /posts/{id}).
// TODO sesión 6: estadísticas con reduce sobre las publicaciones cargadas.
// TODO sesión 9: autenticación (registro/login/logout), restaurar likes (GET /users/me/likes) y crear publicaciones (POST /posts).
// TODO sesión 10: cálculo del feed personalizado «Para ti» en el cliente según intereses.
// TODO sesiones 11 y 12: separación en módulos/repositorio y pruebas finales.
