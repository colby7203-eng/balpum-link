/* =====================================================================
   발품투어 매물장 v1.4 — 🤝 발품 공유방 1단계 · "더하기 빼기 잘하는게 매너다"
   · 같은 동네(○○동) 부동산끼리만: 이런 손님 있어요 / 이런 물건 있어요
   · 같이 하기 신청 → 글쓴 사무소가 [같이 하기] 하면 서로 전화번호가 보여요
   · 역할표 · 추천 비율(30~70%) · 거래 끝나면 서로 칭찬 점수
   Made by 정동철 · 상상을 현실로
   ===================================================================== */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  function e(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function say(t) { if (window.toast) window.toast(t); }
  function msgOf(er) { return (er && er.message) || String(er || "오류"); }
  function go(v) { if (typeof nav === "function") nav(v); window.scrollTo(0, 0); }
  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }
  function when(t) { var d = new Date(t), n = new Date(), days = Math.floor((n - d) / 864e5); return days <= 0 ? (d.getHours() + ":" + ("0" + d.getMinutes()).slice(-2)) : days < 7 ? days + "일 전" : (d.getMonth() + 1) + "/" + d.getDate(); }
  function stars(sc) { sc = sc || {}; return sc.n ? '<span class="sh-sc">★ ' + e(sc.avg) + ' <small>(' + e(sc.n) + ')</small></span>' : '<span class="sh-sc new">새 사무소</span>'; }

  var CSS = '<style>' +
    '.sh-hd{margin:-14px -14px 12px;padding:14px 14px 12px;background:var(--navy,#1E2A78);color:#fff;border-radius:0 0 20px 20px;display:grid;gap:6px}' +
    '.sh-hd .r{display:flex;align-items:center;gap:8px}.sh-hd .r h2{margin:0;flex:1;font-size:19px}.sh-hd .bk{border:0;background:rgba(255,255,255,.15);color:#fff;border-radius:12px;padding:8px 11px;font:700 14px "Noto Sans KR",sans-serif;cursor:pointer}' +
    '.sh-hd .mn{font-family:"Nanum Brush Script","Noto Sans KR",sans-serif;font-size:26px;color:#FFD23F;text-align:center;line-height:1}' +
    '.sh-hd .dg{display:flex;justify-content:center;gap:8px;align-items:center;font-size:13px}.sh-hd .dg b{background:#fff;color:#1E2A78;border-radius:999px;padding:3px 12px}.sh-hd .dg button{border:1px solid rgba(255,255,255,.5);background:transparent;color:#fff;border-radius:999px;padding:3px 10px;font:600 12px "Noto Sans KR",sans-serif;cursor:pointer}' +
    '.sh-tabs{display:flex;gap:4px;background:#E2E8F0;border-radius:12px;padding:3px;margin-bottom:10px}.sh-tabs button{flex:1;border:0;background:transparent;border-radius:10px;padding:9px 2px;font:700 13.5px "Noto Sans KR",sans-serif;color:#64748B;cursor:pointer}.sh-tabs button.on{background:#fff;color:#0F172A;box-shadow:0 1px 3px rgba(0,0,0,.12)}' +
    '.sh-add{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px}.sh-add button{border:0;border-radius:14px;padding:12px 6px;font:800 14.5px "Noto Sans KR",sans-serif;cursor:pointer}.sh-add .c{background:#EEF2FF;color:#1E2A78}.sh-add .i{background:#FFF7ED;color:#9A3412}' +
    '.sh-p{background:#fff;border:1px solid #E2E8F0;border-radius:16px;padding:12px 14px;margin-bottom:10px;display:grid;gap:6px}' +
    '.sh-p .pt{display:flex;gap:6px;align-items:center;flex-wrap:wrap}.sh-k{font:800 12px "Noto Sans KR",sans-serif;border-radius:999px;padding:2px 9px}.sh-k.c{background:#EEF2FF;color:#1E2A78}.sh-k.i{background:#FFF7ED;color:#9A3412}' +
    '.sh-st{font:700 11.5px "Noto Sans KR",sans-serif;color:#64748B;margin-left:auto}.sh-st.go{color:#15803D}.sh-st.end{color:#94A3B8}' +
    '.sh-p .t{font-weight:800;font-size:16px}.sh-p .d{font-size:13.5px;color:#334155;line-height:1.55}.sh-p .o{font-size:12.5px;color:#64748B;display:flex;gap:8px;align-items:center;flex-wrap:wrap}' +
    '.sh-sc{color:#B45309;font-weight:800}.sh-sc small{color:#94A3B8;font-weight:500}.sh-sc.new{color:#64748B;font-weight:600}' +
    '.sh-btns{display:flex;gap:6px;flex-wrap:wrap}.sh-btns button,.sh-btns a{border:1px solid #CBD5E1;background:#fff;border-radius:999px;padding:7px 12px;font:700 13px "Noto Sans KR",sans-serif;cursor:pointer;color:#0F172A;text-decoration:none}' +
    '.sh-btns .pr{background:#1E2A78;color:#fff;border-color:#1E2A78}.sh-btns .ok{background:#15803D;color:#fff;border-color:#15803D}' +
    '.sh-rq{border-top:1px dashed #E2E8F0;padding-top:8px;display:grid;gap:6px}.sh-rq .one{background:#F8FAFC;border-radius:12px;padding:8px 10px;font-size:13.5px}' +
    '.sh-rule{font-size:14px;line-height:1.65;color:#1E293B}.sh-rule h3{font-size:15.5px;margin:12px 0 4px}.sh-rule table{width:100%;border-collapse:collapse;font-size:13.5px}.sh-rule td,.sh-rule th{border-bottom:1px solid #E2E8F0;padding:7px 4px;text-align:left;vertical-align:top}' +
    '.sh-calc{display:grid;grid-template-columns:1fr auto auto;gap:4px 10px;align-items:center;font-size:13.5px}.sh-calc .h{font-weight:800;color:#64748B;font-size:12px}.sh-calc input{width:20px;height:20px}' +
    '.sh-res{display:flex;gap:6px;margin-top:10px}.sh-res div{flex:1;border-radius:12px;padding:10px;text-align:center;font-weight:800}.sh-res .a{background:#EEF2FF;color:#1E2A78}.sh-res .b{background:#FFF7ED;color:#9A3412}.sh-res b{display:block;font-size:24px}' +
    '.sh-star{display:flex;gap:4px}.sh-star button{border:0;background:transparent;font-size:28px;cursor:pointer;color:#CBD5E1;padding:0 2px}.sh-star button.on{color:#F59E0B}' +
    '</style>';
  function app(h) { $("app").innerHTML = CSS + h; }
  var S = { tab: "feed", me: null };

  function head() {
    return '<div class="sh-hd"><div class="r"><button class="bk" id="shBk">← 처음</button><h2>🤝 발품 공유방</h2></div>' +
      '<div class="mn">더하기 빼기 잘하는게 매너다</div>' +
      '<div class="dg">📍 <b>' + e((S.me && S.me.dong) || "동네 정하기") + '</b> 부동산끼리만 <button type="button" id="shDg">바꾸기</button></div></div>' +
      '<div class="sh-tabs">' + [["feed", "우리 동네 글"], ["my", "내 글 · 신청"], ["rule", "룰 · 역할표"]].map(function (t) { return '<button type="button" data-tab="' + t[0] + '" class="' + (S.tab === t[0] ? "on" : "") + '">' + t[1] + '</button>'; }).join("") + '</div>';
  }
  function bindHead() {
    $("shBk").onclick = function () { showHome(); };
    $("shDg").onclick = dongPage;
    each("[data-tab]", function (b) { b.onclick = function () { S.tab = b.getAttribute("data-tab"); render(); }; });
  }

  window.showShare = function (fromHist) {
    if (!fromHist) go("share");
    app('<div class="loading">공유방 여는 중…</div>');
    BALPUM.Share.me().then(function (m) { S.me = m || {}; if (!S.me.dong) dongPage(true); else render(); })
      .catch(function (er) { app('<div class="card"><div class="err">' + e(msgOf(er)) + '</div><button class="btn" onclick="showHome()">처음으로</button></div>'); });
  };
  function render() { S.tab === "my" ? myPage() : S.tab === "rule" ? rulePage() : feedPage(); }

  /* ---------- 동네 정하기 ---------- */
  function dongPage(first) {
    app(head() + '<div class="card"><div class="sect" style="margin-top:0">📍 우리 동네</div>' +
      '<div class="hint" style="margin-top:0">공유방은 <b>같은 동네 부동산끼리만</b> 보여요. 사무소 주소에서 동을 찾아 넣었어요. 다르면 고쳐 주세요.' + (S.me && S.me.addr ? '<br>사무소 주소: ' + e(S.me.addr) : '') + '</div>' +
      '<label for="shD">동 이름</label><input id="shD" value="' + e((S.me && S.me.dong) || "") + '" placeholder="예) 검암동">' +
      '<button class="btn" id="shDs">이 동네로 정하기</button>' + (first ? '' : '<button class="btn ghost" id="shDc">취소</button>') +
      '<div class="hint">여러 동네로 넓히는 것은 다음 업데이트에서 해요.</div></div>');
    bindHead();
    if ($("shDc")) $("shDc").onclick = render;
    $("shDs").onclick = function () { var v = $("shD").value.trim(); if (!v) { say("동 이름을 넣어 주세요."); return; }
      BALPUM.Share.setDong(v).then(function (d) { S.me.dong = String(d || "").replace(/"/g, ""); say("📍 " + S.me.dong + " 공유방이에요."); S.tab = "feed"; render(); }).catch(function (er) { say(msgOf(er)); }); };
  }

  /* ---------- 우리 동네 글 ---------- */
  function detail(p) {
    var b = p.body || {};
    return p.kind === "cust" ? [b.deal, b.area, b.room, b.budget, b.when].filter(Boolean).join(" · ") + (b.memo ? '<br>' + e(b.memo) : '')
      : [b.deal, b.where, b.room, b.price, b.when].filter(Boolean).join(" · ") + (b.memo ? '<br>' + e(b.memo) : '');
  }
  function stCls(s) { return s === "같이 하는 중" ? "go" : s === "끝" ? "end" : ""; }
  function feedPage() {
    app(head() + '<div class="sh-add"><button type="button" class="c" id="shAc">＋ 이런 손님 있어요</button><button type="button" class="i" id="shAi">＋ 이런 물건 있어요</button></div><div id="shF"><div class="loading">불러오는 중…</div></div>');
    bindHead();
    $("shAc").onclick = function () { postPage("cust"); }; $("shAi").onclick = function () { postPage("item"); };
    BALPUM.Share.feed().then(function (list) {
      $("shF").innerHTML = list.length ? list.map(function (p) {
        var b = p.body || {};
        return '<div class="sh-p"><div class="pt"><span class="sh-k ' + (p.kind === "cust" ? "c" : "i") + '">' + (p.kind === "cust" ? "🙋 손님 있어요" : "🏠 물건 있어요") + '</span><span class="sh-st ' + stCls(p.status) + '">' + e(p.status) + ' · ' + when(p.created_at) + '</span></div>' +
          '<div class="t">' + e(p.title) + '</div><div class="d">' + detail(p) + '</div>' +
          '<div class="o">🏢 ' + e(p.office || "부동산") + ' ' + stars(p.score) + (p.reqs ? ' · 신청 ' + e(p.reqs) : '') + '</div>' +
          '<div class="sh-btns">' + (p.mine ? '<span class="hint" style="margin:0">내 글이에요 · [내 글 · 신청]에서 관리</span>'
            : p.my_req === "같이 하기" ? (p.tel ? '<a class="ok" href="tel:' + e(String(p.tel).replace(/[^\d+]/g, "")) + '">📞 ' + e(p.tel) + '</a>' : '') + '<span class="hint" style="margin:0">같이 하기로 했어요</span>'
            : p.my_req === "신청" ? '<span class="hint" style="margin:0">신청했어요 · 답을 기다리는 중</span>'
            : p.status === "끝" ? '' : '<button type="button" class="pr" data-req="' + e(p.id) + '">🤝 같이 하기 신청</button>') + '</div>' +
          '<div id="rq' + e(p.id) + '"></div></div>';
      }).join("") : '<div class="card"><div class="hint" style="margin:0">아직 ' + e(S.me.dong) + ' 공유방에 글이 없어요. 첫 글을 올려 보세요.<br>자기 물건 · 자기 손님 거래는 네이버 · 직방 · 다방으로 충분해요. 여기는 <b>같이 하면 되는 것</b>만 올려요.</div></div>';
      each("[data-req]", function (b) { b.onclick = function () { var id = b.getAttribute("data-req"), box = $("rq" + id);
        box.innerHTML = '<div class="sh-rq"><label for="rm' + id + '">한마디 (예: 매수 손님 있어요, 대출 안내 제가 할게요)</label><textarea id="rm' + id + '" rows="2" enterkeyhint="send"></textarea><div class="sh-btns"><button type="button" class="pr" id="rs' + id + '">신청 보내기</button></div></div>';
        $("rs" + id).onclick = function () { BALPUM.Share.req(+id, $("rm" + id).value.trim()).then(function () { say("신청했어요. 글쓴 사무소가 [같이 하기]를 누르면 전화번호가 보여요."); feedPage(); }).catch(function (er) { say(msgOf(er)); }); }; }; });
    }).catch(function (er) { $("shF").innerHTML = '<div class="err">' + e(msgOf(er)) + '</div>'; });
  }

  /* ---------- 글 올리기 ---------- */
  function postPage(kind) {
    var P = { deal: "" }, cust = kind === "cust";
    app(head() + '<div class="card"><div class="sect" style="margin-top:0">' + (cust ? "🙋 이런 손님 있어요" : "🏠 이런 물건 있어요") + '</div>' +
      '<label>거래</label><div class="rm-pick" id="shK">' + (cust ? ["매매", "전세", "월세", "상가·사무실"] : ["매매", "전세", "월세", "상가·사무실"]).map(function (t) { return '<button type="button" data-v="' + t + '" style="border:1px solid #CBD5E1;background:#fff;border-radius:999px;padding:8px 12px;font:600 14px \'Noto Sans KR\',sans-serif;margin:0 6px 6px 0">' + t + '</button>'; }).join("") + '</div>' +
      '<label for="shT">제목 *</label><input id="shT" placeholder="' + (cust ? "예) 검암역 투룸 전세 찾는 신혼부부" : "예) 검암동 신축 투룸 전세 2억") + '">' +
      (cust ? '<label for="sh1">지역 · 조건</label><input id="sh1" placeholder="예) 검암역 도보 10분, 주차 필수"><label for="sh2">방 · 크기</label><input id="sh2" placeholder="예) 방2 이상"><label for="sh3">예산</label><input id="sh3" placeholder="예) 전세 2억 안쪽, LH 가능"><label for="sh4">입주 시기</label><input id="sh4" placeholder="예) 2월 말">'
        : '<label for="sh1">위치</label><input id="sh1" placeholder="예) 검암동 ○○빌라 (동·호수는 같이 하기 뒤에)"><label for="sh2">구조</label><input id="sh2" placeholder="예) 방2 화1, 22평"><label for="sh3">가격</label><input id="sh3" placeholder="예) 전세 2억 / 협의 가능"><label for="sh4">입주 가능</label><input id="sh4" placeholder="예) 즉시">') +
      '<label for="sh5">더 알릴 것</label><textarea id="sh5" rows="2" placeholder="' + (cust ? "예) 대출 상담은 제가 해요" : "예) 집주인 급해요, 사진 있어요") + '"></textarea>' +
      '<div class="hint">손님 이름 · 전화번호는 올리지 마세요. 같이 하기가 되면 사무소끼리 전화로 이어 가요.</div>' +
      '<button class="btn" id="shGo">올리기</button><button class="btn ghost" id="shCc">취소</button></div>');
    bindHead();
    each("#shK button", function (b) { b.onclick = function () { P.deal = b.getAttribute("data-v"); each("#shK button", function (x) { var on = x === b; x.style.background = on ? "#1E2A78" : "#fff"; x.style.color = on ? "#fff" : ""; }); }; });
    $("shCc").onclick = function () { S.tab = "feed"; render(); };
    $("shGo").onclick = function () { var v = function (id) { return $(id).value.trim(); }, t = v("shT"); if (!t) { say("제목을 적어 주세요."); return; }
      var body = cust ? { deal: P.deal, area: v("sh1"), room: v("sh2"), budget: v("sh3"), when: v("sh4"), memo: v("sh5") } : { deal: P.deal, where: v("sh1"), room: v("sh2"), price: v("sh3"), when: v("sh4"), memo: v("sh5") };
      var b = this; b.disabled = true;
      BALPUM.Share.post(kind, t, body).then(function () { say("올렸어요. " + S.me.dong + " 부동산들에게 보여요."); S.tab = "feed"; render(); }).catch(function (er) { b.disabled = false; say(msgOf(er)); }); };
  }

  /* ---------- 내 글 · 신청 ---------- */
  function rateBox(pid, to, label) {
    return '<div class="sh-rq" id="rt' + pid + '_' + to.slice(0, 8) + '"><b style="font-size:13.5px">⭐ ' + e(label) + '에게 칭찬 점수</b><div class="sh-star" data-pid="' + pid + '" data-to="' + e(to) + '">' + [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" data-n="' + n + '" aria-label="' + n + '점">★</button>'; }).join("") + '</div>' +
      '<input class="shRn" placeholder="한마디 (예: 대출 안내 꼼꼼했어요)"><div class="sh-btns"><button type="button" class="pr shRs">점수 주기</button></div></div>';
  }
  function bindRate() {
    each(".sh-star", function (box) { var n = 0, wrap = box.parentNode;
      Array.prototype.forEach.call(box.querySelectorAll("button"), function (b) { b.onclick = function () { n = +b.getAttribute("data-n"); Array.prototype.forEach.call(box.querySelectorAll("button"), function (x) { x.classList.toggle("on", +x.getAttribute("data-n") <= n); }); }; });
      wrap.querySelector(".shRs").onclick = function () { if (!n) { say("별을 눌러 점수를 골라 주세요."); return; }
        BALPUM.Share.rate(+box.getAttribute("data-pid"), box.getAttribute("data-to"), n, wrap.querySelector(".shRn").value.trim()).then(function () { say("칭찬 점수를 줬어요. 고마워요!"); myPage(); }).catch(function (er) { say(msgOf(er)); }); };
    });
  }
  function myPage() {
    app(head() + '<div id="shM"><div class="loading">불러오는 중…</div></div>');
    bindHead();
    BALPUM.Share.my().then(function (r) {
      var posts = r.posts || [], sent = r.sent || [];
      var h = '<div class="rm-sect" style="font-weight:800;margin:4px 2px 8px">📝 내가 올린 글 ' + posts.length + '</div>';
      h += posts.length ? posts.map(function (p) {
        var rated = p.rated || [], acc = (p.reqs || []).filter(function (q) { return q.status === "같이 하기"; });
        return '<div class="sh-p"><div class="pt"><span class="sh-k ' + (p.kind === "cust" ? "c" : "i") + '">' + (p.kind === "cust" ? "🙋 손님" : "🏠 물건") + '</span><span class="sh-st ' + stCls(p.status) + '">' + e(p.status) + ' · ' + when(p.created_at) + '</span></div>' +
          '<div class="t">' + e(p.title) + '</div><div class="d">' + detail(p) + '</div>' +
          '<div class="sh-rq">' + ((p.reqs || []).length ? p.reqs.map(function (q) {
            return '<div class="one">🏢 <b>' + e(q.office || "부동산") + '</b> ' + stars(q.score) + (q.msg ? '<br>' + e(q.msg) : '') +
              '<div class="sh-btns" style="margin-top:6px">' + (q.status === "신청" ? '<button type="button" class="ok" data-ans="' + e(q.id) + '" data-st="같이 하기">🤝 같이 하기</button><button type="button" data-ans="' + e(q.id) + '" data-st="거절">거절</button>'
                : q.status === "같이 하기" ? (q.tel ? '<a class="ok" href="tel:' + e(String(q.tel).replace(/[^\d+]/g, "")) + '">📞 ' + e(q.tel) + '</a>' : '') + '<span class="hint" style="margin:0">같이 하는 중</span>' : '<span class="hint" style="margin:0">거절함</span>') + '</div></div>';
          }).join("") : '<div class="hint" style="margin:0">아직 신청이 없어요.</div>') + '</div>' +
          (p.status === "끝" ? acc.filter(function (q) { return rated.indexOf(q.from) < 0; }).map(function (q) { return rateBox(p.id, q.from, q.office || "부동산"); }).join("") : '') +
          '<div class="sh-btns">' + (p.status !== "끝" ? '<button type="button" data-end="' + e(p.id) + '">✅ 거래 끝 (점수 주기)</button>' : '') + '<button type="button" data-del="' + e(p.id) + '">🗑 글 내리기</button></div></div>';
      }).join("") : '<div class="hint">아직 올린 글이 없어요.</div>';
      h += '<div class="rm-sect" style="font-weight:800;margin:14px 2px 8px">🤝 내가 한 신청 ' + sent.length + '</div>';
      h += sent.length ? sent.map(function (q) {
        return '<div class="sh-p"><div class="pt"><span class="sh-k ' + (q.kind === "cust" ? "c" : "i") + '">' + (q.kind === "cust" ? "🙋 손님" : "🏠 물건") + '</span><span class="sh-st ' + (q.status === "같이 하기" ? "go" : "") + '">' + e(q.status) + '</span></div>' +
          '<div class="t">' + e(q.title) + '</div><div class="o">🏢 ' + e(q.office || "부동산") + (q.tel ? ' · <a href="tel:' + e(String(q.tel).replace(/[^\d+]/g, "")) + '">📞 ' + e(q.tel) + '</a>' : '') + '</div>' +
          (q.status === "같이 하기" && q.post_status === "끝" && !q.rated ? rateBox(q.post, q.owner, q.office || "부동산") : '') + '</div>';
      }).join("") : '<div class="hint">아직 신청한 글이 없어요.</div>';
      $("shM").innerHTML = h;
      each("[data-ans]", function (b) { b.onclick = function () { BALPUM.Share.answer(+b.getAttribute("data-ans"), b.getAttribute("data-st")).then(function () { say(b.getAttribute("data-st") === "거절" ? "거절했어요." : "같이 하기로 했어요. 이제 서로 전화번호가 보여요."); myPage(); }).catch(function (er) { say(msgOf(er)); }); }; });
      each("[data-end]", function (b) { b.onclick = function () { BALPUM.Share.status(+b.getAttribute("data-end"), "끝").then(function () { say("거래 끝! 같이 한 사무소에게 칭찬 점수를 주세요."); myPage(); }).catch(function (er) { say(msgOf(er)); }); }; });
      each("[data-del]", function (b) { b.onclick = function () { if (!confirm("이 글을 내릴까요? 신청 · 점수도 같이 지워져요.")) return; BALPUM.Share.del(+b.getAttribute("data-del")).then(function () { say("내렸어요."); myPage(); }).catch(function (er) { say(msgOf(er)); }); }; });
      bindRate();
    }).catch(function (er) { $("shM").innerHTML = '<div class="err">' + e(msgOf(er)) + '</div>'; });
  }

  /* ---------- 룰 · 역할표 · 추천 비율 ---------- */
  var ROLES = [["손님을 데려옴", 3], ["물건을 가져옴", 3], ["집 보여 주기 · 안내", 1], ["집주인 설득해 가격 조율 성사", 2], ["보수를 더 받아 냄", 1], ["계약서 작성", 1], ["대출 안내", 1], ["법무 · 등기 진행", 1]];
  function rulePage() {
    app(head() + '<div class="card sh-rule">' +
      '<h3 style="margin-top:0">📜 기본 룰</h3><ul style="margin:0;padding-left:18px">' +
      '<li>앱은 <b>금액이 아니라 비율(룰)</b>만 알려 줘요. 두 사무소가 따로 합의하면 그대로 가요.</li>' +
      '<li>몫은 역할대로 <b>최저 30% ~ 최고 70%</b>. 물건만 보여 줘도, 손님만 연결해도 30%는 지켜요.</li>' +
      '<li><b>계약서는 손님을 데려온 쪽</b>이 써요.</li>' +
      '<li>대출 안내 · 등기는 먼저 <b>손님(매수인) 쪽</b> 몫. 조건을 못 맞춰 상대에게 넘기면 상대가 해요.</li>' +
      '<li>물건 쪽이 집주인을 설득해 원래 가격보다 싸게 성사시키면 점수를 더 줘요. 손님이 깎지 않고 사면 그대로.</li>' +
      '<li>보호기간 중 손님이 직접 찾아와도 돌려보내지 말고 첫 부동산에 알려요. 다른 물건으로 계약해도 역할표대로 나눠요.</li>' +
      '<li>자기 물건 · 자기 손님 거래는 공유방에서 빼요. 그건 네이버 · 직방 · 다방 · 피터팬으로 충분해요.</li>' +
      '<li>칭찬 점수가 낮은 사무소는 앱이 알아서 공유방을 멈춰요 (다음 업데이트). 사람끼리 따돌릴 일이 없게요.</li></ul>' +
      '<h3>🧮 추천 비율 계산</h3><div class="hint" style="margin-top:0">한 일에 체크하면 앱이 추천 비율을 보여 줘요 (30~70%).</div>' +
      '<div class="sh-calc"><span class="h">역할</span><span class="h">우리</span><span class="h">상대</span>' +
      ROLES.map(function (r, i) { return '<span>' + r[0] + ' <small class="hint" style="margin:0">(' + r[1] + '점)</small></span><input type="checkbox" data-a="' + i + '"' + (i === 0 ? " checked" : "") + ' aria-label="우리 ' + r[0] + '"><input type="checkbox" data-b="' + i + '"' + (i === 1 ? " checked" : "") + ' aria-label="상대 ' + r[0] + '">'; }).join("") + '</div>' +
      '<div class="sh-res"><div class="a">우리<b id="shRa">50%</b></div><div class="b">상대<b id="shRb">50%</b></div></div>' +
      '<div class="hint">이 비율은 앱이 드리는 추천이에요. 두 사무소가 합의하면 그대로 가요.</div></div>');
    bindHead();
    var calc = function () { var a = 0, b = 0; each("[data-a]", function (c) { if (c.checked) a += ROLES[+c.getAttribute("data-a")][1]; }); each("[data-b]", function (c) { if (c.checked) b += ROLES[+c.getAttribute("data-b")][1]; });
      var p = a + b ? Math.round(a / (a + b) * 100) : 50; p = Math.max(30, Math.min(70, p)); $("shRa").textContent = p + "%"; $("shRb").textContent = (100 - p) + "%"; };
    each(".sh-calc input", function (c) { c.onchange = calc; }); calc();
  }

  window.SHARE_ROUTE = function (st) { if (st.view === "share") { showShare(true); return true; } return false; };
})();
