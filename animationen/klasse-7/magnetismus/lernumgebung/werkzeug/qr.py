#!/usr/bin/env python3
"""Erzeugt den QR-Code (PNG) und die druckbare A4-Seite (PDF) zur Lernumgebung.

    python3 werkzeug/qr.py [URL]

Braucht:  pip install qrcode pillow
"""
import pathlib, sys
import qrcode
from PIL import Image, ImageDraw, ImageFont

URL = sys.argv[1] if len(sys.argv) > 1 else 'https://nailik433.github.io/physik-animationen-/kl7-magnetismus/'
ORDNER = pathlib.Path(__file__).resolve().parent.parent / 'material'
SCHRIFT = '/usr/share/fonts/truetype/liberation/LiberationSans-%s.ttf'


def schrift(stil, groesse):
    try:
        return ImageFont.truetype(SCHRIFT % stil, groesse)
    except OSError:
        return ImageFont.load_default()


def mitte(d, text, y, font, breite):
    w = d.textlength(text, font=font)
    d.text(((breite - w) / 2, y), text, font=font, fill='black')


def main():
    ORDNER.mkdir(exist_ok=True)
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_Q, box_size=1, border=4)
    qr.add_data(URL); qr.make(fit=True)
    module = len(qr.get_matrix())
    box = -(-1200 // module)                              # mindestens 1200 Pixel
    bild = qr.make_image(fill_color='black', back_color='white').convert('RGB')
    bild = bild.resize((module * box, module * box), Image.NEAREST)
    bild.save(ORDNER / 'QR_Lernumgebung_Magnetismus.png')

    # A4 mit 300 dpi: 2480 x 3508
    B, H = 2480, 3508
    seite = Image.new('RGB', (B, H), 'white'); d = ImageDraw.Draw(seite)
    mitte(d, 'Magnetismus: Teste dich selbst', 260, schrift('Bold', 150), B)
    gross = bild.resize((1700, 1700), Image.NEAREST)
    seite.paste(gross, ((B - 1700) // 2, 620))
    adresse = URL.replace('https://', '')
    f = schrift('Bold', 96)
    while d.textlength(adresse, font=f) > B - 240:
        f = schrift('Bold', f.size - 4)
    mitte(d, adresse, 2480, f, B)
    mitte(d, 'QR-Code mit der Tablet-Kamera scannen', 2780, schrift('Regular', 90), B)
    mitte(d, 'oder die Adresse abtippen.', 2910, schrift('Regular', 90), B)
    seite.save(ORDNER / 'QR_Lernumgebung_Magnetismus.pdf', resolution=300.0)
    print('QR-Code:', module, 'Module, PNG', bild.size, '| URL:', URL)


if __name__ == '__main__':
    main()
