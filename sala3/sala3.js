// Sala 3 - El Almacén 
// Práctica Unidad 5

// Sala 3. Se crea sala nueva con arrastrar y soltar objetos

const mensajeDrag = document.getElementById("mensajeDrag");
let objetosColocados = 0;
let elementoArrastrado = null;

// Eventos en los elementos arrastrables
document.querySelectorAll(".objeto-arrastrable").forEach(function (obj) {
    obj.addEventListener("dragstart", function (e) {
        elementoArrastrado = e.target;
        // Guardamos el id del objeto en el dataTransfer para identificarlo al soltar
        e.dataTransfer.setData("text/plain", e.target.dataset.id);
        e.target.style.opacity = "0.4";
    });

    obj.addEventListener("dragend", function (e) {
        e.target.style.opacity = "1";
        elementoArrastrado = null;
    });
});

// Eventos en las estanterías 
document.querySelectorAll(".estanteria").forEach(function (estanteria) {
    // dragover: hay que llamar preventDefault o el drop no funcionaría
    estanteria.addEventListener("dragover", function (e) {
        e.preventDefault();
        estanteria.classList.add("highlight");
    });

    estanteria.addEventListener("dragleave", function () {
        estanteria.classList.remove("highlight");
    });

    estanteria.addEventListener("drop", function (e) {
        e.preventDefault();
        estanteria.classList.remove("highlight");

        let idObjeto = e.dataTransfer.getData("text/plain");
        let acepta = estanteria.dataset.acepta;

        if (idObjeto === acepta && elementoArrastrado !== null) {
            // Los Objetos correspondidos: lo movemos dentro de la estantería
            estanteria.appendChild(elementoArrastrado);
            elementoArrastrado.setAttribute("draggable", "false");
            elementoArrastrado.style.opacity = "1";
            elementoArrastrado.style.cursor = "default";
            objetosColocados++;
            mensajeDrag.textContent = objetosColocados + "/3 objetos colocados.";

            if (objetosColocados === 3) {
                mensajeDrag.textContent = "¡Almacén ordenado! Ahora sube el fichero y rellena el formulario.";
            }
        } else {
            mensajeDrag.textContent = "Ese objeto no pertenece a esta estantería.";
        }
    });
});

//Sala 3. Se añade drag & drop para subir ficheros

const dropFichero = document.getElementById("dropFichero");
const inputFichero = document.getElementById("inputFichero");
const infoFichero = document.getElementById("infoFichero");

dropFichero.addEventListener("dragover", function (e) {
    // Sin esto el navegador abre el fichero directamente
    e.preventDefault();
    dropFichero.classList.add("highlight");
});

dropFichero.addEventListener("dragleave", function () {
    dropFichero.classList.remove("highlight");
});

dropFichero.addEventListener("drop", function (e) {
    e.preventDefault();
    dropFichero.classList.remove("highlight");

    // e.dataTransfer.files contiene los ficheros soltados
    if (e.dataTransfer.files.length > 0) {
        let file = e.dataTransfer.files[0];
        mostrarInfoFichero(file);
    }
});

// Clic para abrir el selector de ficheros
dropFichero.addEventListener("click", function () {
    inputFichero.click();
});

inputFichero.addEventListener("change", function (e) {
    if (e.target.files.length > 0) {
        mostrarInfoFichero(e.target.files[0]);
    }
});

// Si se arrastra texto (no un fichero), el dragend llega al párrafo de info
infoFichero.addEventListener("dragend", function () {
    alert("Solo se pueden arrastrar ficheros.");
});

function mostrarInfoFichero(file) {
    infoFichero.innerHTML =
        "<strong>Nombre:</strong> " + file.name + "<br>" +
        "<strong>Tamaño:</strong> " + (file.size / 1024).toFixed(1) + " KB<br>" +
        "<strong>Tipo:</strong> " + (file.type || "Desconocido");
}

// Práctica Unidad 5. Sala 3. Se añaden eventos de scroll y redimensión de ventana

const scrollVal = document.getElementById("scrollVal");
const sizeVal = document.getElementById("sizeVal");

// Mostramos el tamaño inicial al cargar
sizeVal.textContent = window.innerWidth + " x " + window.innerHeight;

let yaAvisadoFinal = false;

window.addEventListener("scroll", function () {
    // window.scrollY = para ver cuántos píxeles hemos bajado
    scrollVal.textContent = Math.round(window.scrollY);

    // Detectar si hemos llegado al final del documento
    let totalPagina = document.documentElement.scrollHeight;
    let alturaPantalla = window.innerHeight;
    if (window.scrollY + alturaPantalla >= totalPagina - 5 && !yaAvisadoFinal) {
        alert("¡Has llegado al final del diario! Hay una pista escrita en el suelo.");
        yaAvisadoFinal = true;
    }
});

window.addEventListener("resize", function () {
    // window.innerWidth/innerHeight = para ver el tamaño visible de la ventana
    sizeVal.textContent = window.innerWidth + " x " + window.innerHeight;
});

// Sala 3. Se añade formulario con validaciones y expresiones regulares


const formEscape = document.getElementById("formEscape");
const mensajeForm = document.getElementById("mensajeForm");

formEscape.addEventListener("submit", function (e) {
    // Siempre prevenimos el envío real y lo gestionamos nosotros
    e.preventDefault();

    let nombre = document.getElementById("fNombre").value.trim();
    let codigo = document.getElementById("fCodigo").value.trim();
    let email = document.getElementById("fEmail").value.trim();
    let hora = document.getElementById("fHora").value.trim();

    // Comprobar campos vacíos antes de validar el formato
    if (!nombre || !codigo || !email || !hora) {
        mensajeForm.textContent = "Todos los campos son obligatorios.";
        return;
    }

    // Expresión regular: nombre solo con letras y espacios
    // ^ inicio, $ fin, + uno o más caracteres del grupo
    let regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
    if (!regexNombre.test(nombre)) {
        mensajeForm.textContent = "El nombre solo puede tener letras.";
        return;
    }

    // Expresión regular: código con exactamente 2 letras mayúsculas y 4 dígitos
    // [A-Z]{2} = dos letras mayúsculas exactas, \d{4} = cuatro dígitos exactos
    let regexCodigo = /^[A-Z]{2}\d{4}$/;
    if (!regexCodigo.test(codigo)) {
        mensajeForm.textContent = "El código debe ser 2 letras mayúsculas + 4 números (ej: AB1234).";
        return;
    }

    // Expresión regular: email con formato usuario@dominio.extension
    // [a-zA-Z0-9._%+-]+ = parte local, [a-zA-Z0-9.-]+ = dominio, [a-zA-Z]{2,} = extensión
    let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(email)) {
        mensajeForm.textContent = "El email no tiene un formato válido.";
        return;
    }

    // Expresión regular: hora en formato HH:MM (00:00 a 23:59)
    // ([01]\d|2[0-3]) = 00-19 o 20-23, [0-5]\d = 00-59
    let regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!regexHora.test(hora)) {
        mensajeForm.textContent = "La hora debe tener el formato HH:MM (ej: 14:30).";
        return;
    }

    // Todo correcto: mostramos el mensaje de éxito
    mensajeForm.textContent = "¡Registro completado! Agente " + nombre + ", código " + codigo + ". ¡Escapaste a las " + hora + "!";
    formEscape.reset();
});
