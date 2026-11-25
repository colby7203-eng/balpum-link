/* =====================================================================
   발품투어 매물장 v1.8 — 🖨 손님 초대 배너 (시안 19 · 20 · 17 · 21 모양)
   · BP_BANNER.phone(o)  : 핸드폰 화면 (손님에게 보내기 · 홈페이지 banner.html) — 단추 또는 QR
   · BP_BANNER.a4(o)     : A4 출력 (사무소 띠 or 우편용: 상호 없이)
   · BP_BANNER.xb(o)     : 세워 두는 X배너 60×180cm
   o = { office, ceo, tel, mobile, email, show:{ceo,tel,mobile,email}, mail, qr(그림 주소), apk, web, foot(발 그림 주소) }
   Made by 정동철 · 상상을 현실로
   ===================================================================== */
(function () {
  "use strict";
  function h(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Nanum+Brush+Script&family=Noto+Sans+KR:wght@500;700;900&family=Permanent+Marker&display=swap" rel="stylesheet">';
  var BR = "font-family:'Nanum Brush Script','Nanum Pen Script',cursive";
  var NAESI = '<svg viewBox="0 0 320 420" width="100%" height="100%" role="img" aria-label="두 손을 소매에 모으고 고개를 숙인 내시"><g transform="rotate(7 160 330)" stroke="#141414" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">' +
    '<path d="M60 420 L70 318 Q80 262 160 256 Q240 262 250 318 L260 420 Z" fill="#2E5E4E"/><path d="M122 262 Q160 300 198 262" fill="#E9E2CF"/><rect x="68" y="372" width="184" height="14" rx="6" fill="#B3263A"/>' +
    '<path d="M150 386 L144 418 M170 386 L176 418" fill="none" stroke="#B3263A" stroke-width="6"/><rect x="66" y="292" width="188" height="66" rx="32" fill="#3B7462"/><path d="M160 296 L160 354" fill="none" stroke-width="4"/>' +
    '<path d="M98 300 Q90 325 98 350 M222 300 Q230 325 222 350" fill="none" stroke-width="3.5"/><circle cx="160" cy="198" r="64" fill="#F6D2B0"/><circle cx="96" cy="206" r="12" fill="#F6D2B0"/><circle cx="224" cy="206" r="12" fill="#F6D2B0"/>' +
    '<rect x="102" y="140" width="116" height="28" rx="9" fill="#151515"/><rect x="118" y="100" width="84" height="48" rx="18" fill="#1b1b1b"/><path d="M126 200 Q136 210 146 200" fill="none"/><path d="M174 200 Q184 210 194 200" fill="none"/>' +
    '<path d="M126 184 Q136 178 146 184 M174 184 Q184 178 194 184" fill="none" stroke-width="3.5"/><path d="M148 230 Q160 240 172 230" fill="none" stroke-width="4.5"/></g>' +
    '<g transform="rotate(7 160 330)"><ellipse cx="124" cy="218" rx="11" ry="7" fill="#F49A9A"/><ellipse cx="196" cy="218" rx="11" ry="7" fill="#F49A9A"/></g>' +
    '<path d="M262 150 Q278 160 284 178 M276 128 Q296 140 302 162" fill="none" stroke="#141414" stroke-width="4" stroke-linecap="round"/><text x="270" y="122" font-family="Nanum Brush Script, cursive" font-size="40" fill="#C8102E" transform="rotate(14 270 122)">꾸벅</text></svg>';
  var IC = {
    home: '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="#C8102E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',
    cal: '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="#1E2A78" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8 14h2M14 14h2M8 17h2"/></svg>',
    yc: '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="#0F766E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/></svg>'
  };
  var CSS = '.bpb{position:relative;overflow:hidden;background:#FFD43B;font-family:"Noto Sans KR",sans-serif;color:#141414;display:flex;flex-direction:column;box-sizing:border-box}' +
    '.bpb *{box-sizing:border-box}.bpb .fly{position:absolute;z-index:3;text-align:center;white-space:nowrap;' + BR + ';line-height:1.05;border:2px solid #141414;box-shadow:2px 3px 0 rgba(0,0,0,.25);animation:bpFly 6s ease-in-out infinite}' +
    '.bpb .y{background:#FFE8A3;border-radius:3px 16px 3px 16px}.bpb .g{background:#DCEFD3;border-radius:5px;outline:1.5px dashed #5E8C5A;outline-offset:-5px}' +
    '.bpb .gust{stroke-dasharray:40 260;animation:bpGust 3s linear infinite}' +
    '@keyframes bpFly{0%,100%{transform:translate(0,0) rotate(var(--r))}25%{transform:translate(5px,-6px) rotate(calc(var(--r) + 7deg))}50%{transform:translate(-3px,-10px) rotate(calc(var(--r) - 4deg))}75%{transform:translate(-6px,-4px) rotate(calc(var(--r) + 4deg))}}' +
    '@keyframes bpGust{0%{stroke-dashoffset:300}100%{stroke-dashoffset:0}}' +
    '.bpb.still .fly,.bpb.still .gust{animation:none!important}.bpb.still .gust{stroke-dasharray:none}' +
    '@media (prefers-reduced-motion:reduce){.bpb .fly,.bpb .gust{animation:none!important}}' +
    '.bpb .logo{display:inline-flex;align-items:center;gap:.16em}.bpb .logo img{border-radius:.28em;transform:rotate(-10deg)}.bpb .logo .k{' + BR + ';line-height:1;-webkit-text-stroke:.03em #141414}.bpb .logo .e{font-family:"Permanent Marker",cursive;color:#C8102E;transform:rotate(-6deg) translateY(-.25em);font-size:.47em}' +
    '.bpb .card3{background:#fff;border:3px solid #141414;border-radius:16px;box-shadow:3px 3px 0 #141414;display:flex;gap:10px;align-items:center}.bpb .card3 .t{' + BR + ';line-height:1}.bpb .card3 .d{font-weight:700;line-height:1.45;color:#2b2b2b}' +
    '.bpb .tag{color:#fff;background:#C8102E;border-radius:999px;padding:0 .5em;font-size:.78em;white-space:nowrap}' +
    '.bpb .band{background:#1E2A78;color:#fff}.bpb .band .y2{color:#FFD43B}.bpb .band .mk{font-weight:700;color:#1E2A78;background:#E5E9FF;border-radius:999px;padding:0 .55em}' +
    '.bpb a.bt{display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;border:3px solid #141414;border-radius:16px;font-weight:900}';
  function logo(foot, px) { return '<span class="logo" style="font-size:' + px + 'px"><img src="' + h(foot) + '" alt="" style="width:1em;height:1em"><span class="k">발품</span><span class="e">TOUR</span></span>'; }
  function wind(w, hgt, sw) {
    return '<svg aria-hidden="true" viewBox="0 0 390 150" width="' + w + '" height="' + hgt + '" preserveAspectRatio="none" style="position:absolute;left:0;top:0"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-width="' + (sw || 4) + '" opacity=".95">' +
      '<path class="gust" d="M-10 40 C 60 15, 110 70, 190 40 S 280 10, 400 36"/><path class="gust" d="M-10 110 C 80 85, 140 140, 230 108 Q 260 96, 256 78" style="animation-delay:-1.4s"/><path class="gust" d="M200 128 C 260 104, 320 150, 400 118" style="animation-delay:-.7s"/></g></svg>';
  }
  // 날리는 말 종이 4장 (k = 크기 배율)
  function notes(k, W) {
    var N = [["소문내기<br>싫어요~", "y", 12, 14, 98, -12, 0], ["조용히<br>팔아 주세요~", "g", 140, 4, 108, 6, -1], ["왜 내 집만<br>안 팔리지~?", "g", 268, 26, 104, 12, -2], ["여기저기 시세<br>알아보기 지쳐요", "y", 70, 82, 122, -6, -3]];
    var sx = (W || 390) / 390;
    return N.map(function (n) {
      return '<div class="fly ' + n[1] + '" aria-hidden="true" style="left:' + Math.round(n[2] * sx) + 'px;top:' + Math.round(n[3] * k) + 'px;min-width:' + Math.round(n[4] * k * .8) + 'px;font-size:' + Math.round(19 * k) + 'px;padding:' + Math.round(4 * k) + 'px ' + Math.round(7 * k) + 'px;--r:' + n[5] + 'deg;transform:rotate(' + n[5] + 'deg);animation-delay:' + n[6] + 's">' + n[0] + '</div>';
    }).join("");
  }
  function three(k, row) {
    var c = [["home", "우리 집 일", '집 구하기 · 집 내놓기 · <b style="color:#141414">몰래 내놓기</b> <span class="tag">광고 없이</span><br>최저가 확인 · 수리 · 이사'],
             ["cal", "발품TOUR 달력", '음력 · 손 없는 날 · 물때 · 약속 알람<br>가계부 · 택배 기록'],
             ["yc", "직빵 young call", '외국 시골에서 온 동네 친구 샘이랑<br>영어 수다 · 통역 · 단어 찾기']];
    return '<div style="display:flex;' + (row ? 'gap:' + Math.round(12 * k) + 'px' : 'flex-direction:column;gap:' + Math.round(8 * k) + 'px') + ';width:100%">' + c.map(function (x) {
      return '<div class="card3" style="' + (row ? 'flex:1;min-width:0;flex-direction:column;align-items:flex-start;' : '') + 'padding:' + Math.round(8 * k) + 'px ' + Math.round(12 * k) + 'px;border-width:' + Math.max(3, Math.round(3 * k)) + 'px">' +
        '<div style="display:flex;align-items:center;gap:8px"><span style="width:' + Math.round(30 * k) + 'px;height:' + Math.round(30 * k) + 'px;flex:none">' + IC[x[0]] + '</span>' + (row ? '<span class="t" style="font-size:' + Math.round(27 * k) + 'px">' + x[1] + '</span>' : '') + '</div>' +
        '<div style="min-width:0">' + (row ? '' : '<div class="t" style="font-size:' + Math.round(27 * k) + 'px">' + x[1] + '</div>') + '<div class="d" style="font-size:' + Math.round(13 * k) + 'px">' + x[2] + '</div></div></div>';
    }).join("") + '</div>';
  }
  function head(o, k, pad) {
    return '<div style="position:relative;display:flex;align-items:center;justify-content:space-between;padding:' + pad + ';z-index:4">' + logo(o.foot, Math.round(36 * k)) +
      '<div style="background:#141414;color:#FFD43B;font-weight:900;font-size:' + Math.round(17 * k) + 'px;padding:' + Math.round(4 * k) + 'px ' + Math.round(14 * k) + 'px;border-radius:999px">무료</div></div>';
  }
  function kingEnd(k) {
    return '<div style="position:relative;display:flex;flex-direction:column;align-items:center;text-align:center">' +
      '<div style="' + BR + ';font-size:' + Math.round(66 * k) + 'px;line-height:.95;-webkit-text-stroke:' + (2 * k).toFixed(1) + 'px #141414;white-space:nowrap">손님은 왕!</div>' +
      '<div style="' + BR + ';font-size:' + Math.round(100 * k) + 'px;line-height:.9;color:#C8102E;-webkit-text-stroke:' + (3.5 * k).toFixed(1) + 'px #C8102E;white-space:nowrap;transform:rotate(-2deg)">발품 끝!</div></div>';
  }
  function onlyDown(o, k) {
    return '<div style="position:relative;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px;padding:' + Math.round(12 * k) + 'px 14px 0;text-align:center">' +
      '<span style="font-size:' + Math.round(21 * k) + 'px;font-weight:900">손님은</span><span style="display:inline-flex;align-items:center;background:#fff;border:' + Math.max(3, Math.round(3 * k)) + 'px solid #141414;border-radius:12px;padding:2px 10px 4px 6px;box-shadow:3px 3px 0 #C8102E">' + logo(o.foot, Math.round(32 * k)) + '</span>' +
      '<span style="font-size:' + Math.round(21 * k) + 'px;font-weight:900">만 <span style="color:#C8102E">내려받으시면</span> 됩니다</span></div>';
  }
  function naesi(k) {
    return '<div style="position:relative;display:flex;align-items:flex-end;justify-content:center;padding:' + Math.round(14 * k) + 'px 12px 0">' +
      '<div style="position:relative;background:#fff;border:' + Math.max(3, Math.round(3 * k)) + 'px solid #141414;border-radius:18px;box-shadow:5px 5px 0 #1E2A78;padding:' + Math.round(8 * k) + 'px ' + Math.round(16 * k) + 'px;margin-bottom:' + Math.round(14 * k) + 'px;text-align:center">' +
      '<div style="' + BR + ';font-size:' + Math.round(34 * k) + (k === 1 ? 'px;font-size:min(34px,8vw)' : 'px') + ';line-height:1.04;-webkit-text-stroke:' + (1.4 * k).toFixed(1) + 'px #141414;white-space:nowrap">분부만 내리시옵소서,</div>' +
      '<div style="' + BR + ';font-size:' + Math.round(34 * k) + (k === 1 ? 'px;font-size:min(34px,8vw)' : 'px') + ';line-height:1.04;color:#1E2A78;-webkit-text-stroke:' + (1.4 * k).toFixed(1) + 'px #1E2A78;white-space:nowrap">발품은 저희가<br>팔겠사옵니다.</div>' +
      '<div style="position:absolute;right:-' + Math.round(18 * k) + 'px;bottom:' + Math.round(28 * k) + 'px;border-top:' + Math.round(11 * k) + 'px solid transparent;border-bottom:' + Math.round(11 * k) + 'px solid transparent;border-left:' + Math.round(18 * k) + 'px solid #141414"></div></div>' +
      '<div style="width:' + Math.round(104 * k) + 'px;height:' + Math.round(136 * k) + 'px;flex:none;margin-left:8px">' + NAESI + '</div></div>';
  }
  function freeBadge(k) {
    return '<div style="display:flex;align-items:center;gap:8px;background:#141414;color:#FFD43B;padding:' + Math.round(4 * k) + 'px ' + Math.round(14 * k) + 'px ' + Math.round(7 * k) + 'px;border-radius:12px;transform:rotate(-1deg);box-shadow:4px 4px 0 #C8102E">' +
      '<span style="' + BR + ';font-size:' + Math.round(32 * k) + 'px;line-height:1;white-space:nowrap">앱 하나에 세 가지가 무료</span></div>';
  }
  function slogan(k) { return '<div style="text-align:center;font-weight:900;font-size:' + Math.round(15 * k) + 'px;letter-spacing:.02em;color:#1E2A78;margin-top:' + Math.round(6 * k) + 'px">📱 핸드폰 속 집 앞 부동산</div>'; }
  // 아래 띠: 사무소 (고른 것만) / 우편용 (상호 없이)
  function tel(t) {   // 0325690014 → 032-569-0014 · 01047888605 → 010-4788-8605
    var d = String(t || "").replace(/\D/g, "");
    if (/^02/.test(d)) return d.length === 9 ? d.replace(/^(02)(\d{3})(\d{4})$/, "$1-$2-$3") : d.length === 10 ? d.replace(/^(02)(\d{4})(\d{4})$/, "$1-$2-$3") : t;
    if (/^1\d{3}/.test(d) && d.length === 8) return d.replace(/^(\d{4})(\d{4})$/, "$1-$2");
    if (d.length === 10) return d.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");
    if (d.length === 11) return d.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1-$2-$3");
    return t;
  }
  function band(o, k, pad) {
    var s = o.show || {}, maker = '<div style="margin-top:' + Math.round(6 * k) + 'px;font-size:' + Math.round(11 * k) + 'px;color:#E5E9FF"><span class="mk">앱 제작</span> 상상을 현실로 · Made by 정동철</div>';
    if (o.mail || !o.office) return '<div class="band" style="padding:' + pad + '"><div style="font-size:' + Math.round(20 * k) + 'px;font-weight:900">발품 TOUR <span class="y2" style="font-size:' + Math.round(14 * k) + 'px">· 무료 · 안드로이드 · 아이폰</span></div>' +
      '<div style="font-size:' + Math.round(13 * k) + 'px;color:#E5E9FF">부동산 · 달력 · 영어를 앱 하나로 · 깔면 누가 보냈는지 앱에서 보여요</div>' + maker + '</div>';
    var n = ["ceo", "tel", "mobile", "email"].filter(function (x) { return s[x] && o[x]; }).length, z = n > 3 ? .9 : 1;
    var ln2 = [s.tel && o.tel ? "☎ " + h(tel(o.tel)) + ' <span style="font-size:.75em">(유선)</span>' : "", s.mobile && o.mobile ? "휴대폰 " + h(tel(o.mobile)) : ""].filter(Boolean).join(" · ");
    return '<div class="band" style="padding:' + pad + '"><div style="font-size:' + Math.round(20 * k * z) + 'px;font-weight:900;line-height:1.25">' + h(o.office) + (s.ceo && o.ceo ? ' <span style="font-size:.75em;font-weight:700;color:#E5E9FF">대표 ' + h(o.ceo) + '</span>' : '') + '</div>' +
      (ln2 ? '<div class="y2" style="font-size:' + Math.round(16 * k * z) + 'px;font-weight:900">' + ln2 + '</div>' : '') +
      (s.email && o.email ? '<div style="font-size:' + Math.round(13 * k * z) + 'px;font-weight:700;color:#E5E9FF">이메일 ' + h(o.email) + '</div>' : '') + maker + '</div>';
  }
  function qrBox(o, k, txt) {
    return '<div style="position:relative;background:#fff;border:' + Math.max(3, Math.round(3 * k)) + 'px solid #141414;border-radius:18px;box-shadow:5px 5px 0 #141414;padding:' + Math.round(10 * k) + 'px ' + Math.round(14 * k) + 'px;display:flex;gap:' + Math.round(14 * k) + 'px;align-items:center">' +
      '<div style="width:' + Math.round(96 * k) + 'px;height:' + Math.round(96 * k) + 'px;flex:none;background:#fff;display:flex;align-items:center;justify-content:center">' + (o.qr ? '<img src="' + h(o.qr) + '" alt="QR" style="width:100%;height:100%;image-rendering:pixelated">' : '<b>QR</b>') + '</div>' +
      '<div style="flex:1;min-width:0"><div style="' + BR + ';font-size:' + Math.round(30 * k) + 'px;line-height:1">카메라만 대시면 되옵니다</div><div style="font-size:' + Math.round(13 * k) + 'px;font-weight:700;line-height:1.5;margin-top:4px">' + (txt || '이름 · 전화번호만 적으면 끝<br><span style="color:#C8102E">이 부동산 손님으로 바로 연결돼요</span>') + '</div></div></div>';
  }

  /* ---------- 핸드폰 화면 (시안 19 / 우편 시안 21) ---------- */
  function phone(o) {
    var k = 1, btns = o.qr && !o.apk ? '<div style="padding:16px 16px 0">' + qrBox(o, 1, o.mail ? '우리 동네 부동산이 보낸 선물이에요.<br><span style="color:#C8102E">깔면 누가 보냈는지 앱에서 보여요.</span>' : '') + '</div>' :
      '<div style="position:relative;padding:16px 16px 0;display:flex;flex-direction:column;gap:10px">' +
      '<a class="bt" href="' + h(o.apk || "#") + '" id="bpbApk" style="min-height:58px;background:#F97316;color:#fff;box-shadow:4px 4px 0 #141414;font-size:20px"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>발품투어 내려받기 <span style="font-size:13px;font-weight:700">(안드로이드)</span></a>' +
      '<a class="bt" href="' + h(o.web || "#") + '" id="bpbWeb" style="min-height:50px;background:#fff;color:#141414;font-size:17px">아이폰은 여기서 바로 쓰기</a>' +
      (o.have ? '<a class="bt" href="#" id="bpbHave" style="min-height:44px;background:#E0E7FF;color:#1E2A78;font-size:15px;border-width:2px">이미 발품 앱이 있어요 → 이 부동산 더하기</a>' : '') +
      '<div style="text-align:center;font-size:13px;font-weight:700;color:#3a3a3a">이름 · 전화번호만 적으면 끝 · 이 부동산 손님으로 바로 연결</div></div>';
    return '<div class="bpb' + (o.still ? " still" : "") + '" style="width:100%;max-width:' + (o.w || 430) + 'px;margin:0 auto;min-height:' + (o.minH || 0) + 'px">' +
      head(o, k, "16px 18px 0") +
      '<div style="position:relative;height:150px;flex:none">' + wind("100%", 150) + notes(1) + '</div>' +
      kingEnd(1) + onlyDown(o, 1) + naesi(1) +
      '<div style="position:relative;padding:4px 16px 0;display:flex;flex-direction:column;align-items:center;gap:9px">' + freeBadge(1) + three(1) + slogan(1) + '</div>' +
      btns + '<div style="flex:1;min-height:16px"></div>' + band(o, 1, "14px 18px 16px") + '</div>';
  }

  /* ---------- 문서 틀 ---------- */
  function doc(title, w, h_, pageCss, body) {
    return '<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + h(title) + '</title>' + FONTS +
      '<style>' + CSS + pageCss + 'html,body{margin:0;background:#E5E7EB;-webkit-print-color-adjust:exact;print-color-adjust:exact}.pg{width:' + w + 'px;height:' + h_ + 'px;margin:12px auto;box-shadow:0 2px 12px rgba(0,0,0,.25)}' +
      '.mid{flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column;align-items:center}.midin{display:flex;flex-direction:column;width:100%}.bot{flex:none}' +
      '@media print{html,body{background:#fff}.pg{margin:0;box-shadow:none}.bpb .fly,.bpb .gust{animation:none!important}.bpb .gust{stroke-dasharray:none}}</style></head><body>' + body +
      '<script>var SK=0;function shrink(){if(SK)return;SK=1;var m=document.querySelector(".mid"),i=document.querySelector(".midin");if(!m||!i){SK=0;return}i.style.zoom=1;var r=m.clientHeight/i.scrollHeight;if(r<1)i.style.zoom=Math.max(.5,r-.015);SK=0}' +
      'function fit(){var b=document.querySelector(".pg");if(!b)return;b.style.zoom=1;shrink();var z=Math.min(1,(innerWidth-16)/b.offsetWidth);b.style.zoom=Math.max(.15,z)}' +
      'fit();addEventListener("load",fit);addEventListener("resize",fit);if(document.fonts){document.fonts.ready.then(fit);document.fonts.addEventListener&&document.fonts.addEventListener("loadingdone",fit)}[60,300,800,1500].forEach(function(t){setTimeout(fit,t)});' +
      'if(window.ResizeObserver){var ro=new ResizeObserver(function(){shrink()});var mi=document.querySelector(".midin");if(mi)ro.observe(mi)}' +
      'addEventListener("beforeprint",function(){document.querySelector(".pg").style.zoom=1;shrink()});if(window.matchMedia){var mq=matchMedia("print");mq.addListener&&mq.addListener(function(e){if(e.matches){document.querySelector(".pg").style.zoom=1;shrink()}})}addEventListener("afterprint",fit);<\/script></body></html>';
  }
  /* ---------- A4 (시안 20 모양: 출력용 · 우편용) ---------- */
  function a4(o) {
    var k = 1.5, W = 794;
    var body = '<div class="pg bpb still" style="width:794px;height:1123px">' +
      head(o, 1.3, "24px 46px 0") + '<div class="mid"><div class="midin">' +
      '<div style="position:relative;height:150px;flex:none">' + wind(W, 150, 5) + notes(1.1, W) + '</div>' +
      kingEnd(1.0) + onlyDown(o, 1.2) + naesi(0.95) +
      '<div style="position:relative;padding:2px 40px 6px;display:flex;flex-direction:column;align-items:center;gap:8px">' + freeBadge(1.15) + three(1.0, true) + slogan(1.1) + '</div></div></div>' +
      '<div class="bot"><div style="margin:8px 46px 12px">' + qrBox(o, 1.15, o.mail ? '우리 동네 부동산이 보낸 선물이에요.<br><span style="color:#C8102E">깔면 누가 보냈는지 앱에서 보여요.</span>' : '') + '</div>' +
      band(o, 1.15, "12px 46px 14px") + '</div></div>';
    return doc(o.mail ? "발품 우편용 A4" : "발품 손님 초대 배너 A4", 794, 1123, '@page{size:A4 portrait;margin:0}', body);
  }
  /* ---------- X배너 60×180cm (시안 17) ---------- */
  function xb(o) {
    var k = 1.55, W = 600;
    var body = '<div class="pg bpb still" style="width:600px;height:1800px">' +
      head(o, k, "28px 28px 0") + '<div class="mid"><div class="midin">' +
      '<div style="position:relative;height:240px;flex:none">' + wind(W, 240, 6) + notes(1.45, W) + '</div>' +
      kingEnd(1.45) + onlyDown(o, 1.35) + naesi(1.2) +
      '<div style="position:relative;padding:10px 26px 0;display:flex;flex-direction:column;align-items:center;gap:14px">' + freeBadge(1.45) + three(1.4) + slogan(1.5) + '</div></div></div>' +
      '<div class="bot"><div style="margin:14px 26px 20px">' + qrBox(o, 1.55) + '</div>' + band(o, 1.5, "20px 28px 24px") + '</div></div>';
    return doc("발품 X배너 60x180cm", 600, 1800, '@page{size:600mm 1800mm;margin:0}@media print{.pg{zoom:3.7795!important}}', body);
  }
  window.BP_BANNER = { phone: phone, a4: a4, xb: xb, css: CSS, fonts: FONTS, naesi: NAESI, wind: wind };
})();
