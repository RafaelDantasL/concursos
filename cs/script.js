<script>
// Verificar se o navegador suporta Service Workers
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      console.log('Service Worker registrado com sucesso:', registration.scope);
    }).catch(function(error) {
      console.log('Falha ao registrar o Service Worker:', error);
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
    // Carregar o menu uma única vez e reutilizá-lo
    fetch('menu.html')
        .then(response => response.text())
        .then(data => {
            // Aplicar o menu carregado para os dois elementos (horizontal e deslizante)
            document.getElementById('menu-horizontal').innerHTML = data;
            document.getElementById('menu-deslizante').innerHTML = data;
        })
        .catch(error => console.error('Erro ao carregar o menu:', error));

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

    // Carregar o rodapé de forma assíncrona
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Erro ao carregar o rodapé:', error));
});
</script>
