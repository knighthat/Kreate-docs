"""Render Crowdin per-language translation progress as a PNG card.

Styled after the homepage "Top translators" list
(src/components/homepage/TopTranslators): dark surface cards, the
pink → purple → blue gradient bar on a grey track, bold figures with muted
secondary text.

Usage:
    CROWDIN_TOKEN=... CROWDIN_PROJECT_ID=... python translation_chart.py out.png
    python translation_chart.py out.png --sample   # fake data, no API calls
"""

import datetime
import json
import math
import os
import random
import subprocess
import sys
import urllib.request

from PIL import Image, ImageDraw, ImageFont

API = "https://api.crowdin.com/api/v2/projects"

S = 2  # render scale; every size below is in CSS-ish pixels

# Docusaurus dark theme
BACKGROUND = "#1b1b1d"   # --ifm-background-color
SURFACE = "#242526"      # --ifm-background-surface-color
BORDER = "#444950"       # --ifm-color-emphasis-200
TRACK = "#3a3b3d"
TEXT = "#e3e3e3"
MUTED = "#a0a3a7"        # --ifm-color-emphasis-600
GOLD = "#f5c451"         # .gold medal, used for 100%
GRADIENT = [(0.0, "#f465b5"), (0.55, "#8e3dc3"), (1.0, "#2913c1")]

COLUMNS = 3
CELL_W, CELL_H, GAP, PAD = 300, 58, 10, 28


# ---------------------------------------------------------------- data

def get(path: str) -> dict:
    req = urllib.request.Request(
        f"{API}/{os.environ['CROWDIN_PROJECT_ID']}{path}",
        headers={"Authorization": f"Bearer {os.environ['CROWDIN_TOKEN']}"},
    )
    with urllib.request.urlopen(req) as res:
        return json.load(res)


def fetch() -> list[tuple[str, int]]:
    names = {lang["id"]: lang["name"] for lang in get("")["data"]["targetLanguages"]}
    rows = []
    for item in get("/languages/progress?limit=500")["data"]:
        data = item["data"]
        rows.append((names.get(data["languageId"], data["languageId"]), data["translationProgress"]))
    return rows


def sample() -> list[tuple[str, int]]:
    langs = ["Afrikaans", "Albanian", "Arabic", "Azerbaijani", "Basque", "Belarusian",
             "Bengali", "Catalan", "Chinese (Simplified Han script)",
             "Chinese (Traditional Han script)", "Croatian", "Czech", "Danish", "Dutch",
             "English (Canada)", "Estonian", "Filipino", "Finnish", "French", "German",
             "Greek", "Hebrew", "Hindi", "Hungarian", "Indonesian", "Italian", "Japanese",
             "Korean", "Norwegian Bokmål", "Polish", "Portuguese (Brazil)", "Russian",
             "Serbian (Latin script)", "Spanish (American)", "Turkish", "Vietnamese"]
    return [(l, random.choice([100, random.randint(3, 100)])) for l in langs]


# ---------------------------------------------------------------- drawing

def font(bold: bool, size: int) -> ImageFont.FreeTypeFont:
    pattern = "Noto Sans:bold" if bold else "Noto Sans"
    try:
        path = subprocess.run(["fc-match", "-f", "%{file}", pattern],
                              capture_output=True, text=True, check=True).stdout
        return ImageFont.truetype(path, size * S)
    except Exception:
        return ImageFont.load_default(size * S)


def hex_rgb(h: str) -> tuple[int, int, int]:
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


def gradient(width: int, height: int) -> Image.Image:
    """Horizontal gradient spanning the full track width, like the CSS bar."""
    stops = [(p, hex_rgb(c)) for p, c in GRADIENT]
    img = Image.new("RGB", (width, height))
    px = img.load()
    for x in range(width):
        t = x / max(1, width - 1)
        for (p0, c0), (p1, c1) in zip(stops, stops[1:]):
            if p0 <= t <= p1:
                k = (t - p0) / (p1 - p0)
                color = tuple(round(a + (b - a) * k) for a, b in zip(c0, c1))
                break
        for y in range(height):
            px[x, y] = color
    return img


def ellipsize(draw: ImageDraw.ImageDraw, text: str, f, max_w: int) -> str:
    if draw.textlength(text, font=f) <= max_w:
        return text
    while text and draw.textlength(text + "…", font=f) > max_w:
        text = text[:-1]
    return text.rstrip() + "…"


def render(rows: list[tuple[str, int]], out: str) -> None:
    rows = sorted(rows, key=lambda r: (-r[1], r[0]))
    count = len(rows)
    per_col = math.ceil(count / COLUMNS)
    average = round(sum(p for _, p in rows) / count) if count else 0
    done = sum(1 for _, p in rows if p == 100)

    header_h = 74
    width = PAD * 2 + COLUMNS * CELL_W + (COLUMNS - 1) * GAP
    height = PAD + header_h + per_col * CELL_H + (per_col - 1) * GAP + PAD + 18

    img = Image.new("RGB", (width * S, height * S), BACKGROUND)
    d = ImageDraw.Draw(img)

    title, small, label, figure = font(True, 26), font(False, 13), font(True, 14), font(True, 15)

    # Header
    d.text((PAD * S, PAD * S), "Translation progress", font=title, fill=TEXT)
    d.text((PAD * S, (PAD + 38) * S),
           f"{count} languages  ·  {done} complete  ·  {average}% average",
           font=small, fill=MUTED)
    stamp = datetime.date.today().strftime("%b %d, %Y")
    d.text(((width - PAD) * S, (PAD + 10) * S), stamp, font=small, fill=MUTED, anchor="ra")

    bar_w = CELL_W - 32
    grad = gradient(bar_w * S, 6 * S)

    # Cards, filled column by column so the list reads top-down like a ranking
    for i, (name, pct) in enumerate(rows):
        col, row = divmod(i, per_col)
        x = PAD + col * (CELL_W + GAP)
        y = PAD + header_h + row * (CELL_H + GAP)

        d.rounded_rectangle([x * S, y * S, (x + CELL_W) * S, (y + CELL_H) * S],
                            radius=12 * S, fill=SURFACE, outline=BORDER, width=S)

        pct_text = f"{pct}%"
        pct_w = d.textlength(pct_text, font=figure) / S
        d.text(((x + 16) * S, (y + 12) * S),
               ellipsize(d, name, label, int((bar_w - pct_w - 12) * S)),
               font=label, fill=TEXT)
        d.text(((x + CELL_W - 16) * S, (y + 11) * S), pct_text, font=figure,
               fill=GOLD if pct == 100 else TEXT, anchor="ra")

        # Track + gradient fill
        bx, by = (x + 16) * S, (y + 38) * S
        d.rounded_rectangle([bx, by, bx + bar_w * S, by + 6 * S], radius=3 * S, fill=TRACK)
        fill_w = round(bar_w * S * pct / 100)
        if fill_w > 0:
            mask = Image.new("L", (fill_w, 6 * S), 0)
            ImageDraw.Draw(mask).rounded_rectangle([0, 0, fill_w - 1, 6 * S - 1],
                                                   radius=3 * S, fill=255)
            img.paste(grad.crop((0, 0, fill_w, 6 * S)), (bx, by), mask)

    img.save(out, optimize=True)


if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "chart.png"
    render(sample() if "--sample" in sys.argv else fetch(), out)
