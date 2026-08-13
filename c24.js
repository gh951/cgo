function _c24Start(){ try{ if(typeof _c24CompStart==="function") return _c24CompStart(); }catch(e){} }

function _c24StartDisease(key){
  var flow = _c24DiseaseFlow[key];
  var card = _c24Cards[key];
  if(!flow||!card) return;

  // 기존 팝업 제거
  var old = document.getElementById('c24-disease-guide-pop');
  if(old) old.remove();

  // 단계별 안내 생성
  var stepColors = {face:'56,189,248', tongue:'248,113,113', eye:'52,211,153', skin:'244,114,182', hand:'251,191,36', hand_back:'251,191,36', hand_palm:'251,191,36'};
  var stepGuides = {
    face:  {ico:'👤', name:'얼굴', cam:'📱 전면 카메라', dist:'30~40cm', tips:['밝은 정면 조명', '안경·모자 제거', '무표정으로 정면 응시']},
    tongue:{ico:'👅', name:'혀',   cam:'📱 전면 카메라', dist:'15~20cm', tips:['혀를 최대한 내밀기', '혀 전체가 화면에 보이도록', '식사 30분 후 권장']},
    eye:   {ico:'👁️', name:'눈',   cam:'📱 전면 카메라', dist:'15~20cm', tips:['위를 약간 봐서 흰자 노출', '렌즈 제거 권장', '눈을 크게 뜨기']},
    skin:  {ico:'🎨', name:'피부', cam:'📱 전면 카메라', dist:'10~15cm', tips:['맨 피부 상태 권장', '크림·화장 없이', '자연광 또는 백색등']},
    hand:  {ico:'✋', name:'손',   cam:'📷 후면 카메라', dist:'20~25cm', tips:['손가락 가지런히 펴기', '매니큐어 제거 권장', '손 흔들지 않기']},
    hand_back: {ico:'🤚', name:'손등', cam:'📷 후면 카메라', dist:'20~25cm', tips:['손톱 잘 보이게', '매니큐어 제거 권장', '손 흔들지 않기']},
    hand_palm: {ico:'✋', name:'손바닥', cam:'📷 후면 카메라', dist:'20~25cm', tips:['손바닥 평평하게 펼치기', '손금이 보이도록', '손 흔들지 않기']}
  };

  var totalSec = (flow.times||[]).reduce(function(a,b){return a+b;},0);
  var stepsHtml = flow.steps.map(function(s,i){
    var g = stepGuides[s]||stepGuides['face'];
    var c = stepColors[s]||'56,189,248';
    var t = flow.times?flow.times[i]:60;
    return '<div style="background:rgba('+c+',.07);border:1px solid rgba('+c+',.25);border-radius:10px;padding:10px 12px;margin-bottom:8px;">'
      +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">'
      +'<span style="font-size:18px;">'+g.ico+'</span>'
      +'<span style="font-size:12px;font-weight:800;color:rgba('+c+',1);">'+(i+1)+'단계 · '+g.name+' — '+t+'초</span>'
      +'<span style="font-size:10px;color:rgba('+c+',.5);margin-left:auto;">'+g.cam+'</span></div>'
      +'<div style="font-size:11px;color:rgba(240,230,200,.8);line-height:1.9;padding-left:26px;">'
      +'📏 카메라와 <b style="color:#fff;">'+g.dist+'</b> 거리 유지<br>'
      +g.tips.map(function(t){return '• '+t;}).join('<br>')
      +'</div></div>';
  }).join('');

  var pop = document.createElement('div');
  pop.id = 'c24-disease-guide-pop';
  pop.style.cssText = 'position:fixed;inset:0;z-index:19000;background:rgba(2,8,23,.92);backdrop-filter:blur(4px);display:flex;align-items:flex-end;justify-content:center;';

  pop.innerHTML =
    '<div style="width:100%;max-width:480px;max-height:90vh;overflow-y:auto;background:linear-gradient(160deg,#0a1628,#0d1f3c);border-radius:20px 20px 0 0;border-top:2px solid rgba(212,168,67,.4);padding:20px 18px 32px;">'
    // 헤더
    +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'
    +'<div style="font-size:15px;font-weight:900;color:#d4a843;">'+card.title+' 검사 안내</div>'
    +'<div style="font-size:11px;color:rgba(212,168,67,.6);">총 '+totalSec+'초</div></div>'
    // 단계 안내
    +stepsHtml
    // 공통 주의
    +'<div style="background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.2);border-radius:10px;padding:10px 14px;margin:10px 0 16px;">'
    +'<div style="font-size:11px;font-weight:800;color:#fbbf24;margin-bottom:4px;">⚠️ 공통 주의사항</div>'
    +'<div style="font-size:11px;color:rgba(240,230,200,.8);line-height:1.9;">'
    +'• 밝은 곳에서 측정할수록 정확도가 높아집니다<br>'
    +(flow.total>1 ? '• 단계가 끝나면 자동으로 다음 단계로 넘어갑니다<br>' : '')
    +'• 본 분석은 참고용이며 의학적 진단을 대체하지 않습니다'
    +'</div></div>'
    // 버튼
    +'<div style="display:flex;gap:10px;">'
    +'<button onclick="_c24DiseaseRealStart(\''+key+'\')" style="flex:3;padding:15px;background:linear-gradient(135deg,rgba(212,168,67,.3),rgba(248,113,113,.2));border:2px solid rgba(212,168,67,.7);border-radius:14px;color:#d4a843;font-size:15px;font-weight:900;cursor:pointer;">✅ 이해했습니다 — 측정 시작</button>'
    +'<button onclick="document.getElementById(\'c24-disease-guide-pop\').remove()" style="flex:1;padding:15px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:14px;color:rgba(240,230,200,.5);font-size:13px;cursor:pointer;">나중에</button>'
    +'</div></div>';

  document.body.appendChild(pop);
};

function _c24InitFM(){
  try{
    if(_c24.fm) return;
    _c24.fm=new FaceMesh({locateFile:function(f){return 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/'+f;}});
    _c24.fm.setOptions({maxNumFaces:1,refineLandmarks:false,minDetectionConfidence:0.7,minTrackingConfidence:0.7});  /* ★ C-63: 0.7 유지 (정확도 우선) */
    _c24.fm.onResults(function(r){
      try{
        _c24._fmRecv=(_c24._fmRecv||0)+1;   /* ★ C-63: FaceMesh 응답 수신 횟수 */
        if(r && r.multiFaceLandmarks && r.multiFaceLandmarks.length>0){
          _c24._faceLms=r.multiFaceLandmarks[0]; _c24._faceLmsTime=performance.now();
          _c24._fmHit=(_c24._fmHit||0)+1;    /* 얼굴 검출 성공 횟수 */
        } else { _c24._faceLms=null; }
      }catch(e){}
    });
  }catch(e){ _c24.fm=null; }
};

function _c24StartDisease(key){
  var flow = _c24DiseaseFlow[key];
  var card = _c24Cards[key];
  if(!flow||!card) return;

  // 기존 팝업 제거
  var old = document.getElementById('c24-disease-guide-pop');
  if(old) old.remove();

  // 단계별 안내 생성
  var stepColors = {face:'56,189,248', tongue:'248,113,113', eye:'52,211,153', skin:'244,114,182', hand:'251,191,36', hand_back:'251,191,36', hand_palm:'251,191,36'};
  var stepGuides = {
    face:  {ico:'👤', name:'얼굴', cam:'📱 전면 카메라', dist:'30~40cm', tips:['밝은 정면 조명', '안경·모자 제거', '무표정으로 정면 응시']},
    tongue:{ico:'👅', name:'혀',   cam:'📱 전면 카메라', dist:'15~20cm', tips:['혀를 최대한 내밀기', '혀 전체가 화면에 보이도록', '식사 30분 후 권장']},
    eye:   {ico:'👁️', name:'눈',   cam:'📱 전면 카메라', dist:'15~20cm', tips:['위를 약간 봐서 흰자 노출', '렌즈 제거 권장', '눈을 크게 뜨기']},
    skin:  {ico:'🎨', name:'피부', cam:'📱 전면 카메라', dist:'10~15cm', tips:['맨 피부 상태 권장', '크림·화장 없이', '자연광 또는 백색등']},
    hand:  {ico:'✋', name:'손',   cam:'📷 후면 카메라', dist:'20~25cm', tips:['손가락 가지런히 펴기', '매니큐어 제거 권장', '손 흔들지 않기']},
    hand_back: {ico:'🤚', name:'손등', cam:'📷 후면 카메라', dist:'20~25cm', tips:['손톱 잘 보이게', '매니큐어 제거 권장', '손 흔들지 않기']},
    hand_palm: {ico:'✋', name:'손바닥', cam:'📷 후면 카메라', dist:'20~25cm', tips:['손바닥 평평하게 펼치기', '손금이 보이도록', '손 흔들지 않기']}
  };

  var totalSec = (flow.times||[]).reduce(function(a,b){return a+b;},0);
  var stepsHtml = flow.steps.map(function(s,i){
    var g = stepGuides[s]||stepGuides['face'];
    var c = stepColors[s]||'56,189,248';
    var t = flow.times?flow.times[i]:60;
    return '<div style="background:rgba('+c+',.07);border:1px solid rgba('+c+',.25);border-radius:10px;padding:10px 12px;margin-bottom:8px;">'
      +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">'
      +'<span style="font-size:18px;">'+g.ico+'</span>'
      +'<span style="font-size:12px;font-weight:800;color:rgba('+c+',1);">'+(i+1)+'단계 · '+g.name+' — '+t+'초</span>'
      +'<span style="font-size:10px;color:rgba('+c+',.5);margin-left:auto;">'+g.cam+'</span></div>'
      +'<div style="font-size:11px;color:rgba(240,230,200,.8);line-height:1.9;padding-left:26px;">'
      +'📏 카메라와 <b style="color:#fff;">'+g.dist+'</b> 거리 유지<br>'
      +g.tips.map(function(t){return '• '+t;}).join('<br>')
      +'</div></div>';
  }).join('');

  var pop = document.createElement('div');
  pop.id = 'c24-disease-guide-pop';
  pop.style.cssText = 'position:fixed;inset:0;z-index:19000;background:rgba(2,8,23,.92);backdrop-filter:blur(4px);display:flex;align-items:flex-end;justify-content:center;';

  pop.innerHTML =
    '<div style="width:100%;max-width:480px;max-height:90vh;overflow-y:auto;background:linear-gradient(160deg,#0a1628,#0d1f3c);border-radius:20px 20px 0 0;border-top:2px solid rgba(212,168,67,.4);padding:20px 18px 32px;">'
    // 헤더
    +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'
    +'<div style="font-size:15px;font-weight:900;color:#d4a843;">'+card.title+' 검사 안내</div>'
    +'<div style="font-size:11px;color:rgba(212,168,67,.6);">총 '+totalSec+'초</div></div>'
    // 단계 안내
    +stepsHtml
    // 공통 주의
    +'<div style="background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.2);border-radius:10px;padding:10px 14px;margin:10px 0 16px;">'
    +'<div style="font-size:11px;font-weight:800;color:#fbbf24;margin-bottom:4px;">⚠️ 공통 주의사항</div>'
    +'<div style="font-size:11px;color:rgba(240,230,200,.8);line-height:1.9;">'
    +'• 밝은 곳에서 측정할수록 정확도가 높아집니다<br>'
    +(flow.total>1 ? '• 단계가 끝나면 자동으로 다음 단계로 넘어갑니다<br>' : '')
    +'• 본 분석은 참고용이며 의학적 진단을 대체하지 않습니다'
    +'</div></div>'
    // 버튼
    +'<div style="display:flex;gap:10px;">'
    +'<button onclick="_c24DiseaseRealStart(\''+key+'\')" style="flex:3;padding:15px;background:linear-gradient(135deg,rgba(212,168,67,.3),rgba(248,113,113,.2));border:2px solid rgba(212,168,67,.7);border-radius:14px;color:#d4a843;font-size:15px;font-weight:900;cursor:pointer;">✅ 이해했습니다 — 측정 시작</button>'
    +'<button onclick="document.getElementById(\'c24-disease-guide-pop\').remove()" style="flex:1;padding:15px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:14px;color:rgba(240,230,200,.5);font-size:13px;cursor:pointer;">나중에</button>'
    +'</div></div>';

  document.body.appendChild(pop);
};

function _c24EnsureFM(){
  try{
    if(_c24.fm || _c24._fmLoading) return;
    if(typeof FaceMesh!=='undefined'){ _c24InitFM(); return; }
    _c24._fmLoading=true;
    if(!document.querySelector('script[data-c24-facemesh]')){
      var s=document.createElement('script');
      s.src='https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js';
      s.setAttribute('data-c24-facemesh','1'); s.crossOrigin='anonymous';
      document.head.appendChild(s);
    }
    var tries=0;
    var iv=setInterval(function(){
      tries++;
      if(typeof FaceMesh!=='undefined'){ clearInterval(iv); _c24._fmLoading=false; _c24InitFM(); }
      else if(tries>60){ clearInterval(iv); _c24._fmLoading=false; } /* 6초 실패 → 살색비율 폴백 */
    },100);
  }catch(e){ _c24._fmLoading=false; }
};

function _c24StartDisease(key){
  var flow = _c24DiseaseFlow[key];
  var card = _c24Cards[key];
  if(!flow||!card) return;

  // 기존 팝업 제거
  var old = document.getElementById('c24-disease-guide-pop');
  if(old) old.remove();

  // 단계별 안내 생성
  var stepColors = {face:'56,189,248', tongue:'248,113,113', eye:'52,211,153', skin:'244,114,182', hand:'251,191,36', hand_back:'251,191,36', hand_palm:'251,191,36'};
  var stepGuides = {
    face:  {ico:'👤', name:'얼굴', cam:'📱 전면 카메라', dist:'30~40cm', tips:['밝은 정면 조명', '안경·모자 제거', '무표정으로 정면 응시']},
    tongue:{ico:'👅', name:'혀',   cam:'📱 전면 카메라', dist:'15~20cm', tips:['혀를 최대한 내밀기', '혀 전체가 화면에 보이도록', '식사 30분 후 권장']},
    eye:   {ico:'👁️', name:'눈',   cam:'📱 전면 카메라', dist:'15~20cm', tips:['위를 약간 봐서 흰자 노출', '렌즈 제거 권장', '눈을 크게 뜨기']},
    skin:  {ico:'🎨', name:'피부', cam:'📱 전면 카메라', dist:'10~15cm', tips:['맨 피부 상태 권장', '크림·화장 없이', '자연광 또는 백색등']},
    hand:  {ico:'✋', name:'손',   cam:'📷 후면 카메라', dist:'20~25cm', tips:['손가락 가지런히 펴기', '매니큐어 제거 권장', '손 흔들지 않기']},
    hand_back: {ico:'🤚', name:'손등', cam:'📷 후면 카메라', dist:'20~25cm', tips:['손톱 잘 보이게', '매니큐어 제거 권장', '손 흔들지 않기']},
    hand_palm: {ico:'✋', name:'손바닥', cam:'📷 후면 카메라', dist:'20~25cm', tips:['손바닥 평평하게 펼치기', '손금이 보이도록', '손 흔들지 않기']}
  };

  var totalSec = (flow.times||[]).reduce(function(a,b){return a+b;},0);
  var stepsHtml = flow.steps.map(function(s,i){
    var g = stepGuides[s]||stepGuides['face'];
    var c = stepColors[s]||'56,189,248';
    var t = flow.times?flow.times[i]:60;
    return '<div style="background:rgba('+c+',.07);border:1px solid rgba('+c+',.25);border-radius:10px;padding:10px 12px;margin-bottom:8px;">'
      +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">'
      +'<span style="font-size:18px;">'+g.ico+'</span>'
      +'<span style="font-size:12px;font-weight:800;color:rgba('+c+',1);">'+(i+1)+'단계 · '+g.name+' — '+t+'초</span>'
      +'<span style="font-size:10px;color:rgba('+c+',.5);margin-left:auto;">'+g.cam+'</span></div>'
      +'<div style="font-size:11px;color:rgba(240,230,200,.8);line-height:1.9;padding-left:26px;">'
      +'📏 카메라와 <b style="color:#fff;">'+g.dist+'</b> 거리 유지<br>'
      +g.tips.map(function(t){return '• '+t;}).join('<br>')
      +'</div></div>';
  }).join('');

  var pop = document.createElement('div');
  pop.id = 'c24-disease-guide-pop';
  pop.style.cssText = 'position:fixed;inset:0;z-index:19000;background:rgba(2,8,23,.92);backdrop-filter:blur(4px);display:flex;align-items:flex-end;justify-content:center;';

  pop.innerHTML =
    '<div style="width:100%;max-width:480px;max-height:90vh;overflow-y:auto;background:linear-gradient(160deg,#0a1628,#0d1f3c);border-radius:20px 20px 0 0;border-top:2px solid rgba(212,168,67,.4);padding:20px 18px 32px;">'
    // 헤더
    +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'
    +'<div style="font-size:15px;font-weight:900;color:#d4a843;">'+card.title+' 검사 안내</div>'
    +'<div style="font-size:11px;color:rgba(212,168,67,.6);">총 '+totalSec+'초</div></div>'
    // 단계 안내
    +stepsHtml
    // 공통 주의
    +'<div style="background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.2);border-radius:10px;padding:10px 14px;margin:10px 0 16px;">'
    +'<div style="font-size:11px;font-weight:800;color:#fbbf24;margin-bottom:4px;">⚠️ 공통 주의사항</div>'
    +'<div style="font-size:11px;color:rgba(240,230,200,.8);line-height:1.9;">'
    +'• 밝은 곳에서 측정할수록 정확도가 높아집니다<br>'
    +(flow.total>1 ? '• 단계가 끝나면 자동으로 다음 단계로 넘어갑니다<br>' : '')
    +'• 본 분석은 참고용이며 의학적 진단을 대체하지 않습니다'
    +'</div></div>'
    // 버튼
    +'<div style="display:flex;gap:10px;">'
    +'<button onclick="_c24DiseaseRealStart(\''+key+'\')" style="flex:3;padding:15px;background:linear-gradient(135deg,rgba(212,168,67,.3),rgba(248,113,113,.2));border:2px solid rgba(212,168,67,.7);border-radius:14px;color:#d4a843;font-size:15px;font-weight:900;cursor:pointer;">✅ 이해했습니다 — 측정 시작</button>'
    +'<button onclick="document.getElementById(\'c24-disease-guide-pop\').remove()" style="flex:1;padding:15px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:14px;color:rgba(240,230,200,.5);font-size:13px;cursor:pointer;">나중에</button>'
    +'</div></div>';

  document.body.appendChild(pop);
};

function _c24CompStartReal(){
  var pop = document.getElementById('c24-scan-guide-pop');
  if(pop) pop.remove();
  _c24CompState.active = true;
  try{var _paS=document.getElementById('page-algo');if(_paS){_paS.classList.add('c24-scanning');_paS.scrollTop=0;}}catch(e){}
  _c24CompState.step = 0;
  _c24CompState.images = {face:null,tongue:null,eye:null,skin:null,hand_back:null,hand_palm:null};
  _c24CompState.breathData = {cycles:0, inhaleAvg:0, holdAvg:0, exhaleAvg:0};
  // 버튼 강조
  var cb=document.getElementById('c24-btn-comp');
  if(cb){cb.style.background='rgba(52,211,153,.25)';cb.style.borderColor='rgba(52,211,153,.9)';}
  // 시작 딩동댕 (B-2b)
  try{ if(typeof _c24Chime==='function') _c24Chime(); }catch(e){}
  // AR-1: FaceMesh 정밀 인터록 준비 (실패 시 살색비율 폴백)
  try{ if(typeof _c24EnsureFM==='function') _c24EnsureFM(); }catch(e){}
  // 1단계: 얼굴 60초
  _c24CompDoStep(0);
};

function _c24DiseaseClose(){
  var pop=document.getElementById('c24-disease-pop');
  var ov=document.getElementById('c24-disease-pop-ov');
  if(pop){ pop.style.transform='translateY(100%)'; setTimeout(function(){ pop.style.display='none'; },320); }
  if(ov) ov.style.display='none';
};

function _c24StartDisease(key){
  var flow = _c24DiseaseFlow[key];
  var card = _c24Cards[key];
  if(!flow||!card) return;

  // 기존 팝업 제거
  var old = document.getElementById('c24-disease-guide-pop');
  if(old) old.remove();

  // 단계별 안내 생성
  var stepColors = {face:'56,189,248', tongue:'248,113,113', eye:'52,211,153', skin:'244,114,182', hand:'251,191,36', hand_back:'251,191,36', hand_palm:'251,191,36'};
  var stepGuides = {
    face:  {ico:'👤', name:'얼굴', cam:'📱 전면 카메라', dist:'30~40cm', tips:['밝은 정면 조명', '안경·모자 제거', '무표정으로 정면 응시']},
    tongue:{ico:'👅', name:'혀',   cam:'📱 전면 카메라', dist:'15~20cm', tips:['혀를 최대한 내밀기', '혀 전체가 화면에 보이도록', '식사 30분 후 권장']},
    eye:   {ico:'👁️', name:'눈',   cam:'📱 전면 카메라', dist:'15~20cm', tips:['위를 약간 봐서 흰자 노출', '렌즈 제거 권장', '눈을 크게 뜨기']},
    skin:  {ico:'🎨', name:'피부', cam:'📱 전면 카메라', dist:'10~15cm', tips:['맨 피부 상태 권장', '크림·화장 없이', '자연광 또는 백색등']},
    hand:  {ico:'✋', name:'손',   cam:'📷 후면 카메라', dist:'20~25cm', tips:['손가락 가지런히 펴기', '매니큐어 제거 권장', '손 흔들지 않기']},
    hand_back: {ico:'🤚', name:'손등', cam:'📷 후면 카메라', dist:'20~25cm', tips:['손톱 잘 보이게', '매니큐어 제거 권장', '손 흔들지 않기']},
    hand_palm: {ico:'✋', name:'손바닥', cam:'📷 후면 카메라', dist:'20~25cm', tips:['손바닥 평평하게 펼치기', '손금이 보이도록', '손 흔들지 않기']}
  };

  var totalSec = (flow.times||[]).reduce(function(a,b){return a+b;},0);
  var stepsHtml = flow.steps.map(function(s,i){
    var g = stepGuides[s]||stepGuides['face'];
    var c = stepColors[s]||'56,189,248';
    var t = flow.times?flow.times[i]:60;
    return '<div style="background:rgba('+c+',.07);border:1px solid rgba('+c+',.25);border-radius:10px;padding:10px 12px;margin-bottom:8px;">'
      +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">'
      +'<span style="font-size:18px;">'+g.ico+'</span>'
      +'<span style="font-size:12px;font-weight:800;color:rgba('+c+',1);">'+(i+1)+'단계 · '+g.name+' — '+t+'초</span>'
      +'<span style="font-size:10px;color:rgba('+c+',.5);margin-left:auto;">'+g.cam+'</span></div>'
      +'<div style="font-size:11px;color:rgba(240,230,200,.8);line-height:1.9;padding-left:26px;">'
      +'📏 카메라와 <b style="color:#fff;">'+g.dist+'</b> 거리 유지<br>'
      +g.tips.map(function(t){return '• '+t;}).join('<br>')
      +'</div></div>';
  }).join('');

  var pop = document.createElement('div');
  pop.id = 'c24-disease-guide-pop';
  pop.style.cssText = 'position:fixed;inset:0;z-index:19000;background:rgba(2,8,23,.92);backdrop-filter:blur(4px);display:flex;align-items:flex-end;justify-content:center;';

  pop.innerHTML =
    '<div style="width:100%;max-width:480px;max-height:90vh;overflow-y:auto;background:linear-gradient(160deg,#0a1628,#0d1f3c);border-radius:20px 20px 0 0;border-top:2px solid rgba(212,168,67,.4);padding:20px 18px 32px;">'
    // 헤더
    +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'
    +'<div style="font-size:15px;font-weight:900;color:#d4a843;">'+card.title+' 검사 안내</div>'
    +'<div style="font-size:11px;color:rgba(212,168,67,.6);">총 '+totalSec+'초</div></div>'
    // 단계 안내
    +stepsHtml
    // 공통 주의
    +'<div style="background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.2);border-radius:10px;padding:10px 14px;margin:10px 0 16px;">'
    +'<div style="font-size:11px;font-weight:800;color:#fbbf24;margin-bottom:4px;">⚠️ 공통 주의사항</div>'
    +'<div style="font-size:11px;color:rgba(240,230,200,.8);line-height:1.9;">'
    +'• 밝은 곳에서 측정할수록 정확도가 높아집니다<br>'
    +(flow.total>1 ? '• 단계가 끝나면 자동으로 다음 단계로 넘어갑니다<br>' : '')
    +'• 본 분석은 참고용이며 의학적 진단을 대체하지 않습니다'
    +'</div></div>'
    // 버튼
    +'<div style="display:flex;gap:10px;">'
    +'<button onclick="_c24DiseaseRealStart(\''+key+'\')" style="flex:3;padding:15px;background:linear-gradient(135deg,rgba(212,168,67,.3),rgba(248,113,113,.2));border:2px solid rgba(212,168,67,.7);border-radius:14px;color:#d4a843;font-size:15px;font-weight:900;cursor:pointer;">✅ 이해했습니다 — 측정 시작</button>'
    +'<button onclick="document.getElementById(\'c24-disease-guide-pop\').remove()" style="flex:1;padding:15px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:14px;color:rgba(240,230,200,.5);font-size:13px;cursor:pointer;">나중에</button>'
    +'</div></div>';

  document.body.appendChild(pop);
};

function _c24CompStart(){
  try{var _pa0=document.getElementById('page-algo');if(_pa0)_pa0.classList.remove('c24-scanning');}catch(e){}
  // ★ FIX: page-algo가 모달 모드 — 자동으로 모달 열기 (어느 페이지에서든 호출 가능)
  var algoModal = document.getElementById('page-algo');
  if(algoModal && algoModal.getAttribute('data-modal-mode')==='1'){
    algoModal.style.display = 'block';
    algoModal.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }
  // 이미 팝업 있으면 제거
  var old = document.getElementById('c24-scan-guide-pop');
  if(old) old.remove();

  var pop = document.createElement('div');
  pop.id = 'c24-scan-guide-pop';
  pop.style.cssText = 'position:fixed;inset:0;z-index:19000;background:rgba(2,8,23,.92);backdrop-filter:blur(4px);display:flex;align-items:flex-end;justify-content:center;padding:0;';

  pop.innerHTML =
    '<div style="width:100%;max-width:480px;max-height:92vh;overflow-y:auto;background:linear-gradient(160deg,#0a1628,#0d1f3c);border-radius:20px 20px 0 0;border-top:2px solid rgba(52,211,153,.4);padding:20px 18px 32px;">'
    // 헤더
    +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">'
    +'<div style="font-size:15px;font-weight:900;color:#34d399;">🔬 C-24 종합 건강 스캔 안내</div>'
    +'<div style="font-size:11px;color:rgba(52,211,153,.6);">총 2분 40초</div></div>'

    // 478 호흡법 설명
    +'<div style="background:rgba(56,189,248,.08);border:1px solid rgba(56,189,248,.25);border-radius:12px;padding:12px 14px;margin-bottom:14px;">'
    +'<div style="font-size:12px;font-weight:800;color:#38bdf8;margin-bottom:6px;">🫁 4-7-8 호흡법이란?</div>'
    +'<div style="font-size:11px;color:rgba(240,230,200,.85);line-height:1.9;">'
    +'마음을 안정시켜 측정 정확도를 높이는 호흡법입니다.<br>'
    +'<b style="color:#38bdf8;">① 코로 4초 들이쉬기</b> → <b style="color:#fbbf24;">② 7초 숨 멈추기</b> → <b style="color:#34d399;">③ 입으로 8초 내쉬기</b><br>'
    +'얼굴 측정 시작 후 화면 아래 타임라인을 따라 한 번만 진행합니다.'
    +'</div></div>'

    // 6단계 안내
    +'<div style="font-size:11px;font-weight:800;color:rgba(240,230,200,.6);margin-bottom:8px;letter-spacing:.05em;">📋 측정 순서 및 방법</div>'
    +'<div style="display:flex;flex-direction:column;gap:7px;margin-bottom:16px;">'

    // 1단계 얼굴
    +'<div style="background:rgba(56,189,248,.07);border:1px solid rgba(56,189,248,.2);border-radius:10px;padding:10px 12px;">'
    +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">'
    +'<span style="font-size:18px;">👤</span>'
    +'<span style="font-size:12px;font-weight:800;color:#38bdf8;">얼굴 — 60초</span>'
    +'<span style="font-size:10px;color:rgba(56,189,248,.5);margin-left:auto;">📱 전면 카메라</span></div>'
    +'<div style="font-size:11px;color:rgba(240,230,200,.8);line-height:1.8;padding-left:26px;">'
    +'카메라와 <b style="color:#fff;">30~40cm</b> 거리 유지<br>'
    +'밝은 정면 조명 · 안경·모자 제거 · 무표정 유지<br>'
    +'<span style="color:#38bdf8;">화면 하단 호흡 타임라인을 따라 4-7-8 호흡 1회</span></div></div>'

    // 2단계 혀
    +'<div style="background:rgba(248,113,113,.07);border:1px solid rgba(248,113,113,.2);border-radius:10px;padding:10px 12px;">'
    +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">'
    +'<span style="font-size:18px;">👅</span>'
    +'<span style="font-size:12px;font-weight:800;color:#f87171;">혀 — 20초</span>'
    +'<span style="font-size:10px;color:rgba(248,113,113,.5);margin-left:auto;">📱 전면 카메라</span></div>'
    +'<div style="font-size:11px;color:rgba(240,230,200,.8);line-height:1.8;padding-left:26px;">'
    +'카메라와 <b style="color:#fff;">15~20cm</b> 거리 유지<br>'
    +'혀를 최대한 내밀어 혀 전체가 보이도록<br>'
    +'<span style="color:#fbbf24;">식사 30분 후 측정 권장</span></div></div>'

    // 3단계 눈
    +'<div style="background:rgba(56,189,248,.07);border:1px solid rgba(56,189,248,.2);border-radius:10px;padding:10px 12px;">'
    +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">'
    +'<span style="font-size:18px;">👁️</span>'
    +'<span style="font-size:12px;font-weight:800;color:#38bdf8;">눈 — 20초</span>'
    +'<span style="font-size:10px;color:rgba(56,189,248,.5);margin-left:auto;">📱 전면 카메라</span></div>'
    +'<div style="font-size:11px;color:rgba(240,230,200,.8);line-height:1.8;padding-left:26px;">'
    +'카메라와 <b style="color:#fff;">15~20cm</b> 거리 유지<br>'
    +'위를 약간 봐서 흰자가 잘 보이게<br>'
    +'<span style="color:#fbbf24;">콘택트렌즈 제거 권장</span></div></div>'

    // 4단계 피부
    +'<div style="background:rgba(244,114,182,.07);border:1px solid rgba(244,114,182,.2);border-radius:10px;padding:10px 12px;">'
    +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">'
    +'<span style="font-size:18px;">🎨</span>'
    +'<span style="font-size:12px;font-weight:800;color:#f472b6;">피부 — 30초</span>'
    +'<span style="font-size:10px;color:rgba(244,114,182,.5);margin-left:auto;">📱 전면 카메라</span></div>'
    +'<div style="font-size:11px;color:rgba(240,230,200,.8);line-height:1.8;padding-left:26px;">'
    +'카메라와 <b style="color:#fff;">10~15cm</b> 거리 유지<br>'
    +'이마 또는 뺨 맨피부를 카메라에 가까이<br>'
    +'<span style="color:#fbbf24;">크림·화장 없는 상태 권장</span></div></div>'

    // 5단계 손등
    +'<div style="background:rgba(52,211,153,.07);border:1px solid rgba(52,211,153,.2);border-radius:10px;padding:10px 12px;">'
    +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">'
    +'<span style="font-size:18px;">🤚</span>'
    +'<span style="font-size:12px;font-weight:800;color:#34d399;">손등 — 15초</span>'
    +'<span style="font-size:10px;color:rgba(52,211,153,.5);margin-left:auto;">📷 후면 카메라</span></div>'
    +'<div style="font-size:11px;color:rgba(240,230,200,.8);line-height:1.8;padding-left:26px;">'
    +'카메라와 <b style="color:#fff;">20~25cm</b> 거리 유지<br>'
    +'손톱이 잘 보이도록 손등을 카메라 정면으로<br>'
    +'<span style="color:#fbbf24;">매니큐어 제거 권장</span></div></div>'

    // 6단계 손바닥
    +'<div style="background:rgba(52,211,153,.07);border:1px solid rgba(52,211,153,.2);border-radius:10px;padding:10px 12px;">'
    +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">'
    +'<span style="font-size:18px;">✋</span>'
    +'<span style="font-size:12px;font-weight:800;color:#34d399;">손바닥 — 15초</span>'
    +'<span style="font-size:10px;color:rgba(52,211,153,.5);margin-left:auto;">📷 후면 카메라</span></div>'
    +'<div style="font-size:11px;color:rgba(240,230,200,.8);line-height:1.8;padding-left:26px;">'
    +'카메라와 <b style="color:#fff;">20~25cm</b> 거리 유지<br>'
    +'손바닥을 평평하게 펼쳐 카메라 정면으로<br>'
    +'손금이 잘 보이도록 조명 확인</div></div>'
    +'</div>'

    // 공통 주의사항
    +'<div style="background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.2);border-radius:10px;padding:10px 14px;margin-bottom:18px;">'
    +'<div style="font-size:11px;font-weight:800;color:#fbbf24;margin-bottom:5px;">⚠️ 공통 주의사항</div>'
    +'<div style="font-size:11px;color:rgba(240,230,200,.8);line-height:1.9;">'
    +'• 밝은 곳에서 측정할수록 정확도가 높아집니다<br>'
    +'• 각 단계는 자동으로 순서대로 진행됩니다<br>'
    +'• 측정 중 흔들리면 해당 단계가 다시 시작됩니다<br>'
    +'• 본 분석은 참고용이며 의학적 진단을 대체하지 않습니다'
    +'</div></div>'

    // 버튼
    +'<div style="display:flex;gap:10px;">'
    +'<button onclick="_c24CompStartReal()" style="flex:3;padding:15px;background:linear-gradient(135deg,rgba(52,211,153,.3),rgba(56,189,248,.2));border:2px solid rgba(52,211,153,.7);border-radius:14px;color:#34d399;font-size:15px;font-weight:900;cursor:pointer;letter-spacing:.03em;">✅ 이해했습니다 — 스캔 시작</button>'
    +'<button onclick="document.getElementById(\'c24-scan-guide-pop\').remove()" style="flex:1;padding:15px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:14px;color:rgba(240,230,200,.5);font-size:13px;cursor:pointer;">나중에</button>'
    +'</div>'
    +'</div>';

  document.body.appendChild(pop);
};

function _c24Stop(){
  try{var _pR=document.getElementById('page-algo');if(_pR)_pR.classList.remove('c24-scanning');}catch(e){}
  _c24Finish();
};

/* ══ 6부위 측정 흐름 ══ */
var _c24BreathTimer = null;
var _c24BreathElapsed = 0;
var _c24BreathPhase = 0;
var _c24BreathPhaseTime = [4, 7, 8];
var _c24BreathColors = ['#38bdf8', '#fbbf24', '#34d399'];
var _c24BreathTexts = ['🫁 들이쉬기', '⏸ 멈추기', '💨 내쉬기'];
var _c24r = window._c24||{}, _bsr=window.BS||{};
var _c24d = window._c24||{};
var _c24r = window._c24||{};

function _c24ChimeDone(){
  try{
    var AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
    _c24._ac=_c24._ac||new AC(); var ac=_c24._ac;
    if(ac.state==='suspended'){ try{ac.resume();}catch(e){} }
    [[523.25,0],[659.25,0.13],[783.99,0.26],[1046.5,0.40]].forEach(function(n){
      var o=ac.createOscillator(), g=ac.createGain();
      o.type='sine'; o.frequency.value=n[0]; o.connect(g); g.connect(ac.destination);
      var t=ac.currentTime+n[1];
      g.gain.setValueAtTime(0.0001,t);
      g.gain.linearRampToValueAtTime(0.25,t+0.02);
      g.gain.exponentialRampToValueAtTime(0.0008,t+0.30);
      o.start(t); o.stop(t+0.32);
    });
  }catch(e){}
};

function _c24CompShowResult(ai){
  var loading=document.getElementById('c24-comp-loading');
  if(loading) loading.remove();

  var sec=document.getElementById('c24-result-section');
  if(!sec) return;

  var gradeC={A:'#34d399',B:'#fbbf24',C:'#f87171',D:'#ef4444'}[ai.종합등급||'B']||'#fbbf24';
  var s=_c24CompState;

  var div=document.createElement('div');
  div.style.cssText='margin-top:8px;';
  div.innerHTML=
    // 헤더
    '<div style="text-align:center;padding:16px;background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.3);border-radius:14px;margin-bottom:14px;">'
    +'<div style="font-size:11px;color:rgba(52,211,153,.6);margin-bottom:4px;">🔬 6부위 종합 건강 분석</div>'
    +'<div style="font-size:44px;font-weight:900;color:'+gradeC+';font-family:Orbitron,sans-serif;">'+(ai.종합점수||75)+'</div>'
    +'<div style="font-size:16px;font-weight:900;color:'+gradeC+';margin-top:4px;">'+( ai.종합등급||'B')+' 등급</div>'
    +'</div>'
    // 6부위 스냅샷
    +'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:14px;">'
    +[['face','👤'],['tongue','👅'],['eye','👁️'],['skin','🎨'],['hand_back','🤚'],['hand_palm','✋']].map(function(x){
      return s.images[x[0]]
        ?'<div style="text-align:center;"><img src="data:image/jpeg;base64,'+s.images[x[0]]+'" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:8px;border:1px solid rgba(52,211,153,.3);">'
        +'<div style="font-size:10px;color:rgba(52,211,153,.5);margin-top:2px;">'+x[1]+'</div></div>'
        :'';
    }).join('')+'</div>'
    // 핵심 발견
    +(ai.핵심발견?'<div style="padding:13px;background:rgba(0,0,0,.3);border-left:3px solid '+gradeC+';border-radius:0 12px 12px 0;margin-bottom:10px;">'
    +'<div style="font-size:10px;color:'+gradeC+';font-weight:700;margin-bottom:5px;">🔍 핵심 발견</div>'
    +'<div style="font-size:12px;color:rgba(240,230,200,.9);line-height:1.8;">'+ai.핵심발견+'</div></div>':'')
    // 각 진단 항목
    +['심장활력','소화기','순환계','신경계','오행_건강'].map(function(k){
      if(!ai[k]) return '';
      var ic={심장활력:'❤️',소화기:'🫃',순환계:'💗',신경계:'🧠',오행_건강:'☯️'};
      return '<div style="padding:12px;background:rgba(0,0,0,.2);border-left:3px solid rgba(52,211,153,.3);border-radius:0 10px 10px 0;margin-bottom:8px;">'
        +'<div style="font-size:10px;color:#34d399;font-weight:700;margin-bottom:4px;">'+(ic[k]||'•')+' '+k.replace('_',' ')+'</div>'
        +'<div style="font-size:12px;color:rgba(240,230,200,.85);line-height:1.8;">'+ai[k]+'</div></div>';
    }).join('')
    // 주의 신호
    +(ai.주의_신호&&ai.주의_신호!=='없음'?'<div style="padding:12px;background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.25);border-radius:12px;margin-bottom:10px;">'
    +'<div style="font-size:10px;color:#f87171;font-weight:700;margin-bottom:4px;">⚠️ 주의 신호</div>'
    +'<div style="font-size:12px;color:rgba(240,230,200,.85);line-height:1.8;">'+ai.주의_신호+'</div></div>':'')
    // 당장 조언
    +(ai.당장_조언?'<div style="padding:13px;background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.25);border-radius:12px;margin-bottom:10px;">'
    +'<div style="font-size:10px;color:#fbbf24;font-weight:700;margin-bottom:4px;">💡 오늘 당장 실천</div>'
    +'<div style="font-size:12px;color:rgba(240,230,200,.85);line-height:1.8;">'+ai.당장_조언+'</div></div>':'')
    // 식이 처방
    +(ai.식이_가이드?'<div style="padding:13px;background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.2);border-radius:12px;margin-bottom:10px;">'
    +'<div style="font-size:10px;color:#34d399;font-weight:700;margin-bottom:4px;">🥗 오행 식이 가이드</div>'
    +'<div style="font-size:12px;color:rgba(240,230,200,.85);line-height:1.8;">'+ai.식이_가이드+'</div></div>':'')
    +'<div style="text-align:center;font-size:10px;color:rgba(255,255,255,.15);margin-top:8px;">CGO-FULI 6부위 종합 건강 분석</div>';

  sec.insertBefore(div, sec.firstChild);
  div.scrollIntoView({behavior:'smooth'});
};

function _c24DiseaseRealStart(key){
  var pop = document.getElementById('c24-disease-guide-pop');
  if(pop) pop.remove();

  _c24DiseaseClose();
  var flow = _c24DiseaseFlow[key];
  if(!flow) return;

  _c24DiseaseState.key = key;
  _c24DiseaseState.stepIdx = 0;
  _c24DiseaseState.results = [];
  _c24DiseaseState.active = true;

  _c24UpdateBanner();

  var cam = document.getElementById('c24-disease-banner');
  if(cam) cam.scrollIntoView({behavior:'smooth', block:'center'});
  setTimeout(function(){
    _c24SetMode(flow.steps[0]);
    _c24.TOTAL = flow.times ? flow.times[0] : 60;
    setTimeout(function(){ _c24Start(); }, 600);
  }, 800);
};

function _c24StartDisease(key){
  var flow = _c24DiseaseFlow[key];
  var card = _c24Cards[key];
  if(!flow||!card) return;

  // 기존 팝업 제거
  var old = document.getElementById('c24-disease-guide-pop');
  if(old) old.remove();

  // 단계별 안내 생성
  var stepColors = {face:'56,189,248', tongue:'248,113,113', eye:'52,211,153', skin:'244,114,182', hand:'251,191,36', hand_back:'251,191,36', hand_palm:'251,191,36'};
  var stepGuides = {
    face:  {ico:'👤', name:'얼굴', cam:'📱 전면 카메라', dist:'30~40cm', tips:['밝은 정면 조명', '안경·모자 제거', '무표정으로 정면 응시']},
    tongue:{ico:'👅', name:'혀',   cam:'📱 전면 카메라', dist:'15~20cm', tips:['혀를 최대한 내밀기', '혀 전체가 화면에 보이도록', '식사 30분 후 권장']},
    eye:   {ico:'👁️', name:'눈',   cam:'📱 전면 카메라', dist:'15~20cm', tips:['위를 약간 봐서 흰자 노출', '렌즈 제거 권장', '눈을 크게 뜨기']},
    skin:  {ico:'🎨', name:'피부', cam:'📱 전면 카메라', dist:'10~15cm', tips:['맨 피부 상태 권장', '크림·화장 없이', '자연광 또는 백색등']},
    hand:  {ico:'✋', name:'손',   cam:'📷 후면 카메라', dist:'20~25cm', tips:['손가락 가지런히 펴기', '매니큐어 제거 권장', '손 흔들지 않기']},
    hand_back: {ico:'🤚', name:'손등', cam:'📷 후면 카메라', dist:'20~25cm', tips:['손톱 잘 보이게', '매니큐어 제거 권장', '손 흔들지 않기']},
    hand_palm: {ico:'✋', name:'손바닥', cam:'📷 후면 카메라', dist:'20~25cm', tips:['손바닥 평평하게 펼치기', '손금이 보이도록', '손 흔들지 않기']}
  };

  var totalSec = (flow.times||[]).reduce(function(a,b){return a+b;},0);
  var stepsHtml = flow.steps.map(function(s,i){
    var g = stepGuides[s]||stepGuides['face'];
    var c = stepColors[s]||'56,189,248';
    var t = flow.times?flow.times[i]:60;
    return '<div style="background:rgba('+c+',.07);border:1px solid rgba('+c+',.25);border-radius:10px;padding:10px 12px;margin-bottom:8px;">'
      +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">'
      +'<span style="font-size:18px;">'+g.ico+'</span>'
      +'<span style="font-size:12px;font-weight:800;color:rgba('+c+',1);">'+(i+1)+'단계 · '+g.name+' — '+t+'초</span>'
      +'<span style="font-size:10px;color:rgba('+c+',.5);margin-left:auto;">'+g.cam+'</span></div>'
      +'<div style="font-size:11px;color:rgba(240,230,200,.8);line-height:1.9;padding-left:26px;">'
      +'📏 카메라와 <b style="color:#fff;">'+g.dist+'</b> 거리 유지<br>'
      +g.tips.map(function(t){return '• '+t;}).join('<br>')
      +'</div></div>';
  }).join('');

  var pop = document.createElement('div');
  pop.id = 'c24-disease-guide-pop';
  pop.style.cssText = 'position:fixed;inset:0;z-index:19000;background:rgba(2,8,23,.92);backdrop-filter:blur(4px);display:flex;align-items:flex-end;justify-content:center;';

  pop.innerHTML =
    '<div style="width:100%;max-width:480px;max-height:90vh;overflow-y:auto;background:linear-gradient(160deg,#0a1628,#0d1f3c);border-radius:20px 20px 0 0;border-top:2px solid rgba(212,168,67,.4);padding:20px 18px 32px;">'
    // 헤더
    +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'
    +'<div style="font-size:15px;font-weight:900;color:#d4a843;">'+card.title+' 검사 안내</div>'
    +'<div style="font-size:11px;color:rgba(212,168,67,.6);">총 '+totalSec+'초</div></div>'
    // 단계 안내
    +stepsHtml
    // 공통 주의
    +'<div style="background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.2);border-radius:10px;padding:10px 14px;margin:10px 0 16px;">'
    +'<div style="font-size:11px;font-weight:800;color:#fbbf24;margin-bottom:4px;">⚠️ 공통 주의사항</div>'
    +'<div style="font-size:11px;color:rgba(240,230,200,.8);line-height:1.9;">'
    +'• 밝은 곳에서 측정할수록 정확도가 높아집니다<br>'
    +(flow.total>1 ? '• 단계가 끝나면 자동으로 다음 단계로 넘어갑니다<br>' : '')
    +'• 본 분석은 참고용이며 의학적 진단을 대체하지 않습니다'
    +'</div></div>'
    // 버튼
    +'<div style="display:flex;gap:10px;">'
    +'<button onclick="_c24DiseaseRealStart(\''+key+'\')" style="flex:3;padding:15px;background:linear-gradient(135deg,rgba(212,168,67,.3),rgba(248,113,113,.2));border:2px solid rgba(212,168,67,.7);border-radius:14px;color:#d4a843;font-size:15px;font-weight:900;cursor:pointer;">✅ 이해했습니다 — 측정 시작</button>'
    +'<button onclick="document.getElementById(\'c24-disease-guide-pop\').remove()" style="flex:1;padding:15px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:14px;color:rgba(240,230,200,.5);font-size:13px;cursor:pointer;">나중에</button>'
    +'</div></div>';

  document.body.appendChild(pop);
};

function _c24CompFinalAnalyze(){
  try{var _pR=document.getElementById('page-algo');if(_pR)_pR.classList.remove('c24-scanning');}catch(e){}
  try{ if(typeof _c24ChimeDone==='function') _c24ChimeDone(); }catch(e){} // 완료 차임 (B-2b)
  // C-60: 모든 사진(손바닥 포함) 캡처 완료 후 5카드 재동기화 — 손바닥 빈칸 버그 수정
  try{ if(typeof hltSyncBioCards==='function') hltSyncBioCards(); }catch(e){}
  var s = _c24CompState;
  var r = window.calcResult||{};
  var oh = r.domOh||'토';
  var name = r.name||'사용자';
  var ohK = {목:'木',화:'火',토:'土',금:'金',수:'水'};

  // 유도 버튼 제거
  var old = document.getElementById('c24-comp-next');
  if(old) old.remove();

  // 결과 섹션에 로딩 추가
  var sec = document.getElementById('c24-result-section');
  if(sec){
    var loading = document.createElement('div');
    loading.id = 'c24-comp-loading';
    loading.style.cssText = 'padding:20px;text-align:center;';
    loading.innerHTML =
      '<div style="font-size:36px;animation:spin 1s linear infinite;">🔬</div>'
      +'<div style="color:#34d399;font-size:13px;font-weight:700;margin-top:12px;">✨ C-24가 6부위 종합 건강 분석 중...</div>'
      +'<div style="font-size:11px;color:rgba(52,211,153,.5);margin-top:4px;">얼굴·손등·손바닥·혀 통합 스캔</div>';
    sec.insertBefore(loading, sec.firstChild);
  }

  // 각 이미지 Vision AI 분석
  var analyses = {};

  var _analyzeImg = function(b64, prompt, key){
    if(!b64) return Promise.resolve('');
    return fetch('/api/groq',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'meta-llama/llama-4-scout-17b-16e-instruct',
        messages:[{role:'user',content:[
          {type:'image_url',image_url:{url:'data:image/jpeg;base64,'+b64}},
          {type:'text',text:prompt}
        ]}],max_tokens:300,temperature:0.3})})
    .then(function(r2){return r2.json();})
    .then(function(d){
      var t=(d.choices&&d.choices[0]&&d.choices[0].message&&d.choices[0].message.content)||'';
      return t.replace(/```json|```/g,'').trim();
    }).catch(function(){return '';});
  };

  Promise.all([
    _analyzeImg(s.images.face,
      '이 얼굴 사진의 색조를 관찰. JSON만(코드블록없이):\n{"안색":"밝음/붉은톤/노란톤/보통","부기":"있음/없음","다크서클":"있음/없음","생기":"밝음/중간/어두움","특이사항":"눈에 띄는 특징"}','face'),
    _analyzeImg(s.images.tongue,
      '이 혀 사진을 관찰. JSON만(코드블록없이):\n{"설색":"담홍/홍/암홍/창백/청자","설태":"백태/황태/흑태/없음","설형":"정상/치흔/균열/점","혀크기":"정상/크고두꺼움/작고얇음"}','tongue'),
    _analyzeImg(s.images.eye,
      '이 눈 사진의 색조를 관찰. JSON만(코드블록없이):\n{"눈가톤":"맑음/흐림/노란톤/붉은톤","흰자톤":"맑음/노란톤/붉은톤","눈꺼풀":"보통/부음/처짐","특이사항":"눈에 띄는 특징"}','eye'),
    _analyzeImg(s.images.skin,
      '이 피부 사진의 색조를 관찰. JSON만(코드블록없이):\n{"피부톤":"밝음/옅음/노란톤/붉은톤/어두운톤","탄력":"좋음/보통/저하","건조도":"보통/건조/지성","트러블":"없음/있음","특이사항":"눈에 띄는 특징"}','skin'),
    _analyzeImg(s.images.hand_back,
      '이 손등 사진의 색조를 관찰. JSON만(코드블록없이):\n{"손톱톤":"옅음/분홍/어두움/노란톤/보통","혈관":"선명/보통/약함","손등톤":"보통/옅음/붉은톤/노란톤","특이사항":"눈에 띄는 특징"}','hand_back'),
    _analyzeImg(s.images.hand_palm,
      '이 손바닥 사진을 관찰. JSON만(코드블록없이):\n{"손바닥톤":"보통/옅음/붉은톤/노란톤/어두운톤","생명선":"길고깊음/보통/짧음/사슬","감정선":"선명/보통/끊김","두뇌선":"선명/보통/끊김","손바닥두께":"두꺼움/보통/얇음"}','hand_palm')
  ]).then(function(results){
    var _parse = function(t){ try{var m=t.match(/\{[\s\S]*\}/);return m?JSON.parse(m[0]):{};} catch(e){return {};} };
    var face=_parse(results[0]);
    var tongue=_parse(results[1]);
    var eye=_parse(results[2]);
    var skin=_parse(results[3]);
    var hBack=_parse(results[4]);
    var hPalm=_parse(results[5]);
    var breath=s.breathData;

    // 통합 AI 분석
    var sysPrompt = '당신은 공개된 한의학·의학 문헌을 학습한 건강 정보 도우미 AI입니다. 의료인이 아니며 진단·처방을 하지 않습니다. '
      +'실측 데이터만 근거로 현실적·구체적으로 분석하세요. JSON만 반환. 코드블록 금지. '
      +'반드시 100% 순수한 한국어로만 작성하세요. furthermore, however, additionally 등 영어 단어 절대 사용 금지.';

    var userPrompt = '분석 대상: '+name+'님 | 오행('+oh+'·'+ohK[oh]+')\n'
      +'rPPG 실측: BPM='+_c24.bpm+' HRV='+_c24.hrv+' FCI='+_c24.fci+'%\n'
      +'478호흡: 완료사이클='+breath.cycles+'회\n'
      +'얼굴 관찰: '+JSON.stringify(face)+'\n'
      +'혀 관찰: '+JSON.stringify(tongue)+'\n'
      +'눈 관찰: '+JSON.stringify(eye)+'\n'
      +'피부 관찰: '+JSON.stringify(skin)+'\n'
      +'손등 관찰: '+JSON.stringify(hBack)+'\n'
      +'손바닥 관찰: '+JSON.stringify(hPalm)+'\n\n'
      +'아래 JSON으로 반환:\n'
      +'{"종합등급":"A(매우건강)/B(양호)/C(주의)/D(관리필요) 중 하나",'
      +'"종합점수":점수(40~98),'
      +'"핵심발견":"6부위에서 발견한 가장 중요한 건강 신호. 실제 관찰 특징 언급. 3문장",'
      +'"심장활력":"얼굴안색+손톱색+rPPG BPM으로 본 심장 활력 상태. 3문장",'
      +'"소화기":"손바닥색+혀설태+설색으로 본 소화기(비위) 상태. 3문장",'
      +'"순환계":"손톱색+손등혈관+얼굴혈색으로 본 혈액순환. 3문장",'
      +'"신경계":"내면 탄력성 활력도='+(_c24.hrv>=60?'우수':_c24.hrv>=40?'양호':_c24.hrv>=20?'보통':'관리 권장')+'+안색+혀균열+478호흡('+breath.cycles+'사이클)로 본 내면 탄력성. 3문장",'
      +'"눈_건강":"눈빛 톤 관찰로 본 눈 컨디션. 3문장",'
      +'"피부_건강":"피부색+탄력+건조도로 본 피부 및 전신 건강 상태. 3문장",'
      +'"오행_건강":"오행('+oh+') 기준 현재 기운의 흐름. 어떤 부분을 돌보면 좋은지. 3문장",'
      +'"당장_조언":"오늘 당장 실천해야 할 건강 행동 3가지. 구체적으로.",'
      +'"주의_신호":"6부위에서 관찰된 컨디션 참고 사항. 없으면 없음. 2문장",'
      +'"식이_가이드":"오행('+oh+') 기준 지금 당장 먹어야 할 것과 피해야 할 것. 3문장"}';

    return fetch('/api/groq',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'openai/gpt-oss-20b',reasoning_effort:'low',include_reasoning:false,
        messages:[{role:'system',content:sysPrompt},{role:'user',content:userPrompt}],
        max_tokens:2500,temperature:0.6})});
  })
  .then(function(r3){return r3.json();})
  .then(function(d3){
    var t=(d3.choices&&d3.choices[0]&&d3.choices[0].message&&d3.choices[0].message.content)||'{}';
    var m=t.replace(/```json|```/g,'').trim().match(/\{[\s\S]*\}/);
    var ai=m?JSON.parse(m[0]):{};
    _c24CompShowResult(ai);
  })
  .catch(function(){ _c24CompShowResult({핵심발견:'분석 중 오류가 발생했습니다. 다시 시도해 주세요.'}); });
};

function _c24UpdateBanner(){
  var st = _c24DiseaseState;
  if(!st.active||!st.key) return;
  var flow = _c24DiseaseFlow[st.key];
  var card = _c24Cards[st.key];
  var banner = document.getElementById('c24-disease-banner');
  var btitle = document.getElementById('c24-banner-title');
  var bstep  = document.getElementById('c24-banner-step');
  var bguide = document.getElementById('c24-banner-guide');
  var bprog  = document.getElementById('c24-banner-prog');
  if(!banner) return;
  banner.style.display='block';
  if(btitle) btitle.textContent = _cgoT(card.title).replace(/[💓🩸🦋🫀🍬🧠🫁👅😴🧬]/u,'').trim()+' '+_cgoT('검사 중');
  if(bstep)  bstep.textContent = flow.total>1 ? (st.stepIdx+1)+'/'+flow.total+' 단계' : '단일 검사';
  if(bguide){
    var modeNames={face:'👤 얼굴을 카메라 정면 30~50cm에 맞춰 주세요',tongue:'👅 혀를 최대한 내밀어 카메라에 가까이 대 주세요',hand:'✋ 손바닥을 펴서 후면 카메라 앞 20~30cm에 대 주세요',eye:'👁️ 눈 흰자가 잘 보이도록 위를 약간 보며 카메라 가까이 대 주세요',skin:'🎨 측정할 피부 부위를 카메라 10~20cm 앞에 대 주세요'};
    bguide.textContent = (modeNames[flow.steps[st.stepIdx]]||'') + ' — '+(flow.times?flow.times[st.stepIdx]:90)+'초간 고정해 주세요';
  }
  if(bprog) bprog.style.width = ((st.stepIdx/flow.total)*100)+'%';
};

function _c24SetMode(mode){
  _c24.mode = mode;
  ['face','tongue','hand','eye','skin'].forEach(function(m){
    var btn = document.getElementById('c24-btn-'+m);
    if(!btn) return;
    if(m===mode){
      btn.style.background='rgba(56,189,248,.2)';
      btn.style.border='1px solid rgba(56,189,248,.6)';
      btn.style.color='#38bdf8';
      btn.style.fontWeight='700';
    } else {
      btn.style.background='rgba(255,255,255,.04)';
      btn.style.border='1px solid rgba(255,255,255,.1)';
      btn.style.color='rgba(240,230,200,.6)';
      btn.style.fontWeight='400';
    }
  });
  // 손 모드는 후면 카메라
  var v = document.getElementById('c24-video');
  if(v) v.style.transform = (mode==='hand') ? 'scaleX(1)' : 'scaleX(-1)';
};

function _c24StartDisease(key){
  var flow = _c24DiseaseFlow[key];
  var card = _c24Cards[key];
  if(!flow||!card) return;

  // 기존 팝업 제거
  var old = document.getElementById('c24-disease-guide-pop');
  if(old) old.remove();

  // 단계별 안내 생성
  var stepColors = {face:'56,189,248', tongue:'248,113,113', eye:'52,211,153', skin:'244,114,182', hand:'251,191,36', hand_back:'251,191,36', hand_palm:'251,191,36'};
  var stepGuides = {
    face:  {ico:'👤', name:'얼굴', cam:'📱 전면 카메라', dist:'30~40cm', tips:['밝은 정면 조명', '안경·모자 제거', '무표정으로 정면 응시']},
    tongue:{ico:'👅', name:'혀',   cam:'📱 전면 카메라', dist:'15~20cm', tips:['혀를 최대한 내밀기', '혀 전체가 화면에 보이도록', '식사 30분 후 권장']},
    eye:   {ico:'👁️', name:'눈',   cam:'📱 전면 카메라', dist:'15~20cm', tips:['위를 약간 봐서 흰자 노출', '렌즈 제거 권장', '눈을 크게 뜨기']},
    skin:  {ico:'🎨', name:'피부', cam:'📱 전면 카메라', dist:'10~15cm', tips:['맨 피부 상태 권장', '크림·화장 없이', '자연광 또는 백색등']},
    hand:  {ico:'✋', name:'손',   cam:'📷 후면 카메라', dist:'20~25cm', tips:['손가락 가지런히 펴기', '매니큐어 제거 권장', '손 흔들지 않기']},
    hand_back: {ico:'🤚', name:'손등', cam:'📷 후면 카메라', dist:'20~25cm', tips:['손톱 잘 보이게', '매니큐어 제거 권장', '손 흔들지 않기']},
    hand_palm: {ico:'✋', name:'손바닥', cam:'📷 후면 카메라', dist:'20~25cm', tips:['손바닥 평평하게 펼치기', '손금이 보이도록', '손 흔들지 않기']}
  };

  var totalSec = (flow.times||[]).reduce(function(a,b){return a+b;},0);
  var stepsHtml = flow.steps.map(function(s,i){
    var g = stepGuides[s]||stepGuides['face'];
    var c = stepColors[s]||'56,189,248';
    var t = flow.times?flow.times[i]:60;
    return '<div style="background:rgba('+c+',.07);border:1px solid rgba('+c+',.25);border-radius:10px;padding:10px 12px;margin-bottom:8px;">'
      +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">'
      +'<span style="font-size:18px;">'+g.ico+'</span>'
      +'<span style="font-size:12px;font-weight:800;color:rgba('+c+',1);">'+(i+1)+'단계 · '+g.name+' — '+t+'초</span>'
      +'<span style="font-size:10px;color:rgba('+c+',.5);margin-left:auto;">'+g.cam+'</span></div>'
      +'<div style="font-size:11px;color:rgba(240,230,200,.8);line-height:1.9;padding-left:26px;">'
      +'📏 카메라와 <b style="color:#fff;">'+g.dist+'</b> 거리 유지<br>'
      +g.tips.map(function(t){return '• '+t;}).join('<br>')
      +'</div></div>';
  }).join('');

  var pop = document.createElement('div');
  pop.id = 'c24-disease-guide-pop';
  pop.style.cssText = 'position:fixed;inset:0;z-index:19000;background:rgba(2,8,23,.92);backdrop-filter:blur(4px);display:flex;align-items:flex-end;justify-content:center;';

  pop.innerHTML =
    '<div style="width:100%;max-width:480px;max-height:90vh;overflow-y:auto;background:linear-gradient(160deg,#0a1628,#0d1f3c);border-radius:20px 20px 0 0;border-top:2px solid rgba(212,168,67,.4);padding:20px 18px 32px;">'
    // 헤더
    +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'
    +'<div style="font-size:15px;font-weight:900;color:#d4a843;">'+card.title+' 검사 안내</div>'
    +'<div style="font-size:11px;color:rgba(212,168,67,.6);">총 '+totalSec+'초</div></div>'
    // 단계 안내
    +stepsHtml
    // 공통 주의
    +'<div style="background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.2);border-radius:10px;padding:10px 14px;margin:10px 0 16px;">'
    +'<div style="font-size:11px;font-weight:800;color:#fbbf24;margin-bottom:4px;">⚠️ 공통 주의사항</div>'
    +'<div style="font-size:11px;color:rgba(240,230,200,.8);line-height:1.9;">'
    +'• 밝은 곳에서 측정할수록 정확도가 높아집니다<br>'
    +(flow.total>1 ? '• 단계가 끝나면 자동으로 다음 단계로 넘어갑니다<br>' : '')
    +'• 본 분석은 참고용이며 의학적 진단을 대체하지 않습니다'
    +'</div></div>'
    // 버튼
    +'<div style="display:flex;gap:10px;">'
    +'<button onclick="_c24DiseaseRealStart(\''+key+'\')" style="flex:3;padding:15px;background:linear-gradient(135deg,rgba(212,168,67,.3),rgba(248,113,113,.2));border:2px solid rgba(212,168,67,.7);border-radius:14px;color:#d4a843;font-size:15px;font-weight:900;cursor:pointer;">✅ 이해했습니다 — 측정 시작</button>'
    +'<button onclick="document.getElementById(\'c24-disease-guide-pop\').remove()" style="flex:1;padding:15px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:14px;color:rgba(240,230,200,.5);font-size:13px;cursor:pointer;">나중에</button>'
    +'</div></div>';

  document.body.appendChild(pop);
};

function _c24AppendMsg(role, text){
  var box=document.getElementById('c24-chat-msgs');
  if(!box) return;
  // 초기 안내 메시지 제거
  var intro=box.querySelector('[data-intro]');
  if(intro) intro.remove();

  var div=document.createElement('div');
  div.style.cssText=role==='user'?
    'align-self:flex-end;max-width:85%;background:rgba(56,189,248,.12);border:1px solid rgba(56,189,248,.25);border-radius:14px 14px 4px 14px;padding:10px 14px;font-size:12px;color:rgba(240,230,200,.9);line-height:1.7;':
    'align-self:flex-start;max-width:95%;background:rgba(212,168,67,.07);border:1px solid rgba(212,168,67,.2);border-radius:14px 14px 14px 4px;padding:12px 14px;font-size:12px;color:rgba(240,230,200,.9);line-height:1.85;';
  if(role==='ai') div.setAttribute('data-ai-last','1');
  div.innerHTML=(role==='user'?'<span style="font-size:10px;color:rgba(56,189,248,.7);display:block;margin-bottom:4px;">👤 나</span>':'<span style="font-size:10px;color:rgba(212,168,67,.7);display:block;margin-bottom:4px;">🤖 C-24 AI</span>')+text.replace(/\n/g,'<br>');
  box.appendChild(div);
  box.scrollTop=box.scrollHeight;
};

function _c24UpdateLastAI(text){
  var box=document.getElementById('c24-chat-msgs');
  if(!box) return;
  var last=box.querySelector('[data-ai-last]');
  if(last){
    last.innerHTML='<span style="font-size:10px;color:rgba(212,168,67,.7);display:block;margin-bottom:4px;">🤖 C-24 AI</span>'+text.replace(/\n/g,'<br>');
    last.removeAttribute('data-ai-last');
  }
  box.scrollTop=box.scrollHeight;
};

function _c24BreathTick(){
  if(_c24BreathTimer) clearInterval(_c24BreathTimer);
  var phaseLen = _c24BreathPhaseTime[_c24BreathPhase];
  var phaseElapsed = 0;
  var bar = document.getElementById('c24-breath-bar');
  var txt = document.getElementById('c24-breath-text');
  var cnt = document.getElementById('c24-breath-count');
  if(txt) { txt.textContent = _c24BreathTexts[_c24BreathPhase]; txt.style.color = _c24BreathColors[_c24BreathPhase]; }
  if(bar) bar.style.background = _c24BreathColors[_c24BreathPhase];

  _c24BreathTimer = setInterval(function(){
    phaseElapsed += 0.1;
    var pct = Math.min(100, (phaseElapsed / phaseLen) * 100);
    // 들이쉬기: 0→100, 멈추기: 100유지, 내쉬기: 100→0
    var barPct = _c24BreathPhase===0 ? pct : _c24BreathPhase===1 ? 100 : (100 - pct);
    if(bar) bar.style.width = barPct + '%';
    if(phaseElapsed >= phaseLen){
      clearInterval(_c24BreathTimer);
      _c24BreathPhase = (_c24BreathPhase + 1) % 3;
      if(_c24BreathPhase === 0){
        // ★ 1사이클 완료 → 멈추고 완료 메시지 표시
        _c24CompState.breathData.cycles = 1;
        if(txt){ txt.textContent = _cgoT('✅ 호흡 완료 — 편안하게 정면을 바라봐 주세요'); txt.style.color = '#34d399'; }
        if(bar){ bar.style.width = '100%'; bar.style.background = '#34d399'; }
        if(cnt){ cnt.textContent = _cgoT('1 사이클 완료'); }
        // 5초 후 오버레이 자연스럽게 사라짐
        setTimeout(function(){
          var ov = document.getElementById('c24-breath-overlay');
          if(ov){ ov.style.transition = 'opacity 1s'; ov.style.opacity = '0';
            setTimeout(function(){ if(ov) ov.style.display = 'none'; }, 1000); }
        }, 5000);
        return; // 반복 안 함
      }
      // 한 사이클 내 다음 페이즈 진행
      if(_c24.isRunning && _c24.mode==='face') _c24BreathTick();
      else _c24BreathStop();
    }
  }, 100);
};

function _c24CalcVitals(){
  var sig=_c24.chromSig; if(sig.length<60) return null;
  var peaks=[],minD=Math.round(_c24.sampleRate*0.2);
  for(var i=2;i<sig.length-2;i++){
    if(sig[i]>sig[i-1]&&sig[i]>sig[i-2]&&sig[i]>sig[i+1]&&sig[i]>sig[i+2]){
      if(!peaks.length||i-peaks[peaks.length-1]>=minD) peaks.push(i);
    }
  }
  if(peaks.length<3) return null;
  var rri=[];
  for(var j=1;j<peaks.length;j++){
    var dt=(peaks[j]-peaks[j-1])*(1000/_c24.sampleRate);
    if(dt>333&&dt<1500) rri.push(dt);
  }
  if(rri.length<2) return null;
  var meanRRI=rri.reduce(function(a,b){return a+b;},0)/rri.length;
  var bpm=Math.max(45,Math.min(140,Math.round(60000/meanRRI)));
  var ss=0; for(var k=1;k<rri.length;k++) ss+=Math.pow(rri[k]-rri[k-1],2);
  var hrv=Math.max(8,Math.min(80,Math.round(Math.sqrt(ss/(rri.length-1)))));
  return {bpm:bpm,hrv:hrv};
};

function _c24CalcFCI(){
  if(_c24.rawR.length<30) return 0;
  var buf=_c24.rawR.slice(-60);
  var m=buf.reduce(function(a,b){return a+b;},0)/buf.length;
  if(m<10) return 0;
  var mx=Math.max.apply(null,buf),mn=Math.min.apply(null,buf);
  var ac=(mx-mn)/m;
  return Math.round(Math.min(95,Math.max(40,
    ac<0.005?40:ac>0.06?95:40+(ac-0.005)/(0.06-0.005)*55)));
};

function _c24BreathStop(){
  if(_c24BreathTimer){ clearInterval(_c24BreathTimer); _c24BreathTimer=null; }
  var ov = document.getElementById('c24-breath-overlay');
  if(ov) ov.style.display = 'none';

  // ★ 1사이클 완료된 경우 — HRV 기반 호흡 점수 계산 후 연동
  if(_c24CompState.breathData.cycles >= 1){
    var hrv = _c24.hrv || 0;
    // 타이밍 기반 기저 52~60 + HRV 보너스 (기존 _breathCalcScore 타이밍 로직과 동일)
    var timingBase = 52 + Math.round((Date.now()%1000)/1000*8);
    var hrvBonus = hrv>60?4:hrv>45?2:0;
    var breathScore = Math.max(40, Math.min(85, timingBase + hrvBonus));
    window._lastBreathScore = breathScore;
    // 호흡 카드 즉시 동기화
    if(typeof hltSyncBioCards==='function'){
      setTimeout(function(){ hltSyncBioCards(); }, 400);
    }
  }
};

function _c24ShowResult(){
  var sec=document.getElementById('c24-result-section');
  if(sec) sec.style.display='block';

  // 수치 표시
  var bpmEl=document.getElementById('c24-res-bpm');
  var hrvEl=document.getElementById('c24-res-hrv');
  var fciEl=document.getElementById('c24-res-fci');
  var bpmLb=document.getElementById('c24-res-bpm-label');
  var hrvLb=document.getElementById('c24-res-hrv-label');
  var fciLb=document.getElementById('c24-res-fci-label');

  var bpm=_c24.bpm, hrv=_c24.hrv, fci=_c24.fci;

  if(bpmEl) bpmEl.textContent=bpm>0?bpm:'--';
  if(hrvEl) hrvEl.textContent=hrv>0?hrv:'--';
  if(fciEl) fciEl.textContent=fci>0?fci:'--';

  if(bpmLb) bpmLb.textContent=bpm<=0?'측정 불가':bpm<60?'느림':bpm>100?'빠름':'✅ 일반 범위';
  if(hrvLb) hrvLb.textContent=hrv<=0?'측정 불가':hrv<20?'관리 권장':hrv<40?'보통':hrv>=60?'✅ 우수':'✅ 양호';
  if(fciLb) fciLb.textContent=fci<=0?'측정 불가':fci<50?'낮은 편':fci>=75?'✅ 혈색 양호':'보통';

  // 컨디션 참고 안내 (질병 판정·진료과 안내 없음 — 웰니스)
  var tips=[];
  if(bpm>100) tips.push('💓 맥박 플로우: 빠름 — 잠시 쉬었다가 다시 측정해 보세요');
  if(bpm>0&&bpm<60) tips.push('💓 맥박 플로우: 느림 — 컨디션 참고 지표입니다');
  if(hrv>0&&hrv<20) tips.push('🧠 내면 탄력성: 관리가 필요한 구간 — 4-7-8 호흡과 충분한 휴식을 권해요');
  if(fci>0&&fci<50) tips.push('💗 혈색 지수: 낮은 편 — 수분 섭취와 가벼운 스트레칭을 권해요');
  if(bpm>90&&hrv<25) tips.push('🦋 맥박 빠름 + 내면 탄력성 활력도 낮음 — 휴식과 컨디션 관리를 권해요');
  if(tips.length===0&&bpm>0) tips.push('✅ 현재 측정값은 일반적인 참고 범위입니다 — AI 상담으로 더 자세히 확인하세요');
  if(bpm===0) tips.push('📷 측정값 부족 — 얼굴을 카메라 가까이 대고 밝은 곳에서 다시 측정해 주세요');

  var dl=document.getElementById('c24-disease-list');
  if(dl) dl.innerHTML=tips.map(function(d){ return '<div style="padding:5px 0;border-bottom:1px solid rgba(255,255,255,.05);">'+d+'</div>'; }).join('');

  // 스크롤
  if(sec) sec.scrollIntoView({behavior:'smooth',block:'nearest'});
};

function _c24CompNextStep(){
  var s = _c24CompState;
  var cur = s.step;
  var stepMode = s.steps[cur];

  // 현재 단계 이미지 저장
  if(_c24.capturedImage){
    s.images[stepMode] = _c24.capturedImage;
  }

  var nextIdx = cur + 1;
  if(nextIdx >= s.steps.length){
    // 모든 단계 완료 → 통합 분석
    s.active = false;
    setTimeout(function(){ _c24CompFinalAnalyze(); }, 500);
    return;
  }

  // 다음 단계 유도 버튼 표시
  var nextLabel = s.labels[nextIdx];
  var nextIcos = ['👤','👅','👁️','🎨','🤚','✋'];
  var nextIco = nextIcos[nextIdx] || '📷';
  var sec = document.getElementById('c24-result-section');
  if(!sec) return;

  // 기존 유도 제거
  var old = document.getElementById('c24-comp-next');
  if(old) old.remove();

  var guide = document.createElement('div');
  guide.id = 'c24-comp-next';
  guide.style.cssText = 'position:sticky;top:0;z-index:10;padding:16px;background:rgba(6,14,30,.97);border:2px solid rgba(52,211,153,.7);border-radius:14px;margin-bottom:12px;text-align:center;';
  guide.innerHTML =
    '<div style="font-size:10px;color:rgba(52,211,153,.6);margin-bottom:4px;">'+(nextIdx)+'/'+s.steps.length+' 단계</div>'
    +'<div style="font-size:28px;margin-bottom:6px;">'+nextIco+'</div>'
    +'<div style="font-size:14px;font-weight:900;color:#34d399;margin-bottom:4px;">✅ 완료! 다음 단계로 이동하세요</div>'
    +'<div style="font-size:12px;color:rgba(52,211,153,.7);margin-bottom:12px;">'+nextLabel+'</div>'
    +'<button onclick="_c24CompDoStep('+nextIdx+')" style="padding:12px 32px;background:linear-gradient(135deg,#34d399,#10b981);border:none;border-radius:12px;color:#fff;font-size:13px;font-weight:900;cursor:pointer;">'+nextIco+' 스캔 시작</button>';
  sec.insertBefore(guide, sec.firstChild);
  sec.scrollTop = 0;
};

function _c24DiseaseNextStep(){
  var st = _c24DiseaseState;
  if(!st.active||!st.key) return false;
  var flow = _c24DiseaseFlow[st.key];

  // 현재 단계 결과 저장
  st.results.push({
    mode: flow.steps[st.stepIdx],
    modeLabel: flow.labels[st.stepIdx],
    bpm: _c24.bpm, hrv: _c24.hrv, fci: _c24.fci,
    image: _c24.capturedImage
  });

  st.stepIdx++;

  if(st.stepIdx < flow.total){
    // 다음 단계 진행
    var nextMode = flow.steps[st.stepIdx];
    var nextLabel = flow.labels[st.stepIdx];
    _c24UpdateBanner();

    // 결과창에 중간 안내 표시
    var dl = document.getElementById('c24-disease-list');
    if(dl) dl.innerHTML =
      '<div style="text-align:center;padding:14px;">'+
      '<div style="font-size:20px;margin-bottom:6px;">✅</div>'+
      '<div style="font-size:12px;font-weight:700;color:#34d399;">'+(st.stepIdx)+'단계 완료!</div>'+
      '<div style="font-size:11px;color:rgba(240,230,200,.7);margin-top:6px;">'+
      '📍 다음: <b style="color:#38bdf8;">'+nextLabel+'</b> 측정을 시작합니다...</div></div>';

    var sec = document.getElementById('c24-result-section');
    if(sec) sec.style.display='block';

    setTimeout(function(){
      _c24SetMode(nextMode);
      // ★ 다음 단계 시간 적용
      _c24.TOTAL = flow.times ? flow.times[st.stepIdx] : 60;
      var startBtn = document.getElementById('c24-start-btn');
      if(startBtn) startBtn.textContent='▶ '+((typeof _cgoT==='function')?_cgoT(nextLabel):nextLabel)+' '+((typeof _cgoT==='function')?_cgoT('측정 시작'):'측정 시작')+' ('+(st.stepIdx+1)+'/'+flow.total+')';
      setTimeout(function(){ _c24Start(); }, 800);
    }, 1200);
    return true; // 다음 단계 있음
  } else {
    // 모든 단계 완료
    var bprog = document.getElementById('c24-banner-prog');
    var bstep = document.getElementById('c24-banner-step');
    if(bprog) bprog.style.width='100%';
    if(bstep){ bstep.textContent=_cgoT('✅ 완료'); bstep.style.color='#34d399'; }
    var btitle = document.getElementById('c24-banner-title');
    if(btitle) btitle.textContent = _c24Cards[st.key].title.replace(/[💓🩸🦋🫀🍬🧠🫁👅😴🧬]/u,'').trim()+' 검사 완료!';
    st.active = false;
    return false; // 완료
  }
};

function _c24AutoAnalyze(){
  var bpm=_c24.bpm, hrv=_c24.hrv, fci=_c24.fci, mode=_c24.mode;
  var modeNames={face:'얼굴',tongue:'혀',hand:'손/손톱',eye:'눈',skin:'피부'};

  var systemPrompt='당신은 공개된 의학·한의학 문헌을 학습한 건강 정보 도우미 AI입니다. 의료인이 아니며 진단·처방을 하지 않습니다. '+
    'CGO-FULI C-24 카메라 시스템이 측정한 생체 데이터를 바탕으로 분석합니다. '+
    '반드시 초등학생도 이해할 수 있도록 아주 쉽고 자세하게, 길게 설명해 주세요. '+
    '질환명·병명은 절대 언급하지 마세요. 측정값이 뜻하는 컨디션 경향만 설명하고 "관리가 권장됩니다", "경향이 관찰됩니다" 표현을 사용하세요. '+
    '증상이 지속되면 어느 진료 분야에 상담하면 좋은지 안내하세요. 반드시 100% 순수한 한국어로만 작성하세요. furthermore, however, additionally 등 영어 단어 절대 사용 금지. '+
    '답변 마지막에는 항상 법적 안전 문구를 추가하세요.';

  var userMsg, useVision=false, visionImg=null;

  // ★ 질환 연동 검사 완료 — 다중 측정 통합 프롬프트
  var st = _c24DiseaseState;
  if(st.results && st.results.length > 0){
    var card = _c24Cards[st.key]||{};
    var diseaseName = card.title||'';
    var resultLines = st.results.map(function(r,i){
      return '['+(i+1)+'단계 '+r.modeLabel+' 측정]\n'+
        '활력 박자: '+(r.bpm>0?r.bpm+'회/분':'측정 불가')+'\n'+
        '내면 탄력: '+(r.hrv>0?r.hrv:'측정 불가')+'\n'+
        '생기 톤: '+(r.fci>0?r.fci+'/100':'측정 불가');
    }).join('\n\n');

    userMsg='[C-24 '+diseaseName+' 연동 검사 결과 — '+st.results.length+'개 부위 통합]\n\n'+
      resultLines+'\n\n'+
      '위 '+st.results.length+'개 부위의 측정값을 종합하여 '+diseaseName+' 관련 건강 상태를 아주 자세히 분석해 주세요. '+
      '각 부위별 결과의 의미, 컨디션 참고 지표, 생활습관 개선 방법까지 초등학생도 이해할 수 있게 아주 길고 정성스럽게 설명해 주세요. 질환명·병명은 언급하지 마세요.';

    // 마지막 단계 이미지 Vision에 활용
    var lastImg = st.results[st.results.length-1].image;
    if(lastImg){ useVision=true; visionImg=lastImg; }

    // 측정 결과 초기화 (다음 검사를 위해)
    st.results=[];

  } else {
    // 일반 단일 측정
    var modeLabel=modeNames[mode]||mode;
    userMsg='[C-24 카메라 측정 결과]\n'+
      '측정 부위: '+modeLabel+'\n'+
      '활력 박자: '+(bpm>0?bpm+'회/분':'측정 불가')+'\n'+
      '내면 탄력: '+(hrv>0?hrv:'측정 불가')+'\n'+
      '생기 톤: '+(fci>0?fci+'/100':'측정 불가')+'\n\n'+
      '위 측정값을 바탕으로 건강 상태를 아주 자세히 분석해 주세요. '+
      '컨디션 참고 지표, 생활습관 개선 방법까지 초등학생도 이해할 수 있게 설명해 주세요. 질환명·병명은 언급하지 마세요.';
    if(_c24.capturedImage){ useVision=true; visionImg=_c24.capturedImage; }
  }

  _c24.chatHistory=[{role:'user',content:userMsg}];
  var chatLabel = (st.results||[]).length>0
    ? '🔗 '+(_c24Cards[st.key]&&_c24Cards[st.key].title||'연동 검사')+' 통합 분석 요청'
    : '📊 측정 완료 — AI 분석 요청';
  _c24AppendMsg('user', chatLabel);
  _c24AppendMsg('ai', '🔄 분석 중...');

  var msgs=[{role:'system',content:systemPrompt},{role:'user',content:userMsg}];

  // Vision 이미지 있으면 Vision 모델, 없으면 텍스트 모델
  var body;
  if(useVision && visionImg){
    body={
      model:'meta-llama/llama-4-scout-17b-16e-instruct',
      max_tokens:1800, temperature:0.6,
      messages:[{role:'user',content:[
        {type:'image_url',image_url:{url:'data:image/jpeg;base64,'+visionImg}},
        {type:'text',text:systemPrompt+'\n\n'+userMsg}
      ]}]
    };
  } else {
    body={
      model:'openai/gpt-oss-20b',reasoning_effort:'low',include_reasoning:false,
      max_tokens:1800, temperature:0.6,
      messages:msgs
    };
  }

  fetch('/api/groq',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
  .then(function(r){return r.json();})
  .then(function(data){
    var text=(data.choices&&data.choices[0]&&data.choices[0].message&&data.choices[0].message.content)||'분석 결과를 가져오지 못했습니다.';
    var disclaimer='<div style="margin-top:10px;padding:8px 10px;background:rgba(251,191,36,.06);border:1px solid rgba(251,191,36,.15);border-radius:8px;font-size:10px;color:rgba(251,191,36,.7);">⚠️ 본 분석은 건강 참고 정보 제공 목적이며, 의학적 진단을 대체하지 않습니다. 이상 증상이 지속되면 반드시 전문의 진료를 받으시기 바랍니다.</div>';

    // ★ 측정 결과 분석 카드에 검진 결과 표시
    var dl = document.getElementById('c24-disease-list');
    if(dl){
      var cardKey = _c24DiseaseState.key;
      var cardTitle = (_c24Cards[cardKey]&&_c24Cards[cardKey].title)||'검사 결과';
      var resultHtml =
        '<div style="margin-bottom:10px;">'
        +'<div style="font-size:12px;font-weight:800;color:#34d399;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(52,211,153,.2);">📋 '+cardTitle+' 검진 결과</div>'
        +'<div style="font-size:12px;color:rgba(240,230,200,.9);line-height:1.9;">'+text.replace(/\n/g,'<br>')+'</div>'
        +disclaimer
        +'<div style="margin-top:10px;padding:8px 10px;background:rgba(56,189,248,.06);border:1px solid rgba(56,189,248,.15);border-radius:8px;font-size:11px;color:rgba(56,189,248,.8);text-align:center;">💬 더 궁금한 사항은 아래 AI 상담에서 질문하세요 ↓</div>'
        +'</div>';
      dl.innerHTML = resultHtml;
      var sec = document.getElementById('c24-result-section');
      if(sec) setTimeout(function(){ sec.scrollIntoView({behavior:'smooth',block:'nearest'}); }, 300);
    }

    // ★ 채팅창은 상담 대기 메시지만
    var chatText = '✅ 검진 결과가 위 [측정 결과 분석] 카드에 표시됐습니다.\n\n궁금한 점이 있으시면 편하게 질문해 주세요.\n\n⚠️ <i>본 분석은 건강 참고 정보 제공 목적이며, 의학적 진단을 대체하지 않습니다.</i>';
    _c24UpdateLastAI(chatText);
    _c24.chatHistory.push({role:'assistant',content:text});
  }).catch(function(){
    _c24UpdateLastAI('분석 중 오류가 발생했습니다. 다시 시도해 주세요.');
  });
};

function _c24Filter(x){
  var b=_c24.bpB, a=_c24.bpA, z=_c24.bpZS;
  var w = x - a[1]*z[0] - a[2]*z[1];
  var y = b[0]*w + b[2]*z[1];
  z[1]=z[0]; z[0]=w;
  return y;
};

function _c24FitBand(mode){
  return ({
    face:   [0.28, 0.85],
    tongue: [0.50, 0.97],
    eye:    [0.45, 0.95],
    skin:   [0.30, 0.95],
    hand:   [0.20, 0.92]
  })[mode] || [0.15, 0.95];
};

function _c24Chime(){
  try{
    var AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
    _c24._ac=_c24._ac||new AC(); var ac=_c24._ac;
    if(ac.state==='suspended'){ try{ac.resume();}catch(e){} }
    var now=performance.now();
    if(_c24._lastChime && now-_c24._lastChime<1500) return; // 연타 방지
    _c24._lastChime=now;
    [[523.25,0],[659.25,0.11],[783.99,0.22]].forEach(function(n){ // 딩(도)-동(미)-댕(솔)
      var o=ac.createOscillator(), g=ac.createGain();
      o.type='sine'; o.frequency.value=n[0]; o.connect(g); g.connect(ac.destination);
      var t=ac.currentTime+n[1];
      g.gain.setValueAtTime(0.0001,t);
      g.gain.linearRampToValueAtTime(0.22,t+0.02);
      g.gain.exponentialRampToValueAtTime(0.0008,t+0.20);
      o.start(t); o.stop(t+0.22);
    });
  }catch(e){}
};

function _c24DrawGuide(skinRatio){
  var cv = document.getElementById('c24-guide-canvas');
  if(!cv||!cv.style||cv.style.display==='none') return;
  var v = document.getElementById('c24-video');
  if(!v||!v.videoWidth) return;
  cv.width = cv.offsetWidth;
  cv.height = cv.offsetHeight;
  var ctx = cv.getContext('2d', { willReadFrequently: true });
  ctx.clearRect(0,0,cv.width,cv.height);

  var mode = _c24.mode;
  var isHandMode = (mode==='hand'||mode==='hand_back'||mode==='hand_palm');
  var ok = _c24.faceOK;
  var _fs = _c24.fitState || (ok?'ok':'far');
  var _fcol = _fs==='ok'?'rgba(52,211,153,.92)':_fs==='near'?'rgba(251,191,36,.95)':'rgba(248,113,113,.85)';
  var _hint = _fs==='ok'?'✅ 딱 맞아요 — 측정 중':_fs==='near'?'➡️ 조금 멀어지세요':'⬅️ 더 가까이 · 원 안에 맞춰주세요';

  if(isHandMode){
    // 손 모드: 사각형 가이드
    var rx=cv.width*0.1, ry=cv.height*0.15;
    var rw=cv.width*0.8, rh=cv.height*0.7;
    ctx.strokeStyle = _fcol;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8,4]);
    ctx.strokeRect(rx,ry,rw,rh);
    ctx.setLineDash([]);
  } else {
    // 얼굴/혀 모드: 타원 가이드
    var cx2=cv.width*0.5, cy2=cv.height*0.48;
    var ex=cv.width*0.38, ey=cv.height*0.42;
    /* ★ C-63: 원이 곧 FaceMesh 상태 표시기 — 얼굴 인식되면 초록 실선 + 발광 */
    var _fmOK = (_c24._roiBox && _c24._roiBox.src==='facemesh');
    ctx.beginPath();
    ctx.ellipse(cx2,cy2,ex,ey,0,0,Math.PI*2);
    if(_fmOK){
      ctx.strokeStyle='rgba(52,211,153,.95)';
      ctx.lineWidth=3;
      ctx.setLineDash([]);
      ctx.shadowColor='rgba(52,211,153,.85)'; ctx.shadowBlur=14;   /* 인식 = 발광 */
      ctx.stroke();
      ctx.shadowBlur=0;
    } else {
      ctx.strokeStyle = _fcol;
      ctx.lineWidth = 2.5;
      ctx.setLineDash(_fs==='ok'?[]:[6,4]);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    // 원안에원 — 혀·눈은 안쪽 작은 원 (더 가까이 유도)
    if(mode==='tongue'||mode==='eye'){
      ctx.beginPath();
      ctx.ellipse(cx2,cy2,ex*0.5,ey*0.5,0,0,Math.PI*2);
      ctx.strokeStyle=_fcol; ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
      ctx.stroke(); ctx.setLineDash([]);
    }
    // 코너 강조
    var corners=[[-1,-1],[1,-1],[1,1],[-1,1]];
    corners.forEach(function(c3){
      ctx.beginPath();
      ctx.arc(cx2+c3[0]*ex*0.85,cy2+c3[1]*ey*0.85,4,0,Math.PI*2);
      ctx.fillStyle=ok?'rgba(52,211,153,.9)':'rgba(248,113,113,.7)';
      ctx.fill();
    });
  }

  // 얼굴 없으면 경고
  var warn=document.getElementById('c24-face-warn');
  if(warn) warn.style.display=(!ok&&mode!=='hand_back'&&mode!=='hand_palm')?'block':'none';
  // B-2a: 핏 안내 텍스트
  try{
    ctx.font='bold 13px sans-serif'; ctx.textAlign='center';
    ctx.shadowColor='rgba(0,0,0,.6)'; ctx.shadowBlur=4;
    ctx.fillStyle=_fcol; ctx.fillText(_cgoT(_hint), cv.width*0.5, cv.height*0.94); /* ★ C-63: 캔버스 번역 */
    ctx.shadowBlur=0;
  }catch(e){}
  /* ★ C-63: 실제 측정 ROI를 화면에 표시 — PC/모바일 모두 눈으로 확인 가능
     · 초록 실선 = 지금 픽셀을 뽑는 진짜 영역
     · 좌상단 배지 = ROI 소스(facemesh / inner-circle / hand-rect / ellipse / fixed)
     · 부위별 기호 안내로 정렬을 돕는다 */
  try{
    var _rb=_c24._roiBox;
    if(_rb && v.videoWidth){
      /* object-fit:cover 보정 — 비디오가 잘려 표시되므로 scale은 큰 쪽 기준 */
      var _sc=Math.max(cv.width/v.videoWidth, cv.height/v.videoHeight);
      var _ox=(cv.width - v.videoWidth*_sc)/2, _oy=(cv.height - v.videoHeight*_sc)/2;
      var _bx=_rb.sx*_sc+_ox, _by=_rb.sy*_sc+_oy, _bw=_rb.sw*_sc, _bh=_rb.sh*_sc;
      /* transform:scaleX(-1) 거울 보정 — 화면상 x를 반전 */
      _bx = cv.width - _bx - _bw;
      var _isFM=(_rb.src==='facemesh');
      ctx.save();
      ctx.strokeStyle=_isFM?'rgba(52,211,153,.95)':'rgba(251,191,36,.85)';
      ctx.lineWidth=2; ctx.setLineDash(_isFM?[]:[5,4]);
      /* ★ C-63: 얼굴 3패치(이마·좌볼·우볼)는 측정에만 사용하고 화면엔 표시하지 않는다.
         (박스가 얼굴을 따라다니면 사용자가 신경 쓰임 → 대신 타원 가이드가 인식 상태를 표현)
         패치 표시를 되살리려면: window._cgoShowPatches = true */
      if(_rb.patches && _rb.patches.length>=2){
        if(window._cgoShowPatches===true){
          _rb.patches.forEach(function(_p){
            var _px=_p.x*_sc+_ox, _py=_p.y*_sc+_oy, _pw2=_p.w*_sc, _ph2=_p.h*_sc;
            _px = cv.width - _px - _pw2;
            ctx.strokeRect(_px,_py,_pw2,_ph2);
            ctx.fillStyle='rgba(52,211,153,.13)';
            ctx.fillRect(_px,_py,_pw2,_ph2);
          });
        }
      } else if(mode==='hand'||mode==='hand_back'||mode==='hand_palm') {  /* 손만 박스 표시 (혀·눈은 안쪽 원이 안내) */
        ctx.strokeRect(_bx,_by,_bw,_bh);
        var _c=10;
        ctx.lineWidth=3;
        [[_bx,_by,1,1],[_bx+_bw,_by,-1,1],[_bx,_by+_bh,1,-1],[_bx+_bw,_by+_bh,-1,-1]].forEach(function(p){
          ctx.beginPath();
          ctx.moveTo(p[0]+p[2]*_c, p[1]); ctx.lineTo(p[0], p[1]); ctx.lineTo(p[0], p[1]+p[3]*_c);
          ctx.stroke();
        });
      }
      ctx.setLineDash([]);
      /* 좌상단 상태 배지 */
      var _lbl={facemesh:'🎯 얼굴 추적 정밀',
                'inner-circle':'⭕ 안쪽 원 영역',
                'hand-rect':'✋ 손 영역',
                ellipse:'🔍 얼굴 탐색 중...',
                fixed:'⬜ 기본 영역'}[_rb.src]||_rb.src;
      ctx.font='bold 11px sans-serif'; ctx.textAlign='left';
      _lbl=_cgoT(_lbl);   /* ★ C-63: 캔버스 번역 (너비 계산 전에) */
      var _tw=ctx.measureText(_lbl).width+12;
      ctx.fillStyle=_isFM?'rgba(6,78,59,.85)':'rgba(69,26,3,.85)';
      /* ★C-68: HTML 단계 오버레이(상단 ~46px)와 겹쳐 글자가 포개졌다 → 캔버스 배지를 아래로 */
      ctx.fillRect(6,66,_tw,20);
      ctx.fillStyle=_isFM?'#34d399':'#fbbf24';
      ctx.fillText(_lbl, 12, 80);
      /* ★ C-63: FaceMesh 진단 (콘솔 없이 확인) — 전송/응답/검출 */
      /* ★ C-63: 진단 배지는 개발/검증용 → 언어 무관하게 영어 고정 (단독 '응답','검출'을
         전역 사전에 넣으면 다른 화면에서 오역될 위험이 있음 — C-60 용어집 경고) */
      var _dg='FM '+(_c24.fm?'ON':'OFF')+' · resp '+(_c24._fmRecv||0)+' · hit '+(_c24._fmHit||0);
      ctx.font='10px sans-serif';
      ctx.fillStyle='rgba(0,0,0,.7)';
      var _dw=ctx.measureText(_dg).width+10;
      ctx.fillRect(6,90,_dw,16);
      ctx.fillStyle=(_c24._fmHit>0)?'#5eead4':'rgba(255,255,255,.75)';
      ctx.fillText(_dg, 11, 102);
      /* 부위별 정렬 기호 */
      /* ★ C-63: 상황별 안내 — 얼굴 못 잡으면 무엇을 할지 알려준다 */
      var _sym;
      if((mode==='face'||mode==='skin')){
        _sym = _isFM ? '✅ 얼굴 인식됨 — 그대로 유지하세요'
             : (_c24._fmHit>0 ? '🔍 얼굴을 다시 화면 중앙으로'
                              : '💡 얼굴이 안 잡혀요 — 조명을 밝게 · 카메라와 40~60cm');
      } else {
        _sym={tongue:'👅 혀를 작은 원 중앙에',
              eye:'👁️ 눈을 작은 원 중앙에',
              hand_back:'🤚 손등을 박스 가득',
              hand_palm:'🖐️ 손바닥을 박스 가득'}[mode];
      }
      if(_sym){
        ctx.font='bold 12px sans-serif'; ctx.textAlign='center';
        ctx.shadowColor='rgba(0,0,0,.7)'; ctx.shadowBlur=4;
        ctx.fillStyle='rgba(255,255,255,.92)';
        /* ★C-68: 상단은 HTML 오버레이가 차지 → 아래쪽에 배치.
           번역으로 길어지면 폭에 맞춰 2줄로 나눈다 (요약·생략 없음). */
        var _txt=_cgoT(_sym), _maxW=cv.width*0.92;
        if(ctx.measureText(_txt).width<=_maxW){
          ctx.fillText(_txt, cv.width*0.5, cv.height*0.88);
        } else {
          var _ws=_txt.split(' '), _l1='', _l2='';
          for(var _wi=0;_wi<_ws.length;_wi++){
            var _try=_l1?(_l1+' '+_ws[_wi]):_ws[_wi];
            if(!_l2 && ctx.measureText(_try).width<=_maxW) _l1=_try;
            else _l2=_l2?(_l2+' '+_ws[_wi]):_ws[_wi];
          }
          ctx.fillText(_l1, cv.width*0.5, cv.height*0.84);
          if(_l2) ctx.fillText(_l2, cv.width*0.5, cv.height*0.90);
        }
        ctx.shadowBlur=0;
      }
      ctx.restore();
    }
  }catch(e){}
};

window._c24ShowChatGuide = function(idx){
  var stale = document.getElementById('c24-chat-guide');
  if(stale) stale.remove();
  var stepInfo = [
    {emoji:'👤', title:'얼굴 측정', sec:60, msgs:[
      '안녕하세요! 6부위 종합 검사 함께 시작할게요 🌸',
      '먼저 *얼굴*부터 측정해요',
      '카메라와 30~40cm 거리 유지 + 무표정 + 정면 조명',
      '안경·모자 제거하시고, 화면 아래 4-7-8 호흡 타임라인을 따라 호흡해주세요'
    ], tip:'준비되면 [네, 시작할게요] 버튼을 눌러주세요. 카메라 켜진 후 *5초 위치 조정 시간*이 있어요'},
    {emoji:'👅', title:'혀 관찰 측정', sec:20, msgs:[
      '잘하셨어요! 얼굴 측정 완료 ✓',
      '이제 *혀*를 보여주실 차례예요',
      '카메라 15~20cm 거리에 혀를 *최대한 내밀어* 전체가 보이게 해주세요',
      '식사 30분 후가 가장 정확합니다'
    ], tip:'혀를 카메라에 가져다 댄 후 [네, 시작할게요] 눌러주세요'},
    {emoji:'👁️', title:'눈 측정', sec:20, msgs:[
      '좋아요! 혀 측정 완료 ✓',
      '다음은 *눈* 차례예요',
      '카메라 15~20cm 거리에서 *위를 약간 봐서* 흰자가 잘 보이게',
      '콘택트렌즈는 제거해주시면 더 정확해요'
    ], tip:'눈 위치 잡으신 후 [네, 시작할게요] 눌러주세요'},
    {emoji:'🎨', title:'피부 측정', sec:30, msgs:[
      '훌륭해요! 눈 측정 완료 ✓',
      '이제 *피부* 차례예요',
      '카메라 10~15cm 거리에 *이마 또는 뺨 맨피부*를 가까이',
      '크림·화장 없는 상태가 가장 정확합니다'
    ], tip:'피부 위치 잡으신 후 [네, 시작할게요] 눌러주세요'},
    {emoji:'🤚', title:'손등 측정', sec:15, msgs:[
      '좋습니다! 피부 측정 완료 ✓',
      '*손등*을 측정할게요. 이번엔 *후면 카메라* 사용',
      '카메라 20~25cm 거리에 *손톱이 잘 보이도록* 손등을 정면으로',
      '매니큐어 제거 권장'
    ], tip:'손등 위치 잡으신 후 [네, 시작할게요] 눌러주세요'},
    {emoji:'✋', title:'손바닥 측정 (마지막!)', sec:15, msgs:[
      '거의 다 왔어요! 손등 측정 완료 ✓',
      '*마지막* — 손바닥 차례예요',
      '카메라 20~25cm 거리에 손바닥을 *평평하게 펼쳐* 정면으로',
      '조명이 잘 비추는 곳에서 측정하세요'
    ], tip:'손바닥 위치 잡으신 후 [네, 시작할게요] 눌러주세요. 측정 완료까지 잠시!'}
  ];
  var info = stepInfo[idx] || stepInfo[0];
  var pop = document.createElement('div');
  pop.id = 'c24-chat-guide';
  pop.style.cssText = 'position:fixed;inset:0;z-index:30500;background:rgba(2,8,23,.95);backdrop-filter:blur(8px);display:flex;align-items:flex-end;justify-content:center;padding:20px;font-family:inherit;';
  var msgBubbles = info.msgs.map(function(m, i){
    return '<div style="display:flex;gap:8px;margin-bottom:10px;align-items:flex-start;animation:fadeInUp .4s ease '+(i*0.25)+'s both;">'
      +'<span style="flex-shrink:0;width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#10b981,#0891b2);display:flex;align-items:center;justify-content:center;font-size:16px;">🌸</span>'
      +'<div style="flex:1;background:rgba(255,255,255,.06);border:1px solid rgba(52,211,153,.2);border-radius:14px 14px 14px 4px;padding:10px 14px;font-size:13px;color:#e2e8f0;line-height:1.7;">'+m+'</div>'
      +'</div>';
  }).join('');
  pop.innerHTML = 
    '<style>@keyframes fadeInUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}@keyframes pulseRing{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.05);opacity:.8;}}</style>'
    +'<div style="width:100%;max-width:480px;max-height:92vh;overflow-y:auto;background:linear-gradient(180deg,#0a1628,#0d1f3c);border:2px solid #10b981;border-radius:20px;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.6);">'
    // 헤더
    +'<div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,.08);">'
      +'<div style="font-size:32px;">'+info.emoji+'</div>'
      +'<div style="flex:1;">'
        +'<div style="font-size:9px;font-weight:800;color:#10b981;letter-spacing:.15em;margin-bottom:3px;">CGO-FULI · '+(idx+1)+'/6 단계</div>'
        +'<div style="font-size:16px;font-weight:900;color:#e2e8f0;">'+info.title+' · '+info.sec+'초</div>'
      +'</div>'
    +'</div>'
    // 챗봇 메시지들
    +msgBubbles
    // 팁
    +'<div style="margin-top:14px;padding:12px 14px;background:rgba(56,189,248,.08);border:1px dashed rgba(56,189,248,.4);border-radius:12px;font-size:12px;color:#7dd3fc;line-height:1.7;">💡 '+info.tip+'</div>'
    // 카운트다운 영역
    +'<div id="c24-chat-countdown" style="margin-top:18px;text-align:center;display:none;">'
      +'<div style="font-size:9px;font-weight:800;color:#fbbf24;letter-spacing:.15em;margin-bottom:6px;">자동 시작까지</div>'
      +'<div id="c24-chat-cd-num" style="font-family:Orbitron,sans-serif;font-size:48px;font-weight:900;color:#fbbf24;line-height:1;animation:pulseRing 1s infinite;">5</div>'
    +'</div>'
    // 버튼
    +'<div style="display:flex;gap:10px;margin-top:18px;">'
      +'<button id="c24-chat-go" style="flex:3;padding:14px;background:linear-gradient(135deg,#10b981,#059669);border:none;border-radius:12px;color:#fff;font-size:14px;font-weight:900;cursor:pointer;font-family:inherit;letter-spacing:.02em;">✅ 네, 시작할게요</button>'
      +'<button id="c24-chat-pause" style="flex:1;padding:14px;background:rgba(251,191,36,.15);border:1px solid rgba(251,191,36,.4);border-radius:12px;color:#fbbf24;font-size:12px;font-weight:800;cursor:pointer;font-family:inherit;">⏸️ 잠깐</button>'
    +'</div>'
    +'</div>';
  document.body.appendChild(pop);
  
  // 28번째 정정: 챗봇 모달은 *클릭으로만* 진행 (자동 카운트다운 X)
  // 진짜 5초 위치 조정은 카메라 켜진 후 c24-capture-cd에서 처리
  var goBtn = pop.querySelector('#c24-chat-go');
  var pauseBtn = pop.querySelector('#c24-chat-pause');
  function proceed(){
    pop.remove();
    _c24CompState._guideOk = true;
    _c24CompDoStep(idx);  // 가드 통과해서 진짜 측정 시작 (카메라 ON + 5초 카운트다운)
  }
  goBtn.addEventListener('click', proceed);
  // [잠깐] 버튼은 모달 닫고 검사 일시 중단
  pauseBtn.addEventListener('click', function(){
    pop.remove();
    if(typeof window._c24CloseModal === 'function') window._c24CloseModal();
  });
  pauseBtn.innerHTML = _cgoT('✕ 중단');
};

window._c24ShowCaptureCountdown = function(){
  var stale = document.getElementById('c24-capture-cd');
  if(stale) stale.remove();
  // 폴링 — 카메라 stream 활성화 감지
  var pollCount = 0;
  var poll = setInterval(function(){
    pollCount++;
    if(pollCount > 50){ clearInterval(poll); return; } // 5초 안 켜지면 포기
    if(_c24.stream){
      clearInterval(poll);
      showOverlay();
    }
  }, 100);
  function showOverlay(){
    var ov = document.createElement('div');
    ov.id = 'c24-capture-cd';
    ov.style.cssText = 'position:fixed;inset:0;z-index:30200;background:rgba(2,8,23,.55);backdrop-filter:blur(2px);display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;font-family:inherit;animation:c24cdFade .3s ease;';
    ov.innerHTML = 
      '<style>@keyframes c24cdFade{from{opacity:0;}to{opacity:1;}}@keyframes c24cdPulse{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}</style>'
      +'<div style="background:rgba(15,23,42,.92);border:2px solid #fbbf24;border-radius:24px;padding:24px 40px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.6);">'
        +'<div style="font-size:11px;font-weight:800;color:#fbbf24;letter-spacing:.18em;margin-bottom:8px;">📍 부위를 카메라에 맞춰주세요</div>'
        +'<div id="c24-cd-num" style="font-family:Orbitron,sans-serif;font-size:96px;font-weight:900;color:#fbbf24;line-height:1;animation:c24cdPulse 1s infinite;text-shadow:0 0 30px rgba(251,191,36,.6);">5</div>'
        +'<div style="font-size:12px;color:rgba(232,234,240,.7);margin-top:8px;line-height:1.7;">측정 시작까지<br><span style="color:#fbbf24;font-weight:700;">위치 조정 시간</span></div>'
      +'</div>';
    document.body.appendChild(ov);
    var num = ov.querySelector('#c24-cd-num');
    var left = 5;
    var t = setInterval(function(){
      left--;
      if(left > 0){
        if(num) num.textContent = left;
      } else {
        clearInterval(t);
        // 페이드 아웃 + 제거
        ov.style.transition = 'opacity .4s ease';
        ov.style.opacity = '0';
        setTimeout(function(){ if(ov.parentNode) ov.remove(); }, 400);
      }
    }, 1000);
  }
};

function _c24BreathStart(){
  _c24BreathElapsed = 0;
  _c24BreathPhase = 0;
  _c24CompState.breathData.cycles = 0;
  var ov = document.getElementById('c24-breath-overlay');
  if(ov) ov.style.display = 'block';
  _c24BreathTick();
}

function _c24Finish(){
  if(!_c24.isRunning&&_c24.sec===0) return;
  _c24.isRunning=false;
  clearInterval(_c24.timerInt);
  if(_c24.rafId){cancelAnimationFrame(_c24.rafId);_c24.rafId=null;}

  // 최종 수치 계산
  var vitals=_c24CalcVitals();
  if(vitals){ _c24.bpm=vitals.bpm; _c24.hrv=vitals.hrv; }
  _c24.fci=_c24CalcFCI();

  // 이미지 캡처
  var v=document.getElementById('c24-video');
  var cap=document.getElementById('c24-canvas');
  if(v&&v.videoWidth&&cap){
    cap.width=v.videoWidth; cap.height=v.videoHeight;
    var cx=cap.getContext('2d', { willReadFrequently: true });
    cx.drawImage(v,0,0);
    _c24.capturedImage=cap.toDataURL('image/jpeg',0.85).split(',')[1];
  }

  // 카메라 스트림 정지
  if(_c24.stream){ _c24.stream.getTracks().forEach(function(t){t.stop();}); _c24.stream=null; }
  // ★ 478 호흡 타임라인 종료
  _c24BreathStop();

  // UI 복구
  var startBtn=document.getElementById('c24-start-btn');
  var stopBtn=document.getElementById('c24-stop-btn');
  var idle=document.getElementById('c24-idle-overlay');
  var badge=document.getElementById('c24-live-badge');
  var lb=document.getElementById('c24-live-bpm');
  if(startBtn){startBtn.style.display='block';startBtn.textContent=_cgoT('▶ 다시 측정');}
  if(stopBtn){stopBtn.style.display='none';}
  if(idle){idle.style.display='none';}
  if(badge){badge.style.display='none';}
  if(lb){lb.style.display='none';}

  // 결과 표시
  _c24ShowResult();

  // ★ 생체 실측 지표 카드 동기화
  if(!window._bioFinalData) window._bioFinalData = {};
  var _mode = _c24.mode;
  // 얼굴·눈·피부 → BPM/HRV/FCI 저장
  if(_c24.bpm>0) window._bioFinalData.bpm = _c24.bpm;
  if(_c24.hrv>0) window._bioFinalData.hrv = _c24.hrv;
  if(_c24.fci>0) window._bioFinalData.fci = _c24.fci;
  window._bioFinalData.scanned = true;
  // 혀 모드 → tongue 데이터 저장
  if(_mode==='tongue' && _c24.capturedImage){
    if(!window._bioSkinData) window._bioSkinData = {};
    if(!window._bioSkinData.tongue){
      window._bioSkinData.tongue = {color:'담홍색', organ:'그라운딩 에너지', energy:70};
    }
    window._bioFinalData.tongueDone = true;
    try{ sessionStorage.setItem('_cgoTongueColor', window._bioSkinData.tongue.color);
         sessionStorage.setItem('_cgoTongueOrgan', window._bioSkinData.tongue.organ);
         sessionStorage.setItem('_cgoTongueEnergy', window._bioSkinData.tongue.energy); }catch(e){}
  }
  // 카드 즉시 업데이트
  if(typeof hltSyncBioCards==='function') setTimeout(function(){ hltSyncBioCards(); }, 500);

  // ★ 종합 스캔 단계 처리
  if(_c24CompState.active){
    _c24CompNextStep();
    return;
  }

  // ★ 질환 연동 검사: 다음 단계 있으면 진행, 없으면 AI 분석
  if(_c24DiseaseState.active){
    var hasNext = _c24DiseaseNextStep();
    if(!hasNext){
      // 모든 단계 완료 → 통합 AI 분석
      setTimeout(function(){ _c24AutoAnalyze(); }, 800);
    }
    // hasNext=true 면 다음 단계 자동 시작 (위에서 처리)
  } else {
    // 일반 측정 → 바로 AI 분석
    setTimeout(function(){ _c24AutoAnalyze(); }, 600);
  }
}

function _c24UpdateStageUI(){
  var ov=document.getElementById('c24-stage-overlay');
  var gc=document.getElementById('c24-guide-canvas');
  if(!ov) return;

  if(!_c24CompState.active){
    ov.style.display='none';
    if(gc) gc.style.display='none';
    return;
  }
  ov.style.display='block';
  if(gc) gc.style.display='block';

  var s=_c24CompState;
  var icons=['👤','🤚','✋','👅'];
  var colors=['#38bdf8','#34d399','#34d399','#fca5a5'];

  // 단계 점
  var dots=document.getElementById('c24-stage-dots');
  if(dots){
    dots.innerHTML=s.steps.map(function(_,i){
      return '<div style="width:8px;height:8px;border-radius:50%;background:'
        +(i<s.step?'rgba(52,211,153,.9)':i===s.step?colors[i]:'rgba(255,255,255,.2)')
        +';transition:all .3s;'+(i===s.step?'box-shadow:0 0 6px '+colors[i]+';':'')+'"></div>';
    }).join('');
  }

  // 단계 레이블
  var lbl=document.getElementById('c24-stage-label');
  if(lbl){
    var cur=s.step;
    lbl.style.color=colors[cur]||'#34d399';
          /* ★C-68: labels 앞 이모지가 좁은 오버레이를 밀어내 글자가 겹쳤다 → 표시할 때만 이모지 제거 */
      var _lb=((typeof _cgoT==='function')?_cgoT(s.labels[cur]):s.labels[cur]);
      _lb=_lb.replace(/^[\uD800-\uDBFF][\uDC00-\uDFFF][\uFE0F\u200D]*\s*|^[\u2190-\u2BFF\u3000-\u303F][\uFE0F\u200D]*\s*/,'');
      lbl.textContent=(cur+1)+'/'+s.steps.length+' '+_lb;
      lbl.style.whiteSpace='normal'; lbl.style.lineHeight='1.3'; lbl.style.wordBreak='keep-all'; lbl.style.minWidth='0';
  }
}

function _c24RoiRect(v){
  var vw=v.videoWidth, vh=v.videoHeight;
  var def={sx:Math.floor(vw*0.25), sy:Math.floor(vh*0.1), sw:Math.floor(vw*0.5), sh:Math.floor(vh*0.4), src:'fixed'};
  if(window._cgoRoiV2===false) return def;
  try{
    var mode=_c24.mode;
    /* ── 얼굴/피부: FaceMesh 랜드마크로 '이마 + 좌볼 + 우볼' 3개 패치 (눈·코 제외) ──
       ⚠️ 하나의 bbox로 묶으면 그 사이 눈이 포함됨 → 패치를 분리해 각각 사용.
       MediaPipe 468 실측 인덱스:
         이마 중앙 위: 10(정수리쪽), 151(미간 위), 9(미간)
         좌볼: 234(귀앞), 116, 123, 147   우볼: 454(귀앞), 345, 352, 376
       rPPG 문헌상 볼(cheek)이 신호가 가장 강하고, 이마가 그다음. */
    if((mode==='face'||mode==='skin') && _c24._faceLms &&
       (performance.now()-(_c24._faceLmsTime||0) < 700)){
      var L=_c24._faceLms;
      function _pt(i){ var p=L[i]; return p?{x:p.x*vw, y:p.y*vh}:null; }
      /* 안정적인 기준점 */
      var _l = _pt(234), _r = _pt(454);          /* 좌/우 귀 앞 (얼굴 폭) */
      var _mid = _pt(9), _chin = _pt(152), _brow = _pt(151);
      if(_l && _r && _mid && _chin && _brow){
        var faceW = Math.abs(_r.x - _l.x);
        var patches = [];

        /* ① 이마: 미간 위쪽 (눈썹보다 확실히 위) */
        var fH = Math.abs(_brow.y - _pt(10).y);   /* 미간~정수리 거리 */
        if(fH > 8){
          var fw = faceW*0.42, fh = fH*0.55;
          patches.push({ x:_mid.x - fw/2, y:_brow.y - fH*0.85, w:fw, h:fh });
        }
        /* ② 좌볼 / ③ 우볼: 눈 아래, 입 옆 (코·입 제외) */
        var cW = faceW*0.20, cH = faceW*0.20;
        var cheekY = _mid.y + Math.abs(_chin.y - _mid.y)*0.42;   /* 눈 아래로 충분히 내림 */
        patches.push({ x:_l.x + faceW*0.14, y:cheekY - cH/2, w:cW, h:cH });   /* 좌볼 */
        patches.push({ x:_r.x - faceW*0.14 - cW, y:cheekY - cH/2, w:cW, h:cH }); /* 우볼 */

        /* 화면 밖 클램프 + 유효성 */
        var valid = patches.filter(function(p){
          p.x=Math.max(0,Math.min(p.x, vw-4)); p.y=Math.max(0,Math.min(p.y, vh-4));
          p.w=Math.max(4,Math.min(p.w, vw-p.x)); p.h=Math.max(4,Math.min(p.h, vh-p.y));
          return p.w>=8 && p.h>=8;
        });
        if(valid.length>=2){
          /* 대표 사각형(픽셀 추출용)은 '볼 2개'를 감싸되 눈이 안 들어가게 y를 볼 기준으로 */
          var bx0=Math.min.apply(null, valid.map(function(p){return p.x;}));
          var bx1=Math.max.apply(null, valid.map(function(p){return p.x+p.w;}));
          var cheeks=valid.slice(-2);
          var by0=Math.min.apply(null, cheeks.map(function(p){return p.y;}));
          var by1=Math.max.apply(null, cheeks.map(function(p){return p.y+p.h;}));
          return { sx:Math.floor(bx0), sy:Math.floor(by0),
                   sw:Math.floor(bx1-bx0), sh:Math.floor(by1-by0),
                   src:'facemesh', patches:valid };
        }
      }
    }
    /* ── 혀/눈: 가이드 안쪽 작은 원 영역 (DrawGuide의 ex*0.5, ey*0.5와 동일) ── */
    if(mode==='tongue' || mode==='eye'){
      var cx=vw*0.5, cy=vh*0.48;
      var ex=vw*0.38*0.5, ey=vh*0.42*0.5;
      return {sx:Math.floor(cx-ex), sy:Math.floor(cy-ey), sw:Math.floor(ex*2), sh:Math.floor(ey*2), src:'inner-circle'};
    }
    /* ── 손등/손바닥: 사각 가이드 내부 (DrawGuide 0.1/0.15/0.8/0.7) ── */
    if(mode==='hand'||mode==='hand_back'||mode==='hand_palm'){
      return {sx:Math.floor(vw*0.18), sy:Math.floor(vh*0.22), sw:Math.floor(vw*0.64), sh:Math.floor(vh*0.56), src:'hand-rect'};
    }
    /* ── 얼굴인데 랜드마크 없음: 타원 가이드 내접 사각형 ── */
    if(mode==='face'||mode==='skin'){
      var cx2=vw*0.5, cy2=vh*0.48, ex2=vw*0.38*0.62, ey2=vh*0.42*0.62;
      return {sx:Math.floor(cx2-ex2), sy:Math.floor(cy2-ey2), sw:Math.floor(ex2*2), sh:Math.floor(ey2*2), src:'ellipse'};
    }
  }catch(e){}
  return def;
}

function _c24ChromStep(r, g, b){
  /* ★ C-63 조명 정규화 — 프레임 전체 밝기(luma) 변화를 상쇄해 조명 흔들림에 강인하게.
     기준 밝기(EMA)를 유지하고 현재 프레임을 그 비율로 스케일. rPPG 맥동 성분은 보존됨.
     (조명이 밝아지면 R·G·B가 함께 커지므로, 공통 성분을 나눠 제거) */
  if(window._cgoRoiV2!==false){
    try{
      var _lum = 0.299*r + 0.587*g + 0.114*b;
      if(_lum > 1){
        if(!_c24._lumaEMA) _c24._lumaEMA = _lum;
        else _c24._lumaEMA = _c24._lumaEMA*0.97 + _lum*0.03;   /* 느린 EMA = 조명 기준선 */
        var _k = _c24._lumaEMA / _lum;
        if(_k > 0.5 && _k < 2.0){ r*=_k; g*=_k; b*=_k; }        /* 급변 시엔 미적용(안전) */
      }
    }catch(e){}
  }
  _c24.rawR.push(r); _c24.rawG.push(g); _c24.rawB.push(b);
  var n=_c24.rawR.length;
  if(n<2) return;
  var wSize=Math.min(n,30);
  var rS=_c24.rawR.slice(-wSize), gS=_c24.rawG.slice(-wSize), bS=_c24.rawB.slice(-wSize);
  function mean(a){ return a.reduce(function(s,v){return s+v;},0)/a.length; }
  function std(a){ var m=mean(a); return Math.sqrt(a.reduce(function(s,v){return s+Math.pow(v-m,2);},0)/a.length)||0.0001; }
  var rM=mean(rS),gM=mean(gS),bM=mean(bS);
  if(rM<1||gM<1||bM<1) return;
  // 동작잡음 체크
  if(_c24.prevR>0&&(Math.abs(r-_c24.prevR)/rM>0.15||Math.abs(g-_c24.prevG)/gM>0.15)){
    _c24.prevR=r; _c24.prevG=g; return;
  }
  _c24.prevR=r; _c24.prevG=g;
  var xsArr=[],ysArr=[];
  for(var i=0;i<wSize;i++){
    xsArr.push(3*(rS[i]/rM)-2*(gS[i]/gM));
    ysArr.push(1.5*(rS[i]/rM)+(gS[i]/gM)-1.5*(bS[i]/bM));
  }
  var alpha=std(xsArr)/std(ysArr);
  var Xs=3*(r/rM)-2*(g/gM), Ys=1.5*(r/rM)+(g/gM)-1.5*(b/bM);
  _c24.chromSig.push(_c24Filter(Xs-alpha*Ys));
  if(_c24.chromSig.length>2700) _c24.chromSig.shift();
  if(_c24.rawR.length>2700){ _c24.rawR.shift(); _c24.rawG.shift(); _c24.rawB.shift(); }
}

function _c24CompStartStep(needBack){
  if(_c24.isRunning) return;
  _c24.rawR=[]; _c24.rawG=[]; _c24.rawB=[];
  _c24.chromSig=[]; _c24.bpZS=[0,0];
  _c24.bpm=0; _c24.hrv=0; _c24.fci=0;
  _c24.sec=0; _c24.prevR=0; _c24.prevG=0;
  _c24.capturedImage=null;
  _c24.faceOK=false;
  _c24.gotVitals=false; /* B-1: 유효 맥동 신호 1회라도 잡혔는지 */
  _c24.isRunning=true;

  _c24.offCanvas=document.createElement('canvas');
  _c24.offCtx=_c24.offCanvas.getContext('2d', { willReadFrequently: true });

  var stopBtn=document.getElementById('c24-stop-btn');
  var badge=document.getElementById('c24-live-badge');
  var startBtn=document.getElementById('c24-start-btn');
  if(stopBtn) stopBtn.style.display='block';
  if(badge) badge.style.display='block';
  if(startBtn) startBtn.style.display='none';

  var facing = needBack ? 'environment' : 'user';
  var constraints={video:{facingMode:facing,width:{ideal:640},height:{ideal:480},frameRate:{ideal:30}}};
  navigator.mediaDevices.getUserMedia(constraints)
  .catch(function(){return navigator.mediaDevices.getUserMedia({video:true});})
  .then(function(stream){
    _c24.stream=stream;
    var v=document.getElementById('c24-video');
    if(v){
      v.srcObject=stream;
      v.style.transform=needBack?'scaleX(1)':'scaleX(-1)';
      v.play().catch(function(){});
    }
    // idle overlay 숨기기 (카메라 준비됐을 때만)
    var idleOv=document.getElementById('c24-idle-overlay');
    if(idleOv) idleOv.style.display='none';
    // stage overlay 표시
    var stageOv=document.getElementById('c24-stage-overlay');
    if(stageOv) stageOv.style.display='block';
    var gc=document.getElementById('c24-guide-canvas');
    if(gc) gc.style.display='block';
    // ★ 얼굴 단계에서만 478 호흡 타임라인 시작
    if(_c24.mode==='face') _c24BreathStart();
    // ★ 5초 위치 조정 시간 후 측정 루프 시작 (28번째 — 사진 정확도 fix)
    _c24._delayedStart = setTimeout(function(){
      _c24.rafId=requestAnimationFrame(_c24Loop);
    }, 5000);
  }).catch(function(){
    _c24.isRunning=false;
    alert('카메라 권한이 필요합니다.');
  });

  // 타이머
  var startTime=performance.now()+5000; // ★ 5초 위치 조정 시간 후 측정 시작
  var lastSec=0;
  var pausedTime=0, pauseStart=0;
  _c24.timerInt=setInterval(function(){
    var needFace=(_c24.mode==='face'||_c24.mode==='tongue');
    if(!_c24.fitOK&&_c24.sec>1){ /* B-2b: 핏(거리·원) 맞을 때만 진행 */
      if(!pauseStart) pauseStart=performance.now();
      return;
    }
    if(pauseStart){pausedTime+=performance.now()-pauseStart;pauseStart=0;}
    var elapsed=(performance.now()-startTime-pausedTime)/1000;
    var sec=Math.floor(elapsed);
    if(sec<=lastSec) return;
    lastSec=sec; _c24.sec=sec;
    var remain=_c24.TOTAL-sec;
    var timerEl=document.getElementById('c24-timer-badge');
    var prog=document.getElementById('c24-progress');
    if(timerEl) timerEl.textContent=remain>0?String(remain):'✓';
    if(prog) prog.style.width=(sec/_c24.TOTAL*100)+'%';
    if(sec>=_c24.TOTAL) _c24Finish();
  },250);
}

function _c24CompDoStep(idx){
  // ★ 챗봇 안내 + 5초 카운트다운 가드 (의료 시스템 0건 수정)
  if(typeof window._c24ShowChatGuide === 'function' && !_c24CompState._guideOk){
    window._c24ShowChatGuide(idx);
    return;
  }
  _c24CompState._guideOk = false;
  _c24CompState.step = idx;
  var s = _c24CompState;
  var stepMode = s.steps[idx];
  var stepLabel = s.labels[idx];
  var stepTotal = s.totals[idx];
  var needBack = (stepMode==='hand_back'||stepMode==='hand_palm');

  // 실제 c21 모드
  var realMode = needBack ? 'hand' : stepMode;
  _c24.mode = realMode;
  _c24.TOTAL = stepTotal;

  // ★ 기존 스트림·타이머 완전 정지
  _c24.isRunning = false;
  clearInterval(_c24.timerInt); _c24.timerInt=null;
  if(_c24.rafId){cancelAnimationFrame(_c24.rafId);_c24.rafId=null;}
  if(_c24.stream){
    _c24.stream.getTracks().forEach(function(t){t.stop();});
    _c24.stream=null;
  }

  // 비디오 미러 설정
  var v=document.getElementById('c24-video');
  if(v) v.style.transform=needBack?'scaleX(1)':'scaleX(-1)';

  // 단계별 안내 UI 표시
  var icons=['👤','👅','👁️','🎨','🤚','✋'];
  var guides=[
    '얼굴을 카메라 정면 30cm에 맞춰주세요\n478 호흡법을 따라 호흡해 주세요 (60초)',
    '혀를 최대한 내밀어 카메라에 가까이 대주세요 (20초)',
    '눈 흰자가 보이도록 위를 약간 보며 카메라에 대주세요 (20초)',
    '피부 부위를 카메라 10~20cm 앞에 고정해 주세요 (30초)',
    '손등(손톱 보이는 쪽)을 후면 카메라에 보여주세요 (15초)',
    '손바닥을 펼쳐 후면 카메라에 보여주세요 (15초)'
  ];
  var idleOv=document.getElementById('c24-idle-overlay');
  if(idleOv){
    idleOv.style.display='flex';
    idleOv.innerHTML=
      '<div style="font-size:32px;margin-bottom:8px;">'+icons[idx]+'</div>'
      +'<div style="font-size:13px;font-weight:900;color:#34d399;margin-bottom:6px;">'+(idx+1)+'/'+s.steps.length+' 단계</div>'
      +'<div style="font-size:11px;color:rgba(240,230,200,.7);text-align:center;padding:0 16px;line-height:1.7;">'+guides[idx]+'</div>';
  }

  // 타이머 배지
  var timerB=document.getElementById('c24-timer-badge');
  if(timerB){timerB.style.display='block';timerB.textContent=String(stepTotal);}

  // stage overlay 업데이트
  _c24UpdateStageUI();

  // 300ms 후 종합스캔 전용 start
  setTimeout(function(){ 
    _c24CompStartStep(needBack); 
    // ★ 카메라 ON 후 5초 위치 조정 카운트다운 오버레이 (별도 폴링)
    if(typeof window._c24ShowCaptureCountdown === 'function'){
      window._c24ShowCaptureCountdown();
    }
  }, 400);
}

function _c24Loop(){
  var now=Date.now();
  if(now-_c24.lastSampleTime >= 1000/_c24.sampleRate){
    _c24.lastSampleTime=now;
    var v=document.getElementById('c24-video');
    if(v&&v.videoWidth&&_c24.offCtx){
      var vw=v.videoWidth,vh=v.videoHeight;
      /* ★ C-63: 부위별 정밀 ROI (FaceMesh 볼·이마 / 혀·눈 안쪽원 / 손 사각) · 실패 시 고정 사각형 폴백 */
      var _roi=(typeof _c24RoiRect==='function')?_c24RoiRect(v):{sx:Math.floor(vw*0.25),sy:Math.floor(vh*0.1),sw:Math.floor(vw*0.5),sh:Math.floor(vh*0.4),src:'fixed'};
      var sx=_roi.sx, sy=_roi.sy, sw=_roi.sw, sh=_roi.sh;
      _c24._roiSrc=_roi.src;
      if(_c24._roiSrcPrev!==_roi.src){ _c24._roiSrcPrev=_roi.src; try{ console.log('[C-63 ROI]', _c24.mode, '→', _roi.src, _roi.sw+'x'+_roi.sh); }catch(e){} }
      _c24._roiBox=_roi; /* ★ C-63: 화면에 ROI 박스 표시용 */
      _c24.offCanvas.width=64; _c24.offCanvas.height=48;
      /* ★ C-63: FaceMesh 성공 시 이마·좌볼·우볼 3패치만 나란히 그림 (눈·코·입 제외).
         실패 시 기존 단일 사각형 그대로 → 동작 보장 */
      if(_roi.patches && _roi.patches.length>=2){
        var _ps=_roi.patches, _pw=Math.floor(64/_ps.length);
        for(var _pi=0;_pi<_ps.length;_pi++){
          var _p=_ps[_pi];
          try{ _c24.offCtx.drawImage(v,_p.x,_p.y,_p.w,_p.h,_pi*_pw,0,_pw,48); }catch(e){}
        }
      } else {
        _c24.offCtx.drawImage(v,sx,sy,sw,sh,0,0,64,48);
      }
      var px=_c24.offCtx.getImageData(0,0,64,48).data;
      var rSum=0,gSum=0,bSum=0,cnt=0,skinCnt=0;
      for(var i=0;i<px.length;i+=4){
        var pr=px[i],pg=px[i+1],pb=px[i+2];
        rSum+=pr; gSum+=pg; bSum+=pb; cnt++;
        var mx2=Math.max(pr,pg,pb),mn2=Math.min(pr,pg,pb);
        var sv=mx2>0?(mx2-mn2)/mx2:0;
        if(pr>70&&pg>40&&pb>20&&pr>pg&&pr>pb&&(pr-pg)>10&&sv>0.15&&sv<0.7) skinCnt++;
      }
      var _skinNeed=(_c24.mode==='face'||_c24.mode==='tongue')?0.18:0.15; /* B-1: 얼굴/혀만 강화 */
      /* ★ C-63: 정밀 ROI(3패치)는 거의 순수 피부 → 하한만 의미 있음. 상한 판정 없음 */
      if(cnt&&skinCnt/cnt>=_skinNeed){
        _c24.faceOK = true;
        _c24ChromStep(rSum/cnt,gSum/cnt,bSum/cnt);
        // 실시간 BPM 업데이트 (3초 후)
        if(_c24.sec>3){
          var v2=_c24CalcVitals();
          if(v2){
            _c24.gotVitals=true; /* B-1: 진짜 맥동 신호 획득 */
            _c24.bpm=v2.bpm;
            var lb=document.getElementById('c24-live-bpm');
            if(lb){ lb.style.display='block'; lb.textContent='💓 '+v2.bpm; }
          }
        }
      } else {
        _c24.faceOK = (_c24.mode!=='face' && _c24.mode!=='tongue');
      }
      // ── AR-1: FaceMesh 우선(정밀) + 살색비율 폴백 ──
      var _ratioFit = cnt ? skinCnt/cnt : 0;
      var _band = _c24FitBand(_c24.mode);
      var _skinFit = (_ratioFit>=_band[0] && _ratioFit<=_band[1]);
      try{ if((_c24.mode==='face'||_c24.mode==='tongue'||_c24.mode==='skin'||_c24.mode==='eye')) _c24SendFM(document.getElementById('c24-video')); }catch(e){} /* ★ C-63: skin·eye도 FaceMesh 사용 */
      var _fmActive = !!_c24.fm && (_c24.mode==='face'||_c24.mode==='tongue'||_c24.mode==='skin'); /* ★ C-63: skin도 FaceMesh 판정 */
      var _lmsFresh = !!(_c24._faceLms && (performance.now()-(_c24._faceLmsTime||0) < 700));
      /* ★ C-63 fix: ROI가 이마·볼 3패치로 정밀해지면서 그 안은 거의 100% 피부가 된다.
         옛 상한(face 0.85)은 '고정 사각형에 배경이 섞이던 시절' 기준이라,
         정밀 ROI에서는 항상 상한을 넘어 'near(멀어지세요)'로 오판정 → 타임바 정지.
         FaceMesh가 랜드마크로 얼굴을 확인했다면 상한 판정을 적용하지 않는다.
         (하한은 유지 — 얼굴이 너무 작거나 벗어나면 여전히 'far') */
      var _roiPrecise = (_c24._roiBox && _c24._roiBox.src==='facemesh');
      if(_fmActive){
        // 진짜 얼굴 랜드마크 있어야 통과 (없으면 정지 = 정확)
        var _lo = _ratioFit < _band[0];
        var _hi = (!_roiPrecise) && (_ratioFit > _band[1]);   /* 정밀 ROI면 상한 무시 */
        _c24.fitOK = _lmsFresh && !_lo && !_hi;
        _c24.fitState = !_lmsFresh ? 'far' : (_lo ? 'far' : (_hi ? 'near' : 'ok'));
      } else {
        // 폴백: 살색 비율 (FaceMesh 미로드/실패 시)
        _c24.fitOK = _skinFit;
        _c24.fitState = _ratioFit<_band[0] ? 'far' : (_ratioFit>_band[1] ? 'near' : 'ok');
      }
      if(_c24.fitOK){ if(!_c24._wasFit){ _c24._wasFit=true; _c24Chime(); } }
      else { _c24._wasFit=false; }
      // ★ 얼굴 가이드 원 그리기
      _c24DrawGuide(skinCnt/(cnt||1));
    }
  }
  if(_c24.isRunning) _c24.rafId=requestAnimationFrame(_c24Loop);
}

function _c24SendFM(v){
  try{
    if(!_c24.fm || !v || !v.videoWidth) return;
    if(_c24._fmSending) return;
    _c24._fmFrame=(_c24._fmFrame||0)+1;
    if(_c24._fmFrame%4!==0) return; /* 4프레임마다 (CPU 절약) */
    _c24._fmSending=true;
    var p=_c24.fm.send({image:v});
    if(p&&p.then){ p.then(function(){_c24._fmSending=false;}).catch(function(){_c24._fmSending=false;}); }
    else { _c24._fmSending=false; }
  }catch(e){ _c24._fmSending=false; }
}


/* 마크업의 onclick이 부를 수 있게 전역으로 */
(function(){var n=["_c24CompStart","_c24Stop","_c24Start","_c24CompStartStep","_c24CompNextStep","_c24Finish"];n.forEach(function(k){try{ if(typeof eval(k)==="function") window[k]=eval(k); }catch(e){}});})();
