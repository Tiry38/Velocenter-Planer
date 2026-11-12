# HANDOFF – Planer (Stand 12.11.2026, Version 1.10.71)

Alles Ausgelieferte steht in `CLAUDE.md` §6. Hier nur, was offen ist.

## Zuletzt ausgeliefert
- 1.10.68 / 1.10.70: Navi passt sich Browser-Zoom an (`navFit`, misst mit `height:0px`).
- 1.10.69: Auto-Mail – Hand-Anrede (`anr`) vor Firma-Erkennung; Listen bei gleichem Datum fest nach Name sortiert.
- 1.10.71: **📦 Vororder** im Reiter Bestellungen (`meta/vororder`, `rvo`, „📋 Liste einfügen“).

## Offen
1. **Vororder mit echten Daten im Laden prüfen** (Tiry). Wenn Tiry eine Vororder schickt: als Text im Format
   `Artikel ; Art.-Nr. ; Größe/Farbe ; Menge ; Kommt am` (eine Zeile je Artikel) zurückgeben – Tiry fügt sie über „📋 Liste einfügen“ ein. Kein Firebase-Zugang für Claude.
2. **`firestore.rules` in der Konsole veröffentlichen** (Tiry): `meta/mailauto|mailcfg|mailtpl` nur Admins, `meta/kd_*` nur Admins.
3. Audit-Vorschläge 2, 3, 7 (aus Audit 06.11.) – nicht beauftragt.
4. Verbesserungsvorschläge 1–5 aus früherer Sitzung – nicht beauftragt.
5. Text „Kalenderwoche“ wird bei sehr starkem Browser-Zoom abgeschnitten (klein, nicht beauftragt).

## Arbeitsweise
- Quelle `src/`, bauen `cd src && python3 build.py <ver>`, Kurztest `cd src/tests && node quick.js`.
- Ausliefern: commit, `git push origin HEAD:main`, dann Branch `claude/optimistic-ptolemy-e375hk` pushen. Version in CLAUDE.md hochzählen.
- CSS-Klassen `.c`, `.lc`, `.mono` sind im Planer belegt → in neuen Bereichen eigene Präfixe.
