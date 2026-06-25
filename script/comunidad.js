// Variable simulada para saber si el usuario está logueado. 
// Cuando conectes tu backend o validación, puedes actualizarla.
const ESTA_LOGUEADO = false;

const baseDeDatosPeliculas = {
    "dune2": { titulo: "Dune: Parte 2", info: "2 h 46 min | 2024 | Ciencia Ficción", sinopsis: "Paul Atreides se une a Chani y a los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia.", elenco: "Elenco: Timothée Chalamet, Zendaya", director: "Director: Denis Villeneuve", videoUrl: "../img/video_dune2.mp4", portadaUrl: "../img/dune2.png", estrellas: "★★★★★ <span>(5/5)</span>" },
    "oppenheimer": { titulo: "Oppenheimer", info: "3 h 0 min | 2023 | Drama / Biografía", sinopsis: "La historia del científico estadounidense J. Robert Oppenheimer y su papel en el desarrollo de la bomba atómica.", elenco: "Elenco: Cillian Murphy, Emily Blunt", director: "Director: Christopher Nolan", videoUrl: "../img/video_oppenheimer.mp4", portadaUrl: "../img/oppenheimer.png", estrellas: "★★★★★ <span>(4.8/5)</span>" },
    "interstellar": { titulo: "Interestelar", info: "2 h 49 min | 2014 | Ciencia Ficción", sinopsis: "Un equipo de exploradores viaja a través de un agujero de gusano en el espacio en un intento por garantizar la supervivencia de la humanidad.", elenco: "Elenco: Matthew McConaughey, Anne Hathaway", director: "Director: Christopher Nolan", videoUrl: "../img/video_interstellar.mp4", portadaUrl: "../img/interstellar.png", estrellas: "★★★★★ <span>(4.9/5)</span>" },
    "batman": { titulo: "The Batman", info: "2 h 56 min | 2022 | Acción / Noir", sinopsis: "Cuando el Acertijo, un sádico asesino en serie, comienza a asesinar a figuras políticas clave, Batman se ve obligado a investigar la corrupción oculta.", elenco: "Elenco: Robert Pattinson, Zoë Kravitz", director: "Director: Matt Reeves", videoUrl: "../img/video_batman.mp4", portadaUrl: "../img/batman.png", estrellas: "★★★★☆ <span>(4.2/5)</span>" },
    "joker": { titulo: "Joker", info: "2 h 2 min | 2019 | Drama", sinopsis: "Arthur Fleck, un comediante fallido marginado y aislado por la sociedad, desciende lentamente a la locura.", elenco: "Elenco: Joaquin Phoenix, Robert De Niro", director: "Director: Todd Phillips", videoUrl: "../img/video_joker.mp4", portadaUrl: "../img/joker.png", estrellas: "★★★★☆ <span>(4.5/5)</span>" }
};

let resenias = [];
const MAX_RESENIAS = 10;
let indiceCarrusel = 0;

export default function inicializarComunidad() {
    inicializarCarrusel();
    cargarReseniasIniciales();
    renderizarResenias();

    inicializarGrupos();
    inicializarFiltros();
    inicializarPublicacion();
    inicializarScroll();
    inicializarModalResenias();
}

function inicializarCarrusel() {
    const track = document.getElementById("carrusel-track");
    const btnPrev = document.getElementById("btn-prev-carrusel");
    const btnNext = document.getElementById("btn-next-carrusel");
    
    if(!track || !btnPrev || !btnNext) return;

    const peliculasArray = Object.values(baseDeDatosPeliculas);

    peliculasArray.forEach(peli => {
        const item = document.createElement("div");
        item.classList.add("carrusel-item");
        
        // Estructura adaptada para el formato Hero Horizontal
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

    const totalPeliculas = peliculasArray.length;

    btnNext.addEventListener("click", () => {
        if (indiceCarrusel < totalPeliculas - 1) {
            indiceCarrusel++;
            actualizarPosicionCarrusel(track);
        }
    });

    btnPrev.addEventListener("click", () => {
        if (indiceCarrusel > 0) {
            indiceCarrusel--;
            actualizarPosicionCarrusel(track);
        }
    });
}

function actualizarPosicionCarrusel(track) {
    // Como ahora mostramos 1 elemento al 100% de ancho
    const desplazamiento = -(indiceCarrusel * 100);
    track.style.transform = `translateX(${desplazamiento}%)`;
}

function cargarReseniasIniciales() {
    const keysPeliculas = Object.keys(baseDeDatosPeliculas);
    
    resenias = [
        {
            autor: "Pablo Gomez",
            usuario: "@gomesdoblep22",
            texto: "¡Una obra maestra absoluta! La cinematografía es increíble y las actuaciones están a otro nivel. No puedo dejar de recomendarla.",
            likes: 15,
            dislikes: 1,
            fecha: Date.now(),
            pelicula: baseDeDatosPeliculas[keysPeliculas[0]]
        },
        {
            autor: "Lucía Fernández",
            usuario: "@luciafer123",
            texto: "Me pareció un poco lenta al principio, pero el final lo compensa todo. Muy buena ambientación.",
            likes: 8,
            dislikes: 2,
            fecha: Date.now() - 100000,
            pelicula: baseDeDatosPeliculas[keysPeliculas[1]]
        },
        {
            autor: "Fercho_xX",
            usuario: "@fercho99",
            texto: "Increíble cómo logran mantener la tensión todo el tiempo. La banda sonora es de lo mejor que he escuchado este año.",
            likes: 24,
            dislikes: 0,
            fecha: Date.now() - 200000,
            pelicula: baseDeDatosPeliculas[keysPeliculas[2]]
        }
    ];
}

function renderizarResenias() {
    const contenedor = document.getElementById("resenias-container");
    if(!contenedor) return;

    contenedor.querySelectorAll(".resenia-card").forEach(c => c.remove());

    resenias.forEach(r => {
        const card = document.createElement("article");
        card.classList.add("resenia-card");

        let htmlPelicula = "";
        if(r.pelicula) {
            htmlPelicula = `
                <div class="resenia-header-peli">
                    <img src="${r.pelicula.portadaUrl}" alt="${r.pelicula.titulo}" class="resenia-portada">
                    <div class="resenia-datos-peli">
                        <h3>${r.pelicula.titulo}</h3>
                        <span>${r.pelicula.info}</span>
                    </div>
                </div>
            `;
        }

        card.innerHTML = `
            ${htmlPelicula}
            <div class="resenia-autor">
                <img src="../img/perfil prueba.png">
                <div>
                    <h4>${r.autor}</h4>
                    <p>${r.usuario}</p>
                </div>
            </div>

            <p class="resenia-texto">${r.texto}</p>

            <div class="resenia-acciones">
                <button class="btn-like ${r.dioLike ? 'activo' : ''}">
                    <i class="fa-solid fa-thumbs-up"></i>
                    <span>${r.likes}</span>
                </button>
                <button class="btn-dislike ${r.dioDislike ? 'activo' : ''}">
                    <i class="fa-solid fa-thumbs-down"></i>
                    <span>${r.dislikes}</span>
                </button>
            </div>
        `;

        contenedor.appendChild(card);
    });

    inicializarLikesYDislikes();
}

function inicializarLikesYDislikes() {
    const botonesLike = document.querySelectorAll(".btn-like");
    const botonesDisLike = document.querySelectorAll(".btn-dislike");

    botonesLike.forEach(botonLike => {
        botonLike.addEventListener("click", () => {
            if(!ESTA_LOGUEADO) {
                alert("Debes iniciar sesión para valorar esta reseña.");
                return;
            }

            const card = botonLike.closest(".resenia-card");
            const botonDisLike = card.querySelector(".btn-dislike");
            const spanLike = botonLike.querySelector("span");
            const spanDisLike = botonDisLike.querySelector("span");

            if (!botonLike.classList.contains("activo")) {
                spanLike.textContent = Number(spanLike.textContent) + 1;
                if (botonDisLike.classList.contains("activo")) {
                    spanDisLike.textContent = Number(spanDisLike.textContent) - 1;
                }
                botonLike.classList.add("activo");
                botonDisLike.classList.remove("activo");
            } else {
                spanLike.textContent = Number(spanLike.textContent) - 1;
                botonLike.classList.remove("activo");
            }
        });
    });

    botonesDisLike.forEach(botonDisLike => {
        botonDisLike.addEventListener("click", () => {
            if(!ESTA_LOGUEADO) {
                alert("Debes iniciar sesión para valorar esta reseña.");
                return;
            }

            const card = botonDisLike.closest(".resenia-card");
            const botonLike = card.querySelector(".btn-like");
            const spanDisLike = botonDisLike.querySelector("span");
            const spanLike = botonLike.querySelector("span");

            if (!botonDisLike.classList.contains("activo")) {
                spanDisLike.textContent = Number(spanDisLike.textContent) + 1;
                if (botonLike.classList.contains("activo")) {
                    spanLike.textContent = Number(spanLike.textContent) - 1;
                }
                botonDisLike.classList.add("activo");
                botonLike.classList.remove("activo");
            } else {
                spanDisLike.textContent = Number(spanDisLike.textContent) - 1;
                botonDisLike.classList.remove("activo");
            }
        });
    });
}

function inicializarGrupos() {
    const botonUnirse = document.querySelectorAll(".btn-unirse");
    botonUnirse.forEach(boton => {
        boton.addEventListener("click", () => {
            if(!ESTA_LOGUEADO) {
                alert("Debes iniciar sesión para unirte a un grupo.");
                return;
            }

            if (boton.textContent.trim() == "Unirse") {
                boton.textContent = "Unido";
            } else {
                boton.textContent = "Unirse";
            }
        });
    });
}

function inicializarPublicacion() {
    const btn = document.getElementById("btn-publicar");
    const input = document.getElementById("input-resenia");
    const modal = document.getElementById("modal-resenia");
    const btnAbrir = document.getElementById("btn-abrir-modal");

    if(!btn || !input || !modal) return;

    btnAbrir.addEventListener("click", () => {
        if(!ESTA_LOGUEADO) {
            alert("Debes iniciar sesión para crear una reseña.");
            return;
        }
        modal.classList.remove("hidden");
    });

    btn.addEventListener("click", () => {
        const texto = input.value.trim();
        if (!texto) return;

        const keysPeliculas = Object.keys(baseDeDatosPeliculas);
        const peliAleatoria = baseDeDatosPeliculas[keysPeliculas[Math.floor(Math.random() * keysPeliculas.length)]];

        resenias.unshift({
            autor: "Mi Usuario",
            usuario: "@mi_user",
            texto,
            likes: 0,
            dislikes: 0,
            fecha: Date.now(),
            pelicula: peliAleatoria
        });

        input.value = "";
        modal.classList.add("hidden"); 

        renderizarResenias();
    });
}

function inicializarFiltros() {
    const btnRecientes = document.getElementById("btn-recientes");
    const btnPopulares = document.getElementById("btn-populares");

    if (!btnRecientes || !btnPopulares) return;

    btnRecientes.addEventListener("click", () => {
        resenias.sort((a, b) => b.fecha - a.fecha);
        renderizarResenias();
    });

    btnPopulares.addEventListener("click", () => {
        resenias.sort((a, b) => b.likes - a.likes);
        renderizarResenias();
    });
}

function inicializarScroll() {
    window.addEventListener("scroll", () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            cargarMas();
        }
    });
}

function cargarMas() {
    if (resenias.length >= MAX_RESENIAS) return;

    const keysPeliculas = Object.keys(baseDeDatosPeliculas);

    for (let i = 0; i < 2; i++) {
        if (resenias.length >= MAX_RESENIAS) {
            console.log("No hay más reseñas para cargar");
            return;
        }

        const peliAleatoria = baseDeDatosPeliculas[keysPeliculas[Math.floor(Math.random() * keysPeliculas.length)]];

        resenias.push({
            autor: "Usuario Nuevo",
            usuario: "@usuario_nuevo",
            texto: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus porro sit nobis perferendis quas ab impedit. Commodi laborum quos impedit voluptatum tempora dolores.",
            likes: Math.floor(Math.random() * 50),
            dislikes: Math.floor(Math.random() * 10),
            fecha: Date.now() - Math.floor(Math.random() * 1000000),
            pelicula: peliAleatoria
        });
    }

    renderizarResenias();
}

function inicializarModalResenias() {
    const modal = document.getElementById("modal-resenia");
    const btnCancelar = document.getElementById("btn-cancelar");

    if(!modal || !btnCancelar) return;

    btnCancelar.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    modal.addEventListener("click", (e) => {
        if (e.target == modal) {
            modal.classList.add("hidden");
        }
    });
}