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
let cursosEncontrados = [];

// Função para carregar cursos do Firebase
function carregarCursos(pagina) {
    const cursosContainer = document.getElementById('cursos-container');
    const paginacaoContainer = document.getElementById('paginacao-container');
    const totalEncontradosContainer = document.getElementById('total-encontrados');
    cursosContainer.innerHTML = '';
    paginacaoContainer.innerHTML = '';
    totalEncontradosContainer.innerHTML = '';

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
function buscarCursos(pagina = 1) {
    const pesquisa = document.getElementById('pesquisa').value.toLowerCase();
    const cursosContainer = document.getElementById('cursos-container');
    const paginacaoContainer = document.getElementById('paginacao-container');
    const totalEncontradosContainer = document.getElementById('total-encontrados');
    cursosContainer.innerHTML = '';
    paginacaoContainer.innerHTML = '';
    totalEncontradosContainer.innerHTML = '';

    firebase.database().ref('cursos').once('value', snapshot => {
        cursosEncontrados = [];
        snapshot.forEach(childSnapshot => {
            const curso = childSnapshot.val();
            // Filtrar por cursos com título correspondente à pesquisa
            if (curso.titulo.toLowerCase().includes(pesquisa)) {
                cursosEncontrados.push(curso);
            }
        });

        if (cursosEncontrados.length > 0) {
            totalCursos = cursosEncontrados.length;
            totalEncontradosContainer.innerHTML = `<center><p>${totalCursos} curso(s) encontrado(s).</p></center>`;

            const totalPaginas = Math.ceil(totalCursos / cursosPorPagina);
            const start = (pagina - 1) * cursosPorPagina;
            const end = start + cursosPorPagina;

            cursosEncontrados.slice(start, end).forEach(curso => {
                cursosContainer.innerHTML += `
                    <div class="curso">
                        <h3>${curso.titulo}</h3>
                        <img src="${curso.imagem}" alt="${curso.titulo}" class="curso-imagem">
                        <p>${curso.descricao}</p>
                        <button class="ver-detalhes-button" onclick="location.href='${curso.link}'">Ver detalhes do curso</button>
                    </div>
                `;
            });

            // Criar os botões de paginação se houver mais de uma página
            if (totalPaginas > 1) {
                for (let i = 1; i <= totalPaginas; i++) {
                    const paginaButton = document.createElement('button');
                    paginaButton.textContent = i;
                    paginaButton.classList.add('pagina-button');
                    if (i === pagina) {
                        paginaButton.classList.add('pagina-ativa');
                    }
                    paginaButton.onclick = () => {
                        paginaAtual = i;
                        buscarCursos(paginaAtual);
                    };
                    paginacaoContainer.appendChild(paginaButton);
                }
            }
        } else {
            cursosContainer.innerHTML = `<p>Nenhum resultado encontrado para a sua pesquisa.</p>`;
        }
    });
}

// Função para verificar se a tecla "Enter" foi pressionada na barra de pesquisa
document.getElementById('pesquisa').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        buscarCursos();
    }
});

// Carregar cursos ao carregar a página
window.onload = () => carregarCursos(paginaAtual);
