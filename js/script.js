const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');
const overlay = document.getElementById('overlay');
const menuIcon = mobileMenu.querySelector('i');

// Función para abrir/cerrar
function toggleMenu() {
    navMenu.classList.toggle('active');
    overlay.classList.toggle('active');

    // Cambiar el icono de hamburguesa a X
    if (navMenu.classList.contains('active')) {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-xmark'); // Icono de X en Font Awesome
    } else {
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
    }
}

// Evento al hacer clic en el botón
mobileMenu.addEventListener('click', toggleMenu);

// Cerrar el menú si hacen clic en el fondo oscuro
overlay.addEventListener('click', toggleMenu);

// Cerrar el menú si hacen clic en un enlace
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', toggleMenu);
});

const modal = document.getElementById("product-modal");
const closeModal = document.querySelector(".close-modal");

// Seleccionamos todas las tarjetas de producto
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
        // Sacamos la info de la tarjeta
        const title = card.querySelector('h3').innerText;
        const price = card.querySelector('.price').innerText;
        const img = card.querySelector('img').src;

        // Metemos la info al modal
        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-price').innerText = price;
        document.getElementById('modal-img').src = img;

        // Mostramos el modal
        modal.style.display = "flex";
    });
});

// Cerrar al darle a la X
closeModal.onclick = () => modal.style.display = "none";

// Cerrar si hacen clic fuera del cuadro
window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
}

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. VARIABLES GLOBALES ---
    let carrito = JSON.parse(localStorage.getItem('carritoNuma')) || [];
    let tallaSeleccionada = ""; // Para rastrear la talla en el modal

    const sideCart = document.getElementById('side-cart');
    const overlay = document.getElementById('overlay');
    const modal = document.getElementById("product-modal");
    const botonesTalla = document.querySelectorAll('.size-btn');

    // --- 2. FUNCIÓN RENDER CARRITO (Dibuja la lista y guarda en LocalStorage) ---
    function renderCarrito() {
        const container = document.getElementById('cart-items-container');
        const totalElem = document.getElementById('cart-total');
        const countElem = document.querySelector('.cart-count');
        
        container.innerHTML = '';
        let total = 0;

        if (carrito.length === 0) {
            container.innerHTML = '<p class="empty-msg">Tu carrito está vacío.</p>';
            totalElem.innerText = "S/ 0.00";
        } else {
            carrito.forEach((prod, index) => {
                const precio = parseFloat(prod.precio.replace('S/. ', '').replace(',', ''));
                total += precio;
                container.innerHTML += `
                    <div class="cart-item">
                        <img src="${prod.img}">
                        <div class="cart-item-info">
                            <h4>${prod.titulo}</h4>
                            <p>${prod.precio}</p>
                        </div>
                        <span class="remove-item" data-index="${index}">&times;</span>
                    </div>`;
            });
        }
        totalElem.innerText = `S/ ${total.toFixed(2)}`;
        countElem.innerText = `(${carrito.length})`;
        localStorage.setItem('carritoNuma', JSON.stringify(carrito));

        // Botones eliminar del carrito
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.onclick = (e) => {
                carrito.splice(e.target.dataset.index, 1);
                renderCarrito();
            };
        });
    }

    // --- 3. LÓGICA DE SELECCIÓN DE TALLAS (NUEVO) ---
    botonesTalla.forEach(boton => {
        boton.onclick = function() {
            // Quitar clase activa a todos y ponerla al actual
            botonesTalla.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Guardar la talla elegida
            tallaSeleccionada = this.innerText;
            
            // Actualizar link de WhatsApp del modal
            actualizarLinkWhatsAppModal();
        };
    });

    function actualizarLinkWhatsAppModal() {
        const titulo = document.getElementById('modal-title').innerText;
        const precio = document.getElementById('modal-price').innerText;
        const btnWA = document.getElementById('modal-wa-btn');
        const textoTalla = tallaSeleccionada ? ` en Talla: ${tallaSeleccionada}` : "";
        
        const mensaje = `Hola Numa! Me interesa: ${titulo}${textoTalla} (${precio})`;
        btnWA.href = `https://wa.me/51900006426?text=${encodeURIComponent(mensaje)}`;
    }

    // --- 4. EVENTOS DE PRODUCTOS (Cards) ---
    document.querySelectorAll('.product-card').forEach(card => {
        // Clic en el botón Añadir
        card.querySelector('.btn-add').onclick = (e) => {
            e.stopPropagation();
            carrito.push({
                titulo: card.querySelector('h3').innerText,
                precio: card.querySelector('.price').innerText,
                img: card.querySelector('img').src
            });
            renderCarrito();
            sideCart.classList.add('active');
            overlay.classList.add('active');
        };

        // Clic en la Card (Abrir Modal)
        card.onclick = () => {
            // Reset de tallas al abrir
            tallaSeleccionada = "";
            botonesTalla.forEach(btn => btn.classList.remove('active'));
            
            document.getElementById('modal-title').innerText = card.querySelector('h3').innerText;
            document.getElementById('modal-price').innerText = card.querySelector('.price').innerText;
            document.getElementById('modal-img').src = card.querySelector('img').src;
            
            actualizarLinkWhatsAppModal(); // Genera link inicial sin talla
            modal.style.display = "flex";
        };
    });

    // --- 5. BOTÓN WHATSAPP DEL CARRITO (SIDE CART) ---
    document.getElementById('checkout-btn').onclick = () => {
        if (carrito.length === 0) return alert("Carrito vacío");
        let msg = "Hola Numa! Mi pedido:%0A";
        carrito.forEach(p => msg += `- ${p.titulo} (${p.precio})%0A`);
        msg += `%0A*TOTAL: ${document.getElementById('cart-total').innerText}*`;
        window.open(`https://wa.me/51900006426?text=${msg}`, '_blank');
    };

    // --- 6. CERRAR TODO ---
    document.querySelector('.close-modal').onclick = () => modal.style.display = "none";
    document.querySelector('.close-cart').onclick = () => {
        sideCart.classList.remove('active');
        overlay.classList.remove('active');
    };
    
    // Al cargar la página, dibujar lo que haya guardado
    renderCarrito();
});