/* Modul 8: Strom und Magnetfeld (Oersted-Versuch) – nur qualitativ */
(function () {
  'use strict';
  var G = window.G, el = G.el, PI = Math.PI;
  window.ANIM = window.ANIM || {};

  function batterie(ctx, x, y, waagerecht, plusAnfang, halb) {
    // Batteriesymbol: lange Platte = Pluspol, kurze dicke Platte = Minuspol; halb = Länge der Anschlussleitungen
    ctx.save(); ctx.strokeStyle = '#B45309'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath();
    if (waagerecht) { ctx.moveTo(x - halb, y); ctx.lineTo(x - 8, y); ctx.moveTo(x + 8, y); ctx.lineTo(x + halb, y); }
    else { ctx.moveTo(x, y - halb); ctx.lineTo(x, y - 8); ctx.moveTo(x, y + 8); ctx.lineTo(x, y + halb); }
    ctx.stroke();
    ctx.strokeStyle = '#111'; ctx.fillStyle = '#111'; ctx.lineWidth = 3;
    if (waagerecht) {
      var xp = plusAnfang ? x - 8 : x + 8, xm = plusAnfang ? x + 8 : x - 8;
      ctx.beginPath(); ctx.moveTo(xp, y - 22); ctx.lineTo(xp, y + 22); ctx.stroke();
      ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(xm, y - 12); ctx.lineTo(xm, y + 12); ctx.stroke();
      G.text(ctx, '+', xp + (plusAnfang ? -14 : 14), y - 30, { groesse: 22, fett: true });
      G.text(ctx, '−', xm + (plusAnfang ? 14 : -14), y - 30, { groesse: 22, fett: true });
    } else {
      var yp = plusAnfang ? y - 8 : y + 8, ym = plusAnfang ? y + 8 : y - 8;
      ctx.beginPath(); ctx.moveTo(x - 22, yp); ctx.lineTo(x + 22, yp); ctx.stroke();
      ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x - 12, ym); ctx.lineTo(x + 12, ym); ctx.stroke();
      G.text(ctx, '+', x + 40, yp, { groesse: 22, fett: true });
      G.text(ctx, '−', x + 40, ym, { groesse: 22, fett: true });
    }
    ctx.restore();
  }
  function schalterSymbol(ctx, x, y, zu) {
    ctx.save(); ctx.strokeStyle = '#111'; ctx.fillStyle = '#111'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x - 24, y, 4, 0, 6.2832); ctx.fill(); ctx.beginPath(); ctx.arc(x + 24, y, 4, 0, 6.2832); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - 24, y); if (zu) ctx.lineTo(x + 24, y); else ctx.lineTo(x + 18, y - 22); ctx.stroke();
    ctx.restore();
  }

  /* ----- Oersted-Versuch ----- */
  function oersted(panel, gruppe) {
    var W = 720, H = 400, DX = 250, OBEN = 40, UNTEN = 360, KY = 200, BX = 560;
    var cv = G.canvas(panel, W, H, { label: 'Draufsicht: Ein Draht liegt in Nord-Süd-Richtung über einer Kompassnadel. Eine Batterie und ein Schalter gehören zum Stromkreis.' });
    var an = false, plusUnten = true, ang = -PI / 2, speed = 1, off = 0;
    var statusEl = el('p', { 'class': 'animstatus', 'aria-live': 'polite' });
    function winkelZiel() { if (!an) return -PI / 2; return -PI / 2 + (plusUnten ? -1 : 1) * 70 * PI / 180; }
    function text() {
      if (!an) return 'Der Schalter ist offen. Es fließt kein Strom. Die Nordspitze der Nadel zeigt nach Norden, parallel zum Draht.';
      return 'Der Strom fließt im Draht über der Nadel nach ' + (plusUnten ? 'Norden' : 'Süden') + '. Die Nordspitze schlägt nach ' + (plusUnten ? 'Westen' : 'Osten') + ' aus.';
    }
    statusEl.textContent = text();
    var bSchalter = G.knopf('Schalter einschalten', function () { an = !an; bSchalter.textContent = an ? 'Schalter ausschalten' : 'Schalter einschalten'; bSchalter.setAttribute('aria-pressed', an ? 'true' : 'false'); statusEl.textContent = text(); }, 'haupt');
    bSchalter.setAttribute('aria-pressed', 'false');
    var bTausch = G.knopf('Anschlüsse vertauschen', function () { plusUnten = !plusUnten; statusEl.textContent = text(); }, 'haupt');
    var h = G.laufen(function (dt) {
      dt *= speed;
      off = (off + dt * 90) % 40;
      var ziel = winkelZiel();
      ang += (ziel - ang) * (G.reduced ? 1 : Math.min(1, dt * 5));
      zeichne();
    }, gruppe);
    panel.appendChild(el('div', { 'class': 'knopfzeile' }, [bSchalter, bTausch, G.pauseKnopf(h)]));
    panel.appendChild(statusEl);
    function zeichne() {
      var ctx = cv.ctx; ctx.clearRect(0, 0, W, H);
      G.text(ctx, 'Draufsicht', 20, 18, { groesse: 15, ausr: 'left' , halo: true });
      // Himmelsrichtungen
      G.text(ctx, 'Nord', DX, 20, { groesse: 18, fett: true });
      G.text(ctx, 'Süd', DX, H - 12, { groesse: 18, fett: true });
      G.text(ctx, 'West', 28, KY + 66, { groesse: 17, fett: true });
      G.text(ctx, 'Ost', DX + 150, KY + 66, { groesse: 17, fett: true });
      ctx.save(); ctx.strokeStyle = '#8A93A5'; ctx.lineWidth = 2; ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(20, KY + 66 - 24); ctx.lineTo(DX + 190, KY + 66 - 24); ctx.stroke(); ctx.restore();
      G.kompass(ctx, DX, KY, 62, ang, {});
      // Stromkreis: Draht senkrecht (Nord-Süd), unten Schalter, rechts Batterie
      ctx.save(); ctx.strokeStyle = '#B45309'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(DX, UNTEN); ctx.lineTo(DX, OBEN); ctx.lineTo(BX, OBEN); ctx.lineTo(BX, 130); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(BX, 270); ctx.lineTo(BX, UNTEN); ctx.lineTo(DX + 100, UNTEN); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(DX + 100, UNTEN); ctx.lineTo(DX + 130, UNTEN); ctx.stroke();
      ctx.restore();
      ctx.save(); ctx.strokeStyle = '#B45309'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(DX, UNTEN); ctx.lineTo(DX + 100, UNTEN); ctx.stroke();
      ctx.restore();
      schalterSymbol(ctx, DX + 150, UNTEN, an);
      ctx.save(); ctx.strokeStyle = '#B45309'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(DX + 174, UNTEN); ctx.lineTo(BX, UNTEN); ctx.stroke(); ctx.restore();
      // Batterie senkrecht: oben/unten Anschluss
      ctx.fillStyle = '#fff'; ctx.fillRect(BX - 40, 130, 80, 140);
      batterie(ctx, BX, 200, false, !plusUnten, 70);          // plusAnfang = Plus oben
      G.text(ctx, 'Batterie', BX + 52, 200 + 52, { groesse: 15, ausr: 'left' , halo: true });
      G.text(ctx, 'Schalter', DX + 150, UNTEN + 28, { groesse: 15 , halo: true });
      // Stromrichtung im Draht (nur bei Strom)
      if (an) {
        var dir = plusUnten ? -1 : 1;      // -1: nach oben (Norden)
        ctx.save(); ctx.fillStyle = '#1F3864';
        for (var yy = UNTEN - 20; yy > OBEN + 14; yy -= 40) {
          var y = yy + (dir < 0 ? -off : off);
          if (y < OBEN + 16 || y > UNTEN - 16) continue;
          ctx.beginPath();
          if (dir < 0) { ctx.moveTo(DX, y - 12); ctx.lineTo(DX - 11, y + 6); ctx.lineTo(DX + 11, y + 6); }
          else { ctx.moveTo(DX, y + 12); ctx.lineTo(DX - 11, y - 6); ctx.lineTo(DX + 11, y - 6); }
          ctx.closePath(); ctx.fill();
        }
        ctx.restore();
        G.text(ctx, 'Stromrichtung', DX + 24, 100, { groesse: 15, fett: true, ausr: 'left' , halo: true });
      }
    }
    window.__m8a = { an: function () { return an; }, schalter: function () { bSchalter.click(); }, tausch: function () { bTausch.click(); }, winkel: function () { return ang; }, ziel: winkelZiel, plusUnten: function () { return plusUnten; } };
  }

  window.ANIM[8] = function (host) {
    oersted(host, []);
  };
})();
