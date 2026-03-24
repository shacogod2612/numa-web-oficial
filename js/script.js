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