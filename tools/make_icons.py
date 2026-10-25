#!/usr/bin/env python3
"""Generates icons/icon16.png, icon48.png and icon128.png (needs Pillow: pip install pillow).
Design: dark rounded square, white focus brackets in the corners, red play triangle in the middle."""
import os
from PIL import Image, ImageDraw
os.makedirs("icons", exist_ok=True)
S = 1024  # draw large, then downsample for smooth edges

def draw():
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    # background: rounded square with a subtle vertical gradient
    bg = Image.new("RGBA", (S, S))
    bd = ImageDraw.Draw(bg)
    for y in range(S):
        c = int(34 - 22 * y / S)
        bd.line([(0, y), (S, y)], fill=(c, c, c + 4, 255))
    mask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * 0.22), fill=255)
    im.paste(bg, (0, 0), mask)
    # focus brackets (four corners)
    m, L, w = int(S * 0.17), int(S * 0.20), int(S * 0.055)
    a, b = m, S - m
    for (x, y, dx, dy) in [(a, a, 1, 1), (b, a, -1, 1), (a, b, 1, -1), (b, b, -1, -1)]:
        d.rounded_rectangle([min(x, x + dx * L), min(y, y + dy * w), max(x, x + dx * L), max(y, y + dy * w)], radius=w // 2, fill=(255, 255, 255, 255))
        d.rounded_rectangle([min(x, x + dx * w), min(y, y + dy * L), max(x, x + dx * w), max(y, y + dy * L)], radius=w // 2, fill=(255, 255, 255, 255))
    # play triangle, optically centred (shifted slightly right)
    cx, cy, r = S * 0.53, S * 0.5, S * 0.17
    d.polygon([(cx - r * 0.85, cy - r), (cx - r * 0.85, cy + r), (cx + r * 1.15, cy)], fill=(229, 9, 20, 255))
    return im

big = draw()
for n in (16, 48, 128):
    big.resize((n, n), Image.LANCZOS).save(f"icons/icon{n}.png")
