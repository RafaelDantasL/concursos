document.addEventListener("DOMContentLoaded", function () {
    // Carregar o menu para computadores (menu horizontal)
    fetch('../menu.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('menu-horizontal').innerHTML = data;
        })
        .catch(error => console.error('Erro ao carregar o menu:', error));

    // Carregar o menu para dispositivos móveis (menu deslizante)
    fetch('../menu.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('menu-deslizante').innerHTML = data;
        })
        .catch(error => console.error('Erro ao carregar o menu:', error));

    const menuHamburguer = document.getElementById('menu-hamburguer');
    const menuDeslizante = document.getElementById('menu-deslizante');
    const menuVoltar = document.getElementById('menu-voltar');
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


    // Carregar o rodapé após todos os outros recursos terem sido carregados
    fetch('../footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Erro ao carregar o rodapé:', error));
};
