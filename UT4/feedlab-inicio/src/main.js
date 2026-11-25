// Punto de entrada del proyecto. La interfaz inicial es estática y no hace peticiones.
import { API_BASE_URL } from "./config.js";

// TODO sesión 1: cargar y representar publicaciones (GET /posts) y temáticas (GET /topics). Contempla carga, vacío y error.
import { obtenerPublicaciones } from './api.js';
import { seleccionarPublicaciones, prepararTarjetas, buscarPublicaciones, ordenarPorRecientes, ordenarPorPopulares } from './feed.js';
import { puntuarPublicacion, crearPuntudador } from './recomendaciones.js';
import { calcularEstadisticas } from './estadisticas.js';
import { actualizarPublicacionEnLista, alternarLikeLocal } from './estado.js';

const contenedorEstado = document.getElementById('feed-status');
const contenedorPosts = document.getElementById('posts');
let publicaciones = [];

function renderizarTarjetas(tarjetasPreparadas, contenedor) {
  const nodos = tarjetasPreparadas.map(tarjeta => {
    const articulo = document.createElement('article');
    articulo.className = 'post-card';
    articulo.dataset.id = tarjeta.id;

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

//tengo q entender la sesion 2 y ver si está correcta,añadir sesion 4,añadir sesion 5

// 2. Llamamos a obtenerPublicaciones() (que es la que tiene .then y .catch)
obtenerPublicaciones()
  .then(datos => {
    publicaciones = Array.isArray(datos) ? datos : datos.posts;

    // Filtramos usando tu función de feed.js
    const filtradas = seleccionarPublicaciones(publicaciones, post => post.likes >= 10);

    // Comprobación de inmutabilidad en consola
    console.log(`Originales: ${publicaciones.length} | Filtradas: ${filtradas.length}`);

    // Transformamos los datos con tu segunda función de feed.js
    const tarjetasPreparadas = prepararTarjetas(filtradas, post => ({
      id: post.id,
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

    // Actualizamos estadísticas de la sesión 6 con las publicaciones visibles
    actualizarEstadisticas(filtradas);

    // TODO sesión 7: prueba de inmutabilidad de estado
    if (publicaciones.length > 0) {
      const listaNueva = alternarLikeLocal(publicaciones, publicaciones[0].id);
      console.assert(publicaciones !== listaNueva, 'Error: el estado se mutó');
    }
  })
  .catch(err => {
    contenedorEstado.textContent = `Error al cargar publicaciones: ${err.message}`;
    actualizarEstadisticas([]);
  });


// TODO sesión 4: filtros de publicaciones y comparación entre filtrado en cliente y en API.

document.addEventListener('DOMContentLoaded', () => {
  const inputTexto = document.getElementById('filtro-texto');
  const selectTema = document.getElementById('filtro-tema');

  inputTexto?.addEventListener('input', () => {
    const texto = inputTexto.value;
    const tema = selectTema.value || null;
    const filtradas = buscarPublicaciones(publicaciones, texto, tema);
    renderizarTarjetas(filtradas, contenedorPosts);
    actualizarEstadisticas(filtradas);
  });

  selectTema?.addEventListener('change', () => {
    const texto = inputTexto.value;
    const tema = selectTema.value || null;
    const filtradas = buscarPublicaciones(publicaciones, texto, tema);
    renderizarTarjetas(filtradas, contenedorPosts);
    actualizarEstadisticas(filtradas);
  });
});


// TODO sesión 5: ordenación, paginación con servidor (limit/offset), botón «Mostrar más» y vista de detalle (GET /posts/{id}).
let offset = 0;
const limit = 12;

const btnMostrarMas = document.getElementById('show-more');
const selectOrden = document.getElementById('order');
const inputSearch = document.getElementById('search');
const selectTopic = document.getElementById('topic');
const dialog = document.getElementById('post-dialog');

async function cargarPagina(reiniciar = false) {
  if (reiniciar) {
    offset = 0;
    publicaciones = [];
  }

  const respuesta = await obtenerPublicaciones({
    limit,
    offset,
    topic: selectTopic.value || undefined,
    search: inputSearch.value || undefined,
    sort: selectOrden.value || undefined
  });

  const nuevosPosts = Array.isArray(respuesta) ? respuesta : respuesta.posts;
  publicaciones = [...publicaciones, ...nuevosPosts];

  const tarjetasPreparadas = prepararTarjetas(publicaciones, post => ({
    id: post.id,
    autor: post.author,
    contenido: post.content,
    metadatos: `Tema: ${post.topic} · ${post.likes} likes`
  }));

  renderizarTarjetas(tarjetasPreparadas, contenedorPosts);
  actualizarEstadisticas(publicaciones);
  btnMostrarMas.style.display = respuesta.hasMore ? 'block' : 'none';
}

btnMostrarMas.addEventListener('click', () => {
  offset += limit;
  cargarPagina(false);
});

inputSearch.addEventListener('input', () => cargarPagina(true));
selectTopic.addEventListener('change', () => cargarPagina(true));
selectOrden.addEventListener('change', () => cargarPagina(true));

contenedorPosts.addEventListener('click', async e => {
  const tarjeta = e.target.closest('.post-card');
  if (!tarjeta || !tarjeta.dataset.id) return;

  const res = await fetch(`${API_BASE_URL}/posts/${tarjeta.dataset.id}`);
  const data = await res.json();
  const post = data.post ?? data;

  document.getElementById('dialog-author').textContent = post.author;
  document.getElementById('dialog-body').textContent = post.content;
  document.getElementById('dialog-topic').textContent = post.topic;
  document.getElementById('dialog-meta').textContent = `${new Date(post.publishedAt).toLocaleDateString()} · ${post.likes} likes`;

  dialog.showModal();
});

document.getElementById('dialog-close-btn').addEventListener('click', () => dialog.close());


// TODO sesión 6: estadísticas con reduce sobre las publicaciones cargadas.
function actualizarEstadisticas(publicacionesVisibles) {
  const estadisticas = calcularEstadisticas(publicacionesVisibles);

  const elTotalPosts = document.getElementById('stat-total-posts');
  const elTotalLikes = document.getElementById('stat-total-likes');
  const elAvgLikes = document.getElementById('stat-avg-likes');
  const elListaTemas = document.getElementById('stat-topics');

  if (elTotalPosts) elTotalPosts.textContent = publicacionesVisibles.length;
  if (elTotalLikes) elTotalLikes.textContent = estadisticas.totalLikes;
  if (elAvgLikes) elAvgLikes.textContent = estadisticas.mediaLikes.toFixed(1);

  if (elListaTemas) {
    const temas = Object.entries(estadisticas.porTematica);

    if (temas.length === 0) {
      elListaTemas.innerHTML = '<li>Sin publicaciones</li>';
    } else {
      const nodosTemas = temas.map(([tema, cantidad]) => {
        const li = document.createElement('li');
        li.textContent = `${tema}: ${cantidad}`;
        return li;
      });
      elListaTemas.replaceChildren(...nodosTemas);
    }
  }
}
// TODO sesión 9: autenticación (registro/login/logout), restaurar likes (GET /users/me/likes) y crear publicaciones (POST /posts).
// TODO sesión 10: cálculo del feed personalizado «Para ti» en el cliente según intereses.
// TODO sesiones 11 y 12: separación en módulos/repositorio y pruebas finales.
