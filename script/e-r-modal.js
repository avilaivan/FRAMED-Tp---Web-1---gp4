export const REGEX_USER = /^[a-zA-Z0-9_]{6,15}$/; 
export const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const REGEX_PASS = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; 

export function manejarModal(titulo, mensaje, mensajeBueno = false, accionAlCerrar = null) {
    let modal = document.getElementById("modal-alerta");
    
    if (!modal) {
        const modalHTML = `
            <div id="modal-alerta" class="modal-overlay hidden">
                <div class="modal-box">
                    <h3 id="modal-titulo"></h3>
                    <p id="modal-mensaje"></p>
                    <button id="modal-btn-aceptar" class="btn-loguear">Aceptar</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById("modal-alerta");
    }

    const modalTitulo = document.getElementById("modal-titulo");
    const modalMensaje = document.getElementById("modal-mensaje");
    const modalBtnAceptar = document.getElementById("modal-btn-aceptar");

    modalTitulo.textContent = titulo;
    modalMensaje.textContent = mensaje;
    
    if (mensajeBueno) {
        modalTitulo.style.color = "var(--color-boton)";
    } else {
        modalTitulo.style.color = "#ff4c4c";
    }
    
    modal.classList.remove("hidden");

    modalBtnAceptar.onclick = () => {
        modal.classList.add("hidden");
        if (accionAlCerrar) {
            accionAlCerrar();
        }
    };
}