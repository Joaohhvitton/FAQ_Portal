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
      <h4>Esqueceu sua senha? 🔒</h4>
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
      <div class="sm-item">📈 Vendas</div>
      <div class="sm-item">📅 Pagamentos</div>
      <div class="sm-group-label">Antecipação</div>
      <div class="sm-item active">☑️ Eventual</div>
      <div class="sm-item">🔁 Automática</div>
      <div class="sm-item">📋 Solicitações</div>
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
      <div class="sm-item">📈 Vendas</div>
      <div class="sm-group-label">Pagamentos</div>
      <div class="sm-item active">📅 Calendário</div>
      <div class="sm-item">🕘 Por Período</div>
      <div class="sm-group-label">&nbsp;</div>
      <div class="sm-item">✅ Antecipação</div>
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
      <div class="mp-drop-item active"><span class="ic">👤</span> Meu Perfil</div>
      <div class="mp-drop-item"><span class="ic">🗂️</span> Meu Plano</div>
      <div class="mp-drop-item"><span class="ic">⏻</span> Sair</div>
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
          <div class="acc-nav-item active"><span class="ic">👤</span> Geral</div>
          <div class="acc-nav-item"><span class="ic">📞</span> Contatos</div>
          <div class="acc-nav-item"><span class="ic">📍</span> Endereços</div>
          <div class="acc-nav-item"><span class="ic">💲</span> Dados Bancários</div>
          <div class="acc-nav-item"><span class="ic">🔒</span> Alterar Senha</div>
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
const TOPICS = [
  {
    id: 'login',
    section: '1–2 · Acesso ao Portal',
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
    section: '3 · Pagamentos',
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
    section: '4 · Agendas de Recebíveis',
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
    section: '5 · Antecipações',
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
    section: '6 · Taxas',
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
              <div class="mp-drop-item"><span class="ic">👤</span> Meu Perfil</div>
              <div class="mp-drop-item active"><span class="ic">🗂️</span> Meu Plano</div>
              <div class="mp-drop-item"><span class="ic">⏻</span> Sair</div>
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
    section: '7 · Informação',
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
    section: '8 · Simulador de Vendas',
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
                <div class="mp-result-card"><div><div class="rlabel">VALOR A RECEBER</div><div class="rval">R$ 1.000,00</div></div><span class="ric ric-green">👤</span></div>
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
