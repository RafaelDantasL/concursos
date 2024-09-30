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

        // Verificar se todos os campos estão preenchidos
        if (!title || !description || !file) {
            setStatus('Por favor, preencha todos os campos.', 'red');
            return;
        }

        if (file.type !== 'application/pdf') {
            setStatus('Por favor, selecione um arquivo PDF.', 'red');
            return;
        }

        // Exibir status de autenticação
        setStatus('Autenticando com o Google...', 'blue');

        try {
            // Autenticação com Google
            await authenticate();

            // Exibir status de upload
            setStatus('Fazendo upload do arquivo...', 'blue');

            // Ler o arquivo como Base64
            const base64Data = await readFileAsBase64(file);

            // Fazer upload para o Google Drive
            const uploadResponse = await uploadFileToDrive(file.name, base64Data);

            console.log('Upload Response:', uploadResponse); // Log detalhado do upload

            if (uploadResponse.status === 'success') {
                const downloadLink = uploadResponse.webViewLink;
                const fileId = uploadResponse.id;

                // Exibir status de gravação no Firebase
                setStatus('Adicionando eBook ao banco de dados...', 'blue');

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
                throw new Error(uploadResponse.message || 'Falha ao fazer upload para o Google Drive');
            }
        } catch (error) {
            console.error('Erro:', error.message); // Log detalhado do erro
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

    function setStatus(message, color) {
        const statusDiv = document.getElementById('status');
        statusDiv.style.color = color;
        statusDiv.textContent = message;
        setTimeout(() => { statusDiv.textContent = ''; }, 5000);
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
            const uploadResponse = await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=media&fields=id,webViewLink`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/pdf',
                },
                body: Uint8Array.from(atob(fileData), c => c.charCodeAt(0))
            });

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json();
                throw new Error(errorData.error.message);
            }

            const uploadResult = await uploadResponse.json();
            const folderId = '1A7XUFeiSwVUYY2I8ngtu-EFyx6ildhnt'; // Id da pasta do Google Drive
            await fetch(`https://www.googleapis.com/drive/v3/files/${uploadResult.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "addParents": folderId,
                    "removeParents": "root",
                    "fields": "id, parents"
                })
            });

            await fetch(`https://www.googleapis.com/drive/v3/files/${uploadResult.id}/permissions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role: 'reader',
                    type: 'anyone'
                })
            });

            const webViewLinkResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${uploadResult.id}?fields=webViewLink`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            if (!webViewLinkResponse.ok) {
                const errorData = await webViewLinkResponse.json();
                throw new Error(errorData.error.message);
            }

            const webViewLinkData = await webViewLinkResponse.json();

            return {
                status: 'success',
                id: uploadResult.id,
                webViewLink: webViewLinkData.webViewLink
            };
        } catch (error) {
            console.error('Erro ao fazer upload para o Drive:', error);
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

                    console.log("Autenticação bem-sucedida, token:", accessToken);
                    resolve();
                } catch (error) {
                    console.error('Erro na autenticação:', error);
                    setStatus('Erro na autenticação com Google OAuth: ' + error.message, 'red');
                    reject(error);
                }
            });
        });
    }

    // Carregar eBooks na inicialização
    loadEbooks();
});
