// Sala 1 - El Laboratorio
// Práctica Unidad 5

//Sala 1. Empleando eventos de ratón con coordenadas y de tamaño

const area = document.getElementById("area");
const objetoOculto = document.getElementById("objetoOculto");
const coordenadasP = document.getElementById("coordenadas");
const mensajeArea = document.getElementById("mensaje-area");

// Posición de donde está escondida la pista
const PISTA_X = 200;
const PISTA_Y = 90;
const MARGEN = 35;

// Colocamos el objeto oculto en esa posición usando offsetWidth/offsetHeight, cuyos incluyen padding y borde del elemento
objetoOculto.style.left = PISTA_X + "px";
objetoOculto.style.top  = PISTA_Y + "px";

// Variable para saber si el usuario ya encontró la pista
let pistaEncontrada = false;

area.addEventListener("mousemove", function(e) {
    // getBoundingClientRect() devuelve la posición del área respecto a la ventana
    // Restando eso a clientX/Y obtenemos coordenadas relativas al área
    let rect = area.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    coordenadasP.textContent = "Coordenadas: (" + x.toFixed(1) + ", " + y.toFixed(1) + ")";

    // Comprobamos si el ratón está cerca de la pista
    if (Math.abs(x - PISTA_X) < MARGEN && Math.abs(y - PISTA_Y) < MARGEN) {
        objetoOculto.style.opacity = "1";
        mensajeArea.textContent = "Has encontrado algo! La combinación es: X4B7";
        pistaEncontrada = true;
    } else {
        objetoOculto.style.opacity = "0";
        if (!pistaEncontrada) {
            mensajeArea.textContent = "";
        }
    }
});

area.addEventListener("mouseout", function() {
    coordenadasP.textContent = "Coordenadas: (-, -)";
});

// Sala 1. Se implementa handleEvent para la caja fuerte


const cofre = document.getElementById("cofre");
const mensajeCofre = document.getElementById("mensaje-cofre");

class GestorCofre {
    constructor(elemento, msgElem) {
        this.elemento = elemento;
        this.msgElem  = msgElem;
        this.intentos = 0;
    }

    // El navegador llama a este método automáticamente cuando ocurre un evento porque le pasamos el objeto this en addEventListener
    handleEvent(e) {
        if (e.type === "click") {
            this.intentarAbrir();
        } else if (e.type === "dblclick") {
            this.forzarCerradura();
        }
    }

    intentarAbrir() {
        this.intentos++;
        if (pistaEncontrada) {
            this.elemento.textContent = "🔓";
            this.msgElem.textContent = " Candado abiertao! Dentro hay una tarjeta con el código de la Sala 2: X4B7";
        } else {
            this.msgElem.textContent = "Intento " + this.intentos + ": primero encuentra la combinación en el laboratorio.";
        }
    }

    forzarCerradura() {
        this.msgElem.textContent = "Intentas forzar la cerradura... está reforzada, no funciona.";
        // Pequeña animación de sacudida usando transform rotate y setTimeout
        this.elemento.style.transform = "rotate(8deg)";
        setTimeout(() => {
            this.elemento.style.transform = "rotate(-5deg)";
            setTimeout(() => {
                this.elemento.style.transform = "rotate(0deg)";
            }, 100);
        }, 100);
    }
}

const gestorCofre = new GestorCofre(cofre, mensajeCofre);

// Pasamos el objeto gestor como manejador que tiene el método handleEvent(hecho de antes)
cofre.addEventListener("click", gestorCofre);
cofre.addEventListener("dblclick", gestorCofre);


// Sala 1. Se añade propagación de eventos en panel de alarma


const panelAlarma = document.getElementById("panelAlarma");
const botonAlarma = document.getElementById("botonAlarma");
const luz         = document.getElementById("luz");
const mensajeProp = document.getElementById("mensaje-propagacion");

function logEvento(e) {
    let fase = "";
    if (e.eventPhase === 1) fase = "captura";
    else if (e.eventPhase === 2) fase = "objetivo";
    else fase = "propagación";

    let linea = "target: #" + e.target.id + " | manejado en: #" + e.currentTarget.id + " | fase: " + fase;

    // Solo el div con data-externo muestra el contador en fase propagación
    if (e.eventPhase === 1) {
        e.cont = (e.cont === undefined) ? 1 : e.cont + 1;
    } else if (e.eventPhase === 3 && e.currentTarget.dataset.externo !== undefined) {
        linea += " | cont=" + e.cont;
    }

    mensajeProp.innerHTML += linea + "<br>";
}

// Asigno el mismo manejador en captura (true) y en propagación (sin el tercer param)
panelAlarma.addEventListener("click", logEvento, true);
panelAlarma.addEventListener("click", logEvento);

botonAlarma.addEventListener("click", logEvento, true);
botonAlarma.addEventListener("click", logEvento);

luz.addEventListener("click", logEvento, true);
luz.addEventListener("click", logEvento);

// Al hacer clic en el mensaje se borra 
mensajeProp.addEventListener("click", function() {
    mensajeProp.innerHTML = "(haz clic arriba para ver los eventos)";
});
