/* ═══════════════════════════════════════════════════════
   Forte Project Engineering · shared.js
   Nav drawer · Language toggle · Footer year
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Year ── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ── Language toggle ── */
  var html    = document.documentElement;
  var langBtn = document.getElementById('langToggle');

  var PAGE_TITLES = {
    'index':    { es: 'Forte Project Engineering · Control técnico para infraestructura crítica',
                  en: 'Forte Project Engineering · Technical control for critical infrastructure' },
    'projects': { es: 'Proyectos · Forte Project Engineering',
                  en: 'Projects · Forte Project Engineering' },
    'team':     { es: 'Equipo · Forte Project Engineering',
                  en: 'Team · Forte Project Engineering' },
    'contact':  { es: 'Contacto · Forte Project Engineering',
                  en: 'Contact · Forte Project Engineering' },
  };

  function currentPage() {
    var path = window.location.pathname.replace(/\/$/, '').split('/').pop().replace('.html', '') || 'index';
    return PAGE_TITLES[path] ? path : 'index';
  }

  function applyLang(lang) {
    html.setAttribute('lang', lang);
    try { localStorage.setItem('fortepe_lang', lang); } catch (e) {}

    var titles = PAGE_TITLES[currentPage()];
    if (titles) document.title = titles[lang] || document.title;

    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      var desc = metaDesc.getAttribute('data-' + lang);
      if (desc) metaDesc.setAttribute('content', desc);
    }
  }

  var savedLang;
  try { savedLang = localStorage.getItem('fortepe_lang'); } catch (e) {}
  var initialLang = savedLang || ((navigator.language || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es');
  applyLang(initialLang);

  if (langBtn) {
    langBtn.addEventListener('click', function () {
      applyLang(html.getAttribute('lang') === 'es' ? 'en' : 'es');
    });
  }


  /* ── Drawer nav ── */
  var menuBtn = document.getElementById('menuBtn');
  var drawer  = document.getElementById('drawer');
  var overlay = document.getElementById('drawerOverlay');
  var closeBtn = document.getElementById('drawerClose');

  function openDrawer() {
    if (!drawer || !overlay) return;
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    menuBtn && menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Focus first link
    var first = drawer.querySelector('a');
    if (first) setTimeout(function () { first.focus(); }, 50);
  }

  function closeDrawer() {
    if (!drawer || !overlay) return;
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    menuBtn && menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    menuBtn && menuBtn.focus();
  }

  if (menuBtn)  menuBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay)  overlay.addEventListener('click', closeDrawer);

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) closeDrawer();
  });

  // Close on internal anchor click (same-page navigation)
  if (drawer) {
    drawer.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', closeDrawer);
    });
  }

  // Mark active page link
  if (drawer) {
    var page = currentPage();
    drawer.querySelectorAll('a[data-page]').forEach(function (a) {
      if (a.getAttribute('data-page') === page) a.classList.add('active');
    });
  }

})();
