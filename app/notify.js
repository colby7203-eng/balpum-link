/* =====================================================================
   발품투어 매물장 — 🔔 알림 (v1.5)
   · 달력 약속 N분 전 알림 · 영콜 '오늘 표현' 하루 한 번 (핸드폰 안에서 저절로, 설정 필요 없음)
   · 손님 상담 · 공유방 소식 푸시 (파이어베이스 준비가 끝나면 켜짐 — config.js PUSH)
   · 앱 안에 있을 때: 위에서 내려오는 알림 줄 + 띵동 소리
   Made by 정동철 · 상상을 현실로
   ===================================================================== */
(function () {
  "use strict";
  function P(n) { return window.Capacitor && Capacitor.Plugins && Capacitor.Plugins[n]; }
  var LN = function () { return P("LocalNotifications"); };
  var CH = "balpum";
  var chReady = null;
  function channel() {
    if (chReady) return chReady;
    var L = LN();
    chReady = (L && L.createChannel ? L.createChannel({ id: CH, name: "발품 알림", description: "손님 상담 · 공유방 · 달력 약속 · 영콜", importance: 5, visibility: 1, vibration: true }) : Promise.resolve())
      .catch(function () {});
    return chReady;
  }
  function perm() {
    var L = LN(); if (!L) return Promise.resolve(false);
    return L.checkPermissions().then(function (p) { return p.display === "granted" ? p : L.requestPermissions(); })
      .then(function (p) { return p && p.display === "granted"; }).catch(function () { return false; });
  }
  function getJ(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function setJ(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ---------- 띵동 소리 + 위에서 내려오는 알림 줄 (앱 안에 있을 때) ---------- */
  var actx = null;
  function ding() {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      [[880, 0], [660, 0.16]].forEach(function (x) {
        var o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + x[1];
        o.type = "sine"; o.frequency.value = x[0];
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.3, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + 0.4);
      });
      if (navigator.vibrate) navigator.vibrate([60, 60, 60]);
    } catch (e) {}
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function drop(title, body, onTap) {
    var old = document.getElementById("bpDrop"); if (old) old.remove();
    var d = document.createElement("div"); d.id = "bpDrop"; d.setAttribute("role", "alert");
    d.style.cssText = "position:fixed;left:10px;right:10px;top:calc(8px + env(safe-area-inset-top,0px));z-index:100000;background:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(15,23,42,.28);padding:12px 14px;display:flex;gap:10px;align-items:center;font-family:'Noto Sans KR',sans-serif;transform:translateY(-130%);transition:transform .35s cubic-bezier(.2,.9,.3,1.2);cursor:pointer;border-left:6px solid #DC2626";
    d.innerHTML = '<img src="icons/foot.png" alt="" style="width:36px;height:36px;border-radius:10px;flex:none;transform:rotate(-9deg)"><div style="min-width:0;flex:1"><b style="display:block;font-size:14.5px;color:#0F172A">' + esc(title) + '</b><span style="display:block;font-size:13px;color:#475569;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(body) + '</span></div><span style="font-size:12px;color:#94A3B8">지금</span>';
    document.body.appendChild(d);
    requestAnimationFrame(function () { d.style.transform = "translateY(0)"; });
    var gone = false, close = function () { if (gone) return; gone = true; d.style.transform = "translateY(-130%)"; setTimeout(function () { d.remove(); }, 400); };
    d.onclick = function () { close(); if (onTap) onTap(); };
    setTimeout(close, 6000);
    // v1.6: 앱을 보고 있어도 핸드폰 알림 소리로 (화면을 안 눌렀으면 웹 소리는 핸드폰이 막아요)
    var L = LN();
    if (L && L.schedule) {
      channel().then(function () { return L.schedule({ notifications: [{ id: 800000 + Math.floor(Math.random() * 90000), title: title, body: body, channelId: CH, schedule: { at: new Date(Date.now() + 300), allowWhileIdle: true } }] }); })
        .catch(function () { ding(); });
    } else ding();
  }

  /* ---------- 📅 달력 약속 알림 ---------- */
  var CAL_IDS = "bp_cal_noti";
  function calSync(days, minutes) {
    var L = LN(); if (!L) return Promise.resolve(0);
    minutes = minutes === undefined ? 30 : +minutes;
    var old = getJ(CAL_IDS, []);
    var cancel = old.length ? L.cancel({ notifications: old.map(function (id) { return { id: id }; }) }).catch(function () {}) : Promise.resolve();
    return cancel.then(function () {
      setJ(CAL_IDS, []);
      if (!(minutes >= 0) || minutes === -1) return 0;
      var now = Date.now(), until = now + 60 * 864e5, list = [];
      Object.keys(days || {}).forEach(function (k) {
        (days[k].ev || []).forEach(function (x) {
          if (x.d) return;
          var p = k.split("-"), hm = /^(\d{1,2}):(\d{2})/.exec(x.t || ""), at;
          if (hm) at = new Date(+p[0], +p[1] - 1, +p[2], +hm[1], +hm[2]).getTime() - minutes * 6e4;
          else at = new Date(+p[0], +p[1] - 1, +p[2], 8, 0).getTime() - (minutes >= 1440 ? 864e5 : 0);   // 하루 종일 약속은 아침 8시에
          if (at > now + 3e4 && at < until) list.push({ at: at, k: k, x: x });
        });
      });
      list.sort(function (a, b) { return a.at - b.at; });
      list = list.slice(0, 60);
      if (!list.length) return 0;
      return perm().then(function (ok) {
        if (!ok) return 0;
        return channel().then(function () {
          var ns = list.map(function (o, i) {
            var lead = minutes >= 1440 ? "내일" : minutes >= 60 ? (minutes / 60) + "시간 뒤" : minutes > 0 ? minutes + "분 뒤" : "지금";
            return { id: 100000 + i, title: "📒 " + (o.x.t ? lead + " · " + o.x.t : "오늘 약속"), body: (o.x.x || "약속") + (o.x.p ? " · " + o.x.p : ""),
                     schedule: { at: new Date(o.at), allowWhileIdle: true }, channelId: CH, extra: { go: "cal" } };
          });
          return L.schedule({ notifications: ns }).then(function () { setJ(CAL_IDS, ns.map(function (n) { return n.id; })); return ns.length; });
        });
      });
    }).catch(function () { return 0; });
  }

  /* ---------- 🎯 영콜: 하루 한 번 '오늘 표현이 왔어요' ---------- */
  function ycDaily(on, hour) {
    var L = LN(); if (!L) return Promise.resolve(false);
    return L.cancel({ notifications: [{ id: 900001 }] }).catch(function () {}).then(function () {
      if (!on) return false;
      return perm().then(function (ok) {
        if (!ok) return false;
        return channel().then(function () {
          return L.schedule({ notifications: [{ id: 900001, title: "🎯 오늘 표현이 왔어요", body: "샘이 오늘의 생활 영어 한 줄을 들고 기다려요 · 직빵 young call",
            schedule: { on: { hour: hour === undefined ? 9 : +hour, minute: 0 }, allowWhileIdle: true }, channelId: CH, extra: { go: "yc" } }] }).then(function () { return true; });
        });
      });
    }).catch(function () { return false; });
  }

  /* ---------- 알림을 누르면 그 화면으로 ---------- */
  function openFrom(x) {
    x = x || {};
    var go = x.go || x.type || "";
    try {
      if (go === "cal" && window.showCal) return showCal();
      if (go === "yc" && window.showYC) return showYC();
      if (go === "share" && window.showShare) return showShare();
      if (go === "room" && x.room && window.showShareRoom) return showShareRoom(+x.room);
      if (go === "msg") {
        if (window.BP_CUST && window.showCustChat) return showCustChat();
        if (x.customer && window.showRoom) return showRoom(x.customer);
        if (window.showRooms) return showRooms();
      }
    } catch (e) {}
  }
  var bound = false;
  function bindLocal() {
    var L = LN(); if (bound || !L || !L.addListener) return; bound = true;
    L.addListener("localNotificationActionPerformed", function (a) { openFrom((a && a.notification && a.notification.extra) || {}); });
  }

  /* ---------- 📲 푸시 (손님 상담 · 공유방) — 파이어베이스 준비가 끝난 앱에서만 ---------- */
  var pushUser = null, calUser = null;
  function pushInit() {
    var PN = P("PushNotifications"), cfg = (window.BALPUM && BALPUM.config) || {};
    var u = window.BALPUM && BALPUM.Auth && BALPUM.Auth.user();
    if (!PN || !cfg.PUSH || !u || pushUser === u.id) return;
    pushUser = u.id;
    channel().then(function () { return PN.createChannel ? PN.createChannel({ id: CH, name: "발품 알림", importance: 5, visibility: 1, vibration: true }).catch(function () {}) : null; })
      .then(function () { return PN.checkPermissions(); })
      .then(function (p) { return p.receive === "granted" ? p : PN.requestPermissions(); })
      .then(function (p) {
        if (!p || p.receive !== "granted") return;
        PN.removeAllListeners && PN.removeAllListeners();
        PN.addListener("registration", function (t) { if (t && t.value && BALPUM.Push) BALPUM.Push.save(t.value); });
        PN.addListener("registrationError", function () {});
        PN.addListener("pushNotificationReceived", function (n) {            // 앱을 보고 있을 때 온 알림
          var d = (n && n.data) || {};
          drop(n.title || d.title || "발품 알림", n.body || d.body || "", function () { openFrom(d); });
          if (window.bpHomeBadges) bpHomeBadges(true);
        });
        PN.addListener("pushNotificationActionPerformed", function (a) { openFrom((a && a.notification && a.notification.data) || {}); });
        return PN.register();
      }).catch(function () { pushUser = null; });
  }

  window.BP_NOTI = {
    can: function () { return !!LN(); },
    push: function () { return !!(P("PushNotifications") && ((window.BALPUM && BALPUM.config) || {}).PUSH); },
    calSync: calSync, ycDaily: ycDaily, drop: drop, ding: ding, open: openFrom,
    afterLogin: function () { bindLocal(); pushInit();
      var u = window.BALPUM && BALPUM.Auth && BALPUM.Auth.user();
      if (u && calUser !== u.id && LN()) { calUser = u.id; setTimeout(function () { if (window.calNotiSync) calNotiSync(); }, 2500); } }
  };
  document.addEventListener("DOMContentLoaded", bindLocal);
})();
