/**
 * app.js — renderização e interações da FAQ do Portal.
 *
 * Responsabilidades:
 *  - montar a lista de assuntos a partir de TOPICS (data.js)
 *  - busca/filtro com contagem e estado vazio
 *  - simulador (modal) com navegação por passos e transição suave
 *  - reveal no scroll (IntersectionObserver)
 *  - acessibilidade: foco, teclado, Esc
 */
(function () {
  'use strict';

  const READY = TOPICS.filter(t => t.status === 'ready');
  const $ = (sel, ctx = document) => ctx.querySelector(sel);

  /* ----------------------------------------------------------------
     util
  ---------------------------------------------------------------- */
  const normalize = (s) =>
    (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const stepsLabel = (n) => (n === 1 ? '1 passo' : n + ' passos');

  /* ----------------------------------------------------------------
     1. RENDER — lista de assuntos
  ---------------------------------------------------------------- */
  /* ---- dúvidas rápidas: cards pequenos, resposta inline, sem modal ---- */
  const QF_CATS = {
    sobre: { label: 'Sobre a Adquirência e o Comercial', icon: 'storefront' },
    pos: { label: 'Maquininha (POS)', icon: 'point_of_sale' },
    app: { label: 'AppFlex', icon: 'smartphone' },
    mensageria: { label: 'Mensageria · códigos de retorno', icon: 'sync_alt' },
    suporte: { label: 'Quando é preciso falar com o suporte', icon: 'support_agent' }
  };

  function buildQuickFaq() {
    const grid = $('#quickFaqGrid');
    if (!grid || typeof QUICK_FAQ === 'undefined') return;
    const frag = document.createDocumentFragment();
    let idx = 0;

    Object.keys(QF_CATS).forEach((catKey) => {
      let items = QUICK_FAQ.filter(i => i.cat === catKey);
      if (!items.length) return;
      const meta = QF_CATS[catKey];
      const isCodes = catKey === 'mensageria';

      if (isCodes) {
        items = items.slice().sort((a, b) => {
          const na = parseInt(a.code, 10);
          const nb = parseInt(b.code, 10);
          if (isNaN(na)) return 1;
          if (isNaN(nb)) return -1;
          return na - nb;
        });
      }

      const group = document.createElement('div');
      group.className = 'qf-group' + (isCodes ? ' qf-group-codes' : '');
      group.innerHTML = `
        <div class="qf-group-head">
          <span class="material-symbols-outlined">${meta.icon}</span>
          ${meta.label}
          <span class="qf-group-count">${items.length}</span>
        </div>
        ${isCodes ? `
        <div class="qf-code-search">
          <span class="material-symbols-outlined">search</span>
          <input type="text" id="qfCodeFilter" placeholder="Buscar por número do código ou palavra…" autocomplete="off">
        </div>` : ''}
        <div class="qf-grid"></div>`;
      const subGrid = group.querySelector('.qf-grid');

      items.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'qf-card' + (item.code ? ' qf-card-code' : '');
        card.dataset.search = normalize(
          [item.code, item.q, item.a, item.causa, item.acao, (item.steps || []).join(' ')].join(' ')
        );
        const btnId = `qf-btn-${idx}`;
        const panelId = `qf-panel-${idx}`;
        idx++;
        const stepsHtml = item.steps ? `
          <ol class="qf-steps">
            ${item.steps.map(s => `<li>${s}</li>`).join('')}
          </ol>` : '';
        const obsHtml = item.obs ? `<p class="qf-obs"><span class="material-symbols-outlined">info</span>${item.obs}</p>` : '';

        const bodyHtml = item.code ? `
            <div class="qf-line"><span class="qf-line-label">Causa</span><span class="qf-line-text">${item.causa}</span></div>
            <div class="qf-line qf-line-acao"><span class="qf-line-label">O que fazer</span><span class="qf-line-text">${item.acao}</span></div>` : `
            <p>${item.a}</p>
            ${stepsHtml}
            ${obsHtml}`;

        const questionHtml = item.code
          ? `<span class="qf-code-badge">Cód. ${item.code}</span><span class="qf-q-text">${item.q}</span>`
          : `<span class="qf-icon"><span class="material-symbols-outlined">${item.icon}</span></span><span class="qf-q-text">${item.q}</span>`;

        card.innerHTML = `
          <button class="qf-q" id="${btnId}" aria-expanded="false" aria-controls="${panelId}">
            ${questionHtml}
            <svg class="qf-chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="qf-a" id="${panelId}" role="region" aria-labelledby="${btnId}" hidden>
            ${bodyHtml}
          </div>`;
        const btn = card.querySelector('.qf-q');
        const panel = card.querySelector('.qf-a');
        btn.addEventListener('click', () => {
          const open = card.classList.toggle('open');
          btn.setAttribute('aria-expanded', String(open));
          panel.hidden = !open;
        });
        subGrid.appendChild(card);
      });

      if (isCodes) {
        const codeInput = group.querySelector('#qfCodeFilter');
        const cards = Array.from(subGrid.querySelectorAll('.qf-card'));
        const codeEmpty = document.createElement('p');
        codeEmpty.className = 'qf-code-empty';
        codeEmpty.hidden = true;
        codeEmpty.textContent = 'Nenhum código bate com essa busca — confira o número ou tente outra palavra.';
        subGrid.after(codeEmpty);
        codeInput.addEventListener('input', () => {
          const q = normalize(codeInput.value.trim());
          let visible = 0;
          cards.forEach((c) => {
            const match = q === '' || c.dataset.search.includes(q);
            c.style.display = match ? '' : 'none';
            if (match) visible++;
          });
          codeEmpty.hidden = visible !== 0;
        });
      }

      frag.appendChild(group);
    });
    grid.appendChild(frag);
  }


  function buildCards() {
    const grid = $('#grid');
    const frag = document.createDocumentFragment();

    TOPICS.forEach((t) => {
      const section = document.createElement('section');
      section.className = 'faq-section reveal' + (t.section ? ' has-label' : '');
      section.dataset.id = t.id;
      section.dataset.keywords = t.keywords;

      if (t.section) {
        const label = document.createElement('div');
        label.className = 'section-label';
        label.textContent = t.section;
        section.appendChild(label);
      }

      const card = document.createElement('div');
      const pending = t.status === 'pending';
      card.className = 'faq-card' + (pending ? ' pending' : '');

      const stepsHtml = pending ? '' : `
        <ol class="card-steps">
          ${t.steps.map((s, i) => `<li><span class="n">${i + 1}</span>${s.title}</li>`).join('')}
        </ol>`;
      const cta = pending
        ? '<div class="cta pending-tag">Em breve</div>'
        : '<div class="cta">Ver tutorial <span class="arrow">›</span></div>';

      card.innerHTML = `
        <span class="card-medal" aria-hidden="true"><span class="material-symbols-outlined">${t.icon || 'help'}</span></span>
        <div class="txt">
          <h3>${t.question}</h3>
          <p>${t.summary}</p>
          ${stepsHtml}
        </div>
        ${cta}`;

      if (!pending) {
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.addEventListener('click', () => openSim(t.id, false, card));
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSim(t.id, false, card); }
        });
      }

      section.appendChild(card);
      frag.appendChild(section);
    });

    grid.appendChild(frag);
  }

  /* ----------------------------------------------------------------
     2. BUSCA / FILTRO
  ---------------------------------------------------------------- */
  /* chips gerados a partir dos assuntos — cobre todas as opções e fica
     sempre em sincronia com o data.js */
  function buildChips() {
    const wrap = $('#quickChips');
    TOPICS.forEach((t) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'qc' + (t.status === 'pending' ? ' qc-soon' : '');
      b.dataset.id = t.id;
      b.innerHTML =
        `<span class="material-symbols-outlined">${t.icon || 'help'}</span>${t.tab}` +
        (t.status === 'pending' ? '<span class="qc-tag">em breve</span>' : '');
      wrap.appendChild(b);
    });
  }

  /* pequeno dicionário de sinônimos — deixa a busca mais tolerante a
     como as pessoas realmente perguntam, sem depender de nenhum serviço
     externo. Cada termo à esquerda expande para os termos à direita. */
  const SYNONYMS = {
    wifi: ['conexao', 'internet', 'sinal'],
    'wi-fi': ['conexao', 'internet', 'sinal'],
    internet: ['conexao', 'wifi'],
    cancelar: ['estorno', 'desfazimento', 'devolver'],
    devolver: ['estorno', 'cancelar'],
    travad: ['travou', 'processando', 'travando'],
    travou: ['travad', 'processando'],
    app: ['appflex', 'aplicativo', 'celular'],
    aplicativo: ['appflex', 'app'],
    maquina: ['maquininha', 'pos', 'terminal', 'equipamento'],
    maquininha: ['pos', 'terminal', 'equipamento'],
    config: ['configuracao', 'configuracoes'],
    configurar: ['configuracao', 'config'],
    recusad: ['negada', 'recusou', 'nao aprovou'],
    negada: ['recusada', 'recusou'],
    cartao: ['cartoes'],
    senha: ['pin'],
    codigo: ['cod'],
    cod: ['codigo'],
    login: ['entrar', 'acesso', 'acessar'],
    entrar: ['login', 'acesso'],
    taxa: ['taxas', 'tarifa', 'mdr'],
    antecipar: ['antecipacao', 'adiantar'],
  };

  function expand(word) {
    return [word, ...(SYNONYMS[word] || [])];
  }

  /* casa se TODAS as palavras da busca (ou algum sinônimo delas)
     aparecerem no texto — muito mais tolerante que exigir a frase inteira */
  function smartMatch(hay, words) {
    return words.every((w) => expand(w).some((alt) => hay.includes(alt)));
  }

  function initSearch() {
    const input = $('#searchInput');
    const clear = $('#searchClear');
    const empty = $('#emptyState');
    const count = $('#resultCount');
    const sections = Array.from(document.querySelectorAll('.faq-section'));
    const qfCards = Array.from(document.querySelectorAll('.qf-card'));
    const qfGroups = Array.from(document.querySelectorAll('.qf-group'));
    const qfSection = $('.qf-section');
    let activeId = null; // assunto fixado por um chip

    function filter() {
      const raw = input.value.trim();
      const q = normalize(raw);
      const words = q.split(/\s+/).filter((w) => w.length > 1);
      const isCode = /^\d{2,3}$/.test(raw.trim());
      clear.hidden = q.length === 0;

      let topicVisible = 0;
      sections.forEach((sec) => {
        const hay = normalize(
          sec.dataset.keywords + ' ' +
          ($('h3', sec)?.textContent || '') + ' ' +
          ($('.txt p', sec)?.textContent || '')
        );
        const match = activeId
          ? sec.dataset.id === activeId
          : (q === '' || smartMatch(hay, words));
        sec.style.display = match ? '' : 'none';
        if (match) topicVisible++;
      });

      // dúvidas rápidas — só entram na busca por texto livre (chips de
      // assunto continuam restritos aos 8 tutoriais principais)
      let quickVisible = 0;
      if (!activeId) {
        qfCards.forEach((card) => {
          const codeMatch = isCode && card.classList.contains('qf-card-code')
            && card.dataset.search.includes('cod. ' + raw.trim());
          const match = q === '' || codeMatch || smartMatch(card.dataset.search, words);
          card.style.display = match ? '' : 'none';
          if (match) quickVisible++;
        });
        qfGroups.forEach((g) => {
          const anyVisible = Array.from(g.querySelectorAll('.qf-card')).some(c => c.style.display !== 'none');
          g.style.display = anyVisible ? '' : 'none';
        });
        if (qfSection) qfSection.style.display = (q === '' || quickVisible > 0) ? '' : 'none';
      } else {
        qfCards.forEach((card) => { card.style.display = ''; });
        qfGroups.forEach((g) => { g.style.display = ''; });
        if (qfSection) qfSection.style.display = '';
        quickVisible = qfCards.length;
      }

      const totalVisible = topicVisible + (activeId ? 0 : quickVisible);
      empty.hidden = totalVisible !== 0;

      if (q === '' && !activeId) {
        count.textContent = '';
      } else if (activeId) {
        count.textContent = topicVisible + (topicVisible === 1 ? ' resultado' : ' resultados');
      } else {
        count.textContent = topicVisible + quickVisible === 1
          ? '1 resultado'
          : (topicVisible + quickVisible) + ' resultados';
      }
    }

    function clearSearch() {
      input.value = '';
      activeId = null;
      document.querySelectorAll('.qc').forEach(c => c.classList.remove('active'));
      filter();
      input.focus();
    }

    clear.addEventListener('click', clearSearch);

    // chips por assunto
    const chips = Array.from(document.querySelectorAll('.qc'));
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const already = chip.classList.contains('active');
        activeId = already ? null : chip.dataset.id;
        input.value = '';
        chips.forEach(c => c.classList.toggle('active', c === chip && !already));
        filter();
      });
    });

    // digitar limpa o chip fixado e volta à busca por texto
    input.addEventListener('input', () => {
      activeId = null;
      chips.forEach(c => c.classList.remove('active'));
      filter();
    });

    document.addEventListener('keydown', (e) => {
      const modalOpen = $('#modalOverlay').classList.contains('show');
      if (e.key === '/' && document.activeElement !== input && !modalOpen) {
        e.preventDefault(); input.focus();
      }
      if (e.key === 'Escape' && document.activeElement === input && input.value) {
        clearSearch();
      }
    });
  }

  /* ----------------------------------------------------------------
     3. SIMULADOR (modal)
  ---------------------------------------------------------------- */
  const modal = {
    overlay: null, stage: null, panel: null,
    badge: null, title: null, text: null, progress: null,
    dots: null, prev: null, next: null,
    topic: null, step: 0, lastFocus: null
  };

  function cacheModal() {
    modal.overlay = $('#modalOverlay');
    modal.stage = $('#screenStage');
    modal.badge = $('#stepBadge');
    modal.title = $('#stepTitle');
    modal.text = $('#stepText');
    modal.progress = $('#stepProgress');
    modal.dots = $('#dots');
    modal.prev = $('#prevBtn');
    modal.next = $('#nextBtn');
  }

  // Alguns ambientes (iframes com sandbox restrito, previews sem
  // allow-same-origin, arquivo aberto via file://) bloqueiam a History API
  // e lançam SecurityError. O deep-link é um extra — nunca pode quebrar o app.
  function safeReplaceState(url) {
    try { history.replaceState(null, '', url); }
    catch (err) { /* navegador bloqueou a History API — ignora e segue */ }
  }

  function openSim(id, fromHash, originEl) {
    modal.topic = TOPICS.find(t => t.id === id);
    if (!modal.topic || modal.topic.status !== 'ready') return;
    modal.step = 0;
    modal.lastFocus = document.activeElement;
    renderSim(false);

    // origem espacial: o modal cresce a partir do card clicado
    const dialog = modal.overlay.querySelector('.modal');
    if (originEl && dialog && !prefersReduced()) {
      const r = originEl.getBoundingClientRect();
      const dx = (r.left + r.width / 2) - window.innerWidth / 2;
      const dy = (r.top + r.height / 2) - window.innerHeight / 2;
      // limita o deslocamento pra animação não vir de longe demais
      const clamp = (v, max) => Math.max(-max, Math.min(max, v));
      dialog.style.setProperty('--ox', clamp(dx, 220) + 'px');
      dialog.style.setProperty('--oy', clamp(dy, 260) + 'px');
    } else if (dialog) {
      dialog.style.setProperty('--ox', '0px');
      dialog.style.setProperty('--oy', '18px');
    }

    modal.overlay.classList.add('show');
    modal.overlay.setAttribute('aria-hidden', 'false');
    lockScroll();
    if (!fromHash) safeReplaceState('#' + id);
    modal.next.focus();
  }

  function closeSim() {
    modal.overlay.classList.remove('show');
    modal.overlay.setAttribute('aria-hidden', 'true');
    unlockScroll();
    if (location.hash) safeReplaceState(location.pathname + location.search);
    if (modal.lastFocus) modal.lastFocus.focus();
  }

  // trava o scroll da página por trás do modal, preservando a posição
  // (mais robusto que overflow:hidden isolado — evita saltos/artefatos)
  let scrollLockY = 0;
  function lockScroll() {
    scrollLockY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollLockY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }
  function unlockScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollLockY);
  }

  // mantém o foco dentro do modal (Tab / Shift+Tab)
  function trapFocus(e) {
    if (e.key !== 'Tab' || !modal.overlay.classList.contains('show')) return;
    const focusables = modal.overlay.querySelectorAll(
      'button:not([disabled]), [href], input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function renderTopicHead() {
    const t = modal.topic;
    $('#simIcon').textContent = t.icon || 'help';
    $('#simTopic').textContent = t.question;
    $('#simSteps').textContent = `${stepsLabel(t.steps.length)} · ${t.tab}`;
  }

  // animate=true: crossfade só da tela+texto (troca de passo/aba)
  function renderSim(animate) {
    const t = modal.topic;
    const s = t.steps[modal.step];
    const wide = s.wide !== undefined ? s.wide : !!t.wide;

    $('.sim-body').classList.toggle('stacked', wide);
    renderTopicHead();

    const paint = () => {
      modal.stage.innerHTML = `<div class="stage-inner">${s.screen}</div>`;
      modal.badge.textContent = `Passo ${modal.step + 1} de ${t.steps.length}`;
      modal.title.textContent = s.title;
      modal.text.textContent = s.text;

      modal.dots.innerHTML = '';
      t.steps.forEach((st, i) => {
        const d = document.createElement('button');
        d.type = 'button';
        d.className = 'dot' + (i === modal.step ? ' active' : '');
        d.setAttribute('aria-label', `Passo ${i + 1}: ${st.title}`);
        if (i === modal.step) d.setAttribute('aria-current', 'step');
        d.addEventListener('click', () => {
          if (i !== modal.step) { modal.step = i; renderSim(true); }
        });
        modal.dots.appendChild(d);
      });

      modal.prev.disabled = modal.step === 0;
      modal.next.textContent = modal.step === t.steps.length - 1 ? 'Concluir' : 'Próximo ›';
      modal.progress.style.width = (((modal.step + 1) / t.steps.length) * 100) + '%';
    };

    if (animate && !prefersReduced()) {
      // direção do movimento: avançar desliza pra esquerda, voltar pra direita
      const dir = (modal.rendered == null || modal.step >= modal.rendered) ? 1 : -1;
      const body = $('.sim-body');
      body.style.setProperty('--dir', dir);

      const outs = [modal.stage.querySelector('.stage-inner'), $('.panel-inner')];
      outs.forEach(el => el && el.classList.add('swap-out'));

      setTimeout(() => {
        paint();
        modal.rendered = modal.step;
        requestAnimationFrame(() => {
          const ins = [modal.stage.querySelector('.stage-inner'), $('.panel-inner')];
          ins.forEach(el => {
            if (!el) return;
            el.classList.add('swap-in');
            requestAnimationFrame(() => el.classList.remove('swap-in'));
          });
        });
      }, 160);
    } else {
      paint();
      modal.rendered = modal.step;
    }
  }

  function nextStep() {
    const t = modal.topic;
    if (modal.step < t.steps.length - 1) { modal.step++; renderSim(true); }
    else closeSim();
  }
  function prevStep() {
    if (modal.step > 0) { modal.step--; renderSim(true); }
  }

  function initModal() {
    cacheModal();
    modal.prev.addEventListener('click', prevStep);
    modal.next.addEventListener('click', nextStep);
    $('#closeBtn').addEventListener('click', closeSim);
    $('#simBack').addEventListener('click', () => {
      closeSim();
      const card = document.querySelector(`.faq-section[data-id="${modal.topic.id}"] .faq-card`);
      if (card) card.scrollIntoView({ block: 'center', behavior: prefersReduced() ? 'auto' : 'smooth' });
    });
    modal.overlay.addEventListener('click', (e) => {
      if (e.target === modal.overlay) closeSim();
    });
    document.addEventListener('keydown', (e) => {
      if (!modal.overlay.classList.contains('show')) return;
      if (e.key === 'Escape') closeSim();
      else if (e.key === 'ArrowRight') nextStep();
      else if (e.key === 'ArrowLeft') prevStep();
      else if (e.key === 'Tab') trapFocus(e);
    });
  }

  /* ----------------------------------------------------------------
     4. REVEAL NO SCROLL
  ---------------------------------------------------------------- */
  function initReveal() {
    if (prefersReduced() || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // stagger curto e limitado — lotes grandes não podem demorar
          setTimeout(() => entry.target.classList.add('visible'), Math.min(i, 5) * 45);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  function prefersReduced() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ----------------------------------------------------------------
     5. PROGRESSO DE ROLAGEM (+ botão voltar ao topo)
  ---------------------------------------------------------------- */
  function initScrollProgress() {
    const bar = $('#scrollProgress');
    const toTop = $('#toTopBtn');
    const ring = $('#toTopRing');
    const header = $('#siteHeader');
    const RING_LEN = 110; // 2 * PI * r(17.5) ≈ 110
    let ticking = false;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? h.scrollTop / max : 0;
      if (bar) bar.style.width = (pct * 100) + '%';
      if (ring) ring.style.strokeDashoffset = RING_LEN - pct * RING_LEN;
      if (toTop) toTop.classList.toggle('show', h.scrollTop > 480);
      if (header) header.classList.toggle('is-scrolled', h.scrollTop > 8);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    if (toTop) {
      toTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' });
      });
    }
    update();
  }

  /* atalho de busca no header: rola ao topo e foca o campo */
  function initHeaderSearch() {
    const btn = $('#headerSearchBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' });
      setTimeout(() => $('#searchInput')?.focus(), prefersReduced() ? 0 : 450);
    });

    // só oferece a busca no header quando a busca do hero não está mais visível
    const heroSearch = $('.hero-search');
    const header = $('#siteHeader');
    if (!heroSearch || !header || !('IntersectionObserver' in window)) {
      header && header.classList.add('search-visible');
      return;
    }
    new IntersectionObserver(([entry]) => {
      header.classList.toggle('search-visible', !entry.isIntersecting);
    }, { rootMargin: '-70px 0px 0px 0px' }).observe(heroSearch);
  }

  /* abre o simulador direto se a URL vier com #id (links compartilháveis) */
  function openFromHash() {
    const id = decodeURIComponent(location.hash.replace('#', ''));
    if (id && TOPICS.some(t => t.id === id && t.status === 'ready')) openSim(id, true);
  }

  /* ----------------------------------------------------------------
     bootstrap
  ---------------------------------------------------------------- */
  /* revela os ícones só quando a fonte confirma carregamento (ver CSS).
     O timeout é a rede de segurança: se a detecção falhar por qualquer
     motivo, os ícones aparecem mesmo assim em vez de sumirem pra sempre. */
  function initIconFont() {
    const reveal = () => document.documentElement.classList.add('icons-ready');
    if (document.fonts && document.fonts.load) {
      document.fonts.load('17px "Material Symbols Outlined"')
        .then(reveal).catch(reveal);
    }
    setTimeout(reveal, 2500);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initIconFont();
    buildCards();
    buildQuickFaq();
    buildChips();
    initSearch();
    initModal();
    initReveal();
    initScrollProgress();
    initHeaderSearch();
    $('#resultCount').textContent = '';
    const yearEl = $('#footerYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    openFromHash();
    // links do rodapé (#id) abrem o simulador
    window.addEventListener('hashchange', () => {
      if (!modal.overlay.classList.contains('show')) openFromHash();
    });
  });

  // expõe para debugging manual, se necessário
  window.PortalFAQ = { openSim, closeSim };
})();
