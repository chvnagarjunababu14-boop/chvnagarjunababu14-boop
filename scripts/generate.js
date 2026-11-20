// StarLord Solar System — Diva-style structure, custom identity & public GitHub data only.
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
const langs=allLangs.slice(0,6);
const palette={TypeScript:'#38BDF8',JavaScript:'#FBBF24',Python:'#60A5FA',Java:'#F59E0B',Rust:'#F97316',Kotlin:'#C084FC',CSS:'#22D3EE',HTML:'#FB7185',Go:'#2DD4BF',C:'#94A3B8','C++':'#F472B6',PHP:'#A78BFA',Shell:'#A3E635',SQL:'#F59E0B',PLpgSQL:'#86EFAC'};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const stars=repos.reduce((n,r)=>n+r.stargazers_count,0);
const featuredPriority=['safeher','knox','store-point','devcatalyst-community-crm'];
const ranked=[...repos].sort((a,b)=>(b.stargazers_count-a.stargazers_count)||new Date(b.updated_at)-new Date(a.updated_at));
const featured=[];
for(const key of featuredPriority){const hit=ranked.find(r=>slug(r.name)===key);if(hit)featured.push(hit);}
for(const r of ranked){if(featured.length>=4)break;if(!featured.includes(r))featured.push(r);}
const moreWork=ranked.filter(r=>!featured.includes(r));
const projectSummaries={
 'safeher':['Privacy-first Android safety app with SOS and guardian alerts.','Emergency check-ins, trusted contacts, and calm UX under pressure.'],
 'knox':['Rust knowledge graph that keeps project decisions for AI agents.','Desktop-ready memory vault for durable coding context.'],
 'store-point':['Offline-first retail POS with barcode checkout and inventory.','Multi-branch analytics for shops that cannot rely on the cloud.'],
 'devcatalyst-community-crm':['Student-club CRM for projects, events, and recruitment.','Member directory and workflows built for campus builders.'],
 'quantumshield-india':['Learning site for cybersecurity and quantum tech basics.','Lessons plus a sample quiz for early exploration.'],
 'feed-hyderabad':['Connects surplus restaurant food with nearby NGOs.','Location-aware matching for less waste, more meals.'],
 'fresh-circle':['FreshLink matches nearby produce vendors and buyers.','Stock visibility with surplus discount discovery.']
};
const projectNames={'safeher':'SafeHer-Next','store-point':'StorePoint','devcatalyst-community-crm':'DevCatalyst CRM','quantumshield-india':'QuantumShield India','feed-hyderabad':'Feed Hyderabad','fresh-circle':'FreshLink'};
const projectTags={'safeher':['Kotlin','Android','Compose'],'knox':['Rust','Tauri','MCP'],'store-point':['TypeScript','POS','Offline'],'devcatalyst-community-crm':['TypeScript','CRM','Campus'],'quantumshield-india':['TypeScript','Python'],'feed-hyderabad':['TypeScript','Maps'],'fresh-circle':['TypeScript','Marketplace']};
const moonLabels=['FLAGSHIP REPOSITORY','MOBILE SAFETY','DEVELOPER TOOLS','COMMUNITY SYSTEMS','EXPERIMENT','PRODUCT'];
const domainByLang={
 TypeScript:'Web Architecture & Full-Stack Products',
 Kotlin:'Android & Privacy-Minded Mobile',
 Python:'Learning Systems & Experiments',
 Rust:'Developer Tools & Agent Memory',
 JavaScript:'Interface Experiments',
 Java:'Backend Exploration',
 PLpgSQL:'Data Layer & Persistence',
 CSS:'Visual Systems',
 HTML:'Markup & Structure'
};
const totalLanguageBytes=Object.values(totals).reduce((s,n)=>s+n,0)||1;

let avatarDataUri='';
try{
 const avatarUrl=(profile.avatar_url||'')+(profile.avatar_url?.includes('?')?'&':'?')+'s=160';
 const ar=await fetch(avatarUrl,{headers:{'User-Agent':'starlord-solar-profile'}});
 if(ar.ok){const buf=Buffer.from(await ar.arrayBuffer());const mime=ar.headers.get('content-type')||'image/png';avatarDataUri=`data:${mime};base64,${buf.toString('base64')}`;}
}catch{}

const orbitLangs=langs.map(([name,bytes],i)=>{
 const pct=bytes/totalLanguageBytes*100;
 const label=pct>0&&pct<1?'<1%':`${Math.round(pct)}%`;
 const related=repos.filter(r=>(r.language||'')===name).slice(0,4);
 return {name,color:palette[name]||'#38BDF8',pct,label,rx:120+i*38,ry:58+i*18,start:i*52,size:11+Math.min(8,Math.round(pct/10)),moons:related,domain:domainByLang[name]||'Software Systems'};
});

// --- Hero: centered solar system (Diva-like) ---
const cx=440,cy=250;
const starsBg=Array.from({length:110},(_,i)=>{const x=(i*97.3)%840+20,y=(i*61.7)%480+20,r=i%8===0?1.6:0.7;return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="#E2E8F0" opacity="${(0.12+(i%5)*0.06).toFixed(2)}"/>`;}).join('');
const orbitTracks=orbitLangs.map(p=>`<ellipse cx="${cx}" cy="${cy}" rx="${p.rx}" ry="${p.ry}" fill="none" stroke="#FFFFFF" stroke-opacity="0.14" stroke-width="1" stroke-dasharray="4 6"/>`).join('');
const orbitPlanets=orbitLangs.map((p,i)=>{
 const short=esc(p.name.length>11?p.name.slice(0,10)+'…':p.name);
 const moonDots=p.moons.slice(0,3).map((m,mi)=>{
  const ang=-40+mi*40;const mr=28+mi*4;
  return `<circle cx="${(Math.cos(ang*Math.PI/180)*mr).toFixed(1)}" cy="${(Math.sin(ang*Math.PI/180)*mr).toFixed(1)}" r="2.2" fill="#F8FAFC" opacity=".75"/>`;
 }).join('');
 return `<g id="planet-${i}" data-orbit="1" transform="rotate(${p.start} ${cx} ${cy})">
  <g transform="translate(${cx+p.rx} ${cy})">
   <circle r="${p.size+8}" fill="${p.color}" fill-opacity=".12"/>
   <circle r="${p.size}" fill="${p.color}" stroke="#F8FAFC" stroke-opacity=".5" stroke-width="1.2"/>
   <g opacity=".85">${moonDots}</g>
   <rect x="-34" y="${p.size+10}" width="68" height="28" rx="4" fill="#091024" fill-opacity=".9" stroke="#1E2C4F"/>
   <text y="${p.size+22}" text-anchor="middle" font-family="ui-monospace,monospace" font-size="9" fill="#F8FAFC">${short}</text>
   <text y="${p.size+33}" text-anchor="middle" font-family="ui-monospace,monospace" font-size="8" fill="${p.color}">${esc(p.label)}</text>
  </g>
 </g>`;
}).join('');
const avatarSun=avatarDataUri
 ? `<image href="${avatarDataUri}" x="-36" y="-36" width="72" height="72" clip-path="url(#sunClip)"/>`
 : `<circle r="28" fill="#FFD36A"/><text y="6" text-anchor="middle" font-family="Georgia,serif" font-size="16" font-weight="700" fill="#3A2A10">SL</text>`;
const hero=`<svg xmlns="http://www.w3.org/2000/svg" width="880" height="520" viewBox="0 0 880 520" fill="none" role="img" aria-labelledby="heroTitle">
<title id="heroTitle">StarLord solar system — languages as planets, projects as moons</title>
<defs>
 <linearGradient id="deepSpace" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#030611"/><stop offset=".55" stop-color="#070B18"/><stop offset="1" stop-color="#0B1225"/></linearGradient>
 <radialGradient id="sunCorona"><stop stop-color="#FFA726" stop-opacity=".85"/><stop offset=".55" stop-color="#FF7043" stop-opacity=".28"/><stop offset="1" stop-color="#030611" stop-opacity="0"/></radialGradient>
 <clipPath id="sunClip"><circle cx="0" cy="0" r="36"/></clipPath>
</defs>
<rect width="880" height="520" rx="16" fill="url(#deepSpace)"/>
<rect x=".5" y=".5" width="879" height="519" rx="15.5" stroke="#1E2C4F"/>
<g id="starfield">${starsBg}</g>
${orbitTracks}
<g transform="translate(${cx} ${cy})">
 <g id="sun-halo" data-sun="1"><circle r="70" fill="url(#sunCorona)"/></g>
 <g id="sun-core" data-sun="1">
  <circle r="40" fill="#0B1225" stroke="#FFA726" stroke-width="2"/>
  ${avatarSun}
 </g>
 <text y="62" text-anchor="middle" font-family="ui-monospace,monospace" font-size="10" letter-spacing="1.5" fill="#FFA726">THE SUN // STARLORD</text>
</g>
${orbitPlanets}
<text x="440" y="492" text-anchor="middle" font-family="ui-monospace,monospace" font-size="11" fill="#64748B">PLANETS = LANGUAGES   ·   MOONS = PROJECTS   ·   BUILT IN PUBLIC</text>
</svg>`;

// --- About card ---
const brandName=esc(profile.name||'StarLord');
const fullName='Venkata Nagarjuna Babu Chitturi';
const aboutAvatar=avatarDataUri
 ? `<image href="${avatarDataUri}" x="-36" y="-36" width="72" height="72" clip-path="url(#aboutAvatarClip)"/>`
 : `<circle r="28" fill="#FFD36A"/><text y="6" text-anchor="middle" font-family="Georgia,serif" font-size="15" font-weight="700" fill="#3A2A10">SL</text>`;
const badges=[
 {label:'STUDENT DEVELOPER',color:'#38BDF8'},
 {label:'HYDERABAD, IN',color:'#FFA726'},
 {label:'ANDROID + FULL-STACK',color:'#C084FC'},
 {label:'BUILDING IN PUBLIC',color:'#2DD4BF'}
];
let badgeX=150;const badgeSvg=badges.map(b=>{
 const w=Math.max(90,b.label.length*7.2+18);
 const g=`<g transform="translate(${badgeX} 148)"><rect width="${w}" height="22" rx="11" fill="#0D1733" stroke="${b.color}" stroke-opacity=".65"/><text x="${w/2}" y="15" text-anchor="middle" font-family="ui-monospace,monospace" font-size="9" fill="#F8FAFC">${esc(b.label)}</text></g>`;
 badgeX+=w+10;return g;
}).join('');
const about=`<svg xmlns="http://www.w3.org/2000/svg" width="880" height="190" viewBox="0 0 880 190" fill="none">
<defs>
 <radialGradient id="aboutSunCorona"><stop stop-color="#FFA726" stop-opacity=".8"/><stop offset=".6" stop-color="#FF7043" stop-opacity=".25"/><stop offset="1" stop-color="#030611" stop-opacity="0"/></radialGradient>
 <clipPath id="aboutAvatarClip"><circle cx="0" cy="0" r="36"/></clipPath>
</defs>
<rect width="880" height="190" rx="12" fill="#091024"/>
<rect x=".5" y=".5" width="879" height="189" rx="11.5" stroke="#1E2C4F"/>
<g transform="translate(85 95)">
 <circle r="54" fill="url(#aboutSunCorona)"/>
 <circle r="38" fill="#0B1225" stroke="#FFA726" stroke-width="2"/>
 ${aboutAvatar}
</g>
<text x="150" y="48" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="22" font-weight="800" fill="#F8FAFC">${esc(fullName)}</text>
<text x="150" y="72" font-family="ui-monospace,monospace" font-size="12" fill="#FFA726">${brandName}  ·  Student Developer  ·  Android · Full-Stack · Tools</text>
<text x="150" y="104" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="13" fill="#CBD5E1">I turn real problems into polished software people can actually open and use.</text>
<text x="150" y="126" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" fill="#94A3B8">Curiosity in public. Ship early. Refine with every orbit.</text>
${badgeSvg}
</svg>`;

// --- Moon cards ---
const moonCards=featured.map((r,i)=>{
 const key=slug(r.name);const name=projectNames[key]||r.name;
 const lines=projectSummaries[key]||[r.description||'A public project from my orbit.', 'Built and iterated in the open.'];
 const tags=projectTags[key]||[r.language||'Multi-stack'];
 const color=['#22D3EE','#C084FC','#F97316','#2DD4BF'][i%4];
 let tx=20;const pills=tags.slice(0,4).map(t=>{const w=Math.max(36,t.length*6.6+16);const p=`<rect x="${tx}" y="0" width="${w}" height="18" rx="3" fill="#0D1733" stroke="#1E2C4F"/><text x="${tx+w/2}" y="12.5" text-anchor="middle" font-family="ui-monospace,monospace" font-size="8.5" fill="#F8FAFC">${esc(t)}</text>`;tx+=w+6;return p;}).join('');
 const label=moonLabels[i]||'SELECTED WORK';
 const art=`<svg xmlns="http://www.w3.org/2000/svg" width="430" height="150" viewBox="0 0 430 150" fill="none">
<rect width="430" height="150" rx="10" fill="#091024"/>
<rect x=".5" y=".5" width="429" height="149" rx="9.5" stroke="#1E2C4F"/>
<rect width="3.5" height="150" fill="${color}" rx="0"/>
<text x="20" y="24" font-family="ui-monospace,monospace" font-size="8.5" font-weight="700" fill="${color}" letter-spacing=".5">MOON 0${i+1} // ${esc(label)}</text>
<text x="410" y="24" text-anchor="end" font-family="ui-monospace,monospace" font-size="10.5" font-weight="700" fill="${color}">${r.stargazers_count} ★</text>
<text x="20" y="50" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="17" font-weight="800" fill="#F8FAFC">${esc(name)}</text>
<text x="20" y="72" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" font-weight="600" fill="#F8FAFC">${esc(lines[0])}</text>
<text x="20" y="90" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9.5" fill="#94A3B8">${esc(lines[1]||'')}</text>
<g transform="translate(0 116)">${pills}</g>
</svg>`;
 return {r,name,art};
});

// --- Planets stack ---
const maxPct=Math.max(1,...orbitLangs.map(p=>p.pct));
const stackRows=orbitLangs.map((p,i)=>{
 const y=58+i*42;const bar=Math.max(18,320*(p.pct/maxPct));
 return `<text x="28" y="${y}" font-family="ui-monospace,monospace" font-size="11" fill="#94A3B8">ORBIT ${i+1}</text>
<text x="110" y="${y}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="14" font-weight="700" fill="#F8FAFC">${esc(p.name)}</text>
<rect x="250" y="${y-12}" width="340" height="10" rx="5" fill="#0D1733"/>
<rect x="250" y="${y-12}" width="${bar}" height="10" rx="5" fill="${p.color}"/>
<text x="600" y="${y}" font-family="ui-monospace,monospace" font-size="11" fill="${p.color}">${esc(p.label)}</text>
<text x="660" y="${y}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#94A3B8">${esc(p.domain)}</text>`;
}).join('');
const stack=`<svg xmlns="http://www.w3.org/2000/svg" width="880" height="${70+orbitLangs.length*42}" viewBox="0 0 880 ${70+orbitLangs.length*42}" fill="none">
<rect width="880" height="${70+orbitLangs.length*42}" rx="12" fill="#091024"/>
<rect x=".5" y=".5" width="879" height="${69+orbitLangs.length*42}" rx="11.5" stroke="#1E2C4F"/>
<text x="28" y="34" font-family="ui-monospace,monospace" font-size="12" font-weight="700" letter-spacing="1.5" fill="#FFA726">PLANETARY SYSTEM // LANGUAGE ORBITS</text>
<text x="852" y="34" text-anchor="end" font-family="ui-monospace,monospace" font-size="10" fill="#64748B">SHARE OF PUBLIC CODE</text>
${stackRows}
</svg>`;

const evidenceRows=orbitLangs.map((p,i)=>{
 const links=p.moons.length
  ? p.moons.map(r=>`[\`${esc(projectNames[slug(r.name)]||r.name)}\`](${r.html_url})`).join(', ')
  : '_exploring_';
 const band=i===0?'Inner':i===orbitLangs.length-1?'Outer':`Orbit ${i+1}`;
 return `| **Orbit ${i+1}** | **${esc(p.name)}** (${band}) | ${esc(p.domain)} | ${links} |`;
}).join('\n');

// --- Solar log header ---
const log=`<svg xmlns="http://www.w3.org/2000/svg" width="880" height="120" viewBox="0 0 880 120" fill="none">
<rect width="880" height="120" rx="12" fill="#091024"/>
<rect x=".5" y=".5" width="879" height="119" rx="11.5" stroke="#1E2C4F"/>
<text x="28" y="40" font-family="ui-monospace,monospace" font-size="12" font-weight="700" letter-spacing="1.5" fill="#22D3EE">SOLAR LOG // REVOLUTIONS &amp; TELEMETRY</text>
<text x="28" y="72" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="28" font-weight="800" fill="#F8FAFC">${repos.length} projects · ${stars} stars · ${allLangs.length} languages</text>
<text x="28" y="98" font-family="ui-monospace,monospace" font-size="11" fill="#94A3B8">PUBLIC SIGNAL ONLY · PRIVATE REPOS STAY DARK</text>
<g transform="translate(780 60)"><circle r="28" fill="none" stroke="#FFA726" stroke-opacity=".5" stroke-dasharray="3 5"/><circle r="10" fill="#FFA726"/></g>
</svg>`;

// --- Footer / transmission ---
const footer=`<svg xmlns="http://www.w3.org/2000/svg" width="880" height="110" viewBox="0 0 880 110" fill="none">
<rect width="880" height="110" rx="12" fill="#091024"/>
<rect x=".5" y=".5" width="879" height="109" rx="11.5" stroke="#1E2C4F"/>
<text x="28" y="40" font-family="ui-monospace,monospace" font-size="12" font-weight="700" letter-spacing="1.5" fill="#FFA726">TRANSMISSION CHANNELS</text>
<text x="28" y="72" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="24" font-weight="800" fill="#F8FAFC">Open a channel</text>
<text x="28" y="94" font-family="ui-monospace,monospace" font-size="11" fill="#94A3B8">GITHUB  ·  EMAIL  ·  BUILD WITH ME</text>
<g transform="translate(820 55)"><circle r="26" fill="#FFA726" fill-opacity=".12" stroke="#FFA726"/><path d="M-8 0H10M4-8L12 0 4 8" fill="none" stroke="#FFA726" stroke-width="2.5" stroke-linecap="round"/></g>
</svg>`;

const moonTableRows=[];
for(let i=0;i<moonCards.length;i+=2){
 const left=moonCards[i];const right=moonCards[i+1];
 const leftCell=`<td width="50%" valign="top"><a href="${left.r.html_url}"><img src="./assets/projects/${slug(left.r.name)}.svg" alt="${esc(left.name)}" width="100%"/></a></td>`;
 const rightCell=right?`<td width="50%" valign="top"><a href="${right.r.html_url}"><img src="./assets/projects/${slug(right.r.name)}.svg" alt="${esc(right.name)}" width="100%"/></a></td>`:'<td width="50%"></td>';
 moonTableRows.push(`<tr>\n${leftCell}\n${rightCell}\n</tr>`);
}
const moreLine=moreWork.length?`<p align="center"><sub>Also in orbit: ${moreWork.map(r=>`<a href="${r.html_url}">${esc(projectNames[slug(r.name)]||r.name)}</a>`).join(' · ')}</sub></p>`:'';

const readme=`<div align="center">

<!-- SOLAR SYSTEM ORBITS HERO -->
<img src="./assets/profile-universe.gif" alt="StarLord solar system: languages as planets, projects as moons" width="100%"/>

<br/>
<sub><i>I am the sun; my languages are the planets and my projects their moons.</i></sub>
<br/><br/>

<!-- THE SUN (ABOUT CARD) -->
<img src="./assets/solar-about.svg" alt="A Little About Me — Venkata Nagarjuna Babu Chitturi / StarLord" width="100%"/>

</div>

---

## 🌕 The Moons — Featured Repositories

<table border="0" width="100%">
${moonTableRows.join('\n')}
</table>

${moreLine}

<p align="center"><sub>${featured.length} featured · ${repos.length} public projects · Android, tools, security and community.</sub></p>

---

## 🪐 The Planets — Planetary System & Tech Stack

<div align="center">
<img src="./assets/tech-stack-v2.svg" alt="Planetary System — Languages & Tech Stack" width="100%"/>
</div>

<details>
<summary><b>Orbital Distance & Evidence Index</b></summary>
<br/>

| Orbit | Celestial Body | Domain | Verified Repositories |
|---|---|---|---|
${evidenceRows}

</details>

---

## 📡 Solar Log — Revolutions & Telemetry

<div align="center">
<img src="./assets/solar-log.svg" alt="Solar Log — Telemetry & public signal" width="100%"/>
</div>

### Verified Experience & Orbit Logs
- **Student Developer** — *Hyderabad* \`[Building in public]\`
  - Shipping Android apps, full-stack products, and developer tools people can actually use.
- **Focus Systems** — *SafeHer · Knox · StorePoint · DevCatalyst*
  - Privacy-minded mobile, agent memory, retail POS, and campus community CRM.
- **Exploration Orbits** — *QuantumShield · FreshLink · Feed Hyderabad*
  - Security/quantum learning, produce markets, and surplus-food logistics.

### Signals & Credentials
- ★ **SafeHer-Next** — privacy-first Android safety app with SOS + guardian alerts
- 🛰 **Knox** — Rust knowledge graph preserving decisions for AI coding agents
- 🛰 **StorePoint** — offline-first retail POS with inventory and branch analytics
- 📍 Based in **Hyderabad** · open to collaboration with fellow builders

---

## ☀️ Transmission Channels

<div align="center">
<a href="https://github.com/${username}">
<img src="./assets/portfolio-footer.svg" alt="Solar Transmission — open a channel" width="100%"/>
</a>
<br/><br/>
<p>
  <a href="https://github.com/${username}">GitHub</a> ·
  <a href="mailto:chvnagarjunababu14@gmail.com">Email</a> ·
  <a href="https://github.com/${username}?tab=repositories">All repositories</a>
</p>
<sub>Solar System · planets are languages, moons are projects · automatically refreshed</sub>
</div>
`;

const mapRepo=r=>({name:r.name,description:r.description,language:r.language,stars:r.stargazers_count,updated_at:r.updated_at,url:r.html_url});
await write('README.md',readme);
await write('assets/profile-universe.svg',hero);
await write('assets/nebula-hero.svg',hero);
await write('assets/solar-about.svg',about);
await write('assets/tech-stack-v2.svg',stack);
await write('assets/solar-log.svg',log);
await write('assets/portfolio-footer.svg',footer);
await Promise.all(moonCards.map(c=>write(`assets/projects/${slug(c.r.name)}.svg`,c.art)));
await write('assets/solar-data.json',JSON.stringify({
 username,
 theme:'solar-system-diva-structure',
 profile:{login:profile.login,name:profile.name,avatar_url:profile.avatar_url,followers:profile.followers,public_repos:profile.public_repos},
 featuredRepositories:featured.map(mapRepo),
 publicRepositories:repos.map(mapRepo),
 languages:allLangs,
 orbitLanguages:orbitLangs.map(p=>({name:p.name,pct:p.pct,label:p.label,color:p.color,domain:p.domain,moons:p.moons.map(m=>m.name)})),
 totalStars:stars
},null,2));
console.log(`StarLord Diva-style solar system generated: ${featured.length} moons / ${repos.length} repos / ${orbitLangs.length} planets.`);
async function write(path,content){const fs=await import('node:fs/promises');await fs.mkdir(path.split('/').slice(0,-1).join('/')||'.',{recursive:true});await fs.writeFile(path,content);}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
