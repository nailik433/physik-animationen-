# Prüfbericht Lernumgebung Magnetismus (Klasse 7)

Getestet mit Playwright (Chromium) auf Desktop sowie den Geräteprofilen iPad (gen 7) und iPad Pro 11, jeweils quer und hochkant, per Touch-Emulation.

## Was geprüft wurde

- **Laden und Konsole:** Startseite, Blitz-Check, Abschlusscheck und alle acht Module laden ohne Fehler und ohne Warnungen. Es gibt keine Netzwerkanfrage an andere Server (auch nicht in der Einzeldatei).
- **Layout:** Kein waagerechtes Scrollen bei 768 × 1024, 1024 × 768, 834 × 1194 und 1194 × 834. Alle Knöpfe und Antwortfelder sind mindestens 48 px hoch (Ausnahme: der feste Knopf „← Übersicht“ des Repositorys mit 44 px).
- **Alle Fragen (44):** Skript spielt jede Frage mit der richtigen Antwort (ergibt ✓) und mit jeder falschen Antwort (ergibt ✗ mit dem passenden Hinweis) durch, bei `multi` mit jeder einzelnen falschen Abweichung, bei `luecke`, `reihenfolge`, `zuordnen`, `richtung` und `hotspot` mit richtiger und falscher Belegung. 150 Einzelprüfungen. Zweiter Fehlversuch zeigt Lösung, Wertung nur beim ersten Versuch.
- **Ablauf:** Blitz-Check (eine Frage je Modul, Ergebnis ✓ / „Hier lohnt sich Üben“, Empfehlung auf der Startseite, richtig beantwortete Blitzfragen im Modul vorab abgehakt), Abschlusscheck (12 verschiedene Fragen, mindestens eine je Modul, keine Blitz- und keine Zusatzfrage, Punktzahl und Aufschlüsselung), „Neu starten“.
- **Physik der Animationen:**
  - Nagel-Labor: nach drei Strichen 100 % ausgerichtet (66 %, 91 %, 100 %), Büroklammern an beiden Enden (4, 5, 6). Nach acht Schlägen unter 20 %, nach Erhitzen unter 20 %, Büroklammern fallen ab. Nach dem Teilen hat jedes Stück N links und S rechts (alle Stücke über 95 % ausgerichtet).
  - Feldmodell: sechs Testpunkte, Nadelrichtung stimmt mit der Feldformel überein (Abweichung unter 0,01 rad). Feldlinien beginnen am Nordpol, enden am Südpol oder am Bildrand, verlaufen nicht durch den Magneten (Abstand von mindestens 4 px zur Magnetfläche), kreuzen sich in der Stichprobe nicht, Pfeile zeigen von N nach S. Die Antworten der Kompassfrage kommen aus derselben Funktion (rechts, links, links).
  - Erde: Die Nadel zeigt an sieben Testpunkten genau zum oberen (grünen S) Pol des Erdmagneten. Mit starkem Magneten dreht sie sich zu ihm.
  - Oersted: Strom nach Norden lenkt die Nordspitze nach Westen aus (rund 70 Grad), umgekehrter Strom nach Osten, ausgeschaltet kehrt sie zurück.
  - Polregel-Animation: Gleichnamige Pole stoßen ab (oberer Magnet springt nach oben und schwebt), ungleichnamige ziehen an (er liegt auf).
  - Magnet-Prüfstand: genau die vier Stahl- und Eisengegenstände werden angezogen. Abschirmung: nur das Stahlblech schirmt ab.
- **Graustufen:** N und S stehen immer als Buchstaben im Bild, Richtig und Falsch immer mit ✓ / ✗ und Wort, Kästen tragen ihr Stichwort.
- **Einzeldatei:** lädt per `file://` fehlerfrei, ohne Netzwerk.
- **Fachlicher Gegencheck:** Alle Texte und Rückmeldungen wurden gegengelesen (Polregel, Feldlinien außen von N nach S, magnetischer Südpol am geografischen Nordpol, Elementarmagnete beim Teilen). Keine Stromstärke, Spannung, Rechte-Hand-Regel oder Formeln.

## Was offen ist

- **Abgleich mit den Dateien auf dem Rechner** (Drehbücher, Klassenarbeit, früherer Nagel-Prompt) war nicht möglich. Texte, Merksätze und die Elementarmagnet-Modellwerte stammen nur aus dem Prompt.
- **Dopplungsprüfung mit der Klassenarbeit** war nicht möglich. Der Prompt selbst gibt einige Fragen vor, die dem Thema nach in der Klassenarbeit vorkommen (zum Beispiel Magnet in der Mitte durchbrechen, Stelle der größten Stärke). Bitte einmal gegen die Klassenarbeit lesen.
- **Safari/WebKit** stand nicht zur Verfügung. Getestet wurde Chromium mit iPad-Profilen. Es wurde nur ES2017-Code ohne neuere Browserfunktionen geschrieben.
- **`github.io`** ließ sich aus der Entwicklungsumgebung nicht aufrufen. Bitte im Schulnetz testen (sonst die Einzeldatei nehmen).
- Die ablaufenden Kompassnadel- und Schnitt-Eingaben wurden mit Zeigerereignissen gebaut, aber nicht auf einem echten iPad mit Finger ausprobiert.
