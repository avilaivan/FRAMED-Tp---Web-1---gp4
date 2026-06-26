import { REGEX_PASS } from './e-r-modal.js';

// Función 1: Valida que la contraseña cumpla los requisitos y que ambas coincidan
export function validarNuevasContrasenias(nuevaPass, repetirPass) {
    if (!REGEX_PASS.test(nuevaPass)) {
        return { 
            valido: false, 
            titulo: "Contraseña Débil", 
            mensaje: "Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial." 
        };
    }
    if (nuevaPass !== repetirPass) {
        return { 
            valido: false, 
            titulo: "Error", 
            mensaje: "Las contraseñas no coinciden. Intenta de nuevo." 
        };
    }
    return { valido: true };
}

// Función 2: Busca al usuario por su email y le actualiza la contraseña en localStorage
export function guardarNuevaContraseniaEnStorage(email, nuevaPass) {
    let usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
    const indexUsuario = usuariosRegistrados.findIndex(user => user.email === email);

    if (indexUsuario !== -1) {
        usuariosRegistrados[indexUsuario].password = nuevaPass;
        localStorage.setItem("usuariosRegistrados", JSON.stringify(usuariosRegistrados));
        return true; // Se cambió con éxito
    }
    return false; // No se encontró el usuario
}