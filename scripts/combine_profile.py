#!/usr/bin/env python3
"""Combine hero and animated electron SVG into one README graphic."""
import re
from pathlib import Path
hero=Path("assets/nebula-hero.svg").read_text(encoding="utf-8")
orbit=Path("assets/project-orbits.svg").read_text(encoding="utf-8")
def inner(svg):
 m=re.search(r"<svg\b[^>]*>(.*)</svg>\s*$",svg,re.S)
 if not m: raise ValueError("SVG root not found")
 return m.group(1)
HH=384; OH=330; TOTAL=HH+OH
combined=f'<svg xmlns="http://www.w3.org/2000/svg" width="900" height="{TOTAL}" viewBox="0 0 900 {TOTAL}"><rect width="900" height="{TOTAL}" rx="26" fill="#070b18"/><svg x="0" y="0" width="900" height="{HH}" viewBox="0 0 1100 470" preserveAspectRatio="xMidYMid meet">{inner(hero)}</svg><svg x="0" y="{HH}" width="900" height="{OH}" viewBox="0 0 900 330" preserveAspectRatio="xMidYMid meet">{inner(orbit)}</svg></svg>'
Path("assets/profile-universe.svg").write_text(combined,encoding="utf-8")
print("Combined profile artwork:",TOTAL,"px tall")
