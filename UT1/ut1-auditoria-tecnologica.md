Apartado 1

sequenceDiagram
    participant Cliente as Navegador
    participant Edge as Servidor Frontera / Edge
    participant CDN as CDN (uber-assets.com)
    participant API as API Gateway
    participant Backend as Sistemas Internos (?)

    Cliente->>Edge: 1. Petición inicial: GET https://www.uber.com/es/es/
    Edge-->>Cliente: 2. Respuesta HTML: 200 OK (text/html)
    
    Cliente->>CDN: 3. Petición de recursos: GET estilos y scripts
    CDN-->>Cliente: 4. Archivos CSS/JS entregados (Caché / 200 OK)
    
    Cliente->>API: 5. Petición Dinámica: POST /api/graphql
    
    Note right of API: === TECNOLOGÍA INTERNA DESCONOCIDA ===<br/>Lenguaje de Servidor (?)<br/>Base de Datos (?)<br/>Topología de Microservicios (?)
    
    API->>Backend: Procesamiento interno
    Backend-->>API: Resultado
    
    API-->>Cliente: 6. Respuesta JSON: 200 OK (application/json)

Apartado 2

La Geolocalización

- Que resuelve, resuelve la capacidad de ubicar al usuario y donde recoger y enviar el pedido

- Como verfica que existe, uber verifica que la ubicación está en el navegador/app del dispositivo, intenta ejecutarlo y si no existe no se ejecuta evitando errores.

- Que permiso requiere, requiere la capa de seguridad HTTPS y tmb siempre pregunta si permite el acceso de la ubicación.

- Que sucede si se deniega el permiso, en caso de rechazar el acceso a la ubicación uber se adapta para que no surja un error y adapta la interefaz para que funcione sin las coordenadas.

- Que riesgo conlleva, es un riesgo bastante alto compartir la ubicación en tiempo real de manera web.

- Alternativa, si se rechaza el permiso a la ubicación uber te permite introducir la ubicación a mano o poner un punto de entrega.

Apartado 3

**Parte C · Lenguajes y scripts (Uber)**

**1. Responsabilidades observables**

* **HTML (Estructura):** Construye el esqueleto de la página, agrupando textos, botones y las cajas del formulario de origen/destino.
* **CSS (Presentación):** Aplica el diseño visual (colores de la marca, tipografía) y adapta la estructura para que se vea correctamente en móviles o computadoras.
* **JavaScript (Interactividad):** Permite que el buscador autocomplete tu dirección mientras escribes y calcula la tarifa sin necesidad de recargar la página.

**2. Prueba sin JavaScript**

* **Interacción elegida:** Escribir una dirección para solicitar un viaje.
* **Resultado al bloquear JS:** La página carga su diseño de forma idéntica, pero el formulario no sugiere ubicaciones y el botón de búsqueda no responde.

**3. Clasificación**

* **Contenido conservado, acción perdida:** Puedes leer toda la información comercial y ver la interfaz, pero es imposible completar la acción principal (pedir el viaje).

**4. Evaluación**

* **Dependencia justificada:** Sí. Al ser una aplicación en tiempo real, Uber necesita conectar mapas, sugerencias de direcciones y precios dinámicos al instante, algo imposible solo con HTML.
* **Comunicación del error:** El código fuente incluye una etiqueta `<noscript>` diseñada para avisar al usuario que la plataforma no puede funcionar si JavaScript está desactivado.