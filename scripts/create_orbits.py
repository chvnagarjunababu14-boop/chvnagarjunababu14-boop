#!/usr/bin/env python3
"""Build a minimal Tony-Stark-inspired animated developer electron field from public repos."""
import json, html, math
D=json.load(open("assets/solar-data.json",encoding="utf-8"))
repos=(D.get("publicRepositories") or [])[:10]
langs=D.get("languages") or []
colors=["#a78bfa","#67e8f9","#f472b6","#fbbf24","#60a5fa","#34d399","#fb7185","#c084fc","#38bdf8","#e879f9"]
W,H=900,330; cx,cy=450,168
out=[f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<defs>
 <linearGradient id="space" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#050712"/><stop offset=".52" stop-color="#0b1225"/><stop offset="1" stop-color="#041722"/></linearGradient>
 <radialGradient id="core"><stop stop-color="#f4f0ff"/><stop offset=".25" stop-color="#b8a1ff"/><stop offset=".6" stop-color="#8b5cf6"/><stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/></radialGradient>
 <radialGradient id="haze"><stop stop-color="#8055ff" stop-opacity=".32"/><stop offset="1" stop-color="#8055ff" stop-opacity="0"/></radialGradient>
 <filter id="blur"><feGaussianBlur stdDeviation="20"/></filter>
 <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<rect width="900" height="330" rx="20" fill="url(#space)"/>
<ellipse cx="{cx}" cy="{cy}" rx="330" ry="160" fill="url(#haze)" filter="url(#blur)"/>
<rect x="12" y="12" width="876" height="306" rx="17" fill="none" stroke="#7d95c9" stroke-opacity=".18"/>
''']
# sparse animated background stars
for i in range(72):
 x=(i*137.3)%860+20; y=(i*71.9)%290+18; rr=.6+(i%3)*.35
 out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rr:.1f}" fill="#d9e6ff" opacity=".24"><animate attributeName="opacity" values=".1;.55;.1" dur="{2.5+(i%5)*.6:.1f}s" repeatCount="indefinite"/></circle>')
# tilted orbital tracks, visually background
for i in range(max(4,len(repos))):
 rx=92+i*25; ry=34+i*12; tilt=(i*31-55)%180
 out.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" transform="rotate({tilt} {cx} {cy})" fill="none" stroke="#9eb9f5" stroke-opacity="{.075 if i%2 else .12}" stroke-width="1"/>')
# center core
out.append(f'''<circle cx="{cx}" cy="{cy}" r="68" fill="url(#core)" opacity=".18"><animate attributeName="opacity" values=".12;.26;.12" dur="3.5s" repeatCount="indefinite"/></circle>
<circle cx="{cx}" cy="{cy}" r="29" fill="url(#core)" filter="url(#glow)"><animate attributeName="r" values="24;31;24" dur="3.6s" repeatCount="indefinite"/></circle>
<circle cx="{cx}" cy="{cy}" r="12" fill="#ffffff" opacity=".9"><animate attributeName="opacity" values=".75;1;.75" dur="2.4s" repeatCount="indefinite"/></circle>
<text x="{cx}" y="{cy+53}" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" letter-spacing="3" fill="#b8c6ee" opacity=".65">STΛRLORD</text>''')
# Project nodes: electron style, names intentionally tiny/low-contrast, only a few labels
for i,r in enumerate(repos):
 color=colors[i%len(colors)]; name=html.escape((r.get("name") or "repo").replace("-"," ")[:18])
 rx=95+i*21; ry=38+i*11; tilt=(i*31-55)%180; speed=18+i*2.5; phase=i*39
 size=3.5+(min(int(r.get("stars",0)),8)*.35)
 label = f'<text x="{rx+size+8}" y="3" font-family="Arial,sans-serif" font-size="8" fill="#b8c9e9" opacity=".32">{name}</text>' if i<4 else ""
 out.append(f'''<g transform="translate({cx} {cy}) rotate({tilt})">
 <ellipse rx="{rx}" ry="{ry}" fill="none" stroke="{color}" stroke-opacity=".025"/>
 <g><animateTransform attributeName="transform" type="rotate" from="{phase}" to="{phase+360}" dur="{speed}s" repeatCount="indefinite"/>
 <circle cx="{rx}" cy="0" r="{size+7}" fill="{color}" opacity=".1"><animate attributeName="opacity" values=".04;.2;.04" dur="2.8s" repeatCount="indefinite"/></circle>
 <circle cx="{rx}" cy="0" r="{size}" fill="{color}" filter="url(#glow)" stroke="#eaf3ff" stroke-opacity=".7" stroke-width=".6"/>
 {label}</g></g>''')
out.append(f'<text x="34" y="294" font-family="Arial,sans-serif" font-size="9" letter-spacing="2" fill="#8aa6d4" opacity=".55">PROJECT PARTICLES  /  {len(repos)} ACTIVE</text><text x="866" y="294" text-anchor="end" font-family="Arial,sans-serif" font-size="9" fill="#8aa6d4" opacity=".45">{html.escape(", ".join(x[0] for x in langs[:4]))}</text></svg>')
open("assets/project-orbits.svg","w",encoding="utf-8").write("\\n".join(out))
print("Generated electron-field animation with",len(repos),"repository nodes")
