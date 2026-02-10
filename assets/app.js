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

  function apply(lang){
    setDir(lang);
    localStorage.setItem(STORAGE_KEY, lang);

    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const key = el.getAttribute("data-i18n");
      const map = window.SILVA_I18N || {};
      const t = (map[lang] && map[lang][key]) || (map["en"] && map["en"][key]) || "";
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

  document.addEventListener("DOMContentLoaded", ()=>{
    apply(preferred());
    const b = document.getElementById("langToggle");
    if(b) b.addEventListener("click", toggle);
  });
})();
