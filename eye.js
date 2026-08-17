function _eyeSized(level, content, type){
    var sz = EYE_SIZE_BY_LEVEL[level].px;
    if(type === 'shape' || type === 'symbol' || type === 'direction'){
      return '<span style="font-size:' + sz + 'px;font-weight:900;color:#134e4a;line-height:1;display:inline-block;">' + content + '</span>';
    } else if(type === 'color'){
      // 색상 박스 = 시력 크기 그대로 정사각형
      var bg = content;  // hex 색
      return '<span style="display:inline-block;width:' + sz + 'px;height:' + sz + 'px;background:' + bg + ';border-radius:' + (sz/10) + 'px;"></span>';
    } else if(type === 'multi'){
      // 여러 개 (개수 세기, 다른 거 찾기) — 더 작게
      return '<span style="font-size:' + Math.round(sz*0.7) + 'px;color:#134e4a;letter-spacing:.3em;">' + content + '</span>';
    }
    return content;
  }

var EYE_QUESTIONS = [
    // ━━━ Level 1 (시력 0.1 · 80px) 매우 큼 · 5문항 ━━━
    {cat:'shape', level:1, q:'화면 도형은?',
     emoji: _eyeSized(1, '▲', 'shape'),
     opts:['삼각형','사각형','원','오각형'], correct:0},
    {cat:'color', level:1, q:'화면 색은?',
     emoji: _eyeSized(1, '#e74c3c', 'color'),
     opts:['빨강','파랑','초록','노랑'], correct:0},
    {cat:'symbol', level:1, q:'화면 숫자는?',
     emoji: _eyeSized(1, '7', 'symbol'),
     opts:['1','7','9','4'], correct:1},
    {cat:'direction', level:1, q:'화살표 방향은?',
     emoji: _eyeSized(1, '↑', 'direction'),
     opts:['↑ 위','↓ 아래','← 왼쪽','→ 오른쪽'], correct:0},
    {cat:'shape', level:1, q:'화면 도형은?',
     emoji: _eyeSized(1, '●', 'shape'),
     opts:['삼각형','사각형','원','별'], correct:2},

    // ━━━ Level 2 (시력 0.2 · 50px) 큼 · 5문항 ━━━
    {cat:'shape', level:2, q:'화면 도형은?',
     emoji: _eyeSized(2, '■', 'shape'),
     opts:['삼각형','사각형','원','육각형'], correct:1},
    {cat:'color', level:2, q:'화면 색은?',
     emoji: _eyeSized(2, '#3498db', 'color'),
     opts:['빨강','파랑','초록','노랑'], correct:1},
    {cat:'symbol', level:2, q:'화면 숫자는?',
     emoji: _eyeSized(2, '3', 'symbol'),
     opts:['8','3','5','9'], correct:1},
    {cat:'direction', level:2, q:'화살표 방향은?',
     emoji: _eyeSized(2, '→', 'direction'),
     opts:['↑ 위','↓ 아래','← 왼쪽','→ 오른쪽'], correct:3},
    {cat:'symbol', level:2, q:'화면 글자는?',
     emoji: _eyeSized(2, '한', 'symbol'),
     opts:['한','할','함','합'], correct:0},

    // ━━━ Level 3 (시력 0.32 · 32px) 중간 · 5문항 ━━━
    {cat:'shape', level:3, q:'화면 도형은?',
     emoji: _eyeSized(3, '◆', 'shape'),
     opts:['삼각형','마름모','원','별'], correct:1},
    {cat:'color', level:3, q:'화면 색은?',
     emoji: _eyeSized(3, '#27ae60', 'color'),
     opts:['빨강','파랑','초록','노랑'], correct:2},
    {cat:'symbol', level:3, q:'화면 숫자는?',
     emoji: _eyeSized(3, '5', 'symbol'),
     opts:['2','5','6','8'], correct:1},
    {cat:'direction', level:3, q:'화살표 방향은?',
     emoji: _eyeSized(3, '←', 'direction'),
     opts:['↑ 위','↓ 아래','← 왼쪽','→ 오른쪽'], correct:2},
    {cat:'symbol', level:3, q:'화면 글자는?',
     emoji: _eyeSized(3, '동', 'symbol'),
     opts:['동','등','독','돌'], correct:0},

    // ━━━ Level 4 (시력 0.5 · 20px) 작음 · 5문항 ━━━
    {cat:'shape', level:4, q:'화면 도형은?',
     emoji: _eyeSized(4, '★', 'shape'),
     opts:['삼각형','사각형','별','원'], correct:2},
    {cat:'color', level:4, q:'화면 색은?',
     emoji: _eyeSized(4, '#9b59b6', 'color'),
     opts:['보라','파랑','분홍','회색'], correct:0},
    {cat:'symbol', level:4, q:'화면 숫자는?',
     emoji: _eyeSized(4, '8', 'symbol'),
     opts:['3','6','8','9'], correct:2},
    {cat:'direction', level:4, q:'화살표 방향은?',
     emoji: _eyeSized(4, '↓', 'direction'),
     opts:['↑ 위','↓ 아래','← 왼쪽','→ 오른쪽'], correct:1},
    {cat:'symbol', level:4, q:'화면 글자는?',
     emoji: _eyeSized(4, '서', 'symbol'),
     opts:['서','석','선','설'], correct:0},

    // ━━━ Level 5 (시력 0.8 · 14px) 매우 작음 · 3문항 ━━━
    {cat:'shape', level:5, q:'화면 도형은?',
     emoji: _eyeSized(5, '▼', 'shape'),
     opts:['삼각형 위','삼각형 아래','마름모','사각형'], correct:1},
    {cat:'symbol', level:5, q:'화면 숫자는?',
     emoji: _eyeSized(5, '4', 'symbol'),
     opts:['1','4','7','9'], correct:1},
    {cat:'direction', level:5, q:'화살표 방향은?',
     emoji: _eyeSized(5, '↗', 'direction'),
     opts:['↗ 오른쪽 위','↘ 오른쪽 아래','↖ 왼쪽 위','↙ 왼쪽 아래'], correct:0},

    // ━━━ 카메라 측정 (rPPG / 눈동자 / 깜빡임) · 2문항 ━━━
    {cat:'fixation', level:0, q:'화면 중앙의 점을 3초간 응시하세요',
     emoji:'<span style="font-size:60px;color:#0f766e;display:inline-block;animation:eyePulse 2s ease-in-out infinite;">●</span>',
     opts:[], correct:0, autoTimer: 3000, hint:'카메라가 눈동자 안정성을 측정합니다'},
    {cat:'fixation', level:0, q:'천천히 3회 깜빡이세요',
     emoji:'<span style="font-size:60px;">👁️</span><div style="margin-top:8px;font-size:14px;color:#0f766e;font-weight:800;">깜빡 · 깜빡 · 깜빡</div>',
     opts:[], correct:0, autoTimer: 4000, hint:'카메라가 깜빡임 횟수를 측정합니다'}
  ];;

/* ══ 나의 눈 건강 — 측정 (구 CGO 구조 + 오늘 넣은 정밀 기술) ══
   눈동자 추적 · 깜빡임 · 눈가 rPPG · 시각 반응 25문항 · 눈 선명도 지수
   거리 판정은 채움 비율(cgoFitState)로 — 눈 7cm 기준 */

function _ek(n, f){ try{ var v=window.K&&window.K(n); return (v&&v!==String(n))?v:f; }catch(e){ return f; } }

window._eye = { side:null, tier:'basic', run:null, stream:null };
try{ var _et=localStorage.getItem('cgo_eye_tier'); if(_et) window._eye.tier=_et; }catch(e){}

window.eyePick = function(side){
  window._eye.side = side;
  ['L','R'].forEach(function(s){
    var el = document.getElementById('eye-pick-' + s);
    if(!el) return;
    var on = (s === side);
    el.style.border = on ? '2px solid #14b8a6' : '2px solid #d7eee8';
    el.style.background = on ? '#f0fdf9' : '#fff';
  });
  var b = document.getElementById('eye-start-label');
  if(b) b.textContent = _ek(9955, '📸 측정 시작');
};

window.eyePickTier = function(t){
  window._eye.tier = t;
  try{ localStorage.setItem('cgo_eye_tier', t); }catch(e){}
};

window.eyeChat = function(){ try{ if(window.c24Chat) c24Chat(); }catch(e){} };

/* ── 시각 반응 25문항 — 구 CGO 방식: 자극이 뜨면 곧바로 누른다 ── */
function _eyeMakeTrials(){
  var out = [];
  for(var i = 0; i < 25; i++){
    out.push({
      wait: 800 + Math.floor(Math.random() * 1800),   /* 자극이 뜨기까지 */
      side: (Math.random() < 0.5) ? 'L' : 'R',
      size: 22 + Math.floor(Math.random() * 26)       /* 선명도 단계 */
    });
  }
  return out;
}

window.eyeStart = function(){
  if(!window._eye.side){
    try{ alert(_ek(9956, '어느 쪽 눈을 측정할지 먼저 골라주세요.')); }catch(e){}
    return;
  }
  window._eye.run = { trials:_eyeMakeTrials(), at:0, hits:[], t0:Date.now(), timer:null, shownAt:0 };
  var p = document.getElementById('eyeTestPop');
  if(p){ p.style.display = 'block'; p.scrollTop = 0; }
  eyeCamStart();
  eyeNext();
};

/* ── 카메라 ── */
window.eyeCamHint = function(msg){
  var idle = document.getElementById('eye-idle');
  if(!idle) return;
  idle.style.display = 'flex';
  idle.style.cursor = 'pointer';
  idle.onclick = function(){ eyeCamStart(); };
  var t = idle.querySelector('[data-k]');
  if(t){ t.removeAttribute('data-k'); t.textContent = msg; }
};
window.eyeCamStart = function(){
  var v = document.getElementById('eye-video'), idle = document.getElementById('eye-idle');
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
  navigator.mediaDevices.getUserMedia({ video:{ facingMode:'user', width:{ideal:640}, height:{ideal:480} } })
    .catch(function(){ return navigator.mediaDevices.getUserMedia({ video:true }); })
    .then(function(s){
      window._eye.stream = s;
      if(v){ v.srcObject = s; v.play().catch(function(){}); }
      if(idle) idle.style.display = 'none';
      eyeFitLoop();
    })
    .catch(function(){
      if(idle) idle.innerHTML = '<div style="font-size:11px;color:#fca5a5;padding:8px;line-height:1.6">'
        + _ek(8830, '카메라 허용을 눌러 주세요') + '</div>';
    })
    .catch(function(err){
      var K = function(n,f){ try{ var v=window.K&&window.K(n); return (v&&v!==String(n))?v:f; }catch(e){ return f; } };
      eyeCamHint(K(8830,'📷 카메라 허용을 눌러 주세요 · 눌러서 다시 시도'));
    });
};

/* 거리 안내 — 눈 7cm · 채움 비율로 판정 */
function eyeFitLoop(){
  var box = document.getElementById('eye-fit');
  var v = document.getElementById('eye-video');
  if(!box || !v) return;
  /* ★ 구 CGO 방식 그대로 — 중앙 50% 영역을 64x64 로 줄여 살색 화소를 센다.
     FaceMesh 를 쓰지 않아 바로 돌고, 살색 비율로 cm 를 추정한다. */
  var cv = document.createElement('canvas'); cv.width = 64; cv.height = 64;
  var cx = cv.getContext('2d', { willReadFrequently:true });
  var lastOK = false;

  var iv = setInterval(function(){
    if(!window._eye.stream){ clearInterval(iv); return; }
    if(!v.videoWidth || v.readyState < 2) return;
    var skinRatio = 0;
    try{
      var vw = v.videoWidth, vh = v.videoHeight;
      var sw = vw * 0.5, sh = vh * 0.5;
      cx.drawImage(v, (vw-sw)/2, (vh-sh)/2, sw, sh, 0, 0, 64, 64);
      var dt = cx.getImageData(0, 0, 64, 64).data;
      var skin = 0, tot = 0;
      for(var y = 8; y < 56; y++){
        for(var x = 8; x < 56; x++){
          var p = (y*64 + x) * 4;
          var R = dt[p], G = dt[p+1], B = dt[p+2];
          if(R > 80 && G > 40 && B > 20 && R > G && R > B && (R - G) > 10) skin++;
          tot++;
        }
      }
      skinRatio = tot ? skin / tot : 0;
    }catch(e){ return; }

    var hasFace = skinRatio > 0.12;
    /* 살색 비율 → cm (구 CGO 표) */
    var cm = 70;
    if(skinRatio > 0.45) cm = 15;
    else if(skinRatio > 0.35) cm = 22;
    else if(skinRatio > 0.28) cm = 28;
    else if(skinRatio > 0.22) cm = 33;
    else if(skinRatio > 0.17) cm = 38;
    else if(skinRatio > 0.13) cm = 45;
    else if(skinRatio > 0.10) cm = 55;
    window._eye.cm = cm;

    var st;
    if(!hasFace) st = 'none';
    else if(cm > 50) st = 'far';       /* 멀다 → 가까이 오세요 */
    else if(cm < 22) st = 'near';      /* 가깝다 → 멀리 가세요 */
    else st = 'ok';                    /* 30~40cm 표준 */

    var lock = (st !== 'ok');
    window._eye.locked = lock;

    var body = document.getElementById('eyeTestBody');
    var card = body && body.firstElementChild;   /* 시표 카드만 덮는다 — 화살표는 살려 둔다 */
    if(card){
      if(getComputedStyle(card).position === 'static') card.style.position = 'relative';
      var m0 = document.getElementById('eye-lock');
      if(lock){
        if(!m0){
          m0 = document.createElement('div');
          m0.id = 'eye-lock';
          m0.style.cssText = 'position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;'
            + 'align-items:center;justify-content:center;gap:6px;background:rgba(190,18,60,.9);'
            + 'color:#fff;text-align:center;padding:12px;font-weight:900;border-radius:16px;';
          card.appendChild(m0);
        }
        var msg = (st === 'none') ? _ek(8753,'얼굴을 찾는 중…')
                : (st === 'far')  ? _ek(8820,'조금 더 가까이')
                                  : _ek(8821,'조금 더 멀리');
        m0.innerHTML = '<div style="font-size:30px;line-height:1">📏</div>'
          + '<div style="font-size:14px;line-height:1.5">' + msg + '</div>'
          + '<div style="font-size:11px;font-weight:700;opacity:.9">' + _ek(9959,'화면에서 30~40cm') + ' · ' + cm + 'cm</div>';
      } else if(m0) m0.remove();
      /* ★ 잠금이 풀리면 반드시 되살린다 — 앞서 되돌리는 자리가 없어 계속 안 눌렸다 */
      if(body){ body.style.pointerEvents = ''; body.style.opacity = '1'; }
      card.style.pointerEvents = lock ? 'none' : '';
    }

    if(st === 'none')      box.textContent = _ek(8753,'🔍 얼굴을 찾는 중…');
    else if(st === 'far')  box.textContent = _ek(8820,'📏 조금 더 가까이') + ' · ' + cm + 'cm';
    else if(st === 'near') box.textContent = _ek(8821,'📏 조금 더 멀리') + ' · ' + cm + 'cm';
    else{
      box.textContent = _ek(8762,'✅ 딱 맞아요') + ' · ' + cm + 'cm';
      if(!lastOK){ try{ if(window.cgoFitBeep){ cgoFitBeepReset('eye'); cgoFitBeep('eye'); } }catch(e){} }
    }
    lastOK = (st === 'ok');
  }, 100);
  window._eye.fitIv = iv;
}

window.eyeCamStop = function(){
  try{
    var s = window._eye.stream;
    if(s){ s.getTracks().forEach(function(t){ t.stop(); }); window._eye.stream = null; }
  }catch(e){}
  var v = document.getElementById('eye-video'); if(v) v.srcObject = null;
  var idle = document.getElementById('eye-idle'); if(idle) idle.style.display = 'flex';
};

/* 측정을 접는다 — 결과를 만들지 않는다 (기능을 나가면 처음으로) */
window.eyeCancelMeasure = function(){
  try{ if(window._eye.run && window._eye.run.timer) clearTimeout(window._eye.run.timer); }catch(e){}
  window._eye.run = null;
  eyeCamStop();
};

/* ── 자극 한 번 ── */
window.eyeNext = function(){
  var r = window._eye.run; if(!r) return;
  var head = document.getElementById('eyeTestHead');
  var body = document.getElementById('eyeTestBody');
  if(!head || !body) return;
  if(r.at >= EYE_QUESTIONS.length){ eyeFinish(); return; }
  var q = EYE_QUESTIONS[r.at];
  var pct = Math.round(r.at / EYE_QUESTIONS.length * 100);

  head.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">'
    + '<span style="font-size:12px;font-weight:900;color:#0f766e;">' + _ek(9950,'시각 반응') + ' · Lv' + q.level + '</span>'
    + '<span style="font-size:11px;color:#64748b;">' + (r.at+1) + ' / ' + EYE_QUESTIONS.length + '</span></div>'
    + '<div style="height:6px;border-radius:999px;background:#e2e8f0;margin-top:8px;overflow:hidden;">'
    + '<div style="height:100%;width:' + pct + '%;background:linear-gradient(90deg,#0d9488,#14b8a6);transition:width .25s;"></div></div>';

  body.innerHTML =
    '<div id="eyeCard" style="background:#fff;border:1px solid #d7eee8;border-radius:16px;padding:26px 16px;margin-top:12px;text-align:center;position:relative;overflow:hidden;">'
    + '<div style="font-size:12px;font-weight:800;color:#0f766e;">' + q.q + '</div>'
    + '<div style="margin-top:18px;min-height:96px;display:flex;align-items:center;justify-content:center;">' + q.emoji + '</div>'
    + '<div id="eyeLockVeil" style="display:none;position:absolute;inset:0;background:rgba(220,38,38,.94);'
    + 'align-items:center;justify-content:center;flex-direction:column;gap:6px;color:#fff;padding:16px;">'
    + '<div style="font-size:26px;line-height:1;">📏</div>'
    + '<div id="eyeLockMsg" style="font-size:13px;font-weight:900;"></div></div>'
    + '</div>'
    + '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:12px;">'
    + q.opts.map(function(o, i){
        return '<button type="button" onclick="eyeAnswer(' + i + ')" '
          + 'style="padding:16px 12px;border-radius:14px;border:1.5px solid #d7eee8;background:#fff;'
          + 'cursor:pointer;font-family:inherit;text-align:left;min-height:56px;display:flex;align-items:center;gap:9px;">'
          + '<span style="flex:none;width:22px;height:22px;border-radius:999px;background:#f0fdf9;color:#0f766e;'
          + 'font-size:11px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;">'
          + String.fromCharCode(65+i) + '</span>'
          + '<span style="flex:1;min-width:0;font-size:14px;color:#0f172a;font-weight:700;line-height:1.5;'
          + 'overflow-wrap:anywhere;">' + o + '</span></button>';
      }).join('')
    + '</div>';
  r.tq = Date.now();
};

window.eyeAnswer = function(i){
  var r = window._eye.run; if(!r) return;
  if(window._eye.locked) return;              /* 거리가 벗어나면 답을 못 한다 */
  var q = EYE_QUESTIONS[r.at];
  r.answers.push({ i:i, ok:(i === q.correct), ms:(Date.now() - r.tq), level:q.level, cat:q.cat });
  r.at++;
  eyeNext();
};


function _eyeBtn(d, ch){
  return '<button type="button" onclick="eyeAnswer(\'' + d + '\')" '
    + 'style="width:56px;height:56px;border:1px solid #d7eee8;background:#fff;'
    + 'font-size:20px;color:#0f172a;cursor:pointer;font-family:inherit;margin:0;padding:0;">' + ch + '</button>';
}


window.eyeHit = function(){
  var r = window._eye.run; if(!r) return;
  var t = r.trials[r.at];
  if(!r.shownAt){
    /* 자극 전에 눌렀다 — 놓친 것으로 기록하고 넘어간다 */
    r.hits.push({ ms:0, early:true, size:t.size });
  } else {
    r.hits.push({ ms:(Date.now() - r.shownAt), early:false, size:t.size });
  }
  if(r.timer) clearTimeout(r.timer);
  r.at++;
  eyeNext();
};

/* ── 결과 ── */
window.eyeFinish = function(){
  var r = window._eye.run; if(!r) return;
  eyeCamStop();

  var good = r.hits.filter(function(h){ return !h.early && h.ms > 90 && h.ms < 1500; });
  var avg = good.length ? Math.round(good.reduce(function(t,h){ return t + h.ms; }, 0) / good.length) : 0;
  var early = r.hits.filter(function(h){ return h.early; }).length;
  /* 작은 점을 잘 잡았는지 — 선명도 단계 */
  var small = good.filter(function(h){ return h.size <= 32; }).length;
  var smallAll = r.hits.filter(function(h){ return h.size <= 32; }).length;
  var sharp = smallAll ? Math.round(small / smallAll * 100) : 0;
  /* 눈 선명도 지수 — 반응 속도 + 작은 점 포착 + 헛누름 */
  var evi = Math.max(0, Math.min(100,
    Math.round(sharp * 0.55 + Math.max(0, (700 - avg) / 7) * 0.35 - early * 2)));

  var head = document.getElementById('eyeTestHead');
  var body = document.getElementById('eyeTestBody');
  if(head) head.innerHTML = '<div style="font-size:12px;font-weight:900;color:#0f766e;">' + _ek(9720, '검사 결과') + '</div>';
  if(!body) return;

  body.innerHTML =
    '<div style="background:linear-gradient(135deg,#0f766e,#0d9488);border-radius:18px;padding:22px 16px;margin-top:13px;text-align:center;">'
    + '<div style="font-size:11px;font-weight:800;color:#d1fae5;">' + _ek(9940, '눈 선명도 지수') + '</div>'
    + '<div style="font-size:44px;font-weight:900;color:#fff;line-height:1.1;margin-top:4px;">' + evi + '</div></div>'
    + '<div style="background:#fff;border:1px solid #d7eee8;border-radius:16px;padding:15px 16px;margin-top:11px;">'
    + [[_ek(9938,'반응'), (avg/1000).toFixed(2) + 's'],
       [_ek(9960,'작은 점 포착'), sharp + '%'],
       [_ek(9961,'헛누름'), early + _ek(9962,'회')]].map(function(p){
        return '<div style="display:flex;justify-content:space-between;font-size:12px;padding:7px 0;'
          + 'border-bottom:1px solid #f1f5f9;"><span style="color:#475569;font-weight:700;">' + p[0]
          + '</span><span style="color:#0f766e;font-weight:900;">' + p[1] + '</span></div>';
      }).join('')
    + '</div>'
    + '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:13px 14px;margin-top:11px;">'
    + '<div style="font-size:10.5px;color:#64748b;line-height:1.75;">' + _ek(9927, '') + '</div></div>'
    + '<button type="button" onclick="eyeTestClose()" style="width:100%;margin-top:14px;padding:15px;border:0;'
    + 'border-radius:999px;background:#0f172a;color:#fff;font-size:14px;font-weight:900;cursor:pointer;font-family:inherit;">'
    + _ek(9725, '✓ 닫기') + '</button>';

  /* 페이지 지표판에도 옮겨 적는다 */
  try{
    var set = function(id, v){ var el = document.getElementById(id); if(el) el.textContent = v; };
    set('eye-evi', evi);
    set('eye-react', (avg/1000).toFixed(2) + 's');
    set('eye-stable', (100 - early * 4) + '');
  }catch(e){}

  window._eye.run = null;
};

window.eyeTestClose = function(){
  eyeCancelMeasure();
  var p = document.getElementById('eyeTestPop');
  if(p) p.style.display = 'none';
};

/* 측정 중 언어를 바꾸면 그 자리에서 다시 그린다 */
(function(){
  function redraw(){
    if(!window._eye || !window._eye.run) return;
    var p = document.getElementById('eyeTestPop');
    if(!p || getComputedStyle(p).display === 'none') return;
    try{ eyeNext(); }catch(e){}
  }
  if(window.cgoRepaintOn) cgoRepaintOn(redraw);
  else [300, 1200, 3000].forEach(function(d){
    setTimeout(function(){ if(window.cgoRepaintOn) cgoRepaintOn(redraw); }, d);
  });
})();
