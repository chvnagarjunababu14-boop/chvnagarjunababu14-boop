// StarLord Solar System — custom portfolio generator. Public repository data only.
async function main(){
const username=process.env.GITHUB_USERNAME||'chvnagarjunababu14-boop';
const headers={Accept:'application/vnd.github+json','User-Agent':'starlord-solar-profile'};
if(process.env.GITHUB_TOKEN)headers.Authorization='Bearer '+process.env.GITHUB_TOKEN;
async function api(url){const r=await fetch(url,{headers});if(!r.ok)throw new Error('GitHub API '+r.status+' at '+url);return r.json();}
const profile=await api('https://api.github.com/users/'+username);
const all=await api('https://api.github.com/users/'+username+'/repos?type=public&sort=updated&per_page=100');
const repos=all.filter(r=>!r.private&&!r.archived&&r.name.toLowerCase()!==username.toLowerCase()).slice(0,100);
const langmaps=await Promise.all(repos.map(r=>api(r.languages_url)));
const totals={};langmaps.forEach(m=>Object.entries(m).forEach(([k,v])=>totals[k]=(totals[k]||0)+v));
const allLangs=Object.entries(totals).sort((a,b)=>b[1]-a[1]);
const langs=allLangs.slice(0,8);
const palette={TypeScript:'#5BC0EB',JavaScript:'#F0C75E',Python:'#82AAFF',Java:'#E2A36B',Rust:'#E07A5F',Kotlin:'#C792EA',CSS:'#7FDBDA',HTML:'#F07178',Go:'#56D6C9',C:'#9AA39A','C++':'#C88791',PHP:'#9B91B5',Ruby:'#B77E7A',Dart:'#82AFA9',Shell:'#A6B18D',SQL:'#C49D69',PLpgSQL:'#A7B18D',Swift:'#D18F72'};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const stars=repos.reduce((n,r)=>n+r.stargazers_count,0);
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const featuredPriority=['safeher','knox','store-point','devcatalyst-community-crm'];
const ranked=[...repos].sort((a,b)=>(b.stargazers_count-a.stargazers_count)||new Date(b.updated_at)-new Date(a.updated_at));
const featured=[];
for(const key of featuredPriority){const hit=ranked.find(r=>slug(r.name)===key);if(hit)featured.push(hit);}
for(const r of ranked){if(featured.length>=4)break;if(!featured.includes(r))featured.push(r);}
const moreWork=ranked.filter(r=>!featured.includes(r));
const colors=['#F0C75E','#5BC0EB','#C792EA','#E07A5F','#56D6C9','#82AAFF','#F07178'];
const cardBgs=['#0A1020','#0C1428','#10182C','#0B1526','#121A30','#0E1628','#111828'];
const projectSummaries={
 'safeher':'Privacy-first Android safety app with emergency SOS, check-ins and trusted guardian alerts.',
 'knox':'Rust-based knowledge graph preserving project decisions and context for AI coding agents.',
 'store-point':'Offline-first retail POS with barcode checkout, inventory and multi-branch analytics.',
 'devcatalyst-community-crm':'Student-club CRM for projects, events, recruitment and member directory.',
 'quantumshield-india':'Early learning site for cybersecurity and quantum tech, with lessons and a sample quiz.',
 'feed-hyderabad':'Location-based platform connecting restaurants with surplus food to nearby NGOs.',
 'fresh-circle':'FreshLink matches nearby produce vendors and buyers, with stock and surplus discounts.'
};
const projectNames={
 'safeher':'SafeHer-Next',
 'store-point':'StorePoint',
 'devcatalyst-community-crm':'DevCatalyst CRM',
 'quantumshield-india':'QuantumShield India',
 'feed-hyderabad':'Feed Hyderabad',
 'fresh-circle':'FreshLink'
};
const projectTags={'knox':'Rust / Tauri','safeher':'Kotlin','store-point':'TypeScript','devcatalyst-community-crm':'TypeScript','quantumshield-india':'TypeScript / Python','fresh-circle':'TypeScript','feed-hyderabad':'TypeScript'};
const totalLanguageBytes=Object.values(totals).reduce((sum,n)=>sum+n,0)||1;
const orbitLangs=langs.slice(0,6).map(([name,bytes],i)=>{
 const pct=bytes/totalLanguageBytes*100;
 const label=pct>0&&pct<1?'<1%':Math.round(pct)+'%';
 return {name,color:palette[name]||colors[i%colors.length],pct,label,rx:78+i*28,ry:36+i*14,start:i*47,size:7+Math.min(10,Math.round(pct/8))};
});

const projectArts=featured.map((r,i)=>{
 const color=colors[i%colors.length],langColor=palette[r.language]||color,bg=cardBgs[i%cardBgs.length];
 const labelName=projectNames[slug(r.name)]||r.name;const rawName=labelName.length>25?labelName.slice(0,24)+'…':labelName,displayName=esc(rawName),titleSize=Math.min(42,Math.max(30,540/(rawName.length*.56)));
 const summary=projectSummaries[slug(r.name)]||r.description||('A '+(r.language||'software')+' project from my public repositories.');
 const words=String(summary).split(/\s+/),lines=[];let line='';
 for(const word of words){if(line&&(line+' '+word).length>38){lines.push(line);line=word;}else line=(line+' '+word).trim();}
 if(line)lines.push(line);
 const visibleLines=lines.slice(0,3);if(lines.length>3)visibleLines[2]=visibleLines[2].replace(/[.,;:]?$/,'')+'…';const descSvg=visibleLines.map((line,j)=>'<tspan x="48" dy="'+(j===0?0:24)+'">'+esc(line)+'</tspan>').join('');
 const lang=esc(projectTags[slug(r.name)]||r.language||'Multi-stack'),updated=new Date(r.updated_at).toISOString().slice(0,10),repoStars=r.stargazers_count;
 const keyword=(r.name+' '+summary).toLowerCase();
 const motif=keyword.includes('safe')?
 '<g transform="translate(685 158)"><circle r="112" fill="none" stroke="'+color+'" stroke-opacity=".18" stroke-width="1.5"/><path d="M0-84L66-58V8C66 52 29 85 0 102-29 85-66 52-66 8V-58Z" fill="'+color+'" fill-opacity=".13" stroke="'+color+'" stroke-width="3"/><path d="M-28 0L-8 20 35-28" fill="none" stroke="#E8EEF8" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M-92 88Q0 126 92 88" fill="none" stroke="'+color+'" stroke-opacity=".35"/></g>'
 :keyword.includes('feed')||keyword.includes('food')||keyword.includes('hyderabad')?
 '<g transform="translate(685 162)"><path d="M-94-15H94L72 84H-72Z" fill="'+color+'" fill-opacity=".10" stroke="'+color+'" stroke-width="3"/><path d="M-62-15L-31-74H31L62-15" fill="none" stroke="'+color+'" stroke-width="5"/><path d="M-42 18H42M-42 45H29" stroke="#E8EEF8" stroke-opacity=".85" stroke-width="7" stroke-linecap="round"/><path d="M0-100C-25-67-27-49 0-37 27-49 25-67 0-100Z" fill="'+color+'"/><path d="M0-81V-50" stroke="#E8EEF8" stroke-width="4"/></g>'
 :keyword.includes('fresh')||keyword.includes('produce')||keyword.includes('circle')?
 '<g transform="translate(685 165)"><circle r="106" fill="none" stroke="'+color+'" stroke-opacity=".25"/><path d="M-5 88C-17 5 10-55 82-91 89-17 57 48-5 88Z" fill="'+color+'" fill-opacity=".35" stroke="'+color+'" stroke-width="3"/><path d="M-5 88C-76 67-105 11-88-55-26-45 13 0-5 88Z" fill="'+langColor+'" fill-opacity=".30" stroke="'+langColor+'" stroke-width="3"/><path d="M-5 88L51-56M-5 88L-69-28" stroke="#E8EEF8" stroke-opacity=".8" stroke-width="3"/><path d="M-115 106Q0 132 115 106" fill="none" stroke="'+color+'" stroke-opacity=".4"/></g>'
 :keyword.includes('store')||keyword.includes('point of sale')||keyword.includes('retail')||keyword.includes('inventory')?
 '<g transform="translate(685 165)"><path d="M-104-48L-78-93H78L104-48V-24H-104Z" fill="'+color+'" fill-opacity=".16" stroke="'+color+'" stroke-width="3"/><rect x="-83" y="-24" width="166" height="116" rx="10" fill="'+color+'" fill-opacity=".08" stroke="'+color+'" stroke-width="3"/><path d="M-49-24V92M49-24V92" stroke="'+color+'" stroke-opacity=".35"/><circle cx="-32" cy="105" r="13" fill="'+color+'"/><circle cx="32" cy="105" r="13" fill="'+color+'"/><path d="M-45 18H45M-45 45H26" stroke="#E8EEF8" stroke-opacity=".8" stroke-width="7" stroke-linecap="round"/></g>'
 :keyword.includes('quantum')||keyword.includes('cyber')?
 '<g transform="translate(685 165)"><rect x="-72" y="-72" width="144" height="144" rx="22" fill="'+color+'" fill-opacity=".10" stroke="'+color+'" stroke-width="3"/><g stroke="'+color+'" stroke-width="4"><path d="M-105-42H-72M-105 0H-72M-105 42H-72M72-42H105M72 0H105M72 42H105M-42-105V-72M0-105V-72M42-105V-72M-42 72V105M0 72V105M42 72V105"/></g><g fill="none" stroke="'+langColor+'" stroke-width="4"><ellipse rx="56" ry="24" transform="rotate(35)"/><ellipse rx="56" ry="24" transform="rotate(-35)"/><ellipse rx="56" ry="24" transform="rotate(90)"/></g><circle r="12" fill="#E8EEF8"/></g>'
 :keyword.includes('crm')||keyword.includes('community')||keyword.includes('catalyst')?
 '<g transform="translate(685 162)"><circle cx="-45" cy="-35" r="25" fill="'+color+'"/><circle cx="45" cy="-35" r="25" fill="'+langColor+'"/><circle cy="-65" r="28" fill="#E8EEF8"/><path d="M-90 78V43C-90 12-65 0-45 0S0 12 0 43V78ZM0 78V43C0 12 25 0 45 0S90 12 90 43V78Z" fill="'+color+'" fill-opacity=".16" stroke="'+color+'" stroke-width="3"/><path d="M-37 78V21C-37-15 0-22 0-22S37-15 37 21V78Z" fill="'+langColor+'" fill-opacity=".2" stroke="'+langColor+'" stroke-width="3"/></g>'
 :keyword.includes('knox')||keyword.includes('knowledge graph')||keyword.includes('rust')||keyword.includes('desktop')?
 '<g transform="translate(685 164)"><g stroke="'+color+'" stroke-width="4" fill="none"><path d="M-82-50L0-84 80-38 67 54 0 85-75 45Z"/><path d="M-82-50L-18 0 80-38M-18 0L67 54M-18 0L0 85"/></g><g fill="'+langColor+'" stroke="#E8EEF8" stroke-width="2"><circle cx="-82" cy="-50" r="14"/><circle cx="0" cy="-84" r="14"/><circle cx="80" cy="-38" r="14"/><circle cx="67" cy="54" r="14"/><circle cx="0" cy="85" r="14"/><circle cx="-75" cy="45" r="14"/><circle cx="-18" cy="0" r="19"/></g></g>'
 :'<g transform="translate(685 164)"><circle r="104" fill="none" stroke="'+color+'" stroke-opacity=".35"/><circle r="70" fill="none" stroke="'+langColor+'" stroke-width="2" stroke-dasharray="3 9"/><path d="M-58-10L0-76 58-10 0 76Z" fill="'+color+'" fill-opacity=".16" stroke="'+color+'" stroke-width="3"/><circle r="17" fill="#E8EEF8"/></g>';
 const starsText='★ '+repoStars+'   ·   UPDATED '+updated;
 const gid='c'+i;
 const art='<svg xmlns="http://www.w3.org/2000/svg" width="900" height="320" viewBox="0 0 900 320"><defs><linearGradient id="'+gid+'Bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+bg+'"/><stop offset="1" stop-color="'+color+'" stop-opacity=".22"/></linearGradient><linearGradient id="'+gid+'Line" x1="0" y1="0" x2="1" y2="0"><stop stop-color="'+color+'" stop-opacity=".85"/><stop offset="1" stop-color="#5BC0EB" stop-opacity=".35"/></linearGradient></defs><rect width="900" height="320" rx="20" fill="url(#'+gid+'Bg)"/><rect x="8" y="8" width="884" height="304" rx="15" fill="none" stroke="#8FA3C8" stroke-opacity=".18"/><circle cx="780" cy="70" r="1.5" fill="#E8EEF8" opacity=".35"/><circle cx="820" cy="110" r="1" fill="#E8EEF8" opacity=".25"/><circle cx="740" cy="130" r="1.2" fill="#E8EEF8" opacity=".3"/><path d="M0 276Q220 236 440 278T900 252" fill="none" stroke="url(#'+gid+'Line)" stroke-opacity=".24" stroke-width="1.5"/><path d="M48 52H112" stroke="'+color+'" stroke-width="3"/><text x="48" y="40" font-family="Georgia,serif" font-size="16" letter-spacing="2.2" fill="'+color+'">'+lang.toUpperCase()+'  /  MOON</text><text x="48" y="119" font-family="Georgia,Times New Roman,serif" font-size="'+titleSize+'" font-weight="700" fill="#E8EEF8">'+displayName+'</text><text x="48" y="148" font-family="Arial,sans-serif" font-size="24" fill="#A8B4D0">'+descSvg+'</text><rect x="48" y="226" width="180" height="36" rx="17" fill="'+langColor+'" fill-opacity=".15" stroke="'+langColor+'" stroke-opacity=".6"/><text x="138" y="249" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#E8EEF8">'+lang+'</text><text x="48" y="286" font-family="Consolas,monospace" font-size="15" letter-spacing=".5" fill="#8FA3C8">'+starsText+'</text>'+motif+'<text x="850" y="296" text-anchor="end" font-family="Arial,sans-serif" font-size="12" letter-spacing="1.5" fill="'+color+'">VIEW PROJECT ↗</text></svg>';
 return {r,i,color,art};
});
const projectCards=projectArts.map(p=>{const label=projectNames[slug(p.r.name)]||p.r.name;return '<a href="'+p.r.html_url+'"><img src="./assets/projects/'+slug(p.r.name)+'.svg" width="100%" alt="'+esc(label)+' project card"/></a>'}).reduce((a,x,i)=>{if(i%2===0)a.push([x]);else a[a.length-1].push(x);return a;},[]).map(row=>'<p align="center">'+row.map(x=>x.replace('width="100%"','width="47%"')).join(' &nbsp; ')+'</p>').join('\n');
const moreWorkLine=moreWork.length
 ? '<p align="center"><sub>Also in orbit: '+moreWork.map(r=>{const label=projectNames[slug(r.name)]||r.name;return '<a href="'+r.html_url+'">'+esc(label)+'</a>';}).join(' · ')+'</sub></p>'
 : '';
const navItems=[
 {id:'about',number:'01',label:'ABOUT',color:'#F0C75E'},
 {id:'snapshot',number:'02',label:'SNAPSHOT',color:'#5BC0EB'},
 {id:'toolkit',number:'03',label:'TOOLKIT',color:'#C792EA'},
 {id:'selected-work',number:'04',label:'SELECTED WORK',color:'#56D6C9'}
];
const navSvgs=navItems.map(item=>({ ...item, svg:'<svg xmlns="http://www.w3.org/2000/svg" width="300" height="72" viewBox="0 0 300 72"><rect x="1" y="1" width="298" height="70" rx="12" fill="#0A1020" stroke="#3D4F73" stroke-opacity=".75" stroke-width="1.5"/><rect x="1" y="13" width="5" height="46" rx="2.5" fill="'+item.color+'"/><text x="22" y="28" font-family="Arial,sans-serif" font-size="11" font-weight="700" letter-spacing="2" fill="'+item.color+'">'+item.number+' / SECTOR</text><text x="22" y="53" font-family="Arial,sans-serif" font-size="18" font-weight="700" letter-spacing=".8" fill="#E8EEF8">'+item.label+'</text><path d="M262 36H278M271 29L278 36 271 43" fill="none" stroke="'+item.color+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' }));
const navCards=navSvgs.map(item=>'<a href="#'+item.id+'"><img src="./assets/nav-'+item.id+'.svg" width="22%" alt="'+item.number+' '+item.label+' section navigation"/></a>').join(' &nbsp; ');
const metricItems=[
 {value:repos.length,label:'PUBLIC PROJECTS',symbol:'✳',color:'#F0C75E'},
 {value:stars,label:'TOTAL STARS',symbol:'★',color:'#5BC0EB'},
 {value:allLangs.length,label:'PLANETS',symbol:'◉',color:'#C792EA'},
 {value:featured.length,label:'FEATURED MOONS',symbol:'◎',color:'#56D6C9'}
];
const metricsSvg='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="178" viewBox="0 0 1200 178"><defs><linearGradient id="metricBg" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#070B18"/><stop offset=".52" stop-color="#0B1225"/><stop offset="1" stop-color="#0A1528"/></linearGradient><linearGradient id="metricEdge"><stop stop-color="#F0C75E"/><stop offset=".48" stop-color="#5BC0EB"/><stop offset="1" stop-color="#C792EA"/></linearGradient></defs><rect x="5" y="5" width="1190" height="168" rx="18" fill="url(#metricBg)" stroke="url(#metricEdge)" stroke-opacity=".45" stroke-width="1.4"/><text x="32" y="31" font-family="Arial,sans-serif" font-size="12" font-weight="700" letter-spacing="2.2" fill="#F0C75E">02 / SYSTEM READOUT</text><text x="1165" y="31" text-anchor="end" font-family="Consolas,monospace" font-size="11" letter-spacing="1" fill="#8FA3C8">PUBLIC GITHUB DATA</text>'+metricItems.map((m,i)=>{const x=150+i*300;return (i?'<path d="M'+(i*300)+' 65V150" stroke="#3D4F73" stroke-opacity=".55"/>':'')+'<circle cx="'+(x-51)+'" cy="108" r="25" fill="'+m.color+'" fill-opacity=".10" stroke="'+m.color+'" stroke-opacity=".54"/><text x="'+(x-51)+'" y="116" text-anchor="middle" font-family="Georgia,serif" font-size="25" fill="'+m.color+'">'+m.symbol+'</text><text x="'+(x-10)+'" y="114" font-family="Georgia,serif" font-size="36" font-weight="700" fill="#E8EEF8">'+m.value+'</text><text x="'+(x-10)+'" y="139" font-family="Arial,sans-serif" font-size="11" letter-spacing="1.7" fill="#8FA3C8">'+m.label+'</text>';}).join('')+'</svg>';
const stackItems=langs.map(([name,bytes],i)=>{const color=palette[name]||colors[i%colors.length];const pct=bytes/totalLanguageBytes*100;const label=pct>0&&pct<1?'<1%':Math.round(pct)+'%';return {name,color,pct,label};});
const maxPct=Math.max(1,...stackItems.map(x=>x.pct));
const stackSvg='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="232" viewBox="0 0 1200 232"><defs><linearGradient id="stackPanel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#070B18"/><stop offset="1" stop-color="#0B1528"/></linearGradient><linearGradient id="stackEdge"><stop stop-color="#F0C75E"/><stop offset="1" stop-color="#5BC0EB"/></linearGradient></defs><rect x="5" y="5" width="1190" height="222" rx="18" fill="url(#stackPanel)" stroke="url(#stackEdge)" stroke-opacity=".35"/><text x="32" y="39" font-family="Georgia,serif" font-size="18" font-weight="700" letter-spacing="1.3" fill="#F0C75E">03 / LANGUAGE PLANETS</text><text x="1165" y="38" text-anchor="end" font-family="Consolas,monospace" font-size="11" letter-spacing="1" fill="#8FA3C8">TOP 8 · SHARE OF PUBLIC CODE</text>'+stackItems.map((item,i)=>{const col=i%4,row=Math.floor(i/4),x=24+col*294,y=64+row*80,w=280;const bar=Math.max(item.pct>0?3:0,190*item.pct/maxPct);return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="66" rx="11" fill="#050814" stroke="#3D4F73" stroke-opacity=".45"/><rect x="'+x+'" y="'+y+'" width="3" height="66" rx="1.5" fill="'+item.color+'"/><circle cx="'+(x+23)+'" cy="'+(y+24)+'" r="4" fill="'+item.color+'"/><text x="'+(x+37)+'" y="'+(y+29)+'" font-family="Arial,sans-serif" font-size="15" font-weight="600" fill="#E8EEF8">'+esc(item.name)+'</text><text x="'+(x+w-13)+'" y="'+(y+28)+'" text-anchor="end" font-family="Consolas,monospace" font-size="12" fill="'+item.color+'">'+esc(item.label)+'</text><rect x="'+(x+17)+'" y="'+(y+46)+'" width="246" height="4" rx="2" fill="#1A2438"/><rect x="'+(x+17)+'" y="'+(y+46)+'" width="'+Math.min(246,bar)+'" height="4" rx="2" fill="'+item.color+'"/>';}).join('')+'</svg>';

const starsBg=Array.from({length:90},(_,i)=>{const x=(i*137.5)%1140+30,y=(i*79.3)%430+25,r=i%7===0?1.8:0.8;return '<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+r+'" fill="#D7E3FF" opacity="'+(0.12+(i%5)*0.07).toFixed(2)+'"/>';}).join('');
const sunX=860,sunY=236;
const orbitTracks=orbitLangs.map(p=>'<ellipse cx="0" cy="0" rx="'+p.rx+'" ry="'+p.ry+'" fill="none" stroke="#6F86B3" stroke-opacity=".28" stroke-width="1.2" stroke-dasharray="3 7"/>').join('');
const orbitPlanets=orbitLangs.map((p,i)=>{
 const short=esc(p.name.length>10?p.name.slice(0,9)+'…':p.name);
 return '<g id="planet-'+i+'" data-orbit="1" transform="rotate('+p.start+')"><circle cx="'+p.rx+'" cy="0" r="'+(p.size+6)+'" fill="'+p.color+'" fill-opacity=".12"/><circle cx="'+p.rx+'" cy="0" r="'+p.size+'" fill="'+p.color+'" stroke="#E8EEF8" stroke-opacity=".55" stroke-width="1"/><text x="'+(p.rx+p.size+10)+'" y="4" font-family="Arial,sans-serif" font-size="12" fill="#E8EEF8">'+short+'</text><text x="'+(p.rx+p.size+10)+'" y="18" font-family="Consolas,monospace" font-size="10" fill="'+p.color+'">'+esc(p.label)+'</text></g>';
}).join('');
const brandName=esc(profile.name||'StarLord');
const hero='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="480" viewBox="0 0 1200 480" role="img" aria-labelledby="heroTitle heroDesc"><title id="heroTitle">StarLord solar system banner</title><desc id="heroDesc">StarLord as the sun with programming languages orbiting as planets.</desc><defs><linearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#050814"/><stop offset=".45" stop-color="#0A1020"/><stop offset="1" stop-color="#081525"/></linearGradient><radialGradient id="sunCore"><stop stop-color="#FFF1C2"/><stop offset=".35" stop-color="#FFD36A"/><stop offset=".7" stop-color="#FF9F43"/><stop offset="1" stop-color="#FF9F43" stop-opacity="0"/></radialGradient><radialGradient id="sunHalo"><stop stop-color="#FFD36A" stop-opacity=".35"/><stop offset="1" stop-color="#FFD36A" stop-opacity="0"/></radialGradient><radialGradient id="cyanWash"><stop stop-color="#5BC0EB" stop-opacity=".18"/><stop offset="1" stop-color="#5BC0EB" stop-opacity="0"/></radialGradient><linearGradient id="heroEdge"><stop stop-color="#F0C75E"/><stop offset=".5" stop-color="#5BC0EB"/><stop offset="1" stop-color="#C792EA"/></linearGradient></defs><rect width="1200" height="480" rx="26" fill="url(#heroBg)"/><circle cx="220" cy="120" r="220" fill="url(#sunHalo)" opacity=".45"/><circle cx="980" cy="360" r="260" fill="url(#cyanWash)"/><g id="starfield">'+starsBg+'</g><g transform="translate('+sunX+' '+sunY+')"><g id="sun-halo" data-sun="1"><circle r="118" fill="url(#sunHalo)"/><circle r="72" fill="url(#sunCore)" opacity=".55"/></g>'+orbitTracks+'<g id="sun-core" data-sun="1"><circle r="34" fill="url(#sunCore)"/><circle r="18" fill="#FFF6D6"/><text y="5" text-anchor="middle" font-family="Georgia,serif" font-size="14" font-weight="700" fill="#3A2A10">SL</text></g>'+orbitPlanets+'</g><g><text x="64" y="78" font-family="Arial,sans-serif" font-size="14" letter-spacing="4.5" fill="#8FA3C8">SOLAR SYSTEM  /  '+new Date().getUTCFullYear()+'</text><text x="60" y="168" font-family="Georgia,Times New Roman,serif" font-size="84" font-weight="700" fill="#E8EEF8">'+brandName+'</text><path d="M66 196H188" stroke="#F0C75E" stroke-width="3"/><text x="64" y="242" font-family="Georgia,Times New Roman,serif" font-size="24" fill="#C9D4EA">I am the sun. Languages orbit as planets.</text><text x="64" y="286" font-family="Arial,sans-serif" font-size="16" letter-spacing="1.1" fill="#8FA3C8">ANDROID  ·  FULL-STACK  ·  DEVELOPER TOOLS</text><text x="64" y="330" font-family="Arial,sans-serif" font-size="15" fill="#A8B4D0">Student developer · Hyderabad</text><text x="64" y="404" font-family="Consolas,monospace" font-size="12" letter-spacing="2.5" fill="#7F93B8">BUILD THOUGHTFULLY  /  SHIP WHAT HELPS</text></g><rect x="18" y="18" width="1164" height="444" rx="21" fill="none" stroke="url(#heroEdge)" stroke-opacity=".55" stroke-width="1.5"/></svg>';

const aboutSection=`<img src="./assets/about-header.svg" width="100%" alt="A Little About Me — student, developer, builder and lifelong learner"/>

<div align="left">
<p>Hey, I’m <strong>Venkata Nagarjuna Babu Chitturi</strong> — known online as <strong>StarLord</strong>. I’m a student developer focused on turning real problems into polished, usable software.</p>

<p>I spend most of my time on <strong>Android apps</strong>, <strong>full-stack web products</strong>, and <strong>developer tools</strong>. On the side I explore security, AI, and community platforms — always with a bias toward shipping something people can actually open and use.</p>

<img src="./assets/about-divider.svg" width="100%" alt="Solar System decorative divider"/>

<h3>Where I Focus</h3>
<p><strong>Android</strong> — privacy-minded mobile tools with clear UX.<br/>
<strong>Full-stack web</strong> — practical products for retail, food systems, and student communities.<br/>
<strong>Developer tools</strong> — workflows and agents that keep context while you build.</p>

<img src="./assets/about-divider.svg" width="100%" alt="Solar System decorative divider"/>

<h3>How I Work</h3>
<p>I learn by building in public: start with a sharp problem, ship an early version, then refine. Curious collaborators and hard feedback welcome.</p>

<img src="./assets/about-signoff.svg" width="100%" alt="Build thoughtfully. Experiment boldly. Keep learning."/>
</div>`;

const workHeader=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="176" viewBox="0 0 1200 176">
<defs>
<linearGradient id="workBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#070B18"/><stop offset="1" stop-color="#0B1528"/></linearGradient>
<linearGradient id="workEdge"><stop stop-color="#F0C75E"/><stop offset=".55" stop-color="#5BC0EB"/><stop offset="1" stop-color="#5BC0EB" stop-opacity=".2"/></linearGradient>
</defs>
<rect x="1" y="1" width="1198" height="174" rx="18" fill="url(#workBg)" stroke="url(#workEdge)" stroke-opacity=".55" stroke-width="1.5"/>
<rect x="1" y="18" width="6" height="140" rx="3" fill="#F0C75E"/>
<text x="42" y="45" font-family="Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="2.8" fill="#F0C75E">04 / FEATURED MOONS</text>
<text x="42" y="101" font-family="Georgia,serif" font-size="44" font-weight="700" fill="#E8EEF8">Selected Work</text>
<text x="44" y="137" font-family="Arial,sans-serif" font-size="17" fill="#A8B4D0">Four projects that best show how I think and ship.</text>
<g transform="translate(1040 88)" fill="none" stroke="#5BC0EB" stroke-opacity=".7">
<circle r="54" stroke-dasharray="3 6"/><circle r="34" stroke="#F0C75E" stroke-opacity=".8"/><circle r="10" fill="#F0C75E" stroke="none"/>
<circle cx="48" cy="-8" r="6" fill="#C792EA" stroke="none"/><circle cx="-40" cy="28" r="5" fill="#56D6C9" stroke="none"/>
</g>
</svg>`;
const footerCta=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="142" viewBox="0 0 1200 142" role="img" aria-labelledby="title desc">
<title id="title">Explore all repositories</title>
<desc id="desc">Solar System call to action to browse every public project and experiment.</desc>
<defs>
<linearGradient id="footerBg" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#070B18"/><stop offset=".55" stop-color="#0B1225"/><stop offset="1" stop-color="#0A1528"/></linearGradient>
<linearGradient id="footerEdge"><stop stop-color="#F0C75E"/><stop offset=".5" stop-color="#5BC0EB"/><stop offset="1" stop-color="#5BC0EB" stop-opacity=".35"/></linearGradient>
</defs>
<rect x="1" y="1" width="1198" height="140" rx="18" fill="url(#footerBg)" stroke="url(#footerEdge)" stroke-opacity=".62" stroke-width="1.5"/>
<rect x="1" y="18" width="6" height="106" rx="3" fill="#F0C75E"/>
<text x="42" y="43" font-family="Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="2.8" fill="#F0C75E">05 / FULL STAR CHART</text>
<text x="42" y="91" font-family="Georgia,serif" font-size="37" font-weight="700" fill="#E8EEF8">Explore all repositories</text>
<text x="44" y="119" font-family="Arial,sans-serif" font-size="16" fill="#A8B4D0">Browse every public project, experiment and work in progress.</text>
<circle cx="1110" cy="71" r="38" fill="#5BC0EB" fill-opacity=".09" stroke="#5BC0EB" stroke-opacity=".55" stroke-width="1.5"/>
<path d="M1094 71H1124M1113 59L1125 71 1113 83" fill="none" stroke="#F0C75E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
const mapRepo=r=>({name:r.name,description:r.description,language:r.language,stars:r.stargazers_count,updated_at:r.updated_at,url:r.html_url});
const readme=[
'<div align="center">',
'<img src="./assets/profile-universe.gif" width="100%" alt="StarLord — solar system banner with orbiting language planets"/>',
'<p align="center">'+navCards+'</p>',
'<a id="about"></a>',
aboutSection,
'',
'<a id="snapshot"></a>',
'<img src="./assets/profile-metrics.svg" width="100%" alt="GitHub profile snapshot: public projects, stars, languages and featured work"/>',
'',
'<a id="toolkit"></a>',
'<img src="./assets/tech-stack-v2.svg" width="100%" alt="Technology stack and language distribution"/>',
'',
'<a id="selected-work"></a>',
'<img src="./assets/work-header.svg" width="100%" alt="Selected work — projects shaped by curiosity"/>',
'<sub>'+featured.length+' featured · '+repos.length+' public projects · Android, tools, security and community.</sub>',
'',
projectCards,
moreWorkLine,
'',
'<p align="center"><a href="https://github.com/'+username+'?tab=repositories"><img src="./assets/portfolio-footer.svg" width="100%" alt="Explore all repositories — browse every public project and experiment"/></a></p>',
'<p align="center"><sub>A living solar system of public work · Automatically refreshed · Private repositories stay private</sub></p>',
'</div>'
].join('\n');
await write('README.md',readme);
await write('assets/profile-universe.svg',hero);
await write('assets/nebula-hero.svg',hero);
await write('assets/profile-metrics.svg',metricsSvg);
await write('assets/tech-stack-v2.svg',stackSvg);
await write('assets/work-header.svg',workHeader);
await write('assets/portfolio-footer.svg',footerCta);
await Promise.all(navSvgs.map(item=>write('assets/nav-'+item.id+'.svg',item.svg)));
await Promise.all(projectArts.map(p=>write('assets/projects/'+slug(p.r.name)+'.svg',p.art)));
await write('assets/solar-data.json',JSON.stringify({
 username,
 theme:'solar-system',
 profile,
 featuredRepositories:featured.map(mapRepo),
 publicRepositories:repos.map(mapRepo),
 languages:allLangs,
 orbitLanguages:orbitLangs.map(p=>({name:p.name,pct:p.pct,label:p.label,color:p.color})),
 totalStars:stars
},null,2));
console.log('StarLord solar system generated for '+featured.length+' featured / '+repos.length+' public repositories and '+orbitLangs.length+' orbiting languages.');
async function write(path,content){const fs=await import('node:fs/promises');await fs.mkdir(path.split('/').slice(0,-1).join('/')||'.',{recursive:true});await fs.writeFile(path,content);}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
