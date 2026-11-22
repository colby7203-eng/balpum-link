/* =====================================================================
   발품투어 매물장 v1.5 — 🤝 발품 공유방 · "더하기 빼기 잘하는게 매너다"
   v1.5: 약속 화면 · 보수 합산 비율 계산(가격 어떻게 됐나) · 보호기간 3개월+연장
         · [🙋 이 손님이 직접 왔어요] · 매너 점수 · 🏅 발품 매너 사무소
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
    '.sh-hd .sub{font-size:12.5px;text-align:center;color:#E0E7FF;margin-top:-2px}.sh-hd .mine{display:flex;justify-content:center;gap:6px;flex-wrap:wrap;font-size:12.5px}' +
    '.sh-mn{color:#15803D;font-weight:800}.sh-bd{background:#FEF3C7;color:#92400E;border:1px solid #F59E0B;border-radius:999px;padding:1px 8px;font-weight:800;font-size:12px;white-space:nowrap}' +
    '.sh-hd .mine span{background:rgba(255,255,255,.16);border-radius:999px;padding:2px 10px}.sh-hd .mine .sh-bd{background:#FEF3C7}.sh-hd .mine .sh-mn{color:#86EFAC}.sh-hd .mine .sh-sc{color:#FCD34D;background:none;padding:0}.sh-hd .mine .sh-sc small{color:#C7D2FE}.sh-hd .mine .sh-sc.new{color:#E0E7FF}' +
    '.sh-tabs .nb{background:#DC2626;color:#fff;border-radius:999px;font-size:11px;padding:0 6px;margin-left:3px}' +
    '.sh-pro{background:#fff;border-radius:18px;padding:16px;border:2px solid #FFC53D;display:grid;gap:10px;font-size:14.5px;line-height:1.65;color:#1E293B}' +
    '.sh-pro h3{margin:0;font-size:16px;color:#1E2A78}.sh-pro .ex{background:#F8FAFC;border-radius:12px;padding:8px 12px;font-size:13.5px}.sh-pro .big{font-family:"Nanum Brush Script",sans-serif;font-size:30px;color:#1E2A78;text-align:center;line-height:1.1}' +
    '.sh-pro .mm{background:#FFF7ED;border-left:4px solid #F97316;border-radius:8px;padding:8px 12px;font-weight:700}' +
    '.sh-pt{background:#ECFDF5;border:1px solid #A7F3D0;border-radius:12px;padding:8px 10px;font-size:13px;display:grid;gap:6px}' +
    '.sh-vs{font-size:12.5px;color:#334155;background:#FFFBEB;border-radius:10px;padding:6px 9px}' +
    '.sh-chk{display:flex;gap:8px;align-items:flex-start;font-size:13.5px;padding:3px 0}.sh-chk input{width:19px;height:19px;flex:none;margin-top:2px}.sh-chk.bad{color:#B91C1C}' +
    '.sh-radio{display:grid;gap:6px;margin:6px 0}.sh-radio label{display:flex;gap:8px;align-items:flex-start;border:1.5px solid #E2E8F0;border-radius:12px;padding:9px 10px;font-size:13.5px;line-height:1.45;cursor:pointer}.sh-radio label.on{border-color:#1E2A78;background:#EEF2FF}.sh-radio input{margin-top:3px;width:18px!important;height:18px;flex:none;min-height:0;padding:0}.sh-radio label span{flex:1;text-align:left}' +
    '.sh-won{display:flex;gap:6px;margin-top:8px}.sh-won div{flex:1;text-align:center;font-weight:800;font-size:15px;border-radius:10px;padding:6px;background:#F1F5F9}' +
    '.sh-case{border:1px solid #E2E8F0;border-radius:12px;padding:9px 11px;margin:6px 0;font-size:13.5px;line-height:1.55}.sh-case b{display:block;color:#1E2A78}' +
    '</style>';
  function app(h) { $("app").innerHTML = CSS + h; }
  var S = { tab: "feed", me: null, unread: 0 };
  function manner(n, badge) { return '<span class="sh-mn">🤝 매너 ' + e(n || 0) + '</span>' + (badge ? ' <span class="sh-bd">🏅 매너 사무소</span>' : ''); }
  function ymd(t) { var d = new Date(t); return d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate(); }
  function daysLeft(t) { return Math.ceil((new Date(t) - new Date()) / 864e5); }

  function head() {
    return '<div class="sh-hd"><div class="r"><button class="bk" id="shBk">← 처음</button><h2>🤝 발품 공유방</h2></div>' +
      '<div class="mn">더하기 빼기 잘하는게 매너다</div><div class="sub">깎는 방이 아니라, 한 번씩 양보해서 오래 같이 가는 방</div>' +
      '<div class="dg">📍 <b>' + e((S.me && S.me.dong) || "동네 정하기") + '</b> 부동산끼리만 <button type="button" id="shDg">바꾸기</button></div>' +
      (S.me ? '<div class="mine"><span>내 점수 ' + stars(S.me.score) + '</span><span class="sh-mn">🤝 매너 ' + e(S.me.manner || 0) + '</span>' + (S.me.badge ? '<span class="sh-bd">🏅 발품 매너 사무소</span>' : '<span>🏅 배지까지 매너 ' + Math.max(0, 5 - (S.me.manner || 0)) + '</span>') + '</div>' : '') + '</div>' +
      '<div class="sh-tabs">' + [["feed", "우리 동네 글"], ["my", "내 글 · 신청"], ["rule", "약속 · 계산"]].map(function (t) { return '<button type="button" data-tab="' + t[0] + '" class="' + (S.tab === t[0] ? "on" : "") + '">' + t[1] + (t[0] === "my" && S.unread ? '<span class="nb">' + S.unread + '</span>' : '') + '</button>'; }).join("") + '</div>';
  }
  function bindHead() {
    $("shBk").onclick = function () { showHome(); };
    $("shDg").onclick = dongPage;
    each("[data-tab]", function (b) { b.onclick = function () { S.tab = b.getAttribute("data-tab"); render(); }; });
  }

  window.showShare = function (fromHist) {
    if (!fromHist) go("share");
    app('<div class="loading">공유방 여는 중…</div>');
    Promise.all([BALPUM.Share.me(), BALPUM.Share.unread()]).then(function (a) { S.me = a[0] || {}; S.unread = a[1] || 0;
      if (!S.me.agreed) promisePage(); else if (!S.me.dong) dongPage(true); else render(); })
      .catch(function (er) { app('<div class="card"><div class="err">' + e(msgOf(er)) + '</div><button class="btn" onclick="showHome()">처음으로</button></div>'); });
  };
  function render() { S.tab === "my" ? myPage() : S.tab === "rule" ? rulePage() : feedPage(); }

  /* ---------- 약속 (처음 들어올 때 · 약속 · 계산 탭) ---------- */
  function promiseHTML() {
    return '<div class="big">더하기 빼기 잘하는게 매너다</div><div style="text-align:center;font-weight:700;color:#64748B;margin-top:-6px">깎는 방이 아니라, 한 번씩 양보해서 오래 같이 가는 방</div>' +
      '<h3>① 보수는 합해서, 비율로 나눠요</h3>' +
      '<div>두 사무소가 각자 손님에게 받은 <b>중개보수를 합한 뒤</b>, 한 일(역할)대로 나눠요.</div>' +
      '<div class="ex">예) 우리 100만 + 상대 100만 = <b>200만</b> → 55 : 45 이면 <b>110만 : 90만</b></div>' +
      '<div class="mm">보수는 합해서 나누니, 각자 손님에게 받을 보수를 함부로 깎아 주지 않는 것도 매너예요.</div>' +
      '<h3>② 덜 받자는 게 아니라, 한 번씩 양보하고 오래 버티자는 거예요</h3>' +
      '<div class="ex">예) 이번에 물건 쪽이 집주인 설득하느라 고생했으면 → 손님 쪽이 5% 양보. 다음엔 반대로 양보받아요.</div>' +
      '<div class="ex">예) 혼자 100%를 노리다 놓치는 것보다 → 같이 해서 55%라도 확실히. 한 달에 한 건이 더 생겨요.</div>' +
      '<div class="ex">예) 서로 보수를 지켜 주면 → 동네 보수가 안 무너지고, 10년을 같이 버티는 동네가 돼요.</div>' +
      '<h3>③ 보호기간 3개월</h3>' +
      '<div>[같이 하기]를 누른 날부터 3개월, 필요하면 <b>[연장]</b>. 그 사이 손님이 상대 사무소에 직접 찾아와도 처음 사무소 몫은 지켜요. ' +
      '직접 찾아오면 <b>[🙋 이 손님이 직접 왔어요]</b>를 눌러 처음 사무소에 앱으로 알려요 → 알린 사무소는 <b>매너 +1</b>.</div>' +
      '<h3>④ 매너 점수 · 🏅 발품 매너 사무소</h3>' +
      '<div>거래가 끝나면 <b>상대 사무소가</b> 별점과 매너 체크를 해 줘요 (내 매너는 상대만 줄 수 있어요).</div>' +
      '<div class="ex">매너 5점이 되면 <b>🏅 발품 매너 사무소</b><br>· 요금 혜택: 무료 칸 +10건<br>· 손님 화면 · 초대 페이지에 <b>"🏅 동네 부동산들이 믿고 같이 하는 사무소"</b><br>· 공유방에서 내 글이 위로</div>' +
      '<div>점수가 낮으면 앱이 알아서 쉬게 해요. 사람끼리 따돌릴 일이 없게요.</div>' +
      '<h3>⑤ 이건 빼요</h3><div>자기 물건 · 자기 손님 거래는 네이버 · 직방 · 다방으로 충분해요. 손님 이름 · 전화번호는 올리지 않아요.</div>';
  }
  function visitHelpHTML() {
    return '<h3>🙋 [이 손님이 직접 왔어요] — 오해하지 마세요</h3>' +
      '<div>· <b>고자질이 아니에요.</b> 손님을 나무라거나 불이익을 주는 일은 없어요.<br>· 알려도 <b>내 몫은 그대로</b>예요. 누가 일했는지 남겨 두는 거예요.<br>· 앱이 손님을 지켜보는 게 아니에요. 사장님이 눌러 주는 <b>정직함</b>으로만 돌아가요.</div>' +
      '<div class="sh-case"><b>① "처음 부동산이 맘에 안 들어서, 그 물건을 사장님하고 계약할래요"</b>계약해도 돼요. 처음 사무소의 \'손님 데려옴\' 몫은 지켜 줘요. 손님은 보수를 한 번만 내요.</div>' +
      '<div class="sh-case"><b>② "그 부동산은 빼고, 다른 물건 보여 주세요"</b>보호기간 안이면 다른 물건이라도 처음 사무소의 \'손님 데려옴\' 몫은 지켜요.</div>' +
      '<div class="sh-case"><b>③ "제 집 팔아 주세요" · 이 거래와 상관없는 일 · 보호기간이 끝난 뒤</b>따로예요. 알려 주는 건 선택(인사)이에요.</div>' +
      '<div class="mm">손님을 묶어 두는 방이 아니라, 누가 일했는지를 지켜 주는 방이에요.</div>';
  }
  function promisePage() {
    app(head() + '<div class="sh-pro"><h3 style="text-align:center;font-size:18px">🤝 발품 공유방 약속</h3>' + promiseHTML() + visitHelpHTML() +
      '<button class="btn" id="shAg" style="margin-top:4px">약속하고 들어가기</button><button class="btn ghost" id="shAgN">다음에 할게요</button></div>');
    bindHead();
    $("shAgN").onclick = function () { showHome(); };
    $("shAg").onclick = function () { var b = this; b.disabled = true;
      BALPUM.Share.agree().then(function () { S.me.agreed = true; say("약속했어요. 같이 오래 가요!"); if (!S.me.dong) dongPage(true); else { S.tab = "feed"; render(); } }).catch(function (er) { b.disabled = false; say(msgOf(er)); }); };
  }

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
      if (!$("shF")) return;
      $("shF").innerHTML = list.length ? list.map(function (p) {
        var b = p.body || {};
        return '<div class="sh-p"><div class="pt"><span class="sh-k ' + (p.kind === "cust" ? "c" : "i") + '">' + (p.kind === "cust" ? "🙋 손님 있어요" : "🏠 물건 있어요") + '</span><span class="sh-st ' + stCls(p.status) + '">' + e(p.status) + ' · ' + when(p.created_at) + '</span></div>' +
          '<div class="t">' + e(p.title) + '</div><div class="d">' + detail(p) + '</div>' +
          '<div class="o">🏢 ' + e(p.office || "부동산") + ' ' + stars(p.score) + ' ' + manner(p.mn, p.badge) + (p.reqs ? ' · 신청 ' + e(p.reqs) : '') + '</div>' +
          '<div class="sh-btns">' + (p.mine ? '<span class="hint" style="margin:0">내 글이에요 · [내 글 · 신청]에서 관리</span>'
            : p.my_req === "같이 하기" ? (p.tel ? '<a class="ok" href="tel:' + e(String(p.tel).replace(/[^\d+]/g, "")) + '">📞 ' + e(p.tel) + '</a>' : '') + '<span class="hint" style="margin:0">같이 하기로 했어요</span>'
            : p.my_req === "신청" ? '<span class="hint" style="margin:0">신청했어요 · 답을 기다리는 중</span>'
            : p.status === "끝" ? '' : '<button type="button" class="pr" data-req="' + e(p.id) + '">🤝 같이 하기 신청</button>') + '</div>' +
          '<div id="rq' + e(p.id) + '"></div></div>';
      }).join("") : '<div class="card"><div class="hint" style="margin:0">아직 ' + e(S.me.dong) + ' 공유방에 글이 없어요. 첫 글을 올려 보세요.<br>자기 물건 · 자기 손님 거래는 네이버 · 직방 · 다방으로 충분해요. 여기는 <b>같이 하면 되는 것</b>만 올려요.</div></div>';
      each("[data-req]", function (b) { b.onclick = function () { var id = b.getAttribute("data-req"), box = $("rq" + id);
        box.innerHTML = '<div class="sh-rq"><label for="rm' + id + '">한마디 (예: 매수 손님 있어요, 대출 안내 제가 할게요)</label><textarea id="rm' + id + '" rows="2" enterkeyhint="send"></textarea><div class="sh-btns"><button type="button" class="pr" id="rs' + id + '">신청 보내기</button></div></div>';
        $("rs" + id).onclick = function () { BALPUM.Share.req(+id, $("rm" + id).value.trim()).then(function () { say("신청했어요. 글쓴 사무소가 [같이 하기]를 누르면 전화번호가 보여요."); feedPage(); }).catch(function (er) { say(msgOf(er)); }); }; }; });
    }).catch(function (er) { if ($("shF")) $("shF").innerHTML = '<div class="err">' + e(msgOf(er)) + '</div>'; });
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
    return '<div class="sh-rq"><b style="font-size:13.5px">⭐ ' + e(label) + '에게 칭찬 점수 · 매너</b><div class="sh-star" data-pid="' + pid + '" data-to="' + e(to) + '">' + [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" data-n="' + n + '" aria-label="' + n + '점">★</button>'; }).join("") + '</div>' +
      '<label class="sh-chk"><input type="checkbox" class="mFee"><span>💰 보수를 깎이지 않고 지켜 줬어요 <b class="sh-mn">+1</b></span></label>' +
      '<label class="sh-chk"><input type="checkbox" class="mPro"><span>📞 연락이 빠르고 약속을 지켰어요 <b class="sh-mn">+1</b></span></label>' +
      '<div class="hint" style="margin:0 0 2px 27px">🙋 정직하게 알려 줬어요 +1 은 [직접 왔어요] 단추를 누르면 저절로 들어가요</div>' +
      '<label class="sh-chk bad"><input type="checkbox" class="mBad"><span>⚠ 약속을 어겼어요 <small>(기록만 남아요 · 나중에 쉬게 할 때 써요)</small></span></label>' +
      '<input class="shRn" placeholder="한마디 (예: 대출 안내 꼼꼼했어요)"><div class="sh-btns"><button type="button" class="pr shRs">점수 주기</button></div></div>';
  }
  function bindRate() {
    each(".sh-star", function (box) { var n = 0, wrap = box.parentNode;
      Array.prototype.forEach.call(box.querySelectorAll("button"), function (b) { b.onclick = function () { n = +b.getAttribute("data-n"); Array.prototype.forEach.call(box.querySelectorAll("button"), function (x) { x.classList.toggle("on", +x.getAttribute("data-n") <= n); }); }; });
      wrap.querySelector(".shRs").onclick = function () { if (!n) { say("별을 눌러 점수를 골라 주세요."); return; }
        var o = { fee: wrap.querySelector(".mFee").checked, promise: wrap.querySelector(".mPro").checked, broke: wrap.querySelector(".mBad").checked };
        BALPUM.Share.rate(+box.getAttribute("data-pid"), box.getAttribute("data-to"), n, wrap.querySelector(".shRn").value.trim(), o).then(function () { say("칭찬 점수를 줬어요. 고마워요!"); myPage(); }).catch(function (er) { say(msgOf(er)); }); };
    });
  }
  // 같이 하는 중: 보호기간 · 연장 · 직접 왔어요
  function protectBox(q, canVisit) {
    if (q.status !== "같이 하기" || !q.protect_until) return '';
    var d = daysLeft(q.protect_until), vs = q.visits || [];
    return '<div class="sh-pt"><div>🛡 <b>보호기간</b> ' + ymd(q.protect_until) + '까지 ' + (d >= 0 ? '<b>(' + d + '일 남음)</b>' : '<b style="color:#B91C1C">(끝남)</b>') + '</div>' +
      vs.map(function (v) { return '<div class="sh-vs">🙋 ' + ymd(v.at) + ' · ' + (v.by_me ? '저희가 "손님이 직접 왔어요"를 알렸어요 · 매너 +1' : '상대가 "이 손님이 저희에게 직접 왔어요"라고 알려 줬어요 · <b>우리 몫은 그대로예요</b>') + (v.memo ? '<br>' + e(v.memo) : '') + '</div>'; }).join("") +
      '<div class="sh-btns"><button type="button" data-ext="' + e(q.id) + '">⏩ 3개월 연장</button>' + (canVisit ? '<button type="button" class="pr" data-vis="' + e(q.id) + '">🙋 이 손님이 저희에게 직접 왔어요</button>' : '') + '</div><div id="vb' + e(q.id) + '"></div></div>';
  }
  function bindProtect() {
    each("[data-ext]", function (b) { b.onclick = function () { BALPUM.Share.extend(+b.getAttribute("data-ext")).then(function () { say("보호기간을 3개월 늘렸어요."); myPage(); }).catch(function (er) { say(msgOf(er)); }); }; });
    each("[data-vis]", function (b) { b.onclick = function () { var id = b.getAttribute("data-vis"), box = $("vb" + id);
      if (box.firstChild) { box.innerHTML = ""; return; }
      box.innerHTML = '<div class="sh-rq"><div class="hint" style="margin:0">고자질이 아니에요. 처음 사무소에 앱으로 알려서 <b>그쪽 몫을 지켜 주는</b> 거예요. 손님에게 불이익은 없어요. 알리면 저희 매너 +1.</div>' +
        '<input id="vm' + id + '" placeholder="한마디 (예: 같은 물건으로 계약하고 싶대요 / 다른 물건 원해요)"><div class="sh-btns"><button type="button" class="pr" id="vg' + id + '">처음 사무소에 알리기</button></div></div>';
      $("vg" + id).onclick = function () { BALPUM.Share.visit(+id, $("vm" + id).value.trim()).then(function () { say("처음 사무소에 알렸어요. 정직하게 알려 줘서 매너 +1!"); myPage(); }).catch(function (er) { say(msgOf(er)); }); }; }; });
  }
  function myPage() {
    app(head() + '<div id="shM"><div class="loading">불러오는 중…</div></div>');
    bindHead();
    BALPUM.Share.my().then(function (r) {
      if (!$("shM")) return;
      if (S.unread) { S.unread = 0; BALPUM.Share.seen(); each(".sh-tabs .nb", function (x) { x.remove(); }); }
      var posts = r.posts || [], sent = r.sent || [];
      var h = '<div class="rm-sect" style="font-weight:800;margin:4px 2px 8px">📝 내가 올린 글 ' + posts.length + '</div>';
      h += posts.length ? posts.map(function (p) {
        var rated = p.rated || [], acc = (p.reqs || []).filter(function (q) { return q.status === "같이 하기"; });
        return '<div class="sh-p"><div class="pt"><span class="sh-k ' + (p.kind === "cust" ? "c" : "i") + '">' + (p.kind === "cust" ? "🙋 손님" : "🏠 물건") + '</span><span class="sh-st ' + stCls(p.status) + '">' + e(p.status) + ' · ' + when(p.created_at) + '</span></div>' +
          '<div class="t">' + e(p.title) + '</div><div class="d">' + detail(p) + '</div>' +
          '<div class="sh-rq">' + ((p.reqs || []).length ? p.reqs.map(function (q) {
            return '<div class="one">🏢 <b>' + e(q.office || "부동산") + '</b> ' + stars(q.score) + ' ' + manner(q.mn, q.badge) + (q.msg ? '<br>' + e(q.msg) : '') +
              '<div class="sh-btns" style="margin-top:6px">' + (q.status === "신청" ? '<button type="button" class="ok" data-ans="' + e(q.id) + '" data-st="같이 하기">🤝 같이 하기</button><button type="button" data-ans="' + e(q.id) + '" data-st="거절">거절</button>'
                : q.status === "같이 하기" ? (q.tel ? '<a class="ok" href="tel:' + e(String(q.tel).replace(/[^\d+]/g, "")) + '">📞 ' + e(q.tel) + '</a>' : '') + '<span class="hint" style="margin:0">같이 하는 중</span>' : '<span class="hint" style="margin:0">거절함</span>') + '</div>' +
              (p.status !== "끝" ? protectBox(q, p.kind === "item") : '') + '</div>';      // 물건 글: 상대 손님이 우리에게 직접 올 수 있어요
          }).join("") : '<div class="hint" style="margin:0">아직 신청이 없어요.</div>') + '</div>' +
          (p.status === "끝" ? acc.filter(function (q) { return rated.indexOf(q.from) < 0; }).map(function (q) { return rateBox(p.id, q.from, q.office || "부동산"); }).join("") : '') +
          '<div class="sh-btns">' + (p.status !== "끝" ? '<button type="button" data-end="' + e(p.id) + '">✅ 거래 끝 (점수 주기)</button>' : '') + '<button type="button" data-del="' + e(p.id) + '">🗑 글 내리기</button></div></div>';
      }).join("") : '<div class="hint">아직 올린 글이 없어요.</div>';
      h += '<div class="rm-sect" style="font-weight:800;margin:14px 2px 8px">🤝 내가 한 신청 ' + sent.length + '</div>';
      h += sent.length ? sent.map(function (q) {
        return '<div class="sh-p"><div class="pt"><span class="sh-k ' + (q.kind === "cust" ? "c" : "i") + '">' + (q.kind === "cust" ? "🙋 손님" : "🏠 물건") + '</span><span class="sh-st ' + (q.status === "같이 하기" ? "go" : "") + '">' + e(q.status) + '</span></div>' +
          '<div class="t">' + e(q.title) + '</div><div class="o">🏢 ' + e(q.office || "부동산") + ' ' + manner(q.mn, q.badge) + (q.tel ? ' · <a href="tel:' + e(String(q.tel).replace(/[^\d+]/g, "")) + '">📞 ' + e(q.tel) + '</a>' : '') + '</div>' +
          (q.post_status !== "끝" ? protectBox(q, q.kind === "cust") : '') +                // 손님 글: 그 손님이 우리에게 직접 올 수 있어요
          (q.status === "같이 하기" && q.post_status === "끝" && !q.rated ? rateBox(q.post, q.owner, q.office || "부동산") : '') + '</div>';
      }).join("") : '<div class="hint">아직 신청한 글이 없어요.</div>';
      $("shM").innerHTML = h;
      each("[data-ans]", function (b) { b.onclick = function () { BALPUM.Share.answer(+b.getAttribute("data-ans"), b.getAttribute("data-st")).then(function () { say(b.getAttribute("data-st") === "거절" ? "거절했어요." : "같이 하기로 했어요. 서로 전화번호가 보이고, 보호기간 3개월이 시작돼요."); myPage(); }).catch(function (er) { say(msgOf(er)); }); }; });
      each("[data-end]", function (b) { b.onclick = function () { BALPUM.Share.status(+b.getAttribute("data-end"), "끝").then(function () { say("거래 끝! 같이 한 사무소에게 칭찬 점수 · 매너를 주세요."); myPage(); }).catch(function (er) { say(msgOf(er)); }); }; });
      each("[data-del]", function (b) { b.onclick = function () { if (!confirm("이 글을 내릴까요? 신청 · 점수도 같이 지워져요.")) return; BALPUM.Share.del(+b.getAttribute("data-del")).then(function () { say("내렸어요."); myPage(); }).catch(function (er) { say(msgOf(er)); }); }; });
      bindRate(); bindProtect();
      BALPUM.Share.me().then(function (m) { if (!m) return; S.me = m; var hd = document.querySelector(".sh-hd .mine"), tmp = document.createElement("div"); tmp.innerHTML = head(); var nw = tmp.querySelector(".sh-hd .mine"); if (hd && nw) hd.innerHTML = nw.innerHTML; }).catch(function () {});
    }).catch(function (er) { if ($("shM")) $("shM").innerHTML = '<div class="err">' + e(msgOf(er)) + '</div>'; });
  }

  /* ---------- 약속 · 역할표 · 추천 비율 (보수 합산) ---------- */
  var ROLES = [["손님을 데려옴", 3, "c"], ["물건을 가져옴", 3, "i"], ["집 보여 주기 · 안내", 1, "i"], ["계약서 작성", 1, "c"], ["대출 안내", 1, "c"], ["법무 · 등기 진행", 1, ""]];
  var PRICE = [["물건 쪽이 집주인을 설득해 깎아서 성사", 2, 5, "물건 쪽 +5 · 손님 쪽 +2"], ["손님이 깎지 않고 제값에 삼", 5, 0, "손님 쪽 +5"], ["깎아 달라 했지만 못 깎고 제값에 성사", 4, 3, "손님 쪽 +4 · 물건 쪽 +3 (물건 쪽이 한 번 애썼으니)"]];
  function man(w) { w = Math.round(w); if (w >= 1e8) { var x = Math.floor(w / 1e8), r = Math.round((w % 1e8) / 1e4); return x + "억" + (r ? " " + r.toLocaleString("ko-KR") + "만" : ""); } return w >= 1e4 ? Math.round(w / 1e4).toLocaleString("ko-KR") + "만" : w.toLocaleString("ko-KR"); }
  function wonOf(s) { s = String(s || "").replace(/[\s,원]/g, ""); var t = 0, m;
    if ((m = /(\d+(?:\.\d+)?)억/.exec(s))) t += parseFloat(m[1]) * 1e8;
    if ((m = /(\d+(?:\.\d+)?)천만/.exec(s))) t += parseFloat(m[1]) * 1e7; else if ((m = /(\d+(?:\.\d+)?)만/.exec(s))) t += parseFloat(m[1]) * 1e4;
    if (!t) t = +s.replace(/\D/g, "") || 0; if (t && t < 10000) t *= 1e4; return t; }
  function rulePage() {
    app(head() + '<div class="sh-pro">' + promiseHTML() + '</div>' +
      '<div class="card sh-rule" style="margin-top:10px"><h3 style="margin-top:0">🧮 추천 비율 계산 (보수 합산)</h3><div class="hint" style="margin-top:0">두 사무소 보수를 합한 금액을 이 비율로 나눠요. 한 일에 체크하세요. (5% 단위 · 30~70%)</div>' +
      '<div class="sh-calc"><span class="h">역할</span><span class="h">손님 쪽</span><span class="h">물건 쪽</span>' +
      ROLES.map(function (r, i) { return '<span>' + r[0] + ' <small class="hint" style="margin:0">(' + r[1] + '점)</small></span><input type="checkbox" data-a="' + i + '"' + (r[2] === "c" ? " checked" : "") + ' aria-label="손님 쪽 ' + r[0] + '"><input type="checkbox" data-b="' + i + '"' + (r[2] === "i" ? " checked" : "") + ' aria-label="물건 쪽 ' + r[0] + '">'; }).join("") + '</div>' +
      '<div style="font-weight:800;margin-top:12px">💬 가격은 어떻게 됐나요?</div><div class="sh-radio">' +
      PRICE.map(function (p, i) { return '<label class="' + (i === 0 ? "on" : "") + '"><input type="radio" name="shPr" value="' + i + '"' + (i === 0 ? " checked" : "") + '><span><b>' + ["①", "②", "③"][i] + ' ' + p[0] + '</b><br><small class="hint" style="margin:0">' + p[3] + '</small></span></label>'; }).join("") + '</div>' +
      '<div class="sh-res"><div class="a">🙋 손님 쪽<b id="shRa">50%</b></div><div class="b">🏠 물건 쪽<b id="shRb">50%</b></div></div>' +
      '<label for="shSum" style="margin-top:10px">합계 금액 넣어 보기 <span class="hint">(두 사무소 보수를 더한 것 · 저장 안 돼요)</span></label><input id="shSum" inputmode="numeric" placeholder="예) 200만">' +
      '<div class="sh-won" id="shWon"></div>' +
      '<div class="hint">이 비율은 앱이 드리는 추천이에요. 두 사무소가 합의하면 그대로 가요. 늘 쓰는 예: ① 45:55 · ② 70:30 · ③ 55:45 (손님 쪽 : 물건 쪽)</div></div>' +
      '<div class="sh-pro" style="margin-top:10px">' + visitHelpHTML() + '</div>');
    bindHead();
    var calc = function () { var a = 0, b = 0; each("[data-a]", function (c) { if (c.checked) a += ROLES[+c.getAttribute("data-a")][1]; }); each("[data-b]", function (c) { if (c.checked) b += ROLES[+c.getAttribute("data-b")][1]; });
      var pr = document.querySelector('input[name="shPr"]:checked'), k = pr ? PRICE[+pr.value] : null; if (k) { a += k[1]; b += k[2]; }
      each(".sh-radio label", function (l) { l.classList.toggle("on", l.querySelector("input").checked); });
      var p = a + b ? a / (a + b) * 100 : 50; p = Math.round(p / 5) * 5; p = Math.max(30, Math.min(70, p));
      $("shRa").textContent = p + "%"; $("shRb").textContent = (100 - p) + "%";
      var w = wonOf($("shSum").value);
      $("shWon").innerHTML = w ? '<div>🙋 ' + man(w * p / 100) + '원</div><div>🏠 ' + man(w * (100 - p) / 100) + '원</div>' : ''; };
    each(".sh-calc input, .sh-radio input", function (c) { c.onchange = calc; }); $("shSum").oninput = calc; calc();
  }

  window.SHARE_ROUTE = function (st) { if (st.view === "share") { showShare(true); return true; } return false; };
})();
