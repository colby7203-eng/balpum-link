/* =====================================================================
   발품투어 매물장 — 📅 달력 · 약속 다이어리 · 가계부 · 택배 (v1.3: 단추로 따로 여는 시트)
   벽걸이 달력(음력·절기·공휴일·손 없는 날·물때) + 상상을 현실로의 가계부 계산
   (남은 돈 기준 맞추기 · 주 단위 지출 예상 · 택배 며칠마다)
   자료는 내 계정 서버에 저장: calday(하루) · calmon(이달 포스트잇·예산) · set/cal(설정)
   Made by 정동철 · 상상을 현실로
   ===================================================================== */
(function () {
  "use strict";
  var DATA = {"months":[["2025-10-21",9,0,2025],["2025-11-20",10,0,2025],["2025-12-20",11,0,2025],["2026-01-19",12,0,2025],["2026-02-17",1,0,2026],["2026-03-19",2,0,2026],["2026-04-17",3,0,2026],["2026-05-17",4,0,2026],["2026-06-15",5,0,2026],["2026-07-14",6,0,2026],["2026-08-13",7,0,2026],["2026-09-11",8,0,2026],["2026-10-11",9,0,2026],["2026-11-09",10,0,2026],["2026-12-09",11,0,2026],["2027-01-08",12,0,2026],["2027-02-07",1,0,2027],["2027-03-08",2,0,2027],["2027-04-07",3,0,2027],["2027-05-06",4,0,2027],["2027-06-05",5,0,2027],["2027-07-04",6,0,2027],["2027-08-02",7,0,2027],["2027-09-01",8,0,2027],["2027-09-30",9,0,2027],["2027-10-29",10,0,2027],["2027-11-28",11,0,2027],["2027-12-28",12,0,2027],["2028-01-27",1,0,2028],["2028-02-25",2,0,2028],["2028-03-26",3,0,2028],["2028-04-25",4,0,2028],["2028-05-24",5,0,2028],["2028-06-23",5,1,2028],["2028-07-22",6,0,2028],["2028-08-20",7,0,2028],["2028-09-19",8,0,2028],["2028-10-18",9,0,2028],["2028-11-16",10,0,2028]],"terms":[["2025-12-07","대설"],["2025-12-22","동지"],["2026-01-05","소한"],["2026-01-20","대한"],["2026-02-04","입춘"],["2026-02-19","우수"],["2026-03-05","경칩"],["2026-03-20","춘분"],["2026-04-05","청명"],["2026-04-20","곡우"],["2026-05-05","입하"],["2026-05-21","소만"],["2026-06-06","망종"],["2026-06-21","하지"],["2026-07-07","소서"],["2026-07-23","대서"],["2026-08-07","입추"],["2026-08-23","처서"],["2026-09-07","백로"],["2026-09-23","추분"],["2026-10-08","한로"],["2026-10-23","상강"],["2026-11-07","입동"],["2026-11-22","소설"],["2026-12-07","대설"],["2026-12-22","동지"],["2027-01-05","소한"],["2027-01-20","대한"],["2027-02-04","입춘"],["2027-02-19","우수"],["2027-03-06","경칩"],["2027-03-21","춘분"],["2027-04-05","청명"],["2027-04-20","곡우"],["2027-05-06","입하"],["2027-05-21","소만"],["2027-06-06","망종"],["2027-06-21","하지"],["2027-07-07","소서"],["2027-07-23","대서"],["2027-08-08","입추"],["2027-08-23","처서"],["2027-09-08","백로"],["2027-09-23","추분"],["2027-10-08","한로"],["2027-10-24","상강"],["2027-11-08","입동"],["2027-11-22","소설"],["2027-12-07","대설"],["2027-12-22","동지"],["2028-01-06","소한"],["2028-01-20","대한"],["2028-02-04","입춘"],["2028-02-19","우수"],["2028-03-05","경칩"],["2028-03-20","춘분"],["2028-04-04","청명"],["2028-04-19","곡우"],["2028-05-05","입하"],["2028-05-20","소만"],["2028-06-05","망종"],["2028-06-21","하지"],["2028-07-06","소서"],["2028-07-22","대서"],["2028-08-07","입추"],["2028-08-22","처서"],["2028-09-07","백로"],["2028-09-22","추분"],["2028-10-08","한로"],["2028-10-23","상강"],["2028-11-07","입동"],["2028-11-22","소설"],["2028-12-06","대설"],["2028-12-21","동지"]],"holidays":[["2026-01-01","신정"],["2026-02-16","설날 연휴"],["2026-02-17","설날"],["2026-02-18","설날 연휴"],["2026-03-01","삼일절"],["2026-03-02","대체공휴일(삼일절)"],["2026-05-01","노동절"],["2026-05-05","어린이날"],["2026-05-24","부처님오신날"],["2026-05-25","대체공휴일(부처님오신날)"],["2026-06-03","지방선거"],["2026-06-06","현충일"],["2026-07-17","제헌절"],["2026-08-15","광복절"],["2026-08-17","대체공휴일(광복절)"],["2026-09-24","추석 연휴"],["2026-09-25","추석"],["2026-09-26","추석 연휴"],["2026-10-03","개천절"],["2026-10-05","대체공휴일(개천절)"],["2026-10-09","한글날"],["2026-12-25","성탄절"],["2027-01-01","신정"],["2027-02-06","설날 연휴"],["2027-02-07","설날"],["2027-02-08","설날 연휴"],["2027-02-09","대체공휴일(설날)"],["2027-03-01","삼일절"],["2027-05-01","노동절"],["2027-05-03","대체공휴일(노동절)"],["2027-05-05","어린이날"],["2027-05-13","부처님오신날"],["2027-06-06","현충일"],["2027-07-17","제헌절"],["2027-07-19","대체공휴일(제헌절)"],["2027-08-15","광복절"],["2027-08-16","대체공휴일(광복절)"],["2027-09-14","추석 연휴"],["2027-09-15","추석"],["2027-09-16","추석 연휴"],["2027-10-03","개천절"],["2027-10-04","대체공휴일(개천절)"],["2027-10-09","한글날"],["2027-10-11","대체공휴일(한글날)"],["2027-12-25","성탄절"],["2027-12-27","대체공휴일(성탄절)"],["2028-01-01","신정"],["2028-01-26","설날 연휴"],["2028-01-27","설날"],["2028-01-28","설날 연휴"],["2028-03-01","삼일절"],["2028-04-12","국회의원선거"],["2028-05-01","노동절"],["2028-05-02","부처님오신날"],["2028-05-05","어린이날"],["2028-06-06","현충일"],["2028-07-17","제헌절"],["2028-08-15","광복절"],["2028-10-02","추석 연휴"],["2028-10-03","개천절 · 추석"],["2028-10-04","추석 연휴"],["2028-10-05","대체공휴일(개천절)"],["2028-10-06","대체공휴일(추석)"],["2028-10-09","한글날"],["2028-12-25","성탄절"]]};
  var STEM = "甲乙丙丁戊己庚辛壬癸", STEMK = "갑을병정무기경신임계", BR = "子丑寅卯辰巳午未申酉戌亥", BRK = "자축인묘진사오미신유술해";
  var ANI = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"], COL = ["푸른", "푸른", "붉은", "붉은", "황금", "황금", "흰", "흰", "검은", "검은"];
  var ENG = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
  var WD = ["일", "월", "화", "수", "목", "금", "토"];
  var HWHY = { "신정": ["공휴일", "새해 첫날"], "설날": ["명절", "음력 1월 1일. 앞뒤 하루씩 3일을 쉬어요"], "설날 연휴": ["명절", "설날 앞뒤로 쉬는 날"],
    "삼일절": ["국경일", "1919년 3·1 독립운동을 기리는 날"], "노동절": ["공휴일", "일하는 사람들의 날. 2026년부터 공휴일"], "어린이날": ["공휴일", "어린이를 위한 날"],
    "부처님오신날": ["공휴일", "음력 4월 8일"], "지방선거": ["선거일", "전국동시지방선거 투표일"], "국회의원선거": ["선거일", "국회의원선거 투표일"],
    "현충일": ["기념일·공휴일", "나라를 위해 목숨 바친 분들을 기리는 날 (대체공휴일 없음)"], "제헌절": ["국경일", "1948년 헌법 공포를 기념하는 날. 2026년부터 다시 공휴일"],
    "광복절": ["국경일", "1945년 해방을 기념하는 날"], "추석": ["명절", "음력 8월 15일 한가위. 앞뒤 하루씩 3일을 쉬어요"], "추석 연휴": ["명절", "추석 앞뒤로 쉬는 날"],
    "개천절": ["국경일", "단군이 처음 나라를 세운 날"], "한글날": ["국경일", "세종대왕이 한글을 펴낸 것을 기념하는 날"], "성탄절": ["공휴일", "기독탄신일"] };
  var TWHY = { "입춘": "봄이 시작되는 날", "우수": "눈이 녹아 비가 되는 때", "경칩": "개구리가 깨어나는 때", "춘분": "낮과 밤의 길이가 같은 날", "청명": "하늘이 맑아지고 농사 준비",
    "곡우": "봄비가 곡식을 기르는 때", "입하": "여름이 시작되는 날", "소만": "만물이 자라 가득 차는 때", "망종": "보리 베고 모내기하는 때", "하지": "낮이 가장 긴 날",
    "소서": "더위가 시작되는 때", "대서": "더위가 가장 심한 때", "입추": "가을이 시작되는 날", "처서": "더위가 물러가는 때", "백로": "이슬이 맺히기 시작하는 때",
    "추분": "낮과 밤의 길이가 같은 날", "한로": "찬 이슬이 맺히는 때", "상강": "서리가 내리기 시작하는 때", "입동": "겨울이 시작되는 날", "소설": "첫눈이 내리기 시작하는 때",
    "대설": "눈이 많이 내리는 때", "동지": "밤이 가장 긴 날, 팥죽 먹는 날", "소한": "작은 추위, 실제로는 가장 추운 때", "대한": "큰 추위, 겨울의 마지막 절기" };
  var SEQ = { w: ["7물", "8물", "9물", "10물", "11물", "12물", "13물", "조금", "무시", "1물", "2물", "3물", "4물", "5물", "6물"],
              s: ["8물", "9물", "10물", "11물", "12물", "13물", "조금", "무시", "1물", "2물", "3물", "4물", "5물", "6물", "7물"] };
  var OUT_CATS = [["식비", "🍚", "#ff8a65"], ["교통·주유", "🚗", "#4fc3f7"], ["사무실", "🏢", "#7986cb"], ["광고·홍보", "📣", "#f06292"], ["생활용품", "🧴", "#81c784"],
    ["택배·쇼핑", "📦", "#ba68c8"], ["경조사", "💐", "#ffb74d"], ["세금·공과금", "🧾", "#90a4ae"], ["의료", "💊", "#e57373"], ["기타", "✨", "#bdbdbd"]];
  var IN_CATS = [["중개수수료", "🏠", "#16a37f"], ["임대료", "🔑", "#26a69a"], ["급여", "💰", "#66bb6a"], ["기타", "✨", "#9ccc65"]];
  var EVC = ["lav", "pink", "mint", "blue"];
  var MOODS = [["😄", "최고"], ["🙂", "좋음"], ["😐", "보통"], ["😮‍💨", "지침"], ["😢", "슬픔"]];
  var MIN = { y: 2026, m: 0 }, MAX = { y: 2028, m: 11 };

  /* ---------- 날짜 · 음력 ---------- */
  var dn = function (y, m, d) { return Math.floor(Date.UTC(y, m, d) / 864e5); };
  var iso2dn = function (s) { var p = s.split("-"); return dn(+p[0], p[1] - 1, +p[2]); };
  var dn2iso = function (n) { return new Date(n * 864e5).toISOString().slice(0, 10); };
  var MS = DATA.months.map(function (r) { return { d: iso2dn(r[0]), m: r[1], leap: !!r[2], y: r[3] }; });
  var TERMS = {}, HOLS = {};
  DATA.terms.forEach(function (r) { TERMS[iso2dn(r[0])] = r[1]; });
  DATA.holidays.forEach(function (r) { HOLS[iso2dn(r[0])] = r[1]; });
  function lunar(n) { var lo = 0, hi = MS.length - 1; while (lo < hi) { var mid = (lo + hi + 1) >> 1; if (MS[mid].d <= n) lo = mid; else hi = mid - 1; } var s = MS[lo]; return { y: s.y, m: s.m, leap: s.leap, d: n - s.d + 1 }; }
  function gz(i) { return { h: STEM[i % 10] + BR[i % 12], k: STEMK[i % 10] + BRK[i % 12] }; }
  var yearGz = function (y) { return ((y - 4) % 60 + 60) % 60; };
  var dayGz = function (n) { return ((n + 2440588 + 49) % 60 + 60) % 60; };
  var sonn = function (l) { return l.d % 10 === 9 || l.d % 10 === 0; };
  var lstr = function (l) { return (l.leap ? "윤" : "") + l.m + "월 " + l.d + "일"; };
  function tide(l, sea) { var k = (l.d - 1) % 15, name = SEQ[sea][k], s = 0.5 + 0.5 * Math.cos(2 * Math.PI * (k + (sea === "w" ? -0.5 : 0.5)) / 15);
    return { name: name, s: s, big: s > 0.85, label: name === "조금" || name === "무시" ? "물 약함" : s > 0.85 ? "사리 · 물 셈" : s > 0.55 ? "물 보통 이상" : "물 약한 편" }; }
  var now = new Date(), TODAY = dn(now.getFullYear(), now.getMonth(), now.getDate());
  function clampYM(c) { var v = c.y * 12 + c.m, a = MIN.y * 12 + MIN.m, b = MAX.y * 12 + MAX.m, w = Math.min(b, Math.max(a, v)); return { y: Math.floor(w / 12), m: w % 12 }; }
  function weekStart(n) { var dow = (new Date(n * 864e5).getUTCDay() + 6) % 7; return n - dow; }   // 월요일
  function md(n) { var d = new Date(n * 864e5); return (d.getUTCMonth() + 1) + "/" + d.getUTCDate(); }
  function dayTitle(n) { var d = new Date(n * 864e5); return (d.getUTCMonth() + 1) + "월 " + d.getUTCDate() + "일(" + WD[d.getUTCDay()] + ")"; }
  function e(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function won(n) { return (n < 0 ? "-" : "") + Math.abs(Math.round(n || 0)).toLocaleString("ko-KR") + "원"; }
  function num(v) { var s = String(v || "").replace(/[,\s원]/g, ""), m, t = 0;
    if (/^\d+$/.test(s)) return +s;
    if ((m = /(\d+(?:\.\d+)?)억/.exec(s))) t += parseFloat(m[1]) * 1e8;
    if ((m = /(\d+(?:\.\d+)?)천만/.exec(s))) t += parseFloat(m[1]) * 1e7; else if ((m = /(\d+(?:\.\d+)?)만/.exec(s))) t += parseFloat(m[1]) * 1e4;
    if ((m = /만\s*(\d+)천$/.exec(s)) || (m = /^(\d+)천$/.exec(s))) t += parseFloat(m[1]) * 1e3;
    return Math.round(t) || +s.replace(/\D/g, "") || 0; }
  function uid(p) { return (p || "x") + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
  var $ = function (id) { return document.getElementById(id); };
  function say(t) { if (window.toast) window.toast(t); }

  /* ---------- 자료 (서버) ---------- */
  var C = { days: {}, mons: {}, cfg: { tide: false, sea: "w", balances: [] }, loaded: false };
  var V = { cur: clampYM({ y: now.getFullYear(), m: now.getMonth() }), sel: TODAY, tab: "mark", io: "out", cat: "식비", evc: "lav", fresh: null, balEdit: false };
  if (TODAY < dn(MIN.y, MIN.m, 1) || TODAY > dn(MAX.y, MAX.m, 31)) V.sel = dn(V.cur.y, V.cur.m, 1);
  function load() {
    return Promise.all([BALPUM.DB.list("calday"), BALPUM.DB.list("calmon"), BALPUM.DB.setting("cal", null)]).then(function (a) {
      C.days = {}; a[0].forEach(function (r) { C.days[r.id] = r.data || {}; });
      C.mons = {}; a[1].forEach(function (r) { C.mons[r.id] = r.data || {}; });
      var cf = a[2] || {}; C.cfg = { tide: !!cf.tide, sea: cf.sea === "s" ? "s" : "w", balances: Array.isArray(cf.balances) ? cf.balances : [] };
      C.loaded = true;
    });
  }
  var T = {}, pending = 0;
  function mark(t) { var el = $("calSaved"); if (el) el.textContent = t; }
  function later(key, fn) { clearTimeout(T[key]); pending++; mark("저장 중…"); T[key] = setTimeout(function () { fn().then(function () { pending--; if (!pending) mark("저장됨 · 핸드폰·PC 같이 보여요"); }, function (er) { pending--; mark("저장 못 함 — " + ((er && er.message) || "인터넷 확인")); }); }, 700); }
  function D(n) { var r = C.days[dn2iso(n)] || {}; r.ev = r.ev || []; r.todo = r.todo || []; r.book = r.book || []; r.parcel = r.parcel || []; return r; }
  function emptyDay(r) { return !r.star && !r.circle && !r.memo && !r.postit && !(r.ev || []).length && !(r.todo || []).length && !r.line && !r.mood && !(r.book || []).length && !(r.parcel || []).length; }
  function putDay(n, r) {
    var k = dn2iso(n);
    if (emptyDay(r)) delete C.days[k]; else C.days[k] = r;
    later("d" + k, function () { return C.days[k] ? BALPUM.DB.upsert("calday", k, C.days[k]) : BALPUM.DB.del("calday", k); });
  }
  function ymk() { return V.cur.y + "-" + (V.cur.m < 9 ? "0" : "") + (V.cur.m + 1); }
  function M() { var r = C.mons[ymk()] || {}; r.notes = r.notes || []; return r; }
  function putMon(r) { var k = ymk(); if (!r.notes.length && !r.budget) delete C.mons[k]; else C.mons[k] = r;
    later("m" + k, function () { return C.mons[k] ? BALPUM.DB.upsert("calmon", k, C.mons[k]) : BALPUM.DB.del("calmon", k); }); }
  function putCfg() { later("cfg", function () { return BALPUM.DB.saveSetting("cal", C.cfg); }); }

  /* ---------- 가계부 계산 (상상을 현실로와 같은 방식) ---------- */
  function each(fn) { Object.keys(C.days).forEach(function (k) { var n = iso2dn(k); (C.days[k].book || []).forEach(function (b) { fn(b, n); }); }); }
  function sumRange(a, b) { var o = 0, i = 0, c = 0; each(function (x, n) { if (n >= a && n <= b) { c++; if (x.t === "in") i += x.a; else o += x.a; } }); return { out: o, "in": i, n: c }; }
  function anchors() { return (C.cfg.balances || []).slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; }); }
  function netBetween(a, b) { var t = sumRange(a + 1, b); return t["in"] - t.out; }      // a < 날 <= b
  function balanceAt(n) {
    var A = anchors(), before = null, i;
    for (i = 0; i < A.length; i++) if (iso2dn(A[i].date) <= n) before = A[i];
    if (before) return before.amount + netBetween(iso2dn(before.date), n);
    if (A.length) return A[0].amount - netBetween(n, iso2dn(A[0].date));
    return netBetween(-1e7, n);
  }
  function balanceHow(n) {
    var A = anchors(), on = A.filter(function (x) { return iso2dn(x.date) === n; })[0], before = A.filter(function (x) { return iso2dn(x.date) < n; }).pop();
    if (on) return "이날 실제 금액으로 맞춘 값";
    if (before) return dayTitle(iso2dn(before.date)) + "에 맞춘 " + won(before.amount) + " + 그 뒤 수입 − 지출";
    if (A.length) return dayTitle(iso2dn(A[0].date)) + "에 맞춘 금액에서 거꾸로 계산";
    return "처음 기록부터 수입 − 지출 (실제와 다르면 ✎ 맞추기)";
  }
  function forecast() {
    var ws = weekStart(TODAY), weeks = [], first = null;
    each(function (x, n) { if (first === null || n < first) first = n; });
    for (var k = 4; k >= 1; k--) { var a = ws - 7 * k, b = a + 6; if (first !== null && b >= first) weeks.push(sumRange(a, b).out); }
    var avg = weeks.length ? Math.round(weeks.reduce(function (s, v) { return s + v; }, 0) / weeks.length) : null;
    var y = now.getFullYear(), m = now.getMonth(), dim = new Date(y, m + 1, 0).getDate(), d = now.getDate(), m1 = dn(y, m, 1);
    var soFar = sumRange(m1, TODAY).out, thisWeek = sumRange(ws, TODAY).out;
    var proj = avg != null ? Math.round(soFar + avg / 7 * (dim - d)) : (d >= 7 && soFar ? Math.round(soFar / d * dim) : null);
    var lm1 = dn(y, m - 1, 1), lmDim = new Date(y, m, 0).getDate(), lmSame = sumRange(lm1, lm1 + Math.min(d, lmDim) - 1), lmAll = sumRange(lm1, m1 - 1);
    return { avg: avg, wn: weeks.length, proj: proj, soFar: soFar, thisWeek: thisWeek, lmSame: lmSame.n ? lmSame.out : null, lmAll: lmAll.n ? lmAll.out : null, left: dim - d };
  }
  function pkey(s) { return String(s || "").replace(/\s+/g, "").toLowerCase(); }
  function parcelStats() {
    var g = {};
    Object.keys(C.days).forEach(function (k) { (C.days[k].parcel || []).forEach(function (p) { var key = pkey(p.item); if (!key) return; (g[key] = g[key] || { name: p.item, list: [] }).list.push({ n: iso2dn(k), shop: p.shop, a: p.a || 0 }); }); });
    return Object.keys(g).map(function (k) {
      var L = g[k].list.sort(function (a, b) { return a.n - b.n; }), gaps = [];
      for (var i = 1; i < L.length; i++) gaps.push(L[i].n - L[i - 1].n);
      var gap = gaps.length ? Math.round(gaps.reduce(function (s, v) { return s + v; }, 0) / gaps.length) : 0, last = L[L.length - 1].n;
      var shops = {}; L.forEach(function (x) { if (x.shop) shops[x.shop] = (shops[x.shop] || 0) + 1; });
      return { name: g[k].name, count: L.length, last: last, gap: gap, next: gap ? last + gap : null, left: gap ? last + gap - TODAY : null,
        shop: Object.keys(shops).sort(function (a, b) { return shops[b] - shops[a]; })[0] || "", spent: L.reduce(function (s, x) { return s + x.a; }, 0) };
    }).sort(function (a, b) { return (a.left == null ? 1e9 : a.left) - (b.left == null ? 1e9 : b.left) || b.count - a.count; });
  }

  /* ---------- 모양 ---------- */
  var CSS = '<style id="calCss">' +
    '#cal{--paper:#fdfdfb;--ink:#1b1c1f;--muted:#6b6f78;--faint:#c9cbd0;--line:#e6e7ea;--red:#d3241c;--blue:#1f4fa6;--green:#1d7a4b;--sonn:#b45309;--sonn-bg:#fff2e3;--navy:#1E2A78;--sel:#f3f4f7;--pencol:#2338a0;--sea:#0f7f8c;--post:#ffe880;--post-ink:#3b3410;--star:#e3a008;--lav:#7b61ff;--pink:#e0457b;--mint:#16a37f;--inc:#0f8a63;--outc:#d6336c;' +
    'font-family:"Noto Sans KR",sans-serif;color:var(--ink)}' +
    '#cal .paper{background:var(--paper);border-radius:6px;box-shadow:0 1px 0 rgba(0,0,0,.04),0 18px 40px -18px rgba(30,35,60,.35);position:relative;overflow:hidden;isolation:isolate}' +
    '#cal .hook{width:14px;height:14px;border-radius:50%;background:var(--faint);margin:0 auto -4px;position:relative;z-index:2}' +
    '#cal .rings{display:flex;justify-content:space-between;padding:12px 22px 0}#cal .rings i{width:9px;height:9px;border-radius:50%;background:#e8eaee;box-shadow:inset 0 1px 2px rgba(0,0,0,.35);position:relative}' +
    '#cal .rings i:before{content:"";position:absolute;left:3px;bottom:4px;width:3px;height:16px;border-radius:2px;background:linear-gradient(var(--faint),var(--muted))}' +
    '#cal #sheet{position:relative;z-index:2;background:var(--paper)}' +
    '#cal .cmhead{display:grid;grid-template-columns:auto minmax(0,1fr) 92px;align-items:end;gap:12px;padding:16px 16px 6px 20px}' +
    '#cal .mnum{font-family:"Nanum Myeongjo",serif;font-weight:800;font-size:clamp(78px,24vw,104px);line-height:.8;letter-spacing:-.04em}' +
    '#cal .mmeta{min-width:0;display:grid;gap:3px;padding-bottom:4px}#cal .eng{font-size:10.5px;letter-spacing:.3em;color:var(--muted)}' +
    '#cal .yr{font-family:"Nanum Myeongjo",serif;font-weight:800;font-size:21px}#cal .yr small{color:var(--red);font-size:14px;margin-left:6px}#cal .animal{font-size:12px}#cal .lr{font-size:11.5px;color:var(--muted)}' +
    '#cal .stick{position:relative;height:104px;align-self:stretch}' +
    '#cal .cmini{position:absolute;width:68px;height:62px;background:var(--post);color:var(--post-ink);border:0;border-radius:2px;padding:6px;text-align:left;font-family:"Nanum Pen Script",cursive;font-size:14px;line-height:1;overflow:hidden;cursor:pointer;box-shadow:0 7px 12px -8px rgba(0,0,0,.55);word-break:break-all}' +
    '#cal .cmini:before{content:"";position:absolute;top:-3px;left:50%;width:26px;height:9px;transform:translateX(-50%) rotate(-3deg);background:rgba(255,255,255,.55)}' +
    '#cal .addpost{position:absolute;right:0;bottom:0;width:80px;height:72px;border:1.5px dashed var(--faint);border-radius:3px;background:transparent;color:var(--muted);font:500 11.5px/1.3 "Noto Sans KR",sans-serif;cursor:pointer;padding:4px}' +
    '#cal .addpost.small{width:30px;height:30px;border-radius:50%;font-size:16px;bottom:-6px;right:-6px;background:var(--paper);z-index:5}' +
    '#cal .nav{display:flex;justify-content:space-between;gap:8px;padding:10px 12px 8px}' +
    '#cal .nav button,#cal .tg{font:500 13px "Noto Sans KR",sans-serif;color:var(--ink);background:transparent;border:1px solid var(--line);border-radius:999px;padding:7px 12px;cursor:pointer}' +
    '#cal .nav .today{border-color:var(--ink);font-weight:700}#cal .nav button:disabled{opacity:.35}' +
    '#cal .ctools{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 10px;align-items:center}' +
    '#cal .tg[aria-pressed="true"]{background:var(--ink);color:#fff;border-color:var(--ink)}#cal .tg.sea[aria-pressed="true"]{background:var(--sea);border-color:var(--sea)}' +
    '#cal .grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));border-top:2px solid var(--ink);margin:0 8px}' +
    '#cal .wd{text-align:center;font-size:11px;font-weight:700;padding:6px 0;border-bottom:1px solid var(--line)}#cal .wd.sun{color:var(--red)}#cal .wd.sat{color:var(--blue)}' +
    '#cal .cell{position:relative;min-height:74px;padding:4px 2px;border:0;border-bottom:1px solid var(--line);background:transparent;display:flex;flex-direction:column;align-items:center;gap:1px;cursor:pointer;font:inherit;color:inherit}' +
    '#cal .cell.selected{background:var(--sel)}#cal .cell.out{opacity:.28}' +
    '#cal .dw{position:relative;display:grid;place-items:center}' +
    '#cal .dn{font-family:"Nanum Myeongjo",serif;font-weight:800;font-size:23px;width:34px;height:34px;display:grid;place-items:center;border-radius:50%;line-height:1}' +
    '#cal .cell.sun .dn,#cal .cell.hol .dn{color:var(--red)}#cal .cell.sat:not(.hol) .dn{color:var(--blue)}#cal .cell.today .dn{background:var(--ink);color:var(--paper)!important}' +
    '#cal .cln{font-size:10px;color:var(--muted);line-height:1.15}#cal .cln b{color:var(--ink)}' +
    '#cal .sonn{display:inline-block;font-size:9px;font-weight:700;color:var(--sonn);background:var(--sonn-bg);border-radius:4px;padding:0 3px;margin-left:2px}' +
    '#cal .moon{display:inline-block;width:6px;height:6px;border-radius:50%;margin-right:2px;vertical-align:1px}#cal .moon.full{border:1.5px solid var(--muted)}#cal .moon.new{background:var(--muted)}' +
    '#cal .tag{font-size:9.5px;font-weight:700;line-height:1.15;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#cal .tag.h{color:var(--red)}#cal .tag.t{color:var(--green)}' +
    '#cal .tide{font-size:9.5px;font-weight:700;color:var(--sea)}#cal .tide.cbig{text-decoration:underline}' +
    '#cal .memo{font-family:"Nanum Pen Script",cursive;font-size:14px;line-height:.95;color:var(--pencol);max-width:100%;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;word-break:break-all}' +
    '#cal .spend{font-size:9.5px;font-weight:700;color:var(--outc)}' +
    '#cal .dots{display:flex;gap:2px;justify-content:center}#cal .dots i{width:5px;height:5px;border-radius:50%}' +
    '#cal .mk{position:absolute;left:50%;top:50%;width:48px;height:42px;transform:translate(-50%,-50%) rotate(-6deg);pointer-events:none;overflow:visible}' +
    '#cal .star{position:absolute;top:-9px;right:-10px;width:34px;height:34px;transform:rotate(8deg);pointer-events:none;overflow:visible;z-index:2}' +
    '#cal .mk path,#cal .star path{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:2.8;opacity:.88}' +
    '#cal .draw path{stroke-dasharray:100;stroke-dashoffset:100;animation:calInk .55s ease-out forwards}@keyframes calInk{to{stroke-dashoffset:0}}' +
    '#cal .pi{position:absolute;top:0;left:0;border-top:14px solid var(--post);border-right:14px solid transparent}' +
    '#cal .legend{display:flex;flex-wrap:wrap;gap:4px 12px;padding:10px 16px 4px;font-size:11px;color:var(--muted)}' +
    '#cal .panel{margin:10px 10px 0;border:1px solid var(--line);border-radius:12px;padding:12px 14px;display:grid;gap:8px}' +
    '#cal .cttl{font-family:"Nanum Myeongjo",serif;font-weight:800;font-size:18px}#cal .cwhy{font-size:12.5px;color:var(--muted);line-height:1.55}#cal .cwhy b{color:var(--ink)}' +
    '#cal .cchips{display:flex;flex-wrap:wrap;gap:6px}#cal .chip2{font-size:12px;font-weight:700;padding:3px 9px;border-radius:999px;border:1px solid currentColor}' +
    '#cal .ctools .tb{font:700 13px "Noto Sans KR",sans-serif;border:1.5px solid var(--line);background:#fff;color:var(--ink);border-radius:999px;padding:7px 12px;cursor:pointer}#cal .ctools .tb.d{border-color:var(--lav)}#cal .ctools .tb.b{border-color:var(--pink)}#cal .ctools .tb.p{border-color:#b08a5a}' +
    '#cal .csh{position:fixed;inset:0;z-index:8000;background:rgba(10,12,20,.42);display:flex;align-items:flex-end;justify-content:center}#cal .csh[hidden]{display:none}' +
    '#cal .cshb{background:var(--paper);width:100%;max-width:640px;max-height:90vh;overflow:auto;border-radius:20px 20px 0 0;padding:10px 14px calc(env(safe-area-inset-bottom,0px) + 18px);box-sizing:border-box;display:grid;gap:8px;animation:cshUp .22s ease-out}@keyframes cshUp{from{transform:translateY(40px);opacity:.4}to{transform:none;opacity:1}}' +
    '#cal .cshh{position:sticky;top:-10px;background:var(--paper);display:flex;align-items:center;gap:6px;padding:6px 0 8px;border-bottom:1px solid var(--line);z-index:2}#cal .cshh h3{flex:1;margin:0;font:800 17px "Noto Sans KR",sans-serif}#cal .cshh small{display:block;font-size:12px;font-weight:500;color:var(--muted)}' +
    '#cal .cshh button{border:1px solid var(--line);background:#fff;border-radius:10px;min-width:38px;height:36px;font:700 15px "Noto Sans KR",sans-serif;cursor:pointer;color:var(--ink)}#cal .cshh .x{background:var(--ink);color:#fff;border-color:var(--ink);padding:0 12px}' +
    '#cal .cshb .cbox{margin:4px 0 0}' +
    '#cal .tabs2{display:flex;gap:4px;background:var(--sel);border-radius:12px;padding:3px}#cal .tabs2 button{flex:1;border:0;background:transparent;border-radius:10px;padding:8px 2px;font:600 13px "Noto Sans KR",sans-serif;color:var(--muted);cursor:pointer}' +
    '#cal .tabs2 button[aria-pressed="true"]{background:#fff;color:var(--ink);box-shadow:0 1px 3px rgba(0,0,0,.12)}' +
    '#cal .crow{display:flex;flex-wrap:wrap;gap:6px;align-items:center}#cal .sub2{font-size:12px;font-weight:700;color:var(--muted)}' +
    '#cal .eb{font:500 12.5px "Noto Sans KR",sans-serif;border:1px solid var(--line);background:#fff;color:var(--ink);border-radius:8px;padding:6px 10px;cursor:pointer;display:inline-flex;align-items:center;gap:5px}' +
    '#cal .eb[aria-pressed="true"]{border-color:var(--ink);font-weight:700;background:var(--sel)}#cal .sw{width:14px;height:14px;border-radius:50%;display:inline-block}' +
    '#cal .ta{width:100%;box-sizing:border-box;font:16px "Noto Sans KR",sans-serif;border:1px solid var(--line);border-radius:8px;padding:8px 10px;resize:vertical}' +
    '#cal .ta.pen{font-family:"Nanum Pen Script",cursive;font-size:21px;color:var(--pencol);line-height:1.1}#cal .ta.post{background:var(--post);color:var(--post-ink);border-color:transparent;font-family:"Nanum Pen Script",cursive;font-size:21px;min-height:76px}' +
    '#cal .in{font:16px "Noto Sans KR",sans-serif;border:1px solid var(--line);border-radius:10px;padding:8px 10px;min-width:0;box-sizing:border-box}#cal .cgrow{flex:1 1 140px}' +
    '#cal .pb{font:700 14px "Noto Sans KR",sans-serif;border:0;border-radius:10px;padding:9px 14px;color:#fff;background:var(--navy);cursor:pointer}#cal .pb.pk{background:var(--pink)}#cal .pb.lv{background:var(--lav)}' +
    '#cal .li{display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center;padding:7px 0;border-bottom:1px solid var(--line);font-size:14px}#cal .li:last-child{border-bottom:0}' +
    '#cal .li small{display:block;color:var(--muted);font-size:12px}#cal .li .cx{border:0;background:transparent;color:var(--muted);font-size:18px;cursor:pointer;padding:2px 6px}' +
    '#cal .li.done span.ctx{text-decoration:line-through;color:var(--muted)}#cal .cbar{width:4px;align-self:stretch;border-radius:2px;min-height:26px}' +
    '#cal .moods{display:flex;gap:6px;flex-wrap:wrap}#cal .mood{font-size:21px;border:1px solid var(--line);background:#fff;border-radius:12px;padding:3px 8px;cursor:pointer;line-height:1.1}#cal .mood small{display:block;font-size:10px;color:var(--muted)}#cal .mood[aria-pressed="true"]{border-color:var(--lav);background:#f1eeff}' +
    '#cal .io{display:inline-flex;border-radius:999px;background:var(--line);padding:3px}#cal .io button{font:700 13px "Noto Sans KR",sans-serif;border:0;border-radius:999px;padding:6px 14px;background:transparent;color:var(--muted);cursor:pointer}' +
    '#cal .io button[aria-pressed="true"].o{background:var(--outc);color:#fff}#cal .io button[aria-pressed="true"].i{background:var(--inc);color:#fff}' +
    '#cal .ccat{font:500 13px "Noto Sans KR",sans-serif;border:1px solid var(--line);background:#fff;color:var(--ink);border-radius:999px;padding:5px 10px;cursor:pointer}#cal .ccat[aria-pressed="true"]{background:var(--ink);color:#fff;border-color:var(--ink)}' +
    '#cal .amt{font:800 20px "Nanum Myeongjo",serif;text-align:right}' +
    '#cal .tot{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}#cal .tot div{background:var(--sel);border-radius:10px;padding:8px 10px;display:grid;gap:1px}#cal .tot small{font-size:11.5px;color:var(--muted)}#cal .tot b{font-variant-numeric:tabular-nums}' +
    '#cal .tot .bal{grid-column:1/-1;background:#EEF2FF}#cal .inc{color:var(--inc)}#cal .outc{color:var(--outc)}' +
    '#cal .sum{margin:12px 10px 0;display:grid;gap:10px}#cal .cbox{border:1px solid var(--line);border-radius:12px;padding:12px 14px;display:grid;gap:8px;background:#fff}' +
    '#cal .cbox h3{margin:0;font-size:15px;display:flex;justify-content:space-between;align-items:baseline;gap:8px}#cal .cbox h3 small{font-size:12px;color:var(--muted);font-weight:500}' +
    '#cal .cbig{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}#cal .cbig div{background:var(--sel);border-radius:10px;padding:8px 10px;display:grid}#cal .cbig span{font-size:11.5px;color:var(--muted)}#cal .cbig b{font-size:16px;font-variant-numeric:tabular-nums}' +
    '#cal .bars{display:grid;gap:6px}#cal .brow{display:grid;grid-template-columns:88px 1fr 84px;gap:8px;align-items:center;font-size:12.5px}#cal .brow .tr{height:10px;border-radius:5px;background:var(--line);overflow:hidden}#cal .brow .tr i{display:block;height:100%;border-radius:5px}#cal .brow span:last-child{text-align:right;font-variant-numeric:tabular-nums}' +
    '#cal .ctiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}#cal .ctile{background:var(--sel);border-radius:10px;padding:8px 10px;display:grid;gap:1px}#cal .ctile.hot{background:#FFF7ED}#cal .ctile span{font-size:11.5px;color:var(--muted)}#cal .ctile b{font-size:15px}#cal .ctile small{font-size:11px;color:var(--muted)}' +
    '#cal .wk{display:grid;grid-template-columns:86px 1fr auto;gap:8px;align-items:center;font-size:12.5px}#cal .wk.now{font-weight:700}#cal .wk .tr{height:9px;border-radius:5px;background:var(--line);overflow:hidden}#cal .wk .tr i{display:block;height:100%;background:var(--outc)}' +
    '#cal .ptab{width:100%;border-collapse:collapse;font-size:12.5px}#cal .ptab th,#cal .ptab td{padding:6px 4px;border-bottom:1px solid var(--line);text-align:left}#cal .ptab th{color:var(--muted);font-weight:600}#cal .late{color:var(--red)}#cal .soon{color:var(--sonn)}' +
    '#cal .mlist{display:flex;flex-wrap:wrap;gap:6px}#cal .md{font:500 12.5px "Noto Sans KR",sans-serif;background:#fff;border-radius:6px;padding:4px 8px;border:1px solid var(--line);cursor:pointer}#cal .md.we{border-color:var(--sonn);font-weight:700}' +
    '#cal .ad{margin-top:14px;background:var(--navy);color:#fff;padding:12px 16px 14px;text-align:center;display:grid;gap:2px}#cal .ad .by{font-size:10.5px;letter-spacing:.2em;opacity:.75}#cal .ad .shop{font-family:"Nanum Myeongjo",serif;font-weight:800;font-size:20px}#cal .ad .tel{font-family:"Nanum Myeongjo",serif;font-weight:800;font-size:17px;letter-spacing:.05em}' +
    '#cal .saved{font-size:11.5px;color:var(--muted);text-align:center;margin:8px 0}' +
    '#cal .tear{position:absolute;left:0;right:0;z-index:30;background:var(--paper);pointer-events:none;transform-origin:92% 0;clip-path:polygon(0 6px,4% 0,8% 7px,12% 1px,16% 6px,20% 0,24% 8px,28% 2px,32% 7px,36% 0,40% 6px,44% 1px,48% 8px,52% 0,56% 6px,60% 2px,64% 7px,68% 0,72% 8px,76% 1px,80% 6px,84% 0,88% 7px,92% 2px,96% 8px,100% 0,100% 100%,0 100%);box-shadow:0 10px 30px rgba(0,0,0,.25);animation:calRip .75s cubic-bezier(.45,.05,.6,1) forwards}' +
    '@keyframes calRip{0%{transform:none}18%{transform:rotate(1.5deg) translateY(4px)}100%{transform:rotate(-16deg) translate(-40px,105%);opacity:0}}' +
    '#cal .under{position:absolute;left:0;right:0;z-index:1;pointer-events:none}' +
    '#cal .stickin{clip-path:polygon(0 6px,4% 0,8% 7px,12% 1px,16% 6px,20% 0,24% 8px,28% 2px,32% 7px,36% 0,40% 6px,44% 1px,48% 8px,52% 0,56% 6px,60% 2px,64% 7px,68% 0,72% 8px,76% 1px,80% 6px,84% 0,88% 7px,92% 2px,96% 8px,100% 0,100% 100%,0 100%);transform-origin:92% 0;animation:calStick .7s cubic-bezier(.22,.9,.3,1) forwards}' +
    '@keyframes calStick{0%{transform:rotate(-16deg) translate(-40px,105%);opacity:0}55%{opacity:1}72%{transform:rotate(1.2deg) translateY(-4px)}86%{transform:rotate(-.4deg) translateY(1px)}100%{transform:none;opacity:1}}' +
    '@media (prefers-reduced-motion:reduce){#cal .tear,#cal .stickin,#cal .draw path{animation:none!important;clip-path:none}#cal .tear{display:none}#cal .draw path{stroke-dashoffset:0}}' +
    '#calDlg{position:fixed;inset:0;background:rgba(10,12,20,.45);display:grid;place-items:center;z-index:9000;padding:16px}' +
    '#calDlg .cbig2{width:min(320px,100%);background:#ffe880;color:#3b3410;padding:18px 16px 12px;border-radius:3px;transform:rotate(-1.2deg);box-shadow:0 20px 40px -16px rgba(0,0,0,.6);display:grid;gap:10px}' +
    '#calDlg textarea{width:100%;height:170px;border:0;background:transparent;color:inherit;font-family:"Nanum Pen Script",cursive;font-size:24px;line-height:1.15;resize:none;outline:none}' +
    '#calDlg .r{display:flex;justify-content:space-between}#calDlg .r button{font:600 13px "Noto Sans KR",sans-serif;border:1px solid rgba(0,0,0,.25);background:rgba(255,255,255,.35);color:inherit;border-radius:8px;padding:7px 14px;cursor:pointer}' +
    '</style>';
  var CIRC = '<svg class="mk__D__" viewBox="0 0 52 44" aria-hidden="true"><path pathLength="100" style="stroke:__C__" d="M9 23 C6 9 38 2 45 17 C50 31 20 42 9 31 C4 25 10 11 28 8"/></svg>';
  var STAR = '<svg class="star__D__" viewBox="0 0 50 50" aria-hidden="true"><path pathLength="100" style="stroke:__C__" d="M24 5 Q30 24 38 44 Q21 31 5 20 Q25 18.5 45 17 Q28 30 12 45 Q18 25 27 3"/></svg>';
  var COLV = { red: "var(--red)", blue: "var(--blue)", green: "var(--green)", black: "var(--ink)" };

  /* ---------- 화면 ---------- */
  window.addEventListener("popstate", function () { if (V.sheet || document.body.style.overflow === "hidden") { V.sheet = ""; document.body.style.overflow = ""; } });
  window.showCal = function (fromHist) {
    V.sheet = ""; document.body.style.overflow = "";
    if (!fromHist && typeof nav === "function") nav("cal");
    window.scrollTo(0, 0);
    $("app").innerHTML = (document.getElementById("calCss") ? "" : CSS) + '<div class="top"><button class="back" id="calBk">← 처음</button><h2>달력 · 약속 다이어리 · 가계부</h2></div><div id="cal"><div class="loading">달력 펴는 중…</div></div>';
    $("calBk").onclick = function () { showHome(); };
    load().then(shell, function (er) { $("cal").innerHTML = '<div class="hint">' + e((er && er.message) || "불러오지 못했어요") + '</div>'; shell(); });
  };
  function shell() {
    var o = (typeof OFFICE_INFO !== "undefined" && OFFICE_INFO) || {};
    $("cal").innerHTML = '<div class="hook"></div><div class="paper" id="calPaper"><div class="rings">' + new Array(13).join("<i></i>") + '</div>' +
      '<div id="sheet"><header class="cmhead"><div class="mnum" id="cMn"></div><div class="mmeta"><div class="eng" id="cEn"></div><div class="yr"><span id="cYr"></span><small id="cGz"></small></div><div class="animal" id="cAn"></div><div class="lr" id="cLr"></div></div><div class="stick" id="cStick"></div></header>' +
      '<div class="nav"><button type="button" id="cPrev"></button><button type="button" class="today" id="cToday">오늘</button><button type="button" id="cNext"></button></div>' +
      '<div class="ctools"><button type="button" class="tg sea" id="cTide">물때 보기</button><span id="cSea"></span>' +
      '<button type="button" class="tb d" data-sh="diary">📒 약속 다이어리</button><button type="button" class="tb b" data-sh="book">💰 가계부</button><button type="button" class="tb p" data-sh="parcel">📦 택배</button></div>' +
      '<div class="grid" id="cGrid"></div>' +
      '<div class="legend"><span><b style="color:var(--red)">빨강</b> 일요일·공휴일</span><span><b style="color:var(--green)">초록</b> 24절기</span><span><span class="sonn">손</span> 손 없는 날</span><span>○ 보름 · ● 초하루</span><span>까만 동그라미 = 오늘</span></div>' +
      '<section class="panel" id="cPanel"></section><div class="sum" id="cSum"></div></div>' +
      '<footer class="ad"><div class="by">발품투어 매물장이 드리는 달력</div><div class="shop">' + e(o.name || "발품투어 매물장") + '</div>' + (o.tel || o.mobile ? '<div class="tel">' + e(o.tel || o.mobile) + '</div>' : '') + '</footer></div>' +
      '<div class="saved" id="calSaved">자료는 내 계정에 저장돼요 · 핸드폰·PC 같이 보여요</div>' +
      '<div class="csh" id="cSh" hidden><div class="cshb" role="dialog" aria-modal="true" aria-labelledby="cShT"><div class="cshh"><button type="button" id="cShP" aria-label="전날">‹</button><h3 id="cShT"></h3><button type="button" id="cShN" aria-label="다음 날">›</button><button type="button" class="x" id="cShX">닫기</button></div><div id="cSB"></div></div></div>';
    V.sheet = "";
    Array.prototype.forEach.call(document.querySelectorAll("#cal [data-sh]"), function (b) { b.onclick = function () { openSheet(b.getAttribute("data-sh")); }; });
    $("cShX").onclick = closeSheet;
    $("cSh").onclick = function (ev) { if (ev.target === this) closeSheet(); };
    $("cShP").onclick = function () { stepDay(-1); };
    $("cShN").onclick = function () { stepDay(1); };
    $("cPrev").onclick = function () { go(-1); };
    $("cNext").onclick = function () { go(1); };
    $("cToday").onclick = function () { var t = clampYM({ y: now.getFullYear(), m: now.getMonth() }), d = (t.y * 12 + t.m) - (V.cur.y * 12 + V.cur.m); if (!d) { V.sel = TODAY; render(); return; } go(d, true); };
    $("cTide").onclick = function () { C.cfg.tide = !C.cfg.tide; putCfg(); render(); };
    var sx = null, sy = null, g = $("cGrid");
    g.addEventListener("touchstart", function (ev) { sx = ev.touches[0].clientX; sy = ev.touches[0].clientY; }, { passive: true });
    g.addEventListener("touchend", function (ev) { if (sx === null) return; var dx = ev.changedTouches[0].clientX - sx, dy = ev.changedTouches[0].clientY - sy; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1); sx = null; }, { passive: true });
    render();
  }
  function render() { head(); grid(); panel(); sums(); }
  function head() {
    var y = V.cur.y, m = V.cur.m, first = dn(y, m, 1), days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate(), g = yearGz(y), G = gz(g);
    $("cMn").textContent = m + 1; $("cEn").textContent = ENG[m]; $("cYr").textContent = y; $("cGz").textContent = G.h + "年";
    $("cAn").textContent = G.k + "년 · " + COL[g % 10] + " " + ANI[g % 12] + "띠";
    $("cLr").textContent = "음력 " + lstr(lunar(first)) + " ~ " + lstr(lunar(first + days - 1));
    $("cPrev").textContent = "‹ " + (((m + 11) % 12) + 1) + "월"; $("cNext").textContent = (((m + 1) % 12) + 1) + "월 ›";
    $("cPrev").disabled = y * 12 + m <= MIN.y * 12 + MIN.m; $("cNext").disabled = y * 12 + m >= MAX.y * 12 + MAX.m;
    $("cTide").setAttribute("aria-pressed", C.cfg.tide ? "true" : "false"); $("cTide").textContent = C.cfg.tide ? "물때 보는 중" : "물때 보기";
    $("cSea").innerHTML = C.cfg.tide ? '<button type="button" class="tg" data-sea="w" aria-pressed="' + (C.cfg.sea === "w") + '">서해</button> <button type="button" class="tg" data-sea="s" aria-pressed="' + (C.cfg.sea === "s") + '">남해</button>' : "";
    Array.prototype.forEach.call(document.querySelectorAll("#cSea [data-sea]"), function (b) { b.onclick = function () { C.cfg.sea = b.getAttribute("data-sea"); putCfg(); render(); }; });
    board();
  }
  function grid() {
    var y = V.cur.y, m = V.cur.m, first = dn(y, m, 1), days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate(), startW = new Date(Date.UTC(y, m, 1)).getUTCDay();
    var g = $("cGrid"), h = WD.map(function (w, i) { return '<div class="wd' + (i === 0 ? " sun" : i === 6 ? " sat" : "") + '">' + w + '</div>'; }).join("");
    var total = Math.ceil((startW + days) / 7) * 7;
    for (var i = 0; i < total; i++) {
      var n = first - startW + i, d = new Date(n * 864e5), dd = d.getUTCDate(), w = d.getUTCDay(), out = d.getUTCMonth() !== m;
      var l = lunar(n), hol = HOLS[n], term = TERMS[n], r = C.days[dn2iso(n)] || {};
      var dr = function (k) { return V.fresh && V.fresh.n === n && V.fresh.k === k ? " draw" : ""; };
      var c = '<span class="dw"><span class="dn">' + dd + '</span>' + (r.circle ? CIRC.replace("__D__", dr("c")).replace("__C__", COLV[r.circle] || COLV.red) : "") + '</span>';
      c += '<span class="cln">' + (l.d === 15 ? '<span class="moon full"></span>' : l.d === 1 ? '<span class="moon new"></span>' : "") + (l.d === 1 ? "<b>" + (l.leap ? "윤" : "") + l.m + ".1</b>" : l.d) + (sonn(l) ? '<span class="sonn">손</span>' : "") + '</span>';
      if (hol) c += '<span class="tag h">' + e(hol.indexOf("대체") === 0 ? "대체휴일" : hol.split(" · ")[0]) + '</span>'; else if (term) c += '<span class="tag t">' + term + '</span>';
      if (C.cfg.tide) { var t = tide(l, C.cfg.sea); c += '<span class="tide' + (t.big ? " cbig" : "") + '">' + t.name + '</span>'; }
      if ((r.ev || []).length) c += '<span class="dots">' + r.ev.slice(0, 3).map(function (x) { return '<i style="background:var(--' + (x.c || "lav") + ')"></i>'; }).join("") + '</span>';
      var sp = (r.book || []).filter(function (x) { return x.t === "out"; }).reduce(function (s, x) { return s + x.a; }, 0);
      if (sp && !out) c += '<span class="spend">−' + (sp >= 10000 ? (Math.round(sp / 1000) / 10) + "만" : sp.toLocaleString("ko-KR")) + '</span>';
      if (r.memo) c += '<span class="memo">' + e(r.memo) + '</span>';
      if (r.star) c += STAR.replace("__D__", dr("s")).replace("__C__", COLV[r.starc] || COLV.red);
      if (r.postit) c += '<span class="pi"></span>';
      h += '<button type="button" class="cell' + (w === 0 ? " sun" : "") + (w === 6 ? " sat" : "") + (hol ? " hol" : "") + (out ? " out" : "") + (n === TODAY ? " today" : "") + (n === V.sel ? " selected" : "") +
        '" data-n="' + n + '" aria-label="' + e((d.getUTCMonth() + 1) + "월 " + dd + "일 " + WD[w] + "요일, 음력 " + lstr(l) + (hol ? ", " + hol : "") + (term ? ", " + term : "") + (sonn(l) ? ", 손 없는 날" : "")) + '">' + c + '</button>';
    }
    g.innerHTML = h;
    V.fresh = null;
    Array.prototype.forEach.call(g.querySelectorAll(".cell"), function (b) { b.onclick = function () {
      var n = +b.getAttribute("data-n"), d = new Date(n * 864e5);
      V.sel = n; V.balEdit = false;
      if (d.getUTCMonth() !== V.cur.m) { var t = clampYM({ y: d.getUTCFullYear(), m: d.getUTCMonth() }); var k = (t.y * 12 + t.m) - (V.cur.y * 12 + V.cur.m); if (k) { go(k, true); return; } }
      grid(); panel();
    }; });
  }

  /* ---------- 이달 포스트잇 (큰 달 숫자 옆) ---------- */
  function board() {
    var mr = M(), list = mr.notes, box = $("cStick"); if (!box) return;
    var show = list.slice(-3), offs = [[24, -2, -7], [0, 12, 6], [14, 40, -2]], h = "";
    show.forEach(function (t, j) { var i = list.length - show.length + j, o = offs[j];
      h += '<button type="button" class="cmini" data-i="' + i + '" style="right:' + o[0] + 'px;top:' + o[1] + 'px;transform:rotate(' + o[2] + 'deg);z-index:' + (j + 1) + '">' + e(t || "(빈 쪽지)") + '</button>'; });
    h += '<button type="button" class="addpost' + (list.length ? " small" : "") + '" id="cAddPost" aria-label="포스트잇 붙이기">' + (list.length ? "+" : "여기에 포스트잇 붙이기") + '</button>';
    box.innerHTML = h;
    Array.prototype.forEach.call(box.querySelectorAll(".cmini"), function (b) { b.onclick = function () { postDlg(+b.getAttribute("data-i")); }; });
    $("cAddPost").onclick = function () { postDlg(-1); };
  }
  function postDlg(i) {
    var mr = M(), d = document.createElement("div"); d.id = "calDlg";
    d.innerHTML = '<div class="cbig2"><textarea id="cDT" maxlength="120" placeholder="이달에 챙길 일 (예: 12월 재계약 3건)"></textarea><div class="r"><button type="button" id="cDD">' + (i >= 0 ? "떼기" : "취소") + '</button><button type="button" id="cDO">붙이기</button></div></div>';
    document.body.appendChild(d);
    var ta = $("cDT"); ta.value = i >= 0 ? (mr.notes[i] || "") : ""; setTimeout(function () { ta.focus(); }, 30);
    var close = function () { d.remove(); };
    d.onclick = function (ev) { if (ev.target === d) close(); };
    $("cDO").onclick = function () { var v = ta.value.trim(); if (i >= 0) { if (v) mr.notes[i] = v; else mr.notes.splice(i, 1); } else if (v) mr.notes.push(v); putMon(mr); board(); close(); };
    $("cDD").onclick = function () { if (i >= 0) { mr.notes.splice(i, 1); putMon(mr); board(); } close(); };
  }

  /* ---------- 아래 칸: 표시·메모 / 다이어리 / 가계부 / 택배 ---------- */
  function info() {
    var d = new Date(V.sel * 864e5), l = lunar(V.sel), hol = HOLS[V.sel], term = TERMS[V.sel], G = gz(dayGz(V.sel)), diff = V.sel - TODAY;
    var rel = diff === 0 ? "오늘" : diff > 0 ? "오늘부터 " + diff + "일 뒤" : Math.abs(diff) + "일 전";
    var h = '<div class="cttl">' + d.getUTCFullYear() + "년 " + (d.getUTCMonth() + 1) + "월 " + d.getUTCDate() + "일 " + WD[d.getUTCDay()] + '요일</div>' +
      '<div style="font-size:13px">음력 ' + l.y + "년 " + lstr(l) + ' <span style="color:var(--muted)">· 일진 ' + G.k + "일(" + G.h + ") · " + rel + '</span></div>';
    var ch = [];
    if (hol) ch.push('<span class="chip2" style="color:var(--red)">쉬는 날 · ' + e(hol) + '</span>');
    if (term) ch.push('<span class="chip2" style="color:var(--green)">절기 · ' + term + '</span>');
    if (sonn(l)) ch.push('<span class="chip2" style="color:var(--sonn)">손 없는 날 · 이삿날로 좋아요</span>');
    if (ch.length) h += '<div class="cchips">' + ch.join("") + '</div>';
    var why = [];
    if (hol) hol.split(" · ").forEach(function (x) {
      if (x.indexOf("대체공휴일") === 0) why.push("<b>대체공휴일</b> — " + e(x.slice(6, -1)) + "이(가) 주말이나 다른 공휴일과 겹쳐서 대신 쉬는 날");
      else if (HWHY[x]) why.push("<b>" + e(x) + "</b> (" + HWHY[x][0] + ") — " + HWHY[x][1]); });
    if (term) why.push("<b>" + term + "</b> (24절기 · 쉬는 날 아님) — " + TWHY[term]);
    if (why.length) h += '<div class="cwhy">' + why.join("<br>") + '</div>';
    if (C.cfg.tide) { var t = tide(l, C.cfg.sea); h += '<div class="cwhy">물때 · ' + (C.cfg.sea === "w" ? "서해" : "남해") + " <b>" + t.name + "</b> " + t.label + ' (만조·간조 시각은 다음 업데이트에서)</div>'; }
    return h;
  }
  function panel() {
    $("cPanel").innerHTML = info() + '<div class="sub2" style="margin-top:2px">✏️ 이날 표시 · 메모</div>' + markHTML() + dayPeek();
    markBind();
    Array.prototype.forEach.call(document.querySelectorAll("#cPanel [data-sh]"), function (b) { b.onclick = function () { openSheet(b.getAttribute("data-sh")); }; });
    if (V.sheet) sheet();
  }
  // 이날 적힌 것 한 줄 요약 (누르면 그 시트가 열림)
  function dayPeek() {
    var r = D(V.sel), out = 0, inc = 0; r.book.forEach(function (x) { if (x.t === "in") inc += x.a; else out += x.a; });
    var a = [];
    if (r.ev.length || r.todo.length || r.line) a.push('<button type="button" class="eb" data-sh="diary">📒 약속 ' + r.ev.length + (r.todo.length ? " · 할 일 " + r.todo.length : "") + '</button>');
    if (out || inc) a.push('<button type="button" class="eb" data-sh="book">💰 ' + (out ? "−" + won(out) : "") + (inc ? " +" + won(inc) : "") + '</button>');
    if (r.parcel.length) a.push('<button type="button" class="eb" data-sh="parcel">📦 택배 ' + r.parcel.length + '</button>');
    return a.length ? '<div class="crow">' + a.join("") + '</div>' : '';
  }
  /* ---------- 시트: 약속 다이어리 · 가계부 · 택배 (물때 옆 단추로 따로 열기) ---------- */
  var SHT = { diary: "📒 약속 다이어리", book: "💰 가계부", parcel: "📦 택배" };
  function openSheet(k) { V.sheet = k; V.balEdit = false; $("cSh").hidden = false; document.body.style.overflow = "hidden"; sheet(); $("cSh").querySelector(".cshb").scrollTop = 0; }
  function closeSheet() { V.sheet = ""; var s = $("cSh"); if (s) s.hidden = true; document.body.style.overflow = ""; }
  function stepDay(k) {
    var n = V.sel + k, d = new Date(n * 864e5); V.sel = n; V.balEdit = false;
    if (d.getUTCMonth() !== V.cur.m || d.getUTCFullYear() !== V.cur.y) { var t = clampYM({ y: d.getUTCFullYear(), m: d.getUTCMonth() }), j = (t.y * 12 + t.m) - (V.cur.y * 12 + V.cur.m); if (j) { V.cur = t; render(); return; } }
    grid(); panel();
  }
  function sheet() {
    var k = V.sheet, B = $("cSB"); if (!k || !B) return;
    var d = new Date(V.sel * 864e5);
    $("cShT").innerHTML = SHT[k] + '<small>' + (d.getUTCMonth() + 1) + "월 " + d.getUTCDate() + "일 " + WD[d.getUTCDay()] + "요일" + (V.sel === TODAY ? " · 오늘" : "") + '</small>';
    B.innerHTML = k === "diary" ? diaryHTML() : k === "book" ? bookHTML() + ledgerHTML() : parcelHTML() + parcelBoxHTML();
    (k === "diary" ? diaryBind : k === "book" ? bookBind : parcelBind)();
  }
  function markHTML() {
    var r = D(V.sel), sw = function (c, l) { return '<button type="button" class="eb" data-c="' + c + '" aria-pressed="' + ((r.circle || "") === c) + '" aria-label="' + l + '">' + (c ? '<span class="sw" style="background:' + COLV[c] + '"></span>' : "없음") + '</button>'; };
    return '<div class="crow"><button type="button" class="eb" id="cStar" aria-pressed="' + !!r.star + '"><svg width="16" height="16" viewBox="0 0 50 50" aria-hidden="true"><path d="M24 5 Q30 24 38 44 Q21 31 5 20 Q25 18.5 45 17 Q28 30 12 45 Q18 25 27 3" style="fill:none;stroke:var(--red);stroke-width:4;stroke-linecap:round;stroke-linejoin:round"/></svg> 매직 별표</button>' +
      '<span class="sub2">동그라미</span>' + sw("red", "빨간") + sw("blue", "파란") + sw("green", "초록") + sw("black", "검정") + sw("", "없음") + '</div>' +
      '<label class="sub2" for="cMemo">깨알 메모 · 칸 안에 손글씨로 보여요</label><textarea class="ta pen" id="cMemo" rows="1" maxlength="30" placeholder="예) 302호 잔금 2시">' + e(r.memo || "") + '</textarea>' +
      '<label class="sub2" for="cPost">포스트잇 · 길게 적어 두기</label><textarea class="ta post" id="cPost" rows="3" placeholder="예) 김사장님 전세 만기 — 2주 전에 연장할지 전화">' + e(r.postit || "") + '</textarea>';
  }
  function markBind() {
    $("cStar").onclick = function () { var r = D(V.sel); r.star = !r.star; r.starc = r.star ? (r.circle && r.circle !== "black" ? r.circle : "red") : null; V.fresh = r.star ? { n: V.sel, k: "s" } : null; putDay(V.sel, r); grid(); panel(); };
    Array.prototype.forEach.call(document.querySelectorAll("#cPanel [data-c]"), function (b) { b.onclick = function () { var r = D(V.sel), c = b.getAttribute("data-c") || null; r.circle = c; V.fresh = c ? { n: V.sel, k: "c" } : null; putDay(V.sel, r); grid(); panel(); }; });
    $("cMemo").oninput = function () { var r = D(V.sel); r.memo = this.value; putDay(V.sel, r); grid(); };
    $("cPost").oninput = function () { var r = D(V.sel); r.postit = this.value; putDay(V.sel, r); grid(); };
  }
  function diaryHTML() {
    var r = D(V.sel), evs = r.ev.map(function (x, i) { var y = Object.assign({}, x); y.i = i; return y; }).sort(function (a, b) { return (a.t || "99").localeCompare(b.t || "99"); });
    var h = '<div class="sub2">일정 · 약속 ' + (evs.length ? evs.length + "개" : "") + '</div><div>' + (evs.length ? evs.map(function (x) {
      return '<div class="li' + (x.d ? " done" : "") + '"><span style="display:flex;gap:8px;align-items:center"><span class="cbar" style="background:var(--' + (x.c || "lav") + ')"></span><input type="checkbox" data-evd="' + x.i + '"' + (x.d ? " checked" : "") + ' aria-label="마침"></span>' +
        '<span class="ctx"><b>' + e(x.t || "하루 종일") + '</b> ' + e(x.x) + (x.p ? "<small>" + e(x.p) + "</small>" : "") + '</span><button type="button" class="cx" data-evx="' + x.i + '" aria-label="지우기">×</button></div>'; }).join("") : '<div class="cwhy">이날 약속이 없어요. 아래에 적어 보세요.</div>') + '</div>' +
      '<div class="crow"><input class="in" type="time" id="cEvT" aria-label="시각"><input class="in cgrow" id="cEvX" placeholder="약속 (예: 검암역 302호 계약)" aria-label="약속"></div>' +
      '<div class="crow"><input class="in cgrow" id="cEvP" placeholder="장소 (안 적어도 돼요)" aria-label="장소">' + EVC.map(function (c) { return '<button type="button" class="eb" data-evc="' + c + '" aria-pressed="' + (V.evc === c) + '" aria-label="색"><span class="sw" style="background:var(--' + c + ')"></span></button>'; }).join("") + '<button type="button" class="pb lv" id="cEvA">추가</button></div>';
    h += '<div class="sub2" style="margin-top:6px">할 일 ' + (r.todo.length ? r.todo.filter(function (t) { return t.d; }).length + " / " + r.todo.length : "") + '</div><div>' + r.todo.map(function (t, i) {
      return '<div class="li' + (t.d ? " done" : "") + '"><input type="checkbox" data-tdd="' + i + '"' + (t.d ? " checked" : "") + ' aria-label="마침"><span class="ctx">' + e(t.x) + '</span><button type="button" class="cx" data-tdx="' + i + '" aria-label="지우기">×</button></div>'; }).join("") + '</div>' +
      '<div class="crow"><input class="in cgrow" id="cTdX" placeholder="할 일을 적고 [추가]" aria-label="할 일"><button type="button" class="pb lv" id="cTdA">추가</button></div>';
    h += '<div class="sub2" style="margin-top:6px">오늘 한 줄 · 기분</div><div class="moods">' + MOODS.map(function (m) { return '<button type="button" class="mood" data-mood="' + m[0] + '" aria-pressed="' + (r.mood === m[0]) + '">' + m[0] + '<small>' + m[1] + '</small></button>'; }).join("") + '</div>' +
      '<textarea class="ta pen" id="cLine" rows="2" placeholder="오늘 있었던 일을 한 줄로">' + e(r.line || "") + '</textarea>';
    return h;
  }
  function diaryBind() {
    var q = function (s) { return document.querySelectorAll("#cSB " + s); };
    Array.prototype.forEach.call(q("[data-evd]"), function (b) { b.onchange = function () { var r = D(V.sel); r.ev[+b.getAttribute("data-evd")].d = b.checked; putDay(V.sel, r); panel(); }; });
    Array.prototype.forEach.call(q("[data-evx]"), function (b) { b.onclick = function () { var r = D(V.sel); r.ev.splice(+b.getAttribute("data-evx"), 1); putDay(V.sel, r); grid(); panel(); }; });
    Array.prototype.forEach.call(q("[data-evc]"), function (b) { b.onclick = function () { V.evc = b.getAttribute("data-evc"); Array.prototype.forEach.call(q("[data-evc]"), function (x) { x.setAttribute("aria-pressed", x === b); }); }; });
    $("cEvA").onclick = function () { var x = $("cEvX").value.trim(); if (!x) { $("cEvX").focus(); say("약속 내용을 적어 주세요."); return; }
      var r = D(V.sel); r.ev.push({ id: uid("e"), t: $("cEvT").value || "", x: x, p: $("cEvP").value.trim(), c: V.evc, d: false }); putDay(V.sel, r); grid(); panel(); say(dayTitle(V.sel) + " 일정을 넣었어요."); };
    $("cEvX").onkeydown = function (ev) { if (ev.key === "Enter") $("cEvA").click(); };
    Array.prototype.forEach.call(q("[data-tdd]"), function (b) { b.onchange = function () { var r = D(V.sel); r.todo[+b.getAttribute("data-tdd")].d = b.checked; putDay(V.sel, r); panel(); }; });
    Array.prototype.forEach.call(q("[data-tdx]"), function (b) { b.onclick = function () { var r = D(V.sel); r.todo.splice(+b.getAttribute("data-tdx"), 1); putDay(V.sel, r); panel(); }; });
    $("cTdA").onclick = function () { var x = $("cTdX").value.trim(); if (!x) return; var r = D(V.sel); r.todo.push({ x: x, d: false }); putDay(V.sel, r); panel(); };
    $("cTdX").onkeydown = function (ev) { if (ev.key === "Enter") $("cTdA").click(); };
    Array.prototype.forEach.call(q("[data-mood]"), function (b) { b.onclick = function () { var r = D(V.sel), m = b.getAttribute("data-mood"); r.mood = r.mood === m ? "" : m; putDay(V.sel, r); panel(); }; });
    $("cLine").oninput = function () { var r = D(V.sel); r.line = this.value; putDay(V.sel, r); };
  }
  function catOf(x) { return (x.t === "in" ? IN_CATS : OUT_CATS).filter(function (c) { return c[0] === x.c; })[0] || ["기타", "✨", "#bdbdbd"]; }
  function bookHTML() {
    var r = D(V.sel), list = V.io === "in" ? IN_CATS : OUT_CATS;
    if (!list.some(function (c) { return c[0] === V.cat; })) V.cat = list[0][0];
    var tIn = 0, tOut = 0; r.book.forEach(function (x) { if (x.t === "in") tIn += x.a; else tOut += x.a; });
    var bal = balanceAt(V.sel), pb = balanceAt(V.sel - 1);
    var h = '<div>' + (r.book.length ? r.book.map(function (x, i) { var c = catOf(x);
      return '<div class="li"><span style="width:32px;height:32px;border-radius:10px;display:grid;place-items:center;background:' + c[2] + '33">' + c[1] + '</span><span class="ctx">' + e(x.c) + (x.m ? "<small>" + e(x.m) + "</small>" : "") + '</span>' +
        '<span style="display:flex;align-items:center;gap:4px"><b class="' + (x.t === "in" ? "inc" : "outc") + '">' + (x.t === "in" ? "+" : "−") + won(x.a) + '</b><button type="button" class="cx" data-bx="' + i + '" aria-label="지우기">×</button></span></div>'; }).join("") : '<div class="cwhy">이날 쓴 돈·들어온 돈이 없어요.</div>') + '</div>';
    h += '<div class="tot"><div><small>어제까지 남은 돈</small><b>' + won(pb) + '</b></div><div><small>＋ 이날 수입 / － 지출</small><b><span class="inc">' + won(tIn) + '</span> / <span class="outc">' + won(tOut) + '</span></b></div>' +
      '<div class="bal"><small>💳 남은 돈 (이날 끝에 가진 돈) · ' + e(balanceHow(V.sel)) + '</small><b' + (bal < 0 ? ' class="outc"' : '') + '>' + won(bal) + '</b><button type="button" class="eb" id="cBal" style="justify-self:start;margin-top:4px">✎ 실제 금액으로 맞추기</button></div></div>';
    if (V.balEdit) h += '<div class="crow"><input class="in cgrow" id="cBalIn" inputmode="numeric" placeholder="이날 끝에 실제로 가진 돈 (예: 350만)" value="' + bal + '"><button type="button" class="pb" id="cBalOk">맞추기</button>' +
      (anchors().some(function (x) { return iso2dn(x.date) === V.sel; }) ? '<button type="button" class="eb" id="cBalOff">이날 맞춘 값 지우기</button>' : '') + '<div class="cwhy" style="flex-basis:100%">이 금액이 기준이 되고, 다음 날부터 수입·지출로 이어서 계산돼요.</div></div>';
    h += '<div class="sub2" style="margin-top:6px">' + dayTitle(V.sel) + '에 적기</div>' +
      '<div class="crow"><span class="io"><button type="button" class="o" data-io="out" aria-pressed="' + (V.io === "out") + '">지출</button><button type="button" class="i" data-io="in" aria-pressed="' + (V.io === "in") + '">수입</button></span>' +
      '<input class="in amt cgrow" id="cAmt" inputmode="numeric" placeholder="0원" aria-label="금액"></div>' +
      '<div class="crow">' + (V.io === "in" ? IN_CATS : OUT_CATS).map(function (c) { return '<button type="button" class="ccat" data-cat="' + c[0] + '" aria-pressed="' + (V.cat === c[0]) + '">' + c[1] + " " + c[0] + '</button>'; }).join("") + '</div>' +
      '<div class="crow"><input class="in cgrow" id="cBm" placeholder="메모 (예: 점심, 강화 현장)" aria-label="메모"><button type="button" class="pb pk" id="cBA">적기</button></div>';
    return h;
  }
  function bookBind() {
    var q = function (s) { return document.querySelectorAll("#cSB " + s); };
    Array.prototype.forEach.call(q("[data-bx]"), function (b) { b.onclick = function () { var r = D(V.sel), x = r.book[+b.getAttribute("data-bx")];
      if (x && x.pid) r.parcel = r.parcel.filter(function (p) { return p.id !== x.pid; });
      r.book.splice(+b.getAttribute("data-bx"), 1); putDay(V.sel, r); grid(); panel(); sums(); }; });
    Array.prototype.forEach.call(q("[data-io]"), function (b) { b.onclick = function () { V.io = b.getAttribute("data-io"); V.cat = (V.io === "in" ? IN_CATS : OUT_CATS)[0][0]; panel(); }; });
    Array.prototype.forEach.call(q("[data-cat]"), function (b) { b.onclick = function () { V.cat = b.getAttribute("data-cat"); Array.prototype.forEach.call(q("[data-cat]"), function (x) { x.setAttribute("aria-pressed", x === b); }); }; });
    $("cAmt").oninput = function () { var n = +String(this.value).replace(/\D/g, ""); this.value = n ? n.toLocaleString("ko-KR") : ""; };
    $("cBA").onclick = function () { var a = num($("cAmt").value); if (!(a > 0)) { $("cAmt").focus(); say("금액을 숫자로 적어 주세요. (예: 12000)"); return; }
      var r = D(V.sel); r.book.push({ id: uid("b"), t: V.io, a: a, c: V.cat, m: $("cBm").value.trim() }); putDay(V.sel, r); grid(); panel(); sums(); say((V.io === "in" ? "수입 " : "지출 ") + won(a) + "을 적었어요."); };
    $("cBal").onclick = function () { V.balEdit = !V.balEdit; panel(); };
    if ($("cBalOk")) $("cBalOk").onclick = function () { var v = String($("cBalIn").value).trim(), neg = /^-/.test(v), a = num(v.replace(/^-/, "")) * (neg ? -1 : 1), k = dn2iso(V.sel);
      C.cfg.balances = (C.cfg.balances || []).filter(function (x) { return x.date !== k; }); C.cfg.balances.push({ date: k, amount: a }); putCfg(); V.balEdit = false; panel(); sums(); say("남은 돈을 " + won(a) + "으로 맞췄어요."); };
    if ($("cBalOff")) $("cBalOff").onclick = function () { var k = dn2iso(V.sel); C.cfg.balances = (C.cfg.balances || []).filter(function (x) { return x.date !== k; }); putCfg(); V.balEdit = false; panel(); sums(); };
  }
  function parcelHTML() {
    var r = D(V.sel), st = parcelStats(), seen = {};
    var h = '<div>' + (r.parcel.length ? r.parcel.map(function (p, i) { var s = st.filter(function (x) { return pkey(x.name) === pkey(p.item); })[0];
      return '<div class="li"><span>📦</span><span class="ctx">' + e(p.item) + (p.shop ? " · " + e(p.shop) : "") + (s && s.count > 1 ? "<small>" + s.count + "번째" + (s.gap ? " · 평균 " + s.gap + "일마다" : "") + "</small>" : "") + '</span>' +
        '<span style="display:flex;align-items:center;gap:4px">' + (p.a ? "<b>" + won(p.a) + "</b>" : "") + '<button type="button" class="cx" data-px="' + i + '" aria-label="지우기">×</button></span></div>'; }).join("") : '<div class="cwhy">이날 온 택배가 없어요.</div>') + '</div>' +
      '<div class="crow"><input class="in cgrow" id="cPi" list="cPiL" placeholder="물건 (예: 휴지 30롤, 복사용지)" aria-label="물건"><input class="in" id="cPs" list="cPsL" placeholder="어디서 (예: 쿠팡)" style="width:130px" aria-label="어디서"></div>' +
      '<div class="crow"><input class="in cgrow" id="cPa" inputmode="numeric" placeholder="금액 (안 적어도 돼요)" aria-label="금액"><button type="button" class="pb" id="cPA">넣기</button></div>' +
      '<div class="cwhy">금액을 적으면 가계부 지출(택배·쇼핑)에도 같이 들어가요. 같은 물건이 두 번 이상 오면 며칠마다 필요한지 아래에 나와요.</div>' +
      '<datalist id="cPiL">' + st.map(function (x) { return '<option value="' + e(x.name) + '">'; }).join("") + '</datalist><datalist id="cPsL">' +
      ["쿠팡", "네이버", "11번가", "G마켓", "다이소"].concat(st.map(function (x) { return x.shop; })).filter(function (x) { if (!x || seen[x]) return false; seen[x] = 1; return true; }).map(function (x) { return '<option value="' + e(x) + '">'; }).join("") + '</datalist>';
    return h;
  }
  function parcelBind() {
    Array.prototype.forEach.call(document.querySelectorAll("#cSB [data-px]"), function (b) { b.onclick = function () { var r = D(V.sel), p = r.parcel[+b.getAttribute("data-px")];
      r.parcel.splice(+b.getAttribute("data-px"), 1); if (p) r.book = r.book.filter(function (x) { return x.pid !== p.id; }); putDay(V.sel, r); grid(); panel(); sums(); }; });
    $("cPa").oninput = function () { var n = +String(this.value).replace(/\D/g, ""); this.value = n ? n.toLocaleString("ko-KR") : ""; };
    $("cPA").onclick = function () { var it = $("cPi").value.trim(), a = num($("cPa").value); if (!it) { $("cPi").focus(); say("어떤 물건이 왔는지 적어 주세요."); return; }
      var r = D(V.sel), id = uid("p"); r.parcel.push({ id: id, item: it, shop: $("cPs").value.trim(), a: a > 0 ? a : 0 });
      if (a > 0) r.book.push({ id: uid("b"), t: "out", a: a, c: "택배·쇼핑", m: it, pid: id });
      putDay(V.sel, r); grid(); panel(); sums(); say("📦 " + it + " 택배를 적었어요." + (a > 0 ? " 가계부에도 " + won(a) + " 넣었어요." : "")); };
  }

  /* ---------- 아래: 이달 가계부 · 주 단위 예상 · 택배 · 손 없는 날 ---------- */
  function ledgerHTML() {
    var y = V.cur.y, m = V.cur.m, first = dn(y, m, 1), days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate(), last = first + days - 1;
    var t = sumRange(first, last), cats = {};
    each(function (x, n) { if (x.t === "out" && n >= first && n <= last) cats[x.c] = (cats[x.c] || 0) + x.a; });
    var arr = Object.keys(cats).map(function (k) { return [k, cats[k]]; }).sort(function (a, b) { return b[1] - a[1]; }), mx = arr.length ? arr[0][1] : 1;
    var endN = last > TODAY && first <= TODAY ? TODAY : last;
    var h = '<div class="cbox"><h3>💰 ' + y + "년 " + (m + 1) + '월 가계부 <small>' + t.n + '줄</small></h3><div class="cbig">' +
      '<div><span>들어온 돈</span><b class="inc">' + won(t["in"]) + '</b></div><div><span>나간 돈</span><b class="outc">' + won(t.out) + '</b></div>' +
      '<div><span>이달 차액 (수입−지출)</span><b>' + won(t["in"] - t.out) + '</b></div><div><span>💳 남은 돈 (' + dayTitle(endN) + ' 끝)</span><b>' + won(balanceAt(endN)) + '</b></div></div>' +
      (arr.length ? '<div class="bars">' + arr.map(function (a) { var c = OUT_CATS.filter(function (x) { return x[0] === a[0]; })[0] || ["", "✨", "#bdbdbd"];
        return '<div class="brow"><span>' + c[1] + " " + e(a[0]) + '</span><span class="tr"><i style="width:' + Math.max(3, Math.round(a[1] / mx * 100)) + "%;background:" + c[2] + '"></i></span><span>' + won(a[1]) + '</span></div>'; }).join("") + '</div>'
        : '<div class="cwhy">이번 달 가계부가 아직 없어요. 위에서 이날 쓴 돈을 적어 보세요.</div>') + '</div>';
    // 주 단위
    var rows = [], d0 = weekStart(first), no = 1, mxw = 1;
    while (d0 <= last && no < 8) { var A = Math.max(d0, first), B = Math.min(d0 + 6, last), r = sumRange(A, B); rows.push({ no: no++, A: A, B: B, out: r.out, now: A <= TODAY && TODAY <= B, fut: A > TODAY }); mxw = Math.max(mxw, r.out); d0 += 7; }
    h += '<div class="cbox"><h3>📈 ' + (m + 1) + '월 주 단위 지출 · 앞으로 예상 <small>월~일이 한 주</small></h3>';
    if (first <= TODAY && TODAY <= last) { var F = forecast();
      var tile = function (l, v, s, hot) { return '<div class="ctile' + (hot ? " hot" : "") + '"><span>' + l + '</span><b>' + v + '</b>' + (s ? "<small>" + s + "</small>" : "") + '</div>'; };
      h += '<div class="ctiles">' + tile("이번 주 지금까지", won(F.thisWeek), "") + tile("한 주 평균 (최근 " + F.wn + "주)", F.avg != null ? won(F.avg) : "–", F.avg != null ? "" : "기록이 한 주 넘게 쌓이면 나와요") +
        tile("🔮 다음 주 예상", F.avg != null ? "약 " + won(F.avg) : "–", "최근 주 평균으로", true) + tile("🔮 이번 달 예상 총액", F.proj != null ? "약 " + won(F.proj) : "–", "지금까지 " + won(F.soFar) + " + 남은 " + F.left + "일", true) +
        tile("지난달 같은 날까지", F.lmSame != null ? won(F.lmSame) : "–", F.lmSame != null ? (F.soFar >= F.lmSame ? "이번 달이 " + won(F.soFar - F.lmSame) + " 더 씀" : "이번 달이 " + won(F.lmSame - F.soFar) + " 덜 씀") : "지난달 기록이 없어요") +
        tile("지난달 전체", F.lmAll != null ? won(F.lmAll) : "–", F.lmAll != null && F.proj != null ? (F.proj > F.lmAll ? "이대로면 " + won(F.proj - F.lmAll) + " 더 써요" : "이대로면 " + won(F.lmAll - F.proj) + " 덜 써요") : "") + '</div>'; }
    h += rows.map(function (r) { return '<div class="wk' + (r.now ? " now" : "") + '"><span>' + r.no + "주차" + (r.now ? " (이번 주)" : "") + '<br><small style="color:var(--muted)">' + md(r.A) + " ~ " + md(r.B) + '</small></span><span class="tr"><i style="width:' + (r.out ? Math.max(2, Math.round(r.out / mxw * 100)) : 0) + '%"></i></span><b>' + (r.fut ? "–" : won(r.out)) + '</b></div>'; }).join("") + '</div>';
    return h;
  }
  function parcelBoxHTML() {
    var st = parcelStats(), m = V.cur.m, h = '';
    h += '<div class="cbox"><h3>📦 택배 · 자주 사는 물건 <small>' + (st.length ? st.reduce(function (s, x) { return s + x.count; }, 0) + "개 받음" : "") + '</small></h3>' +
      (st.length ? '<div style="overflow-x:auto"><table class="ptab"><tr><th>물건</th><th>횟수</th><th>평균</th><th>다음에 필요할 때</th></tr>' + st.slice(0, 12).map(function (x) {
        var nx = x.next != null ? md(x.next) + (x.left < 0 ? ' <b class="late">' + (-x.left) + "일 지남</b>" : x.left <= 3 ? ' <b class="soon">' + (x.left ? x.left + "일 남음" : "오늘쯤") + "</b>" : " (" + x.left + "일 뒤)") : '<span style="color:var(--muted)">두 번 받으면 계산돼요</span>';
        return '<tr><td><b>' + e(x.name) + '</b>' + (x.shop ? "<br><small>" + e(x.shop) + "</small>" : "") + '</td><td>' + x.count + '번</td><td>' + (x.gap ? x.gap + "일마다" : "–") + '</td><td>' + nx + '</td></tr>'; }).join("") + '</table></div>'
        : '<div class="cwhy">위에 받은 물건을 적어 보세요. 같은 물건이 두 번 이상 오면 평균 며칠마다 필요한지, 다음엔 언제 떨어질지 여기에 나와요.</div>') + '</div>';
    return h;
  }
  function sums() {
    var y = V.cur.y, m = V.cur.m, first = dn(y, m, 1), days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate(), last = first + days - 1, h = '';
    // 손 없는 날
    var mv = [];
    for (var n = first; n <= last; n++) if (sonn(lunar(n))) mv.push(n);
    h += '<div class="cbox" style="background:var(--sonn-bg);border-color:transparent"><h3 style="color:var(--sonn)">' + (m + 1) + '월 손 없는 날 · 이사하기 좋은 날</h3>' +
      '<div class="cwhy">음력 끝자리가 9·0인 날. 테두리 있는 날은 주말이라 이사 손님이 가장 많이 찾아요.</div><div class="mlist">' +
      mv.map(function (n) { var w = new Date(n * 864e5).getUTCDay(); return '<button type="button" class="md' + (w === 0 || w === 6 ? " we" : "") + '" data-go="' + n + '">' + new Date(n * 864e5).getUTCDate() + "일(" + WD[w] + ')</button>'; }).join("") + '</div></div>';
    $("cSum").innerHTML = h;
    Array.prototype.forEach.call(document.querySelectorAll("#cSum [data-go]"), function (b) { b.onclick = function () { V.sel = +b.getAttribute("data-go"); grid(); panel(); $("cPanel").scrollIntoView({ behavior: "smooth", block: "start" }); }; });
  }

  /* ---------- 넘기기: 앞으로는 쫙 찢기, 뒤로는 탁 붙기 ---------- */
  var actx = null;
  function sound(kind) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (kind === "rip") {
        var len = 0.32, sr = actx.sampleRate, buf = actx.createBuffer(1, sr * len, sr), d = buf.getChannelData(0);
        for (var i = 0; i < d.length; i++) { var t = i / d.length; d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 1.6) * (0.55 + 0.45 * Math.sin(t * 90)); }
        var src = actx.createBufferSource(); src.buffer = buf; var f = actx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 2600; f.Q.value = 0.7;
        var g = actx.createGain(); g.gain.value = 0.22; src.connect(f); f.connect(g); g.connect(actx.destination); src.start();
      } else {
        var o = actx.createOscillator(), g2 = actx.createGain(), t0 = actx.currentTime + 0.42;
        o.frequency.setValueAtTime(180, t0); o.frequency.exponentialRampToValueAtTime(70, t0 + 0.14);
        g2.gain.setValueAtTime(0.0001, actx.currentTime); g2.gain.setValueAtTime(0.0001, t0); g2.gain.exponentialRampToValueAtTime(0.25, t0 + 0.02); g2.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
        o.connect(g2); g2.connect(actx.destination); o.start(); o.stop(t0 + 0.2);
      }
    } catch (er) {}
  }
  function reduced() { return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function strip(el) { el.removeAttribute("id"); Array.prototype.forEach.call(el.querySelectorAll("[id]"), function (x) { x.removeAttribute("id"); }); el.setAttribute("aria-hidden", "true"); return el; }
  function go(delta, keepSel) {
    var v = V.cur.y * 12 + V.cur.m + delta, c = clampYM({ y: Math.floor(v / 12), m: ((v % 12) + 12) % 12 });
    if (c.y === V.cur.y && c.m === V.cur.m) return;
    var sh = $("sheet"), pp = $("calPaper"), anim = !reduced() && sh && pp;
    var setCur = function () { V.cur = c; if (!keepSel) { V.sel = dn(c.y, c.m, 1); var td = new Date(TODAY * 864e5); if (td.getUTCFullYear() === c.y && td.getUTCMonth() === c.m) V.sel = TODAY; } else if (keepSel === true && delta) { var sd = new Date(V.sel * 864e5); if (sd.getUTCMonth() !== c.m) V.sel = TODAY; } };
    if (anim && delta > 0) {
      var cl = strip(sh.cloneNode(true)); cl.classList.add("tear"); cl.style.top = sh.offsetTop + "px"; cl.style.height = sh.offsetHeight + "px"; pp.appendChild(cl);
      sound("rip"); try { if (navigator.vibrate) navigator.vibrate(12); } catch (er) {}
      setTimeout(function () { cl.remove(); }, 800);
      setCur(); render();
    } else if (anim && delta < 0) {
      var u = strip(sh.cloneNode(true)); u.classList.add("under"); u.style.top = sh.offsetTop + "px"; pp.appendChild(u);
      setCur(); render(); sh.classList.remove("stickin"); void sh.offsetWidth; sh.classList.add("stickin"); sound("stick");
      var done = function () { sh.classList.remove("stickin"); if (u.parentNode) u.remove(); sh.removeEventListener("animationend", done); };
      sh.addEventListener("animationend", done); setTimeout(done, 900);
    } else { setCur(); render(); }
  }
})();
