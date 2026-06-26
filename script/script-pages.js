import generarHeader from './header-pages.js';
import generarFooter from './footer-pages.js';

import generarLoginRegistro from './registrar-user.js';
import generarOlvidarPassword from './olvidar-contrasenia.js';
import generarNuevaPassword from './nueva-contrasenia.js';

import inicializarComunidad from './comunidad.js';
import inicializarPerfil from './perfil.js'; // Asegúrate de importar el perfil

document.addEventListener("DOMContentLoaded", () => {
    generarHeader();
    generarFooter();   

    const ruta = window.location.pathname;

    if (ruta.includes("olvidar-contrasenia")) {
        generarOlvidarPassword();
    } else if (ruta.includes("nueva-contrasenia")) {
        generarNuevaPassword();
    } else if (ruta.includes("login") || ruta.includes("registrar")) {
        generarLoginRegistro();
    } else if (ruta.includes("comunidad")) {
         inicializarComunidad();
    } else if (ruta.includes("perfil")) {
         inicializarPerfil();
    }

    // Lógica Global para CERRAR SESIÓN en cualquier página
    const btnCerrarGlobal = document.getElementById('btn-cerrar-sesion');
    const btnCerrarPerfil = document.getElementById('btn-cerrar-sesion-perfil'); // El botón específico del perfil
    
    const ejecutarCierreSesion = (e) => {
        e.preventDefault();
        localStorage.removeItem('sesionActiva');
        localStorage.removeItem('nombreUsuarioActivo');
        
        // Si estoy en perfil, me expulsa al index. Si no, recarga la página.
        if (window.location.pathname.includes("perfil")) {
            window.location.href = '../index.html';
        } else {
            window.location.reload(); 
        }
    };

    if (btnCerrarGlobal) btnCerrarGlobal.addEventListener('click', ejecutarCierreSesion);
    if (btnCerrarPerfil) btnCerrarPerfil.addEventListener('click', ejecutarCierreSesion);
});