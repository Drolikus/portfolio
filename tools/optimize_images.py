#!/usr/bin/env python3
"""Resize and recompress portfolio images in place.

Images keep their original names and PNG format so no HTML/CSS references need
to change. Dimensions are capped at roughly 2x the largest on-screen display
size, which is enough for high-DPI screens while cutting transfer size sharply.

Run after regenerating case screenshots:

    npm run capture:screenshots   # writes assets/case-*.png
    python3 tools/optimize_images.py
"""

import os
from PIL import Image

ASSETS = os.path.join(os.path.dirname(__file__), "..", "assets")

# filename -> max width in pixels (height scales to keep aspect ratio).
# Display sizes: profile photo 88px, QR 220px, case shots <=1120px.
MAX_WIDTH = {
    "studio-headshot.png": 264,        # shown at 88px (3x)
    "telegram-qr.png": 500,            # shown at 220px (~2.3x)
    "case-portfolio-home.png": 1280,   # case page, shown <=1120px
    "case-portfolio-mobile.png": 900,
    "case-lab-board.png": 1280,
    "case-site-checks.png": 1280,
    "case-voltage-preview.png": 1280,
    # social-preview.png is intentionally left untouched (OG image, 1200x630).
}


def optimize(name, max_width):
    path = os.path.join(ASSETS, name)
    if not os.path.exists(path):
        print(f"skip (missing): {name}")
        return
    before = os.path.getsize(path)
    with Image.open(path) as img:
        img = img.convert("RGBA") if img.mode in ("P", "LA") else img
        if img.width > max_width:
            ratio = max_width / img.width
            img = img.resize((max_width, round(img.height * ratio)), Image.LANCZOS)
        # Quantize to a palette for a big size win while staying visually clean.
        # The QR code is essentially two-tone, so a tiny palette keeps it sharp
        # and scannable at a fraction of the size.
        colors = 16 if name == "telegram-qr.png" else 256
        rgb = img.convert("RGB")
        img = rgb.quantize(colors=colors, method=Image.FASTOCTREE, dither=Image.NONE)
        img.save(path, optimize=True)
    after = os.path.getsize(path)
    pct = (1 - after / before) * 100 if before else 0
    print(f"{name}: {before/1024:.0f} KB -> {after/1024:.0f} KB ({pct:.0f}% smaller)")


def main():
    total_before = sum(
        os.path.getsize(os.path.join(ASSETS, n))
        for n in MAX_WIDTH
        if os.path.exists(os.path.join(ASSETS, n))
    )
    for name, max_width in MAX_WIDTH.items():
        optimize(name, max_width)
    total_after = sum(
        os.path.getsize(os.path.join(ASSETS, n))
        for n in MAX_WIDTH
        if os.path.exists(os.path.join(ASSETS, n))
    )
    print(f"\nTotal: {total_before/1024/1024:.2f} MB -> {total_after/1024/1024:.2f} MB")


if __name__ == "__main__":
    main()
