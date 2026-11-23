# Generates the VCACE logo kit (SVG + PNG). Run: python3 make-logos.py
# Text uses Helvetica Neue / Arial; a designer should convert text to outlines for final artwork.
import subprocess, os
INK, BG, YEL, GOLD, WHITE = '#202020', '#F7F6F2', '#F4C430', '#C8991A', '#FFFFFF'
GREY, LIGHT = '#686868', '#BDBAB2'   # tagline on light / on dark backgrounds
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

# Geometry shared by both lock-ups. The short logo is a rectangle: the V box on the left,
# VCACE on top and AUSTRALIA (yellow) underneath, both exactly as wide as each other and
# together as tall as the box. The full logo adds the tagline (grey) underneath, running from
# the left edge of the box to the end of the E. letter-spacing gives the widths in rsvg;
# textLength pins them in browsers whatever font is installed.
S, GAP, W = 120, 28, 334          # box size, box-to-text gap, width of VCACE / AUSTRALIA
TX = S + GAP                      # x of the wordmark, relative to the box
TAGLINE = 'VIETNAM CENTRE FOR ARTS, CULTURE &amp; EDUCATION'
def block(x, y, fg, au):
    return (icon(x, y, S, fg)
      + f'<text x="{x+TX}" y="{y+70}" font-family="{FONT}" font-weight="700" font-size="97.6" textLength="{W}" lengthAdjust="spacingAndGlyphs" fill="{fg}">VCACE</text>'
      + f'<text x="{x+TX}" y="{y+S}" font-family="{FONT}" font-weight="700" font-size="53" letter-spacing="4" textLength="{W}" lengthAdjust="spacing" fill="{au}">AUSTRALIA</text>')

def primary(fg, au, tag, bg=None):
    """Full logo: block + tagline."""
    w, h = 20 + TX + W + 20, 20 + S + 34 + 20
    out = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">'
    if bg: out += f'<rect width="{w}" height="{h}" fill="{bg}"/>'
    out += block(20, 20, fg, au)
    out += f'<text x="20" y="{20+S+34}" font-family="{FONT}" font-size="17.5" letter-spacing="0.86" textLength="{TX+W}" lengthAdjust="spacing" fill="{tag}">{TAGLINE}</text>'
    return out + '</svg>'

def compact(fg, au, bg=None):
    """Short logo: block only."""
    w, h = 20 + TX + W + 20, 20 + S + 20
    out = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">'
    if bg: out += f'<rect width="{w}" height="{h}" fill="{bg}"/>'
    return out + block(20, 20, fg, au) + '</svg>'

def icon_svg(fg, bg):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512"><rect width="512" height="512" fill="{bg}"/>{icon(56, 56, 400, fg)}</svg>'

files = {
  'vcace-logo-primary.svg': primary(INK, YEL, GREY),
  'vcace-logo-primary-on-offwhite.svg': primary(INK, YEL, GREY, BG),
  'vcace-logo-inverse-white.svg': primary(WHITE, YEL, LIGHT),
  'vcace-logo-inverse-on-black.svg': primary(WHITE, YEL, LIGHT, INK),
  'vcace-logo-on-yellow.svg': primary(INK, INK, INK, YEL),
  'vcace-logo-compact.svg': compact(INK, YEL),
  'vcace-logo-compact-white.svg': compact(WHITE, YEL),
  'vcace-icon.svg': icon_svg(INK, BG),
  'vcace-icon-inverse.svg': icon_svg(WHITE, INK),
}
os.makedirs('svg', exist_ok=True); os.makedirs('png', exist_ok=True)
for name, svg in files.items():
    open(f'svg/{name}', 'w').write(svg)
    subprocess.run(['rsvg-convert', '-w', '2000' if 'icon' not in name else '512', f'svg/{name}', '-o', f'png/{name[:-4]}.png'], check=True)
print('done', len(files))
