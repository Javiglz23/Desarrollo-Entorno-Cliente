// TODO sesión 2: funciones reutilizables y callbacks.
/**
 * Filtra un array de publicaciones según una función predicado sin mutar el original.
 * @param {Array} posts - Array de publicaciones de la API.
 * @param {Function} predicado - Callback (post) => boolean.
 * @returns {Array} Nuevo array con los elementos que cumplen la condición.
 */
export function seleccionarPublicaciones(posts, predicado) {
  if (!Array.isArray(posts) || typeof predicado !== 'function') {
    return [];
  }
  return posts.filter(predicado);
}

/**
 * Transforma cada publicación al formato requerido por la vista sin mutar el original.
 * @param {Array} posts - Array de publicaciones seleccionadas.
 * @param {Function} transformadora - Callback (post) => Object.
 * @returns {Array} Nuevo array con los objetos listos para renderizar.
 */
export function prepararTarjetas(posts, transformadora) {
  if (!Array.isArray(posts) || typeof transformadora !== 'function') {
    return [];
  }
  return posts.map(transformadora);
}
// TODO sesión 4: buscarPublicaciones(lista, texto, tema).
// TODO sesión 5: ordenarRecientes(lista) y ordenarPopulares(lista).
