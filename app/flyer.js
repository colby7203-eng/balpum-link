/* =====================================================================
   발품투어 매물장 — 📢 A4 광고 홍보장 · 📄 손님 안내문 (PC에서 인쇄, 핸드폰에서 만들고 저장)
   개발자판 PC 프로그램의 홍보장(상단 제목 · 사진 0/1/2/4장 · 본문 · 하단 가격 · 박스·빨간 글씨·형광펜)을 옮김
   Made by 정동철 · 상상을 현실로
   ===================================================================== */
(function () {
  "use strict";
  var IN_APP = !!window.Capacitor;              // 안드로이드 앱 안 (인쇄 대신 저장 → PC에서 인쇄)

  /* ---------- 꾸밈 표시 → HTML ---------- */
  var TOKENS = [
    ["{빨강}", "{/빨강}", '<span style="color:#dc2626">', "</span>"],
    ["{박스}", "{/박스}", '<span class="hl-box">', "</span>"],
    ["{파란박스}", "{/파란박스}", '<span class="hl-box hl-blue">', "</span>"],
    ["{형광}", "{/형광}", '<span class="hl-mark">', "</span>"]
  ];
  function h(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function markup(raw) {
    var s = h(raw || "");
    TOKENS.forEach(function (t) { s = s.split(h(t[0])).join(t[2]).split(h(t[1])).join(t[3]); });
    return s.replace(/\r?\n/g, "<br>");
  }
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
    var head = F.on.title ? '<div class="header-banner">' + h(F.title) + '</div>' : "";
    var foot = F.on.price ? '<div class="footer-price">' + h(F.price) + mark + '</div>' : (mark ? '<span class="hidmark hidmark-page">No.' + h(F.mark) + '</span>' : "");
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
      '.hidmark{position:absolute;right:2.5mm;bottom:1.2mm;font-size:9pt;font-weight:normal;opacity:.55}.hidmark-page{right:3mm;bottom:2mm;color:#64748b}' +
      '@media screen{body{background:#e5e7eb}.page-box{margin-top:10px;box-shadow:0 2px 10px rgba(0,0,0,.25)}}' +
      '</style></head><body><div class="page-box" id="pageBox">' + head + '<div class="content-area">' + boxAt("top") + content + boxAt("bottom") + '</div>' + foot + '</div>' +
      (forPrint ? '' : '<script>function fit(){var b=document.getElementById("pageBox");b.style.zoom=1;var z=Math.min(1,(innerHeight-20)/b.offsetHeight,(innerWidth-20)/b.offsetWidth);b.style.zoom=Math.max(.2,z)}' +
        'addEventListener("load",fit);addEventListener("resize",fit);addEventListener("beforeprint",function(){document.getElementById("pageBox").style.zoom=1});addEventListener("afterprint",fit);<\/script>') +
      '</body></html>';
  }

  /* ---------- 미리보기 · 인쇄 창 ---------- */
  function preview(html, title) {
    var ov = document.createElement("div");
    ov.id = "fyOv";
    ov.style.cssText = "position:fixed;inset:0;background:rgba(15,23,42,.75);z-index:9999;display:flex;flex-direction:column";
    ov.innerHTML = '<div style="display:flex;gap:8px;padding:10px;background:#1E2A78;align-items:center">' +
      '<b style="color:#fff;flex:1">' + h(title || "미리보기") + '</b>' +
      (IN_APP ? '<span style="color:#C7D2FE;font-size:13px">인쇄는 PC에서 해 주세요</span>' : '<button id="fyPrint" style="background:#F97316;color:#fff;border:0;border-radius:999px;padding:9px 16px;font-weight:800">🖨 인쇄 (A4)</button>') +
      '<button id="fyClose" style="background:#fff;border:0;border-radius:999px;padding:9px 14px;font-weight:700">닫기</button></div>' +
      '<iframe id="fyFrame" style="flex:1;border:0;background:#e5e7eb"></iframe>';
    document.body.appendChild(ov);
    var fr = document.getElementById("fyFrame");
    fr.srcdoc = html;
    document.getElementById("fyClose").onclick = function () { ov.remove(); };
    if (document.getElementById("fyPrint")) document.getElementById("fyPrint").onclick = function () {
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
    $("app").innerHTML = '<div class="top"><button class="back" id="bk">← 처음</button><h2>홍보장 · 안내문</h2></div>' +
      '<div class="card"><button class="btn" id="fyList">📋 매물 목록에서 골라 만들기</button>' +
      '<button class="btn ghost" id="fyNew">✏️ 바로 만들기 (사진·내용 직접)</button>' +
      '<div class="hint">' + (IN_APP ? '핸드폰에서 만들어 <b>저장</b>해 두고, PC에서 발품을 열어 <b>인쇄</b>하세요. 사진은 앨범의 원본에서 고르면 선명해요.'
                                       : '매물 사진은 핸드폰에서 작게 줄여 저장돼서 A4로 크게 뽑으면 흐릴 수 있어요. 선명하게 하려면 <b>PC의 원본 사진</b>을 고르세요.') + '</div></div>' +
      '<div class="sect">💾 저장한 홍보장 · 안내문</div><div id="fySaved"><div class="hint">불러오는 중…</div></div>';
    $("bk").onclick = function () { showHome(); };
    $("fyList").onclick = function () { toast("목록에서 매물을 누르고, 상세 화면의 [📢 홍보장] 또는 [📄 손님 안내문]을 누르세요."); showList(); };
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
  function defaults(it) {
    var mg = it && typeof mgmtText === "function" ? mgmtText(it) : "";
    var dong = it && typeof dongOf === "function" ? dongOf(it) : "";
    return {
      title: it ? (dong ? dong + " " : "") + (it.room_structure || it.name || "") : "",
      price: it ? [it.deal_type, it.price].filter(Boolean).join(" ") : "",
      t1: it ? [it.room_structure, it.direction ? it.direction + "향" : "", mg ? "관리비 " + mg : ""].filter(Boolean).join(" · ") : "",
      t2: "", boxText: "", boxBlue: false, boxAt: "middle",
      count: 1, photos: [], on: { title: true, photo: true, box: false, body: true, price: true },
      theme: "red_blue", border: "테마색", borderW: "보통", headSize: 54, bodySize: 24, footSize: 54, photoH: 100, fit: "cover", footColor: "navy",
      mark: it ? String(it.id) : ""
    };
  }
  var PHOTO_H_BY = { 0: 100, 1: 150, 2: 95, 4: 85 }, BODY_BY = { 0: 40, 1: 26, 2: 22, 4: 20 };

  window.openFlyer = function (it, F, saveId) {
    F = F || defaults(it);
    saveId = saveId || null;
    var srcPhotos = [];                                       // 매물에 있는 사진 (고를 수 있게)
    function draw() {
      var y = window.scrollY;
      var chip = function (k, label) { return '<button class="chip' + (F.on[k] ? ' on' : '') + '" data-on="' + k + '">' + (F.on[k] ? '✔ ' : '') + label + '</button>'; };
      var sel = function (id, cur, opts) { return '<select id="' + id + '">' + opts.map(function (o) { var v = o[0], t = o[1] || o[0]; return '<option value="' + h(v) + '"' + (String(cur) === String(v) ? ' selected' : '') + '>' + h(t) + '</option>'; }).join("") + '</select>'; };
      var n = Number(F.count);
      $("app").innerHTML = '<div class="top"><button class="back" id="bk">← 뒤로</button><h2>📢 A4 홍보장</h2></div>' +
        '<div class="card"><label>홍보장에 넣을 것</label><div class="stat">' + chip("title", "상단 제목") + chip("photo", "사진") + chip("box", "박스 글") + chip("body", "본문") + chip("price", "하단 가격") + '</div>' +
        '<label for="fyT">상단 제목</label><input id="fyT" value="' + h(F.title) + '">' +
        '<label>사진 매수</label><div class="stat">' + [0, 1, 2, 4].map(function (k) { return '<button class="chip' + (n === k ? ' on' : '') + '" data-n="' + k + '">' + (k ? k + "장" : "사진 없이") + '</button>'; }).join("") + '</div>' +
        (n ? '<div class="hint">고른 사진 ' + F.photos.length + ' / ' + n + '장 — 사진을 누르면 빠져요</div><div class="gal" id="fyPh">' +
          F.photos.map(function (s, i) { return '<img src="' + h(s) + '" data-x="' + i + '" alt="고른 사진">'; }).join("") + '</div>' +
          '<div class="pbtns"><button class="pbtn" id="fyFile">🖼 ' + (IN_APP ? '앨범에서 (원본)' : 'PC 사진 고르기 (원본)') + '</button></div>' +
          (srcPhotos.length ? '<div class="hint">매물 사진 (작게 저장된 것 · 누르면 추가)</div><div class="gal" id="fySrc">' + srcPhotos.map(function (s, i) { return '<img src="' + h(s) + '" data-a="' + i + '" alt="매물 사진">'; }).join("") + '</div>' : '') : '') +
        '<label for="fyB">박스 글 <span class="hint">(통째로 박스 안에)</span></label><input id="fyB" value="' + h(F.boxText) + '">' +
        '<div class="two">' + sel("fyBA", F.boxAt, [["top", "박스: 맨 위"], ["middle", "박스: 가운데"], ["bottom", "박스: 맨 아래"]]) + sel("fyBC", F.boxBlue ? "1" : "", [["", "빨간 박스"], ["1", "파란 박스"]]) + '</div>' +
        '<label for="fy1">' + (n === 4 ? '본문 (위 사진 아래)' : n === 2 ? '본문 (첫 사진 아래)' : '본문') + '</label><textarea id="fy1" rows="4">' + h(F.t1) + '</textarea>' +
        (n === 2 || n === 4 ? '<label for="fy2">본문 (' + (n === 4 ? '아래 사진 아래' : '둘째 사진 아래') + ')</label><textarea id="fy2" rows="3">' + h(F.t2) + '</textarea>' : '') +
        '<div class="hint">글자를 길게 눌러 고른 뒤 꾸미기: </div><div class="stat"><button class="chip" data-w="빨강">빨간 글씨</button><button class="chip" data-w="박스">빨간 박스</button><button class="chip" data-w="파란박스">파란 박스</button><button class="chip" data-w="형광">형광펜</button></div>' +
        '<label for="fyP">하단 가격</label><input id="fyP" value="' + h(F.price) + '">' +
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
      F.title = v("fyT"); F.boxText = v("fyB"); F.boxAt = v("fyBA"); F.boxBlue = v("fyBC") === "1"; F.t1 = v("fy1");
      if ($("fy2")) F.t2 = v("fy2");
      F.price = v("fyP"); F.theme = v("fyTh"); F.footColor = v("fyFC"); F.border = v("fyBo"); F.borderW = v("fyBW"); F.fit = v("fyFit");
      F.photoH = Number(v("fyPH")) || 100; F.headSize = Number(v("fyHS")) || 54; F.bodySize = Number(v("fyBS")) || 24; F.footSize = Number(v("fyFS")) || 54;
      if (!$("fyMk").checked) F.mark = ""; else if (!F.mark) F.mark = it ? String(it.id) : "";
    }
    var lastTa = null;
    function bind() {
      $("bk").onclick = function () { history.back(); };
      ["fy1", "fy2"].forEach(function (id) { if ($(id)) $(id).onfocus = function () { lastTa = this; }; });
      Array.prototype.forEach.call(document.querySelectorAll("[data-on]"), function (b) { b.onclick = function () { read(); var k = b.getAttribute("data-on"); F.on[k] = !F.on[k]; if (k === "box" && F.on.box && !F.boxText) toast("박스 글 칸에 글을 써 주세요."); draw(); }; });
      Array.prototype.forEach.call(document.querySelectorAll("[data-n]"), function (b) { b.onclick = function () {
        read(); var k = Number(b.getAttribute("data-n")); F.count = k; F.on.photo = k > 0; F.photoH = PHOTO_H_BY[k]; F.bodySize = BODY_BY[k];
        if (F.photos.length > k && k) F.photos = F.photos.slice(0, k); draw(); }; });
      Array.prototype.forEach.call(document.querySelectorAll("#fyPh img"), function (im) { im.onclick = function () { read(); F.photos.splice(Number(im.getAttribute("data-x")), 1); draw(); }; });
      Array.prototype.forEach.call(document.querySelectorAll("#fySrc img"), function (im) { im.onclick = function () {
        read(); if (F.photos.length >= Number(F.count)) { toast("사진 " + F.count + "장을 다 골랐어요. 고른 사진을 눌러 빼고 넣으세요."); return; }
        F.photos.push(srcPhotos[Number(im.getAttribute("data-a"))]); draw(); }; });
      Array.prototype.forEach.call(document.querySelectorAll("[data-w]"), function (b) { b.onclick = function () {
        var ta = lastTa || $("fy1"); if (!ta) return;
        var w = b.getAttribute("data-w"), s = ta.selectionStart, e = ta.selectionEnd;
        if (s === e) { toast("꾸밀 글자를 먼저 골라(길게 눌러) 주세요."); return; }
        ta.value = ta.value.slice(0, s) + "{" + w + "}" + ta.value.slice(s, e) + "{/" + w + "}" + ta.value.slice(e);
        toast("꾸몄어요. 미리보기로 확인하세요."); }; });
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
        preview(flyerHtml(F), "A4 홍보장 미리보기");
      };
      $("fySave").onclick = function () {
        read(); var b = this; b.disabled = true; saveId = saveId || newId();
        saveDoc(saveId, F, "flyer").then(function () { b.disabled = false; toast("저장했어요. [홍보장 · 안내문]에서 다시 열 수 있어요."); })
          .catch(function (e) { b.disabled = false; toast(errText(e)); });
      };
    }
    nav("flyerEdit");
    draw();
    if (it) listingPhotos(it).then(function (ph) {
      srcPhotos = ph;
      if (!F.photos.length && ph.length) F.photos = ph.slice(0, Number(F.count) || 1);
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
      G = { title: it ? it.name || "" : "", price: it ? [it.deal_type, it.price].filter(Boolean).join(" ") : "", addrFull: it ? it.location || "" : "",
            dong: dong, full: false, room: it ? it.room_structure || "" : "", dir: it ? it.direction || "" : "",
            mgmt: it && typeof mgmtText === "function" ? mgmtText(it) : "", movein: "", parking: "", memo: "", photos: [] };
    }
    saveId = saveId || null;
    var src = [];
    function draw() {
      var f = function (id, label, v) { return '<label for="' + id + '">' + label + '</label><input id="' + id + '" value="' + h(v || "") + '">'; };
      $("app").innerHTML = '<div class="top"><button class="back" id="bk">← 뒤로</button><h2>📄 손님 안내문</h2></div><div class="card">' +
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
      $("gPrev").onclick = function () { read(); var g = clone(G); g.addr = G.full ? G.addrFull : (G.dong || G.addrFull); preview(guideHtml(g), "손님 안내문 미리보기"); };
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
