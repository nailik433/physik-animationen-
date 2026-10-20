/* Modul 5: Stärke und Abschirmung */
(function () {
  'use strict';
  var G = window.G, el = G.el;
  window.ANIM = window.ANIM || {};

  /* ----- Reiter 1: Wo ist der Magnet stark? ----- */
  function staerke(panel, gruppe) {
    var W = 720, H = 360, MX = 130, MW = 460, MY = 70, MH = 56;
    var STELLEN = [
      { n: 'links', x: MX + 0.07 * MW, k: 9 }, { n: 'links der Mitte', x: MX + 0.29 * MW, k: 5 }, { n: 'Mitte', x: MX + 0.5 * MW, k: 2 },
      { n: 'rechts der Mitte', x: MX + 0.71 * MW, k: 4 }, { n: 'rechts', x: MX + 0.93 * MW, k: 8 }
    ];
    var cv = G.canvas(panel, W, H, { label: 'Stabmagnet, an dessen Unterseite Büroklammern hängen. Tippe auf eine Stelle.' });
    var wahl = -1, gezeigt = 0, t = 0, ergebnis = [null, null, null, null, null], speed = 1;
    var statusEl = el('p', { 'class': 'animstatus', 'aria-live': 'polite', text: 'Tippe auf eine Stelle am Magneten oder auf einen der Knöpfe.' });
    var gitter = el('div', { 'class': 'gegenstaende', role: 'group', 'aria-label': 'Stelle am Magneten wählen' });
    var knoepfe = STELLEN.map(function (s, i) { var b = G.knopf(s.n, function () { waehle(i); }, 'zweit'); b.setAttribute('aria-pressed', 'false'); gitter.appendChild(b); return b; });
    var diagramm = el('div', { 'class': 'diagramm' });
    function waehle(i) {
      wahl = i; gezeigt = 0; t = 0; ergebnis[i] = STELLEN[i].k;
      knoepfe.forEach(function (b, j) { b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
      statusEl.textContent = 'An der Stelle „' + STELLEN[i].n + '“ bleiben ' + STELLEN[i].k + ' Büroklammern hängen.';
      balken();
    }
    cv.c.addEventListener('pointerdown', function (e) {
      var p = cv.pos(e), best = -1, bd = 1e9;
      STELLEN.forEach(function (s, i) { var d = Math.abs(p.x - s.x); if (d < bd) { bd = d; best = i; } });
      if (p.y < MY + MH + 260 && p.x > MX - 30 && p.x < MX + MW + 30) waehle(best);
    });
    function balken() {
      var s = '<svg viewBox="0 0 520 170" class="szene" role="img" aria-label="Balkendiagramm: Anzahl der Büroklammern an den fünf Stellen">';
      STELLEN.forEach(function (st, i) {
        var x = 30 + i * 96, hh = ergebnis[i] == null ? 0 : ergebnis[i] * 11;
        s += '<rect x="' + x + '" y="' + (130 - hh) + '" width="66" height="' + hh + '" fill="#1F3864"/>';
        s += '<text x="' + (x + 33) + '" y="' + (124 - hh) + '" text-anchor="middle" font-size="17" font-weight="bold" font-family="Arial,sans-serif" fill="#111">' + (ergebnis[i] == null ? '' : ergebnis[i]) + '</text>';
        s += '<text x="' + (x + 33) + '" y="152" text-anchor="middle" font-size="13" font-family="Arial,sans-serif" fill="#111">' + st.n + '</text>';
      });
      s += '<line x1="20" y1="130" x2="510" y2="130" stroke="#111" stroke-width="2"/><text x="14" y="16" font-size="14" font-family="Arial,sans-serif" fill="#111">Anzahl der Klammern</text></svg>';
      diagramm.innerHTML = s;
    }
    balken();
    var h = G.laufen(function (dt) {
      t += dt * speed * (G.reduced ? 3 : 1);
      if (wahl >= 0) gezeigt = Math.min(STELLEN[wahl].k, Math.floor(t / 0.12));
      var ctx = cv.ctx; ctx.clearRect(0, 0, W, H);
      G.magnet(ctx, MX, MY, MW, MH, { nZuerst: true });
      STELLEN.forEach(function (s, i) {
        ctx.fillStyle = i === wahl ? G.M : '#fff'; ctx.strokeStyle = G.M; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(s.x, MY - 20, 9, 0, 6.2832); ctx.fill(); ctx.stroke();
        G.text(ctx, String(i + 1), s.x, MY - 40, { groesse: 14, fett: true });
      });
      if (wahl >= 0) {
        var x = STELLEN[wahl].x;
        for (var k = 0; k < gezeigt; k++) G.klammer(ctx, x + Math.sin(k * 1.3) * 1.2, MY + MH + 13 + k * 20, PI2(), 1.2);
        ctx.fillStyle = '#111'; ctx.beginPath(); ctx.moveTo(x, MY - 6); ctx.lineTo(x - 7, MY - 14); ctx.lineTo(x + 7, MY - 14); ctx.closePath(); ctx.fill();
      }
    }, gruppe);
    function PI2() { return Math.PI / 2; }
    var pz = el('div', { 'class': 'knopfzeile' }, [G.pauseKnopf(h), G.knopf('Neu', function () { wahl = -1; gezeigt = 0; ergebnis = [null, null, null, null, null]; knoepfe.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); }); statusEl.textContent = 'Tippe auf eine Stelle am Magneten oder auf einen der Knöpfe.'; balken(); }, 'zweit')]);
    panel.appendChild(gitter); panel.appendChild(pz); panel.appendChild(statusEl); panel.appendChild(diagramm);
    window.__m5a = { waehle: waehle, ergebnis: function () { return ergebnis; }, tempo: function (v) { speed = v; } };
  }

  /* ----- Reiter 2: Was schirmt ab? ----- */
  function abschirmung(panel, gruppe) {
    var W = 720, H = 380, TISCH = 330, KX = 360;
    var MAT = [
      { n: 'Kunststofffolie', f: 'rgba(120,170,230,.55)', rand: '#3B6FB6', dick: 8, ab: false },
      { n: 'Glasplatte', f: 'rgba(170,225,235,.6)', rand: '#4A9CA8', dick: 12, ab: false },
      { n: 'Kupferblech', f: '#C97A4A', rand: '#7A3E1A', dick: 9, ab: false },
      { n: 'Sperrholz', f: '#CFA66B', rand: '#6E4B1F', dick: 14, ab: false },
      { n: 'Stahlblech', f: '#8A929C', rand: '#2D333B', dick: 9, ab: true }
    ];
    var cv = G.canvas(panel, W, H, { label: 'Eine Büroklammer liegt auf dem Tisch. Darüber liegt ein Material. Ein Magnet fährt von oben heran.' });
    var statusEl = el('p', { 'class': 'animstatus', 'aria-live': 'polite', text: 'Wähle ein Material. Es wird über die Büroklammer gelegt. Dann fährt der Magnet heran.' });
    var res = MAT.map(function () { return null; }), akt = null, wahl = -1, speed = 1;
    var mag = { x: KX, y: 30 }, klam = { y: TISCH - 8 }, plY = 0, tab = el('table', { 'class': 'tabelle' }), tb = el('tbody');
    tab.appendChild(el('thead', {}, [el('tr', {}, [el('th', { text: 'Material' }), el('th', { text: 'Büroklammer' })])]));
    tab.appendChild(tb);
    function tabelle() {
      tb.innerHTML = '';
      MAT.forEach(function (m, i) { tb.appendChild(el('tr', {}, [el('td', { text: m.n }), el('td', { text: res[i] == null ? '–' : res[i] ? '✓ springt hoch und klebt unten am Material' : '✗ bleibt liegen' })])); });
    }
    tabelle();
    var gitter = el('div', { 'class': 'gegenstaende', role: 'group', 'aria-label': 'Material wählen' });
    var knoepfe = MAT.map(function (m, i) { var b = G.knopf(m.n, function () { teste(i); }, 'zweit'); b.setAttribute('aria-pressed', 'false'); gitter.appendChild(b); return b; });
    function teste(i) {
      if (akt) return;
      wahl = i; akt = { t: 0, phase: 0, startMagY: mag.y };
      knoepfe.forEach(function (b, j) { b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); b.disabled = true; });
      klam.y = TISCH - 8;
      statusEl.textContent = MAT[i].n + ' liegt über der Büroklammer. Der Magnet fährt heran.';
    }
    function plattenOberkante() { return TISCH - 18 - (wahl >= 0 ? MAT[wahl].dick : 0); }
    var h = G.laufen(function (dt) {
      dt *= speed * (G.reduced ? 2.5 : 1);
      if (akt) {
        akt.t += dt;
        var m = MAT[wahl], plOben = plattenOberkante(), magZiel = plOben - 44 - 4;
        if (akt.phase === 0) {
          var s = Math.min(1, akt.t / 1.2), e = s * s * (3 - 2 * s);
          mag.y = akt.startMagY + (magZiel - akt.startMagY) * e;
          if (s >= 1) { akt.phase = 1; akt.t = 0; }
        } else if (akt.phase === 1) {
          if (!m.ab) { var q = Math.min(1, akt.t / 0.25); klam.y = (TISCH - 8) + ((plOben + m.dick + 7) - (TISCH - 8)) * q * q; }
          if (akt.t > 1.2) {
            res[wahl] = !m.ab; tabelle();
            statusEl.textContent = m.ab ? 'Stahlblech: Die Büroklammer bleibt liegen. Das Stahlblech schirmt das Magnetfeld ab.' : m.n + ': Die Büroklammer springt hoch und klebt unten am Material. Das Magnetfeld geht hindurch.';
            akt = null; knoepfe.forEach(function (b) { b.disabled = false; });
          }
        }
      }
      var ctx = cv.ctx; ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#E7DCC8'; ctx.fillRect(0, TISCH, W, H - TISCH);
      ctx.strokeStyle = '#8A7A5C'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, TISCH); ctx.lineTo(W, TISCH); ctx.stroke();
      // Stützen links und rechts für die Platte
      if (wahl >= 0) {
        var mm = MAT[wahl], top = TISCH - 18 - mm.dick;
        ctx.fillStyle = '#9AA3AF'; ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
        ctx.fillRect(KX - 150, TISCH - 18, 14, 18); ctx.strokeRect(KX - 150, TISCH - 18, 14, 18);
        ctx.fillRect(KX + 136, TISCH - 18, 14, 18); ctx.strokeRect(KX + 136, TISCH - 18, 14, 18);
        ctx.fillStyle = mm.f; ctx.strokeStyle = mm.rand; ctx.lineWidth = 3;
        ctx.fillRect(KX - 160, top, 320, mm.dick); ctx.strokeRect(KX - 160, top, 320, mm.dick);
        G.text(ctx, mm.n, KX + 170, top + mm.dick / 2, { groesse: 16, fett: true, ausr: 'left' });
      }
      G.klammer(ctx, KX, klam.y, 0, 1.6);
      G.text(ctx, 'Büroklammer', KX - 70, TISCH + 24, { groesse: 15 });
      ctx.strokeStyle = '#555'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mag.x, 0); ctx.lineTo(mag.x, mag.y - 4); ctx.stroke();
      G.magnet(ctx, mag.x - 80, mag.y - 4, 160, 44, { nZuerst: true });
    }, gruppe);
    var pz = el('div', { 'class': 'knopfzeile' }, [G.pauseKnopf(h), G.knopf('Tabelle leeren', function () { if (akt) return; res = MAT.map(function () { return null; }); wahl = -1; mag.y = 30; klam.y = TISCH - 8; knoepfe.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); }); tabelle(); statusEl.textContent = 'Wähle ein Material.'; }, 'zweit')]);
    panel.appendChild(gitter); panel.appendChild(pz); panel.appendChild(statusEl); panel.appendChild(tab);
    window.__m5b = { teste: teste, res: function () { return res; }, frei: function () { return !akt; }, tempo: function (v) { speed = v; }, klammerY: function () { return klam.y; } };
  }

  window.ANIM[5] = function (host) {
    G.reiter(host, [
      { titel: 'Wo ist der Magnet stark?', bau: staerke },
      { titel: 'Was schirmt ab?', bau: abschirmung }
    ]);
  };
})();
