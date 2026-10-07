require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error(
        'ERRO: SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não foi configurada no .env'
    );
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Teste da configuração
console.log('Supabase URL carregada:', supabaseUrl);
console.log('Chave do Supabase carregada:', !!supabaseKey);

// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

function mapCompetidor(item) {
    return {
        id: item.id,
        name: item.name,
        nickname: item.nickname,
        teamId: item.team_id
    };
}

function mapConfronto(item) {
    return {
        id: item.id,
        gameId: item.game_id,
        team1Id: item.team1_id,
        team2Id: item.team2_id,
        score1: item.score1,
        score2: item.score2,
        status: item.status,
        date: item.date
    };
}

// =====================================================
// ROTA INICIAL
// =====================================================

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API GamerClass funcionando!',
        banco: 'Supabase'
    });
});

// =====================================================
// JOGOS - GET
// =====================================================

app.get('/api/jogos', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('games')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Erro ao buscar jogos:', error);
            return res.status(500).json({
                erro: error.message
            });
        }

        res.json(data);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao buscar jogos.'
        });
    }
});

// =====================================================
// JOGOS - GET POR ID
// =====================================================

app.get('/api/jogos/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const { data, error } = await supabase
            .from('games')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(404).json({
                erro: 'Jogo não encontrado.'
            });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({
            erro: 'Erro ao buscar jogo.'
        });
    }
});

// =====================================================
// JOGOS - POST
// =====================================================

app.post('/api/jogos', async (req, res) => {
    try {
        const { name, genre } = req.body;

        if (!name || !genre) {
            return res.status(400).json({
                erro: 'Nome e gênero são obrigatórios.'
            });
        }

        const { data, error } = await supabase
            .from('games')
            .insert([
                {
                    name,
                    genre
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar jogo:', error);

            return res.status(500).json({
                erro: error.message
            });
        }

        res.status(201).json(data);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao criar jogo.'
        });
    }
});

// =====================================================
// JOGOS - PUT
// =====================================================

app.put('/api/jogos/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, genre } = req.body;

        if (!name || !genre) {
            return res.status(400).json({
                erro: 'Nome e gênero são obrigatórios.'
            });
        }

        const { data, error } = await supabase
            .from('games')
            .update({
                name,
                genre
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Erro ao atualizar jogo:', error);

            return res.status(500).json({
                erro: error.message
            });
        }

        res.json(data);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao atualizar jogo.'
        });
    }
});

// =====================================================
// JOGOS - DELETE
// =====================================================

app.delete('/api/jogos/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const { error } = await supabase
            .from('games')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erro ao excluir jogo:', error);

            return res.status(500).json({
                erro: error.message
            });
        }

        res.json({
            mensagem: 'Jogo excluído com sucesso.'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao excluir jogo.'
        });
    }
});

// =====================================================
// TIMES - GET
// =====================================================

app.get('/api/times', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('teams')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Erro ao buscar times:', error);

            return res.status(500).json({
                erro: error.message
            });
        }

        res.json(data);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao buscar times.'
        });
    }
});

// =====================================================
// TIMES - GET POR ID
// =====================================================

app.get('/api/times/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const { data, error } = await supabase
            .from('teams')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(404).json({
                erro: 'Time não encontrado.'
            });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({
            erro: 'Erro ao buscar time.'
        });
    }
});

// =====================================================
// TIMES - POST
// =====================================================

app.post('/api/times', async (req, res) => {
    try {
        const { name, color } = req.body;

        if (!name || !color) {
            return res.status(400).json({
                erro: 'Nome e cor são obrigatórios.'
            });
        }

        const { data, error } = await supabase
            .from('teams')
            .insert([
                {
                    name,
                    color
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar time:', error);

            return res.status(500).json({
                erro: error.message
            });
        }

        res.status(201).json(data);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao criar time.'
        });
    }
});

// =====================================================
// TIMES - PUT
// =====================================================

app.put('/api/times/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, color } = req.body;

        if (!name || !color) {
            return res.status(400).json({
                erro: 'Nome e cor são obrigatórios.'
            });
        }

        const { data, error } = await supabase
            .from('teams')
            .update({
                name,
                color
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Erro ao atualizar time:', error);

            return res.status(500).json({
                erro: error.message
            });
        }

        res.json(data);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao atualizar time.'
        });
    }
});

// =====================================================
// TIMES - DELETE
// =====================================================

app.delete('/api/times/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const { error } = await supabase
            .from('teams')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erro ao excluir time:', error);

            return res.status(500).json({
                erro: error.message
            });
        }

        res.json({
            mensagem: 'Time excluído com sucesso.'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao excluir time.'
        });
    }
});

// =====================================================
// COMPETIDORES - GET
// =====================================================

app.get('/api/competidores', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('competitors')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Erro ao buscar competidores:', error);

            return res.status(500).json({
                erro: error.message
            });
        }

        res.json(data.map(mapCompetidor));
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao buscar competidores.'
        });
    }
});

// =====================================================
// COMPETIDORES - GET POR ID
// =====================================================

app.get('/api/competidores/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const { data, error } = await supabase
            .from('competitors')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(404).json({
                erro: 'Competidor não encontrado.'
            });
        }

        res.json(mapCompetidor(data));
    } catch (error) {
        res.status(500).json({
            erro: 'Erro ao buscar competidor.'
        });
    }
});

// =====================================================
// COMPETIDORES - POST
// =====================================================

app.post('/api/competidores', async (req, res) => {
    try {
        const {
            name,
            nickname,
            teamId
        } = req.body;

        if (!name || !nickname || !teamId) {
            return res.status(400).json({
                erro: 'Nome, nickname e time são obrigatórios.'
            });
        }

        const { data: team, error: teamError } = await supabase
            .from('teams')
            .select('id')
            .eq('id', Number(teamId))
            .single();

        if (teamError || !team) {
            return res.status(400).json({
                erro: 'O time informado não existe.'
            });
        }

        const { data, error } = await supabase
            .from('competitors')
            .insert([
                {
                    name,
                    nickname,
                    team_id: Number(teamId)
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar competidor:', error);

            return res.status(500).json({
                erro: error.message
            });
        }

        res.status(201).json(mapCompetidor(data));
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao criar competidor.'
        });
    }
});

// =====================================================
// COMPETIDORES - PUT
// =====================================================

app.put('/api/competidores/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const {
            name,
            nickname,
            teamId
        } = req.body;

        if (!name || !nickname || !teamId) {
            return res.status(400).json({
                erro: 'Nome, nickname e time são obrigatórios.'
            });
        }

        const { data: team, error: teamError } = await supabase
            .from('teams')
            .select('id')
            .eq('id', Number(teamId))
            .single();

        if (teamError || !team) {
            return res.status(400).json({
                erro: 'O time informado não existe.'
            });
        }

        const { data, error } = await supabase
            .from('competitors')
            .update({
                name,
                nickname,
                team_id: Number(teamId)
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Erro ao atualizar competidor:', error);

            return res.status(500).json({
                erro: error.message
            });
        }

        res.json(mapCompetidor(data));
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao atualizar competidor.'
        });
    }
});

// =====================================================
// COMPETIDORES - DELETE
// =====================================================

app.delete('/api/competidores/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const { error } = await supabase
            .from('competitors')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erro ao excluir competidor:', error);

            return res.status(500).json({
                erro: error.message
            });
        }

        res.json({
            mensagem: 'Competidor excluído com sucesso.'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao excluir competidor.'
        });
    }
});

// =====================================================
// CONFRONTOS - GET
// =====================================================

app.get('/api/confrontos', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('matches')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Erro ao buscar confrontos:', error);

            return res.status(500).json({
                erro: error.message
            });
        }

        res.json(data.map(mapConfronto));
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao buscar confrontos.'
        });
    }
});

// =====================================================
// CONFRONTOS - GET POR ID
// =====================================================

app.get('/api/confrontos/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const { data, error } = await supabase
            .from('matches')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(404).json({
                erro: 'Confronto não encontrado.'
            });
        }

        res.json(mapConfronto(data));
    } catch (error) {
        res.status(500).json({
            erro: 'Erro ao buscar confronto.'
        });
    }
});

// =====================================================
// CONFRONTOS - POST
// =====================================================

app.post('/api/confrontos', async (req, res) => {
    try {
        const {
            gameId,
            team1Id,
            team2Id,
            score1 = 0,
            score2 = 0,
            status = 'scheduled',
            date
        } = req.body;

        if (!gameId || !team1Id || !team2Id || !date) {
            return res.status(400).json({
                erro: 'Jogo, dois times e data são obrigatórios.'
            });
        }

        if (Number(team1Id) === Number(team2Id)) {
            return res.status(400).json({
                erro: 'Os dois times precisam ser diferentes.'
            });
        }

        const { data: game, error: gameError } = await supabase
            .from('games')
            .select('id')
            .eq('id', Number(gameId))
            .single();

        if (gameError || !game) {
            return res.status(400).json({
                erro: 'O jogo informado não existe.'
            });
        }

        const { data: teams, error: teamsError } = await supabase
            .from('teams')
            .select('id')
            .in('id', [Number(team1Id), Number(team2Id)]);

        if (
            teamsError ||
            !teams ||
            teams.length !== 2
        ) {
            return res.status(400).json({
                erro: 'Um ou mais times informados não existem.'
            });
        }

        const { data, error } = await supabase
            .from('matches')
            .insert([
                {
                    game_id: Number(gameId),
                    team1_id: Number(team1Id),
                    team2_id: Number(team2Id),
                    score1: Number(score1),
                    score2: Number(score2),
                    status,
                    date
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar confronto:', error);

            return res.status(500).json({
                erro: error.message
            });
        }

        res.status(201).json(mapConfronto(data));
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao criar confronto.'
        });
    }
});

// =====================================================
// CONFRONTOS - PUT
// =====================================================

app.put('/api/confrontos/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const {
            gameId,
            team1Id,
            team2Id,
            score1 = 0,
            score2 = 0,
            status = 'scheduled',
            date
        } = req.body;

        if (!gameId || !team1Id || !team2Id || !date) {
            return res.status(400).json({
                erro: 'Jogo, dois times e data são obrigatórios.'
            });
        }

        if (Number(team1Id) === Number(team2Id)) {
            return res.status(400).json({
                erro: 'Os dois times precisam ser diferentes.'
            });
        }

        const { data, error } = await supabase
            .from('matches')
            .update({
                game_id: Number(gameId),
                team1_id: Number(team1Id),
                team2_id: Number(team2Id),
                score1: Number(score1),
                score2: Number(score2),
                status,
                date
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Erro ao atualizar confronto:', error);

            return res.status(500).json({
                erro: error.message
            });
        }

        res.json(mapConfronto(data));
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao atualizar confronto.'
        });
    }
});

// =====================================================
// CONFRONTOS - DELETE
// =====================================================

app.delete('/api/confrontos/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        const { error } = await supabase
            .from('matches')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erro ao excluir confronto:', error);

            return res.status(500).json({
                erro: error.message
            });
        }

        res.json({
            mensagem: 'Confronto excluído com sucesso.'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao excluir confronto.'
        });
    }
});

// =====================================================
// ROTA NÃO ENCONTRADA
// =====================================================

app.use((req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada.'
    });
});

// =====================================================
// INICIAR SERVIDOR
// =====================================================

app.listen(PORT, () => {
    console.log(`API GamerClass rodando em http://localhost:${PORT}`);
    console.log('Banco de dados: Supabase');
});