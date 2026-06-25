// 1. IMPORTACIONES DE LOS COMPONENTES (Corregidas)
import generarHeader from './header-pages.js';
import generarFooter from './footer-pages.js';

// 2. BASE DE DATOS PARA LA BÚSQUEDA
const peliculasExplorar = [
    { id: "dune2", titulo: "Dune: Parte 2", genero: "Ciencia Ficción", idioma: "Inglés", portadaUrl: "../img/dune2.png", director: "Denis Villeneuve" },
    { id: "oppenheimer", titulo: "Oppenheimer", genero: "Drama / Biografía", idioma: "Inglés", portadaUrl: "../img/oppenheimer.png", director: "Christopher Nolan" },
    { id: "interstellar", titulo: "Interestelar", genero: "Ciencia Ficción", idioma: "Inglés", portadaUrl: "../img/interstellar.png", director: "Christopher Nolan" },
    { id: "batman", titulo: "The Batman", genero: "Acción / Noir", idioma: "Inglés", portadaUrl: "../img/batman.png", director: "Matt Reeves" },
    { id: "joker", titulo: "Joker", genero: "Drama / Suspenso", idioma: "Inglés", portadaUrl: "../img/joker.png", director: "Todd Phillips" },
    { id: "parasite", titulo: "Parásitos", genero: "Thriller", idioma: "Coreano", portadaUrl: "../img/parasite.png", director: "Bong Joon Ho" },
    { id: "avatar2", titulo: "Avatar: Camino del Agua", genero: "Ciencia Ficción", idioma: "Inglés", portadaUrl: "../img/avatar2.png", director: "James Cameron" },
    { id: "avengers", titulo: "Avengers: Endgame", genero: "Acción", idioma: "Inglés", portadaUrl: "../img/avengers.png", director: "Anthony Russo" },
    { id: "spiderman", titulo: "Spider-Man: No Way Home", genero: "Acción", idioma: "Inglés", portadaUrl: "../img/spiderman.png", director: "Jon Watts" },
    { id: "topgun", titulo: "Top Gun: Maverick", genero: "Acción", idioma: "Inglés", portadaUrl: "../img/topgun.png", director: "Joseph Kosinski" },
    { id: "barbie", titulo: "Barbie", genero: "Comedia", idioma: "Inglés", portadaUrl: "../img/barbie.png", director: "Greta Gerwig" },
    { id: "mario", titulo: "Super Mario Bros", genero: "Animación", idioma: "Español", portadaUrl: "../img/mario.png", director: "Aaron Horvath" },
    { id: "johnwick4", titulo: "John Wick 4", genero: "Acción", idioma: "Inglés", portadaUrl: "../img/johnwick4.png", director: "Chad Stahelski" },
    { id: "deadpool3", titulo: "Deadpool & Wolverine", genero: "Acción / Comedia", idioma: "Inglés", portadaUrl: "../img/deadpool3.png", director: "Shawn Levy" },
    { id: "madmax", titulo: "Mad Max: Furia en el Camino", genero: "Acción", idioma: "Inglés", portadaUrl: "../img/madmax.png", director: "George Miller" },
    { id: "gladiator", titulo: "Gladiador", genero: "Épico / Acción", idioma: "Inglés", portadaUrl: "../img/gladiator.png", director: "Ridley Scott" },
    { id: "matrix", titulo: "Matrix", genero: "Ciencia Ficción", idioma: "Inglés", portadaUrl: "../img/matrix.png", director: "Lana Wachowski" },
    { id: "inception", titulo: "El Origen", genero: "Ciencia Ficción / Thriller", idioma: "Inglés", portadaUrl: "../img/inception.png", director: "Christopher Nolan" },
    { id: "alien", titulo: "Alien: Romulus", genero: "Terror", idioma: "Inglés", portadaUrl: "../img/alien.png", director: "Fede Álvarez" },
    { id: "fnaf", titulo: "Five Nights at Freddy's", genero: "Terror", idioma: "Inglés", portadaUrl: "../img/fnaf.png", director: "Emma Tammi" },
    { id: "conjuro", titulo: "El Conjuro", genero: "Terror Sobrenatural", idioma: "Inglés", portadaUrl: "../img/conjuro.png", director: "James Wan" },
    { id: "terminator", titulo: "Terminator 2", genero: "Acción", idioma: "Inglés", portadaUrl: "../img/terminator.png", director: "James Cameron" },
    { id: "jurassic", titulo: "Jurassic Park", genero: "Aventura", idioma: "Inglés", portadaUrl: "../img/jurassic.png", director: "Steven Spielberg" },
    { id: "intensamente", titulo: "Intensamente 2", genero: "Animación", idioma: "Español", portadaUrl: "../img/intensamente.png", director: "Kelsey Mann" }
];

document.addEventListener("DOMContentLoaded", () => {
    // 3. EJECUTAMOS HEADER Y FOOTER DINÁMICOS
    generarHeader();
    generarFooter();

    // 4. CAPTURAMOS LOS ELEMENTOS DEL HTML
    const inputBuscador = document.getElementById("input-buscador");
    const contenedorResultados = document.getElementById("contenedor-resultados");
    const gridResultados = document.getElementById("grid-resultados");
    const seccionRecomendadas = document.getElementById("seccion-recomendadas");

    // 5. FUNCIÓN PARA DIBUJAR LAS TARJETAS DE RESULTADO
    function renderizarResultados(peliculas) {
        gridResultados.innerHTML = "";

        if (peliculas.length === 0) {
            gridResultados.innerHTML = `<p class="mensaje-vacio">No encontramos resultados para tu búsqueda.</p>`;
            return;
        }

        peliculas.forEach(peli => {
            const tarjetaHTML = `
                <div class="peliculaCartelera">
                    <div class="poster-wrapper">
                        <a href="../pages/detalle-peli.html?id=${peli.id}">
                            <img src="${peli.portadaUrl}" alt="${peli.titulo}">
                        </a>
                    </div>
                    <h3>${peli.titulo}</h3>
                    <p class="info-genero">${peli.genero}</p>
                    <p class="info-idioma">${peli.idioma}</p>
                </div>
            `;
            gridResultados.innerHTML += tarjetaHTML;
        });
    }

    // 6. EL EVENTO MÁGICO: CADA VEZ QUE SE SUELTA UNA TECLA
    inputBuscador.addEventListener("keyup", (evento) => {
        const textoBusqueda = evento.target.value.toLowerCase().trim();

        // Si el usuario borró todo y el buscador está vacío
        if (textoBusqueda === "") {
            contenedorResultados.style.display = "none"; // Ocultar resultados
            seccionRecomendadas.style.display = "block"; // Volver a mostrar populares
        } else {
            // Si hay texto, ocultamos las populares y mostramos resultados
            seccionRecomendadas.style.display = "none";
            contenedorResultados.style.display = "block";

            // Filtramos la base de datos
            const peliculasFiltradas = peliculasExplorar.filter(peli => {
                return peli.titulo.toLowerCase().includes(textoBusqueda) || 
                       peli.genero.toLowerCase().includes(textoBusqueda) ||
                       peli.director.toLowerCase().includes(textoBusqueda);
            });

            // Dibujamos las películas filtradas
            renderizarResultados(peliculasFiltradas);
        }
    });
});