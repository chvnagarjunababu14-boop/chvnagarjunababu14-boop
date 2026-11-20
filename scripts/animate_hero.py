#!/usr/bin/env python3
"""Render a seamless animated GIF with orbiting language planets around the sun."""
from __future__ import annotations

import math
import re
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SVG_PATH = ROOT / "assets" / "profile-universe.svg"
GIF_PATH = ROOT / "assets" / "profile-universe.gif"
FRAME_COUNT = 24
FRAME_DURATION_MS = 100
WIDTH, HEIGHT = 880, 520

PLANET_RE = re.compile(
    r'(<g id="planet-(\d+)" data-orbit="1" transform="rotate\()(-?\d+(?:\.\d+)?)( [^"]*)(">)',
)
SUN_HALO_RE = re.compile(
    r'(<g id="sun-halo" data-sun="1">\s*<circle r=")(\d+(?:\.\d+)?)(")',
)


def render_svg(svg: str) -> Image.Image:
    try:
        import cairosvg
    except Exception as exc:  # pragma: no cover
        raise RuntimeError(
            "cairosvg/cairo is required to render the animated hero GIF"
        ) from exc
    png = cairosvg.svg2png(bytestring=svg.encode("utf-8"), output_width=WIDTH, output_height=HEIGHT)
    with Image.open(BytesIO(png)) as image:
        return image.convert("RGB")


def animated_svg(base: str, frame_index: int) -> str:
    phase = 2 * math.pi * frame_index / FRAME_COUNT

    def rotate_planet(match: re.Match[str]) -> str:
        planet_index = int(match.group(2))
        speed = 1.0 - planet_index * 0.08
        angle = (planet_index * 52 + (360 / FRAME_COUNT) * frame_index * speed) % 360
        return f"{match.group(1)}{angle:.3f}{match.group(4)}{match.group(5)}"

    svg = PLANET_RE.sub(rotate_planet, base)
    halo = 70 + 3.5 * math.sin(phase)
    svg = SUN_HALO_RE.sub(rf"\g<1>{halo:.3f}\g<3>", svg, count=1)
    return svg


def main() -> None:
    if not SVG_PATH.is_file():
        raise FileNotFoundError(f"Static fallback hero is missing: {SVG_PATH}")
    original = SVG_PATH.read_text(encoding="utf-8")
    if 'data-orbit="1"' not in original:
        raise RuntimeError("The hero SVG is missing orbit planet markers for animation.")

    frames = [render_svg(animated_svg(original, i)) for i in range(FRAME_COUNT)]

    thumbnails = [frame.resize((176, 104), Image.Resampling.LANCZOS) for frame in frames]
    contact_sheet = Image.new("RGB", (176 * 6, 104 * 4))
    for index, thumbnail in enumerate(thumbnails):
        contact_sheet.paste(thumbnail, ((index % 6) * 176, (index // 6) * 104))
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
        f"Animated solar hero created: {GIF_PATH.relative_to(ROOT)} "
        f"({FRAME_COUNT} frames, {FRAME_DURATION_MS} ms/frame)."
    )


if __name__ == "__main__":
    main()
