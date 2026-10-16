# Physik-Animationen – Arbeitsregeln

Statische Seite mit interaktiven Physik-Animationen für den Unterricht (Klasse 7–10). Sprache: **Deutsch**. Kein Build, keine externen Bibliotheken oder CDNs – muss offline per Doppelklick laufen.

## Wichtigste Regel

**Nur die Animationen bauen, die der Nutzer ausdrücklich vorgibt** (meist als Prompt-Datei). Keine eigenen Animationen oder „Beispiele“ ergänzen.

## iPad zuerst (gilt für jede Animation)

Alle Animationen werden **für die Nutzung am iPad optimiert** (Safari, quer und hochkant; typische Größen 1024×768, 1180×820, 1366×1024 – dazu Beamer-Betrieb vom iPad aus).

- Bedienung nur per **Touch**: nichts darf von Hover, Rechtsklick oder Tastatur abhängen. Tastenkürzel sind nur eine Zugabe, jede Funktion braucht auch einen Knopf.
- Antippbare Elemente mindestens **44 × 44 px**, mit Abstand zueinander. Schieberegler gut greifbar (Höhe ≥ 32 px).
- **Zeigerereignisse** (`pointerdown/move/up`, bei Ziehen `setPointerCapture`) statt Maus-Ereignisse. Auf Zeichenflächen, die gezogen werden: `touch-action: none`, sonst scrollt oder zoomt die Seite mit. Auf Knöpfen und Bedienflächen `touch-action: manipulation` (kein Doppeltipp-Zoom).
- Auf Bedien- und Zeichenflächen `user-select: none` und `-webkit-touch-callout: none`, damit kein Textmarkieren oder Lupenmenü aufpoppt.
- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`, Sicherheitsabstände mit `env(safe-area-inset-*)`. Höhen mit `dvh` statt `vh` (Safari-Adressleiste).
- Layout muss **quer und hochkant** ohne horizontales Scrollen funktionieren; bei Vollbild-Animationen das Seitenverhältnis halten.
- Vollbild (`requestFullscreen`) nur als Zugabe, nie als Voraussetzung.
- Keine Funktionen, die auf dem iPad fehlen (z. B. Datei-Download-Tricks, Hover-Tooltips, Rechtsklickmenüs).
- Leistung: flüssig auch auf älteren iPads (Canvas-Auflösung auf `devicePixelRatio ≤ 2` begrenzen, keine unnötigen Verläufe/Schatten pro Bild).

**Test:** zusätzlich zum Desktop mit Playwright-Geräteprofil `iPad (gen 7)` und `iPad Pro 11` testen, jeweils quer und hochkant (`isMobile`, `hasTouch`), per Touch bedienen (`tap`), Screenshots ansehen und auf Überlappung/Abschneiden prüfen.

## Übernommene Animationen bleiben unverändert

Animationen, die der Nutzer aus eigenen Repositories (`nailik433/…`) übernehmen lässt, werden **Byte für Byte aus dem Repository** kopiert (nicht aus Artifacts, die älter sein können) und danach nicht umgebaut: kein Entfernen von Schriften, keine eigenen Änderungen. **Einzige Ausnahme: der Button „← Übersicht"** (siehe nächster Abschnitt). Zum Vergleich mit dem Original den Button vorher entfernen: `python3 tools/uebersicht.py --entfernen DATEI`, dann `cmp` gegen das Original.

## Button „← Übersicht" in JEDER Animation

Jede Animation hat unten links (bei Platzproblemen anders, siehe `POSITION` im Skript) den Button „← Übersicht", der zur passenden Klasse in `index.html` führt. Er wird nie von Hand gebaut, sondern mit dem Werkzeug eingefügt:

- Nach dem Eintrag in `daten/animationen.js`: `python3 tools/uebersicht.py` ausführen (setzt den Button in alle Animationen, mehrfaches Ausführen schadet nicht).
- `python3 tools/uebersicht.py --pruefen` muss „OK" melden, bevor committet wird.
- Der Button ist 44 px hoch, mit Sicherheitsabstand für das iPad. Verdeckt er in einer Animation ein Bedienelement, in `POSITION` eine andere Ecke (`tl`, `tr`, `bl`, `br`) eintragen.

## Wenn eine neue Animation entsteht (immer alle Schritte)

1. Datei aus `animationen/_vorlage.html` ableiten (oder, wenn der Prompt eine eigenständige Einzeldatei verlangt, als `…/<name>/index.html` mit eingebettetem CSS/JS ohne `assets/`), Ablage: `animationen/klasse-<N>/<thema-slug>/<name>.html` (Slug: Kleinbuchstaben, Umlaute ausgeschrieben, z. B. `elektrizitaet`).
2. **Eintrag in `daten/animationen.js` ergänzen.** Nur dadurch erscheint die Animation in der Übersicht. Unterkategorien (`thema`) entstehen automatisch; vorhandene Schreibweise exakt wiederverwenden (z. B. `Elektrizität`), neue Themen nur, wenn wirklich keins passt.
3. `python3 tools/uebersicht.py` ausführen (Button „← Übersicht“ einfügen).
4. Tabelle „Aktueller Stand“ in `README.md` aktualisieren.
5. Testen (siehe unten), erst dann committen.

## Konventionen

- Gemeinsame Bausteine aus `assets/common.js` (`Phys.*`) und `assets/style.css` benutzen, nicht kopieren. Fehlt ein wiederverwendbarer Baustein (z. B. Linse, Feder, Pendel), in `common.js` ergänzen statt in einer einzelnen Seite zu verstecken.
- Farben nie hart codieren, sondern `Phys.f.*` (CSS-Variablen → Hell/Dunkel). Farbcode der Größen siehe README und beibehalten.
- Layout: Zeichenfläche (`canvas`) links, Steuerung/Messwerte rechts, darunter ein „Merke“-Kasten mit den Kernaussagen. Jede Animation hat einen Pause-Knopf (`id="pause"`).
- Physik korrekt und schulgerecht (DIN-Schaltsymbole, Einheiten mit Leerzeichen „6 V“, deutsches Dezimalkomma über `Phys.zahl`). Wo Geschwindigkeiten nur anschaulich skaliert sind, steht ein Hinweis auf der Seite.
- Seite funktioniert auch am Beamer (große Schrift, hoher Kontrast). Handy ist zweitrangig, das iPad hat Vorrang (siehe oben).

## Testen

Seiten per Playwright (Chromium ist vorinstalliert) laden, auf Konsolenfehler prüfen und Screenshots ansehen – hell und dunkel. Statische Dateien genügen, `file://` funktioniert.
