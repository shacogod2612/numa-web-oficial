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

// carrito de compra //
document.addEventListener('DOMContentLoaded', () => {
    // --- VARIABLES DEL CARRITO ---
    let carrito = [];
    const cartCountElement = document.querySelector('.cart-count');

    // --- VARIABLES DEL MODAL ---
    const modal = document.getElementById("product-modal");
    const closeModal = document.querySelector(".close-modal");

    // --- 1. FUNCIÓN PARA ACTUALIZAR EL CONTADOR DEL NAVBAR ---
    function actualizarContador() {
        const totalItems = carrito.length;
        cartCountElement.innerText = `(${totalItems})`;
        
        // Efecto visual de rebote al añadir
        cartCountElement.style.transform = "scale(1.2)";
        setTimeout(() => cartCountElement.style.transform = "scale(1)", 200);
    }

    // --- 2. LÓGICA DE LAS TARJETAS DE PRODUCTO ---
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        // Seleccionamos el botón de añadir de cada tarjeta
        const btnAdd = card.querySelector('.btn-add');
        
        // A. CLIC EN EL BOTÓN "AÑADIR" (Directo al carrito)
        btnAdd.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que se abra el modal al dar clic al botón
            
            const producto = {
                titulo: card.querySelector('h3').innerText,
                precio: card.querySelector('.price').innerText,
                img: card.querySelector('img').src
            };

            carrito.push(producto);
            actualizarContador();
            
            // Feedback visual en el botón
            const originalText = btnAdd.innerText;
            btnAdd.innerText = "¡AÑADIDO!";
            btnAdd.style.background = "#25D366";
            btnAdd.style.color = "#fff";
            
            setTimeout(() => {
                btnAdd.innerText = originalText;
                btnAdd.style.background = "transparent";
                btnAdd.style.color = "#000";
            }, 800);
        });

        // B. CLIC EN LA TARJETA (Abre el Modal)
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').innerText;
            const price = card.querySelector('.price').innerText;
            const img = card.querySelector('img').src;

            document.getElementById('modal-title').innerText = title;
            document.getElementById('modal-price').innerText = price;
            document.getElementById('modal-img').src = img;

            // Configurar WhatsApp del Modal
            const waNumber = "51900006426";
            const waMessage = `Hola Numa! Me interesa: ${title} (${price})`;
            document.getElementById('modal-wa-btn').href = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

            modal.style.display = "flex";
        });
    });

    // --- 3. CERRAR MODAL ---
    if(closeModal) {
        closeModal.onclick = () => modal.style.display = "none";
    }
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = "none";
    };
});