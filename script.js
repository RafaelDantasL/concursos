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

const cursosPorPagina = 12;
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
            cursos.push(childSnapshot.val());
        });

        totalCursos = cursos.length;
        const totalPaginas = Math.ceil(totalCursos / cursosPorPagina);
        const start = (pagina - 1) * cursosPorPagina;
        const end = start + cursosPorPagina;

        cursos.slice(start, end).forEach(curso => {
            cursosContainer.innerHTML += `
                <div class="curso" onclick="location.href='${curso.link}'">
                    <h3>${curso.titulo}</h3>
                    <img src="${curso.imagem}" alt="${curso.titulo}" class="curso-imagem">
                    <p>${curso.descricao}</p>
                    <p><strong>R$ ${curso.preco}</strong></p>
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
            if (curso.titulo.toLowerCase().includes(pesquisa)) {
                cursos.push(curso);
            }
        });

        totalCursos = cursos.length;
        const totalPaginas = Math.ceil(totalCursos / cursosPorPagina);
        const start = (paginaAtual - 1) * cursosPorPagina;
        const end = start + cursosPorPagina;

        cursos.slice(start, end).forEach(curso => {
            cursosContainer.innerHTML += `
                <div class="curso" onclick="location.href='${curso.link}'">
                    <h3>${curso.titulo}</h3>
                    <img src="${curso.imagem}" alt="${curso.titulo}" class="curso-imagem">
                    <p>${curso.descricao}</p>
                    <p><strong>R$ ${curso.preco}</strong></p>
                </div>
            `;
        });
    });
}

// Carregar cursos ao carregar a página
window.onload = () => carregarCursos(paginaAtual);
