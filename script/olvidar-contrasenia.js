import { REGEX_EMAIL, manejarModal } from './e-r-modal.js';

export default function generarOlvidarPassword() {
    const contenedor = document.getElementById("contenedor-formularios");
    if (!contenedor) return;

    contenedor.innerHTML = `
        <form id="form-olvidar" class="caja-login">
            <h2>Recupera tu contraseña</h2>

            <label class="campo-formulario">
                <span>Correo electrónico</span>
                <input id="email-recuperacion" type="email" placeholder="Ingresa tu correo electrónico" required>
            </label>

            <button type="submit" class="btn-loguear">Recuperar contraseña</button>
        </form>
    `;

    const formOlvidar = document.getElementById("form-olvidar");
    formOlvidar.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const email = document.getElementById("email-recuperacion").value.trim().toLowerCase();

        if (!REGEX_EMAIL.test(email)) {
            return manejarModal("Error en Correo", "Por favor ingresa un correo electrónico válido.");
        }

        manejarModal("¿Quieres continuar?", "Se envió un correo de recuperación a tu bandeja de entrada.", true, () => {
            window.location.href = "./nueva-contrasenia.html";
        });
    });
}