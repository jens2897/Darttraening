DARTTRÆNING – 20-FELTET
Version 1.0

FILER
- index.html: appens brugerflade
- app.js: træningslogik, point, historik, statistik og CSV-eksport
- manifest.webmanifest: PWA-installationsoplysninger
- sw.js: offline-cache
- icon-192.png / icon-512.png: app-ikoner

INSTALLATION PÅ LENOVO TB336FU
En PWA skal åbnes fra en HTTPS-adresse (eller localhost), ikke direkte som en lokal fil.
1. Udpak ZIP-filen på en computer.
2. Læg filerne i en statisk webhosting med HTTPS, fx GitHub Pages eller Netlify.
3. Åbn HTTPS-adressen i Chrome på Lenovo-tabletten.
4. Vælg Chrome-menuen ⋮ > Installer app / Føj til startskærm.
5. Åbn appen fra det nye ikon. Efter første indlæsning kan den bruges offline.

DATA
Træningshistorik gemmes i browserens lokale lager på tabletten. CSV-eksport kan åbnes i Excel eller LibreOffice.
Hvis browserdata slettes, kan historikken gå tabt. Eksportér derfor jævnligt.

FØRSTE VERSION
- Feltvalg 20/19/18 og ni separate registreringsknapper
- Automatisk pointberegning
- Valgfrit antal kast (100 som standard)
- Fortryd, nulstil og afslut før tid
- Historik med dato, kast, kategorier, procent og point
- Udviklingsgraf og CSV-eksport

POINT
- Triple i træningsfeltet: +3
- Single i træningsfeltet: +1
- Alle registreringer i nabofelterne: -1
