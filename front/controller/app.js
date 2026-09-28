
let state = {
    jogos: [],
    times: [],
    competidores: [],
    confrontos: [],
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
    const [jogos, times, competidores, confrontos] = await Promise.all([
        getJogos(),
        getTimes(),
        getCompetidores(),
        getConfrontos(),
    ]);

    state.jogos = jogos || [];
    state.times = times || [];
    state.competidores = competidores || [];
    state.confrontos = confrontos || [];
}


// ==========================================
// NAVEGAÇÃO
// ==========================================

function configurarNavegacao() {
    const links = document.querySelectorAll('[data-section]');

    links.forEach(link => {
        link.addEventListener('click', () => {
            const section = link.dataset.section;

            document.querySelectorAll('.section').forEach(sec => {
                sec.classList.remove('active');
            });

            const alvo = document.getElementById(section);

            if (alvo) {
                alvo.classList.add('active');
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
    const totalJogos = document.getElementById('total-jogos');
    const totalTimes = document.getElementById('total-times');
    const totalCompetidores = document.getElementById('total-competidores');
    const totalConfrontos = document.getElementById('total-confrontos');

    if (totalJogos) {
        totalJogos.textContent = state.jogos.length;
    }

    if (totalTimes) {
        totalTimes.textContent = state.times.length;
    }

    if (totalCompetidores) {
        totalCompetidores.textContent = state.competidores.length;
    }

    if (totalConfrontos) {
        totalConfrontos.textContent = state.confrontos.length;
    }
}


// ==========================================
// JOGOS
// ==========================================

function renderizarJogos() {
    const container = document.getElementById('lista-jogos');

    if (!container) return;

    if (state.jogos.length === 0) {
        container.innerHTML = '<p>Nenhum jogo cadastrado.</p>';
        return;
    }

    container.innerHTML = state.jogos.map(jogo => `
        <div class="card">
            <h3>${jogo.name}</h3>
            <p>${jogo.genre}</p>
        </div>
    `).join('');
}


// ==========================================
// TIMES
// ==========================================

function renderizarTimes() {
    const container = document.getElementById('lista-times');

    if (!container) return;

    if (state.times.length === 0) {
        container.innerHTML = '<p>Nenhum time cadastrado.</p>';
        return;
    }

    container.innerHTML = state.times.map(time => `
        <div class="card">
            <h3>${time.name}</h3>

            <div
                style="
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: ${time.color};
                    display: inline-block;
                "
            ></div>

            <p>${time.color}</p>
        </div>
    `).join('');
}


// ==========================================
// COMPETIDORES
// ==========================================

function renderizarCompetidores() {
    const container = document.getElementById('lista-competidores');

    if (!container) return;

    if (state.competidores.length === 0) {
        container.innerHTML = '<p>Nenhum competidor cadastrado.</p>';
        return;
    }

    container.innerHTML = state.competidores.map(competidor => {
        const time = state.times.find(
            t => t.id == competidor.teamId
        );

        return `
            <div class="card">
                <h3>${competidor.name}</h3>

                <p>
                    Nickname:
                    <strong>${competidor.nickname}</strong>
                </p>

                <p>
                    Time:
                    ${time ? time.name : 'Sem time'}
                </p>
            </div>
        `;
    }).join('');
}


// ==========================================
// CONFRONTOS
// ==========================================

function renderizarConfrontos() {
    const container = document.getElementById('lista-confrontos');

    if (!container) return;

    if (state.confrontos.length === 0) {
        container.innerHTML = '<p>Nenhum confronto cadastrado.</p>';
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

        return `
            <div class="card">
                <h3>
                    ${time1 ? time1.name : 'Time 1'}
                    ${confronto.score1}
                    x
                    ${confronto.score2}
                    ${time2 ? time2.name : 'Time 2'}
                </h3>

                <p>
                    Jogo:
                    ${jogo ? jogo.name : 'Não informado'}
                </p>

                <p>
                    Data:
                    ${confronto.date || 'Não informada'}
                </p>

                <p>
                    Status:
                    <strong>${confronto.status}</strong>
                </p>

                ${
                    confronto.status === 'scheduled'
                        ? `
                            <button
                                onclick="encerrarConfrontos(${confronto.id})"
                            >
                                Finalizar
                            </button>
                        `
                        : ''
                }
            </div>
        `;
    }).join('');
}


// ==========================================
// MODAL
// ==========================================

window.abrirFormulario = function(tipo) {
    const modal = document.getElementById('modal');

    if (!modal) return;

    const conteudo = modal.querySelector('.modal-content');

    let titulo = '';
    let formulario = '';

    if (tipo === 'jogo') {
        titulo = 'Cadastrar Jogo';

        formulario = `
            <h2>${titulo}</h2>

            <form onsubmit="salvarItem(event, 'jogos')">

                <label>Nome</label>
                <input
                    type="text"
                    name="name"
                    required
                >

                <label>Gênero</label>
                <input
                    type="text"
                    name="genre"
                    required
                >

                <button type="submit">
                    Salvar
                </button>

                <button
                    type="button"
                    onclick="fecharModal()"
                >
                    Cancelar
                </button>

            </form>
        `;
    }

    if (tipo === 'time') {
        titulo = 'Cadastrar Time';

        formulario = `
            <h2>${titulo}</h2>

            <form onsubmit="salvarItem(event, 'times')">

                <label>Nome</label>
                <input
                    type="text"
                    name="name"
                    required
                >

                <label>Cor</label>
                <input
                    type="color"
                    name="color"
                    value="#7B1FA2"
                    required
                >

                <button type="submit">
                    Salvar
                </button>

                <button
                    type="button"
                    onclick="fecharModal()"
                >
                    Cancelar
                </button>

            </form>
        `;
    }

    if (tipo === 'competidor') {
        titulo = 'Cadastrar Competidor';

        formulario = `
            <h2>${titulo}</h2>

            <form onsubmit="salvarItem(event, 'competidores')">

                <label>Nome</label>
                <input
                    type="text"
                    name="name"
                    required
                >

                <label>Nickname</label>
                <input
                    type="text"
                    name="nickname"
                    required
                >

                <label>Time</label>

                <select name="teamId" required>

                    <option value="">
                        Selecione um time
                    </option>

                    ${state.times.map(time => `
                        <option value="${time.id}">
                            ${time.name}
                        </option>
                    `).join('')}

                </select>

                <button type="submit">
                    Salvar
                </button>

                <button
                    type="button"
                    onclick="fecharModal()"
                >
                    Cancelar
                </button>

            </form>
        `;
    }

    if (tipo === 'confronto') {
        titulo = 'Cadastrar Confronto';

        formulario = `
            <h2>${titulo}</h2>

            <form onsubmit="salvarItem(event, 'confrontos')">

                <label>Jogo</label>

                <select name="gameId" required>

                    <option value="">
                        Selecione um jogo
                    </option>

                    ${state.jogos.map(jogo => `
                        <option value="${jogo.id}">
                            ${jogo.name}
                        </option>
                    `).join('')}

                </select>


                <label>Time 1</label>

                <select name="team1Id" required>

                    <option value="">
                        Selecione o primeiro time
                    </option>

                    ${state.times.map(time => `
                        <option value="${time.id}">
                            ${time.name}
                        </option>
                    `).join('')}

                </select>


                <label>Time 2</label>

                <select name="team2Id" required>

                    <option value="">
                        Selecione o segundo time
                    </option>

                    ${state.times.map(time => `
                        <option value="${time.id}">
                            ${time.name}
                        </option>
                    `).join('')}

                </select>


                <label>Data</label>

                <input
                    type="datetime-local"
                    name="date"
                    required
                >


                <input
                    type="hidden"
                    name="score1"
                    value="0"
                >

                <input
                    type="hidden"
                    name="score2"
                    value="0"
                >

                <input
                    type="hidden"
                    name="status"
                    value="scheduled"
                >


                <button type="submit">
                    Salvar
                </button>

                <button
                    type="button"
                    onclick="fecharModal()"
                >
                    Cancelar
                </button>

            </form>
        `;
    }

    conteudo.innerHTML = formulario;

    modal.style.display = 'flex';
};


// ==========================================
// FECHAR MODAL
// ==========================================

window.fecharModal = function() {
    const modal = document.getElementById('modal');

    if (modal) {
        modal.style.display = 'none';
    }
};


// ==========================================
// SALVAR ITEM - POST
// ==========================================
window.salvarItem = async function (event, colecao) {
    event.preventDefault();

    const dados = Object.fromEntries(
        new FormData(event.target).entries()
    );

    // Converte os IDs para número
    if (dados.teamId) {
        dados.teamId = Number(dados.teamId);
    }

    if (dados.gameId) {
        dados.gameId = Number(dados.gameId);
    }

    if (dados.team1Id) {
        dados.team1Id = Number(dados.team1Id);
    }

    if (dados.team2Id) {
        dados.team2Id = Number(dados.team2Id);
    }

    if (dados.score1 !== undefined) {
        dados.score1 = Number(dados.score1);
    }

    if (dados.score2 !== undefined) {
        dados.score2 = Number(dados.score2);
    }

    let resultado = null;

    // POST para a API
    if (colecao === 'jogos') {
        resultado = await postJogo(dados);
    }

    if (colecao === 'times') {
        resultado = await postTime(dados);
    }

    if (colecao === 'competidores') {
        resultado = await postCompetidor(dados);
    }

    if (colecao === 'confrontos') {
        resultado = await postConfronto(dados);
    }

    // Se deu erro na API
    if (!resultado) {
        return;
    }

    // Fecha o modal
    fecharModal();

    // Busca novamente os dados do JSON
    await carregarDados();

    // Atualiza a tela
    renderizarTudo();

    alert('Cadastro realizado com sucesso!');
};
    // ===============================
    // JOGO
    // ===============================

    if (colecao === 'jogos') {
        resultado = await postJogo(dados);
    }


    // ===============================
    // TIME
    // ===============================

    if (colecao === 'times') {
        resultado = await postTime(dados);
    }


    // ===============================
    // COMPETIDOR
    // ===============================

    if (colecao === 'competidores') {
        resultado = await postCompetidor(dados);
    }


    // ===============================
    // CONFRONTO
    // ===============================

    if (colecao === 'confrontos') {
        resultado = await postConfronto(dados);
    }


    // Se a API retornou erro
    if (!resultado) {
        return;
    }


    // Fecha o modal
    fecharModal();


    // Recarrega os dados do JSON através da API
    await carregarDados();


    // Atualiza a tela
    renderizarTudo();


    alert('Cadastro realizado com sucesso!');



// ==========================================
// FINALIZAR CONFRONTO - PUT
// ==========================================

window.encerrarConfrontos = async function (id) {
    const confronto = state.confrontos.find(
        c => c.id == id
    );

    if (!confronto) return;

    const time1 = state.times.find(
        t => t.id == confronto.team1Id
    );

    const time2 = state.times.find(
        t => t.id == confronto.team2Id
    );

    const placar1 = prompt(
        `Placar para ${time1?.name}:`,
        '0'
    );

    if (placar1 === null) return;

    const placar2 = prompt(
        `Placar para ${time2?.name}:`,
        '0'
    );

    if (placar2 === null) return;

    const dadosAtualizados = {
        ...confronto,
        score1: Number(placar1),
        score2: Number(placar2),
        status: 'finished'
    };

    // PUT para a API
    const resultado = await putConfronto(
        id,
        dadosAtualizados
    );

    if (!resultado) return;

    // Busca novamente o data.json através da API
    await carregarDados();

    // Atualiza a tela
    renderizarTudo();

    alert('Confronto finalizado com sucesso!');
};
// ==========================================
// DELETE - JOGOS
// ==========================================

window.excluirJogo = async function(id) {
    const confirmar = confirm(
        'Deseja realmente excluir este jogo?'
    );

    if (!confirmar) return;

    const resultado = await deleteJogo(id);

    if (!resultado) return;

    await carregarDados();
    renderizarTudo();

    alert('Jogo excluído com sucesso!');
};


// ==========================================
// DELETE - TIMES
// ==========================================

window.excluirTime = async function(id) {
    const confirmar = confirm(
        'Deseja realmente excluir este time?'
    );

    if (!confirmar) return;

    const resultado = await deleteTime(id);

    if (!resultado) return;

    await carregarDados();
    renderizarTudo();

    alert('Time excluído com sucesso!');
};


// ==========================================
// DELETE - COMPETIDORES
// ==========================================

window.excluirCompetidor = async function(id) {
    const confirmar = confirm(
        'Deseja realmente excluir este competidor?'
    );

    if (!confirmar) return;

    const resultado = await deleteCompetidor(id);

    if (!resultado) return;

    await carregarDados();
    renderizarTudo();

    alert('Competidor excluído com sucesso!');
};


// ==========================================
// DELETE - CONFRONTOS
// ==========================================

window.excluirConfronto = async function(id) {
    const confirmar = confirm(
        'Deseja realmente excluir este confronto?'
    );

    if (!confirmar) return;

    const resultado = await deleteConfronto(id);

    if (!resultado) return;

    await carregarDados();
    renderizarTudo();

    alert('Confronto excluído com sucesso!');
};

