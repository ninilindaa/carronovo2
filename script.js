// Adiciona um listener que garante que o DOM está pronto antes de executar o código
document.addEventListener('DOMContentLoaded', () => {

    // =============== LÓGICA DE SELEÇÃO E EXIBIÇÃO DOS CARDS ===============
    const seletorContainer = document.getElementById('selecao-veiculo');
    const todosVeiculosCards = document.querySelectorAll('.garagem .veiculo');
    const btnEsconder = document.getElementById('esconder-todos-btn');

    // Função para esconder todos os cards de veículos
    function esconderTodosVeiculos() {
        todosVeiculosCards.forEach(card => {
            card.classList.remove('visivel');
        });
        // Esconde o botão "Esconder" se nada estiver visível
        if (btnEsconder) {
            btnEsconder.style.display = 'none';
        }
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
                    if (btnEsconder) {
                        btnEsconder.style.display = 'inline-flex'; // Mostra o botão de esconder
                    }
                }
            }
        });
    }

    // Adiciona listener para o botão de esconder todos
    if (btnEsconder) {
        btnEsconder.addEventListener('click', esconderTodosVeiculos);
    }

    // Garante que todos os veículos estejam escondidos inicialmente
    esconderTodosVeiculos();

    // =============== CLASSES DOS VEÍCULOS ===============
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
                // Limita a velocidade visual máxima da barra
                const velocidadeParaBarra = Math.min(this.velocidade, this.maxVelocidadeVisual);
                console.log(`${this.modelo} acelerando para ${this.velocidade} km/h.`);
                this.atualizarUI(velocidadeParaBarra); // Passa a velocidade limitada para a barra
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
                 // Limita a velocidade visual máxima da barra
                const velocidadeParaBarra = Math.min(this.velocidade, this.maxVelocidadeVisual);
                console.log(`${this.modelo} freando para ${this.velocidade} km/h.`);
                this.atualizarUI(velocidadeParaBarra); // Passa a velocidade limitada para a barra
            }
        }

        // Método central para atualizar a interface do veículo
        // Modificado para aceitar um valor específico para a barra
        atualizarUI(velocidadeParaBarra = this.velocidade) {
        if (!this.elementos.div) return; // Sai se os elementos não foram encontrados

            // Atualiza textos
            if(this.elementos.modelo) this.elementos.modelo.textContent = this.modelo;
            if(this.elementos.cor) this.elementos.cor.textContent = this.cor;
            if(this.elementos.ligado) this.elementos.ligado.textContent = this.ligado ? "Sim" : "Não";
            if(this.elementos.velocidade) this.elementos.velocidade.textContent = this.velocidade; // Mostra a velocidade real

            // Atualiza barra de velocidade usando velocidadeParaBarra
            if (this.elementos.velocidadeBar) {
                // Calcula o percentual baseado na velocidade visual e no máximo visual
                let percent = (Math.min(velocidadeParaBarra, this.maxVelocidadeVisual) / this.maxVelocidadeVisual) * 100;
                percent = Math.max(0, Math.min(100, percent)); // Garante 0 a 100%
                this.elementos.velocidadeBar.style.width = `${percent}%`;
            }

            // Habilita/Desabilita botões com base no estado 'ligado'
            if (this.elementos.ligarBtn) this.elementos.ligarBtn.disabled = this.ligado;
            if (this.elementos.desligarBtn) this.elementos.desligarBtn.disabled = !this.ligado;
            if (this.elementos.acelerarBtn) this.elementos.acelerarBtn.disabled = !this.ligado;
            if (this.elementos.frearBtn) this.elementos.frearBtn.disabled = !this.ligado || this.velocidade === 0;
        }

        // Adiciona os listeners aos botões (chamado após criar a instância)
        adicionarListeners() {
            if (!this.elementos.div) return; // Segurança

            this.elementos.ligarBtn?.addEventListener('click', () => this.ligar());
            this.elementos.desligarBtn?.addEventListener('click', () => this.desligar());
            this.elementos.acelerarBtn?.addEventListener('click', () => this.acelerar()); // Chama acelerar padrão
            this.elementos.frearBtn?.addEventListener('click', () => this.frear()); // Chama frear padrão
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

            this.atualizarUI(); // Chama de novo para incluir os elementos específicos
        }

        acelerar() { super.acelerar(3); } // Caminhão acelera mais devagar
        frear() { super.frear(4); }

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
        acelerar() { super.acelerar(8); }
        frear() { super.frear(10); }
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
                this.acelerar(50); // Boost inicial
                this.atualizarUI();
            } else if (this.turboAtivado) {
                this.desativarTurbo();
            }
        }

        desativarTurbo() {
             if (this.turboAtivado) {
                this.turboAtivado = false;
                console.log(`${this.modelo} Turbo desativado.`);
                this.atualizarUI();
            }
        }

        acelerar(boost = 0) { // Aceita boost opcional
            const incrementoBase = 15;
            const incrementoTurbo = this.turboAtivado ? 25 : 0;
            super.acelerar(incrementoBase + incrementoTurbo + boost);
        }

        frear() { super.frear(20); }

        desligar() {
            this.desativarTurbo();
            super.desligar();
        }

        atualizarUI() {
            super.atualizarUI(); // Chama o pai
             if (!this.elementos.div) return;

            if (this.elementos.turbo) this.elementos.turbo.textContent = this.turboAtivado ? "ATIVO" : "Inativo";

            if (this.elementos.turboBtn) {
                this.elementos.turboBtn.disabled = !this.ligado;
                this.elementos.turboBtn.textContent = this.turboAtivado ? "Desativar Turbo" : "Ativar Turbo";
                this.elementos.turboBtn.classList.toggle('active', this.turboAtivado);
            }
            // Adiciona ou remove classe no card pai para estilizar a barra no CSS
             this.elementos.div?.classList.toggle('turbo-active', this.turboAtivado);
        }

         adicionarListeners() {
            super.adicionarListeners(); // Adiciona listeners básicos
            this.elementos.turboBtn?.addEventListener('click', () => this.ativarTurbo());
        }
    }

    class Motocicleta extends Veiculo {
        constructor(modelo, cor) {
            super(modelo, cor, "moto", 220); // Prefixo "moto", vel max visual 220
            this.boostAtivado = false;

            this.elementos.boost = document.getElementById('moto-boost');
            this.elementos.boostBtn = document.getElementById('moto-boost-btn');

            this.atualizarUI();
        }

         ativarBoost() {
            if (this.ligado && !this.boostAtivado) {
                this.boostAtivado = true;
                console.log(`${this.modelo} BOOST ATIVADO!`);
                this.acelerar(30); // Boost inicial
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

        acelerar(boost = 0) { // Aceita boost opcional
            const incrementoBase = 10;
            const incrementoBoost = this.boostAtivado ? 15 : 0;
            super.acelerar(incrementoBase + incrementoBoost + boost);
        }

        frear() { super.frear(12); }

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
                this.elementos.boostBtn.classList.toggle('active', this.boostAtivado);
            }
            this.elementos.div?.classList.toggle('boost-active', this.boostAtivado);
        }

         adicionarListeners() {
            super.adicionarListeners();
            this.elementos.boostBtn?.addEventListener('click', () => this.ativarBoost());
        }
    }

    // =============== INICIALIZAÇÃO DOS VEÍCULOS ===============
    const caminhao = new Caminhao("Scania R450", "Azul", 20000);
    const carro = new Carro("Onix", "Prata");
    const esportivo = new CarroEsportivo("Ferrari 488", "Vermelha");
    const moto = new Motocicleta("CB 500", "Preta");

    // Adicionar os Event Listeners para cada veículo
    caminhao.adicionarListeners();
    carro.adicionarListeners();
    esportivo.adicionarListeners();
    moto.adicionarListeners();

    console.log("Garagem da Barbie carregada!");


    // =============== CÓDIGO DA GARAGEM INTELIGENTE UNIFICADA (Comentado/Removido) ===============
    /*
        // --- Elementos do DOM ---
        const navButtons = document.querySelectorAll('.nav-button');
        // ... (resto do código da segunda parte removido ou comentado) ...

        // --- Inicialização ---
        // Define a seção inicial a ser exibida ao carregar a página
        // navigateTo('secao-garagem'); // Não precisamos mais disso aqui
    */

}); // Fim do DOMContentLoaded