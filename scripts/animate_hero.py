#!/usr/bin/env python3
"""Slow, neat elliptical orbits + soft moons + gentle comets (size-aware GIF)."""
from __future__ import annotations

import math
import re
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SVG_PATH = ROOT / "assets" / "profile-universe.svg"
GIF_PATH = ROOT / "assets" / "profile-universe.gif"
FRAME_COUNT = 40
FRAME_DURATION_MS = 160
WIDTH, HEIGHT = 800, 473
COLORS = 64

PLANET_RE = re.compile(
    r'<g id="planet-(\d+)" data-orbit="1" data-cx="([^"]+)" data-cy="([^"]+)" '
    r'data-rx="([^"]+)" data-ry="([^"]+)" data-angle="([^"]+)"(?: data-speed="([^"]+)")? '
    r'transform="translate\([^"]+\)">'
)
MOON_RE = re.compile(
    r'<circle class="moon" data-moon="1" data-mr="([^"]+)" data-mang="([^"]+)" '
    r'cx="[^"]*" cy="[^"]*" r="([^"]*)"([^>]*)>'
)
COMET_RE = re.compile(
    r'<g id="comet-(\d+)" data-comet="1" data-y="([^"]+)" data-x0="([^"]+)" '
    r'data-span="([^"]+)" data-phase="([^"]+)" transform="translate\([^"]+\)">'
)
SUN_HALO_RE = re.compile(
    r'(<g id="sun-halo" data-sun="1">\s*<circle r=")(\d+(?:\.\d+)?)(")',
)


def render_svg(svg: str) -> Image.Image:
    try:
        import cairosvg
    except Exception as exc:  # pragma: no cover
        raise RuntimeError("cairosvg/cairo is required to render the animated hero GIF") from exc
    png = cairosvg.svg2png(bytestring=svg.encode("utf-8"), output_width=WIDTH, output_height=HEIGHT)
    with Image.open(BytesIO(png)) as image:
        return image.convert("RGB")


def animated_svg(base: str, frame_index: int) -> str:
    phase = 2 * math.pi * frame_index / FRAME_COUNT

    def move_planet(match: re.Match[str]) -> str:
        planet_index = int(match.group(1))
        cx, cy = float(match.group(2)), float(match.group(3))
        rx, ry = float(match.group(4)), float(match.group(5))
        start_angle = float(match.group(6))
        # Integer revolutions per loop keep the GIF seamless; pacing comes from frame duration.
        speed = float(match.group(7)) if match.group(7) else 1.0
        angle = (start_angle + (360 / FRAME_COUNT) * frame_index * speed) % 360
        rad = math.radians(angle)
        x = cx + rx * math.cos(rad)
        y = cy + ry * math.sin(rad)
        return (
            f'<g id="planet-{planet_index}" data-orbit="1" data-cx="{cx:g}" data-cy="{cy:g}" '
            f'data-rx="{rx:g}" data-ry="{ry:g}" data-angle="{angle:.3f}" data-speed="{speed:g}" '
            f'transform="translate({x:.2f} {y:.2f})">'
        )

    def move_moon(match: re.Match[str]) -> str:
        mr, mang, r, rest = float(match.group(1)), float(match.group(2)), match.group(3), match.group(4)
        angle = (mang + (360 / FRAME_COUNT) * frame_index * 0.45) % 360
        rad = math.radians(angle)
        x = mr * math.cos(rad)
        y = mr * math.sin(rad)
        return (
            f'<circle class="moon" data-moon="1" data-mr="{mr:g}" data-mang="{mang:g}" '
            f'cx="{x:.1f}" cy="{y:.1f}" r="{r}"{rest}>'
        )

    def move_comet(match: re.Match[str]) -> str:
        index = match.group(1)
        y, x0, span, cphase = map(float, match.group(2, 3, 4, 5))
        t = (frame_index / FRAME_COUNT + cphase) % 1
        eased = t * t * (3 - 2 * t)
        x = x0 + span * eased
        return (
            f'<g id="comet-{index}" data-comet="1" data-y="{y:g}" data-x0="{x0:g}" '
            f'data-span="{span:g}" data-phase="{cphase:g}" transform="translate({x:.2f} {y:.2f})">'
        )

    svg = PLANET_RE.sub(move_planet, base)
    svg = MOON_RE.sub(move_moon, svg)
    svg = COMET_RE.sub(move_comet, svg)
    halo = 68 + 1.6 * math.sin(phase)
    svg = SUN_HALO_RE.sub(rf"\g<1>{halo:.3f}\g<3>", svg, count=1)
    return svg


def main() -> None:
    if not SVG_PATH.is_file():
        raise FileNotFoundError(f"Static fallback hero is missing: {SVG_PATH}")
    original = SVG_PATH.read_text(encoding="utf-8")
    if 'data-rx="' not in original:
        raise RuntimeError("The hero SVG is missing elliptical orbit markers for animation.")

    frames = [render_svg(animated_svg(original, i)) for i in range(FRAME_COUNT)]
    thumbnails = [frame.resize((160, 95), Image.Resampling.LANCZOS) for frame in frames]
    contact_sheet = Image.new("RGB", (160 * 8, 95 * 6))
    for index, thumbnail in enumerate(thumbnails):
        contact_sheet.paste(thumbnail, ((index % 8) * 160, (index // 8) * 95))
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
    with Image.open(GIF_PATH) as animation:
        if not getattr(animation, "is_animated", False) or animation.n_frames < 20:
            raise RuntimeError("The generated hero GIF is not animated.")
    size_kb = GIF_PATH.stat().st_size / 1024
    print(
        f"Slow solar hero created: {GIF_PATH.relative_to(ROOT)} "
        f"({FRAME_COUNT} frames @ {FRAME_DURATION_MS}ms, {COLORS} colors, {size_kb:.0f} KB)."
    )


if __name__ == "__main__":
    main()
