/* ==========================================================
   FRAGEN der Lernumgebung Magnetismus (Klasse 7)
   Eine Frage ergänzen: ein neues Objekt an window.FRAGEN anhängen (siehe README.md).

   Gemeinsame Felder:  id, modul (1-8), typ, frage, warum (Begründung bei richtiger Antwort),
                       blitz:true (Blitz-Check-Frage des Moduls), zusatz:true (zählt nicht),
                       html (zusätzlicher Kasten, z. B. Tabelle), szene (Schlüssel einer Zeichnung aus SZENEN)
   single:      antworten:[{t, ok:true} | {t, h:'Hinweis bei dieser Falschantwort'}]
   multi:       antworten:[{t, ok:true, h:'Hinweis, wenn nicht angekreuzt'} | {t, h:'Hinweis, wenn fälschlich angekreuzt'}]
   luecke:      text:'Satz mit ___ als Lücke', woerter:[...], loesung:[...], tauschbar:[[Lückennummern]]
   reihenfolge: schritte:[...in richtiger Reihenfolge...]
   zuordnen:    felder:[...], karten:[{t, ziel:Feldnummer, h:'Hinweis bei falschem Feld'}]
   richtung:    modus:'stapel' | 'kompass' | 'pfeil'
   hotspot:     szene, ziele (siehe app)
   ========================================================== */
window.FRAGEN = [

/* ---------- Modul 1: Fair testen ---------- */
{ id: 'm1q1', modul: 1, typ: 'single', blitz: true,
  frage: 'Wie muss man vorgehen, damit ein Test fair ist?',
  antworten: [
    { t: 'Man verändert nur eine Sache, alles andere bleibt gleich.', ok: true },
    { t: 'Man verändert so viel wie möglich auf einmal.', h: 'Dann weißt du am Ende nicht, welche Änderung die Wirkung ausgelöst hat.' },
    { t: 'Man macht den Versuch nur ganz schnell einmal.', h: 'Ein einzelner schneller Versuch kann Zufall sein. Wichtig ist, dass der Test fair aufgebaut ist.' },
    { t: 'Man verändert gar nichts.', h: 'Ohne eine Änderung kannst du nichts vergleichen.' }
  ],
  warum: 'Nur wenn sich eine einzige Sache ändert, kannst du die Wirkung dieser Änderung zuordnen.' },
{ id: 'm1q2', modul: 1, typ: 'single',
  frage: 'Welche Aussage ist eine Hypothese, die man mit einem Versuch prüfen kann?',
  antworten: [
    { t: 'Ein Magnet hält eine Büroklammer auch durch ein Stück Pappe hindurch.', ok: true },
    { t: 'Magnete sind interessant.', h: 'Das ist eine Meinung. Man kann sie nicht mit einem Versuch prüfen.' },
    { t: 'Warum gibt es Magnete?', h: 'Das ist eine Frage, keine Vermutung.' },
    { t: 'Magnete sind besser als Klebeband.', h: 'Das ist zu ungenau. Man weiß nicht, was „besser“ heißen soll.' }
  ],
  warum: 'Diese Aussage ist eine Vermutung. Du kannst sie mit einem Versuch prüfen.' },
{ id: 'm1q3', modul: 1, typ: 'zuordnen',
  frage: 'Ben will wissen, ob ein größerer Magnet mehr Büroklammern festhält. Er testet drei Stabmagnete unterschiedlicher Größe. Ordne die Aussagen den Feldern zu.',
  felder: ['Das verändere ich', 'Das bleibt gleich', 'Das beobachte ich'],
  karten: [
    { t: 'Größe des Magneten', ziel: 0, h: 'Die Größe des Magneten ist die eine Sache, die Ben verändert.' },
    { t: 'Art der Büroklammern', ziel: 1, h: 'Die Art der Büroklammern muss gleich bleiben, sonst ist der Test nicht fair.' },
    { t: 'Die Stelle am Magneten, an der er die Klammern anhängt', ziel: 1, h: 'Die Stelle muss gleich bleiben, sonst ändert sich noch etwas anderes.' },
    { t: 'Anzahl der Klammern, die hängen bleiben', ziel: 2, h: 'Die Anzahl der Klammern ist das, was du am Ende zählst. Das ist das Ergebnis, nicht die Änderung.' }
  ],
  warum: 'Ben verändert nur die Größe des Magneten. Klammern und Stelle bleiben gleich. Er beobachtet, wie viele Klammern hängen bleiben.' },
{ id: 'm1q4', modul: 1, typ: 'single',
  frage: 'Lea testet Magnet A mit Papierklammern und Magnet B mit Eisenschrauben. Dann sagt sie: „B ist stärker.“ Warum ist der Test unfair?',
  antworten: [
    { t: 'Sie hat zwei Dinge gleichzeitig verändert (Magnet und Material). Deshalb weiß sie nicht, was den Unterschied macht.', ok: true },
    { t: 'Sie hat zu wenige Magnete benutzt.', h: 'Mehr Magnete helfen nicht, solange zwei Dinge gleichzeitig verändert werden.' },
    { t: 'Eisenschrauben sind immer schlechter.', h: 'Darum geht es nicht. Entscheidend ist, dass sie Magnet und Material gleichzeitig verändert hat.' }
  ],
  warum: 'Lea hat Magnet und Material gleichzeitig verändert. Der Unterschied kann von beidem kommen.' },
{ id: 'm1q5', modul: 1, typ: 'single',
  frage: 'Bens Ergebnisse: kleiner Magnet 3 Klammern, mittlerer 5, großer 8. Seine Hypothese war: „Ein größerer Magnet hält mehr Klammern.“ Was folgt?',
  antworten: [
    { t: 'Die Hypothese wird durch diesen Versuch bestätigt.', ok: true },
    { t: 'Die Hypothese ist widerlegt.', h: 'Die Zahlen steigen mit der Größe. Das passt zur Hypothese.' },
    { t: 'Damit ist bewiesen, dass jeder größere Magnet immer stärker ist.', h: 'Ben hat nur drei Magnete getestet. Für diese drei stimmt es. Für alle Magnete müsste man mehr testen.' }
  ],
  warum: 'Die Zahlen steigen mit der Größe. Das passt zur Hypothese. Bewiesen ist sie damit aber nur für diese drei Magnete.' },
{ id: 'm1q6', modul: 1, typ: 'reihenfolge',
  frage: 'Bringe die Schritte eines Versuchs in die richtige Reihenfolge.',
  schritte: ['Eine Frage stellen', 'Eine Hypothese aufstellen', 'Den Versuch planen (verändere, bleibt gleich, beobachte)', 'Den Versuch durchführen und beobachten', 'Das Ergebnis auswerten und die Hypothese prüfen'],
  warum: 'Erst kommt die Frage, dann die Vermutung. Danach planst du den Versuch, führst ihn durch und prüfst am Ende die Hypothese.' },

/* ---------- Modul 2: Magnetische Stoffe ---------- */
{ id: 'm2q1', modul: 2, typ: 'single', blitz: true,
  frage: 'Welche Stoffe zieht ein Magnet an?',
  antworten: [
    { t: 'Eisen, Nickel und Kobalt.', ok: true },
    { t: 'Alle Metalle.', h: 'Kupfer, Aluminium und Zink sind Metalle, werden aber nicht angezogen.' },
    { t: 'Alles, was glänzt.', h: 'Glänzen sagt nichts darüber, ob ein Magnet etwas anzieht. Alufolie glänzt, wird aber nicht angezogen.' },
    { t: 'Nur Eisen.', h: 'Auch Nickel und Kobalt werden angezogen.' }
  ],
  warum: 'Eisen, Nickel und Kobalt sind ferromagnetisch. Nur diese Stoffe zieht ein Magnet an.' },
{ id: 'm2q2', modul: 2, typ: 'multi',
  frage: 'Welche Gegenstände zieht ein Magnet an? Kreuze alle richtigen an.',
  antworten: [
    { t: 'Stahlschraube', ok: true, h: 'Stahl besteht hauptsächlich aus Eisen.' },
    { t: 'Eisenfeilspäne', ok: true, h: 'Eisen wird von einem Magneten angezogen.' },
    { t: 'Nähnadel aus Stahl', ok: true, h: 'Stahl besteht hauptsächlich aus Eisen.' },
    { t: 'Kupferrohr', h: 'Kupfer und Aluminium sind Metalle, aber nicht ferromagnetisch.' },
    { t: 'Aluminiumblech', h: 'Kupfer und Aluminium sind Metalle, aber nicht ferromagnetisch.' },
    { t: 'Holzlöffel', h: 'Holz ist nicht ferromagnetisch.' },
    { t: 'Glasmurmel', h: 'Glas ist nicht ferromagnetisch.' }
  ],
  warum: 'Angezogen werden Gegenstände aus Eisen oder Stahl. Kupfer, Aluminium, Holz und Glas werden nicht angezogen.' },
{ id: 'm2q3', modul: 2, typ: 'single',
  frage: 'Vier Gegenstände wurden getestet (siehe Tabelle). Welcher Stoff ist für die Anziehung verantwortlich?',
  szene: 'tabelle-ausschluss',
  antworten: [
    { t: 'Eisen', ok: true },
    { t: 'Kupfer', h: 'Kupfer steckt auch in A und B. Diese werden nicht angezogen.' },
    { t: 'Zink', h: 'Zink steckt auch in A. Dieser Gegenstand wird nicht angezogen.' },
    { t: 'Aluminium', h: 'Aluminium steckt nur in B, und B wird nicht angezogen.' }
  ],
  warum: 'Eisen steckt in C und D, die angezogen werden. In A und B steckt kein Eisen, sie werden nicht angezogen.' },
{ id: 'm2q4', modul: 2, typ: 'zuordnen',
  frage: 'Sortiere die Gegenstände aus dem Prüfstand in „wird angezogen“ und „wird nicht angezogen“.',
  felder: ['wird angezogen', 'wird nicht angezogen'],
  karten: [
    { t: 'Büroklammer (Stahl)', ziel: 0, h: 'Stahl besteht hauptsächlich aus Eisen. Die Büroklammer wird angezogen.' },
    { t: 'Stahlfeder', ziel: 0, h: 'Stahl besteht hauptsächlich aus Eisen. Die Feder wird angezogen.' },
    { t: 'Reißzwecke (Stahl)', ziel: 0, h: 'Stahl besteht hauptsächlich aus Eisen. Die Reißzwecke wird angezogen.' },
    { t: 'Eisenkette', ziel: 0, h: 'Eisen wird angezogen.' },
    { t: 'Gummiband', ziel: 1, h: 'Gummi ist nicht ferromagnetisch.' },
    { t: 'Bleistift', ziel: 1, h: 'Holz und Graphit sind nicht ferromagnetisch.' },
    { t: 'Radiergummi', ziel: 1, h: 'Gummi ist nicht ferromagnetisch.' },
    { t: 'Aluminiumlöffel', ziel: 1, h: 'Aluminium ist ein Metall, aber nicht ferromagnetisch.' },
    { t: 'Kupferrohr', ziel: 1, h: 'Kupfer ist ein Metall, aber nicht ferromagnetisch.' },
    { t: 'Holzklotz', ziel: 1, h: 'Holz ist nicht ferromagnetisch.' }
  ],
  warum: 'Angezogen werden nur die Gegenstände aus Stahl und Eisen. Alle anderen Stoffe sind nicht ferromagnetisch.' },
{ id: 'm2q5', modul: 2, typ: 'luecke',
  frage: 'Ergänze den Text. Tippe zuerst auf eine Lücke und dann auf ein Wort.',
  text: 'Stoffe, die ein Magnet anzieht, heißen ___. Die drei Metalle sind ___, ___ und ___. Kupfer und Aluminium gehören ___ dazu.',
  woerter: ['ferromagnetisch', 'Eisen', 'Nickel', 'Kobalt', 'nicht', 'Zink'],
  loesung: ['ferromagnetisch', 'Eisen', 'Nickel', 'Kobalt', 'nicht'],
  tauschbar: [[1, 2, 3]],
  warum: 'Ferromagnetisch sind Eisen, Nickel und Kobalt. Kupfer und Aluminium gehören nicht dazu.' },

/* ---------- Modul 3: Pole und Polregel ---------- */
{ id: 'm3q1', modul: 3, typ: 'single', blitz: true,
  frage: 'Zwei Magnete liegen so, dass sich zwei Südpole gegenüberstehen. Was passiert?',
  antworten: [
    { t: 'Sie stoßen sich ab.', ok: true },
    { t: 'Sie ziehen sich an.', h: 'Das gilt für ungleichnamige Pole, also Nordpol und Südpol.' },
    { t: 'Nichts, denn nur Nordpole wirken.', h: 'Beide Pole wirken. Nord- und Südpol sind gleich stark.' }
  ],
  warum: 'Zwei Südpole sind gleichnamige Pole. Gleichnamige Pole stoßen sich ab.' },
{ id: 'm3q2', modul: 3, typ: 'richtung', modus: 'stapel',
  frage: 'Der untere Magnet liegt fest. Oben ist sein Nordpol. Drehe den oberen Magneten mit „Magnet umdrehen“ so, dass sich beide anziehen. Stelle ihn im zweiten Bild so, dass sie sich abstoßen.',
  warum: 'Der obere Magnet zeigt dem Nordpol unten seinen Südpol: ungleichnamige Pole ziehen sich an. Zeigt er ihm den Nordpol, stoßen sie sich ab: gleichnamige Pole.' },
{ id: 'm3q3', modul: 3, typ: 'single',
  frage: 'Drei Magnete liegen nebeneinander: A links, B in der Mitte, C rechts. A hat links den Nordpol und rechts den Südpol. C hat links den Südpol und rechts den Nordpol. A und B ziehen sich an. B und C stoßen sich ab. Wie liegt B?',
  szene: 'drei-magnete',
  antworten: [
    { t: 'B: links Nordpol, rechts Südpol.', ok: true },
    { t: 'B: links Südpol, rechts Nordpol.', h: 'Dann stünde der Südpol von A dem Südpol von B gegenüber. Das würde abstoßen, nicht anziehen.' },
    { t: 'Das kann man nicht bestimmen.', h: 'Doch: Die Anziehung zwischen A und B legt B links fest, die Abstoßung zwischen B und C bestätigt es.' }
  ],
  warum: 'Rechts von A ist ein Südpol. Damit sich A und B anziehen, muss links bei B ein Nordpol sein. Dann steht rechts bei B ein Südpol, der dem Südpol von C gegenübersteht. Das stößt ab.' },
{ id: 'm3q4', modul: 3, typ: 'single',
  frage: 'Ein Eisennagel (nicht magnetisiert) wird vom Nordpol eines Magneten angezogen. Was passiert, wenn du den Südpol des Magneten annäherst?',
  antworten: [
    { t: 'Der Nagel wird ebenfalls angezogen.', ok: true },
    { t: 'Er wird abgestoßen.', h: 'Unmagnetisches Eisen wird von beiden Polen angezogen. Die Pole ordnen die Elementarmagnete im Nagel passend an.' },
    { t: 'Es passiert nichts.', h: 'Beide Pole des Magneten wirken auf Eisen.' }
  ],
  warum: 'Beide Pole ziehen unmagnetisches Eisen an.' },
{ id: 'm3q5', modul: 3, typ: 'multi',
  frage: 'Welche Aussagen stimmen? Kreuze alle richtigen an.',
  antworten: [
    { t: 'Jeder Magnet hat zwei Pole.', ok: true, h: 'Jeder Magnet hat einen Nordpol und einen Südpol.' },
    { t: 'Gleichnamige Pole stoßen sich ab.', ok: true, h: 'Das ist die Polregel: Gleichnamige Pole stoßen sich ab.' },
    { t: 'Ungleichnamige Pole ziehen sich an.', ok: true, h: 'Das ist die Polregel: Ungleichnamige Pole ziehen sich an.' },
    { t: 'Ein Magnet kann auch nur einen Pol haben.', h: 'Einen einzelnen Pol gibt es nicht. Auch wenn man einen Magneten zerbricht, hat jedes Stück zwei Pole.' },
    { t: 'Der Nordpol zieht Eisen an, der Südpol stößt Eisen ab.', h: 'Beide Pole ziehen Eisen an.' }
  ],
  warum: 'Jeder Magnet hat zwei Pole. Die Polregel gilt immer. Eisen wird von beiden Polen angezogen.' },
{ id: 'm3q6', modul: 3, typ: 'luecke',
  frage: 'Ergänze die Polregel.',
  text: 'Gleichnamige Pole ___ sich ab. Ungleichnamige Pole ___ sich ___.',
  woerter: ['stoßen', 'ziehen', 'an', 'ab'],
  loesung: ['stoßen', 'ziehen', 'an'],
  warum: 'Gleichnamige Pole stoßen sich ab. Ungleichnamige Pole ziehen sich an.' },

/* ---------- Modul 4: Elementarmagnete ---------- */
{ id: 'm4q1', modul: 4, typ: 'single', blitz: true,
  frage: 'Ein Stabmagnet wird in der Mitte durchgebrochen. Was entsteht?',
  antworten: [
    { t: 'Zwei kleinere Magnete, jeder mit Nord- und Südpol.', ok: true },
    { t: 'Ein Stück hat nur einen Nordpol, das andere nur einen Südpol.', h: 'Jedes Stück besteht noch aus ausgerichteten Elementarmagneten. Deshalb hat jedes Stück wieder zwei Pole.' },
    { t: 'Zwei unmagnetische Stücke.', h: 'Die Elementarmagnete bleiben ausgerichtet. Beide Teile sind noch Magnete.' }
  ],
  warum: 'Beide Teile bestehen aus ausgerichteten Elementarmagneten. Jedes Stück ist ein ganzer Magnet.' },
{ id: 'm4q2', modul: 4, typ: 'single',
  frage: 'Ein Eisennagel zieht zuerst keine Büroklammern an. Wie erklärt das Modell der Elementarmagnete das?',
  antworten: [
    { t: 'Die Elementarmagnete zeigen ungeordnet in alle Richtungen, ihre Wirkungen heben sich auf.', ok: true },
    { t: 'Im Nagel gibt es keine Elementarmagnete.', h: 'Eisen besteht immer aus Elementarmagneten. Sie sind im Nagel nur ungeordnet.' },
    { t: 'Die Elementarmagnete sind zu schwach.', h: 'Sie sind nicht zu schwach, sondern ungeordnet. Ihre Wirkungen heben sich gegenseitig auf.' }
  ],
  warum: 'Im unmagnetischen Nagel zeigen die Elementarmagnete in alle Richtungen. Ihre Wirkungen heben sich auf.' },
{ id: 'm4q3', modul: 4, typ: 'reihenfolge',
  frage: 'So wird ein Nagel zum Magneten. Ordne die Schritte.',
  schritte: ['Der Nagel ist unmagnetisch, die Elementarmagnete sind ungeordnet.', 'Man streicht mehrmals mit einem Pol des Magneten in eine Richtung über den Nagel.', 'Die Elementarmagnete richten sich aus.', 'Ihre Wirkungen addieren sich, der Nagel zieht Büroklammern an.'],
  warum: 'Erst sind die Elementarmagnete ungeordnet. Das Streichen richtet sie aus. Danach addieren sich ihre Wirkungen.' },
{ id: 'm4q4', modul: 4, typ: 'multi',
  frage: 'Womit kann man einen Magneten entmagnetisieren? Kreuze alle richtigen an.',
  antworten: [
    { t: 'Stark erhitzen.', ok: true, h: 'Hitze bringt die Elementarmagnete durcheinander.' },
    { t: 'Kräftig erschüttern, zum Beispiel mit dem Hammer klopfen.', ok: true, h: 'Erschütterung bringt die Elementarmagnete durcheinander.' },
    { t: 'In Alufolie einwickeln.', h: 'Alufolie schirmt nicht ab und ändert die Elementarmagnete nicht.' },
    { t: 'In Wasser legen.', h: 'Wasser bringt die Elementarmagnete nicht durcheinander.' }
  ],
  warum: 'Hitze und Erschütterung bringen die Elementarmagnete durcheinander. Dann hebt sich ihre Wirkung auf.' },
{ id: 'm4q5', modul: 4, typ: 'luecke',
  frage: 'Ergänze den Text.',
  text: 'Im unmagnetischen Eisen sind die Elementarmagnete ___. Im Magneten sind sie ___. Dann ___ sich ihre Wirkungen.',
  woerter: ['ungeordnet', 'ausgerichtet', 'addieren', 'aufheben'],
  loesung: ['ungeordnet', 'ausgerichtet', 'addieren'],
  warum: 'Ungeordnete Elementarmagnete heben sich auf. Ausgerichtete Elementarmagnete addieren ihre Wirkungen.' },
{ id: 'm4q6', modul: 4, typ: 'single',
  frage: 'Ein Stabmagnet wird in drei Stücke zerbrochen. Wie sieht das mittlere Stück aus?',
  antworten: [
    { t: 'Es ist ein ganzer Magnet mit Nordpol und Südpol, wie das ganze Stück vorher (Nordpol links, Südpol rechts).', ok: true },
    { t: 'Es ist unmagnetisch.', h: 'Es besteht noch aus ausgerichteten Elementarmagneten und ist deshalb ein Magnet.' },
    { t: 'Es hat keinen Pol, denn die Pole sitzen nur an den äußeren Enden.', h: 'Beim Brechen entstehen an den Bruchstellen sofort neue Pole.' }
  ],
  warum: 'Alle Elementarmagnete im Mittelstück sind noch ausgerichtet. An den Bruchstellen entstehen neue Pole.' },

/* ---------- Modul 5: Stärke und Abschirmung ---------- */
{ id: 'm5q1', modul: 5, typ: 'single', blitz: true,
  frage: 'An welcher Stelle eines Stabmagneten hängen die meisten Büroklammern?',
  antworten: [
    { t: 'An den beiden Enden (Polen).', ok: true },
    { t: 'In der Mitte.', h: 'In der Mitte ist der Magnet am schwächsten.' },
    { t: 'Überall gleich viele.', h: 'Die Wirkung ist an den Polen am stärksten, in der Mitte am schwächsten.' }
  ],
  warum: 'An den Polen wirkt der Magnet am stärksten. Dort bleiben die meisten Klammern hängen.' },
{ id: 'm5q2', modul: 5, typ: 'single',
  frage: 'Du hältst einen Magneten über eine Büroklammer. Dazwischen liegt eine Platte. Bei welchem Material wird die Klammer nicht mehr angezogen?',
  antworten: [
    { t: 'Stahlblech', ok: true },
    { t: 'Glas', h: 'Glas lässt das Magnetfeld durch.' },
    { t: 'Kupferblech', h: 'Kupfer ist ein Metall, wird aber nicht angezogen und schirmt nicht ab. Nur Eisen schirmt ab.' },
    { t: 'Kunststoff', h: 'Kunststoff lässt das Magnetfeld durch.' }
  ],
  warum: 'Stahlblech besteht hauptsächlich aus Eisen. Es schirmt das Magnetfeld ab.' },
{ id: 'm5q3', modul: 5, typ: 'multi',
  frage: 'Du willst fair vergleichen, wie stark ein Stabmagnet an verschiedenen Stellen ist. Was muss gleich bleiben? Kreuze alle richtigen an.',
  antworten: [
    { t: 'Der Magnet.', ok: true, h: 'Der Magnet muss gleich bleiben, sonst veränderst du zwei Dinge.' },
    { t: 'Die Art der Büroklammern.', ok: true, h: 'Andere Klammern würden das Ergebnis verändern. Sie müssen gleich bleiben.' },
    { t: 'Die Art, wie man die Klammern anhängt (langsam annähern, nicht schütteln).', ok: true, h: 'Auch die Art des Anhängens muss gleich bleiben.' },
    { t: 'Die Stelle am Magneten.', h: 'Die Stelle verändert man ja. Das ist die Größe, die man vergleichen will.' }
  ],
  warum: 'Du veränderst nur die Stelle. Magnet, Klammern und die Art des Anhängens bleiben gleich.' },
{ id: 'm5q4', modul: 5, typ: 'single',
  frage: 'Karla zählt die Klammern: links 9, Mitte 2, rechts 8. Was folgt?',
  antworten: [
    { t: 'An den Enden ist der Magnet am stärksten, in der Mitte am schwächsten.', ok: true },
    { t: 'Der linke Pol ist viel stärker als der rechte.', h: '9 und 8 sind fast gleich. Der Unterschied ist zu klein, um daraus etwas zu schließen.' },
    { t: 'Der Magnet ist in der Mitte am stärksten.', h: 'In der Mitte hängen die wenigsten Klammern.' }
  ],
  warum: 'An den Enden hängen 9 und 8 Klammern, in der Mitte nur 2. Die Enden sind also am stärksten.' },
{ id: 'm5q5', modul: 5, typ: 'single',
  frage: 'Ein Kompass liegt in einer geschlossenen Dose aus Stahlblech. Außerhalb der Dose liegt ein starker Magnet. Wirkt der Magnet auf die Kompassnadel in der Dose?',
  antworten: [
    { t: 'Kaum, weil das Stahlblech das Magnetfeld abschirmt.', ok: true },
    { t: 'Ja, genauso stark wie ohne Dose.', h: 'Eisen und Stahl schirmen das Magnetfeld ab.' },
    { t: 'Nein, weil Magnete nur Eisen anziehen.', h: 'Der Magnet wirkt auch auf die Nadel (Magnete wirken auf Magnete), aber die Dose hält das Magnetfeld ab.' }
  ],
  warum: 'Das Stahlblech der Dose schirmt das Magnetfeld ab. Die Nadel merkt kaum etwas vom Magneten.' },

/* ---------- Modul 6: Kompass und Erde ---------- */
{ id: 'm6q1', modul: 6, typ: 'single', blitz: true,
  frage: 'Welcher magnetische Pol der Erde liegt in der Nähe des geografischen Nordpols?',
  antworten: [
    { t: 'Der magnetische Südpol.', ok: true },
    { t: 'Der magnetische Nordpol.', h: 'Die Nordspitze der Kompassnadel ist ein Nordpol. Sie zeigt nach Norden, weil dort ein Südpol sie anzieht.' }
  ],
  warum: 'Die Nordspitze der Nadel ist ein Nordpol. Sie zeigt nach Norden, weil dort der magnetische Südpol der Erde liegt.' },
{ id: 'm6q2', modul: 6, typ: 'single',
  frage: 'Warum zeigt die Nordspitze der Kompassnadel zum geografischen Nordpol?',
  antworten: [
    { t: 'Ungleichnamige Pole ziehen sich an. Dort liegt der magnetische Südpol der Erde.', ok: true },
    { t: 'Gleichnamige Pole ziehen sich an.', h: 'Gleichnamige Pole stoßen sich ab.' },
    { t: 'Weil Norden oben auf der Karte liegt.', h: 'Die Lage auf der Karte ist ein Name, keine Ursache. Es geht um die Anziehung zwischen Magnetpolen.' },
    { t: 'Weil im Norden besonders viel Eisen im Boden liegt.', h: 'Das ist nicht die Ursache. Die ganze Erde wirkt wie ein Magnet.' }
  ],
  warum: 'Die Nordspitze ist ein Nordpol. Der magnetische Südpol der Erde liegt im Norden und zieht sie an.' },
{ id: 'm6q3', modul: 6, typ: 'zuordnen',
  frage: 'Ordne zu. Welcher magnetische Pol liegt in der Nähe?',
  felder: ['In der Nähe liegt der magnetische Südpol', 'In der Nähe liegt der magnetische Nordpol'],
  karten: [
    { t: 'geografischer Nordpol', ziel: 0, h: 'Am geografischen Nordpol liegt der magnetische Südpol. Deshalb zeigt die Nordspitze dorthin.' },
    { t: 'geografischer Südpol', ziel: 1, h: 'Am geografischen Südpol liegt der magnetische Nordpol.' }
  ],
  warum: 'Die Pole sind vertauscht: Am geografischen Nordpol liegt der magnetische Südpol, am geografischen Südpol der magnetische Nordpol.' },
{ id: 'm6q4', modul: 6, typ: 'single',
  frage: 'Die rote Nordspitze der Kompassnadel ist …',
  antworten: [
    { t: 'der Nordpol des kleinen Nadelmagneten.', ok: true },
    { t: 'der Südpol des Nadelmagneten.', h: 'Die rote Spitze ist der Nordpol. Sie wird zum magnetischen Südpol der Erde gezogen.' },
    { t: 'ein Stück Eisen, das nur angezogen wird.', h: 'Die Nadel ist selbst ein Magnet mit Nord- und Südpol.' }
  ],
  warum: 'Die Nadel ist ein kleiner Magnet. Ihre rote Spitze ist der Nordpol.' },
{ id: 'm6q5', modul: 6, typ: 'single',
  frage: 'Neben einem starken Magneten zeigt der Kompass nicht mehr nach Norden. Warum?',
  antworten: [
    { t: 'Der starke Magnet in der Nähe wirkt stärker auf die Nadel als das schwache Magnetfeld der Erde.', ok: true },
    { t: 'Weil sich die Erde gedreht hat.', h: 'Die Drehung der Erde ändert die Richtung der Nadel nicht.' },
    { t: 'Weil der Kompass kaputt ist.', h: 'Der Kompass funktioniert. Nur der Magnet in der Nähe ist stärker als das Erdmagnetfeld.' }
  ],
  warum: 'In der Nähe des starken Magneten gewinnt sein Feld gegen das schwache Erdmagnetfeld.' },

/* ---------- Modul 7: Magnetfeld und Feldlinien ---------- */
{ id: 'm7q1', modul: 7, typ: 'single', blitz: true,
  frage: 'In welche Richtung verlaufen Feldlinien außerhalb eines Magneten?',
  antworten: [
    { t: 'Vom Nordpol zum Südpol.', ok: true },
    { t: 'Vom Südpol zum Nordpol.', h: 'Das ist die Richtung im Inneren des Magneten. Wir zeichnen Feldlinien nur außen, und dort laufen sie von N nach S.' },
    { t: 'Im Kreis um den Magneten, ohne feste Richtung.', h: 'Feldlinien haben eine feste Richtung. Sie zeigt von N nach S.' }
  ],
  warum: 'Außerhalb des Magneten zeigt die Richtung der Feldlinien vom Nordpol zum Südpol.' },
{ id: 'm7q2', modul: 7, typ: 'richtung', modus: 'kompass',
  frage: 'Drei Kompasse liegen an verschiedenen Punkten um einen Stabmagneten (N links, S rechts). Wohin zeigt jeweils die Nordspitze? Stelle jeden Kompass ein.',
  warum: 'Die Nordspitze zeigt in Feldlinienrichtung, also außen vom Nordpol weg und zum Südpol hin.',
  hinweisFalsch: 'Die Nordspitze zeigt in Feldlinienrichtung, also außen vom Nordpol weg und zum Südpol hin.' },
{ id: 'm7q3', modul: 7, typ: 'multi',
  frage: 'Welche Aussagen über Feldlinien stimmen? Kreuze alle richtigen an.',
  antworten: [
    { t: 'Feldlinien kreuzen sich nie.', ok: true, h: 'Feldlinien kreuzen sich nie.' },
    { t: 'Wo die Feldlinien dicht liegen, ist das Feld stark.', ok: true, h: 'Dichte Feldlinien bedeuten ein starkes Feld.' },
    { t: 'Die Richtung einer Feldlinie zeigt die Nordspitze der Kompassnadel.', ok: true, h: 'Die Nordspitze zeigt die Richtung der Feldlinie.' },
    { t: 'Eisenfeilspäne zeigen auch die Richtung der Feldlinien.', h: 'Feilspäne zeigen nur den Verlauf. Die Richtung findest du mit dem Kompass.' },
    { t: 'Man zeichnet die Feldlinien auch durch den Magneten hindurch von S nach N.', h: 'Wir zeichnen Feldlinien nur außerhalb des Magneten.' }
  ],
  warum: 'Feldlinien kreuzen sich nie, dicht liegende Linien zeigen ein starkes Feld, und die Nordspitze zeigt ihre Richtung.' },
{ id: 'm7q4', modul: 7, typ: 'hotspot', szene: 'hotspot-magnet',
  frage: 'Tippe auf eine Stelle, an der das Magnetfeld besonders stark ist.',
  hinweisFalsch: 'Hier liegen die Feldlinien weit auseinander. Das Feld ist schwach.',
  warum: 'An den Polen liegen die Feldlinien am dichtesten. Dort ist das Feld am stärksten.' },
{ id: 'm7q5', modul: 7, typ: 'single', szene: 'feldlinien-abc', fest: true,
  frage: 'Drei Zeichnungen zeigen einen Stabmagneten mit Feldlinien. Welche Zeichnung ist richtig?',
  antworten: [
    { t: 'Zeichnung A', h: 'Feldlinien kreuzen sich nie.' },
    { t: 'Zeichnung B', h: 'Die Pfeile müssen außen von N nach S zeigen.' },
    { t: 'Zeichnung C', ok: true }
  ],
  warum: 'In Zeichnung C verlaufen die Linien außen, die Pfeile zeigen von N nach S, und keine Linien kreuzen sich.' },
{ id: 'm7q6', modul: 7, typ: 'richtung', modus: 'pfeil', zusatz: true, szene: 'zwei-magnete-anziehend',
  frage: 'Zusatz: Zwei Magnete liegen nebeneinander. Bei beiden ist links der Südpol und rechts der Nordpol. In welche Richtung zeigt der Pfeil der Feldlinie im Spalt zwischen den Magneten?',
  loesung: 'rechts',
  hinweisFalsch: 'Die Feldlinie läuft außen vom Nordpol zum Südpol. Im Spalt steht links der Nordpol des linken Magneten und rechts der Südpol des rechten Magneten.',
  warum: 'Die Feldlinie läuft vom Nordpol des linken Magneten zum Südpol des rechten Magneten, also nach rechts.' },

/* ---------- Modul 8: Elektromagnet ---------- */
{ id: 'm8q1', modul: 8, typ: 'single', blitz: true,
  frage: 'Was passiert mit einer Kompassnadel neben einem Draht, durch den Strom fließt?',
  antworten: [
    { t: 'Sie wird abgelenkt. Ein elektrischer Strom erzeugt ein Magnetfeld.', ok: true },
    { t: 'Nichts, denn nur Magnete haben ein Magnetfeld.', h: 'Doch: Auch ein elektrischer Strom erzeugt ein Magnetfeld. Das hat Oersted entdeckt.' },
    { t: 'Sie wird vom Draht angezogen wie ein Stück Eisen.', h: 'Die Nadel dreht sich nur, sie wird nicht zum Draht gezogen. Das Magnetfeld des Stroms lenkt sie ab.' }
  ],
  warum: 'Der Strom im Draht erzeugt ein Magnetfeld. Dieses Feld lenkt die Kompassnadel ab.' },
{ id: 'm8q2', modul: 8, typ: 'single',
  frage: 'Du schaltest den Strom aus. Was passiert mit dem Magnetfeld der Spule?',
  antworten: [
    { t: 'Es verschwindet.', ok: true },
    { t: 'Es bleibt genauso stark.', h: 'Ohne Strom gibt es kein Magnetfeld.' },
    { t: 'Es wird stärker.', h: 'Ohne Strom verschwindet das Feld.' }
  ],
  warum: 'Das Magnetfeld der Spule gibt es nur, solange Strom fließt.' },
{ id: 'm8q3', modul: 8, typ: 'multi',
  frage: 'Wie macht man einen Elektromagneten stärker? Kreuze alle richtigen an.',
  antworten: [
    { t: 'Mehr Windungen.', ok: true, h: 'Je mehr Windungen, desto stärker das Feld.' },
    { t: 'Einen Eisenkern in die Spule stecken.', ok: true, h: 'Der Eisenkern macht das Feld viel stärker.' },
    { t: 'Einen Holzstab in die Spule stecken.', h: 'Holz ist nicht ferromagnetisch. Es ändert nichts.' },
    { t: 'Den Draht gerade lassen statt zu wickeln.', h: 'Gewickelt wird das Feld stärker. Ein gerader Draht gibt nur ein schwaches Feld.' }
  ],
  warum: 'Mehr Windungen und ein Eisenkern machen das Feld stärker.' },
{ id: 'm8q4', modul: 8, typ: 'single',
  frage: 'Warum wird ein Nagel in der Spule zum Magneten?',
  antworten: [
    { t: 'Das Magnetfeld der Spule richtet die Elementarmagnete im Eisen aus.', ok: true },
    { t: 'Der Nagel wird warm.', h: 'Wärme macht Magnete schwächer, nicht stärker.' },
    { t: 'Der Nagel enthält Strom aus der Batterie.', h: 'Der Strom fließt durch den Draht, nicht durch den Nagel. Das Feld des Stroms richtet die Elementarmagnete aus.' }
  ],
  warum: 'Das Feld der Spule richtet die Elementarmagnete im Eisen aus. Der Nagel wird selbst zum Magneten.' },
{ id: 'm8q5', modul: 8, typ: 'luecke',
  frage: 'Ergänze den Text.',
  text: 'Eine Spule mit Eisenkern heißt ___. Man kann ihn ___ und ___.',
  woerter: ['Elektromagnet', 'Dauermagnet', 'einschalten', 'ausschalten', 'Kompass'],
  loesung: ['Elektromagnet', 'einschalten', 'ausschalten'],
  tauschbar: [[1, 2]],
  warum: 'Eine Spule mit Eisenkern heißt Elektromagnet. Man kann ihn ein- und ausschalten.' },
{ id: 'm8q6', modul: 8, typ: 'single',
  frage: 'Auf dem Schrottplatz hebt ein Kran Autos mit einem Elektromagneten. Warum ist ein Elektromagnet hier besser als ein Dauermagnet?',
  antworten: [
    { t: 'Man kann ihn ausschalten und so die Last wieder ablegen.', ok: true },
    { t: 'Er zieht auch Holz und Kunststoff an.', h: 'Auch ein Elektromagnet zieht nur ferromagnetische Stoffe an.' },
    { t: 'Er braucht keine Energie.', h: 'Er braucht elektrische Energie. Das ist ein Nachteil, kein Vorteil.' }
  ],
  warum: 'Schaltet man den Elektromagneten aus, fällt die Last ab. Ein Dauermagnet würde sie festhalten.' },
{ id: 'm8q7', modul: 8, typ: 'single',
  frage: 'Du vertauschst die Anschlüsse der Batterie an der Spule. Was passiert mit den Polen?',
  antworten: [
    { t: 'Nordpol und Südpol vertauschen sich.', ok: true },
    { t: 'Nichts, die Pole bleiben wie vorher.', h: 'Beim Vertauschen der Anschlüsse ändert sich die Richtung des Stroms. Dadurch tauschen die Pole.' },
    { t: 'Das Magnetfeld verschwindet.', h: 'Das Feld verschwindet nur, wenn der Strom aus ist. Hier fließt Strom, nur in die andere Richtung.' }
  ],
  warum: 'Die Stromrichtung ändert sich. Deshalb tauschen Nordpol und Südpol die Plätze.' }
];
