# Generates the VCACE logo kit (SVG + PNG). Run: python3 make-logos.py
# Text uses Helvetica Neue / Arial; a designer should convert text to outlines for final artwork.
import subprocess, os
INK, BG, YEL, GOLD, WHITE = '#202020', '#F7F6F2', '#F4C430', '#C8991A', '#FFFFFF'
FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"
# Serif V drawn as strokes so it renders the same everywhere
def vmark(x, y, s, c, sw):
    k = s / 24
    return (f'<path transform="translate({x} {y}) scale({k})" d="M2.5 4h6M15.5 4h6M5 4l7 17 7-17" '
            f'fill="none" stroke="{c}" stroke-width="{sw / k:.3f}" stroke-linecap="square"/>')
def box(x, y, s, c, sw):
    return f'<rect x="{x + sw/2}" y="{y + sw/2}" width="{s - sw}" height="{s - sw}" fill="none" stroke="{c}" stroke-width="{sw}"/>'
def icon(x, y, s, c):
    sw = s * 0.045
    return box(x, y, s, c, sw) + vmark(x + s*0.2, y + s*0.2, s*0.6, c, s*0.04)

def primary(fg, au, bg=None):
    w, h = 1000, 200
    out = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">'
    if bg: out += f'<rect width="{w}" height="{h}" fill="{bg}"/>'
    out += icon(20, 20, 160, fg)
    out += f'<text x="215" y="98" font-family="{FONT}" font-weight="700" font-size="88" fill="{fg}">VCACE</text>'
    out += f'<text x="218" y="138" font-family="{FONT}" font-size="22.5" letter-spacing="0.6" fill="{fg}">VIETNAM CENTRE FOR ARTS, CULTURE &amp; EDUCATION</text>'
    out += f'<text x="218" y="174" font-family="{FONT}" font-weight="700" font-size="22.5" letter-spacing="1" fill="{au}">AUSTRALIA</text>'
    return out + '</svg>'

def compact(fg, bg=None):
    w, h = 520, 160
    out = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">'
    if bg: out += f'<rect width="{w}" height="{h}" fill="{bg}"/>'
    out += icon(20, 20, 120, fg)
    out += f'<text x="168" y="113" font-family="{FONT}" font-weight="700" font-size="92" fill="{fg}">VCACE</text>'
    return out + '</svg>'

def icon_svg(fg, bg):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512"><rect width="512" height="512" fill="{bg}"/>{icon(56, 56, 400, fg)}</svg>'

files = {
  'vcace-logo-primary.svg': primary(INK, GOLD),
  'vcace-logo-primary-on-offwhite.svg': primary(INK, GOLD, BG),
  'vcace-logo-inverse-white.svg': primary(WHITE, YEL),
  'vcace-logo-inverse-on-black.svg': primary(WHITE, YEL, INK),
  'vcace-logo-on-yellow.svg': primary(INK, INK, YEL),
  'vcace-logo-compact.svg': compact(INK),
  'vcace-logo-compact-white.svg': compact(WHITE),
  'vcace-icon.svg': icon_svg(INK, BG),
  'vcace-icon-inverse.svg': icon_svg(WHITE, INK),
}
os.makedirs('svg', exist_ok=True); os.makedirs('png', exist_ok=True)
for name, svg in files.items():
    open(f'svg/{name}', 'w').write(svg)
    subprocess.run(['rsvg-convert', '-w', '2000' if 'icon' not in name else '512', f'svg/{name}', '-o', f'png/{name[:-4]}.png'], check=True)
print('done', len(files))
