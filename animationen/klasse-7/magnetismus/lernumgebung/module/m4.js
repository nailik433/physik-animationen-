/* Modul 4: Nagel-Labor (Modell der Elementarmagnete) */
(function () {
  'use strict';
  var G = window.G, el = G.el;
  window.ANIM = window.ANIM || {};

  window.ANIM[4] = function (host) {
    var W = 800, H = 450, COLS = 16, ROWS = 4, CW = 38, CH = 24, NH = 4 + ROWS * CH + 4, NY = 150, X0 = 70, GAP = 8, KOPF = 14, SPITZE = 32;
    var N = COLS * ROWS, PI = Math.PI, TISCH = 418;
    var cv = G.canvas(host, W, H, { drag: true, label: 'Ein Eisennagel mit 64 Elementarmagneten. Unten liegen sechs Büroklammern.' });
    var rnd = Math.random;
    var speed = 1;

    /* ---------- Zustand ---------- */
    var th = [], tgt = [], pend = [], i;
    var stuecke, clips = [], strich = 0, schlaege = 0, akt = null, zeit = 0, heizT = 0, schnitt = null, hammer = 0;
    var magnetPos = { x: 70, y: 36 };
    var statusEl = el('p', { 'class': 'animstatus', 'aria-live': 'polite' });
    var zaehler = el('p', { 'class': 'zaehler', 'aria-live': 'polite' });

    function winkelDiff(a, b) { var d = a - b; return Math.atan2(Math.sin(d), Math.cos(d)); }
    function ungeordnet() {                      // gleichmäßig über den Kreis verteilt, zufällig gemischt
      var a = [], k;
      for (k = 0; k < N; k++) a.push((k + rnd() * 0.9) * 2 * PI / N + 0.05);
      for (k = N - 1; k > 0; k--) { var j = Math.floor(rnd() * (k + 1)), t = a[k]; a[k] = a[j]; a[j] = t; }
      return a;
    }
    function zufallsWeg() { return PI + 0.7 + rnd() * (2 * PI - 1.4); }   // nie nahe "nach links"
    function neu() {
      th = ungeordnet(); tgt = th.slice(); pend = []; for (i = 0; i < N; i++) pend.push(false);
      stuecke = [{ a: 0, b: COLS, x: X0 }]; strich = 0; schlaege = 0; akt = null; heizT = 0; schnitt = null; hammer = 0;
      magnetPos = { x: 70, y: 36 };
      clips = []; for (i = 0; i < 6; i++) clips.push({ x: ruheX(i), y: TISCH - 14, ang: (i - 2.5) * 0.35, rx: 0 });
      statusEl.textContent = 'Der Nagel ist unmagnetisch. Die Elementarmagnete zeigen in alle Richtungen.';
    }
    function ruheX(k) { return 250 + k * 56; }

    function anteil() { var c = 0; for (var k = 0; k < N; k++) if (Math.abs(winkelDiff(th[k], PI)) < 25 * PI / 180) c++; return c / N; }
    function mittelCos() { var s = 0; for (var k = 0; k < N; k++) s += Math.cos(th[k] - PI); return s / N; }
    function anzahlKlammern() { var m = mittelCos(); return m < 0.2 ? 0 : Math.min(6, Math.round(6 * m)); }
    function stueckAnteil(st) {
      var c = 0, n = 0, r, col;
      for (r = 0; r < ROWS; r++) for (col = st.a; col < st.b; col++) { n++; if (Math.abs(winkelDiff(th[r * COLS + col], PI)) < 25 * PI / 180) c++; }
      return c / n;
    }
    function istMagnet() { return anteil() >= 0.6; }

    /* ---------- Layout ---------- */
    function stueckX(idx) { return X0 + stuecke[idx].a * CW + idx * GAP; }
    function stueckBreite(st) { return (st.b - st.a) * CW; }
    function spalteX(col) {            // Mittelpunkt der Spalte im aktuellen (animierten) Layout
      for (var k = 0; k < stuecke.length; k++) if (col >= stuecke[k].a && col < stuecke[k].b) return stuecke[k].x + (col - stuecke[k].a) * CW + CW / 2;
      return X0;
    }
    function endenListe() {
      var e = [], last = stuecke.length - 1;
      e.push({ x: stuecke[0].x, y: NY + NH + 4 });
      e.push({ x: stuecke[last].x + stueckBreite(stuecke[last]), y: NY + NH + 4 });
      stuecke.forEach(function (st, k) {
        if (k > 0) e.push({ x: st.x, y: NY + NH + 4 });
        if (k < last) e.push({ x: st.x + stueckBreite(st), y: NY + NH + 4 });
      });
      return e;
    }
    function klammerZiele(n) {
      var enden = endenListe(), zaehl = enden.map(function () { return 0; }), z = [], k, e;
      for (k = 0; k < n; k++) {
        e = k % enden.length;
        // Kopf ragt links über: linkes Ende des ersten Stücks etwas einrücken
        z.push({ x: enden[e].x + (e === 0 ? -KOPF + 4 : (e === 1 ? SPITZE * 0.15 : 0)) + (zaehl[e] % 2) * 0, y: enden[e].y + 8 + zaehl[e] * 19 });
        zaehl[e]++;
      }
      return z;
    }

    /* ---------- Aktionen ---------- */
    var knoepfe = {};
    function sperre(b) { Object.keys(knoepfe).forEach(function (k) { if (k !== 'pause') knoepfe[k].disabled = b; }); }
    function frei() { return !akt && !schnitt; }

    function striche() {
      if (!frei()) return;
      var ziele = [0.65, 0.9, 1.0], f = ziele[Math.min(strich, 2)];
      if (anteil() < 0.2) strich = 0;
      f = ziele[Math.min(strich, 2)];
      var offen = [], k;
      for (k = 0; k < N; k++) if (Math.abs(winkelDiff(th[k], PI)) >= 25 * PI / 180 || Math.abs(winkelDiff(tgt[k], PI)) >= 25 * PI / 180) offen.push(k);
      var zielAnzahl = Math.round(f * N), schon = N - offen.length, noetig = Math.max(0, zielAnzahl - schon);
      for (k = offen.length - 1; k > 0; k--) { var j = Math.floor(rnd() * (k + 1)), t = offen[k]; offen[k] = offen[j]; offen[j] = t; }
      for (k = 0; k < noetig && k < offen.length; k++) pend[offen[k]] = true;
      for (k = 0; k < N; k++) if (offen.indexOf(k) < 0) pend[k] = true;      // schon ausgerichtete richten sich genau aus
      strich++;
      var last = stuecke[stuecke.length - 1];
      akt = { typ: 'strich', t: 0, xs: X0 - 26, xe: last.x + stueckBreite(last) + 26 };
      sperre(true);
      statusEl.textContent = 'Strich ' + strich + ': Der Magnet streicht mit dem Nordpol von links nach rechts über den Nagel.';
    }
    function klopfen() {
      if (!frei()) return;
      akt = { typ: 'klopf', t: 0, getroffen: false };
      schlaege++; sperre(true);
      statusEl.textContent = 'Schlag ' + schlaege + ': Der Hammer erschüttert den Nagel.';
    }
    function erhitzen() {
      if (!frei()) return;
      akt = { typ: 'heiz', t: 0, wechsel: 0 }; sperre(true);
      statusEl.textContent = 'Der Nagel wird erhitzt. Die Elementarmagnete geraten durcheinander.';
    }
    function neuKnopf() { neu(); sperre(false); zeigeKnopfZustand(); }

    function gueltigeSchnitte() {
      var l = [];
      stuecke.forEach(function (st) { for (var c = st.a + 2; c <= st.b - 2; c++) l.push(c); });
      return l;
    }
    function schnittStart() {
      if (!frei()) { if (schnitt) schnittAbbrechen(); return; }
      if (stuecke.length >= 8) { statusEl.textContent = 'Der Nagel ist schon in acht Stücke geteilt. Weiter geht es nicht.'; return; }
      if (!istMagnet()) { statusEl.textContent = 'Der Nagel ist noch kein Magnet. Streiche zuerst mit dem Magneten über den Nagel.'; return; }
      var g = gueltigeSchnitte(), best = g[0], bd = 1e9;
      g.forEach(function (c) { var d = Math.abs(spalteX(c) - CW / 2 - 400); if (d < bd) { bd = d; best = c; } });
      schnitt = { c: best };
      cv.c.style.touchAction = 'none';
      zeigeKnopfZustand();
      statusEl.textContent = 'Wähle die Schnittstelle: Tippe auf den Nagel oder nutze die Pfeilknöpfe. Dann tippe auf „Hier teilen“.';
    }
    function schnittAbbrechen() { schnitt = null; cv.c.style.touchAction = 'manipulation'; zeigeKnopfZustand(); statusEl.textContent = 'Teilen abgebrochen.'; }
    function schnittSchieben(r) {
      var g = gueltigeSchnitte(), k = g.indexOf(schnitt.c);
      k = Math.max(0, Math.min(g.length - 1, k + r)); schnitt.c = g[k];
    }
    function schnittAusfuehren(c) {
      var k, st;
      for (k = 0; k < stuecke.length; k++) { st = stuecke[k]; if (c > st.a && c < st.b) break; }
      if (k >= stuecke.length) return;
      var neuesTeil = { a: c, b: st.b, x: st.x + (c - st.a) * CW }, rest = { a: st.a, b: c, x: st.x };
      stuecke.splice(k, 1, rest, neuesTeil);
      schnitt = null; cv.c.style.touchAction = 'manipulation'; zeigeKnopfZustand();
      statusEl.textContent = 'Der Nagel besteht jetzt aus ' + stuecke.length + ' Stücken. Jedes Stück hat links einen Nordpol und rechts einen Südpol.';
    }
    function teilen(c) {          // direkter Aufruf (Test)
      if (c == null) { var g = gueltigeSchnitte(); c = g[0]; }
      schnittAusfuehren(c);
    }
    G.ziehen(cv, function (p) {
      if (!schnitt) return false;
      waehleSchnitt(p); return true;
    }, function (p) { waehleSchnitt(p); });
    function waehleSchnitt(p) {
      var g = gueltigeSchnitte(), best = schnitt.c, bd = 1e9;
      g.forEach(function (c) { var d = Math.abs(spalteX(c) - CW / 2 - p.x); if (d < bd) { bd = d; best = c; } });
      schnitt.c = best;
    }

    /* ---------- Bedienung ---------- */
    var zeile1 = el('div', { 'class': 'knopfzeile' });
    var zeile2 = el('div', { 'class': 'knopfzeile', hidden: '' });
    function kn(text, fn, cls, key) { var b = G.knopf(text, fn, cls); knoepfe[key] = b; return b; }
    zeile1.appendChild(kn('Mit Magnet streichen', striche, 'haupt', 'strich'));
    zeile1.appendChild(kn('Klopfen', klopfen, 'haupt', 'klopf'));
    zeile1.appendChild(kn('Erhitzen', erhitzen, 'haupt', 'heiz'));
    zeile1.appendChild(kn('Magnet teilen', schnittStart, 'haupt', 'teil'));
    zeile1.appendChild(kn('Neu', neuKnopf, 'zweit', 'neu'));
    zeile2.appendChild(G.knopf('◀ Schnitt nach links', function () { if (schnitt) schnittSchieben(-1); }, 'zweit'));
    zeile2.appendChild(G.knopf('Schnitt nach rechts ▶', function () { if (schnitt) schnittSchieben(1); }, 'zweit'));
    zeile2.appendChild(G.knopf('Hier teilen', function () { if (schnitt) schnittAusfuehren(schnitt.c); }, 'haupt'));
    zeile2.appendChild(G.knopf('Abbrechen', function () { if (schnitt) schnittAbbrechen(); }, 'zweit'));
    function zeigeKnopfZustand() { zeile2.hidden = !schnitt; sperre(!!akt || !!schnitt); knoepfe.neu.disabled = !!akt; }
    var pauseZeile = el('div', { 'class': 'knopfzeile' });
    host.appendChild(zeile1); host.appendChild(zeile2); host.appendChild(pauseZeile); host.appendChild(zaehler); host.appendChild(statusEl);

    /* ---------- Zeitschritt ---------- */
    function aktualisiere(dt) {
      dt *= speed * (G.reduced ? 2 : 1);
      zeit += dt;
      var k, d, rate = 7;
      // Stücke gleiten an ihren Platz
      stuecke.forEach(function (st, idx) { var tx = stueckX(idx); st.x += (tx - st.x) * Math.min(1, dt * 6); if (Math.abs(tx - st.x) < 0.3) st.x = tx; });
      if (akt) {
        akt.t += dt;
        if (akt.typ === 'strich') {
          var T1 = 0.5, T2 = 2.4, T3 = 1.6, y0 = NY - 3 - 84;
          if (akt.t < T1) { var s = akt.t / T1; magnetPos.x = 70 + (akt.xs - 70) * s; magnetPos.y = 36 + (y0 - 36) * s; }
          else if (akt.t < T1 + T2) { var u = (akt.t - T1) / T2; magnetPos.x = akt.xs + (akt.xe - akt.xs) * u; magnetPos.y = y0;
            for (k = 0; k < N; k++) if (pend[k] && magnetPos.x >= spalteX(k % COLS)) { pend[k] = false; tgt[k] = PI + (rnd() - 0.5) * (strich >= 3 ? 0.10 : 0.22); } }
          else if (akt.t < T1 + T2 + T3) { var v = (akt.t - T1 - T2) / T3; magnetPos.x = akt.xe + (70 - akt.xe) * v; magnetPos.y = y0 + (36 - y0) * v - Math.sin(PI * v) * 70; }
          else {
            for (k = 0; k < N; k++) if (pend[k]) { pend[k] = false; tgt[k] = PI + (rnd() - 0.5) * 0.2; }
            magnetPos = { x: 70, y: 36 }; akt = null; zeigeKnopfZustand();
            statusEl.textContent = istMagnet() ? 'Nach ' + strich + ' Strich' + (strich > 1 ? 'en' : '') + ' zeigen ' + Math.round(anteil() * 100) + ' Prozent der Elementarmagnete nach links. Der Nagel ist ein Magnet.' : 'Die Elementarmagnete sind noch nicht ausgerichtet.';
          }
        } else if (akt.typ === 'klopf') {
          var TA = 0.22, TB = 0.35;
          if (akt.t < TA) hammer = akt.t / TA;
          else if (akt.t < TA + TB) {
            hammer = 1 - (akt.t - TA) / TB;
            if (!akt.getroffen) {
              akt.getroffen = true;
              for (k = 0; k < N; k++) if (Math.abs(winkelDiff(tgt[k], PI)) < 40 * PI / 180 && rnd() < 0.35) { tgt[k] = zufallsWeg(); th[k] += winkelDiff(tgt[k], th[k]) * 0.15; }
              strich = anteil() < 0.2 ? 0 : strich;
            }
          } else {
            hammer = 0; akt = null; zeigeKnopfZustand();
            statusEl.textContent = 'Nach ' + schlaege + ' Schlag' + (schlaege > 1 ? 'en' : '') + ' zeigen noch ' + Math.round(anteil() * 100) + ' Prozent der Elementarmagnete nach links.' + (anteil() < 0.2 ? ' Der Nagel ist unmagnetisch.' : '');
          }
        } else if (akt.typ === 'heiz') {
          var TH = 4;
          heizT = Math.min(1, akt.t / 0.8) * (akt.t > TH - 1 ? Math.max(0, (TH - akt.t)) : 1);
          akt.wechsel += dt;
          if (akt.wechsel > 0.09) { akt.wechsel = 0; var anz = Math.min(N, Math.round(N * Math.min(1, akt.t / (TH * 0.7)) * 0.5) + 4); for (k = 0; k < anz; k++) { var q = Math.floor(rnd() * N); tgt[q] = rnd() * 2 * PI; } }
          rate = 14;
          if (akt.t >= TH) {
            var neuW = ungeordnet(); for (k = 0; k < N; k++) { tgt[k] = neuW[k]; }
            heizT = 0; akt = null; strich = 0; zeigeKnopfZustand();
            statusEl.textContent = 'Der Nagel ist abgekühlt. Die Elementarmagnete bleiben ungeordnet: Der Nagel ist unmagnetisch.';
          }
        }
      }
      // Elementarmagnete drehen sich zum Zielwinkel
      for (k = 0; k < N; k++) {
        d = winkelDiff(tgt[k], th[k]);
        th[k] += Math.abs(d) < 0.001 ? d : d * Math.min(1, dt * rate);
      }
      if (zeit > 0) { /* Zähler */ }
      // Büroklammern
      var nK = anzahlKlammern(), ziele = klammerZiele(nK), kk;
      for (kk = 0; kk < 6; kk++) {
        var c = clips[kk], zx, zy, za;
        if (kk < nK) { zx = ziele[kk].x; zy = ziele[kk].y; za = PI / 2; }
        else { zx = ruheX(kk); zy = TISCH - 12; za = (kk - 2.5) * 0.35; }
        var f = Math.min(1, dt * 7);
        c.x += (zx - c.x) * f; c.y += (zy - c.y) * f; c.ang += (za - c.ang) * f;
      }
      var pz = Math.round(anteil() * 100);
      zaehler.textContent = 'Ausgerichtet: ' + pz + ' %   ·   Striche: ' + strich + '   ·   Schläge: ' + schlaege + '   ·   Büroklammern am Nagel: ' + nK + ' von 6   ·   Stücke: ' + stuecke.length;
    }

    /* ---------- Zeichnen ---------- */
    function elementarmagnet(ctx, x, y, a) {
      var c = Math.cos(a), s = Math.sin(a);
      ctx.save(); ctx.translate(x, y); ctx.rotate(a);
      G.rundRechteck(ctx, -15, -7.5, 30, 15, 4);
      ctx.save(); ctx.clip();
      ctx.fillStyle = G.S; ctx.fillRect(-15, -8, 15, 16);
      ctx.fillStyle = G.N; ctx.fillRect(0, -8, 15, 16);
      ctx.restore();
      ctx.strokeStyle = '#111'; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.restore();
      G.buchstabe(ctx, 'N', x + c * 8, y + s * 8, 9);
      G.buchstabe(ctx, 'S', x - c * 8, y - s * 8, 9);
    }
    function zeichne() {
      var ctx = cv.ctx; ctx.clearRect(0, 0, W, H);
      // Tisch
      ctx.fillStyle = '#E7DCC8'; ctx.fillRect(0, TISCH, W, H - TISCH);
      ctx.strokeStyle = '#8A7A5C'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, TISCH); ctx.lineTo(W, TISCH); ctx.stroke();
      var k, r, col, jit;
      // Nagelstücke
      var mc = mittelCos(), ord = Math.max(0, mc);
      stuecke.forEach(function (st, idx) {
        var x = st.x, w = stueckBreite(st), tint = heizT;
        ctx.fillStyle = tint > 0 ? 'rgb(' + Math.round(217 + 38 * tint) + ',' + Math.round(221 - 90 * tint) + ',' + Math.round(227 - 140 * tint) + ')' : '#D9DDE3';
        ctx.strokeStyle = '#333'; ctx.lineWidth = 3; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.rect(x, NY, w, NH); ctx.fill(); ctx.stroke();
        if (st.a === 0) { ctx.beginPath(); ctx.rect(x - KOPF, NY - 4, KOPF, NH + 8); ctx.fill(); ctx.stroke(); }
        if (st.b === COLS) { ctx.beginPath(); ctx.moveTo(x + w, NY); ctx.lineTo(x + w + SPITZE, NY + NH / 2); ctx.lineTo(x + w, NY + NH); ctx.closePath(); ctx.fill(); ctx.stroke(); }
      });
      // Elementarmagnete
      for (k = 0; k < N; k++) {
        r = Math.floor(k / COLS); col = k % COLS;
        jit = heizT > 0 ? 0.35 * heizT : (Math.abs(winkelDiff(th[k], PI)) < 0.3 ? 0 : 0.14);
        var a = th[k] + (G.reduced ? 0 : Math.sin(zeit * (3 + (k % 5)) + k) * jit);
        elementarmagnet(ctx, spalteX(col), NY + 4 + r * CH + CH / 2, a);
      }
      // Pole der Stücke
      stuecke.forEach(function (st) {
        if (stueckAnteil(st) >= 0.8) {
          var x = st.x, w = stueckBreite(st);
          [['N', x + 18, G.N], ['S', x + w - 18, G.S]].forEach(function (b) {
            ctx.fillStyle = b[2]; ctx.strokeStyle = '#111'; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.arc(b[1], NY - 22, 15, 0, 6.2832); ctx.fill(); ctx.stroke();
            G.buchstabe(ctx, b[0], b[1], NY - 22, 18);
          });
        }
      });
      // Schnittlinie
      if (schnitt) {
        var sx = spalteX(schnitt.c) - CW / 2 - GAP / 2 + (schnitt.c * 0);
        var st = null; stuecke.forEach(function (s) { if (schnitt.c > s.a && schnitt.c < s.b) st = s; });
        sx = st.x + (schnitt.c - st.a) * CW;
        ctx.save(); ctx.strokeStyle = '#111'; ctx.lineWidth = 3; ctx.setLineDash([8, 6]);
        ctx.beginPath(); ctx.moveTo(sx, NY - 46); ctx.lineTo(sx, NY + NH + 40); ctx.stroke(); ctx.restore();
        G.text(ctx, 'Schnitt', sx, NY - 58, { groesse: 16, fett: true });
      }
      // Büroklammern
      clips.forEach(function (c) { G.klammer(ctx, c.x, c.y, c.ang, 1.15); });
      // Magnet beim Streichen (Nordpol unten)
      if (akt && akt.typ === 'strich' || magnetPos.y !== 36 || magnetPos.x !== 70) {
        G.magnet(ctx, magnetPos.x - 17, magnetPos.y, 34, 84, { senkrecht: true, nZuerst: false, gr: 20 });
      } else { G.magnet(ctx, magnetPos.x - 17, magnetPos.y, 34, 84, { senkrecht: true, nZuerst: false, gr: 20 }); }
      if (akt && akt.typ === 'strich') {
        var info = 'Strich ' + strich;
        G.text(ctx, info, W - 90, 30, { groesse: 22, fett: true });
      }
      // Hammer
      var hx = 400, hy = NY - 14, pvx = hx + 170, pvy = NY - 130;
      var psiHit = Math.atan2(hy - pvy, hx - pvx), psi = psiHit + (1 - hammer) * 0.9, L = Math.hypot(hx - pvx, hy - pvy);
      if (akt && akt.typ === 'klopf' || hammer > 0) {
        var kx = pvx + Math.cos(psi) * L, ky = pvy + Math.sin(psi) * L;
        ctx.save(); ctx.strokeStyle = '#7A5230'; ctx.lineWidth = 9; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(pvx, pvy); ctx.lineTo(kx, ky); ctx.stroke();
        ctx.translate(kx, ky); ctx.rotate(psi + PI / 2);
        ctx.fillStyle = '#6B7280'; ctx.strokeStyle = '#111'; ctx.lineWidth = 3; ctx.fillRect(-32, -13, 64, 26); ctx.strokeRect(-32, -13, 64, 26);
        ctx.restore();
      }
      // Flamme
      if (akt && akt.typ === 'heiz') {
        var fy = NY + NH + 8;
        for (k = 0; k < 7; k++) {
          var fx = 270 + k * 40, hh = 46 + 22 * Math.sin(zeit * 9 + k * 1.7) + (k === 3 ? 20 : 0);
          ctx.fillStyle = k % 2 ? '#F4A300' : '#E8590C';
          ctx.beginPath(); ctx.moveTo(fx - 16, fy + 62); ctx.quadraticCurveTo(fx - 12, fy + 62 - hh * 0.6, fx, fy + 62 - hh); ctx.quadraticCurveTo(fx + 12, fy + 62 - hh * 0.6, fx + 16, fy + 62); ctx.closePath(); ctx.fill();
        }
        ctx.fillStyle = '#555'; ctx.fillRect(250, fy + 62, 290, 12);
        G.text(ctx, 'Flamme', 395, fy + 90, { groesse: 15 });
      }
    }

    neu(); zeigeKnopfZustand();
    var hh = G.laufen(function (dt) { aktualisiere(dt); zeichne(); });
    pauseZeile.appendChild(G.pauseKnopf(hh));
    knoepfe.pause = pauseZeile.firstChild;

    window.__m4 = {
      anteil: anteil, strich: striche, klopfen: klopfen, erhitzen: erhitzen, teilen: teilen, neu: neuKnopf, frei: frei,
      tempo: function (v) { speed = v; }, stuecke: function () { return stuecke.map(function (s) { return { a: s.a, b: s.b }; }); },
      klammern: anzahlKlammern, stueckAnteil: function () { return stuecke.map(stueckAnteil); }, strichZahl: function () { return strich; },
      winkel: function () { return th.slice(); }, gueltig: gueltigeSchnitte, schnittStart: schnittStart, schnittWahl: function () { return schnitt && schnitt.c; },
      schnittMach: function (c) { schnitt = { c: c }; schnittAusfuehren(c); }, mittelCos: mittelCos
    };
  };
})();
