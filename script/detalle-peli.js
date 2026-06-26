// script/detalle-peli.js
import generarHeader from './header-pages.js';
import generarFooter from './footer-pages.js';
import { baseDeDatosPeliculas } from './data.js';

document.addEventListener("DOMContentLoaded", () => {
    generarHeader();
    generarFooter();

    const urlParams  = new URLSearchParams(window.location.search);
    const idPelicula = urlParams.get('id');

    // Revisamos si el usuario tiene sesión activa
    const estaLogueado = localStorage.getItem("sesionActiva") === "true";

    if (!localStorage.getItem('misMeGustas')) localStorage.setItem('misMeGustas', JSON.stringify([]));
    if (!localStorage.getItem('misGuardados')) localStorage.setItem('misGuardados', JSON.stringify([]));
    if (!localStorage.getItem('misResenas')) localStorage.setItem('misResenas', JSON.stringify([]));

    if (!idPelicula) return;

    const peli = baseDeDatosPeliculas[idPelicula];
    if (!peli) {
        document.getElementById('peli-titulo').textContent = "Película no encontrada";
        return;
    }

    document.getElementById('peli-titulo').textContent    = peli.titulo;
    document.getElementById('peli-info').textContent      = peli.info;
    document.getElementById('peli-sinopsis').textContent  = peli.sinopsis;
    document.getElementById('peli-elenco').textContent    = peli.elenco;
    document.getElementById('peli-director').textContent  = peli.director;
    document.getElementById('peli-puntaje').innerHTML     = peli.estrellas;
    document.getElementById('peli-portada').src           = peli.portadaUrl;

    const videoElement = document.getElementById('video-fondo');
    videoElement.src = peli.videoUrl;
    videoElement.load();

    renderizarSeccionComentarios(idPelicula, estaLogueado);
    configurarInteracciones(idPelicula, peli, estaLogueado);

    // ── RENDERIZAR COMENTARIOS ────────────────────────────────────
    function renderizarSeccionComentarios(id, sesionActiva) {
        const contenedor = document.getElementById('contenedor-comentarios-listado');
        if (!contenedor) return;
        contenedor.innerHTML = `<h2>Últimas Reseñas</h2>`;

        const resenasTotales = JSON.parse(localStorage.getItem('misResenas')) || [];
        const resenaPropia   = resenasTotales.find(r => r.id === id);
        
        // Buscamos los datos de perfil para cuando no esté logueado
        const datosPerfil = JSON.parse(localStorage.getItem('datosPerfil')) || { usuario: localStorage.getItem("nombreUsuarioActivo") || "@usuario" };

        // Si existe tu reseña, decidimos CÓMO pintarla
        if (resenaPropia) {
            if (sesionActiva) {
                // 1. SI ESTÁ LOGUEADO: Verde, con tacho de basura e ID único
                contenedor.innerHTML += `
                    <div class="comentario-card2" style="background-color: rgba(104, 255, 143, 0.12); border: 1px solid #68ff8f; box-shadow: 0 0 10px rgba(104, 255, 143, 0.2);">
                        <div class="comentario-header2">
                            <span class="usuario" style="color:#68ff8f; display:flex; align-items:center; gap:10px;">
                                <i class="fa-solid fa-user"></i> Tu Reseña
                                <button id="btn-borrar-mi-resena" style="background:transparent; border:none; cursor:pointer; color:#ff4d4d; font-size:1.1rem; padding: 0 5px;" title="Eliminar reseña">
                                    <i class="fa-solid fa-trash" style="pointer-events:none;"></i>
                                </button>
                            </span>
                            <span class="estrellas">${resenaPropia.estrellas}</span>
                        </div>
                        <p class="comentario-texto2" style="font-style:italic;">"${resenaPropia.texto}"</p>
                    </div>
                `;
            } else {
                // 2. SI NO ESTÁ LOGUEADO: Se ve como una reseña común (gris, con tu arroba, sin tacho)
                contenedor.innerHTML += `
                    <div class="comentario-card2">
                        <div class="comentario-header2">
                            <span class="usuario">${datosPerfil.usuario}</span>
                            <span class="estrellas">${resenaPropia.estrellas}</span>
                        </div>
                        <p class="comentario-texto2">"${resenaPropia.texto}"</p>
                    </div>
                `;
            }
        }

        // Renderizamos el resto de reseñas estáticas de la comunidad
        contenedor.innerHTML += `
            <div class="comentario-card2">
                <div class="comentario-header2">
                    <span class="usuario">@ santi_cine</span>
                    <span class="estrellas">★★★★★</span>
                </div>
                <p class="comentario-texto2">La escena del sommelier táctico es pura poesía cinematográfica. El ritmo y la elegancia son de lo mejor del cine moderno.</p>
            </div>
            <div class="comentario-card2">
                <div class="comentario-header2">
                    <span class="usuario">@ marcos_wick</span>
                    <span class="estrellas">★★★★</span>
                </div>
                <p class="comentario-texto2">Visualmente es una locura. Keanu Reeves mantiene una presencia brutal. Imposible aburrirse.</p>
            </div>
        `;

        // ✅ FIX DEL TACHO: Asignamos el clic directamente al botón justo después de crearlo
        if (sesionActiva && resenaPropia) {
            const btnBasurero = document.getElementById('btn-borrar-mi-resena');
            if (btnBasurero) {
                btnBasurero.addEventListener('click', () => {
                    if (confirm("¿Estás seguro de que querés eliminar tu reseña? Esta acción no se puede deshacer.")) {
                        let resenas = JSON.parse(localStorage.getItem('misResenas')) || [];
                        resenas = resenas.filter(r => r.id !== id);
                        localStorage.setItem('misResenas', JSON.stringify(resenas));
                        
                        // Recargamos los comentarios sin recargar la página entera
                        renderizarSeccionComentarios(id, sesionActiva);
                    }
                });
            }
        }
    }

    // ── INTERACCIONES (LIKE, GUARDAR, MODAL) ──────────────────────
    function configurarInteracciones(id, peli, sesionActiva) {
        const btnLike       = document.getElementById('btn-like-peli');
        const btnGuardar    = document.getElementById('btn-guardar-peli');
        const btnAbrirModal = document.getElementById('btn-abrir-resena-modal');
        const modal         = document.getElementById('modal-crear-resena-peli');
        const btnCancelar   = document.getElementById('btn-cancelar-resena-modal');
        const btnPublicar   = document.getElementById('btn-publicar-resena-peli');
        const estrellasClick = document.querySelectorAll('.star-click');
        const textareaResena = document.getElementById('textarea-nueva-resena');

        let puntajeSeleccionado = 0;

        const verificarSesion = () => {
            if (!sesionActiva) {
                alert('Debes iniciar sesión para usar esta función en Framed.');
                return false;
            }
            return true;
        };

        // Si no hay sesión activa, los botones jamás se pintan de verde
        let meGustas  = sesionActiva ? (JSON.parse(localStorage.getItem('misMeGustas'))  || []) : [];
        let guardados = sesionActiva ? (JSON.parse(localStorage.getItem('misGuardados')) || []) : [];

        if (meGustas.includes(id))  btnLike?.style && (btnLike.style.filter    = "drop-shadow(0px 0px 8px #68ff8f) hue-rotate(90deg)");
        else btnLike?.style && (btnLike.style.filter = "none");

        if (guardados.includes(id)) btnGuardar?.style && (btnGuardar.style.filter = "drop-shadow(0px 0px 8px #68ff8f) hue-rotate(90deg)");
        else btnGuardar?.style && (btnGuardar.style.filter = "none");

        // EVENTOS CLICK LIKE / GUARDAR
        btnLike?.addEventListener('click', () => {
            if (!verificarSesion()) return;
            let actual = JSON.parse(localStorage.getItem('misMeGustas')) || [];
            if (!actual.includes(id)) {
                actual.push(id);
                btnLike.style.filter = "drop-shadow(0px 0px 8px #68ff8f) hue-rotate(90deg)";
            } else {
                actual = actual.filter(item => item !== id);
                btnLike.style.filter = "none";
            }
            localStorage.setItem('misMeGustas', JSON.stringify(actual));
            animarBoton(btnLike);
        });

        btnGuardar?.addEventListener('click', () => {
            if (!verificarSesion()) return;
            let actual = JSON.parse(localStorage.getItem('misGuardados')) || [];
            if (!actual.includes(id)) {
                actual.push(id);
                btnGuardar.style.filter = "drop-shadow(0px 0px 8px #68ff8f) hue-rotate(90deg)";
            } else {
                actual = actual.filter(item => item !== id);
                btnGuardar.style.filter = "none";
            }
            localStorage.setItem('misGuardados', JSON.stringify(actual));
            animarBoton(btnGuardar);
        });

        // ABRIR MODAL
        btnAbrirModal?.addEventListener('click', () => {
            if (!verificarSesion()) return;
            const resenas = JSON.parse(localStorage.getItem('misResenas')) || [];
            if (resenas.find(r => r.id === id)) {
                alert("Ya dejaste una reseña en esta película. Si querés escribir otra, primero eliminala usando el tacho de basura verde.");
                return;
            }
            puntajeSeleccionado = 0;
            resetearEstrellas(0);
            if (textareaResena) textareaResena.value = "";
            modal?.classList.remove('oculto');
        });

        btnCancelar?.addEventListener('click', () => modal?.classList.add('oculto'));

        // ESTRELLAS RATING
        estrellasClick.forEach(star => {
            star.addEventListener('click', function () {
                puntajeSeleccionado = parseInt(this.getAttribute('data-value'));
                resetearEstrellas(puntajeSeleccionado);
            });
        });

        function resetearEstrellas(cantidad) {
            estrellasClick.forEach((s, idx) => {
                s.classList.toggle('fa-solid',  idx < cantidad);
                s.classList.toggle('fa-regular', idx >= cantidad);
            });
        }

        // PUBLICAR NUEVA RESEÑA
        btnPublicar?.addEventListener('click', () => {
            const texto = textareaResena?.value.trim();
            if (puntajeSeleccionado === 0) { alert('Seleccioná una puntuación en estrellas.'); return; }
            if (!texto)                    { alert('Escribí un comentario para tu reseña.'); return; }

            const strEstrellas = "★".repeat(puntajeSeleccionado) + "☆".repeat(5 - puntajeSeleccionado);
            let todasLasResenas = JSON.parse(localStorage.getItem('misResenas')) || [];
            
            // Se inserta al principio
            todasLasResenas.unshift({ id, titulo: peli.titulo, estrellas: strEstrellas, texto });
            localStorage.setItem('misResenas', JSON.stringify(todasLasResenas));

            modal?.classList.add('oculto');
            
            // Renderizamos instantáneamente
            renderizarSeccionComentarios(id, sesionActiva);
        });

        function animarBoton(btn) {
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => btn.style.transform = 'scale(1)', 200);
        }
    }
});