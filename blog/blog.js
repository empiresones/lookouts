/**
 * ========================================================
 * THE LOOKOUTS - CONTROLADOR PRINCIPAL DEL BLOG
 * ========================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    cargarBlog();
});

async function cargarBlog() {
    try {
        const respuesta = await fetch('blog.json');
        if (!respuesta.ok) throw new Error("No se encontró blog.json");
        const entradas = await respuesta.json();

        // 1. Artículo Destacado
        const destacado = entradas.find(e => e.destacado === true) || entradas[0];
        const featuredContainer = document.getElementById('featured-container');
        if (featuredContainer && destacado) {
            featuredContainer.innerHTML = `
                <a href="../entradas blog/entrada.html?id=${destacado.id}" class="featured-wrapper">
                    <div class="featured-image"><img src="${destacado.imagen}" alt="${destacado.titulo}"></div>
                    <div class="featured-text">
                        <span class="article-tag">Destacado | ${destacado.categoria}</span>
                        <h2 class="featured-h2">${destacado.titulo}</h2>
                        <p class="featured-excerpt">${destacado.resumen}</p>
                        <div class="article-meta">
                            <span>Por ${destacado.autor}</span>
                            <span class="meta-dot"></span>
                            <span>${destacado.tiempo_lectura} de lectura</span>
                        </div>
                    </div>
                </a>`;
        }

        // 2. Renderizar Cuadrículas Separadas
        const renderGrid = (containerId, lista) => {
            const grid = document.getElementById(containerId);
            if (!grid) return;
            grid.innerHTML = lista.map((e, index) => `
                <article class="blog-card animate-on-scroll" style="transition-delay: ${index * 0.1}s;">
                    <a href="../entradas blog/entrada.html?id=${e.id}">
                        <div class="blog-card-image"><img src="${e.imagen}" alt="${e.titulo}"></div>
                        <div class="blog-card-content">
                            <span class="article-tag">${e.categoria}</span>
                            <h3 class="blog-card-title">${e.titulo}</h3>
                            <p class="blog-card-excerpt">${e.resumen}</p>
                        </div>
                    </a>
                </article>`).join('');
        };

        // Filtramos artículos (excluyendo el destacado si es artículo)
        const articulos = entradas.filter(e => e.tipo === 'articulo' && e.id !== destacado.id);
        // Filtramos todas las reseñas
        const reseñas = entradas.filter(e => e.tipo === 'reseña' && e.id !== destacado.id);

        renderGrid('blog-grid', articulos);
        renderGrid('reviews-grid', reseñas);

        setTimeout(() => {
            document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('is-visible'));
        }, 100);

    } catch (error) {
        console.error("Error:", error);
    }
}