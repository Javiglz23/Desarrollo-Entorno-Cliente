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

const readline = require("readline");

const consola = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


function mostrarInformacion(turno, supervivientes, recursos, capacidad, amenaza) {
    console.log("Actualmente es el turno: " + turno);
    console.log("Supervivientes: " + supervivientes);
    console.log("Recursos: ");
    console.log("  Agua: " + recursos.agua + "/" + capacidad.agua);
    console.log("  Comida: " + recursos.comida + "/" + capacidad.comida);
    console.log("  Energía: " + recursos.energia + "/" + capacidad.energia);
    console.log("  Moral: " + recursos.moral);
    console.log("  Chatarra: " + recursos.chatarra + "/" + capacidad.chatarra);
    console.log("Amenaza: " + amenaza);
}

function sumarTurno(turno, supervivientes, recursos){//para racionar se puede hacer aqui con true 

    turno++;
    recursos.agua -= recursos.agua - (supervivientes * 1); // Consumo de agua por superviviente
    recursos.comida -= recursos.comida - (supervivientes * 2); // Consumo de comida por superviviente
    recursos.energia -= recursos.energia - (supervivientes * 1); // Consumo de energía por superviviente

}

function racionar(supervivientes, recursos, capacidad){
    sumarTurno(estadoInicial.turno, estadoInicial.supervivientes, estadoInicial.recursos); //mal hecho, tengo que saber como reducir a la mitad
}

function explorar(turno, supervivientes, recursos, capacidad, amenaza){

    recursos.energia -= recursos.energia - 2; // Consumo de energía por explorar

    recursos.agua -= recursos.agua + 8;
    recursos.comida -= recursos.comida +10;
    recursos.chatarra -= recursos.chatarra + 4;
    amenaza += amenaza + 15;

    if (recursos.agua > capacidad.agua) {
        recursos.agua = capacidad.agua;
    }
    if (recursos.comida > capacidad.comida) {
        recursos.comida = capacidad.comida;
    }
    if (recursos.chatarra > capacidad.chatarra) {
        recursos.chatarra = capacidad.chatarra;
    }

    if (amenaza > 100) {
        console.log("La amenaza ha superado el límite de 100. Los zombies atacan");
        amenaza = 100; // Limitar la amenaza a 100
    }

    //recordar hacer amenaza, que si pasa de 100, zombies y repasarlo
    
    sumarTurno(turno, supervivientes, recursos);
}

function reparar(turno, supervivientes, recursos, capacidad, amenaza){
    
    recursos.chatarra -= recursos.chatarra - 3; // Consumo de chatarra por reparar
    recursos.energia -= recursos.energia - 4;

    recursos.energia += recursos.energia + 8;

    if (recursos.energia > capacidad.energia) {
        recursos.energia = capacidad.energia;
    }

    if (amenaza < 100) {
        amenaza = 0;
    }

    sumarTurno(turno, supervivientes, recursos);

}

function cultivar(turno, supervivientes, recursos, capacidad, amenaza){

    recursos.enegia = recursos.energia - 2;
    recursos.agua = recursos.comida + 1;

    recursos.comida = recursos.comida + 12;

    recursos.amenaza =recursos.comida + 2;

    if (recursos.comida > capacidad.comida) {
        recursos.comida = capacidad.comida;
    }

     if (amenaza > 100) {
        console.log("La amenaza ha superado el límite de 100. Los zombies atacan");
        amenaza = 100; // Limitar la amenaza a 100
    }

    //recordar hacer amenaza, que si pasa de 100, zombies y repasarlo

    sumarTurno(turno, supervivientes, recursos);

}


function menu(){
    console.log("1. Mostrar información");
    console.log("2. Racionar, ");
    console.log("3. Explorar");
    console.log("4. Reparar");
    console.log("5. Cultivar");
    console.log("6. Animar");
    console.log("7. Salir");

    consola.question("Elige una opción: ", (opcion) => {
        switch (opcion) {
            case "1":
                mostrarInformacion(estadoInicial.turno, estadoInicial.supervivientes, estadoInicial.recursos, estadoInicial.capacidad, estadoInicial.amenaza);
                menu();
                break;
            case "2":
                // Lógica para racionar
                break;
            case "3":
                // Lógica para explorar
                break;
            case "4":
                // Lógica para reparar
                break;
            case "5":
                // Lógica para cultivar
                break;
            case "6":
                // Lógica para animar
                break;
            case "7":
                consola.close();
                break;
            default:
                console.log("Opción no válida");
                menu();
        }
    });
}
