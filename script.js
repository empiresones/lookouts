/**
 * ========================================================
 * THE LOOKOUTS - SCRIPT PRINCIPAL
 * ========================================================
 */

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. LÓGICA DEL CARRUSEL (HERO)
    // ==========================================
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');

    let currentIndex = 0;
    let autoPlayInterval;
    const intervalTime = 6000; // 6 segundos por slide

    // Función principal para cambiar de diapositiva
    const showSlide = (index) => {
        // Remover clase activa de todos
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Manejar límites del índice
        if (index < 0) {
            currentIndex = slides.length - 1;
        } else if (index >= slides.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        // Añadir clase activa al actual
        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    };

    // Funciones de navegación manual
    const nextSlide = () => showSlide(currentIndex + 1);
    const prevSlide = () => showSlide(currentIndex - 1);

    // Event Listeners para botones (si existen en el HTML)
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
    }

    // Event Listeners para los puntos indicadores
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetAutoPlay();
            });
        });
    }

    // Funciones de Autoplay
    const startAutoPlay = () => {
        // Solo iniciamos el autoplay si hay más de un slide
        if (slides.length > 1) {
            autoPlayInterval = setInterval(nextSlide, intervalTime);
        }
    };

    const resetAutoPlay = () => {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    };

    // Iniciar el carrusel al cargar la página
    startAutoPlay();


    // ==========================================
    // 2. HEADER DINÁMICO (Efecto Glassmorphism al bajar)
    // ==========================================
    const header = document.getElementById('site-header');

    if (header) {
        window.addEventListener('scroll', () => {
            // Si bajamos más de 50px, el header se vuelve borroso/opaco
            if (window.scrollY > 50) {
                header.classList.add('header-scrolled');
            } else {
                // Si estamos hasta arriba, se vuelve transparente
                header.classList.remove('header-scrolled');
            }
        });
    }


    // ==========================================
    // 3. ANIMACIONES AL HACER SCROLL (Intersection Observer)
    // ==========================================
    // Seleccionamos todos los elementos que tengan la clase .animate-on-scroll
    const scrollElements = document.querySelectorAll('.animate-on-scroll');

    // Configuración del observador
    const observerOptions = {
        threshold: 0.15, // El elemento debe estar 15% visible en pantalla para dispararse
        rootMargin: "0px 0px -50px 0px" // Dispara la animación un poco antes de llegar al borde inferior
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Agregamos la clase que activa la animación CSS (fade in / slide up)
                entry.target.classList.add('is-visible');
                // Dejamos de observar el elemento para que la animación solo ocurra una vez
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Asignamos el observador a cada elemento encontrado
    if (scrollElements.length > 0) {
        scrollElements.forEach(el => {
            scrollObserver.observe(el);
        });
    }
    // ==========================================
    // 4. MENÚ HAMBURGUESA Y OVERLAY
    // ==========================================
    const menuToggle = document.getElementById('menu-toggle');
    const fullscreenNav = document.getElementById('fullscreen-nav');

    if (menuToggle && fullscreenNav) {
        // Abrir y cerrar el menú al hacer clic en la hamburguesa
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            fullscreenNav.classList.toggle('active');

            // Opcional: Evitar que el usuario haga scroll en el fondo cuando el menú está abierto
            if (fullscreenNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Cerrar el menú automáticamente al hacer clic en uno de los enlaces
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                fullscreenNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
});