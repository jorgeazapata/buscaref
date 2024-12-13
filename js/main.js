// Datos de productos (simulación de una base de datos)
const productos = [
    {
        nombre: "Solomito",
        plu: "12345",
        codigoBalanza: "ABC123",
        codigoBarras: "2812345000000",
        precio: 10.99
    },
    {
        nombre: "Solomo Redondo",
        plu: "67890",
        codigoBalanza: "DEF456",
        codigoBarras: "6789012345678",
        precio: 5.99
    },
    {
        nombre: "Punta de Anca",
        plu: "34567",
        codigoBalanza: "GHI789",
        codigoBarras: "3456789012345",
        precio: 7.99
    },
    {
        nombre: "Chorizo Mixto QB",
        plu: "00000",
        codigoBalanza: "N/A",
        codigoBarras: "7709554245440",
        precio: 12990
    },
    {
        nombre: "CHORIZO SANTA ROSANO QB",
        plu: "62817",
        codigoBalanza: "N/A",
        codigoBarras: "7708900994919",
        precio: 12990
    },
    {
        nombre: "HAMBURGUESA QB",
        plu: "63472",
        codigoBalanza: "N/A",
        codigoBarras: "7708409301010",
        precio: 17900
    },
    {
        nombre: "SALCHICHA DIA A DIA",
        plu: "13268",
        codigoBalanza: "N/A",
        codigoBarras: "7708433165336",
        precio: 4990
    },
    {
        nombre: "SALCHICHA EXTRA TIPO PERRO QB",
        plu: "13269",
        codigoBalanza: "N/A",
        codigoBarras: "7708433165459",
        precio: 9990
    },
    {
        nombre: "CHISTORRA QB",
        plu: "81785",
        codigoBalanza: "N/A",
        codigoBarras: "7709554245471",
        precio: 9990
    },
    {
        nombre: "BUTIFARRA SOLEDEÑA QB",
        plu: "46263",
        codigoBalanza: "N/A",
        codigoBarras: "7709692425728",
        precio: 10790
    },
    {
        nombre: "CHORIZO ARGENTINO QB",
        plu: "45927",
        codigoBalanza: "N/A",
        codigoBarras: "7708900994926",
        precio: 13950
    },
    {
        nombre: "Golosa mama ines",
        plu: "05326",
        codigoBalanza: "NA",
        codigoBarras: "7705326018052",
        precio: 7.99
    }
];

// Obtener elementos del DOM
const nombreProductoInput = document.getElementById("nombre-producto");
const codigoBarrasInput = document.getElementById("codigo-barras");
const sugerenciasDiv = document.getElementById("sugerencias");
const resultadoBusqueda = document.getElementById("resultado-busqueda");
const btnEscanear = document.getElementById("btn-escanear");
const contenedorCamara = document.getElementById("contenedor-camara");

// Función para mostrar sugerencias
nombreProductoInput.addEventListener("input", () => {
    const query = nombreProductoInput.value.toLowerCase();
    sugerenciasDiv.innerHTML = '';

    if (query.length >= 3) {
        const coincidencias = productos.filter(producto => 
            producto.nombre.toLowerCase().includes(query)
        );

        coincidencias.forEach(producto => {
            const div = document.createElement("div");
            div.textContent = producto.nombre;
            div.addEventListener("click", () => {
                nombreProductoInput.value = producto.nombre;
                sugerenciasDiv.innerHTML = '';
            });
            sugerenciasDiv.appendChild(div);
        });
    }
});

// Función para buscar el producto al hacer clic en el botón
document.getElementById("btn-buscar").addEventListener("click", (e) => {
    e.preventDefault();
    const nombreProducto = nombreProductoInput.value.trim();
    const codigoBarras = codigoBarrasInput.value.trim();

    const productoEncontrado = productos.find((producto) => 
        producto.nombre.toLowerCase() === nombreProducto.toLowerCase() ||
        producto.codigoBarras === codigoBarras
    );

    if (productoEncontrado) {
        resultadoBusqueda.innerHTML = `
            <h2>Resultado de la búsqueda</h2>
            <p>Nombre: ${productoEncontrado.nombre}</p>
            <p>PLU: ${productoEncontrado.plu}</p>
            <p>Código de balanza: ${productoEncontrado.codigoBalanza}</p>
            <p>Código de barras: ${productoEncontrado.codigoBarras}</p>
            <p>Precio: $${productoEncontrado.precio}</p>
        `;
    } else {
        resultadoBusqueda.innerHTML = `
            <h2>No se encontró el producto</h2>
            <p>Intenta nuevamente con un nombre de producto o código de barras diferente.</p>
        `;
    }
});

// Función para inicializar QuaggaJS y escanear código de barras
btnEscanear.addEventListener("click", () => {
    Quagga.init({
        inputStream: {
            type: "LiveStream",
            target: contenedorCamara,
            constraints: {
                facingMode: "environment" // Usa la cámara trasera
            }
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "upc_reader", "upc_e_reader", "codabar_reader"]
        }
    }, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Quagga inicializado correctamente");
        Quagga.start();
    });

    Quagga.onDetected((result) => {
        const codigoBarras = result.codeResult.code;
        codigoBarrasInput.value = codigoBarras;
        Quagga.stop();
        contenedorCamara.innerHTML = ''; // Limpia el contenedor de la cámara
        alert(`Código de barras detectado: ${codigoBarras}`);
    });
});

// Función para actualizar el contador de visitas
function actualizarContadorVisitas() {
    const contador = document.getElementById('visit-counter');
    let visitas = localStorage.getItem('visitas');

    if (!visitas) {
        visitas = 0;
    }

    visitas++;
    localStorage.setItem('visitas', visitas);
    contador.textContent = visitas;
}

// Llama a la función al cargar la página
document.addEventListener('DOMContentLoaded', actualizarContadorVisitas);
