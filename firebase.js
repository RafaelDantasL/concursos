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

// Cache settings
const CACHE_KEY = 'cachedCursos';
const CACHE_TIME = 24 * 60 * 60 * 1000; // 24 hours

// Check cached courses in localStorage
function getCachedCursos() {
    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TIME)) {
        return cachedData.cursos;
    }
    return null;
}

// Cache courses data in localStorage
function cacheCursos(cursos) {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
        cursos: cursos,
        timestamp: Date.now()
    }));
}

// Função para carregar cursos do Firebase
function carregarCursos(pagina = 1) {
    const cursosContainer = document.getElementById('cursos-container');
    const paginacaoContainer = document.getElementById('paginacao-container');
    const totalEncontradosContainer = document.getElementById('total-encontrados');
    cursosContainer.innerHTML = '';
    paginacaoContainer.innerHTML = '';
    totalEncontradosContainer.innerHTML = '';

    const cachedCursos = getCachedCursos();
    if (cachedCursos) {
        displayCursos(cachedCursos, pagina);
    } else {
        firebase.database().ref('cursos').once('value', snapshot => {
            const cursos = [];
            snapshot.forEach(childSnapshot => {
                const curso = childSnapshot.val();
                cursos.push(curso);
            });
            cacheCursos(cursos); // Cache courses
            displayCursos(cursos, pagina);
        });
    }
}

// Função para exibir cursos
function displayCursos(cursos, pagina = 1) {
    const cursosContainer = document.getElementById('cursos-container');
    const paginacaoContainer = document.getElementById('paginacao-container');
    const totalEncontradosContainer = document.getElementById('total-encontrados');
    
    totalCursos = cursos.length;
    const totalPaginas = Math.ceil(totalCursos / cursosPorPagina);
    const start = (pagina - 1) * cursosPorPagina;
    const end = start + cursosPorPagina;

    cursosContainer.innerHTML = '';
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

    totalEncontradosContainer.innerHTML = `<center><p>${totalCursos} curso(s) encontrado(s).</p></center>`;

    // Criar os botões de página numerados
    paginacaoContainer.innerHTML = '';

    if (pagina > 1) {
        const voltarButton = document.createElement('button');
        voltarButton.textContent = 'Voltar';
        voltarButton.classList.add('pagina-button');
        voltarButton.onclick = () => {
            paginaAtual--;
            carregarCursos(paginaAtual);  // Atualizar para funcionar corretamente
        };
        paginacaoContainer.appendChild(voltarButton);
    }

    for (let i = 1; i <= totalPaginas; i++) {
        const paginaButton = document.createElement('button');
        paginaButton.textContent = i;
        paginaButton.classList.add('pagina-button');
        if (i === pagina) {
            paginaButton.classList.add('pagina-ativa');
        }
        paginaButton.onclick = () => {
            paginaAtual = i;
            carregarCursos(i);  // Atualizar a navegação corretamente
        };
        paginacaoContainer.appendChild(paginaButton);
    }

    if (pagina < totalPaginas) {
        const avancarButton = document.createElement('button');
        avancarButton.textContent = 'Avançar';
        avancarButton.classList.add('pagina-button');
        avancarButton.onclick = () => {
            paginaAtual++;
            carregarCursos(paginaAtual);  // Atualizar para funcionar corretamente
        };
        paginacaoContainer.appendChild(avancarButton);
    }
}

// Função para buscar cursos e paginar
function buscarCursos(pagina = 1) {
    const pesquisa = document.getElementById('pesquisa').value.toLowerCase();
    const cursosContainer = document.getElementById('cursos-container');
    const paginacaoContainer = document.getElementById('paginacao-container');
    const totalEncontradosContainer = document.getElementById('total-encontrados');
    cursosContainer.innerHTML = '';
    paginacaoContainer.innerHTML = '';
    totalEncontradosContainer.innerHTML = '';

    const cachedCursos = getCachedCursos();
    if (cachedCursos) {
        cursosEncontrados = cachedCursos.filter(curso =>
            curso.titulo.toLowerCase().includes(pesquisa)
        );
        displayCursosFiltrados(cursosEncontrados, pagina);
    } else {
        firebase.database().ref('cursos').once('value', snapshot => {
            cursosEncontrados = [];
            snapshot.forEach(childSnapshot => {
                const curso = childSnapshot.val();
                // Filtrar por cursos com título correspondente à pesquisa
                if (curso.titulo.toLowerCase().includes(pesquisa)) {
                    cursosEncontrados.push(curso);
                }
            });
            displayCursosFiltrados(cursosEncontrados, pagina);
        });
    }
}

// Função para exibir cursos filtrados
function displayCursosFiltrados(cursos, pagina) {
    const cursosContainer = document.getElementById('cursos-container');
    const paginacaoContainer = document.getElementById('paginacao-container');
    const totalEncontradosContainer = document.getElementById('total-encontrados');
    
    totalCursos = cursos.length;
    const totalPaginas = Math.ceil(totalCursos / cursosPorPagina);
    const start = (pagina - 1) * cursosPorPagina;
    const end = start + cursosPorPagina;

    cursosContainer.innerHTML = '';
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

    totalEncontradosContainer.innerHTML = `<center><p>${totalCursos} curso(s) encontrado(s).</p></center>`;

    // Paginação
    paginacaoContainer.innerHTML = '';

    if (pagina > 1) {
        const voltarButton = document.createElement('button');
        voltarButton.textContent = 'Voltar';
        voltarButton.classList.add('pagina-button');
        voltarButton.onclick = () => {
            displayCursosFiltrados(cursos, pagina - 1);
        };
        paginacaoContainer.appendChild(voltarButton);
    }

    for (let i = 1; i <= totalPaginas; i++) {
        const paginaButton = document.createElement('button');
        paginaButton.textContent = i;
        paginaButton.classList.add('pagina-button');
        if (i === pagina) {
            paginaButton.classList.add('pagina-ativa');
        }
        paginaButton.onclick = () => {
            displayCursosFiltrados(cursos, i);
        };
        paginacaoContainer.appendChild(paginaButton);
    }

    if (pagina < totalPaginas) {
        const avancarButton = document.createElement('button');
        avancarButton.textContent = 'Avançar';
        avancarButton.classList.add('pagina-button');
        avancarButton.onclick = () => {
            displayCursosFiltrados(cursos, pagina + 1);
        };
        paginacaoContainer.appendChild(avancarButton);
    }
}

// Real-time search without "Buscar" button
document.getElementById('pesquisa').addEventListener('input', function () {
    buscarCursos();
});

// Função para carregar os tipos de cursos para o filtro
function carregarTipos() {
    const filtroTipos = document.getElementById('filtro-tipos');
    const tipos = new Set();

    const cachedCursos = getCachedCursos();
    if (cachedCursos) {
        cachedCursos.forEach(curso => {
            if (curso.tipo) {
                tipos.add(curso.tipo);
            }
        });
        displayTipos(tipos);
    } else {
        firebase.database().ref('cursos').once('value', snapshot => {
            snapshot.forEach(childSnapshot => {
                const curso = childSnapshot.val();
                if (curso.tipo) {
                    tipos.add(curso.tipo);
                }
            });
            displayTipos(tipos);
        });
    }
}

// Exibir tipos de cursos como links clicáveis
function displayTipos(tipos) {
    const filtroTipos = document.getElementById('filtro-tipos');
    filtroTipos.innerHTML = '';
    tipos.forEach(tipo => {
        const tipoLink = document.createElement('a');
        tipoLink.textContent = tipo;
        tipoLink.href = '#';
        tipoLink.onclick = (e) => {
            e.preventDefault();
            filtrarPorTipo(tipo);
        };
        filtroTipos.appendChild(tipoLink);
    });
}

// Filtrar cursos por tipo
function filtrarPorTipo(tipo) {
    const cursosContainer = document.getElementById('cursos-container');
    cursosContainer.innerHTML = '';

    const cachedCursos = getCachedCursos();
    if (cachedCursos) {
        const cursosFiltrados = cachedCursos.filter(curso => curso.tipo === tipo);
        displayCursosFiltrados(cursosFiltrados, 1);
    }
}

// Carregar cursos e tipos de cursos ao carregar a página
window.onload = () => {
    carregarCursos(paginaAtual);
    carregarTipos();
};
