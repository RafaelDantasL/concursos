document.addEventListener("DOMContentLoaded", function () {
    const cursosBtn = document.getElementById("cursos-btn");
    const cursosSection = document.getElementById("cursos-section");
    const cursosContainer = document.getElementById("cursos-container");
    const pagination = document.getElementById("pagination");

    let cursos = [];
    const cursosPorPagina = 12;
    let paginaAtual = 1;

    // Carrega os cursos a partir do banco de dados (JSON)
    async function carregarCursos() {
        const response = await fetch("cursos.json");
        cursos = await response.json();
        mostrarCursos();
        criarPaginacao();
    }

    // Mostra os cursos na página
    function mostrarCursos() {
        cursosContainer.innerHTML = "";
        const inicio = (paginaAtual - 1) * cursosPorPagina;
        const fim = inicio + cursosPorPagina;
        const cursosExibidos = cursos.slice(inicio, fim);

        cursosExibidos.forEach(curso => {
            const cursoCard = document.createElement("div");
            cursoCard.classList.add("curso-card");
            cursoCard.innerHTML = `
                <img src="${curso.imagem}" alt="${curso.nome}">
                <h3>${curso.nome}</h3>
                <p>${curso.descricao}</p>
                <p><strong>${curso.precoPromo ? `<s>${curso.preco}</s> ${curso.precoPromo}` : curso.preco}</strong></p>
                <p style="color:green;">${curso.parcelas}x de ${curso.valorParcela}</p>
            `;
            cursoCard.addEventListener("click", function () {
                window.location.href = `curso/${curso.id}.html`;
            });
            cursosContainer.appendChild(cursoCard);
        });
    }

    // Cria a navegação da paginação
    function criarPaginacao() {
        const totalPaginas = Math.ceil(cursos.length / cursosPorPagina);
        pagination.innerHTML = "";

        for (let i = 1; i <= totalPaginas; i++) {
            const pagLink = document.createElement("a");
            pagLink.href = "#";
            pagLink.textContent = i;
            pagLink.addEventListener("click", function (e) {
                e.preventDefault();
                paginaAtual = i;
                mostrarCursos();
            });
            pagination.appendChild(pagLink);
        }
    }

    cursosBtn.addEventListener("click", function () {
        cursosSection.classList.remove("hidden");
        carregarCursos();
    });
});
