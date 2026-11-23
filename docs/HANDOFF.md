# HANDOFF – Planer (Stand 23.11.2026)

## 1. Stand
- Live: **1.11.20** (main a97eeba, Zweig `claude/optimistic-ptolemy-e375hk` = 07160c1, gleicher Inhalt).
- 1.11.20: Herbstallee-Animation (`#hg`) läuft IMMER durch – Pause nur bei `document.hidden`, aus nur per ⚙ Animationen (`noanim`). Kein 90-s-Stopp, keine Kern-Abschaltung (nicht wieder einbauen).
- Planer wird wieder von der Planer-Sitzung betreut (KI-Zentrale hat bestätigt, ändert den Planer nicht mehr).

## 2. ERLEDIGT in 1.11.21 (23.11.) – siehe CLAUDE.md §6 Herbstallee
(alte Aufgabe:)
„Überprüfe alle Knöpfe etc. und mache die Animationen mit minimaler Leistung, dass PC/Handy mit wenig Leistung kein Ruckeln haben – weniger Leistung, aber keine Qualität verlieren.“

## 3. Nächster Schritt
1. `src/body_fb.html` ab Zeile ~178 lesen: `var FSRC` (Shader, Zeile 182, ~133 Zeilen), `hgDraw`, `hgSize`, `hgFrame`, `QS` (Auflösung 1 → .5), 30 Bilder/s.
2. Teure Stellen finden (Schleifen fürs Laub, Unschärfe-/Tiefen-Abtastungen, Nebel). Ideen: ruhende Ebenen (Foto + Nebel/Vignette) einmal in Framebuffer/Textur rendern, je Bild nur Bewegtes; weniger Texture-Samples/Schleifen; `mediump`; CSS-Animationen nur transform/opacity.
3. Messen: `src/tests/perf2.js` (CPU 4×). Headless-WebGL (swiftshader) ist sehr langsam → Screenshots können hängen.
4. Knöpfe: `node src/tests/tf.js` (57 Prüfungen). **Sonntags** Uhr auf Montag stellen (`c.clock.install({time:new Date("2026-11-23T10:00:00")})` vor `newPage`) – Planer zeigt keine Sonntage. Prüfen, dass `#hg` keine Klicks schluckt (pointer-events).
5. Bauen `cd src && python3 build.py 1.11.21`, `node quick.js`, CLAUDE.md (Version + Herbstallee-Eintrag) ergänzen, push main + Zweig, live `version.txt` prüfen.

## 4. Dateien
- `src/body_fb.html` (WebGL-Skript am Ende), `src/theme_hp.css` (Ende: `#hg`, `html.hg3`/`hgS`, Nebel-Glas 1.11.18/19), Bilder `hg-herbst.webp`, `hg-herbst-d.png`, `hg-herbst-m.png` (Kopie in `src/tests/`).

## 5. Feste Entscheidungen dieser Sitzung
- Animation läuft immer (auch bei Arbeit am 2. Bildschirm), langsame Geräte senken nur die Auflösung.
- Nie `background-attachment:fixed` in Planer-Zeilen/KW-Leisten, kein `backdrop-filter` in der Navi.
- Fertige, getestete Arbeit sofort selbst nach `main` ausliefern.
