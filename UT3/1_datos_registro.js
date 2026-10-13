const registros = [
  { id: "r1", zona: "entrada", texto: "La puerta se abrió a las 09:10.", fecha: "2026-10-07T09:10:00+02:00" },
  { id: "r2", zona: "entrada", texto: "El lector registró una tarjeta.", fecha: "2026-10-07T09:11:00+02:00" },
  { id: "r3", zona: "almacén", texto: "Falta una caja del inventario.", fecha: "2026-10-07T09:15:00+02:00" },
  { id: "r4", zona: "oficina", texto: "Se imprimió una lista de salida.", fecha: "2026-10-07T09:18:00+02:00" },
  { id: "r4", zona: "oficina", texto: "Registro duplicado para la prueba.", fecha: "2026-10-07T09:18:00+02:00" },
];
const zonas = new Set(registros.map(({ zona }) => zona));
const porZona = new Map();

for (const registro of registros) {
  if (!porZona.has(registro.zona)) porZona.set(registro.zona, []);
  porZona.get(registro.zona).push(registro);
}

//incompleto