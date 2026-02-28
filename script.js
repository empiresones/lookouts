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
    // 4. ANIMACIÓN DE ARCHIVOS (Cascada y 3D Tilt)
    // ==========================================
    const cards = document.querySelectorAll('.archive-card');

    gsap.to(cards, {
        scrollTrigger: {
            trigger: '.archives-section',
            start: 'top 75%',
        },
        autoAlpha: 1,
        y: -30,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out'
    });

    cards.forEach(card => {
        const inner = card.querySelector('.card-inner');
        const glow = card.querySelector('.card-glow');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            if (glow) {
                glow.style.left = `${x}px`;
                glow.style.top = `${y}px`;
            }
        });

        card.addEventListener('mouseleave', () => {
            inner.style.transform = `rotateX(0deg) rotateY(0deg)`;
            inner.style.transition = `transform 0.5s ease, border-color 0.4s ease`;
        });

        card.addEventListener('mouseenter', () => {
            inner.style.transition = `border-color 0.4s ease`;
        });
    });

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

});