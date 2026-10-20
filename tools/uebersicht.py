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

def baustein(href, pos):
    return (f'{START}<a href="{href}" aria-label="Zur Übersicht" style="position:fixed;{RAND[pos]};z-index:2147483000;'
            'display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:999px;'
            'background:rgba(27,42,74,.92);color:#fff;border:1px solid rgba(255,255,255,.4);'
            'font:600 16px/1 Arial,Helvetica,sans-serif;text-decoration:none;-webkit-tap-highlight-color:transparent;'
            f'touch-action:manipulation;-webkit-user-select:none;user-select:none">&larr;&nbsp;Übersicht</a>{ENDE}\n')

def eintraege():
    js = (WURZEL / 'daten' / 'animationen.js').read_text(encoding='utf-8')
    return re.findall(r"klasse:\s*(\d+),.*?datei:\s*'([^']+)'", js, re.S)

def entfernen(text):
    return re.sub(re.escape(START) + r'.*?' + re.escape(ENDE) + r'\n?', '', text, flags=re.S)

def einfuegen(datei, klasse):
    pfad = WURZEL / datei
    roh = pfad.read_bytes()
    text = roh.decode('utf-8')
    text = entfernen(text)                                         # immer frisch setzen (idempotent)
    href = os.path.relpath(WURZEL / 'index.html', pfad.parent).replace(os.sep, '/') + f'#klasse-{klasse}'
    block = baustein(href, POSITION.get(datei, 'bl'))
    i = text.lower().rfind('</body>')
    text = text[:i] + block + text[i:] if i >= 0 else text + '\n' + block
    pfad.write_bytes(text.encode('utf-8'))

def main():
    if len(sys.argv) > 2 and sys.argv[1] == '--entfernen':
        p = pathlib.Path(sys.argv[2]); p.write_bytes(entfernen(p.read_text(encoding='utf-8')).encode('utf-8')); return
    fehlt = []
    for klasse, datei in eintraege():
        if '--pruefen' in sys.argv:
            if START not in (WURZEL / datei).read_text(encoding='utf-8'): fehlt.append(datei)
        else:
            einfuegen(datei, klasse); print('Button gesetzt:', datei)
    if '--pruefen' in sys.argv:
        print('FEHLT in:', *fehlt, sep='\n  ') if fehlt else print('OK: alle Animationen haben den Übersicht-Button')
        sys.exit(1 if fehlt else 0)

if __name__ == '__main__':
    main()
