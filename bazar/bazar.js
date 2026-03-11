/**
 * ========================================================
 * THE LOOKOUTS - CONTROLADOR INTEGRAL DEL BAZAR
 * ========================================================
 */

let librosGlobal = [];
let perfilesGlobal = [];
let paginaActual = 1;
const librosPorPagina = 12; // Límite de 4 filas de 3 libros

document.addEventListener("DOMContentLoaded", () => {
    cargarBazar();
    configurarModal();
});

/**
 * 1. CARGA DE DATOS
 */
async function cargarBazar() {
    try {
        // Cargar Perfiles de Miembros
        const resPerfiles = await fetch('../perfiles/perfiles.json');
        if (!resPerfiles.ok) throw new Error("No se pudo cargar perfiles.json");
        perfilesGlobal = await resPerfiles.json();

        // Cargar Datos de Google Sheets
        const SHEET_ID = '1aorzvdi94_UIU5nV092NTTu02cj_QgMORzFTWiE-aCc';
        const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

        const resBazar = await fetch(SHEET_URL);
        const textoBazar = await resBazar.text();

        const jsonString = textoBazar.substring(textoBazar.indexOf('{'), textoBazar.lastIndexOf('}') + 1);
        const dataGoogle = JSON.parse(jsonString);

        // Formatear y Limpiar Datos
        librosGlobal = dataGoogle.table.rows.map(row => {
            if (!row || !row.c || !row.c[0]) return null;
            return {
                id: row.c[0] ? row.c[0].v : '',
                propietarioId: row.c[1] ? row.c[1].v : '',
                titulo: row.c[2] ? row.c[2].v : '',
                autor: row.c[3] ? row.c[3].v : '',
                portada: row.c[4] ? row.c[4].v : '',
                estado_fisico: row.c[5] ? row.c[5].v : '',
                busca_a_cambio: row.c[6] ? row.c[6].v : '',
                disponible: row.c[7] ? (String(row.c[7].v).toUpperCase() === 'TRUE' || row.c[7].v === true) : false
            };
        }).filter(libro => libro !== null && libro.disponible);

        inicializarFiltros();
        ejecutarFiltrado(); // Primera carga de tarjetas

        // Animaciones de entrada
        setTimeout(() => {
            document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('is-visible'));
        }, 100);

    } catch (error) {
        console.error("Error crítico en el Bazar:", error);
        const grid = document.getElementById('bazar-grid');
        if (grid) grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: red;">Error al conectar con la base de datos.</p>';
    }
}

/**
 * 2. SISTEMA DE FILTROS Y BÚSQUEDA
 */
function inicializarFiltros() {
    const estadoSelect = document.getElementById('filter-estado');
    const miembroSelect = document.getElementById('filter-miembro');
    const searchInput = document.getElementById('bazar-search');

    if (!estadoSelect || !miembroSelect || !searchInput) return;

    // Llenar estados únicos
    const estadosUnicos = [...new Set(librosGlobal.map(l => l.estado_fisico))];
    estadosUnicos.forEach(estado => {
        if (estado) estadoSelect.innerHTML += `<option value="${estado}">${estado}</option>`;
    });

    // Llenar miembros dinámicamente
    const miembrosUnicosIds = [...new Set(librosGlobal.map(l => l.propietarioId))];
    miembrosUnicosIds.forEach(id => {
        const perfil = perfilesGlobal.find(p => p.id === id);
        if (perfil) {
            miembroSelect.innerHTML += `<option value="${id}">${perfil.nombre}</option>`;
        }
    });

    searchInput.addEventListener('input', aplicarFiltros);
    estadoSelect.addEventListener('change', aplicarFiltros);
    miembroSelect.addEventListener('change', aplicarFiltros);
}

function aplicarFiltros() {
    paginaActual = 1; // Reiniciar paginación al filtrar
    ejecutarFiltrado();
}

function ejecutarFiltrado() {
    const textoBusqueda = document.getElementById('bazar-search').value.toLowerCase();
    const estadoFiltro = document.getElementById('filter-estado').value;
    const miembroFiltro = document.getElementById('filter-miembro').value;

    const filtrados = librosGlobal.filter(libro => {
        const coincideTexto = libro.titulo.toLowerCase().includes(textoBusqueda) ||
            libro.autor.toLowerCase().includes(textoBusqueda);
        const coincideEstado = estadoFiltro === 'todos' || libro.estado_fisico === estadoFiltro;
        const coincideMiembro = miembroFiltro === 'todos' || libro.propietarioId === miembroFiltro;
        return coincideTexto && coincideEstado && coincideMiembro;
    });

    renderizarTarjetas(filtrados);
}

function resetearFiltros() {
    document.getElementById('bazar-search').value = '';
    document.getElementById('filter-estado').value = 'todos';
    document.getElementById('filter-miembro').value = 'todos';
    aplicarFiltros();
}

/**
 * 3. RENDERIZADO Y PAGINACIÓN
 */
function renderizarTarjetas(libros) {
    const grid = document.getElementById('bazar-grid');
    const paginacionContenedor = document.getElementById('bazar-pagination');
    if (!grid) return;

    // Caso: No hay resultados
    if (libros.length === 0) {
        grid.innerHTML = `
            <div class="no-results-container">
                <p>No se encontraron libros con estos filtros.</p>
                <button id="btn-reset-filtros" class="btn-reset">Limpiar todos los filtros</button>
            </div>
        `;
        if (paginacionContenedor) paginacionContenedor.innerHTML = '';
        document.getElementById('btn-reset-filtros').addEventListener('click', resetearFiltros);
        return;
    }

    // Lógica de troceado para paginación
    const inicio = (paginaActual - 1) * librosPorPagina;
    const fin = inicio + librosPorPagina;
    const librosVisibles = libros.slice(inicio, fin);

    grid.innerHTML = librosVisibles.map(libro => {
        const dueño = perfilesGlobal.find(p => p.id === libro.propietarioId) || { nombre: "Miembro", foto: "../recursos/logos/logo.png" };
        return `
            <div class="bazar-card is-visible">
                <div class="book-state-badge">${libro.estado_fisico}</div>
                <img src="${libro.portada}" alt="Portada de ${libro.titulo}" class="book-cover-3d">
                <h3 class="bazar-title">${libro.titulo}</h3>
                <p class="bazar-author">${libro.autor}</p>
                <div class="owner-section">
                    <img src="${dueño.foto}" alt="${dueño.nombre}" class="owner-avatar">
                    <span class="owner-name">Ofrecido por ${dueño.nombre}</span>
                </div>
                <button class="btn-trueque" 
                    data-titulo="${libro.titulo}" 
                    data-dueño="${dueño.nombre}" 
                    data-busca="${libro.busca_a_cambio}">
                    Proponer Trueque
                </button>
            </div>
        `;
    }).join('');

    renderizarPaginacion(libros.length);
    activarBotonesTrueque();
}

function renderizarPaginacion(totalItems) {
    const contenedor = document.getElementById('bazar-pagination');
    if (!contenedor) return;

    const totalPaginas = Math.ceil(totalItems / librosPorPagina);
    if (totalPaginas <= 1) {
        contenedor.innerHTML = '';
        return;
    }

    let html = '';
    for (let i = 1; i <= totalPaginas; i++) {
        html += `<button class="page-btn ${i === paginaActual ? 'active' : ''}" onclick="cambiarPagina(${i})">${i}</button>`;
    }
    contenedor.innerHTML = html;
}

window.cambiarPagina = (num) => {
    paginaActual = num;
    // Subir scroll suavemente al inicio de los filtros
    window.scrollTo({
        top: document.querySelector('.bazar-filters').offsetTop - 100,
        behavior: 'smooth'
    });
    ejecutarFiltrado();
};

/**
 * 4. GESTIÓN DEL MODAL
 */
function configurarModal() {
    const modal = document.getElementById('trueque-modal');
    const closeBtn = document.getElementById('close-modal');
    const entendidoBtn = document.getElementById('btn-entendido');

    if (!modal) return;
    const cerrar = () => modal.classList.remove('active');

    if (closeBtn) closeBtn.addEventListener('click', cerrar);
    if (entendidoBtn) entendidoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cerrar();
    });
    modal.addEventListener('click', (e) => { if (e.target === modal) cerrar(); });
}

function activarBotonesTrueque() {
    // IMPORTANTE: Solo seleccionamos los botones DENTRO del grid para evitar conflictos con el modal
    const botones = document.querySelectorAll('#bazar-grid .btn-trueque');
    const modal = document.getElementById('trueque-modal');
    const modalOwnerName = document.getElementById('modal-owner-name');
    const modalBody = document.getElementById('modal-body-content');

    if (!modal) return;

    botones.forEach(btn => {
        btn.onclick = () => {
            const titulo = btn.getAttribute('data-titulo');
            const dueño = btn.getAttribute('data-dueño');
            const busca = btn.getAttribute('data-busca');

            if (modalOwnerName) modalOwnerName.innerText = dueño;
            if (modalBody) {
                modalBody.innerHTML = `
                    <p style="margin-bottom: 10px;">Estás interesado en: <strong style="color: var(--blue-dark);">${titulo}</strong></p>
                    <p>El propietario busca a cambio:<br> <em style="color: var(--blue-dark); display: block; margin-top: 5px;">"${busca}"</em></p>
                `;
            }
            modal.classList.add('active');
        };
    });
}