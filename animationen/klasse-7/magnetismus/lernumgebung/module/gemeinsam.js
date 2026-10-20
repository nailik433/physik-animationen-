/* ==========================================================
   GEMEINSAME BAUSTEINE (G): Farben, Zeichenhelfer, Feldmodell, Animationsschleife
   ========================================================== */
(function () {
  'use strict';
  var G = window.G = {
    N: '#D62828',      // Nordpol rot
    S: '#2E9E4F',      // Südpol grün
    M: '#1F3864',      // Marineblau
    TINTE: '#111111'
  };
  G.reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  G.dpr = Math.min(window.devicePixelRatio || 1, 2);

  /* ---------- DOM ---------- */
  G.el = function (tag, attrs, kids) {
    var e = document.createElement(tag), k;
    attrs = attrs || {};
    for (k in attrs) {
      if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
      if (k === 'class') e.className = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  };
  G.knopf = function (text, fn, cls) {
    return G.el('button', { type: 'button', 'class': 'btn' + (cls ? ' ' + cls : ''), text: text, onclick: fn });
  };
  G.zahl = function (v, nk) { return (nk == null ? String(Math.round(v)) : v.toFixed(nk)).replace('.', ','); };

  /* Reiter (Tabs): eintraege = [{titel, bau: function(panel, gruppe)}] */
  G.reiter = function (host, eintraege, startIndex) {
    var leiste = G.el('div', { 'class': 'reiter', role: 'tablist' });
    var feld = G.el('div', { 'class': 'reiterfeld' });
    var btns = [], gruppen = [], aktiv = -1;
    function zeige(i) {
      if (aktiv >= 0) { G.stoppen(gruppen[aktiv]); }
      aktiv = i;
      btns.forEach(function (b, j) { b.setAttribute('aria-selected', j === i ? 'true' : 'false'); b.tabIndex = j === i ? 0 : -1; });
      feld.innerHTML = '';
      gruppen[i] = [];
      var panel = G.el('div', { role: 'tabpanel' });
      feld.appendChild(panel);
      eintraege[i].bau(panel, gruppen[i]);
    }
    eintraege.forEach(function (e, i) {
      var b = G.el('button', { type: 'button', role: 'tab', 'class': 'reiterknopf', text: e.titel, 'aria-selected': 'false',
        onclick: function () { zeige(i); },
        onkeydown: function (ev) {
          if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
            var j = (i + (ev.key === 'ArrowRight' ? 1 : eintraege.length - 1)) % eintraege.length;
            zeige(j); btns[j].focus(); ev.preventDefault();
          }
        } });
      btns.push(b); leiste.appendChild(b);
    });
    host.appendChild(leiste); host.appendChild(feld);
    zeige(startIndex || 0);
    return { zeige: zeige };
  };

  /* ---------- Canvas ---------- */
  G.canvas = function (host, W, H, o) {
    o = o || {};
    var c = document.createElement('canvas'), dpr = G.dpr;
    c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
    c.className = 'leinwand' + (o.drag ? ' ziehbar' : '');
    c.setAttribute('role', 'img');
    c.setAttribute('aria-label', o.label || 'Animation');
    host.appendChild(c);
    var ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return {
      c: c, ctx: ctx, W: W, H: H,
      pos: function (e) {
        var r = c.getBoundingClientRect();
        return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height };
      }
    };
  };
  /* Ziehen mit Zeigerereignissen (Touch und Maus) */
  G.ziehen = function (cv, start, bewegt, ende) {
    var aktiv = false;
    cv.c.addEventListener('pointerdown', function (e) {
      var p = cv.pos(e);
      if (start(p, e) === false) return;
      aktiv = true;
      try { cv.c.setPointerCapture(e.pointerId); } catch (x) { /* egal */ }
      e.preventDefault();
    });
    cv.c.addEventListener('pointermove', function (e) { if (aktiv) { bewegt(cv.pos(e), e); e.preventDefault(); } });
    function aus(e) { if (aktiv) { aktiv = false; if (ende) ende(cv.pos(e), e); } }
    cv.c.addEventListener('pointerup', aus);
    cv.c.addEventListener('pointercancel', aus);
  };

  /* ---------- Animationsschleife (pausiert im Hintergrund-Tab) ---------- */
  var alle = [];
  G.laufen = function (fn, gruppe) {
    var h = { pause: false, stop: false, last: null };
    function frame(t) {
      if (h.stop) return;
      window.requestAnimationFrame(frame);
      if (document.hidden) { h.last = null; return; }
      var dt = h.last == null ? 0 : Math.min(0.05, (t - h.last) / 1000);
      h.last = t;
      fn(h.pause ? 0 : dt, h.pause);
    }
    window.requestAnimationFrame(frame);
    alle.push(h);
    if (gruppe) gruppe.push(h);
    return h;
  };
  G.stoppen = function (gruppe) { (gruppe || []).forEach(function (h) { h.stop = true; }); if (gruppe) gruppe.length = 0; };
  G.alleStoppen = function () { alle.forEach(function (h) { h.stop = true; }); alle = []; };
  G.pauseKnopf = function (h) {
    var b = G.el('button', { type: 'button', 'class': 'btn zweit', 'aria-pressed': 'false', text: 'Pause' });
    b.addEventListener('click', function () {
      h.pause = !h.pause;
      b.textContent = h.pause ? 'Weiter' : 'Pause';
      b.setAttribute('aria-pressed', h.pause ? 'true' : 'false');
    });
    return b;
  };
  G.zufall = function (seed) {
    var s = (seed >>> 0) || 1;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  };

  /* ---------- Zeichenhelfer ---------- */
  function rundRechteck(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
  }
  G.rundRechteck = rundRechteck;

  G.text = function (ctx, t, x, y, o) {
    o = o || {};
    ctx.font = (o.fett ? 'bold ' : '') + (o.groesse || 16) + 'px Arial, Helvetica, sans-serif';
    ctx.fillStyle = o.farbe || G.TINTE;
    ctx.textAlign = o.ausr || 'center';
    ctx.textBaseline = o.basis || 'middle';
    if (o.halo) { ctx.lineJoin = 'round'; ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,255,255,.92)'; ctx.strokeText(t, x, y); }
    ctx.fillText(t, x, y);
  };
  G.buchstabe = function (ctx, t, x, y, gr) {      // weißer Buchstabe mit dunklem Rand (Kontrast ohne Farbe)
    ctx.font = 'bold ' + gr + 'px Arial, Helvetica, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(2, gr * 0.16); ctx.strokeStyle = 'rgba(0,0,0,.75)';
    ctx.strokeText(t, x, y);
    ctx.fillStyle = '#fff'; ctx.fillText(t, x, y);
  };
  /* Stabmagnet. o.senkrecht: Pole oben/unten; o.nZuerst (Standard true): N links bzw. oben */
  G.magnet = function (ctx, x, y, w, h, o) {
    o = o || {};
    var nz = o.nZuerst !== false, v = !!o.senkrecht, lw = o.lw || 3.5;
    var r1 = v ? [x, y, w, h / 2] : [x, y, w / 2, h];
    var r2 = v ? [x, y + h / 2, w, h / 2] : [x + w / 2, y, w / 2, h];
    var a = nz ? r1 : r2, b = nz ? r2 : r1;           // a: Nordhälfte, b: Südhälfte
    ctx.fillStyle = G.N; ctx.fillRect(a[0], a[1], a[2], a[3]);
    ctx.fillStyle = G.S; ctx.fillRect(b[0], b[1], b[2], b[3]);
    ctx.lineJoin = 'round'; ctx.strokeStyle = '#111'; ctx.lineWidth = lw;
    ctx.strokeRect(x, y, w, h);
    ctx.beginPath();
    if (v) { ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2); } else { ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h); }
    ctx.stroke();
    if (o.buchstaben !== false) {
      var gr = o.gr || Math.max(12, Math.min(34, (v ? Math.min(w, h / 2) : Math.min(w / 2, h)) * 0.62));
      G.buchstabe(ctx, 'N', a[0] + a[2] / 2, a[1] + a[3] / 2, gr);
      G.buchstabe(ctx, 'S', b[0] + b[2] / 2, b[1] + b[3] / 2, gr);
    }
  };
  /* Kompass: Nadel zeigt in Richtung ang (Bogenmaß, Bildschirmkoordinaten), rote Hälfte = Nordspitze */
  G.kompass = function (ctx, x, y, r, ang, o) {
    o = o || {};
    ctx.save();
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#111'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); ctx.stroke();
    if (o.rand) { ctx.strokeStyle = o.rand; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r + 4, 0, 6.2832); ctx.stroke(); }
    var L = r * 0.84, w = r * 0.28, c = Math.cos(ang), s = Math.sin(ang);
    function halb(sg, farbe) {
      ctx.fillStyle = farbe; ctx.strokeStyle = '#111'; ctx.lineWidth = 1.8; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(x + sg * c * L, y + sg * s * L);
      ctx.lineTo(x - s * w, y + c * w);
      ctx.lineTo(x + s * w, y - c * w);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    halb(1, G.N); halb(-1, G.S);
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(x, y, Math.max(2, r * 0.07), 0, 6.2832); ctx.fill();
    ctx.restore();
    if (r >= 20 && o.buchstaben !== false) {
      var gr = Math.max(10, r * 0.34);
      G.buchstabe(ctx, 'N', x + c * L * 0.58, y + s * L * 0.58, gr);
      G.buchstabe(ctx, 'S', x - c * L * 0.58, y - s * L * 0.58, gr);
    }
  };
  /* Büroklammer, Mittelpunkt (x, y), Drehwinkel ang */
  G.klammer = function (ctx, x, y, ang, sk) {
    sk = sk || 1;
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang || 0); ctx.scale(sk, sk);
    ctx.strokeStyle = '#555'; ctx.lineWidth = 2.4; ctx.lineJoin = 'round';
    rundRechteck(ctx, -13, -5.5, 24, 11, 5.5); ctx.stroke();
    rundRechteck(ctx, -8, -2.5, 21, 5, 2.5); ctx.stroke();
    ctx.restore();
  };
  G.pfeil = function (ctx, x0, y0, x1, y1, farbe, breite, kopf) {
    var a = Math.atan2(y1 - y0, x1 - x0); kopf = kopf || 9; breite = breite || 3;
    ctx.save(); ctx.strokeStyle = farbe; ctx.fillStyle = farbe; ctx.lineWidth = breite; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - Math.cos(a) * kopf * 0.6, y1 - Math.sin(a) * kopf * 0.6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - Math.cos(a - 0.45) * kopf, y1 - Math.sin(a - 0.45) * kopf);
    ctx.lineTo(x1 - Math.cos(a + 0.45) * kopf, y1 - Math.sin(a + 0.45) * kopf);
    ctx.closePath(); ctx.fill(); ctx.restore();
  };
  G.schloss = function (ctx, x, y, s, offen) {       // kleines Schloss-Symbol (Mitte x, y)
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.strokeStyle = '#111'; ctx.fillStyle = '#F2C94C'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, -3, 5, Math.PI, offen ? Math.PI * 1.9 : 0); ctx.stroke();
    ctx.fillRect(-7, -3, 14, 11); ctx.strokeRect(-7, -3, 14, 11);
    ctx.restore();
  };

  /* ---------- Feldmodell (zwei Punktpole, Summe der Beiträge) ----------
     poles: [{x, y, q}] mit q = +1 für einen Nordpol, q = -1 für einen Südpol.
     B(P) = (P - N)/|P - N|^3 + (S - P)/|S - P|^3 (abstoßend vom Nordpol, anziehend zum Südpol) */
  G.B = function (poles, x, y) {
    var bx = 0, by = 0, i, p, dx, dy, r2, r3;
    for (i = 0; i < poles.length; i++) {
      p = poles[i]; dx = x - p.x; dy = y - p.y; r2 = dx * dx + dy * dy + 1e-9; r3 = r2 * Math.sqrt(r2);
      bx += p.q * dx / r3; by += p.q * dy / r3;
    }
    return [bx, by];
  };
  G.Bwinkel = function (poles, x, y) { var b = G.B(poles, x, y); return Math.atan2(b[1], b[0]); };
  /* Richtung (links/rechts/oben/unten) des Feldes an einem Punkt */
  G.Brichtung = function (poles, x, y) {
    var b = G.B(poles, x, y);
    if (Math.abs(b[0]) >= Math.abs(b[1])) return b[0] >= 0 ? 'rechts' : 'links';
    return b[1] >= 0 ? 'unten' : 'oben';
  };
  function imRechteck(rects, x, y) {
    for (var i = 0; i < rects.length; i++) {
      var r = rects[i];
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return true;
    }
    return false;
  }
  G.imRechteck = imRechteck;
  /* Feldlinien: Start rund um jeden Nordpol, außerhalb der Rechtecke (Magnete), bis zum Südpol oder Bildrand.
     Gibt eine Liste von Linien zurück, jede Linie ist eine Liste von [x, y]. */
  G.linien = function (poles, rects, grenzen, o) {
    o = o || {};
    var n = o.n || 16, h = o.h || 3, maxN = o.max || 3000, res = [];
    var rs = o.rs || 14;
    function nahS(x, y) {
      for (var i = 0; i < poles.length; i++) {
        if (poles[i].q < 0 && Math.hypot(x - poles[i].x, y - poles[i].y) < rs) return true;
      }
      return false;
    }
    poles.forEach(function (p) {
      if (p.q <= 0) return;
      for (var k = 0; k < n; k++) {
        var a = (k + (o.versatz == null ? 0.5 : o.versatz)) * 2 * Math.PI / n;
        var x = p.x + Math.cos(a) * 0.5, y = p.y + Math.sin(a) * 0.5;
        var pts = [], aussen = false, tot = false, i, b1, m1, b2, m2, mx, my, px, py;
        for (i = 0; i < maxN; i++) {
          px = x; py = y;
          b1 = G.B(poles, x, y); m1 = Math.sqrt(b1[0] * b1[0] + b1[1] * b1[1]); if (m1 < 1e-14) break;
          mx = x + b1[0] / m1 * h / 2; my = y + b1[1] / m1 * h / 2;
          b2 = G.B(poles, mx, my); m2 = Math.sqrt(b2[0] * b2[0] + b2[1] * b2[1]); if (m2 < 1e-14) break;
          x += b2[0] / m2 * h; y += b2[1] / m2 * h;
          var drin = imRechteck(rects, x, y);
          if (!aussen) {
            if (!drin) { aussen = true; pts.push([px, py]); pts.push([x, y]); }
            else if (nahS(x, y)) { tot = true; break; }
          } else {
            if (drin) { pts.push([x, y]); break; }
            pts.push([x, y]);
            if (nahS(x, y)) break;
          }
          if (x < grenzen.x0 || x > grenzen.x1 || y < grenzen.y0 || y > grenzen.y1) break;
        }
        if (!tot && pts.length > 4) res.push(pts);
      }
    });
    return res;
  };
  G.zeichneLinien = function (ctx, linien, farbe, breite) {
    ctx.save(); ctx.strokeStyle = farbe || G.M; ctx.fillStyle = farbe || G.M; ctx.lineWidth = breite || 2.2; ctx.lineJoin = 'round';
    linien.forEach(function (pts) {
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();
      var m = Math.floor(pts.length / 2), a = pts[Math.max(0, m - 2)], b = pts[Math.min(pts.length - 1, m + 2)];
      var ang = Math.atan2(b[1] - a[1], b[0] - a[0]), q = pts[m];
      ctx.beginPath(); ctx.moveTo(q[0] + Math.cos(ang) * 8, q[1] + Math.sin(ang) * 8);
      ctx.lineTo(q[0] + Math.cos(ang + 2.5) * 8, q[1] + Math.sin(ang + 2.5) * 8);
      ctx.lineTo(q[0] + Math.cos(ang - 2.5) * 8, q[1] + Math.sin(ang - 2.5) * 8);
      ctx.closePath(); ctx.fill();
    });
    ctx.restore();
  };
  /* Eisenfeilspäne: Liste [x, y, Winkel, Deckkraft], dichter an den Polen */
  G.feilspaene = function (poles, rects, grenzen, anzahl, seed, bezug) {
    var rnd = G.zufall(seed || 7), out = [], versuche = 0, x, y, b, m, p;
    while (out.length < anzahl && versuche < anzahl * 80) {
      versuche++;
      x = grenzen.x0 + rnd() * (grenzen.x1 - grenzen.x0);
      y = grenzen.y0 + rnd() * (grenzen.y1 - grenzen.y0);
      if (imRechteck(rects, x, y)) continue;
      b = G.B(poles, x, y); m = Math.sqrt(b[0] * b[0] + b[1] * b[1]);
      p = 0.1 + 0.9 * Math.pow(Math.min(1, m / bezug), 0.42);
      if (rnd() > p) continue;
      out.push([x, y, Math.atan2(b[1], b[0]), 0.35 + 0.65 * Math.min(1, Math.pow(m / bezug, 0.3))]);
    }
    return out;
  };
  G.zeichneFeilspaene = function (ctx, liste, laenge) {
    ctx.save(); ctx.strokeStyle = '#333'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
    var l = laenge || 6;
    liste.forEach(function (f) {
      var c = Math.cos(f[2]) * l / 2, s = Math.sin(f[2]) * l / 2;
      ctx.globalAlpha = f[3];
      ctx.beginPath(); ctx.moveTo(f[0] - c, f[1] - s); ctx.lineTo(f[0] + c, f[1] + s); ctx.stroke();
    });
    ctx.restore();
  };
})();
