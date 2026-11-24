/* =====================================================================
   발품투어 매물장 — 손님 방 (v1.3)
   사장님: 손님 초대(링크·문자·QR) · 손님 방 목록 · 상담 · 매물 보내기 · 최저가 답장
   손님:   초대 코드로 시작 · 내 부동산 · 상담 · 집 구해요 · 집 내놓기(최저가 요청 · 일반/몰래) · 내 집 · 달력
   Made by 정동철 · 상상을 현실로
   ===================================================================== */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  function e(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function say(t) { if (window.toast) window.toast(t); }
  function msgOf(er) { return (er && er.message) || String(er || "오류"); }
  function go(view, id) { if (typeof nav === "function") nav(view, id); window.scrollTo(0, 0); }
  function app(html) { $("app").innerHTML = CSS + html; }
  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }
  function homeUrl() { var h = (BALPUM.config && BALPUM.config.HOMEPAGE) || ""; return h && !/\/$/.test(h) ? h + "/" : h; }
  function fmtPhone(p) { var d = String(p || "").replace(/\D/g, ""); return d.length === 11 ? d.slice(0, 3) + "-" + d.slice(3, 7) + "-" + d.slice(7) : d.length === 10 ? d.slice(0, 3) + "-" + d.slice(3, 6) + "-" + d.slice(6) : (p || ""); }
  function when(t) { var d = new Date(t), n = new Date(); var hm = (d.getHours() < 12 ? "오전 " : "오후 ") + ((d.getHours() % 12) || 12) + ":" + ("0" + d.getMinutes()).slice(-2);
    return d.toDateString() === n.toDateString() ? hm : (d.getMonth() + 1) + "/" + d.getDate() + " " + hm; }
  function shrink(file, side) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () { var k = Math.min(1, side / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement("canvas");
        c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url); res(c.toDataURL("image/jpeg", 0.78)); };
      img.onerror = function () { URL.revokeObjectURL(url); rej(new Error("사진을 열 수 없어요")); };
      img.src = url;
    });
  }
  var FOOT = '<img src="icons/foot.png" alt="" style="width:100%;height:100%;display:block;border-radius:inherit">';

  var CSS = '<style>' +
    '.rm-top{display:flex;align-items:center;gap:10px;margin:0 0 12px}.rm-top h2{margin:0;font-size:19px;flex:1}' +
    '.rm-office{background:#1E2A78;color:#fff;border-radius:18px;padding:16px;display:grid;gap:8px;margin-bottom:12px}' +
    '.rm-office small{font-size:12px;opacity:.8}.rm-office b{font-size:21px}.rm-office .ad{font-size:13px;opacity:.88}' +
    '.rm-two{display:grid;grid-template-columns:1fr 1fr;gap:8px}.rm-two>*{margin:0!important}' +
    '.rm-wb{background:#fff;color:#1E2A78;border:0;border-radius:12px;height:46px;font:800 14.5px "Noto Sans KR",sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;text-decoration:none}' +
    '.rm-wb.dk{background:rgba(255,255,255,.15);color:#fff}' +
    '.rm-alert{background:#FFF7ED;border-radius:14px;padding:12px 14px;display:flex;gap:10px;align-items:center;margin-bottom:12px;cursor:pointer}.rm-alert b{display:block}.rm-alert small{color:#64748B}' +
    '.rm-tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:12px}' +
    '.rm-tile{background:#fff;border:1px solid #E2E8F0;border-radius:14px;padding:12px 4px 10px;display:flex;flex-direction:column;align-items:center;gap:6px;font:600 13px "Noto Sans KR",sans-serif;color:#0F172A;cursor:pointer}' +
    '.rm-tile i{font-style:normal;font-size:24px;line-height:1}' +
    '.rm-sect{font-weight:800;font-size:15px;margin:14px 2px 8px;display:flex;justify-content:space-between;align-items:baseline}' +
    '.rm-ls{display:grid;grid-template-columns:1fr 1fr;gap:8px}.rm-lc{background:#fff;border:1px solid #E2E8F0;border-radius:14px;padding:10px 12px;display:grid;gap:2px;cursor:pointer}' +
    '.rm-lc small{color:#64748B;font-size:12px}.rm-lc b{font-size:17px}.rm-lc em{font-style:normal;color:#15803D;font-size:12px}' +
    '.rm-nav{position:fixed;left:50%;transform:translateX(-50%);bottom:0;width:100%;max-width:640px;background:#fff;border-top:1px solid #E2E8F0;display:grid;grid-template-columns:repeat(4,1fr);padding-bottom:env(safe-area-inset-bottom,0px);z-index:20;box-shadow:0 -2px 10px rgba(15,23,42,.06)}.rm-pad{height:calc(72px + env(safe-area-inset-bottom,0px))}' +
    '.rm-in.cn{bottom:calc(60px + env(safe-area-inset-bottom,0px))}' +
    'body.kb-open{padding-bottom:var(--kb,0px)}body.kb-open .rm-nav{display:none}body.kb-open .rm-in,body.kb-open .rm-in.cn{bottom:var(--kb,0px)}' +
    '.rm-nav button{border:0;background:transparent;padding:9px 0 8px;font:600 12px "Noto Sans KR",sans-serif;color:#64748B;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;position:relative}' +
    '.rm-nav button i{font-style:normal;font-size:20px}.rm-nav button.on{color:#1E2A78;font-weight:800}' +
    '.rm-dot{position:absolute;top:5px;left:calc(50% + 6px);min-width:16px;height:16px;border-radius:8px;background:#DC2626;color:#fff;font-size:10px;line-height:16px;padding:0 4px}' +
    '.rm-chat{display:flex;flex-direction:column;gap:8px;padding:4px 0 8px}' +
    '.rm-b{max-width:82%;border-radius:16px;padding:9px 12px;font-size:14.5px;line-height:1.5;word-break:break-word;background:#fff;align-self:flex-start;box-shadow:0 1px 2px rgba(0,0,0,.06)}' +
    '.rm-b.me{align-self:flex-end;background:#1E2A78;color:#fff}.rm-b small.t{display:block;font-size:11px;opacity:.6;margin-top:3px}' +
    '.rm-b.card{background:#fff;color:#0F172A;border:1px solid #E2E8F0;width:82%}.rm-b.me.card{background:#EEF2FF;color:#0F172A}' +
    '.rm-b.sell{background:#fff;color:#0F172A;border:1.5px solid #CBD5E1}.rm-b.sell.me{background:#EEF2FF}' +
    '.rm-b.sos{background:#C2410C!important;color:#fff!important;border:0!important;animation:rmSos 1.1s ease-in-out infinite;width:86%}.rm-b.sos .k{color:#FFEDD5!important;font-size:12px}.rm-b.sos .sosw{font-family:"Nanum Brush Script",sans-serif;font-size:34px;line-height:1;-webkit-text-stroke:.6px #fff;display:block;margin-bottom:2px}' +
    '@keyframes rmSos{0%,100%{box-shadow:0 0 0 0 rgba(234,88,12,.7)}50%{box-shadow:0 0 0 8px rgba(234,88,12,0)}}' +
    '.rm-sos{background:#C2410C;color:#fff;border-radius:6px;padding:0 6px;font-family:"Nanum Brush Script",sans-serif;font-size:17px;animation:rmBl 1s steps(2,start) infinite}@keyframes rmBl{50%{opacity:.35}}' +
    '.rm-row.new{border:2px solid #DC2626;background:#FEF2F2}' +
    '.rm-nb{font-family:"Nanum Brush Script",sans-serif;font-size:20px;background:#DC2626;color:#fff;border-radius:10px;padding:0 9px;line-height:1.25;-webkit-text-stroke:.3px #fff;white-space:nowrap}' +
    '.rm-trust{display:inline-block;margin-top:4px;background:#FEF3C7;color:#92400E;border:1px solid #F59E0B;border-radius:999px;padding:2px 10px;font-size:12.5px;font-weight:800}.rm-b img{width:100%;border-radius:10px;margin-top:6px;display:block}' +
    '.rm-b .k{font-size:12px;font-weight:800;color:#9A3412;display:block;margin-bottom:2px}.rm-b .big{font-size:20px;font-weight:800}' +
    '.rm-in{position:sticky;bottom:0;background:#F1F5F9;padding:8px 0;display:flex;gap:8px;align-items:flex-end;z-index:10}' +
    '.rm-in textarea{flex:1;min-width:0;border:1px solid #CBD5E1;border-radius:18px;padding:9px 13px;font:16px "Noto Sans KR",sans-serif;resize:none;max-height:120px}' +
    '.rm-send{width:46px;height:46px;border-radius:23px;border:0;background:#1E2A78;color:#fff;font-size:18px;cursor:pointer;flex:none}' +
    '.rm-q{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.rm-q button{border:1px solid #CBD5E1;background:#fff;border-radius:999px;padding:6px 11px;font:500 13px "Noto Sans KR",sans-serif;cursor:pointer}' +
    '.rm-pick{display:flex;flex-wrap:wrap;gap:6px}.rm-pick button{border:1px solid #CBD5E1;background:#fff;border-radius:999px;padding:8px 12px;font:600 14px "Noto Sans KR",sans-serif;cursor:pointer}' +
    '.rm-pick button.on{background:#1E2A78;color:#fff;border-color:#1E2A78}' +
    '.rm-choice{display:grid;grid-template-columns:1fr 1fr;gap:8px}.rm-ch{border:1.5px solid #E2E8F0;background:#fff;border-radius:16px;padding:12px;text-align:left;font:14px "Noto Sans KR",sans-serif;line-height:1.5;cursor:pointer;color:#0F172A}' +
    '.rm-ch b{display:block;font-size:15.5px;margin-bottom:2px}.rm-ch small{color:#64748B;display:block}.rm-ch.sec{background:#FFF7ED;border-color:#EA580C}.rm-ch.sec b{color:#9A3412}.rm-ch.on{outline:3px solid #1E2A78;outline-offset:1px}' +
    '.rm-guide{font-size:13.5px;line-height:1.6;color:#334155}.rm-guide b{color:#0F172A}' +
    '.rm-row{display:flex;gap:10px;align-items:center;padding:11px 12px;background:#fff;border:1px solid #E2E8F0;border-radius:14px;margin-bottom:8px;cursor:pointer}' +
    '.rm-row .av{width:42px;height:42px;border-radius:21px;background:#EEF2FF;color:#1E2A78;font-weight:800;display:grid;place-items:center;flex:none}' +
    '.rm-row .tx{flex:1;min-width:0}.rm-row .tx b{display:block}.rm-row .tx small{color:#64748B;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.rm-badge{background:#DC2626;color:#fff;border-radius:999px;font-size:12px;font-weight:800;padding:2px 8px}' +
    '.rm-link{font-weight:700;word-break:break-all;user-select:all;background:#F8FAFC;border:1px dashed #94A3B8;border-radius:10px;padding:10px;margin:8px 0}' +
    '.rm-code{font-size:30px;font-weight:800;letter-spacing:.25em;text-align:center;color:#1E2A78;margin:4px 0}' +
    '.rm-d{font-size:30px;font-weight:800;color:#B45309}.rm-bar{height:8px;border-radius:4px;background:#E2E8F0;overflow:hidden}.rm-bar i{display:block;height:100%;background:#F97316}' +
    '.rm-chk{display:flex;gap:10px;align-items:center;padding:7px 0;font-size:14.5px}.rm-chk input{width:20px;height:20px}.rm-chk.done span{text-decoration:line-through;color:#94A3B8}' +
    '.rm-hd{display:flex;flex-direction:column;align-items:center;gap:6px;margin:-14px -14px 12px;padding:16px 14px 12px;border-radius:0 0 20px 20px}.rm-hd .nm{font:700 13px "Noto Sans KR",sans-serif;color:#5A3D00}' +
    '.rm-corners{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}.rm-corner{border:0;border-radius:16px;padding:14px 8px 10px;display:grid;justify-items:center;gap:6px;position:relative;cursor:pointer;box-shadow:0 5px 14px rgba(255,180,0,.32);overflow:hidden}' +
    '.rm-corner small{font:700 11.5px "Noto Sans KR",sans-serif;color:#5A3D00}.rm-corner .gf{position:absolute;right:8px;top:6px;font-size:15px}' +
    '.rm-maker{margin-top:14px;border-top:1px dashed #D5D9E6;padding-top:10px;text-align:center;font-size:12px;color:#64748B;line-height:1.6}.rm-maker b{color:#1E2A78}' +
    '.rm-head{display:flex;flex-direction:column;align-items:center;gap:6px;margin:6px 0 14px}.rm-foot{width:64px;height:64px;border-radius:20px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.15)}' +
    '</style>';

  /* =================================================================
     손님: 처음 들어오기
     ================================================================= */
  var PURPOSES = ["집 구해요", "집 내놓아요", "상가·사무실", "수리·이사", "그냥 둘러볼게요"];
  function head(title, sub) { return '<div class="rm-head"><div class="rm-foot">' + FOOT + '</div><div style="font-size:22px;font-weight:800">' + title + '</div>' + (sub ? '<div class="hint" style="margin:0;text-align:center">' + sub + '</div>' : '') + '</div>'; }
  window.showCustEntry = function () {
    app(head('발품 <span style="font-family:\'Nanum Pen Script\',cursive;color:#F97316;font-weight:400;font-size:28px">손님</span>', "부동산 사장님이 보내 준 초대로 시작해요") +
      '<div class="card"><button class="btn" id="ceNew">초대 코드로 처음 시작하기</button><button class="btn ghost" id="ceOld">전에 들어왔어요 — 다시 들어오기</button>' +
      '<button class="btn ghost" id="ceBack">← 공인중개사 로그인으로</button></div>');
    $("ceNew").onclick = function () { showCustJoin(""); };
    $("ceOld").onclick = function () { showCustLogin(); };
    $("ceBack").onclick = function () { showLogin("", "in"); };
  };
  window.showCustJoin = function (code, via) {
    var P = { purpose: "" };
    app(head("반가워요!", "이름과 핸드폰 번호만 적으면 바로 시작해요") +
      '<div class="card"><div id="cjOffice" class="note" style="display:none"></div>' +
      '<label for="cjC">초대 코드 (6자리)</label><input id="cjC" value="' + e(code || "") + '" maxlength="6" autocapitalize="characters" style="text-transform:uppercase;letter-spacing:.2em;font-weight:800">' +
      '<label for="cjN">이름 *</label><input id="cjN" autocomplete="name" placeholder="홍길동">' +
      '<label for="cjP">핸드폰 번호 *</label><input id="cjP" type="tel" inputmode="numeric" autocomplete="tel" placeholder="010-0000-0000">' +
      '<label for="cjK">숫자 비밀번호 6자리 * <span class="hint">(앱을 다시 깔 때 전화번호와 함께 써요)</span></label><input id="cjK" type="password" inputmode="numeric" maxlength="6" autocomplete="new-password" placeholder="●●●●●●">' +
      '<label>무엇 때문에 오셨나요?</label><div class="rm-pick" id="cjU">' + PURPOSES.map(function (p) { return '<button type="button" data-p="' + e(p) + '">' + e(p) + '</button>'; }).join("") + '</div>' +
      '<label class="chk" style="margin-top:12px"><input type="checkbox" id="cjOk"> <span>이름과 전화번호를 초대한 부동산이 <b>상담 연락에만</b> 쓰는 데 동의해요. 다른 곳에 주지 않고, 탈퇴하면 지워요. ' +
      (homeUrl() ? '<a href="' + e(homeUrl()) + 'privacy.html" target="_blank" rel="noopener">개인정보 처리방침</a>' : '') + '</span></label>' +
      '<button class="btn" id="cjGo">시작하기</button><button class="btn ghost" id="cjBk">← 뒤로</button></div>');
    var look = function () { var c = $("cjC").value.trim().toUpperCase(); if (c.length !== 6) { $("cjOffice").style.display = "none"; return; }
      BALPUM.Room.info(c).then(function (r) { var b = $("cjOffice"); if (!b) return; b.style.display = "block";
        b.innerHTML = r ? '🏠 <b>' + e(r.office || "부동산") + '</b>이(가) 초대했어요' + (r.tel ? '<br><span class="hint" style="margin:0">' + e(r.tel) + '</span>' : '') : '초대 코드를 찾을 수 없어요. 다시 확인해 주세요.'; }).catch(function () {}); };
    $("cjC").oninput = look; look();
    each("#cjU button", function (b) { b.onclick = function () { P.purpose = b.getAttribute("data-p"); each("#cjU button", function (x) { x.classList.toggle("on", x === b); }); }; });
    $("cjBk").onclick = function () { showCustEntry(); };
    if (!code && window.bpClipJoin) bpClipJoin().then(function (j) { var c = $("cjC"); if (j && c && !c.value) { c.value = j.code; via = viaName(j.via); look(); say("복사해 둔 초대 코드를 넣었어요"); } }).catch(function () {});
    $("cjGo").onclick = function () {
      var c = $("cjC").value.trim().toUpperCase(), n = $("cjN").value.trim(), ph = $("cjP").value.replace(/\D/g, ""), k = $("cjK").value.trim();
      if (c.length !== 6) { say("초대 코드 6자리를 넣어 주세요."); return; }
      if (!n) { say("이름을 적어 주세요."); return; }
      if (ph.length < 10) { say("핸드폰 번호를 확인해 주세요."); return; }
      if (!/^\d{6}$/.test(k)) { say("숫자 비밀번호는 숫자 6자리로 해 주세요."); return; }
      if (!$("cjOk").checked) { say("동의에 체크해 주세요."); return; }
      var b = this; b.disabled = true; b.textContent = "들어가는 중…";
      BALPUM.Room.join(c, n, fmtPhone(ph), k, P.purpose, via || "링크").then(function () { window.BP_CUST = true; say(n + "님, 반가워요!"); showCustHome(); })
        .catch(function (er) { b.disabled = false; b.textContent = "시작하기"; say(msgOf(er)); });
    };
  };
  window.showCustLogin = function () {
    app(head("다시 들어오기", "처음 들어올 때 적은 전화번호와 숫자 6자리") +
      '<div class="card"><label for="clP">핸드폰 번호</label><input id="clP" type="tel" inputmode="numeric" placeholder="010-0000-0000">' +
      '<label for="clK">숫자 비밀번호 6자리</label><input id="clK" type="password" inputmode="numeric" maxlength="6">' +
      '<button class="btn" id="clGo">들어가기</button><div class="hint">앱을 지웠다 다시 깔았어도 같은 전화번호 + 숫자 6자리면 예전 방으로 그대로 이어져요. 숫자를 잊으셨으면 초대한 부동산 사장님께 <b>"숫자 비밀번호 다시 정해 주세요"</b>라고 부탁하세요 (새로 가입하지 마세요).</div><button class="btn ghost" id="clBk">← 뒤로</button></div>');
    $("clBk").onclick = function () { showCustEntry(); };
    $("clGo").onclick = function () { var b = this; b.disabled = true;
      BALPUM.Room.login($("clP").value, $("clK").value.trim()).then(function () { window.BP_CUST = undefined; startHome(); })
        .catch(function (er) { b.disabled = false; say(msgOf(er)); }); };
  };
  function viaName(v) { return v === "qr" ? "QR" : v === "sms" ? "문자 링크" : v === "kakao" ? "카톡 링크" : v === "gift" ? "영콜 선물" : "링크"; }
  // 앱을 처음 켰을 때: 홈페이지 초대 페이지에서 복사해 둔 코드가 있으면 바로 가입 화면으로
  window.joinFromClip = function () {
    if (!(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform()) || !window.bpClipJoin) return;
    bpClipJoin().then(function (j) { if (j && !BALPUM.Auth.user()) { showCustJoin(j.code, viaName(j.via)); say("초대 코드 " + j.code + "를 넣어 두었어요"); } }).catch(function () {});
  };
  window.joinFromUrl = function () {
    var q = new URLSearchParams(location.search), c = q.get("join");
    if (!c) return false;
    var v = q.get("v"); showCustJoin(c, viaName(v));
    return true;
  };

  /* =================================================================
     손님 화면
     ================================================================= */
  var ME = { ag: null, msgs: [], last: 0, timer: null };
  function cust() { return BALPUM.Auth.user() || {}; }
  function loadMine() {
    return BALPUM.Room.myAgent().then(function (a) { ME.ag = a; if (!a) return []; return BALPUM.Room.msgs(a.agent, cust().id).then(function (m) { ME.msgs = m || []; return ME.msgs; }); });
  }
  function unreadForCust() { if (!ME.ag) return 0; var seen = new Date(ME.ag.cust_seen || 0).getTime(); return ME.msgs.filter(function (m) { return m.from_agent && new Date(m.created_at).getTime() > seen; }).length; }
  function custNav(on) {
    var n = unreadForCust(), b = function (k, ic, t) { return '<button type="button" data-cn="' + k + '" class="' + (on === k ? "on" : "") + '"><i>' + ic + '</i>' + t + (k === "chat" && n ? '<span class="rm-dot">' + n + '</span>' : '') + '</button>'; };
    return '<div class="rm-pad"></div><nav class="rm-nav" aria-label="아래 메뉴">' + b("home", "🏠", "홈") + b("cal", "📅", "달력") + b("my", "🔑", "내 집") + b("chat", "💬", "상담") + '</nav>';
  }
  function bindNav() { each("[data-cn]", function (b) { b.onclick = function () { var k = b.getAttribute("data-cn"); k === "home" ? showCustHome() : k === "cal" ? showCal() : k === "my" ? showCustMy() : showCustChat(); }; }); }
  function stopPoll() { clearInterval(ME.timer); ME.timer = null; }
  function sendMine(kind, body) { if (!ME.ag) return Promise.reject(new Error("연결된 부동산이 없어요")); return BALPUM.Room.send(ME.ag.agent, cust().id, false, kind, body); }

  window.showCustHome = function (fromHist) {
    stopPoll(); if (!fromHist) go("c_home");
    app('<div class="loading">불러오는 중…</div>');
    Promise.all([loadMine(), BALPUM.DB.get("myhome", "main").catch(function () { return null; })]).then(function (r) {
      var a = ME.ag, mh = (r[1] && r[1].data) || {};
      if (window.bpTips) setTimeout(function () { bpTips('cust'); }, 900);
      if (!a) { app(head("연결된 부동산이 없어요", "부동산 사장님께 초대 링크를 받아 주세요") + '<div class="card"><button class="btn" id="chJ">초대 코드 넣기</button><button class="btn ghost" id="chOut">로그아웃</button></div>');
        $("chJ").onclick = function () { showCustJoin(""); }; $("chOut").onclick = custLogout; return; }
      var dd = mh.end ? Math.ceil((new Date(mh.end + "T00:00:00") - new Date(new Date().toDateString())) / 864e5) : null;
      var ls = ME.msgs.filter(function (m) { return m.kind === "listing"; }).slice(-4).reverse();
      var se = secretState(ME.msgs);
      app('<div class="rm-hd bpy">' + (window.BP_LOGO ? BP_LOGO("tour", 40) : "발품") + '<span class="nm">손님 · ' + e(a.name || "") + '님</span></div>' +
        (se && se.over ? '<div class="rm-alert" id="chSe" style="background:#FFEDD5"><span style="font-size:24px">⏰</span><span style="flex:1"><b>몰래 기간이 끝났어요</b><small>일반 의뢰로 바꿀지, 한 번 더 몰래 맡길지 골라 주세요</small></span><b style="color:#C2410C">고르기 ›</b></div>' : '') +
        '<div class="rm-office"><small>내 부동산</small><b>' + e(a.office || "부동산") + '</b>' + (a.badge ? '<span class="rm-trust">🏅 동네 부동산들이 믿고 같이 하는 사무소</span>' : '') + '<div class="ad">' + e([a.addr, a.ceo ? "대표 " + a.ceo : ""].filter(Boolean).join(" · ")) + '</div>' +
        '<div class="rm-two"><button class="rm-wb" id="chC">💬 상담하기</button>' + ((a.tel || a.mobile) ? '<a class="rm-wb dk" href="tel:' + e(String(a.tel || a.mobile).replace(/[^\d+]/g, "")) + '">📞 ' + e(a.tel || a.mobile) + '</a>' : '<span></span>') + '</div></div>' +
        (dd !== null ? '<div class="rm-alert" id="chD"><span style="font-size:24px">📅</span><span style="flex:1"><b>' + e(mh.kind || "계약") + ' 만기 ' + (dd >= 0 ? dd + "일 남았어요" : (-dd) + "일 지났어요") + '</b><small>연장할지 이사할지 미리 상담받으세요</small></span><b style="color:#B45309">D' + (dd >= 0 ? "-" + dd : "+" + (-dd)) + '</b></div>' : '') +
        '<div class="rm-tiles">' + [["want", "🔍", "집 구해요"], ["sell", "🏷", "집 내놓기"], ["low", "📊", "최저가 확인"], ["repair", "🔧", "수리 요청"], ["move", "🚚", "이사 준비"], ["chat", "💬", "상담"]].map(function (t) {
          return '<button type="button" class="rm-tile" data-t="' + t[0] + '"><i>' + t[1] + '</i>' + t[2] + '</button>'; }).join("") + '</div>' +
        '<div class="rm-corners"><button type="button" class="rm-corner bpy" data-t="yc"><span class="gf">🎁</span>' + (window.ycHasNew && ycHasNew() ? '<span style="position:absolute;left:8px;top:6px;background:#DC2626;color:#fff;border-radius:999px;font:800 11px sans-serif;padding:1px 7px">NEW</span>' : '') + (window.BP_LOGO ? BP_LOGO("yc", 30) : "직빵 young call") + '<small>샘이랑 영어 수다</small></button>' +
        '<button type="button" class="rm-corner bpy" data-t="cal"><span class="gf">🎁</span>' + (window.BP_LOGO ? BP_LOGO("cal", 26) : "발품TOUR 달력") + '<small>음력 · 약속 · 가계부</small></button></div>' +
        '<div class="rm-sect"><span>사장님이 골라 준 매물</span>' + (ls.length ? '<a href="#" id="chAll" style="font-size:13px">상담에서 보기</a>' : '') + '</div>' +
        (ls.length ? '<div class="rm-ls">' + ls.map(function (m) { var b = m.body || {}; return '<div class="rm-lc" data-go="chat"><small>' + e([b.dong, b.room, b.deal].filter(Boolean).join(" · ")) + '</small><b>' + e(b.price || "") + '</b><em>' + e(b.memo || b.name || "") + '</em></div>'; }).join("") + '</div>'
          : '<div class="hint">사장님이 매물을 골라 보내면 여기에 나와요. [집 구해요]로 찾는 집을 알려 주세요.</div>') +
        '<div class="rm-maker">이 앱은 <b>상상을 현실로</b>가 만들었어요 · Made by 정동철<br>발품TOUR 달력 · 직빵 young call 은 <b>개발자의 다른 앱</b>이에요</div>' +
        '<div style="text-align:center;margin-top:10px"><button class="btn ghost" id="chOut" style="width:auto;padding:8px 18px">로그아웃</button></div>' +
        custNav("home"));
      bindNav(); if (window.BP_NOTI) BP_NOTI.afterLogin();
      $("chC").onclick = function () { showCustChat(); };
      if ($("chD")) $("chD").onclick = function () { showCustMy(); };
      if ($("chAll")) $("chAll").onclick = function (ev) { ev.preventDefault(); showCustChat(); };
      each(".rm-lc", function (x) { x.onclick = function () { showCustChat(); }; });
      each("[data-t]", function (b) { b.onclick = function () { var t = b.getAttribute("data-t");
        t === "want" ? showCustWant() : t === "sell" || t === "low" ? showCustSell() : t === "cal" ? showCal() : t === "chat" ? showCustChat() : t === "yc" ? (window.showYC ? showYC() : say("곧 열려요")) : showCustMy(t); }; });
      if ($("chSe")) $("chSe").onclick = function () { showCustChat(); };
      $("chOut").onclick = custLogout;
    }).catch(function (er) { app('<div class="card"><div class="err">' + e(msgOf(er)) + '</div><button class="btn" onclick="showCustHome()">다시 해 보기</button></div>'); });
  };
  function custLogout() { if (!confirm("로그아웃할까요? 다시 들어올 때 전화번호와 숫자 6자리가 필요해요.")) return; stopPoll(); BALPUM.Auth.signOut().then(function () { window.BP_CUST = undefined; showLogin("", "in", "로그아웃했어요."); }); }

  /* ---------- 몰래 기간이 끝났는지 (손님이 고를 때까지) ---------- */
  var PMON = { "1개월": 1, "2개월": 2, "3개월": 3 };
  function secretState(msgs) {
    var last = null; (msgs || []).forEach(function (m) { if (!m.from_agent && (m.kind === "sell" || m.kind === "sellend")) last = m; });
    if (!last || last.kind !== "sell" || (last.body || {}).mode !== "secret") return null;
    var mo = PMON[(last.body || {}).period] || 0; if (!mo) return null;
    var end = new Date(last.created_at); end.setMonth(end.getMonth() + mo);
    var now = new Date(); return { m: last, end: end, over: now >= end, days: Math.max(0, Math.floor((now - end) / 864e5)) };
  }
  window.BP_secretState = secretState;
  function ymd(d) { return d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate(); }
  function endCard(st) {
    var b = st.m.body || {};
    return '<div class="rm-b sell" style="width:92%;align-self:center" id="seCard"><span class="k">⏰ 몰래 기간(' + e(b.period) + ')이 끝났어요 · ' + ymd(st.end) + '</span>' +
      '<div style="margin:2px 0 8px">' + e([b.what, b.price].filter(Boolean).join(" · ")) + '<br>어떻게 할지 골라 주세요. 고르신 대로 사장님께 바로 알려 드려요.</div>' +
      '<div class="rm-choice" style="grid-template-columns:1fr 1fr">' +
      '<button type="button" class="rm-ch" data-se="general"><b>📝 일반 의뢰로</b><small>이제 광고해도 돼요 (네이버 줄광고 30일 등)</small></button>' +
      '<button type="button" class="rm-ch sec" data-se="again"><b>🆘 몰래 한 번 더</b><small>1 · 2 · 3개월 다시 맡기기</small></button>' +
      '<button type="button" class="rm-ch" data-se="low"><b>📊 최저가 다시 확인</b><small>그사이 바뀐 최저가 물어보기</small></button>' +
      '<button type="button" class="rm-ch" data-se="hold"><b>⏸ 잠시 보류</b><small>지금은 안 팔래요</small></button></div>' +
      '<div id="seMore"></div></div>';
  }
  function bindEndCard(st, after) {
    var b = st.m.body || {};
    each("[data-se]", function (x) { x.onclick = function () { var k = x.getAttribute("data-se");
      if (k === "general") sendMine("sell", { mode: "general", price: b.price || "", what: b.what || "", memo: "몰래 기간이 끝나 일반 의뢰로 바꿨어요" }).then(function () { say("일반 의뢰로 바꿨어요. 사장님께 알려 드렸어요."); after(); }).catch(function (er) { say(msgOf(er)); });
      else if (k === "hold") sendMine("sellend", { choice: "hold", what: b.what || "" }).then(function () { say("보류했어요. 언제든 다시 내놓을 수 있어요."); after(); }).catch(function (er) { say(msgOf(er)); });
      else if (k === "low") sendMine("lowreq", { what: b.what || "", memo: "몰래 기간이 끝나서 지금 최저가를 다시 알고 싶어요" }).then(function () { say("최저가를 다시 물어봤어요. 답장을 보고 골라 주세요."); after(); }).catch(function (er) { say(msgOf(er)); });
      else { $("seMore").innerHTML = '<div class="rm-pick" style="margin-top:8px">' + ["1개월", "2개월", "3개월"].map(function (p) { return '<button type="button" data-sp="' + p + '">' + p + ' 더</button>'; }).join("") + '</div>';
        each("[data-sp]", function (y) { y.onclick = function () { sendMine("sell", { mode: "secret", price: b.price || "", period: y.getAttribute("data-sp"), what: b.what || "", memo: "몰래 한 번 더 맡겨요" }).then(function () { say("몰래 " + y.getAttribute("data-sp") + " 더 맡겼어요."); after(); }).catch(function (er) { say(msgOf(er)); }); }; }); }
    }; });
  }

  /* ---------- 말풍선 ---------- */
  function bubble(m, mine) {
    var b = m.body || {}, t = '<small class="t">' + when(m.created_at) + '</small>', cls = "rm-b" + (mine ? " me" : "");
    if (m.kind === "listing") return '<div class="' + cls + ' card"><span class="k">🏠 추천 매물</span><div>' + e([b.dong, b.room, b.deal].filter(Boolean).join(" · ")) + '</div><div class="big">' + e(b.price || "") + '</div>' + (b.memo ? '<div>' + e(b.memo) + '</div>' : '') + (b.name ? '<div class="hint" style="margin:2px 0 0">' + e(b.name) + '</div>' : '') + t + '</div>';
    if (m.kind === "want") return '<div class="' + cls + ' card"><span class="k">🔍 집 구해요</span>' + e([b.area, b.type, b.room, b.budget, b.when].filter(Boolean).join(" · ")) + (b.memo ? '<div>' + e(b.memo) + '</div>' : '') + t + '</div>';
    if (m.kind === "lowreq") return '<div class="' + cls + ' card"><span class="k">📊 최저가 정보 요청</span>' + e(b.what || "") + (b.memo ? '<div>' + e(b.memo) + '</div>' : '') + t + '</div>';
    if (m.kind === "lowans") return '<div class="' + cls + ' card"><span class="k">📊 같은 집 지금 최저가 (' + e(b.date || "") + ' · 7일간 유효)</span><div class="big">' + e(b.price || "지금 나온 것 없음") + '</div>' + (b.memo ? '<div>' + e(b.memo) + '</div>' : '') + (b.img ? '<img src="' + e(b.img) + '" alt="광고 캡처">' : '') + t + '</div>';
    if (m.kind === "sell") return '<div class="rm-b sell' + (mine ? " me" : "") + (b.mode === "secret" ? " sos" : "") + '">' + (b.mode === "secret" ? '<span class="sosw">🆘 SOS</span><span class="k">몰래 빨리 팔아 주세요</span>' : '<span class="k">📝 일반 의뢰</span>') + '<div class="big">' + e(b.price || "") + '</div>' + e([b.what, b.mode === "secret" && b.period ? "몰래 " + b.period : "", b.memo].filter(Boolean).join(" · ")) + t + '</div>';
    if (m.kind === "sellend") return '<div class="' + cls + ' card"><span class="k">⏸ 잠시 보류</span>' + e(b.what || "") + ' — 지금은 안 팔래요 (몰래 기간 끝)' + t + '</div>';
    if (m.kind === "repair") return '<div class="' + cls + ' card"><span class="k">🔧 수리 요청</span>' + e(b.text || "") + (b.img ? '<img src="' + e(b.img) + '" alt="수리할 곳">' : '') + t + '</div>';
    return '<div class="' + cls + '">' + e(b.text || "").replace(/\n/g, "<br>") + t + '</div>';
  }

  /* ---------- 손님: 상담 ---------- */
  window.showCustChat = function (fromHist) {
    stopPoll(); if (!fromHist) go("c_chat");
    app('<div class="loading">불러오는 중…</div>');
    loadMine().then(function () {
      if (!ME.ag) { showCustHome(true); return; }
      app('<div class="top"><button class="back" id="ccBk">← 처음</button><h2>' + e(ME.ag.office || "상담") + '</h2></div><div class="rm-chat" id="ccL"></div>' +
        '<div class="rm-q">' + ["보러 갈게요", "대출 상담하고 싶어요", "조건을 바꿀게요", "전화 부탁드려요"].map(function (q) { return '<button type="button" data-q="' + e(q) + '">' + e(q) + '</button>'; }).join("") + '</div>' +
        '<div class="rm-in cn"><textarea id="ccT" rows="1" enterkeyhint="send" placeholder="사장님께 보낼 말"></textarea><button class="rm-send" id="ccS" aria-label="보내기">➤</button></div>' + custNav("chat"));
      bindNav(); $("ccBk").onclick = function () { showCustHome(); };
      var draw = function () { var L = $("ccL"); if (!L) return; var st = secretState(ME.msgs);
        L.innerHTML = (ME.msgs.length ? ME.msgs.map(function (m) { return bubble(m, !m.from_agent); }).join("") : '<div class="hint">사장님께 궁금한 것을 편하게 적어 보세요.</div>') + (st && st.over ? endCard(st) : '');
        if (st && st.over) bindEndCard(st, function () { loadMine().then(draw); });
        window.scrollTo(0, document.body.scrollHeight); };
      var send = function (t) { t = String(t || "").trim(); if (!t) return; sendMine("text", { text: t }).then(function () { $("ccT").value = ""; return loadMine(); }).then(draw).catch(function (er) { say(msgOf(er)); }); };
      draw(); BALPUM.Room.seen(cust().id).catch(function () {});
      $("ccS").onclick = function () { send($("ccT").value); };
      each("[data-q]", function (b) { b.onclick = function () { send(b.getAttribute("data-q")); }; });
      ME.timer = setInterval(function () { if (!$("ccL")) { stopPoll(); return; } var n = ME.msgs.length; loadMine().then(function () { if (ME.msgs.length !== n) { draw(); BALPUM.Room.seen(cust().id).catch(function () {}); } }); }, 15000);
    }).catch(function (er) { say(msgOf(er)); });
  };

  /* ---------- 손님: 집 구해요 ---------- */
  window.showCustWant = function () {
    stopPoll(); go("c_want"); var P = { type: "" };
    app('<div class="top"><button class="back" id="cwBk">← 처음</button><h2>🔍 집 구해요</h2></div><div class="card">' +
      '<label>찾는 것</label><div class="rm-pick" id="cwT">' + ["전세", "월세", "매매", "상가·사무실"].map(function (t) { return '<button type="button" data-v="' + t + '">' + t + '</button>'; }).join("") + '</div>' +
      '<label for="cwA">동네</label><input id="cwA" placeholder="예) 검암역 근처">' +
      '<label for="cwR">방 · 크기</label><input id="cwR" placeholder="예) 방2 이상, 20평대">' +
      '<label for="cwB">예산</label><input id="cwB" placeholder="예) 전세 2억 안쪽 / 보증금 500 월 50">' +
      '<label for="cwW">입주 시기</label><input id="cwW" placeholder="예) 2월 말">' +
      '<label for="cwM">더 알려 줄 것</label><textarea id="cwM" rows="2" placeholder="예) 주차 꼭, 반려견 있어요"></textarea>' +
      '<button class="btn" id="cwGo">사장님께 보내기</button></div>' + custNav(""));
    bindNav(); $("cwBk").onclick = function () { history.back(); };
    each("#cwT button", function (b) { b.onclick = function () { P.type = b.getAttribute("data-v"); each("#cwT button", function (x) { x.classList.toggle("on", x === b); }); }; });
    $("cwGo").onclick = function () { var v = function (id) { return $(id).value.trim(); };
      if (!P.type && !v("cwA")) { say("찾는 것이나 동네를 알려 주세요."); return; }
      sendMine("want", { type: P.type, area: v("cwA"), room: v("cwR"), budget: v("cwB"), when: v("cwW"), memo: v("cwM") }).then(function () { say("보냈어요. 맞는 집을 골라 보내 드릴게요."); showCustChat(); }).catch(function (er) { say(msgOf(er)); }); };
  };

  /* ---------- 손님: 집 내놓기 (최저가 요청 → 일반 / 몰래) ---------- */
  window.showCustSell = function (fromHist) {
    stopPoll(); if (!fromHist) go("c_sell");
    app('<div class="loading">불러오는 중…</div>');
    loadMine().then(function () {
      var ans = ME.msgs.filter(function (m) { return m.kind === "lowans"; }).pop(), req = ME.msgs.filter(function (m) { return m.kind === "lowreq"; }).pop();
      var S = { mode: "" };
      app('<div class="top"><button class="back" id="csBk">← 처음</button><h2>🏷 내 집 내놓기</h2></div>' +
        '<div class="card"><div class="sect" style="margin-top:0">1단계 · 먼저 사실부터</div><div class="rm-guide">가격을 정하기 전에, <b>저와 같은 집이 지금 얼마에 나와 있는지</b> 사장님께 여쭤보세요. 네이버 광고 최저가를 캡처해서 알려 드려요.</div>' +
        '<label for="csW">우리 집 (단지·건물 이름, 동, 평형)</label><input id="csW" value="' + e(req && req.body ? req.body.what : "") + '" placeholder="예) 검암 ○○아파트 101동 84㎡">' +
        '<button class="btn" id="csReq">📊 저와 같은 집, 지금 최저가 정보 주세요</button>' +
        (ans ? bubble(ans, false) : req ? '<div class="hint">요청을 보냈어요. 사장님 답장이 오면 여기와 상담에 나와요.</div>' : '') + '</div>' +
        '<div class="card"><div class="sect" style="margin-top:0">2단계 · 집주인이 직접 고르세요</div><div class="rm-choice">' +
        '<button type="button" class="rm-ch" data-m="normal"><b>📝 일반 의뢰</b><small>원하는 가격으로</small>네이버 30일 광고<br>공유방·홍보장<br>문의 오면 알림<small style="margin-top:4px">최저가보다 비싸면 언제 팔릴지는 약속드리기 어려워요</small></button>' +
        '<button type="button" class="rm-ch sec" data-m="secret"><b>🆘 몰래 빨리 팔아 주세요</b><small>최저가와 같거나 낮게</small>광고 없이 조용히<br>오는 손님마다 1순위<br>최저가 바뀌면 알림<br>2주마다 보고서</button></div>' +
        '<div id="csF" style="display:none"><label for="csP">내놓을 가격</label><input id="csP" placeholder="예) 매매 4억 2천">' +
        '<div id="csPer" style="display:none"><label>몰래 맡길 기간</label><div class="rm-pick" id="csPerB">' + ["1개월", "2개월", "3개월"].map(function (p) { return '<button type="button" data-v="' + p + '">' + p + '</button>'; }).join("") + '</div>' +
        '<div class="hint">기간 중에 다른 부동산에도 내놓으면 몰래는 풀리고 일반 의뢰로 바뀌어요.</div></div>' +
        '<label for="csM">더 알려 줄 것</label><input id="csM" placeholder="예) 이사 날짜 협의 가능">' +
        '<button class="btn" id="csGo">사장님께 맡기기</button></div></div>' +
        '<div class="card"><div class="sect" style="margin-top:0">내 집, 빨리 잘 팔리는 방법</div><div class="rm-guide">비슷한 집이 많으면 결국 <b>가격이 결정</b>해요. 최저가보다 비싸면 오래 걸리고, 싼 집부터 먼저 정리돼요. ' +
        '"그 집은 우리 집보다 못해서 싸요"라는 말을 많이 하지만, 요즘 손님들은 다 비교해 보고 정해요. <b>같은 가격이면 먼저 맡긴 집을 먼저 보여 드려요.</b> 반드시 팔린다는 약속은 아니에요.</div></div>' + custNav(""));
      bindNav(); $("csBk").onclick = function () { history.back(); };
      $("csReq").onclick = function () { var w = $("csW").value.trim(); if (!w) { say("우리 집이 어디인지 적어 주세요."); return; }
        sendMine("lowreq", { what: w }).then(function () { say("요청했어요. 사장님이 캡처해서 알려 드려요."); showCustSell(true); }).catch(function (er) { say(msgOf(er)); }); };
      each("[data-m]", function (b) { b.onclick = function () { S.mode = b.getAttribute("data-m"); each("[data-m]", function (x) { x.classList.toggle("on", x === b); });
        $("csF").style.display = "block"; $("csPer").style.display = S.mode === "secret" ? "block" : "none"; }; });
      each("#csPerB button", function (b) { b.onclick = function () { S.period = b.getAttribute("data-v"); each("#csPerB button", function (x) { x.classList.toggle("on", x === b); }); }; });
      $("csGo").onclick = function () { var p = $("csP").value.trim(); if (!p) { say("가격을 적어 주세요."); return; }
        if (S.mode === "secret" && !S.period) { say("몰래 맡길 기간을 골라 주세요."); return; }
        sendMine("sell", { mode: S.mode, price: p, period: S.period || "", what: $("csW").value.trim(), memo: $("csM").value.trim() }).then(function () { say("맡겼어요. 사장님이 확인하고 연락드려요."); showCustChat(); }).catch(function (er) { say(msgOf(er)); }); };
    }).catch(function (er) { say(msgOf(er)); });
  };

  /* ---------- 손님: 내 집 (만기 · 수리 요청 · 이사 할 일) ---------- */
  var MOVE_TODO = ["이사 날짜 정하기 (손 없는 날 보기)", "이사 업체 견적 비교", "인터넷·TV 이전 신청", "관리비·공과금 정산", "전입신고 · 확정일자"];
  window.showCustMy = function (focus, fromHist) {
    stopPoll(); if (!fromHist) go("c_my");
    BALPUM.DB.get("myhome", "main").then(function (r) {
      var M = (r && r.data) || {}; M.todo = M.todo || MOVE_TODO.map(function (t) { return { t: t, d: false }; });
      var dd = M.end ? Math.ceil((new Date(M.end + "T00:00:00") - new Date(new Date().toDateString())) / 864e5) : null;
      var tot = M.start && M.end ? (new Date(M.end) - new Date(M.start)) / 864e5 : 0, gone = tot ? Math.min(100, Math.max(0, 100 - dd / tot * 100)) : 0;
      var save = function () { return BALPUM.DB.upsert("myhome", "main", M).catch(function (er) { say(msgOf(er)); }); };
      var img = null;
      app('<div class="top"><button class="back" id="cmBk">← 처음</button><h2>🔑 내 집</h2></div>' +
        '<div class="card"><div class="sect" style="margin-top:0;display:flex;justify-content:space-between"><span>지금 사는 집 · ' + e(M.kind || "계약") + '</span>' + (dd !== null ? '<span class="rm-d">D' + (dd >= 0 ? "-" + dd : "+" + (-dd)) + '</span>' : '') + '</div>' +
        (dd !== null ? '<div class="rm-bar"><i style="width:' + gone.toFixed(0) + '%"></i></div><div class="hint">' + e(M.start || "") + ' ~ ' + e(M.end) + (dd <= 90 && dd >= 0 ? ' · 만기 3개월 안이에요. 연장할지 이사할지 상담받으세요.' : '') + '</div>' +
          '<div class="rm-two" style="margin:8px 0"><button class="btn" id="cmEx">연장 상담</button><button class="btn ghost" id="cmMv">이사 상담</button></div>' : '') +
        '<div class="rm-pick" id="cmK" style="margin-top:6px">' + ["전세", "월세", "매매(자가)"].map(function (k) { return '<button type="button" data-v="' + k + '" class="' + (M.kind === k ? "on" : "") + '">' + k + '</button>'; }).join("") + '</div>' +
        '<div class="rm-two" style="margin-top:8px"><div><label for="cmS">계약 시작</label><input id="cmS" type="date" value="' + e(M.start || "") + '"></div><div><label for="cmE">만기</label><input id="cmE" type="date" value="' + e(M.end || "") + '"></div></div>' +
        '<button class="btn ghost" id="cmSave">💾 저장 (만기 3개월 전에 알려 드려요)</button></div>' +
        '<div class="card" id="cmRp"><div class="sect" style="margin-top:0">🔧 수리 요청</div><textarea id="cmRt" rows="2" placeholder="예) 욕실 수전에서 물이 새요"></textarea>' +
        '<div class="rm-two" style="margin-top:8px"><button class="btn ghost" id="cmPh">📷 사진 찍기·고르기</button><button class="btn" id="cmRs">사장님께 보내기</button></div><div id="cmImg"></div>' +
        '<input type="file" id="cmIn" accept="image/*" capture="environment" style="display:none"></div>' +
        '<div class="card" id="cmTd"><div class="sect" style="margin-top:0">🚚 이사 할 일</div>' + M.todo.map(function (x, i) { return '<label class="rm-chk' + (x.d ? " done" : "") + '"><input type="checkbox" data-i="' + i + '"' + (x.d ? " checked" : "") + '><span>' + e(x.t) + '</span></label>'; }).join("") + '</div>' + custNav("my"));
      bindNav(); $("cmBk").onclick = function () { showCustHome(); };
      each("#cmK button", function (b) { b.onclick = function () { M.kind = b.getAttribute("data-v"); each("#cmK button", function (x) { x.classList.toggle("on", x === b); }); }; });
      $("cmSave").onclick = function () { M.start = $("cmS").value; M.end = $("cmE").value; save().then(function () { say("저장했어요."); showCustMy(null, true); }); };
      if ($("cmEx")) $("cmEx").onclick = function () { sendMine("text", { text: "계약 만기(" + M.end + ")가 다가와요. 연장 상담 부탁드려요." }).then(function () { showCustChat(); }); };
      if ($("cmMv")) $("cmMv").onclick = function () { sendMine("text", { text: "만기(" + M.end + ") 뒤에 이사하려고 해요. 이사 상담 부탁드려요." }).then(function () { showCustChat(); }); };
      $("cmPh").onclick = function () { $("cmIn").click(); };
      $("cmIn").onchange = function () { var f = this.files && this.files[0]; if (!f) return; shrink(f, 1000).then(function (d) { img = d; $("cmImg").innerHTML = '<img src="' + d + '" style="width:100%;border-radius:12px;margin-top:8px" alt="">'; }).catch(function (er) { say(msgOf(er)); }); };
      $("cmRs").onclick = function () { var t = $("cmRt").value.trim(); if (!t && !img) { say("고칠 곳을 적거나 사진을 넣어 주세요."); return; }
        sendMine("repair", { text: t, img: img }).then(function () { say("보냈어요. 사장님이 집주인께 전해 드려요."); showCustChat(); }).catch(function (er) { say(msgOf(er)); }); };
      each("#cmTd input", function (c) { c.onchange = function () { M.todo[+c.getAttribute("data-i")].d = c.checked; c.parentNode.classList.toggle("done", c.checked); save(); }; });
      if (focus === "repair") $("cmRp").scrollIntoView({ block: "start" }); else if (focus === "move") $("cmTd").scrollIntoView({ block: "start" });
    }).catch(function (er) { say(msgOf(er)); });
  };

  /* =================================================================
     사장님: 손님 방
     ================================================================= */
  var AG = { links: [], recent: [], timer: null };
  function unreadOf(l) { var seen = new Date(l.agent_seen).getTime(); return AG.recent.filter(function (m) { return m.customer === l.customer && !m.from_agent && new Date(m.created_at).getTime() > seen; }).length; }
  function loadRooms() { return Promise.all([BALPUM.Room.links(), BALPUM.Room.recent()]).then(function (a) { AG.links = a[0] || []; AG.recent = a[1] || []; return AG; }); }
  function endOf(cid) { var st = secretState(AG.recent.filter(function (m) { return m.customer === cid; }).slice().reverse()); return st && st.over; }
  /* ---------- 첫 화면: 새 상담은 눈에 띄게 (빨간 테두리 · 붓글씨 '새 상담 N' · 맨 위 빨간 알림 줄) — v1.5 ---------- */
  var HB = { last: -1, timer: null };
  function todayIso() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function dotOn(id, txt) { var el = $(id); if (!el) return; var t = el.querySelector(".t1") || el; var o = t.querySelector(".bp-dot"); if (o) o.remove(); if (!txt) return;
    var d = document.createElement("span"); d.className = "bp-dot"; d.textContent = txt; t.appendChild(d); }
  window.bpHomeBadges = function (loud) {
    if (!$("hRoom")) { clearInterval(HB.timer); HB.timer = null; return; }
    if (!document.getElementById("bpHbCss")) { var st = document.createElement("style"); st.id = "bpHbCss";
      st.textContent = '#hRoom.newc{border:2.5px solid #DC2626!important;animation:hbP 1.3s ease-in-out infinite;background:#FEF2F2!important}@keyframes hbP{0%,100%{box-shadow:0 0 0 0 rgba(220,38,38,.55)}50%{box-shadow:0 0 0 9px rgba(220,38,38,0)}}' +
        '#hRoom .rm-nb{margin-left:6px;font-size:21px;vertical-align:middle}' +
        '.bp-new{display:flex;gap:10px;align-items:center;background:#DC2626;color:#fff;border-radius:14px;padding:11px 14px;margin:0 0 10px;cursor:pointer;box-shadow:0 6px 16px rgba(220,38,38,.3);font-size:14px;line-height:1.4}' +
        '.bp-new b{font-family:"Nanum Brush Script",sans-serif;font-size:24px;font-weight:400;white-space:nowrap;-webkit-text-stroke:.3px #fff}.bp-new span{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
        '.bp-dot{display:inline-block;margin-left:6px;background:#DC2626;color:#fff;border-radius:999px;font-size:11.5px;font-weight:800;padding:1px 7px;vertical-align:middle}.bp-dot:empty{width:9px;height:9px;padding:0}';
      document.head.appendChild(st); }
    loadRooms().then(function () {
      var tot = 0, first = null, firstM = null;
      AG.links.forEach(function (l) { var n = unreadOf(l); if (!n) return; tot += n;
        var m = AG.recent.filter(function (x) { return x.customer === l.customer && !x.from_agent; })[0];
        if (m && (!firstM || m.id > firstM.id)) { firstM = m; first = l; } });
      var el = $("hRoom"); if (!el) return;
      var t1 = el.querySelector(".t1") || el, ob = t1.querySelector(".rm-nb"); if (ob) ob.remove();
      el.classList.toggle("newc", tot > 0);
      if (tot) { var b = document.createElement("span"); b.className = "rm-nb"; b.textContent = "새 상담 " + tot; t1.appendChild(b); }
      var ban = $("bpNew");
      if (!tot) { if (ban) ban.remove(); }
      else {
        if (!ban) { ban = document.createElement("div"); ban.id = "bpNew"; ban.className = "bp-new"; ban.setAttribute("role", "button"); var u = $("usage"); if (u && u.parentNode) u.parentNode.insertBefore(ban, u); else return; }
        var sos = firstM && firstM.kind === "sell" && (firstM.body || {}).mode === "secret";
        ban.innerHTML = '<b>🔔 새 상담 ' + tot + '건</b><span>' + e(first ? first.name : "") + (firstM ? ": " + (sos ? "🆘 몰래 빨리 팔아 주세요" : preview(firstM)) : "") + '</span><b style="font-size:20px">›</b>';
        ban.onclick = function () { if (first) showRoom(first.customer); else showRooms(); };
      }
      if (HB.last >= 0 && tot > HB.last && window.BP_NOTI) BP_NOTI.drop("💬 새 상담 " + tot + "건", first ? first.name + ": " + (firstM ? preview(firstM) : "") : "", function () { if (first) showRoom(first.customer); });
      HB.last = tot;
    }).catch(function () {});
    // 공유방 새 소식 · 오늘 약속 · 영콜 새 표현
    if (BALPUM.Share && BALPUM.Share.unread) BALPUM.Share.unread().then(function (n) { dotOn("hShare", n ? "새 소식 " + n : ""); });
    BALPUM.DB.get("calday", todayIso()).then(function (r) { var ev = ((r && r.data) || {}).ev || []; var n = ev.filter(function (x) { return !x.d; }).length; dotOn("hCal", n ? "오늘 약속 " + n : ""); }).catch(function () {});
    if (window.ycHasNew) dotOn("hYC", ycHasNew() ? "NEW" : "");
    if (!HB.timer) HB.timer = setInterval(function () { if (!$("hRoom")) { clearInterval(HB.timer); HB.timer = null; return; } if (!document.hidden) bpHomeBadges(); }, 30000);
    if (window.BP_NOTI) BP_NOTI.afterLogin();
  };
  window.roomBadge = function () { bpHomeBadges(); };
  window.showRooms = function (fromHist) {
    stopAg(); if (!fromHist) go("rooms");
    app('<div class="top"><button class="back" id="roBk">← 처음</button><h2>💬 손님 방</h2></div><div class="loading">불러오는 중…</div>');
    $("roBk").onclick = function () { showHome(); };
    loadRooms().then(function () {
      var last = {}; AG.recent.forEach(function (m) { if (!last[m.customer]) last[m.customer] = m; });
      var L = AG.links.slice().sort(function (a, b) { var x = last[a.customer], y = last[b.customer]; return (y ? y.id : 0) - (x ? x.id : 0); });
      app('<div class="top"><button class="back" id="roBk">← 처음</button><h2>💬 손님 방</h2></div>' +
        '<button class="btn" id="roInv">➕ 손님 초대하기 (링크 · 문자 · QR)</button>' +
        '<div class="hint">초대받은 손님이 이름·전화번호를 적고 들어오면 여기와 <b>고객관리</b>에 저절로 생겨요. 들어온 날·경로·초대 메모도 같이 남아요.</div>' +
        (L.length ? L.map(function (l) { var m = last[l.customer], n = unreadOf(l);
          var sos = m && !m.from_agent && m.kind === "sell" && (m.body || {}).mode === "secret";
          return '<div class="rm-row' + (n ? " new" : "") + '" data-c="' + e(l.customer) + '"><span class="av">' + e(String(l.name || "?").slice(0, 1)) + '</span><span class="tx"><b>' + e(l.name) + ' <span class="hint" style="font-weight:400">' + e(l.purpose || "") + '</span></b>' +
            '<small>' + (sos ? '<span class="rm-sos">SOS</span> ' : '') + (endOf(l.customer) ? '<b style="color:#C2410C">⏰ 몰래 기간 끝 · </b>' : '') + e(m ? preview(m) : fmtPhone(l.phone) + " · " + (l.via || "") + " · " + String(l.created_at).slice(0, 10)) + '</small></span>' + (n ? '<span class="rm-nb">새 상담 ' + n + '</span>' : '') + '</div>'; }).join("")
          : '<div class="card"><div class="hint" style="margin:0">아직 연결된 손님이 없어요. 위 [손님 초대하기]로 첫 손님을 초대해 보세요.</div></div>'));
      $("roBk").onclick = function () { showHome(); };
      $("roInv").onclick = function () { showInvite(); };
      each(".rm-row", function (r) { r.onclick = function () { showRoom(r.getAttribute("data-c")); }; });
    }).catch(function (er) { say(msgOf(er)); });
  };
  function preview(m) { var b = m.body || {}, who = m.from_agent ? "나: " : "";
    return who + (m.kind === "listing" ? "🏠 매물 " + (b.price || "") : m.kind === "lowreq" ? "📊 최저가 요청 · " + (b.what || "") : m.kind === "lowans" ? "📊 최저가 답장 " + (b.price || "") : m.kind === "sellend" ? "⏸ 보류 " + (b.what || "") : m.kind === "sell" ? (b.mode === "secret" ? "🆘 몰래 빨리 " : "📝 일반 의뢰 ") + (b.price || "") : m.kind === "repair" ? "🔧 수리 요청 " + (b.text || "") : m.kind === "want" ? "🔍 집 구해요 " + [b.type, b.area].filter(Boolean).join(" ") : (b.text || "")); }
  window.showInvite = function () {
    go("invite");
    app('<div class="top"><button class="back" id="ivBk">← 손님 방</button><h2>➕ 손님 초대</h2></div><div class="card">' +
      '<label for="ivM">어떻게 온 손님인지 <span class="hint">(비워도 돼요 · 고객관리에 남아요)</span></label><textarea id="ivM" rows="2" placeholder="예) 검암역 투룸 전세 문의, 11/22 사무실 방문"></textarea>' +
      '<button class="btn" id="ivGo">🔗 초대 링크 만들기</button></div><div id="ivOut"></div>');
    $("ivBk").onclick = function () { showRooms(); };
    $("ivGo").onclick = function () { var b = this; b.disabled = true;
      BALPUM.Room.invite($("ivM").value.trim()).then(function (code) {
        b.disabled = false; b.textContent = "🔗 다른 손님용 새 링크 만들기";
        var base = homeUrl() + "join.html?c=" + code, office = (typeof OFFICE_INFO !== "undefined" && OFFICE_INFO.name) || "부동산";
        var msg = office + "입니다. 발품 앱으로 편하게 상담하세요 (매물 추천 · 내 집 최저가 · 수리·이사).\n" + base + "&v=sms\n초대 코드: " + code;
        $("ivOut").innerHTML = '<div class="card"><div class="hint" style="margin-top:0">초대 코드</div><div class="rm-code">' + code + '</div><div class="rm-link">' + e(base) + '</div>' +
          '<label for="ivP">손님 핸드폰 번호 <span class="hint">(문자로 보낼 때)</span></label><input id="ivP" type="tel" inputmode="numeric" placeholder="010-0000-0000">' +
          '<button class="btn" id="ivSms">💬 문자로 보내기</button><div class="rm-two"><button class="btn ghost" id="ivCp">📋 복사 (카톡에 붙이기)</button><button class="btn ghost" id="ivQr">🔳 QR 보여 주기</button></div><div id="ivQrB" style="display:flex;justify-content:center"></div>' +
          '<div class="hint">손님이 링크를 열면 "' + e(office) + '이(가) 초대했어요" 화면이 나오고, 이름·전화번호·숫자 6자리를 적으면 연결돼요.</div></div>';
        $("ivSms").onclick = function () { var p = $("ivP").value.replace(/[^\d]/g, ""); location.href = "sms:" + p + "?body=" + encodeURIComponent(msg); };
        $("ivCp").onclick = function () { var t = msg.replace("&v=sms", "&v=kakao"); if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { say("복사했어요. 카톡에 붙여 넣으세요."); }, function () { say("길게 눌러 복사해 주세요."); }); };
        $("ivQr").onclick = function () { var box = $("ivQrB"), u = base + "&v=qr"; if (box.firstChild) { box.innerHTML = ""; return; }
          var draw = function () { box.innerHTML = '<div id="ivQrIn" style="background:#fff;padding:12px;border-radius:12px;margin-top:10px"></div>'; new window.QRCode($("ivQrIn"), { text: u, width: 220, height: 220 }); };
          if (window.QRCode) draw(); else { var s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"; s.onload = draw; s.onerror = function () { say("QR을 만들려면 인터넷이 필요해요."); }; document.head.appendChild(s); } };
      }).catch(function (er) { b.disabled = false; say(msgOf(er)); });
    };
  };
  function stopAg() { clearInterval(AG.timer); AG.timer = null; }
  window.showRoom = function (cid, fromHist) {
    stopAg(); if (!fromHist) go("room", cid);
    var me = (BALPUM.Auth.user() || {}).id, L = null, msgs = [];
    var load = function () { return BALPUM.Room.msgs(me, cid).then(function (m) { msgs = m || []; }); };
    app('<div class="loading">불러오는 중…</div>');
    BALPUM.Room.links().then(function (ls) { L = (ls || []).filter(function (x) { return x.customer === cid; })[0]; if (!L) throw new Error("손님을 찾을 수 없어요"); return load(); }).then(function () {
      app('<div class="top"><button class="back" id="rmBk">← 손님 방</button><h2>' + e(L.name) + '</h2></div>' +
        '<div class="card" style="padding:10px 12px"><div style="font-size:13.5px;line-height:1.6">📞 <a href="tel:' + e(String(L.phone).replace(/\D/g, "")) + '">' + e(fmtPhone(L.phone)) + '</a> · 찾는 것: <b>' + e(L.purpose || "-") + '</b><br>' +
        '<span class="hint" style="margin:0">' + e(String(L.created_at).slice(0, 16).replace("T", " ")) + ' · ' + e(L.via || "") + (L.memo ? ' · ' + e(L.memo) : '') + '</span></div>' +
        (L.cust_id && typeof showCustDetail === "function" ? '<button class="btn ghost" id="rmCu" style="margin:8px 0 0">👥 고객관리에서 보기</button>' : '') +
        '<button class="btn ghost" id="rmPin" style="margin:8px 0 0">🔑 손님 숫자 비밀번호 다시 정하기</button><div id="rmPinX"></div></div>' +
        '<div class="rm-chat" id="rmL"></div>' +
        '<div class="rm-q"><button type="button" id="rmLs">🏠 매물 보내기</button><button type="button" id="rmLow">📊 최저가 답장</button></div><div id="rmX"></div>' +
        '<div class="rm-in"><textarea id="rmT" rows="1" enterkeyhint="send" placeholder="손님께 보낼 말"></textarea><button class="rm-send" id="rmS" aria-label="보내기">➤</button></div>');
      var draw = function () { var el = $("rmL"); if (!el) return; var st = secretState(msgs);
        el.innerHTML = (msgs.length ? msgs.map(function (m) { return bubble(m, m.from_agent); }).join("") : '<div class="hint">손님이 들어왔어요. 인사를 건네 보세요.</div>') +
          (st && st.over ? '<div class="rm-b sell" style="width:92%;align-self:center"><span class="k">⏰ 몰래 기간(' + e((st.m.body || {}).period) + ')이 ' + (st.days ? st.days + "일 전에 " : "오늘 ") + '끝났어요</span>손님 화면에 [일반 의뢰로 · 몰래 한 번 더 · 최저가 다시 확인 · 잠시 보류]가 떠 있어요. 손님이 고르면 여기로 알려 드려요.' + (st.days >= 3 ? '<br><b>며칠째 안 고르셨어요 — 전화로 한 번 여쭤보세요.</b>' : '') + '<br><small class="hint">광고는 손님이 일반 의뢰로 바꾼 뒤에 시작하세요.</small></div>' : '');
        window.scrollTo(0, document.body.scrollHeight); };
      var send = function (kind, body) { return BALPUM.Room.send(me, cid, true, kind, body).then(load).then(draw).catch(function (er) { say(msgOf(er)); }); };
      draw(); BALPUM.Room.seen(cid).catch(function () {});
      $("rmBk").onclick = function () { showRooms(); };
      if ($("rmCu")) $("rmCu").onclick = function () { stopAg(); custLoad().then(function () { showCustDetail(L.cust_id); }).catch(function () { say("고객관리를 열어 이름으로 찾아 주세요."); }); };
      $("rmPin").onclick = function () {
        var box = $("rmPinX"); if (box.innerHTML) { box.innerHTML = ""; return; }
        var gen = String(Math.floor(100000 + Math.random() * 900000));
        box.innerHTML = '<div class="note" style="margin-top:8px">손님이 숫자 6자리를 잊었을 때 써요. 새 숫자를 정해 손님께 알려 주면, 손님은 <b>[전에 들어왔어요 — 다시 들어오기]</b>에서 전화번호 + 새 숫자로 들어와요. 예전 대화는 그대로 이어져요.' +
          '<label for="rmPinN">새 숫자 6자리</label><input id="rmPinN" inputmode="numeric" maxlength="6" value="' + gen + '" style="letter-spacing:.2em;font-weight:800">' +
          '<div class="pbtns"><button class="pbtn" id="rmPinGo">🔑 이 숫자로 바꾸기</button><button class="pbtn" id="rmPinNo">닫기</button></div></div>';
        $("rmPinNo").onclick = function () { box.innerHTML = ""; };
        $("rmPinGo").onclick = function () { var k = $("rmPinN").value.trim(), b = this; if (!/^\d{6}$/.test(k)) { say("숫자 6자리로 적어 주세요."); return; }
          b.disabled = true; b.textContent = "바꾸는 중…";
          BALPUM.Plan.pinReset(cid, k).then(function () {
            var txt = "[발품] " + L.name + "님, 발품 손님 숫자 비밀번호를 " + k + " 로 새로 정했어요. 앱에서 [전에 들어왔어요 — 다시 들어오기] → 전화번호와 " + k + " 를 넣어 주세요.";
            box.innerHTML = '<div class="note" style="margin-top:8px">✅ 새 숫자: <b style="font-size:20px;letter-spacing:.15em">' + e(k) + '</b><br>손님께 알려 주세요.' +
              '<div class="pbtns"><a class="pbtn" href="sms:' + e(String(L.phone).replace(/\D/g, "")) + '?body=' + encodeURIComponent(txt) + '">💬 문자로 알려 주기</a><button class="pbtn" id="rmPinC">📋 복사</button><button class="pbtn" id="rmPinNo2">닫기</button></div></div>';
            $("rmPinC").onclick = function () { (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { say("복사했어요"); }, function () { say(txt); }); };
            $("rmPinNo2").onclick = function () { box.innerHTML = ""; };
            send("text", { text: "🔑 숫자 비밀번호를 새로 정했어요. 문자로 알려 드릴게요." });
          }).catch(function (er) { b.disabled = false; b.textContent = "🔑 이 숫자로 바꾸기"; say(msgOf(er)); });
        };
      };
      $("rmS").onclick = function () { var t = $("rmT").value.trim(); if (!t) return; $("rmT").value = ""; send("text", { text: t }); };
      $("rmLs").onclick = function () {
        $("rmX").innerHTML = '<div class="card"><div class="hint" style="margin-top:0">매물 불러오는 중…</div></div>';
        BALPUM.API.appList().then(function (items) {
          var act = (items || []).filter(function (x) { return !/계약|보류|휴지/.test(String(x.status || "")); }).slice(0, 60);
          $("rmX").innerHTML = '<div class="card"><input id="rmQ" placeholder="찾기 (예: 투룸, 검암동)"><div id="rmLl" style="max-height:260px;overflow:auto;margin-top:8px"></div>' +
            '<label for="rmLm">한마디 (손님에게 보여요)</label><input id="rmLm" placeholder="예) 역 도보 5분, 2월 입주 가능"></div>';
          var list = function () { var q = $("rmQ").value.replace(/\s/g, ""); $("rmLl").innerHTML = act.filter(function (x) { return !q || (x.name + x.location + x.room_structure + x.deal_type).replace(/\s/g, "").indexOf(q) >= 0; }).map(function (x) {
            return '<div class="rm-row" data-l="' + e(x.id) + '" style="margin-bottom:6px"><span class="tx"><b>' + e(x.price || "") + ' <span class="hint" style="font-weight:400">' + e(x.deal_type || "") + '</span></b><small>' + e([x.room_structure, x.name].filter(Boolean).join(" · ")) + '</small></span><span>보내기 ›</span></div>'; }).join("") || '<div class="hint">매물이 없어요.</div>';
            each("#rmLl [data-l]", function (r) { r.onclick = function () { var x = act.filter(function (y) { return String(y.id) === r.getAttribute("data-l"); })[0]; if (!x) return;
              var dong = typeof dongOf === "function" ? dongOf(x) : "";
              var multi = window.L17 && L17.prices(x).length > 1;
              send("listing", { lid: x.id, name: x.name || "", deal: multi ? "" : x.deal_type || "", price: multi ? L17.priceLine(x) : x.price || "", room: x.room_structure || "", dong: dong, memo: $("rmLm").value.trim() }).then(function () { $("rmX").innerHTML = ""; say("매물을 보냈어요."); }); }; }); };
          $("rmQ").oninput = list; list();
        }).catch(function (er) { $("rmX").innerHTML = ""; say(msgOf(er)); });
      };
      $("rmLow").onclick = function () {
        var req = msgs.filter(function (m) { return m.kind === "lowreq"; }).pop(), img = null, d = new Date();
        $("rmX").innerHTML = '<div class="card">' + (req ? '<div class="hint" style="margin-top:0">손님 집: <b>' + e(req.body.what || "") + '</b></div>' : '') +
          '<label for="rwP">같은 집 지금 최저가</label><input id="rwP" placeholder="예) 4억 2천 (없으면 비워 두세요 → 지금 나온 것 없음)">' +
          '<label for="rwM">한마디</label><input id="rwM" placeholder="예) 같은 단지 84㎡ 네이버 광고 최저가예요">' +
          '<div class="rm-two" style="margin-top:8px"><button class="btn ghost" id="rwPh">🖼 광고 캡처 넣기</button><button class="btn" id="rwGo">답장 보내기</button></div><div id="rwImg"></div>' +
          '<input type="file" id="rwIn" accept="image/*" style="display:none"></div>';
        $("rwPh").onclick = function () { $("rwIn").click(); };
        $("rwIn").onchange = function () { var f = this.files && this.files[0]; if (!f) return; shrink(f, 1000).then(function (x) { img = x; $("rwImg").innerHTML = '<img src="' + x + '" style="width:100%;border-radius:10px;margin-top:8px" alt="">'; }); };
        $("rwGo").onclick = function () { send("lowans", { price: $("rwP").value.trim() || "지금 나온 것 없음", memo: $("rwM").value.trim(), img: img, date: (d.getMonth() + 1) + "월 " + d.getDate() + "일" }).then(function () { $("rmX").innerHTML = ""; say("답장을 보냈어요."); }); };
      };
      AG.timer = setInterval(function () { if (!$("rmL")) { stopAg(); return; } var n = msgs.length; load().then(function () { if (msgs.length !== n) { draw(); BALPUM.Room.seen(cid).catch(function () {}); } }); }, 15000);
    }).catch(function (er) { say(msgOf(er)); showRooms(true); });
  };

  /* ---------- 뒤로 가기 · 첫 화면 바꿔 끼우기 ---------- */
  window.ROOM_ROUTE = function (st) {
    st = st || {}; stopPoll(); stopAg();
    if (window.BP_CUST) {
      if (st.view === "c_chat") showCustChat(true); else if (st.view === "c_sell") showCustSell(true); else if (st.view === "c_my") showCustMy(null, true);
      else if (st.view === "c_want") showCustWant(); else if (st.view === "cal") showCal(true); else showCustHome(true);
      return true;
    }
    if (st.view === "rooms") { showRooms(true); return true; }
    if (st.view === "room") { showRoom(st.id, true); return true; }
    if (st.view === "invite") { showRooms(true); return true; }
    return false;
  };
  document.addEventListener("DOMContentLoaded", function () {
    if (typeof window.showHome !== "function") return;
    var orig = window.showHome;
    window.showHome = function () { stopPoll(); stopAg(); if (window.BP_CUST) return showCustHome.apply(null, arguments); return orig.apply(null, arguments); };
  });
})();
