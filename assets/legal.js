(function () {
  function setLang(lang) {
    const en = document.querySelector('[data-lang="en"]');
    const ar = document.querySelector('[data-lang="ar"]');
    const btnEn = document.getElementById('btn-en');
    const btnAr = document.getElementById('btn-ar');

    if (!en || !ar || !btnEn || !btnAr) return;

    const isAr = lang === 'ar';

    // show/hide blocks
    en.hidden = isAr;
    ar.hidden = !isAr;

    // update button states (IMPORTANT: attribute not property)
    btnEn.setAttribute('aria-pressed', String(!isAr));
    btnAr.setAttribute('aria-pressed', String(isAr));

    // update <html lang="">
    document.documentElement.setAttribute('lang', isAr ? 'ar' : 'en');

    // store preference
    try { localStorage.setItem('legal_lang', isAr ? 'ar' : 'en'); } catch (e) {}
  }

  // click handlers
  document.addEventListener('click', function (e) {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;

    if (t.id === 'btn-en') setLang('en');
    if (t.id === 'btn-ar') setLang('ar');
  });

  // init
  let pref = 'en';
  try {
    const saved = localStorage.getItem('legal_lang');
    if (saved === 'ar' || saved === 'en') pref = saved;
  } catch (e) {}

  setLang(pref);
})();

