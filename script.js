document.addEventListener('DOMContentLoaded', () => {


    // ==========================================
    // 0. GENERADOR DE GUARDIANES (ANIMAL ALEATORIO)
    // ==========================================
    const guardianes = [
        {
            nombre: "Lechuza",
            titulo: "La Observadora Sabia",
            imagen: "url('recursos/lechuza.png')"
        },
        {
            nombre: "Cuervo",
            titulo: "El Guardián de las Memorias",
            imagen: "url('recursos/cuervo.png')"
        },
        {
            nombre: "Lobo",
            titulo: "El Rastreador de Caminos",
            imagen: "url('recursos/lobo.png')"
        },
        {
            nombre: "Oso",
            titulo: "El Guardián de las Memorias",
            imagen: "url('recursos/oso.png')"
        },
        {
            nombre: "Ciervo",
            titulo: "El Caminante del Bosque",
            imagen: "url('recursos/ciervo.png')"
        }
    ];

    // Seleccionamos un guardián al azar
    const guardianAleatorio = guardianes[Math.floor(Math.random() * guardianes.length)];

    // Inyectamos los datos del guardián en el HTML
    document.getElementById('animal-name').textContent = guardianAleatorio.nombre;
    document.getElementById('animal-desc').textContent = guardianAleatorio.titulo;
    document.getElementById('animal-layer').style.backgroundImage = guardianAleatorio.imagen;

    // ==========================================
    // 1. INICIALIZAR LENIS (Smooth Scroll)
    // ==========================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ==========================================
    // 2. LÓGICA DEL HERO (Mouse + Touch)
    // ==========================================
    const hero = document.querySelector('.hero-3d');

    // Función única para actualizar las variables CSS
    function updateHeroPosition(x, y, clientX, clientY) {
        const xAxis = (window.innerWidth / 2 - x);
        const yAxis = (window.innerHeight / 2 - y);

        hero.style.setProperty('--mouseX', `${xAxis}px`);
        hero.style.setProperty('--mouseY', `${yAxis}px`);
        hero.style.setProperty('--cursorX', `${clientX}px`);
        hero.style.setProperty('--cursorY', `${clientY}px`);
    }

    // Evento para Mouse
    document.addEventListener('mousemove', (e) => {
        updateHeroPosition(e.pageX, e.pageY, e.clientX, e.clientY);
    });

    // Evento para Pantallas Táctiles (Móvil)
    document.addEventListener('touchmove', (e) => {
        // Usamos el primer dedo que toca la pantalla
        const touch = e.touches[0];
        updateHeroPosition(touch.pageX, touch.pageY, touch.clientX, touch.clientY);
    }, { passive: true });
    // ==========================================
    // 3. ANIMACIÓN DEL MANIFIESTO (SplitType)
    // ==========================================
    gsap.registerPlugin(ScrollTrigger);

    const manifesto = new SplitType('#manifesto', { types: 'words' });

    gsap.to(manifesto.words, {
        scrollTrigger: {
            trigger: '.manifesto-section',
            start: 'top 80%',
            end: 'bottom 50%',
            scrub: 1,
        },
        opacity: 1,
        y: 0,
        stagger: 0.1,
        ease: 'power2.out'
    });

    // ==========================================
    // 6. ANIMACIÓN AVANZADA: OBRAS DESTACADAS
    // ==========================================
    const showcaseRows = document.querySelectorAll('.showcase-row');

    showcaseRows.forEach(row => {
        const mask = row.querySelector('.image-mask');
        const bg = row.querySelector('.image-bg');

        // 1. Revelado de la máscara (Clip-path)
        gsap.to(mask, {
            scrollTrigger: {
                trigger: row,
                start: 'top 75%', // Inicia cuando la fila está al 75% de la pantalla
            },
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // Se abre completamente
            duration: 1.5,
            ease: 'power3.inOut'
        });

        // 2. Efecto Parallax en la imagen de fondo
        gsap.to(bg, {
            scrollTrigger: {
                trigger: row,
                start: 'top bottom', // Inicia desde que asoma en la pantalla
                end: 'bottom top',   // Termina cuando sale por arriba
                scrub: true,         // Vinculado totalmente a la rueda del ratón
            },
            y: '-20%', // Sube la imagen un 20% mientras bajas el scroll
            ease: 'none'
        });

        // 3. Pequeño efecto de escala al revelar
        gsap.to(bg, {
            scrollTrigger: {
                trigger: row,
                start: 'top 75%',
            },
            scale: 1, // Regresa a su tamaño original
            duration: 2,
            ease: 'power3.out'
        });
    });// ==========================================
    // 7. ENTRADA EN CASCADA DE LA GALERÍA
    // ==========================================
    const galleryCards = document.querySelectorAll('.fade-card');

    if (galleryCards.length > 0) {
        gsap.fromTo(galleryCards,
            { opacity: 0, y: 50 },
            {
                scrollTrigger: {
                    trigger: '.gallery-grid',
                    start: 'top 80%', // Inicia cuando la cuadrícula toca el 80% del viewport
                },
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15, // Retraso de 0.15s entre cada tarjeta
                ease: 'power3.out'
            }
        );
    }
    // ==========================================
    // 6. SCROLL HORIZONTAL DE ARTISTAS (GSAP)
    // ==========================================
    const track = document.querySelector('.artists-track');

    if (track) {
        // Función para calcular dinámicamente cuánto debe moverse el contenedor
        // Es el ancho total de los 13 elementos menos el ancho de la pantalla
        function getScrollAmount() {
            let trackWidth = track.scrollWidth;
            return -(trackWidth - window.innerWidth + window.innerWidth * 0.1);
        }

        // Animación que mueve el track en el eje X
        const tween = gsap.to(track, {
            x: getScrollAmount,
            ease: "none"
        });

        // ScrollTrigger que "fija" la sección y enlaza el movimiento al scroll
        ScrollTrigger.create({
            trigger: ".artists-pin-wrapper",
            start: "top 10%", // Inicia cuando el contenedor llega cerca del tope de la pantalla
            end: () => `+=${getScrollAmount() * -1}`, // La duración del scroll es proporcional al ancho de las tarjetas
            pin: true,
            animation: tween,
            scrub: 1, // Suavizado de 1 segundo para que no se sienta rígido
            invalidateOnRefresh: true // Recalcula si el usuario cambia el tamaño de la ventana
        });
    }
    // ==========================================
    // 5. ANIMACIONES CONVENCIONALES (FADE-UP)
    // ==========================================
    const fadeElements = document.querySelectorAll('.fade-up');

    fadeElements.forEach(element => {
        gsap.set(element, { opacity: 0, y: 50 });

        gsap.to(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });
    // ==========================================
    // 8. PARALLAX EN LA PORTADA DEL PERFIL
    // ==========================================
    const profileCover = document.querySelector('.profile-cover');

    if (profileCover) {
        gsap.to(profileCover, {
            scrollTrigger: {
                trigger: '.profile-hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            },
            y: '20%', // Mueve la imagen hacia abajo mientras haces scroll
            ease: 'none'
        });
    }
    // ==========================================
    // 10. ANIMACIÓN PRO: REVELADO DE TEXTO (SPLIT TYPE)
    // ==========================================
    // Aplica a la biografía del nuevo perfil
    if (document.querySelector('#split-bio')) {
        const bioText = new SplitType('#split-bio p', { types: 'lines' });

        // Animamos cada línea a medida que entra en el área visible
        gsap.from(bioText.lines, {
            scrollTrigger: {
                trigger: '#split-bio',
                start: 'top 80%', // Empieza a animar cuando el texto llega al 80% de la pantalla
            },
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.1, // Retraso entre líneas
            ease: 'power3.out'
        });

        // Pequeño Parallax en el fondo de la foto del panel sticky
        const panelBg = document.querySelector('.panel-background');
        gsap.to(panelBg, {
            scrollTrigger: {
                trigger: '.profile-scroll-content',
                start: 'top top',
                end: 'bottom bottom',
                scrub: true
            },
            y: '10%', // Se mueve suavemente mientras el panel derecho baja
            ease: 'none'
        });
    }
});