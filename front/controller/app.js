// ==========================================
// CONTROLLER - GamerClass
// ==========================================

const state = {
    jogos: [],
    times: [],
    competidores: [],
    confrontos: []
};


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
    await carregarDados();
    configurarNavegacao();
    renderizarTudo();
});


// ==========================================
// CARREGAR DADOS DA API
// ==========================================

async function carregarDados() {
    try {
        const [jogos, times, competidores, confrontos] = await Promise.all([
            getJogos(),
            getTimes(),
            getCompetidores(),
            getConfrontos()
        ]);

        state.jogos = jogos || [];
        state.times = times || [];
        state.competidores = competidores || [];
        state.confrontos = confrontos || [];

        console.log('JOGOS:', state.jogos);
        console.log('TIMES:', state.times);
        console.log('COMPETIDORES:', state.competidores);
        console.log('CONFRONTOS:', state.confrontos);

    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Não foi possível carregar os dados.');
    }
}


// ==========================================
// NAVEGAÇÃO
// ==========================================

function configurarNavegacao() {
    const itens = document.querySelectorAll('#sidebar-nav li');

    itens.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.dataset.view;

            itens.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            document.querySelectorAll('.view').forEach(secao => {
                secao.classList.remove('active');
            });

            const secaoSelecionada = document.getElementById(`view-${view}`);

            if (secaoSelecionada) {
                secaoSelecionada.classList.add('active');
            }
        });
    });
}


// ==========================================
// RENDERIZAÇÃO GERAL
// ==========================================

function renderizarTudo() {
    renderizarDashboard();
    renderizarJogos();
    renderizarTimes();
    renderizarCompetidores();
    renderizarConfrontos();
}


// ==========================================
// DASHBOARD
// ==========================================

function renderizarDashboard() {
    const stats = document.getElementById('dashboard-stats');
    const upcoming = document.getElementById('upcoming-matches');

    if (!stats || !upcoming) return;

    stats.innerHTML = `
        <div class="stat-card">
            <i class="fas fa-trophy"></i>
            <div>
                <span>Jogos</span>
                <strong>${state.jogos.length}</strong>
            </div>
        </div>

        <div class="stat-card">
            <i class="fas fa-users"></i>
            <div>
                <span>Times</span>
                <strong>${state.times.length}</strong>
            </div>
        </div>

        <div class="stat-card">
            <i class="fas fa-user-ninja"></i>
            <div>
                <span>Competidores</span>
                <strong>${state.competidores.length}</strong>
            </div>
        </div>

        <div class="stat-card">
            <i class="fas fa-hand-fist"></i>
            <div>
                <span>Confrontos</span>
                <strong>${state.confrontos.length}</strong>
            </div>
        </div>
    `;

    const confrontosAgendados = state.confrontos.filter(
        confronto => confronto.status !== 'finished'
    );

    if (confrontosAgendados.length === 0) {
        upcoming.innerHTML = `
            <div class="empty-state">
                <p>Nenhum confronto agendado.</p>
            </div>
        `;
        return;
    }

    upcoming.innerHTML = confrontosAgendados.map(confronto => {
        const jogo = state.jogos.find(j => j.id == confronto.gameId);

        const time1 = state.times.find(t => t.id == confronto.team1Id);
        const time2 = state.times.find(t => t.id == confronto.team2Id);

        return `
            <div class="match-card">

                <div class="match-game">
                    ${jogo ? jogo.name : 'Jogo'}
                </div>

                <div class="match-teams">
                    <strong>${time1 ? time1.name : 'Time 1'}</strong>

                    <span>VS</span>

                    <strong>${time2 ? time2.name : 'Time 2'}</strong>
                </div>

                <div class="match-date">
                    ${formatarData(confronto.date)}
                </div>

            </div>
        `;
    }).join('');
}


// ==========================================
// JOGOS
// ==========================================

function renderizarJogos() {
    const container = document.getElementById('list-jogos');

    if (!container) return;

    if (state.jogos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Nenhum jogo cadastrado.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = state.jogos.map(jogo => `
        <div class="card">

            <div class="card-header">
                <h3>${escaparHTML(jogo.name)}</h3>
                <span class="badge">
                    ${escaparHTML(jogo.genre || 'Sem gênero')}
                </span>
            </div>

            <p>ID: ${jogo.id}</p>

            <div class="card-actions">
                <button
                    class="btn-secondary"
                    onclick="editarItem('jogo', ${jogo.id})">
                    <i class="fas fa-pen"></i> Editar
                </button>

                <button
                    class="btn-danger"
                    onclick="excluirItem('jogo', ${jogo.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>

        </div>
    `).join('');
}


// ==========================================
// TIMES
// ==========================================

function renderizarTimes() {
    const container = document.getElementById('list-times');

    if (!container) return;

    if (state.times.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Nenhum time cadastrado.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = state.times.map(time => {

        const quantidadeCompetidores = state.competidores.filter(
            competidor => competidor.teamId == time.id
        ).length;

        return `
            <div class="card">

                <div class="card-header">

                    <div style="
                        width: 15px;
                        height: 15px;
                        border-radius: 50%;
                        background: ${time.color || '#999'};
                        display: inline-block;
                        margin-right: 8px;
                    "></div>

                    <h3>${escaparHTML(time.name)}</h3>

                </div>

                <p>
                    ${quantidadeCompetidores}
                    competidor(es)
                </p>

                <p>
                    Cor: ${escaparHTML(time.color || 'Não definida')}
                </p>

                <div class="card-actions">

                    <button
                        class="btn-secondary"
                        onclick="editarItem('time', ${time.id})">
                        <i class="fas fa-pen"></i> Editar
                    </button>

                    <button
                        class="btn-danger"
                        onclick="excluirItem('time', ${time.id})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>

                </div>

            </div>
        `;
    }).join('');
}


// ==========================================
// COMPETIDORES
// ==========================================

function renderizarCompetidores() {
    const container = document.getElementById('list-competidores');

    if (!container) return;

    if (state.competidores.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Nenhum competidor cadastrado.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = state.competidores.map(competidor => {

        const time = state.times.find(
            t => t.id == competidor.teamId
        );

        return `
            <div class="card">

                <div class="card-header">
                    <h3>${escaparHTML(competidor.name)}</h3>
                </div>

                <p>
                    <strong>Nickname:</strong>
                    ${escaparHTML(competidor.nickname || 'Não informado')}
                </p>

                <p>
                    <strong>Time:</strong>
                    ${time
                ? escaparHTML(time.name)
                : 'Sem time'}
                </p>

                <div class="card-actions">

                    <button
                        class="btn-secondary"
                        onclick="editarItem('competidor', ${competidor.id})">
                        <i class="fas fa-pen"></i> Editar
                    </button>

                    <button
                        class="btn-danger"
                        onclick="excluirItem('competidor', ${competidor.id})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>

                </div>

            </div>
        `;
    }).join('');
}


// ==========================================
// CONFRONTOS
// ==========================================

function renderizarConfrontos() {
    const container = document.getElementById('list-confrontos');

    if (!container) return;

    if (state.confrontos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Nenhum confronto cadastrado.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = state.confrontos.map(confronto => {

        const jogo = state.jogos.find(
            j => j.id == confronto.gameId
        );

        const time1 = state.times.find(
            t => t.id == confronto.team1Id
        );

        const time2 = state.times.find(
            t => t.id == confronto.team2Id
        );

        const finalizado = confronto.status === 'finished';

        return `
            <div class="card">

                <div class="card-header">
                    <h3>
                        ${time1
                ? escaparHTML(time1.name)
                : 'Time 1'}

                        <span> VS </span>

                        ${time2
                ? escaparHTML(time2.name)
                : 'Time 2'}
                    </h3>
                </div>

                <p>
                    <strong>Jogo:</strong>
                    ${jogo
                ? escaparHTML(jogo.name)
                : 'Não informado'}
                </p>

                <p>
                    <strong>Placar:</strong>
                    ${confronto.score1 ?? 0}
                    x
                    ${confronto.score2 ?? 0}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${finalizado ? 'Finalizado' : 'Agendado'}
                </p>

                <p>
                    <strong>Data:</strong>
                    ${formatarData(confronto.date)}
                </p>

                <div class="card-actions">

                    ${!finalizado
                ? `
                            <button
                                class="btn-primary"
                                onclick="encerrarConfronto(${confronto.id})">
                                <i class="fas fa-flag-checkered"></i>
                                Encerrar
                            </button>
                        `
                : ''
            }

                    <button
                        class="btn-secondary"
                        onclick="editarItem('confronto', ${confronto.id})">
                        <i class="fas fa-pen"></i> Editar
                    </button>

                    <button
                        class="btn-danger"
                        onclick="excluirItem('confronto', ${confronto.id})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>

                </div>

            </div>
        `;
    }).join('');
}


// ==========================================
// ABRIR FORMULÁRIO
// ==========================================

window.abrirFormulario = function (tipo, id = null) {

    const modal = document.getElementById('modal-container');
    const formContent = document.getElementById('form-content');

    if (!modal || !formContent) return;

    const editando = id !== null;

    let registro = null;

    if (editando) {

        if (tipo === 'jogo') {
            registro = state.jogos.find(j => j.id == id);
        }

        if (tipo === 'time') {
            registro = state.times.find(t => t.id == id);
        }

        if (tipo === 'competidor') {
            registro = state.competidores.find(c => c.id == id);
        }

        if (tipo === 'confronto') {
            registro = state.confrontos.find(c => c.id == id);
        }
    }


    // ======================================
    // FORMULÁRIO DE JOGO
    // ======================================

    if (tipo === 'jogo') {

        formContent.innerHTML = `
            <h2>${editando ? 'Editar Jogo' : 'Novo Jogo'}</h2>

            <form onsubmit="salvarItem(event, 'jogo', ${editando ? id : 'null'})">

                <label>Nome do jogo</label>

                <input
                    type="text"
                    id="nome"
                    required
                    value="${registro ? escaparAtributo(registro.name) : ''}"
                >

                <label>Gênero</label>

                <input
                    type="text"
                    id="genre"
                    required
                    value="${registro ? escaparAtributo(registro.genre) : ''}"
                >

                <div class="form-actions">

                    <button
                        type="button"
                        class="btn-secondary"
                        onclick="fecharModal()">
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        class="btn-primary">
                        ${editando ? 'Salvar alterações' : 'Cadastrar'}
                    </button>

                </div>

            </form>
        `;
    }


    // ======================================
    // FORMULÁRIO DE TIME
    // ======================================

    if (tipo === 'time') {

        formContent.innerHTML = `
            <h2>${editando ? 'Editar Time' : 'Novo Time'}</h2>

            <form onsubmit="salvarItem(event, 'time', ${editando ? id : 'null'})">

                <label>Nome do time</label>

                <input
                    type="text"
                    id="nome"
                    required
                    value="${registro ? escaparAtributo(registro.name) : ''}"
                >

                <label>Cor</label>

                <input
                    type="color"
                    id="color"
                    value="${registro ? escaparAtributo(registro.color || '#7B1FA2') : '#7B1FA2'}"
                >

                <div class="form-actions">

                    <button
                        type="button"
                        class="btn-secondary"
                        onclick="fecharModal()">
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        class="btn-primary">
                        ${editando ? 'Salvar alterações' : 'Cadastrar'}
                    </button>

                </div>

            </form>
        `;
    }


    // ======================================
    // FORMULÁRIO DE COMPETIDOR
    // ======================================

    if (tipo === 'competidor') {

        const optionsTimes = state.times.map(time => `
            <option
                value="${time.id}"
                ${registro && registro.teamId == time.id ? 'selected' : ''}>
                ${escaparHTML(time.name)}
            </option>
        `).join('');

        formContent.innerHTML = `
            <h2>${editando ? 'Editar Competidor' : 'Novo Competidor'}</h2>

            <form onsubmit="salvarItem(event, 'competidor', ${editando ? id : 'null'})">

                <label>Nome</label>

                <input
                    type="text"
                    id="nome"
                    required
                    value="${registro ? escaparAtributo(registro.name) : ''}"
                >

                <label>Nickname</label>

                <input
                    type="text"
                    id="nickname"
                    required
                    value="${registro ? escaparAtributo(registro.nickname) : ''}"
                >

                <label>Time</label>

                <select id="teamId" required>

                    <option value="">
                        Selecione um time
                    </option>

                    ${optionsTimes}

                </select>

                <div class="form-actions">

                    <button
                        type="button"
                        class="btn-secondary"
                        onclick="fecharModal()">
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        class="btn-primary">
                        ${editando ? 'Salvar alterações' : 'Cadastrar'}
                    </button>

                </div>

            </form>
        `;
    }


    // ======================================
    // FORMULÁRIO DE CONFRONTO
    // ======================================

    if (tipo === 'confronto') {

        const optionsJogos = state.jogos.map(jogo => `
            <option
                value="${jogo.id}"
                ${registro && registro.gameId == jogo.id ? 'selected' : ''}>
                ${escaparHTML(jogo.name)}
            </option>
        `).join('');

        const optionsTimes1 = state.times.map(time => `
            <option
                value="${time.id}"
                ${registro && registro.team1Id == time.id ? 'selected' : ''}>
                ${escaparHTML(time.name)}
            </option>
        `).join('');

        const optionsTimes2 = state.times.map(time => `
            <option
                value="${time.id}"
                ${registro && registro.team2Id == time.id ? 'selected' : ''}>
                ${escaparHTML(time.name)}
            </option>
        `).join('');

        formContent.innerHTML = `
            <h2>${editando ? 'Editar Confronto' : 'Registrar Confronto'}</h2>

            <form onsubmit="salvarItem(event, 'confronto', ${editando ? id : 'null'})">

                <label>Jogo</label>

                <select id="gameId" required>

                    <option value="">
                        Selecione um jogo
                    </option>

                    ${optionsJogos}

                </select>


                <label>Time 1</label>

                <select id="team1Id" required>

                    <option value="">
                        Selecione o primeiro time
                    </option>

                    ${optionsTimes1}

                </select>


                <label>Time 2</label>

                <select id="team2Id" required>

                    <option value="">
                        Selecione o segundo time
                    </option>

                    ${optionsTimes2}

                </select>


                <label>Placar Time 1</label>

                <input
                    type="number"
                    id="score1"
                    min="0"
                    value="${registro ? registro.score1 ?? 0 : 0}"
                    required
                >


                <label>Placar Time 2</label>

                <input
                    type="number"
                    id="score2"
                    min="0"
                    value="${registro ? registro.score2 ?? 0 : 0}"
                    required
                >


                <label>Status</label>

                <select id="status">

                    <option
                        value="scheduled"
                        ${registro?.status === 'scheduled' || !registro ? 'selected' : ''}>
                        Agendado
                    </option>

                    <option
                        value="finished"
                        ${registro?.status === 'finished' ? 'selected' : ''}>
                        Finalizado
                    </option>

                </select>


                <label>Data</label>

                <input
                    type="datetime-local"
                    id="date"
                    required
                    value="${registro ? escaparAtributo(registro.date) : ''}"
                >


                <div class="form-actions">

                    <button
                        type="button"
                        class="btn-secondary"
                        onclick="fecharModal()">
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        class="btn-primary">
                        ${editando ? 'Salvar alterações' : 'Cadastrar'}
                    </button>

                </div>

            </form>
        `;
    }


    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
};


// ==========================================
// FECHAR MODAL
// ==========================================

window.fecharModal = function () {

    const modal = document.getElementById('modal-container');

    if (!modal) return;

    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
};


// ==========================================
// SALVAR ITEM
// POST OU PUT
// ==========================================

window.salvarItem = async function (event, tipo, id = null) {

    event.preventDefault();

    let dados = null;

    // ======================================
    // JOGO
    // ======================================

    if (tipo === 'jogo') {

        dados = {
            name: document.getElementById('nome').value.trim(),
            genre: document.getElementById('genre').value.trim()
        };

        if (!dados.name || !dados.genre) {
            alert('Preencha todos os campos.');
            return;
        }

        if (id === null) {
            await postJogo(dados);
        } else {
            await putJogo(id, dados);
        }
    }


    // ======================================
    // TIME
    // ======================================

    if (tipo === 'time') {

        dados = {
            name: document.getElementById('nome').value.trim(),
            color: document.getElementById('color').value
        };

        if (!dados.name) {
            alert('Digite o nome do time.');
            return;
        }

        if (id === null) {
            await postTime(dados);
        } else {
            await putTime(id, dados);
        }
    }


    // ======================================
    // COMPETIDOR
    // ======================================

    if (tipo === 'competidor') {

        dados = {
            name: document.getElementById('nome').value.trim(),
            nickname: document.getElementById('nickname').value.trim(),
            teamId: Number(document.getElementById('teamId').value)
        };

        if (!dados.name || !dados.nickname || !dados.teamId) {
            alert('Preencha todos os campos.');
            return;
        }

        if (id === null) {
            await postCompetidor(dados);
        } else {
            await putCompetidor(id, dados);
        }
    }


    // ======================================
    // CONFRONTO
    // ======================================

    if (tipo === 'confronto') {

        dados = {
            gameId: Number(document.getElementById('gameId').value),
            team1Id: Number(document.getElementById('team1Id').value),
            team2Id: Number(document.getElementById('team2Id').value),
            score1: Number(document.getElementById('score1').value),
            score2: Number(document.getElementById('score2').value),
            status: document.getElementById('status').value,
            date: document.getElementById('date').value
        };

        if (
            !dados.gameId ||
            !dados.team1Id ||
            !dados.team2Id ||
            !dados.date
        ) {
            alert('Preencha todos os campos.');
            return;
        }

        if (dados.team1Id === dados.team2Id) {
            alert('Os dois times precisam ser diferentes.');
            return;
        }

        if (id === null) {
            await postConfronto(dados);
        } else {
            await putConfronto(id, dados);
        }
    }


    // ======================================
    // RECARREGAR DADOS
    // ======================================

    await carregarDados();

    renderizarTudo();

    fecharModal();

    alert(
        id === null
            ? 'Cadastro realizado com sucesso!'
            : 'Alteração realizada com sucesso!'
    );
};


// ==========================================
// EDITAR ITEM
// ==========================================

window.editarItem = function (tipo, id) {

    abrirFormulario(tipo, id);
};


// ==========================================
// EXCLUIR ITEM
// ==========================================

window.excluirItem = async function (tipo, id) {

    const confirmar = confirm(
        'Tem certeza que deseja excluir este registro?'
    );

    if (!confirmar) return;

    let sucesso = false;


    if (tipo === 'jogo') {
        sucesso = await deleteJogo(id);
    }

    if (tipo === 'time') {
        sucesso = await deleteTime(id);
    }

    if (tipo === 'competidor') {
        sucesso = await deleteCompetidor(id);
    }

    if (tipo === 'confronto') {
        sucesso = await deleteConfronto(id);
    }


    if (!sucesso) {
        return;
    }


    await carregarDados();

    renderizarTudo();

    alert('Registro excluído com sucesso!');
};


// ==========================================
// ENCERRAR CONFRONTO
// ==========================================

window.encerrarConfronto = async function (id) {

    const confronto = state.confrontos.find(
        c => c.id == id
    );

    if (!confronto) {
        alert('Confronto não encontrado.');
        return;
    }


    const score1 = prompt(
        'Digite o placar do Time 1:',
        confronto.score1 ?? 0
    );

    if (score1 === null) return;


    const score2 = prompt(
        'Digite o placar do Time 2:',
        confronto.score2 ?? 0
    );

    if (score2 === null) return;


    const novoScore1 = Number(score1);
    const novoScore2 = Number(score2);


    if (
        Number.isNaN(novoScore1) ||
        Number.isNaN(novoScore2) ||
        novoScore1 < 0 ||
        novoScore2 < 0
    ) {
        alert('Digite placares válidos.');
        return;
    }


    const dadosAtualizados = {
        ...confronto,
        score1: novoScore1,
        score2: novoScore2,
        status: 'finished'
    };


    const resultado = await putConfronto(
        id,
        dadosAtualizados
    );


    if (!resultado) return;


    await carregarDados();

    renderizarTudo();

    alert('Confronto encerrado com sucesso!');
};


// ==========================================
// FORMATAR DATA
// ==========================================

function formatarData(data) {

    if (!data) {
        return 'Data não informada';
    }

    const dataObj = new Date(data);

    if (Number.isNaN(dataObj.getTime())) {
        return data;
    }

    return dataObj.toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
    });
}


// ==========================================
// PROTEÇÃO CONTRA HTML
// ==========================================

function escaparHTML(valor) {

    if (valor === null || valor === undefined) {
        return '';
    }

    return String(valor)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


function escaparAtributo(valor) {
    return escaparHTML(valor);
}