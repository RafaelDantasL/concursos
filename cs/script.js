document.addEventListener("DOMContentLoaded", function () {
    // Carregar o menu para computadores (menu horizontal)
    fetch('../menu.html') // Caminho ajustado para o diretório acima
        .then(response => response.text())
        .then(data => {
            const menuHorizontal = document.getElementById('menu-horizontal');
            if (menuHorizontal) {
                menuHorizontal.innerHTML = data;
            } else {
                console.error("Elemento 'menu-horizontal' não encontrado.");
            }
        })
        .catch(error => console.error('Erro ao carregar o menu para computadores:', error));

    // Carregar o menu para dispositivos móveis (menu deslizante)
    fetch('../menu.html') // Caminho ajustado para o diretório acima
        .then(response => response.text())
        .then(data => {
            const menuDeslizante = document.getElementById('menu-deslizante');
            if (menuDeslizante) {
                menuDeslizante.innerHTML = data;
            } else {
                console.error("Elemento 'menu-deslizante' não encontrado.");
            }
        })
        .catch(error => console.error('Erro ao carregar o menu para dispositivos móveis:', error));

    const menuHamburguer = document.getElementById('menu-hamburguer');
    const menuDeslizante = document.getElementById('menu-deslizante');
    const body = document.body;

    if (menuHamburguer && menuDeslizante) {
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
    } else {
        console.error("Elemento 'menu-hamburguer' ou 'menu-deslizante' não encontrado.");
    }
});

// Carregar o rodapé após todos os outros recursos terem sido carregados
fetch('../footer.html') // Caminho ajustado para o diretório acima
    .then(response => response.text())
    .then(data => {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = data;
        } else {
            console.error("Elemento 'footer-placeholder' não encontrado.");
        }
    })
    .catch(error => console.error('Erro ao carregar o rodapé:', error));
