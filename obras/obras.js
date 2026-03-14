document.addEventListener("DOMContentLoaded", async () => {
    const showcase = document.getElementById('obras-showcase');
    if (!showcase) return;

    try {
        const [respObras, respMiembros] = await Promise.all([
            fetch('obras.json'),
            fetch('../miembros/miembros.json')
        ]);

        if (!respObras.ok || !respMiembros.ok) throw new Error("Error cargando archivos");

        const obras = await respObras.json();
        const miembros = await respMiembros.json();

        showcase.innerHTML = obras.map((obra, index) => {
            const autor = miembros.find(m => m.id === obra.autorId);
            const selloRuta = autor.sello.replace('../', '../');

            // Lógica de Novedad: Solo la primera obra (index 0) recibe la etiqueta
            const isLatest = index === 0;
            const latestBadgeHTML = isLatest ? `<div class="latest-update-badge">Recién Actualizado</div>` : '';

            // Las etiquetas que sirven de "Hook"
            const tagsHTML = `
                <span class="tag">${obra.genero}</span>
                <span class="tag">${obra.estado}</span>
                <span class="tag">${obra.capitulos.length} Capítulos</span>            
            `;

            return `
                <article class="obra-card animate-on-scroll">
                    <div class="obra-cover-wrapper">
                        <img src="${obra.portada}" alt="Portada de ${obra.titulo}" class="obra-cover">
                    </div>
                    
                    <div class="obra-info">
                        ${latestBadgeHTML} <div class="obra-meta-tags">
                            ${tagsHTML}
                        </div>
                        
                        <h2 class="obra-title">${obra.titulo}</h2>
                        
                        <div class="obra-author-block">
                            <img src="${selloRuta}" alt="${autor.nombre}" class="author-badge">
                            <span class="author-name">Escrito por ${autor.nombre}</span>
                        </div>
                        
                        <p class="obra-synopsis">${obra.sinopsis}</p>
                        
                        <a href="escrito.html?id=${obra.id}" class="btn-read-obra">
                            Entrar a la obra <span>&rarr;</span>
                        </a>
                    </div>
                </article>
            `;
        }).join('');

        // Disparar las animaciones para que aparezcan suavemente
        setTimeout(() => {
            document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('is-visible'));
        }, 100);

    } catch (error) {
        console.error("Error al cargar el showcase de obras:", error);
        showcase.innerHTML = `<p style="text-align:center;">No hay obras disponibles en este momento.</p>`;
    }
});