document.addEventListener("DOMContentLoaded", function() {
    mostrarProductos();
    actualizarCarrito();

    const carritoBtn = document.getElementById("ver-carrito");
    const carritoModal = document.getElementById("carrito-modal");
    const vaciarBtn = document.getElementById("vaciar-carrito");
    const confirmarBtn = document.getElementById("confirmar-compra");
    const cerrarModalBtn = document.getElementById("cerrar-modal");
    const cargarRecetasBtn = document.getElementById("cargarRecetasBtn");

    carritoBtn.addEventListener("click", () => {
        carritoModal.classList.toggle("modal-open");
    });

    cerrarModalBtn.addEventListener("click", () => {
        carritoModal.classList.remove("modal-open");
    });

    vaciarBtn.addEventListener("click", () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, vaciar carrito',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("carrito");
                actualizarCarrito();
                Toastify({
                    text: "Carrito vaciado",
                    backgroundColor: "red",
                    duration: 3000
                }).showToast();
            }
        });
    });

    confirmarBtn.addEventListener("click", () => {
        const DateTime = luxon.DateTime;
        const fechaCompra = DateTime.now().toLocaleString(DateTime.DATE_FULL);
        
        Swal.fire({
            title: 'Compra confirmada',
            text: `¡Gracias por tu compra! Fecha: ${fechaCompra}`,
            icon: 'success',
            confirmButtonText: 'Cerrar'
        }).then(() => {
            localStorage.removeItem("carrito");
            actualizarCarrito();
            carritoModal.classList.remove("modal-open");
            document.getElementById('fecha-compra').textContent = `Fecha de compra: ${fechaCompra}`;
        });
    });

    cargarRecetasBtn.addEventListener('click', cargarRecetas);
});

function mostrarProductos() {
    const productos = [
        { id: 1, nombre: "Pastel de Chocolate", precio: 30000, imagen: "img/pastel-de-chocolate.jpg" },
        { id: 2, nombre: "Tarta de Fresa", precio: 28000, imagen: "img/torta-de-fresas.jpg" },
        { id: 3, nombre: "Cheesecake", precio: 35000, imagen: "img/cheesecake.jpeg" }
    ];

    const contenedorProductos = document.getElementById("lista-productos");
    contenedorProductos.innerHTML = "";

    productos.forEach(producto => {
        const divProducto = crearElemento("div", "producto");
        const imgProducto = crearElemento("img");
        imgProducto.src = producto.imagen;
        imgProducto.alt = producto.nombre;
        const h3Producto = crearElemento("h3", "", producto.nombre);
        const pPrecio = crearElemento("p", "", `$${producto.precio}`);
        const botonSeleccionar = crearElemento("button", "boton-seleccionar", "Agregar al carrito");
        
        botonSeleccionar.addEventListener("click", () => {
            agregarAlCarrito(producto.id, producto.nombre, producto.precio);
            Toastify({
                text: `${producto.nombre} agregado al carrito`,
                backgroundColor: "green",
                duration: 3000
            }).showToast();
        });

        divProducto.appendChild(imgProducto);
        divProducto.appendChild(h3Producto);
        divProducto.appendChild(pPrecio);
        divProducto.appendChild(botonSeleccionar);

        contenedorProductos.appendChild(divProducto);
    });
}

function agregarAlCarrito(id, nombre, precio) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const index = carrito.findIndex(producto => producto.id === id);

    // Uso del operador ternario para incrementar la cantidad o añadir un nuevo producto
    index !== -1
        ? carrito[index].cantidad++
        : carrito.push({ id, nombre, precio, cantidad: 1 });

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
}

function actualizarCarrito() {
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCompra = document.getElementById("total-compra");
    
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    listaCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach(producto => {
        const li = crearElemento("li", "", `${producto.nombre} x${producto.cantidad} - $${(producto.precio * producto.cantidad).toLocaleString()}`);
        const btnEliminar = crearElemento("button", "", "Eliminar");
        
        btnEliminar.addEventListener("click", () => {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "Eliminarás este producto del carrito",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    carrito = carrito.filter(item => item.id !== producto.id);
                    localStorage.setItem("carrito", JSON.stringify(carrito));
                    actualizarCarrito();
                    Toastify({
                        text: `${producto.nombre} eliminado`,
                        backgroundColor: "red",
                        duration: 3000
                    }).showToast();
                }
            });
        });

        li.appendChild(btnEliminar);
        listaCarrito.appendChild(li);

        total += producto.precio * producto.cantidad;
    });

    totalCompra.textContent = `$${total.toLocaleString()}`;
}

function crearElemento(tag, clase, contenido) {
    const elemento = document.createElement(tag);
    if (clase) elemento.className = clase;
    if (contenido) elemento.textContent = contenido;
    return elemento;
}

function cargarRecetas() {
    const url = "https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert";
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const recetas = data.meals;
            const contenedorRecetas = document.getElementById("lista-recetas");
            contenedorRecetas.innerHTML = "";

            recetas.forEach(receta => {
                const divReceta = crearElemento("div", "receta");
                const imgReceta = crearElemento("img");
                imgReceta.src = receta.strMealThumb;
                imgReceta.alt = receta.strMeal;
                const h3Receta = crearElemento("h3", "", receta.strMeal);
                
                divReceta.appendChild(imgReceta);
                divReceta.appendChild(h3Receta);

                contenedorRecetas.appendChild(divReceta);
            });
        })
        .catch(error => console.error('Error al cargar recetas:', error));
}



