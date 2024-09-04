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

let todosCursos = [];  // Array para armazenar todos os cursos

// Função para carregar cursos do Firebase
function carregarCursos(pagina = 1) {
    const cursosPorPagina = 9;
    const inicio = (pagina - 1) * cursosPorPagina;
    const fim = inicio + cursosPorPagina;

    const cursosContainer = document.getElementById('cursos-container');
    cursosContainer.innerHTML = '';

    // Filtrar e paginar os cursos
    const cursosPaginados = todosCursos.slice(inicio, fim);
    
    cursosPaginados.forEach(curso => {
        cursosContainer.innerHTML += `
            <div class="curso" onclick="location.href='${curso.link}'">
                <h3>${curso.titulo}</h3>
                <img src="${curso.imagem}" alt="${curso.titulo}" class="imagem-curso">
                <p>${curso.descricao}</p>
                <p><strong>R$ ${curso.preco}</strong></p>
            </div>
        `;
    });

    gerarPaginacao(pagina);
}

// Função para buscar cursos
function buscarCursos() {
    const pesquisa = document.getElementById('pesquisa').value.toLowerCase();
    const cursosContainer = document.getElementById('cursos-container');
    cursosContainer.innerHTML = '';

    const cursosFiltrados = todosCursos.filter(curso => 
        curso.titulo.toLowerCase().includes(pesquisa) && curso.show === true
    );

    cursosFiltrados.forEach(curso => {
        cursosContainer.innerHTML += `
            <div class="curso" onclick="location.href='${curso.link}'">
                <h3>${curso.titulo}</h3>
                <img src="${curso.imagem}" alt="${curso.titulo}" class="imagem-curso">
                <p>${curso.descricao}</p>
                <p><strong>R$ ${curso.preco}</strong></p>
            </div>
        `;
    });
}

// Função para gerar a paginação
function gerarPaginacao(paginaAtual) {
    const cursosPorPagina = 9;
    const totalPaginas = Math.ceil(todosCursos.length / cursosPorPagina);

    const paginacaoContainer = document.getElementById('paginacao');
    paginacaoContainer.innerHTML = '';

    for (let i = 1; i <= totalPaginas; i++) {
        paginacaoContainer.innerHTML += `
            <div class="pagina ${i === paginaAtual ? 'ativa' : ''}" onclick="carregarCursos(${i})">
                ${i}
            </div>
        `;
    }
}

// Carregar todos os cursos na inicialização
firebase.database().ref('cursos').once('value', snapshot => {
    snapshot.forEach(childSnapshot => {
        const curso = childSnapshot.val();
        if (curso.show === true) {
            todosCursos.push(curso);
        }
    });
    carregarCursos();  // Carregar a primeira página de cursos
});

// Carregar cursos ao carregar a página
window.onload = () => carregarCursos();
