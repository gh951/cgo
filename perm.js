/* ══ 권한 관리 ══
   위치: 앱 들어올 때 한 번만 묻고 값을 보관해 재사용한다.
   카메라: 카메라 기능에 들어갈 때 한 번만 묻고, 기능 페이지를 벗어나면 즉시 끈다. */
(function(){
  'use strict';

  /* ── 카메라 기능이 있는 페이지 ── */
  var CAM_PAGES = ['c24','c39','scalp','c44-eye','c41','acc-cam','vision','iq'];

  /* ── 켜져 있는 카메라 목록 ── */
  var live = [];
  window._cgoCamStreams = live;

  var md = navigator.mediaDevices;
  if(md && md.getUserMedia){
    var orig = md.getUserMedia.bind(md);
    md.getUserMedia = function(c){
      return orig(c).then(function(stream){
        live.push(stream);
        stream.getTracks().forEach(function(t){
          t.addEventListener('ended', function(){
            var i = live.indexOf(stream); if(i >= 0) live.splice(i, 1);
          });
        });
        return stream;
      });
    };
  }

  /* ── 카메라 전부 끄기 ── */
  window._cgoStopAllCams = function(){
    var n = 0;
    live.slice().forEach(function(s){
      try{ s.getTracks().forEach(function(t){ t.stop(); n++; }); }catch(e){}
    });
    live.length = 0;
    /* 화면에 붙어 있던 영상도 떼어낸다 */
    try{
      Array.prototype.forEach.call(document.querySelectorAll('video'), function(v){
        if(v.srcObject){
          try{ v.srcObject.getTracks().forEach(function(t){ t.stop(); }); }catch(e){}
          v.srcObject = null;
        }
      });
    }catch(e){}
    /* 기능별 '취소' 함수만 부른다 — 결과를 계산해 저장하는 종료 함수는 부르지 않는다 */
    ['eyeCancelMeasure','_c24Cancel','c39Stop','scStop','cgoAccCamClose'].forEach(function(fn){
      try{ if(typeof window[fn] === 'function') window[fn](); }catch(e){}
    });
    return n;
  };

  /* ── 페이지를 벗어나면 자동으로 끈다 ── */
  function hookGoPage(){
    if(typeof window.cgoGoPage !== 'function' || window.cgoGoPage.__permWrapped) return false;
    var inner = window.cgoGoPage;
    var wrapped = function(page){
      try{
        if(CAM_PAGES.indexOf(String(page)) < 0) window._cgoStopAllCams();
      }catch(e){}
      /* ★ 보던 페이지를 기억한다 — 폰이 카메라를 켜다 메모리를 회수해
         화면을 다시 불러오면 대시보드로 튕겼다. */
      try{ sessionStorage.setItem('cgo_page', String(page)); }catch(e){}
      return inner.apply(this, arguments);
    };
    wrapped.__permWrapped = true;
    window.cgoGoPage = wrapped;
    return true;
  }
  [0, 300, 1200, 3000].forEach(function(d){ setTimeout(hookGoPage, d); });

  /* 뒤로가기·탭 이동으로 화면을 떠날 때도 끈다 */
  window.addEventListener('pagehide', function(e){ if(e && e.persisted) return; try{ window._cgoStopAllCams(); }catch(e2){} });
  /* 화면이 잠깐 가려지는 것(권한 창, 알림창, 2초 앱 전환)으로는 끄지 않는다.
     12초 넘게 진짜로 뒤로 물러난 뒤에만 끈다 — 즉시 끄면 권한 허용 직후 카메라가 죽었다. */
  var hideTimer = null;
  document.addEventListener('visibilitychange', function(){
    if(document.visibilityState === 'hidden'){
      if(hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(function(){
        hideTimer = null;
        try{ window._cgoStopAllCams(); }catch(e){}
      }, 12000);
    } else if(hideTimer){
      clearTimeout(hideTimer); hideTimer = null;
    }
  });

  /* ══ 카톡·인스타 같은 인앱 브라우저 ══
     이 브라우저들은 카메라를 아예 막는다. 구 CGO와 같이 바깥 브라우저로 내보낸다. */
  var ua = (navigator.userAgent || '').toLowerCase();
  var inApp = /kakaotalk|fbav|fb_iab|instagram|line\/|naver|daumapps|everytimeapp|whale|kakaostory|band/.test(ua);
  var isAndroid = ua.indexOf('android') > -1;
  var isIOS = /iphone|ipad|ipod/.test(ua);
  window._cgoInApp = inApp;

  window._cgoOpenOutside = function(){
    var url = location.href.split('#')[0];
    if(isAndroid){
      /* 안드로이드 — 크롬으로 바로 넘긴다 */
      var noScheme = url.replace(/^https?:\/\//, '');
      location.href = 'intent://' + noScheme + '#Intent;scheme=https;package=com.android.chrome;end';
      return true;
    }
    if(isIOS){
      /* 아이폰 — 카톡은 자동 이동을 막으므로 주소를 복사해 주고 안내한다 */
      try{ navigator.clipboard && navigator.clipboard.writeText(url); }catch(e){}
      showOutsideGuide(url);
      return true;
    }
    return false;
  };

  function showOutsideGuide(url){
    if(document.getElementById('cgoInAppGuide')) return;
    var d = document.createElement('div');
    d.id = 'cgoInAppGuide';
    d.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:rgba(2,20,16,.92);display:flex;align-items:center;justify-content:center;padding:24px;';
    d.innerHTML =
      '<div style="width:100%;max-width:380px;background:#f0fdf9;border:1px solid #99f6e4;border-radius:20px;padding:26px 22px;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,.4)">'
      + '<div style="font-size:34px;line-height:1">📷</div>'
      + '<div style="font-size:16px;font-weight:900;color:#0f172a;margin-top:12px;line-height:1.4">Open in Safari to use the camera</div>'
      + '<div style="font-size:12.5px;color:#475569;margin-top:10px;line-height:1.7">This in-app browser blocks the camera.<br>Tap <b style="color:#0d9488">···</b> at the bottom right → <b style="color:#0d9488">Open in Safari</b>.</div>'
      + '<div style="font-size:11.5px;color:#0d9488;margin-top:14px;padding:10px 12px;background:#ccfbf1;border-radius:11px;word-break:break-all">' + url + '</div>'
      + '<div style="font-size:11px;color:#64748b;margin-top:8px">The address is copied — you can paste it in Safari.</div>'
      + '<button id="cgoInAppClose" style="margin-top:16px;width:100%;padding:13px;border:0;border-radius:13px;background:#0f172a;color:#fff;font-size:13.5px;font-weight:800;cursor:pointer;font-family:inherit">OK</button>'
      + '</div>';
    document.body.appendChild(d);
    d.querySelector('#cgoInAppClose').onclick = function(){ d.remove(); };
  }

  /* 카메라를 요청하는 순간 인앱이면 바깥 브라우저로 보낸다 */
  if(inApp && md && md.getUserMedia){
    var beforeAsk = md.getUserMedia;
    md.getUserMedia = function(c){
      if(c && c.video){
        window._cgoOpenOutside();
        return Promise.reject(new DOMException('in-app browser', 'NotAllowedError'));
      }
      return beforeAsk.call(md, c);
    };
  }

  /* ── 되살아난 화면이면 보던 페이지로 돌아간다 ── */
  (function(){
    var last = null;
    try{ last = sessionStorage.getItem('cgo_page'); }catch(e){}
    if(!last || last === 'dashboard') return;
    function back(){
      try{
        if(sessionStorage.getItem('cgo_ent') !== '1') return;
        if(typeof window.cgoGoPage !== 'function') return;
        var p = document.getElementById('page-' + last);
        if(!p) return;
        if(getComputedStyle(p).display !== 'none') return;   /* 이미 그 페이지면 그만둔다 */
        window.cgoGoPage(last);
      }catch(e){}
    }
    [600, 1500, 2600].forEach(function(d){ setTimeout(back, d); });
  })();

  /* ── 위치: 한 번만 묻고 보관한다 ── */
  var GEO_KEY = 'cgo_geo_pos';
  function saved(){
    try{ return JSON.parse(localStorage.getItem(GEO_KEY) || 'null'); }catch(e){ return null; }
  }
  function fresh(p){ return p && p.t && (Date.now() - p.t) < 86400000 * 7; }

  var geo = navigator.geolocation;
  if(geo && geo.getCurrentPosition){
    var origGet = geo.getCurrentPosition.bind(geo);
    geo.getCurrentPosition = function(ok, err, opt){
      var p = saved();
      if(fresh(p)){
        try{ ok({coords:{latitude:p.lat, longitude:p.lng, accuracy:p.acc || 3000}, timestamp:p.t}); }catch(e){}
        return;
      }
      return origGet(function(pos){
        try{
          localStorage.setItem(GEO_KEY, JSON.stringify({
            lat: pos.coords.latitude, lng: pos.coords.longitude,
            acc: pos.coords.accuracy, t: Date.now()
          }));
        }catch(e){}
        try{ ok(pos); }catch(e){}
      }, err, opt);
    };

    /* 앱에 들어올 때 한 번 — 이미 보관된 값이 있으면 묻지 않는다 */
    function askOnce(){
      if(fresh(saved())) return;
      try{ geo.getCurrentPosition(function(){}, function(){}, {timeout:12000, maximumAge:600000}); }catch(e){}
    }
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', function(){ setTimeout(askOnce, 1800); });
    } else {
      setTimeout(askOnce, 1800);
    }
  }
})();
