document.addEventListener('DOMContentLoaded', () => {
    let carrito = JSON.parse(localStorage.getItem('carritoNuma')) || [];
    let tallaSeleccionada = "";

    const sideCart = document.getElementById('side-cart');
    const overlay = document.getElementById('overlay');
    const modal = document.getElementById("product-modal");
    const totalElem = document.getElementById('cart-total');
    const countElem = document.querySelector('.cart-count');
    const btnAniadir = document.getElementById('modal-add-to-cart-btn');

    // --- 1. RENDERIZADO (CON PRECIO CORREGIDO) ---
    function renderCarrito() {
        const container = document.getElementById('cart-items-container');
        container.innerHTML = ''; 
        let total = 0;

        carrito.forEach((prod, index) => {
            // Limpieza agresiva: quitamos todo lo que no sea número
            let soloNumeros = prod.precio.replace(/\D/g, ''); 
            let valor = parseFloat(soloNumeros) / 100; // S/. 99.00 -> 9900 -> 99.00
            
            if (!isNaN(valor)) total += valor;

            container.innerHTML += `
                <div class="cart-item">
                    <img src="${prod.img}">
                    <div class="cart-item-info">
                        <h4>${prod.titulo}</h4>
                        <p>Talla: <b>${prod.talla}</b></p>
                        <p><b>${prod.precio}</b></p>
                    </div>
                    <span class="remove-item" onclick="eliminarDelCarrito(${index})">&times;</span>
                </div>`;
        });

        totalElem.innerText = `S/ ${total.toFixed(2)}`;
        countElem.innerText = `(${carrito.length})`;
        localStorage.setItem('carritoNuma', JSON.stringify(carrito));
    }

    window.eliminarDelCarrito = (index) => {
        carrito.splice(index, 1);
        renderCarrito();
    };

    // --- 2. ABRIR CARRITO (CLIC EN ICONO) ---
    const iconCart = document.querySelector('.fa-cart-shopping').parentElement;
    iconCart.onclick = (e) => {
        e.preventDefault();
        sideCart.classList.add('active');
        overlay.classList.add('active');
    };

    // --- 3. MANEJO DE MODAL Y TALLAS ---
    document.querySelectorAll('.product-card').forEach(card => {
        card.onclick = () => {
            tallaSeleccionada = "";
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('modal-title').innerText = card.querySelector('h3').innerText;
            document.getElementById('modal-price').innerText = card.querySelector('.price').innerText;
            document.getElementById('modal-img').src = card.querySelector('img').src;
            modal.style.display = "flex";
        };
    });

    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.onclick = function(e) {
            e.stopPropagation();
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            tallaSeleccionada = this.innerText;
        };
    });

    // --- 4. AÑADIR AL CARRITO ---
    btnAniadir.onclick = (e) => {
        e.preventDefault();
        if (!tallaSeleccionada) return alert("Elige una talla");

        carrito.push({
            titulo: document.getElementById('modal-title').innerText,
            precio: document.getElementById('modal-price').innerText,
            img: document.getElementById('modal-img').src,
            talla: tallaSeleccionada
        });

        renderCarrito();
        modal.style.display = "none";
        sideCart.classList.add('active');
        overlay.classList.add('active');
    };

    // --- 5. WHATSAPP Y CIERRES ---
    document.getElementById('checkout-btn').onclick = () => {
        let msg = "¡Hola Numa! Pedido:%0A";
        carrito.forEach(p => msg += `- ${p.titulo} [${p.talla}] (${p.precio})%0A`);
        msg += `%0A*TOTAL: ${totalElem.innerText}*`;
        window.open(`https://wa.me/51900006426?text=${msg}`, '_blank');
    };

    const cerrar = () => {
        modal.style.display = "none";
        sideCart.classList.remove('active');
        overlay.classList.remove('active');
    };

    document.querySelector('.close-modal').onclick = cerrar;
    document.querySelector('.close-cart').onclick = cerrar;
    overlay.onclick = cerrar;

    renderCarrito();
});
