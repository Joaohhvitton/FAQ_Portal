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

      const stepsHtml = pending ? '' : `<span class="steps-count">${stepsLabel(t.steps.length)}</span>`;
      const cta = pending
        ? '<div class="cta pending-tag">Em breve</div>'
        : '<div class="cta">Ver tutorial <span class="arrow">›</span></div>';

      card.innerHTML = `
        <div class="txt">
          <h3>${t.question}</h3>
          <p>${t.summary}</p>
          ${stepsHtml}
        </div>
        ${cta}`;

      if (!pending) {
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.addEventListener('click', () => openSim(t.id));
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSim(t.id); }
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
  function initSearch() {
    const input = $('#searchInput');
    const clear = $('#searchClear');
    const empty = $('#emptyState');
    const count = $('#resultCount');
    const sections = Array.from(document.querySelectorAll('.faq-section'));

    function filter() {
      const q = normalize(input.value.trim());
      clear.hidden = q.length === 0;
      let visible = 0;

      sections.forEach((sec) => {
        const hay = normalize(
          sec.dataset.keywords + ' ' +
          ($('h3', sec)?.textContent || '') + ' ' +
          ($('.txt p', sec)?.textContent || '')
        );
        const match = q === '' || hay.includes(q);
        sec.style.display = match ? '' : 'none';
        if (match) visible++;
      });

      empty.hidden = visible !== 0;
      count.textContent = q === ''
        ? TOPICS.length + ' assuntos'
        : visible + (visible === 1 ? ' resultado' : ' resultados');
    }

    function clearSearch() {
      input.value = '';
      filter();
      input.focus();
    }

    input.addEventListener('input', filter);
    clear.addEventListener('click', clearSearch);

    // chips "mais buscados"
    const chips = Array.from(document.querySelectorAll('.qc'));
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const q = chip.dataset.q;
        const already = chip.classList.contains('active');
        input.value = already ? '' : q;
        filter();
        chips.forEach(c => c.classList.toggle('active', c === chip && !already));
        input.focus();
      });
    });
    // ao digitar manualmente, desmarca os chips
    input.addEventListener('input', () => chips.forEach(c => c.classList.remove('active')));

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
    dots: null, prev: null, next: null, tabs: null,
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
    modal.tabs = $('#tabNav');
  }

  function openSim(id, fromHash) {
    modal.topic = TOPICS.find(t => t.id === id);
    if (!modal.topic || modal.topic.status !== 'ready') return;
    modal.step = 0;
    modal.lastFocus = document.activeElement;
    renderSim(false);
    modal.overlay.classList.add('show');
    modal.overlay.setAttribute('aria-hidden', 'false');
    lockScroll();
    if (!fromHash) history.replaceState(null, '', '#' + id);
    modal.next.focus();
  }

  function closeSim() {
    modal.overlay.classList.remove('show');
    modal.overlay.setAttribute('aria-hidden', 'true');
    unlockScroll();
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
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

  function renderTabs() {
    modal.tabs.innerHTML = '';
    READY.forEach((t) => {
      const b = document.createElement('button');
      b.className = 'tab-btn' + (t.id === modal.topic.id ? ' active' : '');
      b.textContent = t.tab;
      b.addEventListener('click', () => { modal.topic = t; modal.step = 0; renderSim(true); });
      modal.tabs.appendChild(b);
    });
  }

  // animate=true: crossfade só da tela+texto (troca de passo/aba)
  function renderSim(animate) {
    const t = modal.topic;
    const s = t.steps[modal.step];
    const wide = s.wide !== undefined ? s.wide : !!t.wide;

    $('.sim-body').classList.toggle('stacked', wide);
    renderTabs();

    const paint = () => {
      modal.stage.innerHTML = `<div class="stage-inner">${s.screen}</div>`;
      modal.badge.textContent = `Passo ${modal.step + 1} de ${t.steps.length}`;
      modal.title.textContent = s.title;
      modal.text.textContent = s.text;

      modal.dots.innerHTML = '';
      t.steps.forEach((_, i) => {
        const d = document.createElement('span');
        d.className = 'dot' + (i === modal.step ? ' active' : '');
        modal.dots.appendChild(d);
      });

      modal.prev.disabled = modal.step === 0;
      modal.next.textContent = modal.step === t.steps.length - 1 ? 'Concluir' : 'Próximo ›';
      modal.progress.style.width = (((modal.step + 1) / t.steps.length) * 100) + '%';
    };

    if (animate && !prefersReduced()) {
      const inners = modal.stage.querySelectorAll('.stage-inner');
      inners.forEach(el => el.classList.add('swap'));
      setTimeout(() => {
        paint();
        requestAnimationFrame(() => {
          const el = modal.stage.querySelector('.stage-inner');
          if (el) { el.classList.add('swap'); requestAnimationFrame(() => el.classList.remove('swap')); }
        });
      }, 150);
    } else {
      paint();
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
          // pequeno stagger conforme entram
          setTimeout(() => entry.target.classList.add('visible'), i * 60);
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
  }

  /* abre o simulador direto se a URL vier com #id (links compartilháveis) */
  function openFromHash() {
    const id = decodeURIComponent(location.hash.replace('#', ''));
    if (id && TOPICS.some(t => t.id === id && t.status === 'ready')) openSim(id, true);
  }

  /* ----------------------------------------------------------------
     bootstrap
  ---------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    buildCards();
    initSearch();
    initModal();
    initReveal();
    initScrollProgress();
    initHeaderSearch();
    $('#resultCount').textContent = TOPICS.length + ' assuntos';
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
