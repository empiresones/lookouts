/**
 * ========================================================
 * THE LOOKOUTS - MOTOR DEL REPRODUCTOR DE AUDIOLIBROS
 * ========================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('id');

    if (bookId) {
        cargarLibro(bookId);
    } else {
        document.getElementById('book-title').innerText = "Libro no encontrado";
    }
});

let capitulosActuales = [];
let indiceActual = 0;
const audioEl = document.getElementById('main-audio');
const playBtn = document.getElementById('btn-play');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');

async function cargarLibro(id) {
    try {
        const respuesta = await fetch('audiolibros.json');
        const libros = await respuesta.json();
        const libro = libros.find(l => l.id === id);

        if (libro) {
            // 1. Cargar Info Izquierda
            document.title = `${libro.titulo} | The Lookouts`;
            document.getElementById('book-cover').src = libro.portada;
            document.getElementById('book-tag').innerText = libro.etiqueta.toUpperCase();
            document.getElementById('book-title').innerText = libro.titulo;
            document.getElementById('book-author').innerText = libro.autor;
            document.getElementById('book-narrator').innerText = `Voz: ${libro.narrador}`;

            // 2. Cargar Lista Derecha
            capitulosActuales = libro.capitulos;
            renderizarListaCapitulos();

            // 3. Preparar el primer capítulo
            cargarPista(0);
            configurarControles();

        } else {
            document.getElementById('book-title').innerText = "Libro no encontrado";
        }
    } catch (e) {
        console.error("Error al cargar audiolibro:", e);
    }
}

function renderizarListaCapitulos() {
    const listContainer = document.getElementById('chapters-list');
    listContainer.innerHTML = capitulosActuales.map((cap, index) => `
        <div class="chapter-item ${index === 0 ? 'playing' : ''}" data-index="${index}">
            <span class="chap-num">${cap.numero}</span>
            <span class="chap-title">${cap.titulo}</span>
            <span class="chap-duration">${cap.duracion}</span>
        </div>
    `).join('');

    // Asignar clic a cada capítulo
    document.querySelectorAll('.chapter-item').forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.getAttribute('data-index'));
            cargarPista(idx);
            audioEl.play();
            playBtn.innerText = "⏸";
        });
    });
}

function cargarPista(index) {
    indiceActual = index;
    audioEl.src = capitulosActuales[index].audio;

    // Actualizar estilos visuales en la lista
    document.querySelectorAll('.chapter-item').forEach((item, i) => {
        if (i === index) item.classList.add('playing');
        else item.classList.remove('playing');
    });
}

function configurarControles() {
    // Play / Pause
    playBtn.addEventListener('click', () => {
        if (audioEl.paused) {
            audioEl.play();
            playBtn.innerText = "⏸";
        } else {
            audioEl.pause();
            playBtn.innerText = "▶";
        }
    });

    // Siguiente / Anterior
    document.getElementById('btn-next').addEventListener('click', () => {
        if (indiceActual < capitulosActuales.length - 1) {
            cargarPista(indiceActual + 1);
            audioEl.play();
            playBtn.innerText = "⏸";
        }
    });

    document.getElementById('btn-prev').addEventListener('click', () => {
        if (indiceActual > 0) {
            cargarPista(indiceActual - 1);
            audioEl.play();
            playBtn.innerText = "⏸";
        }
    });

    // Barra de progreso interactiva
    audioEl.addEventListener('timeupdate', () => {
        if (audioEl.duration) {
            const progress = (audioEl.currentTime / audioEl.duration) * 100;
            progressBar.value = progress;
            currentTimeEl.innerText = formatTime(audioEl.currentTime);
            totalTimeEl.innerText = formatTime(audioEl.duration);
        }
    });

    progressBar.addEventListener('input', () => {
        const seekTo = (progressBar.value / 100) * audioEl.duration;
        audioEl.currentTime = seekTo;
    });

    // Autoplay al terminar
    audioEl.addEventListener('ended', () => {
        if (indiceActual < capitulosActuales.length - 1) {
            cargarPista(indiceActual + 1);
            audioEl.play();
        } else {
            playBtn.innerText = "▶"; // Fin del libro
        }
    });
}

// Utilidad para formatear segundos a MM:SS
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}