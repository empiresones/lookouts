/**
 * ========================================================
 * THE LOOKOUTS - MOTOR DEL CATÁLOGO DE AUDIOLIBROS
 * ========================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    cargarCatalogo();
});

async function cargarCatalogo() {
    // Asegúrate de que en tu catalogo.html haya un <div id="catalog-grid" class="catalog-grid"></div>
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;

    try {
        const respuesta = await fetch('audiolibros.json');
        if (!respuesta.ok) throw new Error("No se pudo cargar audiolibros.json");

        const audiolibros = await respuesta.json();

        grid.innerHTML = audiolibros.map((libro, index) => `
            <div class="audiobook-card animate-on-scroll" style="transition-delay: ${index * 0.1}s; cursor: pointer;" onclick="location.href='reproductor.html?id=${libro.id}'">
                
                <div class="audiobook-cover-box">
                    <img src="${libro.portada}" alt="Portada de ${libro.titulo}" class="audiobook-img">
                    <div class="audiobook-overlay">
                        <button class="mini-play-btn" title="Escuchar ahora">▶</button>
                    </div>
                </div>

                <div class="audiobook-info">
                    <span class="audiobook-tag">${libro.etiqueta.toUpperCase()}</span>
                    <h3 class="audiobook-title">${libro.titulo}</h3>
                    <p class="audiobook-author">${libro.autor}</p>
                    
                    <div class="audio-player-ui">
                        <span class="meta-item">🎤 Voz: ${libro.narrador}</span>
                        <span class="meta-divider"></span>
                        <span class="meta-item">⏱ ${libro.duracion}</span>
                    </div>
                </div>

            </div>
        `).join('');

        // Disparar las animaciones para que aparezcan suavemente
        setTimeout(() => {
            document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('is-visible'));
        }, 100);

    } catch (error) {
        console.error("Error cargando el catálogo:", error);
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px;">
                <p style="color: var(--blue-muted);">No pudimos cargar el catálogo en este momento.</p>
            </div>
        `;
    }
}