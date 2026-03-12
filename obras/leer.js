document.addEventListener("DOMContentLoaded", async () => {
    // 1. Obtener los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const obraId = urlParams.get('obra');
    const capNumero = parseInt(urlParams.get('cap'));

    if (!obraId || !capNumero) {
        document.querySelector('.leer-main').innerHTML = "<h2 style='text-align:center;'>Faltan datos para abrir el capítulo.</h2>";
        return;
    }

    try {
        // 2. Cargar el JSON de obras
        const respuesta = await fetch('obras.json');
        if (!respuesta.ok) throw new Error("No se pudo cargar obras.json");
        const obras = await respuesta.json();

        // 3. Buscar la obra y el capítulo
        const obraActual = obras.find(o => o.id === obraId);
        if (!obraActual) throw new Error("Obra no encontrada");

        const capituloActual = obraActual.capitulos.find(c => c.numero === capNumero);
        if (!capituloActual) throw new Error("Capítulo no encontrado");

        // 4. Inyectar datos en la interfaz superior
        document.getElementById('btn-volver').href = `escrito.html?id=${obraId}`;
        document.getElementById('leer-obra-titulo').innerText = obraActual.titulo;
        document.getElementById('leer-cap-numero').innerText = `Capítulo ${capituloActual.numero}`;
        document.getElementById('leer-cap-titulo').innerText = capituloActual.titulo;

        // 5. NUEVO: Extraer el texto del archivo independiente
        const contenedorTexto = document.getElementById('leer-contenido');

        if (capituloActual.archivo) {
            try {
                // Hacemos la petición directamente al archivo HTML del capítulo
                const respTexto = await fetch(capituloActual.archivo);

                if (!respTexto.ok) throw new Error("No se encontró el archivo del capítulo en la ruta especificada.");

                // Extraemos el contenido como texto plano (que incluye tus etiquetas <p>)
                const htmlTexto = await respTexto.text();

                // Lo inyectamos directamente en el contenedor
                contenedorTexto.innerHTML = htmlTexto;
            } catch (err) {
                console.error(err);
                contenedorTexto.innerHTML = "<p style='text-align:center; color: var(--blue-muted);'>El texto de este capítulo no está disponible o la ruta es incorrecta.</p>";
            }
        } else {
            contenedorTexto.innerHTML = "<p style='text-align:center;'>Este capítulo no tiene un archivo de texto asignado en la base de datos.</p>";
        }

        // 6. Configurar botones Anterior / Siguiente
        const totalCapitulos = obraActual.capitulos.length;
        const btnPrev = document.getElementById('btn-prev-cap');
        const btnNext = document.getElementById('btn-next-cap');

        if (capNumero > 1) {
            btnPrev.href = `leer.html?obra=${obraId}&cap=${capNumero - 1}`;
            btnPrev.classList.remove('disabled');
        }

        if (capNumero < totalCapitulos) {
            btnNext.href = `leer.html?obra=${obraId}&cap=${capNumero + 1}`;
            btnNext.classList.remove('disabled');
        }

        // 7. Animaciones
        setTimeout(() => {
            document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('is-visible'));
        }, 100);

    } catch (error) {
        console.error("Error en el lector:", error);
        document.querySelector('.leer-texto-container').innerHTML = `<p style="text-align:center;">Hubo un error al abrir el lector.</p>`;
    }
});