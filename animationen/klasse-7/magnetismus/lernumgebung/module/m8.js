/* Modul 8: Elektromagnet (Oersted-Versuch und Spule) – nur qualitativ */
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

  /* ----- Reiter 1: Oersted ----- */
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

  /* ----- Reiter 2: Spule ----- */
  function spule(panel, gruppe) {
    var W = 720, H = 460, CX = 360, CY = 150, HL = 100, MH = 54;
    var cv = G.canvas(panel, W, H, { label: 'Eine Spule mit Batterie und Schalter. Unter der Spule hängen Büroklammern.' });
    var wind = 3, kern = false, an = false, tauscht = false, bar = 0, klam = 0, speed = 1, cache = {};
    var statusEl = el('p', { 'class': 'animstatus', 'aria-live': 'polite' });
    var regler = el('input', { type: 'range', min: '1', max: '6', step: '1', value: '3', id: 'm8w', 'aria-label': 'Windungen' });
    var anz = el('output', { 'for': 'm8w', text: '300 Windungen' });
    regler.addEventListener('input', function () { wind = parseInt(regler.value, 10); anz.textContent = wind * 100 + ' Windungen'; meldung(); });
    var bKern = G.knopf('Eisenkern: nein', function () { kern = !kern; bKern.textContent = 'Eisenkern: ' + (kern ? 'ja' : 'nein'); bKern.setAttribute('aria-pressed', kern ? 'true' : 'false'); meldung(); }, 'schalter');
    bKern.setAttribute('aria-pressed', 'false');
    var bStrom = G.knopf('Strom: aus', function () { an = !an; bStrom.textContent = 'Strom: ' + (an ? 'an' : 'aus'); bStrom.setAttribute('aria-pressed', an ? 'true' : 'false'); meldung(); }, 'schalter');
    bStrom.setAttribute('aria-pressed', 'false');
    var bTausch = G.knopf('Anschlüsse vertauschen', function () { tauscht = !tauscht; meldung(); }, 'schalter');
    function sollKlammern() { if (!an) return 0; return kern ? Math.round(wind * 100 / 40) : Math.floor(wind * 100 / 200); }
    function sollStaerke() { if (!an) return 0; return (wind / 6) * (kern ? 1 : 0.18); }
    function meldung() {
      if (!an) statusEl.textContent = 'Der Strom ist aus. Es gibt kein Magnetfeld und keine Klammer bleibt hängen.';
      else statusEl.textContent = 'Strom an: ' + (kern ? 'Spule mit Eisenkern (Elektromagnet)' : 'Spule ohne Eisenkern') + ', ' + wind * 100 + ' Windungen. Links ist der ' + (tauscht ? 'Südpol, rechts der Nordpol.' : 'Nordpol, rechts der Südpol.');
    }
    meldung();
    function szene() {
      var key = (kern ? 'k' : 'o') + (tauscht ? 't' : 'n');
      if (cache[key]) return cache[key];
      var ext = kern ? 28 : 0, rect = { x: CX - HL - ext, y: CY - MH / 2, w: 2 * (HL + ext), h: MH };
      var d = 0.38 * (HL + ext), q = tauscht ? -1 : 1;
      var poles = [{ x: CX - d, y: CY, q: q }, { x: CX + d, y: CY, q: -q }];
      var s = { rect: rect, poles: poles, linien: G.linien(poles, [rect], { x0: 6, y0: 6, x1: W - 6, y1: H - 6 }, { n: kern ? 18 : 12, h: 2.5, rs: 12 }) };
      cache[key] = s; return s;
    }
    var h = G.laufen(function (dt) {
      dt *= speed;
      bar += (sollStaerke() - bar) * Math.min(1, dt * 4);
      var z = sollKlammern(); klam += Math.sign(z - klam) * Math.min(Math.abs(z - klam), dt * 12);
      zeichne();
    }, gruppe);
    var regl = el('div', { 'class': 'regler' }, [el('label', { 'for': 'm8w', text: 'Windungen' }), regler, anz]);
    panel.appendChild(regl);
    panel.appendChild(el('div', { 'class': 'schalterzeile' }, [bKern, bStrom, bTausch]));
    panel.appendChild(el('div', { 'class': 'knopfzeile' }, [G.pauseKnopf(h)]));
    panel.appendChild(statusEl);
    panel.appendChild(el('p', { 'class': 'hilfetext', text: 'Das ist ein Modell. Die Anzahl der Klammern ist nur zum Vergleichen gedacht.' }));

    function zeichne() {
      var ctx = cv.ctx; ctx.clearRect(0, 0, W, H);
      var s = szene();
      if (an) G.zeichneLinien(ctx, s.linien, G.M, 2.2);
      // Anschlussleitungen und Batterie
      var LY = 320, links = CX - HL, rechts = CX + HL;
      ctx.save(); ctx.strokeStyle = '#B45309'; ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(links, CY); ctx.lineTo(links, LY); ctx.lineTo(CX - 60, LY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(CX + 60, LY); ctx.lineTo(CX + 110, LY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(CX + 164, LY); ctx.lineTo(rechts, LY); ctx.lineTo(rechts, CY); ctx.stroke();
      ctx.restore();
      ctx.fillStyle = '#fff'; ctx.fillRect(CX - 48, LY - 30, 96, 60);
      batterie(ctx, CX, LY, true, !tauscht, 60);
      schalterSymbol(ctx, CX + 137, LY, an);
      G.text(ctx, 'Batterie', CX, LY + 50, { groesse: 15 , halo: true }); G.text(ctx, 'Schalter', CX + 137, LY + 34, { groesse: 15 , halo: true });
      // Eisenkern
      if (kern) {
        ctx.fillStyle = '#B8BEC8'; ctx.strokeStyle = '#333'; ctx.lineWidth = 3;
        ctx.fillRect(CX - HL - 28, CY - 9, 2 * (HL + 28), 18); ctx.strokeRect(CX - HL - 28, CY - 9, 2 * (HL + 28), 18);
      }
      // Spule: Halbkreisbögen (2 bis 7, bei 300 Windungen vier)
      var n = wind + 1, bw = 2 * HL / n;
      ctx.strokeStyle = '#B45309'; ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(links, CY);
      for (var k = 0; k < n; k++) { ctx.arc(links + bw * (k + 0.5), CY, bw / 2, PI, 0, false); }
      ctx.stroke();
      G.text(ctx, 'Spule', CX, CY - 52, { groesse: 15 , halo: true });
      // Pole an den Enden
      var ext = kern ? 28 : 0;
      var pl = tauscht ? ['S', G.S] : ['N', G.N], pr = tauscht ? ['N', G.N] : ['S', G.S];
      [[CX - HL - ext - 24, pl], [CX + HL + ext + 24, pr]].forEach(function (b) {
        ctx.fillStyle = an ? b[1][1] : '#E5E7EB'; ctx.strokeStyle = '#111'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(b[0], CY - 28, 17, 0, 6.2832); ctx.fill(); ctx.stroke();
        if (an) G.buchstabe(ctx, b[1][0], b[0], CY - 28, 20); else G.text(ctx, '–', b[0], CY - 28, { groesse: 20, fett: true, farbe: '#555' });
      });
      // Büroklammern: links und rechts am Ende, bis zu 8 pro Seite
      var nK = Math.round(klam), li = Math.ceil(nK / 2), re = Math.floor(nK / 2), kk;
      for (kk = 0; kk < li; kk++) G.klammer(ctx, CX - HL - ext - 6, CY + 36 + kk * 18, PI / 2, 1.1);
      for (kk = 0; kk < re; kk++) G.klammer(ctx, CX + HL + ext + 6, CY + 36 + kk * 18, PI / 2, 1.1);
      G.text(ctx, 'Büroklammern: ' + nK, 20, 30, { groesse: 17, fett: true, ausr: 'left', halo: true });
      // Balken Stärke
      var bx = 60, by = H - 36, bwid = 330;
      G.text(ctx, 'Stärke des Magneten', bx, by - 20, { groesse: 15, fett: true, ausr: 'left', halo: true });
      ctx.fillStyle = '#E5E9F2'; ctx.fillRect(bx, by - 8, bwid, 20);
      ctx.fillStyle = G.M; ctx.fillRect(bx, by - 8, bwid * Math.min(1, bar), 20);
      ctx.strokeStyle = '#111'; ctx.lineWidth = 2; ctx.strokeRect(bx, by - 8, bwid, 20);
    }
    window.__m8b = {
      windungen: function (v) { regler.value = String(v); regler.dispatchEvent(new Event('input')); }, kern: function (v) { if (kern !== v) bKern.click(); },
      strom: function (v) { if (an !== v) bStrom.click(); }, tausch: function () { bTausch.click(); },
      klammern: sollKlammern, staerke: sollStaerke, poleLinks: function () { return tauscht ? 'S' : 'N'; }, balken: function () { return bar; }, tempo: function (v) { speed = v; },
      linienZahl: function () { return szene().linien.length; }
    };
  }

  window.ANIM[8] = function (host) {
    G.reiter(host, [
      { titel: 'Oersted: Strom und Kompass', bau: oersted },
      { titel: 'Spule und Eisenkern', bau: spule }
    ]);
  };
})();
