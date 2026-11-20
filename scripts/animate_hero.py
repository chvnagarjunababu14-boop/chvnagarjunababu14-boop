#!/usr/bin/env python3
"""Gentle leaf sway for Cedar & Stone nature hero (cairo path)."""
from __future__ import annotations

import math
import re
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SVG_PATH = ROOT / "assets" / "profile-universe.svg"
GIF_PATH = ROOT / "assets" / "profile-universe.gif"
FRAME_COUNT = 32
FRAME_DURATION_MS = 100
WIDTH, HEIGHT = 1200, 480
COLORS = 192

LEAF_RE = re.compile(
    r'<g data-leaf="([^"]+)" data-px="([^"]+)" data-py="([^"]+)" transform="rotate\([^"]+\)">'
)
MOTION = {
    "sage": (2.4, 0.0),
    "copper": (-2.9, 0.35),
    "gold": (2.1, 1.1),
    "moss": (-2.5, 1.7),
}


def animated_svg(base: str, frame_index: int) -> str:
    phase = 2 * math.pi * frame_index / FRAME_COUNT

    def move(match: re.Match[str]) -> str:
        name, px, py = match.group(1), match.group(2), match.group(3)
        amp, offset = MOTION.get(name, (2.0, 0.0))
        angle = amp * math.sin(phase + offset)
        return (
            f'<g data-leaf="{name}" data-px="{px}" data-py="{py}" '
            f'transform="rotate({angle:.3f} {px} {py})">'
        )

    return LEAF_RE.sub(move, base)


def render_frame(svg: str) -> Image.Image:
    import cairosvg

    png = cairosvg.svg2png(bytestring=svg.encode("utf-8"), output_width=WIDTH, output_height=HEIGHT)
    with Image.open(BytesIO(png)) as image:
        return image.convert("RGB")


def main() -> None:
    if not SVG_PATH.is_file():
        raise FileNotFoundError(f"Static fallback hero is missing: {SVG_PATH}")
    original = SVG_PATH.read_text(encoding="utf-8")
    if 'data-leaf="' not in original:
        raise RuntimeError("Hero SVG is missing data-leaf markers for nature animation.")

    frames = [render_frame(animated_svg(original, i)) for i in range(FRAME_COUNT)]
    thumbnails = [frame.resize((200, 80), Image.Resampling.LANCZOS) for frame in frames]
    contact_sheet = Image.new("RGB", (200 * 8, 80 * 4))
    for index, thumbnail in enumerate(thumbnails):
        contact_sheet.paste(thumbnail, ((index % 8) * 200, (index // 8) * 80))
    palette = contact_sheet.quantize(colors=COLORS, method=Image.Quantize.FASTOCTREE)
    indexed = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in frames]

    GIF_PATH.parent.mkdir(parents=True, exist_ok=True)
    indexed[0].save(
        GIF_PATH,
        format="GIF",
        save_all=True,
        append_images=indexed[1:],
        duration=FRAME_DURATION_MS,
        loop=0,
        disposal=2,
        optimize=True,
    )
    size_kb = GIF_PATH.stat().st_size / 1024
    print(
        f"Nature leaf GIF: {GIF_PATH.relative_to(ROOT)} "
        f"({FRAME_COUNT} frames @ {FRAME_DURATION_MS}ms, {COLORS} colors, {size_kb:.0f} KB)."
    )


if __name__ == "__main__":
    main()
