/* Coyohoot UI Enhancements — seguro, pasivo y compatible con GitHub Pages */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  }

  function safeText(value) {
    return String(value || '').trim();
  }

  function ensureToastHost() {
    let host = $('#coyohootToastHost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'coyohootToastHost';
      host.className = 'toast-host';
      host.setAttribute('aria-live', 'polite');
      host.setAttribute('aria-atomic', 'true');
      document.body.appendChild(host);
    }
    return host;
  }

  function toast(message, type = 'info', timeout = 3200) {
    const host = ensureToastHost();
    const item = document.createElement('div');
    item.className = `toast toast-${type}`;
    const icons = { success: '✅', error: '⚠️', warn: '⚡', info: '🐺' };
    item.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span>${message}</span>`;
    host.appendChild(item);
    requestAnimationFrame(() => item.classList.add('show'));
    window.setTimeout(() => {
      item.classList.remove('show');
      window.setTimeout(() => item.remove(), 280);
    }, timeout);
  }

  window.coyoToast = toast;
  if (!window.showToast) window.showToast = toast;

  function decoratePage() {
    document.documentElement.classList.add('coyo-js-ready');
    document.body.classList.add('coyo-enhanced');

    // Marca el tipo de pantalla para CSS sin depender de que cada HTML tenga clases perfectas.
    const path = location.pathname.toLowerCase();
    if (path.includes('admin')) document.body.classList.add('is-admin-page');
    if (path.includes('participante') || path.includes('clasico') || path.includes('supervivencia') || path.includes('carrera') || path.includes('boss-participante') || path.includes('battle-participante') || path.includes('caos-participante')) {
      document.body.classList.add('is-player-page');
    }
    if (path.includes('pantalla') || path.includes('boss.html') || path.includes('battle.html') || path.includes('caos.html')) {
      document.body.classList.add('is-presentation-page');
    }
  }

  function enhanceForms() {
    $$('input, textarea, select').forEach((field) => {
      field.classList.add('coyo-field');
      if (!field.getAttribute('autocomplete') && field.tagName !== 'SELECT' && field.type !== 'password') {
        field.setAttribute('autocomplete', field.name || field.id || 'off');
      }
      if (field.tagName === 'TEXTAREA') {
        const resize = () => {
          field.style.height = 'auto';
          field.style.height = Math.min(field.scrollHeight, 280) + 'px';
        };
        field.addEventListener('input', resize, { passive: true });
        resize();
      }
    });

    // Botón para ver/ocultar contraseña sin tocar la lógica de login.
    $$('input[type="password"]').forEach((input) => {
      const parent = input.parentElement;
      if (!parent || parent.querySelector('.password-toggle') || parent.querySelector('.password-eye-btn') || input.dataset.toggleReady === '1') return;
      input.dataset.toggleReady = '1';
      parent.classList.add('password-wrap');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'password-toggle';
      btn.textContent = '👁️';
      btn.setAttribute('aria-label', 'Mostrar u ocultar contraseña');
      btn.addEventListener('click', () => {
        input.type = input.type === 'password' ? 'text' : 'password';
        btn.textContent = input.type === 'password' ? '👁️' : '🙈';
      });
      parent.appendChild(btn);
    });

    // Feedback visual suave al validar formularios nativos.
    $$('form').forEach((form) => {
      form.addEventListener('submit', (e) => {
        if (!form.checkValidity()) {
          e.preventDefault();
          form.classList.add('shake-soft');
          toast('Revisa los campos marcados antes de continuar.', 'warn');
          window.setTimeout(() => form.classList.remove('shake-soft'), 450);
        }
      });
    });
  }

  function enhanceButtons() {
    $$('button, .btn-primary, .btn-secondary, .btn-outline, a[href]').forEach((el) => {
      if (!el.classList.contains('coyo-action')) el.classList.add('coyo-action');
      if (el.tagName === 'BUTTON' && !el.getAttribute('type')) el.setAttribute('type', 'button');
    });

    if (prefersReducedMotion) return;
    document.addEventListener('pointerdown', (event) => {
      const target = event.target.closest('button, .btn-primary, .btn-secondary, .btn-outline, .option-btn, .mode-option, .avatar-card');
      if (!target || target.disabled) return;
      const rect = target.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'coyo-ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
      target.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 600);
    }, { passive: true });
  }

  function enhanceMessages() {
    $$('.message, #message, #adminMessage, #loginMessage, #participantMessage, #joinMessage').forEach((el) => {
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
    });

    const loadingWords = ['cargando', 'esperando', 'conectando'];
    $$('p, div, span, h2, h3').forEach((el) => {
      if (el.children.length > 0) return;
      const text = safeText(el.textContent).toLowerCase();
      if (loadingWords.some((word) => text.includes(word))) {
        el.classList.add('coyo-loading-text');
      }
    });
  }

  function enhanceTables() {
    $$('table').forEach((table) => {
      const parent = table.parentElement;
      if (!parent || parent.classList.contains('table-scroll-wrap')) return;
      const wrap = document.createElement('div');
      wrap.className = 'table-scroll-wrap';
      parent.insertBefore(wrap, table);
      wrap.appendChild(table);
    });
  }

  function enhanceAvatars() {
    const avatarSelectors = [
      'img[src*="Avatares/"]',
      '.avatar-card img', '.podio-avatar img', '.race-avatar-img', '.race-track-avatar img',
      '.avatar-img-mini', '.boss-avatar-sm', '.boss-avatar-md', '.battle-avatar-sm', '.battle-avatar-md',
      '.chaos-avatar-sm', '.chaos-avatar-md', '.player-card-avatar img', '.final-avatar-img', '.top3-avatar-img'
    ].join(',');

    $$(avatarSelectors).forEach((img) => {
      img.classList.add('coyo-avatar-img');
      img.loading = img.loading || 'lazy';
      img.decoding = img.decoding || 'async';
      img.onerror = function () {
        if (!this.dataset.fallbackApplied) {
          this.dataset.fallbackApplied = '1';
          this.src = 'Avatares/Avatar1.svg';
        }
      };
    });
  }

  function enhanceCardsAndLists() {
    $$('.card, .quiz-card, .mode-option, .avatar-card, .podio-card, .battle-card, .boss-card, .chaos-card, .screen-card').forEach((el, index) => {
      el.classList.add('coyo-lift-card');
      if (!prefersReducedMotion) el.style.setProperty('--stagger', `${Math.min(index, 12) * 28}ms`);
    });

    // Da mejor feedback a opciones seleccionables por teclado.
    $$('.mode-option, .avatar-card, .option-btn').forEach((el) => {
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    });
  }

  function watchDynamicContent() {
    let scheduled = false;
    const rerun = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        enhanceAvatars();
        enhanceMessages();
        enhanceCardsAndLists();
      });
    };
    const observer = new MutationObserver((mutations) => {
      if (mutations.some((m) => m.addedNodes.length || m.type === 'attributes')) rerun();
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'src'] });
  }

  function stepScrollHelper() {
    if (!document.body.classList.contains('is-player-page')) return;
    const steps = $$('[id^="step"]');
    if (!steps.length) return;
    const observer = new MutationObserver((mutations) => {
      const becameVisible = mutations.some((m) => {
        const el = m.target;
        return el.id && el.id.startsWith('step') && !el.classList.contains('hidden');
      });
      if (becameVisible && !prefersReducedMotion) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
    steps.forEach((step) => observer.observe(step, { attributes: true, attributeFilter: ['class', 'style'] }));
  }

  function addSafeConfirmForDanger() {
    // Confirmación ligera para acciones destructivas del admin; no toca funciones existentes.
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button, a');
      if (!btn || !document.body.classList.contains('is-admin-page')) return;
      if (btn.dataset.coyoConfirmed === '1') return;
      const text = safeText(btn.textContent).toLowerCase();
      const dangerous = ['eliminar', 'borrar', 'reiniciar', 'detener'].some((word) => text.includes(word));
      if (!dangerous) return;
      if (!window.confirm(`¿Seguro que quieres ${safeText(btn.textContent).replace(/^[^a-zA-ZáéíóúÁÉÍÓÚñÑ]+/, '').toLowerCase()}?`)) {
        e.preventDefault();
        e.stopImmediatePropagation();
      } else {
        btn.dataset.coyoConfirmed = '1';
        window.setTimeout(() => { delete btn.dataset.coyoConfirmed; }, 1000);
      }
    }, true);
  }

  function networkAwareness() {
    window.addEventListener('offline', () => toast('Sin conexión. Firebase puede tardar en sincronizar.', 'warn', 5000));
    window.addEventListener('online', () => toast('Conexión recuperada.', 'success', 2600));
  }

  ready(() => {
    decoratePage();
    enhanceForms();
    enhanceButtons();
    enhanceMessages();
    enhanceTables();
    enhanceAvatars();
    enhanceCardsAndLists();
    stepScrollHelper();
    // Confirmaciones destructivas ya viven en los handlers del admin; no interceptar botones globalmente.
    networkAwareness();
    watchDynamicContent();
  });
})();
