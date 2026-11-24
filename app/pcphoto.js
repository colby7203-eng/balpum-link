/* =====================================================================
   발품투어 매물장 v1.7 — 📁 PC 사진 보관 폴더 (PC 크롬 · 엣지)
   · 처음 한 번 [📁 사진 보관 폴더 정하기] → 허락 → 그다음부터 PC판을 열면 새 사진을 저절로 받아
     매물별 폴더(번호_매물이름\날짜\1.jpg …)에 정리
   · [⬇ 지금 받기] · [자동 받기 켜기 / 끄기] · [폴더 바꾸기] · [폴더 연결 끊기]
   · 웹 앱은 허락 없이 PC에 폴더를 못 만들어서 처음 한 번 고르기는 꼭 필요해요
   Made by 정동철 · 상상을 현실로
   ===================================================================== */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  function e(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function say(t) { if (window.toast) window.toast(t); }
  var CAN = !!window.showDirectoryPicker && !(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform());
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (er) { return null; } }

  // 폴더 손잡이는 IndexedDB 에 보관 (브라우저가 기억)
  function idb() { return new Promise(function (ok, no) { var r = indexedDB.open("bp_pc", 1); r.onupgradeneeded = function () { r.result.createObjectStore("kv"); }; r.onsuccess = function () { ok(r.result); }; r.onerror = function () { no(r.error); }; }); }
  function kv(k, v) { return idb().then(function (db) { return new Promise(function (ok, no) {
    var tx = db.transaction("kv", v === undefined ? "readonly" : "readwrite"), st = tx.objectStore("kv");
    var q = v === undefined ? st.get(k) : v === null ? st.delete(k) : st.put(v, k);
    q.onsuccess = function () { ok(q.result); }; q.onerror = function () { no(q.error); }; }); }); }
  function getDir() { return CAN ? kv("dir").catch(function () { return null; }) : Promise.resolve(null); }
  function perm(dir, ask) { var o = { mode: "readwrite" }; return dir.queryPermission(o).then(function (p) { return p === "granted" ? true : ask ? dir.requestPermission(o).then(function (q) { return q === "granted"; }) : false; }); }

  function safe(s) { return String(s || "").replace(/[\\\/:*?"<>|\n\r\t]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 60) || "매물"; }
  function hash(s) { var h = 5381, n = Math.min(s.length, 4000); for (var i = 0; i < n; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36) + "_" + s.length; }
  function today() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function toBlob(u) { return fetch(u).then(function (r) { return r.blob(); }); }
  var RUN = false;
  function sync(dir, quiet) {
    if (RUN) return Promise.resolve(0); RUN = true;
    var done = {}; try { done = JSON.parse(ls("bp_pc_done") || "{}"); } catch (er) {}
    var saved = 0;
    return BALPUM.API.appList().then(function (items) {
      items = (items || []).filter(function (it) { return (Number(it.photo_count) || 0) > 0 && !/^휴지통/.test(String(it.status || "")); });
      var chain = Promise.resolve();
      items.forEach(function (it) {
        chain = chain.then(function () {
          return BALPUM.API.appPhotos(it.id).then(function (big) {
            var lines = String(big || "").split("\n").map(function (x) { return x.trim(); }).filter(function (x) { return /^data:image|^https?:/.test(x); });
            var have = done[it.id] || [], fresh = lines.filter(function (l) { return have.indexOf(hash(l)) < 0; });
            if (!fresh.length) return;
            return dir.getDirectoryHandle(safe(it.id + "_" + (it.name || "")), { create: true })
              .then(function (d1) { return d1.getDirectoryHandle(today(), { create: true }); })
              .then(function (d2) {
                var c2 = Promise.resolve(), n = 0;
                fresh.forEach(function (l) { c2 = c2.then(function () { n++; var nm = ("0" + (have.length + n)).slice(-2) + ".jpg";
                  return d2.getFileHandle(nm, { create: true }).then(function (fh) { return fh.createWritable(); })
                    .then(function (w) { return toBlob(l).then(function (b) { return w.write(b); }).then(function () { return w.close(); }); })
                    .then(function () { have.push(hash(l)); saved++; }); }); });
                return c2.then(function () { done[it.id] = have; ls("bp_pc_done", JSON.stringify(done)); });
              });
          }).catch(function () {});
        });
      });
      return chain;
    }).then(function () {
      RUN = false; ls("bp_pc_last", new Date().toLocaleString("ko-KR"));
      if (!quiet || saved) say(saved ? "📁 새 사진 " + saved + "장을 PC 폴더에 넣었어요" : "📁 새 사진이 없어요 (모두 받아 두었어요)");
      return saved;
    }, function (er) { RUN = false; say("사진 받기 오류: " + ((er && er.message) || er)); return 0; });
  }

  // 내 사무소 카드
  window.bpPcPhotoCard = function () { if (!CAN) return ''; setTimeout(fill, 40); return '<div class="card" id="pcCard"><div class="sect" style="margin-top:0">📁 PC 사진 보관 폴더</div><div class="hint">불러오는 중…</div></div>'; };
  function fill() {
    var box = $("pcCard"); if (!box) return;
    getDir().then(function (dir) {
      var auto = ls("bp_pc_auto") !== "0";
      box.innerHTML = '<div class="sect" style="margin-top:0">📁 PC 사진 보관 폴더</div>' +
        (dir ? '<div>폴더: <b>' + e(dir.name) + '</b> · 자동 받기 <b>' + (auto ? "켜짐" : "꺼짐") + '</b></div><div class="hint" style="margin-top:2px">마지막으로 받은 때: ' + e(ls("bp_pc_last") || "아직") + '</div>'
             : '<div class="hint" style="margin-top:0">핸드폰으로 찍은 매물 사진을 이 PC 폴더에 매물별로 저절로 모아 둬요. 처음 한 번 폴더를 고르고 [허용]을 눌러 주세요 (예: 문서 → 새 폴더 "발품사진").</div>') +
        '<div class="pbtns" style="flex-wrap:wrap">' + (dir ? '<button class="pbtn" id="pcNow">⬇ 지금 받기</button><button class="pbtn" id="pcAuto">' + (auto ? "자동 받기 끄기" : "자동 받기 켜기") + '</button><button class="pbtn" id="pcPick">폴더 바꾸기</button><button class="pbtn" id="pcOff">폴더 연결 끊기</button>'
          : '<button class="pbtn" id="pcPick">📁 사진 보관 폴더 정하기</button>') + '</div>' +
        '<div class="hint">사진 원본은 서버에도 그대로 있어요. 이 폴더는 PC에 한 벌 더 두는 곳이에요. (PC 크롬 · 엣지에서만 돼요)</div>';
      if ($("pcPick")) $("pcPick").onclick = function () {
        window.showDirectoryPicker({ id: "balpum-photos", mode: "readwrite", startIn: "documents" }).then(function (d) { return kv("dir", d).then(function () { ls("bp_pc_auto", "1"); say("📁 " + d.name + " 폴더로 정했어요. 사진을 받아요…"); fill(); return sync(d); }); })
          .catch(function (er) { if (er && er.name !== "AbortError") say("폴더를 정하지 못했어요: " + er.message); });
      };
      if ($("pcNow")) $("pcNow").onclick = function () { var b = this; b.disabled = true; b.textContent = "받는 중…";
        perm(dir, true).then(function (ok) { if (!ok) throw new Error("폴더 허락이 필요해요"); return sync(dir); }).then(function () { fill(); }, function (er) { say(er.message); fill(); }); };
      if ($("pcAuto")) $("pcAuto").onclick = function () { ls("bp_pc_auto", auto ? "0" : "1"); say(auto ? "자동 받기를 껐어요" : "자동 받기를 켰어요"); fill(); };
      if ($("pcOff")) $("pcOff").onclick = function () { if (!confirm("PC 폴더 연결을 끊을까요? (폴더 안 사진은 그대로 남아요)")) return; kv("dir", null).then(function () { ls("bp_pc_done", null); ls("bp_pc_last", null); say("연결을 끊었어요"); fill(); }); };
    });
  }

  // PC판을 열 때: 허락이 살아 있으면 조용히 받기, 아니면 첫 화면에 단추 하나
  window.bpPcPhotoAuto = function (el) {
    if (!CAN || ls("bp_pc_auto") === "0") return;
    getDir().then(function (dir) {
      if (!dir) return;
      perm(dir, false).then(function (ok) {
        if (ok) { sync(dir, true); return; }
        if (!el || $("pcAsk")) return;
        el.insertAdjacentHTML("beforeend", '<button type="button" class="btn ghost" id="pcAsk" style="margin:6px 0 0">📁 새 사진을 PC 폴더(' + e(dir.name) + ')로 받기</button>');
        $("pcAsk").onclick = function () { var b = this; perm(dir, true).then(function (g) { if (g) { b.remove(); sync(dir); } else say("허락해야 받을 수 있어요"); }); };
      });
    });
  };
})();
