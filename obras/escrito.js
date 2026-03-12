document.addEventListener("DOMContentLoaded", async () => {
    // 1. Obtener el ID de la obra desde la URL (ej: ?id=vientos-erevan)
    const urlParams = new URLSearchParams(window.location.search);
    const obraId = urlParams.get('id');

    if (!obraId) {
        document.querySelector('.escrito-layout').innerHTML = "<h2>Obra no encontrada</h2>";
        return;
    }

    try {
        // 2. Cargar la base de datos
        const [respObras, respMiembros] = await Promise.all([
            fetch('obras.json'),
            fetch('../miembros/miembros.json')
        ]);

        const obras = await respObras.json();
        const miembros = await respMiembros.json();

        // 3. Encontrar la obra específica
        const obraActual = obras.find(o => o.id === obraId);
        if (!obraActual) throw new Error("ID de obra no existe en el JSON");

        const autor = miembros.find(m => m.id === obraActual.autorId);
        const selloRuta = autor.sello.replace('../', '../');

        // 4. Inyectar Portada y Autor (Sidebar)
        document.getElementById('escrito-cover-container').innerHTML = `
            <img src="${obraActual.portada}" alt="${obraActual.titulo}" class="escrito-cover">
        `;
        document.getElementById('escrito-author-info').innerHTML = `
            <img src="${selloRuta}" alt="${autor.nombre}" class="author-badge" style="width: 40px; height: 40px;">
            <span class="author-name">por ${autor.nombre}</span>
        `;

        // 5. Inyectar Título y Sinopsis
        document.getElementById('escrito-header').innerHTML = `
            <div class="obra-meta-tags" style="margin-bottom: 15px; display: flex; gap: 10px;">
                <span class="tag">${obraActual.genero}</span>
                <span class="tag">${obraActual.estado}</span>
            </div>
            <h1 class="escrito-title">${obraActual.titulo}</h1>
        `;
        document.getElementById('escrito-synopsis-text').innerText = obraActual.sinopsis;

        // 6. Generar el Índice de Capítulos
        const chapterList = document.getElementById('escrito-chapter-list');

        // Verifica si la obra tiene capítulos en el JSON
        if (obraActual.capitulos && obraActual.capitulos.length > 0) {
            chapterList.innerHTML = obraActual.capitulos.map((cap, index) => `
                <a href="leer.html?obra=${obraActual.id}&cap=${cap.numero}" class="chapter-item">
                    <span class="chapter-number">Capítulo ${cap.numero}</span>
                    <span class="chapter-title">${cap.titulo}</span>
                    <span class="chapter-arrow">&rarr;</span>
                </a>
            `).join('');
        } else {
            chapterList.innerHTML = `<p style="color: var(--blue-muted);">El autor aún no ha publicado capítulos para esta obra.</p>`;
        }

        // Animar entrada
        setTimeout(() => {
            document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('is-visible'));
        }, 100);

    } catch (error) {
        console.error("Error al cargar la obra:", error);
    }
});