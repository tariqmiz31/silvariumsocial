(function () {
  function setLang(lang) {
    const en = document.querySelector('[data-lang="en"]');
    const ar = document.querySelector('[data-lang="ar"]');
    const btnEn = document.querySelector('#btn-en');
    const btnAr = document.querySelector('#btn-ar');

    if (!en || !ar || !btnEn || !btnAr) return;

    const isAr = lang === 'ar';
    en.hidden = isAr;
    ar.hidden = !isAr;

    btnEn.setAttribute('aria-pressed', String(!isAr));
    btnAr.setAttribute('aria-pressed', String(isAr));

    // Store preference
    try { localStorage.setItem('legal_lang', isAr ? 'ar' : 'en'); } catch(e) {}
  }

  document.addEventListener('click', function (e) {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    if (t.id === 'btn-en') setLang('en');
    if (t.id === 'btn-ar') setLang('ar');
  });

  // Init
  let pref = 'en';
  try {
    const saved = localStorage.getItem('legal_lang');
    if (saved === 'ar' || saved === 'en') pref = saved;
  } catch(e) {}
  setLang(pref);
})();
