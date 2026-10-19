const estadoInicial = {
  descubrimientos: [],
  intentos: 0,
  reto: "luz",
  estado: "enCurso",
  descubiertoEn: null,
};
const parametros = new URLSearchParams(window.location.search);
const solicitado = parametros.get("luz"); //revisar esto de la url, si es luz o antidoto

const ingredientesIniciales = ["agua", "fuego", "aire", "tierra", "planta", "cristal"];
const ids = new Set(ingredientesIniciales);

const libroDeRecetas = {
  "agua+fuego": "vapor",
  "aire+fuego": "chispa",
  "agua+tierra": "barro",
  "agua+planta": "extracto",
  "chispa+cristal": "prisma",
  "prisma+vapor": "nube luminosa",
  "cristal+nube luminosa": "luz eterna",
  "barro+extracto": "ungüento",
  "ungüento+vapor": "antidoto",
};

const selector1 = document.querySelector("#ingrediente1");
const selector2 = document.querySelector("#ingrediente2");
const botonCombinar = document.querySelector("#btn-combinar");
const botonReiniciar = document.querySelector("#btn-reiniciar");
const textoResultado = document.querySelector("#resultado-texto");
const contadorIntentos = document.querySelector("#intentos");
const cuaderno = document.querySelector("#cuaderno-contenido");

function capitalizar(texto) {
  return texto.replace(/\b\w/g, (letra) => letra.toUpperCase());
}

function comprobarCombinacion(elemento1, elemento2, ids, estado) {
  const clave = [elemento1.toLowerCase(), elemento2.toLowerCase()].sort().join("+");
  const nuevoElemento = libroDeRecetas[clave];

  estado.intentos++;

  if (!nuevoElemento) return "No hay combinación posible.";
  if (ids.has(nuevoElemento)) return "Ya habías descubierto esta combinación.";

  ids.add(nuevoElemento);
  estado.descubrimientos.push(nuevoElemento);

  if (nuevoElemento === "luz eterna") {
    estado.estado = "victoria";
    estado.descubiertoEn = new Date().toISOString();
  }

  return nuevoElemento;
}

function agregarOpcion(select, ingrediente) {
  const yaExiste = Array.from(select.options).some(
    (opcion) => opcion.value.toLowerCase() === ingrediente
  );
  if (yaExiste) return;

  const opcion = document.createElement("option");
  opcion.value = ingrediente;
  opcion.textContent = capitalizar(ingrediente);
  select.append(opcion);
}

function mostrarDescubrimiento(ingrediente) {
  if (cuaderno.classList.contains("empty-state")) {
    cuaderno.classList.remove("empty-state");
    cuaderno.textContent = "";
  }

  const entrada = document.createElement("p");
  entrada.textContent = capitalizar(ingrediente);
  cuaderno.append(entrada);
}

function alternarBloqueoJuego(bloqueado) {
  botonCombinar.disabled = bloqueado;
  selector1.disabled = bloqueado;
  selector2.disabled = bloqueado;
}

botonCombinar.addEventListener("click", () => {
  if (estadoInicial.estado === "victoria") return;

  const elemento1 = selector1.value;
  const elemento2 = selector2.value;

  if (!elemento1 || !elemento2) {
    textoResultado.textContent = "Elige dos ingredientes antes de combinar.";
    return;
  }

  const resultado = comprobarCombinacion(elemento1, elemento2, ids, estadoInicial);
  contadorIntentos.textContent = estadoInicial.intentos;
  textoResultado.textContent = resultado;

  if (estadoInicial.descubrimientos.includes(resultado)) {
    agregarOpcion(selector1, resultado);
    agregarOpcion(selector2, resultado);
    mostrarDescubrimiento(resultado);
  }

  if (estadoInicial.estado === "victoria") {
    textoResultado.textContent = "¡Has creado la luz eterna y has ganado el juego!";
    alternarBloqueoJuego(true);
  }
});

botonReiniciar.addEventListener("click", (evento) => {
  evento.preventDefault();

  estadoInicial.descubrimientos = [];
  estadoInicial.intentos = 0;
  estadoInicial.estado = "enCurso";
  estadoInicial.descubiertoEn = null;

  ids.clear();
  ingredientesIniciales.forEach((ingrediente) => ids.add(ingrediente));

  alternarBloqueoJuego(false);

  for (const select of [selector1, selector2]) {
    Array.from(select.options).forEach((opcion) => {
      if (opcion.value && !ingredientesIniciales.includes(opcion.value.toLowerCase())) {
        opcion.remove();
      }
    });
    select.value = "";
  }

  contadorIntentos.textContent = "0";
  textoResultado.textContent = "Elige dos ingredientes disponibles.";
  cuaderno.classList.add("empty-state");
  cuaderno.textContent = "El cuaderno está vacío. Prueba una pareja en la mesa.";
});

//me queda guardar la fecha, el local storage, hacer que vaya por url, hacer la pagina de antidoto, el html? y su correspondiente js.