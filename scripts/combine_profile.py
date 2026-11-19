#!/usr/bin/env python3
"""Compose hero and orbit art into one seamless unified holographic SVG."""
import re
from pathlib import Path
hero=Path("assets/nebula-hero.svg").read_text(encoding="utf-8")
orbit=Path("assets/project-orbits.svg").read_text(encoding="utf-8")
def inner(svg):
 m=re.search(r"<svg\b[^>]*>(.*)</svg>\s*$",svg,re.S)
 if not m: raise ValueError("SVG root not found")
 return m.group(1)
def remove_canvas_and_frame(content, width, height):
 # Remove source full-size canvas and border frame; unified background is drawn once below.
 content=re.sub(r'<rect\s+width="'+str(width)+r'"\s+height="'+str(height)+r'"[^>]*/?>','',content,count=1)
 content=re.sub(r'<rect\s+x="12"\s+y="12"\s+width="876"\s+height="306"[^>]*/?>','',content)
 return content
hero_inner=remove_canvas_and_frame(inner(hero),1100,470)
orbit_inner=remove_canvas_and_frame(inner(orbit),900,330)
# One continuous canvas, with overlapping layers to visually fuse the panels.
W,H=900,620
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<defs>
 <linearGradient id="unifiedBase" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#080716"/><stop offset=".42" stop-color="#101a31"/><stop offset=".78" stop-color="#08263a"/><stop offset="1" stop-color="#07121d"/></linearGradient>
 <radialGradient id="unifiedViolet"><stop stop-color="#8b5cf6" stop-opacity=".32"/><stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/></radialGradient>
 <radialGradient id="unifiedCyan"><stop stop-color="#06b6d4" stop-opacity=".24"/><stop offset="1" stop-color="#06b6d4" stop-opacity="0"/></radialGradient>
 <pattern id="unifiedGrid" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M34 0H0V34" fill="none" stroke="#9abaff" stroke-opacity=".035"/></pattern>
 <filter id="unifiedBlur"><feGaussianBlur stdDeviation="30"/></filter>
 <clipPath id="canvasClip"><rect width="900" height="620" rx="26"/></clipPath>
</defs>
<g clip-path="url(#canvasClip)">
 <rect width="900" height="620" fill="url(#unifiedBase)"/>
 <ellipse cx="190" cy="130" rx="390" ry="250" fill="url(#unifiedViolet)" filter="url(#unifiedBlur)"/>
 <ellipse cx="790" cy="410" rx="360" ry="270" fill="url(#unifiedCyan)" filter="url(#unifiedBlur)"/>
 <rect width="900" height="620" fill="url(#unifiedGrid)"/>
 <path d="M-70 250 C170 160 300 280 470 215 S760 150 970 220" fill="none" stroke="#8b5cf6" stroke-opacity=".08" stroke-width="72" filter="url(#unifiedBlur)"/>
 <path d="M-70 430 C180 350 330 470 510 400 S770 360 970 420" fill="none" stroke="#22d3ee" stroke-opacity=".07" stroke-width="65" filter="url(#unifiedBlur)"/>
 <svg x="0" y="0" width="900" height="330" viewBox="0 0 1100 470" preserveAspectRatio="xMidYMid meet">{hero_inner}</svg>
 <svg x="0" y="286" width="900" height="334" viewBox="0 0 900 330" preserveAspectRatio="xMidYMid meet">{orbit_inner}</svg>
 <rect x="13" y="13" width="874" height="594" rx="21" fill="none" stroke="#9abaff" stroke-opacity=".20"/>
</g>
</svg>'''
Path("assets/profile-universe.svg").write_text(svg,encoding="utf-8")
print("Created seamless combined artwork: 900x620")
