# Lernumgebung Magnetismus (Klasse 7)

Selbsttest und Wiederholung zum Thema Magnetismus: Blitz-Check (8 Fragen), acht Module mit Infotext, Animation und Fragen, Abschlusscheck (20 Fragen). Keine Noten, kein Zeitdruck.

## Starten

- Online: `https://nailik433.github.io/physik-animationen-/kl7-magnetismus/` (QR-Code siehe `material/`).
- Offline: `index.html` per Doppelklick öffnen. Alternativ die Einzeldatei `material/lernumgebung_magnetismus_einzeldatei.html`.
- Es werden keine Daten gesendet, keine Cookies und kein Tracking. Der Fortschritt liegt nur im Arbeitsspeicher und in `sessionStorage` (weg beim Schließen des Tabs). Ein Knopf „Neu starten“ setzt alles zurück.

## Aufbau

| Datei | Inhalt |
|---|---|
| `index.html`, `style.css`, `app.js` | Seite, Gestaltung, Ablauf (Startseite, Module, Blitz-Check, Abschlusscheck) |
| `daten/texte.js` | Titel, Infotexte, Beobachtungsaufträge, Glossar (Fachwörter zum Antippen) |
| `daten/fragen.js` | alle Fragen, Antworten und Rückmeldungen |
| `module/m1.js` … `m8.js` | die acht Animationen |
| `module/gemeinsam.js` | Zeichenhelfer und Feldmodell (zwei Punktpole) |
| `module/fragentypen.js` | Fragetypen und Zeichnungen zu Fragen |
| `antworten.html` | Lehrerübersicht aller Fragen mit Lösungen (nicht verlinkt) |
| `werkzeug/` | Skripte für Einzeldatei und QR-Code |
| `material/` | QR-Code (PNG und druckbare PDF), Einzeldatei |
| `PRUEFBERICHT.md` | was getestet wurde |

## Eine Frage ergänzen

In `daten/fragen.js` ein Objekt an `window.FRAGEN` anhängen. Beispiel (Einfachauswahl):

```js
{ id: 'm3q7', modul: 3, typ: 'single',
  frage: 'Frage als Text?',
  antworten: [
    { t: 'Richtige Antwort', ok: true },
    { t: 'Falsche Antwort', h: 'Hinweis, der bei genau dieser Wahl erscheint.' }
  ],
  warum: 'Begründung, die bei richtiger Antwort erscheint.' }
```

Weitere Typen (`multi`, `luecke`, `reihenfolge`, `zuordnen`, `richtung`, `hotspot`) und ihre Felder stehen im Kommentar am Anfang von `daten/fragen.js`. `blitz: true` macht eine Frage zur Blitz-Check-Frage ihres Moduls (genau eine je Modul), `zusatz: true` nimmt sie aus der Wertung. `antworten.html` zeigt neue Fragen automatisch.

## Einzeldatei und QR-Code neu erzeugen

```
python3 animationen/klasse-7/magnetismus/lernumgebung/werkzeug/bauen_einzeldatei.py
python3 animationen/klasse-7/magnetismus/lernumgebung/werkzeug/qr.py
```
