const readlineSync = require("readline-sync");

const estadoInicial = {                                            
  turno: 1,
  supervivientes: 5,
  recursos: {
    agua: 24,
    comida: 30,
    energia: 18,
    moral: 70,
    chatarra: 6,
  },
  capacidad: {
    agua: 40,
    comida: 50,
    energia: 30,
    chatarra: 20,
  },
  amenaza: 15,
  historial: [],
};

function mostrarInformacion(estado) {
    console.log("Actualmente es el turno: " + estado.turno);
    console.log("Supervivientes: " + estado.supervivientes);
    console.log("Consumo diario por persona: 1 Agua, 2 Comida, 1 Energía");
    console.log("Recursos: ");
    console.log("  Agua: " + estado.recursos.agua + "/" + estado.capacidad.agua);
    console.log("  Comida: " + estado.recursos.comida + "/" + estado.capacidad.comida);
    console.log("  Energía: " + estado.recursos.energia + "/" + estado.capacidad.energia);
    console.log("  Moral: " + estado.recursos.moral);
    console.log("  Chatarra: " + estado.recursos.chatarra + "/" + estado.capacidad.chatarra);
    console.log("  Nivel de Amenaza: " + estado.amenaza);
}

function comprobarFinal(estado) {

    if (estado.supervivientes <= 0) {
        console.log("Todos los supervivientes han muerto. Fin del juego.");
        mostrarInformacion(estado);
        console.log("\n HISTORIAL DE LA PARTIDA ");
        console.log(estado.historial);
        process.exit();
    }

    if (estado.turno >=10){
        console.log("Se han superado los 10 turnos. Victoria de los supervivientes ^^ ");
        console.log("Supervivientes: " + estado.supervivientes + " Moral: " + estado.recursos.moral);
        mostrarInformacion(estado);
        console.log("\n HISTORIAL DE LA PARTIDA ");
        console.log(estado.historial);
        process.exit();
    }

    if (estado.recursos.agua <= 0 || estado.recursos.comida <= 0 || estado.recursos.energia <= 0 || estado.recursos.moral <= 0) {
        console.log("Alguno de los recursos se han agotado. Fin del juego.");
        mostrarInformacion(estado);
        if (estado.recursos.agua <= 0) {
            console.log("El agua se ha agotado.");
        }
        if (estado.recursos.comida <= 0) {
            console.log("La comida se ha agotado.");
        }
        if (estado.recursos.energia <= 0) {
            console.log("La energía se ha agotado.");
        }
        if (estado.recursos.moral <= 0) {
            console.log("La moral se ha agotado.");
        }
        console.log("\n HISTORIAL DE LA PARTIDA ");
        console.log(estado.historial);
        process.exit();
    }

}

function nivelAmenaza(estado) {

    if (estado.amenaza >= 100) {
        estado.amenaza = 100;
    }

    if (estado.amenaza >= 40 && estado.amenaza <= 69) {
        console.log("La amenaza ha llegado al 40-69. La moral baja");
        estado.recursos.moral = estado.recursos.moral - 5;
    }

    if (estado.amenaza >= 70 && estado.amenaza <= 100) {
        console.log("La amenaza ha superado el límite de 100. Los zombies atacan");
        estado.supervivientes = estado.supervivientes - 1;
        estado.recursos.moral = estado.recursos.moral - 10;
    }
}



function sumarTurno(estado, accion){

    estado.historial.push("Turno " + estado.turno + ": Acción elegida -> " + accion);

    estado.turno++;
    estado.recursos.agua = estado.recursos.agua - (estado.supervivientes * 1);
    estado.recursos.comida = estado.recursos.comida - (estado.supervivientes * 2);
    estado.recursos.energia = estado.recursos.energia - (estado.supervivientes * 1);

    comprobarFinal(estado);

}

function racionar(estado){

    console.log("Se ha elegido racionar los recursos. El consumo de agua y comida se reduce a la mitad.");

    nivelAmenaza(estado);

    estado.historial.push("Turno " + estado.turno + ": Acción elegida -> racionar");

    estado.turno++;
    estado.recursos.agua = estado.recursos.agua - Math.floor((estado.supervivientes * 1) / 2);
    estado.recursos.comida = estado.recursos.comida - Math.floor((estado.supervivientes * 2) / 2);
    estado.recursos.energia = estado.recursos.energia - (estado.supervivientes * 1);

    comprobarFinal(estado);

}

function explorar(estado) {

    if (estado.recursos.energia < 2) {
        console.log("No hay suficiente energía para explorar.");
        return;
    }

    estado.recursos.energia = estado.recursos.energia - 2;

    estado.recursos.agua = estado.recursos.agua + 8;
    estado.recursos.comida = estado.recursos.comida +10;
    estado.recursos.chatarra = estado.recursos.chatarra + 4;
    estado.amenaza = estado.amenaza + 15;

    if (estado.recursos.agua > estado.capacidad.agua) {
        estado.recursos.agua = estado.capacidad.agua;
    }
    if (estado.recursos.comida > estado.capacidad.comida) {
        estado.recursos.comida = estado.capacidad.comida;
    }
    if (estado.recursos.chatarra > estado.capacidad.chatarra) {
        estado.recursos.chatarra = estado.capacidad.chatarra;
    }

    nivelAmenaza(estado);

    console.log("Se ha elegido explorar. Se han encontrado nuevos recursos.");
    sumarTurno(estado,"explorar");
}

function reparar(estado) {

    if (estado.recursos.energia < 4 || estado.recursos.chatarra < 3) {
        console.log("No hay suficiente energía y/o chatarra  para reparar.");
        return;
    }
    
    estado.recursos.chatarra = estado.recursos.chatarra - 3;
    estado.recursos.energia = estado.recursos.energia - 4;

    estado.recursos.energia = estado.recursos.energia + 8;
    estado.amenaza = estado.amenaza - 5;

    if (estado.amenaza < 0) {
        estado.amenaza = 0; 
    }

    if (estado.recursos.energia > estado.capacidad.energia) {
        estado.recursos.energia = estado.capacidad.energia;
    }

    nivelAmenaza(estado);

    console.log("Se ha elegido reparar. Se han mejorado los recursos.");
    sumarTurno(estado,"reparar");

}

function cultivar(estado){

    if (estado.recursos.energia < 2 || estado.recursos.agua < 1) {
        console.log("No hay suficiente energía y/o agua para cultivar.");
        return;
    }

    estado.recursos.energia = estado.recursos.energia - 2;
    estado.recursos.agua = estado.recursos.agua - 1;

    estado.recursos.comida = estado.recursos.comida + 12;

    estado.amenaza = estado.amenaza + 2;

    if (estado.recursos.comida > estado.capacidad.comida) {
        estado.recursos.comida = estado.capacidad.comida;
    }

    nivelAmenaza(estado);

    console.log("Se ha elegido cultivar. Se han producido nuevos recursos.");
    sumarTurno(estado,"cultivar");

}


function animar(estado){

    if (estado.recursos.comida < 1) {
        console.log("No hay suficiente comida para animar.");
        return;
    }

    estado.recursos.comida = estado.recursos.comida - 1;

    estado.recursos.moral = estado.recursos.moral + 12;

    nivelAmenaza(estado);

    console.log("Se ha elegido animar. Se ha mejorado la moral.");

    sumarTurno(estado,"animar");

}

function menu() {
    console.log("\n--- ACCIONES DISPONIBLES ---");
    console.log("1. Mostrar información");
    console.log("2. Racionar (Coste: Ninguno | Efecto: Reduce el consumo de agua y comida a la mitad)");
    console.log("3. Explorar (Coste: 2 Energía | Ganas: 8 Agua, 10 Comida, 4 Chatarra | Amenaza: +15)");
    console.log("4. Reparar  (Coste: 4 Energía, 3 Chatarra | Ganas: 8 Energía | Amenaza: -5)");
    console.log("5. Cultivar (Coste: 2 Energía, 1 Agua | Ganas: 12 Comida | Amenaza: +2)");
    console.log("6. Animar   (Coste: 1 Comida | Ganas: 12 Moral)");
    console.log("7. Salir");
    console.log("----------------------------");
}

function menus(){

    var opcion;

    do{
        menu();
        opcion = readlineSync.question("Elige una opcion: ");
            switch (opcion) {
                case "1":
                    mostrarInformacion(estadoInicial);
                    break;
                case "2":
                    racionar(estadoInicial);
                    mostrarInformacion(estadoInicial);
                    break;
                case "3":
                    explorar(estadoInicial);
                    mostrarInformacion(estadoInicial);
                    break;
                case "4":
                    reparar(estadoInicial);
                    mostrarInformacion(estadoInicial);
                    break;
                case "5":
                    cultivar(estadoInicial);
                    mostrarInformacion(estadoInicial);
                    break;
                case "6":
                    animar(estadoInicial);
                    mostrarInformacion(estadoInicial);
                    break;
                case "7":
                    console.log("LOSER");
                break;
                default:
                    console.log("Opción no válida");
            }
       
    }while(opcion !== "7");
}


menus();
