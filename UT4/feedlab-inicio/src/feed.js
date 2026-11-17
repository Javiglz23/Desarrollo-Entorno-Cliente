// TODO sesión 2: funciones reutilizables y callbacks.

export function seleccionarPublicaciones(posts, predicado) {
  const resultado = [];
  for (let i = 0; i < posts.length; i++) {
    // 1. Evaluamos el predicado (devuelve true o false)
    if (predicado(posts[i], i)) {
      // 2. Solo si es true, guardamos el POST original en el nuevo array
      resultado.push(posts[i]);
    }
  }
  return resultado;
}

export function prepararTarjetas(posts, transformadora) {
  const resultado = [];
  for (let i = 0; i < posts.length; i++) {
    // 1. Transformamos cada post usando la callback
    const tarjetaTransformada = transformadora(posts[i], i);
    // 2. Guardamos el objeto transformado en el nuevo array
    resultado.push(tarjetaTransformada);
  }
  return resultado;
}


// TODO sesión 4: buscarPublicaciones(lista, texto, tema).
// TODO sesión 5: ordenarRecientes(lista) y ordenarPopulares(lista).
