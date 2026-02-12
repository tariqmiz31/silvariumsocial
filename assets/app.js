(function () {
  const supported = ["en", "ar"];
  const STORAGE_KEY = "silva_lang";

  function normalizeLang(v) {
    v = (v || "").toLowerCase().trim();
    if (v.startsWith("ar")) return "ar";
    return "en";
  }

  function preferred() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && supported.includes(saved)) return saved;
    return normalizeLang(navigator.language || "en");
  }

  function setDir(lang) {
    document.documentElement.lang = lang === "ar" ? "ar" : "en";
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }

  async function loadI18n() {
    // ✅ كسر كاش المتصفح/CDN بشكل صريح
    const url = `/assets/i18n.json?v=${Date.now()}`;

    const res = await fetch(url, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    });

    // إذا فشل التحميل لا نكسر الصفحة
    if (!res.ok) {
      console.warn("i18n.json not loaded:", res.status);
      window.SILVA_I18N = window.SILVA_I18N || {};
      return;
    }

    window.SILVA_I18N = await res.json();
  }

  function apply(lang) {
    setDir(lang);
    localStorage.setItem(STORAGE_KEY, lang);

    const map = window.SILVA_I18N || {};

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const t =
        (map[lang] && map[lang][key]) ||
        (map["en"] && map["en"][key]) ||
        "";

      if (el.hasAttribute("data-i18n-html")) {
        el.innerHTML = t;
      } else {
        el.textContent = t;
      }
    });

    // زر اللغة
    const b = document.getElementById("langToggle");
    if (b) {
      const label = lang === "ar" ? "English" : "العربية";
      const lab = b.querySelector(".label");
      if (lab) lab.textContent = label;
      b.setAttribute("data-current", lang);
    }
  }

  async function boot() {
    await loadI18n();
    apply(preferred());

    const b = document.getElementById("langToggle");
    if (b) {
      b.addEventListener("click", () => {
        const cur = localStorage.getItem(STORAGE_KEY) || preferred();
        apply(cur === "ar" ? "en" : "ar");
      });
    }
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
