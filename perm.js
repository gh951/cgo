/* ══ 권한 관리 ══
   위치: 앱 들어올 때 한 번만 묻고 값을 보관해 재사용한다.
   카메라: 카메라 기능에 들어갈 때 한 번만 묻고, 기능 페이지를 벗어나면 즉시 끈다. */
(function(){
  'use strict';

  /* ── 카메라 기능이 있는 페이지 ── */
  var CAM_PAGES = ['c24','c44-eye','c41','acc-cam','vision','iq'];

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
    ['eyeCancelMeasure','_c24Cancel','cgoAccCamClose'].forEach(function(fn){
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
