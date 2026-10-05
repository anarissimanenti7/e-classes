const BASE_URL = 'http://localhost:3000/api';


// ==========================================
// FUNÇÃO BASE
// ==========================================

async function request(endpoint, options = {}) {
    try {

        const response = await fetch(
            `${BASE_URL}/${endpoint}`,
            {
                ...options,

                headers: {
                    'Content-Type': 'application/json',
                    ...(options.headers || {})
                }
            }
        );


        if (!response.ok) {

            const mensagem =
                await response.text();

            throw new Error(
                `Erro ${response.status}: ${mensagem}`
            );
        }


        // DELETE pode não retornar JSON
        if (response.status === 204) {
            return true;
        }


        return await response.json();

    } catch (error) {

        console.error(
            'Erro na API:',
            error
        );

        alert(
            `Erro ao comunicar com a API:\n${error.message}`
        );

        return null;
    }
}


// ==========================================
// GET
// ==========================================

// Jogos
async function getJogos() {
    return request('jogos');
}


// Times
async function getTimes() {
    return request('times');
}


// Competidores
async function getCompetidores() {
    return request('competidores');
}


// Confrontos
async function getConfrontos() {
    return request('confrontos');
}


// ==========================================
// POST
// ==========================================

// Criar jogo
async function postJogo(dados) {

    return request('jogos', {

        method: 'POST',

        body: JSON.stringify(dados)

    });
}


// Criar time
async function postTime(dados) {

    return request('times', {

        method: 'POST',

        body: JSON.stringify(dados)

    });
}


// Criar competidor
async function postCompetidor(dados) {

    return request('competidores', {

        method: 'POST',

        body: JSON.stringify(dados)

    });
}


// Criar confronto
async function postConfronto(dados) {

    return request('confrontos', {

        method: 'POST',

        body: JSON.stringify(dados)

    });
}


// ==========================================
// PUT
// ==========================================

// Atualizar jogo
async function putJogo(id, dados) {

    return request(
        `jogos/${id}`,
        {
            method: 'PUT',
            body: JSON.stringify(dados)
        }
    );
}


// Atualizar time
async function putTime(id, dados) {

    return request(
        `times/${id}`,
        {
            method: 'PUT',
            body: JSON.stringify(dados)
        }
    );
}


// Atualizar competidor
async function putCompetidor(id, dados) {

    return request(
        `competidores/${id}`,
        {
            method: 'PUT',
            body: JSON.stringify(dados)
        }
    );
}


// Atualizar confronto
async function putConfronto(id, dados) {

    return request(
        `confrontos/${id}`,
        {
            method: 'PUT',
            body: JSON.stringify(dados)
        }
    );
}


// ==========================================
// DELETE
// ==========================================

// Excluir jogo
async function deleteJogo(id) {

    return request(
        `jogos/${id}`,
        {
            method: 'DELETE'
        }
    );
}


// Excluir time
async function deleteTime(id) {

    return request(
        `times/${id}`,
        {
            method: 'DELETE'
        }
    );
}


// Excluir competidor
async function deleteCompetidor(id) {

    return request(
        `competidores/${id}`,
        {
            method: 'DELETE'
        }
    );
}


// Excluir confronto
async function deleteConfronto(id) {

    return request(
        `confrontos/${id}`,
        {
            method: 'DELETE'
        }
    );
}