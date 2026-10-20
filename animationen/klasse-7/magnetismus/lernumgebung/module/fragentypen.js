/* ==========================================================
   FRAGEN-ENGINE: Textformat, Zeichnungen (SZENEN) und alle Fragetypen
   single, multi, luecke, reihenfolge, zuordnen, richtung, hotspot
   ========================================================== */
(function () {
  'use strict';
  var G = window.G, el = G.el;
  var F = window.F = { salt: 1 };

  /* ---------- Text ---------- */
  F.esc = function (t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  F.fmt = function (t) {
    return F.esc(t).replace(/\*\*(.+?)\*\*/g, function (m, w) {
      var teile = w.split('|'), anzeige = teile[0], key = teile[1] || teile[0];
      if (window.GLOSSAR && window.GLOSSAR[key]) return '<button type="button" class="fw" data-fw="' + key + '">' + anzeige + '</button>';
      return '<strong>' + anzeige + '</strong>';
    });
  };
  F.hash = function (s) { var h = 5381, i; for (i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h; };
  F.mischen = function (arr, rnd) {
    var a = arr.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) { j = Math.floor(rnd() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };
  F.rnd = function (q) { return G.zufall(F.hash(q.id) + F.salt * 7919); };

  /* ---------- SVG-Bausteine ---------- */
  F.svgMagnet = function (x, y, w, h, o) {
    o = o || {};
    var nz = o.nZuerst !== false, v = !!o.senkrecht, gr = o.gr || Math.min(30, (v ? Math.min(w, h / 2) : Math.min(w / 2, h)) * 0.62);
    var a = v ? [x, y, w, h / 2] : [x, y, w / 2, h], b = v ? [x, y + h / 2, w, h / 2] : [x + w / 2, y, w / 2, h];
    var n = nz ? a : b, s = nz ? b : a;
    function r(p, f) { return '<rect x="' + p[0] + '" y="' + p[1] + '" width="' + p[2] + '" height="' + p[3] + '" fill="' + f + '"/>'; }
    function t(p, c) { return '<text x="' + (p[0] + p[2] / 2) + '" y="' + (p[1] + p[3] / 2) + '" font-size="' + gr + '" font-weight="bold" text-anchor="middle" dominant-baseline="central" fill="#fff" stroke="#000" stroke-opacity=".75" stroke-width="' + (gr * 0.16) + '" paint-order="stroke" stroke-linejoin="round" font-family="Arial,Helvetica,sans-serif">' + c + '</text>'; }
    var graue = !!o.unbekannt;
    var out = r(n, graue ? '#d0d5de' : G.N) + r(s, graue ? '#d0d5de' : G.S);
    out += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="none" stroke="#111" stroke-width="3.5"/>';
    out += v ? '<line x1="' + x + '" y1="' + (y + h / 2) + '" x2="' + (x + w) + '" y2="' + (y + h / 2) + '" stroke="#111" stroke-width="3"/>'
             : '<line x1="' + (x + w / 2) + '" y1="' + y + '" x2="' + (x + w / 2) + '" y2="' + (y + h) + '" stroke="#111" stroke-width="3"/>';
    if (graue) out += t(a, '?') + t(b, '?'); else out += t(n, 'N') + t(s, 'S');
    return out;
  };
  F.svgKompass = function (x, y, r, ang, o) {
    o = o || {};
    var L = r * 0.84, w = r * 0.28, c = Math.cos(ang), s = Math.sin(ang), out = '';
    out += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#fff" stroke="#111" stroke-width="3"/>';
    if (o.leer) return out + '<text x="' + x + '" y="' + y + '" font-size="' + (r * 0.9) + '" text-anchor="middle" dominant-baseline="central" font-family="Arial,sans-serif" fill="#555">?</text>';
    function halb(sg, f) {
      return '<polygon points="' + (x + sg * c * L) + ',' + (y + sg * s * L) + ' ' + (x - s * w) + ',' + (y + c * w) + ' ' + (x + s * w) + ',' + (y - c * w) + '" fill="' + f + '" stroke="#111" stroke-width="1.8" stroke-linejoin="round"/>';
    }
    out += halb(1, G.N) + halb(-1, G.S) + '<circle cx="' + x + '" cy="' + y + '" r="' + Math.max(2, r * 0.07) + '" fill="#111"/>';
    return out;
  };
  F.svgBeschriftung = function (x, y, t, gr, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" font-size="' + (gr || 18) + '" ' + (o.fett ? 'font-weight="bold" ' : '') + 'text-anchor="' + (o.ausr || 'middle') + '" font-family="Arial,Helvetica,sans-serif" fill="#111">' + F.esc(t) + '</text>';
  };
  function pfadSvg(pts, umkehren, farbe) {
    var d = 'M' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' L');
    var m = Math.floor(pts.length / 2), a = pts[Math.max(0, m - 2)], b = pts[Math.min(pts.length - 1, m + 2)];
    var ang = Math.atan2(b[1] - a[1], b[0] - a[0]) + (umkehren ? Math.PI : 0), q = pts[m];
    var tri = [[q[0] + Math.cos(ang) * 8, q[1] + Math.sin(ang) * 8], [q[0] + Math.cos(ang + 2.5) * 8, q[1] + Math.sin(ang + 2.5) * 8], [q[0] + Math.cos(ang - 2.5) * 8, q[1] + Math.sin(ang - 2.5) * 8]];
    return '<path d="' + d + '" fill="none" stroke="' + farbe + '" stroke-width="2.2" stroke-linejoin="round"/><polygon points="' + tri.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '" fill="' + farbe + '"/>';
  }

  /* ---------- Zeichnungen zu Fragen ---------- */
  F.SZENEN = {
    'tabelle-ausschluss': function () {
      return '<table class="tabelle"><caption class="nur-vorlesen">Getestete Gegenstände</caption><thead><tr><th>Gegenstand</th><th>besteht aus</th><th>Ergebnis</th></tr></thead><tbody>' +
        '<tr><td>A</td><td>Kupfer und Zink</td><td>✗ wird nicht angezogen</td></tr>' +
        '<tr><td>B</td><td>Kupfer und Aluminium</td><td>✗ wird nicht angezogen</td></tr>' +
        '<tr><td>C</td><td>Zink und Eisen</td><td>✓ wird angezogen</td></tr>' +
        '<tr><td>D</td><td>Kupfer und Eisen</td><td>✓ wird angezogen</td></tr></tbody></table>';
    },
    'drei-magnete': function () {
      var s = '<svg viewBox="0 0 520 130" class="szene" role="img" aria-label="Drei Magnete nebeneinander: A links mit Nordpol links und Südpol rechts, B in der Mitte mit unbekannten Polen, C rechts mit Südpol links und Nordpol rechts">';
      s += F.svgMagnet(10, 45, 150, 50, {});
      s += F.svgMagnet(185, 45, 150, 50, { unbekannt: true });
      s += F.svgMagnet(360, 45, 150, 50, { nZuerst: false });
      s += F.svgBeschriftung(85, 28, 'A', 22, { fett: true }) + F.svgBeschriftung(260, 28, 'B', 22, { fett: true }) + F.svgBeschriftung(435, 28, 'C', 22, { fett: true });
      s += F.svgBeschriftung(172, 118, 'ziehen sich an', 15) + F.svgBeschriftung(347, 118, 'stoßen sich ab', 15);
      return s + '</svg>';
    },
    'zwei-magnete-anziehend': function () {
      var s = '<svg viewBox="0 0 520 130" class="szene" role="img" aria-label="Zwei Magnete nebeneinander, bei beiden links der Südpol und rechts der Nordpol. Zwischen ihnen ein Spalt mit Fragezeichen">';
      s += F.svgMagnet(30, 40, 170, 50, { nZuerst: false }) + F.svgMagnet(320, 40, 170, 50, { nZuerst: false });
      s += '<rect x="215" y="35" width="90" height="60" rx="8" fill="none" stroke="#1F3864" stroke-width="3" stroke-dasharray="7 5"/>';
      s += F.svgBeschriftung(260, 66, '?', 34, { fett: true }) + F.svgBeschriftung(260, 115, 'Spalt', 16);
      return s + '</svg>';
    },
    'feldlinien-abc': function () {
      var poles = [{ x: 131, y: 95, q: 1 }, { x: 169, y: 95, q: -1 }], rect = { x: 100, y: 78, w: 100, h: 34 };
      var linien = G.linien(poles, [rect], { x0: 6, y0: 6, x1: 294, y1: 184 }, { n: 14, h: 2.5 });
      function bild(kennung, inhalt) {
        return '<figure class="abc"><svg viewBox="0 0 300 190" class="szene" role="img" aria-label="Zeichnung ' + kennung + '">' + inhalt +
          F.svgMagnet(rect.x, rect.y, rect.w, rect.h, {}) + '</svg><figcaption>Zeichnung ' + kennung + '</figcaption></figure>';
      }
      var a = '', b = '', c = '';
      linien.forEach(function (pts, i) {
        c += pfadSvg(pts, false, G.M); b += pfadSvg(pts, true, G.M);
        if (i % 2 === 0) a += pfadSvg(pts, false, G.M);
      });
      var kreuz = '<path d="M108,76 C112,8 190,8 200,70" fill="none" stroke="#1F3864" stroke-width="2.2"/><polygon points="161,21 151,16 151,26" fill="#1F3864"/>' +
                  '<path d="M126,76 C128,10 204,6 214,74" fill="none" stroke="#1F3864" stroke-width="2.2"/><polygon points="178,25 168,20 168,30" fill="#1F3864"/>';
      return '<div class="abc-reihe">' + bild('A', a + kreuz) + bild('B', b) + bild('C', c) + '</div>';
    }
  };

  /* ---------- Rückmeldungs-Hilfen ---------- */
  function marke(span, ok) {
    span.textContent = ok ? '✓ richtig' : '✗ falsch';
    span.className = 'marke ' + (ok ? 'm-ok' : 'm-falsch');
  }
  function keineMarke(span) { span.textContent = ''; span.className = 'marke'; }

  var TYPEN = F.TYPEN = {};

  /* ---------- single ---------- */
  TYPEN.single = function (q, host, ctx) {
    var items = q.antworten.map(function (a) { return { a: a }; });
    if (!q.fest) items = F.mischen(items, ctx.rnd);
    var name = 'o' + Math.random().toString(36).slice(2, 8);
    var gruppe = el('div', { 'class': 'optionen', role: 'radiogroup', 'aria-label': 'Antworten' });
    var inputs = [], marken = [], labels = [];
    items.forEach(function (it, k) {
      var inp = el('input', { type: 'radio', name: name, value: String(k) });
      var m = el('span', { 'class': 'marke' });
      var lab = el('label', { 'class': 'opt' }, [inp, el('span', { 'class': 'opt-t', html: F.fmt(it.a.t) }), m]);
      inputs.push(inp); marken.push(m); labels.push(lab); gruppe.appendChild(lab);
    });
    host.appendChild(gruppe);
    function sel() { for (var i = 0; i < inputs.length; i++) if (inputs[i].checked) return i; return -1; }
    function leeren() { labels.forEach(function (l, i) { l.classList.remove('richtig', 'falsch'); keineMarke(marken[i]); }); }
    return {
      hatAntwort: function () { return sel() >= 0; },
      fehlt: 'Wähle zuerst eine Antwort.',
      pruefe: function () {
        var i = sel(), ok = !!items[i].a.ok;
        labels[i].classList.add(ok ? 'richtig' : 'falsch'); marke(marken[i], ok);
        return { ok: ok, hinweise: ok ? [] : [items[i].a.h || 'Das stimmt nicht.'] };
      },
      nochmal: function () { var i = sel(); if (i >= 0) inputs[i].checked = false; leeren(); },
      loesung: function () {
        leeren();
        items.forEach(function (it, i) { if (it.a.ok) { inputs[i].checked = true; labels[i].classList.add('richtig'); marke(marken[i], true); } });
      },
      sperren: function (b) { inputs.forEach(function (i) { i.disabled = b; }); },
      fokus: function () { inputs[0].focus(); }
    };
  };

  /* ---------- multi ---------- */
  TYPEN.multi = function (q, host, ctx) {
    var items = F.mischen(q.antworten.map(function (a) { return { a: a }; }), ctx.rnd);
    var gruppe = el('div', { 'class': 'optionen', role: 'group', 'aria-label': 'Antworten (mehrere möglich)' });
    var inputs = [], marken = [], labels = [];
    items.forEach(function (it) {
      var inp = el('input', { type: 'checkbox' });
      var m = el('span', { 'class': 'marke' });
      var lab = el('label', { 'class': 'opt' }, [inp, el('span', { 'class': 'opt-t', html: F.fmt(it.a.t) }), m]);
      inputs.push(inp); marken.push(m); labels.push(lab); gruppe.appendChild(lab);
    });
    host.appendChild(gruppe);
    function leeren() { labels.forEach(function (l, i) { l.classList.remove('richtig', 'falsch'); keineMarke(marken[i]); }); }
    return {
      hatAntwort: function () { return inputs.some(function (i) { return i.checked; }); },
      fehlt: 'Kreuze mindestens eine Antwort an.',
      pruefe: function () {
        var ok = true, hin = [];
        items.forEach(function (it, i) {
          var soll = !!it.a.ok, ist = inputs[i].checked;
          if (soll === ist) { if (ist) { labels[i].classList.add('richtig'); marke(marken[i], true); } return; }
          ok = false; labels[i].classList.add('falsch');
          marken[i].textContent = ist ? '✗ falsch angekreuzt' : '✗ fehlt'; marken[i].className = 'marke m-falsch';
          hin.push(ist ? '„' + it.a.t + '“ stimmt nicht. ' + (it.a.h || '') : 'Du hast „' + it.a.t + '“ nicht angekreuzt. ' + (it.a.h || ''));
        });
        return { ok: ok, hinweise: hin };
      },
      nochmal: function () { leeren(); },
      loesung: function () {
        leeren();
        items.forEach(function (it, i) { inputs[i].checked = !!it.a.ok; if (it.a.ok) { labels[i].classList.add('richtig'); marke(marken[i], true); } });
      },
      sperren: function (b) { inputs.forEach(function (i) { i.disabled = b; }); },
      fokus: function () { inputs[0].focus(); }
    };
  };

  /* ---------- luecke ---------- */
  TYPEN.luecke = function (q, host, ctx) {
    var teile = q.text.split('___'), n = teile.length - 1, i;
    var belegt = [], aktiv = 0, gesperrt = false, status = [];
    for (i = 0; i < n; i++) belegt.push(null);
    var woerter = F.mischen(q.woerter.map(function (w, k) { return { w: w, k: k }; }), ctx.rnd);
    var satz = el('p', { 'class': 'luecken-satz' });
    var gapBtns = [];
    teile.forEach(function (t, k) {
      satz.appendChild(document.createTextNode(t));
      if (k < n) {
        var g = el('button', { type: 'button', 'class': 'luecke', onclick: function () { klickLuecke(k); } });
        gapBtns.push(g); satz.appendChild(g);
      }
    });
    var speicher = el('div', { 'class': 'wortspeicher', role: 'group', 'aria-label': 'Wortspeicher' });
    var wortBtns = woerter.map(function (w) {
      var b = el('button', { type: 'button', 'class': 'chip', text: w.w, onclick: function () { setzeWort(w.k); } });
      speicher.appendChild(b); return b;
    });
    host.appendChild(satz); host.appendChild(speicher);
    function leerIndex() { for (var k = 0; k < n; k++) if (belegt[k] == null) return k; return -1; }
    function zeichne() {
      gapBtns.forEach(function (g, k) {
        var w = belegt[k] != null ? q.woerter[belegt[k]] : null;
        g.textContent = (status[k] === true ? '✓ ' : status[k] === false ? '✗ ' : '') + (w || '…');
        g.className = 'luecke' + (w ? ' voll' : '') + (aktiv === k && !gesperrt ? ' aktiv' : '') + (status[k] === true ? ' richtig' : status[k] === false ? ' falsch' : '');
        g.disabled = gesperrt;
        g.setAttribute('aria-label', 'Lücke ' + (k + 1) + (w ? ': ' + w + (status[k] === true ? ', richtig' : status[k] === false ? ', falsch' : '') : ', leer'));
      });
      wortBtns.forEach(function (b, j) {
        var k = woerter[j].k, benutzt = belegt.indexOf(k) >= 0;
        b.disabled = gesperrt || benutzt;
      });
    }
    function setzeWort(k) {
      var g = (aktiv >= 0 && belegt[aktiv] == null) ? aktiv : leerIndex();
      if (g < 0) return;
      belegt[g] = k; status = []; aktiv = leerIndex(); zeichne();
    }
    function klickLuecke(k) {
      if (belegt[k] != null) belegt[k] = null;
      status = []; aktiv = k; zeichne();
    }
    zeichne();
    function bewerte() {
      var ok = [], g, j, tg, gruppe, rest, k;
      for (k = 0; k < n; k++) ok.push(false);
      var inGruppe = {};
      (q.tauschbar || []).forEach(function (grp, gi) { grp.forEach(function (idx) { inGruppe[idx] = gi; }); });
      for (k = 0; k < n; k++) if (inGruppe[k] == null) ok[k] = q.woerter[belegt[k]] === q.loesung[k];
      (q.tauschbar || []).forEach(function (grp) {
        rest = grp.map(function (idx) { return q.loesung[idx]; });
        grp.forEach(function (idx) {
          var w = q.woerter[belegt[idx]], pos = rest.indexOf(w);
          if (pos >= 0) { ok[idx] = true; rest.splice(pos, 1); }
        });
      });
      return ok;
    }
    return {
      hatAntwort: function () { return leerIndex() < 0; },
      fehlt: 'Fülle zuerst alle Lücken.',
      pruefe: function () {
        status = bewerte(); zeichne();
        var alle = status.every(function (s) { return s; });
        return { ok: alle, hinweise: alle ? [] : ['Prüfe die Lücken mit ✗. Tippe auf eine Lücke, um das Wort zu entfernen.'] };
      },
      nochmal: function () {
        for (var k = 0; k < n; k++) if (status[k] === false) belegt[k] = null;
        status = []; aktiv = leerIndex(); zeichne();
      },
      loesung: function () {
        for (var k = 0; k < n; k++) belegt[k] = q.woerter.indexOf(q.loesung[k]);
        status = []; for (k = 0; k < n; k++) status.push(true);
        aktiv = -1; zeichne();
      },
      sperren: function (b) { gesperrt = b; zeichne(); },
      fokus: function () { gapBtns[0].focus(); }
    };
  };

  /* ---------- reihenfolge ---------- */
  TYPEN.reihenfolge = function (q, host, ctx) {
    var folge = q.schritte.map(function (t, i) { return { t: t, i: i }; });
    do { folge = F.mischen(folge, ctx.rnd); } while (folge.every(function (s, i) { return s.i === i; }));
    var liste = el('ol', { 'class': 'reihenfolge' });
    host.appendChild(liste);
    var status = [], gesperrt = false;
    function zeichne() {
      liste.innerHTML = '';
      folge.forEach(function (s, k) {
        var hoch = el('button', { type: 'button', 'class': 'pfeilknopf', text: '↑', 'aria-label': 'Nach oben: ' + s.t, onclick: function () { tausch(k, k - 1); } });
        var runter = el('button', { type: 'button', 'class': 'pfeilknopf', text: '↓', 'aria-label': 'Nach unten: ' + s.t, onclick: function () { tausch(k, k + 1); } });
        hoch.disabled = gesperrt || k === 0; runter.disabled = gesperrt || k === folge.length - 1;
        var m = el('span', { 'class': 'marke' });
        if (status[k] != null) marke(m, status[k]);
        liste.appendChild(el('li', { 'class': 'schritt' + (status[k] === true ? ' richtig' : status[k] === false ? ' falsch' : '') }, [
          el('span', { 'class': 'nr', text: String(k + 1) }), el('span', { 'class': 'opt-t', text: s.t }), m, el('span', { 'class': 'knoepfe' }, [hoch, runter])
        ]));
      });
    }
    var letzterFokus = null;
    function tausch(a, b) {
      if (b < 0 || b >= folge.length) return;
      var t = folge[a]; folge[a] = folge[b]; folge[b] = t; status = []; zeichne();
      var ziel = liste.children[b]; if (ziel) { var bt = ziel.querySelectorAll('button'); var nutz = (b > a) ? bt[1] : bt[0]; if (nutz && !nutz.disabled) nutz.focus(); else if (bt[0] && !bt[0].disabled) bt[0].focus(); else bt[1].focus(); }
    }
    zeichne();
    return {
      hatAntwort: function () { return true; }, fehlt: '',
      pruefe: function () {
        status = folge.map(function (s, k) { return s.i === k; }); zeichne();
        var ok = status.every(function (s) { return s; });
        return { ok: ok, hinweise: ok ? [] : ['Die Schritte mit ✗ stehen noch nicht an der richtigen Stelle. Verschiebe sie mit den Pfeilknöpfen.'] };
      },
      nochmal: function () { status = []; zeichne(); },
      loesung: function () { folge.sort(function (a, b) { return a.i - b.i; }); status = folge.map(function () { return true; }); zeichne(); },
      sperren: function (b) { gesperrt = b; zeichne(); },
      fokus: function () { var b = liste.querySelector('button:not([disabled])'); if (b) b.focus(); }
    };
  };

  /* ---------- zuordnen (antippen, dann Feld antippen) ---------- */
  TYPEN.zuordnen = function (q, host, ctx) {
    var karten = F.mischen(q.karten.map(function (k, i) { return { k: k, i: i, platz: -1 }; }), ctx.rnd);
    var gewaehlt = null, status = {}, gesperrt = false;
    var pool = el('div', { 'class': 'pool', role: 'group', 'aria-label': 'Karten zum Zuordnen' });
    var felder = el('div', { 'class': 'felder f' + q.felder.length });
    host.appendChild(el('p', { 'class': 'hilfetext', text: 'Tippe zuerst eine Karte an. Tippe dann auf das passende Feld. Eine abgelegte Karte tippst du an, um sie zurückzunehmen.' }));
    host.appendChild(pool); host.appendChild(felder);
    function chip(c, inFeld) {
      var st = status[c.i];
      var b = el('button', { type: 'button', 'class': 'chip' + (gewaehlt === c ? ' gewaehlt' : '') + (st === true ? ' richtig' : st === false ? ' falsch' : ''),
        text: (st === true ? '✓ ' : st === false ? '✗ ' : '') + c.k.t, 'aria-pressed': gewaehlt === c ? 'true' : 'false',
        onclick: function (e) {
          e.stopPropagation();
          if (inFeld) { c.platz = -1; status = {}; gewaehlt = null; }
          else gewaehlt = (gewaehlt === c ? null : c);
          zeichne();
        } });
      b.disabled = gesperrt;
      return b;
    }
    function legeAb(fi) {
      if (!gewaehlt || gesperrt) return;
      gewaehlt.platz = fi; gewaehlt = null; status = {}; zeichne();
    }
    function zeichne() {
      pool.innerHTML = ''; felder.innerHTML = '';
      var offen = karten.filter(function (c) { return c.platz < 0; });
      offen.forEach(function (c) { pool.appendChild(chip(c, false)); });
      if (!offen.length) pool.appendChild(el('span', { 'class': 'leer', text: 'Alle Karten sind abgelegt.' }));
      q.felder.forEach(function (name, fi) {
        var inh = el('div', { 'class': 'feldinhalt' });
        karten.filter(function (c) { return c.platz === fi; }).forEach(function (c) { inh.appendChild(chip(c, true)); });
        var kopf = el('button', { type: 'button', 'class': 'feldkopf', onclick: function () { legeAb(fi); }, 'aria-label': 'Hier ablegen: ' + name }, [document.createTextNode(name)]);
        kopf.disabled = gesperrt || !gewaehlt;
        var fl = el('div', { 'class': 'feld' + (gewaehlt && !gesperrt ? ' bereit' : ''), onclick: function () { legeAb(fi); } }, [kopf, inh]);
        felder.appendChild(fl);
      });
    }
    zeichne();
    return {
      hatAntwort: function () { return karten.every(function (c) { return c.platz >= 0; }); },
      fehlt: 'Lege zuerst alle Karten in die Felder.',
      pruefe: function () {
        var ok = true, hin = [];
        status = {};
        karten.forEach(function (c) {
          var r = c.platz === c.k.ziel; status[c.i] = r;
          if (!r) { ok = false; hin.push('„' + c.k.t + '“: ' + (c.k.h || 'Das gehört in ein anderes Feld.')); }
        });
        zeichne();
        return { ok: ok, hinweise: hin };
      },
      nochmal: function () { karten.forEach(function (c) { if (status[c.i] === false) c.platz = -1; }); status = {}; gewaehlt = null; zeichne(); },
      loesung: function () { karten.forEach(function (c) { c.platz = c.k.ziel; status[c.i] = true; }); gewaehlt = null; zeichne(); },
      sperren: function (b) { gesperrt = b; zeichne(); },
      fokus: function () { var b = pool.querySelector('button'); if (b) b.focus(); }
    };
  };

  /* ---------- richtung ---------- */
  var RICHTUNGEN = [['links', '←', 0], ['rechts', '→', 1], ['oben', '↑', 2], ['unten', '↓', 3]];
  var WINKEL = { rechts: 0, unten: Math.PI / 2, links: Math.PI, oben: -Math.PI / 2 };
  function richtungsKnoepfe(sofort, namePrefix) {
    var knoepfe = {}, zeile = el('div', { 'class': 'richtungsknoepfe', role: 'group', 'aria-label': namePrefix || 'Richtung' });
    RICHTUNGEN.forEach(function (r) {
      var b = el('button', { type: 'button', 'class': 'btn richtung', 'aria-pressed': 'false', 'aria-label': namePrefix ? namePrefix + ': nach ' + r[0] : 'nach ' + r[0],
        onclick: function () { sofort(r[0]); } }, [el('span', { 'class': 'pf', text: r[1] }), el('span', { text: ' ' + r[0] })]);
      knoepfe[r[0]] = b; zeile.appendChild(b);
    });
    return { zeile: zeile, markiere: function (d) { RICHTUNGEN.forEach(function (r) { knoepfe[r[0]].setAttribute('aria-pressed', r[0] === d ? 'true' : 'false'); }); },
             sperren: function (s) { RICHTUNGEN.forEach(function (r) { knoepfe[r[0]].disabled = s; }); } };
  }

  /* Kompassfeld: Szene mit Stabmagnet und drei Kompassen (Modul 7) */
  F.kompassSzene = function () {
    var d = 0.38 * 100;                                   // Pole bei ±d, halbe Magnetlänge 100
    var cx = 270, cy = 150;
    var poles = [{ x: cx - d, y: cy, q: 1 }, { x: cx + d, y: cy, q: -1 }];
    var punkte = [{ x: cx, y: cy - 78 }, { x: cx - 100 - 62, y: cy }, { x: cx + 100 + 62, y: cy }];
    punkte.forEach(function (p) { p.soll = G.Brichtung(poles, p.x, p.y); });
    return { poles: poles, punkte: punkte, cx: cx, cy: cy };
  };
  TYPEN.richtung = function (q, host, ctx) {
    if (q.modus === 'stapel') return typStapel(q, host, ctx);
    if (q.modus === 'kompass') return typKompass(q, host, ctx);
    return typPfeil(q, host, ctx);
  };

  function typPfeil(q, host) {
    var wahl = null, gesperrt = false;
    var k = richtungsKnoepfe(function (d) { if (gesperrt) return; wahl = d; k.markiere(d); }, 'Pfeilrichtung');
    host.appendChild(el('p', { 'class': 'hilfetext', text: 'Wähle die Richtung des Pfeils.' }));
    host.appendChild(k.zeile);
    return {
      hatAntwort: function () { return wahl != null; }, fehlt: 'Wähle zuerst eine Richtung.',
      pruefe: function () { var ok = wahl === q.loesung; return { ok: ok, hinweise: ok ? [] : [q.hinweisFalsch || 'Das stimmt nicht.'] }; },
      nochmal: function () { wahl = null; k.markiere(null); },
      loesung: function () { wahl = q.loesung; k.markiere(wahl); },
      sperren: function (b) { gesperrt = b; k.sperren(b); }
    };
  }

  function typKompass(q, host) {
    var sz = F.kompassSzene(), wahl = [null, null, null], status = [], gesperrt = false;
    var wrap = el('div', { 'class': 'kompassfeld' });
    var bild = el('div', { 'class': 'szene-rahmen' });
    host.appendChild(bild);
    var knopfZeilen = [];
    sz.punkte.forEach(function (p, i) {
      var kz = richtungsKnoepfe(function (d) { if (gesperrt) return; wahl[i] = d; status = []; kz.markiere(d); zeichne(); }, 'Kompass ' + (i + 1));
      knopfZeilen.push(kz);
      var zeile = el('div', { 'class': 'kompasszeile' }, [el('span', { 'class': 'kz-name', text: 'Kompass ' + (i + 1) + ':' }), kz.zeile]);
      wrap.appendChild(zeile);
    });
    host.appendChild(wrap);
    function zeichne() {
      var s = '<svg viewBox="0 0 540 270" class="szene" role="img" aria-label="Stabmagnet mit Nordpol links und Südpol rechts und drei nummerierten Kompassen: 1 über der Mitte, 2 links vom Nordpol, 3 rechts vom Südpol">';
      s += F.svgMagnet(sz.cx - 100, sz.cy - 22, 200, 44, {});
      sz.punkte.forEach(function (p, i) {
        var leer = wahl[i] == null;
        s += F.svgKompass(p.x, p.y, 26, leer ? 0 : WINKEL[wahl[i]], { leer: leer });
        var lx = p.x, ly = p.y - 38;
        if (i === 0) ly = p.y - 38;
        s += F.svgBeschriftung(lx, ly, String(i + 1), 20, { fett: true });
        if (status[i] != null) s += F.svgBeschriftung(p.x, p.y + 50, status[i] ? '✓ richtig' : '✗ falsch', 16, { fett: true });
      });
      s += '</svg>';
      bild.innerHTML = s;
    }
    zeichne();
    return {
      hatAntwort: function () { return wahl.every(function (w) { return w != null; }); }, fehlt: 'Stelle zuerst alle drei Kompasse ein.',
      pruefe: function () {
        status = sz.punkte.map(function (p, i) { return wahl[i] === p.soll; }); zeichne();
        var ok = status.every(function (s) { return s; });
        return { ok: ok, hinweise: ok ? [] : [q.hinweisFalsch] };
      },
      nochmal: function () { sz.punkte.forEach(function (p, i) { if (status[i] === false) { wahl[i] = null; knopfZeilen[i].markiere(null); } }); status = []; zeichne(); },
      loesung: function () { sz.punkte.forEach(function (p, i) { wahl[i] = p.soll; knopfZeilen[i].markiere(p.soll); }); status = [true, true, true]; zeichne(); },
      sperren: function (b) { gesperrt = b; knopfZeilen.forEach(function (k) { k.sperren(b); }); }
    };
  }

  /* Stapel: zwei Magnete übereinander, der obere lässt sich umdrehen (Modul 3) */
  function stapelSvg(oben, status) {
    // oben: 'N' = oben liegt der Nordpol, unten (zum Nordpol des festen Magneten) zeigt dann der Südpol
    var s = '<svg viewBox="0 0 280 200" class="szene klein" role="img" aria-label="Zwei Magnete übereinander. Der untere ist fest, sein Nordpol ist oben. Beim oberen Magneten ist ' + (oben === 'N' ? 'oben der Nordpol und unten der Südpol' : 'oben der Südpol und unten der Nordpol') + '">';
    s += F.svgMagnet(40, 118, 200, 64, { senkrecht: true, nZuerst: true });
    s += F.svgMagnet(40, 26, 200, 64, { senkrecht: true, nZuerst: oben === 'N' });
    s += F.svgBeschriftung(140, 108, 'fest', 14);
    s += F.svgBeschriftung(140, 16, 'beweglich', 14);
    if (status != null) s += F.svgBeschriftung(140, 110, '', 12);
    return s + '</svg>';
  }
  function typStapel(q, host) {
    var aufgaben = [
      { text: 'Bild 1: Stelle den oberen Magneten so, dass sich beide anziehen.', soll: 'S', start: 'N', h: 'Unten liegt ein Nordpol. Zum Anziehen muss unten am oberen Magneten ein Südpol zeigen: ungleichnamige Pole ziehen sich an.' },
      { text: 'Bild 2: Stelle den oberen Magneten so, dass sich beide abstoßen.', soll: 'N', start: 'S', h: 'Unten liegt ein Nordpol. Zum Abstoßen muss unten am oberen Magneten ebenfalls ein Nordpol zeigen: gleichnamige Pole stoßen sich ab.' }
    ];
    // zustand[i]: welcher Pol zeigt nach unten (zum festen Magneten)? Start so, dass noch nichts stimmt.
    var unten = aufgaben.map(function (a) { return a.soll === 'S' ? 'N' : 'S'; }), status = [], gesperrt = false, bilder = [], knoepfe = [];
    var wrap = el('div', { 'class': 'stapelreihe' });
    aufgaben.forEach(function (a, i) {
      var bild = el('div', { 'class': 'szene-rahmen' });
      var b = G.knopf('Magnet umdrehen', function () { if (gesperrt) return; unten[i] = unten[i] === 'N' ? 'S' : 'N'; status = []; zeichne(); }, 'zweit');
      bilder.push(bild); knoepfe.push(b);
      wrap.appendChild(el('div', { 'class': 'stapel' }, [el('p', { 'class': 'hilfetext', text: a.text }), bild, b, el('p', { 'class': 'stapelstatus', 'aria-live': 'polite' })]));
    });
    host.appendChild(wrap);
    function zeichne() {
      aufgaben.forEach(function (a, i) {
        bilder[i].innerHTML = stapelSvg(unten[i] === 'S' ? 'N' : 'S');   // zeigt unten S, liegt oben N
        var st = wrap.children[i].querySelector('.stapelstatus');
        st.textContent = status[i] == null ? '' : (status[i] ? '✓ richtig' : '✗ falsch');
        st.className = 'stapelstatus' + (status[i] == null ? '' : status[i] ? ' m-ok' : ' m-falsch');
      });
    }
    zeichne();
    return {
      hatAntwort: function () { return true; }, fehlt: '',
      pruefe: function () {
        status = aufgaben.map(function (a, i) { return unten[i] === a.soll; }); zeichne();
        var ok = status.every(function (s) { return s; }), hin = [];
        status.forEach(function (s, i) { if (!s) hin.push(aufgaben[i].h); });
        return { ok: ok, hinweise: hin };
      },
      nochmal: function () { status = []; zeichne(); },
      loesung: function () { aufgaben.forEach(function (a, i) { unten[i] = a.soll; }); status = [true, true]; zeichne(); },
      sperren: function (b) { gesperrt = b; knoepfe.forEach(function (k) { k.disabled = b; }); },
      fokus: function () { knoepfe[0].focus(); }
    };
  }

  /* ---------- hotspot ---------- */
  TYPEN.hotspot = function (q, host) {
    var W = 640, H = 300, cx = 320, cy = 150, hl = 100;
    var cv = G.canvas(host, W, H, { drag: false, label: 'Stabmagnet mit Feldlinien. Tippe auf eine Stelle.' });
    cv.c.style.touchAction = 'manipulation'; cv.c.style.cursor = 'crosshair';
    var poles = [{ x: cx - 0.38 * hl, y: cy, q: 1 }, { x: cx + 0.38 * hl, y: cy, q: -1 }];
    var rect = { x: cx - hl, y: cy - 25, w: 2 * hl, h: 50 };
    var linien = G.linien(poles, [rect], { x0: 8, y0: 8, x1: W - 8, y1: H - 8 }, { n: 20, h: 2.5 });
    var marker = null, gesperrt = false, zeigeLoesung = false, ergebnis = null;
    function ok(p) {
      return Math.min(Math.hypot(p.x - (cx - hl), p.y - cy), Math.hypot(p.x - (cx + hl), p.y - cy)) < 0.55 * hl;
    }
    function zeichne() {
      var ctx = cv.ctx; ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
      G.zeichneLinien(ctx, linien, G.M, 2);
      G.magnet(ctx, rect.x, rect.y, rect.w, rect.h, {});
      if (zeigeLoesung) {
        ctx.save(); ctx.strokeStyle = '#111'; ctx.setLineDash([7, 5]); ctx.lineWidth = 3;
        [cx - hl, cx + hl].forEach(function (x) { ctx.beginPath(); ctx.arc(x, cy, 0.55 * hl, 0, 6.2832); ctx.stroke(); });
        ctx.restore();
      }
      if (marker) {
        ctx.save(); ctx.lineWidth = 4; ctx.strokeStyle = ergebnis == null ? '#E67E00' : (ergebnis ? G.S : G.N);
        ctx.fillStyle = 'rgba(255,255,255,.55)';
        ctx.beginPath(); ctx.arc(marker.x, marker.y, 14, 0, 6.2832); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(marker.x - 22, marker.y); ctx.lineTo(marker.x + 22, marker.y); ctx.moveTo(marker.x, marker.y - 22); ctx.lineTo(marker.x, marker.y + 22); ctx.stroke();
        ctx.restore();
      }
    }
    cv.c.addEventListener('pointerdown', function (e) {
      if (gesperrt) return; marker = cv.pos(e); ergebnis = null; zeichne();
    });
    zeichne();
    host.appendChild(el('p', { 'class': 'hilfetext', text: 'Tippe auf das Bild. Ein Fadenkreuz zeigt, wo du getippt hast. Tippe auf eine andere Stelle, um es zu verschieben.' }));
    return {
      hatAntwort: function () { return !!marker; }, fehlt: 'Tippe zuerst auf eine Stelle im Bild.',
      pruefe: function () { var r = ok(marker); ergebnis = r; zeichne(); return { ok: r, hinweise: r ? [] : [q.hinweisFalsch] }; },
      nochmal: function () { marker = null; ergebnis = null; zeichne(); },
      loesung: function () { zeigeLoesung = true; ergebnis = null; zeichne(); },
      sperren: function (b) { gesperrt = b; }
    };
  };

  /* ---------- Frage anzeigen und auswerten ----------
     st: Zustandsobjekt der Frage {versuche, ersterOk, fertig, gezeigt}; opt.onFertig(st) */
  F.zeigeFrage = function (host, q, st, opt) {
    opt = opt || {};
    host.innerHTML = '';
    var kasten = el('div', { 'class': 'frage' });
    kasten.appendChild(el('p', { 'class': 'frage-text', html: F.fmt(q.frage) }));
    if (q.szene && F.SZENEN[q.szene]) kasten.appendChild(el('div', { 'class': 'szenenblock', html: F.SZENEN[q.szene](q) }));
    if (q.html) kasten.appendChild(el('div', { 'class': 'szenenblock', html: q.html }));
    var wHost = el('div', { 'class': 'widget' });
    kasten.appendChild(wHost);
    var w = TYPEN[q.typ](q, wHost, { rnd: F.rnd(q) });
    var rueck = el('div', { 'class': 'rueck-platz', 'aria-live': 'polite' });
    var zeile = el('div', { 'class': 'knopfzeile' });
    var pruefKnopf = G.knopf('Prüfen', function () { pruefen(); }, 'haupt');
    var nochmalKnopf = G.knopf('Nochmal versuchen', function () {
      w.nochmal(); rueck.innerHTML = ''; zeile.innerHTML = ''; zeile.appendChild(pruefKnopf);
      if (w.fokus) w.fokus();
    }, 'haupt');
    zeile.appendChild(pruefKnopf);
    kasten.appendChild(zeile); kasten.appendChild(rueck);
    host.appendChild(kasten);

    function meldung(klasse, symbol, wort, absaetze, liste) {
      rueck.innerHTML = '';
      var b = el('div', { 'class': 'rueck ' + klasse });
      b.appendChild(el('p', { 'class': 'rueck-kopf' }, [el('span', { 'class': 'sym', text: symbol }), document.createTextNode(' ' + wort)]));
      (absaetze || []).forEach(function (a) { b.appendChild(el('p', { html: F.fmt(a) })); });
      if (liste && liste.length) { var ul = el('ul'); liste.forEach(function (h) { ul.appendChild(el('li', { text: h })); }); b.appendChild(ul); }
      rueck.appendChild(b);
    }
    function pruefen() {
      if (!w.hatAntwort()) { meldung('info', 'ℹ', 'Noch nicht fertig.', [w.fehlt]); return; }
      st.versuche = (st.versuche || 0) + 1;
      var r = w.pruefe();
      if (r.ok) {
        if (st.versuche === 1) st.ersterOk = true;
        st.fertig = true; w.sperren(true); zeile.innerHTML = '';
        meldung('ok', '✓', 'Richtig!' + (st.versuche > 1 ? ' (beim zweiten Versuch)' : ''), ['**Warum?** ' + q.warum]);
        if (opt.onFertig) opt.onFertig(st);
      } else if (st.versuche >= 2) {
        st.fertig = true; st.gezeigt = true; st.ersterOk = false;
        w.loesung(); w.sperren(true); zeile.innerHTML = '';
        meldung('nein', '✗', 'Das stimmt noch nicht. Hier siehst du die richtige Lösung.', ['**Warum?** ' + q.warum], r.hinweise);
        if (opt.onFertig) opt.onFertig(st);
      } else {
        st.ersterOk = false;
        zeile.innerHTML = ''; zeile.appendChild(nochmalKnopf);
        meldung('nein', '✗', 'Falsch. Versuche es noch einmal.', [], r.hinweise);
        nochmalKnopf.focus();
      }
    }
    if (st.fertig) {      // schon bearbeitet: Lösung zeigen
      w.loesung(); w.sperren(true); zeile.innerHTML = '';
      if (st.ersterOk) meldung('ok', '✓', st.vorab ? 'Schon gekonnt (Blitz-Check).' : 'Richtig!', ['**Warum?** ' + q.warum]);
      else meldung('nein', '✗', 'Hier siehst du die richtige Lösung.', ['**Warum?** ' + q.warum]);
    }
    return { fokus: function () { if (w.fokus) w.fokus(); } };
  };
})();
