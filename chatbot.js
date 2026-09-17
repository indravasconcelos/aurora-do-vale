// ============================================================
// CHATBOT - INTERFACE E LOGICA
// ============================================================
// Este arquivo gerencia a interface do chat, a comunicacao
// com o backend e a qualificacao de leads.
// ============================================================

(function () {
  'use strict';

  // ----------------------------------------------------------
  // LINK DO WHATSAPP
  // ----------------------------------------------------------
  // Devolve o link completo, ou '' quando nao ha numero configurado.
  // Antes, dois pontos do codigo passavam o numero cru como href do botao:
  // o navegador tratava "5511999999999" como caminho relativo e caia em 404.
  function linkWhatsApp(texto) {
    if (!CONFIG.whatsapp_numero) return '';
    var url = 'https://wa.me/' + CONFIG.whatsapp_numero;
    return texto ? url + '?text=' + encodeURIComponent(texto) : url;
  }

  // ----------------------------------------------------------
  // CONFIGURACAO
  // ----------------------------------------------------------
  var CONFIG = {
    api_url: 'api/chat.php',
    // Vazio ate o cliente informar o numero real. Enquanto estiver vazio, o
    // chatbot nao oferece WhatsApp em vez de mandar o visitante para um link
    // que nao existe. Preencher aqui E em config/chatbot.php.
    whatsapp_numero: '',
    typing_speed: 25,
    typing_variation: 15,
    saudacao: 'Olá! Posso ajudar você com informações sobre o empreendimento. O que gostaria de saber?'
  };

  // ----------------------------------------------------------
  // ESTADO
  // ----------------------------------------------------------
  var estado = {
    aberto: false,
    digitando: false,
    historico: [],
    nao_lidas: 0,
    etapa: 'inicial',
    dados_lead: {
      nome: null,
      telefone: null,
      financiamento: null,
      tipo_imovel: null
    }
  };

  // ----------------------------------------------------------
  // INICIALIZAR
  // ----------------------------------------------------------
  function init() {
    criarInterface();
    bindEventos();

    // Enviar saudacao apos 800ms
    setTimeout(function () {
      adicionarMensagemBot(CONFIG.saudacao);
    }, 800);
  }

  // ----------------------------------------------------------
  // CRIAR INTERFACE
  // ----------------------------------------------------------
  function criarInterface() {
    var container = document.createElement('div');
    container.id = 'chatbot-container';
    container.innerHTML =
      '<button class="chatbot-toggle" aria-label="Abrir chat">' +
        '<span class="chatbot-toggle-icon">' +
          '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="white"/>' +
            '<path d="M7 9h10M7 12h6" stroke="#16a34a" stroke-width="1.8" stroke-linecap="round"/>' +
          '</svg>' +
        '</span>' +
        '<span class="chatbot-toggle-badge" id="chatbot-badge"></span>' +
      '</button>' +
      '<div class="chatbot-window" id="chatbot-window">' +
        '<div class="chatbot-header">' +
          '<div class="chatbot-header-info">' +
            '<div class="chatbot-avatar">&#128075;</div>' +
            '<div class="chatbot-header-text">' +
              '<span class="chatbot-name">Ana</span>' +
              '<span class="chatbot-status">' +
                '<span class="chatbot-status-dot"></span>' +
                'Online agora' +
              '</span>' +
            '</div>' +
          '</div>' +
          '<div class="chatbot-header-actions">' +
            '<button class="chatbot-btn-icon" id="chatbot-reset" title="Limpar conversa">&#8634;</button>' +
            '<button class="chatbot-btn-icon" id="chatbot-close" title="Fechar">&#10005;</button>' +
          '</div>' +
        '</div>' +
        '<div class="chatbot-mensagens" id="chatbot-mensagens"></div>' +
        '<div class="chatbot-input-area">' +
          '<input type="text" class="chatbot-input" id="chatbot-input" placeholder="Digite sua mensagem..." autocomplete="off" />' +
          '<button class="chatbot-enviar" id="chatbot-enviar" aria-label="Enviar">&#10148;</button>' +
        '</div>' +
        '<div class="chatbot-footer">Atendimento 24h</div>' +
      '</div>';

    document.body.appendChild(container);
  }

  // ----------------------------------------------------------
  // EVENTOS
  // ----------------------------------------------------------
  function bindEventos() {
    var toggle = document.querySelector('.chatbot-toggle');
    var close = document.getElementById('chatbot-close');
    var reset = document.getElementById('chatbot-reset');
    var enviar = document.getElementById('chatbot-enviar');
    var input = document.getElementById('chatbot-input');

    if (toggle) {
      toggle.addEventListener('click', toggleChat);
    }
    if (close) {
      close.addEventListener('click', toggleChat);
    }
    if (reset) {
      reset.addEventListener('click', resetarChat);
    }
    if (enviar) {
      enviar.addEventListener('click', enviarMensagem);
    }
    if (input) {
      input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          enviarMensagem();
        }
      });
    }
  }

  // ----------------------------------------------------------
  // ALTERNAR CHAT
  // ----------------------------------------------------------
  function toggleChat() {
    var janela = document.getElementById('chatbot-window');
    if (!janela) return;

    estado.aberto = !estado.aberto;

    if (estado.aberto) {
      janela.classList.add('aberto');
      estado.nao_lidas = 0;
      atualizarBadge();

      setTimeout(function () {
        var input = document.getElementById('chatbot-input');
        if (input) input.focus();
      }, 300);
    } else {
      janela.classList.remove('aberto');
    }
  }

  // ----------------------------------------------------------
  // VERIFICAR SE VISITANTE CONFIRMOU
  // ----------------------------------------------------------
  function verificarConfirmacao(mensagem) {
    var msg = mensagem.toLowerCase();
    var confirmacoes = [
      'sim', 's', 'ss', 'si', 'pode', 'quero', 'encaminha', 'manda',
      'isso', 'isso mesmo', 'confirmo', 'confirmado', 'blz', 'beleza',
      'ok', 'beleza', 'perfeito', 'otimo', 'show', 'top', 'bora',
      'vamos', 'pode ser', 'da sim', 'claro', 'com certeza', 'sim por favor'
    ];

    for (var i = 0; i < confirmacoes.length; i++) {
      if (msg.indexOf(confirmacoes[i]) !== -1) {
        return true;
      }
    }
    return false;
  }

  // ----------------------------------------------------------
  // NORMALIZAR MENSAGEM (interpretar linguagem natural)
  // ----------------------------------------------------------
  function normalizarMensagem(mensagem) {
    var msg = mensagem.toLowerCase().trim();

    // Abreviacoes comuns do WhatsApp
    var abreviacoes = {
      'qto': 'quanto',
      'qt': 'quanto',
      'qnt': 'quanto',
      'qnts': 'quantos',
      'vc': 'voce',
      'vce': 'voce',
      'vcs': 'voces',
      'tb': 'tambem',
      'tbm': 'tambem',
      'tmb': 'tambem',
      'msg': 'mensagem',
      'blr': 'beleza',
      'blz': 'beleza',
      'blz?': 'beleza',
      'ok': 'confirmado',
      'sim': 'sim',
      'nao': 'nao',
      'qro': 'quero',
      'qria': 'queria',
      'qria saber': 'quero saber',
      'to': 'estou',
      'ta': 'esta',
      'pra': 'para',
      'pro': 'para o',
      'da': 'da',
      'das': 'das',
      'dos': 'dos',
      'em': 'em',
      'com': 'com',
      'sem': 'sem',
      'por': 'por',
      'p': 'para',
      '2qto': '2 quartos',
      '3qto': '3 quartos',
      '2 quartos': '2 quartos',
      '3 quartos': '3 quartos',
      'zap': 'whatsapp',
      'whats': 'whatsapp',
      'wpp': 'whatsapp',
      'wp': 'whatsapp',
      'entr': 'entrada',
      'ent': 'entrada',
      'financ': 'financiamento',
      'financi': 'financiamento',
      'financia': 'financiamento',
      'financiar': 'financiamento',
      'preco': 'preco',
      'preç': 'preco',
      'valor': 'preco',
      'qto custa': 'quanto custa',
      'qto é': 'quanto e',
      'qto ta': 'quanto esta',
      'ja falei com vcs': 'ja falei com voces',
      'ja conversei': 'ja falei com voces',
      'ja fui atendido': 'ja falei com voces',
      'ja fui atendida': 'ja falei com voces',
      'to interessado': 'estou interessado',
      'to interessada': 'estou interessado',
      'tenho interesse': 'estou interessado',
      'qro comprar': 'quero comprar',
      'queria comprar': 'quero comprar',
      'gostaria de comprar': 'quero comprar',
      'vlw': 'obrigado',
      'obg': 'obrigado',
      'obgd': 'obrigado',
      'brigad': 'obrigado',
      'tchau': 'ate mais',
      'flw': 'ate mais',
      'ate mais': 'ate mais'
    };

    // Substituir abreviacoes
    for (var abrev in abreviacoes) {
      if (abreviacoes.hasOwnProperty(abrev)) {
        var regex = new RegExp('\\b' + abrev + '\\b', 'gi');
        msg = msg.replace(regex, abreviacoes[abrev]);
      }
    }

    // Remover caracteres especiais desnecessarios
    msg = msg.replace(/[?!.,;:]+/g, ' ').trim();

    // Remover espacos extras
    msg = msg.replace(/\s+/g, ' ');

    return msg;
  }

  // ----------------------------------------------------------
  // IDENTIFICAR REFERENCIA AO CONTEXTO
  // ----------------------------------------------------------
  function identificarReferenciaContexto(mensagem) {
    var msg = mensagem.toLowerCase();
    var historico = estado.historico;

    // Verificar se e uma referencia contextual
    var referenciasContextuais = [
      'essa', 'ela', 'esse', 'ele', 'isso', 'aquilo',
      'quanto fica', 'quanto custa', 'e a entrada', 'e os quartos',
      'tem mais', 'e mais', 'e o terreno', 'qual a diferenca',
      'essa mesmo', 'essa daqui', 'essa ai'
    ];

    var eReferencia = false;
    for (var i = 0; i < referenciasContextuais.length; i++) {
      if (msg.indexOf(referenciasContextuais[i]) !== -1) {
        eReferencia = true;
        break;
      }
    }

    // Se for referencia, adicionar contexto da conversa anterior
    if (eReferencia && historico.length > 0) {
      var contextoAnterior = '';
      for (var j = Math.max(0, historico.length - 3); j < historico.length; j++) {
        if (historico[j].role === 'assistant') {
          contextoAnterior += historico[j].content + ' ';
        }
      }
      return {
        referencia: true,
        contexto: contextoAnterior.trim()
      };
    }

    return {
      referencia: false,
      contexto: null
    };
  }

  // ----------------------------------------------------------
  // VERIFICAR SE VISITANTE JA FALOU COM A EQUIPE
  // ----------------------------------------------------------
  function verificarAtendimentoAnterior(mensagem) {
    var msg = mensagem.toLowerCase();
    var padroes = [
      'ja falei com',
      'ja falei com a equipe',
      'ja fui atendido',
      'ja fui atendida',
      'ja conversou com',
      'ja conversei com',
      'ja estive aqui',
      'ja visitei',
      'ja conheco',
      'ja sei',
      'ja tenho',
      'ja me disseram',
      'ja me informaram',
      'ja me ligaram',
      'ja me chamaram',
      'ja me procuraram',
      'ja me contataram',
      'ja me atenderam',
      'ja me atendeu',
      'ja me ajudaram',
      'ja me ajudou',
      'atendimento anterior',
      'contato anterior',
      'conversa anterior',
      'visita anterior',
      'atendido antes',
      'atendida antes',
      'falei antes',
      'conversei antes',
      'visitei antes',
      'ja vi',
      'ja conheco o empreendimento',
      'ja sei do empreendimento',
      'ja tenho informacoes',
      'ja tenho dados',
      'ja tenho contato',
      'ja tenho numero',
      'ja tenho whatsapp',
      'ja tenho telefone'
    ];

    for (var i = 0; i < padroes.length; i++) {
      if (msg.indexOf(padroes[i]) !== -1) {
        return true;
      }
    }
    return false;
  }

  // ----------------------------------------------------------
  // ANALISAR CONTEXTO DA CONVERSA
  // ----------------------------------------------------------
  function analisarContextoConversa() {
    var historico = estado.historico;
    var perguntas = 0;
    var interesses = 0;

    // Palavras-chave de intencao
    var palavrasIntencao = [
      'comprar', 'adquirir', 'quero', 'interesse', 'interessado', 'interessada',
      'financiar', 'financiamento', 'parcela', 'entrada', 'pagamento',
      'visita', 'visitar', 'conhecer', 'ir la', 'ver o empreendimento',
      'documentos', 'documentacao', 'como funciona', 'como compra',
      'preco', 'valor', 'quanto custa', 'quanto e',
      'quartos', 'tamanho', 'area', 'm2', 'terreno',
      'entrega', 'prazo', 'obra', 'construcao',
      'garantia', 'seguranca', 'conforto',
      'mudanca', 'sair do aluguel', 'primeira casa', 'casa propria',
      'gostei', 'legal', 'bom', 'show', 'top', 'otimo', 'excelente',
      'urgente', 'rapido', 'ja', 'preciso'
    ];

    // Analisar historico
    for (var i = 0; i < historico.length; i++) {
      var msg = historico[i].content.toLowerCase();

      // Contar perguntas
      if (msg.indexOf('?') !== -1 || msg.indexOf('como') !== -1 || msg.indexOf('quanto') !== -1) {
        perguntas++;
      }

      // Contar sinais de intencao
      for (var j = 0; j < palavrasIntencao.length; j++) {
        if (msg.indexOf(palavrasIntencao[j]) !== -1) {
          interesses++;
          break;
        }
      }
    }

    // Calcular nivel de intencao
    var nivelIntencao = 0;

    // Mais de 3 perguntas = intencao moderada
    if (perguntas >= 3) nivelIntencao += 2;

    // Mais de 5 perguntas = intencao alta
    if (perguntas >= 5) nivelIntencao += 2;

    // Mais de 3 sinais de intencao = intencao moderada
    if (interesses >= 3) nivelIntencao += 2;

    // Mais de 5 sinais de intencao = intencao alta
    if (interesses >= 5) nivelIntencao += 3;

    // Verificar se ja respondeu sobre preco ou financiamento (forte indicio)
    for (var k = 0; k < historico.length; k++) {
      var msgBot = historico[k].content.toLowerCase();
      if (msgBot.indexOf('preco') !== -1 || msgBot.indexOf('financiamento') !== -1 || msgBot.indexOf('r$') !== -1) {
        nivelIntencao += 1;
      }
    }

    return {
      perguntas: perguntas,
      interesses: interesses,
      nivel: Math.min(nivelIntencao, 10),
      // So qualificar se tiver intencao REAL e CLARA
      deveQualificar: nivelIntencao >= 5
    };
  }

  // ----------------------------------------------------------
  // ENVIAR MENSAGEM
  // ----------------------------------------------------------
  function enviarMensagem() {
    var input = document.getElementById('chatbot-input');
    var mensagem = input ? input.value.trim() : '';

    if (!mensagem || estado.digitando) return;

    input.value = '';
    adicionarMensagemUsuario(mensagem);

    // Normalizar mensagem para melhor interpretacao
    var mensagemNormalizada = normalizarMensagem(mensagem);

    // Verificar se o visitante ja falou com a equipe
    if (verificarAtendimentoAnterior(mensagem) || verificarAtendimentoAnterior(mensagemNormalizada)) {
      mostrarDigitacao();
      setTimeout(function () {
        ocultarDigitacao();
        digitarResposta(
          'Claro! Se desejar, posso te encaminhar novamente para nossa equipe de vendas.',
          linkWhatsApp()
        );
      }, 800);
      return;
    }

    // Verificar etapa de qualificacao
    if (estado.etapa === 'nome') {
      estado.dados_lead.nome = mensagem;
      mostrarDigitacao();
      setTimeout(function () {
        ocultarDigitacao();
        digitarResposta(
          'Prazer, ' + mensagem + '! Qual seu WhatsApp para contato?',
          null,
          'telefone'
        );
      }, 800);
      return;
    }

    if (estado.etapa === 'telefone') {
      estado.dados_lead.telefone = mensagem;
      mostrarDigitacao();
      setTimeout(function () {
        ocultarDigitacao();
        var resumo = 'Perfeito! Vou resumir:\n\n';
        resumo += 'Nome: ' + estado.dados_lead.nome + '\n';
        resumo += 'WhatsApp: ' + estado.dados_lead.telefone + '\n\n';
        resumo += 'Posso te encaminhar para nossa equipe de vendas?';
        digitarResposta(resumo, null, 'confirmacao');
      }, 800);
      return;
    }

    if (estado.etapa === 'confirmacao') {
      if (verificarConfirmacao(mensagem)) {
        mostrarDigitacao();
        setTimeout(function () {
          ocultarDigitacao();
          // Montar mensagem para WhatsApp
          var msgWhatsApp = 'Olá! Vim pelo site e gostaria de continuar meu atendimento.';
          msgWhatsApp += '\n\nNome: ' + estado.dados_lead.nome;
          msgWhatsApp += '\nWhatsApp: ' + estado.dados_lead.telefone;
          var url = linkWhatsApp(msgWhatsApp);
          digitarResposta(
            url
              ? 'Vou te encaminhar para nossa equipe de vendas agora!'
              : 'Obrigada! Nossa equipe de vendas vai entrar em contato com você.',
            url
          );
          estado.etapa = 'finalizado';
        }, 800);
      } else {
        mostrarDigitacao();
        setTimeout(function () {
          ocultarDigitacao();
          digitarResposta(
            'Sem problemas! Se precisar de algo mais, estou por aqui.',
            null,
            'inicial'
          );
        }, 800);
      }
      return;
    }

    mostrarDigitacao();

    // Analisar contexto da conversa para detectar intencao
    var contexto = analisarContextoConversa();

    // Se detectou intencao real e ja tem perguntas suficientes, iniciar qualificacao
    if (contexto.deveQualificar && estado.etapa === 'inicial') {
      estado.etapa = 'qualificando';
      setTimeout(function () {
        ocultarDigitacao();
        digitarResposta(
          'Vi que você tem interesse nas nossas casas! Posso te ajudar melhor. Me conta, qual seu nome?',
          null,
          'nome'
        );
      }, 1000);
      return;
    }

    // Identificar referencia contextual (essa, ela, quanto fica, etc.)
    var referenciaCtx = identificarReferenciaContexto(mensagem);

    // Se for referencia contextual, adicionar contexto ao enviar para backend
    var mensagemParaBackend = mensagemNormalizada;
    if (referenciaCtx.referencia && referenciaCtx.contexto) {
      mensagemParaBackend = '[CONTEXTO DA CONVERSA ANTERIOR: ' + referenciaCtx.contexto + ']\n\n[NOVA MENSAGEM DO USUARIO: ' + mensagemNormalizada + ']';
    }

    // Enviar para backend (mensagem normalizada para melhor interpretacao)
    fetch(CONFIG.api_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: mensagem,
        normalized: mensagemParaBackend,
        history: estado.historico
      })
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      ocultarDigitacao();

      if (data.success) {
        digitarResposta(data.response, data.whatsapp_url);
      } else {
        adicionarMensagemBot('Desculpe, tive um problema. Pode tentar novamente?');
      }
    })
    .catch(function () {
      ocultarDigitacao();
      var urlFalha = linkWhatsApp();
      adicionarMensagemBot(
        urlFalha
          ? 'No momento nosso atendimento está temporariamente indisponível. Você pode falar diretamente com nossa equipe pelo WhatsApp.'
          : 'No momento nosso atendimento está temporariamente indisponível. Tente novamente em alguns minutos.',
        urlFalha
      );
    });
  }

  // ----------------------------------------------------------
  // DIGITACAO SIMULADA
  // ----------------------------------------------------------
  function digitarResposta(texto, whatsappUrl, etapaQualificacao) {
    estado.digitando = true;

    var container = document.getElementById('chatbot-mensagens');
    if (!container) return;

    var msgEl = document.createElement('div');
    msgEl.className = 'chatbot-msg bot';
    msgEl.innerHTML =
      '<div class="chatbot-msg-avatar">&#128075;</div>' +
      '<div class="chatbot-msg-conteudo"></div>';

    container.appendChild(msgEl);

    var conteudo = msgEl.querySelector('.chatbot-msg-conteudo');
    var i = 0;

    function digitarProximo() {
      if (i < texto.length) {
        conteudo.textContent += texto[i];
        i++;
        container.scrollTop = container.scrollHeight;

        var delay = CONFIG.typing_speed +
          (Math.random() * CONFIG.typing_variation * 2 - CONFIG.typing_variation);

        setTimeout(digitarProximo, delay);
      } else {
        // Adicionar botao do WhatsApp se houver URL
        if (whatsappUrl) {
          var br = document.createElement('br');
          var btn = document.createElement('a');
          btn.href = whatsappUrl;
          btn.target = '_blank';
          btn.rel = 'noopener noreferrer';
          btn.className = 'chatbot-whatsapp-btn';
          btn.textContent = 'Continuar no WhatsApp';
          conteudo.appendChild(br);
          conteudo.appendChild(btn);
        }

        estado.digitando = false;
        estado.historico.push({ role: 'user', content: texto });

        // Se for etapa de qualificacao, salvar e aguardar proxima mensagem
        if (etapaQualificacao) {
          estado.etapa = etapaQualificacao;
        }

        if (!estado.aberto) {
          estado.nao_lidas++;
          atualizarBadge();
        }
      }
    }

    digitarProximo();
  }

  // ----------------------------------------------------------
  // MENSAGENS
  // ----------------------------------------------------------
  function adicionarMensagemBot(texto, whatsappUrl) {
    var container = document.getElementById('chatbot-mensagens');
    if (!container) return;

    var msgEl = document.createElement('div');
    msgEl.className = 'chatbot-msg bot';

    var conteudoHtml = escapeHtml(texto);

    if (whatsappUrl) {
      conteudoHtml += '<br><a href="https://wa.me/' + whatsappUrl +
        '?text=' + encodeURIComponent('Olá! Vim pelo site e gostaria de mais informações.') +
        '" target="_blank" rel="noopener noreferrer" class="chatbot-whatsapp-btn">' +
        'Continuar no WhatsApp</a>';
    }

    msgEl.innerHTML =
      '<div class="chatbot-msg-avatar">&#128075;</div>' +
      '<div class="chatbot-msg-conteudo">' + conteudoHtml + '</div>';

    container.appendChild(msgEl);
    container.scrollTop = container.scrollHeight;

    estado.historico.push({ role: 'assistant', content: texto });
  }

  function adicionarMensagemUsuario(texto) {
    var container = document.getElementById('chatbot-mensagens');
    if (!container) return;

    var msgEl = document.createElement('div');
    msgEl.className = 'chatbot-msg usuario';
    msgEl.innerHTML =
      '<div class="chatbot-msg-avatar">&#128100;</div>' +
      '<div class="chatbot-msg-conteudo">' + escapeHtml(texto) + '</div>';

    container.appendChild(msgEl);
    container.scrollTop = container.scrollHeight;

    estado.historico.push({ role: 'user', content: texto });
  }

  // ----------------------------------------------------------
  // DIGITACAO (indicador)
  // ----------------------------------------------------------
  function mostrarDigitacao() {
    var container = document.getElementById('chatbot-mensagens');
    if (!container) return;

    var el = document.createElement('div');
    el.id = 'chatbot-digitando';
    el.className = 'chatbot-msg bot';
    el.innerHTML =
      '<div class="chatbot-msg-avatar">&#128075;</div>' +
      '<div class="chatbot-msg-conteudo">' +
        '<div class="chatbot-digitando">' +
          '<span class="chatbot-digitando-ponto"></span>' +
          '<span class="chatbot-digitando-ponto"></span>' +
          '<span class="chatbot-digitando-ponto"></span>' +
        '</div>' +
      '</div>';

    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }

  function ocultarDigitacao() {
    var el = document.getElementById('chatbot-digitando');
    if (el) el.remove();
  }

  // ----------------------------------------------------------
  // BADGE
  // ----------------------------------------------------------
  function atualizarBadge() {
    var badge = document.getElementById('chatbot-badge');
    if (!badge) return;

    if (estado.nao_lidas > 0) {
      badge.textContent = estado.nao_lidas;
      badge.classList.add('visivel');
    } else {
      badge.classList.remove('visivel');
    }
  }

  // ----------------------------------------------------------
  // RESETAR
  // ----------------------------------------------------------
  function resetarChat() {
    estado.historico = [];
    estado.nao_lidas = 0;
    estado.etapa = 'inicial';
    estado.dados_lead = {
      nome: null,
      telefone: null,
      financiamento: null,
      tipo_imovel: null
    };

    var container = document.getElementById('chatbot-mensagens');
    if (container) container.innerHTML = '';

    atualizarBadge();

    setTimeout(function () {
      adicionarMensagemBot('Conversa reiniciada! Como posso te ajudar?');
    }, 300);
  }

  // ----------------------------------------------------------
  // UTILITARIOS
  // ----------------------------------------------------------
  function escapeHtml(texto) {
    var div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
  }

  // ----------------------------------------------------------
  // INICIAR QUANDO DOM PRONTO
  // ----------------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ----------------------------------------------------------
  // EXPORR FUNCAO GLOBAL PARA BOTOES
  // ----------------------------------------------------------
  window.abrirChatbot = function () {
    if (!estado.aberto) {
      toggleChat();
    }
  };

})();
