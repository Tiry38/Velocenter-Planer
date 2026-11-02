// Leasing-Infos nach Tirys Fragenliste, Versicherungen mit eigenen Händler-Feldern (Recherche Stand 02.11.2026). Neue Fassung → LSREC_VER hochzählen.
const LSREC_VER=2;
const LSREC=[
{
"k": "JR",
"pak": [
"Basis: 1 Inspektion pro Jahr, kein Verschleiß – 6,90 € Fahrrad · 7,90 € E-Bike · 12,90 € Lastenrad (netto/Monat)",
"Komfort: Inspektion + Verschleißbudget (230 € Fahrrad · 300 € E-Bike über die Laufzeit) – 10,90 € · 12,90 € · 16,90 € (netto/Monat)",
"Unlimited: Inspektion + Verschleiß unbegrenzt + Akku unter 50 % Kapazität – 19,90 € Fahrrad/E-Bike · 22,90 € Lastenrad (netto/Monat)",
"Altverträge: JobRad-Inspektion (90 € pro Inspektion) bzw. FullService (500 € gesamt)"
],
"isz": "90 € Fahrrad · 100 € E-Bike · 180 € Lastenrad (brutto je Inspektion, Pakete ab 06/2025) · Altverträge 90 €",
"vsd": "Nur Komfort (230 € Fahrrad / 300 € E-Bike gesamt) und Unlimited (unbegrenzt) – Basis ohne Verschleiß",
"vers": "Ja – Vollkasko + Mobilitätsgarantie über assona",
"reNeu": "Keine Rechnung – JobRad-Gutschrift nach Übergabebestätigung im Fachhandelsportal",
"reIV": "Fachhandelsportal mit Service-ID (Gutschrift)",
"reSch": "Meldung an assona · Mercator-Verträge: Rechnung auf MLF Mercator-Leasing GmbH & Co. Finanz-KG, Londonstraße 1, 97424 Schweinfurt",
"abMon": "Inspektion je Leasingjahr: Monat 1–12, 13–24, 25–36 (empfohlen 10–12 Monate nach Übernahme)",
"code": "Ja – JobRad-Abholcode per Mail mit der Bestellbestätigung",
"mit": "Abholcode + Personalausweis",
"isCode": "Ja – Service-ID (13-stellig, gilt die ganze Laufzeit)",
"zubJa": [
"Schloss",
"Gepäckträger vorn/hinten",
"Schutzbleche",
"Fahrradständer",
"Trinkflaschenhalter",
"Klingel",
"Kindersitz",
"Rückspiegel",
"Smartphone-Halterung",
"Beleuchtung",
"Fest montierte Teile (Sattel, Griffe, Pedale)"
],
"zubNein": [
"Fahrradtaschen / Korb",
"Fahrradcomputer / Navi / Tacho",
"Schutzfolie",
"Fahrradanhänger",
"Helm",
"Bekleidung",
"Brille",
"Schuhe",
"Handschuhe",
"Rucksack",
"Trinkflasche",
"Pumpe"
]
},
{
"k": "BL",
"pak": [
"Komfort-Versicherung (Pflicht): Diebstahl, Unfall, Sturz, Vandalismus inkl. Akku/Motor + Mobilitätsgarantie – im Leasing enthalten",
"Inspektionspaket: 2 Inspektionen bei 36 Monaten (3 bei 48 Monaten)",
"Verschleiß-Versicherung (optional): Bremsscheiben, Ketten, Reifen, Züge, Akku unter 50 % – ab 5,90 €/Monat je nach Kaufpreis"
],
"isz": "70 € inkl. MwSt. pro Inspektion",
"vsd": "Nur mit Verschleiß-Versicherung – Übernahme ab 01.02.2026: unbegrenzt bis zum Kaufpreis · vorher 238 € (bis 5.000 €) / 297 € (bis 10.000 €) / 357 € (bis 15.000 €) pro Jahr",
"vers": "Ja – Komfort-Versicherung (Pflicht), Versicherer ERGO",
"reNeu": "BLS Bikeleasing-Service GmbH & Co. KG, Ernst-Reuter-Straße 2, 37170 Uslar – über das Bikeleasing-Portal",
"reIV": "Bikeleasing-Portal an BLS (Gutschrift) – Inspektion binnen 7 Tagen nach Leistung abrechnen, sonst keine Zahlung",
"reSch": "BLS Bikeleasing-Service GmbH & Co. KG, Uslar – Portal oder Mail, mit Vertrags-Nr., Vorgangs-Nr. (VS-…), Rahmen-Nr., Leistungsdatum · KVA ab 250 €",
"spe": true,
"abMon": "Inspektion: Code kommt ca. 14 Tage vor dem Leistungszeitraum (z. B. Monat 1–18 / 19–36) · Verschleiß ohne Wartezeit",
"code": "Ja – Übernahmecode per Mail nach finaler Freigabe",
"mit": "Übernahmecode",
"isCode": "Ja – einmaliger Inspektionscode per Mail + Portal, verfällt ungenutzt",
"zubJa": [
"Schloss – Pflicht, mind. 48 €",
"Gepäckträger",
"Lowrider / Frontgepäckträger",
"Schutzbleche",
"Kettenschutz",
"Beleuchtung",
"Klingel",
"Lenkerteile",
"Kindersitz",
"Lastenrad-Box / Verdeck",
"Fahrradtaschen",
"Upgrades (Akku, Bremsen, Display)"
],
"zubNein": [
"Helm",
"Bekleidung",
"Fahrradschuhe",
"Werkzeug",
"Akku-Schnellladegerät",
"Dämpferpumpe",
"Ersatzschaltauge",
"Standpumpe",
"Fahrradträger fürs Auto",
"Alles, was nicht fest verbaut ist"
]
},
{
"k": "BB",
"pak": [
"Ohne Budget: nur UVV-Check 25 € pro Leistungszeitraum",
"Basis: 75 € pro Jahr (225 € gesamt), v. a. UVV-Prüfung",
"Premium: 175 € pro Jahr (525 € gesamt) – Inspektion, Bremsbeläge, Kette, Ritzel, Reifen",
"Pro: 300 € pro Jahr (900 € gesamt) – Wartung + Reparatur",
"Altverträge (Angebot vor 01.09.2022): S = UVV 25 € · M = Inspektion 75 € · L = Inspektion 75 € + 225 € Verschleiß gesamt"
],
"isz": "Aus dem Budget (75 / 175 / 300 € pro Jahr) · ohne Budget UVV 25 € · Altpaket M/L 75 €",
"vsd": "Ja über Budget Premium/Pro · Altpaket L 225 € gesamt · Restbudget verfällt jährlich",
"vers": "Ja – Vollkasko standardmäßig, Versicherer ENRA",
"reNeu": "PEAC Germany GmbH (Leasinggeber) – Abrechnung im BusinessBike-Portal („Bike abrechnen“)",
"reIV": "Servicemeldung im BusinessBike-Portal an BusinessBike GmbH, Herzogenaurach (Inspektion und Verschleiß getrennt melden)",
"reSch": "PEAC Germany GmbH, Zahlung durch ENRA – Meldung + Rechnung im Portal",
"drei": true,
"spe": false,
"abMon": "Ab Übernahme: 1. Leistungszeitraum Monat 1–12, 2. ab Monat 13, 3. ab Monat 25",
"code": "Ja – Übernahme-PIN per Mail mit dem Abholtermin",
"mit": "Übernahme-PIN + Personalausweis oder Reisepass",
"isCode": "Nein – Servicemeldung über das Portal",
"zubJa": [
"Antrieb / Schaltung",
"Sattel",
"Gepäckträger",
"Schutzbleche",
"Ständer",
"Kettenschutz",
"Beleuchtung",
"Pumpe",
"Schloss",
"Kindersitz",
"Handyhalterung",
"Lastenrad: Sitzpolster, Verdeck",
"Taschen nur mit Sicherung (z. B. integriertes Schloss)"
],
"zubNein": [
"Anhänger",
"Helm"
]
},
{
"k": "KM",
"pak": [
"Mobilitätsgarantie (Pannenhilfe): immer kostenfrei dabei",
"Dienstrad-Komplettschutz: Diebstahl/Totalschaden, Reparatur nach Unfall/Sturz/Vandalismus, Akku unter 50 %",
"Fahrrad-Rundumschutz: Schäden + vorzeitiger Verschleiß (ohne Bremsen/Reifen), Neuwert bei Diebstahl/Totalschaden",
"Wartung & Verschleiß: Wartung, Inspektion, Verschleiß bis Höchstwert pro Vertragsjahr",
"UVV-Prüfung: 50 € inkl. MwSt. pro Jahr"
],
"isz": "UVV-Prüfung 50 € inkl. MwSt. · mit Paket Wartung & Verschleiß bis zum vereinbarten Jahreshöchstwert",
"vsd": "Ja im Paket Wartung & Verschleiß (Höchstwert pro Jahr) · Rundumschutz: vorzeitiger Verschleiß ohne Bremsen/Reifen",
"vers": "Ja – Komplett-/Rundumschutz als Leistungspaket",
"reNeu": "Keine Rechnung – Liefergutschrift der Kazenmaier Leasing GmbH, Ottostraße 18, 76227 Karlsruhe (nach digital signierter Übernahmebestätigung), Zahlung binnen 2 Werktagen",
"reIV": "Upload im Kazenmaier-Dienstradportal (UVV: Rechnung + Prüfprotokoll)",
"reSch": "Kazenmaier Leasing GmbH über das Portal · Meldung an schadenmeldung@kazenmaier.de",
"drei": true,
"spe": true,
"abMon": "Wartung & Verschleiß ab dem 7. Vertragsmonat · UVV frühestens 11 Monate nach Übernahme, dann alle 12 Monate",
"code": "Kein Abholcode – Einkaufszertifikat",
"mit": "Einkaufszertifikat + Ausweis · Übernahmebestätigung digital signieren",
"isCode": "Nein – Abrechnung über das Portal",
"zubJa": [
"Alles außer Bekleidung – z. B. Sattel, Helm, Pedale, Fahrradträger",
"Anhänger (Kind/Hund), Abdeckplanen",
"Schloss: Falt-, Bügel- oder Kettenschloss mind. 49 € – Pflicht",
"Genaue Freigabe steht im Einkaufszertifikat (Arbeitgeber legt fest)"
],
"zubNein": [
"Bekleidung",
"Zahlenschlösser"
]
},
{
"k": "RD",
"pak": [
"RadFahrSchutz (in der Rate enthalten): Vollkasko, Mobilitätsgarantie, Ausfallversicherung – Diebstahl, Sturz, Totalschaden, Verschleiß, ohne Selbstbeteiligung, Neuwert",
"Inspektionspaket mit UVV-Check (optional): 1 Inspektion pro Jahr"
],
"isz": "Firmenkunden (RIDE-Partnerprogramm): 150 € brutto je Inspektion + 30 € Handling je Vertrag + 20 €/Jahr Reparaturbonus · gilt nicht für RadimDienst (öffentlicher Dienst)",
"vsd": "Ja – Verschleißschutz im RadFahrSchutz, ohne Selbstbeteiligung",
"vers": "Ja – Vollkasko + Mobilitätsgarantie + Ausfallversicherung (in der Rate)",
"reNeu": "Keine Rechnung – Gutschrift der Ride Mobility GmbH spätestens 14 Werktage nach dokumentierter Übernahme",
"reIV": "Über das RIDE-Händlerportal dokumentieren und abrechnen",
"reSch": "Über das RIDE-Händlerportal (Kunde meldet den Schaden digital im Portal)",
"code": "Ja – Übernahmecode, erzeugt der Kunde vor der Abholung im Portal",
"mit": "Übernahmecode + Ausweis",
"zubJa": [
"Nur fest mit dem Rad verbundenes Zubehör (TV-Fahrradleasing)",
"Fahrradanhänger",
"Anhängerkupplung"
],
"zubNein": [
"Helm",
"Bekleidung",
"Werkzeug",
"Pedelec-Nachrüstantrieb",
"Dämpfer-/Standpumpe"
]
},
{
"k": "ER",
"pak": [
"Basic: Versicherung (assona) mit 40 € Selbstbeteiligung, 75 € Mindestschaden, kein Verschleiß",
"Premium: ohne Selbstbeteiligung, Verschleiß ab Tag 1 ohne Obergrenze, UVV bis 30 €",
"PremiumPLUS (nur Rahmenvertragskunden): ohne Selbstbeteiligung, Verschleiß unbegrenzt, Inspektion inkl. UVV bis 60 € (Antrag bis 29.02.2024) bzw. bis 90 € (ab 01.03.2024)",
"Kundenpreis: steckt in der Leasingrate"
],
"isz": "PremiumPLUS bis 90 € inkl. UVV (Antrag ab 01.03.2024) bzw. bis 60 € (älter) · Premium: UVV bis 30 € · Mehrkosten zahlt der Kunde",
"vsd": "Premium + PremiumPLUS: ab Tag 1 ohne Limit · Basic: nein",
"vers": "Ja – assona (Basic / Premium / PremiumPLUS)",
"reNeu": "Keine Rechnung – automatische Gutschrift der AGL Activ Services GmbH, Georgstr. 42, 30159 Hannover, nach Eingabe des Übergabe-Tokens",
"reIV": "Inspektion: seit 07.04.2026 nur per Gutschrift im Dienstradtool · Verschleiß: assona-Partnerportal (Rahmen- oder Antragsnummer)",
"reSch": "assona-Partnerportal (per Rahmennummer, kein extra Code)",
"abMon": "Inspektion frühestens im 10. bzw. 22. Monat nach Leasingbeginn · Verschleiß ab Tag 1",
"code": "Ja – Token fürs Angebot (60 Tage gültig) + Übergabe-Token für die Abholung",
"mit": "Übergabe-Token",
"isCode": "Nein – Zuordnung über die Rahmennummer",
"zubJa": [
"Fest montiertes Zubehör",
"Fest montiertes Display",
"Schloss ab 50 € UVP"
],
"zubNein": [
"Helm",
"Bekleidung",
"Werkzeug",
"Pumpe",
"Trinkflasche",
"Abnehmbares Navi",
"Anhänger (Liste 2025)"
]
},
{
"k": "CB",
"pak": [
"Rundum-Schutz (in der Rate): weltweit, 36 Monate, keine Selbstbeteiligung – Verschleiß, Verbrauchsmaterial und Platten ausgeschlossen",
"Jahresinspektion (optional, in der Nutzungsrate): Verträge ab Mitte Nov. 2025 Budget bis 120 € · ältere Verträge mind. 75 €/Jahr"
],
"isz": "Preis aus dem Angebot, höchstens bis zum Betrag auf dem Inspektionscode (neu bis 120 €, alt mind. 75 €/Jahr) – per Gutschrift",
"vsd": "Nein – kein Verschleißpaket, Verschleiß zahlt der Kunde",
"vers": "Ja – Rundum-Schutz, keine Selbstbeteiligung",
"reNeu": "Keine Rechnung – Gutschrift der company bike solutions GmbH (bereits gebuchte Rechnung nicht schicken)",
"reIV": "Inspektion per Inspektionscode, Gutschrift binnen 9 Werktagen · Fragen: service@company-bike.com",
"reSch": "Vor der Reparatur melden (sonst keine Erstattung), danach Reparaturrechnung bei company bike solutions GmbH einreichen · versicherung@company-bike.com",
"code": "Ja – Angebotscode (QR + PIN) aus der „Händleroption“, dann Übergabecode (QR)",
"mit": "Übergabecode (QR)",
"isCode": "Ja – Inspektionscode mit Budget (neue Verträge bei jedem Händler, alte nur beim liefernden Händler)",
"zubJa": [
"Fest montiertes Zubehör: Beleuchtung, Schutzbleche, Sattel, Pedale"
],
"zubNein": [
"Tacho / Navi (mobil)",
"Kleidung",
"Zusatzakku",
"Taschen / Körbe",
"Trinkflaschen",
"Kinder-/Hundeanhänger"
]
},
{
"k": "LB",
"pak": [
"Neuverträge ab 13.03.2025, Bausteine – Diebstahl & Schaden: Premium (Zeitwert) oder All-inclusive (Neuwert), ohne Selbstbeteiligung, mit Mobilitätsgarantie",
"Inspektion: Basis 2× bis 85 € · Premium 3× bis 85 € · All-inclusive 3× bis 115 € (brutto)",
"Verschleiß: Basis 50 € · Premium 150 € pro Leasingjahr · All-inclusive unbegrenzt",
"Kundenpreis: steckt in der Rate, Arbeitgeber legt die Pakete fest",
"Altverträge bis 12.03.2025: Erstinspektion bis 41,65 € brutto, weitere ab dem 13. und 25. Monat"
],
"isz": "Bis 85 € brutto (Basis/Premium) bzw. 115 € (All-inclusive), max. 1 pro Leasingjahr · Altverträge: Erstinspektion bis 41,65 € · Mehrkosten zahlt der Kunde",
"vsd": "Basis 50 € · Premium 150 € pro Leasingjahr · All-inclusive unbegrenzt (Rest verfällt am Ende des Leasingjahres)",
"vers": "Ja – Diebstahl- und Schadenschutz ohne Selbstbeteiligung + Mobilitätsgarantie",
"reNeu": "Rechnung im Lease-a-Bike-Portal erfassen und vor der Übergabe bestätigen – Empfänger ist die jeweilige Leasinggesellschaft (steht auf der Rechnung), nicht separat schicken",
"reIV": "Service Hub an Lease a Bike (Gutschrift im Budget)",
"reSch": "Nur über uns im Portal („Schaden/Diebstahl melden“) mit KVA + Fotos – nach Freigabe direkt mit Lease a Bike abrechnen",
"spe": true,
"abMon": "Max. 1 Inspektion pro Leasingjahr · Altverträge ab dem 13. und 25. Monat (+ Erstinspektion)",
"code": "Ja – 6-stelliger Bestellcode fürs Angebot + Abhol-PIN je Rad per Mail",
"mit": "Abhol-PIN",
"zubJa": [
"Fest am Rad verbautes Zubehör",
"Schloss, Beleuchtung, Laufradsatz, Reifen"
],
"zubNein": [
"Helm",
"Taschen",
"Körbe",
"Anhänger",
"Kleidung"
]
},
{
"k": "DD",
"pak": [
"Basis-Service: Vollkasko + Mobilitätsgarantie, 1 Sichtprüfung/UVV pro Jahr (3× in der Laufzeit)",
"Premium-Service: wie Basis + Verschleißreparaturen und -teile",
"Arbeitgeber legt das Paket fest, Preis steckt in der Rate"
],
"isz": "Basis: automatische Gutschrift 70 € brutto · Premium: Gutschrift in Höhe der Leistung · Differenz zahlt der Kunde",
"vsd": "Basis: nein · Premium-/FullService: ja",
"vers": "Ja – Vollkasko inkl. Mobilitätsgarantie über Leasinggeber MLF Mercator-Leasing, keine Selbstbeteiligung",
"reNeu": "Keine Rechnung – Gutschrift als PDF in der DD-Plattform nach Eingabe des Abholcodes · Selbstständige: Rechnung an DD Deutsche Dienstrad GmbH, Sven-Wingquist-Straße 2, 97424 Schweinfurt",
"reIV": "DD-Plattform mit dem Code des Kunden – automatische Gutschrift",
"reSch": "MLF Mercator-Leasing GmbH & Co. Finanz-KG, Londonstraße 1, 97424 Schweinfurt (sonst nur Netto-Erstattung) – vorher KVA + Freigabe",
"abMon": "1. Sichtprüfung Monat 1–12, 2. Monat 13–24, 3. Monat 25–36 nach Übernahme",
"code": "Ja – Abholcode per Mail + Plattform, sobald das Rad abholbereit ist",
"mit": "Abholcode + gültiger Personalausweis",
"isCode": "Ja – Code per Mail, sobald die Sichtprüfung fällig ist",
"zubJa": [
"Fest verbundenes Zubehör",
"Zubehör für Nutzung/Sicherheit – nur zusammen mit dem Rad",
"Lastenrad-Zubehör (Kiste, Regenverdeck)"
],
"zubNein": [
"Kleidung",
"Helm",
"Reine Ersatzteile",
"Rucksäcke / Taschen",
"Werkzeug",
"Pumpen",
"Trinkflaschen",
"Anhänger",
"Körbe"
]
},
{
"k": "EN",
"pak": [
"Rundumschutz Plus: Diebstahl, Teilediebstahl, Raub, Vandalismus, Unfall/Sturz, Akku-Defekt, Pick-Up-Service + Verschleiß",
"Rundumschutz: wie Plus, aber ohne Verschleiß",
"Versicherer bei BusinessBike-Leasing"
],
"vRad": "Rundumschutz Plus: nur Neurad, Erstbesitz, max. 6 Monate ab Kauf · Rundumschutz: auch Gebrauchte (ENRA-Partner prüft Zustand + Zeitwert) · bis 15.000 € inkl. Schloss · keine gewerblich genutzten Räder",
"spe": true,
"vAbs": "Nur über den Fachhandel – Antrag mit unserer ENRA-Partnernummer per Mail oder Post",
"isz": "Nicht versichert – zahlt der Kunde",
"vsd": "Nur im Rundumschutz Plus, alle Verschleißteile · Akku erst unter 50 % Kapazität",
"abMon": "Ab dem 7. Monat nach Vertragsbeginn",
"vMeld": "Schadenformular mit dem Kunden ausfüllen → ENRA-Händlerportal oder schaden@enra.eu (Policen-Nr. in den Betreff)",
"vKva": "Abrechnung nur nach Rechnung – nicht nach KVA, KVA-Kosten werden nicht erstattet",
"reSch": "ENRA – Regulierung direkt mit uns nach Vorlage der Rechnung",
"vSb": "Keine",
"vKon": "02131 12436-0 · schaden@enra.eu"
},
{
"k": "AL",
"pak": [
"Basis: Diebstahl, Raub, Vandalismus",
"Komfort: + Sturz, Unfall, Feuchtigkeit, Elektronik, Material-/Bedienfehler + Verschleiß bis 150 €/Jahr (ohne Reifen und Bremsen)",
"Premium: voller Verschleißschutz inkl. Akku, max. 2 Verschleißfälle pro Jahr"
],
"vRad": "Fahrräder, Pedelecs, S-Pedelecs bis 20.000 € inkl. Schloss + Zubehör · Basis/Komfort bis 39 Monate nach Kauf (Gebrauchte nur, wenn beim Händler gekauft) · Premium nur bis 12 Monate nach Neukauf · keine Velomobile, nicht rein gewerblich",
"spe": true,
"vAbs": "Nur über Partner – Alteos-Partnerportal (seit 03/2026) mit Anbindung an velo.port",
"isz": "Nicht versichert – zahlt der Kunde",
"vsd": "Komfort: bis 150 €/Jahr (ohne Reifen/Bremsen) · Premium: voll inkl. Akku · Basis: nein",
"abMon": "Komfort: 6 Monate Wartezeit, wenn der Abschluss mehr als 12 Monate nach dem Kauf erfolgt",
"vMeld": "Alteos-Partnerportal oder service@alteos.com",
"vKva": "KVA + Fotos ab 350 € Reparaturkosten",
"reSch": "Rechnung muss Marke, Typ und Rahmen-Nr. enthalten",
"vSb": "Keine (alle Tarife seit 03/2023)",
"vKon": "service@alteos.com"
},
{
"k": "FS",
"pak": [
"FahrSicherung ist Versicherungsmakler mit Eigenprodukt „FahrSicher“ – kein Versicherer",
"FahrSicher: Verschleiß an jedem Teil inkl. Reifen und Bremsen, 5 Jahre ab Erstkauf",
"Inspektion nur über separat gekaufte Inspektionsgutscheine"
],
"vRad": "Auch Gebrauchte versicherbar (auch gebrauchte Lastenräder, gewerbliche Pedelecs)",
"vAbs": "FahrSicherung-Partnerportal mit Händler-Abschlussstrecke und Provisionsportal",
"isz": "Nicht versichert – nur mit Inspektionsgutschein des Kunden: Gutschein + Inspektionsrechnung einreichen, Erstattung ca. 14 Werktage",
"vsd": "Ja – jedes Teil inkl. Reifen und Bremsen, 5 Jahre ab Erstkauf · Akku unter 65 % (Jahr 1–3) bzw. 50 %",
"vMeld": "Kunde fordert sein persönliches Schadenformular mit seiner Versicherungsnummer an",
"vKva": "Pauschale Freigabe bis 500 € – darüber KVA",
"reSch": "Direktabrechnung mit uns nur, wenn der Kunde den „Premiumservice“ gebucht hat",
"vKon": "030 921 099 530 · rad@fahrsicherung.de"
},
{
"k": "AS",
"pak": [
"E-Bike-Schutz: Diebstahl, Sturz, Akkudefekt, Mobilitätsschutz – Laufzeit 36 Monate",
"Versicherer bei JobRad und Eurorad (Leasing-Zweirad-Schutz Basic / Premium / PremiumPLUS)"
],
"vRad": "Fahrrad, E-Bike, Lastenrad · E-Bike-Schutz: Rad max. 12 Monate alt bei Händlerkauf · bis 20.000 €",
"vAbs": "assona-Partnerportal – Originalrechnung + Zustandsbestätigung durch uns",
"isz": "Im E-Bike-Schutz nicht versichert · Leasing PremiumPLUS: max. 60 € im 2. + 3. Jahr · Eurorad-Inspektionen seit 07.04.2026 nicht mehr über assona",
"vsd": "Je nach Tarif",
"vMeld": "assona-Partnerportal binnen 14 Tagen – Rad über Rahmen- oder Antragsnummer finden",
"vKva": "Konkretes Reparaturangebot im Portal abgeben – erst nach Freigabe reparieren",
"reSch": "Direktfälle: assona GmbH (§ 14 UStG), Zahlung in 30 Tagen · Leasingräder mit Leasinggeber MLF (JobRad, Deutsche Dienstrad): MLF Mercator-Leasing GmbH & Co. Finanz-KG, Londonstraße 1, 97424 Schweinfurt",
"vKon": "030 208 666 66 (Händlerbetreuung) · kundenservice@assona.com"
}
];
