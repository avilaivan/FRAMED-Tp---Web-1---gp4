import { REGEX_PASS, manejarModal } from './e-r-modal.js';
import { validarNuevasContrasenias, guardarNuevaContraseniaEnStorage } from './servicios-password.js';

export default function generarNuevaPassword() {
    const contenedor = document.getElementById("contenedor-formularios");
    if (!contenedor) return;

    // Traemos el email que guardamos en la pantalla anterior
    const emailRecuperacion = localStorage.getItem("emailEnRecuperacion");

    if (!emailRecuperacion) {
        window.location.href = "./login.html";
        return;
    }

    contenedor.innerHTML = `
        <form id="form-nueva-pass" class="caja-login">
            <h2>Crear nueva contraseña</h2>

            <label class="campo-formulario">
                <span>Nueva contraseña</span>
                <input id="nueva-pass" type="password" placeholder="••••••••••" required>
            </label>

            <label class="campo-formulario">
                <span>Repetir nueva contraseña</span>
                <input id="repetir-pass" type="password" placeholder="••••••••••" required>
            </label>

            <button type="submit" class="btn-loguear">Cambiar contraseña</button>
        </form>
    `;

    const formNuevaPass = document.getElementById("form-nueva-pass");
    formNuevaPass.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const nuevaPass = document.getElementById("nueva-pass").value.trim();
        const repetirPass = document.getElementById("repetir-pass").value.trim();

        // 1. Usamos la validación modularizada
        const validacion = validarNuevasContrasenias(nuevaPass, repetirPass);
        
        if (!validacion.valido) {
            // Si falla, mostramos el modal con los datos que nos devolvió la función
            return manejarModal(validacion.titulo, validacion.mensaje);
        }

        // 2. Usamos la función modularizada para pisar el dato en localStorage
        const cambioExitoso = guardarNuevaContraseniaEnStorage(emailRecuperacion, nuevaPass);

        if (cambioExitoso) {
            localStorage.removeItem("emailEnRecuperacion"); // Limpiamos la basura
            
            manejarModal("¡Contraseña Actualizada!", "Tu contraseña se cambió con éxito. Ya puedes iniciar sesión.", true, () => {
                window.location.href = "./login.html";
            });
        } else {
            manejarModal("Error", "No se pudo encontrar la cuenta en la base de datos.");
        }
    });
}