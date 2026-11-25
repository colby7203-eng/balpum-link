/* =====================================================================
   발품투어 매물장 v1.8 — 대표님 말씀 모음
   · 🖨 손님 초대 배너 뽑기 · 📲 손님에게 보내기 (시안 19 · 20 · 21 · 17)
   · ▾ 칸 접기 · 펴기 (공유방 · 손님 방 · 상담 · 내 사무소 · 설정)   · 매물 찾기: 거래 유형 여러 개
   · 💡 안내 팝업 옮기기 · 접기 · 다시 보기        · ⏻ 발품 끄기 (단추 · 뒤로 두 번)
   · 🧭 길안내 앱 바꾸기 단추                      · 💻 PC 손님 톡 알림 (화면 알림 · 소리 · 탭 깜빡임)
   · 💳 만료 7일 전 · 1일 전 핸드폰 알림            · 📅 PC 달력만 따로 띄우기
   Made by 정동철 · 상상을 현실로
   ===================================================================== */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  function e(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function say(t) { if (window.toast) window.toast(t); }
  function msgOf(er) { return (er && er.message) || String(er || "오류"); }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (er) { return null; } }
  function each(sel, fn, root) { Array.prototype.forEach.call((root || document).querySelectorAll(sel), fn); }
  var NATIVE = !!(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform());
  function plug(n) { var C = window.Capacitor; if (!C) return null; try { return (C.Plugins && C.Plugins[n]) || null; } catch (er) { return null; } }
  function homeUrl() { return (window.BALPUM && BALPUM.config && BALPUM.config.HOMEPAGE) || ""; }
  function office() { return (typeof OFFICE_INFO !== "undefined" && OFFICE_INFO) || {}; }
  function css(id, t) { if ($(id)) return; var s = document.createElement("style"); s.id = id; s.textContent = t; document.head.appendChild(s); }

  /* =================================================================
     1. 🖨 손님 초대 배너
     ================================================================= */
  function loadQR() {
    if (window.QRCode) return Promise.resolve();
    return new Promise(function (ok, no) { var s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"; s.onload = ok; s.onerror = function () { no(new Error("QR을 만들려면 인터넷이 필요해요")); }; document.head.appendChild(s); });
  }
  function qrData(text) {
    return loadQR().then(function () {
      var d = document.createElement("div"); d.style.cssText = "position:fixed;left:-9999px;top:0"; document.body.appendChild(d);
      new window.QRCode(d, { text: text, width: 360, height: 360, correctLevel: window.QRCode.CorrectLevel ? window.QRCode.CorrectLevel.M : 0 });
      var c = d.querySelector("canvas"), url = c ? c.toDataURL("image/png") : ((d.querySelector("img") || {}).src || "");
      d.remove(); return url;
    });
  }
  function footAbs() { try { return new URL("icons/foot.png", location.href).href; } catch (er) { return "icons/foot.png"; } }
  var FOOTD = "";      // 인쇄 창에서도 보이게 발 그림을 글자(데이터)로 넣어 둠
  function footData() { if (FOOTD) return Promise.resolve(FOOTD);
    return fetch("icons/foot.png").then(function (r) { return r.blob(); }).then(function (bl) { return new Promise(function (ok) { var fr = new FileReader(); fr.onload = function () { FOOTD = fr.result; ok(FOOTD); }; fr.onerror = function () { ok(""); }; fr.readAsDataURL(bl); }); }).catch(function () { return ""; }); }
  var BN = null;
  window.showBanner = function (fromHist) {
    if (!fromHist && window.nav) try { nav("banner"); } catch (er) {}
    window.scrollTo(0, 0);
    $("app").innerHTML = '<div class="top"><button class="back" id="bnBk">← 손님 방</button><h2>🖨 손님 초대 배너</h2></div><div class="loading">배너 QR 준비 중…</div>';
    $("bnBk").onclick = function () { if (window.showRooms) showRooms(); else showHome(); };
    Promise.all([BALPUM.Room.banner(), BALPUM.DB.setting("banner", {}).catch(function () { return {}; }), footData()]).then(function (r) {
      BN = { inv: r[0] || {}, cfg: r[1] || {} };
      var c = BN.cfg; c.show = c.show || { ceo: true, tel: true, mobile: true, email: false };
      if (!c.v182) { c.show.mobile = true; c.v182 = 1; }      // v1.8.2: 대표 핸드폰 번호도 처음부터 넣기 (끌 수 있음)
      drawBanner();
    }).catch(function (er) {
      $("app").innerHTML = '<div class="top"><button class="back" id="bnBk">← 손님 방</button><h2>🖨 손님 초대 배너</h2></div><div class="card"><div class="err">' + e(msgOf(er)) + '</div><div class="hint">서버(SQL)를 v1.8 로 바꿨는지 확인해 주세요.</div></div>';
      $("bnBk").onclick = function () { showRooms(); };
    });
  };
  function bOpts(extra) {
    var o = office(), c = BN.cfg;
    var x = { office: o.name || "", ceo: o.ceo || "", tel: o.tel || "", mobile: o.mobile || "", email: c.email || "", show: c.show, foot: FOOTD || footAbs() };
    for (var k in extra) x[k] = extra[k];
    return x;
  }
  function joinUrl(v) { return homeUrl() + "join.html?c=" + BN.inv.code + "&v=" + v; }
  function sendUrl(mail) { return homeUrl() + "banner.html?c=" + BN.inv.code + (mail ? "&m=mail" : ""); }
  function drawBanner() {
    var c = BN.cfg, inv = BN.inv, o = office();
    var chk = function (k, label, val) { return '<label class="bn-ck' + (val ? '' : ' dim') + '"><input type="checkbox" data-sh="' + k + '"' + (c.show[k] ? " checked" : "") + (val ? "" : " disabled") + '> ' + label + (val ? ' <small>' + e(val) + '</small>' : ' <small>(내 사무소에 없음)</small>') + '</label>'; };
    css("bnCss", '.bn-ck{display:flex;gap:8px;align-items:center;padding:7px 0;font-weight:700}.bn-ck input{width:20px;height:20px}.bn-ck small{color:#64748B;font-weight:400}.bn-ck.dim{opacity:.5}' +
      '.bn-pv{border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;box-shadow:0 4px 14px rgba(0,0,0,.08);margin-top:8px}.bn-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.bn-grid .btn{margin:0}' +
      '.bn-st{display:flex;gap:10px;align-items:center;justify-content:space-between;background:#F8FAFC;border-radius:12px;padding:10px 12px}.bn-st b{font-size:20px;letter-spacing:.2em;color:#1E2A78}');
    $("app").innerHTML = '<div class="top"><button class="back" id="bnBk">← 손님 방</button><h2>🖨 손님 초대 배너</h2></div>' +
      '<div class="card"><div class="sect" style="margin-top:0">🔳 우리 사무소 배너 QR</div>' +
      '<div class="bn-st"><span>코드 <b>' + e(inv.code) + '</b><br><small class="hint" style="margin:0">이 QR로 들어온 손님 ' + (inv.uses || 0) + '명 · ' + (inv.off ? '<b style="color:#B91C1C;letter-spacing:0;font-size:13px">⏸ 멈춤</b>' : '<b style="color:#15803D;letter-spacing:0;font-size:13px">● 켜짐</b>') + '</small></span>' +
      '<button type="button" class="btn ghost" id="bnOff" style="width:auto;margin:0;padding:8px 12px">' + (inv.off ? "▶ 다시 켜기" : "⏸ 이 QR 멈추기") + '</button></div>' +
      '<div class="hint">배너 QR은 한 번 뽑으면 계속 그대로 써요. 새로 뽑아도 예전 배너는 그대로 살아 있어요. 사무소를 옮겼을 때만 [멈추기].</div></div>' +
      '<div class="card"><div class="sect" style="margin-top:0">📝 아래 파란 띠에 넣을 것</div>' +
      '<div class="hint" style="margin-top:0">사무소 이름 <b>' + e(o.name || "(내 사무소에서 적어 주세요)") + '</b>은 늘 들어가요.</div>' +
      chk("ceo", "대표 이름", o.ceo) + chk("tel", "유선 전화 (사무실)", o.tel) + chk("mobile", "대표 휴대폰", o.mobile) +
      '<label class="bn-ck"><input type="checkbox" data-sh="email"' + (c.show.email ? " checked" : "") + '> 이메일</label><input id="bnEm" type="email" value="' + e(c.email || "") + '" placeholder="예) office@naver.com (배너에만 나와요)">' +
      '<div class="hint">많이 고를수록 글씨가 조금씩 작아져서 아래가 잘리지 않아요. 오른쪽 아래 "앱 제작 · 상상을 현실로"는 늘 작게 들어가요.</div></div>' +
      '<div class="card"><div class="sect" style="margin-top:0">🖨 뽑기 (인쇄 · PDF)</div><div class="bn-grid">' +
      '<button type="button" class="btn" id="bnA4">📄 A4 매장 배너</button><button type="button" class="btn ghost" id="bnMail">✉ 우편용 A4 (상호 없이)</button>' +
      '<button type="button" class="btn ghost" id="bnXb">🪧 X배너 60×180cm</button><button type="button" class="btn ghost" id="bnImg">🖼 핸드폰 그림 저장</button></div>' +
      '<div class="hint">PC: 미리보기에서 [인쇄] → 프린터 또는 "PDF로 저장". 핸드폰: 와이파이 프린터 · PDF로 저장. X배너는 PDF로 저장해 인쇄소에 보내세요.</div></div>' +
      '<div class="card"><div class="sect" style="margin-top:0">📲 손님에게 보내기</div><div class="hint" style="margin-top:0">사무실에 안 와 본 손님도 이 배너를 받아 보고 바로 깔 수 있어요. 핸드폰에서 열면 QR 대신 [내려받기] 단추가 나와요. 깔면 우리 손님으로 바로 들어와요.</div>' +
      '<label for="bnPh">손님 핸드폰 번호 <span class="hint">(문자로 보낼 때)</span></label><input id="bnPh" type="tel" inputmode="numeric" placeholder="010-0000-0000">' +
      '<div class="bn-grid"><button type="button" class="btn" id="bnSms">💬 문자로 보내기</button><button type="button" class="btn ghost" id="bnShare">카톡 · 공유</button>' +
      '<button type="button" class="btn ghost" id="bnCopy">📋 링크 복사</button><button type="button" class="btn ghost" id="bnMailLink">✉ 우편용 링크 (상호 없이)</button></div></div>' +
      '<div class="card"><div class="sect" style="margin-top:0">👀 손님 핸드폰에 이렇게 보여요</div><div class="bn-pv" id="bnPv"></div></div>';
    $("bnBk").onclick = function () { showRooms(); };
    $("bnPv").innerHTML = '<style>' + BP_BANNER.css + '</style>' + BP_BANNER.phone(bOpts({ apk: "#", web: "#" }));
    var save = function () { BALPUM.DB.saveSetting("banner", BN.cfg).catch(function () {}); };
    each("[data-sh]", function (x) { x.onchange = function () { c.show[x.getAttribute("data-sh")] = x.checked; save(); $("bnPv").innerHTML = '<style>' + BP_BANNER.css + '</style>' + BP_BANNER.phone(bOpts({ apk: "#", web: "#" })); }; });
    $("bnEm").onchange = function () { c.email = this.value.trim(); if (c.email) c.show.email = true; save(); drawBanner(); };
    $("bnOff").onclick = function () { var to = !inv.off; if (to && !confirm("이 배너 QR을 멈출까요? 멈추면 이 QR로는 새 손님이 들어오지 못해요. (언제든 다시 켤 수 있어요)")) return;
      BALPUM.Room.bannerSet(to).then(function () { inv.off = to; say(to ? "⏸ 배너 QR을 멈췄어요" : "▶ 배너 QR을 다시 켰어요"); drawBanner(); }).catch(function (er) { say(msgOf(er)); }); };
    // PC: 누르자마자 새 창을 열어 두고(팝업 막힘 방지) 배너가 다 만들어지면 그 창에 보여 줌
    var printDoc = function (html, name, w) {
      if (window.bpPrintHtml && NATIVE) { bpPrintHtml(html, name).catch(function (er) { say(msgOf(er)); }); return; }
      if (!w || w.closed) { say("팝업이 막혔어요. 주소창 오른쪽에서 팝업 허용을 눌러 주세요."); return; }
      html = html.replace("</body>", '<div style="position:fixed;right:12px;top:12px;display:flex;gap:6px" class="noprint"><button onclick="print()" style="padding:10px 16px;font-size:15px;font-weight:800;background:#F97316;color:#fff;border:0;border-radius:10px;cursor:pointer">🖨 인쇄 · PDF로 저장</button></div><style>@media print{.noprint{display:none!important}}</style></body>');
      try { w.location.href = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" })); } catch (er) { w.document.open(); w.document.write(html); w.document.close(); }
    };
    var mk = function (kind) { return function () { var b = this; b.disabled = true;
      var w = NATIVE ? null : window.open("", "_blank");
      if (w) try { w.document.write('<p style="font:16px sans-serif;padding:20px">배너 만드는 중…</p>'); } catch (er) {}
      qrData(joinUrl(kind === "mail" ? "mail" : "banner")).then(function (q) {
        var o = bOpts({ qr: q, mail: kind === "mail" });
        printDoc(kind === "xb" ? BP_BANNER.xb(o) : BP_BANNER.a4(o), kind === "xb" ? "발품 X배너" : "발품 배너", w);
      }).catch(function (er) { if (w) w.close(); say(msgOf(er)); }).then(function () { b.disabled = false; }); }; };
    $("bnA4").onclick = mk("a4"); $("bnMail").onclick = mk("mail"); $("bnXb").onclick = mk("xb");
    $("bnImg").onclick = function () { window.open(sendUrl(false), "_blank"); say("열린 화면을 캡처(스크린샷)해서 카톡에 붙여도 돼요"); };
    var msg = function (mail) { var o = office(); return (mail ? "" : (o.name || "부동산") + "입니다. ") + "손님은 왕! 발품 끝!\n발품 TOUR 앱 하나로 집 구하기 · 내놓기(몰래도) · 최저가 확인 · 달력 · 영어 수다까지 무료예요.\n" + sendUrl(mail); };
    $("bnSms").onclick = function () { var p = $("bnPh").value.replace(/[^\d]/g, ""); location.href = "sms:" + p + "?body=" + encodeURIComponent(msg(false)); };
    $("bnShare").onclick = function () { var t = msg(false); if (navigator.share) navigator.share({ title: "발품 TOUR", text: t }).catch(function () {}); else copy(t); };
    $("bnCopy").onclick = function () { copy(msg(false)); };
    $("bnMailLink").onclick = function () { copy(msg(true)); };
  }
  function copy(t) {
    var ok = function () { say("복사했어요. 카톡 · 문자에 붙여 넣으세요."); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, fb); else fb();
    function fb() { var a = document.createElement("textarea"); a.value = t; document.body.appendChild(a); a.select(); try { document.execCommand("copy"); ok(); } catch (er) { say("길게 눌러 복사해 주세요."); } a.remove(); }
  }

  /* =================================================================
     2. ▾ 칸 접기 · 펴기 — 제목(.sect)이 있는 카드를 누르면 접히고, 접은 것은 기억
     ================================================================= */
  var FOLD_OFF = /^(📝 아래 파란 띠|🔳 우리 사무소 배너)/;
  function foldKey(t) { return "bp_fold_" + t.replace(/\s+/g, " ").trim().slice(0, 40); }
  function foldOn() { return ls("bp_fold_all") !== "0"; }
  function foldScan(root) {
    if (!foldOn()) return;
    each(".card", function (cd) {
      if (cd.getAttribute("data-fd")) return;
      var hd = cd.firstElementChild;
      if (!hd || !hd.classList || !hd.classList.contains("sect") || cd.children.length < 2) return;
      if (cd.closest("#cal,.yc-log,.rm-chat,.bpb,#bpTips")) return;
      var t = hd.textContent || ""; if (!t.trim() || FOLD_OFF.test(t)) return;
      cd.setAttribute("data-fd", "1"); hd.classList.add("bpfold-h"); hd.setAttribute("role", "button"); hd.setAttribute("tabindex", "0");
      var k = foldKey(t);
      if (ls(k) === "1") cd.classList.add("bpfold-c");
      hd.setAttribute("aria-expanded", cd.classList.contains("bpfold-c") ? "false" : "true");
    }, root);
  }
  css("bpFoldCss", '.bpfold-h{cursor:pointer;position:relative;padding-right:26px!important;user-select:none}.bpfold-h:after{content:"▾";position:absolute;right:4px;top:50%;transform:translateY(-50%);color:#94A3B8;font-size:15px;transition:transform .2s}' +
    '.bpfold-c>.bpfold-h:after{transform:translateY(-50%) rotate(-90deg)}.bpfold-c>*:not(.bpfold-h){display:none!important}.bpfold-c{padding-bottom:10px}');
  document.addEventListener("click", function (ev) {
    var hd = ev.target.closest && ev.target.closest(".bpfold-h"); if (!hd) return;
    if (ev.target.closest("button,a,input,select,textarea,label") && ev.target.closest("button,a,input,select,textarea,label") !== hd) return;
    var cd = hd.parentNode, c = cd.classList.toggle("bpfold-c"), k = foldKey(hd.textContent || "");
    ls(k, c ? "1" : null); hd.setAttribute("aria-expanded", c ? "false" : "true");
  });
  document.addEventListener("keydown", function (ev) { if ((ev.key === "Enter" || ev.key === " ") && ev.target.classList && ev.target.classList.contains("bpfold-h")) { ev.preventDefault(); ev.target.click(); } });
  var foldT = null;
  function watchApp() { var a = $("app"); if (!a) return; new MutationObserver(function () { clearTimeout(foldT); foldT = setTimeout(function () { foldScan(a); }, 60); }).observe(a, { childList: true, subtree: true }); foldScan(a); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", watchApp); else watchApp();
  window.bpFoldAll = function (on) { ls("bp_fold_all", on ? null : "0"); if (!on) each(".bpfold-c", function (c) { c.classList.remove("bpfold-c"); }); else foldScan(); };

  /* =================================================================
     3. 매물 찾기 — 거래 유형 여러 개 (예: "전세도 있는 매물")
     ================================================================= */
  var DEALF = []; try { DEALF = JSON.parse(ls("bp_dealf") || "[]"); } catch (er) { DEALF = []; }
  function dealsOf(it) {
    var out = [];
    try { (JSON.parse(it.prices || "[]") || []).forEach(function (p) { if (p && p.deal) out.push(p.deal); }); } catch (er) {}
    String(it.deal_type || "").split(/[·,\/]/).forEach(function (x) { x = x.trim(); if (x) out.push(x); });
    return out;
  }
  window.BP18 = {
    dealOk: function (it) { if (!DEALF.length) return true; var d = dealsOf(it); return DEALF.some(function (f) { return d.indexOf(f) >= 0; }); },
    dealChips: function (items) {
      var box = $("dealf"); if (!box) return;
      var DE = (typeof DEALS !== "undefined" && DEALS) || ["매매", "전세", "월세", "반전세", "단기"];
      var live = (items || []).filter(function (i) { return String(i.status || "").indexOf("휴지통") < 0; });
      box.innerHTML = '<span class="hint" style="margin:0 4px 0 2px;align-self:center">거래</span>' + DE.map(function (d) {
        var n = live.filter(function (i) { return dealsOf(i).indexOf(d) >= 0; }).length;
        return '<button type="button" class="chip' + (DEALF.indexOf(d) >= 0 ? " on" : "") + '" data-df="' + e(d) + '">' + (DEALF.indexOf(d) >= 0 ? "✔ " : "") + e(d) + ' ' + n + '</button>'; }).join("") +
        (DEALF.length ? '<button type="button" class="chip" data-df="">✕ 거래 고르기 풀기</button>' : '');
      each("[data-df]", function (b) { b.onclick = function () { var d = b.getAttribute("data-df");
        if (!d) DEALF = []; else { var i = DEALF.indexOf(d); if (i >= 0) DEALF.splice(i, 1); else DEALF.push(d); }
        ls("bp_dealf", JSON.stringify(DEALF)); if (typeof drawList === "function") drawList(); }; }, box);
    }
  };

  /* =================================================================
     4. 💡 첫 화면 안내 — 옮기기(끌기) · 접기/펴기 · 닫기 · 일주일 안 보기 · 다시 보기
     ================================================================= */
  // 화면마다 처음 안내 (첫 화면 · 손님 · 답사 · 달력 · 홍보장) — 같은 모양 · 같은 손잡이
  var GUIDES = {
    agent: { title: "💡 발품 쓰기 전에 꼭 보세요", items: [
      ["🔔", "알림 허용", "처음에 \"알림을 허용할까요?\"가 뜨면 <b>[허용]</b>. 손님 상담 · 공유방 · 약속 알람이 소리로 와요."],
      ["⬇", "새 앱 받는 법", "홈페이지(초대 페이지) → <b>[안드로이드 앱으로 받기]</b> → 받은 파일 열기 → <b>[업데이트]</b>. 지우지 않고 덮어 깔면 자료 · 로그인이 그대로예요."],
      ["♻", "지웠다 다시 깔았다면", "앱을 <b>한 번 열어야</b> 알림이 다시 등록돼요. 손님은 [전에 들어왔어요]에 같은 전화번호 + 숫자 6자리면 예전 방 그대로."],
      ["🌐", "바로 쓰기(웹)는", "앱을 닫으면 푸시 알림 소리가 오지 않아요. 소리 알림은 <b>안드로이드 앱</b>에서만 돼요."],
      ["⏻", "끄기", "앱을 끄려면 첫 화면 아래 <b>[⏻ 발품 끄기]</b> 또는 첫 화면에서 <b>[뒤로] 두 번</b>."]] },
    cust: { title: "💡 발품 쓰기 전에 꼭 보세요", items: [
      ["🏠", "부동산이 여러 곳이어도", "앱은 <b>한 번만</b> 깔면 돼요. 다른 부동산 QR을 찍으면 그 부동산이 <b>내 부동산</b>에 더해져요."],
      ["🆘", "몰래 내놓기", "여러 곳에 맡길 땐 <b>가격을 하나로</b>. 다른 가격이면 한 곳에만. 팔리면 [🏁 팔렸어요] 한 번이면 모두에게 알려요."],
      ["🔔", "알림 허용", "\"알림을 허용할까요?\"가 뜨면 <b>[허용]</b>. 사장님 답장이 소리로 와요."],
      ["♻", "다시 깔았다면", "[전에 들어왔어요]에 같은 전화번호 + 숫자 6자리면 예전 방 그대로예요."]] },
    tour: { title: "🧭 답사 길안내 쓰는 법", again: "길안내 안내 다시 보기", items: [
      ["🏠", "한 집씩", "지금 집 → 다음 집. 집마다 [🧭 길안내]를 눌러요. 길안내가 끝나면 핸드폰 <b>[뒤로]</b>로 답사 화면에 돌아와요."],
      ["🧭", "전체 동선", "출발지 → 1번 → 2번 … 순서대로 <b>한 번에</b> 안내. <b>네이버지도</b>는 들르는 곳 <b>5곳까지</b>, <b>카카오맵</b>은 <b>2곳까지</b> 한 번에 넘겨요. 더 많으면 [다음 묶음 길안내]."],
      ["🗺", "길안내 앱 3가지", "<b>카카오맵</b> · <b>네이버지도</b> · <b>웹 지도</b>(앱이 없을 때). [🧭 길안내 앱 바꾸기]로 바꾸고, 길안내 단추를 <b>길게 누르면</b> 다시 골라요."],
      ["📍", "출발지", "지도 화면에서 🏢 사무소 / 📍 지금 위치 중에서 골라요. 본 집(✔)은 전체 동선에서 빠져요."]] },
    cal: { title: "📅 달력 쓰는 법", again: "달력 안내 다시 보기", items: [
      ["⏰", "울리는 알람 (약속마다)", "약속 다이어리에서 약속 줄 오른쪽 <b>[⏰ 알람]</b>을 눌러 빨갛게(⏰ 10분 전) 켜요. 새 약속은 아래 <b>[⏰ 알람 켜기]</b>에 체크하고 [추가]. 1분 간격 3번 · [끄기] · [5분 뒤 다시]."],
      ["🔔", "미리 알림 (모든 약속)", "모든 약속을 N분 전에 한 번 '띵' 알려 줘요. 이건 달력 칸에 표시가 안 나와요."],
      ["📝", "메모 · 포스트잇 알람", "날짜를 누르고 메모 · 포스트잇 아래 <b>[⏰ 알람 켜기]</b> → 시각. 그 시각에 울려요."],
      ["🗓", "달력 칸의 ⏰", "알람을 켠 날은 날짜 칸 오른쪽 위에 <b>⏰ + 시각</b>. [🔕 알람 전체 끄기]면 흐리게. [⏰ 보이기 끄기]로 숨겨요."],
      ["⏰", "알람 시계", "도구줄 <b>[⏰ 알람 시계]</b> — 시각 · 요일(매일 · 평일 · 주말) · 켜기/끄기. 자다가도 깨도록 크게 울려요."],
      ["💰", "가계부 · 📦 택배", "도구줄 [💰 가계부] · [📦 택배]. 자료는 내 계정에 저장돼 핸드폰 · PC 같이 보여요."]] },
    flyer: { title: "📢 홍보장 쓰는 법", again: "홍보장 안내 다시 보기", items: [
      ["✏", "꾸미기는 단추로", "박스 · 빨강 · 형광 · <s>줄 긋기</s> · ✕ 엑스는 <b>글자를 끌어서(길게 눌러) 고른 뒤 단추</b>를 누르면 생겨요. 쓰는 칸에도 꾸민 모양 그대로 보여요."],
      ["✍", "글은 마음대로", "박스 · 줄 안의 글자도 그냥 고쳐 쓰면 돼요. 꾸밈을 없애려면 글자를 고르고 <b>[지우기]</b>."],
      ["☑", "위 칩 줄", "[상단 제목] [사진] [<b>박스</b>] [본문] [하단 가격] 중 <b>✔ 켜진 것만</b> 홍보장에 나와요. 박스 글 칸에 쓰면 [박스]가 저절로 켜져요."],
      ["💸", "가격 내림", "[하단 가격] 아래 <b>💸 가격 내림 표시</b> 체크 → 내리기 전 가격에 줄이 그어지고 \"가격 내렸어요\"."],
      ["👀", "다 쓰면", "<b>[👀 미리보기]</b>로 확인하고 [🖨 인쇄] · [💾 저장]."]] }
  };
  window.bpGuide = function (who, force) { return window.bpTips(who, force); };
  window.bpGuideAgain = function (who) { return window.bpTipsReset(who); };
  window.bpTips = function (who, force) {
    who = who || "agent";
    var key = "bp_tips_" + who, until = +ls(key) || 0;
    if (!force && (Date.now() < until || $("bpTips") || sessionStorage.getItem(key))) return;
    if ($("bpTips")) $("bpTips").remove();
    var G = GUIDES[who] || GUIDES.agent, items = G.items.slice();
    if (!NATIVE) items = items.filter(function (x) { return x[1] !== "지웠다 다시 깔았다면" && x[1] !== "끄기"; });
    var pos = null; try { pos = JSON.parse(ls("bp_tips_pos") || "null"); } catch (er) {}
    var small = innerWidth < 640, mini = ls("bp_tips_min") === "1";
    var d = document.createElement("div"); d.id = "bpTips"; d.setAttribute("role", "dialog"); d.setAttribute("aria-label", "처음 안내");
    var base = "position:fixed;z-index:99990;background:#fff;border-radius:18px;box-shadow:0 14px 36px rgba(15,23,42,.3);font-family:'Noto Sans KR',sans-serif;border:2px solid #FDBA74;";
    var place = pos ? "left:" + Math.max(4, Math.min(innerWidth - 120, pos.x)) + "px;top:" + Math.max(4, Math.min(innerHeight - 60, pos.y)) + "px;width:" + (small ? "calc(100vw - 16px)" : "380px") + ";"
      : small ? "left:8px;right:8px;bottom:calc(10px + env(safe-area-inset-bottom,0px));" : "right:18px;bottom:18px;width:380px;";
    d.style.cssText = base + place;
    d.innerHTML = '<div id="bpTipsH" style="display:flex;align-items:center;gap:8px;padding:10px 12px;cursor:move;touch-action:none;background:#FFF7ED;border-radius:16px 16px 0 0;user-select:none">' +
      '<span style="font-size:13px;color:#C2410C">⠿</span><b style="flex:1;font-size:15.5px">' + G.title + '</b>' +
      '<button type="button" id="bpTipsM" aria-label="접기 펴기" style="border:0;background:#fff;border-radius:8px;padding:4px 9px;font-weight:800;cursor:pointer">' + (mini ? "▴ 펴기" : "▾ 접기") + '</button>' +
      '<button type="button" id="bpTipsC" aria-label="닫기" style="border:0;background:#fff;border-radius:8px;padding:4px 9px;font-weight:800;cursor:pointer">✕</button></div>' +
      '<div id="bpTipsB" style="padding:4px 14px 12px;max-height:min(60vh,460px);overflow:auto;' + (mini ? "display:none" : "") + '">' +
      items.map(function (x) { return '<div style="display:flex;gap:10px;padding:8px 0;border-top:1px solid #F1F5F9"><span style="font-size:20px;flex:none;width:26px;text-align:center">' + x[0] + '</span><div><b style="display:block;margin-bottom:1px;font-size:14px">' + x[1] + '</b><span style="font-size:13px;color:#475569;line-height:1.55">' + x[2] + '</span></div></div>'; }).join("") +
      '<div class="hint" style="margin:4px 0 8px">⠿ 위 줄을 손가락 · 마우스로 끌면 옮겨져요. 옮긴 자리는 기억해요.</div>' +
      '<div style="display:flex;gap:8px"><button type="button" id="bpTipsW" style="flex:1;padding:11px;border-radius:12px;border:1px solid #CBD5E1;background:#F8FAFC;font-weight:700;cursor:pointer">일주일 동안 안 보기</button>' +
      '<button type="button" id="bpTipsX" style="flex:1;padding:11px;border-radius:12px;border:0;background:#F97316;color:#fff;font-weight:800;cursor:pointer">닫기</button></div></div>';
    document.body.appendChild(d);
    var close = function () { d.remove(); try { sessionStorage.setItem(key, "1"); } catch (er) {} };
    $("bpTipsX").onclick = close; $("bpTipsC").onclick = close;
    $("bpTipsW").onclick = function () { ls(key, String(Date.now() + 7 * 864e5)); close(); say("일주일 동안 안 보여요 · 다시 보려면 [💡 " + (G.again || "안내 다시 보기") + "]"); };
    $("bpTipsM").onclick = function () { var b = $("bpTipsB"), m = b.style.display !== "none"; b.style.display = m ? "none" : ""; this.textContent = m ? "▴ 펴기" : "▾ 접기"; ls("bp_tips_min", m ? "1" : null); };
    // 끌어서 옮기기
    var H = $("bpTipsH"), drag = null;
    H.addEventListener("pointerdown", function (ev) { if (ev.target.closest("button")) return; var r = d.getBoundingClientRect(); drag = { dx: ev.clientX - r.left, dy: ev.clientY - r.top }; H.setPointerCapture(ev.pointerId);
      d.style.right = "auto"; d.style.bottom = "auto"; d.style.left = r.left + "px"; d.style.top = r.top + "px"; d.style.width = r.width + "px"; });
    H.addEventListener("pointermove", function (ev) { if (!drag) return; var x = Math.max(4 - d.offsetWidth + 80, Math.min(innerWidth - 80, ev.clientX - drag.dx)), y = Math.max(4, Math.min(innerHeight - 50, ev.clientY - drag.dy)); d.style.left = x + "px"; d.style.top = y + "px"; });
    var end = function () { if (!drag) return; drag = null; ls("bp_tips_pos", JSON.stringify({ x: parseInt(d.style.left, 10), y: parseInt(d.style.top, 10) })); };
    H.addEventListener("pointerup", end); H.addEventListener("pointercancel", end);
  };
  window.bpTipsReset = function (who) { ls("bp_tips_" + (who || "agent"), null); try { sessionStorage.removeItem("bp_tips_" + (who || "agent")); } catch (er) {} ls("bp_tips_min", null); window.bpTips(who, true); };

  /* =================================================================
     5. ⏻ 발품 끄기 — 단추 · 첫 화면에서 [뒤로] 두 번
     ================================================================= */
  function exitApp() {
    var P = plug("BalpumPrint"), A = plug("App");
    if (P && P.exit) return P.exit().catch(function () { if (A && A.exitApp) A.exitApp(); });
    if (A && A.exitApp) return A.exitApp();
    say("이 앱 버전은 [끄기]가 안 돼요. 최근 앱 단추(□)에서 위로 밀어 꺼 주세요.");
  }
  function dirty() { return !!document.querySelector("#app textarea:not([readonly])") && Array.prototype.some.call(document.querySelectorAll("#app textarea, #app input[type=text]"), function (t) { return t.value && t.defaultValue !== t.value; }); }
  window.bpExit = function () { if (dirty() && !confirm("저장 안 된 글이 있어요. 그래도 끌까요?")) return; exitApp(); };
  window.bpExitBtn = function (style) { if (!NATIVE || ls("bp_exit_btn") === "0") return ""; return '<button type="button" class="btn ghost bp-exit" style="' + (style || "") + '">⏻ 발품 끄기</button>'; };
  window.bpExitBind = function () { each(".bp-exit", function (b) { b.onclick = function () { window.bpExit(); }; }); };
  var backAt = 0;
  function onBack(ev) {
    var v = (window.CUR && CUR.view) || "";
    var atHome = !ev.canGoBack || v === "home" || v === "c_home" || !v;
    if (document.querySelector(".rm-ask,#bpTips,#cmp,.fy-ov")) { var o = document.querySelector(".rm-ask,#cmp"); if (o) { o.remove(); return; } }
    if (!atHome) { history.back(); return; }
    if (Date.now() - backAt < 2000) { exitApp(); return; }
    backAt = Date.now(); say("한 번 더 누르면 꺼져요");
  }
  (function hookBack() { var A = plug("App"); if (!NATIVE || !A || !A.addListener) return; try { A.addListener("backButton", onBack); } catch (er) {} })();

  /* =================================================================
     6. 🧭 길안내 앱 바꾸기 단추 (어디에 두어도 data-routeapp 만 있으면 됨)
     ================================================================= */
  var RA = { kakao: "카카오맵", naver: "네이버지도", web: "웹 지도" };
  window.bpRouteAppBtn = function (style) { return '<button type="button" class="btn ghost" data-routeapp="1" style="' + (style || "") + '">🧭 길안내 앱 바꾸기 <small>(지금: ' + e(RA[ls("mm_route_app")] || "고르기 전") + ')</small></button>'; };
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest("[data-routeapp]"); if (!b) return;
    if (typeof routeChooser !== "function") { say("답사 화면에서 바꿀 수 있어요"); return; }
    routeChooser(null);
    var t = setInterval(function () { if ($("cmp")) return; clearInterval(t); each("[data-routeapp] small", function (s) { s.textContent = "(지금: " + (RA[ls("mm_route_app")] || "고르기 전") + ")"; }); }, 300);
  });
  // 길안내 단추를 길게 누르면 앱 다시 고르기
  var lp = null;
  document.addEventListener("pointerdown", function (ev) { var a = ev.target.closest && ev.target.closest("a[data-route]"); if (!a) return; lp = setTimeout(function () { lp = "fired"; if (typeof routeChooser === "function") routeChooser(null); }, 650); });
  ["pointerup", "pointercancel", "pointerleave"].forEach(function (k) { document.addEventListener(k, function () { if (lp && lp !== "fired") clearTimeout(lp); }); });
  document.addEventListener("click", function (ev) { if (lp === "fired" && ev.target.closest && ev.target.closest("a[data-route]")) { ev.preventDefault(); ev.stopPropagation(); } lp = null; }, true);

  /* =================================================================
     7. 💻 PC 손님 톡 알림 — PC판을 켜 두면 (창을 내려 둬도) 윈도우 알림 · 띵동 · 탭 제목 (1)
     ================================================================= */
  var PN = { last: +ls("bp_pcn_last") || 0, timer: null, title: document.title, blink: null, n: 0 };
  function pcOn() { return !NATIVE && ls("bp_pcn") === "1" && window.Notification; }
  function beep() { if (ls("bp_pcn_snd") === "0") return; try { var A = new (window.AudioContext || window.webkitAudioContext)(), t = A.currentTime;
    [880, 1320].forEach(function (f, i) { var o = A.createOscillator(), g = A.createGain(); o.frequency.value = f; o.connect(g); g.connect(A.destination); g.gain.setValueAtTime(.0001, t + i * .18); g.gain.exponentialRampToValueAtTime(.25, t + i * .18 + .02); g.gain.exponentialRampToValueAtTime(.0001, t + i * .18 + .3); o.start(t + i * .18); o.stop(t + i * .18 + .32); }); } catch (er) {} }
  function blink(n) { clearInterval(PN.blink); if (!n) { document.title = PN.title; return; } var on = false; PN.blink = setInterval(function () { on = !on; document.title = on ? "(" + n + ") 💬 새 상담" : PN.title; }, 1000); }
  document.addEventListener("visibilitychange", function () { if (!document.hidden) { PN.n = 0; blink(0); } });
  function pcPoll() {
    if (!pcOn() || window.BP_CUST || !BALPUM.Auth.user() || !BALPUM.Room) return;
    Promise.all([BALPUM.Room.recent(), BALPUM.Room.links()]).then(function (r) {
      var msgs = (r[0] || []).filter(function (m) { return !m.from_agent; }), names = {};
      (r[1] || []).forEach(function (l) { names[l.customer] = l.name; });
      var top = msgs.length ? msgs[0].id : 0;
      if (!PN.last) { PN.last = top; ls("bp_pcn_last", String(top)); return; }
      var fresh = msgs.filter(function (m) { return m.id > PN.last; }).reverse();
      if (!fresh.length) return;
      PN.last = top; ls("bp_pcn_last", String(top));
      fresh.slice(-3).forEach(function (m) {
        var b = m.body || {}, sos = m.kind === "sell" && b.mode === "secret", nm = names[m.customer] || "손님";
        var title = sos ? "🆘 몰래 빨리 팔아 주세요 · " + nm + "님" : m.kind === "lowreq" ? "📊 최저가 요청 · " + nm + "님" : "💬 새 상담 · " + nm + "님";
        var body = sos ? (b.price || "") + " " + (b.what || "") : (b.text || b.what || b.price || b.memo || "");
        try { var N = new Notification(title, { body: String(body).slice(0, 120), tag: "bp" + m.id, requireInteraction: sos, icon: "icons/foot.png" });
          N.onclick = function () { window.focus(); N.close(); if (window.showRoom) showRoom(m.customer); }; } catch (er) {}
      });
      beep(); if (document.hidden) { PN.n += fresh.length; blink(PN.n); }
      if (window.bpHomeBadges && $("hRoom")) bpHomeBadges();
    }).catch(function () {});
  }
  function pcStart() { clearInterval(PN.timer); PN.timer = null; if (pcOn()) { PN.timer = setInterval(pcPoll, 20000); setTimeout(pcPoll, 3000); } }
  window.bpPcNoti = { start: pcStart, poll: pcPoll };

  /* =================================================================
     8. 💳 만료 7일 전 · 1일 전 핸드폰 알림 (로컬 알림 — 앱을 닫아 둬도 그 시각에 울림)
     ================================================================= */
  function expirySync() {
    var L = plug("LocalNotifications"); if (!NATIVE || !L || !BALPUM.Plan || window.BP_CUST) return;
    BALPUM.Plan.me().then(function (p) {
      var ids = [{ id: 310001 }, { id: 310002 }];
      return L.cancel({ notifications: ids }).catch(function () {}).then(function () {
        if (!p || !p.paid_until || p.state === "free_forever" || p.state === "paid_manual" || ls("bp_exp_noti") === "0") return;
        var end = new Date(p.paid_until), now = Date.now(), list = [];
        [[7, 310001, "💳 발품 이용 기간이 7일 남았어요"], [1, 310002, "💳 발품 이용 기간이 내일 끝나요"]].forEach(function (x) {
          var at = new Date(end.getTime() - x[0] * 864e5); at.setHours(10, 0, 0, 0);
          if (at.getTime() > now + 60000) list.push({ id: x[1], title: x[2], body: "[내 사무소] → [💰 입금했어요] 또는 [🎫 이용권 넣기]로 이어 쓰세요.", schedule: { at: at, allowWhileIdle: true }, channelId: "balpum_alarm", extra: { go: "office" } });
        });
        if (list.length) return L.schedule({ notifications: list });
      });
    }).catch(function () {});
  }

  /* =================================================================
     9. 내 사무소에 붙는 카드 (켜기 · 끄기 손잡이)
     ================================================================= */
  window.bp18OfficeCards = function () {
    setTimeout(bindOffice, 40);
    var chk = function (id, on, label) { return '<label class="chk" style="margin-top:6px"><input type="checkbox" id="' + id + '"' + (on ? " checked" : "") + '> <span>' + label + '</span></label>'; };
    return '<div class="card" id="v18Card"><div class="sect" style="margin-top:0">⚙ 화면 · 알림 손잡이 (v1.8)</div>' +
      '<div class="two"><button type="button" class="btn ghost" id="v18Tips" style="margin:0">💡 안내 다시 보기</button>' + window.bpRouteAppBtn("margin:0") + '</div>' +
      chk("v18Fold", foldOn(), "▾ 칸 접기 · 펴기 쓰기 (제목을 누르면 접혀요)") +
      '<label for="v18Sp2">🎬 시작 장면 두 번째 (손님은 왕! 발품 끝!)</label><select id="v18Sp2">' + [["", "앱을 열 때마다 보기"], ["day", "하루에 한 번만 보기"], ["0", "끄기 (안 보기)"]].map(function (x) { return '<option value="' + x[0] + '"' + ((ls("bp_sp2") || "") === x[0] ? " selected" : "") + '>' + x[1] + '</option>'; }).join("") + '</select>' +
      '<button type="button" class="btn ghost" id="v18Sp2P" style="margin-top:6px">▶ 시작 장면 지금 보기</button>' +
      (NATIVE ? chk("v18Ex", ls("bp_exit_btn") !== "0", "⏻ 첫 화면에 [발품 끄기] 단추 보이기") + chk("v18Exp", ls("bp_exp_noti") !== "0", "💳 이용 기간 끝나기 7일 전 · 1일 전 알림") : '') +
      (!NATIVE ? '<div class="sect">💻 이 PC 알림 (손님 톡)</div><div class="hint" style="margin-top:0">손님이 상담 · 🆘 몰래 · 최저가 요청을 보내면 PC 화면 오른쪽 아래에 뜨고 소리가 나요. 누르면 그 손님 방이 열려요. (PC판을 켜 두어야 해요 · 창은 내려 둬도 돼요)</div>' +
        chk("v18Pc", ls("bp_pcn") === "1", "💻 PC 알림 켜기") + chk("v18PcS", ls("bp_pcn_snd") !== "0", "🔔 소리 켜기") +
        '<button type="button" class="btn ghost" id="v18PcT">🔔 시험 알림 보내기</button>' : '') + '</div>';
  };
  function bindOffice() {
    if (!$("v18Card")) return;
    $("v18Tips").onclick = function () { window.bpTipsReset("agent"); };
    $("v18Fold").onchange = function () { window.bpFoldAll(this.checked); say(this.checked ? "접기 · 펴기를 켰어요" : "접기 · 펴기를 껐어요 (모두 펼쳐 보여요)"); };
    $("v18Sp2").onchange = function () { ls("bp_sp2", this.value || null); say(this.value === "0" ? "시작 장면 두 번째를 껐어요" : "시작 장면 두 번째를 켰어요"); };
    $("v18Sp2P").onclick = function () { if (window.bpSplash2) bpSplash2(); };
    if ($("v18Ex")) $("v18Ex").onchange = function () { ls("bp_exit_btn", this.checked ? null : "0"); };
    if ($("v18Exp")) $("v18Exp").onchange = function () { ls("bp_exp_noti", this.checked ? null : "0"); expirySync(); say(this.checked ? "만료 알림을 켰어요" : "만료 알림을 껐어요"); };
    if ($("v18Pc")) $("v18Pc").onchange = function () { var c = this;
      if (!c.checked) { ls("bp_pcn", null); pcStart(); say("PC 알림을 껐어요"); return; }
      if (!window.Notification) { c.checked = false; say("이 인터넷 창은 알림이 안 돼요 (크롬 · 엣지를 써 주세요)"); return; }
      Notification.requestPermission().then(function (p) { if (p !== "granted") { c.checked = false; say("크롬이 알림을 막았어요. 주소창 왼쪽 자물쇠 → 알림 → 허용"); return; }
        ls("bp_pcn", "1"); PN.last = 0; pcStart(); say("💻 PC 알림을 켰어요"); }); };
    if ($("v18PcS")) $("v18PcS").onchange = function () { ls("bp_pcn_snd", this.checked ? null : "0"); };
    if ($("v18PcT")) $("v18PcT").onclick = function () { if (!window.Notification || Notification.permission !== "granted") { say("먼저 [PC 알림 켜기]에 체크해 주세요"); return; } beep(); try { new Notification("💬 시험 알림 · 발품", { body: "손님 톡이 오면 이렇게 떠요", icon: "icons/foot.png" }); } catch (er) {} };
  }

  /* =================================================================
     10. 📅 PC: 달력만 따로 창으로 띄우기 (?only=cal)
     ================================================================= */
  var ONLY_CAL = /[?&]only=cal\b/.test(location.search);
  window.BP_ONLY_CAL = ONLY_CAL;
  window.bpCalWindow = function () {
    if (NATIVE) { say("핸드폰은 바탕화면에서 달력을 바로 열 수 있게 다음 판에 위젯을 넣어요"); return; }
    var w = window.open(location.pathname + "?only=cal", "bpcal", "width=460,height=820,menubar=no,toolbar=no,location=no");
    if (!w) say("팝업이 막혔어요. 주소창 오른쪽에서 팝업 허용을 눌러 주세요."); else say("📅 달력을 따로 띄웠어요. 닫으려면 그 창의 ✕");
  };
  if (ONLY_CAL) {
    css("onlyCal", '#bpInst{display:none!important}');
    document.title = "발품TOUR 달력";
    var calGo = function () { if (typeof showCal === "function") { try { showCal(true); } catch (er) {} } };
    var hook = function () {
      if (typeof window.showHome === "function" && !window.showHome._cal) { var oh = window.showHome; window.showHome = function () { if (BALPUM.Auth.user()) return calGo(); return oh.apply(null, arguments); }; window.showHome._cal = true; }
      if (typeof window.showCustHome === "function" && !window.showCustHome._cal) { var oc = window.showCustHome; window.showCustHome = function () { return calGo(); }; window.showCustHome._cal = true; }
    };
    document.addEventListener("DOMContentLoaded", function () { hook(); setTimeout(hook, 50); setTimeout(function () { if (BALPUM.Auth.user()) calGo(); }, 400); });
    try { sessionStorage.setItem("bp_splash", "1"); } catch (er) {}
  }

  /* =================================================================
     11. 🧭 답사 길안내 — [🏠 한 집씩] · [🧭 전체 동선] (v1.8.2)
         네이버지도: 출발지 → 들르는 곳 5곳 → 도착 · 카카오맵: 들르는 곳 2곳 → 도착 · 더 많으면 묶음으로
     ================================================================= */
  function rmode(v) { if (v === undefined) return ls("bp_route_mode") || "one"; ls("bp_route_mode", v); }
  var RTN = { naver: 5, kakao: 2 };
  window.bpRouteModeBar = function () {
    var m = rmode(), app = ls("mm_route_app") || "kakao";
    return '<div class="rmbar"><div class="rmb2"><button type="button" data-rmode="one" class="' + (m === "one" ? "on" : "") + '">🏠 한 집씩</button><button type="button" data-rmode="all" class="' + (m === "all" ? "on" : "") + '">🧭 전체 동선</button></div>' +
      (m === "all" ? '<div class="rmh">' + (app === "naver" ? "네이버지도 앱은 들르는 곳 <b>5곳까지</b> 한 번에 안내돼요" : app === "kakao" ? "카카오맵은 들르는 곳 <b>2곳까지</b> 한 번에 · 많으면 묶음으로 (네이버지도는 5곳)" : "웹 지도는 한 집씩만 돼요 — 길안내 앱을 네이버지도 · 카카오맵으로 바꿔 주세요") + '</div>' +
        '<button type="button" class="btn" data-routeall="1" style="margin:6px 0 0">🧭 전체 동선 길안내 (남은 집 순서대로)</button><div id="rmGo"></div>' : '') +
      '<button type="button" class="rmq" data-tourguide="1">💡 길안내 안내 다시 보기</button></div>';
  };
  css("rmCss", '.rmbar{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;padding:8px;margin:0 0 10px}.rmb2{display:grid;grid-template-columns:1fr 1fr;gap:6px}' +
    '.rmb2 button{border:2px solid #CBD5E1;background:#fff;border-radius:12px;padding:11px 6px;font:800 15px "Noto Sans KR",sans-serif;cursor:pointer;color:#334155}.rmb2 button.on{border-color:#1E2A78;background:#1E2A78;color:#fff}' +
    '.rmh{font-size:12.5px;color:#475569;margin:6px 2px 0;line-height:1.5}.rmq{border:0;background:none;color:#1E2A78;text-decoration:underline;font-size:12.5px;margin-top:6px;cursor:pointer;padding:0}' +
    '.rmgo a{display:block;text-align:center;text-decoration:none;margin-top:6px}');
  function rerouteUI() { if (window.CUR && CUR.view === "tour" && typeof showTour === "function") { var y = window.scrollY; showTour(true); window.scrollTo(0, y); } }
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest("[data-rmode]");
    if (b) { rmode(b.getAttribute("data-rmode")); if (b.getAttribute("data-rmode") === "all") say("🧭 전체 동선으로 바꿨어요"); else say("🏠 한 집씩으로 바꿨어요"); rerouteUI(); each(".rmbar", function (x) { x.outerHTML = window.bpRouteModeBar(); }); return; }
    if (ev.target.closest && ev.target.closest("[data-tourguide]")) { window.bpGuideAgain("tour"); return; }
    var g = ev.target.closest && ev.target.closest("[data-routeall]");
    if (g) routeAll(g);
  });
  function routeUrl(app, sp, pts) {      // pts: [{lat,lng,name}] 마지막 = 도착
    var dst = pts[pts.length - 1], via = pts.slice(0, -1), and = /Android/i.test(navigator.userAgent || "");
    var nm = function (x) { return encodeURIComponent(String(x.name || "답사").replace(/[,#;&]/g, " ").trim()); };
    if (app === "naver") {
      var q = "route/car?" + (sp ? "slat=" + sp.lat + "&slng=" + sp.lng + "&sname=" + encodeURIComponent(sp.label || "출발") + "&" : "") +
        via.map(function (v, i) { return "v" + (i + 1) + "lat=" + v.lat + "&v" + (i + 1) + "lng=" + v.lng + "&v" + (i + 1) + "name=" + nm(v); }).join("&") + (via.length ? "&" : "") +
        "dlat=" + dst.lat + "&dlng=" + dst.lng + "&dname=" + nm(dst) + "&appname=maemul.app";
      return and ? "intent://" + q + "#Intent;scheme=nmap;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.nhn.android.nmap;end" : "nmap://" + q;
    }
    var k = "route?" + (sp ? "sp=" + sp.lat + "," + sp.lng + "&" : "") + via.map(function (v, i) { return (i ? "vp" + (i + 1) : "vp") + "=" + v.lat + "," + v.lng; }).join("&") + (via.length ? "&" : "") + "ep=" + dst.lat + "," + dst.lng + "&by=CAR";
    return and ? "intent://" + k + "#Intent;scheme=kakaomap;package=net.daum.android.map;end" : "kakaomap://" + k;
  }
  function routeAll(btn) {
    var app = ls("mm_route_app") || "kakao";
    if (app === "web") { say("웹 지도는 한 집씩만 돼요. [🧭 길안내 앱 바꾸기]로 네이버지도 · 카카오맵을 골라 주세요"); return; }
    if (typeof TOUR === "undefined" || !TOUR || !TOUR.stops || !TOUR.stops.length) { say("답사할 집이 없어요"); return; }
    var n = TOUR.stops.length, order = [];
    for (var k = 0; k < n; k++) { var i = (TOUR.cur + k) % n; if (!TOUR.stops[i].seen || i === TOUR.cur) order.push(i); }
    if (!order.length) { say("남은 집이 없어요 (모두 ✔ 봤어요)"); return; }
    btn.disabled = true; btn.textContent = "집 위치 찾는 중…";
    kakaoLoad().then(function () {
      return order.reduce(function (p, i) { return p.then(function (acc) { return geocode(stopAddr(TOUR.stops[i])).then(function (g) { if (g) acc.push({ lat: g.lat, lng: g.lng, name: stopInfo(TOUR.stops[i]).name, no: i + 1 }); else acc.miss.push(i + 1); return acc; }); }); }, Promise.resolve(Object.assign([], { miss: [] })));
    }).then(function (pts) {
      return startPoint().then(function (sp) { return { pts: pts, sp: sp }; });
    }).then(function (r) {
      btn.disabled = false; btn.textContent = "🧭 전체 동선 길안내 (남은 집 순서대로)";
      var per = RTN[app] + 1, pts = r.pts, out = $("rmGo"); if (!out) return;
      if (!pts.length) { out.innerHTML = '<div class="hint">집 위치를 못 찾았어요. 주소를 번지까지 적어 주세요.</div>'; return; }
      var html = '', sp = r.sp ? { lat: r.sp.p.lat, lng: r.sp.p.lng, label: r.sp.label } : null;
      for (var a = 0, g = 1; a < pts.length; a += per, g++) {
        var part = pts.slice(a, a + per), from = a ? { lat: pts[a - 1].lat, lng: pts[a - 1].lng, label: pts[a - 1].name } : sp;
        html += '<div class="rmgo"><a class="btn' + (g > 1 ? " ghost" : "") + '" href="' + e(routeUrl(app, from, part)) + '" target="_top">▶ ' + (pts.length > per ? g + "묶음: " : "") + part.map(function (x) { return x.no + "번"; }).join(" → ") + ' ' + (app === "naver" ? "네이버지도" : "카카오맵") + '로 출발</a></div>';
      }
      out.innerHTML = html + (pts.miss && pts.miss.length ? '<div class="hint">' + pts.miss.join(", ") + '번 집은 위치를 못 찾아 빠졌어요 (주소를 번지까지).</div>' : '') +
        '<div class="hint">출발: ' + e(r.sp ? r.sp.label : "지금 위치") + ' · 길안내가 끝나면 핸드폰 [뒤로]로 돌아와요.' + (pts.length > per ? ' 한 묶음이 끝나면 다음 묶음을 누르세요.' : '') + '</div>';
    }).catch(function () { btn.disabled = false; btn.textContent = "🧭 전체 동선 길안내 (남은 집 순서대로)"; say("지도를 불러오지 못했어요. 인터넷 · 카카오 지도 설정을 확인해 주세요"); });
  }
  // 답사 화면을 처음 열면 길안내 안내
  (function hookTour() {
    var t = setInterval(function () {
      if (typeof window.showTour !== "function") return; clearInterval(t);
      var o = window.showTour; window.showTour = function () { var r = o.apply(this, arguments); setTimeout(function () { window.bpGuide("tour"); }, 600); return r; };
    }, 300);
  })();

  /* ---------- 로그인 뒤 한 번 ---------- */
  var started = false;
  function afterStart() {
    if (started || !window.BALPUM || !BALPUM.Auth.user()) return; started = true;
    setTimeout(function () { pcStart(); expirySync();
      // ⏰ 알람 시계: 앞으로 14일치를 다시 채움 (앱을 열 때마다)
      if (NATIVE && window.BP_NOTI && BP_NOTI.clockSync && BP_NOTI.can && BP_NOTI.can()) BALPUM.DB.setting("cal", {}).then(function (c) { if (c && c.clock && c.clock.length) BP_NOTI.clockSync(c.clock); }).catch(function () {});
    }, 2500);
  }
  setInterval(afterStart, 3000);
})();
