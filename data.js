/**
 * data.js — fonte única de verdade da FAQ do Portal.
 *
 * Cada assunto (topic) descreve:
 *  - id:        identificador único (usado no filtro e no modal)
 *  - section:   rótulo do grupo (só no primeiro assunto do grupo)
 *  - tab:       nome curto exibido na navegação do simulador
 *  - question:  pergunta que abre o card
 *  - summary:   descrição curta do card
 *  - keywords:  termos extras para a busca
 *  - status:    'ready' (com tutorial) | 'pending' (aguardando print)
 *  - steps:     [{ title, text, screen }]  — screen = HTML da tela recriada
 *
 * Telas recriadas em HTML/CSS a partir das capturas reais do Portal,
 * focando apenas no trecho relevante de cada assunto.
 */

/* ---- blocos de tela reaproveitados ---- */
const SCREEN_LOGIN = `
  <div class="mini-portal">
    <div class="mp-logo">redeFlex</div>
    <div class="mp-tagline">Com você, onde você estiver</div>
    <div class="mp-card">
      <h4>Entrar no Portal</h4>
      <p class="sub">Entre utilizando seu e-mail e senha.</p>
      <div class="mp-field">
        <div class="row-label"><label>Email</label></div>
        <input class="mp-input" placeholder="seunome@seuemail.com.br" disabled>
      </div>
      <div class="mp-field">
        <div class="row-label"><label>Senha</label><a class="fp-link">Esqueci minha senha</a></div>
        <input class="mp-input" type="password" value="••••••" disabled>
      </div>
      <div class="mp-check"><span class="box">✓</span> Lembrar-me</div>
      <button class="mp-btn">Entrar</button>
    </div>
  </div>`;

const SCREEN_RECOVER = `
  <div class="mini-portal">
    <div class="mp-logo">redeFlex</div>
    <div class="mp-tagline">Com você, onde você estiver</div>
    <div class="mp-card">
      <h4>Esqueceu sua senha? <span class="material-symbols-outlined">lock</span></h4>
      <p class="sub">Coloque seu e-mail e CNPJ ou CPF.</p>
      <div class="mp-field">
        <div class="row-label"><label>Email</label></div>
        <input class="mp-input" placeholder="seunome@seuemail.com.br" disabled>
      </div>
      <div class="mp-field">
        <div class="row-label"><label>CNPJ ou CPF</label></div>
        <input class="mp-input" placeholder="CNPJ ou CPF" disabled>
      </div>
      <button class="mp-btn">Enviar link para e-mail</button>
      <a class="mp-back">‹ Voltar para Login</a>
    </div>
  </div>`;

const SCREEN_AGENDA = `
  <div class="mini-portal">
    <div class="mp-card mp-agenda">
      <h4>Agenda da Semana</h4>
      <p class="sub">Estes são os valores a receber durante a semana</p>
      <div class="mp-agenda-row"><div class="date">20/07/2026<span>Segunda-feira</span></div><div class="val">R$ 382,75</div></div>
      <div class="mp-agenda-row"><div class="date">21/07/2026<span>Terça-feira</span></div><div class="val">R$ 21,54</div></div>
      <div class="mp-agenda-row"><div class="date">22/07/2026<span>Quarta-feira</span></div><div class="val">R$ 945,72</div></div>
      <div class="mp-agenda-row"><div class="date">23/07/2026<span>Quinta-feira</span></div><div class="val">R$ 93,60</div></div>
      <div class="mp-agenda-row"><div class="date">24/07/2026<span>Sexta-feira</span></div><div class="val">R$ 620,81</div></div>
    </div>
  </div>`;

const SCREEN_ANTECIP_NAV = `
  <div class="mini-portal">
    <div class="mp-sidebar-mini">
      <div class="sm-item"><span class="material-symbols-outlined">point_of_sale</span> Vendas</div>
      <div class="sm-item"><span class="material-symbols-outlined">calendar_month</span> Pagamentos</div>
      <div class="sm-group-label">Antecipação</div>
      <div class="sm-item active"><span class="material-symbols-outlined">check_box</span> Eventual</div>
      <div class="sm-item"><span class="material-symbols-outlined">sync_alt</span> Automática</div>
      <div class="sm-item"><span class="material-symbols-outlined">receipt_long</span> Solicitações</div>
    </div>
  </div>`;

const ANTECIP_HEADER = `
  <div class="mp-header-full">
    <button class="mp-btn" style="width:auto;">Simular Venda</button>
    <div class="mp-user-info"><b>MARIA SILVA SANTOS</b><span>512034</span></div>
  </div>`;

const SCREEN_ANTECIP_EVENTUAL = `
  <div class="mini-portal wide">
    ${ANTECIP_HEADER}
    <div class="mp-crumb">Início <span>›</span> Antecipação <span>›</span> <span class="cur">Eventual</span></div>
    <div class="mp-two-col">
      <div class="mp-panel">
        <h4>Antecipar Agora</h4>
        <div class="mp-inline-input">
          <input class="mp-input" value="100,00" disabled>
          <button class="mp-btn">Simular</button>
        </div>
        <div class="mp-field"><div class="row-label"><label>Valor da antecipação</label></div>
          <div class="mp-info-box">R$ 8.420,15</div></div>
        <div class="mp-field"><div class="row-label"><label>Taxa de antecipação eventual</label></div>
          <div class="mp-info-box">1,90% a.m</div></div>
        <div class="mp-field"><div class="row-label"><label>Reserva</label></div>
          <div class="mp-info-box">R$ 0,00</div></div>
        <div class="mp-field"><div class="row-label"><label>Valor a ser depositado</label></div>
          <div class="mp-info-box empty">—</div></div>
        <div class="mp-products">
          <div class="mp-product"><div class="brand">Mastercard</div><div class="name">Crédito</div><span class="mp-product-toggle"><span class="dot">✓</span>Ativo</span></div>
          <div class="mp-product"><div class="brand">Visa</div><div class="name">Crédito</div><span class="mp-product-toggle"><span class="dot">✓</span>Ativo</span></div>
          <div class="mp-product"><div class="brand">Elo</div><div class="name">Crédito</div><span class="mp-product-toggle"><span class="dot">✓</span>Ativo</span></div>
        </div>
        <p class="mp-fine">Antecipações solicitadas até às 14:00 horas de Brasília (BSB) em dias úteis serão recebidas no mesmo dia. Após esse horário, o valor disponível para antecipar será recalculado para o próximo dia útil.</p>
        <button class="mp-btn">Antecipar Agora</button>
      </div>
      <div class="mp-panel">
        <h4>Agendar Antecipação</h4>
        <div class="mp-inline-input">
          <input class="mp-input" placeholder="0,00" disabled style="flex:1;">
        </div>
        <div class="mp-field"><div class="row-label"><label>Escolha uma data</label></div>
          <div class="mp-info-box empty">DD-MM-AAAA</div></div>
        <p class="mp-fine warn">A agenda poderá sofrer efeitos de contratos pré-agendados, reduzindo o valor da antecipação.</p>
        <button class="mp-btn">Agendar</button>
      </div>
    </div>
  </div>`;

const SCREEN_ANTECIP_AUTO = `
  <div class="mini-portal wide">
    ${ANTECIP_HEADER}
    <div class="mp-crumb">Início <span>›</span> Antecipação <span>›</span> <span class="cur">Automática</span></div>
    <div class="mp-two-col">
      <div class="mp-panel">
        <h4>Antecipação Automática</h4>
        <div class="mp-radio-card">
          <span class="rd"></span>
          <div><b>Diária</b><span>As vendas de crédito são recebidas antecipadamente no dia útil seguinte ao da venda.</span></div>
        </div>
        <button class="mp-btn">Ativar Antecipação</button>
      </div>
      <div class="mp-panel">
        <h4>Informações</h4>
        <div class="mp-stat-row status"><b>Inativo</b><span>Status</span></div>
        <div class="mp-stat-row"><b>1,90% a.m</b><span>Taxa de antecipação eventual</span></div>
        <div class="mp-stat-row"><b>2,99% a.m</b><span>Taxa de antecipação automática</span></div>
      </div>
    </div>
  </div>`;

const SCREEN_ANTECIP_SOLIC = `
  <div class="mini-portal wide">
    ${ANTECIP_HEADER}
    <div class="mp-crumb">Início <span>›</span> Antecipação <span>›</span> <span class="cur">Solicitações</span></div>
    <div class="mp-panel">
      <h4>Filtrar Período</h4>
      <div class="mp-filter-row">
        <input class="mp-input" value="01-07-2026 até 31-07-2026" disabled>
        <button class="mp-btn">Buscar</button>
      </div>
      <h4 style="margin-top:6px;">Operações</h4>
      <div class="mp-table-wrap"><table class="mp-table">
        <thead><tr><th>Protocolo</th><th>Adiantamento</th><th>Pagamento</th><th>Vlr. Bruto</th><th>Vlr. Líquido</th><th>Taxa</th></tr></thead>
        <tbody><tr><td colspan="6" style="text-align:center; color:var(--muted); font-weight:400;">Nenhum registro encontrado</td></tr></tbody>
      </table></div>
    </div>
  </div>`;

const SCREEN_PAG_NAV = `
  <div class="mini-portal">
    <div class="mp-sidebar-mini">
      <div class="sm-item"><span class="material-symbols-outlined">point_of_sale</span> Vendas</div>
      <div class="sm-group-label">Pagamentos</div>
      <div class="sm-item active"><span class="material-symbols-outlined">calendar_month</span> Calendário</div>
      <div class="sm-item">🕘 Por Período</div>
      <div class="sm-group-label">&nbsp;</div>
      <div class="sm-item"><span class="material-symbols-outlined">bolt</span> Antecipação</div>
    </div>
  </div>`;

const CAL_GRID = `
  <div class="cal-scroll"><div class="cal-grid">
    <div class="cal-head">seg.</div><div class="cal-head">ter.</div><div class="cal-head">qua.</div><div class="cal-head">qui.</div><div class="cal-head">sex.</div>
    <div class="cal-cell"><span class="cal-day">3</span></div>
    <div class="cal-cell"><span class="cal-day">4</span><span class="cal-value">R$ 194,36</span></div>
    <div class="cal-cell __D5__"><span class="cal-day">5</span><span class="cal-value">R$ 2,11</span></div>
    <div class="cal-cell"><span class="cal-day">6</span><span class="cal-value">R$ 85,71</span></div>
    <div class="cal-cell"><span class="cal-day">7</span><span class="cal-value">R$ 396,61</span></div>
    <div class="cal-cell"><span class="cal-day">10</span><span class="cal-value">R$ 657,85</span></div>
    <div class="cal-cell"><span class="cal-day">11</span><span class="cal-value">R$ 19,10</span></div>
    <div class="cal-cell"><span class="cal-day">12</span><span class="cal-value">R$ 606,95</span></div>
    <div class="cal-cell"><span class="cal-day">13</span><span class="cal-value">R$ 55,21</span></div>
    <div class="cal-cell"><span class="cal-day">14</span><span class="cal-value">R$ 200,76</span></div>
    <div class="cal-cell"><span class="cal-day">17</span><span class="cal-value">R$ 97,24</span></div>
    <div class="cal-cell today"><span class="cal-day">18</span><span class="cal-value">R$ 78,70</span></div>
    <div class="cal-cell"><span class="cal-day">19</span></div>
    <div class="cal-cell"><span class="cal-day">20</span></div>
    <div class="cal-cell"><span class="cal-day">21</span></div>
  </div></div>`;

const SCREEN_PAG_CAL = `
  <div class="mini-portal xwide">
    <div class="mp-cal-layout">
      <div class="mp-card mp-calendar">
        <h4>Calendário</h4>
        <div class="cal-legend">
          <span><i class="dot dot-green"></i>Efetivado</span>
          <span><i class="dot dot-orange"></i>A Receber</span>
          <span><i class="dot dot-red"></i>Rejeitado</span>
        </div>
        <div class="cal-nav">
          <span class="cal-month">agosto de 2026</span>
          <div class="cal-nav-btns"><button class="cal-today">Hoje</button><button class="cal-arrow">‹</button><button class="cal-arrow">›</button></div>
        </div>
        ${CAL_GRID.replace('__D5__', '')}
      </div>
      <div class="mp-card mp-agrupado">
        <h4>Pagamento Agrupado</h4>
        <div class="agr-row"><span>Consolidado por Arranjo</span><span class="chev">⌄</span></div>
        <div class="agr-empty">Nenhum registro encontrado</div>
        <div class="agr-row"><span>Adiantamento de Recebíveis</span><span class="chev">⌄</span></div>
        <div class="agr-empty">Nenhum registro encontrado</div>
        <div class="agr-row"><span>Efeito de Contrato</span><span class="chev">⌄</span></div>
        <div class="agr-empty">Nenhum registro encontrado</div>
        <div class="agr-row"><span>Aluguel</span><span class="chev">⌄</span></div>
        <div class="agr-empty">Nenhum registro encontrado</div>
        <div class="agr-row"><span>Cobrança Ajuste</span><span class="chev">⌄</span></div>
        <div class="agr-empty">Nenhum registro encontrado</div>
      </div>
    </div>
  </div>`;

const SCREEN_PAG_DETAIL = `
  <div class="mini-portal xwide">
    <div class="mp-cal-layout">
      <div class="mp-card mp-calendar">
        <h4>Calendário</h4>
        <div class="cal-legend">
          <span><i class="dot dot-green"></i>Efetivado</span>
          <span><i class="dot dot-orange"></i>A Receber</span>
          <span><i class="dot dot-red"></i>Rejeitado</span>
        </div>
        <div class="cal-nav">
          <span class="cal-month">agosto de 2026</span>
          <div class="cal-nav-btns"><button class="cal-today">Hoje</button><button class="cal-arrow">‹</button><button class="cal-arrow">›</button></div>
        </div>
        ${CAL_GRID.replace('__D5__', 'selected')}
      </div>
      <div class="mp-card mp-agrupado">
        <div class="agr-head"><h4>Pagamento Agrupado</h4><span class="agr-date">05/08/2026</span></div>
        <div class="agr-row expanded"><span>Consolidado por Arranjo</span><span class="agr-total-mini">R$ 2,11 ⌄</span></div>
        <div class="agr-detail">
          <div class="agr-line-group">Débito</div>
          <div class="agr-line"><span class="flag"><span class="chip chip-mc">MC</span>Maestro</span><span>R$ 2,11</span></div>
        </div>
        <div class="agr-total-row"><span>Total</span><span>R$ 2,11</span></div>
      </div>
    </div>
  </div>`;

const SCREEN_PERFIL_NAV = `
  <div class="mini-portal wide">
    <div class="mp-topbar">
      <div class="mp-user-info"><b>EMPRESA EXEMPLO COMERCIO...</b><span>482910</span></div>
      <div class="mp-avatar">V</div>
    </div>
    <div class="mp-dropdown">
      <div class="mp-drop-item active"><span class="ic"><span class="material-symbols-outlined">person</span></span> Meu Perfil</div>
      <div class="mp-drop-item"><span class="ic"><span class="material-symbols-outlined">account_balance_wallet</span></span> Meu Plano</div>
      <div class="mp-drop-item"><span class="ic"><span class="material-symbols-outlined">logout</span></span> Sair</div>
    </div>
  </div>`;

const SCREEN_INFO_GERAL = `
  <div class="mini-portal xwide">
    <div class="mp-account">
      <div class="acc-head">
        <h4>Minha Conta</h4>
        <div class="acc-crumb">Início <span>›</span> Cadastro</div>
      </div>
      <div class="acc-layout">
        <div class="acc-nav">
          <div class="acc-nav-item active"><span class="ic"><span class="material-symbols-outlined">person</span></span> Geral</div>
          <div class="acc-nav-item"><span class="ic"><span class="material-symbols-outlined">call</span></span> Contatos</div>
          <div class="acc-nav-item"><span class="ic"><span class="material-symbols-outlined">location_on</span></span> Endereços</div>
          <div class="acc-nav-item"><span class="ic"><span class="material-symbols-outlined">credit_card</span></span> Dados Bancários</div>
          <div class="acc-nav-item"><span class="ic"><span class="material-symbols-outlined">lock</span></span> Alterar Senha</div>
        </div>
        <div class="mp-card acc-card">
          <h4>Informações</h4>
          <p class="sub">Informações gerais sobre a sua conta.</p>
          <div class="acc-row"><span class="acc-label">Código RedeFlex:</span><span class="acc-val">482910</span></div>
          <div class="acc-row"><span class="acc-label">CPF/CNPJ:</span><span class="acc-val">00.000.000/0001-00</span></div>
          <div class="acc-row"><span class="acc-label">Razão Social:</span><span class="acc-val">EMPRESA EXEMPLO COMERCIO DE MATERIAIS LTDA</span></div>
          <div class="acc-row"><span class="acc-label">Nome Fantasia:</span><span class="acc-val">EMPRESA EXEMPLO</span></div>
          <div class="acc-row"><span class="acc-label">Ramo de Atividade:</span><span class="acc-val">4789-0/99 - Comércio varejista de outros produtos não especificados anteriormente</span></div>
          <div class="acc-row"><span class="acc-label">Código de Afiliação:</span><span class="acc-val">482910</span></div>
        </div>
      </div>
    </div>
  </div>`;

/* ---- catálogo de assuntos ---- */
/* ---- dúvidas rápidas: maquininha (DX8000) e mensageria FIS ----
   conteúdo extraído do documento oficial "FAQ - Adquirência" —
   sem telas para recriar, então ficam em formato de resposta direta. */
const QUICK_FAQ = [
  {
    icon: 'sim_card',
    cat: 'pos',
    q: 'Minha maquininha mostra "NO SERVICE" e pede um PIN. O que é isso?',
    a: 'Esse aviso aparece quando o chip que está dentro do aparelho não é compatível com o seu modelo de maquininha. Não se preocupe — não é um defeito, é só uma troca simples de chip. Entre em contato com o suporte para agendar a substituição, sem custo.'
  },
  {
    icon: 'sync_problem',
    cat: 'pos',
    q: 'A tela fica travada em "processando" e a venda não termina. O que eu faço?',
    a: 'Geralmente acontece quando uma venda anterior não foi concluída direito. Desligue e ligue a maquininha novamente e tente a venda de novo. Se continuar travando, tente trocar a forma de conexão (do Wi-Fi para o chip, ou o contrário) nas configurações.'
  },
  {
    icon: 'qr_code_2',
    cat: 'pos',
    q: 'Por que o QR Code do Pix não aparece na hora de cobrar?',
    a: 'O valor da venda está abaixo do mínimo permitido para pagamentos por Pix (alguns centavos). Basta refazer a cobrança com um valor um pouco maior que esse mínimo.'
  },
  {
    icon: 'style',
    cat: 'pos',
    q: 'Apareceu "mais de um cartão detectado". O que significa?',
    a: 'Isso acontece quando dois cartões (ou um cartão e um celular com carteira digital) ficam perto do leitor ao mesmo tempo. Afaste os outros cartões e aproxime só o que vai ser usado na compra — ou insira o cartão no chip em vez de aproximar.'
  },
  {
    icon: 'credit_card_off',
    cat: 'suporte',
    q: 'A tela mostrou "Cartão Inválido". O cartão do cliente tem algum problema?',
    a: 'Na maioria das vezes não é um problema com o cartão do cliente — é um ajuste técnico pendente no cadastro do seu terminal. Entre em contato com o suporte informando esse erro; a correção é feita remotamente e não deve demorar.'
  },
  {
    icon: 'lock_reset',
    cat: 'suporte',
    q: 'O que significa "Chave de Criptografia Ausente"?',
    a: 'É um alerta de segurança interno da maquininha, e enquanto ele aparecer nenhuma venda será aprovada. Nesse caso a solução é trocar o aparelho — fale com o suporte para receber um novo o quanto antes.'
  },
  {
    icon: 'contactless',
    cat: 'pos',
    q: 'A aproximação (contactless) não funcionou. O que eu tento fazer?',
    a: 'Encoste o cartão ou celular devagar e deixe-o paradinho sobre o leitor por um instante. Se ainda assim não funcionar, a alternativa mais rápida é inserir o cartão no chip.'
  },
  {
    icon: 'wifi',
    cat: 'pos',
    q: 'A maquininha está sem conexão ou instável (Wi-Fi ou chip). O que eu tento fazer?',
    a: 'Primeiro verifique se o Wi-Fi do local está funcionando normalmente. Se estiver instável, alterne a conexão da maquininha de Wi-Fi para chip (ou o contrário) nas configurações, e tente reiniciar o aparelho. Isso resolve a maior parte das quedas de conexão.'
  },
  {
    icon: 'point_of_sale',
    cat: 'pos',
    q: 'Como realizo uma venda de débito ou crédito na maquininha?',
    a: 'É só seguir o caminho no menu:',
    steps: ['MENU', 'Pagamentos', 'Escolha a modalidade da venda (débito ou crédito)', 'Insira o valor', 'Confirmar']
  },
  {
    icon: 'qr_code_2',
    cat: 'pos',
    q: 'Como realizo uma venda via Pix na maquininha?',
    a: 'É só seguir o caminho no menu:',
    steps: ['MENU', 'Pix', 'Insira o valor', 'Confirmar']
  },
  {
    icon: 'receipt_long',
    cat: 'pos',
    q: 'Como reimprimo a segunda via de um comprovante?',
    a: 'O caminho muda um pouco dependendo se a venda foi no débito/crédito ou via Pix:',
    steps: [
      'Débito/Crédito: MENU → Reimpressão → escolha a via do cliente ou do estabelecimento',
      'Pix: MENU → Pix → Reimpressão → Confirmar'
    ]
  },
  {
    icon: 'undo',
    cat: 'pos',
    q: 'Como faço um estorno de uma venda na maquininha?',
    a: 'O estorno é feito direto no terminal, seguindo este caminho:',
    steps: [
      'MENU',
      'Estorno',
      'Informe a senha de segurança: 123456',
      'Aproxime ou insira o cartão no qual a venda foi realizada',
      'Selecione o valor da transação',
      'Confirmar'
    ],
    obs: 'Isso só funciona no mesmo dia da venda. Depois disso, o estorno não fica mais disponível na maquininha — é preciso entrar em contato com a Central de Atendimento (0800 647 0002) para avaliar as possibilidades de cancelamento.'
  },
  {
    icon: 'info',
    cat: 'pos',
    q: 'Como vejo as informações do equipamento (onde ele está alocado)?',
    a: 'É só seguir o caminho no menu:',
    steps: ['MENU', 'Configurar', 'Informações']
  },
  {
    icon: 'wifi',
    cat: 'pos',
    q: 'Como configuro uma rede Wi-Fi na maquininha?',
    a: 'É só seguir o caminho no menu:',
    steps: ['MENU', 'Configurar', 'Configurar Conexão', 'Escolha a rede Wi-Fi desejada', 'Insira a senha da rede', 'Confirmar']
  },
  {
    icon: 'network_check',
    cat: 'pos',
    q: 'Como faço um teste de conexão na maquininha?',
    a: 'É só seguir o caminho no menu:',
    steps: ['MENU', 'Configurar', 'Teste de Conexão', 'Imprimir']
  },
  {
    icon: 'restart_alt',
    cat: 'pos',
    q: 'Como inicializo ou atualizo as tabelas do equipamento?',
    a: 'É só seguir o caminho no menu — mas atenção: para essa operação não existe uma senha fixa, é preciso ligar para a Central de Atendimento (0800 647 0002) e pedir a senha na hora.',
    steps: ['MENU', 'Configurar', 'Informe a senha fornecida pela Central de Atendimento', 'Confirmar']
  },
  {
    icon: 'account_balance_wallet',
    cat: 'mensageria',
    code: '51',
    q: 'Venda recusada por "saldo insuficiente"',
    causa: 'Não havia saldo disponível na conta do cliente para cobrir o valor da compra naquele momento.',
    acao: 'Oriente o cliente a verificar o saldo disponível ou usar outro cartão.'
  },
  {
    icon: 'event_busy',
    cat: 'mensageria',
    code: '54',
    q: 'Venda recusada por cartão vencido',
    causa: 'O cartão utilizado está expirado, fora da validade.',
    acao: 'Peça para o cliente usar outro cartão, ou contatar o banco emissor para regularizar a situação.'
  },
  {
    icon: 'password',
    cat: 'mensageria',
    code: '55',
    q: 'Venda recusada por "senha incorreta"',
    causa: 'A senha foi digitada errada no momento da transação.',
    acao: 'Não é preciso fazer nada além de tentar de novo — peça para o cliente repetir a operação com atenção.'
  },
  {
    icon: 'credit_card',
    cat: 'pos',
    q: 'O cartão não foi lido, ou apareceu erro na leitura. Preciso chamar o suporte?',
    a: 'Não precisa. Tente passar o cartão de novo — às vezes ele só não foi inserido corretamente no chip. Se continuar dando erro, peça outro cartão ao cliente.'
  },
  {
    icon: 'payments',
    cat: 'pos',
    q: 'Tentei um Pix de valor bem baixo e foi recusado. Por quê?',
    a: 'Existe um valor mínimo para transações via Pix (pouco mais de R$ 0,10). Basta refazer a cobrança com um valor um pouco maior que isso.'
  },
  {
    icon: 'cleaning_services',
    cat: 'pos',
    q: 'A maquininha ficou travada na tela de credenciamento. Dá pra resolver sozinho?',
    a: 'Dá sim — é só limpar o cache do aplicativo:',
    steps: [
      'Abaixe a barra de notificações da máquina',
      'Acesse Configurações',
      'Insira a senha: 350000',
      'Selecione Apps e Notificações',
      'Toque no ícone Redeflex',
      'Acesse Armazenamento e Cache',
      'Toque em Limpar Cache e, em seguida, em Limpar Armazenamento'
    ]
  },
  {
    icon: 'download',
    cat: 'app',
    q: 'Como eu baixo o aplicativo AppFlex no meu celular?',
    a: 'O AppFlex está disponível para Android e iOS. Basta abrir a loja de aplicativos do seu celular, pesquisar por "Redeflex" e instalar — é gratuito.'
  },
  {
    icon: 'phonelink_lock',
    cat: 'app',
    q: 'Posso usar o AppFlex em mais de um celular ao mesmo tempo?',
    a: 'Não — por segurança, o AppFlex funciona em apenas um aparelho por vez. Se trocar de celular, é só fazer login no novo que o acesso no anterior é substituído.'
  },
  {
    icon: 'update',
    cat: 'app',
    q: 'As vendas e pagamentos que aparecem no AppFlex são atualizados na hora?',
    a: 'Sim — toda movimentação (vendas, pagamentos e taxas) aparece em tempo real no aplicativo, sem precisar atualizar a página ou esperar.'
  },
  {
    icon: 'block',
    cat: 'mensageria',
    code: '43',
    q: 'Cartão reportado como perdido',
    causa: 'O emissor marcou esse cartão como perdido ou roubado.',
    acao: 'A maquininha não tem como liberar a venda nesse caso. Oriente o cliente a entrar em contato com a central do cartão.'
  },
  {
    icon: 'check_circle',
    cat: 'mensageria',
    code: '00',
    q: 'Transação aprovada',
    causa: 'A venda foi processada e autorizada normalmente pela operadora.',
    acao: 'Nenhuma ação necessária — não indica problema.'
  },
  {
    icon: 'do_not_disturb_on',
    cat: 'mensageria',
    code: '05',
    q: 'Transação não permitida para o cartão',
    causa: 'O emissor do cartão não autorizou a venda.',
    acao: 'Não é algo que a maquininha resolve. Oriente o cliente a contatar a central do próprio cartão.'
  },
  {
    icon: 'pin',
    cat: 'mensageria',
    code: '39',
    q: 'Tentativas de senha excedidas',
    causa: 'O número de tentativas de senha foi ultrapassado.',
    acao: 'Oriente o cliente a contatar o banco emissor — o cartão pode ficar temporariamente bloqueado por segurança.'
  },
  {
    icon: 'account_balance',
    cat: 'mensageria',
    code: '21',
    q: 'Conta de origem inexistente ou inválida',
    causa: 'A conta vinculada ao pagamento está inexistente ou inválida junto ao banco.',
    acao: 'Oriente o cliente a contatar a central do cartão para verificar a situação da conta.'
  },
  {
    icon: 'money_off',
    cat: 'mensageria',
    code: '14',
    q: 'Valor não permitido para a transação',
    causa: 'O valor informado é muito baixo para esse emissor (abaixo de aprox. R$ 0,10).',
    acao: 'Refaça a venda com um valor um pouco maior.'
  },
  {
    icon: 'undo',
    cat: 'mensageria',
    code: '30',
    q: 'Estorno ou desfazimento parcial identificado',
    causa: 'Existe um estorno ou desfazimento já identificado, vinculado a uma venda anterior feita com o mesmo cartão.',
    acao: 'Confira no histórico de vendas se há algum estorno pendente naquele cartão antes de tentar novamente.'
  },
  {
    icon: 'block',
    cat: 'mensageria',
    code: '42',
    q: 'Cartão bloqueado pelo emissor',
    causa: 'O próprio banco emissor bloqueou o cartão.',
    acao: 'Oriente o cliente a contatar a central do cartão para verificar e desbloquear a situação.'
  },
  {
    icon: 'do_not_disturb_on',
    cat: 'mensageria',
    code: '44',
    q: 'Transação não permitida para o cartão',
    causa: 'A modalidade ou o valor da transação não é aceito para esse cartão específico.',
    acao: 'Confira se a modalidade (débito/crédito) e o valor estão corretos. Se persistir, oriente o contato com a central do cartão.'
  },
  {
    icon: 'phone_in_talk',
    cat: 'mensageria',
    code: 'Outros',
    q: 'Outros códigos de recusa do emissor',
    causa: 'Os códigos 01, 06 a 08, 13, 15 a 18, 20, 22 a 25, 38, 41, 46, 50 e 62 indicam, cada um, um motivo específico da instituição emissora — limite, restrição interna, bloqueio, entre outros.',
    acao: 'Em qualquer um deles, a orientação é a mesma: peça para o cliente entrar em contato com a central do cartão do banco emissor.'
  },
  {
    icon: 'phonelink_erase',
    cat: 'suporte',
    q: 'Apareceu "Terminal is Locked! Please Contact Customer Service". O que fazer?',
    a: 'Essa mensagem indica que o terminal perdeu a aplicação interna e não consegue mais operar. Não dá pra resolver na hora — é preciso trocar o equipamento. Entre em contato com o suporte para agendar a substituição.'
  },
  {
    icon: 'wallet',
    cat: 'suporte',
    q: 'A maquininha não reconhece o Pix Voucher (erro ao realizar operação). O que fazer?',
    a: 'Esse erro acontece quando a associação com a rede Voucher ainda não está cadastrada no sistema. É um ajuste feito pelo suporte — entre em contato informando o erro para que a central regularize o cadastro.'
  },
  {
    icon: 'person_search',
    cat: 'suporte',
    q: 'A maquininha diz que o estabelecimento não foi encontrado ou não está liberado. O que fazer?',
    a: 'Isso acontece quando o terminal ainda não está vinculado corretamente ao cadastro, ou está preso a um ID antigo. É preciso que o suporte libere o vínculo — entre em contato informando o código do terminal.'
  },
  {
    icon: 'wifi_off',
    cat: 'suporte',
    q: 'O credenciamento da maquininha falhou e não consigo concluir sozinho. O que fazer?',
    a: 'Antes de acionar o suporte, verifique a conexão (Wi-Fi ou chip) e tente reiniciar o aparelho. Se a falha continuar, isso costuma ser uma instabilidade nos serviços de credenciamento — entre em contato com o suporte informando o número de série do equipamento.'
  },
  {
    icon: 'rule',
    cat: 'suporte',
    q: 'Apareceu um erro de "parâmetro inválido" e o terminal não processa vendas. É algo que eu resolvo?',
    a: 'Não — esse erro indica que faltam configurações de bandeira no cadastro do seu terminal, e o ajuste só pode ser feito pelo time técnico. Entre em contato com o suporte para que a parametrização seja corrigida remotamente.'
  },
  {
    icon: 'help_center',
    cat: 'sobre',
    q: 'O que é uma Adquirente e como ela atua nas transações?',
    a: 'A Adquirente (também chamada de Credenciadora) é a empresa responsável por habilitar estabelecimentos a aceitar pagamentos por cartão. Ela atua como intermediadora entre o seu negócio, a bandeira do cartão e o banco emissor, viabilizando a autorização da venda, o processamento e o repasse do valor para você.'
  },
  {
    icon: 'percent',
    cat: 'sobre',
    q: 'O que é MDR e por que a taxa pode variar?',
    a: 'MDR (Merchant Discount Rate) é o percentual cobrado em cada transação com cartão, referente ao processamento, captura e liquidação da venda. Ela varia conforme três fatores:',
    steps: [
      'A bandeira utilizada (Visa, Mastercard, Elo etc.)',
      'O tipo de transação (crédito, débito, parcelado)',
      'As condições comerciais negociadas entre você e a Redeflex'
    ]
  },
  {
    icon: 'style',
    cat: 'sobre',
    q: 'Quais são os tipos de transação com cartão e como cada um funciona?',
    a: 'Existem três modalidades principais, cada uma com prazo de repasse diferente:',
    steps: [
      'Débito — o valor é debitado na hora da conta do cliente, e você recebe no próximo dia útil (o mais rápido)',
      'Crédito à vista — o cliente paga em uma parcela só, e você recebe em até 30 dias (ou conforme condições acordadas)',
      'Crédito parcelado — o cliente divide em até 12x, e você recebe mês a mês, conforme as parcelas são cobradas'
    ]
  },
  {
    icon: 'balance',
    cat: 'sobre',
    q: 'Qual a diferença entre parcelado com e sem juros?',
    a: 'A diferença é quem paga o custo financeiro da operação:',
    steps: [
      'Sem juros — você (estabelecimento) assume a taxa da operação, e o cliente paga parcelas iguais',
      'Com juros — o cliente paga os juros definidos pelo banco emissor, e você recebe o valor integral da venda, como se fosse uma venda à vista'
    ]
  },
  {
    icon: 'bolt',
    cat: 'sobre',
    q: 'Como funciona a RAV (Antecipação Automática) das vendas parceladas?',
    a: 'A RAV antecipa automaticamente os valores das vendas parceladas no crédito, com o dinheiro caindo na sua conta já no próximo dia útil após a venda — dá mais previsibilidade pro seu fluxo de caixa. Existe uma taxa aplicada, descontada proporcionalmente de cada parcela antecipada.'
  },
  {
    icon: 'account_balance_wallet',
    cat: 'sobre',
    q: 'Como consulto minha taxa de antecipação?',
    a: 'De duas formas: no Portal do Cliente Redeflex, acessando o menu "Meu Plano", ou ligando para a Central de Atendimento pelo 0800 647 0002.'
  },
  {
    icon: 'savings',
    cat: 'sobre',
    q: 'Como recebo os valores das vendas, e qual conta bancária posso cadastrar?',
    a: 'Os valores caem automaticamente na conta cadastrada no credenciamento, desde que os dados estejam corretos.',
    steps: [
      'A conta precisa estar ativa e vinculada ao mesmo CPF ou CNPJ da proposta',
      'Contas salário não são aceitas para receber os repasses',
      'Conta conjunta é aceita, desde que o titular principal seja o mesmo CPF da proposta',
      'Conta inválida ou incorreta trava o repasse até você atualizar o cadastro'
    ]
  },
  {
    icon: 'query_stats',
    cat: 'sobre',
    q: 'Como acompanho minhas vendas e recebimentos?',
    a: 'Pelo Portal do Cliente ou pelo AppFlex, você acompanha vendas, recebimentos e relatórios de forma prática e em tempo real. Pelo Portal também dá pra ativar a antecipação automática ou pedir antecipações pontuais, conforme sua necessidade.'
  },
  {
    icon: 'undo',
    cat: 'sobre',
    q: 'Fiz uma venda e o cliente desistiu da compra. Posso estornar?',
    a: 'Sim. O estorno pode ser feito direto na maquininha, mas só no mesmo dia da venda (veja o passo a passo em Maquininha, mais acima). Depois desse prazo, é preciso ligar para a Central de Atendimento (0800 647 0002) para avaliar as possibilidades de cancelamento.'
  },
  {
    icon: 'qr_code_2',
    cat: 'sobre',
    q: 'Qual o prazo de recebimento de uma venda via Pix?',
    a: 'É imediato. Assim que o cliente confirma o pagamento pelo QR Code, o valor já cai na sua conta cadastrada.'
  },
  {
    icon: 'schedule',
    cat: 'sobre',
    q: 'Até que horário o valor das vendas de débito/crédito deve estar na minha conta?',
    a: 'O crédito depende do fluxo de liberação do seu banco. A recomendação é aguardar até as 18h (horário local). Se o valor não cair até esse horário, entre em contato com a Central de Atendimento para verificação.'
  },
  {
    icon: 'redeem',
    cat: 'sobre',
    q: 'As maquininhas aceitam vouchers (vale-alimentação/refeição)?',
    a: 'Sim, mas só para clientes Pessoa Jurídica (PJ). O credenciamento pra aceitar vouchers precisa ser feito direto com a empresa do voucher (Alelo, Sodexo, Ticket etc.) — a Redeflex não faz esse credenciamento nem tem acesso às taxas e prazos definidos por essas empresas.'
  },
  {
    icon: 'payments',
    cat: 'sobre',
    q: 'As maquininhas têm cobrança de aluguel? Dá pra ter isenção?',
    a: 'Sim, existe uma cobrança de aluguel mensal, que varia conforme o modelo do equipamento e as condições contratuais. A isenção pode ser concedida conforme o faturamento previsto ou acordos comerciais firmados na contratação. Para consultar o valor do seu aluguel, acesse o Portal do Cliente, na aba "Meu Plano".'
  },
  {
    icon: 'forum',
    cat: 'sobre',
    q: 'A Central de Atendimento também atende por WhatsApp?',
    a: 'Sim — costuma ser até mais ágil. O número é o mesmo do telefone: 0800 647 0002.'
  },
  {
    icon: 'devices',
    cat: 'sobre',
    q: 'Quais modelos de POS a Redeflex oferece?',
    a: 'Dois modelos, com perfis bem diferentes:',
    steps: [
      'DX8000 — terminal Android moderno, interface intuitiva e navegação simplificada, ideal para quem busca agilidade',
      'Move5000 — terminal legado, com teclado físico, simples e direto, para quem prefere o modelo clássico'
    ]
  },
  {
    icon: 'contactless',
    cat: 'sobre',
    q: 'Quais formas de pagamento e tipos de conexão o POS aceita?',
    a: 'Dá pra aceitar débito, crédito à vista, crédito parcelado e Pix. Nas conexões, os equipamentos contam com Wi-Fi, chip de dados e conexão cabeada, pra suas vendas não pararem mesmo se uma delas falhar.'
  },
  {
    icon: 'add_box',
    cat: 'suporte',
    q: 'Como funciona o fluxo de credenciamento de um POS adicional?',
    a: 'Esse processo é feito pela Central de Atendimento: você solicita a criação de um ID de Terminal (Número Lógico). Depois de criado, o novo POS pode ser credenciado no mesmo estabelecimento e passa a operar de forma independente, vinculado ao mesmo cadastro.'
  },
  {
    icon: 'swap_horiz',
    cat: 'suporte',
    q: 'Como funciona o fluxo de troca ou remoção de um POS?',
    a: 'Depende do modelo do equipamento:',
    steps: [
      'POS MOVE — a troca é solicitada pelo PowerApps (RFM). Se o equipamento estiver funcional ("troca com função"), após aprovação só é preciso dar baixa técnica no SGV. Se estiver com falha ("troca sem função"), é necessário o procedimento de passagem de pen-drive antes de finalizar',
      'POS DX8000 — ainda não está integrado ao PowerApps, então toda remoção/desvinculação é feita exclusivamente pela Central de Atendimento'
    ],
    obs: 'Em situações de urgência, a remoção do POS MOVE também pode ser feita direto pela Central de Atendimento, mesmo fora do PowerApps.'
  },
  {
    icon: 'restore',
    cat: 'suporte',
    q: 'Como funciona o fluxo de recredenciamento (reativação) de um estabelecimento inativo?',
    a: 'É um processo com 4 etapas:',
    steps: [
      'Contato com a Central de Atendimento para validar o cenário',
      'Subida de uma nova proposta no Intraflex, usando o tipo de cliente ADQ',
      'Envio de e-mail de notificação ao time de OPCOM (opcom@redeflex.com.br) avisando a abertura da nova proposta',
      'Após a liberação da proposta, o time responsável executa os ajustes sistêmicos e confirma a liberação para novo credenciamento'
    ]
  }
];

const TOPICS = [
  {
    id: 'login',
    icon: 'login',
    section: 'Acesso ao Portal',
    tab: 'Login',
    question: 'Como acesso o Portal com meu login?',
    summary: 'Link de acesso, campos de Email e Senha, e como recebo minhas credenciais.',
    keywords: 'login entrar acesso email senha credenciais portal solverpag',
    status: 'ready',
    steps: [
      { title: 'Tela de login', screen: SCREEN_LOGIN,
        text: 'Acesse o Portal pelo link portal.solverpag.com.br. Informe o Email e a Senha nos campos indicados e clique em Entrar.' },
      { title: 'Lembrar-me e credenciais', screen: SCREEN_LOGIN,
        text: 'A opção "Lembrar-me" já vem marcada por padrão. O login e a senha são enviados automaticamente para o e-mail cadastrado no lançamento da proposta — se não encontrar, verifique a caixa de spam/lixo eletrônico.' }
    ]
  },
  {
    id: 'redefinicao',
    icon: 'lock_reset',
    tab: 'Redefinição de senha',
    question: 'Esqueci minha senha. Como redefino o acesso?',
    summary: 'Fluxo completo de redefinição, do link "Esqueci minha senha" ao reenvio.',
    keywords: 'esqueci senha redefinir redefinição recuperar acesso cpf cnpj esqueceu',
    status: 'ready',
    steps: [
      { title: 'Esqueci minha senha', screen: SCREEN_LOGIN,
        text: 'Na tela de login, clique no link "Esqueci minha senha", ao lado do campo Senha.' },
      { title: 'Novo pedido de senha', screen: SCREEN_RECOVER,
        text: 'Informe o Email e o CNPJ ou CPF e clique em "Enviar link para e-mail". Uma nova senha é gerada e enviada — é possível trocá-la depois em Meu Perfil › Alterar Senha.' }
    ]
  },
  {
    id: 'pagamentos',
    icon: 'calendar_month',
    section: 'Pagamentos',
    tab: 'Pagamentos',
    question: 'Como consulto meus pagamentos recebidos?',
    summary: 'Calendário de pagamentos por status e consulta detalhada por período.',
    keywords: 'pagamentos recebidos conciliação recebimentos calendário por período arranjo débito consolidado',
    status: 'ready',
    wide: true,
    steps: [
      { title: 'Acesso pelo menu Pagamentos', screen: SCREEN_PAG_NAV, wide: false,
        text: 'No menu lateral, clique em "Pagamentos" e selecione a aba "Calendário".' },
      { title: 'Calendário de pagamentos', screen: SCREEN_PAG_CAL,
        text: 'O calendário mostra, dia a dia, os valores por status: verde para Efetivado, laranja para A Receber e vermelho para Rejeitado. O dia atual aparece destacado.' },
      { title: 'Consulta por período', screen: SCREEN_PAG_DETAIL,
        text: 'Clique em um dia específico para abrir o detalhe em "Pagamento Agrupado". O painel mostra o valor consolidado por arranjo — neste exemplo, um débito Maestro de R$ 2,11, com o total do dia.' }
    ]
  },
  {
    id: 'agendas',
    icon: 'event_upcoming',
    section: 'Agendas de Recebíveis',
    tab: 'Agendas de Recebíveis',
    question: 'Como consulto minha agenda de recebíveis?',
    summary: 'Valores previstos a receber, organizados dia a dia na semana.',
    keywords: 'agenda recebíveis recebimentos futuros semana valores a receber',
    status: 'ready',
    steps: [
      { title: 'Agenda da Semana', screen: SCREEN_AGENDA,
        text: 'Na tela inicial, o bloco "Agenda da Semana" mostra, dia a dia, os valores previstos para receber. O dia atual aparece destacado na lista.' }
    ]
  },
  {
    id: 'antecipacoes',
    icon: 'bolt',
    section: 'Antecipações',
    tab: 'Antecipações',
    question: 'Como simulo ou solicito uma antecipação de recebíveis?',
    summary: 'Antecipação Eventual, ativação da Automática e consulta de Solicitações.',
    keywords: 'antecipação antecipar saldo recebíveis simular eventual automática diária solicitações protocolo agendar',
    status: 'ready',
    wide: true,
    steps: [
      { title: 'Acesso pelo menu Antecipação', screen: SCREEN_ANTECIP_NAV, wide: false,
        text: 'No menu lateral, clique em "Antecipação" para abrir as três opções: Eventual, Automática e Solicitações.' },
      { title: 'Antecipação Eventual', screen: SCREEN_ANTECIP_EVENTUAL,
        text: 'Em "Antecipar Agora", informe o valor e clique em "Simular" para ver o valor da antecipação, a taxa eventual (1,90% a.m) e o valor a depositar. Em "Agendar Antecipação", é possível programar a antecipação para uma data futura.' },
      { title: 'Antecipação Automática', screen: SCREEN_ANTECIP_AUTO,
        text: 'Em "Automática", ative a opção "Diária" para receber antecipadamente as vendas de crédito no dia útil seguinte. O painel "Informações" mostra o status atual e as taxas eventual e automática vigentes.' },
      { title: 'Solicitações', screen: SCREEN_ANTECIP_SOLIC,
        text: 'Em "Solicitações", filtre por período e consulte o histórico de antecipações: protocolo, data do adiantamento, data do pagamento, valor bruto, valor líquido e taxa aplicada.' }
    ]
  },
  {
    id: 'taxas',
    icon: 'percent',
    section: 'Taxas',
    tab: 'Taxas',
    question: 'Como verifico minhas taxas vigentes?',
    summary: 'Tarifas por bandeira e modalidade, e a taxa fixa das operações via Pix.',
    keywords: 'taxas tarifas meu plano mdr débito crédito pix bandeira elo visa mastercard',
    status: 'ready',
    wide: true,
    steps: [
      {
        title: 'Acesso pelo ícone do meu perfil',
        text: 'Clique no avatar, no canto superior direito do Portal, e abra o menu suspenso. Em seguida, selecione "Meu Plano".',
        screen: `
          <div class="mini-portal wide">
            <div class="mp-topbar">
              <div class="mp-user-info"><b>EMPRESA EXEMPLO COMERCIO...</b><span>482910</span></div>
              <div class="mp-avatar">V</div>
            </div>
            <div class="mp-dropdown">
              <div class="mp-drop-item"><span class="ic"><span class="material-symbols-outlined">person</span></span> Meu Perfil</div>
              <div class="mp-drop-item active"><span class="ic"><span class="material-symbols-outlined">account_balance_wallet</span></span> Meu Plano</div>
              <div class="mp-drop-item"><span class="ic"><span class="material-symbols-outlined">logout</span></span> Sair</div>
            </div>
          </div>`
      },
      {
        title: 'Tabela de Operações',
        text: 'A tabela mostra as tarifas vigentes por bandeira (Elo, Mastercard, Visa) e por modalidade: Débito, Crédito 7x–12x, Crédito 1x, Crédito 2x–6x e Parcelado com juros.',
        screen: `
          <div class="mini-portal wide">
            <div class="mp-card mp-rates">
              <h4>Meu Plano · Operações</h4>
              <div class="mp-table-wrap"><table class="mp-table">
                <thead><tr><th>Bandeira</th><th>Débito</th><th>Créd. 7x-12x</th><th>Créd. 1x</th><th>Créd. 2x-6x</th><th>Parc c/ juros</th></tr></thead>
                <tbody>
                  <tr><td class="flag"><span class="chip chip-elo">elo</span>Elo</td><td>2,50%</td><td>4,26%</td><td>3,04%</td><td>3,80%</td><td>3,04%</td></tr>
                  <tr><td class="flag"><span class="chip chip-mc">MC</span>Mastercard</td><td>2,09%</td><td>3,69%</td><td>2,90%</td><td>3,45%</td><td>2,90%</td></tr>
                  <tr><td class="flag"><span class="chip chip-visa">VS</span>Visa</td><td>2,09%</td><td>3,69%</td><td>2,90%</td><td>3,45%</td><td>2,90%</td></tr>
                </tbody>
              </table></div>
            </div>
          </div>`
      },
      {
        title: 'Operações de Pix',
        text: 'Logo abaixo, a seção "Operações de Pix" mostra que, para qualquer venda realizada com Pix, o valor cobrado é fixo: R$ 0,70 por operação.',
        screen: `
          <div class="mini-portal wide">
            <div class="mp-card mp-rates">
              <h4>Operações de Pix</h4>
              <div class="mp-table-wrap"><table class="mp-table">
                <thead><tr><th>Bandeira</th><th>Taxa da operação</th></tr></thead>
                <tbody>
                  <tr><td class="flag"><span class="chip chip-pix">Px</span>Pix</td><td>Valor fixo de R$ 0,70 por venda</td></tr>
                </tbody>
              </table></div>
            </div>
          </div>`
      }
    ]
  },
  {
    id: 'informacao',
    icon: 'badge',
    section: 'Informação',
    tab: 'Informação',
    question: 'Como verifico minhas informações cadastrais?',
    summary: 'Dados gerais da conta: razão social, CNPJ, código RedeFlex e ramo de atividade.',
    keywords: 'informação informações cadastrais dados perfil meu perfil cadastro minha conta geral razão social cnpj',
    status: 'ready',
    wide: true,
    steps: [
      { title: 'Acesso pelo ícone do meu perfil', screen: SCREEN_PERFIL_NAV,
        text: 'Clique no avatar, no canto superior direito do Portal, e abra o menu suspenso. Em seguida, selecione "Meu Perfil".' },
      { title: 'Informações gerais da conta', screen: SCREEN_INFO_GERAL,
        text: 'Em "Minha Conta", a aba "Geral" mostra os dados cadastrais: Código RedeFlex, CPF/CNPJ, Razão Social, Nome Fantasia, Ramo de Atividade e Código de Afiliação. As abas ao lado dão acesso a Contatos, Endereços, Dados Bancários e Alterar Senha.' }
    ]
  },
  {
    id: 'simulador_vendas',
    icon: 'point_of_sale',
    section: 'Simulador de Vendas',
    tab: 'Simulador de Vendas',
    question: 'Como uso o Simulador de Vendas?',
    summary: 'Simulação do valor líquido de uma venda, com antecipação e parcelamento.',
    keywords: 'simulador de vendas simular venda calcular valor líquido parcelas antecipação',
    status: 'ready',
    wide: true,
    steps: [
      {
        title: 'Abrir o simulador',
        wide: false,
        text: 'No topo do Portal, clique no botão "Simular Venda" para abrir a janela de simulação.',
        screen: `
          <div class="mini-portal">
            <div class="mp-card" style="text-align:center; padding:36px 22px;">
              <button class="mp-btn" style="width:auto; padding:12px 28px; margin:0 auto;">Simular Venda</button>
              <p class="sub" style="margin-top:16px;">Botão fixo no topo do Portal, ao lado do nome do estabelecimento.</p>
            </div>
          </div>`
      },
      {
        title: 'Preenchimento dos dados da venda',
        text: 'Informe o Valor da venda e escolha o tipo de Antecipação (por padrão, Automática diária). Em seguida, selecione o Tipo do cartão, a Bandeira e o número de Parcelas. Ative "Quero receber o valor integral da venda" quando quiser embutir a taxa no valor cobrado do cliente, garantindo que o valor a receber seja exatamente o valor da venda, sem desconto.',
        screen: `
          <div class="mini-portal wide">
            <div class="mp-card">
              <h4>Simulação de venda</h4>
              <div class="mp-form-grid">
                <div class="mp-field">
                  <div class="row-label"><label>Valor da venda</label></div>
                  <input class="mp-input" value="R$ 1.000,00" disabled>
                </div>
                <div class="mp-field">
                  <div class="row-label"><label>Antecipação</label></div>
                  <select class="mp-select" disabled><option>Automática diária</option></select>
                </div>
              </div>
              <div class="mp-form-grid tri">
                <div class="mp-field">
                  <div class="row-label"><label>Tipo do cartão</label></div>
                  <select class="mp-select" disabled><option>Crédito</option></select>
                </div>
                <div class="mp-field">
                  <div class="row-label"><label>Bandeira</label></div>
                  <select class="mp-select" disabled><option>Visa</option></select>
                </div>
                <div class="mp-field">
                  <div class="row-label"><label>Parcelas</label></div>
                  <select class="mp-select" disabled><option>5x</option></select>
                </div>
              </div>
              <div class="mp-toggle-row"><div class="mp-toggle on"><div class="knob">✓</div></div> Quero receber o valor integral da venda</div>
            </div>
          </div>`
      },
      {
        title: 'Cálculo do resultado',
        text: 'Clique em "Calcular" para ver o resultado em três cartões: Valor da venda, Valor descontado (taxas e antecipação) e Valor a receber. Com "Quero receber o valor integral da venda" ativado, a taxa é somada ao valor cobrado do cliente em vez de ser descontada do valor a receber — por isso, neste exemplo, o Valor a receber sai igual ao Valor da venda original (R$ 1.000,00), e o desconto de R$ 91,92 aparece embutido no novo Valor da venda (R$ 1.091,92). "Limpar filtros" reinicia a simulação.',
        screen: `
          <div class="mini-portal wide">
            <div class="mp-card">
              <h4>Calcular e conferir</h4>
              <div class="mp-btn-row">
                <button class="mp-btn">Calcular</button>
                <button class="mp-btn-outline">Limpar filtros</button>
              </div>
              <div class="mp-toggle-row"><div class="mp-toggle on"><div class="knob">✓</div></div> Quero receber o valor integral da venda</div>
              <div class="mp-result-cards">
                <div class="mp-result-card"><div><div class="rlabel">VALOR DA VENDA</div><div class="rval">R$ 1.091,92</div></div><span class="ric ric-blue">+</span></div>
                <div class="mp-result-card"><div><div class="rlabel">VALOR DESCONTADO</div><div class="rval">R$ 91,92</div></div><span class="ric ric-orange">↻</span></div>
                <div class="mp-result-card"><div><div class="rlabel">VALOR A RECEBER</div><div class="rval">R$ 1.000,00</div></div><span class="ric ric-green"><span class="material-symbols-outlined">person</span></span></div>
              </div>
            </div>
          </div>`
      },
      {
        title: 'Condição de antecipação vigente',
        text: 'Na conta, a antecipação Automática está ativa com taxa de 1,70% ao mês — esse é o custo aplicado ao antecipar o recebimento.',
        screen: `
          <div class="mini-portal wide">
            <div class="mp-card mp-rates">
              <h4>Antecipação vigente</h4>
              <div class="mp-table-wrap"><table class="mp-table">
                <thead><tr><th>Tipo</th><th>Taxa</th><th>Status</th></tr></thead>
                <tbody><tr><td>Automática</td><td>1,70% a.m</td><td>Ativo</td></tr></tbody>
              </table></div>
            </div>
          </div>`
      }
    ]
  }
];
