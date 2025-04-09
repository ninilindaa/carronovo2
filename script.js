// =============== CLASSES DOS VEÍCULOS ===============
// Seleciona o container dos botões de seleção e todos os cards de veículo
const seletorContainer = document.getElementById('selecao-veiculo');
const todosVeiculosCards = document.querySelectorAll('.garagem .veiculo');
const btnEsconder = document.getElementById('esconder-todos-btn');

// Função para esconder todos os cards de veículos
function esconderTodosVeiculos() {
    todosVeiculosCards.forEach(card => {
        card.classList.remove('visivel');
    });
     // Opcional: Desativar o botão "Esconder" se nada estiver visível
    btnEsconder.style.display = 'none'; // Esconde o botão de esconder
}

// Adiciona o listener ao container dos botões de seleção (Event Delegation)
if (seletorContainer) {
    seletorContainer.addEventListener('click', (event) => {
        // Encontra o botão que foi clicado (ou cujo filho foi clicado)
        const botaoClicado = event.target.closest('button[data-target-id]');

        if (botaoClicado) {
            const targetId = botaoClicado.dataset.targetId;
            const veiculoParaMostrar = document.getElementById(targetId);

            // Primeiro, esconde todos
            esconderTodosVeiculos();

            // Depois, mostra o selecionado (se encontrado)
            if (veiculoParaMostrar) {
                veiculoParaMostrar.classList.add('visivel');
                btnEsconder.style.display = 'inline-flex'; // Mostra o botão de esconder
            }
        }
    });
}

// Adiciona listener para o botão de esconder todos
if (btnEsconder) {
    btnEsconder.addEventListener('click', esconderTodosVeiculos);
}

// Garante que todos os veículos estejam escondidos inicialmente
// e o botão de esconder também
document.addEventListener('DOMContentLoaded', () => {
     esconderTodosVeiculos();
});
// Classe Base
class Veiculo {
    constructor(modelo, cor, idPrefixo, maxVelocidadeVisual = 100) {
        this.modelo = modelo;
        this.cor = cor;
        this.ligado = false;
        this.velocidade = 0;
        this.idPrefixo = idPrefixo; // Ex: "caminhao", "carro", "esportivo", "moto"
        this.maxVelocidadeVisual = maxVelocidadeVisual; // Para a barra de progresso

        // Elementos do DOM associados a este veículo (inicializados no construtor)
        this.elementos = {
            div: document.getElementById(`veiculo-${idPrefixo}`),
            modelo: document.getElementById(`${idPrefixo}-modelo`),
            cor: document.getElementById(`${idPrefixo}-cor`),
            ligado: document.getElementById(`${idPrefixo}-ligado`),
            velocidade: document.getElementById(`${idPrefixo}-velocidade`),
            velocidadeBar: document.getElementById(`${idPrefixo}-velocidade-bar`),
            ligarBtn: document.getElementById(`${idPrefixo}-ligar-btn`),
            desligarBtn: document.getElementById(`${idPrefixo}-desligar-btn`),
            acelerarBtn: document.getElementById(`${idPrefixo}-acelerar-btn`),
            frearBtn: document.getElementById(`${idPrefixo}-frear-btn`),
            // Outros elementos específicos podem ser adicionados nas subclasses
        };

         // Garante que os elementos existem antes de tentar usá-los
        if (!this.elementos.div) console.error(`Elemento não encontrado: veiculo-${idPrefixo}`);
        // Adicionar verificações similares para outros elementos se necessário

        this.atualizarUI(); // Atualiza a interface com o estado inicial
    }

    ligar() {
        if (!this.ligado) {
            this.ligado = true;
            console.log(`${this.modelo} ligado.`);
            this.atualizarUI();
        }
    }

    desligar() {
        if (this.ligado) {
            this.ligado = false;
            this.velocidade = 0; // Reseta a velocidade ao desligar
            console.log(`${this.modelo} desligado.`);
            this.atualizarUI();
        }
    }

    acelerar(incremento = 5) {
        if (this.ligado) {
            this.velocidade += incremento;
            // Limita a velocidade máxima se necessário (opcional)
            // if (this.velocidade > MAX_SPEED) this.velocidade = MAX_SPEED;
            console.log(`${this.modelo} acelerando para ${this.velocidade} km/h.`);
            this.atualizarUI();
        } else {
            console.log(`${this.modelo} está desligado, não pode acelerar.`);
        }
    }

    frear(decremento = 5) {
        if (this.velocidade > 0) {
            this.velocidade -= decremento;
            if (this.velocidade < 0) {
                this.velocidade = 0;
            }
            console.log(`${this.modelo} freando para ${this.velocidade} km/h.`);
            this.atualizarUI();
        }
    }

    // Método central para atualizar a interface do veículo
    atualizarUI() {
       if (!this.elementos.div) return; // Sai se os elementos não foram encontrados

        // Atualiza textos
        if(this.elementos.modelo) this.elementos.modelo.textContent = this.modelo;
        if(this.elementos.cor) this.elementos.cor.textContent = this.cor;
        if(this.elementos.ligado) this.elementos.ligado.textContent = this.ligado ? "Sim" : "Não";
        if(this.elementos.velocidade) this.elementos.velocidade.textContent = this.velocidade;

        // Atualiza barra de velocidade
        if (this.elementos.velocidadeBar) {
            let percent = (this.velocidade / this.maxVelocidadeVisual) * 100;
            percent = Math.max(0, Math.min(100, percent)); // Garante 0 a 100%
            this.elementos.velocidadeBar.style.width = `${percent}%`;
            // Opcional: Mostrar a velocidade na barra
            // this.elementos.velocidadeBar.textContent = percent > 10 ? `${this.velocidade}km/h` : '';
        }


        // Habilita/Desabilita botões com base no estado 'ligado'
        if (this.elementos.ligarBtn) this.elementos.ligarBtn.disabled = this.ligado;
        if (this.elementos.desligarBtn) this.elementos.desligarBtn.disabled = !this.ligado;
        if (this.elementos.acelerarBtn) this.elementos.acelerarBtn.disabled = !this.ligado;
        if (this.elementos.frearBtn) this.elementos.frearBtn.disabled = !this.ligado || this.velocidade === 0;

        // Lógica específica (ex: turbo) será sobrescrita/adicionada nas subclasses
    }

    // Adiciona os listeners aos botões (chamado após criar a instância)
    adicionarListeners() {
        if (!this.elementos.div) return; // Segurança

        this.elementos.ligarBtn?.addEventListener('click', () => this.ligar());
        this.elementos.desligarBtn?.addEventListener('click', () => this.desligar());
        this.elementos.acelerarBtn?.addEventListener('click', () => this.acelerar());
        this.elementos.frearBtn?.addEventListener('click', () => this.frear());
    }
}

// --- Subclasses ---

class Caminhao extends Veiculo {
    constructor(modelo, cor, capacidadeCarga) {
        super(modelo, cor, "caminhao", 120); // Prefixo "caminhao", vel max visual 120
        this.capacidadeCarga = capacidadeCarga;
        this.cargaAtual = 0;

        // Elementos específicos do Caminhão
        this.elementos.cargaMax = document.getElementById('caminhao-carga-max');
        this.elementos.cargaAtual = document.getElementById('caminhao-carga-atual');
        // Poderia ter um botão de carregar/descarregar aqui...

        this.atualizarUI(); // Chama de novo para incluir os elementos específicos
    }

    // Sobrescreve acelerar para ser mais lento (exemplo)
    acelerar() {
        super.acelerar(3); // Caminhão acelera mais devagar
    }

     // Sobrescreve frear para ser mais lento (exemplo)
    frear() {
        super.frear(4);
    }

    // Sobrescreve atualizarUI para incluir carga
    atualizarUI() {
        super.atualizarUI(); // Chama o método da classe pai primeiro
         if (!this.elementos.div) return;

        if (this.elementos.cargaMax) this.elementos.cargaMax.textContent = this.capacidadeCarga;
        if (this.elementos.cargaAtual) this.elementos.cargaAtual.textContent = this.cargaAtual;
    }
}

class Carro extends Veiculo {
    constructor(modelo, cor) {
        super(modelo, cor, "carro", 180); // Prefixo "carro", vel max visual 180
    }
    // Pode ter métodos específicos de carro aqui, se necessário
     acelerar() {
        super.acelerar(8);
    }
     frear() {
        super.frear(10);
    }
}

class CarroEsportivo extends Veiculo {
    constructor(modelo, cor) {
        super(modelo, cor, "esportivo", 300); // Prefixo "esportivo", vel max visual 300
        this.turboAtivado = false;

        // Elementos específicos
        this.elementos.turbo = document.getElementById('esportivo-turbo');
        this.elementos.turboBtn = document.getElementById('esportivo-turbo-btn');

         this.atualizarUI();
    }

    ativarTurbo() {
        if (this.ligado && !this.turboAtivado) {
            this.turboAtivado = true;
            console.log(`${this.modelo} TURBO ATIVADO!`);
            this.acelerar(50); // Dá um boost inicial de velocidade
            this.atualizarUI();
        } else if (this.turboAtivado) {
            this.desativarTurbo(); // Se clicar de novo, desativa
        }
    }

    desativarTurbo() {
         if (this.turboAtivado) {
            this.turboAtivado = false;
            console.log(`${this.modelo} Turbo desativado.`);
            this.atualizarUI();
        }
    }

    // Sobrescreve acelerar para ser mais rápido com turbo
    acelerar() {
        const incrementoBase = 15;
        const incrementoTurbo = this.turboAtivado ? 25 : 0; // Acelera mais se turbo estiver on
        super.acelerar(incrementoBase + incrementoTurbo);
    }

    // Sobrescreve frear para potencialmente desativar turbo
    frear() {
        super.frear(20);
        if (this.velocidade < 50 && this.turboAtivado) { // Ex: desativa turbo se frear muito
            // this.desativarTurbo(); // Descomente se quiser essa lógica
        }
         this.atualizarUI(); // Atualiza estado do botão de freio
    }

    // Sobrescreve desligar para garantir que o turbo desligue junto
    desligar() {
        this.desativarTurbo(); // Garante que o turbo está desligado
        super.desligar(); // Chama o desligar da classe pai
    }

    // Sobrescreve atualizarUI para incluir estado do turbo
    atualizarUI() {
        super.atualizarUI();
         if (!this.elementos.div) return;

        if (this.elementos.turbo) this.elementos.turbo.textContent = this.turboAtivado ? "ATIVO" : "Inativo";

        // Atualiza botão e classe CSS para turbo
        if (this.elementos.turboBtn) {
            this.elementos.turboBtn.disabled = !this.ligado; // Só pode usar turbo se ligado
            this.elementos.turboBtn.textContent = this.turboAtivado ? "Desativar Turbo" : "Ativar Turbo";
            if (this.turboAtivado) {
                this.elementos.turboBtn.classList.add('active');
                 this.elementos.div.classList.add('turbo-active'); // Para a barra de velocidade
            } else {
                this.elementos.turboBtn.classList.remove('active');
                 this.elementos.div.classList.remove('turbo-active');
            }
        }
         // Desabilita frear se velocidade é 0 (já feito no pai, mas bom garantir)
        if (this.elementos.frearBtn) this.elementos.frearBtn.disabled = !this.ligado || this.velocidade === 0;
    }

     // Sobrescreve para adicionar listener do botão turbo
     adicionarListeners() {
        super.adicionarListeners(); // Adiciona listeners básicos
        this.elementos.turboBtn?.addEventListener('click', () => this.ativarTurbo());
    }
}

class Motocicleta extends Veiculo {
    constructor(modelo, cor) {
        super(modelo, cor, "moto", 220); // Prefixo "moto", vel max visual 220
        this.boostAtivado = false; // Usei 'boost' para diferenciar

        // Elementos específicos
        this.elementos.boost = document.getElementById('moto-boost');
        this.elementos.boostBtn = document.getElementById('moto-boost-btn');

        this.atualizarUI();
    }

     ativarBoost() {
        if (this.ligado && !this.boostAtivado) {
            this.boostAtivado = true;
            console.log(`${this.modelo} BOOST ATIVADO!`);
            this.acelerar(30); // Boost inicial da moto
            this.atualizarUI();
        } else if (this.boostAtivado) {
            this.desativarBoost();
        }
    }

    desativarBoost() {
        if (this.boostAtivado) {
            this.boostAtivado = false;
            console.log(`${this.modelo} Boost desativado.`);
            this.atualizarUI();
        }
    }

    acelerar() {
        const incrementoBase = 10;
        const incrementoBoost = this.boostAtivado ? 15 : 0;
        super.acelerar(incrementoBase + incrementoBoost);
    }

    frear() {
        super.frear(12);
        // if (this.velocidade < 40 && this.boostAtivado) { this.desativarBoost(); }
         this.atualizarUI();
    }

    desligar() {
        this.desativarBoost();
        super.desligar();
    }

    atualizarUI() {
        super.atualizarUI();
         if (!this.elementos.div) return;

        if (this.elementos.boost) this.elementos.boost.textContent = this.boostAtivado ? "ATIVO" : "Inativo";

        if (this.elementos.boostBtn) {
            this.elementos.boostBtn.disabled = !this.ligado;
            this.elementos.boostBtn.textContent = this.boostAtivado ? "Desativar Boost" : "Ativar Boost";
             if (this.boostAtivado) {
                this.elementos.boostBtn.classList.add('active');
                this.elementos.div.classList.add('boost-active'); // Para barra
            } else {
                this.elementos.boostBtn.classList.remove('active');
                 this.elementos.div.classList.remove('boost-active');
            }
        }
         if (this.elementos.frearBtn) this.elementos.frearBtn.disabled = !this.ligado || this.velocidade === 0;
    }

     adicionarListeners() {
        super.adicionarListeners();
        this.elementos.boostBtn?.addEventListener('click', () => this.ativarBoost());
    }
}

// =============== INICIALIZAÇÃO ===============

// Criar as instâncias dos veículos
const caminhao = new Caminhao("Scania R450", "Azul", 20000);
const carro = new Carro("Onix", "Prata");
const esportivo = new CarroEsportivo("Ferrari 488", "Vermelha");
const moto = new Motocicleta("CB 500", "Preta");

// Adicionar os Event Listeners para cada veículo
caminhao.adicionarListeners();
carro.adicionarListeners();
esportivo.adicionarListeners();
moto.adicionarListeners();

// Atualização inicial da UI (já é feita no construtor de Veiculo, mas pode deixar aqui por clareza)
// caminhao.atualizarUI();
// carro.atualizarUI();
// esportivo.atualizarUI();
// moto.atualizarUI();

console.log("Garagem da Barbie carregada!");


document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos do DOM ---
    const navButtons = document.querySelectorAll('.nav-button');
    const contentSections = document.querySelectorAll('.content-section');
    const feedbackDiv = document.getElementById('feedback-message');

    // Elementos específicos das seções (pegue os IDs do seu HTML)
    const formAddVeiculo = document.getElementById('form-add-veiculo');
    const listaVeiculosDiv = document.getElementById('lista-veiculos');
    const selectVeiculoHistorico = document.getElementById('select-veiculo-historico');
    const historicoDetalhesDiv = document.getElementById('historico-detalhes');
    const formAgendamento = document.getElementById('form-agendamento');
    const selectVeiculoAgendar = document.getElementById('select-veiculo-agendar');
    // Adicione outros elementos que seu código precisa (inputs, selects, divs de resultado, etc.)

    // --- Funções Auxiliares ---

    /**
     * Exibe mensagens de feedback para o usuário.
     * @param {string} message - A mensagem a ser exibida.
     * @param {string} type - O tipo de mensagem ('success', 'error', 'info').
     */
    function showFeedback(message, type = 'info') {
        feedbackDiv.textContent = message;
        feedbackDiv.className = `feedback feedback-${type}`; // Define a classe CSS
        feedbackDiv.style.display = 'block'; // Mostra a div

        // Esconde a mensagem após alguns segundos (opcional)
        setTimeout(() => {
            feedbackDiv.style.display = 'none';
        }, 5000); // Esconde após 5 segundos
    }

    /**
     * Esconde todas as seções de conteúdo e mostra a seção alvo.
     * Atualiza o estado ativo dos botões de navegação.
     * @param {string} targetId - O ID da seção a ser mostrada (ex: 'secao-garagem').
     */
    function navigateTo(targetId) {
        // Esconde todas as seções
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // Remove a classe 'active' de todos os botões
        navButtons.forEach(button => {
            button.classList.remove('active');
        });

        // Mostra a seção alvo
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Adiciona a classe 'active' ao botão correspondente
        const activeButton = document.querySelector(`.nav-button[data-target="${targetId}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // Limpa a mensagem de feedback ao navegar
        feedbackDiv.style.display = 'none';

        // **AÇÃO IMPORTANTE:** Atualizar o conteúdo da seção que acabou de ser aberta
        // Por exemplo, se abriu a garagem, recarregar a lista de veículos.
        // Se abriu o histórico ou agendamento, atualizar os selects de veículos.
        switch (targetId) {
            case 'secao-garagem':
                displayGaragem(); // Chame sua função existente
                break;
            case 'secao-historico':
                populateVeiculoSelect(selectVeiculoHistorico); // Atualiza o select
                displayHistorico(); // Limpa/atualiza a área de detalhes
                break;
            case 'secao-agendamento':
                populateVeiculoSelect(selectVeiculoAgendar); // Atualiza o select
                displayAgendamentos(); // Mostra agendamentos existentes
                break;
            // Adicione casos para outras seções se necessário
        }
    }

    // --- Lógica de Navegação ---
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');
            navigateTo(target);
        });
    });

    // --- Integração das Funcionalidades Existentes ---

    // **COLE SUAS FUNÇÕES JAVASCRIPT ANTERIORES AQUI**
    // (Ex: adicionarVeiculo, removerVeiculo, salvarManutencao, carregarVeiculos, etc.)
    // **VOCÊ PRECISARÁ ADAPTÁ-LAS:**
    // 1.  Use `showFeedback()` para mostrar mensagens de sucesso e erro.
    // 2.  Certifique-se que os seletores de elementos (getElementById, querySelector)
    //     estão pegando os elementos corretos DENTRO da nova estrutura HTML.
    // 3.  Adicione blocos `try...catch` em volta das operações com LocalStorage.
    // 4.  Chame as funções de atualização de UI (como `displayGaragem`) após operações
    //     que modificam os dados (adicionar, remover, salvar).

    // Exemplo de como sua função `displayGaragem` poderia ficar (ADAPTADA):
    function displayGaragem() {
        console.log("Atualizando exibição da garagem...");
        try {
            const veiculos = JSON.parse(localStorage.getItem('veiculosGaragem')) || [];
            listaVeiculosDiv.innerHTML = ''; // Limpa a lista antes de recriar

            if (veiculos.length === 0) {
                listaVeiculosDiv.innerHTML = '<p>Nenhum veículo na garagem.</p>';
                return;
            }

            // Crie sua tabela ou lista aqui (exemplo com lista simples)
            const ul = document.createElement('ul');
            veiculos.forEach((veiculo, index) => {
                const li = document.createElement('li');
                li.textContent = `${veiculo.marca} ${veiculo.modelo} (${veiculo.placa}) - Ano: ${veiculo.ano}`;
                // Adicionar botão de remover, ver histórico, etc. se necessário
                ul.appendChild(li);
            });
            listaVeiculosDiv.appendChild(ul);

        } catch (error) {
            console.error("Erro ao carregar veículos do LocalStorage:", error);
            showFeedback("Erro ao carregar dados da garagem.", 'error');
            listaVeiculosDiv.innerHTML = '<p>Erro ao carregar veículos.</p>';
        }
    }

    // Exemplo de como sua função de adicionar veículo poderia ser ADAPTADA:
    function handleAdicionarVeiculoSubmit(event) {
        event.preventDefault(); // Impede o recarregamento da página

        // Pegar os valores dos inputs do formulário de adição
        const placaInput = document.getElementById('add-placa');
        const modeloInput = document.getElementById('add-modelo');
        // ... pegar outros inputs ...

        // Validação básica (exemplo)
        if (!placaInput.value || !modeloInput.value) {
            showFeedback("Erro: Placa e Modelo são obrigatórios!", 'error');
            return;
        }

        const novoVeiculo = {
            placa: placaInput.value.trim().toUpperCase(),
            modelo: modeloInput.value.trim(),
            marca: document.getElementById('add-marca').value.trim(),
            ano: document.getElementById('add-ano').value,
            // id: Date.now() // Uma forma simples de gerar ID único
        };

        try {
            let veiculos = JSON.parse(localStorage.getItem('veiculosGaragem')) || [];

            // Verificar duplicidade de placa (exemplo de tratamento de regra de negócio)
            if (veiculos.some(v => v.placa === novoVeiculo.placa)) {
                showFeedback(`Erro: Veículo com placa ${novoVeiculo.placa} já existe.`, 'error');
                return;
            }

            veiculos.push(novoVeiculo);
            localStorage.setItem('veiculosGaragem', JSON.stringify(veiculos));

            showFeedback('Veículo adicionado com sucesso!', 'success');
            formAddVeiculo.reset(); // Limpa o formulário
            displayGaragem(); // Atualiza a lista na seção da garagem (mesmo que não esteja visível agora)
            // Opcionalmente, navegar de volta para a garagem:
            // navigateTo('secao-garagem');

        } catch (error) {
            console.error("Erro ao salvar veículo:", error);
            showFeedback('Erro ao salvar o veículo no armazenamento local.', 'error');
        }
    }

    // Função para popular selects de veículo (reutilizável)
    function populateVeiculoSelect(selectElement) {
        try {
            const veiculos = JSON.parse(localStorage.getItem('veiculosGaragem')) || [];
            selectElement.innerHTML = '<option value="">-- Selecione --</option>'; // Limpa e adiciona padrão

            veiculos.forEach(veiculo => {
                const option = document.createElement('option');
                option.value = veiculo.placa; // Usar placa como ID/valor
                option.textContent = `${veiculo.marca} ${veiculo.modelo} (${veiculo.placa})`;
                selectElement.appendChild(option);
            });
        } catch (error) {
             console.error("Erro ao popular select de veículos:", error);
             showFeedback("Erro ao carregar lista de veículos.", 'error');
        }
    }

    // Exemplo de função para exibir histórico (ADAPTADA)
    function displayHistorico() {
         const placaSelecionada = selectVeiculoHistorico.value;
         historicoDetalhesDiv.innerHTML = ''; // Limpa detalhes

         if (!placaSelecionada) {
             historicoDetalhesDiv.innerHTML = '<p>Selecione um veículo para ver o histórico.</p>';
             return;
         }

         try {
             // **AQUI VOCÊ COLOCA SUA LÓGICA ANTERIOR PARA**
             // 1. Buscar as manutenções do LocalStorage (talvez um item 'historicoManutencoes')
             // 2. Filtrar as manutenções pela placaSelecionada
             // 3. Gerar o HTML (tabela, lista) para mostrar essas manutenções
             // 4. Inserir o HTML gerado em `historicoDetalhesDiv.innerHTML`

             // Exemplo Simples (você terá sua própria estrutura de dados)
             const historicoCompleto = JSON.parse(localStorage.getItem('historicoManutencoes')) || {};
             const manutençõesDoVeiculo = historicoCompleto[placaSelecionada] || [];

             if (manutençõesDoVeiculo.length === 0) {
                  historicoDetalhesDiv.innerHTML = `<p>Nenhum histórico de manutenção encontrado para o veículo ${placaSelecionada}.</p>`;
             } else {
                  let html = '<ul>';
                  manutençõesDoVeiculo.forEach(item => {
                      html += `<li>${item.data}: ${item.descricao} (Custo: R$ ${item.custo || 'N/A'})</li>`;
                  });
                  html += '</ul>';
                  historicoDetalhesDiv.innerHTML = html;
             }

         } catch (error) {
            console.error("Erro ao carregar histórico:", error);
            showFeedback("Erro ao carregar histórico de manutenção.", 'error');
            historicoDetalhesDiv.innerHTML = '<p>Erro ao carregar histórico.</p>';
         }
    }


    // Exemplo de função para lidar com o submit do agendamento (ADAPTADA)
    function handleAgendarSubmit(event) {
        event.preventDefault();
        // 1. Pegar valores do form de agendamento (veículo, data, descrição)
        const placa = selectVeiculoAgendar.value;
        const data = document.getElementById('agenda-data').value;
        const descricao = document.getElementById('agenda-descricao').value;

        // 2. Validar os dados
         if (!placa || !data || !descricao) {
            showFeedback("Erro: Todos os campos do agendamento são obrigatórios.", 'error');
            return;
         }

        // 3. Criar objeto do agendamento
        const novoAgendamento = {
            placa: placa,
            data: data,
            descricao: descricao,
            id: Date.now() // ID simples
        };

        // 4. Salvar no LocalStorage (use try...catch)
        try {
            let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
            agendamentos.push(novoAgendamento);
            localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

            showFeedback("Manutenção agendada com sucesso!", 'success');
            formAgendamento.reset();
            displayAgendamentos(); // Atualizar a lista de agendamentos na tela

        } catch (error) {
            console.error("Erro ao salvar agendamento:", error);
            showFeedback("Erro ao salvar o agendamento.", 'error');
        }
    }

     // Exemplo de função para exibir agendamentos pendentes (ADAPTADA)
     function displayAgendamentos() {
         const listaAgendamentosDiv = document.getElementById('lista-agendamentos'); // Certifique-se que este ID existe no HTML
         listaAgendamentosDiv.innerHTML = '<h3>Próximos Agendamentos</h3>'; // Reseta o conteúdo

         try {
             const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

             if (agendamentos.length === 0) {
                 listaAgendamentosDiv.innerHTML += '<p>Nenhum agendamento encontrado.</p>';
                 return;
             }

             // Opcional: Ordenar por data
             agendamentos.sort((a, b) => new Date(a.data) - new Date(b.data));

             let html = '<ul>';
             agendamentos.forEach(ag => {
                 // Adicionar lógica para talvez mostrar apenas futuros ou os mais próximos
                 html += `<li>${ag.data} - ${ag.placa}: ${ag.descricao}</li>`;
                 // Adicionar botões para concluir ou cancelar, se desejar
             });
             html += '</ul>';
             listaAgendamentosDiv.innerHTML += html;

         } catch (error) {
             console.error("Erro ao carregar agendamentos:", error);
             showFeedback("Erro ao carregar agendamentos.", 'error');
             listaAgendamentosDiv.innerHTML += '<p>Erro ao carregar agendamentos.</p>';
         }
     }


    // --- Event Listeners para Formulários e Ações ---
    if (formAddVeiculo) {
        formAddVeiculo.addEventListener('submit', handleAdicionarVeiculoSubmit);
        // Adapte sua função handleAdicionarVeiculoSubmit para usar showFeedback e try/catch
    }

    if (selectVeiculoHistorico) {
        selectVeiculoHistorico.addEventListener('change', displayHistorico);
        // Adapte sua função displayHistorico
    }

     if (formAgendamento) {
         formAgendamento.addEventListener('submit', handleAgendarSubmit);
         // Adapte sua função handleAgendarSubmit
     }

    // Adicione outros event listeners necessários (ex: botões de remover veículo, etc.)

    // --- Inicialização ---
    // Define a seção inicial a ser exibida ao carregar a página
    navigateTo('secao-garagem'); // Começa mostrando a garagem
    // displayGaragem(); // A função navigateTo já chama isso

}); // Fim do DOMContentLoaded