# Velocenter Werkstatt-Cockpit

Web-App für Velocenter Hessert: Planer, Verkauf, Bestellungen, Reklamationen, Kunden (nur Admins), Auswertung (nur Admins), Leasing-Infos, Lieferanten, Trinkgeld EC, 🔒 Notizen (nur Admins).

- Oberfläche: `index.html` (eine Datei, GitHub Pages)
- Daten: Firebase Firestore (Projekt `velocenter-planer`, Frankfurt), Anmeldung über Firebase Auth
- Sicherheitsregeln: `firestore.rules` (das Team; Kundendaten, Kunden-Mail und Notizen nur Admins; Tablet-Konto darf nur neue Verkäufe `vt…` anlegen; Tresor mit PIN verschlüsselt). Aktiv sind sie erst, wenn sie in der Firebase-Konsole veröffentlicht sind.
- Neue Version: `cd src && python3 build.py <Version>` schreibt `index.html` und `version.txt` (nicht von Hand ändern). Offene Geräte prüfen alle 30 s und laden sich selbst neu; GitHub Pages braucht etwa 1 Minute.

Hier liegen **keine Daten und keine Passwörter**, nur der Programmcode.

## Entwicklung

Quellcode in `src/`, bauen mit `cd src && python3 build.py <Version>`, Tests in `src/tests/` (`quick.js`, `tf.js`, `mau_test.js`, `perf.js`). Details für Claude Code: `CLAUDE.md`.

`_entfernt_2026-11-06/`: beim Audit entfernter Code als Patch (`git apply -R` stellt ihn wieder her).
