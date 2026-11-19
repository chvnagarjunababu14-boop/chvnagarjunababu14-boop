#!/usr/bin/env python3
"""Merge two SVG scenes into one continuous canvas with a single background."""
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
 # Remove panel outline/frame
 s=re.sub(r'<rect\s+x="12"\s+y="12"\s+width="876"\s+height="306"[^>]*/>','',s)
 s=re.sub(r'<rect\s+x="18"\s+y="18"\s+width="864"\s+height="354"[^>]*/>','',s)
 return s
def prefix_ids(s,p):
 ids=re.findall(r'\bid="([^"]+)"',s)
 for id in ids:
  s=s.replace(f'id="{id}"',f'id="{p}{id}"')
  s=s.replace(f'url(#{id})',f'url(#{p}{id})')
  s=s.replace(f'href="#{id}"',f'href="#{p}{id}"')
  s=s.replace(f'xlink:href="#{id}"',f'xlink:href="#{p}{id}"')
 return s
H=prefix_ids(strip_canvas(inner(hero)),"hero_")
O=prefix_ids(strip_canvas(inner(orbit)),"orbit_")
W,HGT=900,620
out=f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{W}" height="{HGT}" viewBox="0 0 {W} {HGT}">
<defs>
 <linearGradient id="unifiedBase" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#070716"/><stop offset=".4" stop-color="#101a33"/><stop offset=".78" stop-color="#08283b"/><stop offset="1" stop-color="#06111c"/></linearGradient>
 <radialGradient id="violetAtmos"><stop stop-color="#8b5cf6" stop-opacity=".38"/><stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/></radialGradient>
 <radialGradient id="cyanAtmos"><stop stop-color="#06b6d4" stop-opacity=".26"/><stop offset="1" stop-color="#06b6d4" stop-opacity="0"/></radialGradient>
 <pattern id="holoGrid" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M34 0H0V34" fill="none" stroke="#9abaff" stroke-opacity=".035"/></pattern>
 <filter id="atmosBlur"><feGaussianBlur stdDeviation="34"/></filter>
 <clipPath id="clipAll"><rect width="900" height="620" rx="26"/></clipPath>
</defs>
<g clip-path="url(#clipAll)">
 <rect width="900" height="620" fill="url(#unifiedBase)"/>
 <ellipse cx="170" cy="130" rx="400" ry="260" fill="url(#violetAtmos)" filter="url(#atmosBlur)"/>
 <ellipse cx="800" cy="440" rx="390" ry="300" fill="url(#cyanAtmos)" filter="url(#atmosBlur)"/>
 <rect width="900" height="620" fill="url(#holoGrid)"/>
 <path d="M-60 220 C170 140 310 280 470 210 S760 140 960 230" fill="none" stroke="#8b5cf6" stroke-opacity=".09" stroke-width="80" filter="url(#atmosBlur)"/>
 <path d="M-60 430 C160 350 340 480 520 400 S780 350 960 430" fill="none" stroke="#22d3ee" stroke-opacity=".075" stroke-width="70" filter="url(#atmosBlur)"/>
 <g transform="translate(0 0) scale(.8181818 .8170213)">{H}</g>
 <g transform="translate(0 258)">{O}</g>
 <rect x="13" y="13" width="874" height="594" rx="21" fill="none" stroke="#a5bbf7" stroke-opacity=".2"/>
</g>
</svg>'''
Path("assets/profile-universe.svg").write_text(out,encoding="utf-8")
print("Merged both scenes into a single 900x620 SVG canvas with unified nebula background.")
