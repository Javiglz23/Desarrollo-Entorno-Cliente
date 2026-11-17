// Regla única de la unidad: 10 puntos por tema de interés + min(likes, 20).
// TODO sesión 3: crear una función pura de puntuación.
/**
 * Calcula la puntuación de relevancia de una publicación para unos intereses dados.
 * Función pura: valida entradas, no muta argumentos y devuelve un entero.
 *
 * @param {Object} publicacion - Objeto con al menos { topic, likes }.
 * @param {string[]} intereses - Array de temáticas de interés del usuario.
 * @returns {number} Puntuación entera calculada.
 */
export function puntuarPublicacion(publicacion, intereses) {
  if (typeof publicacion !== 'object' || publicacion === null || Array.isArray(publicacion)) {
    throw new TypeError('El parámetro "publicacion" debe ser un objeto válido.');
  }

  if (!Number.isInteger(publicacion.likes) || publicacion.likes < 0) {
    throw new TypeError('La propiedad "publicacion.likes" debe ser un número entero mayor o igual a 0.');
  }

  if (!Array.isArray(intereses)) {
    throw new TypeError('El parámetro "intereses" debe ser un array.');
  }

  const puntosTema = intereses.includes(publicacion.topic) ? 25 : 0;
  const puntosLikes = Math.min(publicacion.likes, 20);

  return puntosTema + puntosLikes;
}

/**
 * Función de orden superior que genera un puntuador personalizado mediante closure.
 *
 * @param {string[]} intereses - Array de temáticas de interés del usuario.
 * @returns {function(Object): number} Función que puntúa una publicación.
 */
export function crearPuntuador(intereses) {
  if (!Array.isArray(intereses)) {
    throw new TypeError('El parámetro "intereses" debe ser un array.');
  }

  // Copia defensiva para evitar mutaciones externas sobre el entorno del closure
  const interesesUsuario = [...intereses];

  return publicacion => puntuarPublicacion(publicacion, interesesUsuario);
}
// TODO sesión 10: recuperar páginas del catálogo para evaluar todo el conjunto y ordenarParaTi(lista, intereses) con desempate por id.
