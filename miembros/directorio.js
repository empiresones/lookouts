document.addEventListener("DOMContentLoaded", () => {
    cargarDirectorio();
});

async function cargarDirectorio() {
    const grid = document.getElementById('directory-grid');
    if (!grid) return;

    try {
        const respuesta = await fetch('miembros/miembros.json');
        const miembros = await respuesta.json();

        grid.innerHTML = miembros.map((m, index) => `
            <div class="profile-card animate-on-scroll" style="transition-delay: ${index * 0.1}s" onclick="location.href='perfiles/perfil.html?id=${m.id}'">
                <div class="profile-image-box">
                    <img src="${m.foto}" alt="${m.nombre}" class="profile-img">
                    <img src="${m.sello}" alt="Sello de ${m.nombre}" class="profile-seal">
                </div>
                <div class="profile-info">
                    <h3 class="profile-name">${m.nombre}</h3>
                    <p class="profile-role">${m.rol}</p>
                </div>
            </div>
        `).join('');

        // Re-activar animaciones para los elementos recién creados
        const nuevosElementos = grid.querySelectorAll('.animate-on-scroll');
        nuevosElementos.forEach(el => {
            setTimeout(() => el.classList.add('is-visible'), 100);
        });

    } catch (error) {
        console.error("Error cargando el directorio:", error);
    }
}