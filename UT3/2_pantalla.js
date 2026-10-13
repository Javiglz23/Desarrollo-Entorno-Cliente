const estado = document.querySelector("#estado");
const revelar = document.querySelector("#revelar");
const registros = document.querySelector("#registros");

if (!(estado instanceof HTMLParagraphElement)
    || !(revelar instanceof HTMLButtonElement)
    || !(registros instanceof HTMLUListElement)) {
  throw new Error("Falta un elemento de la pantalla de registros");
}

let revelado = false;
revelar.addEventListener("click", () => {
  if (revelado) return;
  revelado = true;
  estado.textContent = "Registro r1 revelado";
  estado.classList.add("activo");

  const entrada = document.createElement("li");
  entrada.textContent = 'Puerta abierta: <img src=istockphoto-1147541871-612x612.jpg alt="Puerta abierta" width="100">';
  registros.append(entrada);
});
