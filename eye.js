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
  function tick(){
    if(!window._eye.stream) return;
    var fill = 0;
    try{ if(window._c24 && _c24._faceLms && _c24._faceLms.length && window.cgoFaceFill) fill = cgoFaceFill(_c24._faceLms); }catch(e){}
    var st = window.cgoFitState ? cgoFitState(fill, 'eye') : 'ok';
    /* ★ 거리가 벗어나면 시표를 가리고 답을 못 하게 잠근다 (구 CGO와 같은 방식) */
    var lock = (st === 'far' || st === 'near');
    window._eye.locked = lock;
    var body = document.getElementById('eyeTestBody');
    if(body){
      body.style.pointerEvents = lock ? 'none' : '';
      /* ★ 거리가 벗어나면 빨간 막으로 덮는다 — 흐리게만 하면 왜 안 눌리는지 모른다 */
      /* ★ 카메라가 아니라 문제를 덮는다 — 카메라를 가리면 거리를 못 잰다 */
      var wrap = body;
      if(getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
      if(wrap){
        var m0 = document.getElementById('eye-lock');
        if(lock){
          if(!m0){
            m0 = document.createElement('div');
            m0.id = 'eye-lock';
            m0.style.cssText = 'position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;'
              + 'align-items:center;justify-content:center;gap:6px;background:rgba(190,18,60,.82);'
              + 'color:#fff;text-align:center;padding:12px;font-weight:900;';
            wrap.appendChild(m0);
          }
          m0.innerHTML = '<div style="font-size:26px;line-height:1">📏</div>'
            + '<div style="font-size:13px;line-height:1.5">'
            + (st === 'far' ? _ek(8820,'조금 더 가까이') : _ek(8821,'조금 더 멀리')) + '</div>'
            + '<div style="font-size:11px;font-weight:700;opacity:.9">' + _ek(9959,'화면에서 7cm') + '</div>';
        } else if(m0) m0.remove();
      }
      body.style.opacity = '1';
    }
    if(st === 'far')       box.textContent = _ek(8820,'📏 조금 더 가까이');
    else if(st === 'near') box.textContent = _ek(8821,'📏 조금 더 멀리');
    else if(st === 'ok'){  box.textContent = _ek(8762,'✅ 딱 맞아요');
                           try{ if(window.cgoFitBeep) cgoFitBeep('eye'); }catch(e){} }
    else box.textContent = '';
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
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
  if(r.at >= r.trials.length){ eyeFinish(); return; }
  var t = r.trials[r.at];
  var pct = Math.round(r.at / r.trials.length * 100);
  head.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">'
    + '<span style="font-size:12px;font-weight:900;color:#0f766e;">' + _ek(9957,'시표 읽기') + ' · '
    + (window._eye.side === 'L' ? _ek(9943,'왼쪽 눈') : _ek(9945,'오른쪽 눈')) + '</span>'
    + '<span style="font-size:11px;color:#64748b;">' + (r.at+1) + ' / ' + r.trials.length + '</span></div>'
    + '<div style="height:6px;border-radius:999px;background:#e2e8f0;margin-top:8px;overflow:hidden;">'
    + '<div style="height:100%;width:' + pct + '%;background:linear-gradient(90deg,#0d9488,#14b8a6);transition:width .25s;"></div></div>';

  /* 란돌트 고리 — 단계가 오를수록 작아진다. 틈이 어느 쪽인지 답한다 */
  var size = Math.max(14, 120 - r.at * 7);
  var gap  = size * 0.2;
  var dirs = ['up','right','down','left'];
  var dir  = t.dir || dirs[Math.floor(Math.random()*4)];
  t.dir = dir;
  var rot  = { up:270, right:0, down:90, left:180 }[dir];
  var half = size/2, ring = size*0.2;
  var svg =
    '<svg width="' + size + '" height="' + size + '" viewBox="0 0 100 100" style="display:block">'
    + '<g transform="rotate(' + rot + ' 50 50)">'
    + '<path d="M50 10 A40 40 0 1 1 49.9 10" fill="none" stroke="#0f172a" stroke-width="20"'
    + ' stroke-dasharray="' + (2*Math.PI*40*0.86) + ' 999" transform="rotate(6 50 50)"/>'
    + '</g></svg>';

  body.innerHTML =
    '<div style="background:#fff;border:1px solid #d7eee8;border-radius:16px;padding:16px;margin-top:10px;'
    + 'display:flex;flex-direction:column;align-items:center;gap:10px;">'
    + '<div style="font-size:11px;color:#64748b;font-weight:700;">' + _ek(9958,'틈이 어느 쪽인가요?') + '</div>'
    + svg + '</div>'
    + '<div style="display:grid;grid-template-columns:repeat(3,56px);grid-auto-rows:56px;gap:0;margin-top:10px;justify-content:center;">'
    + '<span></span>' + _eyeBtn('up','▲') + '<span></span>'
    + _eyeBtn('left','◀') + '<span></span>' + _eyeBtn('right','▶')
    + '<span></span>' + _eyeBtn('down','▼') + '<span></span>'
    + '</div>';
  r.tq = Date.now();
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
