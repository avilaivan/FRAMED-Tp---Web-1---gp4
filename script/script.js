import generarHeader from './header.js';
import generarFooter from './footer.js';


import generarLoginRegistro from './registrar-user.js';
import generarOlvidarPassword from './olvidar-contrasenia.js';
import generarNuevaPassword from './nueva-contrasenia.js';

import inicializarComunidad from './comunidad.js';
import inicializarPerfil from './perfil.js';

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
    else if (ruta.includes("perfil") ) {
         inicializarPerfil();
    }
});