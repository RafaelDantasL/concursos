// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC-STt5EnVQA5oJEF1Vie3rHk1qOW9TqMw",
    authDomain: "cursos-preparatorios.firebaseapp.com",
    databaseURL: "https://cursos-preparatorios-default-rtdb.firebaseio.com",
    projectId: "cursos-preparatorios",
    storageBucket: "cursos-preparatorios.appspot.com",
    messagingSenderId: "121871815126",
    appId: "1:121871815126:web:1ea3e4630b3b4de6569477"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const cursosPorPagina = 8;
let paginaAtual = 1;
let totalCursos = 0;

// Função para carregar cursos do Firebase
function carregarCursos(pagina) {
    const cursosContainer = document.getElementById('cursos-container');
    const paginacaoContainer = document.getElementById('paginacao-container');
    cursosContainer.innerHTML = '';
    paginacaoContainer.innerHTML = '';

    firebase.database().ref('cursos').once('value', snapshot => {
        const cursos = [];
        snapshot.forEach(childSnapshot => {
            const curso = childSnapshot.val();
            cursos.push(curso);
        });

        totalCursos = cursos.length;
        const totalPaginas = Math.ceil(totalCursos / cursosPorPagina);
        const start = (pagina - 1) * cursosPorPagina;
        const end = start + cursosPorPagina;

        cursos.slice(start, end).forEach(curso => {
            cursosContainer.innerHTML += `
                <div class="curso">
                    <h3>${curso.titulo}</h3>
                    <img src="${curso.imagem}" alt="${curso.titulo}" class="curso-imagem">
                    <p>${curso.descricao}</p>
                    <button class="ver-detalhes-button" onclick="location.href='${curso.link}'">Ver detalhes do curso</button>
                </div>
            `;
        });

        // Criar os botões de paginação
        for (let i = 1; i <= totalPaginas; i++) {
            const paginaButton = document.createElement('button');
            paginaButton.textContent = i;
            paginaButton.classList.add('pagina-button');
            if (i === pagina) {
                paginaButton.classList.add('pagina-ativa');
            }
            paginaButton.onclick = () => {
                paginaAtual = i;
                carregarCursos(paginaAtual);
            };
            paginacaoContainer.appendChild(paginaButton);
        }
    });
}

// Função para buscar cursos
function buscarCursos() {
    const pesquisa = document.getElementById('pesquisa').value.toLowerCase();
    const cursosContainer = document.getElementById('cursos-container');
    cursosContainer.innerHTML = '';

    firebase.database().ref('cursos').once('value', snapshot => {
        const cursos = [];
        snapshot.forEach(childSnapshot => {
            const curso = childSnapshot.val();
            // Filtrar por cursos com 'show' igual a true e título correspondente à pesquisa
            if (curso.show === true && curso.titulo.toLowerCase().includes(pesquisa)) {
                cursos.push(curso);
            }
        });

        if (cursos.length > 0) {
            totalCursos = cursos.length;
            const totalPaginas = Math.ceil(totalCursos / cursosPorPagina);
            const start = (paginaAtual - 1) * cursosPorPagina;
            const end = start + cursosPorPagina;

            cursos.slice(start, end).forEach(curso => {
                cursosContainer.innerHTML += `
                    <div class="curso">
                        <h3>${curso.titulo}</h3>
                        <img src="${curso.imagem}" alt="${curso.titulo}" class="curso-imagem">
                        <p>${curso.descricao}</p>
                        <button class="ver-detalhes-button" onclick="location.href='${curso.link}'">Ver detalhes do curso</button>
                    </div>
                `;
            });
        } else {
            cursosContainer.innerHTML = `<p>Nenhum resultado encontrado para a sua pesquisa.</p>`;
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Carregar o menu para computadores (menu horizontal)
    fetch('menu.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('menu-horizontal').innerHTML = data;
        })
        .catch(error => console.error('Erro ao carregar o menu:', error));

    // Carregar o menu para dispositivos móveis (menu deslizante)
    fetch('menu.html')
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

// Carregar o rodapé
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Erro ao carregar o rodapé:', error));

// Carregar cursos ao carregar a página
window.onload = () => carregarCursos(paginaAtual);
