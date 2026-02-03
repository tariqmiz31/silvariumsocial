(function(){
  function setLang(l){
    const en=document.querySelector('[data-lang="en"]');
    const ar=document.querySelector('[data-lang="ar"]');
    if(!en||!ar) return;
    en.hidden=l==="ar";
    ar.hidden=l!=="ar";
    document.getElementById("btn-en").ariaPressed=l!=="ar";
    document.getElementById("btn-ar").ariaPressed=l==="ar";
    try{localStorage.setItem("legal_lang",l);}catch(e){}
  }
  document.addEventListener("click",e=>{
    if(e.target.id==="btn-en") setLang("en");
    if(e.target.id==="btn-ar") setLang("ar");
  });
  try{setLang(localStorage.getItem("legal_lang")||"en");}catch(e){setLang("en")}
})();
)) return;
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
