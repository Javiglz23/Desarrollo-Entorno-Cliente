// --- 1. CONFIGURACIÓN Y ESTADO ---
const parametros = new URLSearchParams(window.location.search);
const retoURL = parametros.get("reto") === "antidoto" ? "antidoto" : "luz";
const objetivoActual = retoURL === "antidoto" ? "Antidoto" : "Luz eterna";
const STORAGE_KEY = "laboratorio:v1:progreso";



const ingredientesIniciales = ["Agua", "Fuego", "Aire", "Tierra", "Planta", "Cristal"];

let estadoInicial = {
  version: 1,
  reto: retoURL,
  descubrimientos: [],
  intentos: 0,
  estado: "enCurso",
  descubiertoEn: null,
};

const guardado = localStorage.getItem(STORAGE_KEY);
if (guardado) {
  try {
    const datos = JSON.parse(guardado);
    if (datos.version === 1 && datos.reto === retoURL && Array.isArray(datos.descubrimientos)) {
      estadoInicial = datos;
    }
  } catch (e) {
    console.warn("No se pudo cargar el almacenamiento local:", e);
  }
}

const ids = new Set(ingredientesIniciales);
estadoInicial.descubrimientos.forEach(function (ingrediente) {
  ids.add(ingrediente);
});

const libroDeRecetas = {
  "Agua+Fuego": "Vapor",
  "Aire+Fuego": "Chispa",
  "Agua+Tierra": "Barro",
  "Agua+Planta": "Extracto",
  "Chispa+Cristal": "Prisma",
  "Nube luminosa+Cristal": "Luz eterna",
  "Prisma+Vapor": "Nube luminosa",
  "Barro+Extracto": "Ungüento",
  "Ungüento+Vapor": "Antidoto",
};

const selector1 = document.querySelector("#ingrediente1");
const selector2 = document.querySelector("#ingrediente2");
const botonCombinar = document.querySelector("#btn-combinar");
const botonReiniciar = document.querySelector("#btn-reiniciar");
const textoResultado = document.querySelector("#resultado-texto");
const contadorIntentos = document.querySelector("#intentos");
const cuaderno = document.querySelector("#cuaderno-contenido");
const objetivoValor = document.querySelector(".objective-box .value");
const pills = document.querySelectorAll(".pills-container .pill");

const botonRecetario = document.querySelector(".btn-outline");
const modalRecetario = document.querySelector("#modal-recetario");
const listaRecetas = document.querySelector("#lista-recetas");
const btnCerrarRecetario = document.querySelector("#btn-cerrar-recetario");

function comprobarCombinacion(elemento1, elemento2) {
  const clave = [elemento1, elemento2].sort().join("+");
  const nuevoElemento = libroDeRecetas[clave];

  estadoInicial.intentos++;

  if (!nuevoElemento) return "No hay combinación posible.";
  if (ids.has(nuevoElemento)) return "Ya habías descubierto esta combinación.";

  ids.add(nuevoElemento);
  estadoInicial.descubrimientos.push(nuevoElemento);

  if (nuevoElemento === objetivoActual) {
    estadoInicial.estado = "victoria";
    estadoInicial.descubiertoEn = new Date().toISOString();
  }

  return nuevoElemento;
}

function agregarOpcion(select, ingrediente) {
  const existe = Array.from(select.options).some(function (opcion) {
    return opcion.value === ingrediente;
  });
  if (!existe) {
    select.add(new Option(ingrediente, ingrediente));
  }
}

function mostrarDescubrimiento(ingrediente) {
  if (cuaderno.classList.contains("empty-state")) {
    cuaderno.classList.remove("empty-state");
    cuaderno.innerHTML = "";
  }
  const entrada = document.createElement("p");
  entrada.textContent = ingrediente;
  cuaderno.append(entrada);
}

function alternarBloqueo(bloqueado) {
  botonCombinar.disabled = selector1.disabled = selector2.disabled = bloqueado;
}

function guardarProgreso() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estadoInicial));
  } catch (e) {
    console.warn("No se pudo guardar el progreso:", e);
  }
}

function formatearFecha(isoString) {
  if (!isoString) return "";
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoString));
}

function abrirRecetario() {
  listaRecetas.innerHTML = "";
  let hayRecetas = false;

  const entradas = Object.entries(libroDeRecetas);
  entradas.forEach(function (entrada) {
    const pareja = entrada[0];
    const producto = entrada[1];

    if (ids.has(producto)) {
      hayRecetas = true;
      const p = document.createElement("p");
      p.innerHTML = `${pareja.replace("+", " + ")} = <strong>${producto}</strong>`;
      listaRecetas.appendChild(p);
    }
  });

  if (!hayRecetas) {
    listaRecetas.innerHTML = "<p>Aún no has descubierto ninguna receta.</p>";
  }

  modalRecetario.showModal();
}

botonCombinar.addEventListener("click", function () {
  if (estadoInicial.estado === "victoria") return;

  const elemento1 = selector1.value;
  const elemento2 = selector2.value;

  if (!elemento1 || !elemento2) {
    textoResultado.textContent = "Elige dos ingredientes antes de combinar.";
    return;
  }

  const resultado = comprobarCombinacion(elemento1, elemento2);
  contadorIntentos.textContent = estadoInicial.intentos;
  textoResultado.textContent = resultado;

  if (estadoInicial.descubrimientos.includes(resultado)) {
    agregarOpcion(selector1, resultado);
    agregarOpcion(selector2, resultado);
    mostrarDescubrimiento(resultado);
  }

  if (estadoInicial.estado === "victoria") {
    const fecha = formatearFecha(estadoInicial.descubiertoEn);
    textoResultado.textContent = `¡Has creado ${objetivoActual} y has ganado el juego! (${fecha})`;
    alternarBloqueo(true);
  }

  guardarProgreso();
});

botonReiniciar.addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.removeItem(STORAGE_KEY);

  estadoInicial.descubrimientos = [];
  estadoInicial.intentos = 0;
  estadoInicial.estado = "enCurso";
  estadoInicial.descubiertoEn = null;

  ids.clear();
  ingredientesIniciales.forEach(function (item) {
    ids.add(item);
  });

  alternarBloqueo(false);

  const selectores = [selector1, selector2];
  selectores.forEach(function (select) {
    const opciones = select.querySelectorAll("option");
    opciones.forEach(function (opt) {
      if (opt.value && !ingredientesIniciales.includes(opt.value)) {
        opt.remove();
      }
    });
    select.value = "";
  });

  contadorIntentos.textContent = "0";
  textoResultado.textContent = "Elige dos ingredientes disponibles.";
  cuaderno.classList.add("empty-state");
  cuaderno.innerHTML = "El cuaderno está vacío. Prueba una pareja en la mesa.";
});

if (pills.length >= 2) {
  pills[0].addEventListener("click", function () {
    window.location.search = "?reto=luz";
  });
  pills[1].addEventListener("click", function () {
    window.location.search = "?reto=antidoto";
  });
}

if (botonRecetario) {
  botonRecetario.addEventListener("click", abrirRecetario);
}

if (btnCerrarRecetario) {
  btnCerrarRecetario.addEventListener("click", function () {
    modalRecetario.close();
  });
}

if (objetivoValor) objetivoValor.textContent = objetivoActual;

if (pills.length >= 2) {
  pills[0].className = `pill ${retoURL === "luz" ? "active" : "inactive"}`;
  pills[1].className = `pill ${retoURL === "antidoto" ? "active" : "inactive"}`;
}

contadorIntentos.textContent = estadoInicial.intentos;

estadoInicial.descubrimientos.forEach(function (ing) {
  agregarOpcion(selector1, ing);
  agregarOpcion(selector2, ing);
  mostrarDescubrimiento(ing);
});

if (estadoInicial.estado === "victoria") {
  const fecha = formatearFecha(estadoInicial.descubiertoEn);
  textoResultado.textContent = `¡Has creado ${objetivoActual} y has ganado el juego! (${fecha})`;
  alternarBloqueo(true);
}