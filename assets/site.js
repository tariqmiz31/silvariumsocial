// assets/site.js
(function () {
  const saved = localStorage.getItem("lang");
  const device = (navigator.language || "en").toLowerCase().startsWith("ar") ? "ar" : "en";
  const lang = saved || device;

  function apply(lang) {
    document.querySelectorAll(".lang-block").forEach(el => {
      const is = el.getAttribute("data-lang") === lang;
      el.hidden = !is;
    });

    const btnEn = document.getElementById("btn-en");
    const btnAr = document.getElementById("btn-ar");
    if (btnEn && btnAr) {
      btnEn.setAttribute("aria-pressed", String(lang === "en"));
      btnAr.setAttribute("aria-pressed", String(lang === "ar"));
    }

    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    localStorage.setItem("lang", lang);
  }

  window.setLang = apply;

  document.addEventListener("DOMContentLoaded", () => {
    const btnEn = document.getElementById("btn-en");
    const btnAr = document.getElementById("btn-ar");
    if (btnEn) btnEn.addEventListener("click", () => apply("en"));
    if (btnAr) btnAr.addEventListener("click", () => apply("ar"));
    apply(lang);
  });
})();
