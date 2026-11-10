# FEEDLAB · proyecto inicial

Abre esta carpeta con un servidor local. Por ejemplo, desde la carpeta del proyecto: `npx serve .` y visita la dirección que muestre la consola. No abras `index.html` directamente con `file://`, ya que utiliza módulos ES y peticiones HTTP.

La interfaz está terminada. Las funciones JavaScript se completan durante la UT4. Cada `TODO` indica la sesión correspondiente. `src/config.js` apunta a la API de FEEDLAB publicada; si trabajas con otra instancia, cambia solo esa constante. Consulta [Swagger UI](https://feedlab-api.vercel.app/api/feedlab/docs) para confirmar campos y respuestas.

**Recuperación:** si te atrasas, conserva tu trabajo y empieza la siguiente sesión con los datos de ejemplo de su página. Para las sesiones 4-8 puedes trabajar con arrays locales. La integración HTTP se retoma cuando `obtenerPublicaciones()` funcione. Pide al profesor el punto de recuperación de la sesión anterior si necesitas todas las funciones acumuladas; no copies una solución posterior sin entenderla.

No guardes contraseñas ni tokens en `localStorage`. Usa solo cuentas de prueba.
