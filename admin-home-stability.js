/* Coyohoot Admin Home Stability Fix
   Mantiene el menú principal simple visible y navegable después del login. */
(() => {
  'use strict';

  const HOME_ROUTE = () => (document.body.dataset.adminRoute || 'home') === 'home';
  const $ = (sel) => document.querySelector(sel);

  function go(target) {
    if (!target) return;
    window.location.href = target;
  }

  function ensureHomeMenu() {
    if (!HOME_ROUTE()) return;
    const panel = $('#adminPanel');
    if (!panel || panel.classList.contains('hidden')) return;

    // Oculta las zonas pesadas del admin principal. Crear/controlar viven en sus páginas.
    ['sectionEditor', 'sectionControl', 'sectionParticipants', 'sectionRanking'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
    panel.querySelectorAll('.admin-menu-grid, .admin-quick-links').forEach((el) => el.classList.add('hidden'));

    let nav = document.getElementById('adminHomeNavHard');
    if (!nav) {
      nav = document.createElement('nav');
      nav.id = 'adminHomeNavHard';
      nav.className = 'admin-home-nav-hard';
      nav.setAttribute('aria-label', 'Menú principal de administrador');
      nav.innerHTML = `
        <button type="button" class="admin-home-action-hard" data-admin-go="admin-crear.html">
          <span class="hard-icon">📝</span>
          <span class="hard-title">Crear quiz</span>
          <small>Arma preguntas reutilizables para cualquier modo.</small>
        </button>
        <button type="button" class="admin-home-action-hard" data-admin-go="admin-controlar.html">
          <span class="hard-icon">🎮</span>
          <span class="hard-title">Controlar partida</span>
          <small>Elige quiz, modo, equipos y pantalla en vivo.</small>
        </button>`;
      const welcome = panel.querySelector('.admin-home-welcome');
      if (welcome && welcome.nextSibling) welcome.parentNode.insertBefore(nav, welcome.nextSibling);
      else panel.insertBefore(nav, panel.firstChild);
    }

    nav.classList.remove('hidden');
    nav.style.display = 'grid';
    nav.style.pointerEvents = 'auto';
    nav.querySelectorAll('[data-admin-go]').forEach((btn) => {
      btn.disabled = false;
      btn.style.pointerEvents = 'auto';
    });
  }

  function boot() {
    ensureHomeMenu();
    document.addEventListener('click', (event) => {
      const btn = event.target.closest('#adminHomeNavHard [data-admin-go]');
      if (!btn) return;
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
      go(btn.getAttribute('data-admin-go'));
    }, true);

    const panel = document.getElementById('adminPanel');
    if (panel) {
      new MutationObserver(ensureHomeMenu).observe(panel, { attributes: true, attributeFilter: ['class'], childList: true });
    }
    [50, 200, 500, 1000, 1800].forEach((ms) => setTimeout(ensureHomeMenu, ms));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
