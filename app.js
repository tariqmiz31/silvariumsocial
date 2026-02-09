(function(){
  const SUPPORTED = ["en","ar"];

  function detectLang(){
    const saved = localStorage.getItem("lang");
    if (saved && SUPPORTED.includes(saved)) return saved;
    const nav = (navigator.language || "en").toLowerCase();
    return nav.startsWith("ar") ? "ar" : "en";
  }

  function setLang(lang){
    if (!SUPPORTED.includes(lang)) lang = "en";
    localStorage.setItem("lang", lang);

    const isAr = lang === "ar";
    document.documentElement.lang = lang;
    document.body.setAttribute("dir", isAr ? "rtl" : "ltr");

    // Toggle buttons
    document.querySelectorAll("[data-lang-btn]").forEach(btn=>{
      btn.classList.toggle("active", btn.getAttribute("data-lang-btn") === lang);
    });

    // Replace text
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const key = el.getAttribute("data-i18n");
      const val = (window.I18N && window.I18N[lang] && window.I18N[lang][key]) || null;
      if (val !== null){
        el.textContent = val;
      }
    });

    // Replace placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{
      const key = el.getAttribute("data-i18n-placeholder");
      const val = (window.I18N && window.I18N[lang] && window.I18N[lang][key]) || null;
      if (val !== null){
        el.setAttribute("placeholder", val);
      }
    });
  }

  window.SilvaLang = { detectLang, setLang };

  document.addEventListener("DOMContentLoaded", ()=>{
    setLang(detectLang());

    document.querySelectorAll("[data-lang-btn]").forEach(btn=>{
      btn.addEventListener("click", ()=> setLang(btn.getAttribute("data-lang-btn")));
    });
  });
})();
