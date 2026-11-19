#!/usr/bin/env python3
"""Compose hero + orbit scene in a clean, colorful unified nebula canvas."""
import re
from pathlib import Path
hero=Path("assets/nebula-hero.svg").read_text(encoding="utf-8")
orbit=Path("assets/project-orbits.svg").read_text(encoding="utf-8")
def inner(svg):
 m=re.search(r"<svg\b[^>]*>(.*)</svg>\s*$",svg,re.S)
 if not m: raise ValueError("SVG root not found")
 return m.group(1)
def strip_canvas(s):
 s=re.sub(r'<rect\s+width="(?:1100|900)"\s+height="(?:470|330)"[^>]*?(?:/>|>.*?</rect>)','',s,count=1,flags=re.S)
 s=re.sub(r'<rect\s+x="12"\s+y="12"\s+width="876"\s+height="306"[^>]*/>','',s)
 s=re.sub(r'<rect\s+x="18"\s+y="18"\s+width="864"\s+height="354"[^>]*/>','',s)
 return s
def prefix_ids(s,p):
 ids=re.findall(r'\bid="([^"]+)"',s)
 for id in ids:
  s=s.replace(f'id="{id}"',f'id="{p}{id}"').replace(f'url(#{id})',f'url(#{p}{id})')
  s=s.replace(f'href="#{id}"',f'href="#{p}{id}"').replace(f'xlink:href="#{id}"',f'xlink:href="#{p}{id}"')
 return s
H=prefix_ids(strip_canvas(inner(hero)),"hero_")
O=prefix_ids(strip_canvas(inner(orbit)),"orbit_")
W,HH=900,714
out=f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{W}" height="{HH}" viewBox="0 0 {W} {HH}">
<defs>
 <linearGradient id="base" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#090717"/><stop offset=".38" stop-color="#121b36"/><stop offset=".72" stop-color="#082a3b"/><stop offset="1" stop-color="#081323"/></linearGradient>
 <radialGradient id="violet"><stop stop-color="#8b5cf6" stop-opacity=".42"/><stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/></radialGradient>
 <radialGradient id="cyan"><stop stop-color="#06b6d4" stop-opacity=".28"/><stop offset="1" stop-color="#06b6d4" stop-opacity="0"/></radialGradient>
 <radialGradient id="pink"><stop stop-color="#ec4899" stop-opacity=".18"/><stop offset="1" stop-color="#ec4899" stop-opacity="0"/></radialGradient>
 <pattern id="grid" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M34 0H0V34" fill="none" stroke="#a6c5ff" stroke-opacity=".045"/></pattern>
 <filter id="blur"><feGaussianBlur stdDeviation="35"/></filter>
 <clipPath id="clip"><rect width="900" height="714" rx="26"/></clipPath>
</defs>
<g clip-path="url(#clip)">
 <rect width="900" height="714" fill="url(#base)"/>
 <ellipse cx="170" cy="150" rx="430" ry="290" fill="url(#violet)" filter="url(#blur)"/>
 <ellipse cx="800" cy="460" rx="390" ry="320" fill="url(#cyan)" filter="url(#blur)"/>
 <ellipse cx="490" cy="620" rx="400" ry="210" fill="url(#pink)" filter="url(#blur)"/>
 <rect width="900" height="714" fill="url(#grid)"/>
 <path d="M-50 220 C170 145 310 285 470 210 S760 145 950 220" fill="none" stroke="#8b5cf6" stroke-opacity=".10" stroke-width="70" filter="url(#blur)"/>
 <path d="M-50 500 C170 420 310 560 470 485 S760 420 950 500" fill="none" stroke="#22d3ee" stroke-opacity=".09" stroke-width="70" filter="url(#blur)"/>
 <!-- Hero scene: upper region, proportionally fitted -->
 <g transform="translate(0 0) scale(.8181818 .8170213)">{H}</g>
 <!-- Electron/project scene: starts below the hero, no overlap -->
 <g transform="translate(0 382)">{O}</g>
 <rect x="13" y="13" width="874" height="688" rx="22" fill="none" stroke="#a5bbf7" stroke-opacity=".24"/>
</g>
</svg>'''
Path("assets/profile-universe.svg").write_text(out,encoding="utf-8")
print("Seamless 900x714 profile canvas generated with non-overlapping hero and electron scenes.")
