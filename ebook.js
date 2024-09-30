        // Variáveis de Paginação
        const itemsPerPage = 10;
        let currentPage = 1;
        let filteredEbooks = ebooks.slice(); // Cópia dos dados originais

        // Função para Renderizar a Lista de EBooks
        function renderEbooksList(ebooksToRender) {
            const ebookList = document.getElementById('ebook-list');
            ebookList.innerHTML = ''; // Limpa a lista antes de renderizar

            // Determina os índices de início e fim para a página atual
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const ebooksOnPage = ebooksToRender.slice(startIndex, endIndex);

            ebooksOnPage.forEach((ebook, index) => {
                const actualIndex = startIndex + index; // Índice global

                const listItem = document.createElement('li');
                listItem.className = 'ebook-item';

                // Cabeçalho do eBook (Título, Link de Detalhes, Botão de Download)
                const headerDiv = document.createElement('div');
                headerDiv.className = 'ebook-header';

                // Título
                const titleDiv = document.createElement('div');
                titleDiv.className = 'ebook-title';
                titleDiv.textContent = ebook["Título"];

                // Ações (Ver Detalhes e Download)
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'ebook-actions';

                // Link de Ver Detalhes
                const detailsLink = document.createElement('a');
                detailsLink.className = 'ebook-details-link';
                detailsLink.href = 'javascript:void(0);'; // Evita recarregar a página
                detailsLink.textContent = 'Ver detalhes';
                detailsLink.setAttribute('data-index', actualIndex); // Atributo para identificar o eBook

                // Botão de Download
                const downloadButton = document.createElement('a');
                downloadButton.className = 'ebook-download';
                downloadButton.href = ebook["Link de download"];
                downloadButton.textContent = 'Baixar arquivo';
                downloadButton.target = '_blank'; // Abre em nova aba

                // Adiciona Link de Detalhes e Download ao Actions Div
                actionsDiv.appendChild(detailsLink);
                actionsDiv.appendChild(downloadButton);

                // Adiciona Título e Ações ao Header Div
                headerDiv.appendChild(titleDiv);
                headerDiv.appendChild(actionsDiv);

                // Descrição (Inicialmente escondida)
                const descriptionDiv = document.createElement('div');
                descriptionDiv.className = 'ebook-description';
                descriptionDiv.id = `description-${actualIndex}`;
                descriptionDiv.textContent = ebook["Descrição"];

                // Adiciona Header e Descrição ao Item de Lista
                listItem.appendChild(headerDiv);
                listItem.appendChild(descriptionDiv);

                // Adiciona o Item de Lista à Lista Principal
                ebookList.appendChild(listItem);
            });

            // Adiciona o Event Listener para os Links de Detalhes
            const detailsLinks = document.querySelectorAll('.ebook-details-link');
            detailsLinks.forEach(link => {
                link.addEventListener('click', function() {
                    const index = this.getAttribute('data-index');
                    const description = document.getElementById(`description-${index}`);
                    
                    if (description.classList.contains('show')) {
                        description.classList.remove('show');
                        this.textContent = 'Ver detalhes';
                    } else {
                        description.classList.add('show');
                        this.textContent = 'Ocultar detalhes';
                    }
                });
            });
        }

        // Função para Renderizar os Controles de Paginação
        function renderPagination(totalItems) {
            const paginationContainer = document.getElementById('pagination');
            paginationContainer.innerHTML = ''; // Limpa os controles antes de renderizar

            const totalPages = Math.ceil(totalItems / itemsPerPage);

            // Função para criar botões
            function createButton(label, disabled = false, active = false) {
                const button = document.createElement('button');
                button.textContent = label;
                if (disabled) {
                    button.classList.add('disabled');
                    button.disabled = true;
                }
                if (active) {
                    button.classList.add('active');
                }
                return button;
            }

            // Botão de Página Anterior
            const prevButton = createButton('Anterior', currentPage === 1);
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateDisplay();
                }
            });
            paginationContainer.appendChild(prevButton);

            // Botões de Número de Página
            for (let i = 1; i <= totalPages; i++) {
                const pageButton = createButton(i, false, i === currentPage);
                pageButton.addEventListener('click', () => {
                    currentPage = i;
                    updateDisplay();
                });
                paginationContainer.appendChild(pageButton);
            }

            // Botão de Próxima Página
            const nextButton = createButton('Próxima', currentPage === totalPages || totalPages === 0);
            nextButton.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    updateDisplay();
                }
            });
            paginationContainer.appendChild(nextButton);
        }

        // Função para Atualizar a Exibição (Ebooks e Paginação)
        function updateDisplay() {
            renderEbooksList(filteredEbooks);
            renderPagination(filteredEbooks.length);
        }

        // Função para Filtrar os Ebooks com Base na Pesquisa
        function filterEbooks(searchTerm) {
            if (!searchTerm) {
                filteredEbooks = ebooks.slice(); // Copia os dados originais
            } else {
                const lowerCaseTerm = searchTerm.toLowerCase();
                filteredEbooks = ebooks.filter(ebook => 
                    ebook["Título"].toLowerCase().includes(lowerCaseTerm) ||
                    ebook["Descrição"].toLowerCase().includes(lowerCaseTerm)
                );
            }
            currentPage = 1; // Reseta para a primeira página após a filtragem
            updateDisplay();
        }

        // Função para Configurar o Campo de Pesquisa
        function setupSearch() {
            const searchInput = document.getElementById('search-input');
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.trim();
                filterEbooks(searchTerm);
            });
        }

        // Inicialização da Página
        window.addEventListener('DOMContentLoaded', () => {
            setupSearch();
            updateDisplay();
        });
