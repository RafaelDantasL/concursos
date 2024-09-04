const firebaseConfig = {
    apiKey: "AIzaSyC-STt5EnVQA5oJEF1Vie3rHk1qOW9TqMw",
    authDomain: "cursos-preparatorios.firebaseapp.com",
    databaseURL: "https://cursos-preparatorios-default-rtdb.firebaseio.com",
    projectId: "cursos-preparatorios",
    storageBucket: "cursos-preparatorios.appspot.com",
    messagingSenderId: "121871815126",
    appId: "1:121871815126:web:1ea3e4630b3b4de6569477"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.getElementById('add-course-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const titulo = document.getElementById('titulo').value;
    const imagem = document.getElementById('imagem').files[0];
    const descricao = document.getElementById('descricao').value;
    const preco = document.getElementById('preco').value;
    const promocao = document.getElementById('promocao').value;
    const parcelamento = document.getElementById('parcelamento').value;
    const linkExterno = document.getElementById('linkExterno').value;

    // Subir a imagem para o Github e salvar o link dela no Firebase
    uploadImageToGithub(imagem).then(imagemUrl => {
        const novoCurso = {
            titulo,
            imagem: imagemUrl,
            descricao,
            preco,
            promocao,
            parcelamento,
            link: linkExterno || '#' // Redireciona para a página de vendas se não houver link externo
        };
        
        database.ref('cursos').push(novoCurso);
        alert('Curso adicionado com sucesso!');
    });
});

function uploadImageToGithub(file) {
    return new Promise((resolve, reject) => {
        // Lógica para fazer upload de imagem para o Github
        // Utilizando API do Github, ou via CDN
        // Substitua esse código pelo código real de upload

        const imagemUrl = `url_da_imagem_no_github`; // Substitua pelo URL gerado pelo Github
        resolve(imagemUrl);
    });
}

document.getElementById('criar-pagina-vendas').addEventListener('click', function() {
    document.getElementById('vendas-form-container').style.display = 'block';

    // Criar campos de vantagens dinamicamente
    const vantagensContainer = document.getElementById('vantagens-container');
    vantagensContainer.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
        vantagensContainer.innerHTML += `
            <input type="text" id="vantagem${i}" placeholder="Vantagem ${i}">
        `;
    }
});

document.getElementById('add-venda-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const descricaoCompleta = document.getElementById('descricaoCompleta').value;
    const vantagens = [];
    for (let i = 1; i <= 10; i++) {
        const vantagem = document.getElementById(`vantagem${i}`).value;
        if (vantagem) vantagens.push(vantagem);
    }
    const linkCheckout = document.getElementById('linkCheckout').value;
    const scriptCheckout = document.getElementById('scriptCheckout').value;

    // Criar a página de vendas
    criarPaginaDeVendas({
        descricaoCompleta,
        vantagens,
        linkCheckout,
        scriptCheckout
    }).then(urlPaginaVenda => {
        alert('Página de vendas criada com sucesso!');
    });
});

function criarPaginaDeVendas({ descricaoCompleta, vantagens, linkCheckout, scriptCheckout }) {
    return new Promise((resolve, reject) => {
        // Criar a página de vendas e armazenar no Github
        // Retornar o link da página criada
        const urlPaginaVenda = `url_da_pagina_de_vendas_no_github`; // Substitua pelo URL da página criada
        resolve(urlPaginaVenda);
    });
}
