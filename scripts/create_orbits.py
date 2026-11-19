#!/usr/bin/env python3
"""Generate an auto-looping, data-driven project-orbit GIF."""
import json, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
DATA="assets/solar-data.json"; OUT="assets/project-orbits.gif"
W,H=900,390; FRAMES=48; DURATION=90
with open(DATA,encoding="utf-8") as f: data=json.load(f)
repos=(data.get("publicRepositories") or [])[:8]; langs=data.get("languages") or []; username=data.get("username","developer")
colors=["#a78bfa","#67e8f9","#f472b6","#fbbf24","#60a5fa","#34d399","#fb7185","#c084fc"]
try:
 small=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",11)
 title=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",22)
except OSError: small=title=ImageFont.load_default()
frames=[]
for frame in range(FRAMES):
 im=Image.new("RGBA",(W,H),(7,10,20,255)); glow=Image.new("RGBA",(W,H),(0,0,0,0)); gd=ImageDraw.Draw(glow)
 gd.ellipse((50,20,470,430),fill=(105,60,210,48)); gd.ellipse((500,-80,950,380),fill=(10,150,210,32))
 im=Image.alpha_composite(im,glow.filter(ImageFilter.GaussianBlur(48))); d=ImageDraw.Draw(im)
 for i in range(110):
  x=(i*97+frame*13)%W; y=(i*53+frame*3)%H; a=90+int(65*math.sin(frame/4+i)
  d.ellipse((x,y,x+1.5,y+1.5),fill=(185,215,255,a))
 d.rounded_rectangle((22,20,W-22,H-20),radius=20,outline=(80,100,150,150),width=1,fill=(15,20,35,120))
 d.text((48,44),"PROJECT ORBIT / PUBLIC REPOSITORIES",font=small,fill=(140,165,210,255))
 d.text((48,70),"My projects, moving through the universe",font=title,fill=(235,240,255,255))
 cx,cy=500,225
 for radius in (75,125,175,220): d.ellipse((cx-radius,cy-radius*.62,cx+radius,cy+radius*.62),outline=(70,90,130,105),width=1)
 pulse=1+.12*math.sin(frame*2*math.pi/FRAMES); rr=int(22*pulse)
 d.ellipse((cx-rr-8,cy-rr-8,cx+rr+8,cy+rr+8),fill=(105,70,190,70)); d.ellipse((cx-rr,cy-rr,cx+rr,cy+rr),fill=(220,210,255,255),outline=(150,120,255,255))
 d.text((cx-28,cy+35),"STARLORD",font=small,fill=(210,205,255,255))
 for idx,rp in enumerate(repos):
  radius=75+idx*20; angle=frame*2*math.pi/FRAMES*(.7+idx*.06)+idx*1.3
  x=cx+radius*math.cos(angle); y=cy+radius*.62*math.sin(angle); pr=7+(rp.get("stars",0)>0)*2
  d.ellipse((x-pr-3,y-pr-3,x+pr+3,y+pr+3),fill=(70,120,220,65)); d.ellipse((x-pr,y-pr,x+pr,y+pr),fill=colors[idx%len(colors)],outline=(235,240,255,230))
  name=(rp.get("name") or "project")[:17]; tx=min(W-220,max(40,x+13)); ty=min(H-28,max(128,y-12))
  d.text((tx,ty),name,font=small,fill=(205,220,245,255))
 d.text((48,H-55),"STACK SIGNAL / "+", ".join(x[0] for x in langs[:5]),font=small,fill=(115,205,230,255))
 d.text((48,H-34),"github.com/"+username,font=small,fill=(120,145,185,255))
 frames.append(im.convert("RGB").quantize(colors=128))
frames[0].save(OUT,save_all=True,append_images=frames[1:],duration=DURATION,loop=0,optimize=True,disposal=2)
print(f"Created autoplay GIF: {OUT} ({FRAMES} frames; {len(repos)} projects)")
