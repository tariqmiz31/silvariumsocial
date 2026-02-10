(function () {
  const I18N = {
    ar: {
      "nav.login": "الدخول للتطبيق",
      "nav.lang": "English",
      "hero.kicker": "Brand & Compliance",
      "hero.title": "Silvarium Social",
      "hero.subtitle": "منصة احترافية لإدارة ونشر المحتوى للفريق عبر منصات التواصل الاجتماعي المدعومة.",
      "hero.reviewers": "Silvarium Social is a professional platform designed to help teams publish and manage content across supported social media platforms. Access to the application is restricted to authorized users.",
      "cards.links.title": "روابط السياسات",
      "cards.links.terms": "الشروط والأحكام",
      "cards.links.privacy": "سياسة الخصوصية",
      "cards.links.deletion": "حذف البيانات",
      "cards.links.contact": "الدعم والتواصل",
      "cards.links.status": "حالة النظام",
      "cards.info.title": "معلومة للمراجعين",
      "cards.info.p": "هذا النطاق يستخدم للتعريف بالعلامة التجارية والامتثال. روابط السياسات متاحة هنا، بينما التطبيق محمي ومتاح للمصرح لهم فقط.",
      "footer.brand": "سيلفاريوم",
      "footer.social": "سيلفاريوم سوشال",
      "footer.note": "© Silvarium Social. All rights reserved. Silvarium is a registered brand name.",
      "footer.domain": "This domain is used for brand identification and compliance purposes."
    },
    en: {
      "nav.login": "Access App",
      "nav.lang": "العربية",
      "hero.kicker": "Brand & Compliance",
      "hero.title": "Silvarium Social",
      "hero.subtitle": "Professional Social Media Publishing Platform for businesses and teams across supported social platforms.",
      "hero.reviewers": "Silvarium Social is a professional platform designed to help businesses and teams publish and manage content across supported social media platforms. Access to the application is restricted to authorized users.",
      "cards.links.title": "Policy Links",
      "cards.links.terms": "Terms of Service",
      "cards.links.privacy": "Privacy Policy",
      "cards.links.deletion": "Data Deletion",
      "cards.links.contact": "Contact & Support",
      "cards.links.status": "System Status",
      "cards.info.title": "Reviewer Note",
      "cards.info.p": "This domain is used for brand identification and compliance. Policy pages are available here, while the application is protected and restricted to authorized users only.",
      "footer.brand": "Silvarium",
      "footer.social": "Silvarium Social",
      "footer.note": "© Silvarium Social. All rights reserved. Silvarium is a registered brand name.",
      "footer.domain": "This domain is used for brand identification and compliance purposes."
    }
  };

  function detectLang() {
    const saved = localStorage.getItem("silva_lang");
    if (saved === "ar" || saved === "en") return saved;
    const nav = (navigator.language || "").toLowerCase();
    return nav.startsWith("ar") ? "ar" : "en";
  }

  function applyLang(lang) {
    const dict = I18N[lang] || I18N.en;
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === "ar") ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });

    // language button label
    const btn = document.getElementById("langToggle");
    if (btn) btn.textContent = dict["nav.lang"];
  }

  window.SILVA = {
    setLang: function (lang) {
      localStorage.setItem("silva_lang", lang);
      applyLang(lang);
    },
    toggleLang: function () {
      const cur = document.documentElement.lang || detectLang();
      const next = (cur === "ar") ? "en" : "ar";
      localStorage.setItem("silva_lang", next);
      applyLang(next);
    },
    init: function () {
      applyLang(detectLang());
    }
  };

  document.addEventListener("DOMContentLoaded", () => window.SILVA.init());
})();

