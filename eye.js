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
  s.run = { eye:s.eye, qs: window.eyeBank(), at:0, answers:[], lvStat:{1:{c:0,t:0},2:{c:0,t:0},3:{c:0,t:0},4:{c:0,t:0},5:{c:0,t:0},6:{c:0,t:0},7:{c:0,t:0},8:{c:0,t:0}} };
  try{ window._eyeCam = window._eyeCam || {}; window._eyeCam.faceFrames = 0; window._eyeCam.sawFace = false; window._eyeCam.lastSeen = 0; }catch(_){}
  var pop = document.getElementById('eyeTestPop');
  if(pop){ pop.style.display='block'; pop.scrollTop=0; }
  window._eyeDone = {};
  eyeCamStart();
  eyeBegin('vis');
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
        try{ if(window.eyeFMEnsure) eyeFMEnsure().then(function(){ if(window.eyeFMStart) eyeFMStart(); });
     else if(window.eyeFMStart) eyeFMStart(); }catch(_){}
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
      /* ★ 벽을 걸러낸다 — 살색이면서 움직이는 칸만 센다.
         노란 벽·나무 액자가 살색 조건을 통과해 거리가 15cm 로 잘못 읽혔다. */
      if(!window._eyePrev || window._eyePrev.length !== dt.length){
        window._eyePrev = new Uint8ClampedArray(dt);
      }else{
        var pv = window._eyePrev, live = 0, liveTot = 0;
        for(var y2 = 8; y2 < 56; y2++){
          for(var x2 = 8; x2 < 56; x2++){
            var q = (y2*64 + x2) * 4;
            var R2 = dt[q], G2 = dt[q+1], B2 = dt[q+2];
            var isSkin = (R2 > 80 && G2 > 40 && B2 > 20 && R2 > G2 && R2 > B2 && (R2 - G2) > 10);
            if(!isSkin) continue;
            liveTot++;
            var dif = Math.abs(R2 - pv[q]) + Math.abs(G2 - pv[q+1]) + Math.abs(B2 - pv[q+2]);
            if(dif >= 4) live++;          /* 살아 있는 것은 늘 미세하게 변한다 */
          }
        }
        /* 움직이는 살색이 3분의 1도 안 되면 벽으로 본다 */
        var liveRate = liveTot ? live / liveTot : 0;
        window._eyeLive = liveRate;
        if(liveRate < 0.33) skinRatio = skinRatio * liveRate * 2;
        /* 혈류 확인 도장 — 초록 채널 평균을 모아 심장 주기가 있는지 본다 */
        var gsum = 0, gn = 0;
        for(var y3 = 20; y3 < 44; y3++){ for(var x3 = 20; x3 < 44; x3++){
          var q3 = (y3*64 + x3) * 4; gsum += dt[q3+1]; gn++; } }
        if(!window._eyeGbuf) window._eyeGbuf = [];
        window._eyeGbuf.push(gsum / Math.max(1, gn));
        if(window._eyeGbuf.length > 60) window._eyeGbuf.shift();
        window._eyePrev = new Uint8ClampedArray(dt);
      }
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
    /* ★ 눈 사이 자가 있으면 그것을 쓴다 — 살색 비율보다 훨씬 정확하다 */
    var _rl = null; try{ _rl = window.eyeRuler ? eyeRuler() : null; }catch(_){}
    if(_rl){ cm = _rl.cm; hasFace = true; }
    else {
      /* 자가 없을 때만 살색을 쓴다 — 사람 확인이 거짓이면 얼굴 없음으로 본다 */
      var _pl = null; try{ _pl = window.eyePulseOk ? eyePulseOk() : null; }catch(_){}
      if(_pl === false) hasFace = false;
    }
    window._eyeFit = { skin: skinRatio, cm: cm, face: hasFace, ruler: !!_rl, at: Date.now() };
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


/* ★ 구 CGO 원문 그대로 — 25문항 · 5단계 고정 px (35cm 기준 · 5분각 문자)
   레벨마다 크기를 고정하고 5단계만 두어, 폰 화소 격자에 걸리지 않는다.
   사다리로 1.5까지 올리던 방식은 폰에서 시표가 더 작아지지 않아 값이 부풀었다. */
/* ★ 8단계 — 구 CGO는 5단계라 계단이 0.2였다. 0.9인 사람이 0.8 천장에 걸렸다.
   0.63·1.0·1.25 를 더해 계단을 0.1 아래로 좁힌다.
   크기는 화소가 아니라 mm 로 둔다 — 같은 화소도 폰마다 실제 크기가 다르다. */
window.EYE_LV = {
  1:{mm:11.6, vision:0.1,  show:'1.0',  lk:10170},
  2:{mm:5.80, vision:0.2,  show:'2.0',  lk:10171},
  3:{mm:3.60, vision:0.32, show:'3.0',  lk:10172},
  4:{mm:2.30, vision:0.5,  show:'5.0',  lk:10173},
  5:{mm:1.85, vision:0.63, show:'6.3',  lk:10184},
  6:{mm:1.45, vision:0.8,  show:'8.0',  lk:10174},
  7:{mm:1.16, vision:1.0,  show:'10.0', lk:10185},
  8:{mm:0.93, vision:1.25, show:'12.5', lk:10186}
};
/* CSS 화소는 기기 독립 단위다 — 1인치 = 96 CSS화소로 옮기면
   화소 밀도가 달라도 화면에서의 실제 크기가 같아진다. */
window.eyeMmToPx = function(mm){ return mm * (96 / 25.4); };
function _eSz(lv, c, type){
  var sz = window.eyeMmToPx(window.EYE_LV[lv].mm);
  /* 채움 비율로 보정 — 얼굴이 기준 (메뉴얼) */
  try{ var _f = window._eyeFit;
       if(_f && _f.face) sz = Math.round(sz * Math.max(0.6, Math.min(1.8, _f.cm / 35))); }catch(_){}
  if(type==='color') return '<span style="display:inline-block;width:'+sz+'px;height:'+sz+'px;background:'+c+';border-radius:'+(sz/10)+'px;"></span>';
  return '<span style="font-size:'+sz+'px;font-weight:900;color:#0f172a;line-height:1;display:inline-block;">'+c+'</span>';
}
window.eyeBank = function(){ return [
 {cat:'shape',lv:1,qk:10100,g:['▲','shape'],ok:0,ov:[10105,10106,10107,10108]},
 {cat:'color',lv:1,qk:10101,g:['#e74c3c','color'],ok:0,ov:[10109,10110,10111,10112]},
 {cat:'direction',lv:1,qk:10103,g:['↑','direction'],ok:0,ov:[10113,10114,10115,10116]},
 {cat:'shape',lv:2,qk:10100,g:['■','shape'],ok:1,ov:[10105,10106,10107,10118]},
 {cat:'symbol',lv:2,qk:10102,g:['3','symbol'],ok:1,ov:['8','3','5','9']},
 {cat:'direction',lv:2,qk:10103,g:['→','direction'],ok:3,ov:[10113,10114,10115,10116]},
 {cat:'shape',lv:3,qk:10100,g:['◆','shape'],ok:1,ov:[10105,10119,10107,10117]},
 {cat:'color',lv:3,qk:10101,g:['#27ae60','color'],ok:2,ov:[10109,10110,10111,10112]},
 {cat:'symbol',lv:3,qk:10104,g:['E','symbol'],ok:0,ov:['E','F','B','P']},
 {cat:'shape',lv:4,qk:10100,g:['★','shape'],ok:2,ov:[10105,10106,10117,10107]},
 {cat:'symbol',lv:4,qk:10102,g:['8','symbol'],ok:2,ov:['3','6','8','9']},
 {cat:'direction',lv:4,qk:10103,g:['↓','direction'],ok:1,ov:[10113,10114,10115,10116]},
 {cat:'symbol',lv:5,qk:10104,g:['C','symbol'],ok:0,ov:['C','G','O','Q']},
 {cat:'shape',lv:5,qk:10100,g:['●','shape'],ok:2,ov:[10105,10106,10107,10117]},
 {cat:'direction',lv:5,qk:10103,g:['←','direction'],ok:2,ov:[10113,10114,10115,10116]},
 {cat:'shape',lv:6,qk:10100,g:['▼','shape'],ok:1,ov:[10123,10124,10119,10106]},
 {cat:'symbol',lv:6,qk:10102,g:['4','symbol'],ok:1,ov:['1','4','7','9']},
 {cat:'direction',lv:6,qk:10103,g:['↗','direction'],ok:0,ov:['↗','↘','↖','↙']},
 {cat:'symbol',lv:7,qk:10104,g:['A','symbol'],ok:0,ov:['A','R','P','B']},
 {cat:'symbol',lv:7,qk:10102,g:['6','symbol'],ok:1,ov:['5','6','8','0']},
 {cat:'direction',lv:7,qk:10103,g:['↙','direction'],ok:3,ov:['↗','↘','↖','↙']},
 {cat:'symbol',lv:8,qk:10104,g:['H','symbol'],ok:0,ov:['H','N','M','K']},
 {cat:'symbol',lv:8,qk:10102,g:['2','symbol'],ok:0,ov:['2','7','1','4']},
 {cat:'direction',lv:8,qk:10103,g:['↖','direction'],ok:2,ov:['↗','↘','↖','↙']},
 {cat:'fixation',lv:0,qk:10125,g:['●','fix'],ok:0,ov:[],auto:3000},
 {cat:'fixation',lv:0,qk:10126,g:['👁️','fix'],ok:0,ov:[],auto:4000}
]; };


window.EYE_VIS = [0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.63, 0.8, 1.0, 1.25, 1.5];
window.EYE_DIRS = ['↑','→','↓','←'];

/* 지금 거리에서, 그 시력에 해당하는 글자 크기(px) */
window.eyeSizeFor = function(vis){
  var mm = 2.9 / vis;                       /* 40cm 기준 높이 */
  /* ★ 채움 비율에 비례해 키운다 — cm 추정을 버렸다 (메뉴얼: 얼굴이 기준) */
  var _f = window._eyeFit;
  if(_f && _f.face) mm = mm * Math.max(0.6, Math.min(1.8, _f.cm / 35));                      /* 거리에 비례해 키운다 — 각도가 같아진다 */
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
  if(r.at >= r.qs.length){ eyeFinish(); return; }
  r.cur = r.qs[r.at]; r.cur.t0 = Date.now();
  eyeDraw();
};

window.eyeDraw = function(){
  var r = window._eye.run; if(!r || !r.cur) return;
  var head = document.getElementById('eyeTestHead');
  var body = document.getElementById('eyeTestBody');
  if(!head || !body) return;
  var q = r.cur;

  head.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">'
    + '<span style="font-size:12px;font-weight:900;color:#0f766e;">'
    + (r.eye === 'L' ? _ek(10196,'왼쪽 눈') : _ek(10197,'오른쪽 눈')) + '</span>'
    + '<span style="font-size:11px;color:#64748b;">' + (r.at + 1) + ' / ' + r.qs.length + '</span></div>'
    + '<div style="height:6px;border-radius:999px;background:#e2e8f0;margin-top:7px;overflow:hidden;">'
    + '<div style="height:100%;width:' + Math.round((r.at + 1) / r.qs.length * 100) + '%;background:linear-gradient(90deg,#0d9488,#14b8a6);transition:width .25s;"></div></div>';

  /* ★ 문제와 보기 글자도 단계에 따라 작아진다 — 글자 자체가 시표다.
     도형만 작아지면 "삼각형"이라는 큰 글자를 읽고 맞힐 수 있어 시력이 아니라 짐작이 된다. */
  var _lvpx = q.lv ? window.eyeMmToPx(window.EYE_LV[q.lv].mm) : 40;
  var _adj = 1;
  try{ var _ff = window._eyeFit;
       if(_ff && _ff.face) _adj = Math.max(0.6, Math.min(1.8, _ff.cm / 35)); }catch(_){}
  var qpx = q.lv ? Math.max(11, Math.round(_lvpx * 0.42 * _adj)) : 14;
  var opx = q.lv ? Math.max(12, Math.round(_lvpx * 0.34 * _adj)) : 15;

  var glyph = (q.g[1] === 'fix')
    ? '<span style="font-size:60px;color:#0f766e;line-height:1;">' + q.g[0] + '</span>'
    : _eSz(q.lv, q.g[0], q.g[1]);

  var opts = '';
  if(q.ov && q.ov.length){
    opts = '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px;">'
      + q.ov.map(function(o, i){
          var t = (typeof o === 'number') ? _ek(o, '') : o;
          return '<button type="button" onclick="eyeAnswer(' + i + ')" '
            + 'style="padding:6px 4px;min-height:' + Math.max(44, opx + 26) + 'px;border-radius:14px;border:1.5px solid #d7eee8;background:#fff;'
            + 'cursor:pointer;font-family:inherit;font-size:' + opx + 'px;font-weight:800;color:#0f766e;line-height:1.25;">' + t + '</button>';
        }).join('')
      + '</div>'
      + '<button type="button" onclick="eyeAnswer(-1)" data-k="9961" '
      + 'style="width:100%;margin-top:8px;padding:12px;border:1px solid #cbd5e1;border-radius:12px;'
      + 'background:#f8fafc;color:#64748b;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;"></button>';
  }

  body.innerHTML =
    '<div data-k="' + q.qk + '" style="font-size:' + qpx + 'px;font-weight:800;color:#0f172a;text-align:center;margin-top:10px;line-height:1.4;"></div>'
    + '<div style="background:#fff;border:1px solid #d7eee8;border-radius:16px;'
    + 'height:22vh;min-height:110px;display:flex;align-items:center;justify-content:center;margin-top:8px;">'
    + glyph + '</div>' + opts;

  try{ if(window.CGO_T) CGO_T.paint(body); }catch(e){}
  try{ if(window.eyeDistGuard) eyeDistGuard(); }catch(e){}

  /* 시선 고정·깜빡임 문항은 시간이 지나면 저절로 넘어간다 */
  if(q.auto){
    if(r.timer) clearTimeout(r.timer);
    r.timer = setTimeout(function(){ eyeAnswer(0); }, q.auto);
  }
};

window.eyeAnswer = function(i){
  var r = window._eye.run; if(!r || !r.cur) return;
  if(r.timer){ clearTimeout(r.timer); r.timer = null; }
  var q = r.cur;
  /* 이 문항을 풀 때 얼굴이 보였는가 — 화면 표시(딱 맞아요)와 같은 좌표를 본다.
     lastSeen 을 보던 것이 오류였다 — 그 시각을 적는 곳이 없어 늘 0이었다. */
  try{ if(!window._eyeCam) window._eyeCam = {};
       var _f = window._eyeFit;
       var _fr = !!(_f && _f.face && (Date.now() - _f.at) < 2500);
       window._eyeCam.faceFrames = (window._eyeCam.faceFrames || 0) + (_fr ? 1 : 0); }catch(_){}
  var ok = (q.cat === 'fixation') ? true : (i === q.ok);
  r.answers.push({ lv:q.lv, cat:q.cat, ok:ok, ms:Date.now() - q.t0 });
  /* ★ 찍기 걸러내기 — 네 개 중 하나이니 찍어도 25%가 맞는다.
     진짜 보이면 1.5초 안에 누르고, 짐작하면 3초를 넘긴다.
     3초 넘겨 맞힌 것은 반만 인정해 한 단계 밀려 올라가는 것을 막는다. */
  if(q.lv >= 1 && q.lv <= 8){
    var _ms = Date.now() - q.t0;
    var _w = ok ? (_ms > 3000 ? 0.5 : 1) : 0;
    r.lvStat[q.lv].t++;
    r.lvStat[q.lv].c += _w;
  }
  r.at++;
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
    seen = (ok >= need);   /* 문항 절반 이상에서 얼굴이 보였어야 한다 */
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
      + _ek(10194,'얼굴이 한 번도 잡히지 않아 결과를 낼 수 없습니다') + '</div>'
      + '<div style="font-size:11.5px;color:#475569;margin-top:8px;line-height:1.75;">'
      + _ek(10195,'거리를 알 수 없으면 글자 크기가 뜻을 잃습니다. 카메라를 허용하고 얼굴이 보이는 상태에서 다시 재 주세요.') + '</div>'
      + '<button type="button" onclick="eyeTestClose()" style="width:100%;margin-top:16px;padding:14px;border:0;'
      + 'border-radius:999px;background:#0f172a;color:#fff;font-size:13.5px;font-weight:900;cursor:pointer;font-family:inherit;">'
      + _ek(9725,'✓ 닫기') + '</button></div>';
    window._eye.run = null;
    return;
  }
  eyeCamStop();
  try{ if(window.eyeGuardOff) eyeGuardOff(); }catch(e){}
  /* ★ 구 CGO 판정 — 레벨마다 70% 이상 맞히면 통과, 가장 높은 통과 레벨을 취한다.
     사다리로 위로 올리던 방식은 폰에서 시표가 더 작아지지 않아 값이 부풀었다. */
  var vision = 0, passLv = 0;
  for(var _lv = 8; _lv >= 1; _lv--){
    var _s = r.lvStat[_lv];
    if(_s && _s.t > 0 && (_s.c / _s.t) >= 0.7){ passLv = _lv; vision = window.EYE_LV[_lv].vision; break; }
  }
  r.passLv = passLv;
  try{ window._eyeDone.vis = { vision: vision, lv: passLv }; if(window.eyeTabs) eyeTabs(); }catch(_){}
  var right = r.answers.filter(function(a){ return a.ok; }).length;
  var avg = r.answers.length
    ? Math.round(r.answers.reduce(function(t,a){ return t + a.ms; }, 0) / r.answers.length) : 0;
  var cms = [];
  var cm = cms.length ? Math.round(cms.reduce(function(t,c){ return t+c; },0) / cms.length) : 0;

  var head = document.getElementById('eyeTestHead');
  var body = document.getElementById('eyeTestBody');
  if(head) head.innerHTML = '<div style="font-size:12px;font-weight:900;color:#0f766e;">'
    + (r.eye === 'L' ? _ek(10196,'왼쪽 눈') : _ek(10197,'오른쪽 눈')) + ' · ' + _ek(9720,'검사 결과') + '</div>';
  if(!body) return;
  var _lvi = window.EYE_LV[passLv] || null;
  var _show = _lvi ? _lvi.show : '—';
  var _rows = '';
  for(var _q = 1; _q <= 8; _q++){
    var _st = r.lvStat[_q]; if(!_st || !_st.t) continue;
    var _pc = Math.round(_st.c / _st.t * 100), _ps = (_pc >= 70);
    _rows += '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eef4f2;">'
      + '<span style="font-size:12.5px;font-weight:800;color:#0f172a;">Level ' + window.EYE_LV[_q].show
      + ' · <span data-k="10175"></span> ' + window.EYE_LV[_q].show + '</span>'
      + '<span style="font-size:12.5px;font-weight:900;color:' + (_ps ? '#0f766e' : '#be123c') + ';">'
      + (_ps ? '✓ ' : '· ') + _pc + '% (' + (Math.round(_st.c * 10) / 10) + '/' + _st.t + ')</span></div>';
  }
  var _cats = { shape:10176, color:10177, symbol:10178, direction:10179, fixation:10180 }, _cs = {};
  r.answers.forEach(function(a){ if(!_cs[a.cat]) _cs[a.cat] = { c:0, t:0, ms:0 };
    _cs[a.cat].t++; if(a.ok) _cs[a.cat].c++; _cs[a.cat].ms += a.ms; });
  var _crows = '';
  for(var _k in _cats){ var _s = _cs[_k]; if(!_s) continue;
    _crows += '<div style="display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid #eef4f2;">'
      + '<span data-k="' + _cats[_k] + '" style="font-size:12px;font-weight:700;color:#0f172a;"></span>'
      + '<span style="font-size:12px;font-weight:800;color:#0f766e;">'
      + Math.round(_s.c / _s.t * 100) + '% · ' + Math.round(_s.ms / _s.t) + 'ms</span></div>'; }

  body.innerHTML =
    '<div style="background:#fff;border:1px solid #d7eee8;border-radius:18px;padding:24px 16px;margin-top:12px;text-align:center;">'
    + '<div data-k="10181" style="font-size:11px;color:#64748b;font-weight:700;"></div>'
    + '<div style="font-size:46px;font-weight:900;color:#0f766e;line-height:1.1;margin-top:4px;">' + _show + '</div>'
    + (_lvi ? '<div data-k="' + _lvi.lk + '" style="font-size:13px;font-weight:900;color:#0d9488;margin-top:4px;"></div>' : '')
    + '<div style="font-size:11px;color:#475569;margin-top:7px;line-height:1.7;">'
    + _ek(9722,'정답') + ' ' + right + '/' + r.answers.length
    + ' · ' + _ek(9723,'평균 반응') + ' ' + (avg/1000).toFixed(1) + 's'
    + (cm ? '<br>' + _ek(9963,'측정 거리') + ' ' + cm + 'cm' : '') + '</div></div>'
    + '<div style="background:#fff;border:1px solid #d7eee8;border-radius:16px;padding:15px 16px;margin-top:11px;">'
    + '<div data-k="10182" style="font-size:12.5px;font-weight:900;color:#0f766e;margin-bottom:4px;"></div>'
    + _rows + '</div>'
    + '<div style="background:#fff;border:1px solid #d7eee8;border-radius:16px;padding:15px 16px;margin-top:11px;">'
    + '<div data-k="10183" style="font-size:12.5px;font-weight:900;color:#0f766e;margin-bottom:4px;"></div>'
    + _crows + '</div>'
    + (function(){
        var bl = window.eyeBlinkResult ? eyeBlinkResult() : null;
        if(!bl || !bl.sec) return '';
        var bpmOk = (bl.bpm >= 12 && bl.bpm <= 22);
        return '<div style="background:#fff;border:1px solid #d7eee8;border-radius:16px;padding:15px 16px;margin-top:11px;">'
          + '<div style="font-size:12.5px;font-weight:900;color:#0f766e;">' + _ek(10020,'👁️ 눈동자 · 깜빡임') + '</div>'
          + '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:11px;">'
          + '<div style="padding:13px 12px;border-radius:13px;background:' + (bpmOk?'#f0fdf9':'#fffbeb') + ';border:1px solid ' + (bpmOk?'#99f6e4':'#fde68a') + ';">'
          + '<div style="font-size:10px;color:#64748b;font-weight:700;">' + _ek(10021,'분당 깜빡임') + '</div>'
          + '<div style="font-size:19px;font-weight:900;color:' + (bpmOk?'#0f766e':'#b45309') + ';margin-top:3px;">' + bl.bpm + '</div>'
          + '<div style="font-size:9.5px;color:#64748b;margin-top:2px;">' + _ek(10022,'정상 15~20회') + '</div></div>'
          + '<div style="padding:13px 12px;border-radius:13px;background:#eff6ff;border:1px solid #bfdbfe;">'
          + '<div style="font-size:10px;color:#64748b;font-weight:700;">' + _ek(10023,'눈동자 흔들림') + '</div>'
          + '<div style="font-size:19px;font-weight:900;color:#1d4ed8;margin-top:3px;">' + bl.jitter + '</div>'
          + '<div style="font-size:9.5px;color:#64748b;margin-top:2px;">' + _ek(10024,'낮을수록 안정') + '</div></div>'
          + '</div>'
          + (bpmOk ? '' : '<div style="font-size:10.5px;color:#b45309;margin-top:10px;line-height:1.7;">' + _ek(9975,'') + '</div>')
          + '</div>';
      })()
    + '<div style="background:#f0fdf9;border:1px solid #99f6e4;border-radius:14px;padding:14px 15px;margin-top:11px;">'
    + '<div data-k="9964" style="font-size:11px;color:#0f766e;font-weight:800;line-height:1.7;"></div></div>'
    + '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:13px 14px;margin-top:10px;">'
    + '<div data-k="9944" style="font-size:10.5px;color:#64748b;line-height:1.75;"></div></div>'
    + _eyeAiSlot()
    + '<button type="button" onclick="eyeTestClose()" data-k="9725" style="width:100%;margin-top:13px;padding:15px;border:0;'
    + 'border-radius:999px;background:#0f172a;color:#fff;font-size:14px;font-weight:900;cursor:pointer;font-family:inherit;"></button>';
  try{ if(window.CGO_T) CGO_T.paint(body); }catch(e){}
  try{ if(window.eyeAiAnalyze) eyeAiAnalyze(); }catch(e){}
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

  /* ★ 화면 표시(딱 맞아요)와 같은 잣대를 쓴다 — 살색 비율.
     FaceMesh 좌표를 보던 것이 오류였다. 눈 검사에서는 그 좌표가 늘 비어 있다. */
  var f = window._eyeFit;
  var fresh = f && (Date.now() - f.at) < 2500;
  var st = 'ok';
  if(fresh){
    if(!f.face) st = 'none';
    else if(f.cm > 50) st = 'far';
    else if(f.cm < 22) st = 'near';
  }

  if(st === 'ok'){ if(veil) veil.remove(); return; }

  /* 문항 칸 전체를 덮는다 — 도형과 보기까지 가려야 뜻이 있다 */
  if(!veil || veil.parentNode !== box){
    if(veil) veil.remove();
    veil = document.createElement('div');
    veil.id = 'eye-veil';
    box.appendChild(veil);
  }
  box.style.position = 'relative';
  veil.style.cssText = 'position:absolute;left:0;right:0;top:0;bottom:0;z-index:40;display:flex;'
    + 'flex-direction:column;align-items:center;justify-content:center;background:rgba(190,18,60,.96);'
    + 'color:#fff;border-radius:16px;text-align:center;padding:20px;';
  veil.innerHTML = '<div style="font-size:34px;line-height:1">' + (st === 'none' ? '📷' : '📏') + '</div>'
    + '<div style="font-size:15px;font-weight:900;margin-top:10px;">'
    + (st === 'none' ? _ek(10193,'얼굴이 보이지 않습니다')
       : st === 'near' ? _ek(8821,'조금 더 멀리') : _ek(8820,'조금 더 가까이')) + '</div>'
    + '<div style="font-size:12px;margin-top:8px;opacity:.92;line-height:1.6;">'
    + _ek(9959,'얼굴이 화면에 알맞게 들어와야 정확합니다') + (fresh && f.face ? ' · ' + f.cm + 'cm' : '') + '</div>';
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
    /* 팔이 짧아도 되게 넓힌다 — 20cm는 사람이 맞추기 어려웠다 */
    var _f2 = window._eyeFit;
  var _fr2 = _f2 && (Date.now() - _f2.at) < 2500;
  var ok = (!_fr2) || (_f2.face && _f2.cm >= 22 && _f2.cm <= 50);
    var el = box(); if(!el) return;
    if(ok){
      el.style.display = 'none';
      return;
    }
    el.style.display = 'flex';
    var m = document.getElementById('eye-lock-msg');
    var s = document.getElementById('eye-lock-sub');
    if(m) m.textContent = (fill > 0.72 ? K(8821,'📏 조금 더 멀리') : K(8820,'📏 조금 더 가까이'))
      ;
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


/* ══ 눈 질병 예측 지표 — 표현은 웰니스, 기술은 예측 가능하게 ══
   rPPG 눈가 혈류 · 눈동자 흔들림 · 깜빡임 · 좌우 차이 · 충혈/황변 색조 */
window.eyeRiskFlags = function(r){
  var out = [];
  try{
    var L = (r && r.scoreL) || 0, R = (r && r.scoreR) || 0;
    var diff = Math.abs(L - R);
    var blink = (window._eyeCam && window._eyeCam.blinkPerMin) || 0;
    var jitter = (window._eyeCam && window._eyeCam.jitter) || 0;
    var redness = (window._eyeCam && window._eyeCam.redness) || 0;
    var yellow = (window._eyeCam && window._eyeCam.yellow) || 0;

    /* 좌우 차이 — 한쪽 눈만 나빠지는 흐름 */
    if(diff >= 0.3) out.push({ k:10010, lv:'watch' });
    /* 깜빡임 감소 — 안구건조 쪽 */
    if(blink && blink < 8) out.push({ k:10011, lv:'watch' });
    /* 눈동자 흔들림 큼 — 피로·초점 유지 어려움 */
    if(jitter > 0.55) out.push({ k:10012, lv:'watch' });
    /* 충혈 — 염증·피로 */
    if(redness > 0.6) out.push({ k:10013, lv:'watch' });
    /* 황변 — 간·대사 쪽 참고 */
    if(yellow > 0.55) out.push({ k:10014, lv:'watch' });
  }catch(e){}
  return out;
};

/* ══ 네 갈래 검사 — 카메라는 한 번만 켜고 검사만 갈아탄다 ══ */
window.EYE_MODES = ['vis','asti','color','focus'];
window._eyeDone = window._eyeDone || {};

window.eyeTabs = function(){
  var box = document.getElementById('eye-tabs');
  if(!box) return;
  var cur = (window._eye.run && window._eye.run.mode) || window._eye.mode || 'vis';
  var defs = [
    {m:'vis',   ic:'🔍', k:10130},
    {m:'asti',  ic:'✳️', k:10131},
    {m:'color', ic:'🎨', k:10132},
    {m:'focus', ic:'↔️', k:10133}
  ];
  box.innerHTML = defs.map(function(d){
    var on = (d.m === cur);
    var fin = !!window._eyeDone[d.m];
    return '<button type="button" onclick="eyeSwitch(\'' + d.m + '\')" '
      + 'style="padding:9px 4px;border-radius:12px;border:1.5px solid ' + (on?'#0d9488':'#d7eee8') + ';'
      + 'background:' + (on?'#0d9488':'#fff') + ';color:' + (on?'#fff':'#0f766e') + ';'
      + 'font-family:inherit;font-size:11px;font-weight:800;cursor:pointer;line-height:1.3;">'
      + '<span style="font-size:15px;display:block;">' + d.ic + '</span>'
      + '<span data-k="' + d.k + '"></span>'
      + (fin ? '<span style="display:block;font-size:9px;color:' + (on?'#a7f3d0':'#0d9488') + ';margin-top:2px;">✔</span>' : '')
      + '</button>';
  }).join('');
  try{ if(window.CGO_T) CGO_T.paint(box); }catch(e){}
};

window.eyeSwitch = function(m){
  window._eye.mode = m;
  var r = window._eye.run;
  if(r) r.mode = m;
  eyeTabs();
  eyeBegin(m);
};

/* 검사 하나를 시작한다 — 카메라는 이미 켜져 있다 */
window.eyeBegin = function(m){
  var s = window._eye;
  s.mode = m;
  if(m === 'vis'){
    s.run = { eye:s.eye, mode:'vis', qs: window.eyeBank(), at:0, answers:[],
              lvStat:{1:{c:0,t:0},2:{c:0,t:0},3:{c:0,t:0},4:{c:0,t:0},5:{c:0,t:0},6:{c:0,t:0},7:{c:0,t:0},8:{c:0,t:0}} };
  }else if(m === 'asti'){
    s.run = { eye:s.eye, mode:'asti', at:0, answers:[] };
  }else if(m === 'color'){
    s.run = { eye:s.eye, mode:'color', qs: window.eyeColorBank(), at:0, answers:[] };
  }else{
    s.run = { eye:s.eye, mode:'focus', at:0, answers:[], phase:'near' };
  }
  try{ window._eyeCam = window._eyeCam || {}; window._eyeCam.faceFrames = 0; }catch(_){}
  eyeTabs();
  try{ if(window.eyeGuardOn) eyeGuardOn(); }catch(_){}
  if(m === 'asti') eyeAstiDraw();
  else if(m === 'color') eyeColorDraw();
  else if(m === 'focus') eyeFocusDraw();
  else eyeNext();
};

/* ══ ✳️ 난시 — 방사선 시표 (안과 방식: 어느 방향 선이 더 진한가) ══ */
window.eyeAstiDraw = function(){
  var head = document.getElementById('eyeTestHead');
  var body = document.getElementById('eyeTestBody');
  if(!head || !body) return;
  var r = window._eye.run;

  head.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;">'
    + '<span style="font-size:12px;font-weight:900;color:#0f766e;">'
    + (r.eye === 'L' ? _ek(10196,'왼쪽 눈') : _ek(10197,'오른쪽 눈')) + '</span>'
    + '<span data-k="10131" style="font-size:11px;color:#64748b;"></span></div>';

  /* 12방향 부챗살 */
  var lines = '';
  for(var a = 0; a < 12; a++){
    var deg = a * 15;
    lines += '<div style="position:absolute;left:50%;top:50%;width:2px;height:44%;'
      + 'background:#0f172a;transform-origin:50% 0;transform:translate(-50%,0) rotate(' + (deg + 180) + 'deg);"></div>'
      + '<div style="position:absolute;left:50%;top:50%;width:2px;height:44%;'
      + 'background:#0f172a;transform-origin:50% 0;transform:translate(-50%,0) rotate(' + deg + 'deg);"></div>';
  }

  var opts = '';
  for(var i = 0; i < 12; i++){
    var d = i * 15;
    opts += '<button type="button" onclick="eyeAstiPick(' + d + ')" '
      + 'style="padding:9px 0;border-radius:11px;border:1.5px solid #d7eee8;background:#fff;'
      + 'font-family:inherit;font-size:12px;font-weight:800;color:#0f766e;cursor:pointer;">'
      + d + '°</button>';
  }

  body.innerHTML =
    '<div data-k="10140" style="font-size:13px;font-weight:800;color:#0f172a;text-align:center;line-height:1.5;"></div>'
    + '<div style="background:#fff;border:1px solid #d7eee8;border-radius:16px;padding:14px;margin-top:9px;">'
    + '<div style="position:relative;width:100%;max-width:230px;aspect-ratio:1/1;margin:0 auto;">'
    + lines
    + '<div style="position:absolute;left:50%;top:50%;width:12px;height:12px;border-radius:50%;'
    + 'background:#fff;border:2px solid #0f172a;transform:translate(-50%,-50%);"></div></div></div>'
    + '<div data-k="10141" style="font-size:11px;color:#64748b;text-align:center;margin-top:9px;line-height:1.6;"></div>'
    + '<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-top:9px;">' + opts + '</div>'
    + '<button type="button" onclick="eyeAstiPick(-1)" data-k="10142" '
    + 'style="width:100%;margin-top:8px;padding:13px;border:1px solid #cbd5e1;border-radius:12px;'
    + 'background:#f8fafc;color:#64748b;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;"></button>';

  try{ if(window.CGO_T) CGO_T.paint(body); }catch(e){}
  try{ if(window.eyeDistGuard) eyeDistGuard(); }catch(e){}
};

window.eyeAstiPick = function(deg){
  var r = window._eye.run; if(!r) return;
  /* 얼굴이 보였는지 센다 */
  try{ var _f = window._eyeFit;
       if(_f && _f.face && (Date.now() - _f.at) < 2500) window._eyeCam.faceFrames = (window._eyeCam.faceFrames||0) + 1; }catch(_){}
  r.axis = deg;
  window._eyeDone.asti = { axis: deg };
  eyeResultAsti();
};

/* ══ 🎨 색채 인지 — 이시하라식 점무늬 ══ */
window.eyeColorBank = function(){ return [
  {n:'12', bg:['#9aa06b','#b5b26e','#8a9159'], fg:['#c86f4a','#d98a52','#b85f3e'], ov:['12','17','21','74']},
  {n:'8',  bg:['#a8a86a','#b9b878','#96975c'], fg:['#c9714b','#dd8f55','#bb6240'], ov:['3','8','6','9']},
  {n:'29', bg:['#9fa46d','#b2b174','#8d945a'], fg:['#cf7a4e','#e09257','#c06843'], ov:['29','70','79','20']},
  {n:'5',  bg:['#aab06f','#bcbb79','#98995e'], fg:['#7fa05c','#93b168','#6d8f50'], ov:['5','2','3','6']},
  {n:'3',  bg:['#a5a96c','#b7b676','#93985b'], fg:['#c8734c','#da8b54','#b6603f'], ov:['3','5','8','6']},
  {n:'15', bg:['#9ea36c','#b0af73','#8c9359'], fg:['#7ea05b','#92b067','#6c8e4f'], ov:['15','17','75','13']}
]; };

function _eyeDots(q, size){
  var n = 240, out = '';
  var g = _eyeGlyphMask(q.n);
  for(var i = 0; i < n; i++){
    var x = Math.random(), y = Math.random();
    var inFg = _eyeInMask(g, x, y);
    var pal = inFg ? q.fg : q.bg;
    var c = pal[(Math.random() * pal.length) | 0];
    var d = 4 + Math.random() * 7;
    out += '<span style="position:absolute;left:' + (x * 100).toFixed(1) + '%;top:' + (y * 100).toFixed(1) + '%;'
      + 'width:' + d.toFixed(1) + 'px;height:' + d.toFixed(1) + 'px;border-radius:50%;background:' + c + ';'
      + 'transform:translate(-50%,-50%);"></span>';
  }
  return out;
}
/* 숫자 모양을 격자로 — 점을 그 안에 넣는다 */
var _EYE_FONT = {
 '0':['01110','10001','10001','10001','10001','10001','01110'],
 '1':['00100','01100','00100','00100','00100','00100','01110'],
 '2':['01110','10001','00001','00010','00100','01000','11111'],
 '3':['11110','00001','00001','01110','00001','00001','11110'],
 '5':['11111','10000','11110','00001','00001','10001','01110'],
 '6':['00110','01000','10000','11110','10001','10001','01110'],
 '7':['11111','00001','00010','00100','01000','01000','01000'],
 '8':['01110','10001','10001','01110','10001','10001','01110'],
 '9':['01110','10001','10001','01111','00001','00010','01100']
};
function _eyeGlyphMask(txt){
  var cols = [], rows = 7;
  for(var i = 0; i < txt.length; i++){
    var g = _EYE_FONT[txt[i]] || _EYE_FONT['0'];
    cols.push(g);
  }
  return { glyphs: cols, rows: rows, cw: 5 };
}
function _eyeInMask(m, x, y){
  var pad = 0.12;
  if(x < pad || x > 1 - pad || y < pad || y > 1 - pad) return false;
  var nx = (x - pad) / (1 - pad * 2), ny = (y - pad) / (1 - pad * 2);
  var gi = Math.min(m.glyphs.length - 1, (nx * m.glyphs.length) | 0);
  var lx = nx * m.glyphs.length - gi;
  var cx = Math.min(m.cw - 1, (lx * m.cw) | 0);
  var cy = Math.min(m.rows - 1, (ny * m.rows) | 0);
  return m.glyphs[gi][cy][cx] === '1';
}

window.eyeColorDraw = function(){
  var head = document.getElementById('eyeTestHead');
  var body = document.getElementById('eyeTestBody');
  if(!head || !body) return;
  var r = window._eye.run;
  if(r.at >= r.qs.length){ eyeResultColor(); return; }
  var q = r.qs[r.at];

  head.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;">'
    + '<span data-k="10132" style="font-size:12px;font-weight:900;color:#0f766e;"></span>'
    + '<span style="font-size:11px;color:#64748b;">' + (r.at + 1) + ' / ' + r.qs.length + '</span></div>'
    + '<div style="height:6px;border-radius:999px;background:#e2e8f0;margin-top:7px;overflow:hidden;">'
    + '<div style="height:100%;width:' + Math.round((r.at + 1) / r.qs.length * 100) + '%;'
    + 'background:linear-gradient(90deg,#0d9488,#14b8a6);transition:width .25s;"></div></div>';

  body.innerHTML =
    '<div data-k="10143" style="font-size:13px;font-weight:800;color:#0f172a;text-align:center;margin-top:10px;"></div>'
    + '<div style="background:#f6f5ee;border:1px solid #d7eee8;border-radius:16px;padding:14px;margin-top:9px;">'
    + '<div style="position:relative;width:100%;max-width:220px;aspect-ratio:1/1;margin:0 auto;'
    + 'border-radius:50%;overflow:hidden;background:#eceadf;">' + _eyeDots(q) + '</div></div>'
    + '<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:10px;">'
    + q.ov.map(function(o, i){
        return '<button type="button" onclick="eyeColorPick(' + i + ')" '
          + 'style="padding:13px 0;border-radius:12px;border:1.5px solid #d7eee8;background:#fff;'
          + 'font-family:inherit;font-size:17px;font-weight:900;color:#0f766e;cursor:pointer;">' + o + '</button>';
      }).join('')
    + '</div>'
    + '<button type="button" onclick="eyeColorPick(-1)" data-k="10144" '
    + 'style="width:100%;margin-top:8px;padding:13px;border:1px solid #cbd5e1;border-radius:12px;'
    + 'background:#f8fafc;color:#64748b;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;"></button>';

  try{ if(window.CGO_T) CGO_T.paint(body); }catch(e){}
  try{ if(window.eyeDistGuard) eyeDistGuard(); }catch(e){}
};

window.eyeColorPick = function(i){
  var r = window._eye.run; if(!r) return;
  try{ var _f = window._eyeFit;
       if(_f && _f.face && (Date.now() - _f.at) < 2500) window._eyeCam.faceFrames = (window._eyeCam.faceFrames||0) + 1; }catch(_){}
  var q = r.qs[r.at];
  var ok = (i >= 0 && q.ov[i] === q.n);
  r.answers.push({ ok: ok });
  r.at++;
  eyeColorDraw();
};

/* ══ ↔️ 원·근 경향 — 같은 시표를 두 거리에서 재고 견준다 ══ */
window.eyeFocusDraw = function(){
  var head = document.getElementById('eyeTestHead');
  var body = document.getElementById('eyeTestBody');
  if(!head || !body) return;
  var r = window._eye.run;
  var near = (r.phase === 'near');
  var set = ['E','3','m','6','C','8'];
  if(r.at >= set.length){
    if(near){ r.phase = 'far'; r.at = 0; r.nearOk = r.answers.filter(function(a){return a.ok;}).length; r.answers = []; }
    else { r.farOk = r.answers.filter(function(a){return a.ok;}).length; eyeResultFocus(); return; }
  }
  var ch = set[r.at];
  var pool = ['E','F','3','8','m','n','6','C','G','2','5','B'];
  var opts = [ch];
  while(opts.length < 4){ var c = pool[(Math.random()*pool.length)|0]; if(opts.indexOf(c) < 0) opts.push(c); }
  for(var i = opts.length - 1; i > 0; i--){ var j = (Math.random()*(i+1))|0; var t = opts[i]; opts[i] = opts[j]; opts[j] = t; }
  r.cur = { ch: ch, opts: opts };

  head.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;">'
    + '<span data-k="' + (near ? 10145 : 10146) + '" style="font-size:12px;font-weight:900;color:#0f766e;"></span>'
    + '<span style="font-size:11px;color:#64748b;">' + (r.at + 1) + ' / ' + set.length + '</span></div>'
    + '<div style="height:6px;border-radius:999px;background:#e2e8f0;margin-top:7px;overflow:hidden;">'
    + '<div style="height:100%;width:' + Math.round((r.at+1)/set.length*100) + '%;'
    + 'background:linear-gradient(90deg,' + (near ? '#f59e0b,#fbbf24' : '#0d9488,#14b8a6') + ');"></div></div>';

  body.innerHTML =
    '<div data-k="' + (near ? 10147 : 10148) + '" style="font-size:13px;font-weight:800;color:'
    + (near ? '#b45309' : '#0f766e') + ';text-align:center;margin-top:10px;line-height:1.5;"></div>'
    + '<div style="background:#fff;border:1px solid #d7eee8;border-radius:16px;'
    + 'height:20vh;min-height:104px;display:flex;align-items:center;justify-content:center;margin-top:9px;">'
    + '<span style="font-size:22px;font-weight:900;color:#0f172a;line-height:1;">' + ch + '</span></div>'
    + '<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:10px;">'
    + opts.map(function(o, i){
        return '<button type="button" onclick="eyeFocusPick(' + i + ')" '
          + 'style="padding:14px 0;border-radius:12px;border:1.5px solid #d7eee8;background:#fff;'
          + 'font-family:inherit;font-size:18px;font-weight:900;color:#0f766e;cursor:pointer;">' + o + '</button>';
      }).join('')
    + '</div>';

  try{ if(window.CGO_T) CGO_T.paint(body); }catch(e){}
  /* 이 검사는 거리를 일부러 달리 잡는다 — 거리 커버를 쓰지 않는다 */
  var v = document.getElementById('eye-veil'); if(v) v.remove();
};

window.eyeFocusPick = function(i){
  var r = window._eye.run; if(!r || !r.cur) return;
  try{ var _f = window._eyeFit;
       if(_f && _f.face && (Date.now() - _f.at) < 2500) window._eyeCam.faceFrames = (window._eyeCam.faceFrames||0) + 1; }catch(_){}
  r.answers.push({ ok: (r.cur.opts[i] === r.cur.ch) });
  r.at++;
  eyeFocusDraw();
};

/* ══ 결과 — 검사마다 그 자리에 남는다 ══ */
function _eyeCard(titleK, big, subHtml, color){
  return '<div style="background:#fff;border:1px solid #d7eee8;border-radius:18px;padding:22px 16px;margin-top:12px;text-align:center;">'
    + '<div data-k="' + titleK + '" style="font-size:11px;color:#64748b;font-weight:700;"></div>'
    + '<div style="font-size:38px;font-weight:900;color:' + (color||'#0f766e') + ';line-height:1.15;margin-top:5px;">' + big + '</div>'
    + '<div style="font-size:11.5px;color:#475569;margin-top:8px;line-height:1.7;">' + subHtml + '</div></div>';
}
function _eyeAiSlot(){ return '<div id="eye-ai"></div>'; }
function _eyeAgain(){
  return '<button type="button" onclick="eyeTestClose()" data-k="9725" '
    + 'style="width:100%;margin-top:14px;padding:14px;border:0;border-radius:999px;background:#0f172a;'
    + 'color:#fff;font-size:13.5px;font-weight:900;cursor:pointer;font-family:inherit;"></button>';
}
function _eyeFaceOk(){
  try{ return (window._eyeCam && window._eyeCam.faceFrames || 0) >= 1; }catch(_){ return false; }
}
function _eyeNoFace(body){
  body.innerHTML = '<div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:16px;padding:22px 18px;margin-top:13px;text-align:center;">'
    + '<div style="font-size:30px;line-height:1;">📷</div>'
    + '<div data-k="10194" style="font-size:14px;font-weight:900;color:#be123c;margin-top:10px;line-height:1.5;"></div>'
    + '<div data-k="10195" style="font-size:11.5px;color:#475569;margin-top:8px;line-height:1.75;"></div>'
    + _eyeAgain() + '</div>';
  try{ if(window.CGO_T) CGO_T.paint(body); }catch(e){}
}

window.eyeResultAsti = function(){
  var r = window._eye.run;
  var body = document.getElementById('eyeTestBody');
  var head = document.getElementById('eyeTestHead');
  if(!body) return;
  if(head) head.innerHTML = '';
  if(!_eyeFaceOk()){ _eyeNoFace(body); return; }
  var none = (r.axis < 0);
  window._eyeDone.asti = { axis: r.axis, none: none };
  body.innerHTML = _eyeCard(10149, none ? '—' : (r.axis + '°'),
    '<span data-k="' + (none ? 10150 : 10151) + '"></span>', none ? '#0d9488' : '#b45309')
    + '<div data-k="10152" style="font-size:11px;color:#64748b;text-align:center;margin-top:10px;line-height:1.7;"></div>'
    + _eyeAiSlot() + _eyeAgain();
  eyeTabs();
  try{ if(window.CGO_T) CGO_T.paint(body); }catch(e){}
  try{ if(window.eyeAiAnalyze) eyeAiAnalyze(); }catch(e){}
};

window.eyeResultColor = function(){
  var r = window._eye.run;
  var body = document.getElementById('eyeTestBody');
  var head = document.getElementById('eyeTestHead');
  if(!body) return;
  if(head) head.innerHTML = '';
  if(!_eyeFaceOk()){ _eyeNoFace(body); return; }
  var ok = r.answers.filter(function(a){ return a.ok; }).length;
  var score = Math.round(ok / r.qs.length * 100);
  window._eyeDone.color = { score: score, ok: ok, n: r.qs.length };
  body.innerHTML = _eyeCard(10153, score, ok + '/' + r.qs.length
    + ' · <span data-k="' + (score >= 84 ? 10154 : score >= 50 ? 10155 : 10156) + '"></span>',
    score >= 84 ? '#0f766e' : score >= 50 ? '#b45309' : '#be123c')
    + '<div data-k="10157" style="font-size:11px;color:#64748b;text-align:center;margin-top:10px;line-height:1.7;"></div>'
    + _eyeAiSlot() + _eyeAgain();
  eyeTabs();
  try{ if(window.CGO_T) CGO_T.paint(body); }catch(e){}
  try{ if(window.eyeAiAnalyze) eyeAiAnalyze(); }catch(e){}
};

window.eyeResultFocus = function(){
  var r = window._eye.run;
  var body = document.getElementById('eyeTestBody');
  var head = document.getElementById('eyeTestHead');
  if(!body) return;
  if(head) head.innerHTML = '';
  if(!_eyeFaceOk()){ _eyeNoFace(body); return; }
  var n = r.nearOk || 0, f = r.farOk || 0;
  var tend = (f < n - 1) ? 'near' : (n < f - 1) ? 'far' : 'even';
  window._eyeDone.focus = { near: n, far: f, tend: tend };
  var K = { near: 10158, far: 10159, even: 10160 };
  body.innerHTML = _eyeCard(10161, '<span data-k="' + K[tend] + '" style="font-size:22px;"></span>',
    '<span data-k="10162"></span> ' + n + '/6 · <span data-k="10163"></span> ' + f + '/6',
    tend === 'even' ? '#0f766e' : '#b45309')
    + '<div data-k="10164" style="font-size:11px;color:#64748b;text-align:center;margin-top:10px;line-height:1.7;"></div>'
    + _eyeAiSlot() + _eyeAgain();
  eyeTabs();
  try{ if(window.CGO_T) CGO_T.paint(body); }catch(e){}
  try{ if(window.eyeAiAnalyze) eyeAiAnalyze(); }catch(e){}
};

/* ══ 🤖 AI 눈 상태 분석 — 구 CGO 7가지 갈래 (숫자만 보낸다 · 영상은 나가지 않는다) ══ */
window.eyeAiAnalyze = function(){
  var box = document.getElementById('eye-ai');
  if(!box) return;
  var d = window._eyeDone || {};
  var bl = null; try{ bl = window.eyeBlinkResult ? eyeBlinkResult() : null; }catch(_){}
  var r = window._eye.run || {};
  var avg = 0;
  try{ var A = r.answers || []; avg = A.length ? Math.round(A.reduce(function(t,a){return t+(a.ms||0);},0)/A.length) : 0; }catch(_){}

  var facts = {
    eye: (window._eye.eye === 'L') ? 'left' : 'right',
    acuityShow: d.vis ? (window.EYE_LV[d.vis.lv] || {}).show : null,
    level: d.vis ? d.vis.lv : null,
    astiAxis: d.asti ? (d.asti.none ? null : d.asti.axis) : undefined,
    colorScore: d.color ? d.color.score : undefined,
    focusTend: d.focus ? d.focus.tend : undefined,
    blinkBpm: bl ? bl.bpm : null,
    jitter: bl ? bl.jitter : null,
    avgMs: avg
  };

  box.innerHTML = '<div style="background:#fff;border:1px solid #d7eee8;border-radius:16px;padding:16px;margin-top:11px;">'
    + '<div data-k="10190" style="font-size:12.5px;font-weight:900;color:#0f766e;"></div>'
    + '<div id="eye-ai-body" data-k="10191" style="font-size:12px;color:#475569;margin-top:9px;line-height:1.75;"></div></div>';
  try{ if(window.CGO_T) CGO_T.paint(box); }catch(_){}

  var lang = (window.CGO_T && CGO_T.cur && CGO_T.cur()) || 'ko';
  fetch('/api/groq', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ feature:'eye', lang: lang, result: facts,
      env: (window.cgoEnvBrief ? cgoEnvBrief() : ''),
      message: 'eye wellness reading' })
  })
  .then(function(x){ return x.json(); })
  .then(function(j){
    var t = (j && (j.reply || j.text || j.message)) || '';
    var el = document.getElementById('eye-ai-body');
    if(!el) return;
    if(t){ el.removeAttribute('data-k'); el.innerHTML = String(t).replace(/\n/g,'<br>'); }
  })
  .catch(function(){
    var el = document.getElementById('eye-ai-body');
    if(el){ el.setAttribute('data-k','10192'); try{ if(window.CGO_T) CGO_T.paint(el.parentNode); }catch(_){} }
  });
};


/* ══ 자(尺) — 눈 사이 실제 거리로 화면 크기와 거리를 잰다 ══
   오행 의류가 키(cm)를 자로 써서 어깨너비를 재듯,
   여기서는 눈 사이(mm)를 자로 써서 화면 화소와 거리를 잰다.
   키를 안 넣었으면 옛 방식(살색 비율)으로 물러난다. */
window.eyeRuler = function(){
  var mm = null;
  try{ mm = window.cgoIpdMm ? cgoIpdMm() : null; }catch(_){}
  if(!mm) return null;
  var lms = null;
  try{ lms = (window._c24 && window._c24._faceLms) || window._eyeLms || null; }catch(_){}
  if(!lms || lms.length < 400) return null;
  var L = lms[468] || lms[33], R = lms[473] || lms[263];
  if(!L || !R) return null;
  var v = document.getElementById('eye-video');
  var vw = (v && v.videoWidth) || 640;
  var dxPx = Math.abs(L.x - R.x) * vw;
  if(dxPx < 8) return null;
  /* 카메라 화각을 알면 거리가 나온다. 모르면 폰 앞 카메라 평균값(약 68°)을 쓴다. */
  var fov = 68;
  try{ var s = window._eye.stream, t = s && s.getVideoTracks && s.getVideoTracks()[0];
       var c = t && t.getSettings && t.getSettings();
       if(c && c.width && window._eyeFovCache) fov = window._eyeFovCache; }catch(_){}
  var f = (vw / 2) / Math.tan(fov * Math.PI / 360);   /* 초점거리(화소) */
  var cm = (mm * f) / dxPx / 10;                       /* 거리 cm */
  if(!isFinite(cm) || cm < 8 || cm > 120) return null;
  return { cm: Math.round(cm * 10) / 10, ipd: mm, dxPx: Math.round(dxPx) };
};


/* ══ 사람 확인 — 초록 채널에 심장 주기(0.8~2Hz)가 있는가 ══
   벽·사진은 맥이 없다. 사람만 있다. */
window.eyePulseOk = function(){
  var b = window._eyeGbuf;
  if(!b || b.length < 30) return null;          /* 아직 모른다 */
  var n = b.length, mean = 0;
  for(var i = 0; i < n; i++) mean += b[i];
  mean /= n;
  var v = 0;
  for(var j = 0; j < n; j++) v += (b[j]-mean)*(b[j]-mean);
  v = Math.sqrt(v / n);
  if(v < 0.15) return false;                    /* 아예 안 변한다 → 벽 */
  /* 오르내림 횟수로 대략의 주기를 본다 (0.1초마다 한 칸) */
  var cross = 0;
  for(var k = 1; k < n; k++){
    if((b[k-1] - mean) * (b[k] - mean) < 0) cross++;
  }
  var hz = (cross / 2) / (n * 0.1);
  return (hz >= 0.6 && hz <= 2.6);
};


/* ══ 얼굴 좌표 프로그램을 눈 검사에서도 받아 온다 ══
   c24.js 안에서만 불러오던 탓에, 나의 건강 밸런스를 열지 않으면 없었다.
   없으면 자가 조용히 물러나 살색 방식으로 떨어졌다 — 그것이 벽에 속은 원인이다. */
window.eyeFMEnsure = function(){
  if(typeof FaceMesh !== 'undefined') return Promise.resolve(true);
  if(window._eyeFMLoading) return window._eyeFMLoading;
  window._eyeFMLoading = new Promise(function(done){
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js';
    s.async = true;
    s.onload = function(){ done(typeof FaceMesh !== 'undefined'); };
    s.onerror = function(){ done(false); };
    document.head.appendChild(s);
  });
  return window._eyeFMLoading;
};
