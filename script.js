/**
 * ========================================================
 * THE LOOKOUTS - SCRIPT PRINCIPAL (V. 2026 COMPLETO)
 * ========================================================
 */

document.addEventListener("DOMContentLoaded", () => {

    // 1. LÓGICA DEL CARRUSEL (HERO)
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

    // 2. HEADER DINÁMICO Y MENÚ
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

    // 3. LÓGICA DE REGISTRO (MODAL Y GOOGLE SHEETS) - RESTAURADA
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
            submitBtn.innerText = "Registrando...";
            submitBtn.disabled = true;

            const formData = new URLSearchParams();
            formData.append('nombre', document.getElementById('name').value);
            formData.append('email', document.getElementById('email').value);
            formData.append('evento', document.querySelector('.event-main-title').innerText);

            try {
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                });

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

    // 4. ANIMACIONES AL HACER SCROLL
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

    // 5. MOTOR DEL CARRUSEL 3D (AUDIOLIBROS) - CORREGIDO
    // ------------------------------------------
    const coverflowItems = document.querySelectorAll('.coverflow-item');

    if (coverflowItems.length > 0) {
        let flowIndex = 0;

        const updateCoverflow = () => {
            coverflowItems.forEach(item => {
                item.classList.remove('active', 'prev', 'next');
            });

            const prevIndex = (flowIndex - 1 + coverflowItems.length) % coverflowItems.length;
            const nextIndex = (flowIndex + 1) % coverflowItems.length;

            coverflowItems[flowIndex].classList.add('active');
            coverflowItems[prevIndex].classList.add('prev');
            coverflowItems[nextIndex].classList.add('next');
        };

        updateCoverflow();

        setInterval(() => {
            flowIndex = (flowIndex + 1) % coverflowItems.length;
            updateCoverflow();
        }, 3500);
    }
    cargarAgendaHome();
    cargarMarqueeMiembros();

});

// 6. EVENTOS RELACIONADOS (SE MANTIENE INDEPENDIENTE)
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
                        <a href="evento-detalle.html?id=${ev.id}" class="activity-arrow">&rarr;</a>
                    </div>
                </div>
            </div>
        `).join('');

        setTimeout(() => {
            contenedor.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('is-visible'));
        }, 100);

    } catch (e) { console.error("Error cargando eventos:", e); }
}
// 7. AGENDA DINÁMICA PARA EL HOME
// ------------------------------------------
async function cargarAgendaHome() {
    const gridHome = document.getElementById('home-activities-grid');
    if (!gridHome) return;

    try {
        // Buscamos la información desde la raíz a la carpeta eventos
        const respuesta = await fetch('eventos/eventos.json');
        if (!respuesta.ok) throw new Error("No se pudo cargar la agenda");
        const eventos = await respuesta.json();

        // Tomamos los primeros 4 eventos para no saturar el inicio
        const eventosHome = eventos.slice(0, 4);

        gridHome.innerHTML = eventosHome.map((ev, index) => {
            // Extraer el día y mes de la fecha (Ej: "23 de Abril de 2026" -> "23" y "ABR")
            const partesFecha = ev.fecha.split(' ');
            const dia = partesFecha[0];
            const mes = partesFecha[2] ? partesFecha[2].substring(0, 3).toUpperCase() : '';

            return `
            <a href="eventos/evento-detalle.html?id=${ev.id}" class="activity-card animate-on-scroll" style="transition-delay: ${index * 0.1}s; text-decoration: none;">
                <div class="activity-image-wrapper">
                    <img src="${ev.imagen}" alt="${ev.titulo}" class="activity-img">
                    <div class="activity-date-badge">
                        <span class="date-day">${dia}</span>
                        <span class="date-month">${mes}</span>
                    </div>
                </div>
                <div class="activity-details">
                    <h4 class="activity-name">${ev.titulo}</h4>
                    <p class="activity-desc">${ev.desc_corta}</p>
                    <div class="activity-footer">
                        <span class="activity-status">${ev.status}</span>
                        <span class="activity-arrow">&rarr;</span>
                    </div>
                </div>
            </a>
            `;
        }).join('');

        // Disparar las animaciones de scroll para las nuevas tarjetas
        setTimeout(() => {
            gridHome.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('is-visible'));
        }, 100);

    } catch (error) {
        console.error("Error cargando la agenda en el home:", error);
        gridHome.innerHTML = `<p style="text-align: center; color: var(--blue-muted); grid-column: 1 / -1;">No hay eventos programados por el momento.</p>`;
    }
}
// 8. MARQUEE DINÁMICO DE MIEMBROS (INFINITO PERFECTO)
// ------------------------------------------
async function cargarMarqueeMiembros() {
    const marqueeGroup = document.getElementById('dynamic-marquee-group');
    if (!marqueeGroup) return;

    try {
        // Obtenemos los miembros
        const respuesta = await fetch('miembros/miembros.json');
        if (!respuesta.ok) throw new Error("No se pudo cargar la lista de miembros");
        const miembros = await respuesta.json();

        // LÓGICA DEL BUCLE PERFECTO:
        // Para que el scroll al -50% sea invisible, necesitamos que la mitad de las tarjetas 
        // contenga ciclos completos y exactos de nuestros miembros.
        const minTarjetasPorMitad = 8; // Queremos al menos 8 tarjetas en pantalla en todo momento
        const repeticionesPorMitad = Math.ceil(minTarjetasPorMitad / miembros.length);
        const repeticionesTotales = repeticionesPorMitad * 2; // Multiplicamos por 2 para tener las dos mitades idénticas

        let tarjetasHTML = '';

        // Generamos las tarjetas dinámicamente
        for (let i = 0; i < repeticionesTotales; i++) {
            tarjetasHTML += miembros.map(m => {
                // Limpiamos la ruta '../' del JSON porque estamos en el index (raíz)
                const fotoLimpia = m.foto.replace('../', '');
                const selloLimpio = m.sello.replace('../', '');

                return `
                <a href="perfiles/perfil.html?id=${m.id}" class="member-card" style="text-decoration: none; display: block;">
                    <img src="${fotoLimpia}" alt="Foto de ${m.nombre}" class="member-photo">
                    <div class="member-overlay">
                        <h4 class="member-name">${m.nombre}</h4>
                        <img src="${selloLimpio}" alt="Insignia ${m.nombre}" class="member-badge">
                    </div>
                </a>
                `;
            }).join('');
        }

        // Inyectamos el HTML resultante
        marqueeGroup.innerHTML = tarjetasHTML;

    } catch (error) {
        console.error("Error cargando el marquee de miembros:", error);
        marqueeGroup.innerHTML = `<p style="color: var(--blue-muted); padding: 0 20px;">No hay miembros registrados.</p>`;
    }
}