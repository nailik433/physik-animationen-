/* ==========================================================
   Gemeinsame Helfer für alle Physik-Animationen
   Einbinden:  <script src="…/assets/common.js"></script>
   Alles hängt am globalen Objekt  Phys.
   ========================================================== */
(function () {
  'use strict';
  const Phys = (window.Phys = {});
  const ZWEI_PI = Math.PI * 2;

  /* ---------- Farben (aus den CSS-Variablen, folgen Hell/Dunkel) ---------- */
  const NAMEN = ['surface', 'flaeche', 'text', 'muted', 'border', 'gitter', 'accent',
    'draht', 'elektron', 'plus', 'strom', 'spannung', 'widerstand', 'leistung', 'gluehen'];
  Phys.f = {};
  function farbenLaden() {
    const cs = getComputedStyle(document.documentElement);
    NAMEN.forEach(n => { Phys.f[n] = cs.getPropertyValue('--' + n).trim(); });
  }
  farbenLaden();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', farbenLaden);

  /* ---------- Zahlenformat (deutsch: 0,25) ---------- */
  Phys.zahl = (x, stellen = 0) =>
    (Math.abs(x) < 0.5 * Math.pow(10, -stellen) ? 0 : x)
      .toLocaleString('de-DE', { minimumFractionDigits: stellen, maximumFractionDigits: stellen });

  /* ---------- Zeichenfläche mit festem Koordinatensystem w × h ----------
     Skaliert automatisch auf die Breite der Seite und auf scharfe Displays. */
  Phys.leinwand = function (canvas, w, h) {
    const ctx = canvas.getContext('2d');
    const l = { canvas, ctx, w, h, scale: 1 };
    canvas.style.aspectRatio = w + ' / ' + h;
    function anpassen() {
      const cssW = canvas.clientWidth;
      if (!cssW) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssW * dpr * h / w);
      l.scale = canvas.width / w;
    }
    new ResizeObserver(anpassen).observe(canvas);
    anpassen();
    l.neu = function () {          // am Anfang jedes Bildes aufrufen
      ctx.setTransform(l.scale, 0, 0, l.scale, 0, 0);
      ctx.clearRect(0, 0, w, h);
    };
    return l;
  };

  /* ---------- Animationsschleife (+ Pause-Knopf mit id="pause") ----------
     fn(dt) bekommt die Zeit seit dem letzten Bild in Sekunden.
     Bei Pause ist dt = 0: Bedienelemente wirken weiterhin sofort. */
  Phys.animieren = function (fn) {
    const knopf = document.getElementById('pause');
    let pausiert = false;
    if (knopf) {
      knopf.addEventListener('click', () => {
        pausiert = !pausiert;
        knopf.textContent = pausiert ? '▶ Weiter' : '❚❚ Pause';
        knopf.setAttribute('aria-pressed', String(pausiert));
      });
    }
    let letzte = performance.now();
    function runde(jetzt) {
      const dt = Math.min(0.05, (jetzt - letzte) / 1000);
      letzte = jetzt;
      fn(pausiert ? 0 : dt);
      requestAnimationFrame(runde);
    }
    requestAnimationFrame(runde);
  };

  /* ---------- Bedienelemente anbinden ---------- */
  // Schieberegler: input, <output>, Formatfunktion, Callback(wert)
  Phys.regler = function (input, ausgabe, fmt, cb) {
    const aktualisieren = () => {
      const v = parseFloat(input.value);
      if (ausgabe) ausgabe.textContent = fmt(v);
      if (cb) cb(v);
    };
    input.addEventListener('input', aktualisieren);
    aktualisieren();
  };
  // Umschalter (Knöpfe mit data-wert): Callback(wert)
  Phys.segment = function (container, cb) {
    const knoepfe = Array.from(container.querySelectorAll('button'));
    const setze = k => knoepfe.forEach(x => {
      x.classList.toggle('aktiv', x === k);
      x.setAttribute('aria-pressed', String(x === k));
    });
    knoepfe.forEach(k => k.addEventListener('click', () => { setze(k); cb(k.dataset.wert); }));
    const start = knoepfe.find(k => k.classList.contains('aktiv')) || knoepfe[0];
    setze(start);
    cb(start.dataset.wert);
  };

  /* ---------- Leitung: Linienzug, auf dem sich Elektronen bewegen ---------- */
  Phys.Leitung = class {
    constructor(punkte) {
      this.p = punkte;
      this.seg = [];
      this.L = 0;
      for (let i = 1; i < punkte.length; i++) {
        const [x0, y0] = punkte[i - 1], [x1, y1] = punkte[i];
        const d = Math.hypot(x1 - x0, y1 - y0);
        this.seg.push({ x0, y0, x1, y1, d, start: this.L });
        this.L += d;
      }
    }
    // Punkt und Richtung bei Bogenlänge s (läuft zyklisch)
    punktBei(s) {
      s = ((s % this.L) + this.L) % this.L;
      let g = this.seg[this.seg.length - 1];
      for (const q of this.seg) { if (s <= q.start + q.d) { g = q; break; } }
      const t = (s - g.start) / g.d;
      return { x: g.x0 + (g.x1 - g.x0) * t, y: g.y0 + (g.y1 - g.y0) * t,
               wx: (g.x1 - g.x0) / g.d, wy: (g.y1 - g.y0) / g.d };
    }
  };

  Phys.zeichneDraht = function (ctx, leitung, breite = 4) {
    ctx.save();
    ctx.lineWidth = breite; ctx.strokeStyle = Phys.f.draht;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.beginPath();
    leitung.p.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
    ctx.stroke();
    ctx.restore();
  };

  // Elektronen (blaue Kugeln mit Minuszeichen) entlang der Leitung.
  // phase: Verschiebung in px, abstand: Abstand der Elektronen in px,
  // opt.verdeckt(x, y) → true: dort nicht zeichnen (z. B. hinter Bauteilen)
  Phys.elektronen = function (ctx, leitung, phase, abstand, opt = {}) {
    const r = opt.radius || 6;
    ctx.save();
    for (let s = ((phase % abstand) + abstand) % abstand; s < leitung.L; s += abstand) {
      const p = leitung.punktBei(s);
      if (opt.verdeckt && opt.verdeckt(p.x, p.y)) continue;
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, ZWEI_PI);
      ctx.fillStyle = Phys.f.elektron; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(p.x - r * 0.5, p.y); ctx.lineTo(p.x + r * 0.5, p.y); ctx.stroke();
    }
    ctx.restore();
  };

  // Richtungspfeile (technische Stromrichtung), seitlich versetzt neben dem Draht
  Phys.pfeile = function (ctx, leitung, phase, abstand, opt = {}) {
    const g = opt.groesse || 8, versatz = opt.versatz || 0;
    ctx.save();
    ctx.fillStyle = Phys.f.strom;
    for (let s = ((phase % abstand) + abstand) % abstand; s < leitung.L; s += abstand) {
      const p = leitung.punktBei(s);
      const x = p.x + p.wy * versatz, y = p.y - p.wx * versatz;
      if (opt.verdeckt && opt.verdeckt(x, y)) continue;
      ctx.save();
      ctx.translate(x, y); ctx.rotate(Math.atan2(p.wy, p.wx));
      ctx.beginPath(); ctx.moveTo(g, 0); ctx.lineTo(-g * 0.8, -g * 0.85); ctx.lineTo(-g * 0.8, g * 0.85);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  };

  // Elektronengeschwindigkeit (px/s) – anschaulich skaliert, wächst mit der Stromstärke
  Phys.elektronenTempo = I => 120 * Math.pow(Math.max(I, 0), 0.7);

  /* ---------- Text ---------- */
  Phys.text = function (ctx, s, x, y, o = {}) {
    ctx.save();
    ctx.font = (o.fett ? '700 ' : '500 ') + (o.groesse || 16) + 'px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.fillStyle = o.farbe || Phys.f.text;
    ctx.textAlign = o.ausr || 'center';
    ctx.textBaseline = o.basis || 'middle';
    ctx.fillText(s, x, y);
    ctx.restore();
  };

  /* ---------- Schaltsymbole (nach DIN) ---------- */
  function linie(ctx, x0, y0, x1, y1) { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }

  // Spannungsquelle senkrecht: Pluspol oben (y1), Minuspol unten (y2)
  Phys.batterie = function (ctx, x, y1, y2, beschriftung) {
    const cy = (y1 + y2) / 2;
    ctx.save();
    ctx.strokeStyle = Phys.f.draht; ctx.lineCap = 'round';
    ctx.lineWidth = 4;
    linie(ctx, x, y1, x, cy - 7); linie(ctx, x, cy + 7, x, y2);
    linie(ctx, x - 22, cy - 7, x + 22, cy - 7);        // lange Platte = Pluspol
    ctx.lineWidth = 8;
    linie(ctx, x - 12, cy + 7, x + 12, cy + 7);        // kurze, dicke Platte = Minuspol
    Phys.text(ctx, '+', x - 34, cy - 7, { groesse: 24, fett: true, farbe: Phys.f.plus });
    Phys.text(ctx, '−', x - 34, cy + 9, { groesse: 24, fett: true, farbe: Phys.f.elektron });
    if (beschriftung) Phys.text(ctx, beschriftung, x + 32, cy, { groesse: 18, fett: true, ausr: 'left', farbe: Phys.f.spannung });
    ctx.restore();
  };

  // Schalter waagerecht, offen: 0 = geschlossen … 1 = offen
  Phys.schalter = function (ctx, x, y, offen, breite = 64) {
    const a = x - breite / 2, b = x + breite / 2;
    ctx.save();
    ctx.fillStyle = Phys.f.surface; ctx.fillRect(a, y - 9, breite, 18);   // Draht unterbrechen
    ctx.lineCap = 'round';
    ctx.strokeStyle = Phys.f.draht; ctx.lineWidth = 4;
    linie(ctx, a - 12, y, a, y); linie(ctx, b, y, b + 12, y);     // kurze Anschlussdrähte
    ctx.fillStyle = Phys.f.surface;
    [a, b].forEach(px => { ctx.beginPath(); ctx.arc(px, y, 6, 0, ZWEI_PI); ctx.fill(); ctx.stroke(); });
    const w = -offen * 0.62;                                        // Hebel in Akzentfarbe
    ctx.strokeStyle = Phys.f.accent; ctx.lineWidth = 6;
    linie(ctx, a, y, a + breite * Math.cos(w), y + breite * Math.sin(w));
    ctx.restore();
  };

  // Glühlampe: hell 0…1
  Phys.lampe = function (ctx, x, y, r, hell) {
    ctx.save();
    if (hell > 0.01) {
      const g = ctx.createRadialGradient(x, y, r * 0.4, x, y, r * (1.5 + hell * 1.6));
      g.addColorStop(0, 'rgba(255,205,50,' + (0.75 * hell) + ')');
      g.addColorStop(1, 'rgba(255,205,50,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - r * 4, y - r * 4, r * 8, r * 8);
    }
    ctx.beginPath(); ctx.arc(x, y, r, 0, ZWEI_PI);
    ctx.fillStyle = Phys.f.surface; ctx.fill();
    ctx.fillStyle = 'rgba(255,214,64,' + (0.1 + 0.9 * hell) + ')'; ctx.fill();
    ctx.strokeStyle = Phys.f.draht; ctx.lineWidth = 4; ctx.stroke();
    const d = r * 0.7071;
    ctx.lineCap = 'round';
    linie(ctx, x - d, y - d, x + d, y + d); linie(ctx, x - d, y + d, x + d, y - d);
    ctx.restore();
  };

  // Widerstand als Rechteck; waerme 0…1 lässt ihn orange glühen
  Phys.widerstand = function (ctx, x, y, o = {}) {
    const w = o.w || 64, h = o.h || 26, waerme = o.waerme || 0;
    ctx.save();
    ctx.translate(x, y);
    if (o.senkrecht) ctx.rotate(Math.PI / 2);
    if (waerme > 0.02) {
      const g = ctx.createRadialGradient(0, 0, 6, 0, 0, w * 0.95);
      g.addColorStop(0, 'rgba(255,140,0,' + (0.5 * waerme) + ')');
      g.addColorStop(1, 'rgba(255,140,0,0)');
      ctx.fillStyle = g; ctx.fillRect(-w, -w, 2 * w, 2 * w);
    }
    ctx.fillStyle = Phys.f.surface; ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.fillStyle = 'rgba(255,140,0,' + (0.1 + 0.55 * waerme) + ')'; ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.strokeStyle = Phys.f.draht; ctx.lineWidth = 4; ctx.lineJoin = 'round';
    ctx.strokeRect(-w / 2, -h / 2, w, h);
    ctx.restore();
  };

  // Messgerät (Kreis mit Buchstabe)
  Phys.messgeraet = function (ctx, x, y, r, buchstabe, farbe) {
    ctx.save();
    ctx.beginPath(); ctx.arc(x, y, r, 0, ZWEI_PI);
    ctx.fillStyle = Phys.f.surface; ctx.fill();
    ctx.strokeStyle = Phys.f.draht; ctx.lineWidth = 3.5; ctx.stroke();
    Phys.text(ctx, buchstabe, x, y + 1, { groesse: r * 1.1, fett: true, farbe: farbe || Phys.f.text });
    ctx.restore();
  };

  // Verbindungspunkt
  Phys.knoten = function (ctx, x, y) {
    ctx.save();
    ctx.beginPath(); ctx.arc(x, y, 5.5, 0, ZWEI_PI);
    ctx.fillStyle = Phys.f.draht; ctx.fill();
    ctx.restore();
  };

  /* ---------- Diagramm-Achsen ----------
     b = {x, y, w, h} (Zeichenfläche des Diagramms in Canvas-Koordinaten)
     o = {xmax, ymax, xticks[], yticks[], xfmt(v), yfmt(v), xlabel, ylabel}
     Gibt {px(x), py(y)} zum Umrechnen der Messwerte zurück. */
  Phys.diagramm = function (ctx, b, o) {
    const px = x => b.x + x / o.xmax * b.w;
    const py = y => b.y + b.h - y / o.ymax * b.h;
    ctx.save();
    ctx.lineWidth = 1; ctx.strokeStyle = Phys.f.gitter;
    o.xticks.forEach(t => {
      linie(ctx, px(t), b.y, px(t), b.y + b.h);
      Phys.text(ctx, o.xfmt(t), px(t), b.y + b.h + 16, { groesse: 13, farbe: Phys.f.muted });
    });
    o.yticks.forEach(t => {
      linie(ctx, b.x, py(t), b.x + b.w, py(t));
      Phys.text(ctx, o.yfmt(t), b.x - 8, py(t), { groesse: 13, farbe: Phys.f.muted, ausr: 'right' });
    });
    ctx.strokeStyle = Phys.f.text; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x, b.y + b.h); ctx.lineTo(b.x + b.w, b.y + b.h); ctx.stroke();
    Phys.text(ctx, o.xlabel, b.x + b.w, b.y + b.h + 40, { groesse: 14, fett: true, ausr: 'right' });
    Phys.text(ctx, o.ylabel, b.x - 8, b.y - 16, { groesse: 14, fett: true, ausr: 'left' });
    ctx.restore();
    return { px, py };
  };
})();
