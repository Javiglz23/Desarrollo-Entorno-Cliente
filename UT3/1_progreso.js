const CLAVE = "registros-ut3:v1:progreso";
const IDS = new Set(["r1", "r2", "r3"]);
function crearProgresoInicial() {
  return { version: 1, vistos: [], registroActual: null };
}

function esProgreso(valor) {
  return valor !== null
    && typeof valor === "object"
    && valor.version === 1
    && Array.isArray(valor.vistos)
    && valor.vistos.every((id) => IDS.has(id))
    && new Set(valor.vistos).size === valor.vistos.length
    && (valor.registroActual === null || IDS.has(valor.registroActual))
    && (valor.registroActual === null || valor.vistos.includes(valor.registroActual));
}

function cargarProgreso(almacen) {
  try {
    const destino = almacen ?? window.localStorage;
    const texto = destino.getItem(CLAVE);
    if (texto === null) return crearProgresoInicial();
    const valor = JSON.parse(texto);
    if (!esProgreso(valor)) throw new TypeError("Progreso inválido");
    return valor;
  } catch (error) {
    console.warn("No se pudo recuperar el progreso", error);
    return crearProgresoInicial();
  }
}

function guardarProgreso(progreso, almacen) {
  try {
    if (!esProgreso(progreso)) throw new TypeError("Progreso inválido");
    const destino = almacen ?? window.localStorage;
    destino.setItem(CLAVE, JSON.stringify(progreso));
    return true;
  } catch (error) {
    console.warn("La partida continuará sin guardado", error);
    return false;
  }
}
esProgreso(crearProgresoInicial());