/* ============================================================
   CLÍNICA VETERINÁRIA DR. GUSTAVO CALDAS — script.js
   ------------------------------------------------------------
   Índice:
   01. Configurações e utilitários
   02. Cabeçalho: sombra ao rolar + botão voltar ao topo
   03. Menu mobile
   04. Link ativo na navegação (scroll)
   05. Animações de revelação (IntersectionObserver)
   06. Contadores animados (estatísticas)
   07. Modal de serviços
   08. Quiz interativo
   09. Formulário → WhatsApp
   10. Rodapé: ano atual + cards da equipe (toque)
   ============================================================ */

'use strict';

/* ============ 01. CONFIGURAÇÕES E UTILITÁRIOS ============ */

// Número da clínica no WhatsApp (formato internacional, sem símbolos).
// >>> Troque aqui quando o número real for definido. <<<
const WHATSAPP = '5584999935303';

// Monta um link do WhatsApp com mensagem pré-preenchida
function linkWhatsapp(mensagem) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
}

// Atalhos de seleção
const $  = (seletor, escopo = document) => escopo.querySelector(seletor);
const $$ = (seletor, escopo = document) => Array.from(escopo.querySelectorAll(seletor));

/* ============ 02. CABEÇALHO: SOMBRA AO ROLAR + VOLTAR AO TOPO ============ */

const cabecalho = $('#cabecalho');
const botaoTopo = $('#voltar-topo');

function aoRolar() {
  const rolou = window.scrollY > 10;
  cabecalho.classList.toggle('rolou', rolou);

  // Botão "voltar ao topo" aparece depois de 600px
  if (botaoTopo) {
    botaoTopo.hidden = window.scrollY < 600;
  }
}
window.addEventListener('scroll', aoRolar, { passive: true });
aoRolar(); // estado inicial

botaoTopo?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============ 03. MENU MOBILE ============ */

const botaoMenu = $('#botao-menu');
const navegacao = $('#navegacao');

function alternarMenu(forcarFechado = false) {
  const abrir = forcarFechado ? false : !navegacao.classList.contains('aberto');
  navegacao.classList.toggle('aberto', abrir);
  botaoMenu.setAttribute('aria-expanded', String(abrir));
  botaoMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
}

botaoMenu?.addEventListener('click', () => alternarMenu());

// Fecha o menu ao tocar em um link (navegação por âncora)
$$('.navegacao a').forEach((link) => link.addEventListener('click', () => alternarMenu(true)));

// Fecha com a tecla Esc
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') alternarMenu(true);
});

// Ao redimensionar para desktop, o painel se fecha sozinho
window.addEventListener('resize', () => {
  if (window.innerWidth >= 900) alternarMenu(true);
});

/* ============ 04. LINK ATIVO NA NAVEGAÇÃO (SCROLL) ============ */

// Observa as seções e marca o link correspondente no menu
const secoes = $$('main section[id]');
const linksMenu = $$('.link-menu');

const observadorSecao = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      const id = `#${entrada.target.id}`;
      linksMenu.forEach((link) => {
        link.classList.toggle('ativo', link.getAttribute('href') === id);
      });
    });
  },
  { rootMargin: '-40% 0px -55% 0px' } // considera o "meio" da tela
);

secoes.forEach((secao) => observadorSecao.observe(secao));

/* ============ 05. ANIMAÇÕES DE REVELAÇÃO ============ */

// Garante a classe .js (também é adicionada no <head> para evitar piscada)
document.documentElement.classList.add('js');

const observadorReveal = new IntersectionObserver(
  (entradas, observador) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
        observador.unobserve(entrada.target); // anima apenas uma vez
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

$$('.reveal').forEach((elemento) => observadorReveal.observe(elemento));

/* ============ 06. CONTADORES ANIMADOS (ESTATÍSTICAS) ============ */

// Anima um número de 0 até o alvo com formatação pt-BR (ex.: 5.000)
function animarContador(elemento) {
  const alvo = parseInt(elemento.dataset.alvo, 10) || 0;
  const duracao = 1600; // ms
  const inicio = performance.now();

  function passo(agora) {
    const progresso = Math.min((agora - inicio) / duracao, 1);
    const suavizado = 1 - Math.pow(1 - progresso, 3); // easeOutCubic
    elemento.textContent = Math.round(alvo * suavizado).toLocaleString('pt-BR');
    if (progresso < 1) requestAnimationFrame(passo);
  }
  requestAnimationFrame(passo);
}

const blocoEstatisticas = $('#estatisticas');
if (blocoEstatisticas) {
  const observadorContadores = new IntersectionObserver(
    (entradas, observador) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          $$('.contador', blocoEstatisticas).forEach(animarContador);
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  observadorContadores.observe(blocoEstatisticas);
}

/* ============ 07. MODAL DE SERVIÇOS ============ */

// Conteúdo detalhado de cada serviço (editável sem mexer no HTML)
const DADOS_SERVICOS = {
  consultas: {
    titulo: 'Consultas',
    icone: 'icon-estetoscopio',
    descricao:
      'Atendimento de clínica geral com anamnese completa, exame físico cuidadoso e um plano de saúde individual para o seu pet — sem pressa e com linguagem simples.',
    itens: [
      'Consulta clínica completa (cães, gatos e exóticos)',
      'Check-up de rotina e acompanhamento de idosos',
      'Segunda opinião sobre diagnósticos e tratamentos',
      'Orientação sobre comportamento e prevenção',
    ],
    cta: 'Olá! Gostaria de agendar uma consulta para o meu pet.',
  },
  vacinacao: {
    titulo: 'Vacinação',
    icone: 'icon-vacina',
    descricao:
      'Programa de vacinação completo, com vacinas de procedência comprovada, aplicação segura e carteirinha digital — e ainda enviamos lembretes quando chegar a data do reforço.',
    itens: [
      'V8 e V10 para filhotes e adultos',
      'Antirrábica (exigida por lei)',
      'Quadrivalente e quíntupla felina',
      'Lembretes automáticos de reforço no WhatsApp',
    ],
    cta: 'Olá! Quero atualizar a carteirinha de vacinas do meu pet.',
  },
  exames: {
    titulo: 'Exames',
    icone: 'icon-exame',
    descricao:
      'Laboratório próprio e parceiros de imagem para um diagnóstico rápido e preciso. Muitos resultados ficam prontos no mesmo dia, para tranquilizar você o quanto antes.',
    itens: [
      'Hemograma e bioquímica sanguínea',
      'Exames de fezes e urina',
      'Ultrassom e radiografia digital',
      'Testes rápidos (leishmaniose, carrapato, felv/fiv)',
    ],
    cta: 'Olá! Meu pet precisa fazer exames. Podemos agendar?',
  },
  cirurgias: {
    titulo: 'Cirurgias',
    icone: 'icon-cirurgia',
    descricao:
      'Centro cirúrgico equipado com monitoramento completo, anestesia segura e equipe dedicada. Você recebe atualizações do procedimento e orientações claras de pós-operatório.',
    itens: [
      'Castração de cães e gatos (com condições especiais)',
      'Cirurgias de tecidos moles e tumores',
      'Limpeza de tártaro e extrações, quando necessárias',
      'Pós-operatório com acompanhamento próximo',
    ],
    cta: 'Olá! Gostaria de informações sobre um procedimento cirúrgico.',
  },
  'limpeza-tartaro': {
    titulo: 'Limpeza de Tártaro',
    icone: 'icon-dente',
    descricao:
      'O tártaro provoca mau hálito, gengivite e perda de dentes. Fazemos a remoção completa com ultrassom, com o paciente monitorado, e orientamos a prevenção em casa.',
    itens: [
      'Avaliação da saúde bucal antes do procedimento',
      'Remoção do tártaro com ultrassom',
      'Polimento dos dentes',
      'Orientação de higiene bucal para o dia a dia',
    ],
    cta: 'Olá! Gostaria de agendar uma limpeza de tártaro para o meu pet.',
  },
  emergencia: {
    titulo: 'Emergência 24h',
    icone: 'icon-raio',
    descricao:
      'Plantão 24 horas, todos os dias do ano. Em situações críticas, cada minuto conta — chame no WhatsApp e receba orientação imediata enquanto vem até a clínica.',
    itens: [
      'Atendimento urgente 24h, inclusive feriados',
      'Orientação de primeiros socorros por WhatsApp',
      'Estabilização, oxigenioterapia e monitoramento',
      'Internamento com acompanhamento contínuo',
    ],
    cta: 'OLÁ! É UMA EMERGÊNCIA! Meu pet precisa de atendimento urgente.',
  },
};

const modal = $('#modal-servico');
const modalTitulo = $('#modal-titulo');
const modalDescricao = $('#modal-descricao');
const modalItens = $('#modal-itens');
const modalCta = $('#modal-cta');
const modalIconeUse = $('#modal-icone-use');
let ultimoFoco = null; // para devolver o foco ao fechar

function abrirModal(chave) {
  const dados = DADOS_SERVICOS[chave];
  if (!dados) return;

  modalTitulo.textContent = dados.titulo;
  modalDescricao.textContent = dados.descricao;
  modalIconeUse.setAttribute('href', `#${dados.icone}`);
  modalCta.setAttribute('href', linkWhatsapp(dados.cta));

  // Monta a lista de destaques com ícone de check
  modalItens.innerHTML = dados.itens
    .map((item) => `<li><svg aria-hidden="true"><use href="#icon-check"/></svg>${item}</li>`)
    .join('');

  ultimoFoco = document.activeElement;
  modal.hidden = false;
  // Pequeno atraso para o navegador pintar antes de animar
  requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('aberto')));
  document.body.style.overflow = 'hidden'; // trava o scroll de fundo
  $('.modal-fechar', modal).focus();
}

function fecharModal() {
  modal.classList.remove('aberto');
  document.body.style.overflow = '';
  // Aguarda a transição terminar antes de esconder
  setTimeout(() => {
    modal.hidden = true;
    ultimoFoco?.focus();
  }, 350);
}

// Botões "Saiba mais" de cada card
$$('[data-abrir-modal]').forEach((botao) => {
  botao.addEventListener('click', () => abrirModal(botao.dataset.abrirModal));
});

// Fechar: botão X, clique no fundo escuro ou tecla Esc
$$('[data-fechar-modal]').forEach((elemento) => elemento.addEventListener('click', fecharModal));
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && !modal.hidden) fecharModal();
});

/* ============ 08. QUIZ INTERATIVO ============ */

// Perguntas com pontuação por opção (0 a 2 pontos)
const QUIZ_PERGUNTAS = [
  {
    pergunta: 'Com que frequência seu pet vai ao veterinário?',
    opcoes: [
      { texto: 'Só quando ele fica doente', pontos: 0 },
      { texto: 'Uma vez por ano', pontos: 1 },
      { texto: 'A cada 6 meses, em check-ups de rotina', pontos: 2 },
    ],
  },
  {
    pergunta: 'As vacinas do seu pet estão em dia?',
    opcoes: [
      { texto: 'Não tenho certeza', pontos: 0 },
      { texto: 'Algumas estão atrasadas', pontos: 1 },
      { texto: 'Sim, todas em dia!', pontos: 2 },
    ],
  },
  {
    pergunta: 'Como é a alimentação do seu pet?',
    opcoes: [
      { texto: 'Restos de comida caseira', pontos: 0 },
      { texto: 'Mistura de ração com comida caseira', pontos: 1 },
      { texto: 'Ração de qualidade, na medida certa', pontos: 2 },
    ],
  },
  {
    pergunta: 'E a higiene bucal (escovação de dentes)?',
    opcoes: [
      { texto: 'Nunca escovo', pontos: 0 },
      { texto: 'Escovo de vez em quando', pontos: 1 },
      { texto: 'É uma rotina regular', pontos: 2 },
    ],
  },
  {
    pergunta: 'Como estão o peso e os exercícios dele?',
    opcoes: [
      { texto: 'Sedentário ou acima do peso', pontos: 0 },
      { texto: 'Ativo, mas sem rotina fixa', pontos: 1 },
      { texto: 'Peso ideal e bem ativo', pontos: 2 },
    ],
  },
];

// Níveis de resultado por faixa de pontos (máximo = 10)
function nivelResultado(pontos) {
  if (pontos <= 3) {
    return {
      emoji: '🐶',
      titulo: 'Seu pet precisa de atenção especial',
      texto:
        'Algumas rotinas importantes de saúde ainda estão em falta — mas está tudo bem, estamos aqui para ajudar! Agende uma consulta completa e montaremos juntos um plano de cuidado sob medida.',
      cta: 'Olá! Fiz o quiz de cuidados da clínica e meu resultado foi "precisa de atenção especial". Quero agendar uma consulta completa para o meu pet.',
    };
  }
  if (pontos <= 6) {
    return {
      emoji: '🐱',
      titulo: 'No caminho certo!',
      texto:
        'Seu pet já recebe bons cuidados, mas há espaço para evoluir. Um check-up semestral ajuda a prevenir problemas antes que eles apareçam — e a gente te guia nessa jornada.',
      cta: 'Olá! Fiz o quiz de cuidados da clínica e meu resultado foi "no caminho certo". Quero agendar um check-up para o meu pet.',
    };
  }
  return {
    emoji: '🏆',
    titulo: 'Cuidado exemplar!',
    texto:
      'Parabéns, tutor(a) nota mil! Seu pet é muito bem cuidado. Mantenha o ritmo com consultas de rotina e conte com a nossa equipe para tudo o que ele precisar.',
    cta: 'Olá! Fiz o quiz de cuidados da clínica e meu resultado foi "cuidado exemplar". Quero manter a rotina de consultas em dia!',
  };
}

const quizIntro = $('#quiz-intro');
const quizPerguntas = $('#quiz-perguntas');
const quizResultado = $('#quiz-resultado');
const quizTitulo = $('#quiz-pergunta-titulo');
const quizOpcoes = $('#quiz-opcoes');
const quizBarra = $('#quiz-barra-preenchimento');
const quizContador = $('#quiz-contador');

let quizIndice = 0;
let quizPontos = 0;

function mostrarTela(tela) {
  [quizIntro, quizPerguntas, quizResultado].forEach((elemento) => (elemento.hidden = elemento !== tela));
}

function renderPergunta() {
  const atual = QUIZ_PERGUNTAS[quizIndice];
  const total = QUIZ_PERGUNTAS.length;

  quizContador.textContent = `${quizIndice + 1} de ${total}`;
  quizBarra.style.width = `${(quizIndice / total) * 100}%`;
  quizTitulo.textContent = atual.pergunta;

  quizOpcoes.innerHTML = atual.opcoes
    .map(
      (opcao, i) => `
      <button type="button" class="quiz-opcao" data-pontos="${opcao.pontos}">
        <span class="quiz-opcao-marca">${String.fromCharCode(65 + i)}</span>${opcao.texto}
      </button>`
    )
    .join('');

  // Registra a resposta e avança com um pequeno feedback visual
  $$('.quiz-opcao', quizOpcoes).forEach((botao) => {
    botao.addEventListener('click', () => {
      $$('.quiz-opcao', quizOpcoes).forEach((b) => (b.disabled = true));
      botao.classList.add('selecionada');
      quizPontos += parseInt(botao.dataset.pontos, 10);

      setTimeout(() => {
        quizIndice++;
        if (quizIndice < QUIZ_PERGUNTAS.length) {
          renderPergunta();
        } else {
          quizBarra.style.width = '100%';
          mostrarResultado();
        }
      }, 320);
    });
  });
}

function mostrarResultado() {
  const nivel = nivelResultado(quizPontos);

  $('#quiz-resultado-emoji').textContent = nivel.emoji;
  $('#quiz-resultado-titulo').textContent = nivel.titulo;
  $('#quiz-resultado-texto').textContent = nivel.texto;
  $('#quiz-resultado-pontos').textContent = `Você fez ${quizPontos} de ${QUIZ_PERGUNTAS.length * 2} pontos`;
  $('#quiz-cta').setAttribute('href', linkWhatsapp(nivel.cta));

  mostrarTela(quizResultado);
}

$('#quiz-btn-iniciar')?.addEventListener('click', () => {
  quizIndice = 0;
  quizPontos = 0;
  renderPergunta();
  mostrarTela(quizPerguntas);
});

$('#quiz-btn-reiniciar')?.addEventListener('click', () => {
  quizIndice = 0;
  quizPontos = 0;
  mostrarTela(quizIntro);
});

/* ============ 09. FORMULÁRIO → WHATSAPP ============ */

const formulario = $('#form-contato');

formulario?.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const campoNome = $('#campo-nome');
  const campoPet = $('#campo-pet');
  const campoEspecie = $('#campo-especie');
  const campoServico = $('#campo-servico');
  const campoMensagem = $('#campo-mensagem');
  const mensagemErro = $('#form-erro');

  // Validação simples: marca em vermelho os campos vazios obrigatórios
  let valido = true;
  [campoNome, campoPet, campoServico].forEach((campo) => {
    const vazio = !campo.value.trim();
    campo.closest('.campo').classList.toggle('campo-erro', vazio);
    if (vazio) valido = false;
  });

  if (!valido) {
    mensagemErro.hidden = false;
    campoNome.focus();
    return;
  }
  mensagemErro.hidden = true;

  // Monta a mensagem com os dados preenchidos
  const partes = [
    `Olá! Me chamo ${campoNome.value.trim()}.`,
    `Gostaria de agendar: *${campoServico.value}*`,
    `para o(a) pet *${campoPet.value.trim()}* (${campoEspecie.value}).`,
  ];
  const recado = campoMensagem.value.trim();
  if (recado) partes.push(`Obs.: ${recado}`);

  window.open(linkWhatsapp(partes.join(' ')), '_blank', 'noopener');

  // Feedback rápido no botão
  const botaoEnviar = $('button[type="submit"]', formulario);
  const textoOriginal = botaoEnviar.innerHTML;
  botaoEnviar.innerHTML = '✓ Abrindo o WhatsApp…';
  botaoEnviar.disabled = true;
  setTimeout(() => {
    botaoEnviar.innerHTML = textoOriginal;
    botaoEnviar.disabled = false;
  }, 2500);
});

// Limpa o estado de erro assim que o usuário digita
$$('#form-contato input, #form-contato select').forEach((campo) => {
  campo.addEventListener('input', () => campo.closest('.campo')?.classList.remove('campo-erro'));
});

/* ============ 10. RODAPÉ: ANO ATUAL + CARDS DA EQUIPE (TOQUE) ============ */

const anoAtual = $('#ano-atual');
if (anoAtual) anoAtual.textContent = new Date().getFullYear();

// Em telas de toque (sem hover), um toque no card da equipe mostra a bio
$$('.cartao-equipe').forEach((cartao) => {
  cartao.addEventListener('click', (evento) => {
    // Não intercepta cliques em links (ex.: Instagram no overlay)
    if (evento.target.closest('a')) return;
    $$('.cartao-equipe.ativo').forEach((outro) => {
      if (outro !== cartao) outro.classList.remove('ativo');
    });
    cartao.classList.toggle('ativo');
  });
});
