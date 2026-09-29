# Actividad UT1: Mejora progresiva (Búsqueda de localidades)

## 1. Las tres capas

### HTML (Estructura semántica)
He usado la misma base de los apuntes añadiendo `action` y `method="get"` al formulario para que se pueda enviar al servidor aunque no funcione el JavaScript. La sección de resultados está conectada con su título usando `aria-labelledby`.

```html
<section aria-labelledby="titulo-localidades">
  <h2 id="titulo-localidades">Buscador de localidades</h2>

  <form id="form-localidades" action="/buscar" method="get">
    <label for="nombre-localidad">Localidad</label>
    <input id="nombre-localidad" name="localidad" type="search" required />
    <button type="submit">Buscar</button>
  </form>

  <p id="estado" role="status" aria-live="polite"></p>

  <ul id="lista-localidades" class="cuadricula"></ul>
</section>

<script type="module" src="/js/localidades.js"></script>
```

### CSS (Diseño adaptable sin cambiar el orden)
Uso una clase `.cuadricula` para separar el diseño del JavaScript. Por defecto en pantallas grandes muestra varias columnas con Grid, y en pantallas estrechas pasa a una sola columna sin tocar el orden del HTML (así el tabulador sigue funcionando en orden lógico).

```css
.cuadricula {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  list-style: none;
  padding: 0;
}

.cuadricula li {
  border: 1px solid #ccc;
  padding: 10px;
}
```

### JavaScript (Comportamiento y estados)
El script busca los elementos por su `id`, evita que el formulario recargue la página con `preventDefault()` y actualiza el DOM usando `textContent` para evitar problemas de XSS.

```javascript
const formulario = document.querySelector('#form-localidades');
const lista = document.querySelector('#lista-localidades');
const estado = document.querySelector('#estado');

if (formulario && lista && estado) {
  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const datos = new FormData(formulario);
    const texto = String(datos.get('localidad') ?? '').trim();
    if (!texto) return;

    // Estado de carga
    estado.textContent = 'Buscando localidades...';
    lista.textContent = '';

    try {
      const respuesta = await fetch(`/buscar?localidad=${encodeURIComponent(texto)}`);
      if (!respuesta.ok) {
        throw new Error('Fallo en el servidor');
      }

      const resultados = await respuesta.json();

      // Estado vacío (0 resultados)
      if (resultados.length === 0) {
        estado.textContent = `No se han encontrado localidades para "${texto}".`;
        return;
      }

      // Si hay resultados, los añadimos a la lista
      for (const item of resultados) {
        const elemento = document.createElement('li');
        elemento.textContent = item;
        lista.append(elemento);
      }

      estado.textContent = `Se han encontrado ${resultados.length} localidades.`;

    } catch (error) {
      // Estado de error
      estado.textContent = 'Error al conectar con el servidor. Inténtalo más tarde.';
    }
  });
}
```

---

## 2. Análisis de los casos y estados

### Comportamiento esperado con JavaScript
Cuando el usuario escribe una localidad y pulsa "Buscar", el script intercepta el envío para no recargar la página. Primero limpia la lista y avisa en el párrafo `#estado` de que está buscando. Cuando llegan los datos del servidor, crea los `<li>` con `createElement` y mete el texto con `textContent`. Al tener `role="status"` y `aria-live="polite"`, los lectores de pantalla leen el cambio sin quitarle el foco al usuario.

### Alternativa sin JavaScript (¿Qué pasa si JS no carga?)
Si el archivo `localidades.js` no carga o da error, la web sigue funcionando porque el `<form>` tiene los atributos `action="/buscar"` y `method="get"`, y el input tiene `required`. El navegador hace la validación básica y envía la petición normal recargando la página (`/buscar?localidad=...`), por lo que el servidor puede devolver el HTML con los resultados directamente.

### Estados de la interfaz
* **Estado de carga (si la red tarda):** Justo antes del `fetch`, vaciamos la lista anterior para no confundir al usuario y cambiamos `#estado` a `"Buscando localidades..."`. Así la persona sabe que su clic ha funcionado aunque el internet vaya lento.
* **Estado vacío (si devuelve 0 resultados):** Comprobamos `resultados.length === 0`. En vez de dejar la pantalla en blanco sin decir nada, mostramos en `#estado` el mensaje `"No se han encontrado localidades para..."`.
* **Estado de error (si falla la red o el servidor):** Si se corta la conexión o el servidor devuelve error, salta el `catch` y mostramos `"Error al conectar con el servidor. Inténtalo más tarde."`, quitando el mensaje de carga para que no se quede pillado en "Buscando...".