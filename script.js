const cursosPorPagina = 12;
let paginaAtual = 1;
let cursosTotais = [];

function carregarCursos() {
    firebase.database().ref('cursos').once('value', snapshot => {
        cursosTotais = [];
        snapshot.forEach(childSnapshot => {
            cursosTotais.push(childSnapshot.val());
        });
        exibirCursos();
        gerarPaginacao();
    });
}

function exibirCursos() {
    const cursosContainer = document.getElementById('cursos-container');
    cursosContainer.innerHTML = '';
    const inicio = (paginaAtual - 1) * cursosPorPagina;
    const fim = inicio + cursosPorPagina;
    const cursosPagina = cursosTotais.slice(inicio, fim);
    
    cursosPagina.forEach(curso => {
        cursosContainer.innerHTML += `
            <div class="curso" onclick="location.href='${curso.link}'">
                <h3>${curso.titulo}</h3>
                <img src="${curso.imagem}" alt="${curso.titulo}">
                <p>${curso.descricao}</p>
                <p><strong>R$ ${curso.preco}</strong></p>
                ${curso.promocao ? `<p><strong>Promoção: R$ ${curso.promocao}</strong></p>` : ''}
                ${curso.parcelamento ? `<p><strong>Parcelamento: ${curso.parcelamento}</strong></p>` : ''}
            </div>
        `;
    });
}

function gerarPaginacao() {
    const paginacaoContainer = document.getElementById('paginacao');
    paginacaoContainer.innerHTML = '';
    const totalPaginas = Math.ceil(cursosTotais.length / cursosPorPagina);

    for (let i = 1; i <= totalPaginas; i++) {
        paginacaoContainer.innerHTML += `
            <button onclick="mudarPagina(${i})">${i}</button>
        `;
    }
}

function mudarPagina(pagina) {
    paginaAtual = pagina;
    exibirCursos();
}

function buscarCursos() {
    const pesquisa = document.getElementById('pesquisa').value.toLowerCase();
    const cursosContainer = document.getElementById('cursos-container');
    cursosContainer.innerHTML = '';

    firebase.database().ref('cursos').once('value', snapshot => {
        cursosTotais = [];
        snapshot.forEach(childSnapshot => {
            const curso = childSnapshot.val();
            if (curso.titulo.toLowerCase().includes(pesquisa)) {
                cursosTotais.push(curso);
            }
        });
        paginaAtual = 1;
        exibirCursos();
        gerarPaginacao();
    });
}

window.onload = carregarCursos;
