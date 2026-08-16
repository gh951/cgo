/* ══ 소스 가림막 (MUFE 기준) ══
   완전히 못 보게 막을 수는 없다 — 웹은 원래 열려 있다. 정직하게 말한다.
   다만 지나가는 사람이 쉽게 들추지 못하게 하고, 들추면 기록을 남긴다.

   여기서 도는 것은 이벤트를 듣는 일뿐이다. 계산이 없으므로 속도에 영향 없다. */
(function(){
  'use strict';

  var ON = true;   /* 개발 중에는 window._cgoGuardOff = true 로 끌 수 있다 */
  try{ if(window._cgoGuardOff) ON = false; }catch(e){}
  if(!ON) return;

  function note(what){
    try{ if(window.cgoNote) window.cgoNote('[가림막] ' + what); }catch(e){}
  }

  /* ① 오른쪽 눌러 소스 보기 — 막는다 (초시계는 복사를 써야 하므로 남긴다) */
  document.addEventListener('contextmenu', function(e){
    var t = e.target;
    while(t && t !== document.body){
      if(t.id === 'spd') return;                 /* 초시계는 그대로 */
      if(t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return;
      t = t.parentElement;
    }
    e.preventDefault();
    note('오른쪽 누름');
  }, true);

  /* ② 소스 보기·저장 단축키 — 막는다 */
  document.addEventListener('keydown', function(e){
    var k = (e.key || '').toLowerCase();
    var ctrl = e.ctrlKey || e.metaKey;
    if(k === 'f12'
      || (ctrl && e.shiftKey && (k === 'i' || k === 'j' || k === 'c'))
      || (ctrl && (k === 'u' || k === 's'))){
      e.preventDefault();
      note('단축키 ' + (ctrl ? 'Ctrl+' : '') + (e.shiftKey ? 'Shift+' : '') + k);
      return false;
    }
  }, true);

  /* ③ 글자 끌어 담기 — 막는다 (입력칸과 결과 글은 그대로) */
  document.addEventListener('selectstart', function(e){
    var t = e.target;
    if(!t || !t.tagName) return;
    if(t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return;
    if(t.isContentEditable) return;
    /* 결과·리포트는 사용자가 복사할 수 있어야 한다 */
    var p = t;
    while(p && p !== document.body){
      if(p.id && /Result|result|Report|report|Body|body/.test(p.id)) return;
      p = p.parentElement;
    }
    e.preventDefault();
  }, true);

  /* ④ 끌어 옮기기 — 막는다 */
  document.addEventListener('dragstart', function(e){ e.preventDefault(); }, true);

  /* ⑤ 개발자 창이 열렸는지 살핀다 — 열리면 기록만 남긴다 (앱을 멈추지 않는다) */
  (function(){
    var seen = false;
    setInterval(function(){
      var wide = (window.outerWidth - window.innerWidth) > 220;
      var tall = (window.outerHeight - window.innerHeight) > 220;
      var open = wide || tall;
      if(open && !seen){ seen = true; note('개발자 창 열림'); }
      else if(!open && seen){ seen = false; }
    }, 2000);
  })();

  /* ⑥ 콘솔에 남기는 한 줄 — 호기심으로 여는 사람에게 */
  try{
    setTimeout(function(){
      console.log('%c CGO-FULI ', 'background:#0d9488;color:#fff;font-weight:900;padding:4px 10px;border-radius:4px');
      console.log('%c 이 앱의 보안은 MUFE 로 지켜집니다. 여기 붙여넣는 글은 당신의 자료를 위험하게 만들 수 있습니다.',
                  'color:#b45309;font-size:12px');
    }, 1500);
  }catch(e){}
})();
