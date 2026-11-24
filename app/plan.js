/* =====================================================================
   발품투어 매물장 v1.7 — 💳 요금 · 🎫 이용권 · 🛠 관리자 화면
   · 무료 80건 → 7일 여유(그동안 등록도 됨) → 신규 등록만 막힘 (보기 · 고치기 · 답사는 언제나)
   · 기본요금 정가 20,000원 → 50% 할인 월 10,000원
   · [💰 입금했어요] → 관리자 핸드폰 알림 → 🎫 이용권 번호를 카톡으로 → [🎫 이용권 넣기] → 바로 열림
   Made by 정동철 · 상상을 현실로
   ===================================================================== */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  function e(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function say(t) { if (window.toast) window.toast(t); }
  function msgOf(er) { return (er && er.message) || String(er || "오류"); }
  function won(n) { return Number(n || 0).toLocaleString("ko-KR") + "원"; }
  function ymd(t) { if (!t) return ""; var d = new Date(t); return d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate(); }
  function each(sel, fn, root) { Array.prototype.forEach.call((root || document).querySelectorAll(sel), fn); }
  function copy(t) { var ok = function () { say("복사했어요. 카톡에 붙여 넣으세요."); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, function () { say("글씨를 길게 눌러 복사해 주세요."); });
    else say("글씨를 길게 눌러 복사해 주세요."); }
  var CSS = '<style id="planCss">' +
    '.pl-st{border-radius:14px;padding:11px 13px;font-size:14px;line-height:1.55}.pl-st b.plb{font-size:16px}' +
    '.pl-ok{background:#ECFDF5;border:1px solid #A7F3D0;color:#065F46}.pl-warn{background:#FFFBEB;border:1px solid #FCD34D;color:#92400E}.pl-bad{background:#FEF2F2;border:1px solid #FCA5A5;color:#991B1B}' +
    '.pl-price{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;margin:6px 0}.pl-price s{color:#94A3B8}.pl-price b{font-size:20px;color:#1E2A78}.pl-price .off{background:#DC2626;color:#fff;border-radius:999px;padding:1px 8px;font-size:12px;font-weight:800}' +
    '.pl-btns{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.pl-btns button{border:1px solid #CBD5E1;background:#fff;border-radius:999px;padding:8px 13px;font:700 13.5px "Noto Sans KR",sans-serif;cursor:pointer;color:#0F172A}' +
    '.pl-btns .pr{background:#1E2A78;color:#fff;border-color:#1E2A78}.pl-btns .ok{background:#15803D;color:#fff;border-color:#15803D}.pl-btns .no{color:#B91C1C}' +
    '.pl-box{background:#F8FAFC;border-radius:12px;padding:10px;margin-top:8px}' +
    '.pl-code{font:800 18px/1.6 ui-monospace,Consolas,monospace;letter-spacing:1px;background:#fff;border:1.5px dashed #1E2A78;border-radius:10px;padding:6px 10px;user-select:all;word-break:break-all}' +
    '.ad-row{background:#fff;border:1px solid #E2E8F0;border-radius:14px;padding:10px 12px;margin-bottom:8px;font-size:14px}.ad-row .t{display:flex;gap:6px;align-items:center;flex-wrap:wrap}' +
    '.ad-pill{border-radius:999px;padding:1px 9px;font-size:12px;font-weight:800}.ad-trial{background:#EEF2FF;color:#1E2A78}.ad-grace{background:#FEF3C7;color:#92400E}.ad-blocked{background:#FEE2E2;color:#991B1B}.ad-paid{background:#DCFCE7;color:#166534}.ad-free{background:#F1F5F9;color:#334155}' +
    '.ad-req{border:2px solid #DC2626;background:#FEF2F2}' +
    '</style>';
  function css() { if (!$("planCss")) document.head.insertAdjacentHTML("beforeend", CSS); }

  function stateHTML(p) {
    if (!p) return '';
    var lim = p.limit || 80, used = p.used || 0, left = Math.max(0, lim - used);
    if (p.state === "free_forever") return '<div class="pl-st pl-ok"><b class="plb">✅ 무제한</b> · ' + (p.admin ? "관리자 계정" : "무료로 쓰는 사무소") + ' · 지금까지 ' + used + '건</div>';
    if (p.state === "paid" || p.state === "paid_manual") return '<div class="pl-st ' + (p.days_left != null && p.days_left <= 7 ? 'pl-warn' : 'pl-ok') + '"><b class="plb">✅ 기본요금 이용 중</b>' + (p.paid_until && p.state === "paid" ? ' · <b>' + ymd(p.paid_until) + '</b>까지' + (p.days_left <= 7 ? ' <b>(' + p.days_left + '일 남음 — 이용권을 미리 넣어 두세요)</b>' : '') : '') + ' · 지금까지 ' + used + '건</div>';
    if (p.state === "trial") return '<div class="pl-st ' + (left <= 10 ? 'pl-warn' : 'pl-ok') + '"><b class="plb">무료 체험 중</b> · 남은 등록 <b>' + left + '건</b> (지금까지 ' + used + ' / ' + lim + '건)' + (left <= 10 ? '<br>무료 ' + lim + '건을 다 쓰면 <b>7일 여유</b>가 있고, 그 뒤 신규 등록만 멈춰요.' : '') + '</div>';
    if (p.state === "grace") return '<div class="pl-st pl-warn"><b class="plb">⏳ 무료 ' + lim + '건을 다 썼어요 · 여유 ' + p.days_left + '일 남음</b><br>여유 동안은 계속 등록돼요. 그 뒤엔 <b>신규 등록만</b> 멈추고, 보기 · 고치기 · 답사는 그대로 돼요.</div>';
    if (p.state === "blocked") return '<div class="pl-st pl-bad"><b class="plb">⛔ 신규 등록이 멈췄어요</b><br>무료 ' + lim + '건과 7일 여유가 끝났어요. 보기 · 고치기 · 답사 · 손님 방은 그대로 돼요. 아래 🎫 이용권을 넣으면 바로 다시 등록돼요.</div>';
    return '<div class="pl-st pl-warn">무료 ' + lim + '건을 넘었어요 (지금은 막지 않는 기간이에요).</div>';
  }
  function priceHTML(p) {
    return '<div class="pl-price">기본요금 <s>' + won(p.price_list || 20000) + '</s> <span class="off">50% 할인</span> <b>월 ' + won(p.price_now || 10000) + '</b></div>';
  }

  // 첫 화면 한 줄
  window.bpPlanLine = function (el) {
    if (!el || !BALPUM.Plan) return;
    if (window.bpPcPhotoAuto) bpPcPhotoAuto(el);
    if (window.bpTips) setTimeout(function () { bpTips('agent'); }, 900);
    BALPUM.Plan.me().then(function (p) {
      css(); if (!p) return;
      if (p.state === "free_forever" || (p.state === "paid" && p.days_left > 7) || p.state === "paid_manual" || (p.state === "trial" && (p.limit - p.used) > 10)) {
        if (p.state === "trial") el.insertAdjacentHTML("beforeend", '<div class="usage"><b>무료 체험 중</b> · 남은 등록 <b>' + (p.limit - p.used) + '건</b> <span class="hint">(지금까지 ' + p.used + '건)</span></div>');
        if (p.admin) el.insertAdjacentHTML("beforeend", '<button type="button" class="btn ghost" id="plAdmGo" style="margin:6px 0 0">🛠 관리자 화면' + '<span id="plAdmN"></span></button>');
      } else el.insertAdjacentHTML("beforeend", stateHTML(p) + '<div class="pl-btns"><button type="button" class="pr" id="plGo">🎫 이용권 넣기 · 💰 입금했어요</button></div>');
      if ($("plGo")) $("plGo").onclick = function () { if (typeof showOffice === "function") showOffice(); };
      if ($("plAdmGo")) { $("plAdmGo").onclick = function () { showAdmin(); };
        BALPUM.Plan.admin().then(function (a) { var n = (a.requests || []).length; if (n && $("plAdmN")) $("plAdmN").innerHTML = ' <b style="background:#DC2626;color:#fff;border-radius:999px;padding:0 8px">💰 ' + n + '</b>'; }).catch(function () {}); }
    }).catch(function () {});
  };

  // 내 사무소 카드
  window.bpPlanCard = function () { setTimeout(fillCard, 30); return '<div class="card" id="plCard"><div class="sect" style="margin-top:0">💳 요금 · 매물장</div><div class="hint">불러오는 중…</div></div>'; };
  function fillCard() {
    var box = $("plCard"); if (!box) return; css();
    BALPUM.Plan.me().then(function (p) {
      p = p || {};
      box.innerHTML = '<div class="sect" style="margin-top:0">💳 요금 · 매물장</div>' + stateHTML(p) + priceHTML(p) +
        '<div class="hint" style="margin-top:0">무료 체험: 누적 등록 ' + (p.limit || 80) + '건까지 모든 기능 · 다 쓰면 7일 여유 · 계약 · 보류된 매물은 지우지 말고 상태만 바꿔 두세요.</div>' +
        (p.state === "free_forever" ? '' :
          '<div class="pl-btns"><button type="button" class="pr" id="plTk">🎫 이용권 넣기</button>' + (p.pending ? '<button type="button" id="plPc" class="no">💰 입금 알림 취소</button>' : '<button type="button" id="plPay">💰 입금했어요</button>') + '</div>' +
          (p.pending ? '<div class="hint">💰 입금 알림을 보냈어요. 확인되면 정동철 대표가 이용권 번호를 보내 드려요.</div>' : '') + '<div id="plX"></div>') +
        (p.admin ? '<button type="button" class="btn ghost" id="plAdm" style="margin-top:10px">🛠 관리자 화면 (이용권 · 사무소 · 입금 알림)</button>' : '');
      if ($("plAdm")) $("plAdm").onclick = function () { showAdmin(); };
      if ($("plTk")) $("plTk").onclick = function () {
        $("plX").innerHTML = '<div class="pl-box"><label for="plC" style="margin-top:0">이용권 번호</label><input id="plC" autocapitalize="characters" autocomplete="off" placeholder="BP-XXXX-XXXX">' +
          '<div class="pl-btns"><button type="button" class="ok" id="plCg">넣기</button><button type="button" id="plCx">닫기</button></div><div class="hint">번호는 한 번만 쓸 수 있어요. 5번 틀리면 1시간 쉬어요.</div></div>';
        $("plC").focus(); $("plCx").onclick = function () { $("plX").innerHTML = ""; };
        $("plCg").onclick = function () { var b = this; b.disabled = true;
          BALPUM.Plan.redeem($("plC").value).then(function (r) { say("🎉 " + r.months + "개월이 열렸어요 · " + ymd(r.paid_until) + "까지"); fillCard(); })
            .catch(function (er) { b.disabled = false; say(msgOf(er)); }); };
      };
      if ($("plPay")) $("plPay").onclick = function () {
        $("plX").innerHTML = '<div class="pl-box"><div style="font-weight:800">💰 입금 안내</div><div class="pl-code" style="font-size:15px;letter-spacing:0">' + e(p.pay_account || "입금 계좌는 정동철 대표에게 물어보세요") + '</div>' +
          '<label for="plM">기간</label><select id="plM">' + [[1, "1개월"], [3, "3개월"], [6, "6개월"], [12, "12개월"]].map(function (x) { return '<option value="' + x[0] + '">' + x[1] + ' · ' + won((p.price_now || 10000) * x[0]) + '</option>'; }).join("") + '</select>' +
          '<label for="plN">입금자 이름</label><input id="plN" placeholder="통장에 찍히는 이름">' +
          '<div class="pl-btns"><button type="button" class="pr" id="plNg">입금했어요 알리기</button><button type="button" id="plNx">닫기</button></div>' +
          '<div class="hint">누르면 정동철 대표 핸드폰에 알림이 가요. 통장 확인 뒤 🎫 이용권 번호를 카톡 · 문자로 보내 드려요.</div></div>';
        $("plNx").onclick = function () { $("plX").innerHTML = ""; };
        $("plNg").onclick = function () { var n = $("plN").value.trim(); if (!n) { say("입금자 이름을 적어 주세요."); return; } var b = this; b.disabled = true;
          BALPUM.Plan.pay(n, $("plM").value, "").then(function () { say("알렸어요. 확인되면 이용권 번호가 와요."); fillCard(); }).catch(function (er) { b.disabled = false; say(msgOf(er)); }); };
      };
      if ($("plPc")) $("plPc").onclick = function () { BALPUM.Plan.payCancel().then(function () { say("입금 알림을 취소했어요."); fillCard(); }); };
    }).catch(function (er) { box.innerHTML = '<div class="sect" style="margin-top:0">💳 요금</div><div class="err">' + e(msgOf(er)) + '</div><div class="hint">서버(SQL)를 v1.7 로 바꿨는지 확인해 주세요.</div>'; });
  }

  // 🛠 관리자 화면
  var AD = { tab: "req" };
  function stOf(o) {
    if (o.admin || o.plan === "owner") return ["관리자", "ad-free"];
    if (o.plan === "tester") return ["무료로 둠", "ad-free"];
    if (o.paid_until && new Date(o.paid_until) > new Date()) return ["이용 중 ~" + ymd(o.paid_until), "ad-paid"];
    if (o.plan !== "free" && !o.paid_until) return ["손으로 열어 둠", "ad-paid"];
    if (o.used < o.limit) return ["무료 " + o.used + "/" + o.limit, "ad-trial"];
    if (o.grace_from && (Date.now() - new Date(o.grace_from)) < 7 * 864e5) return ["여유 " + Math.ceil((7 * 864e5 - (Date.now() - new Date(o.grace_from))) / 864e5) + "일", "ad-grace"];
    return ["등록 멈춤", "ad-blocked"];
  }
  window.showAdmin = function (fromHist) {
    if (!fromHist && typeof nav === "function") nav("admin");
    window.scrollTo(0, 0); css();
    $("app").innerHTML = '<div class="top"><button class="back" id="bk">← 처음</button><h2>🛠 관리자 화면</h2></div><div class="loading">불러오는 중…</div>';
    $("bk").onclick = function () { showHome(); };
    Promise.all([BALPUM.Plan.admin(), BALPUM.Plan.tickets()]).then(function (a) {
      var D = a[0] || {}, T = a[1] || [], reqs = D.requests || [], offs = D.offices || [];
      var tabs = [["req", "💰 입금 알림 " + reqs.length], ["off", "🏢 사무소 " + offs.length], ["tk", "🎫 이용권"]];
      $("app").innerHTML = '<div class="top"><button class="back" id="bk">← 처음</button><h2>🛠 관리자 화면</h2></div>' +
        '<div class="sh-tabs" style="display:flex;gap:4px;background:#E2E8F0;border-radius:12px;padding:3px;margin-bottom:10px">' + tabs.map(function (t) { return '<button type="button" data-t="' + t[0] + '" style="flex:1;border:0;border-radius:10px;padding:9px 2px;font:700 13px \'Noto Sans KR\',sans-serif;cursor:pointer;background:' + (AD.tab === t[0] ? '#fff' : 'transparent') + '">' + t[1] + '</button>'; }).join("") + '</div>' +
        '<div id="adB"></div><div id="adOut"></div>';
      $("bk").onclick = function () { showHome(); };
      each("[data-t]", function (b) { b.onclick = function () { AD.tab = b.getAttribute("data-t"); showAdmin(true); }; });
      var B = $("adB");
      if (AD.tab === "req") {
        B.innerHTML = reqs.length ? reqs.map(function (r) { return '<div class="ad-row ad-req"><div class="t"><b>' + e(r.office || "사무소") + '</b><span class="ad-pill ad-grace">' + r.months + '개월</span><span class="hint" style="margin:0">' + e(new Date(r.at).toLocaleString("ko-KR")) + '</span></div>' +
          '<div>입금자: <b>' + e(r.payer) + '</b> · ' + won(10000 * r.months) + ' 확인해 주세요</div>' +
          '<div class="pl-btns"><button type="button" class="pr" data-mk="' + e(r.owner) + '" data-m="' + r.months + '" data-o="' + e(r.office) + '">🎫 번호 만들어 보내기</button><button type="button" class="ok" data-open="' + e(r.owner) + '" data-m="' + r.months + '">바로 열어 주기</button><button type="button" class="no" data-done="' + e(r.owner) + '">입금 안 됨 · 지우기</button></div></div>'; }).join("")
          : '<div class="card"><div class="hint" style="margin:0">새 입금 알림이 없어요. 사무소가 [💰 입금했어요]를 누르면 여기 생기고 핸드폰에 알림이 와요.</div></div>';
      } else if (AD.tab === "off") {
        B.innerHTML = offs.map(function (o) { var s = stOf(o);
          return '<div class="ad-row"><div class="t"><b>' + e(o.office || "(이름 없음)") + '</b><span class="ad-pill ' + s[1] + '">' + e(s[0]) + '</span></div><div class="hint" style="margin:2px 0">' + e([o.ceo, o.mobile, o.addr].filter(Boolean).join(" · ")) + ' · 등록 ' + o.used + '건 · 가입 ' + ymd(o.created_at) + '</div>' +
            (o.admin ? '' : '<div class="pl-btns"><button type="button" class="ok" data-open="' + e(o.owner) + '" data-m="1">＋1개월 열기</button><button type="button" data-mk="' + e(o.owner) + '" data-m="1" data-o="' + e(o.office) + '">🎫 번호</button><button type="button" class="no" data-block="' + e(o.owner) + '">다시 막기</button>' +
              (o.plan === "tester" ? '<button type="button" data-unfree="' + e(o.owner) + '">무료 풀기</button>' : '<button type="button" data-free="' + e(o.owner) + '">무료로 두기</button>') + '<button type="button" data-grace="' + e(o.owner) + '">7일 여유 다시</button></div>') + '</div>'; }).join("");
      } else {
        B.innerHTML = '<div class="card"><div class="sect" style="margin-top:0">🎫 이용권 만들기</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">' +
          '<div><label for="adM">기간</label><select id="adM">' + [1, 3, 6, 12].map(function (m) { return '<option value="' + m + '">' + m + '개월</option>'; }).join("") + '</select></div>' +
          '<div><label for="adN">몇 장</label><select id="adN">' + [1, 5, 10, 20].map(function (n) { return '<option value="' + n + '">' + n + '장</option>'; }).join("") + '</select></div></div>' +
          '<label for="adW">쓸 사무소</label><select id="adW"><option value="">아무 사무소나 (번호를 받은 사람)</option>' + offs.filter(function (o) { return !o.admin; }).map(function (o) { return '<option value="' + e(o.owner) + '">' + e(o.office || o.owner) + ' 만</option>'; }).join("") + '</select>' +
          '<label for="adMm">메모</label><input id="adMm" placeholder="예) 11월 입금분"><button class="btn" id="adGo">만들기</button>' +
          '<div class="hint">번호는 만들 때 <b>한 번만</b> 보여 줘요 (서버엔 가려서 저장). 바로 복사해 두세요. 사무소를 정해 두면 그 사무소 계정에서만 들어가요.</div></div>' +
          '<div class="sect">만든 이용권 ' + T.length + '</div>' + T.map(function (t) {
            return '<div class="ad-row"><div class="t"><b>…' + e(t.hint) + '</b><span class="ad-pill ' + (t.canceled ? 'ad-blocked' : t.used_at ? 'ad-paid' : 'ad-trial') + '">' + (t.canceled ? '취소됨' : t.used_at ? '사용됨' : '안 씀') + '</span><span class="ad-pill ad-free">' + t.months + '개월</span></div>' +
              '<div class="hint" style="margin:2px 0">' + (t.for_office ? e(t.for_office) + ' 만 · ' : '아무나 · ') + ymd(t.created_at) + ' 만듦' + (t.used_at ? ' · ' + e(t.used_office || "") + ' ' + ymd(t.used_at) + ' 사용' : '') + (t.memo ? ' · ' + e(t.memo) : '') + '</div>' +
              (!t.used_at && !t.canceled ? '<div class="pl-btns"><button type="button" class="no" data-cancel="' + t.id + '">취소</button></div>' : '') + '</div>'; }).join("");
        $("adGo").onclick = function () { var b = this; b.disabled = true;
          BALPUM.Plan.make($("adM").value, $("adN").value, $("adW").value || null, $("adMm").value).then(function (codes) { b.disabled = false; showCodes(codes, $("adM").value, $("adW").selectedOptions[0].textContent); })
            .catch(function (er) { b.disabled = false; say(msgOf(er)); }); };
      }
      var redo = function (t) { say(t); showAdmin(true); };
      each("[data-open]", function (b) { b.onclick = function () { if (!confirm("이 사무소를 " + b.getAttribute("data-m") + "개월 열어 줄까요?")) return; BALPUM.Plan.adminSet(b.getAttribute("data-open"), "open", b.getAttribute("data-m")).then(function () { redo("열어 줬어요"); }).catch(function (er) { say(msgOf(er)); }); }; });
      each("[data-block]", function (b) { b.onclick = function () { if (!confirm("이 사무소의 신규 등록을 다시 막을까요? (보기 · 고치기는 그대로)")) return; BALPUM.Plan.adminSet(b.getAttribute("data-block"), "block").then(function () { redo("다시 막았어요"); }).catch(function (er) { say(msgOf(er)); }); }; });
      each("[data-free]", function (b) { b.onclick = function () { BALPUM.Plan.adminSet(b.getAttribute("data-free"), "free").then(function () { redo("무료로 두었어요"); }); }; });
      each("[data-unfree]", function (b) { b.onclick = function () { BALPUM.Plan.adminSet(b.getAttribute("data-unfree"), "unfree").then(function () { redo("무료를 풀었어요"); }); }; });
      each("[data-grace]", function (b) { b.onclick = function () { BALPUM.Plan.adminSet(b.getAttribute("data-grace"), "grace").then(function () { redo("오늘부터 7일 여유를 다시 줬어요"); }); }; });
      each("[data-done]", function (b) { b.onclick = function () { if (!confirm("입금 알림을 지울까요?")) return; BALPUM.Plan.adminSet(b.getAttribute("data-done"), "done").then(function () { redo("지웠어요"); }); }; });
      each("[data-cancel]", function (b) { b.onclick = function () { if (!confirm("이 이용권 번호를 취소할까요?")) return; BALPUM.Plan.cancel(+b.getAttribute("data-cancel")).then(function () { redo("취소했어요"); }).catch(function (er) { say(msgOf(er)); }); }; });
      each("[data-mk]", function (b) { b.onclick = function () { var m = b.getAttribute("data-m"), o = b.getAttribute("data-o");
        BALPUM.Plan.make(m, 1, b.getAttribute("data-mk"), "입금 확인").then(function (codes) { showCodes(codes, m, o + " 만"); }).catch(function (er) { say(msgOf(er)); }); }; });
    }).catch(function (er) { $("app").innerHTML += '<div class="err">' + e(msgOf(er)) + '</div>'; });
  };
  function showCodes(codes, m, who) {
    codes = codes || [];
    var msg = codes.length === 1 ? "🎫 발품 이용권 (" + m + "개월)\n" + codes[0] + "\n발품 → [내 사무소 · 계정] → [🎫 이용권 넣기]에 넣으면 바로 열려요. 고맙습니다!" : codes.join("\n");
    $("adOut").innerHTML = '<div class="card" style="border:2px solid #15803D"><div class="sect" style="margin-top:0">🎫 새 이용권 ' + codes.length + '장 · ' + m + '개월 · ' + e(who) + '</div>' +
      codes.map(function (c) { return '<div class="pl-code" style="margin-bottom:6px">' + e(c) + '</div>'; }).join("") +
      '<div class="pl-btns"><button type="button" class="pr" id="adCp">📋 ' + (codes.length === 1 ? "안내글과 같이 복사" : "모두 복사") + '</button>' + (codes.length === 1 ? '<button type="button" id="adSms">💬 문자로</button>' : '') + '</div>' +
      '<div class="hint">이 화면을 닫으면 번호를 다시 볼 수 없어요 (끝 4자리만 남아요).</div></div>';
    $("adCp").onclick = function () { copy(msg); };
    if ($("adSms")) $("adSms").onclick = function () { location.href = "sms:?body=" + encodeURIComponent(msg); };
    $("adOut").scrollIntoView({ behavior: "smooth" });
  }
  window.PLAN_ROUTE = function (st) { if (st && st.view === "admin") { showAdmin(true); return true; } return false; };
})();

/* ---------- 💡 첫 화면 안내 팝업 (v1.7) — [일주일 동안 안 보기] [닫기] ---------- */
(function () {
  "use strict";
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (er) { return null; } }
  var NATIVE = !!(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform());
  window.bpTips = function (who) {
    var key = "bp_tips_" + (who || "agent"), until = +ls(key) || 0;
    if (Date.now() < until || document.getElementById("bpTips") || sessionStorage.getItem(key)) return;
    var items = [
      ["🔔", "알림 허용", "처음에 \"알림을 허용할까요?\"가 뜨면 <b>[허용]</b>. 손님 상담 · 공유방 · 약속 알람이 소리로 와요. 놓쳤으면 핸드폰 설정 → 애플리케이션 → 발품 → 알림 켜기."],
      ["⬇", "새 앱 받는 법", "홈페이지(초대 페이지) → <b>[안드로이드 앱으로 받기]</b> → 받은 파일 열기 → <b>[업데이트]</b>. 지우지 않고 덮어 깔면 자료 · 로그인이 그대로예요."],
      ["♻", "지웠다 다시 깔았다면", "앱을 <b>한 번 열어야</b> 알림이 다시 등록돼요. 손님은 [전에 들어왔어요]에 같은 전화번호 + 숫자 6자리면 예전 방 그대로."],
      ["🌐", "바로 쓰기(웹)는", "앱을 닫으면 푸시 알림 소리가 오지 않아요. 소리 알림은 <b>안드로이드 앱</b>에서만 돼요."]
    ];
    if (!NATIVE) items.splice(2, 1);
    var d = document.createElement("div"); d.id = "bpTips";
    d.style.cssText = "position:fixed;inset:0;z-index:99990;background:rgba(15,23,42,.45);display:flex;align-items:center;justify-content:center;padding:16px";
    d.innerHTML = '<div role="dialog" aria-modal="true" aria-label="처음 안내" style="background:#fff;border-radius:18px;max-width:420px;width:100%;max-height:86vh;overflow:auto;padding:18px 16px 14px;box-shadow:0 20px 40px rgba(0,0,0,.25);font-family:\'Noto Sans KR\',sans-serif">' +
      '<div style="font-size:18px;font-weight:800;margin-bottom:10px">💡 발품 쓰기 전에 꼭 보세요</div>' +
      items.map(function (x) { return '<div style="display:flex;gap:10px;padding:9px 0;border-top:1px solid #F1F5F9"><span style="font-size:22px;flex:none;width:28px;text-align:center">' + x[0] + '</span><div><b style="display:block;margin-bottom:2px">' + x[1] + '</b><span style="font-size:13.5px;color:#475569;line-height:1.55">' + x[2] + '</span></div></div>'; }).join("") +
      '<div style="display:flex;gap:8px;margin-top:12px"><button type="button" id="bpTipsW" style="flex:1;padding:12px;border-radius:12px;border:1px solid #CBD5E1;background:#F8FAFC;font-weight:700">일주일 동안 안 보기</button>' +
      '<button type="button" id="bpTipsX" style="flex:1;padding:12px;border-radius:12px;border:0;background:#F97316;color:#fff;font-weight:800">닫기</button></div></div>';
    document.body.appendChild(d);
    var close = function () { d.remove(); try { sessionStorage.setItem(key, "1"); } catch (er) {} };
    document.getElementById("bpTipsX").onclick = close;
    document.getElementById("bpTipsW").onclick = function () { ls(key, String(Date.now() + 7 * 864e5)); close(); if (window.toast) toast("일주일 동안 안 보여요"); };
    d.onclick = function (ev) { if (ev.target === d) close(); };
  };
  // 다시 보기 (내 사무소 · 손님 설정에서 부를 수 있게): 안 보기 풀기
  window.bpTipsReset = function (who) { try { localStorage.removeItem("bp_tips_" + (who || "agent")); sessionStorage.removeItem("bp_tips_" + (who || "agent")); } catch (er) {} window.bpTips(who); };
})();
