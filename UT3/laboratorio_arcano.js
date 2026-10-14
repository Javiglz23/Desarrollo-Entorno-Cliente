const estadoInicial = {
  version: 1,
  reto: "luz",
  descubrimientos: [],
  intentos: 0,
  estado: "enCurso", 
  descubiertoEn: null,
};

const ids = new Set(["Agua", "Fuego", "Aire", "Tierra", "Planta","Cristal"]);
const parametros = new URLSearchParams(window.location.search);
const solicitado = parametros.get("ingredientes");

const combinaciones = JSON.stringify({ 
  "agua+fuego": ["vapor"], 
  "aire+fuego": ["chispa"], 
  "tierra+agua": ["barro"], 
  "planta+agua": ["extracto"], 
  "chispa+cristal": ["prisma"], 
  "vapor+prisma": ["nube luminosa"], 
  "nube luminosa+cristal": ["luz eterna"], 
  "extracto+barro": ["ungüento"], 
  "ungüento+vapor": ["antidoto"] 
});



let libroDeRecetas;
try {
  libroDeRecetas = JSON.parse(combinaciones);
} catch (error) {
  console.error("Error al leer el JSON:", error.message);
}

function comprobarCombinacion(elemento1, elemento2, ids) {
  const e1 = elemento1.toLowerCase();
  const e2 = elemento2.toLowerCase();

  const intento1 = e1 + "+" + e2; 
  const intento2 = e2 + "+" + e1; 

  const recetaEncontrada = libroDeRecetas[intento1] || libroDeRecetas[intento2];

  if (!recetaEncontrada) {
    return "No hay combinacion posible";
  }

  const nuevoElemento = recetaEncontrada[0]; 

  if (ids.has(nuevoElemento)) {
    return "Combinación ya creada";
  } 

  ids.add(nuevoElemento);
  return nuevoElemento;
}

//tengo que hacer las listas, que combine, la condicion de victoria, local storage, y el boton de reiniciar y cuando cambia de objetivo