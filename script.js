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

// Função para carregar cursos do Firebase
function carregarCursos() {
    const cursosContainer = document.getElementById('cursos-container');
    cursosContainer.innerHTML = '';

    firebase.database().ref('cursos').once('value', snapshot => {
        snapshot.forEach(childSnapshot => {
            const curso = childSnapshot.val();
            cursosContainer.innerHTML += `
                <div class="curso" onclick="location.href='${curso.link}'">
                    <h3>${curso.titulo}</h3>
                    <img src="${curso.imagem}" alt="${curso.titulo}">
                    <p>${curso.descricao}</p>
                    <p><strong>R$ ${curso.preco}</strong></p>
                </div>
            `;
        });
    });
}

// Função para buscar cursos
function buscarCursos() {
    const pesquisa = document.getElementById('pesquisa').value.toLowerCase();
    const cursosContainer = document.getElementById('cursos-container');
    cursosContainer.innerHTML = '';

    firebase.database().ref('cursos').once('value', snapshot => {
        snapshot.forEach(childSnapshot => {
            const curso = childSnapshot.val();
            if (curso.titulo.toLowerCase().includes(pesquisa)) {
                cursosContainer.innerHTML += `
                    <div class="curso" onclick="location.href='${curso.link}'">
                        <h3>${curso.titulo}</h3>
                        <img src="${curso.imagem}" alt="${curso.titulo}">
                        <p>${curso.descricao}</p>
                        <p><strong>R$ ${curso.preco}</strong></p>
                    </div>
                `;
            }
        });
    });
}

// Carregar cursos ao carregar a página
window.onload = carregarCursos;
