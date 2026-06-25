export default function generarFooter() {
    const footer = document.createElement("footer");
    footer.classList.add("main-footer");

    footer.innerHTML = `
        <div class="footer-container">
            <div class="footer-left">
                <a href="../index.html">
                    <img src="../img/LOGO-FRAMED.png" alt="Framed Logo" class="footer-logo">
                </a>
                <div class="team-info">
                    <p>Desarrollado por: Ivan Avila, Valentin Himitian, Uriel Frias, Juan Ibañez</p>
                    <p class="copyright">&copy; 2026 Framed.</p>
                </div>
            </div>

            <div class="footer-center">
                <h3>Nuestras redes</h3>
                <div class="social-contact">
                    <a href="https://twitter.com/framed" target="_blank">Twitter</a>
                    <a href="https://instagram.com/framed" target="_blank">Instagram</a>
                    <a href="#" target="_blank">TikTok</a>
                </div>
            </div>

            <div class="footer-right">
                <h3>Contactanos</h3>
                <a href="#">Ayuda</a>
                <a href="../pages/faq.html">Preguntas Frecuentes</a>
                <a href="https://wa.me/541199999999" target="_blank" class="phone-link">+54 11 9999-9999</a>
            </div>

            <a href="#" class="btn-subir">&uarr;</a>
        </div>
    `;

    document.body.append(footer);
}