const ids = new Set(["r1", "r2", "r3"]);
const parametros = new URLSearchParams(window.location.search);
const solicitado = parametros.get("registro");
let registroActual = ids.has(solicitado) ? solicitado : "r1";

function seleccionarRegistro(id) {
  if (!ids.has(id)) return;
  registroActual = id;
  const url = new URL(window.location.href);
  url.searchParams.set("registro", id);
  window.history.pushState({ registro: id }, "", url);
  mostrarRegistro(id);
}

window.addEventListener("popstate", () => {
  const id = new URLSearchParams(window.location.search).get("registro");
  registroActual = ids.has(id) ? id : "r1";
  mostrarRegistro(registroActual);
});

function mostrarRegistro(id) {
  const registros = document.querySelectorAll(".registro");
  registros.forEach((registro) => {
    registro.style.display = registro.id === id ? "block" : "none";
  });
}
//comprobar si el registro actual es válido y mostrarlo ns ejecutarlo
mostrarRegistro(registroActual);