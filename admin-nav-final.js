/* Coyohoot Admin Final Navigation — navegación simple y estable */
(() => {
  'use strict';

  const ready = (fn) => document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', fn, { once: true })
    : fn();

  const route = () => (document.body.dataset.adminRoute || 'home').trim();

  function go(file) {
    if (!file) return;
    window.location.href = file;
  }

  function makeLogoGoHome() {
    const logoBox = document.querySelector('.logo-container');
    const logo = document.querySelector('.logo-container .logo, img.logo');
    if (!logoBox && !logo) return;
    const target = logoBox || logo;
    target.classList.add('admin-logo-home-link');
    target.setAttribute('role', 'link');
    target.setAttribute('tabindex', '0');
    target.setAttribute('title', 'Ir al menú principal');
    target.setAttribute('aria-label', 'Ir al menú principal de administrador');

    const handler = (event) => {
      event.preventDefault();
      event.stopPropagation();
      go('admin.html');
    };
    target.addEventListener('click', handler);
    target.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') handler(event);
    });
  }

  function navHtml(currentRoute) {
    if (currentRoute === 'home') {
      return `
        <div class="admin-simple-nav home-nav" aria-label="Navegación principal de administrador">
          <a class="admin-nav-card" href="admin-crear.html" data-admin-nav="admin-crear.html">
            <span>📝</span><strong>Crear quiz</strong><small>Preguntas reutilizables para cualquier modo</small>
          </a>
          <a class="admin-nav-card" href="admin-controlar.html" data-admin-nav="admin-controlar.html">
            <span>🎮</span><strong>Controlar partida</strong><small>Modo, equipos y pantalla en vivo</small>
          </a>
        </div>`;
    }
    if (currentRoute === 'create') {
      return `
        <div class="admin-simple-nav compact-nav" aria-label="Navegación de creación">
          <button type="button" class="admin-home-logo-hint" data-admin-go="admin.html">🏠 Menú principal <small>también puedes tocar el logo</small></button>
          <a class="admin-nav-pill" href="admin-controlar.html" data-admin-nav="admin-controlar.html">🎮 Controlar partida</a>
        </div>`;
    }
    if (currentRoute === 'control') {
      return `
        <div class="admin-simple-nav compact-nav" aria-label="Navegación de control">
          <button type="button" class="admin-home-logo-hint" data-admin-go="admin.html">🏠 Menú principal <small>también puedes tocar el logo</small></button>
          <a class="admin-nav-pill" href="admin-crear.html" data-admin-nav="admin-crear.html">📝 Crear quiz</a>
        </div>`;
    }
    return `
      <div class="admin-simple-nav compact-nav" aria-label="Navegación de administrador">
        <button type="button" class="admin-home-logo-hint" data-admin-go="admin.html">🏠 Menú principal <small>también puedes tocar el logo</small></button>
        <a class="admin-nav-pill" href="admin-crear.html" data-admin-nav="admin-crear.html">📝 Crear quiz</a>
        <a class="admin-nav-pill" href="admin-controlar.html" data-admin-nav="admin-controlar.html">🎮 Controlar partida</a>
      </div>`;
  }

  function ensureNav() {
    const panel = document.getElementById('adminPanel');
    if (!panel) return;
    const currentRoute = route();
    let nav = panel.querySelector('.admin-simple-nav');
    if (!nav) {
      const anchor = panel.querySelector('.admin-home-welcome') || panel.querySelector('.card');
      const wrapper = document.createElement('div');
      wrapper.innerHTML = navHtml(currentRoute).trim();
      nav = wrapper.firstElementChild;
      if (anchor && anchor.nextSibling) anchor.parentNode.insertBefore(nav, anchor.nextSibling);
      else panel.insertBefore(nav, panel.firstChild);
    }
  }

  function cleanHomeMenu() {
    const currentRoute = route();
    const panel = document.getElementById('adminPanel');
    if (!panel) return;

    // Secciones pesadas solo viven en sus páginas dedicadas.
    if (currentRoute === 'home') {
      ['sectionEditor', 'sectionControl', 'sectionParticipants', 'sectionRanking'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
      });
      const oldGrid = panel.querySelector('.admin-menu-grid');
      if (oldGrid) oldGrid.classList.add('hidden');
      const oldQuick = panel.querySelector('.admin-quick-links');
      if (oldQuick) oldQuick.classList.add('hidden');
    }

    if (currentRoute === 'create' || currentRoute === 'control') {
      panel.querySelectorAll('.admin-quick-links, .admin-menu-grid').forEach((el) => el.classList.add('hidden'));
      const showId = currentRoute === 'create' ? 'sectionEditor' : 'sectionControl';
      ['sectionEditor', 'sectionControl', 'sectionParticipants', 'sectionRanking'].forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.toggle('hidden', id !== showId);
      });
    }
  }

  ready(() => {
    makeLogoGoHome();
    ensureNav();
    cleanHomeMenu();

    document.addEventListener('click', (event) => {
      const goBtn = event.target.closest('[data-admin-go]');
      if (!goBtn) return;
      event.preventDefault();
      event.stopPropagation();
      go(goBtn.getAttribute('data-admin-go'));
    }, true);

    // Reaplica después del login y de renders del panel.
    const run = () => { ensureNav(); cleanHomeMenu(); };
    [100, 350, 900, 1600].forEach((ms) => setTimeout(run, ms));
    const panel = document.getElementById('adminPanel');
    if (panel) {
      new MutationObserver(run).observe(panel, { attributes: true, childList: true, subtree: false });
    }
  });
})();
