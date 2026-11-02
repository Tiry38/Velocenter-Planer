// Recherchierte Händler-Infos (Stand 02.11.2026) – werden einmalig an die bestehenden Listen angehängt
const LSREC_VER=1;
const LSREC=[
{
"k": "JR",
"abh": [
"Nur Neuräder (keine Gebrauchten) · Lastenräder ja · S-Pedelec nur, wenn der Arbeitgeber es zulässt",
"Mindestwert 749 € brutto inkl. Zubehör (Selbstständige 1.499 €) · Laufzeit 36 Monate",
"!Zubehör nur fest verbaut und nur im Angebot – nachträglich nicht möglich (kein Anhänger, Tasche/Korb, Tacho/Navi, Helm)",
"Übergabe: Personalausweis + Abholcode prüfen",
"Abholcode verloren: Übernahmebestätigung auf Papier, beide unterschreiben",
"!Gutschrift erst nach bestätigter Übergabe im Fachhändlerportal anfordern"
],
"ser": [
"Inspektion im Fachhändlerportal → Menü „Service“, mit Service-ID (13-stellig, gilt ganze Laufzeit – nicht der Abholcode)",
"Inspektionswerte (Servicepakete 2025): 90 € Fahrrad · 100 € E-Bike · 180 € Lastenrad",
"Arbeiten über den Inspektionsumfang hinaus zahlt der Kunde separat",
"Pakete: Basis (nur Inspektion) · Komfort (+ Verschleißbudget) · Unlimited (Verschleiß unbegrenzt + Akku unter 50 % Kapazität)",
"Schäden: Versicherer assona – wir nehmen den Schaden auf und melden ihn, Regulierung direkt assona ↔ Händler"
]
},
{
"k": "BL",
"abh": [
"Lastenräder, Liegeräder und S-Pedelecs leasbar · Gebrauchte nur, wenn bei Leasingstart max. 1 Jahr alt",
"Laufzeit 36 Monate (auch 48 möglich) · Min./Max.-Preis legt der Arbeitgeber fest",
"Zubehör nur fest verbaut (+ Kindersitz), nur zusammen mit dem Rad",
"!Schloss ist Pflicht – mind. 48 € (UVP/Kaufpreis brutto)",
"Leasinganfrage im Portal mit der Bikeleasing-Nutzer-ID des Kunden (Kunde registriert sich vorher mit dem Firmencode)",
"Nach Freigabe bekommt der Kunde den Übernahmecode per Mail – damit bestätigen wir die mängelfreie Übergabe und übermitteln ihn an Bikeleasing",
"Je nach Arbeitgeber statt Code: schriftliche Übernahmebestätigung",
"Händler-Support: 05571 3026-118"
],
"ser": [
"Inspektion: 2× bei 36 Monaten, 3× bei 48 Monaten – je 70 € inkl. MwSt., Abrechnung im Portal (Vertrag, Servicedatum, Code) per Gutschrift",
"!Inspektion binnen 7 Tagen nach der Leistung abrechnen – sonst keine Zahlung",
"Verschleiß (ERGO) ebenfalls per Gutschrift: Meldung im Portal",
"Verschleiß-Höchstbetrag pro Jahr bei Übernahme vor 01.02.2026: 238 € (bis 5.000 €) · 297 € (bis 10.000 €) · 357 € (bis 15.000 €)",
"Übernahme ab 01.02.2026: keine Jahresgrenze mehr (bis zum Kaufpreis über die Laufzeit)",
"Inspektion/Wartung zählt nicht zum Verschleiß",
"Schäden: Versicherer ERGO, keine Selbstbeteiligung – vor der Reparatur im Portal melden (Vertrags-Nr., Rahmen-Nr., Fotos)",
"!Kostenvoranschlag ab 250 €",
"Rechnung mit Vertrags-Nr., Vorgangs-Nr. (VS-…), Rahmen-Nr. und Leistungsdatum",
"Leasingende: Rückgabe in der Regel bei uns (Händler, bei dem abgeholt wurde)"
]
},
{
"k": "BB",
"abh": [
"Dreiräder, Liegeräder, Lastenräder, Pedelecs mit CE-Zertifizierung",
"!S-Pedelecs nicht leasbar",
"Max. 15.000 € brutto · Laufzeit 36 Monate",
"Zubehör direkt ins Angebot · empfohlen: Schloss ab 49 € UVP",
"!Angebot im Portal nicht änderbar – bei Änderungen neu einstellen",
"Quickstart: Portal-E-Mail des Nutzers reicht – sonst Arbeitgeber-ID + Nutzerdaten",
"Nach Freigabe Übergabetermin im Portal → Kunde bekommt die Übernahme-PIN per Mail",
"Übergabe im Portal: „PIN überprüfen“, Rahmen-Nr. (+ Akku-Nr. bei Pedelec), Ausweis geprüft + UVV-Unterweisung bestätigen → „Übergabe dokumentieren“",
"!Erst nach dokumentierter Übergabe ist der Vertrag aktiv und das Rad versichert",
"Abrechnung Rad im Portal: „Bike abrechnen“, IBAN + Brutto-VK prüfen – Zahlung durch PEAC Germany GmbH",
"Fachhandel-Support: 09132 6459-203 · fachhandel@businessbike.de (Mo–Fr 9–17)"
],
"ser": [
"Service-Budgets Neuverträge: Basis 75 €/Jahr · Premium 175 €/Jahr · Pro 300 €/Jahr – für Inspektion, Verschleiß inkl. Material und UVV-Check, Rest verfällt",
"Ohne Budget: nur UVV-Check 25 € pro Leistungszeitraum",
"Mehrkosten zahlt der Kunde direkt an uns",
"Altverträge: S = nur UVV 25 € · M = 75 €/Jahr Inspektion · L = 75 €/Jahr + 225 € Verschleiß gesamt – Inspektion und Verschleiß getrennt melden",
"Schäden: Versicherer ENRA – Meldung übers Portal, direkte Abrechnung, 0 € Selbstbeteiligung, keine Bagatellgrenze",
"Diebstahl-Ersatzrad: Rechnung auf PEAC, an info@enra.eu",
"Leasingende: keine Rückkaufpflicht für uns – BusinessBike holt beim Nutzer ab"
]
},
{
"k": "KM",
"abh": [
"Keine Einschränkung bei Radart/Hersteller (S-Pedelec, E-Lastenrad, E-Dreirad möglich) – Arbeitgeber kann begrenzen",
"Bruttopreis auf dem Einkaufszertifikat ist das Limit · Laufzeit 36 Monate",
"Zubehör muss im Angebot stehen, nachträglich nicht möglich · keine Bekleidung",
"!Schloss Pflicht: Falt-, Bügel- oder Kettenschloss ab 49 € – keine Zahlenschlösser",
"Rad-Daten vollständig im Portal erfassen, inkl. Rahmen-Nr.",
"Übernahmebestätigung über das Händler-Dashboard an den Kunden schicken – Kunde unterschreibt digital",
"!Ohne unterschriebene Übernahmebestätigung keine Zahlung",
"Keine eigene Rechnung fürs Rad: Liefergutschrift (Vertrag 2024) – Gutschrift umgehend und gleichlautend verbuchen",
"Nur wenn Gutschrift abgelehnt wird: Rechnung mit Leasingvertrags-Nr., Übergabedatum und Rahmen-Nr.",
"Keine Provision an Kazenmaier"
],
"ser": [
"UVV frühestens 11 Monate nach Übergabe, dann alle 12 Monate – 50 € inkl. USt.",
"UVV-Protokoll vollständig im Portal hochladen → Zahlung per Liefergutschrift",
"Paket „Wartung & Verschleiß“: erst ab dem 7. Monat nutzbar, Erst-Inspektion ausgeschlossen",
"Rundumschutz: Schäden + vorzeitiger Verschleiß – ohne Bremsen und Reifen, Akku nur unter 50 % Kapazität",
"Schaden: Fotos + Kostenvoranschlag an Kazenmaier → Freigabe (evtl. nur Teilbetrag) abwarten"
]
},
{
"k": "RD",
"abh": [
"Leasinganfrage im Händlerportal unter „Kunden anlegen“ mit dem Dienststellencode des Kunden",
"Übergabe erst, wenn das Portal meldet, dass alle Verträge unterschrieben sind",
"Kunde erzeugt vor der Abholung einen digitalen Übernahmecode",
"Übergabe: Personalausweis oder Reisepass prüfen",
"Zubehör nach TV-Fahrradleasing-Liste (z. B. Anhänger, Display, Lastenrad-Aufbauten) – nicht: Helm, Nachrüstantrieb",
"Rad + Zubehör nach dokumentierter Übernahme per Gutschrift, spätestens in 14 Werktagen",
"Keine Provision, kein Skonto, keine Gebühren",
"Leasinganfragen: vertrag@radimdienst.de · Tel. 0234 545 06 180 (Mo–Fr 8–18)"
],
"ser": [
"Inspektionspaket optional – ob gebucht, steht im Portal",
"Jede Inspektion inkl. Pflicht-UVV, Doku über die UVV-Checkliste im Portal – Mehrleistungen zahlt der Kunde",
"Firmenkunden (Partnerprogramm ab 06/2026): 150 € je Inspektion + 20 € Reparaturbonus – gilt nicht für öffentlichen Dienst (RadimDienst)",
"Altverträge: Satz laut Portal",
"Schäden, Gewährleistung und Reparaturen im Händlerportal dokumentieren und abrechnen (Rechnung hochladen)",
"Rückgabe bei uns möglich: Rahmen-Nr., Akku-Nr. und Zubehör gegen Portal prüfen"
]
},
{
"k": "ER",
"abh": [
"Lastenräder möglich · 357 € bis 20.000 € pro Rad (Arbeitgeber kann senken) · 36 Monate",
"Zubehör fest verbunden + Schloss, muss im Angebot stehen – nachträglich nicht möglich · keine Bekleidung/Helme",
"Auftrag im Dienstradtool mit dem Token des Kunden anlegen – Token gilt 60 Tage, nur einmal, Groß-/Kleinschreibung beachten",
"Abholung mit Übergabe-Token bestätigen → automatische Gutschrift der AGL Activ Services GmbH über den Gesamtverkaufspreis",
"Händler-Kontakt: fachhaendler@eurorad.de · 0221 845539-0"
],
"ser": [
"!Seit 07.04.2026 Inspektionen nur noch per Gutschrift im Dienstradtool – nicht mehr über Assona",
"UVV-Checkliste im Dienstradtool hochladen",
"Premium: UVV bis 30 € · Premium Plus (Antrag vor 01.03.2024): bis 60 € · Premium Plus (ab 01.03.2024): Inspektion inkl. UVV bis 90 € – Rest zahlt der Kunde",
"Verschleiß über das assona-Partnerportal mit Rahmen- oder Antragsnummer – kein extra Code nötig",
"Größere Reparaturen vorher über das assona-Portal freigeben lassen",
"Fehlende Auszahlung: kundenservice@assona.com mit Fall- oder Rahmennummer",
"Vorzeitige Rücknahme nur mit Schreiben von eurorad – Rückgabe an leasing@eurorad.de melden"
]
},
{
"k": "CB",
"abh": [
"Jede Fahrradart leasbar, auch Lastenrad und Liegerad · Laufzeit 36 Monate",
"Zubehör nur fest montiert (Licht, Schutzbleche, Sattel, Pedale) – nicht: Tacho/Navi, Kleidung, Zusatzakku, Taschen, Flaschen",
"Kunde erzeugt unter „Händleroption“ einen persönlichen Angebotscode → Code eingeben, Rahmen-Nr. (+ Akku-Nr.), Raddaten, Zubehör (+ Montagekosten optional) → „Angebot abgeben“",
"Mehrere Angebote pro Code möglich – Kunde nimmt eins an",
"!Übergabecode erst, wenn die Rahmen-Nr. eingetragen ist (Angebote → fehlende Rahmennummer)",
"Übergabe mit dem Übergabe-QR-Code im Portal bestätigen",
"Kontakt: haendleroption@company-bike.com · 089 242 94 149 (Mo–Fr 9–17)"
],
"ser": [
"Inspektion nur per Gutschriftverfahren (keine Rechnung) – Zahlung in 9 Werktagen ohne Abzug",
"!Nur der Händler, der das Rad geliefert hat, darf die Inspektion abrechnen",
"Verträge bis Mitte Nov. 2025: Inspektionspreis steht im Angebot (mind. 75 €/Jahr)",
"Verträge ab Mitte Nov. 2025: Kunde wählt die Inspektion selbst, Budget bis 120 € – Mehrkosten zahlt der Kunde",
"Keine Wartungs-/Verschleißpakete – Verschleiß zahlt der Kunde",
"Schaden: Schadenmeldung vom Kunden + unser KVA an Company Bike → Freigabe → Reparatur → Rechnung an Company Bike",
"!Nie ohne Freigabe reparieren – wird nicht rückwirkend erstattet",
"Mails: versicherung@company-bike.com · service@company-bike.com (Reparatur)"
],
"set": {
"gs": "nur IS",
"is": "Neuverträge: bis 120 €",
"vs": "nicht buchbar"
}
},
{
"k": "LB",
"abh": [
"Lastenräder möglich · Gebrauchte nur aufbereitete aus dem Partner-Portfolio · 36 Monate · Min./Max.-Preis legt der Arbeitgeber fest",
"Zubehör: fest verbaute Teile, Schloss, Beleuchtung, Laufradsatz, Reifen – nicht: Helm, Taschen, Körbe, Anhänger, Kleidung",
"!Nach Antragstellung kein Zubehör mehr nachtragen",
"Antrag digital mit dem Bestellcode – Vorgang im Portal über die Vertrags-ID",
"!Übergabe erst nach finaler Freigabe per E-Mail von Lease a Bike",
"Rechnung im Portal: Rechnungs-Nr. + Datum eintragen, Vorschau prüfen, „Rechnung bestätigen“ → Rad „zur Übergabe bereit“",
"Übergabedokumente digital unterschreiben · Geld innerhalb von 48 Stunden"
],
"ser": [
"Inspektion + Verschleiß über den „Service Hub“ einreichen, nach Freigabe direkt mit Lease a Bike abrechnen",
"Aktuelle Pakete: Basis 2× 85 € · Premium 3× 85 € · All-inclusive 3× 115 € (brutto), max. 1 pro Leasingjahr",
"Reicht das Budget nicht, zahlt der Kunde die Differenz direkt an uns",
"Verschleiß Altverträge bis 12.03.2025: Basis 75 € · Premium 200 € brutto/Jahr · All-inclusive unbegrenzt",
"!Schäden nur über uns im Portal („Schaden & Diebstahl“) mit KVA bzw. Rechnung + Fotos – erst nach Freigabe reparieren",
"Keine Selbstbeteiligung für den Kunden",
"Leasingende: Rückgabe bei uns mit gemeinsamem Zustandsprotokoll (alternativ Abholung)"
]
},
{
"k": "DD",
"abh": [
"Nahezu jeder Radtyp bis zum Lastenrad · 749 € bis 11.900 € brutto (falls Arbeitgeber nichts anderes festlegt) · 36 Monate",
"Zubehör nur fest verbunden bzw. für Nutzung/Sicherheit, nur zusammen mit dem Rad – nicht: Kleidung, Helm, Taschen, Werkzeug, Pumpe, Flaschen, Anhänger, Körbe",
"Angebot digital auf der DD-Plattform → nach Freigabe durch den Arbeitgeber kommt automatisch die Bestellung",
"Kunde bekommt den Abholcode per Mail + Plattform – Abholung mit Abholcode + gültigem Personalausweis",
"Code eingeben, Übernahme digital dokumentieren – vor Kauffreigabe keine Übergabe",
"!Keine Rechnung nötig: nach Eingabe des Abholcodes Gutschrift als PDF, Zahlung in 2–3 Werktagen",
"Ausnahme Selbstständige: Rechnung an Deutsche Dienstrad + Übernahmebestätigung im Original nach Schweinfurt",
"Kontakt Fachhandel: fachhandel@deutsche-dienstrad.de"
],
"ser": [
"Basis-Service: jährliche Sichtprüfung nach DD-Inspektionsliste, 3× in der Laufzeit – automatische Gutschrift 70 € brutto",
"Beim Basis-Service zahlt der Kunde Verschleißteile selbst",
"Premium/FullService: Verschleißreparaturen + Teile über eigenes Budget, Gutschrift in Höhe des Services (keine Sturz-/Vandalismusschäden)",
"Schäden: Vollkasko (Assona), Leasinggeber MLF – Rechnung im Original per Post an MLF Mercator-Leasing GmbH & Co. Finanz-KG, Londonstraße 1, 97424 Schweinfurt, mit Rahmen-Nr. + Fotos",
"KVA nötig, Reparatur erst nach Freigabe durch Mercator",
"Leasingende: keine Rückkaufpflicht für uns"
],
"set": {
"is": "70 € (Gutschrift)",
"gs": "ja"
}
},
{
"k": "EN",
"abh": [
"Rundumschutz Plus (mit Verschleiß): nur Neurad, Erstbesitz, max. 6 Monate ab Kaufdatum",
"Gebrauchte/ältere Räder nur Rundumschutz (ohne Verschleiß) – Zustand + Zeitwert prüft ein ENRA-Partner",
"Pedelec + S-Pedelec bis 15.000 € inkl. Schloss · keine gewerblich genutzten Räder",
"Abschluss nur über den Fachhandel – Antrag mit unserer ENRA-Partnernummer per Mail/Post"
],
"ser": [
"!Inspektion ist nicht versichert – zahlt immer der Kunde",
"Verschleiß nur im Rundumschutz Plus und erst ab dem 7. Monat · Akku erst unter 50 % Kapazität",
"Schaden: Formular mit dem Kunden ausfüllen, Meldung übers ENRA-Händlerportal oder schaden@enra.eu (Policen-Nr. in den Betreff)",
"!Abrechnung nur nach Rechnung – nicht nach KVA, KVA-Kosten werden nicht erstattet",
"Keine Selbstbeteiligung · Kontakt 02131 12436-0"
]
},
{
"k": "AL",
"abh": [
"Fahrräder, Pedelecs und S-Pedelecs bis 20.000 € inkl. Schloss + Zubehör",
"Basis/Komfort: bis 39 Monate nach Kauf (Gebrauchte nur vom Händler gekauft) · Premium: nur bis 12 Monate nach Neukauf",
"Abschluss nur über Partner – Partnerportal (seit 03/2026) mit Anbindung an velo.port"
],
"ser": [
"!Inspektion ist nicht versichert – zahlt der Kunde",
"Komfort: Verschleiß bis 150 €/Jahr (ohne Reifen und Bremsen) · Premium: voller Verschleiß inkl. Akku, max. 2 Fälle pro Jahr · Basis: kein Verschleiß",
"Schaden melden über Partnerportal oder service@alteos.com",
"!KVA + Fotos ab 350 € Reparaturkosten",
"Rechnung mit Marke, Typ und Rahmen-Nr.",
"Keine Selbstbeteiligung"
]
},
{
"k": "FS",
"abh": [
"FahrSicherung ist Versicherungsmakler (Produkt „FahrSicher“), kein Versicherer",
"Gebrauchte versicherbar · Abschluss über das Partnerportal (Händler-Abschlussstrecke)"
],
"ser": [
"!Inspektion ist nicht versichert – nur über separat gekaufte Inspektionsgutscheine (Gutschein + Inspektionsrechnung einreichen)",
"Verschleiß an jedem Teil inkl. Reifen und Bremsen, 5 Jahre ab Erstkauf · Akku unter 65 % (Jahr 1–3) bzw. 50 %",
"!Schadenfreigabe pauschal bis 500 € – darüber KVA",
"Direktabrechnung mit uns nur, wenn der Kunde den „Premiumservice“ gebucht hat",
"Kontakt: 030 921 099 530 · rad@fahrsicherung.de"
]
},
{
"k": "AS",
"abh": [
"Abschluss über das assona-Partnerportal: Originalrechnung + Zustandsbestätigung durch uns"
],
"ser": [
"Schaden binnen 14 Tagen übers Partnerportal melden, konkretes Reparaturangebot abgeben – assona gibt im Portal frei",
"Direktfälle: Reparaturauftrag kommt zwischen uns und assona zustande – Rechnung an assona (§ 14 UStG), Zahlung in 30 Tagen",
"!Leasingräder mit Leasinggeber MLF (JobRad, Deutsche Dienstrad): Rechnung an MLF Mercator-Leasing GmbH & Co. Finanz-KG, Londonstraße 1, 97424 Schweinfurt – sonst nur Netto-Erstattung",
"Rad im Portal über Rahmen- oder Antragsnummer finden",
"Assona ist Versicherer bei JobRad, Eurorad und Deutsche Dienstrad",
"Händlerbetreuung/Partnerportal: 030 208 666 66"
]
}
];
