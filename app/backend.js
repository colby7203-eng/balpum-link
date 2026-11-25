/* =====================================================================
   발품투어 매물장 v1.0 — 서버(Supabase) 연결
   예전 구글 시트판의 앱스 스크립트 함수(appList, appSave …)를 같은 이름·같은 모양으로 다시 만든 것.
   화면 코드는 call("appList", PIN) 처럼 그대로 부르고, 여기서 Supabase 로 바꿔 줍니다.
   Made by 정동철 · 상상을 현실로
   ===================================================================== */
(function () {
  "use strict";
  var CFG = window.BALPUM_CONFIG || {};
  var BASE = String(CFG.SUPABASE_URL || "").replace(/\/+$/, "");
  var KEY = CFG.SUPABASE_KEY || "";
  var SESS_KEY = "bp_session";

  /* ---------------- 공통 ---------------- */
  function kst(d) {                                   // "yyyy-MM-dd HH:mm:ss" (한국 시각)
    var t = new Date((d ? d.getTime() : Date.now()) + 9 * 3600000).toISOString();
    return t.slice(0, 10) + " " + t.slice(11, 19);
  }
  function nowStr() { return kst(); }
  function err(msg) { return new Error(msg); }
  function str(v) { return v === null || v === undefined ? "" : String(v); }
  function photoLines(s) { return String(s || "").split(/\r?\n/).map(function (x) { return x.trim(); }).filter(function (x) { return x; }); }
  function clone(o) { return JSON.parse(JSON.stringify(o == null ? null : o)); }

  /* ---------------- 로그인 ---------------- */
  var SESSION = null;
  try { SESSION = JSON.parse(localStorage.getItem(SESS_KEY) || "null"); } catch (e) { SESSION = null; }
  function saveSession(s) {
    SESSION = s;
    try { if (s) localStorage.setItem(SESS_KEY, JSON.stringify(s)); else localStorage.removeItem(SESS_KEY); } catch (e) {}
  }
  function netFail(e) {
    if (e && e.name === "AbortError") return err("서버 응답이 너무 늦어요. 인터넷을 확인하고 다시 해 주세요.");
    return err("서버에 연결하지 못했어요. 인터넷(와이파이·데이터)을 확인해 주세요.");
  }
  function fetchJson(url, opt) {
    opt = opt || {};
    var ctl = window.AbortController ? new AbortController() : null;
    var tm = ctl ? setTimeout(function () { ctl.abort(); }, opt.timeout || 30000) : null;
    if (ctl) opt.signal = ctl.signal;
    return fetch(url, opt).then(function (res) {
      if (tm) clearTimeout(tm);
      return res.text().then(function (t) {
        var j = null;
        try { j = t ? JSON.parse(t) : null; } catch (e) { j = t; }
        return { status: res.status, ok: res.ok, body: j };
      });
    }, function (e) { if (tm) clearTimeout(tm); throw netFail(e); });
  }
  function authMsg(r) {
    var b = r.body || {}, m = String(b.msg || b.message || b.error_description || b.error || "");
    if (/Invalid login credentials/i.test(m)) return "이메일이나 비밀번호가 맞지 않아요.";
    if (/Email not confirmed/i.test(m)) return "가입 확인 메일의 링크를 먼저 눌러 주세요. (메일함·스팸함 확인)";
    if (/already registered|already been registered|User already/i.test(m)) return "이미 가입된 이메일이에요. 로그인해 주세요.";
    if (/Password should be|at least 6/i.test(m)) return "비밀번호는 6자리 이상으로 해 주세요.";
    if (/invalid.*email|Unable to validate email/i.test(m)) return "이메일 주소를 다시 확인해 주세요.";
    if (/rate limit|too many/i.test(m)) return "잠시 뒤 다시 해 주세요. (너무 자주 요청했어요)";
    return m || ("로그인 오류 (" + r.status + ")");
  }
  function takeSession(b) {
    if (!b || !b.access_token) return null;
    var s = { access_token: b.access_token, refresh_token: b.refresh_token,
              expires_at: b.expires_at || Math.floor(Date.now() / 1000) + (b.expires_in || 3600),
              user: b.user ? { id: b.user.id, email: b.user.email } : (SESSION && SESSION.user) };
    saveSession(s);
    return s;
  }
  function authPost(path, body) {
    return fetchJson(BASE + "/auth/v1/" + path, {
      method: "POST", headers: { "apikey": KEY, "Content-Type": "application/json" }, body: JSON.stringify(body)
    });
  }
  var refreshing = null;
  function ensureSession() {
    if (!SESSION || !SESSION.access_token) return Promise.reject(err("로그인이 필요해요."));
    if (SESSION.expires_at - 90 > Date.now() / 1000) return Promise.resolve(SESSION);
    if (refreshing) return refreshing;
    refreshing = authPost("token?grant_type=refresh_token", { refresh_token: SESSION.refresh_token }).then(function (r) {
      refreshing = null;
      if (!r.ok) { saveSession(null); throw err("로그인이 끝났어요. 다시 로그인해 주세요."); }
      return takeSession(r.body);
    }, function (e) { refreshing = null; throw e; });
    return refreshing;
  }

  var Auth = {
    user: function () { return SESSION && SESSION.user ? SESSION.user : null; },
    signIn: function (email, pw) {
      return authPost("token?grant_type=password", { email: String(email).trim(), password: String(pw) }).then(function (r) {
        if (!r.ok) throw err(authMsg(r));
        takeSession(r.body);
        return Auth.user();
      });
    },
    signUp: function (email, pw, meta) {
      return authPost("signup", { email: String(email).trim(), password: String(pw), data: meta || {} }).then(function (r) {
        if (!r.ok) throw err(authMsg(r));
        var s = takeSession(r.body);
        return { needConfirm: !s };
      });
    },
    resetPassword: function (email) {
      return authPost("recover", { email: String(email).trim() }).then(function (r) {
        if (!r.ok) throw err(authMsg(r));
        return true;
      });
    },
    signOut: function () {
      var s = SESSION;
      saveSession(null);
      try { ["mm_items", "mm_tour", "mm_slots", "mm_rp_url", "mm_relay"].forEach(function (k) { localStorage.removeItem(k); }); } catch (e) {}
      if (!s) return Promise.resolve(true);
      return fetchJson(BASE + "/auth/v1/logout", { method: "POST", headers: { "apikey": KEY, "Authorization": "Bearer " + s.access_token } })
        .then(function () { return true; }, function () { return true; });
    }
  };

  /* ---------------- 서버 자료 (PostgREST) ---------------- */
  function rest(method, path, body, prefer) {
    return ensureSession().then(function (s) {
      var h = { "apikey": KEY, "Authorization": "Bearer " + s.access_token, "Content-Type": "application/json" };
      if (prefer) h["Prefer"] = prefer;
      return fetchJson(BASE + "/rest/v1/" + path, { method: method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) });
    }).then(function (r) {
      if (r.ok) return r.body;
      var b = r.body || {}, m = String(b.message || b.msg || b.hint || "");
      if (r.status === 401) { saveSession(null); throw err("로그인이 끝났어요. 다시 로그인해 주세요."); }
      if (/docs_listing_limit/.test(m) || (/row-level security/i.test(m) && /docs/.test(path) && method === "POST")) throw err("무료 등록 건수와 7일 여유를 다 썼어요. [내 사무소]에서 🎫 이용권을 넣으면 바로 다시 등록돼요. (보기 · 고치기는 그대로 돼요)");
      if (/row-level security/i.test(m)) throw err("이 자료를 고칠 수 없어요. 다시 로그인해 주세요.");
      if (r.status === 413 || /too large|payload/i.test(m)) throw err("자료가 너무 커요. 사진 수를 줄여 주세요.");
      throw err("서버 오류 (" + r.status + ")" + (m ? ": " + m.slice(0, 120) : ""));
    });
  }
  function enc(v) { return encodeURIComponent(String(v)); }
  function inList(ids) {
    return "(" + ids.map(function (x) { return '"' + String(x).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"'; }).join(",") + ")";
  }
  var DB = {
    list: function (kind, opt) {
      opt = opt || {};
      var q = "docs?select=" + (opt.big ? "id,parent,data,big,created_at" : "id,parent,data,created_at") + "&kind=eq." + enc(kind);
      if (opt.parent !== undefined) q += "&parent=eq." + enc(opt.parent);
      if (opt.ids) { if (!opt.ids.length) return Promise.resolve([]); q += "&id=in." + enc(inList(opt.ids)); }
      q += "&order=created_at.asc";
      return rest("GET", q).then(function (rows) { return rows || []; });
    },
    get: function (kind, id, withBig) {
      return rest("GET", "docs?select=" + (withBig ? "id,parent,data,big,created_at" : "id,parent,data,created_at") +
        "&kind=eq." + enc(kind) + "&id=eq." + enc(id)).then(function (rows) { return rows && rows[0] ? rows[0] : null; });
    },
    insert: function (kind, id, data, big, parent) {
      var row = { kind: kind, id: String(id), data: data || {}, big: big || "", parent: parent || "" };
      return rest("POST", "docs", row, "return=minimal");
    },
    upsert: function (kind, id, data, big, parent) {           // 매물(listing)에는 쓰지 않음
      var row = { kind: kind, id: String(id), data: data || {} };
      if (big !== undefined) row.big = big;
      if (parent !== undefined) row.parent = parent;
      return rest("POST", "docs?on_conflict=owner,kind,id", row, "resolution=merge-duplicates,return=minimal");
    },
    patch: function (kind, id, fields) {
      return rest("PATCH", "docs?kind=eq." + enc(kind) + "&id=eq." + enc(id), fields, "return=representation").then(function (rows) {
        if (!rows || !rows.length) throw err("자료를 찾을 수 없어요. 목록을 새로 열어 주세요.");
        return rows[0];
      });
    },
    del: function (kind, id) { return rest("DELETE", "docs?kind=eq." + enc(kind) + "&id=eq." + enc(id), undefined, "return=minimal"); },
    delChildren: function (kind, parent) { return rest("DELETE", "docs?kind=eq." + enc(kind) + "&parent=eq." + enc(parent), undefined, "return=minimal"); },
    setting: function (id, dflt) { return DB.get("set", id).then(function (r) { return r ? r.data : dflt; }); },
    saveSetting: function (id, data) { return DB.upsert("set", id, data); }
  };

  var ACCOUNT = null, CONFIG = null;
  function loadAccount(force) {
    if (ACCOUNT && !force) return Promise.resolve(ACCOUNT);
    return rest("GET", "accounts?select=*").then(function (rows) { ACCOUNT = rows && rows[0] ? rows[0] : null; return ACCOUNT; });
  }
  function loadConfig() {
    if (CONFIG) return Promise.resolve(CONFIG);
    return rest("GET", "app_config?select=key,value").then(function (rows) {
      CONFIG = {}; (rows || []).forEach(function (r) { CONFIG[r.key] = r.value; });
      return CONFIG;
    });
  }

  /* ======================= 매물 ======================= */
  // v1.7: prices(가격 여러 개) · clients(의뢰인 여러 명) · note(비고) — JSON 글자로 저장, 예전 칸(price · deal_type · client_name · phone)은 첫 줄로 같이 채움
  var LISTING_KEYS = ["date", "name", "price", "deal_type", "location", "client_name", "phone", "room_structure", "password",
                      "status", "dong", "direction", "mgmt_fee", "mgmt_items", "meters", "prices", "clients", "note", "price_old"];
  var APP_EDIT_KEYS = ["name", "price", "deal_type", "location", "client_name", "phone", "room_structure", "password",
                       "status", "dong", "direction", "mgmt_fee", "mgmt_items", "meters", "prices", "clients", "note", "price_old"];
  var PHOTO_MAX_CHARS = 45000, PHOTO_MAX_COUNT = 12;

  function listingObj(row) {
    var d = row.data || {}, o = { id: String(row.id) };
    LISTING_KEYS.forEach(function (k) { o[k] = str(d[k]); });
    if (!o.status) o.status = "진행중";
    var n = Number(d.photo_count) || 0;
    o.photo_url = ""; o["사진수"] = n; o.photo_count = n;
    return o;
  }
  function byNumId(a, b) { return (Number(a.id) || 0) - (Number(b.id) || 0) || String(a.id).localeCompare(String(b.id)); }
  function listListings() { return DB.list("listing").then(function (rows) { return rows.map(listingObj).sort(byNumId); }); }
  function listingRaw(id) {
    return DB.get("listing", id, true).then(function (r) { if (!r) throw err("매물을 찾을 수 없어요. 목록을 새로 열어 주세요."); return r; });
  }
  function patchListing(id, change) {                       // data 일부만 바꿈
    return listingRaw(id).then(function (r) {
      var d = r.data || {};
      for (var k in change) d[k] = change[k];
      return DB.patch("listing", id, { data: d });
    });
  }
  function setPhotos(id, data, lines) {
    var joined = lines.join("\n");
    data.photo_count = lines.length;
    return DB.patch("listing", id, { data: data, big: joined }).then(function () { return joined; });
  }

  var DONG_RE = /([가-힣]{1,6}\d{0,2}(?:동|리|가))(?=[\s\d\-,(]|$)/;

  var API = {};
  API.appCheck = function () { return ensureSession().then(function () { return true; }); };
  API.appList = function () { return listListings(); };
  API.appPhotos = function (id) { return DB.get("listing", id, true).then(function (r) { return r ? r.big || "" : ""; }); };
  API.appThumbs = function (ids) {
    ids = (ids || []).map(String);
    var out = {}, chunks = [];
    for (var i = 0; i < ids.length; i += 40) chunks.push(ids.slice(i, i + 40));
    return Promise.all(chunks.map(function (c) {
      return rest("GET", "docs?select=id,big&kind=eq.listing&id=in." + enc(inList(c))).then(function (rows) {
        (rows || []).forEach(function (r) { out[String(r.id)] = photoLines(r.big)[0] || ""; });
      });
    })).then(function () { return out; });
  };
  API.appSave = function (data) {
    data = data || {};
    if (data.id) {
      var ch = {};
      APP_EDIT_KEYS.forEach(function (k) { if (data[k] !== undefined && data[k] !== null) ch[k] = String(data[k]); });
      return patchListing(String(data.id), ch).then(function () { return "성공"; });
    }
    var lines = photoLines(data.photo_url);
    if (lines.length > PHOTO_MAX_COUNT) return Promise.reject(err("사진은 12장까지만 올릴 수 있어요."));
    if (lines.join("\n").length > PHOTO_MAX_CHARS) return Promise.reject(err("사진 용량이 한도를 넘었어요. 장수를 줄여 주세요."));
    return DB.list("listing").then(function (rows) {
      var max = 0;
      rows.forEach(function (r) { var n = Number(String(r.id).split(".")[0]); if (!isNaN(n) && n > max) max = n; });
      var d = {};
      APP_EDIT_KEYS.forEach(function (k) { d[k] = data[k] !== undefined && data[k] !== null ? String(data[k]) : ""; });
      d.date = data.date || nowStr();
      d.status = "진행중";
      d.photo_count = lines.length;
      return DB.insert("listing", String(max + 1), d, lines.join("\n"));
    }).then(function () { ACCOUNT = null; return "성공"; });
  };
  API.appAddPhotos = function (id, newPart) {
    var add = photoLines(newPart);
    if (!add.length) return Promise.reject(err("올릴 사진이 없어요."));
    return listingRaw(id).then(function (r) {
      var cur = photoLines(r.big);
      if (cur.length + add.length > PHOTO_MAX_COUNT)
        throw err("사진은 총 12장까지예요. 지금 " + cur.length + "장이 있어서 " + (PHOTO_MAX_COUNT - cur.length) + "장만 더 올릴 수 있어요.");
      var all = cur.concat(add);
      if (all.join("\n").length > PHOTO_MAX_CHARS) throw err("사진 용량 한도를 넘었어요. 기존 사진을 몇 장 지우거나 장수를 줄여 주세요.");
      return setPhotos(id, r.data || {}, all);
    });
  };
  API.appReplacePhotos = function (id, joined, prevCount) {
    var lines = photoLines(joined);
    if (lines.length > PHOTO_MAX_COUNT) return Promise.reject(err("사진은 12장까지만 올릴 수 있어요."));
    if (lines.join("\n").length > PHOTO_MAX_CHARS) return Promise.reject(err("사진 용량 한도를 넘었어요. 장수를 줄여 주세요."));
    return listingRaw(id).then(function (r) {
      if (photoLines(r.big).length !== Number(prevCount)) throw err("그사이 사진이 바뀌었어요. 매물을 다시 열어 주세요.");
      return setPhotos(id, r.data || {}, lines);
    });
  };
  API.appDeletePhoto = function (id, index, head) {
    return listingRaw(id).then(function (r) {
      var cur = photoLines(r.big);
      index = Number(index);
      if (!(index >= 0 && index < cur.length) || cur[index].slice(0, 40) !== String(head)) throw err("그사이 사진이 바뀌었어요. 매물을 다시 열어 주세요.");
      cur.splice(index, 1);
      return setPhotos(id, r.data || {}, cur);
    });
  };
  API.appSetStatus = function (id, status) { return patchListing(String(id), { status: String(status) }).then(function () { return "성공"; }); };
  API.appSetDirection = function (id, dir) { return patchListing(String(id), { direction: String(dir || "") }).then(function () { return "성공"; }); };
  API.appDelete = function (id) { return DB.del("listing", String(id)).then(function () { return "성공"; }); };
  API.appInfo = function () {
    return loadAccount(true).then(function (a) {
      a = a || {};
      return { name: a.office_name || "", ceo: a.ceo || "", reg: a.reg_no || "", addr: a.addr || "", tel: a.tel || "",
               mobile: a.mobile || "", email: (Auth.user() || {}).email || "" };
    });
  };
  API.appFillDongs = function () {
    return DB.list("listing").then(function (rows) {
      var todo = [];
      rows.forEach(function (r) {
        var d = r.data || {};
        if (str(d.dong).trim()) return;
        var m = str(d.location).match(DONG_RE);
        if (m) { d.dong = m[1]; todo.push({ id: r.id, d: d }); }
      });
      return Promise.all(todo.map(function (t) { return DB.patch("listing", t.id, { data: t.d }); })).then(function () { return todo.length; });
    });
  };
  API.appRestoreListings = function (ids) {
    return Promise.all((ids || []).map(function (id) {
      return DB.get("listing", String(id)).then(function (r) {
        if (!r) return 0;
        var st = str((r.data || {}).status), back = st.indexOf("휴지통:") === 0 ? st.slice(4) : "";
        var d = r.data || {}; d.status = back && back.indexOf("휴지통") !== 0 ? back : "진행중";
        return DB.patch("listing", String(id), { data: d }).then(function () { return 1; });
      });
    })).then(function (a) { return a.reduce(function (s, x) { return s + x; }, 0); });
  };

  /* ======================= 고객 ======================= */
  var CUST_COLS = ["id", "등록일", "이름", "전화번호", "종류", "문의경로", "지역", "방구조", "최대예산", "최대월세", "입주시기", "상태", "메모",
                   "연락기록", "수정일시", "역할", "직업", "꼭필요한것", "결혼", "식구수", "자녀수", "맞벌이", "연봉본인", "연봉배우자", "신용점수",
                   "기존대출", "무주택", "보유주택수", "생애최초", "보유현금", "대출계획", "개인정보동의", "마케팅동의", "동의일", "변경기록"];
  var CUST_NOLOG = { "id": 1, "등록일": 1, "연락기록": 1, "수정일시": 1, "변경기록": 1 };
  function custObj(d) {
    var o = {};
    CUST_COLS.forEach(function (k) { if (k === "연락기록") o["기록"] = (d["기록"] || []).slice(); else o[k] = str(d[k]); });
    if (o["등록일"]) o["등록일"] = o["등록일"].slice(0, 10);
    return o;
  }
  function custList() { return DB.list("cust").then(function (rows) { return rows.map(function (r) { return custObj(r.data || {}); }); }); }
  API.appCustList = function () {
    return Promise.all([custList(), listListings()]).then(function (a) {
      return { customers: a[0], listings: a[1].map(function (x) {
        return { id: x.id, name: x.name, price: x.price, deal_type: x.deal_type, location: x.location, room_structure: x.room_structure,
                 status: x.status, dong: x.dong, direction: x.direction, client_name: x.client_name, phone: x.phone, prices: x.prices, clients: x.clients, price_old: x.price_old }; }) };
    });
  };
  API.appCustSave = function (c) {
    c = c || {};
    var id = str(c.id).trim();
    if (!id) return Promise.reject(err("고객 정보가 비어 있습니다."));
    return DB.get("cust", id).then(function (row) {
      var old = row ? custObj(row.data || {}) : null;
      var recs = (c["기록"] || []).slice();
      if (old) {
        var keys = {};
        recs.forEach(function (r) { keys[(r["시각"] || r["날짜"]) + "|" + r["내용"]] = 1; });
        (old["기록"] || []).forEach(function (r) { if (!keys[(r["시각"] || r["날짜"]) + "|" + r["내용"]]) recs.push(r); });
        recs.sort(function (a, b) { return String(a["시각"] || a["날짜"]).localeCompare(String(b["시각"] || b["날짜"])); });
      }
      var now = nowStr(), log = old ? str(old["변경기록"]) : "";
      if (old) {
        var lines = [];
        CUST_COLS.forEach(function (k) {
          if (CUST_NOLOG[k] || c[k] === undefined || c[k] === null) return;
          var a = str(old[k]), b = String(c[k]);
          if (a !== b) lines.push(now + " | " + k + ": " + (a || "(빈칸)") + " → " + (b || "(지움)"));
        });
        if (lines.length) log = (log ? log + "\n" : "") + lines.join("\n");
      }
      var d = {};
      CUST_COLS.forEach(function (k) {
        if (k === "연락기록") { d["기록"] = recs.map(function (r) { return { "날짜": str(r["날짜"] || str(r["시각"]).slice(0, 10)), "시각": str(r["시각"] || r["날짜"]), "내용": str(r["내용"]).replace(/\r?\n/g, " ") }; }); return; }
        if (k === "수정일시") { d[k] = now; return; }
        if (k === "변경기록") { d[k] = log; return; }
        if (k === "등록일") { d[k] = c[k] || (old && old[k]) || now.slice(0, 10); return; }
        if (c[k] === undefined || c[k] === null) { d[k] = old ? str(old[k]) : ""; return; }
        d[k] = String(c[k]);
      });
      d.id = id;
      return DB.upsert("cust", id, d);
    }).then(custList);
  };
  API.appCustDelete = function (id) {
    return DB.get("cust", String(id)).then(function (r) {
      if (!r) throw err("고객을 찾을 수 없어요. 목록을 새로 열어 주세요.");
      return DB.del("cust", String(id));
    }).then(custList);
  };

  /* ======================= 답사 동선 ======================= */
  function tourList() {
    return DB.list("tour").then(function (rows) {
      var out = rows.map(function (r) {
        var d = r.data || {};
        return { "이름": String(r.id), "저장일시": str(d.saved), "저장한곳": str(d.by), "곳수": str(d.count), "자료": str(d.json) };
      });
      out.sort(function (a, b) { return String(b["저장일시"]).localeCompare(String(a["저장일시"])); });
      return out;
    });
  }
  API.appTours = function () { return tourList(); };
  API.appTourSave = function (route, oldName) {
    var name = str(route && route.name).trim();
    if (!name) return Promise.reject(err("동선 이름이 비어 있습니다."));
    var items = (route.items || []).filter(function (x) { return x && x.on !== false; });
    route.saved = route.saved || nowStr().slice(0, 16);
    var json = JSON.stringify(route);
    if (json.length > 200000) return Promise.reject(err("동선이 너무 깁니다. 집 수를 줄여 주세요."));
    var d = { saved: route.saved, by: str(route.by), count: String(items.length), want: str(route.want), json: json };
    return DB.upsert("tour", name, d).then(function () {
      if (oldName && oldName !== name) return DB.del("tour", oldName);
    }).then(tourList);
  };
  API.appTourDelete = function (name) {
    return DB.get("tour", String(name)).then(function (r) {
      if (!r) throw err("동선을 찾을 수 없어요. 다시 열어 주세요.");
      return DB.del("tour", String(name));
    }).then(tourList);
  };

  /* ======================= 답사 칸별 사진 ======================= */
  var DEFAULT_SLOTS = ["주차장", "1층 공동현관", "엘리베이터·계단", "세대 현관", "전실", "신발장", "중문", "주방", "거실화장실", "안방", "안방화장실",
                       "거실", "거실 창밖", "방2", "방3", "보일러실", "발코니", "테라스"];
  var PART_MAX = 49000, PARTS_MAX = 4;
  API.appSlots = function () { return DB.setting("slots", null).then(function (d) { var l = d && d.list; return l && l.length ? l : DEFAULT_SLOTS.slice(); }); };
  API.appSlotsSave = function (list) {
    var clean = (list || []).map(function (x) { return str(x).trim(); }).filter(function (x, i, a) { return x && a.indexOf(x) === i; });
    if (!clean.length) return Promise.reject(err("칸이 하나도 없어요."));
    return DB.saveSetting("slots", { list: clean }).then(function () { return clean; });
  };
  function checkParts(parts) {
    parts = (parts || []).map(String);
    if (parts.length > PARTS_MAX) throw err("사진이 너무 큽니다.");
    parts.forEach(function (p) { if (p.length > PART_MAX) throw err("사진 조각이 너무 큽니다."); });
    return parts.join("");
  }
  API.appTPhotoList = function (listingIds, coNames) {
    var wantL = {}, wantC = {};
    (listingIds || []).forEach(function (x) { wantL[String(x)] = 1; });
    (coNames || []).forEach(function (x) { wantC[String(x)] = 1; });
    return DB.list("tphoto").then(function (rows) {
      return rows.filter(function (r) {
        var d = r.data || {}, lid = str(d.listing_id), co = str(d.co_name);
        return (lid && wantL[lid]) || (!lid && co && wantC[co]);
      }).map(function (r) {
        var d = r.data || {};
        return { id: String(r.id), listing_id: str(d.listing_id), name: str(d.name), co_name: str(d.co_name), slot: str(d.slot),
                 time: str(d.time), status: str(d.status) || "시트에 있음", got: str(d.got), rot: Number(d.rot) || 0, thumb: str(d.thumb) };
      });
    });
  };
  API.appTPhotoGet = function (id) { return DB.get("tphoto", String(id), true).then(function (r) { return r ? r.big || "" : ""; }); };
  API.appTPhotoAdd = function (meta, parts, thumb) {
    meta = meta || {};
    var id = str(meta.id).trim();
    if (!id) return Promise.reject(err("사진 번호가 없습니다."));
    var big;
    try { big = checkParts(parts); } catch (e) { return Promise.reject(e); }
    return DB.get("tphoto", id).then(function (r) {
      if (r) return id;                                       // 같은 사진을 두 번 올리면 한 번만
      var d = { listing_id: str(meta.listing_id), name: str(meta.name), co_name: str(meta.co_name), slot: str(meta.slot),
                time: str(meta.time) || nowStr(), status: "시트에 있음", got: "", rot: Number(meta.rot) || 0, thumb: str(thumb).slice(0, PART_MAX) };
      return DB.insert("tphoto", id, d, big, str(meta.listing_id)).then(function () { return id; });
    });
  };
  API.appTPhotoRotate = function (id, rot) {
    return DB.get("tphoto", String(id)).then(function (r) {
      if (!r) throw err("사진을 찾을 수 없어요.");
      var d = r.data || {};
      if (str(d.status) && d.status !== "시트에 있음") throw err("이미 PC에 받아 간 사진이에요. PC에서 돌려 주세요.");
      d.rot = ((Number(rot) || 0) % 360 + 360) % 360;
      return DB.patch("tphoto", String(id), { data: d }).then(function () { return true; });
    });
  };
  API.appTPhotoDelete = function (id) { return DB.del("tphoto", String(id)).then(function () { return true; }); };

  /* ======================= 수리 견적 · 업체 · 단가 ======================= */
  var RP_LINK_DAYS = 14;
  var DEFAULT_PRICES = [
    ["도배", "벽지 도배 (자재+시공)", "평", 35000, 70000, "평", "예시값"], ["도배", "기존 벽지 제거·밑작업", "평", 5000, 15000, 0, ""],
    ["도배", "곰팡이 제거·방수 처리", "곳", 30000, 100000, 0, ""], ["도배", "소량 시공 기본 출장비", "식", 50000, 150000, 0, "부분 도배일 때"],
    ["장판", "장판 (자재+시공)", "평", 35000, 70000, "평", "예시값"], ["장판", "기존 장판 철거·폐기", "평", 5000, 10000, "평", ""],
    ["장판", "걸레받이", "m", 3000, 8000, 0, ""], ["누수", "누수 탐지", "식", 200000, 450000, 1, "예시값"],
    ["누수", "배관 부분 수리", "곳", 150000, 500000, 1, ""], ["누수", "천장·벽 마감 복구", "식", 100000, 300000, 0, ""],
    ["보일러", "출장 점검", "식", 30000, 60000, 1, "예시값"], ["보일러", "부품 수리", "식", 50000, 250000, 0, ""],
    ["보일러", "보일러 교체 (콘덴싱)", "대", 700000, 1300000, 0, ""], ["전기", "출장·점검", "식", 30000, 70000, 1, "예시값"],
    ["전기", "콘센트·스위치 교체", "개", 10000, 30000, 0, ""], ["전기", "조명 교체 (LED)", "개", 30000, 100000, 0, ""],
    ["전기", "차단기 교체", "개", 30000, 80000, 0, ""], ["샷시", "방충망 교체", "짝", 30000, 70000, 1, "예시값"],
    ["샷시", "롤러·손잡이 수리", "곳", 30000, 100000, 0, ""], ["샷시", "창 실리콘 재시공", "창", 30000, 80000, 0, ""],
    ["열쇠", "도어락 교체", "개", 150000, 350000, 1, "예시값"], ["열쇠", "문 열기 (출장)", "식", 30000, 80000, 0, ""],
    ["청소", "입주 청소", "평", 12000, 20000, "평", "예시값"], ["청소", "곰팡이·찌든 때 추가", "곳", 30000, 100000, 0, ""],
    ["욕실", "실리콘·줄눈 재시공", "식", 100000, 250000, 1, "예시값"], ["욕실", "수전 교체", "개", 50000, 150000, 0, ""],
    ["욕실", "변기 교체", "개", 200000, 450000, 0, ""], ["욕실", "환풍기 교체", "개", 50000, 120000, 0, ""],
    ["기타", "출장비", "식", 30000, 70000, 1, "예시값"], ["기타", "작업비", "식", 50000, 200000, 1, ""]
  ];
  function num(v) { return Number(String(v).replace(/[^\d.]/g, "")) || 0; }
  function priceObj(r) { return { kind: str(r[0]), item: str(r[1]), unit: str(r[2]), low: num(r[3]), high: num(r[4]), qty: str(r[5]), memo: str(r[6]) }; }
  function pricesGet() {
    return DB.setting("prices", null).then(function (d) {
      var rows = d && d.rows && d.rows.length ? d.rows : DEFAULT_PRICES;
      return rows.filter(function (r) { return str(r[0]) && str(r[1]); }).map(priceObj);
    });
  }
  function moveSettings() {
    return DB.setting("move", {}).then(function (o) { o = o || {}; if (o.elec === undefined) o.elec = "한국전력 123 (국번 없이)"; return o; });
  }
  function repairObj(r) {
    var d = clone(r.data || {});
    d.id = String(r.id);
    d.types = d.types || []; d.data = d.data || {}; d.status = d.status || "진행중";
    return d;
  }
  function repairList() { return DB.list("repair").then(function (rows) { return rows.map(repairObj); }); }
  function vendorList() {
    return DB.list("vendor").then(function (rows) {
      return rows.map(function (r) { var d = r.data || {}; return { id: String(r.id), name: str(d.name), kind: str(d.kind), phone: str(d.phone), addr: str(d.addr),
        memo: str(d.memo), stars: Number(d.stars) || 0, last: str(d.last), created: str(d.created) }; });
    });
  }
  function shareBase() { return String(CFG.SHARE_BASE || ""); }
  API.appRepairInit = function () {
    return Promise.all([repairList(), vendorList(), pricesGet(), moveSettings(), aiStatus()]).then(function (a) {
      return { jobs: a[0], vendors: a[1], prices: a[2], url: shareBase(), days: RP_LINK_DAYS, settings: a[3], ai: a[4] };
    });
  };
  API.appMoveSettingsSave = function (o) {
    var c = {};
    ["gas", "elec", "water", "etc"].forEach(function (k) { c[k] = str((o || {})[k]).slice(0, 200); });
    return DB.saveSetting("move", c).then(function () { return c; });
  };
  API.appRepairSave = function (j) {
    if (!j || !j.id) return Promise.reject(err("견적 번호가 없습니다."));
    var d = { created: str(j.created) || nowStr(), listing_id: str(j.listing_id), name: str(j.name), addr: str(j.addr), dong: str(j.dong),
              types: (j.types || []).map(String), memo: str(j.memo), status: str(j.status) || "진행중", key: str(j.key), updated: nowStr(), data: j.data || {} };
    if (JSON.stringify(d).length > 200000) return Promise.reject(err("견적 자료가 너무 깁니다."));
    return DB.upsert("repair", String(j.id), d).then(function () { d.id = String(j.id); return d; });
  };
  API.appRepairDelete = function (id) {
    return DB.del("repair", String(id)).then(function () { return DB.delChildren("rphoto", String(id)); }).then(function () { return true; });
  };
  API.appRPhotoList = function (jobId) {
    return DB.list("rphoto", { parent: String(jobId) }).then(function (rows) {
      return rows.map(function (r) { var d = r.data || {}; return { id: String(r.id), job: String(r.parent), time: str(d.time), thumb: str(d.thumb) }; });
    });
  };
  API.appRPhotoGet = function (id) { return DB.get("rphoto", String(id), true).then(function (r) { return r ? r.big || "" : ""; }); };
  API.appRPhotoAdd = function (meta, parts, thumb) {
    meta = meta || {};
    var id = str(meta.id).trim();
    if (!id || !meta.job) return Promise.reject(err("사진 번호가 없습니다."));
    var big;
    try { big = checkParts(parts); } catch (e) { return Promise.reject(e); }
    return DB.get("rphoto", id).then(function (r) {
      if (r) return id;
      return DB.insert("rphoto", id, { time: str(meta.time) || nowStr(), thumb: str(thumb).slice(0, PART_MAX) }, big, String(meta.job)).then(function () { return id; });
    });
  };
  API.appRPhotoDelete = function (id) { return DB.del("rphoto", String(id)).then(function () { return true; }); };
  API.appVendorSave = function (v) {
    if (!v || !str(v.name).trim()) return Promise.reject(err("업체 이름을 적어 주세요."));
    return vendorList().then(function (list) {
      var id = str(v.id);
      var old = list.filter(function (x) { return x.id === id; })[0] || null;
      if (!old) {
        var dg = str(v.phone).replace(/\D/g, "");
        if (dg) old = list.filter(function (x) { return x.phone.replace(/\D/g, "") === dg; })[0] || null;
        if (old) id = old.id;
      }
      if (!id) { var t = nowStr().replace(/\D/g, "").slice(2); id = t + Math.floor(Math.random() * 90 + 10); }
      var d = { name: str(v.name).trim(), kind: str(v.kind), phone: str(v.phone), addr: str(v.addr), memo: str(v.memo), stars: Number(v.stars) || 0,
                last: str(v.last) || (old ? old.last : ""), created: old ? old.created : nowStr().slice(0, 10) };
      return DB.upsert("vendor", id, d).then(function () { d.id = id; return d; });
    });
  };
  API.appVendorDelete = function (id) { return DB.del("vendor", String(id)).then(function () { return true; }); };
  API.appPricesSave = function (rows) {
    var clean = (rows || []).filter(function (r) { return r && str(r.kind).trim() && str(r.item).trim(); }).map(function (r) {
      return [str(r.kind).trim(), str(r.item).trim(), str(r.unit) || "식", Number(r.low) || 0, Number(r.high) || 0, String(r.qty === undefined ? 0 : r.qty), str(r.memo)];
    });
    if (!clean.length) return Promise.reject(err("단가가 하나도 없어요."));
    return DB.saveSetting("prices", { rows: clean }).then(pricesGet);
  };

  /* ======================= 신축 현장 ======================= */
  function siteObj(r) {
    var d = r.data || {}, o = clone(d.o || {});
    o.id = String(r.id); o.data = d.data || {};
    return o;
  }
  API.appSites = function () { return DB.list("site").then(function (rows) { return rows.map(siteObj); }); };
  API.appSiteSave = function (o) {
    if (!o || !o.id) return Promise.reject(err("현장 번호가 없습니다."));
    var d = o.data || {};
    if (d.log && d.log.length > 40) d.log = d.log.slice(-40);
    var units = d.units || [];
    var left = units.filter(function (u) { return (u.st || "남음") === "남음"; }).length;
    var head = { created: str(o.created) || nowStr(), name: str(o.name), addr: str(o.addr), left: left, total: units.length,
                 sheetDate: str(d.sheetDate), updated: nowStr() };
    if (JSON.stringify(d).length > 200000) return Promise.reject(err("현장 자료가 너무 깁니다. 오래된 기록이나 호수 메모를 줄여 주세요."));
    return DB.upsert("site", String(o.id), { o: head, data: d }).then(function () { var r = clone(head); r.id = String(o.id); r.data = d; return r; });
  };
  API.appSiteDelete = function (id) {
    return DB.del("site", String(id)).then(function () { return DB.delChildren("rphoto", String(id)); }).then(function () { return true; });
  };

  /* ======================= AI (Gemini, 각자 자기 무료 키) ======================= */
  var GEMINI_MODELS = ["gemini-flash-latest", "gemini-2.5-flash", "gemini-flash-lite-latest", "gemini-2.5-flash-lite", "gemini-2.0-flash"];
  function tail4(s) { s = str(s); return s ? "••••" + s.slice(-4) : ""; }
  function aiGet() { return DB.setting("ai", {}).then(function (d) { return d || {}; }); }
  function aiStatus() {
    return aiGet().then(function (d) {
      return { gemini: !!d.geminiKey, geminiKey: tail4(d.geminiKey), model: str(d.model), sms: false, smsKey: "", smsFrom: "", lite: true };
    });
  }
  API.appAiStatus = function () { return aiStatus(); };
  API.appAiSettingsSave = function (o) {
    o = o || {};
    return aiGet().then(function (d) {
      if (o.geminiKey !== undefined && String(o.geminiKey).indexOf("••••") !== 0) {
        var k = String(o.geminiKey).trim();
        if (k) d.geminiKey = k; else { delete d.geminiKey; delete d.model; }
      }
      return DB.saveSetting("ai", d);
    }).then(aiStatus);
  };
  API.appAiKey = function () { return aiGet().then(function (d) { return { key: str(d.geminiKey), model: str(d.model), models: GEMINI_MODELS }; }); };
  API.appAiModelSave = function (m) {
    if (!m) return Promise.resolve(true);
    return aiGet().then(function (d) { d.model = String(m).slice(0, 80); return DB.saveSetting("ai", d); }).then(function () { return true; });
  };
  function needKey() { return aiGet().then(function (d) { if (!d.geminiKey) throw err("AI 키가 없어요. [AI 연결]에서 Gemini 키를 넣어 주세요."); }); }
  API.appAiRepairParts = function (jobId, memo) {
    return needKey().then(function () { return Promise.all([API.appRPhotoList(jobId), pricesGet()]); }).then(function (a) {
      var ps = a[0].filter(function (x) { return String(x.id).charAt(0) === "R"; }).slice(-3), prices = a[1];
      if (!ps.length) throw err("수리할 곳 사진을 먼저 찍어 주세요.");
      var kinds = [];
      prices.forEach(function (x) { if (kinds.indexOf(x.kind) < 0) kinds.push(x.kind); });
      var list = prices.map(function (x) { return x.kind + " | " + x.item + " | " + x.unit; }).join("\n");
      var parts = [{ text:
        "당신은 한국 빌라·원룸 수리 견적을 돕는 도우미입니다. 아래 사진(수리할 곳)" + (memo ? "과 메모(" + memo + ")" : "") + "를 보고 JSON으로만 답하세요.\n" +
        '{"types":[수리 종류],"memo":"사진에서 보이는 문제 한 줄 (30자 안)","scope":"부분|방 하나|집 전체","pyeong":평수 숫자 또는 null,' +
        '"items":[{"kind":"종류","item":"항목 이름 그대로","qty":숫자}],"note":"주의할 점 한 줄","confidence":"high|mid|low"}\n' +
        "수리 종류는 다음 중에서만: " + kinds.join(", ") + "\n항목은 아래 목록의 이름을 글자 그대로 쓰고, 필요한 항목만 넣으세요 (종류 | 항목 | 단위):\n" + list +
        "\n크기를 알 수 없으면 작게 잡고 confidence 를 low 로 하세요. 금액은 쓰지 마세요." }];
      return Promise.all(ps.map(function (x) { return API.appRPhotoGet(x.id).then(function (b) { return b || x.thumb; }); })).then(function (bs) {
        bs.forEach(function (b) { if (b) parts.push({ inline_data: { mime_type: "image/jpeg", data: b } }); });
        return { parts: parts, kinds: kinds, prices: prices.map(function (x) { return { kind: x.kind, item: x.item }; }) };
      });
    });
  };
  API.appAiSheetParts = function (photoId) {
    return needKey().then(function () { return API.appRPhotoGet(photoId); }).then(function (b) {
      if (!b) throw err("속지 사진을 찾을 수 없어요.");
      return { parts: [{ text:
        "신축 빌라 분양속지(분양 안내표) 사진입니다. 표를 읽어 JSON으로만 답하세요.\n" +
        '{"units":[{"no":"302","price":"2억3천","type":"방3 화2 · 24평","status":"남음|진행|완료"}],"fee":"중개 수수료(보이면)","cond":"분양 조건 요약 3줄 안 (대출·입주금·지원금·옵션)","due":"준공·입주 시기(보이면)"}\n' +
        "호수는 숫자만. 가격은 '2억3천', '2억2,500' 처럼 속지에 적힌 대로. 계약완료·분양완료·빗금·X 표시는 완료, 계약중·가계약은 진행, 나머지는 남음. 읽을 수 없는 칸은 빼세요." },
        { inline_data: { mime_type: "image/jpeg", data: b } }] };
    });
  };
  // 솔라피 완전 자동은 판매용 v1.0 에 없음 (내 핸드폰으로 차례로 보내기만)
  API.appSmsStatus = function () { return Promise.resolve([]); };
  API.appSmsStop = function () { return Promise.resolve(0); };
  API.appSmsQueue = function () { return Promise.reject(err("발품 앱은 '내 핸드폰으로 차례로 보내기'만 돼요.")); };
  API.appSmsTest = API.appSmsQueue;

  /* ======================= 사무소 · 무료 체험 ======================= */
  var Office = {
    get: function (force) { return loadAccount(force); },
    save: function (o) {
      var u = Auth.user();
      if (!u) return Promise.reject(err("로그인이 필요해요."));
      var f = {};
      ["member_type", "office_name", "ceo", "reg_no", "tel", "mobile", "addr"].forEach(function (k) { if (o[k] !== undefined) f[k] = str(o[k]).trim().slice(0, 200); });
      return rest("PATCH", "accounts?owner=eq." + enc(u.id), f, "return=representation").then(function (rows) {
        ACCOUNT = rows && rows[0] ? rows[0] : ACCOUNT; return ACCOUNT;
      });
    },
    usage: function () {                      // 무료 체험 남은 건수
      var badge = rpc("my_badge", {}).catch(function () { return null; });   // 🏅 매너 배지면 무료 칸 +10 (v1.5)
      return Promise.all([loadAccount(true), loadConfig(), DB.list("listing"), badge]).then(function (a) {
        var acc = a[0] || {}, cfg = a[1] || {}, rows = a[2] || [], bd = a[3] || {};
        var bonus = Number(bd.bonus) || 0;
        var limit = (Number(cfg.free_limit) || 80) + bonus, used = Number(acc.total_registered) || 0;
        var active = rows.filter(function (r) { var s = str((r.data || {}).status) || "진행중"; return s === "진행중"; }).length;
        return { plan: acc.plan || "free", used: used, limit: limit, left: Math.max(0, limit - used), active: active, total: rows.length, bonus: bonus, badge: !!bd.badge, manner: Number(bd.manner) || 0,
                 enforce: cfg.enforce_limit === true || cfg.enforce_limit === "true", notice: str(cfg.notice) };
      });
    }
  };

  /* ---------------- 화면에서 부르는 입구 ---------------- */
  /* ======================= 손님 방 (v1.3) ======================= */
  function rpc(name, args) { return rest("POST", "rpc/" + name, args || {}); }
  function custEmail(phone) { return "c" + String(phone || "").replace(/\D/g, "") + "@customer.balpum.kr"; }
  function newCode() { var a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = ""; for (var i = 0; i < 6; i++) s += a[Math.floor(Math.random() * a.length)]; return s; }
  var Room = {
    custEmail: custEmail,
    info: function (code) {                    // 로그인 전에도: 초대한 사무소 이름·전화
      return fetchJson(BASE + "/rest/v1/rpc/invite_info", { method: "POST", headers: { "apikey": KEY, "Authorization": "Bearer " + KEY, "Content-Type": "application/json" }, body: JSON.stringify({ c: String(code || "") }) })
        .then(function (r) { return r.ok ? r.body : null; });
    },
    join: function (code, name, phone, pin, purpose, via) {
      var em = custEmail(phone);
      return Auth.signUp(em, pin, { role: "customer", office_name: name, mobile: phone, member_type: "손님" }).then(function (r) {
        if (r.needConfirm) throw err("서버에서 '가입 확인 메일'이 켜져 있어 손님이 들어올 수 없어요. 사무소에 알려 주세요.");
      }, function (e) {
        if (/이미 가입/.test(e.message)) return Auth.signIn(em, pin).catch(function () { throw err("이 전화번호는 이미 가입돼 있어요 (예전 방이 그대로 있어요). 처음 정한 숫자 6자리를 넣거나, 잊었으면 [← 뒤로] → [전에 들어왔어요]에서 들어오세요. 숫자가 기억나지 않으면 부동산 사장님께 \"숫자 비밀번호 다시 정해 주세요\"라고 부탁하세요."); });
        throw e;
      }).then(function () { ACCOUNT = null; return rpc("join_invite", { c: code, nm: name, ph: phone, purpose: purpose || "", via: via || "" }); });
    },
    login: function (phone, pin) {
      return Auth.signIn(custEmail(phone), pin).then(function () { ACCOUNT = null; return true; }, function (e) {
        throw err(/맞지 않아요/.test(e.message) ? "전화번호나 숫자 비밀번호가 맞지 않아요." : e.message); });
    },
    myAgent: function (ag) {                   // v1.8: 부동산이 여럿이면 고른 곳 (서버가 예전이면 1순위 하나)
      if (!ag) return rpc("my_agent");
      return rpc("my_agent_of", { ag: ag }).catch(function () { return rpc("my_agent"); });
    },
    agents: function () { return rpc("my_agents", {}).catch(function () { return rpc("my_agent").then(function (a) { return a ? [Object.assign({ main: true, off: false }, a)] : []; }); }); },
    agentSet: function (ag, act) { return rpc("my_agent_set", { ag: ag, act: act }); },
    joinMore: function (code, via) { return rpc("join_more", { c: String(code || "").toUpperCase(), via: via || "" }); },
    seenAg: function (ag) { return rpc("mark_seen_ag", { ag: ag }).catch(function () {}); },
    banner: function () { return rpc("banner_invite", {}); },
    bannerSet: function (off) { return rpc("banner_invite_set", { off_: !!off }); },
    links: function () { return rest("GET", "links?select=*&order=created_at.desc"); },
    msgs: function (agent, customer, after) {
      return rest("GET", "msgs?select=*&agent=eq." + enc(agent) + "&customer=eq." + enc(customer) + (after ? "&id=gt." + enc(after) : "") + "&order=id.asc");
    },
    recent: function () { var u = Auth.user(); return rest("GET", "msgs?select=id,customer,from_agent,kind,body,created_at&agent=eq." + enc(u ? u.id : "") + "&order=id.desc&limit=300"); },
    send: function (agent, customer, fromAgent, kind, body) {
      return rest("POST", "msgs", { agent: agent, customer: customer, from_agent: !!fromAgent, kind: kind || "text", body: body || {} }, "return=minimal");
    },
    seen: function (customer) { return rpc("mark_seen", { cust: customer }); },
    invite: function (memo) {
      var u = Auth.user(); if (!u) return Promise.reject(err("로그인이 필요해요."));
      var code = newCode();
      return rest("POST", "invites", { code: code, agent: u.id, memo: str(memo).slice(0, 300) }, "return=minimal").then(function () { return code; });
    },
    gift: function () { return rpc("gift_invite", {}); }           // 🎁 직빵 young call 선물 (v1.4)
  };

  /* ======================= 🤝 발품 공유방 (v1.4 · 같은 동네) ======================= */
  var Share = {
    me: function () { return rpc("share_me", {}); },
    setDong: function (d) { return rpc("share_set_dong", { d: str(d) }); },
    feed: function () { return rpc("share_feed", {}).then(function (r) { return r || []; }); },
    post: function (k, t, b) { return rpc("share_post", { k: k, t: str(t), b: b || {} }); },
    req: function (pid, m) { return rpc("share_req", { pid: pid, m: str(m) }); },
    my: function () { return rpc("share_my", {}).then(function (r) { return r || { posts: [], sent: [] }; }); },
    answer: function (rid, st) { return rpc("share_answer", { rid: rid, st: st }); },
    status: function (pid, st) { return rpc("share_status", { pid: pid, st: st }); },
    del: function (pid) { return rpc("share_delete", { pid: pid }); },
    rate: function (pid, who, sc, m, o) {                                   // v1.5: 매너 체크 같이
      o = o || {};
      return rpc("share_rate2", { pid: pid, who: who, sc: sc, m: str(m), fee: !!o.fee, promise: !!o.promise, broke: !!o.broke });
    },
    agree: function () { return rpc("share_agree", {}); },
    extend: function (rid) { return rpc("share_extend", { rid: rid }); },
    visit: function (rid, m) { return rpc("share_visit", { rid: rid, m: str(m) }); },
    unread: function () { return rpc("share_unread", {}).then(function (n) { return Number(n) || 0; }).catch(function () { return 0; }); },
    seen: function () { return rpc("share_mark_seen", {}).catch(function () {}); },
    badge: function () { return rpc("my_badge", {}).catch(function () { return { badge: false, manner: 0, bonus: 0 }; }); },
    // v1.6 🤝 같이 보기 방
    roomOpen: function (pid, m) { return rpc("share_room_open", { pid: pid, m: str(m) }); },
    rooms: function (pid) { return rpc("share_room_list", { pid: pid }).then(function (r) { return r || []; }); },
    myRooms: function () { return rpc("share_my_rooms", {}).then(function (r) { return r || []; }); },
    room: function (rid) { return rpc("share_room_get", { rid: rid }); },
    roomSend: function (rid, k, b) { return rpc("share_room_send", { rid: rid, k: k, b: b || {} }); },
    roomEdit: function (mid, b) { return rpc("share_room_edit", { mid: mid, b: b || {} }); },
    roomDel: function (mid) { return rpc("share_room_del", { mid: mid }); },
    roomPick: function (mid, on) { return rpc("share_room_pick", { mid: mid, on_: !!on }); },
    roomJoin: function (rid) { return rpc("share_room_join", { rid: rid }); },
    roomClose: function (rid) { return rpc("share_room_close", { rid: rid }); },
    postEdit: function (pid, t, b) { return rpc("share_post_edit", { pid: pid, t: str(t), b: b || {} }); },
    planSend: function (pid, day, items) { return rpc("share_plan_send", { pid: pid, dday: str(day), items: items || [] }); }
  };
  var Push = { save: function (t) { return rpc("push_save", { t: str(t) }).catch(function () { return false; }); } };

  function call(fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    var f = API[fn];
    if (!f) return Promise.reject(err("발품 앱에 없는 기능이에요 (" + fn + ")"));
    args = args.slice(1);                                      // 첫 칸(예전 비밀번호)은 버림 — 로그인으로 바뀜
    try { return Promise.resolve(f.apply(null, args)); } catch (e) { return Promise.reject(e); }
  }

  // v1.7 💳 요금 · 🎫 이용권 · 관리자
  var Plan = {
    me: function () { return rpc("my_plan", {}); },
    redeem: function (c) { return rpc("ticket_redeem", { c: str(c) }); },
    pay: function (payer, m, memo) { return rpc("pay_request", { payer: str(payer), m: Number(m) || 1, memo: str(memo) }); },
    payCancel: function () { return rpc("pay_cancel", {}); },
    admin: function () { return rpc("admin_offices", {}); },
    adminSet: function (who, act, m) { return rpc("admin_set", { who: who, act: act, m: Number(m) || 1 }); },
    make: function (m, n, who, memo) { return rpc("ticket_make", { m: Number(m), n: Number(n) || 1, who: who || null, memo: str(memo) }); },
    tickets: function () { return rpc("ticket_list", {}); },
    cancel: function (id) { return rpc("ticket_cancel", { tid: id }); },
    // 🔑 손님 숫자 비밀번호 다시 정하기 (push 일꾼이 바꿔 줌)
    pinReset: function (cust, pin) {
      return ensureSession().then(function (s) {
        return fetchJson(BASE + "/functions/v1/push", { method: "POST", headers: { "apikey": KEY, "Authorization": "Bearer " + s.access_token, "Content-Type": "application/json" },
          body: JSON.stringify({ action: "pin", cust: cust, pin: str(pin) }) });
      }).then(function (r) { var b = r.body || {}; if (!r.ok || !b.ok) throw err(b.error || "바꾸지 못했어요. 푸시 일꾼(push)을 v1.7 로 바꿨는지 확인해 주세요."); return true; });
    }
  };
  window.BALPUM = { call: call, Auth: Auth, Office: Office, API: API, DB: DB, Room: Room, Share: Share, Push: Push, Plan: Plan, nowStr: nowStr, config: CFG,
                    _setBase: function (b, k) { BASE = b; KEY = k || KEY; } };
})();
