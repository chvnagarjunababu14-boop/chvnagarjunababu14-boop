#!/usr/bin/env python3
"""Render a subtle, seamless animated GIF from the Cedar & Stone hero SVG."""
from __future__ import annotations

import math
from io import BytesIO
from pathlib import Path

import cairosvg
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SVG_PATH = ROOT / "assets" / "profile-universe.svg"
GIF_PATH = ROOT / "assets" / "profile-universe.gif"
FRAME_COUNT = 24
FRAME_DURATION_MS = 100
WIDTH, HEIGHT = 1200, 480

SAGE_LEAF = '<path d="M-4-8C-48-80-35-124 12-145 35-87 22-44-4-8Z" fill="#8EA68C" fill-opacity=".78" stroke="#B7C5A9" stroke-width="1.5"/>'
COPPER_LEAF = '<path d="M-4-8C-72-25-106 5-102 55-50 61-15 35-4-8Z" fill="#C58E6A" fill-opacity=".78" stroke="#E0B18C" stroke-width="1.5"/>'
VEINS = '<path d="M-4-8L10-121M-4-8L-80 35" stroke="#EDE7D8" stroke-opacity=".72" stroke-width="2"/>'
PIVOT = "rotate(0 -4 -8)"


def animated_svg(base: str, sage_angle: float, copper_angle: float) -> str:
    if SAGE_LEAF not in base or COPPER_LEAF not in base or VEINS not in base:
        raise RuntimeError("The hero SVG leaf shapes changed; animation was not applied.")
    grouped = base.replace(
        SAGE_LEAF,
        f'<g transform="{PIVOT}">{SAGE_LEAF}<path d="M-4-8L10-121" stroke="#EDE7D8" stroke-opacity=".72" stroke-width="2"/></g>',
        1,
    )
    grouped = grouped.replace(
        COPPER_LEAF,
        f'<g transform="{PIVOT}">{COPPER_LEAF}<path d="M-4-8L-80 35" stroke="#EDE7D8" stroke-opacity=".72" stroke-width="2"/></g>',
        1,
    )
    grouped = grouped.replace(VEINS, "", 1)
    grouped = grouped.replace(PIVOT, f"rotate({sage_angle:.3f} -4 -8)", 1)
    grouped = grouped.replace(PIVOT, f"rotate({copper_angle:.3f} -4 -8)", 1)
    return grouped


def render_frame(svg: str) -> Image.Image:
    png = cairosvg.svg2png(bytestring=svg.encode("utf-8"), output_width=WIDTH, output_height=HEIGHT)
    with Image.open(BytesIO(png)) as image:
        return image.convert("RGB")


def main() -> None:
    if not SVG_PATH.is_file():
        raise FileNotFoundError(f"Static fallback hero is missing: {SVG_PATH}")
    original = SVG_PATH.read_text(encoding="utf-8")
    frames: list[Image.Image] = []

    # Opposing, low-angle motion keeps the text and orbit artwork completely still.
    for frame_index in range(FRAME_COUNT):
        phase = 2 * math.pi * frame_index / FRAME_COUNT
        sage_angle = 2.2 * math.sin(phase)
        copper_angle = -2.7 * math.sin(phase + 0.28)
        frames.append(render_frame(animated_svg(original, sage_angle, copper_angle)))

    # Build one shared palette to keep gradients and the background from flickering.
    thumbnails = [frame.resize((200, 80), Image.Resampling.LANCZOS) for frame in frames]
    contact_sheet = Image.new("RGB", (200 * 6, 80 * 4))
    for index, thumbnail in enumerate(thumbnails):
        contact_sheet.paste(thumbnail, ((index % 6) * 200, (index // 6) * 80))
    palette = contact_sheet.quantize(colors=256, method=Image.Quantize.FASTOCTREE)
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
    with Image.open(GIF_PATH) as animation:
        if not getattr(animation, "is_animated", False) or animation.n_frames < 20:
            raise RuntimeError("The generated hero GIF is not animated.")
    print(
        f"Animated hero created: {GIF_PATH.relative_to(ROOT)} "
        f"({FRAME_COUNT} frames, {FRAME_DURATION_MS} ms/frame, seamless loop)."
    )


if __name__ == "__main__":
    main()
