# Makes the site's icons and share image in app/: icon.png, apple-icon.png,
# favicon.ico, opengraph-image.png and twitter-image.png, from public/logo.png
# on the site's charcoal, set in Montserrat.
#
# Run from the project folder with Pillow installed:
#   python assets/brand/make-icons.py <path to a Montserrat variable font> <preview.png>
# (The dev server caches Montserrat as a .woff2 in .next/dev/static/media.)
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
FONT = sys.argv[1]
BAND = (24, 24, 26)
logo = Image.open("public/logo.png").convert("RGBA")  # white P on transparent

def font(size, weight):
    f = ImageFont.truetype(FONT, size)
    f.set_variation_by_axes([weight])
    return f

def mark_on(size, logo_h, radius):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=BAND + (255,))
    l = logo.copy()
    l = l.resize((round(l.width * logo_h / l.height), logo_h), Image.LANCZOS)
    im.alpha_composite(l, ((size - l.width) // 2, (size - l.height) // 2))
    return im

# browser tab icon and Apple home-screen icon
mark_on(256, 150, 56).save("app/icon.png")
apple = mark_on(180, 104, 0)  # iOS rounds the corners itself
apple.save("app/apple-icon.png")
# favicon.ico for older browsers, from a large render
big = mark_on(256, 156, 56)
big.save("app/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

# the share image (1200x630), in the site's dark band
W, H = 1200, 630
og = Image.new("RGB", (W, H), BAND)
glow = Image.new("L", (W, H), 0)
ImageDraw.Draw(glow).ellipse([560, -260, 1460, 520], fill=26)
glow = glow.filter(ImageFilter.GaussianBlur(160))
og = Image.composite(Image.new("RGB", (W, H), (255, 255, 255)), og, glow)
d = ImageDraw.Draw(og)

# lockup: the P, a rule, and the name
l = logo.resize((round(logo.width * 52 / logo.height), 52), Image.LANCZOS)
og.paste(l, (80, 72), l)
d.rectangle([80 + l.width + 18, 74, 80 + l.width + 19, 122], fill=(200, 200, 200))
d.text((80 + l.width + 38, 98), "PIXIE WEBS", font=font(30, 700), fill=(255, 255, 255), anchor="lm")

# the statement: white, then a silver second line
big = font(58, 700)
d.text((80, 330), "We build technology", font=big, fill=(255, 255, 255), anchor="ls")
line2 = "that moves businesses forward."
box = d.textbbox((80, 404), line2, font=big, anchor="ls")
mask = Image.new("L", (W, H), 0)
ImageDraw.Draw(mask).text((80, 404), line2, font=big, fill=255, anchor="ls")
grad = Image.new("RGB", (W, H))
gd = ImageDraw.Draw(grad)
x0, x1 = box[0], box[2]
for x in range(W):
    t = min(1, max(0, (x - x0) / max(1, x1 - x0)))
    c = round(255 - (255 - 154) * t) if t > 0.55 else round(255 - (255 - 201) * t / 0.55)
    gd.line([(x, 0), (x, H)], fill=(c, c, c))
og.paste(grad, (0, 0), mask)

# what we make, in small spaced capitals
small = font(19, 600)
d.text((80, 520), "W E B S I T E S   ·   E - C O M M E R C E   ·   E R P  &  C R M   ·   M O B I L E   A P P S",
       font=small, fill=(150, 150, 150), anchor="ls")
og.save("app/opengraph-image.png", optimize=True)
og.save("app/twitter-image.png", optimize=True)
og.resize((600, 315)).save(sys.argv[2])
