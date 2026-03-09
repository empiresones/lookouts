document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const eventoId = params.get('id');

    if (eventoId) {
        cargarDetalleEvento(eventoId);
    } else {
        document.getElementById('event-title').innerText = "Evento no especificado";
        document.getElementById('event-full-desc').innerHTML = "<p>Por favor, accede desde la Agenda principal.</p>";
    }
});

async function cargarDetalleEvento(id) {
    try {
        // Al estar en la misma carpeta, busca el JSON directamente
        const respuesta = await fetch('eventos.json');
        if (!respuesta.ok) throw new Error("No se encontró eventos.json");

        const eventos = await respuesta.json();
        const ev = eventos.find(item => item.id === id);

        if (ev) {
            // 1. Textos principales
            document.title = `${ev.titulo} | The Lookouts`;
            document.getElementById('event-title').innerText = ev.titulo;
            document.getElementById('event-eyebrow').innerText = ev.categoria.toUpperCase();

            // 2. Imagen de fondo
            document.getElementById('event-img-bg').src = ev.imagen;

            // 3. Tarjeta de Logística (Hora, Fecha, Lugar)
            document.getElementById('sidebar-date').innerText = ev.fecha;
            document.getElementById('sidebar-time').innerText = ev.hora;
            document.getElementById('sidebar-location').innerText = ev.lugar;

            // 4. Descripción Larga (Se usa innerHTML porque el JSON trae etiquetas HTML como <ul> y <p>)
            document.getElementById('event-full-desc').innerHTML = ev.desc_larga;

            // 5. Organizadores
            const hostsContainer = document.getElementById('event-hosts');
            if (hostsContainer && ev.organizadores) {
                hostsContainer.innerHTML = ev.organizadores.map(org => `
                    <div class="host-item">
                        <img src="${org.avatar}" alt="${org.nombre}" class="host-avatar">
                        <span class="host-name">${org.nombre}</span>
                    </div>
                `).join('');
            }

            // 6. Actualizar Modal con el nombre del evento
            const modalSubtitle = document.querySelector('.modal-subtitle');
            if (modalSubtitle) modalSubtitle.innerText = ev.titulo;

        } else {
            document.getElementById('event-title').innerText = "Evento no encontrado";
        }
    } catch (error) {
        console.error("Error técnico:", error);
    }
}