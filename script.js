// Variables js necesarias
let numeroAleatorio;
let intentos;
let intento;
let numerosAdivinados;

const historialIntentos = {
  registros: []
};

function inicializarJuego() {
  // Cargar datos desde localStorage si están disponibles
  const datosGuardados = JSON.parse(localStorage.getItem('datosJuego'));

  if (datosGuardados) {
    numeroAleatorio = datosGuardados.numeroAleatorio;
    intentos = datosGuardados.intentos;
    intento = datosGuardados.intento;
    numerosAdivinados = datosGuardados.numerosAdivinados;

    // Mostrar intentos
    mostrarIntentos();
  } else {
    // Si no hay datos guardados, inicializamos el juego
    numeroAleatorio = Math.floor(Math.random() * 100) + 1;
    intentos = [];
    intento = 0;
    numerosAdivinados = [];
  }
}

function guardarDatosEnLocalStorage() {
  const datosJuego = {
    numeroAleatorio,
    intentos,
    intento,
    numerosAdivinados,
    historialIntentos,
    intentoActual: intento,
    numerosIngresados: intentos.slice()
  };
  localStorage.setItem('datosJuego', JSON.stringify(datosJuego));
}

function compararNumeroAdivinado(numeroAdivinado) {
  if (numeroAdivinado === numeroAleatorio) {
    return '¡Correcto! Has adivinado el número.';
  } else if (numeroAdivinado < numeroAleatorio) {
    return 'Demasiado bajo. Intenta con un número más alto.';
  } else {
    return 'Demasiado alto. Intenta con un número más bajo.';
  }
}

function mostrarIntentos() {
  const intentosAnteriores = document.getElementById('intentosAnteriores');
  intentosAnteriores.innerHTML = `
    <div>Intento actual: ${intento}</div>
    <div>Números ingresados: ${intentos.join(', ')}</div>
  `;
}

function mostrarUltimoRegistro() {
  const ultimoRegistro = historialIntentos.registros[historialIntentos.registros.length - 1];

  let detalles = `Último registro:\nNombre: ${ultimoRegistro.nombre}\nIntentos realizados: ${ultimoRegistro.intentosRealizados}`;
  detalles += `\nIntento actual: ${ultimoRegistro.intentoActual}`;
  detalles += `\nNúmeros ingresados: ${ultimoRegistro.numerosIngresados.join(', ')}`;

  const resultadoElement = document.getElementById('resultado');
  resultadoElement.innerText = detalles;
}

function adivinarNumero(event) {
  event.preventDefault();
  const numeroAdivinado = parseInt(document.getElementById('numeroAdivinado').value);

  if (isNaN(numeroAdivinado) || numeroAdivinado < 1 || numeroAdivinado > 100) {
    const mensajeError = 'Ingresa un número válido entre 1 y 100.';
    const resultadoElement = document.getElementById('resultado');
    resultadoElement.innerText = mensajeError;
    return;
  }

  intentos.push(numeroAdivinado);
  numerosAdivinados.push(numeroAdivinado);

  const resultado = compararNumeroAdivinado(numeroAdivinado);

  const resultadoElement = document.getElementById('resultado');
  resultadoElement.innerText = resultado;

  mostrarIntentos();

  if (numeroAdivinado === numeroAleatorio) {
    // Mostrar el contenedor para ingresar el nombre
    document.getElementById('nombreJugadorContainer').style.display = 'block';
  } else {
    intento++;
  }

  // Guardar datos en localStorage incluyendo intento actual y números ingresados
  guardarDatosEnLocalStorage();
}

function reiniciarJuego() {
  // Generar un nuevo número aleatorio
  numeroAleatorio = Math.floor(Math.random() * 100) + 1;

  // Reiniciar las variables
  intentos = [];
  intento = 0;
  numerosAdivinados = [];

  // Limpiar el resultado y los intentos anteriores
  document.getElementById('resultado').innerText = '';
  document.getElementById('intentosAnteriores').innerHTML = '';

  // Actualizar el display
  mostrarIntentos();

  // Guardar los datos del juego reiniciado en localStorage
  guardarDatosEnLocalStorage();
}

// Evento al hacer clic en el botón de adivinar
document.getElementById('adivinarButton').addEventListener('click', adivinarNumero);

// Evento al hacer clic en el botón de enviar nombre
document.getElementById('enviarNombreButton').addEventListener('click', () => {
  const nombreJugador = document.getElementById('nombreJugador').value;
  if (nombreJugador.trim() !== '') {
    const registro = {
      nombre: nombreJugador,
      intentosRealizados: intento,
      intentoActual: intento,
      numerosIngresados: intentos.slice()
    };
    historialIntentos.registros.push(registro);

    document.getElementById('nombreJugadorContainer').style.display = 'none';
    mostrarUltimoRegistro();

    intentos.length = 0;
    intento = 1;
    document.getElementById('intentosAnteriores').innerHTML = '';
    const inputNumero = document.getElementById('numeroAdivinado');
    inputNumero.value = '';

    // Guardamos los datos del juego en localStorage
    guardarDatosEnLocalStorage();
  } else {
    alert('Por favor, ingresa tu nombre.');
  }
});

// Evento al hacer clic en el botón de reiniciar
document.getElementById('reiniciarButton').addEventListener('click', reiniciarJuego);


// Cargar historial desde localStorage al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  inicializarJuego();
  mostrarIntentos();

  // Evento para mostrar el último registro
  document.getElementById('mostrarUltimoRegistroButton').addEventListener('click', mostrarUltimoRegistro);
});