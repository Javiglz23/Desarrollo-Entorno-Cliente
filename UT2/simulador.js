const readline = require("readline");
const consola = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const estadoDePrueba = [                                            //crear estado inical
  "explorar", "reparar", "cultivar", "explorar", "animar",
];

const estadoInicial = {                                             //revisar para el programa porq quiero crearlo cada turno y no al principio
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

function mostrarInformacion(turno, supervivientes, recursos, capacidad, amenaza) {
    console.log("Actualmente es el turno: " + turno);
    console.log("Supervivientes: " + supervivientes);
    console.log("Recursos: ");
    console.log("  Agua: " + recursos.agua + "/" + capacidad.agua);
    console.log("  Comida: " + recursos.comida + "/" + capacidad.comida);
    console.log("  Energía: " + recursos.energia + "/" + capacidad.energia);
    console.log("  Moral: " + recursos.moral);
    console.log("  Chatarra: " + recursos.chatarra + "/" + capacidad.chatarra);
    console.log("  Nivel de Amenaza: " + amenaza);
}

function comprobarFinal(turno, supervivientes, recursos) { //metodo un poco cutre

    if (supervivientes <= 0) {
        console.log("Todos los supervivientes han muerto. Fin del juego.");
        consola.close();
    }

    if (turno >=10){
        console.log("Se han superado los 10 turnos. Victoria de los supervivientes ^^ ");
        console.log("Supervivientes: " + supervivientes + " Moral: " +recursos.moral);
        consola.close();
    }

    if (recursos.agua <= 0 || recursos.comida <= 0 || recursos.energia <= 0 || recursos.moral <= 0) {
        console.log("Alguno de los recursos se han agotado. Fin del juego.");
        if (recursos.agua <= 0) {
            console.log("El agua se ha agotado.");
        }
        if (recursos.comida <= 0) {
            console.log("La comida se ha agotado.");
        }
        if (recursos.energia <= 0) {
            console.log("La energía se ha agotado.");
        }
        if (recursos.moral <= 0) {
            console.log("La moral se ha agotado.");
        }
        consola.close();
    }

}

function nivelAmenaza(recursos, supervivientes,amenaza) {

    if (amenaza >= 100) {
        amenaza = 100;
    }

    if (amenaza >= 40 && amenaza <= 69) {
        console.log("La amenaza ha llegado al 40-69. La moral baja");
        recursos.moral = recursos.moral - 5;
    }
    
    if (amenaza >= 70 && amenaza <= 100) {
        console.log("La amenaza ha superado el límite de 100. Los zombies atacan");
        supervivientes = supervivientes - 1;
        recursos.moral = recursos.moral - 10;
    }
}



function sumarTurno(turno, supervivientes, recursos){

    turno++;
    recursos.agua = recursos.agua - (supervivientes * 1);
    recursos.comida = recursos.comida - (supervivientes * 2);
    recursos.energia = recursos.energia - (supervivientes * 1);

    comprobarFinal(turno, supervivientes, recursos);

}

function racionar(turno,supervivientes, recursos, amenaza){ //metodo un poco cutre

    nivelAmenaza(recursos, supervivientes, amenaza);

    turno++;
    recursos.agua = recursos.agua - (supervivientes * 1) / 2;
    recursos.comida = recursos.comida - (supervivientes * 2) / 2;
    recursos.energia = recursos.energia - (supervivientes * 1);

    comprobarFinal(turno, supervivientes, recursos);

}

function explorar(turno, supervivientes, recursos, capacidad, amenaza){

    if (recursos.energia <= 2) {
        console.log("No hay suficiente energía para explorar.");
        return;
    }

    recursos.energia = recursos.energia - 2;

    recursos.agua = recursos.agua + 8;
    recursos.comida = recursos.comida +10;
    recursos.chatarra = recursos.chatarra + 4;
    amenaza = amenaza + 15;

    if (recursos.agua > capacidad.agua) {
        recursos.agua = capacidad.agua;
    }
    if (recursos.comida > capacidad.comida) {
        recursos.comida = capacidad.comida;
    }
    if (recursos.chatarra > capacidad.chatarra) {
        recursos.chatarra = capacidad.chatarra;
    }

    nivelAmenaza(recursos, supervivientes, amenaza);
    
    sumarTurno(turno, supervivientes, recursos);
}

function reparar(turno, supervivientes, recursos, capacidad, amenaza){

    if (recursos.energia < 4 || recursos.chatarra <= 3) {
        console.log("No hay suficiente energía y/o chatarra  para reparar.");
        return;
    }
    
    recursos.chatarra = recursos.chatarra - 3;
    recursos.energia = recursos.energia - 4;

    recursos.energia = recursos.energia + 8;

    if (recursos.energia > capacidad.energia) {
        recursos.energia = capacidad.energia;
    }

    nivelAmenaza(recursos, supervivientes, amenaza);

    sumarTurno(turno, supervivientes, recursos);

}

function cultivar(turno, supervivientes, recursos, capacidad, amenaza){

    if (recursos.energia <= 2 || recursos.agua <= 1) {
        console.log("No hay suficiente energía y/o agua para cultivar.");
        return;
    }

    recursos.energia = recursos.energia - 2;
    recursos.agua = recursos.agua - 1;

    recursos.comida = recursos.comida + 12;

    recursos.amenaza =recursos.comida + 2;

    if (recursos.comida > capacidad.comida) {
        recursos.comida = capacidad.comida;
    }

    nivelAmenaza(recursos, supervivientes, amenaza);

    sumarTurno(turno, supervivientes, recursos);

}


function animar(turno, supervivientes, recursos, amenaza){

    if (recursos.comida <= 1) {
        console.log("No hay suficiente comida para animar.");
        return;
    }

    recursos.comida = recursos.comida - 1;

    recursos.moral = recursos.moral + 12;

    nivelAmenaza(recursos, supervivientes, amenaza);

    sumarTurno(turno, supervivientes, recursos);

}

function menu() {

    console.log("1. Mostrar información");
    console.log("2. Racionar, ");
    console.log("3. Explorar");
    console.log("4. Reparar");
    console.log("5. Cultivar");
    console.log("6. Animar");
    console.log("7. Salir");
    
}


function menus(){ //revisar como poner menu

    do{
        menu();
        consola.question("Elige una opción: ", (opcion) => {
            switch (opcion) {
                case "1":
                    mostrarInformacion(estadoInicial.turno, estadoInicial.supervivientes, estadoInicial.recursos, estadoInicial.capacidad, estadoInicial.amenaza);
                    break;
                case "2":
                    racionar(estadoInicial.turno, estadoInicial.supervivientes, estadoInicial.recursos, estadoInicial.amenaza);
                    break;
                case "3":
                    explorar(estadoInicial.turno, estadoInicial.supervivientes, estadoInicial.recursos, estadoInicial.amenaza);
                    break;
                case "4":
                    reparar(estadoInicial.turno, estadoInicial.supervivientes, estadoInicial.recursos, estadoInicial.capacidad, estadoInicial.amenaza);
                    break;
                case "5":
                    cultivar(estadoInicial.turno, estadoInicial.supervivientes, estadoInicial.recursos, estadoInicial.capacidad, estadoInicial.amenaza);
                    break;
                case "6":
                    animar(estadoInicial.turno, estadoInicial.supervivientes, estadoInicial.recursos, estadoInicial.amenaza);
                    break;
                case "7":
                    console.log("LOSER");
                    consola.close();
                break;
                default:
                    console.log("Opción no válida");
            }
        });
    }while(opcion !== "7");
}
