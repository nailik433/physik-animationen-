#!/usr/bin/env python3
"""Erzeugt aus index.html, style.css und allen Skripten EINE HTML-Datei (offline per Doppelklick).

    python3 werkzeug/bauen_einzeldatei.py

Ergebnis: material/lernumgebung_magnetismus_einzeldatei.html
"""
import pathlib, re

ORDNER = pathlib.Path(__file__).resolve().parent.parent
ZIEL = ORDNER / 'material' / 'lernumgebung_magnetismus_einzeldatei.html'
START, ENDE = '<!--uebersicht-->', '<!--/uebersicht-->'


def main():
    html = (ORDNER / 'index.html').read_text(encoding='utf-8')
    html = re.sub(re.escape(START) + r'.*?' + re.escape(ENDE) + r'\n?', '', html, flags=re.S)   # Übersicht-Button der Seite entfernen
    css = (ORDNER / 'style.css').read_text(encoding='utf-8')
    html = html.replace('<link rel="stylesheet" href="style.css">', '<style>\n' + css + '\n</style>')

    def skript(m):
        pfad = ORDNER / m.group(1)
        code = pfad.read_text(encoding='utf-8').replace('</script', '<\\/script')
        return '<script>\n' + code + '\n</script>'
    html = re.sub(r'<script src="([^"]+)"></script>', skript, html)
    ZIEL.parent.mkdir(exist_ok=True)
    ZIEL.write_text(html, encoding='utf-8')
    print('geschrieben:', ZIEL, f'({ZIEL.stat().st_size // 1024} KB)')


if __name__ == '__main__':
    main()
