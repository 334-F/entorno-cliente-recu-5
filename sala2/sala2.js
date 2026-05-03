// Sala 2 - La Biblioteca

const inputCodigo = document.getElementById("inputCodigo");
const mensajeTecla = document.getElementById("mensajeTeclado");
const puerta = document.getElementById("puerta");
const mensajePuerta = document.getElementById("mensajePuerta");

const CODIGO_CORRECTO = "X4B7";

// Estado de BLOQ MAYÚS que es null porque aún no lo sabemos al arrancar
let capsActivo = null;

// Sala 2. Validación de caracteres alfanuméricos
inputCodigo.addEventListener("keydown", function (e) {

    // Vocales bloqueadas (sin aviso, simplemente se impide) 
    const vocales = ["KeyA", "KeyE", "KeyI", "KeyO", "KeyU"];
    if (vocales.includes(e.code)) {
        e.preventDefault();
        return;
    }

    //Solo permito que sean caracteres alfanuméricos
    // Dejamos pasar teclas de control como retroceso, flechas, tabulador, etc...
    const teclasControl = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter", "CapsLock"];
    const esAlfanumerico = /^[a-zA-Z0-9]$/.test(e.key);

    if (!esAlfanumerico && !teclasControl.includes(e.key) && !e.ctrlKey) {
        e.preventDefault();
        mensajeTecla.textContent = "Solo se permiten letras y números.";
        return;
    }

    // Sala 2. Validación de teclas especiales

    // Pulsar ENTER para intentar abrir la puerta
    if (e.key === "Enter") {
        e.preventDefault();
        comprobarCodigo();
        return;
    }

    // CTRL+C y CTRL+V bloqueados: no se puede copiar ni pegar el código
    if (e.ctrlKey && (e.code === "KeyC" || e.code === "KeyV")) {
        e.preventDefault();
        mensajeTecla.textContent = "No puedes copiar ni pegar.";
        return;
    }

    // Detectar activación/desactivación de BLOQ MAYÚS
    // He utilizado el getModifierState("CapsLock") que dice si está activo en ese momento
    let capsAhora = e.getModifierState("CapsLock");
    if (e.code === "CapsLock" && capsAhora !== capsActivo) {
        mensajeTecla.textContent = capsAhora ? "BLOQ MAYÚS activado." : "BLOQ MAYÚS desactivado.";
        capsActivo = capsAhora;
    }
});

// Sala 2. Detectar tecla SHIFT al soltarla
inputCodigo.addEventListener("keyup", function (e) {
    if (e.key === "Shift") {
        mensajeTecla.textContent = "Soltaste SHIFT: ya no estas escribiendo bien en mayúsculas .";
    }
});


//Sala 2. CustomEvent al resolver el puzzle


function comprobarCodigo() {
    let valor = inputCodigo.value.toUpperCase();

    if (valor === CODIGO_CORRECTO) {
        // Creamos y lanzamos el evento personalizado desde la puerta
        // bubbles: para que suba DOM y podamos escucharlo también desde document
        let eventoAbrir = new CustomEvent("puertaAbierta", {
            bubbles: true,   
            cancelable: true, //Permite que otros listeners detengan el evento usando e.preventDefault().
            detail: {
                sala: 2,
                mensaje: "Correcto! La sala 2 completada. Puedes pasar al Almacén."
            }
        });
        puerta.dispatchEvent(eventoAbrir);
    } else {
        mensajeTecla.textContent = "Código \"" + valor + "\" incorrecto. Revisa las pistas de la Sala 1.";
        inputCodigo.value = "";
    }
}

// Escuchamos el evento personalizado en la propia puerta
puerta.addEventListener("puertaAbierta", function (e) {
    document.getElementById("iconoPuerta").textContent = "🔓";
    document.getElementById("estadoPuerta").textContent = "ABIERTA";
    mensajePuerta.textContent = e.detail.mensaje;
    puerta.style.opacity = "0.65";
    inputCodigo.disabled = true;
});

// El evento también sube de bubbles: true, lo que podemos escuchar en document
document.addEventListener("puertaAbierta", function (e) {
    console.log("Evento puertaAbierta recibido en document:", e.detail);
});
