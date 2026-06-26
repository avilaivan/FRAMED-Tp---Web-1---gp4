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

        // 1. Validamos formato
        if (!REGEX_EMAIL.test(email)) {
            return manejarModal("Error en Correo", "Por favor ingresa un correo electrónico válido.");
        }

        // 2. Traemos la lista de usuarios usando tu key "usuariosRegistrados"
        const usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];

        // 3. Verificamos si el email existe
        const correoExiste = usuariosRegistrados.some(user => user.email === email);

        if (correoExiste) {
            // El correo SI existe en la base
            manejarModal(
                "¿Quieres continuar?", 
                "Se enviaron las instrucciones a tu correo electrónico.", 
                true, 
                () => {
                    localStorage.setItem("emailEnRecuperacion", email);
                    window.location.href = "./nueva-contrasenia.html";
                }
            );
        } else {
            // El correo NO existe en la base
            manejarModal(
                "Correo no encontrado", 
                "No tenemos ninguna cuenta registrada con ese correo electrónico.", 
                false 
            );
        }
    });
}