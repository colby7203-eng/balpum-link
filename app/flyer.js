/* =====================================================================
   발품투어 매물장 — 📢 A4 광고 홍보장 · 📄 손님 안내문 (PC에서 인쇄, 핸드폰에서 만들고 저장)
   개발자판 PC 프로그램의 홍보장(상단 제목 · 사진 0/1/2/4장 · 본문 · 하단 가격 · 박스·빨간 글씨·형광펜)을 옮김
   Made by 정동철 · 상상을 현실로
   ===================================================================== */
(function () {
  "use strict";
  var IN_APP = !!window.Capacitor;              // 안드로이드 앱 안
  function nativePrinter() {                     // 앱에 넣은 인쇄 기능 (와이파이 프린터 · PDF로 저장)
    var C = window.Capacitor; if (!C) return null;
    try { return (C.Plugins && C.Plugins.BalpumPrint) || (C.registerPlugin ? C.registerPlugin("BalpumPrint") : null); } catch (e) { return null; }
  }
  window.bpPrintHtml = function (html, name) { return printHtml(html, name); };   // v1.8 배너 인쇄도 같이 씀
  function printHtml(html, name) {
    var P = nativePrinter();
    if (!P || !P.print) return Promise.reject(new Error("이 앱 버전은 핸드폰 인쇄가 안 돼요. 저장한 뒤 PC에서 인쇄해 주세요."));
    return P.print({ html: html, name: name || "발품 인쇄" });
  }

  /* ---------- 꾸밈 표시 → HTML ---------- */
  var TOKENS = [
    ["{빨강}", "{/빨강}", '<span class="hl-red" style="color:#dc2626">', "</span>"],
    ["{박스}", "{/박스}", '<span class="hl-box">', "</span>"],
    ["{파란박스}", "{/파란박스}", '<span class="hl-box hl-blue">', "</span>"],
    ["{형광}", "{/형광}", '<span class="hl-mark">', "</span>"],
    ["{줄}", "{/줄}", '<span class="hl-strike">', "</span>"],          // v1.8 가운데 줄 긋기 (가격 내림 등)
    ["{엑스}", "{/엑스}", '<span class="hl-x">', "</span>"]            // v1.8 ✕ 엑스 표시
  ];
  function h(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function markup(raw) {
    var s = h(raw || "");
    TOKENS.forEach(function (t) { s = s.split(h(t[0])).join(t[2]).split(h(t[1])).join(t[3]); });
    return s.replace(/\r?\n/g, "<br>");
  }
  // v1.8.2 '보이는 대로 쓰는 칸': 꾸민 모양 그대로 보여 주고, 저장할 때는 기호로 바꿈
  var CLS2TOK = { "hl-red": "빨강", "hl-blue": "파란박스", "hl-box": "박스", "hl-mark": "형광", "hl-strike": "줄", "hl-x": "엑스" };
  function tokOf(el) { var c = (el.className || "") + ""; if (/hl-blue/.test(c)) return "파란박스"; for (var k in CLS2TOK) if (c.split(/\s+/).indexOf(k) >= 0) return CLS2TOK[k]; if (/#dc2626|rgb\(220, 38, 38\)/i.test(el.getAttribute && el.getAttribute("style") || "")) return "빨강"; return ""; }
  function fromEd(el) {
    var out = "";
    (function walk(n, top) {
      Array.prototype.forEach.call(n.childNodes, function (c, i) {
        if (c.nodeType === 3) { out += c.nodeValue.replace(/\u00a0/g, " "); return; }
        if (c.nodeType !== 1) return;
        var tag = c.tagName;
        if (tag === "BR") { out += "\n"; return; }
        var blk = tag === "DIV" || tag === "P";
        if (blk && out && !/\n$/.test(out)) out += "\n";
        var t = tokOf(c);
        if (t) out += "{" + t + "}"; walk(c); if (t) out += "{/" + t + "}";
      });
    })(el);
    return out.replace(/\n+$/, "");
  }
  window.bpFlyerFromEd = fromEd;
  function plain(raw) { var s = String(raw || ""); TOKENS.forEach(function (t) { s = s.split(t[0]).join("").split(t[1]).join(""); }); return s; }

  /* ---------- 사진 줄이기 (인쇄용: 긴 변 1600px) ---------- */
  function fileToJpeg(file, side) {
    side = side || 1600;
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        var w = img.naturalWidth, hh = img.naturalHeight, k = Math.min(1, side / Math.max(w, hh));
        var c = document.createElement("canvas"); c.width = Math.round(w * k); c.height = Math.round(hh * k);
        var g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url); res(c.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = function () { URL.revokeObjectURL(url); rej(new Error("사진을 열 수 없어요")); };
      img.src = url;
    });
  }

  /* ---------- 홍보장 HTML (A4) ---------- */
  var BORDER = { "테마색": null, "검정": "#111827", "회색": "#94a3b8", "없음": "" };
  var BORDER_W = { "얇게": 3, "보통": 6, "굵게": 10 };
  function flyerHtml(F, forPrint) {
    var n = F.on.photo ? Number(F.count) : 0;
    var ph = (F.photos || []).slice(0, n);
    var headBg = F.theme === "blue" ? "#2563eb" : "#dc2626";
    var bc = BORDER[F.border] === null ? headBg : BORDER[F.border];
    var border = bc ? (BORDER_W[F.borderW] || 6) + "px solid " + bc : "none";
    var footColor = F.footColor === "black" ? "#000000" : "#1e3a8a";
    var pt = function (v, d) { v = Number(v) || d; return Math.max(10, Math.min(200, v)) + "pt"; };
    var photoH = Math.max(20, Math.min(250, Number(F.photoH) || 100)) + "mm";
    var fit = F.fit === "contain" ? "contain" : "cover";
    var body = function (t) { return F.on.body && t ? '<div class="body-text">' + markup(t) + '</div>' : ""; };
    var box = F.on.box && F.boxText ? '<div class="boxline"><span class="hl-box' + (F.boxBlue ? ' hl-blue' : '') + '">' + markup(F.boxText) + '</span></div>' : "";
    var boxAt = function (p) { return F.boxAt === p ? box : ""; };
    var img = function (src, cls) { return '<img src="' + h(src) + '" class="' + cls + '">'; };
    var mark = F.mark ? '<span class="hidmark">No.' + h(F.mark) + '</span>' : "";
    var content;
    if (n === 1 && ph.length >= 1) content = '<div class="single-layout">' + img(ph[0], "flyer-img-1") + boxAt("middle") + body(F.t1) + '</div>';
    else if (n === 2 && ph.length >= 2) content = '<div class="double-layout"><div class="photo-group">' + img(ph[0], "flyer-img-2") + body(F.t1) + '</div>' + boxAt("middle") +
      '<div class="photo-group">' + img(ph[1], "flyer-img-2") + body(F.t2) + '</div></div>';
    else if (n === 4 && ph.length >= 4) content = '<div class="quad-layout"><div class="row-group"><div class="img-pair">' + img(ph[0], "flyer-img-4") + img(ph[1], "flyer-img-4") + '</div>' + body(F.t1) + '</div>' + boxAt("middle") +
      '<div class="row-group"><div class="img-pair">' + img(ph[2], "flyer-img-4") + img(ph[3], "flyer-img-4") + '</div>' + body(F.t2) + '</div></div>';
    else content = '<div class="text-only-layout">' + boxAt("middle") + body([F.t1, F.t2].filter(Boolean).join("\n")) + '</div>';
    var head = F.on.title ? '<div class="header-banner">' + markup(F.title) + '</div>' : "";
    var drop = F.dropOn && F.oldPrice ? '<div class="oldline"><span class="hl-strike">' + markup(F.oldPrice) + '</span> <span class="dropb">⬇ 가격 내렸어요</span></div>' : "";
    var foot = F.on.price ? '<div class="footer-price">' + drop + markup(F.price) + mark + '</div>' : (mark ? '<span class="hidmark hidmark-page">No.' + h(F.mark) + '</span>' : "");
    return '<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><title>매물 홍보장</title><style>' +
      '@page{size:A4 portrait;margin:4mm}' +
      'body{margin:0;background:#fff;font-family:"맑은 고딕","Malgun Gothic","Noto Sans KR",sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
      '.page-box{position:relative;width:202mm;height:289mm;box-sizing:border-box;border:' + border + ';margin:0 auto;display:flex;flex-direction:column;justify-content:space-between;background:#fff;overflow:hidden}' +
      '.header-banner{background:' + headBg + ';color:#fff;text-align:center;font-size:' + pt(F.headSize, 54) + ';font-weight:bold;line-height:1.2;padding:.3em;word-break:keep-all;flex-shrink:0}' +
      '.content-area{flex:1;display:flex;flex-direction:column;justify-content:space-evenly;align-items:center;padding:6px 10px;text-align:center;box-sizing:border-box;min-height:0;overflow:hidden}' +
      '.single-layout,.double-layout,.quad-layout{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:space-around}' +
      '.photo-group,.row-group{flex:0 1 auto;min-height:0;width:100%;display:flex;flex-direction:column;align-items:center}' +
      '.flyer-img-1,.flyer-img-2{flex:0 1 auto;min-height:15mm;width:97%;height:' + photoH + ';object-fit:' + fit + ';background:#f8fafc;border-radius:4px;border:2px solid #cbd5e1;margin-bottom:8px}' +
      '.img-pair{height:' + photoH + ';flex:0 1 auto;min-height:15mm;display:flex;justify-content:center;gap:10px;width:100%;margin-bottom:4px}' +
      '.flyer-img-4{width:48.5%;height:100%;object-fit:' + fit + ';background:#f8fafc;border-radius:4px;border:2px solid #cbd5e1}' +
      '.body-text{font-size:' + pt(F.bodySize, 24) + ';font-weight:bold;line-height:1.3;color:#0f172a;word-break:keep-all;flex-shrink:0}' +
      '.text-only-layout{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10px 14px;box-sizing:border-box}' +
      '.footer-price{position:relative;background:#93c5fd;color:' + footColor + ';text-align:center;font-size:' + pt(F.footSize, 54) + ';font-weight:bold;line-height:1.2;padding:.35em .3em;word-break:keep-all;flex-shrink:0}' +
      '.boxline{width:100%;text-align:center;margin:4px 0;flex-shrink:0;line-height:1.25;word-break:keep-all;font-size:' + pt(F.bodySize, 24) + ';font-weight:bold}' +
      '.hl-box{display:inline-block;max-width:100%;box-sizing:border-box;border:.07em solid #dc2626;background:#fff1f2;color:#b91c1c;border-radius:.25em;padding:.08em .4em;margin:.08em 0;line-height:1.25}' +
      '.hl-blue{border-color:#2563eb;background:#eff6ff;color:#1d4ed8}' +
      '.hl-mark{background:linear-gradient(transparent 55%,#fde047 55%)}' +
      '.hl-strike{text-decoration:line-through;text-decoration-color:#dc2626;text-decoration-thickness:.1em}' +
      '.hl-x{display:inline-block;background:linear-gradient(to top right,transparent calc(50% - .06em),#dc2626 calc(50% - .05em),#dc2626 calc(50% + .05em),transparent calc(50% + .06em)),linear-gradient(to top left,transparent calc(50% - .06em),#dc2626 calc(50% - .05em),#dc2626 calc(50% + .05em),transparent calc(50% + .06em))}' +
      '.oldline{font-size:.5em;line-height:1.2;color:#475569}.oldline .dropb{display:inline-block;font-size:.8em;background:#dc2626;color:#fff;border-radius:.3em;padding:.05em .45em;vertical-align:middle;text-decoration:none}' +
      '.hidmark{position:absolute;right:2.5mm;bottom:1.2mm;font-size:9pt;font-weight:normal;opacity:.55}.hidmark-page{right:3mm;bottom:2mm;color:#64748b}' +
      '@media screen{body{background:#e5e7eb}.page-box{margin-top:10px;box-shadow:0 2px 10px rgba(0,0,0,.25)}}' +
      '</style></head><body><div class="page-box" id="pageBox">' + head + '<div class="content-area">' + boxAt("top") + content + boxAt("bottom") + '</div>' + foot + '</div>' +
      (forPrint ? '' : '<script>function fit(){var b=document.getElementById("pageBox");b.style.zoom=1;var z=Math.min(1,(innerHeight-20)/b.offsetHeight,(innerWidth-20)/b.offsetWidth);b.style.zoom=Math.max(.2,z)}' +
        'addEventListener("load",fit);addEventListener("resize",fit);addEventListener("beforeprint",function(){document.getElementById("pageBox").style.zoom=1});addEventListener("afterprint",fit);<\/script>') +
      '</body></html>';
  }

  /* ---------- 미리보기 · 인쇄 창 ---------- */
  function preview(html, title, forPrintHtml) {
    var ov = document.createElement("div");
    ov.id = "fyOv";
    ov.style.cssText = "position:fixed;inset:0;background:rgba(15,23,42,.75);z-index:9999;display:flex;flex-direction:column";
    ov.innerHTML = '<div style="display:flex;gap:8px;padding:10px;background:#1E2A78;align-items:center">' +
      '<b style="color:#fff;flex:1">' + h(title || "미리보기") + '</b>' +
      '<button id="fyPrint" style="background:#F97316;color:#fff;border:0;border-radius:999px;padding:9px 16px;font-weight:800">🖨 인쇄 (A4)</button>' +
      '<button id="fyClose" style="background:#fff;border:0;border-radius:999px;padding:9px 14px;font-weight:700">닫기</button></div>' +
      '<iframe id="fyFrame" style="flex:1;border:0;background:#e5e7eb"></iframe>';
    document.body.appendChild(ov);
    var fr = document.getElementById("fyFrame");
    fr.srcdoc = html;
    document.getElementById("fyClose").onclick = function () { ov.remove(); };
    document.getElementById("fyPrint").onclick = function () {
      if (IN_APP) {
        toast("인쇄 창을 여는 중… (프린터를 고르거나 'PDF로 저장')");
        printHtml(forPrintHtml || html, title).catch(function (e) { toast(e.message || String(e)); });
        return;
      }
      try { fr.contentWindow.focus(); fr.contentWindow.print(); } catch (e) { toast("인쇄 창을 열지 못했어요: " + e.message); }
    };
  }

  /* ---------- 저장 (서버: 내 계정에만) ---------- */
  function listSaved() { return BALPUM.DB.list("flyer").then(function (rows) { return rows.map(function (r) { var d = r.data || {}; return { id: r.id, title: d.title || "", saved: d.saved || "", kind: d.kind || "flyer", n: d.n || 0 }; }).reverse(); }); }
  function saveDoc(id, F, kind) {
    var meta = clone(F); var photos = meta.photos || []; delete meta.photos;
    var big = JSON.stringify(photos);
    if (big.length > 2500000) return Promise.reject(new Error("사진이 너무 커요. 사진 수를 줄여 주세요."));
    return BALPUM.DB.upsert("flyer", id, { title: F.title || F.name || "(제목 없음)", saved: BALPUM.nowStr().slice(0, 16), kind: kind, n: photos.length, F: meta }, big);
  }
  function loadDoc(id) {
    return BALPUM.DB.get("flyer", id, true).then(function (r) {
      if (!r) throw new Error("저장한 것을 찾을 수 없어요.");
      var F = (r.data || {}).F || {}; try { F.photos = JSON.parse(r.big || "[]"); } catch (e) { F.photos = []; }
      return { F: F, kind: (r.data || {}).kind || "flyer" };
    });
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function newId() { return "F" + BALPUM.nowStr().replace(/\D/g, "").slice(2) + Math.floor(Math.random() * 90 + 10); }

  /* ---------- 처음 화면: 홍보장 · 안내문 ---------- */
  window.showFlyerHome = function (fromHist) {
    if (!fromHist) nav("flyer");
    window.scrollTo(0, 0);
    $("app").innerHTML = FY_CSS + '<div class="top"><button class="back" id="bk">← 처음</button><h2>🖨 출력 센터</h2></div>' +
      '<div class="card"><div class="sect" style="margin-top:0">📢 A4 광고 홍보장</div>' +
      '<button class="btn" id="fyNew">✏️ 바로 만들기 (기본 샘플에서 시작)</button>' +
      '<button class="btn ghost" id="fyList">📋 매물 목록에서 골라 만들기</button>' +
      '<div class="hint">사무실 앞 유리창·전단에 붙이는 큰 글씨 홍보장이에요. 목록에서 고르면 그 매물의 방 구조·가격이 저절로 들어가요.</div></div>' +
      '<div class="card"><div class="sect" style="margin-top:0">📄 손님 안내문</div>' +
      '<div class="howto" style="margin:0 0 8px"><b>만드는 순서</b><ol>' +
      '<li><b>매물 목록</b>에서 매물을 눌러 상세 화면으로 가요</li>' +
      '<li>아래쪽 <b>[📄 손님 안내문]</b>을 눌러요</li>' +
      '<li><b>동네만</b> 보여 줄지, <b>번지·호수까지</b> 적을지 고르고 사진을 4장까지 골라요</li>' +
      '<li><b>👀 미리보기</b> → <b>🖨 인쇄</b> (' + (IN_APP ? '와이파이 프린터 또는 PDF로 저장해서 카톡으로' : 'A4') + ')</li></ol></div>' +
      '<button class="btn ghost" id="gdList">📋 매물 목록에서 고르기</button></div>' +
      '<div class="card"><div class="sect" style="margin-top:0">곧 더 뽑을 수 있어요</div>' +
      '<div class="hint" style="margin-top:0">🗺 답사순서표 · 🏠 매물 안내장(여러 매물) · 🏦 전세대출 문의서 · 👥 고객 목록 — 업데이트로 하나씩 늘어나요.</div></div>' +
      '<div class="sect">💾 저장한 홍보장 · 안내문</div><div id="fySaved"><div class="hint">불러오는 중…</div></div>';
    $("bk").onclick = function () { showHome(); };
    $("fyList").onclick = function () { toast("목록에서 매물을 누르고, 상세 화면의 [📢 홍보장]을 누르세요."); showList(); };
    $("gdList").onclick = function () { toast("목록에서 매물을 누르고, 상세 화면의 [📄 손님 안내문]을 누르세요."); showList(); };
    $("fyNew").onclick = function () { openFlyer(null); };
    listSaved().then(function (l) {
      $("fySaved").innerHTML = l.length ? l.map(function (x) {
        return '<div class="card" style="display:flex;gap:8px;align-items:center;padding:10px 12px"><div style="flex:1"><b>' + (x.kind === "guide" ? "📄 " : "📢 ") + h(x.title) + '</b><div class="hint" style="margin:0">' + h(x.saved) + ' · 사진 ' + x.n + '장</div></div>' +
          '<button class="mini" data-o="' + h(x.id) + '">열기</button><button class="mini" data-d="' + h(x.id) + '">지우기</button></div>';
      }).join("") : '<div class="hint">아직 저장한 것이 없어요.</div>';
      Array.prototype.forEach.call(document.querySelectorAll("#fySaved [data-o]"), function (b) {
        b.onclick = function () { loadDoc(b.getAttribute("data-o")).then(function (r) { r.kind === "guide" ? openGuide(null, r.F, b.getAttribute("data-o")) : openFlyer(null, r.F, b.getAttribute("data-o")); }).catch(function (e) { toast(errText(e)); }); };
      });
      Array.prototype.forEach.call(document.querySelectorAll("#fySaved [data-d]"), function (b) {
        b.onclick = function () { if (!confirm("지울까요?")) return; BALPUM.DB.del("flyer", b.getAttribute("data-d")).then(function () { showFlyerHome(true); }); };
      });
    }).catch(function (e) { $("fySaved").innerHTML = '<div class="hint">' + h(errText(e)) + '</div>'; });
  };

  /* ---------- 홍보장 만들기 ---------- */
  function listingPhotos(it) {
    if (!it) return Promise.resolve([]);
    var ph = photosOf(it.photo_url);
    if (ph.length || !it.photo_count) return Promise.resolve(ph);
    return call("appPhotos", PIN, it.id).then(function (t) { it.photo_url = t || ""; return photosOf(it.photo_url); });
  }
  /* 기본 샘플: 사장님이 실제로 쓰던 홍보장 17개의 평균 — 사진 없이 큰 글씨 (제목 66 · 본문 60 · 가격 80pt) */
  var SAMPLES = [
    { name: "급매 추천 매물", title: "급매 추천 매물", room: "방3 화2", lines: ["역세권 도보 5분", "올수리", "즉시 입주 가능"], price: "매매 2억 4천", theme: "red_blue" },
    { name: "반전세 추천 매물", title: "반전세 추천 매물", room: "방2 화1", lines: ["관리비 저렴", "이사날짜 협의", "EV OK"], price: "반전세 3천/50", theme: "red_blue" },
    { name: "월세 추천 매물", title: "월세 추천 매물", room: "원룸", lines: ["풀옵션", "역세권 도보 3분", "즉시 입주 가능"], price: "월세 500/45", theme: "red_blue" },
    { name: "매매 추천 매물", title: "매매 추천 매물", room: "방3 화2", lines: ["남향", "주차 가능", "학교 가까움"], price: "매매 3억 2천", theme: "red_blue" },
    { name: "빌라 전세 매물", title: "빌라 전세 매물", room: "방2 화1", lines: ["LH전세 가능", "즉시 입주 가능", "올수리"], price: "전세 1억 6천", theme: "red_blue" },
    { name: "신축빌라 월세", title: "신축빌라 월세", room: "방2 화1", lines: ["신축 첫 입주", "EV OK", "주차 가능"], price: "월세 1000/70", theme: "blue" }
  ];
  var PHRASES = ["즉시 입주 가능", "LH전세 가능", "역세권 도보 5분", "올수리", "이사날짜 협의", "EV OK", "주차 가능", "풀옵션", "남향", "관리비 저렴"];
  var HEAD_BY = { 0: 66, 1: 54, 2: 50, 4: 48 }, FOOT_BY = { 0: 80, 1: 60, 2: 56, 4: 54 };
  var PHOTO_H_BY = { 0: 100, 1: 150, 2: 95, 4: 85 }, BODY_BY = { 0: 60, 1: 30, 2: 24, 4: 22 };
  function dealTitle(it) {
    var d = String((it && it.deal_type) || "");
    return /월세/.test(d) ? "월세 추천 매물" : /반전세/.test(d) ? "반전세 추천 매물" : /전세/.test(d) ? "전세 추천 매물" : /매매/.test(d) ? "매매 추천 매물" : "추천 매물";
  }
  function bodyOf(room, lines) { return (room ? "{박스}" + room + "{/박스}\n" : "") + (lines || []).filter(Boolean).join("\n"); }
  function defaults(it) {
    var mg = it && typeof mgmtText === "function" ? mgmtText(it) : "";
    var S = SAMPLES[0];
    return {
      title: it ? dealTitle(it) : S.title,
      price: it ? (window.L17 ? L17.priceLine(it) : [it.deal_type, it.price].filter(Boolean).join(" ")) : S.price,
      t1: it ? bodyOf("", [it.direction ? it.direction + "향" : "", mg ? "관리비 " + mg : ""]) : bodyOf(S.room, S.lines),
      t2: "", boxText: it && it.room_structure ? it.room_structure : "", boxBlue: false, boxAt: "top",
      count: 0, photos: [], on: { title: true, photo: false, box: !!(it && it.room_structure), body: true, price: true },
      theme: "red_blue", border: "테마색", borderW: "보통", headSize: 66, bodySize: 60, footSize: 80, photoH: 100, fit: "cover", footColor: "navy",
      mark: it ? String(it.id) : "", sample: it ? "" : S.name,
      oldPrice: it && it.price_old ? it.price_old : "", dropOn: !!(it && it.price_old)
    };
  }
  function applySample(F, S, it) {
    F.title = S.title; F.theme = S.theme; F.footColor = "navy";
    F.t1 = bodyOf(it && it.room_structure ? it.room_structure : S.room, S.lines); F.t2 = "";
    F.price = it && it.price ? (window.L17 ? L17.priceLine(it) : [it.deal_type, it.price].filter(Boolean).join(" ")) : S.price;
    F.count = 0; F.on.photo = false; F.on.title = F.on.body = F.on.price = true; F.on.box = false;
    F.headSize = 66; F.bodySize = 60; F.footSize = 80; F.sample = S.name;
  }
  function sampleCard(S, on) {
    var hb = S.theme === "blue" ? "#2563eb" : "#dc2626";
    return '<button class="fySm' + (on ? ' on' : '') + '" data-s="' + h(S.name) + '" type="button"><span class="fySmPg" style="border-color:' + hb + '">' +
      '<span class="fySmH" style="background:' + hb + '">' + h(S.title) + '</span><span class="fySmB"><span class="fySmBox">' + h(S.room) + '</span>' +
      S.lines.map(function (l) { return '<span>' + h(l) + '</span>'; }).join("") + '</span><span class="fySmF">' + h(S.price) + '</span></span><span class="fySmN">' + h(S.name) + '</span></button>';
  }
  var FY_CSS = '<style>.fySms{display:flex;gap:8px;overflow-x:auto;padding:2px 2px 8px;scroll-snap-type:x mandatory}' +
    '.fySm{flex:0 0 108px;border:0;background:transparent;padding:0;text-align:center;scroll-snap-align:start;cursor:pointer}' +
    '.fySmPg{display:flex;flex-direction:column;width:104px;height:146px;border:3px solid;border-radius:4px;background:#fff;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.12)}' +
    '.fySm.on .fySmPg{outline:3px solid #F97316;outline-offset:2px}' +
    '.fySmH{color:#fff;font-weight:800;font-size:11px;padding:5px 2px;line-height:1.15}' +
    '.fySmB{flex:1;display:flex;flex-direction:column;justify-content:center;gap:2px;font-weight:800;font-size:9.5px;color:#0f172a;line-height:1.2}' +
    '.fySmBox{align-self:center;border:1.5px solid #dc2626;color:#b91c1c;background:#fff1f2;border-radius:3px;padding:0 4px;font-size:10px}' +
    '.fySmF{background:#93c5fd;color:#1e3a8a;font-weight:800;font-size:11px;padding:5px 2px}' +
    '.fySmN{display:block;font-size:12px;font-weight:700;margin-top:5px;color:#1E2A78}' +
    '.howto{background:#EEF2FF;border-radius:14px;padding:10px 12px;font-size:13.5px;line-height:1.6;margin-bottom:12px}.howto b{color:#1E2A78}.howto ol{margin:4px 0 0;padding-left:20px}</style>';
  var HOWTO_FLYER = '<div class="howto"><b>📢 홍보장 만드는 순서</b><ol>' +
    '<li>위 <b>기본 샘플</b> 중 하나를 누르면 글씨 크기·모양이 그대로 들어가요</li>' +
    '<li>본문·가격을 고치고, 아래 <b>자주 쓰는 말</b>을 눌러 한 줄씩 넣어요</li>' +
    '<li><b>👀 미리보기</b> → <b>🖨 인쇄</b> : ' + (IN_APP ? '사무실 와이파이 프린터를 고르거나 <b>PDF로 저장</b>해서 카톡으로 보내요' : 'A4로 바로 뽑혀요') + '</li>' +
    '<li><b>💾 저장</b>해 두면 PC·핸드폰 어디서나 다시 열려요 (핸드폰에서 만들고 PC에서 뽑아도 돼요)</li></ol>' +
    '<div style="margin-top:4px">사진을 넣을 때는 <b>' + (IN_APP ? '앨범의 원본 사진' : 'PC의 원본 사진') + '</b>을 고르세요. 매물에 저장된 사진은 작게 줄여져 있어 A4로 크게 뽑으면 흐려요.</div></div>';

  window.openFlyer = function (it, F, saveId) {
    F = F || defaults(it);
    saveId = saveId || null;
    var srcPhotos = [];                                       // 매물에 있는 사진 (고를 수 있게)
    function draw() {
      var y = window.scrollY;
      var chip = function (k, label) { return '<button class="chip' + (F.on[k] ? ' on' : '') + '" data-on="' + k + '">' + (F.on[k] ? '✔ ' : '') + label + '</button>'; };
      var sel = function (id, cur, opts) { return '<select id="' + id + '">' + opts.map(function (o) { var v = o[0], t = o[1] || o[0]; return '<option value="' + h(v) + '"' + (String(cur) === String(v) ? ' selected' : '') + '>' + h(t) + '</option>'; }).join("") + '</select>'; };
      var n = Number(F.count);
      $("app").innerHTML = FY_CSS + '<div class="top"><button class="back" id="bk">← 뒤로</button><h2>📢 A4 홍보장</h2></div>' +
        '<div class="card"><label>기본 샘플 <span class="hint">(누르면 글씨체·크기가 그대로)</span></label><div class="fySms">' + SAMPLES.map(function (S) { return sampleCard(S, F.sample === S.name); }).join("") + '</div>' + HOWTO_FLYER + '</div>' +
        '<div class="card"><label>홍보장에 넣을 것</label><div class="stat">' + chip("title", "상단 제목") + chip("photo", "사진") + chip("box", "박스 글") + chip("body", "본문") + chip("price", "하단 가격") + '</div>' +
        '<label for="fyT">상단 제목</label><input id="fyT" value="' + h(F.title) + '">' +
        '<label>사진 매수</label><div class="stat">' + [0, 1, 2, 4].map(function (k) { return '<button class="chip' + (n === k ? ' on' : '') + '" data-n="' + k + '">' + (k ? k + "장" : "사진 없이") + '</button>'; }).join("") + '</div>' +
        (n ? '<div class="hint">고른 사진 ' + F.photos.length + ' / ' + n + '장 — 사진을 누르면 빠져요</div><div class="gal" id="fyPh">' +
          F.photos.map(function (s, i) { return '<img src="' + h(s) + '" data-x="' + i + '" alt="고른 사진">'; }).join("") + '</div>' +
          '<div class="pbtns"><button class="pbtn" id="fyFile">🖼 ' + (IN_APP ? '앨범에서 (원본)' : 'PC 사진 고르기 (원본)') + '</button></div>' +
          (srcPhotos.length ? '<div class="hint">매물 사진 (작게 저장된 것 · 누르면 추가)</div><div class="gal" id="fySrc">' + srcPhotos.map(function (s, i) { return '<img src="' + h(s) + '" data-a="' + i + '" alt="매물 사진">'; }).join("") + '</div>' : '') : '') +
        '<label for="fyB">박스 글 <span class="hint">(통째로 박스 안에)</span></label><input id="fyB" value="' + h(F.boxText) + '">' +
        '<div class="two">' + sel("fyBA", F.boxAt, [["top", "박스: 맨 위"], ["middle", "박스: 가운데"], ["bottom", "박스: 맨 아래"]]) + sel("fyBC", F.boxBlue ? "1" : "", [["", "빨간 박스"], ["1", "파란 박스"]]) + '</div>' +
        '<label for="fy1">' + (n === 4 ? '본문 (위 사진 아래)' : n === 2 ? '본문 (첫 사진 아래)' : '본문') + ' <span class="hint">(꾸민 모양 그대로 보여요)</span></label><div id="fy1" class="fy-ed" contenteditable="true" role="textbox" aria-multiline="true">' + markup(F.t1) + '</div>' +
        '<div class="hint">자주 쓰는 말 (누르면 본문에 한 줄 더해져요)</div><div class="stat">' + PHRASES.map(function (p) { return '<button class="chip" data-ph="' + h(p) + '" type="button">+ ' + h(p) + '</button>'; }).join("") + '</div>' +
        (n === 2 || n === 4 ? '<label for="fy2">본문 (' + (n === 4 ? '아래 사진 아래' : '둘째 사진 아래') + ')</label><div id="fy2" class="fy-ed" contenteditable="true" role="textbox" aria-multiline="true">' + markup(F.t2) + '</div>' : '') +
        '<div class="hint">글자를 길게 눌러 고른 뒤 꾸미기: </div><div class="stat"><button class="chip" data-w="빨강">빨간 글씨</button><button class="chip" data-w="박스">빨간 박스</button><button class="chip" data-w="파란박스">파란 박스</button><button class="chip" data-w="형광">형광펜</button><button class="chip" data-w="줄" style="text-decoration:line-through;text-decoration-color:#dc2626">줄 긋기</button><button class="chip" data-w="엑스">✕ 엑스</button><button class="chip" data-w="">꾸밈 지우기</button></div>' +
        '<div class="hint">제목 · 박스 글 · 본문 · 가격 어디서든 글자를 끌어서(길게 눌러) 고르면 아래에 꾸미기 줄이 떠요.</div>' +
        '<label for="fyP">하단 가격</label><input id="fyP" value="' + h(F.price) + '">' +
        '<label class="chk" style="margin-top:8px"><input type="checkbox" id="fyDrop"' + (F.dropOn ? ' checked' : '') + '> <span>💸 가격 내림 표시 — 내리기 전 가격에 줄을 긋고 "가격 내렸어요"</span></label>' +
        '<input id="fyOP" value="' + h(F.oldPrice || "") + '" placeholder="내리기 전 가격 예) 1억 4천" style="' + (F.dropOn ? '' : 'display:none') + '">' +
        '<div class="sect">🎨 모양</div><div class="two">' + sel("fyTh", F.theme, [["red_blue", "빨강 제목"], ["blue", "파랑 제목"]]) + sel("fyFC", F.footColor, [["navy", "가격 남색"], ["black", "가격 검정"]]) + '</div>' +
        '<div class="two">' + sel("fyBo", F.border, [["테마색", "테두리 제목색"], ["검정"], ["회색"], ["없음", "테두리 없음"]]) + sel("fyBW", F.borderW, [["얇게"], ["보통"], ["굵게"]]) + '</div>' +
        '<div class="two">' + sel("fyFit", F.fit, [["cover", "사진 꽉 채우기"], ["contain", "사진 전체 보이기"]]) + '<input id="fyPH" type="number" value="' + h(F.photoH) + '" title="사진 높이(mm)"></div>' +
        '<div class="hint">글자 크기(pt) — 상단 · 본문 · 하단 / 사진 높이(mm)는 위 칸</div><div class="two"><input id="fyHS" type="number" value="' + h(F.headSize) + '"><input id="fyBS" type="number" value="' + h(F.bodySize) + '"><input id="fyFS" type="number" value="' + h(F.footSize) + '"></div>' +
        '<label class="chk" style="margin-top:10px"><input type="checkbox" id="fyMk"' + (F.mark ? ' checked' : '') + '> 숨은 표시 (가격 띠 구석에 작게 매물 번호)</label>' +
        '</div>' +
        '<button class="btn" id="fyPrev">👀 미리보기' + (IN_APP ? '' : ' · 인쇄') + '</button>' +
        '<button class="btn ghost" id="fySave">💾 저장 (PC·핸드폰에서 다시 열기)</button>' +
        '<input type="file" id="fyIn" accept="image/*" multiple style="display:none">';
      window.scrollTo(0, y);
      bind();
    }
    function read() {
      var v = function (id) { var e = $(id); return e ? e.value : undefined; };
      F.title = v("fyT"); F.boxText = v("fyB"); F.boxAt = v("fyBA"); F.boxBlue = v("fyBC") === "1"; F.t1 = $("fy1") ? fromEd($("fy1")) : F.t1;
      if ($("fy2")) F.t2 = fromEd($("fy2"));
      F.price = v("fyP"); F.oldPrice = v("fyOP") || ""; F.dropOn = $("fyDrop") ? $("fyDrop").checked : !!F.dropOn; F.theme = v("fyTh"); F.footColor = v("fyFC"); F.border = v("fyBo"); F.borderW = v("fyBW"); F.fit = v("fyFit");
      F.photoH = Number(v("fyPH")) || 100; F.headSize = Number(v("fyHS")) || 66; F.bodySize = Number(v("fyBS")) || 60; F.footSize = Number(v("fyFS")) || 80;
      if (!$("fyMk").checked) F.mark = ""; else if (!F.mark) F.mark = it ? String(it.id) : "";
    }
    var lastTa = null;
    // v1.8 꾸미기: 고른 글자를 {줄}…{/줄} 처럼 감싸기 · w 가 "" 이면 고른 곳의 꾸밈 표시 지우기
    var TOK2CLS = { "빨강": "hl-red", "박스": "hl-box", "파란박스": "hl-box hl-blue", "형광": "hl-mark", "줄": "hl-strike", "엑스": "hl-x" };
    function deco(ta, w) {
      if (ta.isContentEditable) {
        var sel = window.getSelection(); if (!sel.rangeCount || sel.isCollapsed || !ta.contains(sel.anchorNode)) { toast("꾸밀 글자를 먼저 골라(길게 눌러) 주세요."); return; }
        var rg = sel.getRangeAt(0);
        if (!w) {     // 꾸밈 지우기: 고른 곳을 감싼 꾸밈을 벗김
          var txt = rg.toString(), node = rg.commonAncestorContainer; node = node.nodeType === 3 ? node.parentNode : node;
          var hit = node.closest && node.closest(".hl-red,.hl-box,.hl-mark,.hl-strike,.hl-x,[style*='dc2626']");
          if (hit && ta.contains(hit)) { var par = hit.parentNode; while (hit.firstChild) par.insertBefore(hit.firstChild, hit); par.removeChild(hit); }
          else { rg.deleteContents(); rg.insertNode(document.createTextNode(txt)); }
          ta.normalize(); toast("꾸밈을 지웠어요."); hideBar(); return;
        }
        var sp = document.createElement("span"); sp.className = TOK2CLS[w] || ""; if (w === "빨강") sp.style.color = "#dc2626";
        try { sp.appendChild(rg.extractContents()); rg.insertNode(sp); sel.removeAllRanges(); } catch (er) { toast("한 줄 안에서 골라 주세요."); return; }
        toast(w === "줄" ? "줄을 그었어요." : w === "엑스" ? "✕ 엑스를 쳤어요." : "꾸몄어요."); hideBar(); return;
      }
      var s = ta.selectionStart, e = ta.selectionEnd;
      if (s === e) { toast("꾸밀 글자를 먼저 골라(길게 눌러) 주세요."); return; }
      var mid = ta.value.slice(s, e);
      if (!w) { var clean = mid.replace(/\{\/?(빨강|박스|파란박스|형광|줄|엑스)\}/g, ""); ta.value = ta.value.slice(0, s) + clean + ta.value.slice(e); try { ta.setSelectionRange(s, s + clean.length); } catch (er) {} toast("꾸밈을 지웠어요."); hideBar(); return; }
      ta.value = ta.value.slice(0, s) + "{" + w + "}" + mid + "{/" + w + "}" + ta.value.slice(e);
      toast(w === "줄" ? "줄을 그었어요. 미리보기로 확인하세요." : w === "엑스" ? "✕ 엑스를 쳤어요. 미리보기로 확인하세요." : "꾸몄어요. 미리보기로 확인하세요."); hideBar();
    }
    function hideBar() { var b = $("fyDeco"); if (b) b.remove(); }
    function decoBar(ta) {
      if (ta && ta.isContentEditable) { var sl = window.getSelection(); if (!sl.rangeCount || sl.isCollapsed || !ta.contains(sl.anchorNode)) { hideBar(); return; } }
      else if (!ta || ta.selectionStart === ta.selectionEnd || document.activeElement !== ta) { hideBar(); return; }
      var b = $("fyDeco");
      if (!b) { b = document.createElement("div"); b.id = "fyDeco";
        b.style.cssText = "position:fixed;left:50%;transform:translateX(-50%);bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:9990;background:#0F172A;color:#fff;border-radius:999px;padding:6px 8px;display:flex;gap:4px;box-shadow:0 8px 24px rgba(0,0,0,.3);font:700 13px 'Noto Sans KR',sans-serif;max-width:calc(100vw - 16px);overflow-x:auto";
        b.innerHTML = [["줄", '<s style="text-decoration-color:#F87171">줄 긋기</s>'], ["엑스", "✕ 엑스"], ["빨강", '<span style="color:#F87171">빨강</span>'], ["박스", "박스"], ["형광", '<span style="background:#FDE047;color:#000;padding:0 3px">형광</span>'], ["", "지우기"]]
          .map(function (x) { return '<button type="button" data-dw="' + x[0] + '" style="border:0;background:rgba(255,255,255,.12);color:#fff;border-radius:999px;padding:7px 11px;font:inherit;white-space:nowrap;cursor:pointer">' + x[1] + '</button>'; }).join("");
        document.body.appendChild(b); }
      Array.prototype.forEach.call(b.querySelectorAll("[data-dw]"), function (x) {
        x.onpointerdown = function (ev) { ev.preventDefault(); };
        x.onmousedown = function (ev) { ev.preventDefault(); };
        x.onclick = function () { deco(lastTa || ta, x.getAttribute("data-dw")); };
      });
    }
    function bind() {
      $("bk").onclick = function () { history.back(); };
      if (!$("fyEdCss")) { var st = document.createElement("style"); st.id = "fyEdCss"; st.textContent = '.fy-ed{min-height:96px;border:1px solid #CBD5E1;border-radius:12px;padding:10px 12px;background:#fff;font:700 17px/1.5 "Noto Sans KR",sans-serif;text-align:center;outline:none;white-space:pre-wrap;word-break:keep-all}.fy-ed:focus{border-color:#1E2A78;box-shadow:0 0 0 3px rgba(30,42,120,.12)}' +
        '.fy-ed .hl-box{display:inline-block;border:2px solid #dc2626;background:#fff1f2;color:#b91c1c;border-radius:6px;padding:0 6px}.fy-ed .hl-blue{border-color:#2563eb;background:#eff6ff;color:#1d4ed8}.fy-ed .hl-mark{background:linear-gradient(transparent 55%,#fde047 55%)}.fy-ed .hl-red{color:#dc2626}' +
        '.fy-ed .hl-strike{text-decoration:line-through;text-decoration-color:#dc2626;text-decoration-thickness:2px}.fy-ed .hl-x{background:linear-gradient(to top right,transparent calc(50% - 1.5px),#dc2626 calc(50% - 1px),#dc2626 calc(50% + 1px),transparent calc(50% + 1.5px)),linear-gradient(to top left,transparent calc(50% - 1.5px),#dc2626 calc(50% - 1px),#dc2626 calc(50% + 1px),transparent calc(50% + 1.5px))}'; document.head.appendChild(st); }
      ["fy1", "fy2"].forEach(function (id) { var el = $(id); if (!el) return; el.addEventListener("paste", function (ev) { ev.preventDefault(); var t = (ev.clipboardData || window.clipboardData).getData("text"); document.execCommand("insertText", false, t); }); });
      document.onselectionchange = function () { var a = document.activeElement; if (a && a.isContentEditable && (a.id === "fy1" || a.id === "fy2")) { lastTa = a; decoBar(a); } };
      if ($("fyB")) $("fyB").addEventListener("input", function () {     // 박스 글을 쓰면 [박스] 칩이 저절로 켜짐 · 지우면 꺼짐
        var on = !!this.value.trim(); if (on === !!F.on.box) return; F.on.box = on;
        var ch = document.querySelector('[data-on="box"]'); if (ch) { ch.classList.toggle("on", on); ch.textContent = (on ? "✔ " : "") + ch.textContent.replace(/^✔ /, ""); }
        toast(on ? "✔ [박스]를 켰어요 — 박스 글이 홍보장에 나와요" : "박스 글이 비어서 [박스]를 껐어요"); });
      ["fy1", "fy2", "fyT", "fyB", "fyP", "fyOP"].forEach(function (id) { if ($(id)) { $(id).onfocus = function () { lastTa = this; }; ["select", "mouseup", "keyup", "touchend"].forEach(function (k) { $(id).addEventListener(k, function () { setTimeout(function () { decoBar($(id)); }, 30); }); }); $(id).addEventListener("blur", function () { setTimeout(function () { if (!document.activeElement || ["fy1", "fy2", "fyT", "fyB", "fyP", "fyOP"].indexOf(document.activeElement.id) < 0) hideBar(); }, 200); }); } });
      if ($("fyDrop")) $("fyDrop").onchange = function () { $("fyOP").style.display = this.checked ? "" : "none"; if (this.checked && !$("fyOP").value) { $("fyOP").value = $("fyP").value; $("fyOP").focus(); toast("내리기 전 가격을 적고, 하단 가격에는 새 가격을 적어 주세요."); } };
      Array.prototype.forEach.call(document.querySelectorAll("[data-on]"), function (b) { b.onclick = function () { read(); var k = b.getAttribute("data-on"); F.on[k] = !F.on[k]; if (k === "box" && F.on.box && !F.boxText) toast("박스 글 칸에 글을 써 주세요."); draw(); }; });
      Array.prototype.forEach.call(document.querySelectorAll("[data-n]"), function (b) { b.onclick = function () {
        read(); var k = Number(b.getAttribute("data-n")); F.count = k; F.on.photo = k > 0; F.photoH = PHOTO_H_BY[k]; F.bodySize = BODY_BY[k]; F.headSize = HEAD_BY[k]; F.footSize = FOOT_BY[k];
        if (F.photos.length > k && k) F.photos = F.photos.slice(0, k); draw(); }; });
      Array.prototype.forEach.call(document.querySelectorAll("#fyPh img"), function (im) { im.onclick = function () { read(); F.photos.splice(Number(im.getAttribute("data-x")), 1); draw(); }; });
      Array.prototype.forEach.call(document.querySelectorAll("#fySrc img"), function (im) { im.onclick = function () {
        read(); if (F.photos.length >= Number(F.count)) { toast("사진 " + F.count + "장을 다 골랐어요. 고른 사진을 눌러 빼고 넣으세요."); return; }
        F.photos.push(srcPhotos[Number(im.getAttribute("data-a"))]); draw(); }; });
      Array.prototype.forEach.call(document.querySelectorAll("[data-w]"), function (b) { b.onmousedown = function (ev) { ev.preventDefault(); }; b.onpointerdown = function (ev) { ev.preventDefault(); }; b.onclick = function () {
        var ta = lastTa || $("fy1"); if (!ta) return;
        deco(ta, b.getAttribute("data-w")); }; });
      Array.prototype.forEach.call(document.querySelectorAll("[data-s]"), function (b) { b.onclick = function () {
        read(); var S = SAMPLES.filter(function (x) { return x.name === b.getAttribute("data-s"); })[0]; if (!S) return;
        applySample(F, S, it); draw(); toast("‘" + S.name + "’ 샘플을 넣었어요. 글을 고치고 미리보기를 눌러 보세요."); }; });
      Array.prototype.forEach.call(document.querySelectorAll("[data-ph]"), function (b) { b.onclick = function () {
        var ta = lastTa || $("fy1"); if (!ta) return; var p = b.getAttribute("data-ph");
        if (ta.isContentEditable) { var dv = document.createElement("div"); dv.textContent = p; if (ta.textContent.trim()) ta.appendChild(dv); else ta.textContent = p; }
        else ta.value = ta.value.replace(/\s+$/, "") + (ta.value.trim() ? "\n" : "") + p;
        read(); toast("‘" + p + "’ 넣었어요."); }; });
      if ($("fyFile")) $("fyFile").onclick = function () { $("fyIn").click(); };
      $("fyIn").onchange = function () {
        read(); var files = Array.prototype.slice.call(this.files || []); var room = Number(F.count) - F.photos.length;
        if (room <= 0) { toast("사진 " + F.count + "장을 다 골랐어요. 고른 사진을 눌러 빼고 넣으세요."); return; }
        toast("사진 준비 중…");
        Promise.all(files.slice(0, room).map(function (f) { return fileToJpeg(f, 1600); })).then(function (a) { F.photos = F.photos.concat(a); draw(); }).catch(function (e) { toast(e.message); });
      };
      $("fyPrev").onclick = function () {
        read();
        var n = F.on.photo ? Number(F.count) : 0;
        if (n && F.photos.length < n) { toast("사진 " + n + "장을 골라 주세요. (지금 " + F.photos.length + "장)"); return; }
        preview(flyerHtml(F), "A4 홍보장 미리보기", flyerHtml(F, true));
      };
      $("fySave").onclick = function () {
        read(); var b = this; b.disabled = true; saveId = saveId || newId();
        saveDoc(saveId, F, "flyer").then(function () { b.disabled = false; toast("저장했어요. [홍보장 · 안내문]에서 다시 열 수 있어요."); })
          .catch(function (e) { b.disabled = false; toast(errText(e)); });
      };
    }
    nav("flyerEdit");
    draw();
    if (window.bpGuide) setTimeout(function () { bpGuide("flyer"); }, 600);
    if (it) listingPhotos(it).then(function (ph) {
      srcPhotos = ph;
      if (!F.photos.length && ph.length && Number(F.count)) F.photos = ph.slice(0, Number(F.count));
      if (document.getElementById("fyT")) { read(); draw(); }
    }).catch(function () {});
  };

  /* ---------- 📄 손님 안내문 (A4) ---------- */
  function guideHtml(G) {
    var o = (typeof OFFICE_INFO !== "undefined" && OFFICE_INFO) || {};
    var row = function (k, v) { return v ? '<tr><th>' + h(k) + '</th><td>' + h(v) + '</td></tr>' : ""; };
    var ph = (G.photos || []).slice(0, 4).map(function (s) { return '<img src="' + h(s) + '">'; }).join("");
    return '<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><title>매물 안내문</title><style>' +
      '@page{size:A4 portrait;margin:12mm}body{margin:0;font-family:"맑은 고딕","Malgun Gothic","Noto Sans KR",sans-serif;color:#0f172a;-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
      '.pg{max-width:186mm;margin:0 auto;padding:6mm 0}.hd{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #1E2A78;padding-bottom:6px}' +
      '.hd b{font-size:22pt;color:#1E2A78}.of{font-size:10pt;color:#475569;text-align:right}h1{font-size:18pt;margin:14px 0 4px}.pr{font-size:16pt;color:#dc2626;font-weight:800;margin-bottom:10px}' +
      'table{width:100%;border-collapse:collapse;font-size:11.5pt}th{width:28%;text-align:left;background:#F1F5F9;padding:7px 9px;border:1px solid #CBD5E1}td{padding:7px 9px;border:1px solid #CBD5E1}' +
      '.ph{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:12px}.ph img{width:100%;height:58mm;object-fit:cover;border-radius:4px;border:1px solid #CBD5E1}' +
      '.memo{margin-top:12px;border:1px dashed #94A3B8;border-radius:6px;padding:9px 11px;font-size:11pt;white-space:pre-wrap}.ft{margin-top:16px;font-size:10pt;color:#475569;border-top:1px solid #CBD5E1;padding-top:6px}' +
      '@media screen{body{background:#e5e7eb}.pg{background:#fff;padding:10mm;margin:10px auto;box-shadow:0 2px 10px rgba(0,0,0,.2)}}' +
      '</style></head><body><div class="pg"><div class="hd"><b>매물 안내</b><div class="of">' + h(o.name || "") + '<br>' + h([o.tel, o.mobile].filter(Boolean).join(" · ")) + '</div></div>' +
      '<h1>' + h(G.title) + '</h1><div class="pr">' + h(G.price) + '</div><table>' +
      row("주소", G.addr) + row("방 구조", G.room) + row("방향", G.dir) + row("관리비", G.mgmt) + row("입주 가능", G.movein) + row("주차", G.parking) +
      '</table>' + (ph ? '<div class="ph">' + ph + '</div>' : '') + (G.memo ? '<div class="memo">' + h(G.memo) + '</div>' : '') +
      '<div class="ft">' + h(o.name || "") + (o.addr ? ' · ' + h(o.addr) : '') + ' · 안내문의 내용은 계약 전 다시 확인해 주세요.</div></div></body></html>';
  }
  window.openGuide = function (it, G, saveId) {
    if (!G) {
      var dong = it && typeof dongOf === "function" ? dongOf(it) : "";
      G = { title: it ? it.name || "" : "", price: it ? (window.L17 ? L17.priceLine(it) : [it.deal_type, it.price].filter(Boolean).join(" ")) : "", addrFull: it ? it.location || "" : "",
            dong: dong, full: false, room: it ? it.room_structure || "" : "", dir: it ? it.direction || "" : "",
            mgmt: it && typeof mgmtText === "function" ? mgmtText(it) : "", movein: "", parking: "", memo: "", photos: [] };
    }
    saveId = saveId || null;
    var src = [];
    function draw() {
      var f = function (id, label, v) { return '<label for="' + id + '">' + label + '</label><input id="' + id + '" value="' + h(v || "") + '">'; };
      $("app").innerHTML = FY_CSS + '<div class="top"><button class="back" id="bk">← 뒤로</button><h2>📄 손님 안내문</h2></div>' +
        '<div class="howto">손님에게 건네거나 카톡으로 보내는 A4 한 장이에요. 칸을 고친 뒤 <b>👀 미리보기 → 🖨 인쇄</b>' + (IN_APP ? ' (와이파이 프린터 또는 <b>PDF로 저장</b>)' : '') + '. 사무소 이름·전화는 [내 사무소]에 적은 것이 들어가요.</div><div class="card">' +
        f("gT", "매물 이름", G.title) + f("gP", "가격", G.price) + f("gA", "주소", G.full ? G.addrFull : (G.dong || G.addrFull)) +
        '<label class="chk"><input type="checkbox" id="gFull"' + (G.full ? ' checked' : '') + '> 번지·호수까지 자세히 (끄면 동네만)</label>' +
        f("gR", "방 구조", G.room) + f("gD", "방향", G.dir) + f("gM", "관리비", G.mgmt) + f("gI", "입주 가능", G.movein) + f("gK", "주차", G.parking) +
        '<label for="gMemo">더 알려 줄 것</label><textarea id="gMemo" rows="3">' + h(G.memo) + '</textarea>' +
        '<label>사진 (최대 4장 · 누르면 빠짐)</label><div class="gal" id="gPh">' + G.photos.map(function (s, i) { return '<img src="' + h(s) + '" data-x="' + i + '">'; }).join("") + '</div>' +
        (src.length ? '<div class="hint">매물 사진 (누르면 추가)</div><div class="gal" id="gSrc">' + src.map(function (s, i) { return '<img src="' + h(s) + '" data-a="' + i + '">'; }).join("") + '</div>' : '') +
        '<div class="pbtns"><button class="pbtn" id="gFile">🖼 사진 고르기</button></div></div>' +
        '<button class="btn" id="gPrev">👀 미리보기' + (IN_APP ? '' : ' · 인쇄') + '</button><button class="btn ghost" id="gSave">💾 저장</button>' +
        '<input type="file" id="gIn" accept="image/*" multiple style="display:none">';
      $("bk").onclick = function () { history.back(); };
      $("gFull").onchange = function () { read(); G.full = this.checked; draw(); };
      Array.prototype.forEach.call(document.querySelectorAll("#gPh img"), function (im) { im.onclick = function () { read(); G.photos.splice(Number(im.getAttribute("data-x")), 1); draw(); }; });
      Array.prototype.forEach.call(document.querySelectorAll("#gSrc img"), function (im) { im.onclick = function () { read(); if (G.photos.length >= 4) { toast("사진은 4장까지예요."); return; } G.photos.push(src[Number(im.getAttribute("data-a"))]); draw(); }; });
      $("gFile").onclick = function () { $("gIn").click(); };
      $("gIn").onchange = function () { read(); var fs = Array.prototype.slice.call(this.files || []).slice(0, 4 - G.photos.length);
        Promise.all(fs.map(function (x) { return fileToJpeg(x, 1200); })).then(function (a) { G.photos = G.photos.concat(a); draw(); }).catch(function (e) { toast(e.message); }); };
      $("gPrev").onclick = function () { read(); var g = clone(G); g.addr = G.full ? G.addrFull : (G.dong || G.addrFull); preview(guideHtml(g), "손님 안내문 미리보기", guideHtml(g)); };
      $("gSave").onclick = function () { read(); var b = this; b.disabled = true; saveId = saveId || newId(); var g = clone(G); g.name = G.title;
        saveDoc(saveId, g, "guide").then(function () { b.disabled = false; toast("저장했어요."); }).catch(function (e) { b.disabled = false; toast(errText(e)); }); };
    }
    function read() {
      G.title = $("gT").value; G.price = $("gP").value;
      if (G.full) G.addrFull = $("gA").value; else G.dong = $("gA").value;
      G.room = $("gR").value; G.dir = $("gD").value; G.mgmt = $("gM").value; G.movein = $("gI").value; G.parking = $("gK").value; G.memo = $("gMemo").value;
    }
    nav("flyerEdit");
    draw();
    if (it) listingPhotos(it).then(function (ph) { src = ph; if (!G.photos.length) G.photos = ph.slice(0, 4); if ($("gT")) { read(); draw(); } }).catch(function () {});
  };

  window.BALPUM_FLYER = { flyerHtml: flyerHtml, guideHtml: guideHtml, markup: markup, plain: plain };
})();

/* PC 크롬: 바탕화면 아이콘(앱 설치)이 되게 — 안드로이드 앱 안에서는 안 씀 */
(function () {
  if (window.Capacitor || !("serviceWorker" in navigator) || location.protocol !== "https:") return;
  window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
})();
