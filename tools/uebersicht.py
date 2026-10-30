#!/usr/bin/env python3
"""Fügt in jede Animation den Button "← Übersicht" ein (und kann ihn wieder entfernen).

    python3 tools/uebersicht.py            # Button in alle Animationen aus daten/animationen.js einfügen
    python3 tools/uebersicht.py --pruefen  # prüfen, ob jede Animation den Button hat
    python3 tools/uebersicht.py --entfernen DATEI   # Button aus DATEI entfernen (z. B. zum Vergleich mit dem Original)

Der Button steht zwischen den Markierungen <!--uebersicht--> und <!--/uebersicht-->.
Mehrfaches Ausführen ändert nichts (der Button wird nur einmal eingefügt).
Position pro Animation: Eintrag in POSITION unten (sonst unten links).
"""
import os, re, sys, pathlib

WURZEL = pathlib.Path(__file__).resolve().parent.parent
START, ENDE = '<!--uebersicht-->', '<!--/uebersicht-->'
POSITION = {'animationen/klasse-8/kraefte/goldene-regel/goldene_regel.html': 'br',
            'animationen/klasse-7/magnetismus/lernumgebung/index.html': 'br'}   # (tl, tr, bl, br); Standard: unten links

RAND = {'bl': 'bottom:calc(env(safe-area-inset-bottom,0px) + 12px);left:calc(env(safe-area-inset-left,0px) + 12px)',
        'br': 'bottom:calc(env(safe-area-inset-bottom,0px) + 12px);right:calc(env(safe-area-inset-right,0px) + 12px)',
        'tl': 'top:calc(env(safe-area-inset-top,0px) + 12px);left:calc(env(safe-area-inset-left,0px) + 12px)',
        'tr': 'top:calc(env(safe-area-inset-top,0px) + 12px);right:calc(env(safe-area-inset-right,0px) + 12px)'}

BAUSTEIN = """__START__<a href="__HREF__" id="__uebs_link" aria-label="Zur Übersicht (verlässt die Lernumgebung)" style="position:fixed;__RAND__;z-index:2147483000;display:inline-flex;align-items:center;min-height:44px;padding:0 12px;border-radius:999px;background:#556079;color:#E6EAF2;border:1px solid rgba(255,255,255,.2);font:600 13px/1 Arial,Helvetica,sans-serif;text-decoration:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation;-webkit-user-select:none;user-select:none">&larr;&nbsp;Übersicht</a>
<div id="__uebs_box" role="dialog" aria-modal="true" aria-labelledby="__uebs_titel" style="display:none;position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483001;background:rgba(10,18,36,.62);align-items:center;justify-content:center;padding:16px;font:18px/1.45 Arial,Helvetica,sans-serif;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none"><div style="background:#fff;color:#111;max-width:440px;width:100%;border-radius:16px;padding:20px 22px;border:4px solid #D97706;box-shadow:0 8px 32px rgba(0,0,0,.45)"><p id="__uebs_titel" style="margin:0 0 8px;font-weight:700;font-size:21px">Achtung: Lernumgebung verlassen?</p><p style="margin:0 0 16px">Wenn du jetzt zur Übersicht gehst, verlässt du diese Lernumgebung. Dein aktueller Stand kann dabei verloren gehen.</p><div style="display:flex;flex-wrap:wrap;gap:10px"><button type="button" id="__uebs_bleiben" style="min-height:52px;padding:0 20px;font:700 18px Arial,Helvetica,sans-serif;border:3px solid #1B2A4A;border-radius:12px;background:#1B2A4A;color:#fff;touch-action:manipulation">Hier bleiben</button><button type="button" id="__uebs_gehen" style="min-height:52px;padding:0 20px;font:700 18px Arial,Helvetica,sans-serif;border:3px solid #1B2A4A;border-radius:12px;background:#fff;color:#1B2A4A;touch-action:manipulation">Trotzdem zur Übersicht</button></div></div></div>
<script>(function(){var l=document.getElementById('__uebs_link'),b=document.getElementById('__uebs_box'),s=document.getElementById('__uebs_bleiben'),g=document.getElementById('__uebs_gehen');if(!l||!b)return;function zu(){b.style.display='none';l.focus();}l.addEventListener('click',function(e){e.preventDefault();b.style.display='flex';s.focus();});s.addEventListener('click',zu);g.addEventListener('click',function(){location.href=l.getAttribute('href');});b.addEventListener('pointerdown',function(e){if(e.target===b)zu();});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&b.style.display!=='none')zu();});})();</script>__ENDE__
"""

def baustein(href, pos):
    """Dezenter Button (halbtransparent, klein) mit Warnhinweis vor dem Verlassen der Lernumgebung."""
    return (BAUSTEIN.replace('__START__', START).replace('__ENDE__', ENDE)
            .replace('__HREF__', href).replace('__RAND__', RAND[pos]))

def eintraege():
    js = (WURZEL / 'daten' / 'animationen.js').read_text(encoding='utf-8')
    # (fach, klasse, datei); fach steht optional als erste Zeile eines Eintrags
    return re.findall(r"(?:fach:\s*'([^']+)',\s*)?klasse:\s*(\d+),.*?datei:\s*'([^']+)'", js, re.S)

def entfernen(text):
    return re.sub(re.escape(START) + r'.*?' + re.escape(ENDE) + r'\n?', '', text, flags=re.S)

def einfuegen(datei, klasse, fach=''):
    pfad = WURZEL / datei
    roh = pfad.read_bytes()
    text = roh.decode('utf-8')
    text = entfernen(text)                                         # immer frisch setzen (idempotent)
    ziel = '#informatik' if fach == 'Informatik' else f'#klasse-{klasse}'
    href = os.path.relpath(WURZEL / 'index.html', pfad.parent).replace(os.sep, '/') + ziel
    block = baustein(href, POSITION.get(datei, 'bl'))
    i = text.lower().rfind('</body>')
    text = text[:i] + block + text[i:] if i >= 0 else text + '\n' + block
    pfad.write_bytes(text.encode('utf-8'))

def main():
    if len(sys.argv) > 2 and sys.argv[1] == '--entfernen':
        p = pathlib.Path(sys.argv[2]); p.write_bytes(entfernen(p.read_text(encoding='utf-8')).encode('utf-8')); return
    fehlt = []
    for fach, klasse, datei in eintraege():
        if '--pruefen' in sys.argv:
            if START not in (WURZEL / datei).read_text(encoding='utf-8'): fehlt.append(datei)
        else:
            einfuegen(datei, klasse, fach); print('Button gesetzt:', datei)
    if '--pruefen' in sys.argv:
        print('FEHLT in:', *fehlt, sep='\n  ') if fehlt else print('OK: alle Animationen haben den Übersicht-Button')
        sys.exit(1 if fehlt else 0)

if __name__ == '__main__':
    main()
