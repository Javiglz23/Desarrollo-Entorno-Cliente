// TODO sesión 6: calcularEstadisticas(lista) con reduce.

export function calcularEstadisticas(lista = []) {
  const estadoInicial = {
    totalLikes: 0,
    totalVistas: 0,
    mediaLikes: 0,
    porTematica: {}
  };

  // Acumulamos los totales y el conteo por temática
  const estadisticas = lista.reduce((acumulador, publicacion) => {
    acumulador.totalLikes += publicacion.likes || 0;
    acumulador.totalVistas += publicacion.views || 0;

    // Asegúrate de que la propiedad en tu objeto publicación sea 'topic' (o 'tema' según tu modelo de datos)
    const tema = publicacion.topic || 'Sin tema';
    acumulador.porTematica[tema] = (acumulador.porTematica[tema] || 0) + 1;

    return acumulador;
  }, estadoInicial);

  if (lista.length > 0) {
    estadisticas.mediaLikes = estadisticas.totalLikes / lista.length;
  }

  return estadisticas;
}