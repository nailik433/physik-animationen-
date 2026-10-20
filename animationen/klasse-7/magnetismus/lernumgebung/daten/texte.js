/* ==========================================================
   TEXTE der Lernumgebung Magnetismus (Klasse 7)
   Hier stehen Titel, Infotexte, Beobachtungsaufträge und das Glossar.
   Fachwörter: **Wort** = fett, **Wort|Schlüssel** = fett mit Mini-Erklärung (Schlüssel aus GLOSSAR).
   Kästen: merke, tipp, stolper, beispiel.
   ========================================================== */
window.GLOSSAR = {
  'Hypothese': 'Eine Vermutung, die man mit einem Versuch prüfen kann.',
  'fairen Test': 'Ein Versuch, bei dem man nur eine Sache verändert. Alles andere bleibt gleich.',
  'bestätigt': 'Das Ergebnis passt zur Hypothese.',
  'widerlegt': 'Das Ergebnis passt nicht zur Hypothese.',
  'ferromagnetisch': 'So nennt man Stoffe, die ein Magnet anzieht: Eisen, Nickel und Kobalt.',
  'Stahl': 'Stahl besteht hauptsächlich aus Eisen.',
  'Ausschlussverfahren': 'Man streicht alle Stoffe weg, die in einem nicht angezogenen Gegenstand stecken. Der Stoff, der übrig bleibt, ist der Gesuchte.',
  'Nordpol': 'Das eine Ende eines Magneten. Wir malen ihn rot und schreiben N dazu.',
  'Südpol': 'Das andere Ende eines Magneten. Wir malen ihn grün und schreiben S dazu.',
  'Pole': 'Die beiden Enden eines Magneten, an denen er am stärksten wirkt: Nordpol und Südpol.',
  'Polregel': 'Gleichnamige Pole stoßen sich ab, ungleichnamige Pole ziehen sich an.',
  'gleichnamige Pole': 'Zwei gleiche Pole, zum Beispiel Nordpol und Nordpol.',
  'ungleichnamige Pole': 'Zwei verschiedene Pole, also Nordpol und Südpol.',
  'Elementarmagnete': 'Winzig kleine Magnete im Eisen. Sie sind so klein, dass man sie nicht sehen kann.',
  'ungeordnet': 'Die Elementarmagnete zeigen in alle möglichen Richtungen.',
  'ausgerichtet': 'Die Elementarmagnete zeigen alle in dieselbe Richtung.',
  'Abschirmung': 'Ein Stück Eisen hält das Magnetfeld auf. Das nennt man abschirmen.',
  'abschirmt': 'Ein Stück Eisen hält das Magnetfeld auf. Das nennt man abschirmen.',
  'Kompassnadel': 'Ein kleiner Magnet, der sich drehen kann.',
  'Nordspitze': 'Das rote Ende der Kompassnadel. Es ist der Nordpol der Nadel.',
  'Magnetfeld': 'Der Raum um einen Magneten, in dem er wirkt.',
  'Feldlinien': 'Gezeichnete Linien, die zeigen, wie das Magnetfeld verläuft. Außerhalb des Magneten laufen sie von N nach S.',
  'Eisenfeilspänen': 'Sehr kleine Eisenstückchen. Im Magnetfeld ordnen sie sich entlang der Feldlinien an.',
  'Eisenfeilspäne': 'Sehr kleine Eisenstückchen. Im Magnetfeld ordnen sie sich entlang der Feldlinien an.',
  'Verlauf': 'Der Weg, den eine Linie nimmt.',
  'Spule': 'Ein aufgewickelter Draht.',
  'Windungen': 'Die Schleifen eines aufgewickelten Drahtes.',
  'Eisenkern': 'Ein Stab aus Eisen in der Spule, zum Beispiel ein Nagel.',
  'Elektromagnet': 'Eine Spule mit Eisenkern. Er ist nur ein Magnet, solange Strom fließt.',
  'Dauermagnet': 'Ein Magnet, der immer magnetisch bleibt, ohne Strom.',
  'Oersted': 'Der dänische Physiker Hans Christian Oersted. Er entdeckte 1820, dass ein Strom ein Magnetfeld erzeugt.',
  'Hammer': 'Erschütterung bringt die Elementarmagnete durcheinander.'
};

window.MODULE = [
  {
    id: 1, titel: 'Fair testen', kurz: 'Wie plant man einen Versuch, dem man glauben kann?',
    leit: 'Wie plant man einen Versuch, dem man glauben kann?',
    info: [
      { t: 'p', text: 'Du willst etwas herausfinden. Dafür brauchst du einen Versuch, dem man glauben kann.' },
      { t: 'p', text: 'Eine **Hypothese** ist eine Vermutung, die du mit einem Versuch prüfen kannst.' },
      { t: 'p', text: 'Bei einem **fairen Test** veränderst du nur eine Sache. Alles andere bleibt gleich. Du beobachtest oder misst, was sich dadurch ändert.' },
      { t: 'p', text: 'Aus dem Ergebnis folgt, ob deine Hypothese **bestätigt** oder **widerlegt** ist.' },
      { t: 'merke', liste: ['Bei einem fairen Test veränderst du nur eine Sache. Alles andere bleibt gleich.', 'So planst du einen Versuch: Hypothese, Das verändere ich, Das bleibt gleich, Das beobachte ich, Ergebnis.'] },
      { t: 'stolper', text: 'Verändern sich zwei Dinge gleichzeitig, weißt du am Ende nicht, welche Änderung die Wirkung ausgelöst hat.' }
    ],
    anim: { titel: 'Versuchsplaner',
      bedienung: 'Hake an, welche Größe du verändern willst. Wähle bei den anderen Größen einen festen Wert. Tippe dann auf „Versuch starten“.',
      auftraege: ['Verändere zuerst nur die Größe des Magneten. Beobachte die Tabelle.', 'Verändere dann zusätzlich die Klammern. Was fällt dir auf?'] }
  },
  {
    id: 2, titel: 'Magnetische Stoffe', kurz: 'Was zieht ein Magnet an?',
    leit: 'Was zieht ein Magnet an?',
    info: [
      { t: 'p', text: 'Ein Magnet zieht nicht alles an. Er zieht nur Gegenstände aus **Eisen**, **Nickel** und **Kobalt** an. Diese Stoffe heißen **ferromagnetisch**.' },
      { t: 'p', text: 'Kupfer, Aluminium, Zink, Holz, Glas und Kunststoff zieht ein Magnet nicht an.' },
      { t: 'p', text: '**Stahl** besteht hauptsächlich aus Eisen. Deshalb zieht ein Magnet auch Stahl an.' },
      { t: 'merke', text: 'Ein Magnet zieht nur Eisen, Nickel und Kobalt an. Diese Stoffe heißen ferromagnetisch.' },
      { t: 'p', text: 'Mit dem **Ausschlussverfahren** findest du heraus, welcher Stoff für die Anziehung verantwortlich ist. Dieser Stoff steckt in allen angezogenen Gegenständen. Er steckt in keinem Gegenstand, der nicht angezogen wird.' },
      { t: 'stolper', text: 'Nicht alle Metalle sind magnetisch. Kupfer und Aluminium sind Metalle, aber nicht ferromagnetisch.' }
    ],
    anim: { titel: 'Magnet-Prüfstand',
      bedienung: 'Tippe einen Gegenstand an. Der Magnet fährt hin. Die Tabelle merkt sich das Ergebnis.',
      auftraege: ['Teste alle Gegenstände. Welche Stoffe ziehen sich an?'] }
  },
  {
    id: 3, titel: 'Pole und Polregel', kurz: 'Wann ziehen sich Magnete an, und wann stoßen sie sich ab?',
    leit: 'Wann ziehen sich Magnete an, und wann stoßen sie sich ab?',
    info: [
      { t: 'p', text: 'Jeder Magnet hat zwei **Pole**: einen **Nordpol** und einen **Südpol**. An den Polen wirkt der Magnet am stärksten.' },
      { t: 'p', text: 'Ob sich zwei Magnete anziehen oder abstoßen, sagt die **Polregel**.' },
      { t: 'merke', text: 'Gleichnamige Pole stoßen sich ab. Ungleichnamige Pole ziehen sich an.' },
      { t: 'p', text: 'Ein Stück Eisen, das noch nicht magnetisch ist, wird von beiden Polen eines Magneten angezogen.' },
      { t: 'tipp', text: 'Nordpol rot mit N, Südpol grün mit S. Auf den Bildern erkennst du die Pole auch an den Buchstaben.' }
    ],
    anim: { titel: 'Zwei Magnete',
      bedienung: 'Tippe auf „Magnet umdrehen“. Im zweiten Bild stellst du mit dem Schieber den Abstand ein.',
      auftraege: ['Finde alle Lagen heraus. Wann ziehen sich die Magnete an?'] }
  },
  {
    id: 4, titel: 'Elementarmagnete', kurz: 'Was passiert im Eisen, wenn es zum Magneten wird?',
    leit: 'Was passiert im Eisen, wenn es zum Magneten wird?',
    info: [
      { t: 'p', text: 'Eisen besteht aus vielen winzigen **Elementarmagneten|Elementarmagnete**. Du kannst sie nicht sehen.' },
      { t: 'p', text: 'Im unmagnetischen Eisen sind die Elementarmagnete **ungeordnet**. Ihre Wirkungen heben sich auf.' },
      { t: 'p', text: 'Streichst du mehrmals in eine Richtung mit einem Pol eines Magneten über das Eisen, **richten sich die Elementarmagnete aus**. Dann addieren sich ihre Wirkungen. Das Eisen ist jetzt ein Magnet.' },
      { t: 'p', text: 'Erschütterung (Klopfen, Fallenlassen) und Erhitzen bringen die Elementarmagnete wieder durcheinander. Der Magnet verliert seine Wirkung.' },
      { t: 'merke', liste: ['Im unmagnetischen Eisen sind die Elementarmagnete ungeordnet.', 'Im Magneten sind sie ausgerichtet.', 'Teilt man einen Magneten, entstehen zwei vollständige Magnete mit je einem Nordpol und einem Südpol.'] }
    ],
    anim: { titel: 'Nagel-Labor',
      bedienung: 'Tippe auf die Knöpfe unter dem Bild. Bei „Magnet teilen“ tippst du auf die Stelle, an der der Nagel geteilt werden soll.',
      auftraege: ['Streiche so lange, bis der Nagel Büroklammern hält. Wie viele Striche brauchst du?', 'Klopfe dann auf den Nagel. Was passiert?'] }
  },
  {
    id: 5, titel: 'Stärke und Abschirmung', kurz: 'Wo ist ein Magnet am stärksten, und was hält ihn auf?',
    leit: 'Wo ist ein Magnet am stärksten, und was hält ihn auf?',
    info: [
      { t: 'p', text: 'Ein Stabmagnet ist an seinen **Enden** (den Polen) am stärksten. In der **Mitte** ist er am schwächsten.' },
      { t: 'p', text: 'Das zeigst du, indem du zählst, wie viele Büroklammern an verschiedenen Stellen hängen bleiben.' },
      { t: 'p', text: 'Ein Magnet wirkt durch viele Stoffe hindurch: durch Papier, Holz, Kunststoff, Glas, Aluminium und Kupfer.' },
      { t: 'merke', liste: ['Ein Stabmagnet ist an den Polen am stärksten und in der Mitte am schwächsten.', 'Ein Stück Eisenblech (Stahlblech) schirmt das Magnetfeld ab.'] },
      { t: 'p', text: 'Liegt ein Stück Stahlblech zwischen Magnet und Büroklammer, **schirmt|abschirmt** es das Magnetfeld ab. Die Klammer wird dann nicht mehr angezogen.' }
    ],
    anim: { titel: 'Stärke und Abschirmung',
      bedienung: 'Wechsle oben zwischen den beiden Reitern. Tippe auf eine Stelle oder auf ein Material.',
      auftraege: ['Reiter 1: Tippe auf alle Stellen, auch auf die beiden Stirnseiten an den Polen. Wo hängen die meisten Klammern?', 'Reiter 2: Teste alle Materialien. Welches ist anders?'] }
  },
  {
    id: 6, titel: 'Kompass und Erde', kurz: 'Warum zeigt ein Kompass nach Norden?',
    leit: 'Warum zeigt ein Kompass nach Norden?',
    info: [
      { t: 'p', text: 'Die Erde ist ein großer Magnet mit einem Nordpol und einem Südpol.' },
      { t: 'p', text: 'In der Nähe des **geografischen Nordpols** liegt der **magnetische Südpol** der Erde. In der Nähe des **geografischen Südpols** liegt der **magnetische Nordpol**.' },
      { t: 'p', text: 'Eine **Kompassnadel** ist ein kleiner Magnet. Ihre **Nordspitze** (rot) ist ein Nordpol. Nach der Polregel zieht der magnetische Südpol der Erde sie an. Deshalb zeigt sie nach Norden.' },
      { t: 'merke', liste: ['Am geografischen Nordpol liegt der magnetische Südpol der Erde.', 'Die rote Nordspitze der Kompassnadel zeigt nach Norden, weil ungleichnamige Pole sich anziehen.'] },
      { t: 'stolper', text: 'Neben einem starken Magneten zeigt die Nadel nicht mehr nach Norden. Sie richtet sich dann nach diesem Magneten.' }
    ],
    anim: { titel: 'Die Erde als Magnet',
      bedienung: 'Ziehe den Kompass mit dem Finger über das Bild. Mit den Schaltern blendest du Beschriftungen ein.',
      auftraege: ['Ziehe den Kompass über die Erde und um die Erde herum. Wohin zeigt die Nordspitze?', 'Schalte „Starker Magnet in der Nähe“ ein. Was macht die Nadel?'] }
  },
  {
    id: 7, titel: 'Magnetfeld und Feldlinien', kurz: 'Wie kann man ein Magnetfeld sichtbar machen und zeichnen?',
    leit: 'Wie kann man ein Magnetfeld sichtbar machen und zeichnen?',
    info: [
      { t: 'p', text: 'Um einen Magneten herum gibt es ein **Magnetfeld**. Du kannst es mit **Eisenfeilspänen** sichtbar machen. Sie zeigen den **Verlauf** des Feldes, aber nicht die Richtung.' },
      { t: 'p', text: 'Die Richtung findest du mit einer Kompassnadel. Die Richtung einer **Feldlinie|Feldlinien** ist die Richtung, in die die **Nordspitze** der Kompassnadel zeigt.' },
      { t: 'merke', liste: ['Feldlinien verlaufen außerhalb des Magneten von N nach S.', 'Feldlinien kreuzen sich nie.', 'Wo die Feldlinien dicht liegen, ist das Feld stark. Das ist an den Polen der Fall.', 'Die Kompassnadel liegt in Richtung der Feldlinie.'] },
      { t: 'tipp', text: 'Wir zeichnen Feldlinien nur außerhalb des Magneten, nie durch den Magneten hindurch.' }
    ],
    anim: { titel: 'Magnetfeld erkunden',
      bedienung: 'Ziehe den Kompass mit dem Finger. Mit den Schaltern blendest du Feilspäne, Feldlinien und die Kompassspur ein.',
      auftraege: ['Ziehe den Kompass einmal um den Magneten herum. In welche Richtung zeigt die Nordspitze?', 'Schalte Feilspäne und Feldlinien ein. Was zeigt die Feldlinie, was die Feilspäne nicht?'] }
  },
  {
    id: 8, titel: 'Elektromagnet', kurz: 'Wie kann man einen Magneten an- und ausschalten?',
    leit: 'Wie kann man einen Magneten an- und ausschalten?',
    info: [
      { t: 'p', text: 'Ein elektrischer **Strom erzeugt ein Magnetfeld**. Eine Kompassnadel in der Nähe wird abgelenkt. Ohne Strom verschwindet das Feld. Vertauschst du die Batterieanschlüsse, schlägt die Nadel in die andere Richtung aus.' },
      { t: 'p', text: 'Wickelst du den Draht zu einer **Spule**, wird das Magnetfeld stärker. Je mehr **Windungen**, desto stärker das Feld.' },
      { t: 'p', text: 'Das Feld einer Spule, durch die Strom fließt, sieht aus wie das Feld eines Stabmagneten. Die Spule hat einen Nordpol und einen Südpol. Vertauschst du die Anschlüsse, vertauschen sich die Pole.' },
      { t: 'p', text: 'Steckst du einen **Eisenkern** in die Spule, wird das Magnetfeld viel stärker. Das Feld der Spule richtet die Elementarmagnete im Eisen aus. Der Kern wird selbst zum Magneten.' },
      { t: 'merke', liste: ['Ein elektrischer Strom erzeugt ein Magnetfeld.', 'Eine Spule mit Eisenkern heißt Elektromagnet.', 'Man kann einen Elektromagneten ein- und ausschalten.'] },
      { t: 'beispiel', text: 'Anwendungen sind der Kran auf dem Schrottplatz, die Klingel und das Relais.' }
    ],
    anim: { titel: 'Elektromagnet',
      bedienung: 'Wechsle oben zwischen den Reitern. Schalte den Strom mit dem Schalter ein und aus.',
      auftraege: ['Reiter 1: Schalte den Strom ein. Was macht die Nadel? Vertausche die Anschlüsse.', 'Reiter 2: Erhöhe die Windungen. Was passiert mit dem Balken? Stecke den Eisenkern in die Spule. Was ändert sich? Schalte aus.'] }
  }
];
