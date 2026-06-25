import { REGEX_PASS, manejarModal } from './e-r-modal.js';

export default function generarNuevaPassword() {
    const contenedor = document.getElementById("contenedor-formularios");
    if (!contenedor) return;

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

        if (!REGEX_PASS.test(nuevaPass)) {
            return manejarModal("Contraseña Débil", "Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.");
        }

        if (nuevaPass !== repetirPass) {
            return manejarModal("Error", "Las contraseñas no coinciden. Intenta de nuevo.");
        }

        manejarModal("¡Contraseña Actualizada!", "Tu contraseña se cambió con éxito. Ya puedes iniciar sesión.", true, () => {
            window.location.href = "./login.html";
        });
    });
}