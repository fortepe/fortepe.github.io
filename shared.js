/* Forte Project Engineering · shared.js · language toggle */
(function () {
  'use strict';
  var html = document.documentElement;
  var PAGE_TITLES = {
    'index': { es: 'Forte Project Engineering · Asesoría técnica para infraestructura crítica',
               en: 'Forte Project Engineering · Technical advisory for critical infrastructure' },
    'projects': { es: 'Proyectos · Forte Project Engineering', en: 'Projects · Forte Project Engineering' },
    'firma': { es: 'Firma · Forte Project Engineering', en: 'The Firm · Forte Project Engineering' },
    'team': { es: 'Firma · Forte Project Engineering', en: 'The Firm · Forte Project Engineering' },
    'contact': { es: 'Contacto · Forte Project Engineering', en: 'Contact · Forte Project Engineering' },
    'perspectivas': { es: 'Perspectivas · Forte Project Engineering', en: 'Perspectives · Forte Project Engineering' },
    'nota-monitoreo-catenaria': { es: 'Monitoreo de condición en catenaria: la economía de saber antes · Forte PE',
                                  en: 'Condition monitoring on overhead lines: the economics of knowing early · Forte PE' },
    'nota-prefactibilidad-pv-bess': { es: 'Prefactibilidad PV+BESS: las preguntas que fijan el CAPEX · Forte PE',
                                      en: 'PV+BESS pre-feasibility: the questions that set the CAPEX · Forte PE' }
  };
  function currentPage() {
    var path = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
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
    document.querySelectorAll('option[data-es]').forEach(function (o) {
      o.textContent = o.getAttribute('data-' + lang) || '';
    });
  }
  var savedLang;
  try { savedLang = localStorage.getItem('fortepe_lang'); } catch (e) {}
  applyLang(savedLang || ((navigator.language || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es'));
  var langBtn = document.getElementById('langToggle');
  if (langBtn) langBtn.addEventListener('click', function () {
    applyLang(html.getAttribute('lang') === 'es' ? 'en' : 'es');
  });
})();
