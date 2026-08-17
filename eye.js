/* ★ 얼굴 좌표는 c24 카메라가 담아 둔다 — eye.js 는 그것을 빌려 쓴다.
   _eyeLms 는 아무도 채우지 않아, 얼굴이 보여도 잠긴 채였다. */
function _eyeGetLms(){
  try{
    if(window._c24 && window._c24._faceLms) return window._c24._faceLms;
  }catch(e){}
  return null;
}
var EYE_SIZE_BY_LEVEL = {
    1: {px: 80, vision: 0.1, label: '매우 큼'},
    2: {px: 50, vision: 0.2, label: '큼'},
    3: {px: 32, vision: 0.32, label: '중간'},
    4: {px: 20, vision: 0.5, label: '작음'},
    5: {px: 14, vision: 0.8, label: '매우 작음'}
  };

/* ══ 얼굴이 자 대신이다 — 신용카드를 댈 필요가 없다 ══
   두 눈동자 사이는 평균 63mm 로 사람마다 거의 변하지 않는다.
   카메라에 잡힌 눈 사이 화소를 63mm 로 나누면 그 화면의 실제 크기가 나온다.
   AR 메이크업이 얼굴 좌표로 자리를 잡는 것과 같은 방식이다. */
window.EYE_IPD_MM = 63;

window.eyeMmPerPx = function(){
  try{ var _l=(_eyeGetLms())||(window._c24&&window._c24._faceLms); if(_l&&window.eyeBlinkFeed) eyeBlinkFeed(_l); }catch(_){}
  try{
    var lms = (_eyeGetLms()) || (window._c24 && window._c24._faceLms);
    if(lms && lms.length > 400){
      var L = lms[468] || lms[33], R = lms[473] || lms[263];
      if(L && R){
        var v = document.getElementById('eye-video');
        var vw = (v && v.videoWidth) || 640;
        var dx = Math.abs(L.x - R.x) * vw;
        if(dx > 20){
          /* 카메라 화소 1개가 몇 mm 인지는 거리에 따라 달라진다.
             화면 화소는 폰 밀도로 정해지므로 둘을 섞지 않는다 —
             화면 크기는 밀도로, 거리는 얼굴로 각각 구한다. */
          return 25.4 / ((window.devicePixelRatio || 2) * 96);
        }
      }
    }
  }catch(e){}
  try{ return 25.4 / ((window.devicePixelRatio || 2) * 96); }catch(e){}
  return 0.106;
};

/* 목표 시력에서 글자 크기를 거꾸로 구한다.
   시력 1.0 = 40cm 에서 5분각 = 글자 높이 2.9mm */
window.eyeLevelPx = function(level){
  var vis = (EYE_SIZE_BY_LEVEL[level] || {}).vision || 0.5;
  var mm = 2.9 / vis;
  var px = Math.round(mm / window.eyeMmPerPx());
  return Math.max(8, Math.min(220, px));
};
;

function _eyeSized(level, content, type){
    var sz = (window.eyeLevelPx ? window.eyeLevelPx(level) : EYE_SIZE_BY_LEVEL[level].px);
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

EYE_QUESTIONS = [];

/* ══ 나의 눈 건강 — 측정 (구 CGO 구조 + 오늘 넣은 정밀 기술) ══
   눈동자 추적 · 깜빡임 · 눈가 rPPG · 시각 반응 25문항 · 눈 선명도 지수
   거리 판정은 채움 비율(cgoFitState)로 — 눈 7cm 기준 */

function _ek(n, f){ try{ var v=window.K&&window.K(n); return (v&&v!==String(n))?v:f; }catch(e){ return f; } }

window._eye = { side:null, tier:'basic', run:null, stream:null };
try{ var _et=localStorage.getItem('cgo_eye_tier'); if(_et) window._eye.tier=_et; }catch(e){}

window.eyePick = function(side){
  /* ★ eyeStart 는 _eye.eye 를 읽는다 — 이름이 달라 고른 것이 전달되지 않았다 */
  window._eye.eye = side;
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
  try{ if(window.eyeBlinkStart) eyeBlinkStart(); }catch(_){}
  var s = window._eye;
  if(!s.eye){ try{ alert(_ek(9962,'왼쪽·오른쪽 눈을 먼저 골라주세요.')); }catch(e){} return; }
  s.run = { eye:s.eye, vi:5, best:0, miss:0, step:0, answers:[], done:false, wrongAt2:false, cur:null };
  try{ window._eyeCam = window._eyeCam || {}; window._eyeCam.faceFrames = 0; window._eyeCam.sawFace = false; window._eyeCam.lastSeen = 0; }catch(_){}
  var pop = document.getElementById('eyeTestPop');
  if(pop){ pop.style.display='block'; pop.scrollTop=0; }
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
        try{ if(window.eyeFMStart) eyeFMStart(); }catch(_){}
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

    /* ★ 얼굴을 못 찾을 때는 잠그지 않는다 — 못 찾아 답이 영영 안 눌렸다.
     거리가 확실히 벗어난 때(가깝다·멀다)만 막는다. */
  var lock = (st === 'far' || st === 'near');
    window._eye.locked = lock;
  window._eye.fitState = st;

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

/* 반초마다 거리를 살핀다 */
window._eyeGuardTimer = null;
window.eyeGuardOn = function(){
  if(window._eyeGuardTimer) return;
  window._eyeGuardTimer = setInterval(function(){
    try{ if(window._eye && window._eye.run) eyeDistGuard(); }catch(e){}
  }, 500);
};
window.eyeGuardOff = function(){
  if(window._eyeGuardTimer){ clearInterval(window._eyeGuardTimer); window._eyeGuardTimer = null; }
  var v = document.getElementById('eye-veil'); if(v) v.remove();
};

window.eyeCamStop = function(){
  try{ if(window.eyeFMStop) eyeFMStop(); }catch(_){}
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
/* ══ 시력 검사 — 계단식 (병원 방식) ══
   기존 앱들은 "40cm 를 맞춰 주세요" 하고 사용자에게 맡깁니다. 거리를 알 수 없어서입니다.
   우리는 얼굴로 거리를 실시간으로 알기 때문에, 거리를 강요하지 않습니다.
   대신 그 순간의 거리에 맞춰 글자 크기를 바꿔, 보이는 각도를 늘 같게 만듭니다.
   맞히면 작게, 틀리면 크게 — 두 번 틀리는 지점이 그 사람의 시력입니다. */

window.EYE_VIS = [0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.63, 0.8, 1.0, 1.25, 1.5];
window.EYE_DIRS = ['↑','→','↓','←'];

/* 지금 거리에서, 그 시력에 해당하는 글자 크기(px) */
window.eyeSizeFor = function(vis){
  var mm = 2.9 / vis;                       /* 40cm 기준 높이 */
  var cm = window.eyeNowCm() || 40;
  mm = mm * (cm / 40);                      /* 거리에 비례해 키운다 — 각도가 같아진다 */
  var px = Math.round(mm / window.eyeMmPerPx());
  return Math.max(9, Math.min(260, px));
};

/* 지금 거리 (cm) — 얼굴을 못 잡으면 0 */
window.eyeNowCm = function(){
  try{
    var lms = _eyeGetLms();
    if(!lms || lms.length < 400) return 0;
    /* ★ 얼굴을 한 번이라도 잡았다는 표시 — 결과를 낼 자격이 된다 */
    if(!window._eyeCam) window._eyeCam = {};
    window._eyeCam.sawFace = true;
    /* ★ 잠금이 이 시각을 본다 — 안 적어 얼굴이 보여도 잠긴 채였다 */
    window._eyeCam.lastSeen = Date.now();
    window._eyeCam.lastSeen = Date.now();
    var L = lms[468] || lms[33], R = lms[473] || lms[263];
    if(!L || !R) return 0;
    var v = document.getElementById('eye-video');
    var vw = (v && v.videoWidth) || 640;
    var dx = Math.abs(L.x - R.x) * vw;
    if(dx < 10) return 0;
    /* ★ 렌즈 초점거리로 제대로 계산한다.
       앞서 근거 없는 값(0.62)을 써서 50cm 를 22cm 로 읽었다.
       폰 앞카메라 화각은 대개 70도 — 초점거리 ≈ 화면폭 / (2·tan35°) */
    var f = vw / (2 * Math.tan(35 * Math.PI / 180));
    var cm = (window.EYE_IPD_MM * f) / dx / 10;
    return Math.round(cm);
  }catch(e){ return 0; }
};

window.eyeNext = function(){
  var r = window._eye.run; if(!r) return;
  if(r.done || r.wrongAt2){ eyeFinish(); return; }
  if(r.step >= 14){ eyeFinish(); return; }

  var dir = Math.floor(Math.random() * 4);
  r.cur = { vi: r.vi, dir: dir, t0: Date.now() };
  r.step++;
  eyeDraw();
};

window.eyeDraw = function(){
  var r = window._eye.run; if(!r || !r.cur) return;
  var head = document.getElementById('eyeTestHead');
  var body = document.getElementById('eyeTestBody');
  if(!head || !body) return;

  var vis = EYE_VIS[r.cur.vi];
  var px = window.eyeSizeFor(vis);
  var cm = window.eyeNowCm();

  head.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">'
    + '<span style="font-size:12px;font-weight:900;color:#0f766e;">'
    + (r.eye === 'L' ? _ek(9930,'왼쪽 눈') : _ek(9931,'오른쪽 눈')) + '</span>'
    + '<span style="font-size:11px;color:#64748b;">' + r.step + ' / 14'
    + (cm ? ' · ' + cm + 'cm' : '') + '</span></div>'
    + '<div style="height:6px;border-radius:999px;background:#e2e8f0;margin-top:7px;overflow:hidden;">'
    + '<div style="height:100%;width:' + Math.round(r.step/14*100) + '%;background:linear-gradient(90deg,#0d9488,#14b8a6);transition:width .25s;"></div></div>';

  body.innerHTML =
    '<div style="background:#fff;border:1px solid #d7eee8;border-radius:16px;'
    + 'height:38vh;min-height:150px;display:flex;align-items:center;justify-content:center;margin-top:10px;">'
    + '<span id="eye-glyph" style="font-size:' + px + 'px;font-weight:900;color:#0f172a;line-height:1;">'
    + EYE_DIRS[r.cur.dir] + '</span></div>'
    + '<div data-k="9960" style="font-size:11px;color:#64748b;text-align:center;margin-top:9px;"></div>'
    + '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:9px;">'
    + EYE_DIRS.map(function(d, i){
        return '<button type="button" onclick="eyeAnswer(' + i + ')" '
          + 'style="padding:0;height:60px;border-radius:14px;border:1.5px solid #d7eee8;background:#fff;'
          + 'cursor:pointer;font-family:inherit;font-size:26px;font-weight:900;color:#0f766e;">'
          + d + '</button>';
      }).join('')
    + '</div>'
    + '<button type="button" onclick="eyeAnswer(-1)" data-k="9961" '
    + 'style="width:100%;margin-top:8px;padding:12px;border:1px solid #cbd5e1;border-radius:12px;'
    + 'background:#f8fafc;color:#64748b;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;"></button>';
  try{ if(window.CGO_T) CGO_T.paint(body); }catch(e){}
};

window.eyeAnswer = function(i){
  /* 이 문항을 풀 때 얼굴이 보였는가 — 1초 안에 좌표가 들어왔으면 인정 */
  try{
    if(!window._eyeCam) window._eyeCam = {};
    var fresh = window._eyeCam.lastSeen && (Date.now() - window._eyeCam.lastSeen) < 1000;
    window._eyeCam.faceFrames = (window._eyeCam.faceFrames || 0) + (fresh ? 1 : 0);
  }catch(_){}
  var r = window._eye.run; if(!r || !r.cur) return;
  var ok = (i === r.cur.dir);
  r.answers.push({ vi: r.cur.vi, ok: ok, ms: Date.now() - r.cur.t0, cm: window.eyeNowCm() });

  if(ok){
    r.best = Math.max(r.best, r.cur.vi);
    r.miss = 0;
    if(r.vi < EYE_VIS.length - 1) r.vi++;
    else { r.done = true; }
  }else{
    r.miss++;
    if(r.miss >= 2){ r.wrongAt2 = true; }
    else if(r.vi > 0) r.vi--;
  }
  eyeNext();
};
window.eyeFinish = function(){
  var r = window._eye.run; if(!r) return;
  /* ★ 얼굴이 한 번도 안 잡혔다면 결과를 내지 않는다.
     카메라가 꺼진 채로도 점수가 나오던 것이 오류였다 — 거리를 모르면 글자 크기가 뜻을 잃는다. */
  /* ★ 한 번 잡힌 것으로는 안 된다 — 문항마다 얼굴이 보였어야 한다.
     눈·코·입 좌표가 들어온 문항 수를 세어, 절반도 못 되면 결과를 내지 않는다. */
  var seen = false;
  try{
    var ok = (window._eyeCam && window._eyeCam.faceFrames) || 0;
    var need = Math.max(1, Math.ceil((r.answers.length || 1) * 0.5));
    seen = (ok >= need);
  }catch(_){}
  if(!seen){
    eyeCamStop();
    var hd0 = document.getElementById('eyeTestHead');
    var bd0 = document.getElementById('eyeTestBody');
    if(hd0) hd0.innerHTML = '';
    if(bd0) bd0.innerHTML =
      '<div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:16px;padding:22px 18px;margin-top:13px;text-align:center;">'
      + '<div style="font-size:30px;line-height:1;">📷</div>'
      + '<div style="font-size:14px;font-weight:900;color:#be123c;margin-top:10px;line-height:1.5;">'
      + _ek(9998,'얼굴이 한 번도 잡히지 않아 결과를 낼 수 없습니다') + '</div>'
      + '<div style="font-size:11.5px;color:#475569;margin-top:8px;line-height:1.75;">'
      + _ek(9999,'거리를 알 수 없으면 글자 크기가 뜻을 잃습니다. 카메라를 허용하고 얼굴이 보이는 상태에서 다시 재 주세요.') + '</div>'
      + '<button type="button" onclick="eyeTestClose()" style="width:100%;margin-top:16px;padding:14px;border:0;'
      + 'border-radius:999px;background:#0f172a;color:#fff;font-size:13.5px;font-weight:900;cursor:pointer;font-family:inherit;">'
      + _ek(9725,'✓ 닫기') + '</button></div>';
    window._eye.run = null;
    return;
  }
  eyeCamStop();
  try{ if(window.eyeGuardOff) eyeGuardOff(); }catch(e){}
  var vision = EYE_VIS[r.best] || 0.1;
  var right = r.answers.filter(function(a){ return a.ok; }).length;
  var avg = r.answers.length
    ? Math.round(r.answers.reduce(function(t,a){ return t + a.ms; }, 0) / r.answers.length) : 0;
  var cms = r.answers.map(function(a){ return a.cm; }).filter(function(c){ return c > 0; });
  var cm = cms.length ? Math.round(cms.reduce(function(t,c){ return t+c; },0) / cms.length) : 0;

  var head = document.getElementById('eyeTestHead');
  var body = document.getElementById('eyeTestBody');
  if(head) head.innerHTML = '<div style="font-size:12px;font-weight:900;color:#0f766e;">'
    + (r.eye === 'L' ? _ek(9930,'왼쪽 눈') : _ek(9931,'오른쪽 눈')) + ' · ' + _ek(9720,'검사 결과') + '</div>';
  if(!body) return;
  body.innerHTML =
    '<div style="background:#fff;border:1px solid #d7eee8;border-radius:18px;padding:24px 16px;margin-top:12px;text-align:center;">'
    + '<div style="font-size:11px;color:#64748b;font-weight:700;">' + _ek(9957,'추정 시력') + '</div>'
    + '<div style="font-size:46px;font-weight:900;color:#0f766e;line-height:1.1;margin-top:4px;">' + vision.toFixed(2) + '</div>'
    + '<div style="font-size:11px;color:#475569;margin-top:7px;line-height:1.7;">'
    + _ek(9722,'정답') + ' ' + right + '/' + r.step
    + ' · ' + _ek(9723,'평균 반응') + ' ' + (avg/1000).toFixed(1) + 's'
    + (cm ? '<br>' + _ek(9963,'측정 거리') + ' ' + cm + 'cm' : '') + '</div></div>'
    + (function(){
        var bl = window.eyeBlinkResult ? eyeBlinkResult() : null;
        if(!bl || !bl.sec) return '';
        var bpmOk = (bl.bpm >= 12 && bl.bpm <= 22);
        return '<div style="background:#fff;border:1px solid #d7eee8;border-radius:16px;padding:15px 16px;margin-top:11px;">'
          + '<div style="font-size:12.5px;font-weight:900;color:#0f766e;">' + _ek(9970,'👁️ 눈동자 · 깜빡임') + '</div>'
          + '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:11px;">'
          + '<div style="padding:13px 12px;border-radius:13px;background:' + (bpmOk?'#f0fdf9':'#fffbeb') + ';border:1px solid ' + (bpmOk?'#99f6e4':'#fde68a') + ';">'
          + '<div style="font-size:10px;color:#64748b;font-weight:700;">' + _ek(9971,'분당 깜빡임') + '</div>'
          + '<div style="font-size:19px;font-weight:900;color:' + (bpmOk?'#0f766e':'#b45309') + ';margin-top:3px;">' + bl.bpm + '</div>'
          + '<div style="font-size:9.5px;color:#64748b;margin-top:2px;">' + _ek(9972,'정상 15~20회') + '</div></div>'
          + '<div style="padding:13px 12px;border-radius:13px;background:#eff6ff;border:1px solid #bfdbfe;">'
          + '<div style="font-size:10px;color:#64748b;font-weight:700;">' + _ek(9973,'눈동자 흔들림') + '</div>'
          + '<div style="font-size:19px;font-weight:900;color:#1d4ed8;margin-top:3px;">' + bl.jitter + '</div>'
          + '<div style="font-size:9.5px;color:#64748b;margin-top:2px;">' + _ek(9974,'낮을수록 안정') + '</div></div>'
          + '</div>'
          + (bpmOk ? '' : '<div style="font-size:10.5px;color:#b45309;margin-top:10px;line-height:1.7;">' + _ek(9975,'') + '</div>')
          + '</div>';
      })()
    + '<div style="background:#f0fdf9;border:1px solid #99f6e4;border-radius:14px;padding:14px 15px;margin-top:11px;">'
    + '<div data-k="9964" style="font-size:11px;color:#0f766e;font-weight:800;line-height:1.7;"></div></div>'
    + '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:13px 14px;margin-top:10px;">'
    + '<div data-k="9944" style="font-size:10.5px;color:#64748b;line-height:1.75;"></div></div>'
    + '<button type="button" onclick="eyeTestClose()" data-k="9725" style="width:100%;margin-top:13px;padding:15px;border:0;'
    + 'border-radius:999px;background:#0f172a;color:#fff;font-size:14px;font-weight:900;cursor:pointer;font-family:inherit;"></button>';
  try{ if(window.CGO_T) CGO_T.paint(body); }catch(e){}
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

/* ══ 거리 잠금 — 40cm 를 벗어나면 문항을 덮는다 ══
   글자 크기가 실제 mm 로 계산되므로, 거리가 틀리면 시력도 틀린다.
   그래서 벗어나면 답을 못 누르게 덮고, 맞으면 걷는다. */
window.eyeDistGuard = function(){
  var box = document.getElementById('eyeTestBody');
  if(!box) return;
  var veil = document.getElementById('eye-veil');
  var st = 'ok', cm = 0;
  try{
    var lms = _eyeGetLms();
    if(lms && lms.length > 400){
      var L = lms[468] || lms[33], R = lms[473] || lms[263];
      var v = document.getElementById('eye-video');
      var vw = (v && v.videoWidth) || 640;
      if(L && R){
        var dx = Math.abs(L.x - R.x) * vw;
        /* 눈 사이 63mm 가 화면에서 몇 화소인지로 거리를 되짚는다 */
        if(dx > 10) cm = Math.round((vw * 0.62) / dx * 10) / 10 * 10;
        if(cm && (cm < 30 || cm > 50)) st = (cm < 30) ? 'near' : 'far';
      }
    }
  }catch(e){}
  if(st === 'ok'){
    if(veil) veil.remove();
    return;
  }
  if(!veil){
    veil = document.createElement('div');
    veil.id = 'eye-veil';
    veil.style.cssText = 'position:absolute;inset:0;z-index:9;display:flex;flex-direction:column;'
      + 'align-items:center;justify-content:center;background:rgba(190,18,60,.92);color:#fff;'
      + 'border-radius:16px;text-align:center;padding:18px;';
    box.style.position = 'relative';
    box.appendChild(veil);
  }
  veil.innerHTML = '<div style="font-size:30px;line-height:1">📏</div>'
    + '<div style="font-size:14px;font-weight:900;margin-top:8px;">'
    + (st === 'near' ? _ek(8821,'📏 조금 더 멀리') : _ek(8820,'📏 조금 더 가까이')) + '</div>'
    + '<div style="font-size:11.5px;margin-top:6px;opacity:.9;line-height:1.6;">'
    + _ek(9959,'40cm 를 맞춰야 시력이 정확합니다') + (cm ? ' · ' + cm + 'cm' : '') + '</div>';
};

/* ══ ① 눈동자 추적 + 깜빡임 분석 ══
   검사 중 카메라가 이미 돌고 있으니, 그 화면에서 눈 흔들림과 깜빡임을 함께 센다. */
window._eyeBlink = null;

window.eyeBlinkStart = function(){
  window._eyeBlink = { blinks:0, lastClosed:false, jitter:[], t0:Date.now(), lastEAR:null };
};

/* FaceMesh 좌표가 올 때마다 부른다 — 눈꺼풀 사이 비율(EAR)로 깜빡임을 센다 */
window.eyeBlinkFeed = function(lms){
  var b = window._eyeBlink; if(!b || !lms || lms.length < 400) return;
  function d(a, c){ var dx = lms[a].x - lms[c].x, dy = lms[a].y - lms[c].y; return Math.sqrt(dx*dx + dy*dy); }
  /* 왼눈 위·아래 눈꺼풀(159·145) 대 눈 가로(33·133) */
  var open = d(159, 145), wide = d(33, 133);
  if(!wide) return;
  var ear = open / wide;
  var closed = ear < 0.16;
  if(closed && !b.lastClosed) b.blinks++;
  b.lastClosed = closed;
  /* 눈동자 흔들림 — 눈 중심이 프레임마다 얼마나 움직이나 */
  var cx = (lms[33].x + lms[133].x) / 2, cy = (lms[33].y + lms[133].y) / 2;
  if(b.px != null){
    var mv = Math.sqrt(Math.pow(cx - b.px, 2) + Math.pow(cy - b.py, 2));
    b.jitter.push(mv);
    if(b.jitter.length > 300) b.jitter.shift();
  }
  b.px = cx; b.py = cy;
};

window.eyeBlinkResult = function(){
  var b = window._eyeBlink;
  if(!b) return { bpm:0, jitter:0, sec:0 };
  var sec = Math.max(1, (Date.now() - b.t0) / 1000);
  var jit = b.jitter.length
    ? b.jitter.reduce(function(t, v){ return t + v; }, 0) / b.jitter.length : 0;
  return {
    bpm: Math.round(b.blinks / sec * 60),   /* 분당 깜빡임 — 정상 15~20 */
    jitter: Math.round(jit * 10000) / 100,  /* 눈동자 흔들림 (화면 폭 %) */
    sec: Math.round(sec)
  };
};


/* ══ 거리를 벗어나면 문항을 가린다 ══
   구 CGO도 "거리를 맞춰주세요"로 막았다. 다만 폰은 40cm까지 못 떨어지는 일이 많아
   허용 범위를 20~70cm로 넓혔다. 화면에 나오는 cm 값을 그대로 쓰므로 확실하다. */
(function(){
  var LOCK = 'eye-face-lock';
  function K(n, f){ try{ var v = window.K && window.K(n); return (v && v !== String(n)) ? v : f; }catch(e){ return f; } }
  function box(){
    var host = document.getElementById('eyeTestBody');
    if(!host) return null;
    var el = document.getElementById(LOCK);
    if(el) return el;
    el = document.createElement('div');
    el.id = LOCK;
    el.style.cssText = 'position:absolute;inset:0;z-index:9;display:flex;flex-direction:column;'
      + 'align-items:center;justify-content:center;gap:8px;padding:18px;text-align:center;'
      + 'background:rgba(190,18,60,.93);color:#fff;border-radius:16px;';
    el.innerHTML = '<div style="font-size:30px;line-height:1">📏</div>'
      + '<div id="eye-lock-msg" style="font-size:13.5px;font-weight:900;line-height:1.5"></div>'
      + '<div id="eye-lock-sub" style="font-size:11px;opacity:.92;line-height:1.65"></div>';
    if(getComputedStyle(host).position === 'static') host.style.position = 'relative';
    host.appendChild(el);
    return el;
  }
  function tick(){
    var run = window._eye && window._eye.run;
    var pop = document.getElementById('eyeTestPop');
    if(!run || !pop || getComputedStyle(pop).display === 'none'){
      var old = document.getElementById(LOCK);
      if(old) old.style.display = 'none';
      return;
    }
    var cm = 0;
    try{ cm = (window.eyeNowCm && eyeNowCm()) || 0; }catch(_){}
    /* 거리를 아직 모르면 막지 않는다 — 막아 두면 아무것도 못 한다 */
    var ok = (!cm) || (cm >= 20 && cm <= 70);
    var el = box(); if(!el) return;
    if(ok){
      el.style.display = 'none';
      return;
    }
    el.style.display = 'flex';
    var m = document.getElementById('eye-lock-msg');
    var s = document.getElementById('eye-lock-sub');
    if(m) m.textContent = (cm < 20 ? K(8821,'📏 조금 더 멀리') : K(8820,'📏 조금 더 가까이'))
      + '  ·  ' + Math.round(cm) + 'cm';
    if(s) s.textContent = K(10002, '20~70cm 안에서만 문항이 열립니다 · 거리를 맞추면 이어서 풀 수 있습니다');
  }
  setInterval(tick, 400);
})();

/* ══ 눈 카메라에서 얼굴 좌표를 직접 얻는다 ══
   눈 검사는 자기 카메라(eye-video)를 쓰므로 c24 의 FaceMesh 가 돌지 않았고,
   그래서 좌표가 비어 얼굴이 보여도 잠긴 채였다. 여기서 직접 돌린다. */
window._eyeFM = null;
window.eyeFMStart = function(){
  try{
    if(typeof FaceMesh === 'undefined') return;
    var v = document.getElementById('eye-video');
    if(!v) return;
    if(!window._eyeFM){
      window._eyeFM = new FaceMesh({ locateFile:function(f){
        return 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/' + f; } });
      window._eyeFM.setOptions({ maxNumFaces:1, refineLandmarks:false,
        minDetectionConfidence:0.5, minTrackingConfidence:0.5 });
      window._eyeFM.onResults(function(r){
        try{
          if(r && r.multiFaceLandmarks && r.multiFaceLandmarks.length){
            if(!window._c24) window._c24 = {};
            window._c24._faceLms = r.multiFaceLandmarks[0];
          }
        }catch(_){}
      });
    }
    if(window._eyeFMLoop) return;
    window._eyeFMLoop = true;
    (function loop(){
      if(!window._eyeFMLoop) return;
      try{
        var vv = document.getElementById('eye-video');
        if(vv && vv.readyState >= 2) window._eyeFM.send({ image: vv });
      }catch(_){}
      setTimeout(loop, 200);
    })();
  }catch(_){}
};
window.eyeFMStop = function(){ window._eyeFMLoop = false; };
