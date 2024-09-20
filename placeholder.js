document.addEventListener("DOMContentLoaded", function () {

    // Definir o menu diretamente no script
    class CustomMenu extends HTMLElement {
        connectedCallback() {
            this.innerHTML = `
                <nav id="menu-horizontal">
                    <ul>
                        <li><a href="home.html">Home</a></li>
                        <li><a href="sobre.html">Sobre</a></li>
                        <li><a href="contato.html">Contato</a></li>
                    </ul>
                </nav>
                <nav id="menu-deslizante">
                    <ul>
                        <li><a href="home.html">Home</a></li>
                        <li><a href="sobre.html">Sobre</a></li>
                        <li><a href="contato.html">Contato</a></li>
                    </ul>
                </nav>
            `;
        }
    }
    customElements.define('custom-menu', CustomMenu);

    // Adicionar o custom element ao DOM
    document.getElementById('menu-placeholder').innerHTML = `<custom-menu></custom-menu>`;

    // Definir o rodapé diretamente no script
    class CustomFooter extends HTMLElement {
        connectedCallback() {
            this.innerHTML = `
                <footer>
                    <div class="footer-content">
                        <p>&copy; 2024 Minha Empresa. Todos os direitos reservados.</p>
                        <ul>
                            <li><a href="politica-privacidade.html">Política de Privacidade</a></li>
                            <li><a href="termos-uso.html">Termos de Uso</a></li>
                            <li><a href="contato.html">Contato</a></li>
                        </ul>
                    </div>
                </footer>
            `;
        }
    }
    customElements.define('custom-footer', CustomFooter);

    // Adicionar o custom element do rodapé ao DOM
    document.getElementById('footer-placeholder').innerHTML = `<custom-footer></custom-footer>`;

    // Comportamento do menu deslizante
    const menuHamburguer = document.getElementById('menu-hamburguer');
    const menuDeslizante = document.getElementById('menu-deslizante');
    const body = document.body;

    // Abrir o menu deslizante
    menuHamburguer.addEventListener('click', function () {
        menuDeslizante.classList.add('show');
        body.classList.add('menu-aberto');
        document.querySelector('main').classList.add('body-desfocado');
        document.querySelector('header').classList.add('body-desfocado');
    });

    // Fechar o menu deslizante ao clicar fora dele
    document.addEventListener('click', function (event) {
        if (!menuDeslizante.contains(event.target) && !menuHamburguer.contains(event.target)) {
            menuDeslizante.classList.remove('show');
            body.classList.remove('menu-aberto');
            document.querySelector('main').classList.remove('body-desfocado');
            document.querySelector('header').classList.remove('body-desfocado');
        }
    });
});
