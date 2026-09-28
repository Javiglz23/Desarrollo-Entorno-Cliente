# Actividad UT1: Fallo en tres capas (`ut1-herramientas-y-pruebas.md`)

## Orden de investigación propuesto

Para no cambiar código al azar, sigo el orden del flujo de ejecución desde que se carga la página hasta que el usuario interactúa:

1. **Primero el enganche en el DOM:** Si el selector no encuentra el botón o no hay listener, ni siquiera se hará la petición al hacer clic.
2. **Segundo la petición de red:** Si el botón funciona, compruebo si la petición llega al servidor o da un error 404.
3. **Tercero el formato de la respuesta:** Aunque el servidor responda `200 OK`, verifico que devuelva JSON real y no una página HTML.
4. **Cuarto el pintado de los datos:** Si el JSON es válido, reviso si el código falla al leer una propiedad que no viene en los datos.
5. **Quinto la operabilidad y accesibilidad:** Una vez que carga y pinta bien los datos con el ratón, compruebo por qué falla al usarlo con el teclado.

---

## Protocolo de diagnóstico paso a paso

### Hipótesis 1: El selector no encuentra el botón
* **Panel:** `Elements` (pestaña *Event Listeners*) y `Console`.
* **Señal esperada:** Al hacer clic en "Cargar" no sale ningún error nuevo ni se registra ninguna petición en `Network`. Si el código no tenía un `if (boton)` antes del `addEventListener`, en `Console` aparecerá al cargar la página: `Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')`. Esto la distingue de un fallo de red porque la petición ni siquiera llega a salir del navegador.
* **Prueba de confirmación:** Abro `Console` y ejecuto manualmente el mismo `document.querySelector(...)` que tiene el archivo JS, o inspecciono el botón en `Elements` y miro la subpestaña *Event Listeners* para ver si tiene el evento `click` asociado.
* **Resultado:** `document.querySelector` devuelve `null` (o la lista de *Event Listeners* del botón está vacía).
* **Conclusión:** Falla el contrato entre HTML y JS (el `id` o `data-action` está mal escrito, o el script se cargó en el `<head>` sin `type="module"` / `defer` antes de que existiera el botón). Se corrige igualando el selector con el HTML y asegurando la carga correcta del módulo.

---

### Hipótesis 2: El servidor devuelve 404
* **Panel:** `Network` (filtrando por *Fetch/XHR*).
* **Señal esperada:** Al pulsar el botón sí aparece una línea nueva en `Network` (lo que descarta la hipótesis 1), pero la columna *Status* marca `404 Not Found` en rojo.
* **Prueba de confirmación:** Hago clic en la petición fallida dentro de `Network` y reviso la pestaña *Headers* para ver la *Request URL* exacta que está pidiendo el script y compararla con la ruta real del servidor local.
* **Resultado:** La URL solicitada apunta a una ruta que no existe (por ejemplo, `/api/dato` en vez de `/api/datos`, o se abrió el archivo con `file://` en lugar de usar un servidor local HTTP).
* **Conclusión:** El evento funciona pero falla la capa de red/rutas. Se corrige arreglando la URL en el `fetch` o levantando correctamente el servidor local.

---

### Hipótesis 3: La respuesta es HTML aunque el programa espera JSON
* **Panel:** `Network` (pestañas *Headers* y *Response*) y `Console`.
* **Señal esperada:** En `Network` la petición sale con estado `200 OK` (lo que descarta el 404), pero en `Console` salta el error `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON` al ejecutarse `respuesta.json()`.
* **Prueba de confirmación:** En `Network`, selecciono la petición y miro la cabecera `Content-Type` en *Response Headers* y el contenido real en la pestaña *Response*.
* **Resultado:** El `Content-Type` es `text/html` en vez de `application/json`, y en *Response* se ve el código HTML de la página principal o de una plantilla por defecto del servidor.
* **Conclusión:** El servidor ha respondido con éxito a nivel HTTP, pero ha roto el contrato de datos devolviendo HTML en vez de JSON. Se corrige configurando el endpoint o enviando la cabecera `Accept: application/json` correcta.

---

### Hipótesis 4: Una excepción ocurre al representar un campo ausente
* **Panel:** `Sources` (usando un *breakpoint*) y `Console`.
* **Señal esperada:** En `Network` la petición da `200 OK`, el `Content-Type` es `application/json` y el JSON es válido (descarta las hipótesis 2 y 3), pero la lista se queda a medias o vacía y en `Console` aparece un `TypeError` (por ejemplo, `Cannot read properties of undefined (reading 'nombre')`) apuntando a la línea donde se crean los elementos del DOM.
* **Prueba de confirmación:** Voy al panel `Sources`, pongo un *breakpoint* justo dentro del bucle que recorre los datos recibidos, pulso "Cargar" y miro en la sección *Scope* qué propiedades tiene exactamente el objeto que llega del servidor.
* **Resultado:** Al detener la ejecución, veo en *Scope* que uno de los objetos del array no trae el campo esperado (viene como `undefined` o con otro nombre distinto).
* **Conclusión:** La red y el JSON funcionan, pero falla la lógica de pintado en cliente por asumir que todos los campos existen siempre. Se corrige comprobando el dato antes de pintarlo o poniendo un valor por defecto (por ejemplo, `item.nombre ?? 'Sin nombre'`).

---

### Hipótesis 5: El botón funciona con ratón, pero no puede operarse con teclado
* **Panel:** `Elements` (inspección del nodo y subpestaña *Accessibility*) + prueba manual con teclado (`Tab`, `Enter` y `Espacio`).
* **Señal esperada:** Con el clic del ratón todo el flujo anterior funciona y los datos se muestran en pantalla sin errores en `Console` ni en `Network`, pero al intentar llegar al botón con la tecla `Tab` nunca recibe el foco, o al pulsar `Enter` / `Espacio` no se dispara la acción.
* **Prueba de confirmación:** Inspecciono el botón en `Elements` para ver qué etiqueta HTML se ha usado realmente en el DOM.
* **Resultado:** Veo que en lugar de un `<button type="button">`, se ha maquetado un `<div class="boton">Cargar</div>` o un `<span>` (o un enlace `<a>` sin atributo `href`), que por defecto no son enfocables ni activables con teclado.
* **Conclusión:** La lógica de JavaScript y la red están bien, pero falla la capa de HTML semántico y accesibilidad por sustituir un control nativo sin necesidad. Se corrige cambiando el `<div>` o `<span>` por una etiqueta `<button type="button">` nativa, que ya incluye el foco y la activación por teclado de serie.

---

## Tabla resumen de evidencias

| Orden | Hipótesis | Panel clave | Evidencia que la distingue de las demás |
| :--- | :--- | :--- | :--- |
| **1** | Selector no encuentra el botón | `Elements` / `Console` | Al hacer clic no sale **ninguna** petición en `Network`; `querySelector` devuelve `null`. |
| **2** | Servidor devuelve 404 | `Network` | Sí sale la petición en `Network`, pero el código de estado HTTP es `404` en lugar de `200`. |
| **3** | Respuesta es HTML y no JSON | `Network` / `Console` | Estado `200 OK`, pero `Content-Type` es `text/html` y `Console` da `SyntaxError: Unexpected token '<'`. |
| **4** | Excepción por campo ausente | `Sources` / `Console` | El JSON llega bien en `Network`, pero el código se rompe con `TypeError` en la línea que actualiza el DOM. |
| **5** | Funciona con ratón pero no con teclado | `Elements` + Teclado | Con ratón carga y pinta los datos sin errores, pero con `Tab` no coge el foco porque es un `<div>` y no un `<button>`. |