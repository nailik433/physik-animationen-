/* Modul 6: Die Erde als Magnet */
(function () {
  'use strict';
  var G = window.G, el = G.el;
  window.ANIM = window.ANIM || {};

  window.ANIM[6] = function (host) {
    var W = 720, H = 440, CX = 360, CY = 225, R = 150, NEIGUNG = 15 * Math.PI / 180;
    var MHL = R * 0.64;                                       // halbe Länge des Magneten in der Erde
    var cv = G.canvas(host, W, H, { drag: true, label: 'Erdkugel mit Magnet im Inneren und ziehbarem Kompass' });
    var geo = true, mag = false, stark = null;                 // stark: {x, y, nz, k}
    var komp = { x: 110, y: 350, ang: 0, ziel: 0 };
    var status = el('p', { 'class': 'animstatus', 'aria-live': 'polite' });
    // Polpunkte des Erdmagneten (oben: magnetischer Südpol der Erde, unten: magnetischer Nordpol)
    var oben = { x: CX + MHL * Math.sin(NEIGUNG), y: CY - MHL * Math.cos(NEIGUNG) };
    var unten = { x: CX - MHL * Math.sin(NEIGUNG), y: CY + MHL * Math.cos(NEIGUNG) };
    var oberflOben = { x: CX + R * Math.sin(NEIGUNG), y: CY - R * Math.cos(NEIGUNG) };
    var oberflUnten = { x: CX - R * Math.sin(NEIGUNG), y: CY + R * Math.cos(NEIGUNG) };

    function erdwinkel(x, y) { return Math.atan2(oben.y - y, oben.x - x); }
    function berechne() {
      var ea = erdwinkel(komp.x, komp.y);
      if (!stark) { komp.ziel = ea; return { stark: 0 }; }
      var b = G.B(stark.poles, komp.x, komp.y);
      var vx = Math.cos(ea) * 0.25 + b[0] * stark.k, vy = Math.sin(ea) * 0.25 + b[1] * stark.k;
      komp.ziel = Math.atan2(vy, vx);
      return { stark: Math.hypot(b[0] * stark.k, b[1] * stark.k) };
    }
    function melde() {
      var r = berechne();
      if (stark && r.stark > 0.25) status.textContent = 'Der starke Magnet wirkt stärker als die Erde. Die Nordspitze zeigt zu seinem Südpol.';
      else if (stark) status.textContent = 'Hier ist der starke Magnet weit weg. Die Nordspitze zeigt wieder zum oberen Pol des Erdmagneten.';
      else status.textContent = 'Die Nordspitze zeigt zum oberen Pol des Erdmagneten. Dort liegt der magnetische Südpol der Erde, also nach Norden.';
    }
    function setze(p) {
      komp.x = Math.max(26, Math.min(W - 26, p.x)); komp.y = Math.max(26, Math.min(H - 26, p.y));
      berechne(); if (G.reduced) komp.ang = komp.ziel;
    }
    berechne(); komp.ang = komp.ziel; melde();
    G.ziehen(cv, function (p) { setze(p); return true; }, function (p) { setze(p); }, function () { melde(); });

    var schalter = el('div', { 'class': 'schalterzeile', role: 'group', 'aria-label': 'Anzeigen' });
    function schalt(text, start, fn) {
      var b = G.knopf(text, function () { var v = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', v ? 'true' : 'false'); fn(v); }, 'schalter');
      b.setAttribute('aria-pressed', start ? 'true' : 'false'); schalter.appendChild(b); return b;
    }
    schalt('Geografische Pole zeigen', true, function (v) { geo = v; });
    schalt('Magnetische Pole zeigen', false, function (v) { mag = v; });
    schalt('Starker Magnet in der Nähe', false, function (v) {
      if (!v) { stark = null; melde(); return; }
      // Magnet links oder rechts vom Kompass, mit dem Südpol zum Kompass
      var rechts = komp.x < W - 230, len = 64, mx = rechts ? komp.x + 130 : komp.x - 130, my = komp.y;
      my = Math.max(40, Math.min(H - 40, my));
      var d = 0.38 * len;
      var poles = rechts ? [{ x: mx - d, y: my, q: -1 }, { x: mx + d, y: my, q: 1 }] : [{ x: mx - d, y: my, q: 1 }, { x: mx + d, y: my, q: -1 }];
      var ref = Math.hypot(G.B(poles, komp.x, komp.y)[0], G.B(poles, komp.x, komp.y)[1]);
      stark = { x: mx, y: my, len: len, nz: !rechts, poles: poles, k: 0.9 / ref };
      melde();
    });
    var pz = el('div', { 'class': 'knopfzeile' });
    host.appendChild(schalter); host.appendChild(pz); host.appendChild(status);

    /* grobe Umrisse der Kontinente (selbst gezeichnet), Koordinaten relativ zum Erdmittelpunkt in Einheiten von R */
    var LAND = [
      [[-0.78, -0.42], [-0.62, -0.62], [-0.38, -0.66], [-0.22, -0.52], [-0.30, -0.30], [-0.42, -0.14], [-0.52, 0.0], [-0.64, -0.10], [-0.80, -0.22]],           // Nordamerika
      [[-0.45, 0.10], [-0.28, 0.06], [-0.16, 0.22], [-0.20, 0.50], [-0.30, 0.74], [-0.40, 0.58], [-0.46, 0.34]],                                           // Südamerika
      [[0.02, -0.52], [0.30, -0.64], [0.62, -0.60], [0.84, -0.40], [0.76, -0.16], [0.58, -0.04], [0.40, -0.10], [0.28, -0.24], [0.10, -0.26], [0.0, -0.36]], // Eurasien
      [[0.04, -0.12], [0.26, -0.08], [0.38, 0.12], [0.32, 0.46], [0.20, 0.62], [0.10, 0.44], [0.0, 0.18]],                                                  // Afrika
      [[0.56, 0.36], [0.74, 0.34], [0.80, 0.50], [0.64, 0.58]],                                                                                              // Australien
      [[-0.46, 0.88], [-0.15, 0.82], [0.2, 0.84], [0.5, 0.86], [0.3, 0.97], [-0.2, 0.97]]                                                                     // Antarktis
    ];

    var h = G.laufen(function (dt) {
      var diff = komp.ziel - komp.ang; diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      komp.ang += diff * Math.min(1, dt * 14);
      berechne(); zeichne();
    });
    pz.appendChild(G.pauseKnopf(h));

    function zeichne() {
      var ctx = cv.ctx; ctx.clearRect(0, 0, W, H);
      // Erdkugel
      ctx.save();
      ctx.beginPath(); ctx.arc(CX, CY, R, 0, 6.2832); ctx.fillStyle = '#CFE6FA'; ctx.fill();
      ctx.clip();
      ctx.fillStyle = '#BFE0B4'; ctx.strokeStyle = '#4E7D45'; ctx.lineWidth = 1.5;
      LAND.forEach(function (poly) {
        ctx.beginPath();
        poly.forEach(function (p, i) { var x = CX + p[0] * R, y = CY + p[1] * R; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
        ctx.closePath(); ctx.fill(); ctx.stroke();
      });
      // Breiten- und Längenlinien
      ctx.strokeStyle = 'rgba(31,56,100,.45)'; ctx.lineWidth = 1;
      [-0.66, -0.33, 0, 0.33, 0.66].forEach(function (f) {
        var yy = CY + f * R, hw = Math.sqrt(R * R - (f * R) * (f * R));
        ctx.beginPath(); ctx.moveTo(CX - hw, yy); ctx.lineTo(CX + hw, yy); ctx.stroke();
      });
      [-0.7, -0.35, 0, 0.35, 0.7].forEach(function (f) {
        ctx.beginPath(); ctx.ellipse(CX, CY, Math.abs(f) * R + 0.001, R, 0, 0, 6.2832); ctx.stroke();
      });
      ctx.restore();
      ctx.strokeStyle = '#111'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(CX, CY, R, 0, 6.2832); ctx.stroke();
      // Drehachse
      ctx.save(); ctx.setLineDash([8, 6]); ctx.strokeStyle = '#111'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(CX, CY - R - 28); ctx.lineTo(CX, CY + R + 28); ctx.stroke(); ctx.restore();
      // Magnet in der Erde (um 15° geneigt, oben Südpol grün, unten Nordpol rot)
      ctx.save(); ctx.translate(CX, CY); ctx.rotate(NEIGUNG);
      G.magnet(ctx, -22, -MHL, 44, 2 * MHL, { senkrecht: true, nZuerst: false, gr: 26 });
      ctx.restore();
      if (geo) {
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(CX, CY - R, 5, 0, 6.2832); ctx.arc(CX, CY + R, 5, 0, 6.2832); ctx.fill();
        G.text(ctx, 'geografischer Nordpol', CX, CY - R - 42, { groesse: 17, fett: true });
        G.text(ctx, 'geografischer Südpol', CX, CY + R + 42, { groesse: 17, fett: true });
        G.text(ctx, 'Drehachse', CX - 8, CY - R - 14, { groesse: 13, ausr: 'right' });
      }
      if (mag) {
        [[oberflOben, 'S', G.S, 'magnetischer Südpol', 1], [oberflUnten, 'N', G.N, 'magnetischer Nordpol', -1]].forEach(function (a) {
          var p = a[0];
          ctx.fillStyle = a[2]; ctx.strokeStyle = '#111'; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.arc(p.x, p.y, 13, 0, 6.2832); ctx.fill(); ctx.stroke();
          G.buchstabe(ctx, a[1], p.x, p.y, 15);
          var tx = p.x + a[4] * 110 * 1, ty = p.y + (a[4] === 1 ? -4 : 4);
          G.text(ctx, a[3], p.x + (a[4] === 1 ? 20 : -20), p.y + (a[4] === 1 ? -16 : 16), { groesse: 15, fett: true, ausr: a[4] === 1 ? 'left' : 'right', halo: true });
        });
      }
      if (stark) {
        G.magnet(ctx, stark.x - stark.len, stark.y - 17, 2 * stark.len, 34, { nZuerst: stark.nz });
        G.text(ctx, 'starker Magnet', stark.x, stark.y + 34, { groesse: 15, fett: true, halo: true });
      }
      G.kompass(ctx, komp.x, komp.y, 26, komp.ang, { rand: '#E67E00' });
      G.text(ctx, 'Kompass', komp.x, komp.y + 44, { groesse: 14 });
    }
    window.__m6 = {
      setze: function (x, y) { setze({ x: x, y: y }); komp.ang = komp.ziel; },
      winkel: function () { return komp.ang; }, obenPol: oben, starkAn: function () { return !!stark; }, stark: function () { return stark; }
    };
  };
})();
