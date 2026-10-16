/* ==========================================================
   VERZEICHNIS ALLER ANIMATIONEN
   Die Übersichtsseite (index.html) baut sich komplett aus dieser Liste auf.
   Neue Unterkategorie = einfach einen neuen "thema"-Namen verwenden.
   Neue Animation     = einen Eintrag unten ergänzen (siehe README.md).
   ========================================================== */
window.PHYSIK = {
  klassen: [7, 8, 9, 10],

  animationen: [
    /* ---------- Klasse 9 · Elektrizität ---------- */
    {
      klasse: 9,
      thema: 'Elektrizität',
      titel: 'Der einfache Stromkreis',
      beschreibung: 'Elektronenfluss und technische Stromrichtung im geschlossenen Stromkreis – mit Schalter und Spannungsregler.',
      datei: 'animationen/klasse-9/elektrizitaet/stromkreis.html',
      icon: '💡',
      tags: ['Stromkreis', 'Stromstärke', 'Elektronen', 'Stromrichtung', 'Schalter']
    },
    {
      klasse: 9,
      thema: 'Elektrizität',
      titel: 'Ohmsches Gesetz',
      beschreibung: 'Spannung und Widerstand verändern, Messwerte aufnehmen und die U-I-Kennlinie entdecken: R = U / I.',
      datei: 'animationen/klasse-9/elektrizitaet/ohmsches-gesetz.html',
      icon: '📈',
      tags: ['Ohm', 'Widerstand', 'Kennlinie', 'Spannung', 'Stromstärke', 'Diagramm']
    },
    {
      klasse: 9,
      thema: 'Elektrizität',
      titel: 'Reihen- und Parallelschaltung',
      beschreibung: 'Zwei Widerstände im Vergleich: Wie verteilen sich Strom und Spannung, und wie groß ist der Gesamtwiderstand?',
      datei: 'animationen/klasse-9/elektrizitaet/reihen-parallelschaltung.html',
      icon: '🔀',
      tags: ['Reihenschaltung', 'Parallelschaltung', 'Gesamtwiderstand', 'Teilspannung', 'Teilstrom']
    },
    {
      klasse: 9,
      thema: 'Elektrizität',
      titel: 'Elektrische Leistung und Energie',
      beschreibung: 'Der Stromzähler im Zeitraffer: P = U · I, E = P · t und die Stromkosten verschiedener Geräte.',
      datei: 'animationen/klasse-9/elektrizitaet/leistung-energie.html',
      icon: '⚡',
      tags: ['Leistung', 'Energie', 'Kilowattstunde', 'Stromzähler', 'Kosten']
    }
  ]
};
