/* Modul 1: Versuchsplaner (fairer Test) */
(function () {
  'use strict';
  var G = window.G, el = G.el;
  window.ANIM = window.ANIM || {};

  var SCHLOSS_ZU = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M7 11V8a5 5 0 0 1 10 0v3" fill="none" stroke="#111" stroke-width="2.4"/><rect x="4" y="11" width="16" height="11" rx="2" fill="#F2C94C" stroke="#111" stroke-width="2"/></svg>';
  var SCHLOSS_OFFEN = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M7 11V8a5 5 0 0 1 9.6-2" fill="none" stroke="#111" stroke-width="2.4"/><rect x="4" y="11" width="16" height="11" rx="2" fill="#fff" stroke="#111" stroke-width="2"/></svg>';

  window.ANIM[1] = function (host) {
    var W = 720, H = 290;
    var GROESSEN = [
      { id: 'magnet', name: 'Größe des Magneten', werte: ['klein', 'mittel', 'groß'], fest: 1, vary: false },
      { id: 'klammer', name: 'Art der Büroklammern', werte: ['leicht', 'schwer'], fest: 0, vary: false },
      { id: 'stelle', name: 'Stelle am Magneten', werte: ['Ende', 'Mitte'], fest: 0, vary: false }
    ];
    var BASIS = [3, 5, 8];
    function anzahl(m, k, s) { var n = BASIS[m] * (s === 1 ? 0.25 : 1) * (k === 1 ? 0.6 : 1); return Math.max(1, Math.round(n)); }
    var cv = G.canvas(host, W, H, { label: 'Ein Stabmagnet mit hängenden Büroklammern. Darunter die Ergebnistabelle.' });
    var szene = { m: 1, k: 0, s: 0, gezeigt: 0, soll: 0 }, lauf = null, nr = 0, speed = 1;
    var hinweis = el('p', { 'class': 'animstatus', 'aria-live': 'polite' });
    var karten = el('div', { 'class': 'groessen' });
    var kartenEl = [];
    GROESSEN.forEach(function (g, gi) {
      var kopf = el('div', { 'class': 'gk-kopf' });
      var schloss = el('span', { 'class': 'schloss', html: SCHLOSS_ZU });
      var stand = el('span', { 'class': 'gk-stand', text: 'fest' });
      kopf.appendChild(schloss); kopf.appendChild(el('strong', { text: g.name })); kopf.appendChild(stand);
      var seg = el('div', { 'class': 'segment', role: 'radiogroup', 'aria-label': g.name + ': fester Wert' });
      var wb = g.werte.map(function (w, wi) {
        var b = G.knopf(w, function () { if (g.vary) return; g.fest = wi; aktualisiere(); }, 'segknopf');
        b.setAttribute('role', 'radio'); seg.appendChild(b); return b;
      });
      var vary = el('label', { 'class': 'opt klein' }, [el('input', { type: 'checkbox' }), el('span', { 'class': 'opt-t', text: 'Diese Größe verändern' })]);
      vary.firstChild.addEventListener('change', function () { g.vary = vary.firstChild.checked; aktualisiere(); });
      var alle = el('p', { 'class': 'gk-alle', text: 'Im Versuch werden alle Werte getestet: ' + g.werte.join(', ') + '.' });
      var karte = el('div', { 'class': 'groessenkarte' }, [kopf, seg, vary, alle]);
      kartenEl.push({ karte: karte, schloss: schloss, stand: stand, wb: wb, alle: alle, seg: seg });
      karten.appendChild(karte);
    });
    function aktualisiere() {
      var n = 0;
      GROESSEN.forEach(function (g, gi) {
        var k = kartenEl[gi];
        k.schloss.innerHTML = g.vary ? SCHLOSS_OFFEN : SCHLOSS_ZU;
        k.stand.textContent = g.vary ? 'wird verändert' : 'fest';
        k.karte.classList.toggle('veraendert', g.vary);
        k.seg.hidden = g.vary; k.alle.hidden = !g.vary;
        k.wb.forEach(function (b, wi) { b.setAttribute('aria-checked', wi === g.fest ? 'true' : 'false'); b.setAttribute('aria-pressed', wi === g.fest ? 'true' : 'false'); });
        if (g.vary) n++;
      });
      if (n === 0) hinweis.textContent = 'Hake an, welche Größe du verändern willst.';
      else if (n === 1) hinweis.textContent = 'Du veränderst nur eine Größe. Alle anderen bleiben fest. Das ist ein fairer Test.';
      else hinweis.textContent = 'Dann weißt du nicht, welche Änderung die Wirkung auslöst.';
      hinweis.className = 'animstatus' + (n >= 2 ? ' warn' : '');
    }
    var tab = el('table', { 'class': 'tabelle' }), tb = el('tbody');
    tab.appendChild(el('caption', { text: 'Ergebnisse' }));
    tab.appendChild(el('thead', {}, [el('tr', {}, [el('th', { text: 'Nr.' }), el('th', { text: 'Magnet' }), el('th', { text: 'Klammern' }), el('th', { text: 'Stelle' }), el('th', { text: 'Anzahl hängen' }), el('th', { text: 'Test' })])]));
    tab.appendChild(tb);
    var leer = el('tr', {}, [el('td', { colspan: '6', text: 'Noch kein Versuch. Tippe auf „Versuch starten“.' })]);
    tb.appendChild(leer);
    function startVersuch() {
      if (lauf) return;
      var anzV = GROESSEN.filter(function (g) { return g.vary; }).length;
      if (anzV === 0) { hinweis.textContent = 'Wähle zuerst eine Größe, die du verändern willst.'; hinweis.className = 'animstatus warn'; return; }
      var liste = [], mi = GROESSEN[0].vary ? [0, 1, 2] : [GROESSEN[0].fest], ki = GROESSEN[1].vary ? [0, 1] : [GROESSEN[1].fest], si = GROESSEN[2].vary ? [0, 1] : [GROESSEN[2].fest];
      mi.forEach(function (m) { ki.forEach(function (k) { si.forEach(function (s) { liste.push([m, k, s]); }); }); });
      lauf = { liste: liste, idx: 0, t: 0, fair: anzV === 1 };
      beginneVariante();
      knoepfe.start.disabled = true;
    }
    function beginneVariante() {
      var v = lauf.liste[lauf.idx]; szene.m = v[0]; szene.k = v[1]; szene.s = v[2]; szene.soll = anzahl(v[0], v[1], v[2]); szene.gezeigt = 0; lauf.t = 0;
    }
    var knoepfe = {};
    knoepfe.start = G.knopf('Versuch starten', startVersuch, 'haupt');
    var leeren = G.knopf('Tabelle leeren', function () { if (lauf) return; tb.innerHTML = ''; tb.appendChild(leer); nr = 0; }, 'zweit');
    var h = G.laufen(function (dt) {
      dt *= speed * (G.reduced ? 3 : 1);
      if (lauf) {
        lauf.t += dt;
        szene.gezeigt = Math.min(szene.soll, Math.floor(lauf.t / 0.18));
        if (lauf.t > szene.soll * 0.18 + 0.8) {
          if (tb.firstChild === leer) tb.removeChild(leer);
          nr++;
          var zl = GROESSEN;
          tb.appendChild(el('tr', {}, [el('td', { text: String(nr) }), el('td', { text: zl[0].werte[szene.m] }), el('td', { text: zl[1].werte[szene.k] }), el('td', { text: zl[2].werte[szene.s] }), el('td', { text: String(szene.soll) }),
            el('td', { text: lauf.fair ? '✓ fair' : '✗ unfair' })]));
          lauf.idx++;
          if (lauf.idx >= lauf.liste.length) {
            lauf = null; knoepfe.start.disabled = false;
          } else beginneVariante();
        }
      }
      zeichne();
    });
    var zeile = el('div', { 'class': 'knopfzeile' }, [knoepfe.start, leeren, G.pauseKnopf(h)]);
    host.appendChild(karten); host.appendChild(hinweis); host.appendChild(zeile); host.appendChild(tab);
    aktualisiere();

    function zeichne() {
      var ctx = cv.ctx; ctx.clearRect(0, 0, W, H);
      var mw = [130, 200, 270][szene.m], mh = [30, 44, 58][szene.m], mx = (W - mw) / 2, my = 30;
      G.magnet(ctx, mx, my, mw, mh, { nZuerst: true, gr: Math.min(28, mh * 0.6) });
      var hx = szene.s === 0 ? mx + 22 : mx + mw / 2;
      var kx = hx;
      for (var k = 0; k < szene.gezeigt; k++) G.klammer(ctx, kx, my + mh + 12 + k * (szene.k === 1 ? 17 : 21), Math.PI / 2, szene.k === 1 ? 1.35 : 1.0);
      if (szene.k === 1) {        // schwere Klammern: dickere Linie sichtbar durch Größe
      }
      G.text(ctx, 'Magnet: ' + GROESSEN[0].werte[szene.m] + ' · Klammern: ' + GROESSEN[1].werte[szene.k] + ' · Stelle: ' + GROESSEN[2].werte[szene.s], W / 2, H - 14, { groesse: 15 });
      if (lauf) G.text(ctx, 'Gezählt: ' + szene.gezeigt, W - 90, 24, { groesse: 20, fett: true });
    }
    window.__m1 = {
      verändern: function (idx, v) { GROESSEN[idx].vary = v; kartenEl[idx].karte.querySelector('input').checked = v; aktualisiere(); },
      fest: function (idx, w) { GROESSEN[idx].fest = w; aktualisiere(); }, start: startVersuch, frei: function () { return !lauf; },
      zeilen: function () { return tb.querySelectorAll('tr').length; }, tempo: function (v) { speed = v; }, hinweis: function () { return hinweis.textContent; }
    };
  };
})();
