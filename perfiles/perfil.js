/**
 * ========================================================
 * THE LOOKOUTS - CONTROLADOR DE PERFIL DINÁMICO (UNIFICADO)
 * ========================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const miembroId = params.get('id');

    if (miembroId) {
        cargarDatosMiembro(miembroId);
    } else {
        mostrarError("ID de miembro no especificado", "Por favor, accede desde el Directorio.");
    }
});

async function cargarDatosMiembro(id) {
    try {
        const respuesta = await fetch('perfiles.json');
        if (!respuesta.ok) throw new Error("No se pudo cargar perfiles.json");

        const miembros = await respuesta.json();
        const m = miembros.find(item => item.id === id);

        if (m) {
            // 1. Actualizar textos e imágenes básicas
            document.title = `${m.nombre} | The Lookouts`;
            document.querySelector('.member-full-name').innerText = m.nombre;
            document.querySelector('.member-bio').innerText = m.bio;

            const portrait = document.querySelector('.member-portrait');
            portrait.src = m.foto;
            portrait.alt = `Retrato de ${m.nombre}`;
            document.querySelector('.member-rank-badge img').src = m.rango_img;

            // 2. Actualizar Estadísticas
            const stats = document.querySelectorAll('.meta-value');
            if (stats.length >= 2) {
                stats[0].innerText = m.union;
                stats[1].innerText = m.aportaciones;
            }

            // 3. Inyectar Botones de Redes Sociales
            const socialBox = document.getElementById('member-social-links');
            if (socialBox && m.redes) {
                socialBox.innerHTML = Object.entries(m.redes).map(([red, url]) => `
                    <a href="${url}" target="_blank" class="member-social-btn" aria-label="${red}">
                        ${red.toUpperCase()}
                    </a>
                `).join('');
            }

            // 4. Inyectar Tags y Obras
            document.querySelector('.interest-tags').innerHTML = m.intereses.map(t => `<span>${t}</span>`).join('');
            document.querySelector('.reading-list').innerHTML = m.obras.map(o => `<li>${o}</li>`).join('');

            // 5. Inyectar Widget de Instagram (LightWidget)
            if (m.instagram_widget_id) {
                const feedContainer = document.getElementById('instagram-feed');
                if (feedContainer) {
                    // Inyectamos el HTML del iframe
                    feedContainer.innerHTML = `
                        <iframe src="https://lightwidget.com/widgets/${m.instagram_widget_id}.html" 
                        scrolling="no" allowtransparency="true" class="lightwidget-widget" 
                        style="width:100%; border:0; overflow:hidden;"></iframe>
                    `;

                    const oldScript = document.querySelector('script[src*="lightwidget.js"]');
                    if (oldScript) oldScript.remove();

                    const newScript = document.createElement('script');
                    newScript.src = "https://cdn.lightwidget.com/widgets/lightwidget.js";
                    document.body.appendChild(newScript);
                }
            }
        } else {
            mostrarError("Miembro no encontrado", "La bitácora solicitada no existe en nuestros registros.");
        }
    } catch (error) {
        console.error("Error técnico:", error);
        mostrarError("Error de Conexión", "No se pudo recuperar la información del servidor.");
    }
}

function mostrarError(titulo, mensaje) {
    const titleEl = document.querySelector('.member-full-name');
    const bioEl = document.querySelector('.member-bio');
    if (titleEl) titleEl.innerText = titulo;
    if (bioEl) bioEl.innerText = mensaje;
}