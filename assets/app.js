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
    document.documentElement.dir  = (lang === "ar") ? "rtl" : "ltr";
  }

  // ✅ مهم: تحديد المسار الصحيح سواء دومين أو GitHub Pages
  function basePath(){
    // إذا مشروعك GitHub Pages على شكل /repoName/
    // يقرأ أول جزء من المسار كـ base (مثال: /silvariumsocial)
    const parts = location.pathname.split("/").filter(Boolean);
    const isGithub = location.hostname.includes("github.io");
    if(isGithub && parts.length) return "/" + parts[0];
    return "";
  }

  // ✅ تحميل الترجمات من assets/i18n.json مع كسر الكاش
  async function loadI18n(){
    const url = `${basePath()}/assets/i18n.json?v=${Date.now()}`;
    const res = await fetch(url, { cache: "no-store" });
    if(!res.ok) throw new Error("Failed to load i18n.json: " + res.status);
    window.SILVA_I18N = await res.json();
  }

  function apply(lang){
    setDir(lang);
    localStorage.setItem(STORAGE_KEY, lang);

    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const key = el.getAttribute("data-i18n");
      const map = window.SILVA_I18N || {};
      const t =
        (map[lang] && map[lang][key]) ||
        (map["en"] && map["en"][key]) ||
        "";

      if(el.hasAttribute("data-i18n-html")){
        el.innerHTML = t;
      }else{
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
    try {
      await loadI18n();              // ✅ هذا اللي كان ناقص
    } catch(e){
      console.error(e);
      window.SILVA_I18N = window.SILVA_I18N || {};
    }

    apply(preferred());

    const b = document.getElementById("langToggle");
    if(b) b.addEventListener("click", toggle);
  });
})();
