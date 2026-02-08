(function () {
  const STORAGE_KEY = "silva_lang"; // "ar" | "en"
  const toggleBtn = document.getElementById("langToggle");

  const dict = {
    en: {
      title: "Silvarium Social",
      subtitle: "Professional Social Media Publishing Platform",
      desc:
        "Silvarium Social is a professional platform designed to help businesses and teams " +
        "publish, schedule, and manage content across supported social media platforms.\n\n" +
        "Access to the application is restricted to authorized users.",

      cta: "Access Application",
      contactCta: "Contact Support",

      terms: "Terms",
      privacy: "Privacy",
      dataDeletion: "Data Deletion",
      status: "System Status",
      contact: "Contact Support",
      backHome: "Back to Home",

      statusTitle: "System Status",
      statusOperational: "Current Status: Operational",
      statusBody:
        "Silvarium Social services are currently operational. " +
        "The platform is monitored to ensure reliability, security, and performance for authorized users. " +
        "If you are experiencing issues accessing the system, please contact support.",

      contactTitle: "Contact Support",
      contactBody:
        "For support inquiries related to Silvarium Social, please contact our support team. " +
        "Support is available for authorized users only.",
      emailLabel: "Email",

      copyright:
        "© Silvarium Social. All rights reserved.\nSilvarium is a registered brand name."
    },

    ar: {
      title: "Silvarium Social",
      subtitle: "منصة احترافية لنشر وإدارة المحتوى على منصات التواصل",
      desc:
        "Silvarium Social منصة احترافية تساعد الشركات والفرق على نشر المحتوى وجدولته وإدارته عبر منصات التواصل المدعومة.\n\n" +
        "الدخول إلى التطبيق متاح للمستخدمين المصرّح لهم فقط.",

      cta: "الدخول إلى التطبيق",
      contactCta: "التواصل مع الدعم",

      terms: "شروط الاستخدام",
      privacy: "سياسة الخصوصية",
      dataDeletion: "حذف البيانات",
      status: "حالة النظام",
      contact: "الدعم والتواصل",
      backHome: "العودة للرئيسية",

      statusTitle: "حالة النظام",
      statusOperational: "الحالة الحالية: تعمل بشكل طبيعي",
      statusBody:
        "خدمات Silvarium Social تعمل بشكل طبيعي حاليًا. " +
        "يتم مراقبة النظام لضمان الاعتمادية والأمان والأداء للمستخدمين المصرّح لهم. " +
        "إذا واجهت مشكلة في الوصول، يرجى التواصل مع الدعم.",

      contactTitle: "الدعم والتواصل",
      contactBody:
        "للاستفسارات والدعم الفني المتعلقة بمنصة Silvarium Social، يرجى التواصل مع فريق الدعم.\n" +
        "الدعم متاح للمستخدمين المصرّح لهم فقط.",
      emailLabel: "البريد الإلكتروني",

      copyright:
        "© Silvarium Social. جميع الحقوق محفوظة.\nSilvarium علامة تجارية مسجلة."
    }
  };

  function normalizeLang(l) {
    if (!l) return "en";
    const lower = String(l).toLowerCase();
    if (lower.startsWith("ar")) return "ar";
    return "en";
  }

  function detectDeviceLang() {
    // navigator.languages أفضل من navigator.language
    const langs = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : [navigator.language || "en"];
    return normalizeLang(langs[0]);
  }

  function setLang(lang) {
    const l = normalizeLang(lang);

    // direction
    document.documentElement.lang = (l === "ar" ? "ar" : "en");
    document.documentElement.dir = (l === "ar" ? "rtl" : "ltr");

    // translate
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const text = dict[l][key];
      if (typeof text === "string") {
        // Preserve line breaks
        el.textContent = text;
      }
    });

    // toggle label
    if (toggleBtn) toggleBtn.textContent = (l === "ar" ? "EN" : "AR");

    // Save
    try { localStorage.setItem(STORAGE_KEY, l); } catch (e) {}
  }

  function getInitialLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return normalizeLang(saved);
    } catch (e) {}
    return detectDeviceLang();
  }

  // init
  setLang(getInitialLang());

  // toggle
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = normalizeLang(document.documentElement.lang);
      setLang(current === "ar" ? "en" : "ar");
    });
  }
})();
