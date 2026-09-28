
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const caminhoDados = path.join(__dirname, 'data.json');

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

// Lê o data.json
function lerDados() {
    const conteudo = fs.readFileSync(caminhoDados, 'utf-8');
    return JSON.parse(conteudo);
}

// Salva os dados no data.json
function salvarDados(dados) {
    fs.writeFileSync(
        caminhoDados,
        JSON.stringify(dados, null, 2),
        'utf-8'
    );
}

// Gera um novo ID
function gerarId(lista) {
    if (lista.length === 0) {
        return 1;
    }

    return Math.max(...lista.map(item => item.id)) + 1;
}

// ==========================================
// ROTA PRINCIPAL
// ==========================================

app.get('/', (req, res) => {
    res.status(200).json({
        mensagem: 'Bem vindo à API GamerClass',
        status: 'sucesso',
        rotas: [
            '/api/jogos',
            '/api/times',
            '/api/competidores',
            '/api/confrontos'
        ],
        metodos: ['GET', 'POST', 'PUT', 'DELETE']
    });
});

// ==========================================
// JOGOS
// ==========================================

// GET /api/jogos
app.get('/api/jogos', (req, res) => {
    const dados = lerDados();

    res.status(200).json(dados.games);
});

// GET /api/jogos/:id
app.get('/api/jogos/:id', (req, res) => {
    const dados = lerDados();

    const jogo = dados.games.find(
        jogo => jogo.id === Number(req.params.id)
    );

    if (!jogo) {
        return res.status(404).json({
            erro: 'Jogo não encontrado'
        });
    }

    res.status(200).json(jogo);
});

// POST /api/jogos
app.post('/api/jogos', (req, res) => {
    const dados = lerDados();

    const { name, genre } = req.body;

    if (!name || !genre) {
        return res.status(400).json({
            erro: 'Nome e gênero são obrigatórios'
        });
    }

    const novoJogo = {
        id: gerarId(dados.games),
        name,
        genre
    };

    dados.games.push(novoJogo);

    salvarDados(dados);

    res.status(201).json(novoJogo);
});

// PUT /api/jogos/:id
app.put('/api/jogos/:id', (req, res) => {
    const dados = lerDados();

    const id = Number(req.params.id);

    const indice = dados.games.findIndex(
        jogo => jogo.id === id
    );

    if (indice === -1) {
        return res.status(404).json({
            erro: 'Jogo não encontrado'
        });
    }

    const jogoAtualizado = {
        ...dados.games[indice],
        ...req.body,
        id
    };

    dados.games[indice] = jogoAtualizado;

    salvarDados(dados);

    res.status(200).json(jogoAtualizado);
});

// DELETE /api/jogos/:id
app.delete('/api/jogos/:id', (req, res) => {
    const dados = lerDados();

    const id = Number(req.params.id);

    const indice = dados.games.findIndex(
        jogo => jogo.id === id
    );

    if (indice === -1) {
        return res.status(404).json({
            erro: 'Jogo não encontrado'
        });
    }

    const jogoRemovido = dados.games.splice(indice, 1)[0];

    salvarDados(dados);

    res.status(200).json({
        mensagem: 'Jogo removido com sucesso',
        jogo: jogoRemovido
    });
});

// ==========================================
// TIMES
// ==========================================

// GET /api/times
app.get('/api/times', (req, res) => {
    const dados = lerDados();

    res.status(200).json(dados.teams);
});

// GET /api/times/:id
app.get('/api/times/:id', (req, res) => {
    const dados = lerDados();

    const time = dados.teams.find(
        time => time.id === Number(req.params.id)
    );

    if (!time) {
        return res.status(404).json({
            erro: 'Time não encontrado'
        });
    }

    res.status(200).json(time);
});

// POST /api/times
app.post('/api/times', (req, res) => {
    const dados = lerDados();

    const { name, color } = req.body;

    if (!name || !color) {
        return res.status(400).json({
            erro: 'Nome e cor são obrigatórios'
        });
    }

    const novoTime = {
        id: gerarId(dados.teams),
        name,
        color
    };

    dados.teams.push(novoTime);

    salvarDados(dados);

    res.status(201).json(novoTime);
});

// PUT /api/times/:id
app.put('/api/times/:id', (req, res) => {
    const dados = lerDados();

    const id = Number(req.params.id);

    const indice = dados.teams.findIndex(
        time => time.id === id
    );

    if (indice === -1) {
        return res.status(404).json({
            erro: 'Time não encontrado'
        });
    }

    const timeAtualizado = {
        ...dados.teams[indice],
        ...req.body,
        id
    };

    dados.teams[indice] = timeAtualizado;

    salvarDados(dados);

    res.status(200).json(timeAtualizado);
});

// DELETE /api/times/:id
app.delete('/api/times/:id', (req, res) => {
    const dados = lerDados();

    const id = Number(req.params.id);

    const indice = dados.teams.findIndex(
        time => time.id === id
    );

    if (indice === -1) {
        return res.status(404).json({
            erro: 'Time não encontrado'
        });
    }

    const timeRemovido = dados.teams.splice(indice, 1)[0];

    salvarDados(dados);

    res.status(200).json({
        mensagem: 'Time removido com sucesso',
        time: timeRemovido
    });
});

// ==========================================
// COMPETIDORES
// ==========================================

// GET /api/competidores
app.get('/api/competidores', (req, res) => {
    const dados = lerDados();

    res.status(200).json(dados.competitors);
});

// GET /api/competidores/:id
app.get('/api/competidores/:id', (req, res) => {
    const dados = lerDados();

    const competidor = dados.competitors.find(
        competidor => competidor.id === Number(req.params.id)
    );

    if (!competidor) {
        return res.status(404).json({
            erro: 'Competidor não encontrado'
        });
    }

    res.status(200).json(competidor);
});

// POST /api/competidores
app.post('/api/competidores', (req, res) => {
    const dados = lerDados();

    const { name, nickname, teamId } = req.body;

    if (!name || !nickname || teamId === undefined) {
        return res.status(400).json({
            erro: 'Nome, nickname e teamId são obrigatórios'
        });
    }

    const timeExiste = dados.teams.some(
        time => time.id === Number(teamId)
    );

    if (!timeExiste) {
        return res.status(400).json({
            erro: 'O time informado não existe'
        });
    }

    const novoCompetidor = {
        id: gerarId(dados.competitors),
        name,
        nickname,
        teamId: Number(teamId)
    };

    dados.competitors.push(novoCompetidor);

    salvarDados(dados);

    res.status(201).json(novoCompetidor);
});

// PUT /api/competidores/:id
app.put('/api/competidores/:id', (req, res) => {
    const dados = lerDados();

    const id = Number(req.params.id);

    const indice = dados.competitors.findIndex(
        competidor => competidor.id === id
    );

    if (indice === -1) {
        return res.status(404).json({
            erro: 'Competidor não encontrado'
        });
    }

    const competidorAtualizado = {
        ...dados.competitors[indice],
        ...req.body,
        id
    };

    if (competidorAtualizado.teamId !== undefined) {
        const timeExiste = dados.teams.some(
            time => time.id === Number(competidorAtualizado.teamId)
        );

        if (!timeExiste) {
            return res.status(400).json({
                erro: 'O time informado não existe'
            });
        }

        competidorAtualizado.teamId = Number(
            competidorAtualizado.teamId
        );
    }

    dados.competitors[indice] = competidorAtualizado;

    salvarDados(dados);

    res.status(200).json(competidorAtualizado);
});

// DELETE /api/competidores/:id
app.delete('/api/competidores/:id', (req, res) => {
    const dados = lerDados();

    const id = Number(req.params.id);

    const indice = dados.competitors.findIndex(
        competidor => competidor.id === id
    );

    if (indice === -1) {
        return res.status(404).json({
            erro: 'Competidor não encontrado'
        });
    }

    const competidorRemovido =
        dados.competitors.splice(indice, 1)[0];

    salvarDados(dados);

    res.status(200).json({
        mensagem: 'Competidor removido com sucesso',
        competidor: competidorRemovido
    });
});

// ==========================================
// CONFRONTOS
// ==========================================

// GET /api/confrontos
app.get('/api/confrontos', (req, res) => {
    const dados = lerDados();

    res.status(200).json(dados.matches);
});

// GET /api/confrontos/:id
app.get('/api/confrontos/:id', (req, res) => {
    const dados = lerDados();

    const confronto = dados.matches.find(
        confronto => confronto.id === Number(req.params.id)
    );

    if (!confronto) {
        return res.status(404).json({
            erro: 'Confronto não encontrado'
        });
    }

    res.status(200).json(confronto);
});

// POST /api/confrontos
app.post('/api/confrontos', (req, res) => {
    const dados = lerDados();

    const {
        gameId,
        team1Id,
        team2Id,
        score1,
        score2,
        status,
        date
    } = req.body;

    if (
        gameId === undefined ||
        team1Id === undefined ||
        team2Id === undefined ||
        score1 === undefined ||
        score2 === undefined ||
        !status ||
        !date
    ) {
        return res.status(400).json({
            erro: 'Todos os campos do confronto são obrigatórios'
        });
    }

    const jogoExiste = dados.games.some(
        jogo => jogo.id === Number(gameId)
    );

    if (!jogoExiste) {
        return res.status(400).json({
            erro: 'O jogo informado não existe'
        });
    }

    const time1Existe = dados.teams.some(
        time => time.id === Number(team1Id)
    );

    const time2Existe = dados.teams.some(
        time => time.id === Number(team2Id)
    );

    if (!time1Existe || !time2Existe) {
        return res.status(400).json({
            erro: 'Um ou ambos os times não existem'
        });
    }

    const novoConfronto = {
        id: gerarId(dados.matches),
        gameId: Number(gameId),
        team1Id: Number(team1Id),
        team2Id: Number(team2Id),
        score1: Number(score1),
        score2: Number(score2),
        status,
        date
    };

    dados.matches.push(novoConfronto);

    salvarDados(dados);

    res.status(201).json(novoConfronto);
});

// PUT /api/confrontos/:id
app.put('/api/confrontos/:id', (req, res) => {
    const dados = lerDados();

    const id = Number(req.params.id);

    const indice = dados.matches.findIndex(
        confronto => confronto.id === id
    );

    if (indice === -1) {
        return res.status(404).json({
            erro: 'Confronto não encontrado'
        });
    }

    const confrontoAtualizado = {
        ...dados.matches[indice],
        ...req.body,
        id
    };

    // Converte IDs e placares para número
    if (confrontoAtualizado.gameId !== undefined) {
        confrontoAtualizado.gameId =
            Number(confrontoAtualizado.gameId);
    }

    if (confrontoAtualizado.team1Id !== undefined) {
        confrontoAtualizado.team1Id =
            Number(confrontoAtualizado.team1Id);
    }

    if (confrontoAtualizado.team2Id !== undefined) {
        confrontoAtualizado.team2Id =
            Number(confrontoAtualizado.team2Id);
    }

    if (confrontoAtualizado.score1 !== undefined) {
        confrontoAtualizado.score1 =
            Number(confrontoAtualizado.score1);
    }

    if (confrontoAtualizado.score2 !== undefined) {
        confrontoAtualizado.score2 =
            Number(confrontoAtualizado.score2);
    }

    // Verifica se o jogo existe
    const jogoExiste = dados.games.some(
        jogo => jogo.id === confrontoAtualizado.gameId
    );

    if (!jogoExiste) {
        return res.status(400).json({
            erro: 'O jogo informado não existe'
        });
    }

    // Verifica se os times existem
    const time1Existe = dados.teams.some(
        time => time.id === confrontoAtualizado.team1Id
    );

    const time2Existe = dados.teams.some(
        time => time.id === confrontoAtualizado.team2Id
    );

    if (!time1Existe || !time2Existe) {
        return res.status(400).json({
            erro: 'Um ou ambos os times não existem'
        });
    }

    dados.matches[indice] = confrontoAtualizado;

    salvarDados(dados);

    res.status(200).json(confrontoAtualizado);
});

// DELETE /api/confrontos/:id
app.delete('/api/confrontos/:id', (req, res) => {
    const dados = lerDados();

    const id = Number(req.params.id);

    const indice = dados.matches.findIndex(
        confronto => confronto.id === id
    );

    if (indice === -1) {
        return res.status(404).json({
            erro: 'Confronto não encontrado'
        });
    }

    const confrontoRemovido =
        dados.matches.splice(indice, 1)[0];

    salvarDados(dados);

    res.status(200).json({
        mensagem: 'Confronto removido com sucesso',
        confronto: confrontoRemovido
    });
});

// ==========================================
// ROTA NÃO ENCONTRADA
// ==========================================

app.use((req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada',
        mensagem: 'Verifique a URL e o método da requisição'
    });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});

