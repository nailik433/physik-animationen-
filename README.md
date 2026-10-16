# Physik-Animationen

Interaktive Physik-Animationen für den Unterricht, sortiert nach **Klasse 7 · 8 · 9 · 10** und darin nach **Thema** (Unterkategorie).
Reines HTML/CSS/JavaScript – kein Build, keine Installation, keine Internetverbindung nötig.

## Öffnen

- Lokal: `index.html` im Browser öffnen (Doppelklick genügt).
- Online: in den Repository-Einstellungen unter *Pages* den Branch `main` (Ordner `/`) veröffentlichen.

## Aktueller Stand

| Klasse | Thema | Animation |
|---|---|---|
| 9 | Elektrizität | Der einfache Stromkreis |
| 9 | Elektrizität | Ohmsches Gesetz |
| 9 | Elektrizität | Reihen- und Parallelschaltung |
| 9 | Elektrizität | Elektrische Leistung und Energie |

Klasse 7, 8 und 10 sind angelegt und warten auf Inhalte.

## Neue Animation hinzufügen

1. Vorlage kopieren: `animationen/_vorlage.html` →
   `animationen/klasse-<N>/<thema>/<name>.html`
   (Ordner in Kleinbuchstaben, ohne Umlaute, z. B. `klasse-8/optik/lichtbrechung.html`).
2. Animation in der neuen Datei ausarbeiten. Gemeinsame Helfer (Schaltsymbole, Elektronen, Diagramme, Regler) stehen in `assets/common.js`.
3. In `daten/animationen.js` einen Eintrag ergänzen:

   ```js
   {
     klasse: 8,
     thema: 'Optik',                       // neuer Name = neue Unterkategorie, entsteht automatisch
     titel: 'Lichtbrechung',
     beschreibung: 'Ein Satz, was die Animation zeigt.',
     datei: 'animationen/klasse-8/optik/lichtbrechung.html',
     icon: '🔦',
     tags: ['Brechung', 'Snellius']
   }
   ```

Die Übersicht sortiert Klassen aufsteigend und Themen alphabetisch – sie muss nicht angefasst werden.

## Aufbau

```
index.html                 Übersicht (Klasse → Thema → Animation, mit Suche)
daten/animationen.js       Verzeichnis aller Animationen
assets/style.css           gemeinsames Design (Hell/Dunkel, Beamer-tauglich)
assets/common.js           gemeinsame Helfer (Phys.*)
animationen/_vorlage.html  Startpunkt für neue Animationen
animationen/klasse-N/thema/*.html
```

## Farbcode (in allen Animationen gleich)

Elektronen / Minuspol **blau** · Pluspol **rot** · Spannung U **violett** · Stromstärke I **türkis** · Widerstand R **orange** · Leistung/Energie P, E **rot**.
