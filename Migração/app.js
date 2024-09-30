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

// Variáveis Globais
let allEbooks = [];
let filteredEbooks = [];
const ITEMS_PER_PAGE = 15;
let currentPage = 1;

// Configurações do Google OAuth2
const CLIENT_ID = '375498885317-mg454r1gcdblj14h92cvumn23mr14k3q.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

// Variável para armazenar o token de acesso
let accessToken = null;

document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('addButton');
    const addForm = document.getElementById('addForm');
    const saveButton = document.getElementById('saveButton');
    const cancelButton = document.getElementById('cancelButton');
    const searchButton = document.getElementById('searchButton');

    addButton.addEventListener('click', () => {
        addForm.style.display = 'flex';
        resetForm();
    });

    cancelButton.addEventListener('click', () => {
        addForm.style.display = 'none';
        resetForm();
    });

    saveButton.addEventListener('click', async () => {
        const title = document.getElementById('titleInput').value.trim();
        const description = document.getElementById('descriptionInput').value.trim();
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];

        if (!title || !description || !file) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (file.type !== 'application/pdf') {
            alert('Por favor, selecione um arquivo PDF.');
            return;
        }

        // Exibir status
        setStatus('Autenticando com o Google...', 'blue');

        try {
            // Verificar e solicitar autorização
            await authenticate();

            // Exibir status
            setStatus('Fazendo upload do arquivo...', 'blue');

            // Ler o arquivo como Base64
            const base64Data = await readFileAsBase64(file);

            // Fazer upload para o Google Drive
            const uploadResponse = await uploadFileToDrive(file.name, base64Data);

            if (uploadResponse.status === 'success') {
                const downloadLink = uploadResponse.webViewLink;
                const fileId = uploadResponse.id;

                // Adicionar dados ao Firebase
                const newEbookRef = database.ref('ebooks').push();
                await newEbookRef.set({
                    title: title,
                    description: description,
                    downloadLink: downloadLink,
                    fileId: fileId,
                    createdAt: Date.now()
                });

                setStatus('Ebook adicionado com sucesso!', 'green');
                reloadData();
            } else {
                throw new Error(uploadResponse.message);
            }
        } catch (error) {
            console.error(error);
            setStatus('Erro: ' + error.message, 'red');
        }
    });

    searchButton.addEventListener('click', () => {
        const query = document.getElementById('searchInput').value.trim().toLowerCase();
        currentPage = 1;
        if (query === "") {
            filteredEbooks = allEbooks;
        } else {
            filteredEbooks = allEbooks.filter(ebook => ebook.title.toLowerCase().includes(query));
        }
        renderEbooks();
        renderPagination();
    });

    // Funções Auxiliares
    function loadEbooks() {
        database.ref('ebooks').on('value', snapshot => {
            const data = snapshot.val();
            allEbooks = [];
            for (let id in data) {
                allEbooks.push({
                    id: id,
                    title: data[id].title,
                    description: data[id].description,
                    downloadLink: data[id].downloadLink,
                    fileId: data[id].fileId,
                    createdAt: data[id].createdAt
                });
            }
            // Ordenar por createdAt desc
            allEbooks.sort((a, b) => b.createdAt - a.createdAt);
            filteredEbooks = allEbooks;
            renderEbooks();
            renderPagination();
        });
    }

    function renderEbooks() {
        const ebookList = document.getElementById('ebookList');
        ebookList.innerHTML = '';

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const ebooksToDisplay = filteredEbooks.slice(startIndex, endIndex);

        if (ebooksToDisplay.length === 0) {
            ebookList.innerHTML = '<p>Nenhum eBook encontrado.</p>';
            return;
        }

        ebooksToDisplay.forEach(ebook => {
            const item = document.createElement('div');
            item.className = 'course-item';
            item.dataset.id = ebook.id;

            const title = document.createElement('span');
            title.textContent = ebook.title;
            title.className = 'title';
            item.appendChild(title);

            const actions = document.createElement('div');
            actions.className = 'actions';

            const downloadButton = document.createElement('a');
            downloadButton.textContent = 'Download';
            downloadButton.href = ebook.downloadLink;
            downloadButton.target = '_blank';
            downloadButton.className = 'download-button';
            actions.appendChild(downloadButton);

            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.addEventListener('click', () => editEbook(ebook));
            actions.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.addEventListener('click', () => deleteEbook(ebook.id, ebook.fileId));
            actions.appendChild(deleteButton);

            item.appendChild(actions);
            ebookList.appendChild(item);
        });
    }

    function renderPagination() {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        const totalPages = Math.ceil(filteredEbooks.length / ITEMS_PER_PAGE);
        if (totalPages <= 1) return; // Não exibir paginação se há apenas uma página

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderEbooks();
                renderPagination();
                window.scrollTo(0, 0);
            }
        });
        pagination.appendChild(prevButton);

        // Mostrar até 5 páginas próximas à atual
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (currentPage <= 3) {
            endPage = Math.min(5, totalPages);
        }
        if (currentPage >= totalPages - 2) {
            startPage = Math.max(1, totalPages - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            if (i === currentPage) {
                pageButton.className = 'current-page';
                pageButton.disabled = true;
            }
            pageButton.addEventListener('click', () => {
                currentPage = i;
                renderEbooks();
                renderPagination();
                window.scrollTo(0, 0);
            });
            pagination.appendChild(pageButton);
        }

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Próximo';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderEbooks();
                renderPagination();
                window.scrollTo(0, 0);
            }
        });
        pagination.appendChild(nextButton);
    }

    function editEbook(ebook) {
        // Preencher o formulário com os dados do eBook
        document.getElementById('titleInput').value = ebook.title;
        document.getElementById('descriptionInput').value = ebook.description;
        // Não é necessário preencher o campo de arquivo
        addForm.style.display = 'flex';
        // Alterar o botão de salvar para atualizar
        saveButton.textContent = 'Atualizar';
        // Remover event listener anterior para evitar múltiplas chamadas
        const newSaveButton = saveButton.cloneNode(true);
        saveButton.parentNode.replaceChild(newSaveButton, saveButton);
        // Adicionar novo event listener para atualização
        newSaveButton.addEventListener('click', async () => {
            const updatedTitle = document.getElementById('titleInput').value.trim();
            const updatedDescription = document.getElementById('descriptionInput').value.trim();
            const fileInput = document.getElementById('fileInput');
            const file = fileInput.files[0];

            if (!updatedTitle || !updatedDescription) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            // Exibir status
            setStatus('Autenticando com o Google...', 'blue');

            try {
                // Verificar e solicitar autorização
                await authenticate();

                setStatus('Atualizando eBook...', 'blue');

                let downloadLink = ebook.downloadLink;
                let fileId = ebook.fileId;

                if (file) {
                    if (file.type !== 'application/pdf') {
                        alert('Por favor, selecione um arquivo PDF.');
                        return;
                    }

                    // Ler o arquivo como Base64
                    const base64Data = await readFileAsBase64(file);

                    // Fazer upload para o Google Drive
                    const uploadResponse = await uploadFileToDrive(file.name, base64Data);

                    if (uploadResponse.status === 'success') {
                        downloadLink = uploadResponse.webViewLink;
                        fileId = uploadResponse.id;

                        // Excluir o arquivo antigo do Drive
                        await deleteFileFromDrive(ebook.fileId);
                    } else {
                        throw new Error(uploadResponse.message);
                    }
                }

                // Atualizar dados no Firebase
                await database.ref(`ebooks/${ebook.id}`).set({
                    title: updatedTitle,
                    description: updatedDescription,
                    downloadLink: downloadLink,
                    fileId: fileId,
                    createdAt: ebook.createdAt // Manter o timestamp original
                });

                setStatus('Ebook atualizado com sucesso!', 'green');
                reloadData();
            } catch (error) {
                console.error(error);
                setStatus('Erro: ' + error.message, 'red');
            }
        });
    }

    async function deleteEbook(ebookId, fileId) {
        if (!confirm('Tem certeza que deseja excluir este ebook?')) return;

        try {
            // Excluir do Firebase
            await database.ref(`ebooks/${ebookId}`).remove();

            // Excluir o arquivo do Google Drive via API
            const deleteResponse = await deleteFileFromDrive(fileId);

            if (deleteResponse.status === 'success') {
                setStatus('Ebook excluído com sucesso!', 'green');
                reloadData();
            } else {
                throw new Error(deleteResponse.message);
            }
        } catch (error) {
            console.error(error);
            setStatus('Erro ao excluir ebook: ' + error.message, 'red');
        }
    }

    function resetForm() {
        document.getElementById('titleInput').value = '';
        document.getElementById('descriptionInput').value = '';
        document.getElementById('fileInput').value = '';
        saveButton.textContent = 'Salvar';
    }

    function reloadData() {
        resetForm();
        addForm.style.display = 'none';
        loadEbooks();
    }

    function setStatus(message, color) {
        const statusDiv = document.getElementById('status');
        statusDiv.style.color = color;
        statusDiv.textContent = message;
        setTimeout(() => { statusDiv.textContent = ''; }, 5000);
    }

    function readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    }

    async function uploadFileToDrive(fileName, fileData) {
        try {
            const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/pdf',
                    'Content-Length': fileData.length
                },
                body: atob(fileData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message);
            }

            const result = await response.json();
            // Obter o link compartilhável
            const shareResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${result.id}/permissions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    role: 'reader',
                    type: 'anyone'
                })
            });

            if (!shareResponse.ok) {
                const errorData = await shareResponse.json();
                throw new Error(errorData.error.message);
            }

            // Obter o link de visualização
            const webViewLinkResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${result.id}?fields=webViewLink`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!webViewLinkResponse.ok) {
                const errorData = await webViewLinkResponse.json();
                throw new Error(errorData.error.message);
            }

            const webViewLinkData = await webViewLinkResponse.json();

            return {
                status: 'success',
                id: result.id,
                webViewLink: webViewLinkData.webViewLink
            };
        } catch (error) {
            console.error('Erro ao fazer upload para o Drive:', error);
            return { status: 'error', message: error.message };
        }
    }

    async function deleteFileFromDrive(fileId) {
        try {
            const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.status === 204) {
                return { status: 'success' };
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error.message);
            }
        } catch (error) {
            console.error('Erro ao excluir arquivo do Drive:', error);
            return { status: 'error', message: error.message };
        }
    }

    // Autenticação com Google OAuth2
    function authenticate() {
        return new Promise((resolve, reject) => {
            gapi.load('client:auth2', async () => {
                try {
                    await gapi.client.init({
                        clientId: CLIENT_ID,
                        scope: SCOPES
                    });

                    const authInstance = gapi.auth2.getAuthInstance();

                    if (!authInstance.isSignedIn.get()) {
                        const user = await authInstance.signIn();
                        accessToken = user.getAuthResponse().access_token;
                    } else {
                        accessToken = authInstance.currentUser.get().getAuthResponse().access_token;
                    }

                    resolve();
                } catch (error) {
                    console.error('Erro na autenticação:', error);
                    reject(error);
                }
            });
        });
    }

    // Carregar eBooks na inicialização
    loadEbooks();
});
