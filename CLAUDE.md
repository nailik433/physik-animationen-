# Physik-Animationen – Arbeitsregeln

Statische Seite mit interaktiven Physik-Animationen für den Unterricht (Klasse 7–10). Sprache: **Deutsch**. Kein Build, keine externen Bibliotheken oder CDNs – muss offline per Doppelklick laufen.

## Wenn eine neue Animation entsteht (immer alle Schritte)

1. Datei aus `animationen/_vorlage.html` ableiten, Ablage: `animationen/klasse-<N>/<thema-slug>/<name>.html` (Slug: Kleinbuchstaben, Umlaute ausgeschrieben, z. B. `elektrizitaet`).
2. **Eintrag in `daten/animationen.js` ergänzen.** Nur dadurch erscheint die Animation in der Übersicht. Unterkategorien (`thema`) entstehen automatisch; vorhandene Schreibweise exakt wiederverwenden (z. B. `Elektrizität`), neue Themen nur, wenn wirklich keins passt.
3. Tabelle „Aktueller Stand“ in `README.md` aktualisieren.
4. Testen (siehe unten), erst dann committen.

## Konventionen

- Gemeinsame Bausteine aus `assets/common.js` (`Phys.*`) und `assets/style.css` benutzen, nicht kopieren. Fehlt ein wiederverwendbarer Baustein (z. B. Linse, Feder, Pendel), in `common.js` ergänzen statt in einer einzelnen Seite zu verstecken.
- Farben nie hart codieren, sondern `Phys.f.*` (CSS-Variablen → Hell/Dunkel). Farbcode der Größen siehe README und beibehalten.
- Layout: Zeichenfläche (`canvas`) links, Steuerung/Messwerte rechts, darunter ein „Merke“-Kasten mit den Kernaussagen. Jede Animation hat einen Pause-Knopf (`id="pause"`).
- Physik korrekt und schulgerecht (DIN-Schaltsymbole, Einheiten mit Leerzeichen „6 V“, deutsches Dezimalkomma über `Phys.zahl`). Wo Geschwindigkeiten nur anschaulich skaliert sind, steht ein Hinweis auf der Seite.
- Bedienelemente mind. 44 px hoch, Seite funktioniert auch auf dem Handy (kein horizontales Scrollen) und am Beamer (große Schrift, hoher Kontrast).

## Testen

Seiten per Playwright (Chromium ist vorinstalliert) laden, auf Konsolenfehler prüfen und Screenshots ansehen – hell und dunkel. Statische Dateien genügen, `file://` funktioniert.
