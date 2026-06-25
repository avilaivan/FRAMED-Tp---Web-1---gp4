import generarHeader from './header-pages.js';
import generarFooter from './footer-pages.js';


import generarLoginRegistro from './registrar-user.js';
import generarOlvidarPassword from './olvidar-contrasenia.js';
import generarNuevaPassword from './nueva-contrasenia.js';

import inicializarComunidad from './comunidad.js';


document.addEventListener("DOMContentLoaded", () => {
    generarHeader();
    generarFooter();   

    const ruta = window.location.pathname;

    if (ruta.includes("olvidar-contrasenia")) {
        generarOlvidarPassword();
    } else if (ruta.includes("nueva-contrasenia")) {
        generarNuevaPassword();
    } else if (ruta.includes("login") || ruta.includes("registrar") ) {
        generarLoginRegistro();
    }
    else if (ruta.includes("comunidad") ) {
         inicializarComunidad();
    }
});