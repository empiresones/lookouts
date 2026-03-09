/**
 * ========================================================
 * THE LOOKOUTS - CONTROLADOR DE AGENDA DINÁMICA
 * ========================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    cargarAgenda();
});

async function cargarAgenda() {
    const grid = document.getElementById('activities-grid');
    const spotlight = document.getElementById('event-spotlight-container');

    try {
        // Buscamos el JSON en la carpeta de eventos
        const respuesta = await fetch('eventos/eventos.json');
        const eventos = await respuesta.json();

        // 1. Renderizar el Spotlight (Tomamos el primero del JSON)
        if (spotlight && eventos.length > 0) {
            const ev = eventos[0];
            spotlight.style.backgroundImage = `linear-gradient(to right, var(--blue-dark) 30%, rgba(15, 20, 28, 0.6) 70%), url('${ev.imagen}')`;
            spotlight.innerHTML = `
                <div class="spotlight-content">
                    <h4 class="spotlight-eyebrow">EVENTO DESTACADO</h4>
                    <h1 class="spotlight-title">${ev.titulo}</h1>
                    <div class="spotlight-info">
                        <div class="info-block"><span class="label">FECHA</span><span class="value">${ev.fecha}</span></div>
                        <div class="info-block"><span class="label">LUGAR</span><span class="value">${ev.lugar}</span></div>
                    </div>
                    <p class="spotlight-desc">${ev.desc_corta}</p>
                    <a href="eventos/evento-detalle.html?id=${ev.id}" class="btn-gold-solid">Reservar mi lugar</a>
                </div>
            `;
        }

        // 2. Renderizar la Cuadrícula
        if (grid) {
            grid.innerHTML = eventos.map((ev, index) => `
                <div class="activity-card animate-on-scroll" style="transition-delay: ${index * 0.1}s" onclick="location.href='eventos/evento-detalle.html?id=${ev.id}'">
                    <div class="activity-image-wrapper">
                        <img src="${ev.imagen}" alt="${ev.titulo}" class="activity-img">
                        <div class="activity-date-badge">
                            <span class="date-day">${ev.fecha.split(' ')[0]}</span>
                            <span class="date-month">${ev.fecha.split(' ')[2].substring(0, 3).toUpperCase()}</span>
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
                </div>
            `).join('');

            // Disparar las animaciones de scroll
            setTimeout(() => {
                document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('is-visible'));
            }, 100);
        }

    } catch (error) {
        console.error("Error cargando la agenda:", error);
    }
}