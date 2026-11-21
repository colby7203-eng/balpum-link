// 발품투어 매물장 — PC 바탕화면 아이콘(앱 설치)용. 자료는 늘 서버에서 새로 받음 (저장해 두지 않음)
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", function () { /* 그냥 통과 */ });
