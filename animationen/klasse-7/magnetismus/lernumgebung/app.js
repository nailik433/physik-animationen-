/* ==========================================================
   APP: Startseite, Module, Blitz-Check, Abschlusscheck, Fortschritt
   Fortschritt nur im Arbeitsspeicher und in sessionStorage (verschwindet beim Schließen des Tabs).
   ========================================================== */
(function () {
  'use strict';
  var G = window.G, F = window.F, el = G.el;
  var KEY = 'lern-magnetismus-v1';
  var app = document.getElementById('app');
  var Z;

  /* ---------- Zustand ---------- */
  function leer() { return { salt: Math.floor(Math.random() * 100000) + 1, q: {}, bq: {}, blitzIdx: 0, blitzFertig: false, auswahl: null, aq: {}, aIdx: 0, aFertig: false, lauf: 0 }; }
  function laden() {
    try { var s = window.sessionStorage.getItem(KEY); if (s) Z = JSON.parse(s); } catch (e) { Z = null; }
    if (!Z || typeof Z !== 'object' || !Z.q) Z = leer();
    F.salt = Z.salt;
  }
  function speichern() { try { window.sessionStorage.setItem(KEY, JSON.stringify(Z)); } catch (e) { /* kein Speicher: egal */ } }
  function zuruecksetzen() { Z = leer(); F.salt = Z.salt; speichern(); }
  function st(kontext, id) { var o = Z[kontext]; if (!o[id]) o[id] = { versuche: 0 }; return o[id]; }

  /* ---------- Daten ---------- */
  var FR = window.FRAGEN, MO = window.MODULE;
  function frage(id) { for (var i = 0; i < FR.length; i++) if (FR[i].id === id) return FR[i]; return null; }
  function fragenVon(m) { return FR.filter(function (q) { return q.modul === m; }); }
  function zaehlend(m) { return fragenVon(m).filter(function (q) { return !q.zusatz; }); }
  function modul(id) { return MO.filter(function (m) { return m.id === id; })[0]; }
  function blitzFragen() { return FR.filter(function (q) { return q.blitz; }).sort(function (a, b) { return a.modul - b.modul; }); }
  function fortschritt(m) {
    var qs = zaehlend(m), richtig = 0, fertig = 0;
    qs.forEach(function (q) { var s = Z.q[q.id]; if (s && s.fertig) fertig++; if (s && s.ersterOk) richtig++; });
    return { n: qs.length, richtig: richtig, fertig: fertig };
  }
  function blitzOk(m) { var q = blitzFragen().filter(function (b) { return b.modul === m; })[0]; var s = q && Z.bq[q.id]; return s && s.fertig ? !!s.ersterOk : null; }

  /* ---------- Hilfen ---------- */
  function leeren() { G.alleStoppen(); app.innerHTML = ''; hideFw(); }
  function fortschrittsbalken(wert, max, text) {
    var b = el('div', { 'class': 'balken', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(max), 'aria-valuenow': String(wert), 'aria-label': text }, [el('div', { 'class': 'fuell' })]);
    b.firstChild.style.width = (max ? Math.round(100 * wert / max) : 0) + '%';
    return b;
  }
  function kasten(art, b) {
    var titel = { merke: 'MERKE', tipp: 'TIPP', stolper: 'STOLPERFALLE', beispiel: 'BEISPIEL' }[art];
    var k = el('div', { 'class': 'kasten ' + art }, [el('p', { 'class': 'kasten-titel', text: titel })]);
    if (b.liste) { var ul = el('ul'); b.liste.forEach(function (t) { ul.appendChild(el('li', { html: F.fmt(t) })); }); k.appendChild(ul); }
    else k.appendChild(el('p', { html: F.fmt(b.text) }));
    return k;
  }
  function seitenkopf(titel, unter) {
    var h = el('h1', { text: titel, tabindex: '-1', id: 'haupt' });
    var out = [h]; if (unter) out.push(el('p', { 'class': 'leit', text: unter }));
    return out;
  }
  function zurStart() { return el('a', { 'class': 'btn zweit zurueck-link', href: '#/', text: '← Startseite' }); }

  /* ---------- Fachwort-Erklärung ---------- */
  var fwBox = el('div', { id: 'fwBox', 'class': 'fwbox', role: 'status', hidden: '' });
  document.body.appendChild(fwBox);
  var fwAktiv = null;
  function hideFw() { fwBox.hidden = true; fwAktiv = null; }
  function showFw(btn) {
    var key = btn.getAttribute('data-fw');
    if (fwAktiv === btn && !fwBox.hidden) { hideFw(); return; }
    fwAktiv = btn;
    fwBox.innerHTML = '';
    fwBox.appendChild(el('p', {}, [el('strong', { text: btn.textContent + ': ' }), document.createTextNode(window.GLOSSAR[key])]));
    fwBox.appendChild(G.knopf('Schließen', function () { hideFw(); btn.focus(); }, 'zweit klein'));
    fwBox.hidden = false;
    var r = btn.getBoundingClientRect(), bw = fwBox.offsetWidth, sx = window.pageXOffset, sy = window.pageYOffset;
    var left = Math.max(8, Math.min(r.left + sx, sx + document.documentElement.clientWidth - bw - 8));
    var top = r.bottom + sy + 6;
    fwBox.style.left = left + 'px'; fwBox.style.top = top + 'px';
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.fw') : null;
    if (b) { e.preventDefault(); showFw(b); }
  });
  document.addEventListener('pointerdown', function (e) {
    if (fwBox.hidden) return;
    var t = e.target;
    if (t.closest && (t.closest('.fw') || t.closest('#fwBox'))) return;
    hideFw();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hideFw(); });

  /* ---------- Startseite ---------- */
  function ansichtStart() {
    leeren();
    seitenkopf('Magnetismus: Teste dich selbst', 'Wiederhole alles zum Thema Magnetismus. Es gibt keine Noten und keinen Zeitdruck. Zu jedem Thema findest du einen kurzen Text, eine Animation und Fragen mit sofortiger Rückmeldung.').forEach(function (n) { app.appendChild(n); });

    var ablauf = el('ol', { 'class': 'schritte3' });
    // 1 Blitz-Check
    var s1 = el('li', { 'class': 'schrittkarte' });
    s1.appendChild(el('h2', { text: '1. Blitz-Check' }));
    s1.appendChild(el('p', { text: 'Acht Fragen, eine pro Modul. Dauert etwa fünf Minuten. Danach siehst du, was du schon kannst und wo sich Üben lohnt.' }));
    var bz = el('div', { 'class': 'knopfzeile' });
    var fertig = Z.blitzFertig;
    bz.appendChild(el('a', { 'class': 'btn haupt', href: '#/blitz', text: fertig ? 'Ergebnis ansehen' : (Object.keys(Z.bq).length ? 'Blitz-Check fortsetzen' : 'Blitz-Check starten') }));
    s1.appendChild(bz);
    ablauf.appendChild(s1);
    // 2 Module
    var s2 = el('li', { 'class': 'schrittkarte breit' });
    s2.appendChild(el('h2', { text: '2. Module' }));
    s2.appendChild(el('p', { text: fertig ? 'Dein Blitz-Check ist fertig. Die markierten Module lohnen sich zum Üben.' : 'Du kannst die Module in beliebiger Reihenfolge bearbeiten. Pro Modul brauchst du etwa sechs bis acht Minuten.' }));
    var kach = el('div', { 'class': 'kacheln' });
    MO.forEach(function (m) {
      var p = fortschritt(m.id), ok = fertig ? blitzOk(m.id) : null;
      var k = el('a', { 'class': 'kachel' + (ok === false ? ' empfohlen' : ''), href: '#/modul/' + m.id });
      k.appendChild(el('span', { 'class': 'kachel-nr', text: String(m.id) }));
      k.appendChild(el('span', { 'class': 'kachel-titel', text: m.titel }));
      k.appendChild(el('span', { 'class': 'kachel-leit', text: m.kurz }));
      if (ok === true) k.appendChild(el('span', { 'class': 'chip-status gut', text: '✓ Das kannst du schon' }));
      if (ok === false) k.appendChild(el('span', { 'class': 'chip-status ueben', text: '→ Hier lohnt sich Üben' }));
      k.appendChild(fortschrittsbalken(p.fertig, p.n, 'Fortschritt Modul ' + m.id));
      k.appendChild(el('span', { 'class': 'kachel-fort', text: p.richtig + ' von ' + p.n + ' Fragen richtig' + (p.fertig > p.richtig ? ' (' + p.fertig + ' bearbeitet)' : '') }));
      kach.appendChild(k);
    });
    s2.appendChild(kach);
    ablauf.appendChild(s2);
    // 3 Abschluss
    var s3 = el('li', { 'class': 'schrittkarte' });
    s3.appendChild(el('h2', { text: '3. Abschlusscheck' }));
    s3.appendChild(el('p', { text: 'Zwölf gemischte Fragen aus allen Modulen. Am Ende siehst du deine Punktzahl und welche Module du noch wiederholen solltest.' }));
    s3.appendChild(el('div', { 'class': 'knopfzeile' }, [el('a', { 'class': 'btn haupt', href: '#/abschluss', text: Z.aFertig ? 'Ergebnis ansehen' : (Z.auswahl ? 'Abschlusscheck fortsetzen' : 'Abschlusscheck starten') })]));
    ablauf.appendChild(s3);
    app.appendChild(ablauf);

    var reset = G.knopf('Neu starten', function () {
      if (reset.getAttribute('data-bereit') !== '1') {
        reset.setAttribute('data-bereit', '1'); reset.textContent = 'Wirklich alles zurücksetzen? Tippe noch einmal.';
        setTimeout(function () { if (reset.isConnected) { reset.removeAttribute('data-bereit'); reset.textContent = 'Neu starten'; } }, 5000);
      } else { zuruecksetzen(); ansichtStart(); }
    }, 'zweit');
    app.appendChild(el('div', { 'class': 'knopfzeile unten' }, [reset]));
    fokusHaupt();
  }
  function fokusHaupt() { var h = document.getElementById('haupt'); if (h) { try { h.focus({ preventScroll: true }); } catch (e) { h.focus(); } } window.scrollTo(0, 0); }

  /* ---------- Modulseite ---------- */
  function ansichtModul(id) {
    var m = modul(id); if (!m) { location.hash = '#/'; return; }
    leeren();
    app.appendChild(zurStart());
    seitenkopf('Modul ' + m.id + ': ' + m.titel, 'Leitfrage: ' + m.leit).forEach(function (n) { app.appendChild(n); });

    var sprung = el('nav', { 'class': 'sprung', 'aria-label': 'Abschnitte' });
    [['s-info', '1 Infotext'], ['s-anim', '2 Animation'], ['s-fragen', '3 Fragen']].forEach(function (a) {
      sprung.appendChild(G.knopf(a[1], function () { var s = document.getElementById(a[0]); s.scrollIntoView({ behavior: G.reduced ? 'auto' : 'smooth', block: 'start' }); var h = s.querySelector('h2'); if (h) h.focus(); }, 'zweit'));
    });
    app.appendChild(sprung);

    // 1 Infotext
    var s1 = el('section', { id: 's-info', 'class': 'abschnitt' }, [el('h2', { text: '1 Infotext', tabindex: '-1' })]);
    m.info.forEach(function (b) {
      if (b.t === 'p') s1.appendChild(el('p', { 'class': 'fliess', html: F.fmt(b.text) }));
      else s1.appendChild(kasten(b.t, b));
    });
    app.appendChild(s1);

    // 2 Animation
    var s2 = el('section', { id: 's-anim', 'class': 'abschnitt' }, [el('h2', { text: '2 Animation: ' + m.anim.titel, tabindex: '-1' })]);
    s2.appendChild(el('p', { 'class': 'fliess', html: '<strong>So bedienst du sie:</strong> ' + F.esc(m.anim.bedienung) }));
    var pr = el('div', { 'class': 'kasten tipp' }, [el('p', { 'class': 'kasten-titel', text: 'PROBIERE AUS' })]);
    var ul = el('ul'); m.anim.auftraege.forEach(function (a) { ul.appendChild(el('li', { text: a })); }); pr.appendChild(ul);
    s2.appendChild(pr);
    var animHost = el('div', { 'class': 'anim', id: 'animhost' });
    s2.appendChild(animHost);
    app.appendChild(s2);
    try { if (window.ANIM && window.ANIM[m.id]) window.ANIM[m.id](animHost); else animHost.appendChild(el('p', { text: 'Für dieses Modul gibt es keine Animation.' })); }
    catch (e) { animHost.appendChild(el('p', { 'class': 'rueck nein', text: 'Die Animation konnte nicht geladen werden.' })); if (window.console) console.error(e); }

    // 3 Fragen
    var s3 = el('section', { id: 's-fragen', 'class': 'abschnitt' }, [el('h2', { text: '3 Fragen', tabindex: '-1' })]);
    app.appendChild(s3);
    var qs = fragenVon(m.id), idx = 0;
    for (var i = 0; i < qs.length; i++) { var sx = Z.q[qs[i].id]; if (!(sx && sx.fertig) && !qs[i].zusatz) { idx = i; break; } idx = i + 1; }
    function fragenAnsicht() {
      s3.innerHTML = ''; s3.appendChild(el('h2', { text: '3 Fragen', tabindex: '-1' }));
      var p = fortschritt(m.id);
      s3.appendChild(fortschrittsbalken(p.fertig, p.n, 'Bearbeitete Fragen in Modul ' + m.id));
      s3.appendChild(el('p', { 'class': 'fort-text', text: p.fertig + ' von ' + p.n + ' Fragen bearbeitet, ' + p.richtig + ' davon richtig beim ersten Versuch.' }));
      var punkte = el('div', { 'class': 'punkte', role: 'group', 'aria-label': 'Fragen auswählen' });
      qs.forEach(function (q, k) {
        var s = Z.q[q.id], sym = !s || !s.fertig ? '' : (s.ersterOk ? ' ✓' : ' ✗');
        var b = G.knopf((q.zusatz ? 'Zusatz' : String(k + 1)) + sym, function () { idx = k; fragenAnsicht(); }, 'punkt' + (k === idx ? ' aktiv' : ''));
        b.setAttribute('aria-label', (q.zusatz ? 'Zusatzfrage' : 'Frage ' + (k + 1)) + (!s || !s.fertig ? ', offen' : (s.ersterOk ? ', richtig beim ersten Versuch' : ', mit Lösung angesehen')));
        if (k === idx) b.setAttribute('aria-current', 'true');
        punkte.appendChild(b);
      });
      s3.appendChild(punkte);
      if (idx >= qs.length) { zusammenfassung(); return; }
      var q = qs[idx], s = st('q', q.id);
      var kopf = el('h3', { 'class': 'fragenkopf', text: q.zusatz ? 'Zusatzfrage (zählt nicht für den Fortschritt)' : 'Frage ' + (idx + 1) + ' von ' + qs.length });
      s3.appendChild(kopf);
      if (s.vorab) s3.appendChild(el('p', { 'class': 'vorab', text: '✓ Schon gekonnt: Diese Frage hast du im Blitz-Check richtig beantwortet.' }));
      var host = el('div', { 'class': 'fragenhost' }); s3.appendChild(host);
      var nav = el('div', { 'class': 'knopfzeile' });
      var zurueck = G.knopf('← Zurück', function () { idx = Math.max(0, idx - 1); fragenAnsicht(); }, 'zweit'); zurueck.disabled = idx === 0;
      var weiter = G.knopf(idx === qs.length - 1 ? 'Fertig' : 'Weiter →', function () { idx++; fragenAnsicht(); scrollZuFragen(); }, 'haupt');
      nav.appendChild(zurueck); nav.appendChild(weiter);
      F.zeigeFrage(host, q, s, { onFertig: function () { speichern(); aktualisierePunkte(); } });
      s3.appendChild(nav);
      function aktualisierePunkte() {
        var p2 = fortschritt(m.id);
        var bal = s3.querySelector('.balken'); if (bal) { bal.firstChild.style.width = Math.round(100 * p2.fertig / p2.n) + '%'; bal.setAttribute('aria-valuenow', String(p2.fertig)); }
        var ft = s3.querySelector('.fort-text'); if (ft) ft.textContent = p2.fertig + ' von ' + p2.n + ' Fragen bearbeitet, ' + p2.richtig + ' davon richtig beim ersten Versuch.';
        var bs = punkte.querySelectorAll('button');
        qs.forEach(function (qq, k) { var sx = Z.q[qq.id]; if (sx && sx.fertig) bs[k].textContent = (qq.zusatz ? 'Zusatz' : String(k + 1)) + (sx.ersterOk ? ' ✓' : ' ✗'); });
      }
    }
    function scrollZuFragen() { var e = document.getElementById('s-fragen'); if (e) e.scrollIntoView({ behavior: 'auto', block: 'start' }); }
    function zusammenfassung() {
      var p = fortschritt(m.id);
      var k = el('div', { 'class': 'kasten merke' }, [el('p', { 'class': 'kasten-titel', text: 'GESCHAFFT' }),
        el('p', { text: 'Du hast in diesem Modul ' + p.richtig + ' von ' + p.n + ' Fragen beim ersten Versuch richtig beantwortet.' + (p.fertig < p.n ? ' Es sind noch ' + (p.n - p.fertig) + ' Fragen offen. Tippe oben auf eine Nummer.' : '') })]);
      s3.appendChild(k);
      var z = el('div', { 'class': 'knopfzeile' });
      z.appendChild(el('a', { 'class': 'btn haupt', href: '#/', text: 'Zur Startseite' }));
      if (m.id < MO.length) z.appendChild(el('a', { 'class': 'btn zweit', href: '#/modul/' + (m.id + 1), text: 'Nächstes Modul' }));
      z.appendChild(G.knopf('Fragen nochmal ansehen', function () { idx = 0; fragenAnsicht(); }, 'zweit'));
      s3.appendChild(z);
    }
    fragenAnsicht();
    fokusHaupt();
  }

  /* ---------- Folge von Fragen (Blitz-Check und Abschlusscheck) ---------- */
  function folge(opt) {
    // opt: ids, kontext ('bq' | 'aq'), idxKey ('blitzIdx' | 'aIdx'), titel, ende()
    leeren();
    var qs = opt.ids.map(frage), n = qs.length;
    app.appendChild(zurStart());
    seitenkopf(opt.titel).forEach(function (x) { app.appendChild(x); });
    var box = el('div', { 'class': 'folge' }); app.appendChild(box);
    function zeige() {
      var i = Z[opt.idxKey];
      if (i >= n) { opt.ende(); return; }
      box.innerHTML = '';
      var q = qs[i], s = st(opt.kontext, q.id);
      var fertigZahl = qs.filter(function (x) { var t = Z[opt.kontext][x.id]; return t && t.fertig; }).length;
      box.appendChild(fortschrittsbalken(fertigZahl, n, 'Fortschritt'));
      box.appendChild(el('h2', { 'class': 'fragenkopf', text: 'Frage ' + (i + 1) + ' von ' + n + (opt.zeigeModul ? ' (Modul ' + q.modul + ': ' + modul(q.modul).titel + ')' : '') }));
      var host = el('div', { 'class': 'fragenhost' }); box.appendChild(host);
      var nav = el('div', { 'class': 'knopfzeile' });
      var weiter = G.knopf(i === n - 1 ? 'Ergebnis ansehen' : 'Weiter →', function () { Z[opt.idxKey] = i + 1; speichern(); zeige(); window.scrollTo(0, 0); var h = document.getElementById('haupt'); if (h) h.focus({ preventScroll: true }); }, 'haupt');
      weiter.hidden = !s.fertig;
      F.zeigeFrage(host, q, s, { onFertig: function () { weiter.hidden = false; if (opt.beiFertig) opt.beiFertig(q, s); speichern(); weiter.focus(); } });
      nav.appendChild(weiter); box.appendChild(nav);
    }
    zeige();
    fokusHaupt();
  }

  /* ---------- Blitz-Check ---------- */
  function ansichtBlitz() {
    if (Z.blitzFertig) { blitzErgebnis(); return; }
    var ids = blitzFragen().map(function (q) { return q.id; });
    folge({
      ids: ids, kontext: 'bq', idxKey: 'blitzIdx', titel: 'Blitz-Check', zeigeModul: true,
      beiFertig: function (q, s) {
        if (s.ersterOk) { Z.q[q.id] = { versuche: 1, ersterOk: true, fertig: true, vorab: true }; }
      },
      ende: function () { Z.blitzFertig = true; speichern(); blitzErgebnis(); }
    });
  }
  function blitzErgebnis() {
    leeren();
    app.appendChild(zurStart());
    seitenkopf('Blitz-Check: dein Ergebnis', 'So sieht es für jedes Modul aus. Fragen, die du richtig hattest, sind in den Modulen schon abgehakt.').forEach(function (x) { app.appendChild(x); });
    var liste = el('ul', { 'class': 'ergebnisliste' });
    var ueben = [];
    MO.forEach(function (m) {
      var ok = blitzOk(m.id);
      if (ok === false) ueben.push(m);
      var li = el('li', { 'class': ok ? 'gut' : 'ueben' }, [
        el('span', { 'class': 'erg-sym', text: ok ? '✓' : '→' }),
        el('span', { 'class': 'erg-text' }, [el('strong', { text: 'Modul ' + m.id + ': ' + m.titel }), document.createTextNode(': ' + (ok ? 'Das kannst du schon.' : 'Hier lohnt sich Üben.'))]),
        el('a', { 'class': 'btn ' + (ok ? 'zweit' : 'haupt'), href: '#/modul/' + m.id, text: ok ? 'Trotzdem ansehen' : 'Jetzt üben' })
      ]);
      liste.appendChild(li);
    });
    app.appendChild(liste);
    app.appendChild(el('p', { 'class': 'fliess', text: ueben.length ? 'Beginne mit den Modulen, die mit einem Pfeil markiert sind.' : 'Super! Du hast alle Blitz-Fragen auf Anhieb richtig. Mach trotzdem den Abschlusscheck.' }));
    app.appendChild(el('div', { 'class': 'knopfzeile' }, [el('a', { 'class': 'btn haupt', href: '#/', text: 'Zur Startseite' }), el('a', { 'class': 'btn zweit', href: '#/abschluss', text: 'Zum Abschlusscheck' })]));
    fokusHaupt();
  }

  /* ---------- Abschlusscheck ---------- */
  function waehleAbschluss() {
    var rnd = G.zufall(Z.salt * 31 + (Z.lauf || 0) * 977 + 5);
    var pool = FR.filter(function (q) { return !q.blitz && !q.zusatz; }), ids = [];
    MO.forEach(function (m) {
      var c = F.mischen(pool.filter(function (q) { return q.modul === m.id; }), rnd);
      ids.push(c[0].id);
    });
    var rest = F.mischen(pool.filter(function (q) { return ids.indexOf(q.id) < 0; }), rnd);
    while (ids.length < 12 && rest.length) ids.push(rest.shift().id);
    return F.mischen(ids.map(function (id) { return frage(id); }), rnd).sort(function (a, b) { return a.modul - b.modul; }).map(function (q) { return q.id; });
  }
  function ansichtAbschluss() {
    if (Z.aFertig) { abschlussErgebnis(); return; }
    if (!Z.auswahl) {
      leeren();
      app.appendChild(zurStart());
      seitenkopf('Abschlusscheck', 'Zwölf Fragen aus allen Modulen. Du siehst keine Frage aus dem Blitz-Check. Gewertet wird, was du beim ersten Versuch richtig hast.').forEach(function (x) { app.appendChild(x); });
      app.appendChild(el('div', { 'class': 'knopfzeile' }, [G.knopf('Abschlusscheck starten', function () { Z.auswahl = waehleAbschluss(); Z.aq = {}; Z.aIdx = 0; speichern(); ansichtAbschluss(); }, 'haupt')]));
      fokusHaupt(); return;
    }
    folge({ ids: Z.auswahl, kontext: 'aq', idxKey: 'aIdx', titel: 'Abschlusscheck', zeigeModul: false,
      ende: function () { Z.aFertig = true; speichern(); abschlussErgebnis(); } });
  }
  function abschlussErgebnis() {
    leeren();
    app.appendChild(zurStart());
    var qs = Z.auswahl.map(frage), punkte = 0, proModul = {};
    qs.forEach(function (q) {
      var s = Z.aq[q.id] || {}; var pm = proModul[q.modul] || (proModul[q.modul] = { n: 0, ok: 0 });
      pm.n++; if (s.ersterOk) { pm.ok++; punkte++; }
    });
    seitenkopf('Abschlusscheck: dein Ergebnis').forEach(function (x) { app.appendChild(x); });
    app.appendChild(el('p', { 'class': 'punktzahl', text: punkte + ' von ' + qs.length + ' Punkten' }));
    app.appendChild(el('p', { 'class': 'fliess', text: 'Für jede Frage, die du beim ersten Versuch richtig hattest, gibt es einen Punkt.' }));
    var tab = el('table', { 'class': 'tabelle' });
    tab.appendChild(el('thead', {}, [el('tr', {}, [el('th', { text: 'Modul' }), el('th', { text: 'Richtig' }), el('th', { text: 'Hinweis' })])]));
    var tb = el('tbody'); var wdh = [];
    MO.forEach(function (m) {
      var pm = proModul[m.id]; if (!pm) return;
      var gut = pm.ok === pm.n; if (!gut) wdh.push(m);
      tb.appendChild(el('tr', {}, [el('td', { text: m.id + ': ' + m.titel }), el('td', { text: pm.ok + ' von ' + pm.n }),
        el('td', {}, gut ? [document.createTextNode('✓ Das sitzt.')] : [document.createTextNode('→ Wiederholen: '), el('a', { href: '#/modul/' + m.id, text: 'Modul ' + m.id + ' öffnen' })])]));
    });
    tab.appendChild(tb); app.appendChild(tab);
    app.appendChild(el('p', { 'class': 'fliess', text: wdh.length ? 'Wiederhole noch: ' + wdh.map(function (m) { return 'Modul ' + m.id + ' (' + m.titel + ')'; }).join(', ') + '.' : 'Stark! In allen Modulen hast du die Fragen auf Anhieb richtig beantwortet.' }));
    app.appendChild(el('div', { 'class': 'knopfzeile' }, [
      el('a', { 'class': 'btn haupt', href: '#/', text: 'Zur Startseite' }),
      G.knopf('Nochmal mit neuen Fragen', function () { Z.lauf = (Z.lauf || 0) + 1; Z.auswahl = waehleAbschluss(); Z.aq = {}; Z.aIdx = 0; Z.aFertig = false; speichern(); ansichtAbschluss(); }, 'zweit')
    ]));
    fokusHaupt();
  }

  /* ---------- Weiche ---------- */
  function route() {
    var h = (location.hash || '#/').replace(/^#\/?/, '');
    var t = h.split('/');
    try {
      if (t[0] === 'modul' && /^\d+$/.test(t[1] || '')) ansichtModul(parseInt(t[1], 10));
      else if (t[0] === 'blitz') ansichtBlitz();
      else if (t[0] === 'abschluss') ansichtAbschluss();
      else ansichtStart();
    } catch (e) { if (window.console) console.error(e); app.textContent = 'Es ist ein Fehler aufgetreten. Lade die Seite neu.'; }
  }
  window.addEventListener('hashchange', route);
  document.addEventListener('visibilitychange', function () { /* Animationen pausieren selbst, siehe G.laufen */ });
  laden();
  window.__app = { zustand: function () { return Z; }, route: route, reset: function () { zuruecksetzen(); route(); }, abschlussIds: function () { return Z.auswahl; } };
  route();
})();
