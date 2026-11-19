#!/usr/bin/env python3
"""Render the repository data into a looping orbital GIF for GitHub README."""
import json, math, os, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W,H=900,640
CX,CY=450,320
FRAMES=36
data=json.load(open("assets/solar-data.json",encoding="utf-8"))
repos=data.get("repositories",[])[:18]
palette={"TypeScript":"#3178c6","JavaScript":"#f1e05a","Python":"#3572A5","Java":"#b07219","C":"#555555","C++":"#f34b7d","Rust":"#dea584","Go":"#00ADD8","HTML":"#e34c26","CSS":"#563d7c","Kotlin":"#A97BFF","Swift":"#F05138","Shell":"#89e051","PHP":"#4F5D95","Ruby":"#701516","Dart":"#00B4AB","Vue":"#41b883","Other":"#88aaff"}
colors=["#57d3ff","#8c7bff","#f6c85f","#ff7b91","#58e0b5","#ff9d57","#a6e86b","#d28cff"]
random.seed(12)
stars=[(random.randrange(W),random.randrange(H),random.uniform(.2,1),random.randrange(2,5)) for _ in range(130)]
orbit_data=[]
for i,r in enumerate(repos):
    orbit=90+(i%6)*42
    # Slight elliptical orbit with staggered starting phases
    phase=i*2.399963
    size=6+min(6,math.log2(r.get("stars",0)+1)*1.5)
    orbit_data.append((r,orbit,phase,size,palette.get(r.get("language") or "Other",colors[i%len(colors)])))
try:
    font=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",12)
    small=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",10)
    title=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",18)
except:
    font=small=title=ImageFont.load_default()
frames=[]
for f in range(FRAMES):
    t=f/FRAMES
    im=Image.new("RGB",(W,H),(4,7,20))
    d=ImageDraw.Draw(im)
    # Soft nebula blobs, fixed background
    for x,y,alpha,rad in [(220,220,30,170),(680,390,24,200),(460,120,18,140)]:
        d.ellipse((x-rad,y-rad,x+rad,y+rad),fill=(12,15,38))
    # Starfield twinkle
    for x,y,base,period in stars:
        bright=max(30,min(255,int(80+base*140+45*math.sin(f/FRAMES*math.tau*period))))
        d.ellipse((x,y,x+1,y+1),fill=(bright,bright, min(255,bright+35)))
    d.text((W/2,28),data["username"].upper()+"  •  SOLAR SYSTEM",font=title,fill=(198,216,255),anchor="mm")
    d.text((W/2,51),f'{len(repos)} PROJECT PLANETS  |  {data.get("totalStars",0)} STARS',font=small,fill=(115,143,191),anchor="mm")
    # Orbital paths
    for r,orbit,phase,size,color in orbit_data:
        d.ellipse((CX-orbit,CY-orbit*.66,CX+orbit,CY+orbit*.66),outline=(30,45,76),width=1)
    # Central star glow via layers
    glow=Image.new("RGBA",(W,H),(0,0,0,0)); gd=ImageDraw.Draw(glow)
    gd.ellipse((CX-74,CY-74,CX+74,CY+74),fill=(255,165,30,80))
    glow=glow.filter(ImageFilter.GaussianBlur(22)); im=Image.alpha_composite(im.convert("RGBA"),glow)
    d=ImageDraw.Draw(im)
    d.ellipse((CX-34,CY-34,CX+34,CY+34),fill=(255,174,35))
    d.ellipse((CX-26,CY-26,CX+26,CY+26),fill=(255,218,90))
    d.ellipse((CX-14,CY-14,CX+14,CY+14),fill=(255,247,185))
    d.text((CX,CY+47),data["username"],font=small,fill=(235,243,255),anchor="mm")
    # Moving planets and labels
    for i,(r,orbit,phase,size,color) in enumerate(orbit_data):
        speed=1/(1+(i%5)*.22)
        angle=phase+t*math.tau*speed
        x=CX+math.cos(angle)*orbit
        y=CY+math.sin(angle)*orbit*.66
        # glow ring
        d.ellipse((x-size-3,y-size-3,x+size+3,y+size+3),outline=tuple(int(color[k:k+2],16) for k in (1,3,5)),width=1)
        d.ellipse((x-size,y-size,x+size,y+size),fill=color)
        # Label position alternating to avoid overlap
        label=(r.get("name") or "")[:20]
        label_y=y-size-8 if math.sin(angle)<0 else y+size+5
        label_x=x
        d.text((label_x,label_y),label,font=small,fill=(215,227,255),anchor="mm")
    # bottom stack legend
    langs=", ".join([x["name"] for x in data.get("languages",[])[:6]])
    d.text((W/2,H-26),langs,font=small,fill=(105,133,181),anchor="mm")
    frames.append(im.convert("RGB"))
os.makedirs("assets",exist_ok=True)
frames[0].save("assets/solar-system.gif",save_all=True,append_images=frames[1:],duration=90,loop=0,optimize=False)
print("Animated GIF rendered:",len(frames),"frames")
