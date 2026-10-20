/* Modul 3: Zwei Magnete (Polregel) */
(function () {
  'use strict';
  var G = window.G, el = G.el;
  window.ANIM = window.ANIM || {};

  /* ----- Bild 1: Magnete übereinander ----- */
  function stapel(panel, gruppe) {
    var W = 560, H = 360, LX = 150, LW = 260, LH = 80, LY = 230;     // fester Magnet unten
    var KONTAKT = LY - LH, SCHWEBE = 36;                              // y (Oberkante) des oberen Magneten: aufliegend / abgestoßen
    var cv = G.canvas(panel, W, H, { label: 'Zwei Magnete übereinander. Der obere Magnet lässt sich umdrehen.' });
    var status = el('p', { 'class': 'animstatus', 'aria-live': 'polite' });
    var zeile = el('div', { 'class': 'knopfzeile' });
    var unten = 'S';                // Pol des oberen Magneten, der nach unten zeigt (zum Nordpol des festen Magneten)
    var y = KONTAKT, vy = 0, ziel = KONTAKT, flipT = 1, flipHalb = true;
    function text() {
      if (unten === 'S') return 'Unten am oberen Magneten ist ein Südpol, darunter liegt ein Nordpol. Ungleichnamige Pole: Die Magnete ziehen sich an.';
      return 'Unten am oberen Magneten ist ein Nordpol, darunter liegt ein Nordpol. Gleichnamige Pole: Die Magnete stoßen sich ab.';
    }
    status.textContent = text();
    function umdrehen() {
      if (flipT < 1) return;
      flipT = 0; flipHalb = false;
      if (G.reduced) { flipT = 1; wechsel(); }
    }
    function wechsel() {
      unten = unten === 'S' ? 'N' : 'S'; flipHalb = true;
      if (unten === 'S') { ziel = KONTAKT; vy = 0; }
      else { ziel = SCHWEBE; vy = -900; }
      status.textContent = text();
    }
    zeile.appendChild(G.knopf('Magnet umdrehen', umdrehen, 'haupt'));
    var h = G.laufen(function (dt) {
      if (flipT < 1) {
        flipT = Math.min(1, flipT + dt / 0.45);
        if (!flipHalb && flipT >= 0.5) wechsel();
      }
      // einfache Feder-Bewegung zum Ziel
      var k = unten === 'S' ? 260 : 120, c = unten === 'S' ? 20 : 11;
      vy += (k * (ziel - y) - c * vy) * dt; y += vy * dt;
      if (y > KONTAKT) { y = KONTAKT; vy = -vy * 0.2; }
      if (y < 4) { y = 4; vy = Math.abs(vy) * 0.3; }
      zeichne();
    }, gruppe);
    zeile.appendChild(G.pauseKnopf(h));
    panel.appendChild(zeile); panel.appendChild(status);
    function zeichne() {
      var ctx = cv.ctx; ctx.clearRect(0, 0, W, H);
      G.text(ctx, 'fester Magnet (unten)', LX + LW / 2, LY + LH + 26, { groesse: 16 });
      G.magnet(ctx, LX, LY, LW, LH, { senkrecht: true, nZuerst: true });
      // oberer Magnet, beim Umdrehen um die waagerechte Achse gekippt (erste Hälfte alter, zweite Hälfte neuer Zustand)
      var sk = Math.max(0.04, Math.abs(Math.cos(Math.PI * Math.min(1, flipT))));
      var oben = unten === 'S' ? 'N' : 'S';
      ctx.save();
      ctx.translate(0, y + LH / 2); ctx.scale(1, sk); ctx.translate(0, -(y + LH / 2));
      G.magnet(ctx, LX, y, LW, LH, { senkrecht: true, nZuerst: oben === 'N' });
      ctx.restore();
      G.text(ctx, 'oberer Magnet (beweglich)', LX + LW / 2, Math.max(14, y - 14), { groesse: 16 });
      // Kraftpfeile
      if (flipT >= 1 && Math.abs(y - ziel) < 3) {
        var mx = LX + LW + 75, ym = (y + LH + LY) / 2;
        if (unten === 'S') { G.pfeil(ctx, mx, ym - 22, mx, ym - 4, G.M, 4, 12); G.pfeil(ctx, mx, ym + 22, mx, ym + 4, G.M, 4, 12); G.text(ctx, 'ziehen sich an', mx, ym + 44, { groesse: 15, fett: true, ausr: 'center' }); }
        else { var yy = (y + LH + LY) / 2; G.pfeil(ctx, mx, yy - 4, mx, yy - 26, G.M, 4, 12); G.pfeil(ctx, mx, yy + 4, mx, yy + 26, G.M, 4, 12); G.text(ctx, 'stoßen sich ab', mx, yy + 48, { groesse: 15, fett: true }); }
      }
    }
    window.__m3 = { unten: function () { return unten; }, umdrehen: umdrehen, y: function () { return y; }, ziel: function () { return ziel; } };
  }

  /* ----- Bild 2: Magnete nebeneinander mit Abstand ----- */
  function nebeneinander(panel, gruppe) {
    var W = 640, H = 260, MW = 170, MH = 60, MY = 100;
    var cv = G.canvas(panel, W, H, { label: 'Zwei Magnete nebeneinander. Mit dem Schieber stellst du den Abstand ein.' });
    var status = el('p', { 'class': 'animstatus', 'aria-live': 'polite' });
    var abstand = 90, linksPol = 'N';      // Pol an der linken Seite des rechten Magneten
    var regler = el('input', { type: 'range', min: '10', max: '210', step: '10', value: String(abstand), id: 'm3abst', 'aria-label': 'Abstand der Magnete' });
    var anz = el('output', { 'for': 'm3abst', text: abstand + ' Einheiten' });
    regler.addEventListener('input', function () { abstand = parseInt(regler.value, 10); anz.textContent = abstand + ' Einheiten'; });
    var ra = el('div', { 'class': 'regler' }, [el('label', { 'for': 'm3abst', text: 'Abstand' }), regler, anz]);
    function text() {
      var linksPolDesc = linksPol === 'N' ? 'Südpol des linken Magneten steht dem Nordpol des rechten gegenüber. Ungleichnamige Pole: Die Magnete ziehen sich an.' : 'Südpol des linken Magneten steht dem Südpol des rechten gegenüber. Gleichnamige Pole: Die Magnete stoßen sich ab.';
      return 'Der ' + linksPolDesc;
    }
    status.textContent = text();
    var zeile = el('div', { 'class': 'knopfzeile' });
    zeile.appendChild(G.knopf('Magnet umdrehen', function () { linksPol = linksPol === 'N' ? 'S' : 'N'; status.textContent = text(); }, 'haupt'));
    var h = G.laufen(function () { zeichne(); }, gruppe);
    zeile.appendChild(G.pauseKnopf(h));
    panel.appendChild(ra); panel.appendChild(zeile); panel.appendChild(status);
    function zeichne() {
      var ctx = cv.ctx; ctx.clearRect(0, 0, W, H);
      var lx = 30, rx = lx + MW + abstand;
      G.magnet(ctx, lx, MY, MW, MH, { nZuerst: true });
      G.magnet(ctx, rx, MY, MW, MH, { nZuerst: linksPol === 'N' });
      G.text(ctx, 'fest', lx + MW / 2, MY - 22, { groesse: 15 });
      G.text(ctx, 'beweglich', rx + MW / 2, MY - 22, { groesse: 15 });
      var anziehen = linksPol === 'N';
      var staerke = 1 / (1 + Math.pow(abstand / 70, 2));
      var len = 12 + 52 * staerke, ym = MY + MH + 38, mid = lx + MW + abstand / 2;
      if (anziehen) {
        G.pfeil(ctx, mid - 22 - len, ym, mid - 22, ym, G.M, 5, 13); G.pfeil(ctx, mid + 22 + len, ym, mid + 22, ym, G.M, 5, 13);
      } else {
        G.pfeil(ctx, mid - 22, ym, mid - 22 - len, ym, G.M, 5, 13); G.pfeil(ctx, mid + 22, ym, mid + 22 + len, ym, G.M, 5, 13);
      }
      G.text(ctx, anziehen ? 'ziehen sich an' : 'stoßen sich ab', mid, ym + 36, { groesse: 20, fett: true });
      G.text(ctx, abstand <= 30 ? 'Je kleiner der Abstand, desto stärker die Kraft.' : 'Die Pfeile zeigen die Richtung der Kraft. Je größer der Abstand, desto schwächer ist sie.', W / 2, H - 14, { groesse: 14 });
    }
    window.__m3b = { linksPol: function () { return linksPol; } };
  }

  window.ANIM[3] = function (host) {
    G.reiter(host, [
      { titel: 'Übereinander', bau: stapel },
      { titel: 'Nebeneinander', bau: nebeneinander }
    ]);
  };
})();
