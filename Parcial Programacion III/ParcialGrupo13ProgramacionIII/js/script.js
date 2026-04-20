const inputPrecio = document.getElementById("precio");
const contenedor = document.getElementById("contenedor-descuentos");
const btnAgregar = document.getElementById("BTNagregar");
const btnCalcular = document.getElementById("BTNcalcular");
const btnLimpiar = document.getElementById("BTNlimpiar");
const spanFinal = document.getElementById("Final");
const spanAhorro = document.getElementById("Ahorro");
const divPasos = document.getElementById("pasos");
const errorGlobal = document.getElementById("mensaje-error");

let contador = 1;

btnAgregar.addEventListener("click", agregarDescuento);
btnCalcular.addEventListener("click", calcular);
btnLimpiar.addEventListener("click", limpiar);

function agregarDescuento() {
  contador++;

  const carta = document.createElement("div");
  carta.classList.add("carta");

  carta.innerHTML = `
    <label>Descuento ${contador}</label>
    <div class="input-fila">
      <input type="number" class="input-descuento" placeholder="Ingrese el descuento en porcentaje">
      <button class="btn-eliminar">✕</button>
    </div>
    <span class="error-campo"></span>
  `;

  carta.querySelector(".btn-eliminar").addEventListener("click", () => {
    carta.remove();
    renumerar();
  });

  contenedor.appendChild(carta);
}

function renumerar() {
  const cartas = contenedor.querySelectorAll(".carta");
  cartas.forEach((c, i) => {
    const label = c.querySelector("label");
    if (label) label.textContent = `Descuento ${i + 1}`;
  });
  contador = cartas.length;
}

function calcular() {
  errorGlobal.textContent = "";

  const precio = parseFloat(inputPrecio.value);

  if (!inputPrecio.value || isNaN(precio) || precio <= 0) {
    errorGlobal.textContent = "Ingresá un precio válido mayor a 0.";
    return;
  }

  const inputs = contenedor.querySelectorAll(".input-descuento");
  const descuentos = [];
  let hayError = false;

  inputs.forEach((input) => {
    const valor = parseFloat(input.value);
    const span = input.closest(".carta").querySelector(".error-campo");

    if (!input.value || isNaN(valor) || valor < 1 || valor > 90) {
      span.textContent = "El descuento debe estar entre 1% y 90%.";
      input.classList.add("input-error");
      hayError = true;
    } else {
      span.textContent = "";
      input.classList.remove("input-error");
      descuentos.push(valor);
    }
  });

  if (hayError) return;

  // aplicar descuentos encadenados
  // cada descuento se aplica sobre el precio ya reducido, no sobre el original
  let precioActual = precio;
  divPasos.innerHTML = "";

  descuentos.forEach((porcentaje, i) => {
    const monto = precioActual * (porcentaje / 100);
    const nuevo = precioActual - monto;

    const p = document.createElement("p");
    p.classList.add("paso");
    p.innerHTML = `<strong>Descuento ${i + 1} (${porcentaje}%):</strong> $${fmt(precioActual)} − $${fmt(monto)} = <strong>$${fmt(nuevo)}</strong>`;
    divPasos.appendChild(p);

    precioActual = nuevo;
  });

  const ahorrado = precio - precioActual;
  spanFinal.textContent = `$${fmt(precioActual)}`;
  spanAhorro.textContent = `$${fmt(ahorrado)}`;

  document.querySelector(".resultados").classList.add("activo");
}

function limpiar() {
  inputPrecio.value = "";
  errorGlobal.textContent = "";

  const cartas = contenedor.querySelectorAll(".carta");
  cartas.forEach((c, i) => {
    if (i === 0) {
      c.querySelector(".input-descuento").value = "";
      c.querySelector(".input-descuento").classList.remove("input-error");
      c.querySelector(".error-campo").textContent = "";
    } else {
      c.remove();
    }
  });

  contador = 1;
  spanFinal.textContent = "$-";
  spanAhorro.textContent = "$-";
  divPasos.innerHTML = "";
  document.querySelector(".resultados").classList.remove("activo");
}

function fmt(n) {
  return n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}