// Leasing-Infos nach Tirys Fragenliste, Versicherungen mit eigenen Händler-Feldern (Volltext-Prüfung offizieller Seiten/PDFs, Stand 02.11.2026; Eurorad + assona am 03.11.2026 geprüft). Neue Fassung → LSREC_VER hochzählen und betroffene Einträge mit "v": <neue Version> markieren – nur die werden überschrieben.
const LSREC_VER=6;
const LSREC=[
{
"k": "JR",
"pak": [
"Basis: 1 Inspektion pro Jahr (3× in 36 Mon.), kein Verschleiß – 6,90 € Fahrrad · 7,90 € E-Bike · 12,90 € Lastenrad (netto/Monat)",
"Komfort: Inspektion + Verschleiß/Reparatur-Budget 230 € Fahrrad · 300 € E-Bike · 300 € Lastenrad (gesamte Laufzeit) – 10,90 € · 12,90 € · 16,90 € (netto/Monat)",
"Unlimited: Inspektion + Verschleiß/Reparatur unbegrenzt inkl. Akku (Kapazität dauerhaft unter 50 %) – 19,90 € Fahrrad/E-Bike · 22,90 € Lastenrad (netto/Monat)",
"Altverträge (laufen parallel weiter): JobRad-Inspektion 90 € je Inspektion (5 €/Monat) · FullService 500 € Rahmen inkl. Inspektion (10 €/Monat)",
"Arbeitgeber legt fest, welche Pakete buchbar sind · nur bei Vertragsabschluss buchbar · JobRad für Selbstständige: keine Servicepakete"
],
"isz": "90 € Fahrrad · 100 € E-Bike · 180 € Lastenrad (brutto je Inspektion, Basis/Komfort/Unlimited) · Altvertrag JobRad-Inspektion 90 € · + ServicePro-Zuschuss 30 € bzw. 60 € brutto je Inspektion (Servicequote ≥ 80 % + Zertifikat und/oder Ausbildungsbetrieb) · Mehrkosten zahlt der Kunde · Erst-/Herstellerinspektion nicht abrechenbar",
"vsd": "Nur Komfort (230 € Fahrrad · 300 € E-Bike · 300 € Lastenrad gesamt) und Unlimited (unbegrenzt, inkl. Akku) – Basis ohne Verschleiß · Altvertrag FullService: 500 € inkl. Inspektion",
"vers": "Ja – JobRad-Vollkasko inkl. Mobilitätsgarantie immer dabei (Schadenabwicklung assona; greift ab 60 € Schadenshöhe inkl. USt) · Selbstständige: wahlweise eigene Versicherung · S-Pedelec: Kunde versichert selbst",
"reNeu": "Keine Rechnung – Gutschrift im Fachhandelsportal anfordern, sobald Status „übergeben“ (Kunde bestätigt Übernahme per Code) · Zahlung innerhalb von 2 Werktagen · Einkaufsrabatt: 1. Kalenderjahr 4 %, danach nach Netto-Vorjahresumsatz (max. 6 %), 0 % bei Eigenakquise/Selbstständigen · Lastenrad ohne neues Servicepaket: ProLastenrad-Zuschuss 230 € netto automatisch mit der Gutschrift (Abrechnung bis 31.12.2026, im Angebot „Transportrad“ wählen)",
"reIV": "Fachhandelsportal → „Service durchführen“, Kunde per Service-ID finden, Posten „Arbeitszeit für Inspektion“ – Vergütung läuft automatisch · Altverträge (Inspektionscoupon/FullService): abrechnung@jobrad.org",
"reSch": "Schaden begutachten und über das assona-Partnerportal melden (alternativ Tel. 030 208666 + Regionaldurchwahl oder kundenservice@assona.com, mit Rahmen- oder KAU-Nummer) · Rechnungsempfänger je nach Leasinggesellschaft (nennt assona): MLF Mercator-Verträge → Rechnung auf MLF Mercator-Leasing GmbH & Co. Finanz-KG, Londonstraße 1, 97424 Schweinfurt · JobRad Leasing GmbH → Abwicklung über assona",
"abMon": "Inspektion je Leasingjahr: Monat 1–12, 13–24, 25–36 nach Vertragsstart (verfällt danach) · Komfort/Unlimited-Verschleiß bis Vertragsende",
"code": "Ja – JobRad-Abholcode aus der Bestellbestätigungs-Mail; Kunde nennt ihn bei Abholung = papierlose Übernahmebestätigung · bei Versand bestätigt der Kunde im Portal (Code dann nicht anfordern)",
"mit": "Abholcode + Personalausweis",
"isCode": "Ja – Service-ID (13 Ziffern) im JobRad-Portal bzw. in der Erinnerungs-Mail · ohne ID: Kunde per Name + PLZ, E-Mail oder Rahmennummer finden · Abholung nach dem Service nur mit 7-stelligem Abhol-Code (kommt per Mail)",
"spe": true,
"drei": true,
"zubJa": [
"Beleuchtung: Akku- (StVZO), Dynamo-, Pedelec-Akku-Beleuchtung",
"Schloss ab 49 € UVP",
"Gepäckträger vorn/hinten",
"Schutzblech",
"Fahrradständer",
"Trinkflaschenhalter",
"Fahrradklingel",
"Kindersitz",
"Zweiter Akku bei Dual-Battery-System",
"Luftpumpe mit Rahmenhalterung (bis 150 €)",
"GPS-Diebstahlschutz",
"Tandem- und Adaptersysteme (fest am Rad)",
"Smartphone-Halterung",
"Upgrades: Griffe, Vorbau, Lenker, Pedelec-Display, Sattel, Sattelstütze, Pedale, Laufradsatz, Reifen, Bremsen",
"Lastenrad: Kindersitz/Sitzpolster, Kiste/Box, Persenning, Kinderverdeck",
"Nur im Angebot zusammen mit dem Rad – nachträglich nicht möglich"
],
"zubNein": [
"Helm",
"Bekleidung / Brille / Schuhe",
"Handschuhe",
"Rucksack",
"Tasche / Korb",
"Fahrradanhänger",
"Fahrradcomputer / Navi / Tacho / Schutzfolie",
"Dämpferpumpe",
"Trinkflasche",
"Alles, was im Portal (EAN-Suche) nicht auftaucht"
]
},
{
"k": "BL",
"pak": [
"Komfort-Versicherung (Pflicht, in jeder Leasingrate): Diebstahl, Teilediebstahl, Vandalismus, Raub, Unfall, Sturz, Reifenpanne, Bedienfehler, Elektronik-/Material-/Produktionsfehler inkl. Akku & Motor · keine Selbstbeteiligung · Mobilitätsgarantie (Transport bis 150 €, Leihrad 25 €/Tag max. 14 Tage) · 5,90–23,90 €/Monat je Kaufpreis (bis 15.000 € brutto), inkl. Versicherungssteuer",
"Verschleiß-Versicherung (optional, zusätzlich zur Komfort): Akku, Bremsbeläge/-scheiben/-flüssigkeit, Kette/Riemen, Kassette, Kettenblätter, Reifen/Schlauch, Pedale, Griffe, Züge inkl. Hülle, Freilauf, Getriebenaben-Service, Lager (Gabel, Dämpfer, Dropper, Steuersatz, Naben, Innenlager) · 5,90–23,90 €/Monat je Kaufpreis · keine Wartezeit, keine Selbstbeteiligung",
"Inspektionspaket 1 (optional): 2 Inspektionen bei 36 Monaten / 3 bei 48 Monaten · 4 € netto/Monat",
"Inspektionspaket 2 (nur wenn Arbeitgeber vereinbart): eine Inspektion mehr (3 bei 36 / 4 bei 48 Monaten) · 6 € netto/Monat",
"Haftpflicht & Rechtsschutz (optional, schließt der Arbeitgeber ab): Privatnutzung + Arbeitsweg, nur Räder/Pedelecs bis 25 km/h · 1 €/Monat"
],
"isz": "70 € brutto (inkl. MwSt.) pro Inspektion – als Gutschrift über das Bikeleasing-Portal",
"vsd": "Nur mit Verschleiß-Versicherung (optional) – keine Wartezeit · Übernahme ab 01.02.2026: Budget bis zum Kaufpreis über die gesamte Laufzeit · Übernahme vor 01.02.2026: max. 200 € (Kaufpreis bis 5.000 €) / 250 € (bis 10.000 €) / 300 € (bis 15.000 €) netto pro Leasingjahr · Akku nur bei nachgewiesener Kapazität unter 50 % (Herstellerprüfung)",
"abMon": "Inspektion Paket 1: Monat 1–18 / 19–36 / 37–48 nach Übernahme · Paket 2: Monat 1–12 / 13–24 / 25–36 / 37–48 · nicht genutzter Zeitraum = Code verfällt · Verschleiß ohne Wartezeit ab Übernahme",
"isCode": "Ja – einmaliger Inspektions-Code (Gutschein-Code), Kunde bekommt ihn 14 Tage vor Beginn des Zeitraums per Mail + im Portal · vor der Inspektion geben lassen, ohne Code keine Abrechnung · fehlt/ungültig: im Portal „Code erneut senden“",
"vers": "Ja – Bikeleasing-Komfort-Versicherung (Pflicht, ohne Selbstbeteiligung), Partner ERGO Versicherungen AG · Verschleiß-Versicherung optional",
"reNeu": "Über das Bikeleasing-Portal: „Rad übergeben“ → Übernahmedatum, Rahmen-Nr., Akku-Nr., Übernahmecode bzw. Übernahmebestätigung · Rechnungsverfahren: Rechnung an BLS Bikeleasing-Service GmbH & Co. KG, Ernst-Reuter-Straße 2, 37170 Uslar mit hochladen (Modell + Rahmen-Nr., Kaufpreis = Leasingvertrag, Lieferdatum = Übernahmedatum) · Gutschriftenverfahren: keine Rechnung, BLS schickt Gutschrift",
"reIV": "Inspektion: Portal → Versicherungsfälle → Inspektionen → Leistungsdatum, Inspektions-Code, eigene Rechnungs-Nr. → automatische Gutschrift 70 € brutto · binnen 7 Tagen nach Leistung abrechnen, sonst keine Zahlung · Verschleiß: Portal → Versicherungsfälle → Schaden melden → Schadenart „Verschleiß“, Reparaturdatum, Teile + Arbeitswerte → Gutschrift, keine Rechnung nötig · Fremdkunden: Vertrags-Nr. oder Bikeleasing-Nutzer-ID nötig",
"reSch": "Vor der Reparatur melden: Portal → Versicherungsfälle → Schaden melden → Schadenart + Angaben, Rechnung oder KVA hochladen (KVA ab 250 €) · Regulierung durch Bikeleasing direkt an uns, Kunde zahlt nichts vor · Reifenpanne: Teile + Arbeitswerte angeben → Gutschrift ohne Rechnung/KVA · Ausnahme per Mail: bikeschaden@bikeleasing.de · Schaden-Telefon +49 5571 3026-200 (Mo–Sa 8–18 Uhr) · Diebstahl/Vandalismus: Polizeianzeige binnen 5 Werktagen · Fremdkunden: Vertrags-Nr. oder Nutzer-ID · Rechnung an BLS Bikeleasing-Service GmbH & Co. KG, Uslar, mit Vertrags-Nr., Vorgangs-Nr. (VS-…), Rahmen-Nr., Leistungsdatum",
"spe": true,
"code": "Ja – Übernahmecode (Abholvollmacht), Kunde bekommt ihn per Mail nach Freigabe durch den Arbeitgeber · je nach Arbeitgeber-Vertrag stattdessen schriftliche Übernahmebestätigung · bei Übergabe im Portal eingeben (= mängelfreie Übergabe, Start von Leasing + Versicherung)",
"mit": "Übernahmecode (bzw. Übernahmebestätigung) + gültigen Ausweis (Personalausweis/Reisepass)",
"zubJa": [
"Schloss – Pflicht, UVP mind. 48 €, fest am Rad oder an fest verbauter Halterung",
"Gepäckträger, Lowrider / Frontgepäckträger",
"Schutzbleche, Kettenschützer, Seitenständer",
"Beleuchtung (Akku, Dynamo, Pedelec), Blinker",
"Cockpit: Klingel, Griffe/Lenkerband, Barends, Lenkeraufsatz, Rückspiegel, Smartphone-Halterung",
"Elektronik: Fahrradcomputer, Leistungsmesser, USB-Ladestation, zweiter Akku (wenn gleichzeitig nutzbar)",
"Kindersitz, Anhängerkupplung, Steckachsen für Anhänger, Abschleppvorrichtung für Kinder",
"Lastenrad: Kindersitz/-adapter, Kiste/Box, Verdeck, Aufbauten",
"Körbe, Boxen, Lenkertaschen, Flaschenhalter, Luftpumpe mit Halterung, Tool Pack, Pedale",
"Diebstahlschutz: Ersatzschloss, GPS-Tracker, abschließbare Schnellspanner",
"Upgrades: Akku (mehr Kapazität), Bremsen, Display, Gabel/Dämpfer, Laufradsatz, Lenker, Vorbau, Reifen, Sattel, Sattelstütze, Schaltung",
"Sonderlackierung vom Hersteller",
"Keine Preisobergrenze je Teil · nur zusammen mit dem Rad, nicht nachträglich"
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
"Fahrradanhänger",
"Kistenabdeckung (Persenning)",
"Zweiter Laufradsatz",
"Fahrradträger fürs Auto",
"Alles, was nicht fest verbaut ist"
]
},
{
"k": "BB",
"pak": [
"Ohne Budget: nur UVV-Check 25 € pro Leistungszeitraum",
"Basis: 75 € pro Jahr (225 € gesamt) – 5 €/Monat",
"Premium: 175 € pro Jahr (525 € gesamt) – 10 €/Monat",
"Pro: 300 € pro Jahr (900 € gesamt) – 15 €/Monat",
"Budgets brutto, frei nutzbar für UVV, Inspektion, Verschleiß inkl. Material (auch Reifenschäden) · Budget + wer zahlt legt der Arbeitgeber fest",
"Vollkasko (ENRA) immer dabei: 0,30 % vom Bruttopreis pro Monat, mind. 2,38 € (Angebote ab 01.05.2024)",
"Radpreis 499–15.000 € brutto (Zubehör/Schloss kommen obendrauf)",
"Altverträge (Angebot vor 01.09.2022): S = UVV 25 € · M = Inspektion 75 € · L = Inspektion 75 € + 225 € Verschleiß gesamt"
],
"isz": "Aus dem Budget (brutto): Basis 75 € · Premium 175 € · Pro 300 € pro Leistungszeitraum, frei für UVV/Inspektion/Verschleiß · ohne Budget nur UVV-Check 25 € · Altpaket S UVV 25 € · M/L Inspektion 75 €",
"vsd": "Ja – jedes Budget (Basis/Premium/Pro) frei auch für Verschleißreparaturen inkl. Material · Altpaket L 225 € gesamt · Restbudget verfällt nach jedem Leistungszeitraum · Mehrkosten zahlt der Kunde direkt an uns",
"abMon": "Ab Übernahme: 1. Leistungszeitraum Monat 1–12, 2. ab Monat 13, 3. ab Monat 25 · Meldung nur im laufenden Zeitraum, rückwirkend nicht möglich",
"isCode": "Nein – Servicemeldung im Portal mit Rahmen- + Policennummer und Leasingbeginn/-ende (stehen auf der BusinessBike Card des Kunden) · Restbudget sehen wir bei der Meldung",
"vers": "Ja – Vollkasko immer inklusive, Versicherer ENRA · ohne Selbstbeteiligung, ohne Zeitwertabzug, Neurad bei Diebstahl/Totalschaden · Mobilitätsgarantie mit Pick-Up-Service",
"reNeu": "Leasinggeber PEAC Germany GmbH zahlt – nach Übergabe im Portal „Bike abrechnen“ (IBAN + Bruttoverkaufspreis prüfen), Gutschrift in den folgenden Werktagen · Dealer Commission (Händler-Rabatt) 6 % je Vorgang seit 01.03.2025, über „Trails“ bis 3 %",
"reIV": "Servicemeldung im Portal („Service melden“) + Rechnung hochladen, Rechnung auf BusinessBike GmbH, Ohmstraße 2, 91074 Herzogenaurach · Auszahlung Serviceabrechnungen freitags · Altpakete: Inspektion und Verschleiß getrennt melden und rechnen",
"reSch": "Rechnungsempfänger PEAC Germany GmbH, Zahlung durch ENRA – im Portal „Schaden oder Diebstahl melden“ + Rechnung hochladen · Frist 14 Tage (Fremdschaden 5 Werktage; Diebstahl/Vandalismus vorher Polizeianzeige binnen 5 Werktagen) · nur vor Leasingende meldbar · Ersatzrad erst nach ENRA-Freigabe, kommt in den bestehenden Vertrag (kein neues Angebot!) · Rechnungsstatus: ENRA 02131 124360",
"drei": true,
"spe": false,
"code": "Ja – Übernahme-PIN: geht per Mail an Kunde und Arbeitgeber, sobald wir den Übergabetermin im Portal eintragen · bei Quickstart + Rad vorrätig sofort im Laden · PIN weg → Arbeitgeber fragen, sonst BusinessBike-Kontaktformular",
"mit": "Übernahme-PIN + Personalausweis oder Reisepass (wir prüfen Ausweis, machen UVV-Einweisung und dokumentieren die Übergabe im Portal)",
"zubJa": [
"Rahmen, Gabel, Dämpfer, Steuersatz, Lenker, Vorbau, Griffe, Barends, Klingel/Hupe, Spiegel",
"Antrieb/Schaltung: Kettenblätter, Kurbeln, Kette/Riemen, Kassette, Schaltwerk, Nabenschaltung, Pedale",
"E-Antrieb: Motor, Akku, Display, Controller, Bedienelemente",
"Bremsen, Laufräder, Felgen, Reifen, Schläuche",
"Sattel, Sattelstütze, Gepäckträger, Schutzbleche, Kettenschutz, Ständer, Körbe/Boxen",
"Beleuchtung, Tacho/Fahrradcomputer, Pumpe, Flaschenhalter, Handyhalterung, GPS-Diebstahlschutz",
"Schloss (UVP mind. 49 € · Rahmenschloss nur zusammen mit Einsteck-Kettenschloss ab 24 €)",
"Kindersitz",
"Lastenrad: Sitzpolster, Persenning/Kistenabdeckung, Verdeck",
"Taschen fest montiert · abnehmbare nur mit Sicherung (z. B. integriertes Schloss)"
],
"zubNein": [
"Anhänger",
"Helm",
"Montage- und Versandkosten",
"Zubehör nachträglich – alles muss direkt ins Angebot"
]
},
{
"k": "KM",
"pak": [
"Mobilitätsgarantie (Schutzbrief): immer kostenfrei dabei – 24/7 Pannenhilfe, Transport zur Werkstatt, Ersatzrad bis 14 Tage · max. 150 € inkl. MwSt. je Schadenfall",
"Dienstrad-Komplettschutz: verpflichtend, 0,35 % vom Bruttokaufpreis pro Monat – Reparatur nach Unfall/Sturz/Vandalismus/Bedienfehler, Elektronik-/Feuchtigkeitsschäden, Akku unter 50 %, Material-/Konstruktionsfehler nach 24 Mon. · Neuwert bei Diebstahl/Totalschaden im 1. Vertragsjahr · Ratenausfall-/Rückgabeschutz",
"Dienstrad-Jahresdurchsicht (UVV): optional, 3,50 € netto pro Monat – 1× jährlich UVV-Check inkl. Dokumentation",
"Dienstrad-Wartung & Verschleiß: optional, 10 € netto pro Monat – Wartung/Verschleiß inkl. Material bis 140 € brutto pro Vertragsjahr (nicht übertragbar)",
"Weitere Pakete lt. Werkstatt-Modalitäten 05/2026 (nicht in den Bedingungen für Rahmenverträge ab 01/2024): Fahrrad-Rundumschutz (Schaden + Verschleiß ohne Reifen/Bremsen), Fahrrad-Vollkasko, Wartungspaket",
"Welche Pakete Pflicht/wählbar sind, legt der Arbeitgeber fest – gebuchte Pakete stehen auf dem Mobilitätsschein"
],
"isz": "UVV: 50 € inkl. MwSt. per Liefergutschrift (inkl. bis 20 Min. Einstellarbeiten; Teile, Reparatur, Software-Updates zahlt der Kunde) · Wartung & Verschleiß: bis zum Budget auf dem Mobilitätsschein (Standard 140 € brutto/Vertragsjahr) · Pflicht: auch Kazenmaier-Räder anderer Händler annehmen",
"vsd": "Nur mit Paket Wartung & Verschleiß: bis 140 € brutto pro Vertragsjahr (Budget lt. Mobilitätsschein, Kontingent vorher abfragen) · Komplettschutz: kein normaler Verschleiß, nur Akku unter 50 % · Rundumschutz (ältere Pakete): Verschleiß ohne Reifen/Bremsen – bis 150 € ohne Freigabe, darüber telefonisch",
"abMon": "Wartung & Verschleiß ab dem 7. Vertragsmonat (Erstinspektion/„Kunden-Service“ ausgeschlossen), Budget je 12 Monate ab Übernahme · UVV frühestens 11 Monate nach Übernahme, dann alle 12 Monate",
"isCode": "Nein – Kunde zeigt Mobilitätsschein (gebuchte Pakete stehen drauf) · UVV-Protokoll im Portal per Vertragsnummer erzeugen (Portal prüft Paket und Fälligkeit)",
"vers": "Ja – Dienstrad-Komplettschutz (eigenes Kazenmaier-Leistungspaket, lt. Paketseite verpflichtend; alternativ Versicherungsnachweis des Arbeitgebers) · Mobilitätsgarantie immer inklusive",
"reNeu": "Keine Rechnung – Liefergutschrift der Kazenmaier Leasing GmbH, Ottostraße 18, 76227 Karlsruhe, nach digital signierter Übernahmebestätigung + korrekter Rahmennummer im Portal · Zahlung binnen 2 Arbeitstagen · eigene Rechnung nur, wenn Kazenmaier die Gutschrift verweigert",
"reIV": "UVV: Protokoll im Dienstradportal erzeugen, unterschrieben + gestempelt hochladen → Liefergutschrift, KEINE Rechnung schicken · Wartung & Verschleiß: Kontingent vorher abfragen (0721 3728-732 / -735), Rechnung auf Kazenmaier Leasing GmbH mit Leasingvertrags-Nr., Rahmennr., km-Stand per Mail an schaden@kazenmaier.de",
"reSch": "Fotos + KVA an schaden@kazenmaier.de, Freigabe abwarten (Tel. 0721 3728-732 / -735; ggf. nur Teilbetrag, Rest zahlt Kunde) · Rechnung auf Kazenmaier Leasing GmbH, Ottostr. 18, 76227 Karlsruhe (Leasingvertrags-Nr., Rahmennr., km-Stand) per Mail an schaden@kazenmaier.de · Kunde meldet selbst per Schadenanzeige an schadenmeldung@kazenmaier.de · Ersatzrad nach Diebstahl: Angebot an Kazenmaier, dann Lieferrechnung an schaden@kazenmaier.de",
"drei": true,
"spe": true,
"code": "Kein Abholcode – Einkaufszertifikat: Kunde weist es im Portal unserem Laden zu, wir identifizieren per Ausweisnummer · Abholung per digital signierter Übernahmebestätigung",
"mit": "Ausweis (das im Portal hinterlegte Dokument) + Smartphone für die digitale Unterschrift · ohne Smartphone: Papierprozess (Leasingschein + Einkaufszertifikat ausdrucken, unterschreiben, im Portal hochladen)",
"zubJa": [
"Pflicht: Schloss lt. Einkaufszertifikat – Falt-, Bügel- oder Kettenschloss ab 49 € UVP oder mind. 50 % der Hersteller-Sicherheitsskala (kein Zahlenschloss)",
"Pflicht: Beleuchtung nach StVO",
"Fest verbaut: Gepäckträger, Schutzbleche, Ersatzakku, Klingel, Flaschenhalter, Kindersitz, Pumpe mit Rahmenhalterung, Bike-Computer/Navi, GPS-Diebstahlschutz",
"Anpassungen: Griffe, Sattelstütze, Sattel, Pedale, Laufradsatz, Reifen",
"Nicht fest verbaut (leasbar, aber nicht im Komplettschutz): Helm, Gepäck-/Satteltaschen, Anhänger (Kind/Hund), Auto-Fahrradträger, Abdeckplane",
"Arbeitgeber kann Zubehör einschränken – maßgeblich ist das Einkaufszertifikat"
],
"zubNein": [
"Bekleidung aller Art",
"Zahlenschlösser (als Pflichtschloss nicht zugelassen)"
]
},
{
"k": "RD",
"pak": [
"RadFahrSchutz (Vollkasko, bei jedem Rad in der Rate): ohne Selbstbeteiligung, weltweit · (Teile-)Diebstahl, Vandalismus, Sturz/Unfall, Feuchtigkeits-/Elektronikschäden an Akku und Motor, Defekt nach Gewährleistung, Totalschaden · Neuwert · grobe Fahrlässigkeit mitversichert",
"Verschleiß ohne Höchstgrenze – alle Teile inkl. Reifen, Bremsen, Akku",
"Mobilitätsgarantie europaweit, 24-h-Pannenhilfe",
"Arbeitgeber-Ausfallschutz: Krankheit, Elternzeit, Kündigung, Tod",
"Inspektionspaket mit UVV-Check: 1 Inspektion pro Leasingjahr · öffentl. Dienst je nach Dienststelle gebucht · RIDE-Firmen (angebunden ab 09.06.2026): 150 € brutto je Inspektion",
"Öffentl. Dienst (RadimDienst, TV-Fahrradleasing): 1 Rad pro Beschäftigtem, max. 7.000 € inkl. Zubehör"
],
"isz": "RIDE-Firmenkunden: 150 € brutto je Inspektion, wenn Firma ab 09.06.2026 angebunden (vorher: niedrigerer Satz – vor jeder Inspektion im Händlerportal prüfen) · Partnerprogramm (nur RIDE): 30 € netto Abwicklungspauschale je bei uns übergebenem Rad, 20 € netto Reparaturbonus 1×/Jahr je Nutzer ab 150 € freigegebener Reparatur, 120/180 € netto Vermittlungsprämie für über das Händlerportal angeworbene Firmen · RadimDienst (öffentl. Dienst): keine Prämien, Inspektionsbudget lt. Händlerportal",
"vsd": "Ja – Verschleiß ohne Höchstgrenze im RadFahrSchutz, ohne Selbstbeteiligung · Verschleiß und Schadenreparatur nie auf eine Rechnung: je Ereignis eigene Schadenmeldung + eigene Rechnung",
"abMon": "Inspektion 1× pro Leasingjahr (i. d. R. 3× je Vertrag), nicht genutztes Budget verfällt · Schäden unverzüglich melden",
"isCode": "Nicht beschrieben – gebuchtes Paket und Inspektionsbudget je Nutzer im Händlerportal prüfen",
"vers": "Ja – RadFahrSchutz bei jedem Rad in der Rate: Vollkasko + Verschleiß + Mobilitätsgarantie + Arbeitgeber-Ausfallschutz",
"reNeu": "Keine Rechnung – Gutschrift (§ 14 Abs. 2 UStG) der Ride Mobility GmbH, Stadionring 1, 44791 Bochum, über vollen Rad- + Zubehörpreis nach dokumentierter Übernahme, Zahlung spätestens 14 Werktage · Anfrage im Händlerportal unter „Kunden anlegen“ mit Dienststellen-/Leasingcode · keine Provision, keine Aufschläge/Bearbeitungsgebühren erlaubt",
"reIV": "Im RIDE-Händlerportal/App: Inspektion mit UVV-Checkliste dokumentieren und abrechnen · Leistungen über das Paket hinaus zahlt der Kunde · Prämien kommen gesammelt als Monatsgutschrift (2–3 Werktage nach Monatsende)",
"reSch": "Schadenmeldung unverzüglich – Kunde im Beschäftigtenportal oder wir im Händlerportal · Reparaturrechnung im Händlerportal einreichen · je Ereignis eigene Meldung + Rechnung",
"code": "Ja – Übernahmecode: Kunde erzeugt ihn vor der Abholung im Portal (nach Freigabe + unterschriebenem Überlassungsvertrag); Übergabe damit im Portal dokumentieren",
"mit": "Übernahmecode + Personalausweis oder Reisepass",
"zubJa": [
"Öffentl. Dienst (TV-Fahrradleasing): nur fest mit dem Rad verbundenes Zubehör",
"Fahrradanhänger (auch Kinderanhänger), Kindersitz",
"Lastenrad-Aufbauten: Sitzpolster, Transportkiste, Regenschutz, Kinderverdeck",
"Gepäckträger, Korb, Schutzbleche, Sattel, Beleuchtung",
"Zweiter Akku, Navi/Handyhalterung, Tacho",
"Schloss mit Halterung (Bügel-, Falt-, Kabel-, Kettenschloss) · Rahmen-/Speichenschloss allein reicht für die Versicherung nicht",
"RIDE-Firmen zusätzlich lt. Händler-Leitfaden: Taschen, Hundekörbe",
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
"v": 5,
"pak": [
"Basis: 40 € Selbstbeteiligung, 75 € Bagatellgrenze, Diebstahl/Raub versichert",
"Premium: keine Selbstbeteiligung, keine Bagatellgrenze, Verschleiß 100 % ab Tag 1, UVV-Check nach Jahr 1 + 2 (max. 30 €/Jahr), Mobilitätsschutz 24/7 europaweit",
"PremiumPLUS: wie Premium + Inspektion inkl. UVV nach Jahr 1 + 2 (max. 60 €/Jahr, Antrag ab 01.03.2024: 90 €/Jahr), Zeitwertentschädigung bei Diebstahl/Totalschaden, Schutz bei Elternzeit/Krankheit",
"Paket legt der Arbeitgeber fest · Kundenpreis: steckt in der Leasingrate"
],
"isz": "PremiumPLUS: Inspektion inkl. UVV max. 60 € (Antrag bis 29.02.2024) bzw. 90 € (ab 01.03.2024) · Premium: nur UVV max. 30 € · Mehrkosten zahlt der Kunde",
"vsd": "Premium + PremiumPLUS: 100 % ab Tag 1, ohne Obergrenze · Basis: nein · Einreichen über assona, die ganzen 36 Monate",
"vers": "Ja – assona wickelt die Schäden ab (Basis / Premium / PremiumPLUS)",
"reNeu": "Keine Rechnung – nach Übermittlung des Übergabe-Tokens automatische Gutschrift der AGL Activ Services GmbH über den Gesamtverkaufspreis",
"reIV": "Inspektion: seit 07.04.2026 nur noch per Gutschriftverfahren im Dienstrad-Tool (nicht mehr über assona) · UVV-Checkliste im Dienstrad-Tool hochladen · Verschleiß: über assona (Rahmennummer)",
"reSch": "Direkt mit assona über die Rahmennummer (kein extra Code) · Schäden erst 1 Monat nach Vertragsbeginn einreichbar · Diebstahl: kundenservice@assona.com, Polizeianzeige + Schloss-Nachweis",
"abMon": "Inspektion frühestens im 10. bzw. 22. Monat · Verschleiß ab Tag 1 · Schäden ab 2. Monat",
"code": "Ja – Mitarbeiter-Token (60 Tage gültig) zum Bestellen · Übergabe-Token bei der Abholung (aktiviert den Vertrag)",
"mit": "Übergabe-Token",
"isCode": "Nein – Zuordnung über die Rahmennummer",
"zubJa": [
"Alles, was fest mit dem Rad verbunden ist (zählt zur Ausstattung)",
"Schloss"
],
"zubNein": [
"Alles, was nicht fest mit dem Rad verbunden ist"
],
"kon": "fachhaendler@eurorad.de · +49 221 845539-0 · Portal: leasingportal.eurorad.de",
"ende": "Rücknahme nach 36 Monaten freiwillig – nur alle oder keine, Entscheidung an anfrage@agl.de · Vorzeitige Rückgabe nur mit schriftlichem Formular des Nutzers, an leasing@eurorad.de melden · Ablöseangebot verschickt die AGL",
"preis": "Rad mind. 357 €, max. 20.000 € (Höchstpreis legt der Arbeitgeber fest) · Lastenräder erlaubt"
},
{
"k": "CB",
"pak": [
"Rundum-Schutz (in der Rate, 36 Monate, weltweit): Unfall/Sturz, Bedienfehler, Vandalismus, Diebstahl, Garantieverlängerung ab dem 3. Jahr + Mobilitätsgarantie – Bestellungen ab 01.02.2024 ohne Selbstbehalt (ältere: 10 %, max. 100 €) · Verschleiß, Verbrauchsmaterial, Platten, optische Schäden ausgeschlossen",
"Jahresinspektion (optional, in der Nutzungsrate): Verträge ab 16.11.2025 – Kunde bucht selbst, Budget bis 120 € je Inspektion · Verträge 16.02.2024–16.11.2025 – Preis aus unserem Angebot (mind. 75 €) · ältere Händleroption-Verträge ohne Inspektion",
"Kein Verschleiß-/Wartungspaket"
],
"isz": "Neu (ab 16.11.2025): tatsächlicher Preis, max. 120 € je Inspektion (egal welche Radkategorie) · Alt (16.02.2024–16.11.2025): exakt der Angebotspreis (mind. 75 €, fest für 36 Monate) · Gutschrift binnen 9 Werktagen ohne Abzug · Mehrkosten zahlt der Kunde",
"vsd": "Nein – kein Verschleiß-/Wartungspaket, Verschleiß zahlt der Kunde selbst",
"abMon": "1 Inspektion pro Nutzungsjahr (Nutzungsjahr beginnt im Monat nach der Übergabe) · Kunde kann den Code nur im gültigen Inspektionszeitraum erzeugen",
"isCode": "Ja – Kunde erzeugt Inspektionscode (PIN, Mail-Betreff „Company Bike Händleroption Inspektionscode“ + Auftragsnr.) im Kundenkonto → Portal „Inspektion durchführen“, danach „abschließen“ · neue Verträge bei jedem CBS-Händler, alte nur beim liefernden Händler · ohne Code keine Abrechnung",
"vers": "Ja – Rundum-Schutz der Leasinggesellschaft (kein Versicherungsvertrag) inkl. Diebstahl, Garantieverlängerung und Mobilitätsgarantie · ab 01.02.2024 ohne Selbstbehalt",
"reNeu": "Keine Rechnung schicken – Gutschriftverfahren der company bike solutions GmbH über den Bestellbetrag, ausgelöst durch die Übergabe im Portal (Übergabecode) · Zahlung automatisch binnen 9 Tagen abzgl. 2 % Skonto · vorher einmalig fürs Gutschriftverfahren registrieren (USt-ID nötig)",
"reIV": "Inspektion: keine Rechnung – per Inspektionscode im Portal abschließen → Gutschrift binnen 9 Werktagen · Verschleiß/Reparaturen rechnet der Kunde selbst mit uns ab · Händlerbetreuung: haendler@company-bike.com · +49 89 242 94 150 (Mo–Fr 9–17 Uhr)",
"reSch": "Kunde meldet den Schaden selbst digital im Kundenkonto (wir können nicht melden) · wir: Fotos/Videos + KVA mit schriftlicher Begründung des technischen Defekts (KVA-Kosten werden nicht erstattet) · erst nach Freigabe reparieren · Rechnung an company bike solutions GmbH, Aidenbachstraße 54-56, 81379 München – direkt mit uns oder Kunde zahlt vor und bekommt erstattet",
"code": "Ja – Angebotscode (QR + PIN) erzeugt der Kunde im Kundenkonto für unsere PLZ (je Code nur 1 Angebot annehmbar) · nach Bestellung per Mail + Rahmen-/Akkunummer im Portal bekommt der Kunde den Übergabecode (QR/PIN)",
"mit": "Übergabecode (QR/PIN) – ohne Code kein Rad übergeben",
"zubJa": [
"Fest verbautes Zubehör: Beleuchtung (E-Bike mit Verkabelung, Dynamo), fest verschraubte Schutzbleche, Gepäckträger, Ständer",
"Sattel, Sattelstütze, Pedale, Griffe, Vorbau, Laufradsatz, Bereifung",
"Schloss: Rahmenschloss + Ansteckkette oder Markenschloss mit Halterung/Tasche",
"Zweiter Akku bei Dual Battery",
"Kindersitz, Lastenrad-Aufbau (Kiste/Box), Persenning",
"Flaschen-/Pumpenhalter, Klick-Fix-Halterung, Klingel, Spiegel, Reflektoren, GPS-Tracker (ohne Lizenz)",
"Montage/Aufbau: bis 10 % der Rad-UVP, max. 150 €"
],
"zubNein": [
"Taschen / Körbe (auch fest montiert)",
"Abnehmbare Beleuchtung / Navi / Tacho",
"Kleidung, Helm, Brille, Schuhe",
"Zusatzakku (nicht verbunden)",
"Trinkflaschen, Pumpen, Werkzeug",
"Kinder-/Hundeanhänger",
"Steckschutzbleche (nicht fest)",
"Ketten-/Zahlenschloss, nicht montierbares Schloss",
"Fracht-/Versandkosten"
]
},
{
"k": "LB",
"pak": [
"Neuverträge ab 13.03.2025, Bausteine frei kombinierbar (Arbeitgeber kann Optionen vorgeben/ausschließen):",
"Diebstahl & Schaden: Premium (Zeitwert – bei Diebstahl/Totalschaden endet der Vertrag) oder All-inclusive (Neuwert – Ersatzrad zum Anschaffungswert inkl. Zubehör) · ohne Selbstbeteiligung · Rad muss abgeschlossen sein · inkl. europaweiter Mobilitätsgarantie",
"Inspektion: Basis 2× bis 85 € · Premium 3× bis 85 € · All-inclusive 3× bis 115 € (brutto, max. 1 pro Leasingjahr)",
"Verschleiß: Basis 50 € · Premium 150 € brutto pro Leasingjahr · All-inclusive unbegrenzt",
"Kundenpreis: steckt in der Rate (36 Monate) · Radwert 499–15.000 € brutto inkl. Zubehör · keine private Zuzahlung über das Arbeitgeber-Limit",
"Altverträge bis 12.03.2025: gemeinsames Servicebudget (Inspektion + Verschleiß) Basis 75 € · Premium 200 € brutto/Jahr · All-inclusive unbegrenzt"
],
"isz": "Neu: bis 85 € brutto (Basis/Premium) bzw. 115 € brutto (All-inclusive), max. 1 pro Leasingjahr · Altverträge: Erstinspektion bis 41,65 € brutto (35 € netto), ab 13./25. Monat bis 83,30 € brutto (70 € netto) aus dem Servicebudget · Mehrkosten zahlt der Kunde",
"vsd": "Ja – Basis 50 € · Premium 150 € brutto pro Leasingjahr · All-inclusive unbegrenzt (Rest verfällt am Ende des Leasingjahres) · Altverträge: Servicebudget 75/200 €/unbegrenzt · Ersatz nur gleicher Art und Güte (keine Upgrades) · Platten = Verschleiß",
"abMon": "Max. 1 Inspektion pro Leasingjahr · Altverträge: Erstinspektion im 1. Leasingjahr, weitere ab dem 13. und 25. Monat",
"isCode": "Nein – kein Code: Abrechnung im Service Hub über die Vertrags-ID (dort auch Restbudget sichtbar)",
"vers": "Ja – Diebstahl- & Schadenschutz (Versicherungspartner Allianz) ohne Selbstbeteiligung + europaweite Mobilitätsgarantie mit 24/7-Pannenhilfe",
"reNeu": "Rechnung im Lease-a-Bike-Portal erzeugen (Rechnungsnr. + -datum eintragen, bestätigen) – Empfänger ist die jeweilige Leasinggesellschaft (steht auf der Rechnung), nichts separat schicken · Auszahlung nach Übergabe (Abhol-PIN) und Aktivierung durch die Leasinggesellschaft",
"reIV": "Service Hub im Portal (Online-Formular, Vertrags-ID) → nach Prüfung/Freigabe Gutschrift im Rahmen des Budgets · Mehrkosten zahlt der Kunde vor Ort · Fragen: service@lease-a-bike.de · +49 4471 967 3337",
"reSch": "Kunde meldet im Portal („Schaden/Diebstahl melden“ → Allianz-Portal) oder wir über „Schaden & Diebstahl melden“ mit KVA/Rechnung + Fotos aller beschädigten Teile · wir ergänzen Reparaturdaten · nach Freigabe reparieren, Erstattung direkt durch Lease a Bike · Diebstahl-Ersatzrad (nur All-inclusive): Rechnung an Lease a Bike",
"spe": true,
"code": "Ja – 6-stelliger Bestellcode des Kunden (Mail/Portal) zum Anlegen des Vertrags · Abhol-PIN je Rad per Mail an den Kunden nach Arbeitgeber-Freigabe",
"mit": "Abhol-PIN (erst bei der Übergabe im Laden nennen) – wir tragen PIN, Rahmennummer und ggf. Akku-Seriennummer im Portal ein",
"zubJa": [
"Alles fest verbaute/verschraubte Zubehör oder mit fest montierter Halterung",
"Schloss, Klingel, Beleuchtung & Rückspiegel (fest)",
"Gepäckträger, Schutzbleche, Ständer, Ketten-/Mantelschutz",
"Laufradsatz, Reifen, Bremsen, Steckachsen, Kettenblätter",
"Vorbau, Lenkeraufsatz, Ergo-Griffe, Sattel-Upgrade, Sattelstütze, Pedale, Flaschenhalter",
"Zweiter Akku + modellspezifische Halterungen",
"Navi nur fest verbaut",
"Lastenrad: Kindersitz, Sitzbank, Kiste/Box, Abdeckung, Regen-/Kinderverdeck"
],
"zubNein": [
"Helm",
"Taschen (abnehmbar)",
"Körbe (abnehmbar)",
"Anhänger",
"Kleidung, Handschuhe, Schuhe",
"Lichtsets (nicht fest)",
"Abnehmbare Displays / Bordcomputer",
"Trinkflaschen",
"Smartphone-Halter (abnehmbar)"
]
},
{
"k": "DD",
"pak": [
"Basis: Vollkasko + Mobilitätsgarantie, 1 Sichtprüfung/UVV pro Jahr (3× in der Laufzeit) – Reparaturen/Verschleiß zahlt der Kunde",
"FullService: wie Basis + Verschleiß & Instandhaltung bis max. 210 € inkl. MwSt.",
"Premium: wie Basis + Verschleiß & Instandhaltung unbegrenzt",
"Arbeitgeber legt das Paket bei Vertragsabschluss fest, Preis steckt in der Rate · nachträglich nicht buchbar · gebuchtes Paket + Budget stehen in der Servicekarte der DD-Plattform"
],
"isz": "Basis: automatische Gutschrift 70 € brutto je Sichtprüfung (2 Werktage) · FullService/Premium: Gutschrift in Höhe der Leistung (3 Werktage) · Verschleiß und Hersteller-Serviceempfehlungen zahlt bei Basis der Kunde",
"vsd": "Basis: nein · FullService: bis 210 € inkl. MwSt. · Premium: unbegrenzt · ohne Wartezeit, Anzahl Besuche unbegrenzt",
"vers": "Ja – Vollkasko inkl. Mobilitätsgarantie in jedem Service-Paket, ohne Bagatellgrenze und Selbstbehalt · Selbstständige: Versicherung optional, Kaskoschutz über Leasinggeber MLF Mercator-Leasing (S-Pedelecs dort nicht versicherbar)",
"reNeu": "Keine Rechnung – nach Eingabe des Abholcodes Gutschrift als PDF in der DD-Plattform, Auszahlung i. d. R. in 2–3 Werktagen · Selbstständige: Übernahmebestätigung + Rechnung per Mail an DD (Auszahlung 2–3 Werktage), Rechnung an DD Deutsche Dienstrad GmbH, Sven-Wingquist-Straße 2, 97424 Schweinfurt",
"reIV": "DD-Plattform: Kunde wählt uns als Servicepartner, Abwicklung mit seinem Berechtigungscode – automatische Gutschrift (2–3 Werktage)",
"reSch": "Kunde meldet den Schaden in der DD-Plattform („Meine Versicherung“), Hotline 09721 97293-80 · Reparaturrechnung auf MLF Mercator-Leasing GmbH & Co. Finanz-KG, Londonstraße 1, 97424 Schweinfurt, mit Rahmennummer (sonst nur Netto-Erstattung) – vorher KVA + Freigabe · Totalschaden: KVA eines DD-Fachhändlers mit Rahmennummer, Ursache, Reparaturumfang",
"abMon": "1. Sichtprüfung Monat 1–12, 2. Monat 13–24, 3. Monat 25–36 nach Übernahme · Verschleiß (FullService/Premium) ohne Wartezeit",
"code": "Ja – wir setzen das Rad in der DD-Plattform auf „abholbereit“ → Kunde bekommt den Abholcode per Mail (steht auch in seiner Bestellung) · Code-Eingabe = Übernahmebestätigung, startet Leasing + Versicherung",
"mit": "Abholcode + gültiger Personalausweis · Selbstständige: Personalausweis + Übernahmebestätigung",
"isCode": "Ja – Berechtigungscode per Mail, sobald die Sichtprüfung fällig ist (auch in der Servicekarte der DD-Plattform) · damit holt der Kunde das Rad nach dem Service ab",
"spe": true,
"zubJa": [
"Anbauteile: Ständer, Schutzblech, Pedale, Gepäckträger, Kettenschützer, Flaschenhalter, Rahmenschutzfolie",
"Montagematerial / Adapterplatte für Taschen und Körbe",
"Sonderumbau für Gehandicapte (z. B. Stützräder), Versehrtenkurbel",
"Cockpit: Barends, Griffe, Lenkerband, Lenker-/Vorbau-Upgrade, Smartphone-Halterung, Rückspiegel, Klingel",
"Tacho (mit/ohne GPS) und Navi – leasingfähig, aber nicht versichert",
"Beleuchtung (StVZO): Pedelec-Beleuchtung fest verbaut, Akku-Beleuchtung, Reflektoren-Set",
"Schlösser: Bügel-, Falt-, Kabel-, Ketten-, Rahmenschloss, Einsteckkette",
"Upgrades: Antrieb, Bremsen, Laufräder, Reifen, Schlauch, Tubeless, Federgabel, Dämpfer, Sattel, Sattelstütze",
"E-Bike: Display-/Bedieneinheit-Upgrade, Akku mit mehr Kapazität, zweiter Akku (Dual-System)",
"GPS-Diebstahlschutz, Wattmessgerät",
"Lastenrad: Kiste/Box, Regenverdeck, Persenning",
"Zusatzleistungen: Montagekosten, Sonderlackierung ab Werk, Transport-/Versandkosten, Transportversicherung",
"Nur zusammen mit dem Rad im Angebot – nachträglich nicht möglich"
],
"zubNein": [
"Bekleidung / Schuhe",
"Helm",
"Ersatzteile",
"Rucksack",
"Taschen / Körbe",
"Werkzeug",
"Pumpe (Stand-/Dämpferpumpe)",
"Trinkflasche (einzeln)",
"Fahrradgarage",
"Fahrradanhänger + Steckachse für Anhänger"
]
},
{
"k": "EN",
"v": 6,
"pak": [
"Rundumschutz Plus (nur neue E-Bikes/S-Pedelecs): Diebstahl, Teilediebstahl, Raub, Vandalismus, Unfall/Sturz/Panne, unsachgemäße Handhabung, Elektronik-/Akkudefekt, Brand/Elementar, Pick-Up-Service + Verschleiß inkl. Akku",
"Rundumschutz (gebrauchte bzw. über 6 Monate alte E-Bikes, alle Fahrräder/Anhänger): wie Plus, aber ohne Verschleiß",
"Neuwert-Ersatz bis zur Versicherungssumme, keine Selbstbeteiligung · Material-/Konstruktionsfehler erst nach Ablauf der Herstellergarantie",
"Laufzeit 1 Jahr, verlängert automatisch bis max. 7 Jahre · Prämie per SEPA jährlich oder monatlich (mit Aufpreis), Preis per Tarifrechner (Kaufpreis + PLZ)",
"Versicherer Bovemij (NL), ENRA ist Vermittler · auch Versicherer beim BusinessBike-Leasing (dort Abwicklung über das BusinessBike-Portal)"
],
"vRad": "E-Bikes/Pedelecs + S-Pedelecs bis 10.000 € Kaufpreis (laut enra.eu, Stand 12.11.2026; teurere Räder nur nach Rücksprache mit ENRA) · Fahrräder/Anhänger bis 6.000 € (Rechnungspreis nach Rabatt inkl. Schloss + fest verschraubtem Zubehör) · auch Lastenräder, Dreiräder · neu = Erstbesitz, max. 6 Monate ab Kauf · älter/gebraucht nur über ENRA-Partner (prüft Zustand, legt Wert fest) · CE nötig · gewerblich, Sport/Bikepark, Dirt/Downhill/Triathlon nur Diebstahlschutz · Schloss UVP mind. 50 € · Wohnsitz in Deutschland",
"spe": true,
"drei": true,
"vAbs": "Antrag (ENRA-Formular, mit unserer ENRA-Vertragspartner-Nr.) per E-Mail oder Post an ENRA oder per Upload im ENRA-Partnerportal · SEPA-Mandat dazu · Police kommt per Mail · wir bekommen Provision (Höhe nicht öffentlich) · neue Räder kann der Kunde auch selbst online abschließen",
"isz": "Nicht versichert – Wartung, Inspektion, Software-Updates, Durchsicht nach Sturz zahlt der Kunde",
"vsd": "Nur Rundumschutz Plus (neue E-Bikes/S-Pedelecs): Verschleiß an versicherten fest verschraubten Teilen + Akku unter 50 % Kapazität · Rundumschutz/Fahrräder ohne Verschleiß",
"abMon": "Ab dem 7. Monat nach Versicherungsabschluss (Verschleiß und Akkuverschleiß)",
"vMeld": "Schadenformular (Unfall/Sturz/Reparatur bzw. Diebstahl/Teilediebstahl/Vandalismus) mit dem Kunden ausfüllen → ENRA-Partnerportal oder Mail an info@enra.eu, Betreff „Schaden + Police-Nr.“ · Kaufrechnung Rad + Schloss beilegen · Diebstahl/Vandalismus: Polizeianzeige binnen 5 Werktagen, Bescheinigung nach § 158 StPO mit Rahmennummer",
"vKva": "Abrechnung nur nach Rechnung – nach KVA ausgeschlossen, KVA-Erstellung wird nicht erstattet · Carbon-Rahmen/Akku: ENRA kann Prüfung durch Sachverständigen verlangen (binnen 14 Tagen bereitstellen)",
"reSch": "ENRA – Regulierung als Reparatur/Ersatzrad über uns, Erstattung direkt an uns nach Vorlage der Rechnung (Reparatur bzw. Ersatzbeschaffung)",
"vSb": "Keine – in allen Tarifen",
"vKon": "ENRA GmbH, Novesiastr. 38, 41564 Kaarst · 02131 12436-0 (Mo–Fr 8:30–17:00) · info@enra.eu · Vertragsänderungen: vertrag@enra.eu · Pick-Up-Service 0800 907 07 07 (Ausland +49 3222 109 17 44)"
},
{
"k": "AL",
"pak": [
"Basis: Diebstahl, Einbruch, Raub, Vandalismus, Diebstahl von Teilen, festem Akku + mitversichertem Zubehör/Schloss · kein Verschleiß",
"Komfort: + Sturz/Unfall, Bedienfehler, Naturgewalten, Feuchtigkeit/Elektronik an Akku/Motor/Steuerung, Material-/Produktionsfehler nach Gewährleistung + Verschleiß bis 150 €/Jahr (ohne Reifen, Bremsen, Akku)",
"Premium: wie Komfort + Verschleiß max. 2 Fälle/Jahr inkl. Reifen, Bremsen, Akku · Helm/Schutzkleidung bis 500 € · Ersatzrad-Miete bis 150 € · Inflationsausgleich bis +15 %",
"Leasingzusatz (nur mit Premium, während der Leasinglaufzeit): deckt Lücken zum Leasing-Versicherer · bei Diebstahl/Totalschaden Ersatz der gezahlten Leasingraten",
"Alle Tarife: 24/7-Mobilitätsschutz (ROLAND) · Wiederbeschaffung beim Händler, bei dem gekauft wurde · GPS-Option (It's My Bike) 18 €/Jahr, Tracker stellt Alteos, Einbau durch uns binnen 30 Tagen (Montage zahlt Kunde) · 10 % Nachlass bei verbautem GPS",
"Schloss-Pflicht: mind. 45 € brutto, Rad einzeln an festen Gegenstand · Rahmenschloss nur mit Einsteckkette"
],
"vRad": "Fahrräder, E-Bikes, S-Pedelecs (bis 45 km/h) bis 20.000 € inkl. Schloss + Zubehör (auch Anhänger) · nur im Handel gekauft, technisch einwandfrei · Basis/Komfort: bis 39 Monate nach Kauf (auch Gebrauchte vom Händler) · Premium: Erstbesitz, bis 12 Monate nach Kauf · Leasingzusatz: bis 3 Monate nach Leasingbeginn · Leasing-Übernahme: bis 3 Monate nach Leasingende (Basis/Komfort, Wert = Leasingwert) · keine Velomobile, Downhill/Dirt nur Basis · Verleih/Vermietung nur auf Anfrage",
"spe": true,
"vAbs": "Nur über Partner – Alteos-Partnerportal (seit 03/2026) mit eigener Abschlussstrecke oder per QR-Code · Kunde zahlt direkt an Alteos (PayPal, Kreditkarte, SEPA) · Provision in % der Netto-Prämie · Kassen-Anbindung u. a. HIW/BIKE&CO, velo.port",
"isz": "Nicht versichert – zahlt der Kunde",
"vsd": "Basis: nein · Komfort: bis 150 €/Jahr – Kette/Riemen, Kassette/Ritzel, Speichen, Pedale, Griffe, Züge, Getriebenabe inkl. Service, Lager (ohne Reifen, Bremsen, Akku) · Premium: max. 2 Fälle/Jahr, zusätzlich Reifen/Schläuche, Bremsbeläge/-scheiben/-flüssigkeit + Akku (unter 50 % in den ersten 3 Jahren, danach unter 40 %) · Kunde zahlt vor, Alteos erstattet",
"abMon": "Komfort: 6 Monate Wartezeit, wenn der Abschluss mehr als 12 Monate nach dem Kauf erfolgt – sonst sofort · Premium: sofort",
"vMeld": "Partnerportal → Schadenfälle → „Schaden melden“ – oder Kunde selbst über mein.alteos.com/schaden bzw. service@alteos.com · binnen 14 Tagen · Diebstahl nur mit Polizei-Aktenzeichen",
"vKva": "KVA + Fotos vor der Reparatur, wenn Reparaturkosten voraussichtlich über 350 € · Reparatur nur durch von Alteos freigegebene Werkstatt",
"reSch": "Kunde reicht unsere Reparaturrechnung bei Alteos ein (Händler nicht beteiligt) · Pflichtangaben: Marke, Typ, Rahmen-Nr.",
"vSb": "Keine (alle Tarife)",
"vKon": "030 5884 9112 (Service E-Bike/Fahrrad, Mo–Fr 9–18 Uhr) · service@alteos.com · Partner werden: 030 5683 8665"
},
{
"k": "FS",
"pak": [
"FahrSicherung ist Versicherungsmakler (Berlin) mit Eigenprodukt „FahrSicher“ (Risikoträger Barmenia) – kein Versicherer · vergleicht außerdem u. a. Ammerländer, Wertgarantie, Assona, GVO, Häger, ADAC, NeoDigital, Signal Iduna",
"FahrSicher: Diebstahl zum Neuwert (auch loses Zubehör/Gepäck, aus Kfz/vom Träger), keine Schlossvorgabe – Rad muss nur abgeschlossen sein · Beschädigung inkl. Downhill · Schutzbrief (Pannenhilfe, Pick-up, Ersatzrad)",
"FahrSicher: Verschleiß an jedem Teil inkl. Reifen und Bremsen, 5 Jahre ab Erstkauf",
"Inspektion nur über separat gekaufte Inspektionsgutscheine",
"Premiumservice (kostenpflichtig, 2 Jahre Laufzeit): Schadenmanagement + Direktabrechnung mit der Werkstatt, Rückmeldung binnen 24 h werktags, GPS-Tracker „FaSi One“ inklusive"
],
"vRad": "Auch Gebrauchte versicherbar (auch gebrauchte Lastenräder, gewerbliche Pedelecs)",
"vAbs": "FahrSicherung-Händlerportal: nach Registrierung Zugang zu Vergleichsrechner/Abschlussstrecke (ca. 3 Min., ohne Papier und Unterschrift, auch auf unserer Homepage einbindbar), Angebot per Mail an den Kunden, Provisionslisten",
"isz": "Nicht versichert – nur mit Inspektionsgutschein, den der Kunde direkt beim Versicherungsabschluss kauft · Rad bei uns (FahrSicherung-Partner) gekauft → Gutschein nur bei uns einlösbar · Kunde reicht Inspektionsrechnung + Gutschein ein, Erstattung an ihn ca. 14 Werktage",
"vsd": "Ja – jedes Teil inkl. Reifen und Bremsen, 5 Jahre ab Erstkauf · Akku unter 65 % (Jahr 1–3) bzw. 50 %",
"vMeld": "Kunde fordert auf fahrsicherung.de/schadenmeldung mit seiner Versicherungsnummer sein persönliches Schadenformular an (sonst Blanko-Formular) · Diebstahl/Vandalismus: Polizeianzeige möglichst binnen 24 h",
"vKva": "Pauschale Freigabe bis 500 € – darüber KVA",
"reSch": "Direktabrechnung mit uns nur, wenn der Kunde den „Premiumservice“ gebucht hat",
"vKon": "030 921 099 530 (tel. 10–16 Uhr) · rad@fahrsicherung.de"
},
{
"k": "AS",
"v": 5,
"pak": [
"Versicherer bzw. Schadenabwickler bei Eurorad und JobRad – Schäden laufen über das assona-Partnerportal",
"Eigene E-Bike-Tarife im Fachhandel (z. B. E-Power-Schutz) – genaue Bedingungen nicht offiziell geprüft"
],
"vRad": "Fahrrad, E-Bike, Lastenrad · Alter/Wertgrenzen der eigenen Tarife: nicht offiziell bestätigt",
"vAbs": "Partnerportal-Zugang: Anmeldeformular an sales@assona.com (Zugangsdaten per E-Mail) · Abschluss eigener Tarife: Bedingungen nicht offiziell geprüft",
"isz": "Im Leasing je nach Anbieter (Eurorad-Inspektionen seit 07.04.2026 nicht mehr über assona)",
"vsd": "Je nach Tarif bzw. Leasingpaket",
"vMeld": "Partnerportal (Vertrag über Rahmen-/Antragsnummer suchen) · Frist: unverzüglich, bei Zweirad-Policen meist max. 14 Tage · Polizeianzeige bei Diebstahl/Vandalismus unverzüglich (i. d. R. 48 h) · Kunde braucht: Kaufbeleg, Fotos, KVA oder Rechnung; bei Diebstahl Polizeibestätigung + Schloss-Kaufbeleg",
"vKva": "Pflicht: bei jeder Schadenmeldung im Portal ein konkretes Reparaturangebot (zu unseren normalen Konditionen) – erst reparieren, wenn assona im Portal freigibt · kein Anspruch auf Auftrag",
"reSch": "Rechnung an assona GmbH (Pflichtangaben § 14 UStG), zahlbar in 30 Tagen · Vertrag kommt mit assona zustande, nicht mit dem Kunden · kein Werkunternehmerpfandrecht · Leasingräder mit Leasinggeber MLF (JobRad, Deutsche Dienstrad): MLF Mercator-Leasing GmbH & Co. Finanz-KG, Londonstraße 1, 97424 Schweinfurt",
"vKon": "030 208 666 44 (Mo–Fr 8–20, Sa 8–16) · Notruf 24/7: 030 208 666 61 · kundenservice@assona.com · Portal-Zugang: sales@assona.com · JobRad-Schäden: 030 208666-24"
}
];
