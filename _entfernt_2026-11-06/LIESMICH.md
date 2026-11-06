# Beim Audit am 06.11.2026 entfernt / geändert

`audit-aenderungen.patch` = alle Änderungen an `src/app_fb.js`, `src/head.html`, `src/sections.css`, `src/build.py` gegenüber Version 1.10.61.
Wiederherstellen (alles zurück): im Repo `git apply -R _entfernt_2026-11-06/audit-aenderungen.patch`, dann `cd src && python3 build.py <Version>`.
Einfacher: Version 1.10.61 = Commit `b06f5c5` auf `main`.

Entfernt (nirgends mehr benutzt, geprüft im Code und zur Laufzeit in allen Reitern):
- CSS-Klassen: cfgacc, clogo, cpy, demo, facts, flow, flowl, fx, halo, kpis, kwb, kx, lcard, lease, lockb, okv, pwrow, quick, rk1, rkm, secure, seller, setg, setrow, setsec, model, aul, rks, nt, rt, #kdTab
- JS: sessionLost, bF, bModel, bIco, cmpN, cmpE, spanN, spanE, spanP, vkF
- Schrift „Chakra Petch“ (wurde geladen, aber durch Outfit überschrieben)
- build.py: Ersetzung für das alte Navi-Logo (#navLogo) und CSS für den entfernten Vollbild-Knopf (#meFull)
