/* Modul 2: Magnet-Prüfstand */
(function () {
  'use strict';
  var G = window.G, el = G.el;
  window.ANIM = window.ANIM || {};

  window.ANIM[2] = function (host) {
    var W = 720, H = 430, PI = Math.PI;
    var cv = G.canvas(host, W, H, { label: 'Ein Magnet hängt über zehn Gegenständen. Tippe einen Gegenstand an, um ihn zu testen.' });
    var ITEMS = [
      { n: 'Büroklammer', stoff: 'Stahl', mag: true, zeichne: function (c, x, y) { G.klammer(c, x, y, -0.3, 2.1); } },
      { n: 'Stahlfeder', stoff: 'Stahl', mag: true, zeichne: function (c, x, y) {
        c.strokeStyle = '#6B7280'; c.lineWidth = 3; c.beginPath(); c.moveTo(x - 26, y);
        for (var k = 0; k < 6; k++) { c.lineTo(x - 26 + k * 9 + 4.5, y - 11); c.lineTo(x - 26 + k * 9 + 9, y + 11 - (k === 5 ? 11 : 0)); } c.stroke(); } },
      { n: 'Reißzwecke', stoff: 'Stahl', mag: true, zeichne: function (c, x, y) {
        c.fillStyle = '#9CA3AF'; c.strokeStyle = '#333'; c.lineWidth = 2; c.beginPath(); c.ellipse(x, y - 6, 15, 5, 0, 0, 6.2832); c.fill(); c.stroke();
        c.beginPath(); c.moveTo(x - 6, y - 4); c.lineTo(x, y + 18); c.lineTo(x + 6, y - 4); c.closePath(); c.fill(); c.stroke(); } },
      { n: 'Eisenkette', stoff: 'Eisen', mag: true, zeichne: function (c, x, y) {
        c.strokeStyle = '#4B5563'; c.lineWidth = 4;
        for (var k = 0; k < 3; k++) { c.beginPath(); c.ellipse(x - 20 + k * 20, y, 12, 7, 0, 0, 6.2832); c.stroke(); } } },
      { n: 'Gummiband', stoff: 'Gummi', mag: false, zeichne: function (c, x, y) {
        c.strokeStyle = '#C8793A'; c.lineWidth = 5; c.beginPath(); c.ellipse(x, y, 26, 13, 0, 0, 6.2832); c.stroke(); } },
      { n: 'Bleistift', stoff: 'Holz und Graphit', mag: false, zeichne: function (c, x, y) {
        c.fillStyle = '#F2C94C'; c.strokeStyle = '#333'; c.lineWidth = 2; c.fillRect(x - 32, y - 6, 52, 12); c.strokeRect(x - 32, y - 6, 52, 12);
        c.fillStyle = '#F3D9B1'; c.beginPath(); c.moveTo(x + 20, y - 6); c.lineTo(x + 34, y); c.lineTo(x + 20, y + 6); c.closePath(); c.fill(); c.stroke(); } },
      { n: 'Radiergummi', stoff: 'Gummi', mag: false, zeichne: function (c, x, y) {
        c.fillStyle = '#F4A6B5'; c.strokeStyle = '#333'; c.lineWidth = 2; c.fillRect(x - 24, y - 11, 48, 22); c.strokeRect(x - 24, y - 11, 48, 22); } },
      { n: 'Aluminiumlöffel', stoff: 'Aluminium', mag: false, zeichne: function (c, x, y) {
        c.fillStyle = '#D1D5DB'; c.strokeStyle = '#555'; c.lineWidth = 2; c.beginPath(); c.ellipse(x - 16, y, 13, 9, 0, 0, 6.2832); c.fill(); c.stroke();
        c.fillRect(x - 4, y - 3, 30, 6); c.strokeRect(x - 4, y - 3, 30, 6); } },
      { n: 'Kupferrohr', stoff: 'Kupfer', mag: false, zeichne: function (c, x, y) {
        c.fillStyle = '#C97A4A'; c.strokeStyle = '#333'; c.lineWidth = 2; c.fillRect(x - 28, y - 10, 56, 20); c.strokeRect(x - 28, y - 10, 56, 20);
        c.fillStyle = '#E8B48F'; c.beginPath(); c.ellipse(x + 28, y, 6, 10, 0, 0, 6.2832); c.fill(); c.stroke(); } },
      { n: 'Holzklotz', stoff: 'Holz', mag: false, zeichne: function (c, x, y) {
        c.fillStyle = '#B98A55'; c.strokeStyle = '#333'; c.lineWidth = 2; c.fillRect(x - 24, y - 16, 48, 32); c.strokeRect(x - 24, y - 16, 48, 32); } }
    ];
    var POS = [];
    ITEMS.forEach(function (it, i) { it.x = 90 + (i % 5) * 135; it.y = i < 5 ? 235 : 345; it.dy = 0; it.ergebnis = null; it.haftet = false; POS.push(i); });
    var ruhe = { x: 360, y: 44 }, mag = { x: ruhe.x, y: ruhe.y }, akt = null, speed = 1;
    var statusEl = el('p', { 'class': 'animstatus', 'aria-live': 'polite', text: 'Tippe einen Gegenstand an. Der Magnet fährt hin.' });
    var tab = el('table', { 'class': 'tabelle' });
    var tbody = el('tbody');
    tab.appendChild(el('thead', {}, [el('tr', {}, [el('th', { text: 'Gegenstand' }), el('th', { text: 'besteht aus' }), el('th', { text: 'Ergebnis' })])]));
    tab.appendChild(tbody);
    var gitter = el('div', { 'class': 'gegenstaende', role: 'group', 'aria-label': 'Gegenstände testen' });
    var knoepfe = ITEMS.map(function (it, i) {
      var b = G.knopf(it.n, function () { teste(i); }, 'zweit');
      gitter.appendChild(b); return b;
    });
    function tabelle() {
      tbody.innerHTML = '';
      ITEMS.forEach(function (it) {
        tbody.appendChild(el('tr', {}, [el('td', { text: it.n }), el('td', { text: it.ergebnis == null ? '–' : it.stoff }),
          el('td', { text: it.ergebnis == null ? 'noch nicht getestet' : it.ergebnis ? '✓ wird angezogen' : '✗ wird nicht angezogen' })]));
      });
    }
    tabelle();
    function teste(i) {
      if (akt) return;
      var it = ITEMS[i];
      ITEMS.forEach(function (o) { if (o.haftet) { o.haftet = false; o.fall = true; } });
      akt = { i: i, t: 0, phase: 0 };
      statusEl.textContent = it.n + ' wird getestet …';
      knoepfe.forEach(function (b) { b.disabled = true; });
    }
    G.canvas && cv.c.addEventListener('pointerdown', function (e) {
      var p = cv.pos(e), best = -1, bd = 60;
      ITEMS.forEach(function (it, i) { var d = Math.hypot(p.x - it.x, p.y - it.y); if (d < bd) { bd = d; best = i; } });
      if (best >= 0) teste(best);
    });
    function ende() {
      var it = ITEMS[akt.i];
      it.ergebnis = it.mag; tabelle();
      statusEl.textContent = it.n + ': ' + (it.mag ? 'Der Magnet zieht den Gegenstand an.' : 'Der Gegenstand bleibt liegen. Der Magnet zieht ihn nicht an.');
      akt = null; knoepfe.forEach(function (b, k) { b.disabled = false; });
    }
    var h = G.laufen(function (dt) {
      dt *= speed * (G.reduced ? 2 : 1);
      var it;
      ITEMS.forEach(function (o) { if (o.fall) { o.dy += 0; } });
      if (akt) {
        it = ITEMS[akt.i]; akt.t += dt;
        var zx = it.x, zy = it.y - 95;
        if (akt.phase === 0) {            // hinfahren
          var s = Math.min(1, akt.t / 0.8), e = s * s * (3 - 2 * s);
          if (!akt.start) akt.start = { x: mag.x, y: mag.y };
          mag.x = akt.start.x + (zx - akt.start.x) * e; mag.y = akt.start.y + (zy - akt.start.y) * e;
          if (s >= 1) { akt.phase = 1; akt.t = 0; }
        } else if (akt.phase === 1) {     // springen / liegen bleiben
          if (it.mag) { var q = Math.min(1, akt.t / 0.3); it.dy = -(it.y - (mag.y + 44)) * q * q; it.haftet = true; }
          if (akt.t > 1.1) { akt.phase = 2; akt.t = 0; }
        } else if (akt.phase === 2) {     // zurückfahren, Gegenstand fällt zurück
          var s2 = Math.min(1, akt.t / 0.7), e2 = s2 * s2 * (3 - 2 * s2);
          mag.x = zx + (ruhe.x - zx) * e2; mag.y = zy + (ruhe.y - zy) * e2;
          if (it.mag) it.dy = -(it.y - (mag.y + 44)) * (1 - e2 * 0) ;
          if (s2 >= 1) { if (it.mag) { it.haftet = false; it.fall = true; akt.phase = 3; akt.t = 0; } else ende(); }
        } else if (akt.phase === 3) {     // Gegenstand fällt auf den Tisch
          var s3 = Math.min(1, akt.t / 0.5); it.dy = -(it.y - (mag.y + 44)) * (1 - s3 * s3);
          if (s3 >= 1) { it.dy = 0; it.fall = false; ende(); }
        }
      }
      zeichne();
    });
    var pz = el('div', { 'class': 'knopfzeile' }, [G.pauseKnopf(h), G.knopf('Tabelle leeren', function () { if (akt) return; ITEMS.forEach(function (o) { o.ergebnis = null; }); tabelle(); statusEl.textContent = 'Die Tabelle ist leer. Tippe einen Gegenstand an.'; }, 'zweit')]);
    host.appendChild(gitter); host.appendChild(pz); host.appendChild(statusEl); host.appendChild(tab);

    function zeichne() {
      var ctx = cv.ctx; ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#E7DCC8'; ctx.fillRect(0, 150, W, H - 150);
      ctx.strokeStyle = '#8A7A5C'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 150); ctx.lineTo(W, 150); ctx.stroke();
      ITEMS.forEach(function (it, i) {
        var y = it.y + it.dy;
        it.zeichne(ctx, it.x, y);
        G.text(ctx, it.n, it.x, it.y + 38, { groesse: 15 });
        if (it.ergebnis != null) G.text(ctx, it.ergebnis ? '✓ angezogen' : '✗ bleibt liegen', it.x, it.y + 56, { groesse: 14, fett: true, farbe: it.ergebnis ? '#1B6B34' : '#9B1C1C' });
      });
      // Faden und Magnet
      ctx.strokeStyle = '#555'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mag.x, 0); ctx.lineTo(mag.x, mag.y - 4); ctx.stroke();
      G.magnet(ctx, mag.x - 80, mag.y - 4, 160, 44, { nZuerst: true });
    }
    window.__m2 = { teste: teste, tempo: function (v) { speed = v; }, ergebnisse: function () { return ITEMS.map(function (o) { return o.ergebnis; }); }, frei: function () { return !akt; } };
  };
})();
