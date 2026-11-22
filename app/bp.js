/* =====================================================================
   발품투어 매물장 — 시작 화면(손글씨) · PC 바탕화면에 깔기 · 홈페이지 알리기
   Made by 정동철 · 상상을 현실로
   ===================================================================== */
(function () {
  "use strict";
  // 발 모양은 핸드폰 바탕화면 아이콘과 같은 그림 하나로 (v1.3)
  var FOOT = '<img src="icons/foot.png" alt="" style="width:100%;height:100%;display:block;border-radius:inherit">';
  window.BP_FOOT = FOOT;
  /* ---------- 0. 붓글씨 이름 (발품 TOUR · 발품TOUR 달력 · 직빵 young call) — v1.4 ---------- */
  var LOGO_CSS = '.bpl{display:inline-flex;align-items:center;gap:.14em;line-height:.8;transform:rotate(-3deg);white-space:nowrap;color:#1E2A78;vertical-align:middle;font-weight:400}' +
    '.bpl .bpi{height:.95em;width:.95em;border-radius:.22em;box-shadow:0 .06em .18em rgba(90,61,0,.28);transform:rotate(-9deg);flex:none;display:block}' +
    '.bpl .k,.bpl .k2{font-family:"Nanum Brush Script","Noto Sans KR",sans-serif;-webkit-text-stroke:.028em currentColor;letter-spacing:-.02em}' +
    '.bpl .k2{color:#E0420C;margin-left:.1em}' +
    '.bpl .e{font-family:"Permanent Marker","Comic Sans MS",cursive;font-size:.42em;align-self:flex-end;margin-bottom:.16em;color:#E0420C;transform:rotate(-4deg);display:inline-block;letter-spacing:.02em}' +
    '.bpl .e:after{content:"";display:block;height:.12em;border-radius:99px;background:currentColor;margin-top:.04em;transform:rotate(-2deg)}' +
    '.bpl.yc .ycs{display:inline-flex;flex-direction:column;align-items:center}.bpl.yc .bpi{height:1.6em;width:1.6em;border-radius:.36em}' +
    '.bpl.yc .e{align-self:center;margin:-.04em 0 0;font-size:.44em}.bpl.yc .e:after{display:none}' +
    '.bpy{background:linear-gradient(150deg,#FFE27A,#FFC53D)!important;color:#1E2A78!important}.top.bpy h2{color:#1E2A78!important}.top.bpy .back{background:rgba(30,42,120,.12)!important;color:#1E2A78!important}' +
    '.bpfam{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-top:8px}.bpfam .ap{border-radius:14px;padding:12px 8px;display:grid;justify-items:center;text-align:center;gap:6px}' +
    '.bpfam small{font-size:11.5px;font-weight:700;color:#5A3D00;line-height:1.35}.bpfam .who{font-size:10.5px;font-weight:800;background:rgba(255,255,255,.7);border-radius:999px;padding:1px 8px;color:#1E2A78}';
  (function () { var st = document.createElement("style"); st.id = "bpLogoCss"; st.textContent = LOGO_CSS; (document.head || document.documentElement).appendChild(st); })();
  window.BP_LOGO = function (kind, px) {
    var img = '<img class="bpi" src="icons/foot.png" alt="">', fs = ' style="font-size:' + (px || 40) + 'px"';
    if (kind === "yc") return '<span class="bpl yc"' + fs + ' aria-label="직빵 young call">' + img + '<span class="ycs"><span class="k">직빵</span><span class="e">young call</span></span></span>';
    return '<span class="bpl"' + fs + ' aria-label="' + (kind === "cal" ? "발품TOUR 달력" : "발품 TOUR") + '">' + img + '<span class="k">발품</span><span class="e">TOUR</span>' + (kind === "cal" ? '<span class="k2">달력</span>' : '') + '</span>';
  };
  // 상상을 현실로 · 개발자의 다른 앱
  window.bpFamily = function () {
    return '<div class="card"><div class="sect" style="margin-top:0;display:flex;align-items:baseline;gap:8px;flex-wrap:wrap"><span style="font-family:\'Nanum Brush Script\',sans-serif;font-size:30px;color:#1E2A78;font-weight:400">상상을 현실로</span><span class="hint" style="margin:0">Made by 정동철 · 개발자의 다른 앱</span></div>' +
      '<div class="bpfam"><div class="ap bpy">' + BP_LOGO("tour", 32) + '<small>공인중개사 매물장 · 답사 · 손님 방</small><span class="who">공인중개사용</span></div>' +
      '<div class="ap bpy">' + BP_LOGO("cal", 28) + '<small>음력 · 손 없는 날 · 물때 · 약속 다이어리 · 가계부</small><span class="who">누구나</span></div>' +
      '<div class="ap bpy">' + BP_LOGO("yc", 30) + '<small>동네 친구 샘이랑 영어로 수다</small><span class="who">누구나</span></div></div></div>';
  };

  /* ---------- 0-1. 자판이 올라오면 입력칸이 가려지지 않게 (v1.4) ---------- */
  function setKb(h) { h = Math.max(0, Math.round(h || 0)); document.documentElement.style.setProperty("--kb", h + "px"); document.body && document.body.classList.toggle("kb-open", h > 60);
    if (h > 60) setTimeout(function () { var a = document.activeElement; if (a && /^(INPUT|TEXTAREA)$/.test(a.tagName) && a.scrollIntoView) a.scrollIntoView({ block: "center", behavior: "smooth" }); var L = document.getElementById("ccL") || document.getElementById("rmL") || document.getElementById("ycL"); if (L && a && /T(EXTAREA)?$/.test(a.tagName) && a.closest && a.closest(".rm-in,.yc-in")) window.scrollTo(0, document.body.scrollHeight); }, 60); }
  (function () {
    var K = window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.Keyboard;
    var BASE = window.innerHeight;
    window.addEventListener("orientationchange", function () { setTimeout(function () { if (!document.body.classList.contains("kb-open")) BASE = window.innerHeight; }, 400); });
    // 화면이 스스로 줄어들었으면 그만큼 빼고, 안 줄어들었으면 자판 높이만큼 올림 (두 번 올라가지 않게)
    var cover = function (i) { return Math.max(0, ((i && i.keyboardHeight) || 0) - Math.max(0, BASE - window.innerHeight)); };
    if (K && K.addListener) {
      K.addListener("keyboardDidShow", function (i) { setTimeout(function () { setKb(cover(i)); }, 30); });
      K.addListener("keyboardWillHide", function () { setKb(0); });
    } else if (window.visualViewport) {
      var vv = window.visualViewport, base = window.innerHeight;
      vv.addEventListener("resize", function () { setKb(Math.max(0, window.innerHeight - vv.height - vv.offsetTop)); });
    }
    document.addEventListener("focusin", function (ev) { var t = ev.target; if (t && /^(INPUT|TEXTAREA)$/.test(t.tagName)) setTimeout(function () { try { t.scrollIntoView({ block: "center", behavior: "smooth" }); } catch (er) {} }, 350); });
  })();

  /* ---------- 0-2. 초대 코드 저절로 붙여 넣기 (홈페이지 초대 페이지에서 복사해 둔 것) ---------- */
  window.bpClipJoin = function () {
    var C = window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.Clipboard;
    var rd = C && C.read ? C.read().then(function (r) { return (r && r.value) || ""; }) : Promise.resolve("");   // 웹에서는 붙여넣기 허락 창이 떠서 안 씀
    return Promise.resolve(rd).catch(function () { return ""; }).then(function (t) {
      var m = /발품초대\s*[:：]?\s*([A-Z0-9]{6})(?:\s*[\/|]\s*(qr|sms|kakao|gift))?/i.exec(String(t || ""));
      return m ? { code: m[1].toUpperCase(), via: (m[2] || "").toLowerCase() } : null;
    });
  };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---------- 1. 시작 화면: 손글씨 세 줄이 써졌다가 바람에 날리듯 ---------- */
  var LINES = ["한 번 온 손님이 다른 부동산으로 안 갑니다.", "집주인과 가격 싸움을 안 해도 됩니다.", "동네 부동산끼리 싸우지 않고 같이 법니다."];
  function splash() {
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var css = '<style>#bpSp{position:fixed;inset:0;z-index:99999;background:linear-gradient(160deg,#FFE27A,#FFC53D);display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:calc(env(safe-area-inset-top,0px) + 14vh) 26px calc(env(safe-area-inset-bottom,0px) + 40px);font-family:"Noto Sans KR",sans-serif;transition:opacity .45s;cursor:pointer}' +
      '#bpSp .ft{width:88px;height:88px;animation:spIn .6s ease-out both}#bpSp .ft{border-radius:26px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,.12)}#bpSp .ft img{width:100%;height:100%}' +
      '#bpSp .nm{font-size:30px;font-weight:800;color:#1E2A78;margin-top:10px;text-align:center;animation:spIn .6s .1s ease-out both}#bpSp .nm span{font-family:"Nanum Pen Script",cursive;font-weight:400;color:#F97316;font-size:38px}' +
      '#bpSp .ln{display:flex;flex-direction:column;gap:12px;width:100%;max-width:420px}' +
      '#bpSp .l{font-family:"Nanum Brush Script","Nanum Pen Script",cursive;font-size:clamp(24px,7vw,34px);line-height:1.15;color:#1E2A78;word-break:keep-all;clip-path:inset(0 100% 0 0);animation:spWrite .75s steps(22) forwards,spBlow .8s ease-in forwards}' +
      '#bpSp .l:nth-child(1){animation-delay:.35s,2.75s;transform:rotate(-1.2deg)}#bpSp .l:nth-child(2){animation-delay:1.05s,2.9s;padding-left:14px;transform:rotate(.8deg)}#bpSp .l:nth-child(3){animation-delay:1.75s,3.05s;color:#C2410C;transform:rotate(-.6deg)}' +
      '#bpSp .by{font-size:12px;color:#64748B;text-align:center;line-height:1.6}#bpSp .sk{font-size:11px;color:#94A3B8}' +
      '#bpSp .nm2{margin-top:14px;font:800 14px "Noto Sans KR",sans-serif;color:#5A3D00;background:rgba(255,255,255,.6);border-radius:999px;padding:3px 14px}#bpSp .by{color:#5A3D00!important}#bpSp .sk{color:#7A4B00!important}' +
      '@keyframes spIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}' +
      '@keyframes spWrite{to{clip-path:inset(0 0 0 0)}}' +
      '@keyframes spBlow{from{opacity:1;filter:blur(0);clip-path:inset(0 0 0 0)}to{opacity:0;transform:translate(140px,-26px) rotate(8deg) skewX(-14deg);filter:blur(3px);clip-path:inset(0 0 0 0)}}' +
      '@media (prefers-reduced-motion:reduce){#bpSp .l{animation:none;clip-path:none}}</style>';
    var d = document.createElement("div");
    d.id = "bpSp"; d.setAttribute("role", "dialog"); d.setAttribute("aria-label", "발품투어 시작");
    d.innerHTML = css + '<div style="display:flex;flex-direction:column;align-items:center;animation:spIn .6s ease-out both">' + window.BP_LOGO("tour", 76) + '<div class="nm2">매물장</div></div>' +
      '<div class="ln">' + LINES.map(function (t) { return '<div class="l">' + esc(t) + '</div>'; }).join("") + '</div>' +
      '<div class="by">Made by 정동철 · 상상을 현실로<br><span class="sk">누르면 바로 시작</span></div>';
    document.body.appendChild(d);
    var gone = false;
    function close() { if (gone) return; gone = true; d.style.opacity = "0"; setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 460); }
    d.addEventListener("click", close);
    setTimeout(close, reduce ? 1800 : 3900);
  }
  var shown = false;
  try { shown = sessionStorage.getItem("bp_splash") === "1"; sessionStorage.setItem("bp_splash", "1"); } catch (e) {}
  if (!shown) { if (document.body) splash(); else document.addEventListener("DOMContentLoaded", splash); }

  /* ---------- 2. PC: 바탕화면에 깔기 (크롬·엣지가 허락할 때 단추가 나타남) ---------- */
  var deferred = null;
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferred = e; showInstall(); });
  window.addEventListener("appinstalled", function () { deferred = null; var b = document.getElementById("bpInst"); if (b) b.remove(); if (window.toast) toast("바탕화면에 발품 아이콘이 생겼어요."); });
  function showInstall() {
    if (window.Capacitor || document.getElementById("bpInst")) return;
    var b = document.createElement("button");
    b.id = "bpInst"; b.type = "button";
    b.style.cssText = "position:fixed;right:calc(14px + env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:900;background:#F97316;color:#fff;border:0;border-radius:999px;padding:12px 18px;font:800 14px 'Noto Sans KR',sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.25);cursor:pointer";
    b.textContent = "💻 바탕화면에 깔기";
    b.onclick = function () {
      if (!deferred) { if (window.toast) toast("주소창 오른쪽의 설치 아이콘(⊞)을 눌러 주세요."); return; }
      deferred.prompt();
      deferred.userChoice.then(function () { deferred = null; b.remove(); });
    };
    document.body.appendChild(b);
  }

  /* ---------- 3. 홈페이지 주소 알리기 (복사 · 카톡·문자 · QR) ---------- */
  function homeUrl() { return (window.BALPUM && BALPUM.config && BALPUM.config.HOMEPAGE) || ""; }
  window.bpHomeCard = function () {
    var u = homeUrl(); if (!u) return "";
    return '<div class="card"><div class="sect" style="margin-top:0">🏠 발품 홈페이지</div>' +
      '<div class="hint" style="margin-top:0">다른 사람 핸드폰에 발품을 깔아 줄 때, PC에 깔 때 이 주소로 들어가요.</div>' +
      '<div style="font-weight:700;word-break:break-all;user-select:all;margin:6px 0 8px">' + esc(u) + '</div>' +
      '<div class="two"><button class="btn ghost" id="hpCopy" type="button" style="margin:0">📋 복사</button><button class="btn ghost" id="hpSend" type="button" style="margin:0">💬 카톡·문자로</button></div>' +
      '<button class="btn ghost" id="hpQr" type="button">🔳 QR 보기 (상대 핸드폰 카메라로 찍기)</button><div id="hpQrBox" style="display:flex;justify-content:center"></div></div>';
  };
  window.bpHomeBind = function () {
    var u = homeUrl(), el = function (id) { return document.getElementById(id); };
    if (!el("hpCopy")) return;
    var msg = "발품투어 매물장 — 공인중개사 매물장 앱\n받기·PC 쓰는 법: " + u;
    el("hpCopy").onclick = function () {
      var done = function () { if (window.toast) toast("주소를 복사했어요."); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(u).then(done, function () { fallback(); });
      else fallback();
      function fallback() { var t = document.createElement("textarea"); t.value = u; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); done(); } catch (e) { if (window.toast) toast("길게 눌러 복사해 주세요."); } t.remove(); }
    };
    el("hpSend").onclick = function () {
      if (navigator.share) { navigator.share({ title: "발품투어 매물장", text: msg, url: u }).catch(function () {}); return; }
      location.href = "sms:?body=" + encodeURIComponent(msg);
    };
    el("hpQr").onclick = function () {
      var box = el("hpQrBox"); if (box.firstChild) { box.innerHTML = ""; return; }
      var draw = function () { box.innerHTML = '<div id="hpQrIn" style="background:#fff;padding:12px;border-radius:12px;margin-top:10px"></div>'; new window.QRCode(document.getElementById("hpQrIn"), { text: u, width: 200, height: 200 }); };
      if (window.QRCode) { draw(); return; }
      var s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
      s.onload = draw; s.onerror = function () { if (window.toast) toast("QR을 만들려면 인터넷이 필요해요."); };
      document.head.appendChild(s);
    };
  };
})();
