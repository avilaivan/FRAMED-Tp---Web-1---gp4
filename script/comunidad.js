import { baseDeDatosPeliculas } from './data.js';

const PELIS_CARRUSEL = ["dune2", "oppenheimer", "interstellar", "batman", "joker"];
const CATEGORIAS = [
    { titulo: "Top Drama",           peliculas: ["oppenheimer", "joker", "parasite", "barbie"]     },
    { titulo: "Top Ciencia Ficción", peliculas: ["dune2", "interstellar", "inception", "matrix"]   },
    { titulo: "Top Acción",          peliculas: ["johnwick4", "madmax", "avengers", "deadpool3"]   },
    { titulo: "Top Terror",          peliculas: ["conjuro", "alien", "fnaf", "terminator"]         }
];

const USUARIOS_PREDEFINIDOS = [
    { nombre: "Pablo Gomez",     usuario: "@gomesdoblep22", avatar: "../img/perfil prueba.png" },
    { nombre: "Lucía Fernández", usuario: "@luciafer123",   avatar: "../img/perfil prueba.png" },
    { nombre: "Fercho_xX",       usuario: "@fercho99",      avatar: "../img/perfil prueba.png" },
    { nombre: "FanDelTerror",    usuario: "@terror_lover",  avatar: "../img/perfil prueba.png" }
];

let resenias      = [];
let indiceCarrusel = 0;
const estaLogueado = () => localStorage.getItem("sesionActiva") === "true";

export default function inicializarComunidad() {
    sembrarUsuariosPredefinidos();
    inicializarCarrusel();
    cargarReseniasComunidad();
    renderizarResenias();
    inicializarBuscador();
    renderizarCategorias();
    inicializarBorradoComunidad();
}

function sembrarUsuariosPredefinidos() {
    if (!localStorage.getItem("usuarios")) {
        localStorage.setItem("usuarios", JSON.stringify(USUARIOS_PREDEFINIDOS));
    }
}

function inicializarCarrusel() {
    const track   = document.getElementById("carrusel-track");
    const btnPrev = document.getElementById("btn-prev-carrusel");
    const btnNext = document.getElementById("btn-next-carrusel");
    if (!track || !btnPrev || !btnNext) return;

    PELIS_CARRUSEL.forEach(id => {
        const peli = baseDeDatosPeliculas[id];
        if (!peli) return;
        const item = document.createElement("div");
        item.classList.add("carrusel-item");
        item.innerHTML = `
            <video src="${peli.videoUrl}" loop muted autoplay></video>
            <div class="carrusel-overlay"></div>
            <div class="carrusel-contenido">
                <img src="${peli.portadaUrl}" alt="${peli.titulo}" class="carrusel-portada">
                <div class="carrusel-info">
                    <h3>${peli.titulo}</h3>
                    <p class="datos">${peli.info} • ${peli.director}</p>
                    <p class="sinopsis">${peli.sinopsis}</p>
                    <p class="estrellas">${peli.estrellas}</p>
                </div>
            </div>
        `;
        track.appendChild(item);
    });

    btnNext.addEventListener("click", () => {
        if (indiceCarrusel < PELIS_CARRUSEL.length - 1) {
            indiceCarrusel++;
            track.style.transform = `translateX(${-(indiceCarrusel * 100)}%)`;
        }
    });
    btnPrev.addEventListener("click", () => {
        if (indiceCarrusel > 0) {
            indiceCarrusel--;
            track.style.transform = `translateX(${-(indiceCarrusel * 100)}%)`;
        }
    });
}

function cargarReseniasComunidad() {
    resenias = [
        { autor: "Pablo Gomez",     usuario: "@gomesdoblep22", texto: "¡Una obra maestra absoluta!",       likes: 15, dislikes: 1, fecha: Date.now() - 50000,   pelicula: baseDeDatosPeliculas["dune2"]   },
        { autor: "Lucía Fernández", usuario: "@luciafer123",   texto: "El final lo compensa todo.",        likes: 8,  dislikes: 2, fecha: Date.now() - 100000,  pelicula: baseDeDatosPeliculas["oppenheimer"]   },
        { autor: "Fercho_xX",       usuario: "@fercho99",      texto: "La banda sonora es la mejor.",      likes: 24, dislikes: 0, fecha: Date.now() - 200000,  pelicula: baseDeDatosPeliculas["interstellar"]  }
    ];

    const misResenas = JSON.parse(localStorage.getItem('misResenas')) || [];
    const datosPerfil = JSON.parse(localStorage.getItem('datosPerfil')) || { nombre: "Tu Usuario", usuario: localStorage.getItem("nombreUsuarioActivo") || "@usuario" };
    
    misResenas.forEach(miRes => {
        resenias.push({
            id_peli: miRes.id,
            autor: datosPerfil.nombre,
            usuario: datosPerfil.usuario,
            texto: miRes.texto,
            likes: 0,
            fecha: Date.now(), 
            pelicula: baseDeDatosPeliculas[miRes.id],
            esMia: true 
        });
    });

    resenias.sort((a, b) => b.fecha - a.fecha);
}

function renderizarResenias() {
    const contenedor = document.getElementById("resenias-container");
    if (!contenedor) return;

    contenedor.querySelectorAll(".resenia-card").forEach(c => c.remove());

    const estaLog = localStorage.getItem("sesionActiva") === "true";

    resenias.forEach(r => {
        const card = document.createElement("article");
        card.classList.add("resenia-card");

        const esMiaVisual = estaLog && r.esMia;
        const colorBorde = esMiaVisual ? "border: 1px solid #68ff8f;" : "";
        const badgeMia = esMiaVisual ? `<span style="color:#68ff8f; font-size:0.8rem; margin-left:10px;">(Tú)</span>` : "";
        const btnEliminar = esMiaVisual ? `<button class="btn-eliminar-comunidad" data-id="${r.id_peli}" style="border: none; background: transparent; cursor: pointer; color: #ff4d4d; font-size: 1.1rem; margin-left: auto;" title="Eliminar reseña"><i class="fa-solid fa-trash"></i></button>` : "";

        const htmlPeli = r.pelicula ? `
            <div class="resenia-header-peli">
                <a href="../pages/detalle-peli.html?id=${r.id_peli || ''}">
                    <img src="${r.pelicula.portadaUrl}" alt="${r.pelicula.titulo}" class="resenia-portada">
                </a>
                <div class="resenia-datos-peli">
                    <h3>${r.pelicula.titulo}</h3>
                    <span>${r.pelicula.info}</span>
                </div>
            </div>` : "";

        card.innerHTML = `
            ${htmlPeli}
            <div class="resenia-autor" style="${colorBorde}">
                <img src="../img/perfil prueba.png" alt="avatar">
                <div style="display:flex; justify-content:space-between; width:100%;">
                    <div><h4>${r.autor} ${badgeMia}</h4><p>${r.usuario}</p></div>
                </div>
            </div>
            <p class="resenia-texto">${r.texto}</p>
            <div class="resenia-acciones" style="display:flex; justify-content:space-between;">
                <button class="btn-like"><i class="fa-solid fa-thumbs-up"></i><span>${r.likes}</span></button>
                ${btnEliminar}
            </div>
        `;
        contenedor.appendChild(card);
    });

    document.querySelectorAll(".btn-like").forEach(btn => {
        btn.addEventListener("click", () => {
            if (!estaLog) { alert("Debes iniciar sesión para valorar."); return; }
            const sL = btn.querySelector("span");
            if (!btn.classList.contains("activo")) {
                sL.textContent = +sL.textContent + 1;
                btn.classList.add("activo");
            } else {
                sL.textContent = +sL.textContent - 1;
                btn.classList.remove("activo");
            }
        });
    });
}

function inicializarBorradoComunidad() {
    document.body.addEventListener('click', e => {
        const btnEliminar = e.target.closest('.btn-eliminar-comunidad');
        if (btnEliminar) {
            if (confirm("¿Seguro que querés eliminar esta reseña?")) {
                const idAEliminar = btnEliminar.dataset.id;
                let misResenas = JSON.parse(localStorage.getItem('misResenas')) || [];
                misResenas = misResenas.filter(r => r.id !== idAEliminar);
                localStorage.setItem('misResenas', JSON.stringify(misResenas));
                
                cargarReseniasComunidad();
                renderizarResenias();
            }
        }
    });
}

function inicializarBuscador() {
    const input      = document.getElementById("input-busqueda");
    const resultados = document.getElementById("resultados-busqueda");
    if (!input || !resultados) return;

    input.addEventListener("input", () => {
        const query = input.value.trim().toLowerCase();
        resultados.innerHTML = "";

        if (query.length < 2) { resultados.classList.remove("activo"); return; }

        let usuarios = [];
        try {
            const data = localStorage.getItem("usuarios");
            if (data) usuarios = JSON.parse(data) || [];
        } catch (e) {}

        try {
            const perfil = JSON.parse(localStorage.getItem("datosPerfil"));
            if (perfil && !usuarios.find(u => u.usuario === perfil.usuario)) {
                usuarios.push(perfil);
            }
        } catch (e) {}

        const filtrados = usuarios.filter(u =>
            (u.nombre  && u.nombre.toLowerCase().includes(query)) ||
            (u.usuario && u.usuario.toLowerCase().includes(query))
        );

        resultados.classList.add("activo");

        if (filtrados.length === 0) {
            resultados.innerHTML = `<p class="sin-resultados-busqueda">Sin resultados para "${input.value}"</p>`;
            return;
        }

        filtrados.slice(0, 6).forEach(u => {
            const item = document.createElement("a");
            item.classList.add("resultado-usuario");
            item.href = "../pages/perfil.html";
            item.innerHTML = `
                <img src="${u.avatar || '../img/perfil prueba.png'}" alt="${u.nombre}">
                <div class="resultado-info">
                    <span class="resultado-nombre">${u.nombre || 'Usuario'}</span>
                    <span class="resultado-user">${u.usuario || ''}</span>
                </div>
            `;
            resultados.appendChild(item);
        });
    });

    document.addEventListener("click", e => {
        if (!e.target.closest(".buscador-aside")) {
            resultados.classList.remove("activo");
            resultados.innerHTML = "";
        }
    });
}

function renderizarCategorias() {
    const contenedor = document.getElementById("categorias-comunidad");
    if (!contenedor) return;

    CATEGORIAS.forEach(cat => {
        const bloque = document.createElement("div");
        bloque.classList.add("categoria-bloque");

        const header = document.createElement("div");
        header.classList.add("resenias-titulo");
        header.innerHTML = `<h2>${cat.titulo}</h2>`;
        bloque.appendChild(header);

        const grid = document.createElement("div");
        grid.classList.add("grid-categoria-comunidad");

        cat.peliculas.forEach(id => {
            const peli = baseDeDatosPeliculas[id];
            if (!peli) return;
            const card = document.createElement("div");
            card.classList.add("peli-cat-card");
            card.innerHTML = `
                <a href="../pages/detalle-peli.html?id=${id}">
                    <img src="${peli.portadaUrl}" alt="${peli.titulo}">
                </a>
                <h3>${peli.titulo}</h3>
                <p>${peli.info}</p>
            `;
            grid.appendChild(card);
        });

        bloque.appendChild(grid);
        contenedor.appendChild(bloque);
    });
}