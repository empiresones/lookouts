/**
 * ========================================================
 * THE LOOKOUTS - SCRIPT PRINCIPAL (V. 2026)
 * ========================================================
 */

document.addEventListener("DOMContentLoaded", () => {

    // 1. LÓGICA DEL CARRUSEL (HERO) -
    // ------------------------------------------
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');

    let currentIndex = 0;
    let autoPlayInterval;
    const intervalTime = 6000;

    const showSlide = (index) => {
        if (slides.length === 0) return;
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        if (index < 0) currentIndex = slides.length - 1;
        else if (index >= slides.length) currentIndex = 0;
        else currentIndex = index;

        slides[currentIndex].classList.add('active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    };

    if (slides.length > 0) {
        const nextSlide = () => showSlide(currentIndex + 1);
        const prevSlide = () => showSlide(currentIndex - 1);

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
            prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => { showSlide(index); resetAutoPlay(); });
        });

        const startAutoPlay = () => { if (slides.length > 1) autoPlayInterval = setInterval(nextSlide, intervalTime); };
        const resetAutoPlay = () => { clearInterval(autoPlayInterval); startAutoPlay(); };

        startAutoPlay();
    }

    // 2. HEADER DINÁMICO Y MENÚ -
    // ------------------------------------------
    const header = document.getElementById('site-header');
    const menuToggle = document.getElementById('menu-toggle');
    const fullscreenNav = document.getElementById('fullscreen-nav');

    if (header) {
        window.addEventListener('scroll', () => {
            window.scrollY > 50 ? header.classList.add('header-scrolled') : header.classList.remove('header-scrolled');
        });
    }

    if (menuToggle && fullscreenNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            fullscreenNav.classList.toggle('active');
            document.body.style.overflow = fullscreenNav.classList.contains('active') ? 'hidden' : '';
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                fullscreenNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 3. LÓGICA DE REGISTRO (MODAL Y GOOGLE SHEETS) -
    // ------------------------------------------
    const modal = document.getElementById("rsvp-modal");
    const btnRsvp = document.querySelector(".logistics-card .btn-gold-solid");
    const rsvpForm = document.getElementById('rsvp-form');

    // Abrir/Cerrar Modal
    if (btnRsvp && modal) {
        btnRsvp.onclick = (e) => { e.preventDefault(); modal.style.display = "flex"; };
        const closeBtn = modal.querySelector(".close-modal");
        if (closeBtn) closeBtn.onclick = () => modal.style.display = "none";
        window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };
    }

    // Envío a Google Sheets
    if (rsvpForm) {
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxgVkGzN0cMOAsI0jWyRa-qQ_vDXV5mHyisdrOP7yzsaMtyizsCQZbDmA5GjTwKlzCp/exec';

        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = rsvpForm.querySelector('button');
            const originalText = submitBtn.innerText;

            submitBtn.innerText = "Registrando...";
            submitBtn.disabled = true;

            // Cambiamos el formato de envío a uno que Google acepta sin problemas
            const formData = new URLSearchParams();
            formData.append('nombre', document.getElementById('name').value);
            formData.append('email', document.getElementById('email').value);
            formData.append('evento', document.querySelector('.event-main-title').innerText);

            try {
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', // Mantenemos no-cors para evitar problemas de dominio
                    body: formData
                });

                // --- UX MEJORADA: En lugar de alert, cambiamos el contenido del modal ---
                const modalContent = document.querySelector('.modal-content');
                modalContent.innerHTML = `
                <span class="close-modal" onclick="document.getElementById('rsvp-modal').style.display='none'">&times;</span>
                <div style="text-align: center; padding: 20px;">
                    <h2 style="font-family: var(--font-heading); color: var(--blue-dark); margin-bottom: 15px;">¡Todo listo!</h2>
                    <p style="color: var(--blue-slate); line-height: 1.6;">Tu lugar en el <strong>${document.querySelector('.event-main-title').innerText}</strong> ha sido reservado con éxito.</p>
                    <button onclick="document.getElementById('rsvp-modal').style.display='none'" class="btn-gold-solid" style="margin-top: 25px; width: 100%;">Cerrar ventana</button>
                </div>
            `;

            } catch (error) {
                console.error("Error:", error);
                submitBtn.innerText = "Error, intenta de nuevo";
                submitBtn.disabled = false;
            }
        });
    }

    // 4. ANIMACIONES AL HACER SCROLL -
    // ------------------------------------------
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));
});

// 5. EVENTOS RELACIONADOS (Fuera del DOMContentLoaded para ser accesible) -
// ------------------------------------------
async function cargarEventosRelacionados(eventoActualId) {
    const contenedor = document.getElementById('related-grid');
    if (!contenedor) return;

    try {
        const respuesta = await fetch('eventos.json');
        const todosLosEventos = await respuesta.json();
        const seleccionados = todosLosEventos
            .filter(ev => ev.id !== eventoActualId)
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);

        contenedor.innerHTML = seleccionados.map(ev => `
            <div class="activity-card animate-on-scroll">
                <div class="activity-image-wrapper">
                    <img src="${ev.imagen}" alt="${ev.titulo}" class="activity-img">
                </div>
                <div class="activity-details">
                    <h4 class="activity-name">${ev.titulo}</h4>
                    <div class="activity-footer">
                        <span class="activity-status">${ev.status}</span>
                        <a href="${ev.url}" class="activity-arrow">&rarr;</a>
                    </div>
                </div>
            </div>
        `).join('');

        // Disparar animación para las nuevas tarjetas
        setTimeout(() => {
            contenedor.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('is-visible'));
        }, 100);

    } catch (e) { console.error("Error cargando eventos:", e); }
}