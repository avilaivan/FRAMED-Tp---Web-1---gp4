import { REGEX_USER, REGEX_EMAIL, REGEX_PASS, manejarModal } from './e-r-modal.js';

export default function generarLoginRegistro() {
    const contenedor = document.getElementById("contenedor-formularios");
    if (!contenedor) return;

    contenedor.innerHTML = `
        <div class="caja-login">
            <div class="tabs-header">
                <button type="button" id="tab-login" class="tab-btn active">Iniciar Sesión</button>
                <button type="button" id="tab-registrar" class="tab-btn">Registrarse</button>
            </div>

            <form id="form-login" class="form-content">
                <label class="campo-formulario">
                    <span>Usuario o Correo electrónico</span>
                    <input id="login-usuario" type="text" placeholder="Usuario o Correo" required>
                </label>
                <label class="campo-formulario">
                    <span>Contraseña</span>
                    <input id="login-password" type="password" placeholder="••••••••••" required>
                </label>
                <div class="recordarme-recuperar-password">
                    <label><input type="checkbox"> Recordarme</label>
                    <a href="./olvidar-contrasenia.html">¿Olvidaste tu contraseña?</a>
                </div>
                <button type="submit" class="btn-loguear">Iniciar sesión</button>
            </form>

            <form id="form-registrar" class="form-content hidden">
                <label class="campo-formulario">
                    <span>Nombre de Usuario</span>
                    <input id="reg-usuario" type="text" placeholder="Username" required>
                </label>
                <label class="campo-formulario">
                    <span>Correo Electrónico</span>
                    <input id="reg-email" type="email" placeholder="user@example.com" required>
                </label>
                <label class="campo-formulario">
                    <span>Contraseña</span>
                    <input id="reg-password" type="password" placeholder="••••••••••" required>
                </label>
                <div class="terminos-condiciones">
                    <label class="campo-checkbox">
                        <input type="checkbox" required> Acepto los Términos y Condiciones
                    </label>
                </div>
                <button type="submit" class="btn-registrar btn-loguear">Crear Cuenta</button>
            </form>
        </div>
    `;

    const tabLogin = document.getElementById("tab-login");
    const tabRegistrar = document.getElementById("tab-registrar");
    const formLogin = document.getElementById("form-login");
    const formRegistrar = document.getElementById("form-registrar");

    tabLogin.addEventListener("click", () => {
        tabLogin.classList.add("active");
        tabRegistrar.classList.remove("active");
        formLogin.classList.remove("hidden");
        formRegistrar.classList.add("hidden");
        formRegistrar.reset();
    });

    tabRegistrar.addEventListener("click", () => {
        tabRegistrar.classList.add("active");
        tabLogin.classList.remove("active");
        formRegistrar.classList.remove("hidden");
        formLogin.classList.add("hidden");
        formLogin.reset();
    });

    formRegistrar.addEventListener("submit", (e) => {
        e.preventDefault();

        const usuario = document.getElementById("reg-usuario").value.trim().toLowerCase();
        const email = document.getElementById("reg-email").value.trim().toLowerCase();
        const password = document.getElementById("reg-password").value.trim();

        if (!REGEX_USER.test(usuario)) {
            return manejarModal("Error en Usuario", "El usuario debe tener entre 6 y 15 caracteres (solo letras, números y guiones bajos).");
        }

        if (!REGEX_EMAIL.test(email)) {
            return manejarModal("Error en Correo", "Por favor ingresa un correo electrónico válido.");
        }

        if (!REGEX_PASS.test(password)) {
            return manejarModal("Contraseña Débil", "Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.");
        }

        const nuevoUsuario = { usuario, email, password };
        const datosGuardados = localStorage.getItem("usuariosRegistrados");
        
        let listaUsuarios = [];
        if (datosGuardados) {
            listaUsuarios = JSON.parse(datosGuardados);
        }

        const usuarioExiste = listaUsuarios.some(user => user.usuario === usuario);
        const emailExiste = listaUsuarios.some(user => user.email === email);

        if (usuarioExiste) {
            return manejarModal("Error", "Ese nombre de usuario ya está en uso. Elegí otro.");
        }
        if (emailExiste) {
            return manejarModal("Error", "Ese correo electrónico ya está registrado.");
        }

        listaUsuarios.push(nuevoUsuario);
        localStorage.setItem("usuariosRegistrados", JSON.stringify(listaUsuarios));

        manejarModal("¡Registro Exitoso!", "Tu cuenta ha sido creada. Ya puedes iniciar sesión.", true, () => {
            formRegistrar.reset();
            tabLogin.click();
        });
    });

    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();

        const usuarioInput = document.getElementById("login-usuario").value.trim().toLowerCase();
        const password = document.getElementById("login-password").value.trim();

        const datosGuardados = localStorage.getItem("usuariosRegistrados");

        if (!datosGuardados) {
            return manejarModal("Cuenta no encontrada", "No hay usuarios registrados en el sistema.");
        }

        const listaUsuarios = JSON.parse(datosGuardados);
        const usuarioValido = listaUsuarios.find(user => 
            (user.usuario === usuarioInput || user.email === usuarioInput) && user.password === password
        );

        if (usuarioValido) {
            localStorage.setItem("sesionActiva", "true");
            localStorage.setItem("nombreUsuarioActivo", usuarioValido.usuario);

            manejarModal("¡Bienvenido!", `Hola de nuevo, ${usuarioValido.usuario}.`, true, () => {
                window.location.href = "../index.html"; 
            });
        } else {
            manejarModal("Error de Acceso", "Usuario o contraseña incorrectos.");
        }
    });
}