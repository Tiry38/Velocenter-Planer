# Velocenter Werkstatt-Cockpit

Web-App für Velocenter Hessert: Planer, Verkauf, Bestellungen, Leasing-Infos, Lieferanten, Trinkgeld EC, Passwörter.

- Oberfläche: `index.html` (eine Datei, GitHub Pages)
- Daten: Firebase Firestore (Projekt `velocenter-planer`, Frankfurt), Anmeldung über Firebase Auth
- Sicherheitsregeln: `firestore.rules` (nur die 5 Personen; Passwortliste nur Admins; Tresor mit PIN verschlüsselt)
- Neue Version: `version.txt` hochzählen – offene Geräte laden sich innerhalb 1 Minute selbst neu.

Hier liegen **keine Daten und keine Passwörter**, nur der Programmcode.
