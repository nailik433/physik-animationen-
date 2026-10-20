/* Modul 7: Magnetfeld erkunden (Pol-Modell, siehe G.B) */
(function () {
  'use strict';
  var G = window.G, el = G.el;
  window.ANIM = window.ANIM || {};

  window.ANIM[7] = function (host) {
    var W = 720, H = 400, HL = 95, MH = 48, D = 0.38 * HL, CY = 200;
    var GRENZ = { x0: 6, y0: 6, x1: W - 6, y1: H - 6 };
    var cv = G.canvas(host, W, H, { drag: true, label: 'Stabmagnet mit ziehbarem Kompass. Feilspäne, Feldlinien und Kompassspur lassen sich einschalten.' });
    var modus = 'eins';
    var szene = null;
    var an = { feil: false, linien: false, spur: false };
    var komp = { x: 360, y: 105, ang: -Math.PI / 2, ziel: -Math.PI / 2 };
    var spur = [];
    var status = el('p', { 'class': 'animstatus', 'aria-live': 'polite' });

    function bau(m) {
      var poles, rects, labels = [];
      if (m === 'eins') {
        var cx = 360;
        rects = [{ x: cx - HL, y: CY - MH / 2, w: 2 * HL, h: MH, nz: true }];
        poles = [{ x: cx - D, y: CY, q: 1 }, { x: cx + D, y: CY, q: -1 }];
      } else {
        var c1 = 215, c2 = 505;
        rects = [{ x: c1 - HL, y: CY - MH / 2, w: 2 * HL, h: MH, nz: false }, { x: c2 - HL, y: CY - MH / 2, w: 2 * HL, h: MH, nz: m === 'ab' }];
        // links: S | N. rechts (anziehend): S | N, rechts (abstoßend): N | S
        poles = [{ x: c1 - D, y: CY, q: -1 }, { x: c1 + D, y: CY, q: 1 }];
        if (m === 'an') poles.push({ x: c2 - D, y: CY, q: -1 }, { x: c2 + D, y: CY, q: 1 });
        else poles.push({ x: c2 - D, y: CY, q: 1 }, { x: c2 + D, y: CY, q: -1 });
      }
      var bezug = 1 / Math.pow(HL * 0.62, 2);
      var s = { poles: poles, rects: rects };
      s.linien = G.linien(poles, rects, GRENZ, { n: m === 'eins' ? 16 : 14, h: 2.5, rs: 12 });
      s.feil = G.feilspaene(poles, rects, GRENZ, 250, 11, bezug);
      return s;
    }
    szene = bau('eins');

    function richtungswort(ang) {
      var a = Math.round(((ang % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) / (Math.PI / 4)) % 8;
      return ['rechts', 'rechts unten', 'unten', 'links unten', 'links', 'links oben', 'oben', 'rechts oben'][a];
    }
    function meldeStatus() {
      status.textContent = 'Die Nordspitze zeigt nach ' + richtungswort(komp.ziel) + '.';
    }
    function setzeKompass(p) {
      komp.x = Math.max(24, Math.min(W - 24, p.x)); komp.y = Math.max(24, Math.min(H - 24, p.y));
      komp.ziel = G.Bwinkel(szene.poles, komp.x, komp.y);
      if (G.reduced) komp.ang = komp.ziel;
    }
    setzeKompass(komp);
    komp.ang = komp.ziel;

    G.ziehen(cv, function (p) { setzeKompass(p); return true; }, function (p) { setzeKompass(p); }, function () { meldeStatus(); });

    /* Bedienelemente */
    var seg = el('div', { 'class': 'segment', role: 'group', 'aria-label': 'Anzahl der Magnete' });
    var segDefs = [['eins', 'Ein Magnet'], ['an', 'Zwei Magnete, ziehen sich an'], ['ab', 'Zwei Magnete, stoßen sich ab (Zusatz)']];
    var segBtns = segDefs.map(function (d) {
      var b = G.knopf(d[1], function () { waehle(d[0]); }, 'segknopf');
      b.setAttribute('aria-pressed', d[0] === 'eins' ? 'true' : 'false');
      seg.appendChild(b); return b;
    });
    function waehle(m) {
      modus = m; szene = bau(m);
      segBtns.forEach(function (b, i) { b.setAttribute('aria-pressed', segDefs[i][0] === m ? 'true' : 'false'); });
      spur = []; setzeKompass(komp); meldeStatus();
    }
    var schalter = el('div', { 'class': 'schalterzeile', role: 'group', 'aria-label': 'Anzeigen' });
    function schalt(text, key) {
      var b = G.knopf(text, function () {
        an[key] = !an[key]; b.setAttribute('aria-pressed', an[key] ? 'true' : 'false');
        spurKnoepfe.hidden = !an.spur;
      }, 'schalter');
      b.setAttribute('aria-pressed', 'false'); schalter.appendChild(b); return b;
    }
    schalt('Eisenfeilspäne', 'feil'); schalt('Feldlinien', 'linien'); schalt('Kompassspur', 'spur');
    var spurKnoepfe = el('div', { 'class': 'knopfzeile', hidden: '' }, [
      G.knopf('Kompass hier setzen', function () { if (spur.length < 16) spur.push({ x: komp.x, y: komp.y, ang: komp.ziel }); }, 'zweit'),
      G.knopf('Spur löschen', function () { spur = []; }, 'zweit')
    ]);
    spurKnoepfe.hidden = true;
    var pauseZeile = el('div', { 'class': 'knopfzeile' });
    host.appendChild(seg); host.appendChild(schalter); host.appendChild(spurKnoepfe); host.appendChild(pauseZeile); host.appendChild(status);
    meldeStatus();

    var hh = G.laufen(function (dt) {
      var diff = komp.ziel - komp.ang;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      komp.ang += diff * Math.min(1, dt * 14);
      zeichne();
    });
    pauseZeile.appendChild(G.pauseKnopf(hh));

    function zeichne() {
      var ctx = cv.ctx; ctx.clearRect(0, 0, W, H);
      if (an.feil) G.zeichneFeilspaene(ctx, szene.feil, 7);
      if (an.linien) G.zeichneLinien(ctx, szene.linien, G.M, 2.2);
      szene.rects.forEach(function (r) { G.magnet(ctx, r.x, r.y, r.w, r.h, { nZuerst: r.nz !== false }); });
      if (modus === 'ab') G.text(ctx, 'Zusatz', W - 50, 24, { groesse: 18, fett: true });
      if (an.spur) spur.forEach(function (s) { G.kompass(ctx, s.x, s.y, 17, s.ang, { buchstaben: false }); });
      G.kompass(ctx, komp.x, komp.y, 26, komp.ang, { rand: '#E67E00' });
    }
    window.__m7 = {
      poles: function () { return szene.poles; }, linien: function () { return szene.linien; },
      rects: function () { return szene.rects; }, setze: function (x, y) { setzeKompass({ x: x, y: y }); komp.ang = komp.ziel; },
      winkel: function () { return komp.ang; }, modus: waehle, an: an, spur: function () { return spur; }
    };
  };
})();
