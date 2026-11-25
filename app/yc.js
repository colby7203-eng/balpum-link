/* =====================================================================
   발품투어 매물장 v1.6 — 🎁 직빵 young call (동네 친구 샘이랑 영어 수다)
   · 위에 큰 단추 두 개: [🤙 샘이랑 수다] [🔁 통역 · 상황 연습]
   · 수다: ✏️ 원어민에게 어떻게 들리는지 · 🔊 · 🐢 · 📐 문법 구조 · ⭐ 저장 · 🧩 내가 만들기 · 🎯 오늘 표현
   · 통역: 🗣 마주 보고 통역 ([🇰🇷 내가 말하기] [🇺🇸 상대가 말하기] · 화면 크게) · 🎭 상황 연습 9가지 + 직접
   · ❓ 따로 묻기 (🔤 단어 찾기 · ✍️ 글로 번역) · ⭐ 내 생활 영어
   · 속상한 이야기엔 고치기를 쉬고, 위험한 말엔 한국어 + 109 안내
   · 재미나이 키는 각자 자기 무료 키 (발품 서버 비용 없음)
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
  function homeUrl() { var h = (BALPUM.config && BALPUM.config.HOMEPAGE) || ""; return h && !/\/$/.test(h) ? h + "/" : h; }
  function logo(px) { return window.BP_LOGO ? BP_LOGO("yc", px) : "직빵 young call"; }
  function home() { stopSpeak(); if (typeof showHome === "function") showHome(); }
  function plug(n) { return window.Capacitor && Capacitor.Plugins && Capacitor.Plugins[n]; }
  function hasKo(t) { return /[가-힣]/.test(String(t || "")); }
  function str(v, n) { return String(v == null ? "" : v).slice(0, n || 500); }
  function today() { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (er) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (er) {} }

  var CSS = '<style>' +
    '.yc-bar{display:flex;align-items:center;gap:8px;margin:-14px -14px 10px;padding:10px 12px;position:sticky;top:env(safe-area-inset-top,0px);z-index:15;box-shadow:0 2px 8px rgba(90,61,0,.12)}' +
    '.yc-bar .bk{border:0;background:rgba(30,42,120,.12);color:#1E2A78;border-radius:12px;padding:8px 11px;font:700 14px "Noto Sans KR",sans-serif;cursor:pointer;flex:none;white-space:nowrap;display:inline-flex;align-items:center;gap:2px}' +
    '.yc-bar .lg{flex:1;display:flex;justify-content:center;min-width:0}.yc-bar .ic{border:0;background:#fff;border-radius:12px;width:40px;height:40px;font-size:18px;cursor:pointer;flex:none;box-shadow:0 1px 3px rgba(0,0,0,.1)}' +
    '.yc-big{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:26px 0 10px}.yc-big button{border:2px solid #E1E4EE;background:#fff;border-radius:16px;padding:12px 6px;font:800 15px "Noto Sans KR",sans-serif;color:#1E2A78;cursor:pointer;line-height:1.3}' +
    '.yc-big button small{display:block;font:600 11.5px "Noto Sans KR",sans-serif;color:#64748B;margin-top:2px}.yc-big button.on{background:#1E2A78;color:#fff;border-color:#1E2A78}.yc-big button.on small{color:#C7CEF5}' +
    '.yc-st{font:700 12px "Noto Sans KR",sans-serif;color:#0E7E6C;text-align:center;margin:0 0 8px}' +
    '.yc-tools{display:flex;gap:6px;margin:0 0 10px;overflow-x:auto;padding:10px 2px 2px}.yc-tools button{flex:1 0 auto;border:1px solid #E1E4EE;background:#fff;border-radius:999px;padding:7px 11px;font:700 13px "Noto Sans KR",sans-serif;color:#1E2A78;cursor:pointer;white-space:nowrap;position:relative}' +
    '.yc-tools button.new:after{content:"NEW";position:absolute;top:-7px;right:-2px;background:#DC2626;color:#fff;border-radius:999px;font-size:9.5px;padding:0 5px;line-height:15px}' +
    '.yc-sorry{background:#FEF9C3;border:1px dashed #CA8A04;border-radius:12px;padding:8px 11px;font-size:12.5px;line-height:1.55;color:#713F12;margin:8px 0}.yc-sorry small{display:block;color:#92400E;margin-top:2px}' +
    '.yc-t2{margin-top:-4px}.yc-t2 b{background:#DC2626;color:#fff;border-radius:999px;padding:0 6px;font-size:11px}.yc-t2 b:empty{display:none}' +
    '.yc-pi{background:#FFFBEB;border:1px solid #FDE68A;border-radius:16px;padding:10px;margin-bottom:10px}.yc-pi .hd{display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap}.yc-pi .hd button{border:0;background:#fff;border-radius:999px;padding:5px 10px;font:700 12px "Noto Sans KR",sans-serif;margin-left:4px;cursor:pointer}' +
    '.yc-pi .add{display:flex;gap:6px;margin:8px 0}.yc-pi .add textarea{flex:1;border:1px solid #FCD34D;border-radius:10px;padding:7px;font:14px "Noto Sans KR",sans-serif}.yc-pi .add button{border:0;background:#F59E0B;color:#fff;border-radius:10px;font-weight:800;padding:0 12px;cursor:pointer}' +
    '.yc-pi .wall{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}.yc-pi .note{background:#FEF08A;border-radius:3px 3px 14px 3px;padding:10px 10px 6px;box-shadow:2px 4px 8px rgba(0,0,0,.15);transform:rotate(var(--r));font-size:14px;line-height:1.45}' +
    '.yc-pi .note.done{background:#DCFCE7;opacity:.75}.yc-pi .note textarea{width:100%;border:1px solid #CA8A04;border-radius:6px;font:14px "Noto Sans KR",sans-serif}.yc-pi .note .bt{display:flex;gap:3px;flex-wrap:wrap;margin-top:6px}.yc-pi .note .bt button{border:0;background:rgba(255,255,255,.7);border-radius:999px;padding:3px 7px;font-size:11.5px;cursor:pointer}' +
    '.yc-undo{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(120px + env(safe-area-inset-bottom,0px));z-index:9999;background:#0F172A;color:#fff;border-radius:999px;padding:9px 10px 9px 16px;font:700 14px "Noto Sans KR",sans-serif;display:flex;gap:10px;align-items:center;box-shadow:0 8px 20px rgba(0,0,0,.3)}.yc-undo button{border:0;background:#F97316;color:#fff;border-radius:999px;padding:6px 12px;font-weight:800;cursor:pointer}' +
    '.yc-sub{display:flex;gap:4px;background:#E2E8F0;border-radius:12px;padding:3px;margin-bottom:10px}.yc-sub button{flex:1;border:0;background:transparent;border-radius:10px;padding:9px 2px;font:700 13.5px "Noto Sans KR",sans-serif;color:#64748B;cursor:pointer}.yc-sub button.on{background:#fff;color:#0F172A;box-shadow:0 1px 3px rgba(0,0,0,.12)}' +
    '.yc-log{display:flex;flex-direction:column;gap:8px;padding-bottom:8px}' +
    '.yc-b{max-width:88%;border-radius:16px;padding:10px 12px;font-size:15px;line-height:1.5;word-break:break-word}' +
    '.yc-b.s{background:#fff;border:1px solid #E1E4EE;align-self:flex-start;border-top-left-radius:4px}.yc-b.u{background:#1E2A78;color:#fff;align-self:flex-end;border-top-right-radius:4px}' +
    '.yc-b .ko{display:block;font-size:12.5px;color:#5E6785;margin-top:5px;border-top:1px dashed #E1E4EE;padding-top:5px}.yc-b.u .ko{color:#C7CEF5;border-color:rgba(255,255,255,.25)}' +
    '.yc-tl{display:flex;gap:5px;margin-top:7px;flex-wrap:wrap}.yc-tl button{font:700 12px "Noto Sans KR",sans-serif;border:1px solid #E1E4EE;border-radius:999px;padding:4px 9px;color:#1E2A78;background:#F6F7FC;cursor:pointer}.yc-tl button.on{background:#FEF3C7;border-color:#F59E0B}.yc-tl button.del{color:#B91C1C}.yc-ua{align-self:flex-end;display:flex;gap:5px;margin-top:-4px}.yc-ua button{font:700 11.5px "Noto Sans KR",sans-serif;border:1px solid #E1E4EE;border-radius:999px;padding:3px 9px;background:#fff;color:#334155;cursor:pointer}' +
    '.yc-b.u .yc-tl button{background:rgba(255,255,255,.12);color:#fff;border-color:rgba(255,255,255,.3)}' +
    '.yc-fix{align-self:flex-end;width:88%;background:#FFF8E6;border:1px solid #FFD98A;border-radius:14px;font-size:13.5px;color:#4A3200;line-height:1.55}' +
    '.yc-fix summary{list-style:none;cursor:pointer;padding:8px 11px;font-weight:800;display:flex;gap:6px;align-items:center}.yc-fix summary::-webkit-details-marker{display:none}.yc-fix .bd{padding:0 11px 10px;display:grid;gap:5px}' +
    '.yc-fix .lv{display:inline-flex;gap:2px;margin-left:auto}.yc-fix .lv i{width:9px;height:9px;border-radius:50%;background:#E5D3A8;display:block}.yc-fix .lv i.on{background:#16A34A}' +
    '.yc-fix .r{display:grid;grid-template-columns:72px 1fr;gap:6px}.yc-fix .r b{color:#7A5A20;font-size:12px}.yc-fix .nat{font-weight:800;color:#0F172A;font-size:15px}.yc-fix .fx{background:#fff;border-radius:8px;padding:5px 8px}.yc-fix .fx s{color:#B91C1C}.yc-fix .fx ins{color:#15803D;text-decoration:none;font-weight:800}' +
    '.yc-fix .pr{color:#15803D;font-weight:700}' +
    '.yc-gr{align-self:stretch;background:#F5F3FF;border:1px solid #DDD6FE;border-radius:14px;padding:10px 12px;font-size:13.5px;line-height:1.55}.yc-gr .ps{display:flex;flex-wrap:wrap;gap:5px;margin:6px 0}.yc-gr .p{border:2px solid #A78BFA;border-radius:10px;padding:3px 8px;background:#fff;display:grid;text-align:center}.yc-gr .p b{font-size:11px}.yc-gr .p small{color:#64748B;font-size:11px}' +
    '.yc-tr{align-self:stretch;background:#EEF6FF;border:1px solid #C7DDF7;border-radius:14px;padding:10px 12px}.yc-tr .k{font:800 12px "Noto Sans KR",sans-serif;color:#1E5AA8}.yc-tr .big{font-size:19px;font-weight:800;margin:3px 0;line-height:1.4}' +
    '.yc-ex{align-self:stretch;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:14px;padding:10px 12px}.yc-ex .k{font:800 12px "Noto Sans KR",sans-serif;color:#15803D}.yc-ex .en{font-size:18px;font-weight:800;margin:3px 0}' +
    '.yc-cr{align-self:stretch;background:#FEF2F2;border:1.5px solid #FCA5A5;border-radius:14px;padding:12px;font-size:15px;line-height:1.6;color:#7F1D1D}.yc-cr a{display:inline-block;margin-top:8px;background:#DC2626;color:#fff;border-radius:12px;padding:9px 14px;font-weight:800;text-decoration:none}' +
    '.yc-wait{align-self:flex-start;color:#5E6785;font-size:13px;padding:4px 8px}' +
    '.yc-foot{position:fixed;left:50%;transform:translateX(-50%);bottom:var(--kb,0px);width:100%;max-width:640px;box-sizing:border-box;background:#F1F5F9;border-top:1px solid #E2E8F0;padding:8px 12px calc(6px + env(safe-area-inset-bottom,0px));z-index:20}' +
    'body.kb-open .yc-foot{padding-bottom:6px}' +
    '.yc-pad{height:150px}' +
    '.yc-in{display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:end}' +
    '.yc-in textarea{min-width:0;border:1px solid #CBD5E1;border-radius:18px;padding:10px 13px;font:16px/1.45 "Noto Sans KR",sans-serif;resize:none;background:#fff;height:46px;max-height:50vh;overflow-y:auto;box-sizing:border-box}' +
    '.yc-mic{width:52px;height:52px;border-radius:50%;border:0;background:#E0420C;color:#fff;font-size:22px;cursor:pointer;box-shadow:0 0 0 5px rgba(224,66,12,.15)}.yc-mic.on{animation:ycp 1.2s ease-in-out infinite}@keyframes ycp{50%{box-shadow:0 0 0 12px rgba(224,66,12,.1)}}' +
    '.yc-snd{width:46px;height:46px;border-radius:14px;border:0;background:#1E2A78;color:#fff;font-size:18px;cursor:pointer}' +
    '.yc-lang{display:flex;gap:6px;justify-content:center;margin:2px 0 4px}.yc-lang button{border:1px solid #E1E4EE;background:#fff;border-radius:999px;padding:4px 10px;font:700 12px "Noto Sans KR",sans-serif;color:#5E6785;cursor:pointer}.yc-lang button.on{border-color:#E0420C;color:#E0420C}' +
    '.yc-hero{border-radius:20px;padding:20px 14px;display:grid;justify-items:center;gap:8px;text-align:center;margin-bottom:12px}.yc-hero p{margin:0;font:700 14px "Noto Sans KR",sans-serif;color:#5A3D00;line-height:1.55}' +
    '.yc-face{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px}.yc-face button{border:0;border-radius:18px;padding:18px 6px;font:800 16px "Noto Sans KR",sans-serif;cursor:pointer;color:#fff;line-height:1.35}.yc-face .me{background:#1E2A78}.yc-face .you{background:#E0420C}.yc-face button.on{animation:ycp 1.2s ease-in-out infinite}.yc-face small{display:block;font-weight:600;font-size:12px;opacity:.85}' +
    '.yc-full{position:fixed;inset:0;z-index:99990;background:#fff;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:24px;text-align:center;gap:16px}.yc-full .t{font-size:clamp(28px,8vw,56px);font-weight:800;line-height:1.3;color:#0F172A;word-break:keep-all}.yc-full .s{font-size:18px;color:#64748B}.yc-full.flip .t{transform:rotate(180deg)}' +
    '.yc-full .bt{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}.yc-full .bt button{border:1px solid #CBD5E1;background:#fff;border-radius:999px;padding:10px 16px;font:700 15px "Noto Sans KR",sans-serif;cursor:pointer}' +
    '.yc-sit{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px}.yc-sit button{border:1.5px solid #E1E4EE;background:#fff;border-radius:12px;padding:10px 6px;font:700 13.5px "Noto Sans KR",sans-serif;cursor:pointer;text-align:left}.yc-sit button.on{border-color:#1E2A78;background:#EEF2FF}' +
    '.yc-ask{position:fixed;right:calc(12px + env(safe-area-inset-right,0px));bottom:calc(var(--kb,0px) + 128px + env(safe-area-inset-bottom,0px));z-index:21;border:0;border-radius:999px;background:#FFC53D;color:#1E2A78;font:800 14px "Noto Sans KR",sans-serif;padding:10px 14px;box-shadow:0 6px 16px rgba(0,0,0,.2);cursor:pointer}' +
    '.yc-sh{position:fixed;inset:0;z-index:99980;background:rgba(15,23,42,.45);display:flex;align-items:flex-end;justify-content:center}.yc-sh .in{background:#fff;width:100%;max-width:640px;border-radius:22px 22px 0 0;padding:12px 14px calc(16px + env(safe-area-inset-bottom,0px));max-height:88vh;overflow:auto;box-sizing:border-box;margin-bottom:var(--kb,0px)}' +
    '.yc-sh .hd{display:flex;align-items:center;gap:8px;margin-bottom:8px}.yc-sh .hd b{flex:1;font-size:16px}.yc-sh .hd button{border:0;background:#F1F5F9;border-radius:10px;padding:6px 10px;font-weight:800;cursor:pointer}' +
    '.yc-w h3{margin:4px 0 0;font-size:24px}.yc-w .ipa{color:#64748B;font-size:15px}.yc-w .mn{border-top:1px dashed #E2E8F0;padding-top:6px;margin-top:6px;font-size:14px;line-height:1.55}.yc-w .mn b{color:#7C3AED;font-size:12px}' +
    '.yc-bu{align-self:stretch;background:#fff;border:2px solid #FFC53D;border-radius:16px;padding:12px;display:grid;gap:8px;font-size:14px}.yc-bu .k{font:800 13px "Noto Sans KR",sans-serif;color:#9A3412}' +
    '.yc-chip{display:flex;flex-wrap:wrap;gap:6px}.yc-chip button{border:1px solid #CBD5E1;background:#fff;border-radius:10px;padding:7px 10px;font:700 14.5px "Noto Sans KR",sans-serif;cursor:pointer}.yc-chip button.used{opacity:.3}.yc-chip .ans{min-height:40px;border:1.5px dashed #94A3B8;border-radius:12px;padding:6px;width:100%;display:flex;flex-wrap:wrap;gap:6px;box-sizing:border-box}' +
    '.yc-q{display:grid;gap:6px}.yc-q button{border:1.5px solid #E1E4EE;background:#fff;border-radius:12px;padding:9px 10px;text-align:left;font:600 14px "Noto Sans KR",sans-serif;cursor:pointer}.yc-q button.ok{border-color:#16A34A;background:#F0FDF4}.yc-q button.no{border-color:#DC2626;background:#FEF2F2}' +
    '.yc-sv{background:#fff;border:1px solid #E2E8F0;border-radius:14px;padding:10px 12px;margin-bottom:8px}.yc-sv .en{font-weight:800;font-size:16px}.yc-sv .ko{color:#475569;font-size:13.5px}' +
    '@media (prefers-reduced-motion:reduce){.yc-mic.on,.yc-face button.on{animation:none}}' +
    '</style>';

  var ST = { loaded: false, cfg: {}, lines: [], tr: [], sit: { k: "free", txt: "", lines: [] }, saved: [], page: "chat", sub: "face", busy: false, lang: "en-US", key: "", model: "", models: [], tm: null, last: null };
  function app(h) { $("app").innerHTML = CSS + h; }

  /* ---------- 저장 ---------- */
  function load() {
    return Promise.all([BALPUM.DB.setting("yc", {}).catch(function () { return {}; }), BALPUM.DB.get("yc", "main").catch(function () { return null; }), BALPUM.API.appAiKey().catch(function () { return {}; }),
      (window.BP_CUST ? BALPUM.Room.myAgent().catch(function () { return null; }) : Promise.resolve(null)), BALPUM.DB.get("yc", "saved").catch(function () { return null; })]).then(function (r) {
      ST.cfg = r[0] || {}; var d = (r[1] && r[1].data) || {}; ST.lines = d.lines || []; ST.tr = d.tr || []; ST.sit = d.sit && d.sit.lines ? d.sit : { k: "free", txt: "", lines: [] };
      var k = r[2] || {}; ST.key = k.key || ""; ST.model = k.model || ""; ST.models = k.models || []; ST.ag = r[3]; ST.saved = ((r[4] && r[4].data) || {}).items || []; ST.loaded = true;
      if (!ST.cfg.name) ST.cfg.name = (r[3] && r[3].name) || (typeof OFFICE_INFO !== "undefined" && OFFICE_INFO && OFFICE_INFO.ceo) || "";
      return Promise.all([BALPUM.DB.get("yc", "posts").catch(function () { return null; }), BALPUM.DB.get("yc", "hist").catch(function () { return null; })]).then(function (q) {
        PI.items = ((q[0] && q[0].data) || {}).items || []; PI.hist = ((q[1] && q[1].data) || {}).list || []; });
    });
  }
  function saveMain() { ST.lines = ST.lines.slice(-80); ST.tr = ST.tr.slice(-40); ST.sit.lines = ST.sit.lines.slice(-40); clearTimeout(ST.tm);
    ST.tm = setTimeout(function () { BALPUM.DB.upsert("yc", "main", { lines: ST.lines, tr: ST.tr, sit: ST.sit }).catch(function () {}); }, 700); }
  var saveLines = saveMain;
  function saveCfg() { return BALPUM.DB.saveSetting("yc", ST.cfg); }
  function isSaved(en) { return ST.saved.some(function (x) { return x.en === en; }); }
  function toggleSave(en, ko, from) {
    en = str(en, 400); if (!en) return false;
    if (isSaved(en)) { ST.saved = ST.saved.filter(function (x) { return x.en !== en; }); say("⭐ 저장을 뺐어요"); }
    else { ST.saved.unshift({ en: en, ko: str(ko, 400), from: from || "", at: Date.now() }); ST.saved = ST.saved.slice(0, 300); say("⭐ 내 생활 영어에 저장했어요"); }
    BALPUM.DB.upsert("yc", "saved", { items: ST.saved }).catch(function () {});
    return isSaved(en);
  }

  /* ---------- 재미나이 (내 무료 키) ---------- */
  function gem(prompt) {
    if (!ST.key) return Promise.reject(new Error("재미나이 키를 먼저 넣어 주세요."));
    var models = [ST.model].concat(ST.models || [], ["gemini-flash-latest", "gemini-2.5-flash", "gemini-flash-lite-latest", "gemini-2.5-flash-lite", "gemini-2.0-flash"]).filter(function (m, i, a) { return m && a.indexOf(m) === i; });
    var busy = 0, last = "";
    function tryAt(i) {
      if (i >= models.length) return Promise.reject(new Error(busy ? "구글 AI가 지금 붐벼요. 잠시 뒤 다시 보내 주세요." : "쓸 수 있는 AI 모델을 찾지 못했어요 (" + last + ")."));
      var ac = window.AbortController ? new AbortController() : null, tmo = setTimeout(function () { if (ac) ac.abort(); }, 25000);
      return fetch("https://generativelanguage.googleapis.com/v1beta/models/" + models[i] + ":generateContent?key=" + encodeURIComponent(ST.key), {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: ac ? ac.signal : undefined,
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.8 } })
      }).then(function (res) { clearTimeout(tmo); return res.text().then(function (body) {
        if (res.status === 404) { last = models[i] + " 없음"; return tryAt(i + 1); }
        if (res.status >= 500) { busy++; last = models[i] + " 붐빔"; return new Promise(function (r) { setTimeout(r, 1200); }).then(function () { return tryAt(i + 1); }); }
        if (res.status === 400 && /API key not valid|API_KEY_INVALID/i.test(body)) throw new Error("재미나이 키가 맞지 않아요. ⚙에서 키를 다시 넣어 주세요.");
        if (res.status === 429) throw new Error("오늘 무료 사용량을 다 썼거나 너무 빨리 보냈어요. 잠시 뒤(또는 내일) 다시 해 주세요.");
        if (res.status === 401 || res.status === 403) throw new Error(/^AQ\./.test(ST.key) ? "이 AQ. 키를 구글이 막았어요. AI Studio에서 키를 새로 만들어 AIza 로 시작하는 키를 넣어 주세요 (⚙ → 키 바꾸기)." : "재미나이 키가 막혔어요 (" + res.status + "). AI Studio에서 키를 새로 만들어 넣어 주세요.");
        if (!res.ok) throw new Error("AI 연결 오류 (" + res.status + ")");
        var t = ""; try { t = JSON.parse(body).candidates[0].content.parts.map(function (x) { return x.text || ""; }).join(""); } catch (er) {}
        if (models[i] !== ST.model) { ST.model = models[i]; if (BALPUM.API.appAiModelSave) BALPUM.API.appAiModelSave(models[i]).catch(function () {}); }
        t = String(t || "").replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
        try { return JSON.parse(t); } catch (er) { throw new Error("샘의 답을 읽지 못했어요. 다시 보내 주세요."); }
      }); }, function (er) { clearTimeout(tmo); throw new Error(er && er.name === "AbortError" ? "구글이 25초 넘게 답이 없어요. 잠시 뒤 다시 눌러 주세요." : "인터넷 연결을 확인해 주세요."); });
    }
    return tryAt(0);
  }

  /* ---------- 샘 · 부탁하는 글 ---------- */
  function who() {
    return "너는 Sam 이야. 외국 시골 작은 농장 마을에서 한국으로 유학 온 사람이고, 사용자의 다정한 '동네 친구'야. 같은 동네에 살면서 산책길에 만나는 친구처럼 푸근하고 편하게 말해.\n" +
      "말투와 이야기는 시골 친구처럼 소박하고 정겹게 (고향 농장 · 가족 · 한국에서 처음 겪는 일 이야기를 가끔). 하지만 고쳐 주는 영어(바르게 · 원어민은)는 늘 표준 영어로 정확하게.\n" +
      "사용자 말을 잘못 알아들었으면 \"Oops, country boy here! 다시 말해 줄래?\" 처럼 가볍게 양해를 구하고 다시 물어봐.\n" +
      "사용자는 한국 사람이고 영어를 다시 배우는 중이야. 사용자를 \"" + (ST.cfg.name || "my friend") + "\" 라고 불러.\n" +
      "규칙:\n- 사용자 수준에 맞춰. 짧고 서툴게 쓰면 아주 쉬운 영어로, 잘 쓰면 조금 더 자연스럽게.\n" +
      "- 대화가 끊기지 않게 끝에 짧은 질문을 하나 붙여. 일·가족·취미·동네·고민을 궁금해해.\n" +
      "- 사용자가 힘들거나 속상하거나 외로운 이야기를 하면 mood 를 feel 로 하고, 고치기(fix.show)는 false 로 쉬고 먼저 공감해. 그래도 쉬운 영어로 이야기를 이어 가게 물어봐.\n" +
      "- 사용자가 죽고 싶다·자해 같은 위험한 말을 하면 mood 를 crisis 로 하고, crisis_ko 에 한국어로 따뜻하게 답해. 혼자 견디지 말고 자살예방상담전화 109(24시간)나 가까운 사람에게 꼭 연락하라고 알려 줘.\n" +
      "- 너는 AI 친구라는 걸 숨기지 마. 물으면 솔직하게 말해. 연인처럼 굴지 말고, 가끔 실제 친구·가족·동네 사람들과도 이야기해 보라고 응원해.\n" +
      "- 쉬운 영어 1~3문장. 이모지는 가끔 하나만.\n";
  }
  function hist() { return ST.lines.slice(-12).map(function (l) { return l.who === "s" ? "Sam: " + l.en : l.who === "u" ? "사용자: " + l.en : ""; }).filter(Boolean).join("\n"); }
  function hourKo() { var h = new Date().getHours(); return (h < 12 ? "오전 " : "오후 ") + ((h % 12) || 12) + "시"; }
  var FIX = "fix: 사용자 말을 원어민 귀로 판단해. show(고칠 게 있거나 한국어가 섞였으면 true), level 0(알아듣기 어려움)~3(완벽), heard(원어민에게 어떻게 들리는지, 한국어 한 줄), meaning(사용자가 하려던 말, 한국어), " +
    "corrected(사용자 문장을 최대한 살려 문법만 고친 문장), natural(원어민이 실제로 하는 말), fixes(고친 곳 목록: from, to, why 쉬운 한국어), praise(잘한 점 한국어 한 줄). 사용자가 한국어로 쓰면 level 0, corrected/natural 에 그 말을 영어로 하는 법.";
  function startPrompt() {
    return who() + "지금 시각: " + hourKo() + "\n지금까지 이야기(최근):\n" + (hist() || "(처음 만남)") + "\n\n지금 사용자에게 먼저 말을 걸어. " +
      (ST.lines.length ? "지난 이야기 중 하나를 자연스럽게 이어 물어봐." : "처음 만났으니 외국 시골에서 유학 온 동네 친구 Sam 이라고 짧게 소개하고 (예: Hey neighbor! I'm Sam, from a tiny farm town far away.), 오늘 어땠는지 물어봐.") +
      "\n이 JSON 모양으로만 답해: {\"say\":{\"en\":\"\",\"ko\":\"한국어 뜻\"}}";
  }
  function replyPrompt(t) {
    return who() + "지금까지 이야기:\n" + (hist() || "(없음)") + "\n사용자가 방금 한 말: " + t + "\n\n할 일:\n1) " + FIX + "\n2) say: Sam 의 다음 말 (en, ko).\n" +
      "이 JSON 모양으로만 답해: {\"fix\":{\"show\":true,\"level\":2,\"heard\":\"\",\"meaning\":\"\",\"corrected\":\"\",\"natural\":\"\",\"fixes\":[{\"from\":\"\",\"to\":\"\",\"why\":\"\"}],\"praise\":\"\"},\"say\":{\"en\":\"\",\"ko\":\"\"},\"mood\":\"normal|feel|crisis\",\"crisis_ko\":\"\"}";
  }
  function trPrompt(t, to) { var ko = to ? to === "en" : hasKo(t);
    return "너는 친절한 통역사야. 아래 말을 " + (ko ? "자연스러운 미국 영어로" : "자연스러운 한국어로") + " 옮겨. 말투는 일상 대화체, 존댓말.\n말: " + t +
      "\n이 JSON 모양으로만 답해: {\"out\":\"옮긴 말\",\"back\":\"옮긴 말을 다시 원래 말로 짧게 (확인용)\",\"tip\":\"알아 두면 좋은 점 한 줄 (한국어, 없으면 빈칸)\"}"; }
  function exPrompt() { return who() + "지금까지 이야기(최근):\n" + (hist() || "(없음)") + "\n\n오늘의 생활 영어 표현 하나를 골라 줘. 사용자 이야기와 관련 있으면 더 좋아. 집·동네·가족·일·쇼핑 같은 일상에서 바로 쓰는 표현으로.\n" +
    "그리고 사용자가 그 표현을 써서 대답해 보게 짧은 질문을 해.\n이 JSON 모양으로만 답해: {\"expr\":{\"en\":\"표현\",\"ko\":\"뜻\",\"ex\":\"예문\",\"exko\":\"예문 뜻\"},\"say\":{\"en\":\"질문\",\"ko\":\"한국어 뜻\"}}"; }
  function gramPrompt(en) { return "아래 영어 문장의 문법 구조를 영어를 다시 배우는 한국 어른에게 쉬운 한국어로 설명해.\n문장: " + en +
    "\n이 JSON 모양으로만 답해: {\"parts\":[{\"t\":\"문장 조각\",\"r\":\"주어|동사|목적어|보어|수식어|접속사|전치사구 등\",\"k\":\"조각 뜻\"}],\"pattern\":\"문장 형식 (예: 3형식 주어+동사+목적어)\",\"tense\":\"시제\",\"points\":[{\"n\":\"포인트\",\"d\":\"쉬운 설명\",\"ex\":\"예문\"}],\"literal\":\"직역\",\"natural\":\"자연스러운 뜻\"}"; }

  /* ---------- 말하기 · 듣기 ---------- */
  function stopSpeak() { try { var T = plug("TextToSpeech"); if (T && T.stop) T.stop().catch(function () {}); if (window.speechSynthesis) speechSynthesis.cancel(); } catch (er) {} }
  function speak(t, slow, lang) {
    t = String(t || ""); if (!t) return; lang = lang || (hasKo(t) ? "ko-KR" : "en-US");
    var T = plug("TextToSpeech"), rate = slow ? 0.7 : (ST.cfg.rate || 1);
    if (T && T.speak) { try { T.stop && T.stop().catch(function () {}); } catch (er) {} T.speak({ text: t, lang: lang, rate: rate, pitch: 1, volume: 1, category: "playback" }).catch(function () { webSpeak(t, rate, lang); }); return; }
    webSpeak(t, rate, lang);
  }
  function webSpeak(t, rate, lang) {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) { say("이 핸드폰에서는 읽어 주기가 안 돼요."); return; }
    try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(t); u.lang = lang; u.rate = rate;
      var v = speechSynthesis.getVoices().filter(function (x) { return x.lang && x.lang.replace("_", "-") === lang; })[0]; if (v) u.voice = v; speechSynthesis.speak(u); } catch (er) {}
  }
  function listen(lang, cb, btn) {
    var SR = plug("SpeechRecognition");
    var off = function () { if (btn) btn.classList.remove("on"); };
    var got = function (t) { off(); t = String(t || "").trim(); if (t) cb(t); };
    var fail = function () { off(); say("마이크가 안 되면 자판의 🎤 를 눌러 말해도 돼요."); };
    if (btn) btn.classList.add("on");
    stopSpeak();
    if (SR && SR.start) {
      var perm = SR.requestPermissions ? SR.requestPermissions() : SR.requestPermission ? SR.requestPermission() : Promise.resolve();
      Promise.resolve(perm).catch(function () {}).then(function () {
        return SR.start({ language: lang, maxResults: 1, prompt: lang === "ko-KR" ? "한국말로 말해 주세요" : "Speak in English", partialResults: false, popup: true });
      }).then(function (r) { got(r && r.matches && r.matches[0]); }).catch(fail);
      return;
    }
    var W = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!W) { fail(); return; }
    try { var rec = new W(); rec.lang = lang; rec.interimResults = false; rec.maxAlternatives = 1;
      rec.onresult = function (ev) { got(ev.results[0][0].transcript); }; rec.onerror = fail; rec.onend = off; rec.start(); } catch (er) { fail(); }
  }

  /* ---------- 화면 틀 ---------- */
  window.ycHasNew = function () { return lsGet("yc_ex_day") !== today(); };
  window.showYC = function (fromHist) {
    if (!fromHist) go("yc");
    app('<div class="loading">샘 부르는 중…</div>');
    load().then(function () { if (!ST.key) keyPage(); else mainPage(); }).catch(function (er) { app('<div class="card"><div class="err">' + e(msgOf(er)) + '</div><button class="btn" onclick="showYC()">다시 해 보기</button></div>'); });
  };
  function bar(right) { return '<div class="yc-bar bpy"><button class="bk" id="ycBk">← 처음</button><div class="lg">' + logo(24) + '</div>' + (right || '') + '</div>'; }
  function askBtn() { return '<button type="button" class="yc-ask" id="ycAsk">❓ 따로 묻기</button>'; }
  function bindAsk() { if ($("ycAsk")) $("ycAsk").onclick = function () { askSheet("word"); }; }

  function keyPage() {
    app(bar() + '<div class="yc-hero bpy">' + logo(40) + '<p>외국 시골에서 유학 온 동네 친구 샘이랑 영어로 수다 떨기<br>외국인 손님 · 길에서 만난 사람과도 통역<br>틀려도 괜찮아요 · 한국말로 물어봐도 돼요</p></div>' +
      '<div class="card"><div class="sect" style="margin-top:0">🔑 처음 한 번만: 재미나이 무료 키 넣기</div>' +
      '<div class="howkey"><ol><li>아래 [키 만들러 가기]를 눌러 구글 계정으로 들어가요</li><li><b>Create API key</b>(API 키 만들기)를 눌러요</li><li>생긴 키 옆 <b>복사</b>를 눌러요 — 키는 <b>AQ.</b> 또는 <b>AIza</b>로 시작해요. 둘 다 맞는 키예요</li><li>여기 [📋 붙여넣기]를 누르거나 칸을 길게 눌러 붙여넣기 → [저장]</li></ol>' +
      '<div class="safe">✅ 무료예요. 키는 내 계정에만 저장되고 화면엔 끝 4자리만 보여요. 이 키를 넣어도 다른 프로그램은 그대로 잘 돼요.</div></div>' +
      '<a class="btn ghost" href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">🔑 키 만들러 가기</a>' +
      '<label for="ycKey">재미나이 키</label><input id="ycKey" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="AQ. 또는 AIza… 로 시작해요">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px"><button type="button" class="btn ghost" id="ycKP" style="margin:0">📋 붙여넣기</button><button type="button" class="btn ghost" id="ycKC" style="margin:0">✕ 칸 비우기</button></div>' +
      '<button class="btn" id="ycKS">저장하고 샘 만나기</button>' +
      (window.BP_CUST ? '<div class="hint">어려우면 부동산 사장님께 [상담]으로 "영콜 키 넣는 것 도와주세요"라고 보내세요.</div>' : '') + '</div><div style="height:40vh"></div>');
    $("ycBk").onclick = home;
    var kf = $("ycKey");
    kf.addEventListener("focus", function () { setTimeout(function () { try { kf.scrollIntoView({ block: "center", behavior: "smooth" }); } catch (er) {} }, 400); });
    $("ycKC").onclick = function () { kf.value = ""; kf.focus(); };
    $("ycKP").onclick = function () { var C = plug("Clipboard"), rd = C && C.read ? C.read().then(function (r) { return (r && r.value) || ""; }) : (navigator.clipboard && navigator.clipboard.readText ? navigator.clipboard.readText() : Promise.reject());
      Promise.resolve(rd).then(function (t) { t = String(t || "").replace(/\s+/g, ""); if (!t) throw 0; kf.value = t; say("붙여 넣었어요. [저장하고 샘 만나기]를 누르세요."); }).catch(function () { say("칸을 길게 눌러 붙여넣기 해 주세요."); }); };
    $("ycKS").onclick = function () { var v = $("ycKey").value.replace(/\s+/g, ""), b = this; if (!/^(AIza|AQ\.)[0-9A-Za-z_.\-]{16,}$/.test(v)) { say("키 전체를 다시 복사해 넣어 주세요 (AIza… 또는 AQ. 로 시작)."); return; }
      b.disabled = true; b.textContent = "확인하는 중…";
      BALPUM.API.appAiSettingsSave({ geminiKey: v }).then(function () { ST.key = v; ST.model = ""; return gem('{"ok":true} 만 JSON으로 답해.'); })
        .then(function () { say("연결됐어요! 샘이 말을 걸어요."); mainPage(); })
        .catch(function (er) { b.disabled = false; b.textContent = "저장하고 샘 만나기"; say(msgOf(er)); }); };
  }

  /* ---------- 한 줄 그리기 ---------- */
  function tools(i, en, opt) { opt = opt || {};
    return '<div class="yc-tl"><button type="button" data-sp="' + i + '">🔊 듣기</button><button type="button" data-sl="' + i + '">🐢 천천히</button>' +
      (opt.gram !== false ? '<button type="button" data-gr="' + i + '">📐 문법 구조</button>' : '') +
      '<button type="button" data-sv="' + i + '" class="' + (isSaved(en) ? "on" : "") + '">' + (isSaved(en) ? "⭐ 저장됨" : "☆ 저장") + '</button><button type="button" data-pin="' + i + '">📝 포스트잇</button><button type="button" class="del" data-ldl="' + i + '" aria-label="지우기">🗑</button></div>'; }
  function fixHTML(f, i) {
    if (!f || !f.show) return '';
    var lv = Math.max(0, Math.min(3, +f.level || 0));
    return '<details class="yc-fix"' + (i === ST.lines.length - 2 || i === ST.lines.length - 1 ? " open" : "") + '><summary>✏️ 원어민에게 어떻게 들리는지 <span class="lv" aria-label="' + lv + '/3">' + [1, 2, 3].map(function (n) { return '<i class="' + (n <= lv ? "on" : "") + '"></i>'; }).join("") + '</span></summary><div class="bd">' +
      (f.heard ? '<div class="r"><b>이렇게 들려요</b><span>' + e(f.heard) + '</span></div>' : '') +
      (f.meaning ? '<div class="r"><b>하려던 말</b><span>' + e(f.meaning) + '</span></div>' : '') +
      (f.corrected ? '<div class="r"><b>바르게</b><span>' + e(f.corrected) + '</span></div>' : '') +
      (f.natural ? '<div class="r"><b>원어민은</b><span class="nat">' + e(f.natural) + '</span></div>' : '') +
      (f.fixes || []).filter(function (x) { return x && (x.from || x.to); }).map(function (x) { return '<div class="fx"><s>' + e(x.from) + '</s> → <ins>' + e(x.to) + '</ins>' + (x.why ? ' · ' + e(x.why) : '') + '</div>'; }).join("") +
      (f.praise ? '<div class="pr">👍 ' + e(f.praise) + '</div>' : '') +
      '<div class="yc-tl"><button type="button" data-fsp="' + i + '">🔊 원어민 말 듣기</button><button type="button" data-fsl="' + i + '">🐢 천천히</button><button type="button" data-fgr="' + i + '">📐 문법 구조</button><button type="button" data-fsv="' + i + '" class="' + (isSaved(f.natural || f.corrected) ? "on" : "") + '">' + (isSaved(f.natural || f.corrected) ? "⭐ 저장됨" : "☆ 저장") + '</button></div></div></details>';
  }
  function gramHTML(g) {
    if (!g) return '';
    if (g.busy) return '<div class="yc-gr">📐 문법 구조 보는 중…</div>';
    return '<div class="yc-gr"><b>📐 문법 구조</b> <small class="hint" style="margin:0">' + e(g.en || "") + '</small><div class="ps">' + (g.parts || []).map(function (p) { return '<span class="p"><b>' + e(p.r) + '</b>' + e(p.t) + (p.k ? '<small>' + e(p.k) + '</small>' : '') + '</span>'; }).join("") + '</div>' +
      (g.pattern ? '<div>· 문장 형식: ' + e(g.pattern) + '</div>' : '') + (g.tense ? '<div>· 시제: ' + e(g.tense) + '</div>' : '') +
      (g.points || []).map(function (p) { return '<div>📌 <b>' + e(p.n) + '</b> ' + e(p.d) + (p.ex ? ' <i>예) ' + e(p.ex) + '</i>' : '') + '</div>'; }).join("") +
      (g.literal ? '<div>· 직역: ' + e(g.literal) + '</div>' : '') + (g.natural ? '<div>· 자연스럽게: ' + e(g.natural) + '</div>' : '') +
      '<div class="hint" style="margin:4px 0 0">재미나이(AI)가 나눈 것이라 가끔 틀릴 수 있어요</div></div>';
  }
  function lineHTML(l, i) {
    if (l.who === "s") return '<div class="yc-b s">' + e(l.en) + (l.ko ? '<span class="ko">' + e(l.ko) + '</span>' : '') + tools(i, l.en) + '</div>' + gramHTML(l.gram);
    if (l.who === "u") return '<div class="yc-b u">' + e(l.en) + (l.v ? '<span class="ko">🎤 말로 했어요</span>' : '') + '</div>' +
      '<div class="yc-ua"><button type="button" data-ued="' + i + '">✏️ 고치기</button><button type="button" data-udl="' + i + '">🗑 지우기</button><button type="button" data-ugr="' + i + '">📐 내 말 문법</button></div>' + fixHTML(l.fix, i) + gramHTML(l.gram);
    if (l.who === "c") return '<div class="yc-cr">' + e(l.ko).replace(/\n/g, "<br>") + '<br><a href="tel:109">📞 109 자살예방상담전화 (24시간)</a><div class="yc-tl"><button type="button" class="del" data-ldl="' + i + '">🗑 지우기</button></div></div>';
    if (l.who === "c") return '<div class="yc-cr">' + e(l.ko).replace(/\n/g, "<br>") + '<br><a href="tel:109">📞 109 자살예방상담전화 (24시간)</a></div>';
    if (l.who === "x") return '<div class="yc-ex"><span class="k">🎯 오늘 표현</span><div class="en">' + e(l.en) + '</div><div>' + e(l.ko) + '</div>' + (l.ex ? '<div style="margin-top:4px">예) ' + e(l.ex) + ' <span class="hint" style="margin:0">' + e(l.exko) + '</span></div>' : '') + tools(i, l.en) + '</div>' + gramHTML(l.gram);
    if (l.who === "b") return buildDoneHTML(l, i);
    return '';
  }
  function lineEn(l, fix) { return fix ? ((l.fix && (l.fix.natural || l.fix.corrected)) || l.en) : l.who === "x" ? l.en + ". " + (l.ex || "") : l.en; }
  function bindLines(arr, redraw) {
    var get = function (b, a) { return arr[+b.getAttribute(a)]; };
    each("[data-sp]", function (b) { b.onclick = function () { speak(lineEn(get(b, "data-sp"))); }; });
    each("[data-sl]", function (b) { b.onclick = function () { speak(lineEn(get(b, "data-sl")), true); }; });
    each("[data-fsp]", function (b) { b.onclick = function () { speak(lineEn(get(b, "data-fsp"), true)); }; });
    each("[data-fsl]", function (b) { b.onclick = function () { speak(lineEn(get(b, "data-fsl"), true), true); }; });
    each("[data-sv]", function (b) { b.onclick = function () { var l = get(b, "data-sv"); toggleSave(l.en, l.ko || l.exko || "", "수다"); redraw(); }; });
    each("[data-pin]", function (b) { b.onclick = function () { var l = get(b, "data-pin"); piAdd(l.en + (l.ko ? "\n" + l.ko : "")); }; });
    each("[data-fsv]", function (b) { b.onclick = function () { var l = get(b, "data-fsv"); toggleSave(l.fix.natural || l.fix.corrected, l.fix.meaning || l.en, "고친 말"); redraw(); }; });
    var gram = function (l, en) {
      if (l.gram && !l.gram.busy && l.gram.en === en) { delete l.gram; redraw(); return; }
      l.gram = { busy: true }; redraw();
      gem(gramPrompt(en)).then(function (g) { g = g || {}; g.en = en; l.gram = g; saveMain(); redraw(); }).catch(function (er) { delete l.gram; redraw(); say(msgOf(er)); });
    };
    each("[data-gr]", function (b) { b.onclick = function () { var l = get(b, "data-gr"); gram(l, l.en); }; });
    each("[data-fgr]", function (b) { b.onclick = function () { var l = get(b, "data-fgr"); gram(l, l.fix.natural || l.fix.corrected); }; });
    each("[data-ugr]", function (b) { b.onclick = function () { var l = get(b, "data-ugr"); gram(l, l.en); }; });
    // v1.6 ✏️ 고치기 · 🗑 지우기 — 내 말과 그 뒤 답(샘/상대)까지 같이 지워서 앞뒤가 안 맞는 대화가 남지 않게
    var cut = function (i) { var j = i + 1; while (j < arr.length && arr[j].who !== "u" && arr[j].who !== "b" && arr[j].who !== "x") j++; arr.splice(i, j - i); saveMain(); };
    each("[data-udl]", function (b) { b.onclick = function () { if (ST.busy) return; if (!confirm("이 말과 뒤따른 답을 지울까요?")) return; cut(+b.getAttribute("data-udl")); redraw(); say("지웠어요"); }; });
    each("[data-ued]", function (b) { b.onclick = function () { if (ST.busy) return; var i = +b.getAttribute("data-ued"), t = arr[i].en; cut(i); redraw();
      var T = $("ycT"); if (T) { T.value = t; T.dispatchEvent(new Event("input")); T.focus(); } say("아래 칸에서 고쳐서 엔터를 누르면 다시 보내요"); }; });
    each("[data-ldl]", function (b) { b.onclick = function () { if (ST.busy) return; arr.splice(+b.getAttribute("data-ldl"), 1); saveMain(); redraw(); }; });
  }

  /* ---------- 큰 화면: 위 큰 단추 두 개 ---------- */
  function mainPage() {
    window.scrollTo(0, 0);
    var chat = ST.page === "chat";
    app(bar('<button class="ic" id="ycSvd" aria-label="내 생활 영어">⭐</button><button class="ic" id="ycGf" aria-label="친구에게 선물하기">🎁</button><button class="ic" id="ycSet" aria-label="설정">⚙</button>') +
      '<div class="yc-big"><button type="button" data-pg="chat" class="' + (chat ? "on" : "") + '">🤙 샘이랑 수다<small>유학 온 동네 친구 · 고쳐 주기</small></button><button type="button" data-pg="tr" class="' + (!chat ? "on" : "") + '">🔁 통역 · 상황 연습<small>외국인 손님 · 길 · 여행</small></button></div>' +
      '<div id="ycBody"></div><div class="yc-pad" id="ycPad"></div>' +
      '<div class="yc-foot" id="ycFoot"><div class="yc-in"><button type="button" class="yc-mic" id="ycMic" aria-label="말하기">🎤</button><textarea id="ycT" rows="1" enterkeyhint="send"></textarea><button type="button" class="yc-snd" id="ycS" aria-label="보내기">↑</button></div>' +
      '<div class="yc-lang" id="ycLg"></div></div>' + askBtn());
    $("ycBk").onclick = home; $("ycSet").onclick = setPage; $("ycGf").onclick = function () { showYCGift(); }; $("ycSvd").onclick = savedPage;
    each("[data-pg]", function (b) { b.onclick = function () { ST.page = b.getAttribute("data-pg"); stopSpeak(); mainPage(); }; });
    bindAsk(); bindInput();
    if (chat) chatBody(); else trBody();
  }
  function padFix() { var f = $("ycFoot"), p = $("ycPad"); if (f && p) p.style.height = (f.offsetHeight + 70) + "px"; }
  function bindInput() {
    var T = $("ycT");
    var grow = function () { T.style.height = "46px"; if (T.value) T.style.height = Math.max(46, T.scrollHeight + 2) + "px"; padFix(); };
    var fire = function () { var v = T.value.replace(/\n+$/, ""); T.value = ""; grow(); onSend(v); };
    T.addEventListener("keydown", function (ev) { if (ev.key === "Enter" && !ev.shiftKey && !ev.isComposing && ev.keyCode !== 229) { ev.preventDefault(); fire(); } });
    T.addEventListener("input", function (ev) { if (ev.inputType === "insertLineBreak" || /\n$/.test(T.value)) { fire(); return; } grow(); });
    $("ycS").onclick = fire;
    $("ycMic").onclick = function () { var b = this; listen(micLang(), function (t) { onSend(t, true); }, b); };
    setTimeout(padFix, 50);
  }
  function micLang() { return ST.page === "chat" ? ST.lang : ST.sub === "sit" ? "en-US" : ST.lang; }
  function setLangRow(show) {
    var L = $("ycLg"); if (!L) return;
    L.innerHTML = show ? '<button type="button" data-lg="en-US" class="' + (ST.lang === "en-US" ? "on" : "") + '">🎤 영어로 말하기</button><button type="button" data-lg="ko-KR" class="' + (ST.lang === "ko-KR" ? "on" : "") + '">🎤 한국말로 말하기</button>' : '';
    each("[data-lg]", function (b) { b.onclick = function () { ST.lang = b.getAttribute("data-lg"); setLangRow(true); }; });
    padFix();
  }
  var onSend = function () {};
  // 마지막 말이 아래 쓰는 칸에 가리지 않을 만큼만 내리기 (짧을 땐 그대로 두어 위 단추가 머리줄에 안 묻히게)
  function toBottom() { setTimeout(function () { var f = $("ycFoot"), L = $("ycL") || $("trL") || $("stL"); if (!f || !L) return;
    var gap = L.getBoundingClientRect().bottom - f.getBoundingClientRect().top + 12; if (gap > 0) window.scrollBy(0, gap); }, 30); }

  /* ---------- 📝 포스트잇 (v1.8) — 외울 것 붙여 두기 · 다 외우면 [외웠어요] · 지우기 ---------- */
  var PI = { items: [], hist: [], open: false, showDone: false };
  function piSave() { BALPUM.DB.upsert("yc", "posts", { items: PI.items.slice(0, 200) }).catch(function () {}); var n = $("ycPiN"); if (n) n.textContent = PI.items.filter(function (x) { return !x.done; }).length || ""; }
  function piAdd(t) { t = String(t || "").trim().slice(0, 400); if (!t) return; PI.items.unshift({ t: t, at: Date.now(), done: false }); piSave(); PI.open = true; piDraw(); say("📝 포스트잇에 붙였어요"); }
  function piDraw() {
    var B = $("ycPiB"); if (!B) return;
    if (!PI.open) { B.innerHTML = ""; return; }
    var list = PI.items.map(function (x, i) { return { x: x, i: i }; }).filter(function (o) { return PI.showDone || !o.x.done; });
    var nd = PI.items.filter(function (x) { return x.done; }).length;
    B.innerHTML = '<div class="yc-pi"><div class="hd"><b>📝 외울 것 포스트잇</b><span><button type="button" id="piDn">' + (PI.showDone ? "외운 것 숨기기" : "✅ 외운 것 " + nd + " 보기") + '</button><button type="button" id="piX">접기 ▴</button></span></div>' +
      '<div class="add"><textarea id="piT" rows="2" placeholder="기억하고 싶은 말 · 표현을 적고 [＋ 붙이기]"></textarea><button type="button" id="piA">＋ 붙이기</button></div>' +
      (list.length ? '<div class="wall">' + list.map(function (o) { var x = o.x;
        return '<div class="note' + (x.done ? " done" : "") + '" style="--r:' + ((o.i % 5) - 2) * 1.2 + 'deg">' + (x.edit ? '<textarea data-pe="' + o.i + '" rows="3">' + e(x.t) + '</textarea>' : '<div class="tx">' + e(x.t).replace(/\n/g, "<br>") + '</div>') +
          '<div class="bt"><button type="button" data-pd="' + o.i + '">' + (x.done ? "↩ 다시 외우기" : "✅ 외웠어요") + '</button><button type="button" data-pk="' + o.i + '">🔊</button><button type="button" data-ped="' + o.i + '">' + (x.edit ? "💾 저장" : "✏️") + '</button><button type="button" data-px="' + o.i + '">🗑</button></div></div>'; }).join("") + '</div>'
        : '<div class="hint" style="margin:6px 0 0">아직 붙인 포스트잇이 없어요. 샘 말 아래 [📝 포스트잇]을 누르거나 위에 적어 붙여 보세요.</div>') + '</div>';
    $("piX").onclick = function () { PI.open = false; piDraw(); };
    $("piDn").onclick = function () { PI.showDone = !PI.showDone; piDraw(); };
    $("piA").onclick = function () { piAdd($("piT").value); };
    each("[data-pd]", function (b) { b.onclick = function () { var x = PI.items[+b.getAttribute("data-pd")]; x.done = !x.done; piSave(); piDraw(); if (x.done) say("✅ 잘했어요! 외운 것으로 넣어 두었어요"); }; });
    each("[data-pk]", function (b) { b.onclick = function () { speak(PI.items[+b.getAttribute("data-pk")].t.split("\n")[0]); }; });
    each("[data-px]", function (b) { b.onclick = function () { if (!confirm("이 포스트잇을 지울까요?")) return; PI.items.splice(+b.getAttribute("data-px"), 1); piSave(); piDraw(); }; });
    each("[data-ped]", function (b) { b.onclick = function () { var i = +b.getAttribute("data-ped"), x = PI.items[i];
      if (x.edit) { var ta = document.querySelector('[data-pe="' + i + '"]'); x.t = (ta ? ta.value : x.t).trim() || x.t; delete x.edit; piSave(); } else x.edit = true; piDraw(); }; });
  }
  /* ---------- 🔄 새로 시작 (v1.8) — 지금 대화는 '지난 대화'에 보관하고 깨끗하게 · 10초 안에 되돌리기 ---------- */
  function newStart() {
    if (ST.busy) return;
    if (!ST.lines.length) { say("이미 새 대화예요"); return; }
    if (!confirm("지금 대화를 지우고 새로 시작할까요?\n(지난 대화에 보관해 두어요 · ⭐ 내 생활 영어와 📝 포스트잇은 그대로)")) return;
    var keep = ST.lines.slice();
    PI.hist.unshift({ at: Date.now(), lines: keep.slice(-60) }); PI.hist = PI.hist.slice(0, 10);
    BALPUM.DB.upsert("yc", "hist", { list: PI.hist }).catch(function () {});
    ST.lines = []; saveMain(); mainPage();
    var d = document.createElement("div"); d.className = "yc-undo";
    d.innerHTML = '🔄 새로 시작했어요 <button type="button">↩ 되돌리기</button>'; document.body.appendChild(d);
    var t = setTimeout(function () { d.remove(); }, 10000);
    d.querySelector("button").onclick = function () { clearTimeout(t); d.remove(); ST.lines = keep; PI.hist.shift(); BALPUM.DB.upsert("yc", "hist", { list: PI.hist }).catch(function () {}); saveMain(); mainPage(); say("되돌렸어요"); };
  }
  function oldPage() {
    window.scrollTo(0, 0);
    app(bar() + '<div class="card"><div class="sect" style="margin-top:0">🗂 지난 대화 (최근 10개)</div><div class="hint" style="margin-top:0">[🔄 새로 시작]할 때 보관한 대화예요. [이어 하기]를 누르면 그 대화로 돌아가요.</div></div>' +
      PI.hist.map(function (h, i) { var d = new Date(h.at), first = (h.lines.filter(function (l) { return l.who === "u" || l.who === "s"; })[0] || {}).en || "";
        return '<div class="card"><b>' + (d.getMonth() + 1) + '월 ' + d.getDate() + '일 ' + d.getHours() + ':' + ("0" + d.getMinutes()).slice(-2) + '</b> <span class="hint" style="margin:0">' + h.lines.length + '줄</span><div style="margin:6px 0;color:#475569">' + e(first).slice(0, 90) + '</div>' +
          '<div class="yc-tl"><button type="button" data-hr="' + i + '">↩ 이어 하기</button><button type="button" class="del" data-hx="' + i + '">🗑 지우기</button></div></div>'; }).join("") +
      '<button class="btn ghost" id="ohBk">← 샘이랑 수다로</button>');
    $("ycBk").onclick = home; $("ohBk").onclick = function () { mainPage(); };
    each("[data-hr]", function (b) { b.onclick = function () { var i = +b.getAttribute("data-hr"), h = PI.hist[i];
      if (ST.lines.length) PI.hist[i] = { at: Date.now(), lines: ST.lines.slice(-60) }; else PI.hist.splice(i, 1);
      ST.lines = h.lines; saveMain(); BALPUM.DB.upsert("yc", "hist", { list: PI.hist }).catch(function () {}); ST.page = "chat"; mainPage(); say("그 대화로 돌아왔어요"); }; });
    each("[data-hx]", function (b) { b.onclick = function () { if (!confirm("이 지난 대화를 지울까요?")) return; PI.hist.splice(+b.getAttribute("data-hx"), 1); BALPUM.DB.upsert("yc", "hist", { list: PI.hist }).catch(function () {}); oldPage(); }; });
  }

  /* ---------- 🤙 샘이랑 수다 ---------- */
  function chatBody() {
    var exNew = window.ycHasNew();
    $("ycBody").innerHTML = '<div class="yc-st">● 샘 접속 중 · 영어나 한국말로 편하게</div>' +
      '<div class="yc-tools"><button type="button" id="ycBu">🧩 내가 만들기</button><button type="button" id="ycEx" class="' + (exNew ? "new" : "") + '">🎯 오늘 표현</button><button type="button" id="ycSv2">⭐ 내 생활 영어</button></div>' +
      '<div class="yc-tools yc-t2"><button type="button" id="ycPi">📝 포스트잇 <b id="ycPiN">' + (PI.items.filter(function (x) { return !x.done; }).length || "") + '</b></button><button type="button" id="ycNew">🔄 새로 시작</button>' + (PI.hist.length ? '<button type="button" id="ycOld">🗂 지난 대화 ' + PI.hist.length + '</button>' : '') + '</div>' +
      '<div id="ycPiB"></div>' +
      (ST.lines.length ? '' : '<div class="yc-sorry" style="margin-bottom:8px">🌾 샘은 외국 시골에서 막 유학 온 친구라 가끔 엉뚱해요. 너그럽게 봐 주세요~</div>') +
      '<div id="ycBuB"></div><div class="yc-log" id="ycL"></div>';
    $("ycT").placeholder = "영어나 한국말로 · 엔터 = 보내기";
    setLangRow(true);
    $("ycBu").onclick = function () { builder(); }; $("ycEx").onclick = todayExpr; $("ycSv2").onclick = savedPage;
    $("ycPi").onclick = function () { PI.open = !PI.open; piDraw(); }; $("ycNew").onclick = newStart; if ($("ycOld")) $("ycOld").onclick = oldPage;
    if (PI.open) piDraw();
    onSend = send;
    draw();
    var last = ST.lines[ST.lines.length - 1], stale = !last || (Date.now() - (last.t || 0)) > 3 * 3600 * 1000;
    if (stale) samFirst();
  }
  function draw() {
    var L = $("ycL"); if (!L) return;
    L.innerHTML = ST.lines.map(lineHTML).join("") + (ST.busy ? '<div class="yc-wait">💬 샘이 쓰는 중…</div>' : '');
    bindLines(ST.lines, draw); bindBuildDone();
    toBottom();
  }
  function samFirst() {
    ST.busy = true; draw();
    gem(startPrompt()).then(function (r) { ST.busy = false; var s = (r && r.say) || {}; if (s.en) { ST.lines.push({ who: "s", en: str(s.en), ko: str(s.ko), t: Date.now() }); saveMain(); draw(); if (ST.cfg.auto !== false) speak(s.en); } else draw(); })
      .catch(function (er) { ST.busy = false; draw(); say(msgOf(er)); });
  }
  function todayExpr() {
    if (ST.busy) return; ST.busy = true; draw(); lsSet("yc_ex_day", today()); if ($("ycEx")) $("ycEx").classList.remove("new");
    gem(exPrompt()).then(function (r) { ST.busy = false; var x = (r && r.expr) || {}, s = (r && r.say) || {};
      if (x.en) ST.lines.push({ who: "x", en: str(x.en, 200), ko: str(x.ko, 200), ex: str(x.ex, 300), exko: str(x.exko, 300), t: Date.now() });
      if (s.en) ST.lines.push({ who: "s", en: str(s.en), ko: str(s.ko), t: Date.now() });
      saveMain(); draw(); if (x.en) speak(x.en + ". " + (x.ex || "")); })
      .catch(function (er) { ST.busy = false; draw(); say(msgOf(er)); });
  }
  function send(t, voice) {
    t = String(t || "").trim(); if (!t || ST.busy) return;
    var me = { who: "u", en: str(t, 2000), v: !!voice, t: Date.now() }; ST.lines.push(me); ST.busy = true; draw();
    gem(replyPrompt(t)).then(function (r) {
      ST.busy = false; r = r || {};
      if (r.mood === "crisis") { ST.lines.push({ who: "c", ko: str(r.crisis_ko || "많이 힘드시군요. 혼자 견디지 마세요. 지금 바로 109(자살예방상담전화, 24시간)나 가까운 사람에게 연락해 주세요. 저도 여기 있을게요.", 600), t: Date.now() }); saveMain(); draw(); return; }
      var f = r.fix || {};
      if (r.mood !== "feel" && (f.show || hasKo(t)) && (f.corrected || f.natural)) me.fix = { show: true, level: +f.level || 0, heard: str(f.heard, 300), meaning: str(f.meaning, 300), corrected: str(f.corrected, 600), natural: str(f.natural, 600),
        fixes: (f.fixes || []).slice(0, 6).map(function (x) { return { from: str(x.from, 120), to: str(x.to, 120), why: str(x.why, 200) }; }), praise: str(f.praise, 200) };
      var s = r.say || {}; if (s.en) ST.lines.push({ who: "s", en: str(s.en), ko: str(s.ko), t: Date.now() });
      saveMain(); draw(); if (s.en) speak(s.en);
    }).catch(function (er) { ST.busy = false; ST.lines.pop(); draw(); if ($("ycT")) $("ycT").value = t; say(msgOf(er)); });
  }

  /* ---------- 🧩 내가 만들기: 한국말 → 힌트 단어 → 3개 중 고르기 → 순서 맞추기 → 원어민과 비교 → 묻기 → 샘에게 ---------- */
  var BU = null;
  function builder() {
    var box = $("ycBuB"); if (!box) return;
    if (BU && box.firstChild) { BU = null; box.innerHTML = ""; return; }
    BU = { step: 0 };
    box.innerHTML = '<div class="yc-bu"><span class="k">🧩 내가 만들기 — 하고 싶은 말을 한국말로</span><textarea id="buKo" class="grow" rows="2" placeholder="예) 이 집은 역에서 걸어서 5분이에요"></textarea>' +
      '<div class="sh-btns" style="display:flex;gap:6px"><button type="button" class="btn" id="buGo" style="margin:0">만들기 시작</button><button type="button" class="btn ghost" id="buX" style="margin:0">닫기</button></div></div>';
    $("buX").onclick = function () { BU = null; box.innerHTML = ""; };
    $("buGo").onclick = function () { var ko = $("buKo").value.trim(); if (!ko) { say("하고 싶은 말을 적어 주세요."); return; } var b = this; b.disabled = true; b.textContent = "샘이 문제 만드는 중…";
      gem("영어를 다시 배우는 한국 어른이 아래 한국말을 영어로 직접 만들어 보게 도와줘.\n한국말: " + ko +
        "\n이 JSON 모양으로만 답해: {\"en\":\"원어민이 실제로 하는 자연스러운 영어 문장 (짧고 쉽게)\",\"hints\":[{\"en\":\"힌트 단어\",\"ko\":\"뜻\"}],\"quiz\":{\"options\":[\"보기1\",\"보기2\",\"보기3\"],\"answer\":0,\"why\":\"정답 이유 한국어\"},\"tip\":\"이 문장 만들 때 포인트 한 줄 (한국어)\"}\n" +
        "quiz.options 중 하나는 en 과 같고, 둘은 한국 사람이 흔히 틀리는 어색한 문장. answer 는 정답 번호(0부터).")
        .then(function (r) { r = r || {}; if (!r.en) throw new Error("문제를 못 만들었어요. 다시 해 주세요."); BU = { ko: ko, en: str(r.en, 300), hints: (r.hints || []).slice(0, 8), quiz: r.quiz || { options: [r.en], answer: 0 }, tip: str(r.tip, 200), pick: -1, chips: shuffle(tokens(r.en)), ans: [], qa: [] }; buDraw(); })
        .catch(function (er) { b.disabled = false; b.textContent = "만들기 시작"; say(msgOf(er)); }); };
  }
  function tokens(en) { return String(en || "").replace(/[.!?]+$/, "").split(/\s+/).filter(Boolean); }
  function shuffle(a) { a = a.map(function (x, i) { return { t: x, i: i }; }); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function buDraw() {
    var box = $("ycBuB"); if (!box || !BU) return; var q = BU.quiz || {};
    var mine = BU.ans.map(function (i) { return BU.chips[i].t; }).join(" ");
    var done = BU.ans.length === BU.chips.length, right = done && mine.toLowerCase() === tokens(BU.en).join(" ").toLowerCase();
    box.innerHTML = '<div class="yc-bu"><span class="k">🧩 "' + e(BU.ko) + '"</span>' +
      '<div><b>① 힌트 단어</b><div class="yc-chip" style="margin-top:4px">' + BU.hints.map(function (h) { return '<button type="button" data-hs="' + e(h.en) + '">' + e(h.en) + ' <small class="hint" style="margin:0">' + e(h.ko) + '</small></button>'; }).join("") + '</div></div>' +
      '<div><b>② 어느 게 자연스러울까요?</b><div class="yc-q" style="margin-top:4px">' + (q.options || []).map(function (o, i) { var c = BU.pick < 0 ? "" : i === +q.answer ? "ok" : i === BU.pick ? "no" : ""; return '<button type="button" data-qp="' + i + '" class="' + c + '">' + ["①", "②", "③"][i] + ' ' + e(o) + '</button>'; }).join("") + '</div>' +
        (BU.pick >= 0 ? '<div class="hint" style="margin:4px 0 0">' + (BU.pick === +q.answer ? "👍 맞았어요! " : "아쉬워요. ") + e(q.why || "") + '</div>' : '') + '</div>' +
      (BU.pick >= 0 ? '<div><b>③ 순서 맞추기</b> <small class="hint" style="margin:0">낱말을 눌러 차례대로</small><div class="yc-chip" style="margin-top:4px"><div class="ans" id="buAns">' + BU.ans.map(function (i, k) { return '<button type="button" data-ua="' + k + '">' + e(BU.chips[i].t) + '</button>'; }).join("") + '</div>' +
        BU.chips.map(function (c, i) { return '<button type="button" data-uc="' + i + '" class="' + (BU.ans.indexOf(i) >= 0 ? "used" : "") + '">' + e(c.t) + '</button>'; }).join("") + '</div></div>' : '') +
      (done ? '<div><b>④ 원어민과 비교</b><div class="yc-fix" style="width:auto;padding:8px 10px;margin-top:4px">' + (right ? '🎉 원어민 문장과 똑같아요!' : '내 문장: ' + e(mine)) + '<br>원어민: <b class="nat">' + e(BU.en) + '</b>' + (BU.tip ? '<br>💡 ' + e(BU.tip) : '') +
        '<div class="yc-tl"><button type="button" id="buSp">🔊 듣기</button><button type="button" id="buSl">🐢 천천히</button><button type="button" id="buSv" class="' + (isSaved(BU.en) ? "on" : "") + '">' + (isSaved(BU.en) ? "⭐ 저장됨" : "☆ 저장") + '</button></div></div></div>' +
        '<div><b>⑤ 궁금한 것 묻기</b>' + BU.qa.map(function (x) { return '<div class="sh-vs" style="margin-top:4px;background:#F8FAFC;border-radius:10px;padding:6px 9px">🙋 ' + e(x.q) + '<br>💬 ' + (x.a ? e(x.a) : "생각하는 중…") + '</div>'; }).join("") +
        '<div style="display:flex;gap:6px;margin-top:4px"><input id="buQ" placeholder="예) 왜 from 을 써요?" style="flex:1;margin:0"><button type="button" class="btn ghost" id="buQs" style="width:auto;margin:0;padding:0 14px">묻기</button></div></div>' +
        '<button type="button" class="btn" id="buSend" style="margin:0">💬 이 문장으로 샘에게 말하기</button>' : '') +
      '<button type="button" class="btn ghost" id="buX" style="margin:0">닫기</button></div>';
    $("buX").onclick = function () { BU = null; box.innerHTML = ""; };
    each("[data-hs]", function (b) { b.onclick = function () { speak(b.getAttribute("data-hs")); }; });
    each("[data-qp]", function (b) { b.onclick = function () { if (BU.pick >= 0) return; BU.pick = +b.getAttribute("data-qp"); buDraw(); }; });
    each("[data-uc]", function (b) { b.onclick = function () { var i = +b.getAttribute("data-uc"); if (BU.ans.indexOf(i) < 0) { BU.ans.push(i); buDraw(); } }; });
    each("[data-ua]", function (b) { b.onclick = function () { BU.ans.splice(+b.getAttribute("data-ua"), 1); buDraw(); }; });
    if ($("buSp")) { $("buSp").onclick = function () { speak(BU.en); }; $("buSl").onclick = function () { speak(BU.en, true); }; $("buSv").onclick = function () { toggleSave(BU.en, BU.ko, "내가 만들기"); buDraw(); };
      $("buQs").onclick = function () { var q = $("buQ").value.trim(); if (!q) return; var x = { q: q, a: "" }; BU.qa.push(x); buDraw();
        gem("영어 문장: " + BU.en + " (뜻: " + BU.ko + ")\n영어를 다시 배우는 한국 어른의 질문에 쉬운 한국어로 2~4문장으로 답해.\n질문: " + q + "\n이 JSON 모양으로만 답해: {\"a\":\"답\"}")
          .then(function (r) { x.a = str(r && r.a, 800) || "답을 못 받았어요."; buDraw(); }).catch(function (er) { x.a = msgOf(er); buDraw(); }); };
      $("buSend").onclick = function () { var en = BU.en, ko = BU.ko; ST.lines.push({ who: "b", ko: ko, en: en, t: Date.now() }); BU = null; box.innerHTML = ""; send(en); }; }
  }
  function buildDoneHTML(l) { return '<div class="yc-b s" style="align-self:center;background:#FFFBEB;border-color:#FFD98A;font-size:13px">🧩 내가 만든 문장: <b>' + e(l.en) + '</b> <small class="hint" style="margin:0">(' + e(l.ko) + ')</small></div>'; }
  function bindBuildDone() {}

  /* ---------- 🔁 통역 · 상황 연습 ---------- */
  var SITS = [["free", "💬 자유", "편하게 나누는 일상 대화", "친절한 외국인 친구"],
    ["house", "🏠 집 보러 온 외국인 손님", "한국의 부동산 중개사무소. 사용자(A)는 공인중개사이고, 월세·전세·매매 집을 구하러 외국인 손님이 찾아왔다", "집을 구하러 온 외국인 손님"],
    ["restaurant", "🍽 식당", "외국의 식당. 사용자(A)는 손님", "식당 직원"],
    ["airport", "✈️ 공항", "외국 공항 · 입국 심사. 사용자(A)는 여행객", "입국 심사관 또는 항공사 직원"],
    ["hotel", "🏨 호텔", "외국 호텔의 프런트. 사용자(A)는 투숙객", "호텔 프런트 직원"],
    ["hospital", "🏥 병원 · 약국", "외국의 병원이나 약국. 사용자(A)는 몸이 아파서 온 손님", "의사 또는 약사"],
    ["shop", "🛍 쇼핑", "외국의 가게. 사용자(A)는 손님", "가게 점원"],
    ["phone", "📞 업무 전화", "외국 거래처와의 업무 전화. 사용자(A)는 한국 회사 담당자", "외국 거래처 담당자"],
    ["way", "🗺 길 안내", "한국의 거리. 사용자(A)는 한국 사람이고, 외국인이 길을 묻는다", "길을 묻는 외국인 관광객"],
    ["custom", "✍️ 직접 정하기", "", "상황에 맞는 상대"]];
  function sitOf(k) { return SITS.filter(function (s) { return s[0] === k; })[0] || SITS[0]; }
  function trBody() {
    var face = ST.sub !== "sit";
    $("ycBody").innerHTML = '<div class="yc-sub"><button type="button" data-sb="face" class="' + (face ? "on" : "") + '">🗣 마주 보고 통역</button><button type="button" data-sb="sit" class="' + (!face ? "on" : "") + '">🎭 상황 연습</button></div><div id="ycTB"></div>';
    each("[data-sb]", function (b) { b.onclick = function () { ST.sub = b.getAttribute("data-sb"); stopSpeak(); trBody(); }; });
    if (face) faceBody(); else sitBody();
  }
  // 🗣 마주 보고 통역 — 말하면 옮겨서 소리로 읽어 줘요
  function faceBody() {
    $("ycTB").innerHTML = '<div class="yc-face"><button type="button" class="me" id="fcMe">🇰🇷 내가 말하기<small>한국말 → 영어로 읽어 줘요</small></button><button type="button" class="you" id="fcYou">🇺🇸 상대가 말하기<small>English → 한국말</small></button></div>' +
      '<div class="hint" style="margin:-2px 0 8px;text-align:center">핸드폰을 가운데 두고 번갈아 누르세요 · 아래 칸에 써도 돼요 · 재미나이가 옮겨요</div>' +
      '<div class="yc-log" id="trL"></div>';
    $("ycT").placeholder = "옮길 말 (한국말 ↔ 영어)";
    setLangRow(false);
    $("fcMe").onclick = function () { listen("ko-KR", function (t) { interp(t, "en", true); }, this); };
    $("fcYou").onclick = function () { listen("en-US", function (t) { interp(t, "ko", true); }, this); };
    $("ycMic").onclick = function () { listen("ko-KR", function (t) { interp(t, "en", true); }, this); };
    onSend = function (t) { t = String(t || "").trim(); if (t) interp(t, hasKo(t) ? "en" : "ko"); };
    trDraw();
  }
  function trDraw() {
    var L = $("trL"); if (!L) return;
    L.innerHTML = (ST.tr.length ? '' : '<div class="hint" style="text-align:center">아직 통역한 말이 없어요.</div>') + ST.tr.map(function (x, i) {
      return '<div class="yc-tr"><span class="k">' + (x.to === "en" ? "🇰🇷 → 🇺🇸 내가 한 말" : "🇺🇸 → 🇰🇷 상대가 한 말") + '</span><div class="hint" style="margin:2px 0">' + e(x.src) + '</div><div class="big">' + e(x.out) + '</div>' +
        (x.tip ? '<div class="hint" style="margin:2px 0 0">💡 ' + e(x.tip) + '</div>' : '') +
        '<div class="yc-tl"><button type="button" data-tsp="' + i + '">🔊 다시</button><button type="button" data-tsl="' + i + '">🐢 천천히</button><button type="button" data-tbig="' + i + '">🔍 화면 크게</button>' +
        (x.to === "en" ? '<button type="button" data-tsv="' + i + '" class="' + (isSaved(x.out) ? "on" : "") + '">' + (isSaved(x.out) ? "⭐ 저장됨" : "☆ 저장") + '</button>' : '') +
        '<button type="button" data-tgr="' + i + '">📐 영어 문법</button><button type="button" data-ted="' + i + '">✏️ 고치기</button><button type="button" class="del" data-tdl="' + i + '">🗑</button></div></div>' + gramHTML(x.gram); }).join("") +
      (ST.busy ? '<div class="yc-wait">🔁 옮기는 중…</div>' : '');
    each("[data-tsp]", function (b) { b.onclick = function () { var x = ST.tr[+b.getAttribute("data-tsp")]; speak(x.out, false, x.to === "en" ? "en-US" : "ko-KR"); }; });
    each("[data-tsl]", function (b) { b.onclick = function () { var x = ST.tr[+b.getAttribute("data-tsl")]; speak(x.out, true, x.to === "en" ? "en-US" : "ko-KR"); }; });
    each("[data-tbig]", function (b) { b.onclick = function () { bigScreen(ST.tr[+b.getAttribute("data-tbig")]); }; });
    each("[data-tsv]", function (b) { b.onclick = function () { var x = ST.tr[+b.getAttribute("data-tsv")]; toggleSave(x.out, x.src, "통역"); trDraw(); }; });
    each("[data-tgr]", function (b) { b.onclick = function () { var x = ST.tr[+b.getAttribute("data-tgr")], en = x.to === "en" ? x.out : x.src;
      if (x.gram && !x.gram.busy) { delete x.gram; trDraw(); return; }
      x.gram = { busy: true }; trDraw(); gem(gramPrompt(en)).then(function (g) { g = g || {}; g.en = en; x.gram = g; saveMain(); trDraw(); }).catch(function (er) { delete x.gram; trDraw(); say(msgOf(er)); }); }; });
    each("[data-tdl]", function (b) { b.onclick = function () { ST.tr.splice(+b.getAttribute("data-tdl"), 1); saveMain(); trDraw(); }; });
    each("[data-ted]", function (b) { b.onclick = function () { var i = +b.getAttribute("data-ted"), x = ST.tr[i]; ST.tr.splice(i, 1); saveMain(); trDraw();
      var T = $("ycT"); if (T) { T.value = x.src; T.dispatchEvent(new Event("input")); T.focus(); } say("잘못 알아들은 곳을 고쳐서 엔터를 누르면 다시 옮겨요"); }; });
    toBottom();
  }
  function interp(t, to, voice) {
    if (ST.busy) return; ST.busy = true; trDraw();
    gem(trPrompt(t, to)).then(function (r) { ST.busy = false; r = r || {}; var x = { src: str(t, 1000), out: str(r.out, 1200), back: str(r.back, 600), tip: str(r.tip, 200), to: to, v: !!voice, t: Date.now() };
      if (!x.out) throw new Error("옮기지 못했어요. 다시 말해 주세요.");
      ST.tr.push(x); saveMain(); trDraw(); speak(x.out, false, to === "en" ? "en-US" : "ko-KR"); })
      .catch(function (er) { ST.busy = false; trDraw(); say(msgOf(er)); });
  }
  function bigScreen(x) {
    if (!x) return; var d = document.createElement("div"); d.className = "yc-full"; d.setAttribute("role", "dialog");
    d.innerHTML = '<div class="t">' + e(x.out) + '</div><div class="s">' + e(x.src) + '</div><div class="bt"><button type="button" data-k="sp">🔊 다시 읽기</button><button type="button" data-k="fl">🔄 뒤집기 (마주 앉은 사람용)</button><button type="button" data-k="x">✕ 닫기</button></div>';
    document.body.appendChild(d);
    d.querySelector('[data-k="sp"]').onclick = function () { speak(x.out, false, x.to === "en" ? "en-US" : "ko-KR"); };
    d.querySelector('[data-k="fl"]').onclick = function () { d.classList.toggle("flip"); };
    d.querySelector('[data-k="x"]').onclick = function () { d.remove(); };
  }
  // 🎭 상황 연습 — 상대 역할을 샘이 해요
  function sitBody() {
    var S = ST.sit, cur = sitOf(S.k);
    $("ycTB").innerHTML = '<div class="yc-sit">' + SITS.map(function (s) { return '<button type="button" data-st="' + s[0] + '" class="' + (S.k === s[0] ? "on" : "") + '">' + s[1] + '</button>'; }).join("") + '</div>' +
      (S.k === "custom" ? '<input id="stTx" value="' + e(S.txt || "") + '" placeholder="예) 은행에서 계좌 만들기 · 택시 타기">' : '') +
      '<div style="display:flex;gap:6px;margin:6px 0 10px"><button type="button" class="btn" id="stGo" style="margin:0">▶ ' + (S.lines.length ? "처음부터 다시" : "시작") + '</button></div>' +
      '<div class="hint" style="margin:-4px 0 8px">상대: <b>' + e(cur[3]) + '</b> · 영어로 대답해 보세요 (🎤 는 영어로 들어요) · 막히면 한국말로 써도 돼요</div>' +
      '<div class="yc-log" id="stL"></div>';
    $("ycT").placeholder = "영어로 대답해 보세요";
    setLangRow(false);
    each("[data-st]", function (b) { b.onclick = function () { S.k = b.getAttribute("data-st"); S.lines = []; saveMain(); sitBody(); }; });
    $("stGo").onclick = function () { if (S.k === "custom") { S.txt = ($("stTx").value || "").trim(); if (!S.txt) { say("상황을 적어 주세요."); return; } } S.lines = []; sitTurn(""); };
    $("ycMic").onclick = function () { listen("en-US", function (t) { sitTurn(t, true); }, this); };
    onSend = function (t) { t = String(t || "").trim(); if (t) sitTurn(t); };
    sitDraw();
  }
  function sitDraw() {
    var L = $("stL"); if (!L) return; var S = ST.sit;
    L.innerHTML = (S.lines.length ? '' : '<div class="hint" style="text-align:center">상황을 고르고 [▶ 시작]을 누르면 상대가 먼저 말을 걸어요.</div>') + S.lines.map(lineHTML).join("") + (ST.busy ? '<div class="yc-wait">💬 상대가 말하는 중…</div>' : '');
    bindLines(S.lines, sitDraw);
    toBottom();
  }
  function sitTurn(t, voice) {
    var S = ST.sit, cur = sitOf(S.k); if (ST.busy) return;
    var me = null; if (t) { me = { who: "u", en: str(t, 1000), v: !!voice, t: Date.now() }; S.lines.push(me); }
    ST.busy = true; sitDraw();
    var h = S.lines.map(function (l) { return (l.who === "s" ? "B: " : "A: ") + l.en; }).join("\n");
    gem("너는 영어 회화 연습을 도와주는 상대 역할이야.\n상황: " + (S.k === "custom" ? S.txt : cur[2]) + "\n너의 역할: " + cur[3] + "\n사용자는 영어를 다시 배우는 한국 어른이야. 사용자 = A, 너 = B.\n\n지금까지 대화:\n" + (h || "(없음)") + "\n\n규칙:\n" +
      "- B 로서 바로 다음에 할 말을 영어로 1~3문장만 해. 쉽고 자연스러운 실제 회화체로. 그 상황의 사람처럼 질문도 하면서 이어 가.\n- 대화가 비어 있으면 B 가 먼저 말을 걸어.\n" +
      (t ? "- A 가 방금 한 말 \"" + t + "\" 에 대해 " + FIX + "\n" : "") +
      "이 JSON 모양으로만 답해: {\"say\":{\"en\":\"\",\"ko\":\"\"}" + (t ? ",\"fix\":{\"show\":true,\"level\":2,\"heard\":\"\",\"meaning\":\"\",\"corrected\":\"\",\"natural\":\"\",\"fixes\":[{\"from\":\"\",\"to\":\"\",\"why\":\"\"}],\"praise\":\"\"}" : "") + "}")
      .then(function (r) { ST.busy = false; r = r || {}; var f = r.fix || {};
        if (me && (f.show || hasKo(t)) && (f.corrected || f.natural)) me.fix = { show: true, level: +f.level || 0, heard: str(f.heard, 300), meaning: str(f.meaning, 300), corrected: str(f.corrected, 600), natural: str(f.natural, 600), fixes: (f.fixes || []).slice(0, 6), praise: str(f.praise, 200) };
        var s = r.say || {}; if (s.en) S.lines.push({ who: "s", en: str(s.en), ko: str(s.ko), t: Date.now() });
        saveMain(); sitDraw(); if (s.en) speak(s.en); })
      .catch(function (er) { ST.busy = false; if (me) S.lines.pop(); sitDraw(); say(msgOf(er)); });
  }

  /* ---------- ❓ 따로 묻기: 🔤 단어 찾기 · ✍️ 글로 번역 ---------- */
  function getJ(u) { return fetch(u).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); }
  function clean(t) { return String(t || "").replace(/\s+/g, " ").trim(); }
  function parseWiki(ext) {
    var r = { ety: "", hyph: "", ipa: "" }; if (!ext) return r;
    var i = ext.indexOf("== English =="); if (i < 0) return r;
    var rest = ext.slice(i + 13), j = rest.search(/\n== [^=]/); if (j >= 0) rest = rest.slice(0, j);
    var m = rest.match(/===+ Etymology(?: \d+)? ===+\s*\n([\s\S]*?)(?=\n===|$)/); if (m) r.ety = clean(m[1]).slice(0, 600);
    var h = rest.match(/Hyphenation[^:\n]*:\s*([^\n]+)/); if (h) r.hyph = clean(h[1]).split(/[,;]/)[0].replace(/[‧·•\-]/g, "·").replace(/\s*·\s*/g, "·");
    var p = rest.match(/IPA[^:\n]*:\s*([\/\[][^\/\]\n]+[\/\]])/); if (p) r.ipa = p[1];
    return r;
  }
  function lookup(q) {
    q = clean(q); if (!q) return Promise.reject(new Error("찾을 말을 적어 주세요."));
    var first = hasKo(q) ? gem("한국말 \"" + q + "\" 을 뜻하는 가장 흔한 영어 단어나 짧은 표현 하나. JSON: {\"en\":\"\"}").then(function (r) { return clean(r && r.en).replace(/^(a|an|the|to) /i, "").replace(/[.!?]+$/, ""); }) : Promise.resolve(q);
    return first.then(function (w) {
      if (!w) throw new Error("영어로 바꾸지 못했어요.");
      var lw = w.toLowerCase();
      return Promise.all([getJ("https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(lw)),
        getJ("https://en.wiktionary.org/w/api.php?action=query&prop=extracts&explaintext=1&redirects=1&format=json&origin=*&titles=" + encodeURIComponent(lw))]).then(function (res) {
        var d = Array.isArray(res[0]) && res[0].length ? res[0] : null, ext = "";
        try { var pg = res[1].query.pages; for (var k in pg) if (pg[k].extract) ext = pg[k].extract; } catch (er) {}
        var wp = parseWiki(ext), out = { w: d ? d[0].word : w, src: hasKo(q) ? q : "", ipa: "", audio: "", hyph: wp.hyph, ety: wp.ety, defs: [] };
        (d || []).forEach(function (en) {
          if (!out.ipa) out.ipa = en.phonetic || ((en.phonetics || []).filter(function (p) { return p.text; })[0] || {}).text || "";
          if (!out.audio) { var au = (en.phonetics || []).filter(function (p) { return p.audio; }); out.audio = ((au.filter(function (p) { return /-us\./.test(p.audio); })[0] || au[0]) || {}).audio || ""; }
          (en.meanings || []).forEach(function (m) { (m.definitions || []).slice(0, 2).forEach(function (df) { if (out.defs.length < 6 && df.definition) out.defs.push({ pos: m.partOfSpeech, en: clean(df.definition), ex: clean(df.example || "") }); }); });
        });
        if (!out.ipa) out.ipa = wp.ipa;
        var miss = !d && !ext;
        var sug = miss ? getJ("https://api.datamuse.com/sug?s=" + encodeURIComponent(lw) + "&max=6").then(function (s) { return (s || []).map(function (x) { return x.word; }).filter(function (x) { return x && x.toLowerCase() !== lw; }).slice(0, 5); }) : Promise.resolve([]);
        var ko = gem("영어 단어(표현) \"" + out.w + "\" 를 영어를 다시 배우는 한국 어른에게 설명해.\n사전 뜻(영어): " + JSON.stringify(out.defs.map(function (x) { return x.pos + ": " + x.en; })) + "\n어원(영어): " + (out.ety || "(없음)") +
          "\n이 JSON 모양으로만 답해: {\"ko\":\"대표 뜻 (쉼표로 2~4개)\",\"defs\":[\"사전 뜻 각각의 쉬운 한국어 번역 (같은 순서)\"],\"ety\":\"어원 쉬운 한국어 한두 줄 (없으면 빈칸)\",\"ex\":\"일상 예문\",\"exko\":\"예문 뜻\",\"spell\":\"철자 외우는 요령 한 줄\"}").catch(function () { return {}; });
        return Promise.all([sug, ko]).then(function (a) { out.sugg = a[0]; var k = a[1] || {}; out.ko = str(k.ko, 200); out.etyKo = str(k.ety, 400); out.ex = str(k.ex, 300); out.exko = str(k.exko, 300); out.spell = str(k.spell, 200);
          (k.defs || []).forEach(function (t, i) { if (out.defs[i]) out.defs[i].ko = str(t, 300); }); if (miss && !out.ko) out.none = true; return out; });
      });
    });
  }
  var POS = { noun: "명사", verb: "동사", adjective: "형용사", adverb: "부사", preposition: "전치사", conjunction: "접속사", pronoun: "대명사", interjection: "감탄사" };
  function wordHTML(w) {
    if (w.none) return '<div class="hint">사전에서 못 찾았어요.' + ((w.sugg || []).length ? ' 혹시 이 말인가요? ' + w.sugg.map(function (s) { return '<button type="button" class="btn ghost" data-wq="' + e(s) + '" style="display:inline-flex;width:auto;min-height:32px;padding:0 10px;margin:2px">' + e(s) + '</button>'; }).join("") : '') + '</div>';
    return '<div class="yc-w">' + (w.src ? '<div class="hint" style="margin:0">"' + e(w.src) + '" →</div>' : '') + '<h3>' + e(w.w) + '</h3>' +
      '<div class="ipa">' + e(w.ipa || "") + (w.hyph ? ' · 철자 ' + e(w.hyph) : ' · 철자 ' + e(String(w.w).split("").join("·"))) + '</div>' +
      '<div class="yc-tl"><button type="button" id="wSp">🔊 발음</button><button type="button" id="wSl">🐢 천천히</button><button type="button" id="wSv" class="' + (isSaved(w.w) ? "on" : "") + '">' + (isSaved(w.w) ? "⭐ 저장됨" : "☆ 저장") + '</button></div>' +
      (w.ko ? '<div class="mn"><b>뜻</b><br><span style="font-size:17px;font-weight:800">' + e(w.ko) + '</span></div>' : '') +
      (w.defs.length ? '<div class="mn"><b>사전 뜻</b>' + w.defs.map(function (d) { return '<div>· <small class="hint" style="margin:0">' + e(POS[d.pos] || d.pos || "") + '</small> ' + e(d.ko || d.en) + (d.ko ? '<br><small class="hint" style="margin:0">' + e(d.en) + '</small>' : '') + (d.ex ? '<br><i>예) ' + e(d.ex) + '</i>' : '') + '</div>'; }).join("") + '</div>' : '') +
      (w.ex ? '<div class="mn"><b>이렇게 써요</b><br>' + e(w.ex) + '<br><small class="hint" style="margin:0">' + e(w.exko) + '</small></div>' : '') +
      (w.spell ? '<div class="mn"><b>철자 외우기</b><br>' + e(w.spell) + '</div>' : '') +
      (w.etyKo || w.ety ? '<div class="mn"><b>어원 (말의 뿌리)</b><br>' + e(w.etyKo || w.ety) + '</div>' : '') +
      '<div class="hint">사전: dictionaryapi.dev · 위키낱말사전 · 한국어 설명은 재미나이</div></div>';
  }
  function askSheet(tab) {
    var old = $("ycSh"); if (old) old.remove();
    var d = document.createElement("div"); d.className = "yc-sh"; d.id = "ycSh";
    d.innerHTML = '<div class="in"><div class="hd"><b>❓ 따로 묻기</b><button type="button" id="shX">닫기</button></div>' +
      '<div class="yc-sub"><button type="button" data-at="word" class="' + (tab === "word" ? "on" : "") + '">🔤 단어 찾기</button><button type="button" data-at="tr" class="' + (tab === "tr" ? "on" : "") + '">✍️ 글로 번역</button></div>' +
      (tab === "word" ? '<div style="display:flex;gap:6px"><input id="awQ" placeholder="영어 단어 또는 한국말 (예: lease, 보증금)" style="flex:1;margin:0" autocapitalize="off"><button type="button" class="btn" id="awGo" style="width:auto;margin:0;padding:0 16px">찾기</button></div>'
        : '<textarea id="atQ" class="grow" rows="3" placeholder="옮길 글 (한국말 ↔ 영어)"></textarea><button type="button" class="btn" id="atGo">번역하기</button>') +
      '<div id="aOut" style="margin-top:10px"></div></div>';
    document.body.appendChild(d);
    d.addEventListener("click", function (ev) { if (ev.target === d) d.remove(); });
    $("shX").onclick = function () { d.remove(); };
    Array.prototype.forEach.call(d.querySelectorAll("[data-at]"), function (b) { b.onclick = function () { askSheet(b.getAttribute("data-at")); }; });
    if (tab === "word") {
      var run = function (q) { $("aOut").innerHTML = '<div class="hint">📖 사전에서 찾는 중…</div>';
        lookup(q).then(function (w) { var o = $("aOut"); if (!o) return; o.innerHTML = wordHTML(w);
          if ($("wSp")) { $("wSp").onclick = function () { if (w.audio) { try { new Audio(w.audio).play().catch(function () { speak(w.w); }); } catch (er) { speak(w.w); } } else speak(w.w); };
            $("wSl").onclick = function () { speak(w.w, true); }; $("wSv").onclick = function () { toggleSave(w.w, w.ko, "단어"); o.innerHTML = wordHTML(w); askBind(w); }; }
          askBind(w);
        }).catch(function (er) { if ($("aOut")) $("aOut").innerHTML = '<div class="err">' + e(msgOf(er)) + '</div>'; }); };
      var askBind = function (w) { Array.prototype.forEach.call(d.querySelectorAll("[data-wq]"), function (b) { b.onclick = function () { $("awQ").value = b.getAttribute("data-wq"); run($("awQ").value); }; });
        if ($("wSp") && !$("wSp").onclick) { $("wSp").onclick = function () { speak(w.w); }; } };
      $("awGo").onclick = function () { run($("awQ").value); };
      $("awQ").onkeydown = function (ev) { if (ev.key === "Enter") run(this.value); };
      setTimeout(function () { $("awQ").focus(); }, 80);
    } else {
      $("atGo").onclick = function () { var t = $("atQ").value.trim(); if (!t) return; $("aOut").innerHTML = '<div class="hint">🔁 옮기는 중…</div>';
        var to = hasKo(t) ? "en" : "ko";
        gem(trPrompt(t, to)).then(function (r) { var out = str(r && r.out, 2000), o = $("aOut"); if (!o) return;
          o.innerHTML = '<div class="yc-tr"><span class="k">' + (to === "en" ? "🇰🇷 → 🇺🇸" : "🇺🇸 → 🇰🇷") + '</span><div class="big">' + e(out) + '</div>' + (r && r.tip ? '<div class="hint" style="margin:2px 0 0">💡 ' + e(r.tip) + '</div>' : '') +
            '<div class="yc-tl"><button type="button" id="atSp">🔊 듣기</button><button type="button" id="atSl">🐢 천천히</button>' + (to === "en" ? '<button type="button" id="atSv">☆ 저장</button>' : '') + '</div></div>';
          var lg = to === "en" ? "en-US" : "ko-KR";
          $("atSp").onclick = function () { speak(out, false, lg); }; $("atSl").onclick = function () { speak(out, true, lg); };
          if ($("atSv")) $("atSv").onclick = function () { var on = toggleSave(out, t, "번역"); this.textContent = on ? "⭐ 저장됨" : "☆ 저장"; this.classList.toggle("on", on); };
        }).catch(function (er) { if ($("aOut")) $("aOut").innerHTML = '<div class="err">' + e(msgOf(er)) + '</div>'; }); };
      setTimeout(function () { $("atQ").focus(); }, 80);
    }
  }

  /* ---------- ⭐ 내 생활 영어 ---------- */
  function savedPage() {
    go("ycsaved");
    app(bar() + '<div class="card" style="text-align:center"><div style="font-family:\'Nanum Brush Script\',sans-serif;font-size:30px;color:#1E2A78">⭐ 내 생활 영어</div><div class="hint" style="margin:0">☆ 저장을 누른 말이 여기 모여요 · ' + ST.saved.length + '개</div></div>' +
      '<div id="svL">' + (ST.saved.length ? ST.saved.map(function (x, i) { return '<div class="yc-sv"><div class="en">' + e(x.en) + '</div>' + (x.ko ? '<div class="ko">' + e(x.ko) + '</div>' : '') +
        '<div class="yc-tl"><button type="button" data-ssp="' + i + '">🔊 듣기</button><button type="button" data-ssl="' + i + '">🐢 천천히</button><button type="button" data-sdl="' + i + '">🗑 빼기</button><span class="hint" style="margin:0 0 0 auto;align-self:center">' + e(x.from || "") + '</span></div></div>'; }).join("")
        : '<div class="hint">아직 없어요. 샘과 이야기하다 ☆ 저장을 눌러 보세요.</div>') + '</div><div style="height:90px"></div>' + askBtn());
    $("ycBk").onclick = function () { showYC(); };
    bindAsk();
    each("[data-ssp]", function (b) { b.onclick = function () { speak(ST.saved[+b.getAttribute("data-ssp")].en); }; });
    each("[data-ssl]", function (b) { b.onclick = function () { speak(ST.saved[+b.getAttribute("data-ssl")].en, true); }; });
    each("[data-sdl]", function (b) { b.onclick = function () { var x = ST.saved[+b.getAttribute("data-sdl")]; toggleSave(x.en); savedPage(); }; });
  }

  /* ---------- ⚙ 설정 ---------- */
  function setPage() {
    go("ycset");
    var canN = window.BP_NOTI && BP_NOTI.can();
    app(bar() + '<div class="card"><div class="sect" style="margin-top:0">⚙ 직빵 young call 설정</div>' +
      '<label for="ycNm">샘이 부를 내 이름</label><input id="ycNm" value="' + e(ST.cfg.name || "") + '" placeholder="예) Mr. Jung, DC">' +
      '<label>샘 말 빠르기</label><div class="rm-pick" id="ycRt">' + [[0.75, "🐢 천천히"], [1, "보통"], [1.15, "조금 빠르게"]].map(function (x) { return '<button type="button" data-v="' + x[0] + '" class="' + ((ST.cfg.rate || 1) == x[0] ? "on" : "") + '" style="border:1px solid #CBD5E1;background:#fff;border-radius:999px;padding:8px 12px;font:600 14px \'Noto Sans KR\',sans-serif;margin:0 6px 6px 0">' + x[1] + '</button>'; }).join("") + '</div>' +
      '<label class="chk"><input type="checkbox" id="ycAu"' + (ST.cfg.auto !== false ? " checked" : "") + '> <span>샘이 말하면 소리로 바로 읽어 주기</span></label>' +
      (canN ? '<label class="chk" style="margin-top:8px"><input type="checkbox" id="ycDn"' + (ST.cfg.daily ? " checked" : "") + '> <span>🔔 하루 한 번 "🎯 오늘 표현이 왔어요" 알림</span></label>' +
        '<select id="ycDh" style="margin-top:4px">' + [7, 8, 9, 10, 12, 15, 18, 20, 21].map(function (h) { return '<option value="' + h + '"' + ((ST.cfg.dailyH || 9) === h ? " selected" : "") + '>' + (h < 12 ? "오전 " + h : "오후 " + (h === 12 ? 12 : h - 12)) + '시에</option>'; }).join("") + '</select>'
        : '<div class="hint">🔔 하루 한 번 알림은 핸드폰 발품 앱에서 켤 수 있어요.</div>') +
      '<button class="btn" id="ycSv">저장</button></div>' +
      '<div class="card"><div class="sect" style="margin-top:0">🔑 재미나이 키</div><div class="hint" style="margin-top:0">지금 키: ' + e(ST.key ? "••••" + ST.key.slice(-4) : "없음") + '</div><button class="btn ghost" id="ycKy">키 바꾸기</button></div>' +
      '<div class="card"><div class="sect" style="margin-top:0">🧹 대화 지우기</div><div class="hint" style="margin-top:0">샘과 나눈 이야기 ' + ST.lines.length + '줄 · 통역 ' + ST.tr.length + '줄이 내 계정에 있어요. (⭐ 내 생활 영어는 그대로)</div><button class="btn ghost" id="ycClr">대화 모두 지우기</button></div>' +
      '<div class="hint" style="text-align:center">샘은 AI 친구예요. 진짜 친구 · 가족 · 동네 사람들과의 이야기도 응원해요.</div>' +
      '<div class="yc-sorry">🌾 샘은 외국 시골에서 막 유학 온 친구라 가끔 엉뚱한 말도 하고 잘못 알아듣기도 해요. 완벽하진 않아도 너그럽게 봐 주세요~ 같이 늘어 가요! <small>계약 · 병원 · 돈 같은 중요한 일은 꼭 사람에게 한 번 더 확인하세요.</small></div>');
    $("ycBk").onclick = function () { showYC(); };
    each("#ycRt button", function (b) { b.onclick = function () { ST.cfg.rate = +b.getAttribute("data-v"); each("#ycRt button", function (x) { x.classList.toggle("on", x === b); x.style.background = x === b ? "#1E2A78" : "#fff"; x.style.color = x === b ? "#fff" : ""; }); speak("Hi! This is how I sound.", false); }; });
    $("ycSv").onclick = function () { ST.cfg.name = $("ycNm").value.trim(); ST.cfg.auto = $("ycAu").checked;
      if ($("ycDn")) { ST.cfg.daily = $("ycDn").checked; ST.cfg.dailyH = +$("ycDh").value; BP_NOTI.ycDaily(ST.cfg.daily, ST.cfg.dailyH); }
      saveCfg().then(function () { say("저장했어요."); showYC(); }).catch(function (er) { say(msgOf(er)); }); };
    $("ycKy").onclick = keyPage;
    $("ycClr").onclick = function () { if (!confirm("샘과 나눈 이야기 · 통역 기록을 모두 지울까요?")) return; ST.lines = []; ST.tr = []; ST.sit.lines = []; BALPUM.DB.upsert("yc", "main", { lines: [], tr: [], sit: ST.sit }).then(function () { say("지웠어요."); showYC(); }); };
  }

  /* ---------- 🎁 친구에게 선물하기 ---------- */
  window.showYCGift = function (fromHist) {
    if (!fromHist) go("ycgift");
    app(bar() + '<div class="yc-hero bpy">' + logo(36) + '<p>친구에게 선물하기<br>받은 친구도 무료로 샘과 수다 떨어요</p></div><div class="card" id="gfBox"><div class="hint" style="margin:0">선물 링크 만드는 중…</div></div>');
    $("ycBk").onclick = function () { showYC(); };
    var from = ST.cfg.name || (ST.ag && ST.ag.name) || "";
    BALPUM.Room.gift().then(function (code) {
      code = String(code || "").replace(/"/g, "");
      var link = homeUrl() + "join.html?c=" + code + "&v=gift" + (from ? "&from=" + encodeURIComponent(from) : "");
      var office = (ST.ag && ST.ag.office) || (typeof OFFICE_INFO !== "undefined" && OFFICE_INFO && OFFICE_INFO.name) || "";
      var msg = "🎁 직빵 young call 선물이에요!\n외국 시골에서 유학 온 동네 친구 샘이랑 영어로 수다 떨어요. 무료예요." + (office ? "\n(" + office + " 발품 앱)" : "") + "\n" + link;
      $("gfBox").innerHTML = '<div class="sect" style="margin-top:0">🎁 선물 링크</div><div class="rm-link" style="font-weight:700;word-break:break-all;user-select:all;background:#F8FAFC;border:1px dashed #94A3B8;border-radius:10px;padding:10px;margin:8px 0">' + e(link) + '</div>' +
        (office ? '<div class="hint" style="margin:0 0 8px">✓ 링크에 <b>' + e(office) + '</b>이(가) 같이 붙어 가요. 친구가 들어오면 그 부동산 손님으로 연결돼요.</div>' : '') +
        '<button class="btn" id="gfSh">💬 카톡 · 문자로 선물하기</button><button class="btn ghost" id="gfCp">📋 복사</button><button class="btn ghost" id="gfQr">🔳 QR 보여 주기</button><div id="gfQrB" style="display:flex;justify-content:center"></div>';
      $("gfSh").onclick = function () { if (navigator.share) { navigator.share({ title: "직빵 young call", text: msg }).catch(function () {}); return; } location.href = "sms:?body=" + encodeURIComponent(msg); };
      $("gfCp").onclick = function () { var ok = function () { say("복사했어요. 카톡에 붙여 넣으세요."); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(msg).then(ok, function () { say("링크를 길게 눌러 복사해 주세요."); }); else say("링크를 길게 눌러 복사해 주세요."); };
      $("gfQr").onclick = function () { var box = $("gfQrB"); if (box.firstChild) { box.innerHTML = ""; return; }
        var drawQ = function () { box.innerHTML = '<div id="gfQrIn" style="background:#fff;padding:12px;border-radius:12px;margin-top:10px"></div>'; new window.QRCode($("gfQrIn"), { text: link, width: 200, height: 200 }); };
        if (window.QRCode) { drawQ(); return; }
        var s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"; s.onload = drawQ; s.onerror = function () { say("QR을 만들려면 인터넷이 필요해요."); }; document.head.appendChild(s); };
    }).catch(function (er) { $("gfBox").innerHTML = '<div class="err">' + e(msgOf(er)) + '</div>'; });
  };

  /* ---------- 뒤로 가기 ---------- */
  window.YC_ROUTE = function (st) {
    var sh = $("ycSh"); if (sh) sh.remove();
    if (st.view === "yc") { showYC(true); return true; }
    if (st.view === "ycset") { if (ST.loaded) setPage(); else showYC(true); return true; }
    if (st.view === "ycsaved") { if (ST.loaded) savedPage(); else showYC(true); return true; }
    if (st.view === "ycgift") { showYCGift(true); return true; }
    return false;
  };
})();
