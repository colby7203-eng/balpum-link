/* =====================================================================
   발품투어 매물장 v1.4 — 🎁 직빵 young call (동네 친구 샘이랑 영어 수다)
   · 샘이 먼저 말을 걸고, 사용자 수준에 맞춰 이어 가요
   · 💬 수다 · 🔁 통역 · 🎯 오늘 표현 · 🎤 말하기 · 🔊 읽어 주기 · 🐢 천천히
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
  function home() { if (typeof showHome === "function") showHome(); }
  function plug(n) { return window.Capacitor && Capacitor.Plugins && Capacitor.Plugins[n]; }

  var CSS = '<style>' +
    '.yc-bar{display:flex;align-items:center;gap:8px;margin:-14px -14px 10px;padding:10px 12px;position:sticky;top:0;z-index:15}' +
    '.yc-bar .bk{border:0;background:rgba(30,42,120,.12);color:#1E2A78;border-radius:12px;padding:8px 11px;font:700 14px "Noto Sans KR",sans-serif;cursor:pointer;flex:none;white-space:nowrap;display:inline-flex;align-items:center;gap:2px}' +
    '.yc-tr .tl button,.yc-ex .tl button{font:700 12px "Noto Sans KR",sans-serif;border:1px solid #E1E4EE;border-radius:999px;padding:4px 10px;color:#1E2A78;background:#fff;cursor:pointer}' +
    '.yc-bar .lg{flex:1;display:flex;justify-content:center;min-width:0}.yc-bar .ic{border:0;background:#fff;border-radius:12px;width:40px;height:40px;font-size:18px;cursor:pointer;flex:none;box-shadow:0 1px 3px rgba(0,0,0,.1)}' +
    '.yc-st{font:700 11px "Noto Sans KR",sans-serif;color:#0E7E6C;text-align:center;margin:-4px 0 8px}' +
    '.yc-modes{display:flex;gap:6px;margin:0 0 10px}.yc-modes button{flex:1;border:1px solid #E1E4EE;background:#fff;border-radius:12px;padding:8px 2px;font:700 13px "Noto Sans KR",sans-serif;color:#5E6785;cursor:pointer}' +
    '.yc-modes button.on{background:#1E2A78;color:#fff;border-color:#1E2A78}' +
    '.yc-log{display:flex;flex-direction:column;gap:8px;padding-bottom:8px}' +
    '.yc-b{max-width:86%;border-radius:16px;padding:10px 12px;font-size:15px;line-height:1.5;word-break:break-word}' +
    '.yc-b.s{background:#fff;border:1px solid #E1E4EE;align-self:flex-start;border-top-left-radius:4px}.yc-b.u{background:#1E2A78;color:#fff;align-self:flex-end;border-top-right-radius:4px}' +
    '.yc-b .ko{display:block;font-size:12.5px;color:#5E6785;margin-top:5px;border-top:1px dashed #E1E4EE;padding-top:5px}.yc-b.u .ko{color:#C7CEF5;border-color:rgba(255,255,255,.25)}' +
    '.yc-b .tl{display:flex;gap:6px;margin-top:7px;flex-wrap:wrap}.yc-b .tl button{font:700 12px "Noto Sans KR",sans-serif;border:1px solid #E1E4EE;border-radius:999px;padding:4px 10px;color:#1E2A78;background:#F6F7FC;cursor:pointer}' +
    '.yc-fix{align-self:flex-end;max-width:88%;background:#FFF4D6;border:1px solid #FFD98A;border-radius:12px;padding:8px 11px;font-size:13.5px;color:#5A3D00;line-height:1.5}.yc-fix b{color:#C2410C}.yc-fix small{display:block;color:#7A5A20;margin-top:3px}' +
    '.yc-tr{align-self:stretch;background:#EEF6FF;border:1px solid #C7DDF7;border-radius:14px;padding:10px 12px}.yc-tr .k{font:800 12px "Noto Sans KR",sans-serif;color:#1E5AA8}.yc-tr .en{font-size:17px;font-weight:700;margin:3px 0}' +
    '.yc-ex{align-self:stretch;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:14px;padding:10px 12px}.yc-ex .k{font:800 12px "Noto Sans KR",sans-serif;color:#15803D}.yc-ex .en{font-size:18px;font-weight:800;margin:3px 0}' +
    '.yc-cr{align-self:stretch;background:#FEF2F2;border:1.5px solid #FCA5A5;border-radius:14px;padding:12px;font-size:15px;line-height:1.6;color:#7F1D1D}.yc-cr a{display:inline-block;margin-top:8px;background:#DC2626;color:#fff;border-radius:12px;padding:9px 14px;font-weight:800;text-decoration:none}' +
    '.yc-wait{align-self:flex-start;color:#5E6785;font-size:13px;padding:4px 8px}' +
    '.yc-in{position:sticky;bottom:var(--kb,0px);background:#F1F5F9;padding:8px 0 calc(8px + env(safe-area-inset-bottom,0px));display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:end;z-index:12}' +
    '.yc-in textarea{min-width:0;border:1px solid #CBD5E1;border-radius:18px;padding:10px 13px;font:16px "Noto Sans KR",sans-serif;resize:none;max-height:120px;background:#fff}' +
    '.yc-mic{width:52px;height:52px;border-radius:50%;border:0;background:#E0420C;color:#fff;font-size:22px;cursor:pointer;box-shadow:0 0 0 5px rgba(224,66,12,.15)}.yc-mic.on{animation:ycp 1.2s ease-in-out infinite}@keyframes ycp{50%{box-shadow:0 0 0 12px rgba(224,66,12,.1)}}' +
    '.yc-snd{width:46px;height:46px;border-radius:14px;border:0;background:#1E2A78;color:#fff;font-size:18px;cursor:pointer}' +
    '.yc-lang{display:flex;gap:6px;justify-content:center;margin:2px 0 4px}.yc-lang button{border:1px solid #E1E4EE;background:#fff;border-radius:999px;padding:4px 10px;font:700 12px "Noto Sans KR",sans-serif;color:#5E6785;cursor:pointer}.yc-lang button.on{border-color:#E0420C;color:#E0420C}' +
    '.yc-hero{border-radius:20px;padding:20px 14px;display:grid;justify-items:center;gap:8px;text-align:center;margin-bottom:12px}.yc-hero p{margin:0;font:700 14px "Noto Sans KR",sans-serif;color:#5A3D00;line-height:1.55}' +
    '@media (prefers-reduced-motion:reduce){.yc-mic.on{animation:none}}' +
    '</style>';

  var ST = { loaded: false, cfg: {}, lines: [], mode: "chat", busy: false, lang: "en-US", key: "", model: "", models: [], tm: null };
  function app(h) { $("app").innerHTML = CSS + h; }

  /* ---------- 저장 ---------- */
  function load() {
    return Promise.all([BALPUM.DB.setting("yc", {}).catch(function () { return {}; }), BALPUM.DB.get("yc", "main").catch(function () { return null; }), BALPUM.API.appAiKey().catch(function () { return {}; }),
      (window.BP_CUST ? BALPUM.Room.myAgent().catch(function () { return null; }) : Promise.resolve(null))]).then(function (r) {
      ST.cfg = r[0] || {}; ST.lines = ((r[1] && r[1].data) || {}).lines || []; var k = r[2] || {};
      ST.key = k.key || ""; ST.model = k.model || ""; ST.models = k.models || []; ST.ag = r[3]; ST.loaded = true;
      if (!ST.cfg.name) ST.cfg.name = (r[3] && r[3].name) || (typeof OFFICE_INFO !== "undefined" && OFFICE_INFO && OFFICE_INFO.ceo) || "";
    });
  }
  function saveLines() { ST.lines = ST.lines.slice(-80); clearTimeout(ST.tm); ST.tm = setTimeout(function () { BALPUM.DB.upsert("yc", "main", { lines: ST.lines }).catch(function () {}); }, 700); }
  function saveCfg() { return BALPUM.DB.saveSetting("yc", ST.cfg); }

  /* ---------- 재미나이 (내 무료 키) ---------- */
  function gem(prompt) {
    if (!ST.key) return Promise.reject(new Error("재미나이 키를 먼저 넣어 주세요."));
    var models = [ST.model].concat(ST.models || [], ["gemini-flash-latest", "gemini-2.5-flash", "gemini-flash-lite-latest", "gemini-2.5-flash-lite", "gemini-2.0-flash"]).filter(function (m, i, a) { return m && a.indexOf(m) === i; });
    var busy = 0, last = "";
    function tryAt(i) {
      if (i >= models.length) return Promise.reject(new Error(busy ? "구글 AI가 지금 붐벼요. 잠시 뒤 다시 보내 주세요." : "쓸 수 있는 AI 모델을 찾지 못했어요 (" + last + ")."));
      return fetch("https://generativelanguage.googleapis.com/v1beta/models/" + models[i] + ":generateContent?key=" + encodeURIComponent(ST.key), {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.8 } })
      }).then(function (res) { return res.text().then(function (body) {
        if (res.status === 404) { last = models[i] + " 없음"; return tryAt(i + 1); }
        if (res.status >= 500) { busy++; last = models[i] + " 붐빔"; return new Promise(function (r) { setTimeout(r, 1200); }).then(function () { return tryAt(i + 1); }); }
        if (res.status === 400 && /API key not valid|API_KEY_INVALID/i.test(body)) throw new Error("재미나이 키가 맞지 않아요. ⚙에서 키를 다시 넣어 주세요.");
        if (res.status === 429) throw new Error("오늘 무료 사용량을 다 썼거나 너무 빨리 보냈어요. 잠시 뒤(또는 내일) 다시 해 주세요.");
        if (!res.ok) throw new Error("AI 연결 오류 (" + res.status + ")");
        var t = ""; try { t = JSON.parse(body).candidates[0].content.parts.map(function (x) { return x.text || ""; }).join(""); } catch (er) {}
        if (models[i] !== ST.model) { ST.model = models[i]; if (BALPUM.API.appAiModelSave) BALPUM.API.appAiModelSave(models[i]).catch(function () {}); }
        t = String(t || "").replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
        try { return JSON.parse(t); } catch (er) { throw new Error("샘의 답을 읽지 못했어요. 다시 보내 주세요."); }
      }); }, function () { throw new Error("인터넷 연결을 확인해 주세요."); });
    }
    return tryAt(0);
  }

  /* ---------- 샘 ---------- */
  function who() {
    return "너는 Sam 이야. 미국에서 온 50대 남자이고, 사용자의 다정한 '동네 친구'야. 같은 동네에 살면서 산책길에 만나는 친구처럼 편하게 말해.\n" +
      "사용자는 한국 사람이고 영어를 다시 배우는 중이야. 사용자를 \"" + (ST.cfg.name || "my friend") + "\" 라고 불러.\n" +
      "규칙:\n- 사용자 수준에 맞춰. 짧고 서툴게 쓰면 아주 쉬운 영어로, 잘 쓰면 조금 더 자연스럽게.\n" +
      "- 대화가 끊기지 않게 끝에 짧은 질문을 하나 붙여. 일·가족·취미·동네·고민을 궁금해해.\n" +
      "- 사용자가 힘들거나 속상하거나 외로운 이야기를 하면 mood 를 feel 로 하고, 고치기(fix.show)는 false 로 쉬고 먼저 공감해. 그래도 쉬운 영어로 이야기를 이어 가게 물어봐.\n" +
      "- 사용자가 죽고 싶다·자해 같은 위험한 말을 하면 mood 를 crisis 로 하고, crisis_ko 에 한국어로 따뜻하게 답해. 혼자 견디지 말고 자살예방상담전화 109(24시간)나 가까운 사람에게 꼭 연락하라고 알려 줘.\n" +
      "- 너는 AI 친구라는 걸 숨기지 마. 물으면 솔직하게 말해. 연인처럼 굴지 말고, 가끔 실제 친구·가족·동네 사람들과도 이야기해 보라고 응원해.\n" +
      "- 사용자가 한국어로 쓰면 그 말을 영어로 어떻게 하는지 fix 에 알려 주고, 너는 영어로 답해.\n- 쉬운 영어 1~3문장. 이모지는 가끔 하나만.\n";
  }
  function hist() { return ST.lines.slice(-12).map(function (l) { return l.who === "s" ? "Sam: " + l.en : l.who === "u" ? "사용자: " + l.en : ""; }).filter(Boolean).join("\n"); }
  function hourKo() { var h = new Date().getHours(); return (h < 12 ? "오전 " : "오후 ") + ((h % 12) || 12) + "시"; }
  var REPLY = "이 JSON 모양으로만 답해: {\"say\":{\"en\":\"\",\"ko\":\"한국어 뜻\"},\"fix\":{\"show\":true,\"corrected\":\"사용자 문장을 최대한 살려 문법만 고친 문장\",\"natural\":\"원어민이 실제로 하는 말\",\"why\":\"쉬운 한국어 한 줄\"},\"mood\":\"normal|feel|crisis\",\"crisis_ko\":\"\"}\n" +
    "사용자 문장이 이미 자연스러우면 fix.show 는 false.";
  function startPrompt() {
    return who() + "지금 시각: " + hourKo() + "\n지금까지 이야기(최근):\n" + (hist() || "(처음 만남)") + "\n\n지금 사용자에게 먼저 말을 걸어. " +
      (ST.lines.length ? "지난 이야기 중 하나를 자연스럽게 이어 물어봐." : "처음 만났으니 동네 친구 Sam 이라고 짧게 소개하고, 오늘 어땠는지 물어봐.") +
      "\n이 JSON 모양으로만 답해: {\"say\":{\"en\":\"\",\"ko\":\"한국어 뜻\"}}";
  }
  function replyPrompt(t) { return who() + "지금까지 이야기:\n" + (hist() || "(없음)") + "\n사용자가 방금 한 말: " + t + "\n\n" + REPLY; }
  function trPrompt(t) { return "너는 친절한 통역사야. 아래 말을 " + (/[가-힣]/.test(t) ? "자연스러운 미국 영어로" : "자연스러운 한국어로") + " 옮겨. 말투는 일상 대화체.\n말: " + t +
    "\n이 JSON 모양으로만 답해: {\"en\":\"영어\",\"ko\":\"한국어\",\"tip\":\"말할 때 알아 두면 좋은 점 한 줄 (한국어, 없으면 빈칸)\"}"; }
  function exPrompt() { return who() + "지금까지 이야기(최근):\n" + (hist() || "(없음)") + "\n\n오늘의 생활 영어 표현 하나를 골라 줘. 사용자 이야기와 관련 있으면 더 좋아. 집·동네·가족·일·쇼핑 같은 일상에서 바로 쓰는 표현으로.\n" +
    "그리고 사용자가 그 표현을 써서 대답해 보게 짧은 질문을 해.\n이 JSON 모양으로만 답해: {\"expr\":{\"en\":\"표현\",\"ko\":\"뜻\",\"ex\":\"예문\",\"exko\":\"예문 뜻\"},\"say\":{\"en\":\"질문\",\"ko\":\"한국어 뜻\"}}"; }
  function str(v, n) { return String(v == null ? "" : v).slice(0, n || 500); }

  /* ---------- 말하기 · 듣기 ---------- */
  function speak(t, slow) {
    t = String(t || ""); if (!t) return;
    var T = plug("TextToSpeech"), rate = slow ? 0.7 : (ST.cfg.rate || 1);
    if (T && T.speak) { try { T.stop && T.stop().catch(function () {}); } catch (er) {} T.speak({ text: t, lang: "en-US", rate: rate, pitch: 1, volume: 1, category: "playback" }).catch(function () { webSpeak(t, rate); }); return; }
    webSpeak(t, rate);
  }
  function webSpeak(t, rate) {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) { say("이 핸드폰에서는 읽어 주기가 안 돼요."); return; }
    try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(t); u.lang = "en-US"; u.rate = rate;
      var v = speechSynthesis.getVoices().filter(function (x) { return /^en[-_]US/i.test(x.lang); })[0]; if (v) u.voice = v; speechSynthesis.speak(u); } catch (er) {}
  }
  function listen() {
    var SR = plug("SpeechRecognition"), mic = $("ycMic");
    var got = function (t) { if (mic) mic.classList.remove("on"); t = String(t || "").trim(); if (t) send(t, true); };
    var fail = function () { if (mic) mic.classList.remove("on"); say("마이크가 안 되면 자판의 🎤 를 눌러 말해도 돼요."); };
    if (mic) mic.classList.add("on");
    if (SR && SR.start) {
      var perm = SR.requestPermissions ? SR.requestPermissions() : SR.requestPermission ? SR.requestPermission() : Promise.resolve();
      Promise.resolve(perm).catch(function () {}).then(function () {
        return SR.start({ language: ST.lang, maxResults: 1, prompt: ST.lang === "ko-KR" ? "한국말로 말해 주세요" : "Speak in English", partialResults: false, popup: true });
      }).then(function (r) { got(r && r.matches && r.matches[0]); }).catch(fail);
      return;
    }
    var W = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!W) { fail(); return; }
    try { var rec = new W(); rec.lang = ST.lang; rec.interimResults = false; rec.maxAlternatives = 1;
      rec.onresult = function (ev) { got(ev.results[0][0].transcript); }; rec.onerror = fail; rec.onend = function () { if (mic) mic.classList.remove("on"); }; rec.start(); } catch (er) { fail(); }
  }

  /* ---------- 화면 ---------- */
  window.showYC = function (fromHist) {
    if (!fromHist) go("yc");
    app('<div class="loading">샘 부르는 중…</div>');
    load().then(function () { if (!ST.key) keyPage(); else chatPage(); }).catch(function (er) { app('<div class="card"><div class="err">' + e(msgOf(er)) + '</div><button class="btn" onclick="showYC()">다시 해 보기</button></div>'); });
  };
  function bar(right) { return '<div class="yc-bar bpy"><button class="bk" id="ycBk">← 홈</button><div class="lg">' + logo(24) + '</div>' + (right || '') + '</div>'; }

  function keyPage() {
    app(bar() + '<div class="yc-hero bpy">' + logo(40) + '<p>동네 친구 샘이랑 영어로 수다 떨기<br>틀려도 괜찮아요 · 한국말로 물어봐도 돼요</p></div>' +
      '<div class="card"><div class="sect" style="margin-top:0">🔑 처음 한 번만: 재미나이 무료 키 넣기</div>' +
      '<div class="howkey"><ol><li>아래 [키 만들러 가기]를 눌러 구글 계정으로 들어가요</li><li><b>Create API key</b>(API 키 만들기)를 눌러요</li><li>생긴 키 옆 <b>복사</b>를 눌러요</li><li>여기 칸을 길게 눌러 <b>붙여넣기</b> → [저장]</li></ol>' +
      '<div class="safe">✅ 무료예요. 키는 내 계정에만 저장되고 화면엔 끝 4자리만 보여요. 이 키를 넣어도 다른 프로그램은 그대로 잘 돼요.</div></div>' +
      '<a class="btn ghost" href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">🔑 키 만들러 가기</a>' +
      '<label for="ycKey">재미나이 키</label><input id="ycKey" autocomplete="off" placeholder="AIza… 로 시작해요">' +
      '<button class="btn" id="ycKS">저장하고 샘 만나기</button>' +
      (window.BP_CUST ? '<div class="hint">어려우면 부동산 사장님께 [상담]으로 "영콜 키 넣는 것 도와주세요"라고 보내세요.</div>' : '') + '</div>');
    $("ycBk").onclick = home;
    $("ycKS").onclick = function () { var v = $("ycKey").value.trim(), b = this; if (!/^AIza[0-9A-Za-z_\-]{20,}$/.test(v)) { say("키 전체를 다시 복사해 넣어 주세요 (AIza… 로 시작)."); return; }
      b.disabled = true; b.textContent = "확인하는 중…";
      BALPUM.API.appAiSettingsSave({ geminiKey: v }).then(function () { ST.key = v; ST.model = ""; return gem('{"ok":true} 만 JSON으로 답해.'); })
        .then(function () { say("연결됐어요! 샘이 말을 걸어요."); chatPage(); })
        .catch(function (er) { b.disabled = false; b.textContent = "저장하고 샘 만나기"; say(msgOf(er)); }); };
  }

  function lineHTML(l, i) {
    if (l.who === "s") return '<div class="yc-b s">' + e(l.en) + (l.ko ? '<span class="ko">' + e(l.ko) + '</span>' : '') + '<div class="tl"><button type="button" data-sp="' + i + '">🔊 다시 듣기</button><button type="button" data-sl="' + i + '">🐢 천천히</button></div></div>';
    if (l.who === "u") return '<div class="yc-b u">' + e(l.en) + (l.v ? '<span class="ko">🎤 말로 했어요</span>' : '') + '</div>' +
      (l.fix && l.fix.show && (l.fix.corrected || l.fix.natural) ? '<div class="yc-fix">✏️ 이렇게 말하면 더 자연스러워요: <b>' + e(l.fix.natural || l.fix.corrected) + '</b>' + (l.fix.why ? '<small>' + e(l.fix.why) + '</small>' : '') + '</div>' : '');
    if (l.who === "c") return '<div class="yc-cr">' + e(l.ko).replace(/\n/g, "<br>") + '<br><a href="tel:109">📞 109 자살예방상담전화 (24시간)</a></div>';
    if (l.who === "t") return '<div class="yc-tr"><span class="k">🔁 통역 · ' + e(l.src) + '</span><div class="en">' + e(l.en) + '</div><div>' + e(l.ko) + '</div>' + (l.tip ? '<div class="hint" style="margin:4px 0 0">💡 ' + e(l.tip) + '</div>' : '') + '<div class="tl" style="display:flex;gap:6px;margin-top:6px"><button type="button" data-sp="' + i + '">🔊 듣기</button><button type="button" data-sl="' + i + '">🐢 천천히</button></div></div>';
    if (l.who === "x") return '<div class="yc-ex"><span class="k">🎯 오늘 표현</span><div class="en">' + e(l.en) + '</div><div>' + e(l.ko) + '</div>' + (l.ex ? '<div style="margin-top:4px">예) ' + e(l.ex) + ' <span class="hint" style="margin:0">' + e(l.exko) + '</span></div>' : '') + '<div class="tl" style="display:flex;gap:6px;margin-top:6px"><button type="button" data-sp="' + i + '">🔊 듣기</button><button type="button" data-sl="' + i + '">🐢 천천히</button></div></div>';
    return '';
  }
  function draw() {
    var L = $("ycL"); if (!L) return;
    L.innerHTML = ST.lines.map(lineHTML).join("") + (ST.busy ? '<div class="yc-wait">💬 샘이 쓰는 중…</div>' : '');
    each("#ycL [data-sp]", function (b) { b.onclick = function () { var l = ST.lines[+b.getAttribute("data-sp")]; speak(l.who === "x" ? l.en + ". " + (l.ex || "") : l.en); }; });
    each("#ycL [data-sl]", function (b) { b.onclick = function () { var l = ST.lines[+b.getAttribute("data-sl")]; speak(l.who === "x" ? l.en + ". " + (l.ex || "") : l.en, true); }; });
    window.scrollTo(0, document.body.scrollHeight);
  }
  function chatPage() {
    app(bar('<button class="ic" id="ycGf" aria-label="친구에게 선물하기">🎁</button><button class="ic" id="ycSet" aria-label="설정">⚙</button>') +
      '<div class="yc-st">● 샘 접속 중 · 영어나 한국말로 편하게</div>' +
      '<div class="yc-modes"><button type="button" data-m="chat">💬 수다</button><button type="button" data-m="tr">🔁 통역</button><button type="button" data-m="ex">🎯 오늘 표현</button></div>' +
      '<div class="yc-log" id="ycL"></div>' +
      '<div class="yc-in"><button type="button" class="yc-mic" id="ycMic" aria-label="말하기">🎤</button><textarea id="ycT" rows="1" enterkeyhint="send" placeholder="영어나 한국말로 써도 돼요"></textarea><button type="button" class="yc-snd" id="ycS" aria-label="보내기">↑</button></div>' +
      '<div class="yc-lang"><button type="button" data-lg="en-US">🎤 영어로 말하기</button><button type="button" data-lg="ko-KR">🎤 한국말로 말하기</button></div>');
    $("ycBk").onclick = home; $("ycSet").onclick = setPage; $("ycGf").onclick = function () { showYCGift(); };
    var modes = function () { each("[data-m]", function (b) { b.classList.toggle("on", b.getAttribute("data-m") === ST.mode); }); $("ycT").placeholder = ST.mode === "tr" ? "옮길 말을 쓰세요 (한국말 ↔ 영어)" : "영어나 한국말로 써도 돼요"; };
    var langs = function () { each("[data-lg]", function (b) { b.classList.toggle("on", b.getAttribute("data-lg") === ST.lang); }); };
    each("[data-m]", function (b) { b.onclick = function () { var m = b.getAttribute("data-m"); if (m === "ex") { todayExpr(); return; } ST.mode = m; modes(); }; });
    each("[data-lg]", function (b) { b.onclick = function () { ST.lang = b.getAttribute("data-lg"); langs(); }; });
    modes(); langs(); draw();
    $("ycS").onclick = function () { send($("ycT").value); };
    $("ycT").addEventListener("keydown", function (ev) { if (ev.key === "Enter" && !ev.shiftKey && !ev.isComposing) { ev.preventDefault(); send(this.value); } });
    $("ycT").addEventListener("input", function () { this.style.height = "auto"; this.style.height = Math.min(120, this.scrollHeight) + "px"; });
    $("ycMic").onclick = listen;
    var last = ST.lines[ST.lines.length - 1], stale = !last || (Date.now() - (last.t || 0)) > 3 * 3600 * 1000;
    if (stale) samFirst();
  }
  function samFirst() {
    ST.busy = true; draw();
    gem(startPrompt()).then(function (r) { ST.busy = false; var s = (r && r.say) || {}; if (s.en) { ST.lines.push({ who: "s", en: str(s.en), ko: str(s.ko), t: Date.now() }); saveLines(); draw(); if (ST.cfg.auto !== false) speak(s.en); } else draw(); })
      .catch(function (er) { ST.busy = false; draw(); say(msgOf(er)); });
  }
  function todayExpr() {
    if (ST.busy) return; ST.busy = true; draw();
    gem(exPrompt()).then(function (r) { ST.busy = false; var x = (r && r.expr) || {}, s = (r && r.say) || {};
      if (x.en) ST.lines.push({ who: "x", en: str(x.en, 200), ko: str(x.ko, 200), ex: str(x.ex, 300), exko: str(x.exko, 300), t: Date.now() });
      if (s.en) ST.lines.push({ who: "s", en: str(s.en), ko: str(s.ko), t: Date.now() });
      saveLines(); draw(); if (x.en) speak(x.en + ". " + (x.ex || "")); })
      .catch(function (er) { ST.busy = false; draw(); say(msgOf(er)); });
  }
  function send(t, voice) {
    t = String(t || "").trim(); if (!t || ST.busy) return;
    var T = $("ycT"); if (T) { T.value = ""; T.style.height = "auto"; }
    if (ST.mode === "tr") {
      ST.busy = true; draw();
      gem(trPrompt(t)).then(function (r) { ST.busy = false; ST.lines.push({ who: "t", src: str(t, 200), en: str(r && r.en), ko: str(r && r.ko), tip: str(r && r.tip, 200), t: Date.now() }); saveLines(); draw(); if (r && r.en) speak(r.en); })
        .catch(function (er) { ST.busy = false; draw(); say(msgOf(er)); });
      return;
    }
    var me = { who: "u", en: str(t), v: !!voice, t: Date.now() }; ST.lines.push(me); ST.busy = true; draw();
    gem(replyPrompt(t)).then(function (r) {
      ST.busy = false; r = r || {};
      if (r.mood === "crisis") { ST.lines.push({ who: "c", ko: str(r.crisis_ko || "많이 힘드시군요. 혼자 견디지 마세요. 지금 바로 109(자살예방상담전화, 24시간)나 가까운 사람에게 연락해 주세요. 저도 여기 있을게요.", 600), t: Date.now() }); saveLines(); draw(); return; }
      var f = r.fix || {}; if (r.mood !== "feel" && f.show) me.fix = { show: true, corrected: str(f.corrected, 400), natural: str(f.natural, 400), why: str(f.why, 200) };
      var s = r.say || {}; if (s.en) ST.lines.push({ who: "s", en: str(s.en), ko: str(s.ko), t: Date.now() });
      saveLines(); draw(); if (s.en) speak(s.en);
    }).catch(function (er) { ST.busy = false; ST.lines.pop(); draw(); if ($("ycT")) $("ycT").value = t; say(msgOf(er)); });
  }

  function setPage() {
    go("ycset");
    app(bar() + '<div class="card"><div class="sect" style="margin-top:0">⚙ 직빵 young call 설정</div>' +
      '<label for="ycNm">샘이 부를 내 이름</label><input id="ycNm" value="' + e(ST.cfg.name || "") + '" placeholder="예) Mr. Jung, DC">' +
      '<label>샘 말 빠르기</label><div class="rm-pick" id="ycRt">' + [[0.75, "🐢 천천히"], [1, "보통"], [1.15, "조금 빠르게"]].map(function (x) { return '<button type="button" data-v="' + x[0] + '" class="' + ((ST.cfg.rate || 1) == x[0] ? "on" : "") + '" style="border:1px solid #CBD5E1;background:#fff;border-radius:999px;padding:8px 12px;font:600 14px \'Noto Sans KR\',sans-serif;margin:0 6px 6px 0">' + x[1] + '</button>'; }).join("") + '</div>' +
      '<label class="chk"><input type="checkbox" id="ycAu"' + (ST.cfg.auto !== false ? " checked" : "") + '> <span>샘이 말하면 소리로 바로 읽어 주기</span></label>' +
      '<button class="btn" id="ycSv">저장</button></div>' +
      '<div class="card"><div class="sect" style="margin-top:0">🔑 재미나이 키</div><div class="hint" style="margin-top:0">지금 키: ' + e(ST.key ? "••••" + ST.key.slice(-4) : "없음") + '</div><button class="btn ghost" id="ycKy">키 바꾸기</button></div>' +
      '<div class="card"><div class="sect" style="margin-top:0">🧹 대화 지우기</div><div class="hint" style="margin-top:0">샘과 나눈 이야기 ' + ST.lines.length + '줄이 내 계정에 있어요.</div><button class="btn ghost" id="ycClr">대화 모두 지우기</button></div>' +
      '<div class="hint" style="text-align:center">샘은 AI 친구예요. 진짜 친구 · 가족 · 동네 사람들과의 이야기도 응원해요.</div>');
    $("ycBk").onclick = function () { showYC(); };
    each("#ycRt button", function (b) { b.onclick = function () { ST.cfg.rate = +b.getAttribute("data-v"); each("#ycRt button", function (x) { x.classList.toggle("on", x === b); x.style.background = x === b ? "#1E2A78" : "#fff"; x.style.color = x === b ? "#fff" : ""; }); speak("Hi! This is how I sound.", false); }; });
    $("ycSv").onclick = function () { ST.cfg.name = $("ycNm").value.trim(); ST.cfg.auto = $("ycAu").checked; saveCfg().then(function () { say("저장했어요."); showYC(); }).catch(function (er) { say(msgOf(er)); }); };
    $("ycKy").onclick = keyPage;
    $("ycClr").onclick = function () { if (!confirm("샘과 나눈 이야기를 모두 지울까요?")) return; ST.lines = []; BALPUM.DB.upsert("yc", "main", { lines: [] }).then(function () { say("지웠어요."); showYC(); }); };
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
      var msg = "🎁 직빵 young call 선물이에요!\n동네 친구 샘이랑 영어로 수다 떨어요. 무료예요." + (office ? "\n(" + office + " 발품 앱)" : "") + "\n" + link;
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
    if (st.view === "yc") { showYC(true); return true; }
    if (st.view === "ycset") { if (ST.loaded) setPage(); else showYC(true); return true; }
    if (st.view === "ycgift") { showYCGift(true); return true; }
    return false;
  };
})();
