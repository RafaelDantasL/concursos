document.addEventListener("DOMContentLoaded", function () {
    // Definir o menu diretamente no script
    class CustomMenu extends HTMLElement {
        connectedCallback() {
            this.innerHTML = `
                <nav id="menu-horizontal" class="menu-horizontal">
                    <ul>
                        <li><a href="index.html">Cursos preparatórios</a></li>
                        <li><a href="ebook.html">Apostilas e ebooks grátis</a></li>
                        <li><a href="contato.html">Blog Renitentes</a></li>
                    </ul>
                </nav>
                <nav id="menu-deslizante" class="menu-deslizante">
                    <ul>
                        <li><a href="index.html">Cursos preparatórios</a></li>
                        <li><a href="ebook.html">Apostilas e ebooks grátis</a></li>
                        <li><a href="contato.html">Blog Renitentes</a></li>
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
        <!-- Primeira coluna: Logo -->
        <div class="footer-column">
            <img src="logo.png" alt="Logo do Site" class="footer-logo">
        </div>

        <!-- Segunda coluna: Canais -->
        <div class="footer-column">
            <h3>Canais</h3>
            <ul class="footer-links">
                <li><a href="blog.html">Blog</a></li>
                <li><a href="trabalhe-conosco.html">Trabalhe conosco</a></li>
            </ul>
        </div>

        <!-- Terceira coluna: Contato -->
        <div class="footer-column">
            <h3>Contato</h3>
            <ul class="footer-contact">
                <li><a href="mailto:email@example.com">email@example.com</a></li>
            <p class="atendimento-descricao">Segunda a sexta, das 08:00 às 12:00 e das 13:30 às 18:00.</p>
                <li><a href="https://wa.me/123456789" class="whatsapp"><img src="icons/whatsapp.png" class="whatsapp-icon"> (12) 3456-7890</a></li>
                <li>
                    <!-- Ícones das redes sociais -->
                    <a href="https://www.instagram.com/perfilinsta"><img src="icons/instagram.png" alt="Instagram"></a>
                    <a href="https://t.me/perfiltelegram"><img src="icons/telegram.png" alt="Telegram"></a>
                    <a href="https://www.facebook.com/perfilfacebook"><img src="icons/facebook.png" alt="Facebook"></a>
		    <a href="https://www.facebook.com/perfilfacebook"><img src="icons/youtube.png" alt="YouTube"></a>
                </li>
            </ul>
        </div>
    </div>

    <!-- Rodapé inferior: Direitos e Links -->
    <div class="footer-bottom">
        <p>© 2024 Minha Empresa. Todos os direitos reservados.</p>
        <ul class="footer-bottom-links">
            <li><a href="politica-privacidade.html">Política de Privacidade</a></li>
            <li><a href="termos-uso.html">Termos de Uso</a></li>
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
    menuHamburguer.addEventListener('click', function (event) {
        event.stopPropagation(); // Evitar que o clique feche o menu imediatamente
        menuDeslizante.classList.toggle('show');
        body.classList.toggle('menu-aberto');
        body.classList.toggle('no-scroll'); // Desabilitar rolagem
        document.querySelector('main').classList.toggle('body-desfocado');
        document.querySelector('header').classList.toggle('body-desfocado');
    });

    // Fechar o menu deslizante ao clicar fora dele
    document.addEventListener('click', function (event) {
        if (!menuDeslizante.contains(event.target) && !menuHamburguer.contains(event.target)) {
            menuDeslizante.classList.remove('show');
            body.classList.remove('menu-aberto');
            body.classList.remove('no-scroll'); // Habilitar rolagem novamente
            document.querySelector('main').classList.remove('body-desfocado');
            document.querySelector('header').classList.remove('body-desfocado');
        }
    });
});
