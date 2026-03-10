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
            if (stats.length >= 1) {
                stats[0].innerText = m.union;
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

            // 4. Inyectar Tags
            const tagsContainer = document.querySelector('.interest-tags');
            if (tagsContainer) {
                tagsContainer.innerHTML = m.intereses.map(t => `<span>${t}</span>`).join('');
            }

            // 5. Inyectar Widget de Instagram (LightWidget)
            if (m.instagram_widget_id) {
                const feedContainer = document.getElementById('instagram-feed');
                if (feedContainer) {
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

            // 6. Lógica para Libros Favoritos
            const booksContainer = document.getElementById('favorite-books-container');
            if (booksContainer && m.libros_favoritos && m.libros_favoritos.length > 0) {
                booksContainer.style.display = 'block';
                booksContainer.querySelector('.books-gallery').innerHTML =
                    m.libros_favoritos.slice(0, 6).map(libro => `
                        <div class="book-card">
                            <div class="book-cover-wrapper">
                                <img src="${libro.portada}" alt="Portada de ${libro.titulo}" class="book-cover">
                                <div class="book-spine-glare"></div>
                            </div>
                            <div class="book-info">
                                <h5 class="book-title">${libro.titulo}</h5>
                                <span class="book-author">${libro.autor}</span>
                            </div>
                        </div>
                    `).join('');
            }

            // 7. Lógica para Galería de Fotos/Arte
            const galleryContainer = document.getElementById('gallery-container');
            if (galleryContainer && m.galeria && m.galeria.length > 0) {
                galleryContainer.style.display = 'block';
                galleryContainer.querySelector('.member-gallery-grid').innerHTML =
                    m.galeria.map(img => `
                        <div class="gallery-item">
                            <img src="${img}" alt="Obra de ${m.nombre}">
                        </div>
                    `).join('');
            }

            // 8. Lógica para Spotify - RESPETANDO ALTURA 452PX
            const spotifyContainer = document.getElementById('spotify-container');
            if (spotifyContainer && m.spotify_playlist) {
                spotifyContainer.style.display = 'block';
                spotifyContainer.querySelector('.spotify-embed-box').innerHTML = `
                    <iframe style="border-radius:12px" src="${m.spotify_playlist}" 
                    width="100%" height="452" frameBorder="0" allowfullscreen="" 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"></iframe>
                `;
            }

            // 9. LLAMADA A LA CONEXIÓN CON EL BLOG (Añadido para que funcione)
            vincularPublicacionesBlog(id);

        } else {
            mostrarError("Miembro no encontrado", "La bitácora solicitada no existe en nuestros registros.");
        }
    } catch (error) {
        console.error("Error técnico:", error);
        mostrarError("Error de Conexión", "No se pudo recuperar la información del servidor.");
    }
}

/**
 * Busca en blog.json los artículos que coincidan con el autorId del perfil
 */
async function vincularPublicacionesBlog(miembroId) {
    const postsContainer = document.getElementById('user-posts-container');
    const postsGrid = document.getElementById('user-posts-grid');

    if (!postsGrid) return;

    try {
        const respuesta = await fetch('../blog/blog.json');
        if (!respuesta.ok) return;

        const articulos = await respuesta.json();
        const misArticulos = articulos.filter(art => art.autorId === miembroId);

        if (misArticulos.length > 0) {
            postsContainer.style.display = 'block';
            postsGrid.innerHTML = misArticulos.map(art => `
                <a href="../blog/entrada.html?id=${art.id}" class="gallery-item" style="text-decoration: none; border-radius: 12px; overflow: hidden; display: block; aspect-ratio: 3/2; box-shadow: 0 10px 30px rgba(0,0,0,0.5); position: relative;">
                    <style>
                        #user-posts-grid .gallery-item { transition: transform 0.3s ease, box-shadow 0.3s ease; }
                        #user-posts-grid .gallery-item:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.8); }
                        #user-posts-grid .gallery-item img.bg-blur { transition: transform 0.5s ease; }
                        #user-posts-grid .gallery-item:hover img.bg-blur { transform: scale(1.05); }
                    </style>
                    <div style="position: relative; width: 100%; height: 100%;">
                        <img src="${art.imagen}" alt="Fondo ${art.titulo}" class="bg-blur" style="position: absolute; width: 100%; height: 100%; object-fit: cover;">
                        
                        <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 25px; background: linear-gradient(0deg, #000 30%, rgba(0,0,0,0) 100%); border-top: 1px solid rgba(214,179,89,0.2);">
                            <span style="color: var(--accent-gold); font-size: 0.7rem; letter-spacing: 2px; font-weight:700; text-transform: uppercase;">${art.tipo || 'ARTÍCULO'}</span>
                            <h4 style="color: white; margin-top: 10px; font-family: var(--font-heading); font-size: 1.4rem; line-height:1.2; font-weight: 500; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${art.titulo}</h4>
                            <p style="color: rgba(255,255,255,0.7); font-size: 0.8rem; margin-top: 10px;">${art.fecha} • ${art.tiempo_lectura}</p>
                        </div>
                    </div>
                </a>
            `).join('');
        }
    } catch (e) {
        console.error("Error vinculando blog:", e);
    }
}

function mostrarError(titulo, mensaje) {
    const titleEl = document.querySelector('.member-full-name');
    const bioEl = document.querySelector('.member-bio');
    if (titleEl) titleEl.innerText = titulo;
    if (bioEl) bioEl.innerText = mensaje;
}