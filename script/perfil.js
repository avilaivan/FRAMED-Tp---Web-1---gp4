import { baseDeDatosPeliculas } from './data.js';

export default function inicializarPerfil() {
    if (localStorage.getItem("sesionActiva") !== "true") {
        window.location.href = "../index.html";
        return;
    }

    const misMeGustas = JSON.parse(localStorage.getItem('misMeGustas')) || [];
    const misGuardados = JSON.parse(localStorage.getItem('misGuardados')) || [];
    let misResenas = JSON.parse(localStorage.getItem('misResenas')) || [];

    const datosPerfil = JSON.parse(localStorage.getItem('datosPerfil')) || {
        nombre: "Usuario123",
        usuario: localStorage.getItem("nombreUsuarioActivo") || "@usuario123",
        bio: "Cinéfilo apasionado. Escribiendo mis pensamientos sobre cada fotograma.",
        avatar: "../img/perfil prueba.png"
    };

    document.getElementById('nombre-perfil-main').textContent = datosPerfil.nombre;
    document.getElementById('usuario-perfil-main').textContent = datosPerfil.usuario;
    document.getElementById('bio-perfil-main').textContent = datosPerfil.bio;
    document.getElementById('img-perfil-main').src = datosPerfil.avatar;

    let resenaFijada = misResenas.length > 0 ? misResenas[0] : null;

    renderizarResenaFijada();
    renderizarListaReducida(misMeGustas, "grid-megustas", "Mis 'Me Gusta'");
    renderizarListaReducida(misGuardados, "grid-guardados", "Ver más tarde");

    function renderizarResenaFijada() {
        const contenedor = document.getElementById("contenedor-resena-fijada");
        if (!resenaFijada) {
            contenedor.innerHTML = `<p class="mensaje-vacio-perfil">Aún no has hecho ninguna reseña.</p>`;
            return;
        }

        const peliInfo = baseDeDatosPeliculas[resenaFijada.id];
        if(!peliInfo) return;

        // ✅ Se añadió el link en la portada para ir al detalle
        contenedor.innerHTML = `
            <div class="tarjeta-resena">
                <a href="../pages/detalle-peli.html?id=${resenaFijada.id}">
                    <img src="${peliInfo.portadaUrl}" alt="Poster" class="poster-peli" style="transition: transform 0.2s; cursor: pointer;">
                </a>
                <div class="resena-info">
                    <div class="resena-header">
                        <h3>${resenaFijada.titulo}</h3>
                        <span class="estrellas">${resenaFijada.estrellas}</span>
                    </div>
                    <p class="resena-texto">"${resenaFijada.texto}"</p>
                </div>
            </div>
        `;
    }

    function renderizarListaReducida(arrayIDs, contenedorID, tituloLista) {
        const contenedor = document.getElementById(contenedorID);
        contenedor.innerHTML = "";

        if (arrayIDs.length === 0) {
            contenedor.innerHTML = `<p class="mensaje-vacio-perfil">Aún no agregaste películas a esta lista.</p>`;
            return;
        }

        const limite = Math.min(arrayIDs.length, 3);
        for (let i = 0; i < limite; i++) {
            const peli = baseDeDatosPeliculas[arrayIDs[i]];
            if (peli) {
                contenedor.innerHTML += `
                    <div class="item-portada">
                        <a href="../pages/detalle-peli.html?id=${arrayIDs[i]}"><img src="${peli.portadaUrl}" alt="${peli.titulo}"></a>
                    </div>
                `;
            }
        }

        if (arrayIDs.length > 3) {
            const cantidadExtra = arrayIDs.length - 3;
            const peliFondo = baseDeDatosPeliculas[arrayIDs[3]]; 
            contenedor.innerHTML += `
                <div class="item-portada btn-abrir-lista" data-titulo="${tituloLista}" data-ids='${JSON.stringify(arrayIDs)}'>
                    <img src="${peliFondo.portadaUrl}" alt="Más películas">
                    <div class="capa-mas">+${cantidadExtra}</div>
                </div>
            `;
        }
    }

    document.querySelectorAll('.btn-cerrar-modal, .modal-overlay').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target === el) {
                document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('oculto'));
            }
        });
    });

    const btnEditarPerfil = document.getElementById('btn-editar-perfil');
    if(btnEditarPerfil) {
        btnEditarPerfil.addEventListener('click', () => {
            const actual = JSON.parse(localStorage.getItem('datosPerfil')) || datosPerfil;
            document.getElementById('input-nombre').value = actual.nombre;
            document.getElementById('input-bio').value = actual.bio;
            document.getElementById('modal-editar-perfil').classList.remove('oculto');
        });
    }

    const btnGuardarPerfil = document.getElementById('btn-guardar-perfil');
    if(btnGuardarPerfil) {
        btnGuardarPerfil.addEventListener('click', () => {
            const inputNombre = document.getElementById('input-nombre').value.trim();
            const inputBio = document.getElementById('input-bio').value.trim();
            const avatarElegido = document.querySelector('.avatar-opcion.activo');

            let nuevosDatos = JSON.parse(localStorage.getItem('datosPerfil')) || datosPerfil;

            if (inputNombre !== '') nuevosDatos.nombre = inputNombre;
            if (inputBio !== '') nuevosDatos.bio = inputBio;
            if (avatarElegido) nuevosDatos.avatar = avatarElegido.src;

            document.getElementById('nombre-perfil-main').textContent = nuevosDatos.nombre;
            document.getElementById('bio-perfil-main').textContent = nuevosDatos.bio;
            if (avatarElegido) document.getElementById('img-perfil-main').src = nuevosDatos.avatar;

            localStorage.setItem('datosPerfil', JSON.stringify(nuevosDatos));
            document.getElementById('modal-editar-perfil').classList.add('oculto');
        });
    }

    document.querySelectorAll('.avatar-opcion').forEach(avatar => {
        avatar.addEventListener('click', function() {
            document.querySelectorAll('.avatar-opcion').forEach(a => a.classList.remove('activo'));
            this.classList.add('activo');
        });
    });

    document.body.addEventListener('click', (e) => {
        const btnLista = e.target.closest('.btn-abrir-lista');
        if (!btnLista) return;

        const titulo = btnLista.dataset.titulo;
        const arrayIDs = JSON.parse(btnLista.dataset.ids);
        
        document.getElementById('titulo-modal-lista').textContent = titulo;
        const contenedorCompleto = document.getElementById('contenedor-lista-completa');
        contenedorCompleto.innerHTML = "";

        arrayIDs.forEach(id => {
            const peli = baseDeDatosPeliculas[id];
            if(peli) {
                contenedorCompleto.innerHTML += `<a href="../pages/detalle-peli.html?id=${id}"><img src="${peli.portadaUrl}"></a>`;
            }
        });

        document.getElementById('modal-ver-lista').classList.remove('oculto');
    });

    const btnCambiarFijada = document.getElementById('btn-cambiar-fijada');
    if(btnCambiarFijada) {
        btnCambiarFijada.addEventListener('click', () => {
            renderizarModalElegirResenas();
            document.getElementById('modal-cambiar-resena').classList.remove('oculto');
        });
    }

    function renderizarModalElegirResenas() {
        const contenedorModal = document.getElementById('contenedor-mis-resenas');
        contenedorModal.innerHTML = "";

        misResenas = JSON.parse(localStorage.getItem('misResenas')) || [];

        if(misResenas.length === 0) {
            contenedorModal.innerHTML = `<p class="mensaje-vacio-perfil">No tienes reseñas guardadas.</p>`;
        } else {
            misResenas.forEach((res, index) => {
                const peliInfo = baseDeDatosPeliculas[res.id];
                if(peliInfo) {
                    contenedorModal.innerHTML += `
                        <div class="tarjeta-resena">
                            <img src="${peliInfo.portadaUrl}" class="poster-peli">
                            <div class="resena-info">
                                <h3>${res.titulo}</h3>
                                <p class="resena-texto">"${res.texto}"</p>
                                <div style="display: flex; gap: 10px; margin-top: 10px; align-items: center;">
                                    <button class="btn-seleccionar-fija" data-index="${index}">Fijar en perfil</button>
                                    <a href="../pages/detalle-peli.html?id=${res.id}" class="btn-editar" style="text-decoration:none; padding:0.4rem 0.8rem;">Ir a película</a>
                                </div>
                            </div>
                        </div>
                    `;
                }
            });
        }
    }

    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-seleccionar-fija')) {
            const index = e.target.dataset.index;
            resenaFijada = misResenas[index];
            renderizarResenaFijada();
            document.getElementById('modal-cambiar-resena').classList.add('oculto');
        }
    });
}