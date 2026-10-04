# Desarrollo-Entorno-Cliente
Javier González Curiel

## UT1: Selección de arquitecturas y tecnologías

* [Auditoría Tecnológica](./UT1/ut1-auditoria-tecnologica.md)
* [Cliente - Servidor](./UT1/ut1-cliente-servidor.md)
* [Herramientas y Pruebas](./UT1/ut1-herramientas-y-pruebas.md)
* [Integración Web](./UT1/ut1-integracion-web.md)
* [Laboratorio DevTools](./UT1/ut1-laboratorio-devtools.md)
* [Lenguajes y Script](./UT1/ut1-lenguajes-y-script.md)

---

## UT2: Sintaxis JavaScript


* [Simulador Bunker (simulador.js)](./UT2/simulador.js)

### 📜 Reglas del Juego
- **Objetivo:** Sobrevivir durante **10 turnos** (10 días) manteniendo vivos a los supervivientes y la moral por encima de 0.
- **Derrota:** El juego termina si el agua, la comida, la energía o la moral llegan a 0, o si mueren todos los supervivientes.
- **Consumo diario:** Al final de cada turno, cada superviviente consume 1 de Agua, 2 de Comida y 1 de Energía.
- **Incidentes:** Al final del día, el nivel de amenaza determina qué ocurre:
  - `0 - 39`: Sin incidentes.
  - `40 - 69`: Alarma exterior (-5 moral).
  - `70 - 100`: Ataque zombi (-1 superviviente, -10 moral).

### 🛠️ Explicación de las Funciones Principales
- **`mostrarInformacion(estado)`**: Imprime por pantalla el estado actual del búnker, los turnos y los recursos.
- **`comprobarFinal(estado)`**: Verifica si se cumple alguna condición de victoria (llegar al turno 10) o de derrota.
- **`nivelAmenaza(estado)`**: Evalúa el nivel de amenaza actual y aplica las penalizaciones de moral o pérdida de supervivientes.
- **`sumarTurno(estado, accion)`**: Registra la acción en el historial, avanza el día, resta el consumo diario y comprueba el final.
- **Acciones (`explorar`, `reparar`, `cultivar`, `animar`, `racionar`)**: Modifican los recursos del estado en función del coste y beneficio de la acción elegida.
- **`menus()`**: Contiene el bucle principal `do...while` que solicita la acción al jugador utilizando la librería `readline-sync`.

### 🔄 Diagrama de Turno

```text
Inicio de Turno
      ↓
Mostrar Estado y Acciones Disponibles
      ↓
Pedir Acción al Jugador
      ↓
¿Hay suficientes recursos para pagarla? 
   ├─ NO -> Mostrar Error y repetir pregunta
   └─ SÍ -> Aplicar coste y beneficios de la acción
            ↓
    Aplicar eventos de Amenaza (Pérdida de moral/supervivientes)
            ↓
    Restar consumo diario de los supervivientes
            ↓
    Guardar la acción en el Historial
            ↓
¿Condición de Victoria o Derrota?
   ├─ SÍ -> Fin del Juego (Mostrar Resultado)
   └─ NO -> Avanzar al siguiente turno