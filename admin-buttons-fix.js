/* Coyohoot Admin Buttons Fix — navegación robusta para GitHub Pages */
(() => {
  'use strict';
  const ready = (fn) => document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', fn, { once: true })
    : fn();

  const ADMIN_TARGETS = new Set([
    'admin.html',
    'admin-crear.html',
    'admin-controlar.html',
    'admin-jugadores.html',
    'index.html'
  ]);

  function cleanTarget(target) {
    if (!target) return '';
    const raw = String(target).trim();
    try {
      const url = new URL(raw, window.location.href);
      return url.pathname.split('/').pop() || raw;
    } catch (_) {
      return raw.replace(/^\.\//, '').split('#')[0].split('?')[0];
    }
  }

  function go(target) {
    const file = cleanTarget(target);
    if (!ADMIN_TARGETS.has(file)) return false;
    window.location.assign(file);
    return true;
  }

  ready(() => {
    document.querySelectorAll('button:not([type])').forEach((btn) => btn.setAttribute('type', 'button'));

    // Hace clickeable cualquier tarjeta/botón/link del menú admin aunque otro script falle.
    document.addEventListener('click', (event) => {
      const nav = event.target.closest('[data-admin-nav], a[href].quick-link-card, button.quick-link-card');
      if (!nav) return;
      const target = nav.getAttribute('data-admin-nav') || nav.getAttribute('href');
      if (!go(target)) return;
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
    }, true);

    // Respaldo para enlaces simples del admin.
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (!link || !document.body.classList.contains('admin-metal')) return;
      const href = link.getAttribute('href') || '';
      if (!go(href)) return;
      event.preventDefault();
      event.stopPropagation();
    }, true);

    // Tarjetas internas viejas: solo scroll, no navegación.
    document.querySelectorAll('.admin-menu-card[data-target]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        if (!target) return;
        target.classList.remove('hidden');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  });
})();
