
// URL da API
const BASE_URL = 'http://localhost:3000/api/';

// ===============================
// FUNÇÃO BASE - GET
// ===============================
async function getData(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error(error);
        alert(`Tivemos problemas ao carregar os dados.\nERRO: ${error.message}`);
        return [];
    }
}


// ===============================
// FUNÇÃO BASE - POST
// ===============================
async function postData(endpoint, dados) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error(error);
        alert(`Tivemos problemas ao salvar os dados.\nERRO: ${error.message}`);
        return null;
    }
}


// ===============================
// FUNÇÃO BASE - PUT
// ===============================
async function putData(endpoint, dados) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error(error);
        alert(`Tivemos problemas ao atualizar os dados.\nERRO: ${error.message}`);
        return null;
    }
}


// ===============================
// FUNÇÃO BASE - DELETE
// ===============================
async function deleteData(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error(error);
        alert(`Tivemos problemas ao excluir os dados.\nERRO: ${error.message}`);
        return null;
    }
}


// ===============================
// JOGOS
// ===============================

async function getJogos() {
    return getData('jogos');
}

async function postJogo(dados) {
    return postData('jogos', dados);
}

async function putJogo(id, dados) {
    return putData(`jogos/${id}`, dados);
}

async function deleteJogo(id) {
    return deleteData(`jogos/${id}`);
}


// ===============================
// TIMES
// ===============================

async function getTimes() {
    return getData('times');
}

async function postTime(dados) {
    return postData('times', dados);
}

async function putTime(id, dados) {
    return putData(`times/${id}`, dados);
}

async function deleteTime(id) {
    return deleteData(`times/${id}`);
}


// ===============================
// COMPETIDORES
// ===============================

async function getCompetidores() {
    return getData('competidores');
}

async function postCompetidor(dados) {
    return postData('competidores', dados);
}

async function putCompetidor(id, dados) {
    return putData(`competidores/${id}`, dados);
}

async function deleteCompetidor(id) {
    return deleteData(`competidores/${id}`);
}


// ===============================
// CONFRONTOS
// ===============================

async function getConfrontos() {
    return getData('confrontos');
}

async function postConfronto(dados) {
    return postData('confrontos', dados);
}

async function putConfronto(id, dados) {
    return putData(`confrontos/${id}`, dados);
}

async function deleteConfronto(id) {
    return deleteData(`confrontos/${id}`);
}

