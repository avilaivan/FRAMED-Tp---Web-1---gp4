export default function generarHeader() {
    const header = document.createElement("header");

    const estaLogueado = localStorage.getItem("sesionActiva") === "true";
    const nombreUsuario = localStorage.getItem("nombreUsuarioActivo");

    let botonesUsuario = "";

    if (estaLogueado) {
        botonesUsuario = `
            <li><a href="./pages/perfil.html">Perfil</a></li>
            <li class="btn-mobile"><a href="#" id="btn-cerrar-sesion" class="btn-cerrar-sesion">Salir</a></li>
        `;
    } else {
        botonesUsuario = `
            <li class="btn-mobile"><a href="./pages/login.html" class="btn-acceder">Acceder</a></li>
        `;
    }

    header.innerHTML = `
        <nav class="navbar">
            <section class="logo">
                <a href="./index.html"><img src="./img/LOGO-FRAMED.png" alt="Framed Logo"></a>
            </section>

            <input type="checkbox" id="check" style="display: none;">
            
            <label for="check" class="menu-toggle">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </label>

            <ul class="nav-links">
                <li><a href="./pages/explorar.html">Explorar</a></li>
                <li><a href="./pages/comunidad.html">Comunidad</a></li>
                ${botonesUsuario}
            </ul>
        </nav>
    `;

    document.body.prepend(header);

    if (estaLogueado) {
        const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
        
        // Pequeña validación por seguridad antes de agregar el evento
        if (btnCerrarSesion) {
            btnCerrarSesion.addEventListener("click", (e) => {
                e.preventDefault();

                localStorage.removeItem("sesionActiva");
                localStorage.removeItem("nombreUsuarioActivo");
                window.location.reload();
            });
        }
    }
}