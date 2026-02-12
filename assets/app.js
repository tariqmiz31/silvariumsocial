(function(){

  const supported = ["en","ar"];
  const STORAGE_KEY = "silva_lang";

  function normalizeLang(v){
    v = (v||"").toLowerCase().trim();
    if(v.startsWith("ar")) return "ar";
    return "en";
  }

  function preferred(){
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved && supported.includes(saved)) return saved;
    return normalizeLang(navigator.language || "en");
  }

  function setDir(lang){
    document.documentElement.lang = (lang === "ar") ? "ar" : "en";
    document.documentElement.dir = (lang === "ar") ? "rtl" : "ltr";
  }

  async function loadI18n(){
    try{
      const url = `/assets/i18n.json?v=${Date.now()}`;
      const res = await fetch(url, { cache: "no-store" });
      if(!res.ok) return;
      window.SILVA_I18N = await res.json();
    }catch(e){
      console.warn("i18n load failed", e);
    }
  }

  function apply(lang){
    setDir(lang);
    localStorage.setItem(STORAGE_KEY, lang);

    const map = window.SILVA_I18N || {};

    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const key = el.getAttribute("data-i18n");
      const t = (map[lang] && map[lang][key]) ||
                (map["en"] && map["en"][key]);

      // ✅ لا تمسح النص لو ما فيه ترجمة
      if (t === undefined || t === null || t === "") return;

      if(el.hasAttribute("data-i18n-html")){
        el.innerHTML = t;
      } else {
        el.textContent = t;
      }
    });

    const b = document.getElementById("langToggle");
    if(b){
      const label = (lang === "ar") ? "English" : "العربية";
      const lab = b.querySelector(".label");
      if(lab) lab.textContent = label;
    }
  }

  function toggle(){
    const cur = localStorage.getItem(STORAGE_KEY) || preferred();
    apply(cur === "ar" ? "en" : "ar");
  }

  window.SilvaLang = { apply, toggle, preferred };

  document.addEventListener("DOMContentLoaded", async ()=>{
    await loadI18n();     // ⬅️ يحمل ملف الترجمة أولاً
    apply(preferred());   // ⬅️ يطبق اللغة بعد التحميل

    const b = document.getElementById("langToggle");
    if(b) b.addEventListener("click", toggle);
  });

})();
