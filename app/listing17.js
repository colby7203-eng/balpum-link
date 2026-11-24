/* =====================================================================
   발품투어 매물장 v1.7 — 매물 등록 더하기
   · 가격 여러 개 (거래 유형마다: 매매 · 전세 · 월세 동시에) [＋ 가격 추가] [－]
   · 의뢰인 여러 명 (집주인 · 세입자 · 관리인 · 가족 …) [＋ 의뢰인 추가] [－] · 👤 고객 카드로 연결
   · 비고 · 칸 묶음 접기 · 펴기
   예전 칸(price · deal_type · client_name · phone)은 첫 줄로 같이 채워서 예전 화면 · 검색도 그대로 돼요.
   Made by 정동철 · 상상을 현실로
   ===================================================================== */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  function e(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function J(s, d) { try { var v = JSON.parse(s); return Array.isArray(v) ? v : d; } catch (er) { return d; } }
  function dg(s) { return String(s || "").replace(/\D/g, ""); }
  var DEALS = ["매매", "전세", "월세", "반전세", "단기"];
  var ROLES = ["집주인", "세입자", "관리인", "가족", "부동산", "기타"];

  function prices(it) {
    it = it || {};
    var l = J(it.prices, null);
    if (l && l.length) return l.filter(function (p) { return p && (p.price || p.deal); });
    var deals = String(it.deal_type || "").split(/[·,\/]/).map(function (x) { return x.trim(); }).filter(Boolean);
    return it.price || deals.length ? [{ deal: deals[0] || "", price: it.price || "", memo: "" }] : [];
  }
  function clients(it) {
    it = it || {};
    var l = J(it.clients, null);
    if (l && l.length) return l.filter(function (c) { return c && (c.name || c.phone); });
    return it.client_name || it.phone ? [{ role: "", name: it.client_name || "", phone: it.phone || "", memo: "" }] : [];
  }
  function priceLine(it) { var l = prices(it); return l.map(function (p) { return [p.deal, p.price].filter(Boolean).join(" ") + (p.memo ? " (" + p.memo + ")" : ""); }).join(" · ") || [it.deal_type, it.price].filter(Boolean).join(" "); }
  // 목록 · 상세의 가격 줄 (거래 유형 배지 + 가격, 여러 개면 모두)
  function priceHTML(it) {
    var l = prices(it);
    if (!l.length) return '';
    return l.map(function (p, i) { return (i ? '<span class="l17-sep">·</span>' : '') + (p.deal ? '<span class="badge b-deal">' + e(p.deal) + '</span>' : '') + e(p.price) + (p.memo ? ' <small class="hint" style="margin:0">' + e(p.memo) + '</small>' : ''); }).join(" ");
  }
  function hasPhone(it, tel) { tel = dg(tel); if (!tel) return false; return clients(it).some(function (c) { return dg(c.phone) === tel; }) || dg(it.phone) === tel; }

  /* ---------- 접기 · 펴기 (펼침 상태 기억) ---------- */
  function foldOpen(key, def) { try { var v = localStorage.getItem("bp_fold_" + key); return v === null ? def : v === "1"; } catch (er) { return def; } }
  function fold(key, title, inner, def, preview) {
    return '<details class="l17-fold" data-fold="' + e(key) + '"' + (foldOpen(key, def) ? " open" : "") + '><summary><span class="t">' + title + '</span><span class="pv">' + e(preview || "") + '</span><span class="ar">▾</span></summary><div class="in">' + inner + '</div></details>';
  }
  function bindFolds(root) {
    Array.prototype.forEach.call((root || document).querySelectorAll("details.l17-fold"), function (d) {
      d.addEventListener("toggle", function () { try { localStorage.setItem("bp_fold_" + d.getAttribute("data-fold"), d.open ? "1" : "0"); } catch (er) {} });
    });
  }

  /* ---------- 등록 · 수정 화면 칸 ---------- */
  function priceRow(p, i) {
    p = p || {};
    return '<div class="l17-row" data-pr="' + i + '"><select class="l17-deal" aria-label="거래 유형">' + ['<option value="">유형</option>'].concat(DEALS.map(function (d) { return '<option' + (p.deal === d ? " selected" : "") + '>' + d + '</option>'; })).join("") + '</select>' +
      '<input class="l17-price" value="' + e(p.price || "") + '" placeholder="예) 500/50 · 2억3천" aria-label="가격">' +
      '<input class="l17-pmemo" value="' + e(p.memo || "") + '" placeholder="한마디 (예: 옵션 포함)" aria-label="가격 한마디">' +
      '<button type="button" class="l17-x" data-px="' + i + '" aria-label="이 가격 빼기">－</button></div>';
  }
  function clientRow(c, i) {
    c = c || {};
    return '<div class="l17-row l17-cl" data-cl="' + i + '"><select class="l17-role" aria-label="누구">' + ['<option value="">누구</option>'].concat(ROLES.map(function (r) { return '<option' + (c.role === r ? " selected" : "") + '>' + r + '</option>'; })).join("") + '</select>' +
      '<input class="l17-name" value="' + e(c.name || "") + '" placeholder="이름" aria-label="이름">' +
      '<input class="l17-phone" type="tel" inputmode="tel" value="' + e(c.phone || "") + '" placeholder="010-0000-0000" aria-label="전화번호">' +
      '<input class="l17-cmemo" value="' + e(c.memo || "") + '" placeholder="메모 (예: 오후에만 통화)" aria-label="메모">' +
      '<button type="button" class="l17-x" data-cx="' + i + '" aria-label="이 의뢰인 빼기">－</button></div>';
  }
  var CSS = '<style id="l17css">' +
    '.l17-fold{background:#fff;border:1px solid #E2E8F0;border-radius:14px;margin:10px 0;overflow:hidden}.l17-fold>summary{list-style:none;display:flex;gap:8px;align-items:center;padding:11px 13px;cursor:pointer;font-weight:800}' +
    '.l17-fold>summary::-webkit-details-marker{display:none}.l17-fold .pv{flex:1;min-width:0;color:#64748B;font-weight:500;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.l17-fold[open] .pv{display:none}' +
    '.l17-fold .ar{transition:transform .2s;color:#94A3B8}.l17-fold[open] .ar{transform:rotate(180deg)}.l17-fold>.in{padding:0 13px 12px}' +
    '.l17-row{display:grid;grid-template-columns:96px 1fr 34px;gap:6px;margin-top:6px;align-items:center}.l17-row .l17-pmemo{grid-column:1/3}.l17-row .l17-x{grid-row:1;grid-column:3}' +
    '.l17-cl{grid-template-columns:96px 1fr 34px}.l17-cl .l17-phone{grid-column:1/3}.l17-cl .l17-cmemo{grid-column:1/3}' +
    '.l17-row select,.l17-row input{margin:0!important;min-width:0}.l17-x{border:1px solid #FCA5A5;background:#FEF2F2;color:#B91C1C;border-radius:10px;height:40px;font-size:18px;font-weight:800;cursor:pointer}' +
    '.l17-row+.l17-row{border-top:1px dashed #E2E8F0;padding-top:6px}.l17-add{border:1.5px dashed #1E2A78;background:#EEF2FF;color:#1E2A78;border-radius:12px;padding:9px;width:100%;font:800 14px "Noto Sans KR",sans-serif;margin-top:8px;cursor:pointer}' +
    '.l17-sep{color:#94A3B8;margin:0 4px}.l17-cli{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:3px 0}.l17-cli .rl{background:#F1F5F9;border-radius:999px;padding:0 8px;font-size:12px;font-weight:800}' +
    '.l17-cli a.mini,.l17-cli button.mini{font-size:12.5px}' +
    '</style>';
  function editorHTML(it) {
    var pl = prices(it); if (!pl.length) pl = [{}];
    var cl = clients(it); if (!cl.length) cl = [{}];
    return CSS +
      fold("lf_price", "💰 거래 유형 · 가격", '<div id="l17P">' + pl.map(priceRow).join("") + '</div><button type="button" class="l17-add" id="l17Pa">＋ 가격 추가 (매매 · 전세 · 월세 동시에)</button>' +
        '<div class="hint">원룸처럼 가격이 여러 개면 줄을 더해요. 첫 줄이 목록 정렬 · 검색 기준이에요.</div>', true, priceLine(it)) +
      fold("lf_client", "👤 의뢰인 · 연락처", '<div id="l17C">' + cl.map(clientRow).join("") + '</div><button type="button" class="l17-add" id="l17Ca">＋ 의뢰인 추가 (집주인 · 세입자 …)</button>' +
        '<div class="hint">의뢰인 연락처는 내 매물장에만 보여요. 홍보장 · 손님 안내문 · 공유방에는 나가지 않아요.</div>', true, clients(it).map(function (c) { return [c.role, c.name].filter(Boolean).join(" "); }).join(", "));
  }
  function bindEditor() {
    var P = $("l17P"), C = $("l17C"); if (!P || !C) return;
    var collectP = function () { return Array.prototype.map.call(P.querySelectorAll(".l17-row"), function (r) { return { deal: r.querySelector(".l17-deal").value, price: r.querySelector(".l17-price").value.trim(), memo: r.querySelector(".l17-pmemo").value.trim() }; }); };
    var collectC = function () { return Array.prototype.map.call(C.querySelectorAll(".l17-row"), function (r) { return { role: r.querySelector(".l17-role").value, name: r.querySelector(".l17-name").value.trim(), phone: r.querySelector(".l17-phone").value.trim(), memo: r.querySelector(".l17-cmemo").value.trim() }; }); };
    var drawP = function (l) { P.innerHTML = l.map(priceRow).join(""); bindX(); };
    var drawC = function (l) { C.innerHTML = l.map(clientRow).join(""); bindX(); };
    var bindX = function () {
      Array.prototype.forEach.call(P.querySelectorAll("[data-px]"), function (b) { b.onclick = function () { var l = collectP(); l.splice(+b.getAttribute("data-px"), 1); drawP(l.length ? l : [{}]); }; });
      Array.prototype.forEach.call(C.querySelectorAll("[data-cx]"), function (b) { b.onclick = function () { var l = collectC(); l.splice(+b.getAttribute("data-cx"), 1); drawC(l.length ? l : [{}]); }; });
    };
    $("l17Pa").onclick = function () { var l = collectP(); var last = l[l.length - 1] || {}; l.push({ deal: last.deal === "매매" ? "전세" : last.deal === "전세" ? "월세" : (last.deal || "") }); drawP(l); var rs = P.querySelectorAll(".l17-price"); rs[rs.length - 1].focus(); };
    $("l17Ca").onclick = function () { var l = collectC(); l.push({ role: l.length === 1 && l[0].role === "세입자" ? "집주인" : "" }); drawC(l); var rs = C.querySelectorAll(".l17-name"); rs[rs.length - 1].focus(); };
    bindX(); bindFolds();
    L17._collect = function () {
      var pl = collectP().filter(function (p) { return p.price || p.deal; }), cl = collectC().filter(function (c) { return c.name || c.phone; });
      var deals = pl.map(function (p) { return p.deal; }).filter(function (d, i, a) { return d && a.indexOf(d) === i; });
      return { prices: JSON.stringify(pl), price: (pl[0] || {}).price || "", deal_type: deals.join("·"),
               clients: JSON.stringify(cl), client_name: (cl[0] || {}).name || "", phone: (cl[0] || {}).phone || "" };
    };
  }

  /* ---------- 상세 화면: 의뢰인 여러 명 + 전화 · 문자 · 👤 고객 카드 ---------- */
  function clientsDL(it) {
    var cl = clients(it);
    if (!cl.length) return '<dt>의뢰인</dt><dd class="hint" style="margin:0">없음</dd>';
    return (document.getElementById("l17css") ? '' : CSS) + '<dt>의뢰인</dt><dd>' + cl.map(function (c, i) { var t = dg(c.phone);
      return '<div class="l17-cli">' + (c.role ? '<span class="rl">' + e(c.role) + '</span>' : '') + '<b>' + e(c.name || "") + '</b>' +
        (t ? '<a class="mini" href="tel:' + e(t) + '">📞 ' + e(c.phone) + '</a><a class="mini" href="sms:' + e(t) + '">💬</a>' : '') +
        '<button type="button" class="mini" data-l17cust="' + i + '">👤 고객 카드</button>' + (c.memo ? '<span class="hint" style="margin:0;width:100%">' + e(c.memo) + '</span>' : '') + '</div>'; }).join("") + '</dd>';
  }
  function roleToCust(role, it) {
    var d = String((it && it.deal_type) || "");
    if (role === "집주인") return /매매/.test(d) && !/전세|월세/.test(d) ? "매도" : /매매/.test(d) ? "매도,임대인" : "임대인";
    return "";
  }
  function bindDetail(it) {
    var cl = clients(it);
    Array.prototype.forEach.call(document.querySelectorAll("[data-l17cust]"), function (b) {
      b.onclick = function () {
        var c = cl[+b.getAttribute("data-l17cust")] || {}, t = dg(c.phone);
        var go = function () {
          var found = t && typeof CUSTS !== "undefined" ? CUSTS.filter(function (x) { return dg(x["전화번호"]) === t; })[0] : null;
          if (found) { showCustDetail(found.id); return; }
          var memo = "매물 No." + it.id + " " + (it.name || "") + " 의뢰인" + (c.role ? " (" + c.role + ")" : "") + (c.memo ? " · " + c.memo : "");
          showCustForm(null, false, { "이름": c.name || "", "전화번호": c.phone || "", "역할": roleToCust(c.role, it), "메모": memo, "문의경로": "매물 의뢰" });
          if (window.toast) toast("고객으로 처음 등록해요. 아는 정보를 꼼꼼히 채워 저장하세요.");
        };
        if (typeof CLOADED !== "undefined" && !CLOADED && typeof custLoad === "function") custLoad().then(go, go); else go();
      };
    });
  }

  /* ---------- 전화번호 저절로 나누기 (모든 화면) ---------- */
  function fmtTel(v) {
    var d = dg(v); if (!d) return v;
    if (/^(15|16|18)\d{6}$/.test(d)) return d.slice(0, 4) + "-" + d.slice(4);
    if (/^02/.test(d)) { if (d.length <= 2) return d; if (d.length <= 5) return d.slice(0, 2) + "-" + d.slice(2); if (d.length <= 9) return d.slice(0, 2) + "-" + d.slice(2, d.length - 4) + "-" + d.slice(-4); return d.slice(0, 2) + "-" + d.slice(2, 6) + "-" + d.slice(6, 10); }
    if (/^0\d{2}/.test(d)) { if (d.length <= 3) return d; if (d.length <= 6) return d.slice(0, 3) + "-" + d.slice(3); if (d.length <= 10) return d.slice(0, 3) + "-" + d.slice(3, d.length - 4) + "-" + d.slice(-4); return d.slice(0, 3) + "-" + d.slice(3, 7) + "-" + d.slice(7, 11); }
    return v;
  }
  function isTel(t) { return t && t.tagName === "INPUT" && (t.type === "tel" || t.getAttribute("inputmode") === "tel" || /phone|tel|mobile|전화/i.test(t.id + " " + (t.name || "") + " " + (t.className || "") + " " + (t.getAttribute("aria-label") || ""))) && !/telegram/i.test(t.id); }
  document.addEventListener("input", function (ev) {
    var t = ev.target; if (!isTel(t)) return;
    var atEnd = t.selectionStart === t.value.length, v = fmtTel(t.value);
    if (v !== t.value && atEnd) { t.value = v; try { t.setSelectionRange(v.length, v.length); } catch (er) {} }
  }, true);
  document.addEventListener("blur", function (ev) { var t = ev.target; if (isTel(t)) { var v = fmtTel(t.value); if (v !== t.value) t.value = v; } }, true);

  window.L17 = { prices: prices, clients: clients, priceLine: priceLine, priceHTML: priceHTML, hasPhone: hasPhone, fold: fold, bindFolds: bindFolds,
    editorHTML: editorHTML, bindEditor: bindEditor, clientsDL: clientsDL, bindDetail: bindDetail, fmtTel: fmtTel, _collect: null };
})();
