from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "social-preview.png"
OUT.parent.mkdir(parents=True, exist_ok=True)

W, H = 1600, 900
FONT_DIR = Path("C:/Windows/Fonts")
SANS = FONT_DIR / "arial.ttf"
BOLD = FONT_DIR / "arialbd.ttf"
MONO = FONT_DIR / "consola.ttf"
MONO_BOLD = FONT_DIR / "consolab.ttf"

BG_TOP = (241, 248, 252)
BG_BOTTOM = (203, 224, 238)
INK = (17, 28, 46)
MUTED = (82, 104, 130)
PANEL_TEXT = (45, 70, 98)
CYAN = (0, 166, 214)
BLUE = (72, 158, 218)
PURPLE = (122, 110, 232)
GREEN = (31, 151, 91)
AMBER = (219, 124, 14)
DARK = (33, 53, 82)


def font(path, size):
    return ImageFont.truetype(str(path), size)


F_TITLE = font(BOLD, 66)
F_TITLE_SMALL = font(BOLD, 58)
F_ROLE = font(SANS, 28)
F_BODY = font(SANS, 24)
F_SMALL = font(SANS, 17)
F_MICRO = font(SANS, 15)
F_MONO = font(MONO, 18)
F_MONO_BOLD = font(MONO_BOLD, 19)
F_METRIC = font(BOLD, 42)
F_CARD_VALUE = font(BOLD, 32)
F_FOOTER = font(BOLD, 31)


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def text(draw, xy, value, fill=INK, font_obj=F_BODY, anchor=None):
    draw.text(xy, value, fill=fill, font=font_obj, anchor=anchor)


def text_width(draw, value, font_obj):
    return draw.textbbox((0, 0), value, font=font_obj)[2]


def wrap_lines(draw, value, font_obj, max_width, max_lines=None):
    words = value.split()
    lines = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if text_width(draw, candidate, font_obj) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)

    if max_lines and len(lines) > max_lines:
        lines = lines[:max_lines]
        while lines[-1] and text_width(draw, lines[-1] + "...", font_obj) > max_width:
            lines[-1] = " ".join(lines[-1].split()[:-1])
        lines[-1] = lines[-1].rstrip() + "..."
    return lines


def wrapped_text(draw, xy, value, font_obj, fill, max_width, line_gap=5, max_lines=None):
    x, y = xy
    for line in wrap_lines(draw, value, font_obj, max_width, max_lines=max_lines):
        text(draw, (x, y), line, fill=fill, font_obj=font_obj)
        y += font_obj.size + line_gap
    return y


def glow(base, box, radius, color, blur=34, alpha=100):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle(box, radius=radius, fill=color + (alpha,))
    base.alpha_composite(layer.filter(ImageFilter.GaussianBlur(blur)))


img = Image.new("RGBA", (W, H), BG_TOP + (255,))
draw = ImageDraw.Draw(img)

for y in range(H):
    t = y / H
    color = tuple(int(BG_TOP[i] + (BG_BOTTOM[i] - BG_TOP[i]) * t) for i in range(3))
    draw.line([(0, y), (W, y)], fill=color + (255,))

glow(img, (880, 78, 1500, 520), 40, BLUE, blur=68, alpha=105)
glow(img, (92, 588, 760, 840), 36, CYAN, blur=72, alpha=58)
draw = ImageDraw.Draw(img)

for x in range(0, W, 48):
    draw.line([(x, 0), (x, H)], fill=(255, 255, 255, 40))
for y in range(0, H, 48):
    draw.line([(0, y), (W, y)], fill=(255, 255, 255, 34))

rounded(draw, (42, 34, 1558, 866), 18, (255, 255, 255, 105), outline=(122, 164, 202, 155), width=3)
rounded(draw, (62, 58, 1538, 842), 12, (244, 251, 255, 102), outline=(255, 255, 255, 170), width=2)

# Left identity block. It deliberately owns only the left column, so it never
# collides with the details panel.
left_x, left_y, left_w = 110, 118, 565
text(draw, (left_x, left_y), "VLADYSLAV KIKHTENKO", fill=(70, 93, 120), font_obj=F_MONO_BOLD)
text(draw, (left_x, left_y + 74), "Junior Frontend", fill=INK, font_obj=F_TITLE)
text(draw, (left_x, left_y + 144), "Developer", fill=INK, font_obj=F_TITLE_SMALL)
wrapped_text(
    draw,
    (left_x, left_y + 235),
    "Frontend projects, responsive UI, and case-study pages.",
    F_ROLE,
    MUTED,
    left_w,
    line_gap=8,
    max_lines=2,
)

chips = ["HTML", "CSS", "JavaScript", "Germany"]
cx = left_x
for chip in chips:
    chip_w = int(text_width(draw, chip, F_MONO_BOLD)) + 38
    rounded(draw, (cx, 430, cx + chip_w, 478), 8, (255, 255, 255, 150), outline=(118, 170, 205, 155), width=2)
    text(draw, (cx + 19, 444), chip, fill=(33, 72, 104), font_obj=F_MONO_BOLD)
    cx += chip_w + 13

# Details panel.
panel = (730, 104, 1465, 610)
rounded(draw, panel, 18, (226, 244, 253, 226), outline=(80, 156, 212, 195), width=3)
text(draw, (770, 146), "PROJECT DETAILS", fill=(38, 75, 108), font_obj=F_MONO_BOLD)
text(draw, (770, 190), "Readable blocks, current status, source links.", fill=PANEL_TEXT, font_obj=F_SMALL)

cards = [
    {
        "value": "12",
        "label": "QUICK ACTIONS",
        "desc": "Projects, skills, checks, contact.",
        "accent": CYAN,
    },
    {
        "value": "3",
        "label": "CASE PAGES",
        "desc": "Voltage, portfolio, lab.",
        "accent": PURPLE,
    },
    {
        "value": "7/7",
        "label": "LOCAL CHECKS",
        "desc": "Overflow, assets, nav, wiring.",
        "accent": GREEN,
    },
    {
        "value": "Projects",
        "label": "MULTI-BUILD ROADMAP",
        "desc": "Voltage, UI lab, future cases.",
        "accent": AMBER,
    },
]

card_w, card_h = 306, 116
for i, item in enumerate(cards):
    col = i % 2
    row = i // 2
    x1 = 770 + col * 348
    y1 = 248 + row * 144
    x2 = x1 + card_w
    y2 = y1 + card_h
    rounded(draw, (x1, y1, x2, y2), 10, (255, 255, 255, 150), outline=item["accent"] + (180,), width=2)
    value_font = F_CARD_VALUE if item["value"] == "Projects" else F_METRIC
    text(draw, (x1 + 22, y1 + 14), item["value"], fill=item["accent"], font_obj=value_font)
    text(draw, (x1 + 22, y1 + 62), item["label"], fill=INK, font_obj=F_MONO_BOLD)
    wrapped_text(draw, (x1 + 22, y1 + 88), item["desc"], F_MICRO, MUTED, card_w - 42, line_gap=2, max_lines=1)

# Bottom project strip.
footer = (110, 642, 1465, 792)
rounded(draw, footer, 14, DARK + (230,), outline=(95, 150, 196, 165), width=2)
text(draw, (146, 678), "Portfolio that can be inspected", fill=(247, 252, 255), font_obj=F_FOOTER)
wrapped_text(
    draw,
    (146, 725),
    "Quick navigation, visitor routes, site checks, message builder, and room for more project cases.",
    F_BODY,
    (205, 223, 237),
    1110,
    line_gap=7,
    max_lines=2,
)
text(draw, (1426, 755), "v1 social preview", fill=(175, 211, 235), font_obj=F_MONO, anchor="ra")

img.convert("RGB").save(OUT, quality=96)
print(OUT)
