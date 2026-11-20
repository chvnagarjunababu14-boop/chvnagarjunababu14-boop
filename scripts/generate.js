// StarLord Solar System — GitSkins-quality custom profile. Public GitHub data only.
async function main(){
const fs=await import('node:fs/promises');
const username=process.env.GITHUB_USERNAME||'chvnagarjunababu14-boop';
const headers={Accept:'application/vnd.github+json','User-Agent':'starlord-solar-profile'};
if(process.env.GITHUB_TOKEN)headers.Authorization='Bearer '+process.env.GITHUB_TOKEN;
async function api(url){const r=await fetch(url,{headers});if(!r.ok)throw new Error('GitHub API '+r.status+' at '+url);return r.json();}
function hydrateRepo(r){return{name:r.name,description:r.description||null,language:r.language||null,stargazers_count:r.stars??r.stargazers_count??0,forks_count:r.forks??r.forks_count??0,updated_at:r.updated_at,html_url:r.url||r.html_url,private:false,archived:false,languages_url:null};}
let profile,repos,allLangs,weekCountsCached=null,offline=false;
try{
 profile=await api('https://api.github.com/users/'+username);
 const all=await api('https://api.github.com/users/'+username+'/repos?type=public&sort=updated&per_page=100');
 repos=all.filter(r=>!r.private&&!r.archived&&r.name.toLowerCase()!==username.toLowerCase()).slice(0,100);
 const langmaps=await Promise.all(repos.map(async r=>{try{return await api(r.languages_url);}catch{return r.language?{[r.language]:1}:{};}}));
 const totals={};langmaps.forEach(m=>Object.entries(m).forEach(([k,v])=>totals[k]=(totals[k]||0)+v));
 if(!Object.keys(totals).length)repos.forEach(r=>{if(r.language)totals[r.language]=(totals[r.language]||0)+1;});
 allLangs=Object.entries(totals).sort((a,b)=>b[1]-a[1]);
}catch(err){
 console.warn('Live GitHub fetch failed ('+err.message+'); regenerating from assets/solar-data.json');
 const cached=JSON.parse(await fs.readFile('assets/solar-data.json','utf8'));
 offline=true;
 profile=cached.profile;
 repos=(cached.publicRepositories||[]).map(hydrateRepo);
 allLangs=cached.languages||[];
 weekCountsCached=cached.weekCounts||null;
}
const langs=allLangs.slice(0,5);
const totals=Object.fromEntries(allLangs);
const palette={TypeScript:'#3178C6',JavaScript:'#F7DF1E',Python:'#3776AB',Java:'#F59E0B',Rust:'#DEA584',Kotlin:'#7F52FF',CSS:'#1572B6',HTML:'#E34F26',Go:'#00ADD8',C:'#94A3B8','C++':'#F472B6',PHP:'#A78BFA',Shell:'#A3E635',SQL:'#F59E0B',PLpgSQL:'#336791'};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const stars=repos.reduce((n,r)=>n+r.stargazers_count,0);
const forks=repos.reduce((n,r)=>n+(r.forks_count||0),0);
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
const projectTags={'safeher':['Kotlin','Android'],'knox':['Rust','Tauri'],'store-point':['TypeScript','POS'],'devcatalyst-community-crm':['TypeScript','CRM'],'quantumshield-india':['TypeScript','Python'],'feed-hyderabad':['TypeScript'],'fresh-circle':['TypeScript']};
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
const abbr={TypeScript:'TS',JavaScript:'JS',Python:'PY',Kotlin:'KT',Rust:'RS',PLpgSQL:'SQL',Java:'JV',CSS:'CSS',HTML:'HTML',Go:'GO'};
function langBadge(name,color,size=24){
 const a=abbr[name]||String(name).slice(0,2).toUpperCase();
 const r=size/2;const fs=size<=20?8:10;
 const textFill=['#F7DF1E','#DEA584','#86EFAC'].includes(color)?'#0B1225':'#F8FAFC';
 return `<circle r="${r+3}" fill="${color}" fill-opacity=".28"/><circle r="${r}" fill="${color}"/><circle r="${r}" fill="none" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="1.2"/><text y="${fs*0.35}" text-anchor="middle" font-family="ui-monospace,Consolas,monospace" font-size="${fs}" font-weight="800" fill="${textFill}">${esc(a)}</text>`;
}

let avatarDataUri='';
try{
 const avatarUrl=(profile.avatar_url||'')+(profile.avatar_url?.includes('?')?'&':'?')+'s=160';
 const ar=await fetch(avatarUrl,{headers:{'User-Agent':'starlord-solar-profile'}});
 if(ar.ok){const buf=Buffer.from(await ar.arrayBuffer());const mime=ar.headers.get('content-type')||'image/png';avatarDataUri=`data:${mime};base64,${buf.toString('base64')}`;}
}catch{}

const weekMs=7*24*3600*1000;
const now=Date.now();
const weeks=26;
let weekCounts=Array.from({length:weeks},()=>0);
if(weekCountsCached&&weekCountsCached.length===weeks){
 weekCounts=weekCountsCached.slice();
}else{
 let publicEvents=[];
 if(!offline){try{publicEvents=await api('https://api.github.com/users/'+username+'/events/public?per_page=100');}catch{}}
 for(const ev of publicEvents){
  if(!ev||!ev.created_at)continue;
  const age=now-new Date(ev.created_at).getTime();
  const w=Math.floor(age/weekMs);
  if(w>=0&&w<weeks)weekCounts[weeks-1-w]+=1;
 }
 if(weekCounts.every(n=>n===0)){
  for(const r of repos){
   const age=now-new Date(r.updated_at).getTime();
   const w=Math.floor(age/weekMs);
   if(w>=0&&w<weeks)weekCounts[weeks-1-w]+=1;
  }
 }
}
const recentPushes=repos.slice(0,2).map((r,i)=>({name:r.name,updated:r.updated_at,phase:i*0.45}));

const orbitLangs=langs.map(([name,bytes],i)=>{
 const pct=bytes/totalLanguageBytes*100;
 const label=pct>0&&pct<1?'<1%':`${Math.round(pct)}%`;
 const related=repos.filter(r=>(r.language||'')===name).slice(0,2);
 // Wider, calmer rings with even spacing (reference-style neat ellipses).
 return {name,color:palette[name]||'#38BDF8',pct,label,rx:130+i*42,ry:48+i*14,start:i*(360/Math.max(langs.length,1))+18,size:12,moons:related,domain:domainByLang[name]||'Software Systems'};
});

// --- Phase 1: Hero widget (vibrant GitSkins-style solar system) ---
const cx=440,cy=248;
const starColors=['#F8FAFC','#FDE68A','#93C5FD','#F9A8D4','#A5F3FC'];
const starsBg=Array.from({length:110},(_,i)=>{
 const x=(i*97.3)%840+20,y=(i*61.7)%470+20;
 const big=i%9===0;const r=big?1.8:(i%3===0?1.1:0.55);
 const fill=starColors[i%starColors.length];
 const op=big?0.95:(0.35+(i%5)*0.1);
 return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${fill}" opacity="${op.toFixed(2)}"/>`;
}).join('');
const orbitTracks=orbitLangs.map(p=>[
 `<ellipse cx="${cx}" cy="${cy}" rx="${p.rx}" ry="${p.ry}" fill="none" stroke="${p.color}" stroke-opacity="0.38" stroke-width="2.4"/>`,
 `<ellipse cx="${cx}" cy="${cy}" rx="${p.rx}" ry="${p.ry}" fill="none" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="1.1" stroke-dasharray="4 6"/>`
].join('')).join('');
const cometSvg=recentPushes.map((c,i)=>{
 const y=100+i*78;const x0=40+i*48;
 return `<g id="comet-${i}" data-comet="1" data-y="${y}" data-x0="${x0}" data-span="580" data-phase="${c.phase}" transform="translate(${x0} ${y})">
  <path d="M0 0H48" stroke="url(#cometTail)" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="52" cy="0" r="3.2" fill="#FFE082"/>
  <circle cx="52" cy="0" r="6" fill="#FFA726" fill-opacity=".35"/>
 </g>`;
}).join('');
const orbitPlanets=orbitLangs.map((p,i)=>{
 const short=esc(p.name.length>11?p.name.slice(0,10)+'…':p.name);
 const rad=p.start*Math.PI/180;
 const x=cx+p.rx*Math.cos(rad);
 const y=cy+p.ry*Math.sin(rad);
 const moonDots=p.moons.slice(0,2).map((m,mi)=>{
  const mang=mi*180+20;const mr=24+mi*3;
  const mx=(Math.cos(mang*Math.PI/180)*mr).toFixed(1);
  const my=(Math.sin(mang*Math.PI/180)*mr).toFixed(1);
  return `<circle class="moon" data-moon="1" data-mr="${mr}" data-mang="${mang}" cx="${mx}" cy="${my}" r="4.5" fill="#F8FAFC" opacity=".22"/><circle class="moon" data-moon="1" data-mr="${mr}" data-mang="${mang}" cx="${mx}" cy="${my}" r="2.2" fill="#F8FAFC" opacity=".98"/>`;
 }).join('');
 const labelTop=22;
 return `<g id="planet-${i}" data-orbit="1" data-cx="${cx}" data-cy="${cy}" data-rx="${p.rx}" data-ry="${p.ry}" data-angle="${p.start}" data-speed="1" transform="translate(${x.toFixed(2)} ${y.toFixed(2)})">
   <circle r="26" fill="${p.color}" fill-opacity=".18"/>
   <circle r="20" fill="${p.color}" fill-opacity=".12"/>
   ${langBadge(p.name,p.color,24)}
   <g class="moons" opacity=".95">${moonDots}</g>
   <rect x="-40" y="${labelTop}" width="80" height="28" rx="6" fill="#060B1A" fill-opacity=".92" stroke="${p.color}" stroke-opacity=".55" stroke-width="1.2"/>
   <text y="${labelTop+12}" text-anchor="middle" font-family="ui-monospace,monospace" font-size="10" font-weight="700" fill="#F8FAFC">${short}</text>
   <text y="${labelTop+23}" text-anchor="middle" font-family="ui-monospace,monospace" font-size="8.5" fill="${p.color}">${esc(p.label)}</text>
 </g>`;
}).join('');
const avatarSun=avatarDataUri
 ? `<image href="${avatarDataUri}" x="-36" y="-36" width="72" height="72" clip-path="url(#sunClip)"/>`
 : `<circle r="28" fill="#FFD36A"/><text y="6" text-anchor="middle" font-family="Georgia,serif" font-size="16" font-weight="700" fill="#3A2A10">SL</text>`;
const hero=`<svg xmlns="http://www.w3.org/2000/svg" width="880" height="520" viewBox="0 0 880 520" fill="none" role="img" aria-labelledby="heroTitle">
<title id="heroTitle">StarLord solar system — languages as planets, projects as moons</title>
<defs>
 <linearGradient id="deepSpace" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#02040C"/><stop offset=".45" stop-color="#07102A"/><stop offset="1" stop-color="#0C1838"/></linearGradient>
 <radialGradient id="nebulaA" cx="18%" cy="22%" r="48%"><stop stop-color="#8B5CF6" stop-opacity=".42"/><stop offset="1" stop-color="#02040C" stop-opacity="0"/></radialGradient>
 <radialGradient id="nebulaB" cx="86%" cy="78%" r="50%"><stop stop-color="#38BDF8" stop-opacity=".34"/><stop offset="1" stop-color="#02040C" stop-opacity="0"/></radialGradient>
 <radialGradient id="nebulaC" cx="70%" cy="18%" r="38%"><stop stop-color="#FB923C" stop-opacity=".26"/><stop offset="1" stop-color="#02040C" stop-opacity="0"/></radialGradient>
 <radialGradient id="sunCorona"><stop stop-color="#FFE082" stop-opacity="1"/><stop offset=".35" stop-color="#FFA726" stop-opacity=".75"/><stop offset=".7" stop-color="#FF7043" stop-opacity=".28"/><stop offset="1" stop-color="#02040C" stop-opacity="0"/></radialGradient>
 <linearGradient id="cometTail" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#FFE082" stop-opacity="0"/><stop offset=".55" stop-color="#FFCC80" stop-opacity=".55"/><stop offset="1" stop-color="#FFFFFF" stop-opacity=".95"/></linearGradient>
 <clipPath id="sunClip"><circle cx="0" cy="0" r="36"/></clipPath>
</defs>
<rect width="880" height="520" rx="18" fill="url(#deepSpace)"/>
<rect width="880" height="520" rx="18" fill="url(#nebulaA)"/>
<rect width="880" height="520" rx="18" fill="url(#nebulaB)"/>
<rect width="880" height="520" rx="18" fill="url(#nebulaC)"/>
<rect x=".5" y=".5" width="879" height="519" rx="17.5" stroke="#334155" stroke-opacity=".9"/>
<text x="24" y="30" font-family="ui-monospace,monospace" font-size="12" font-weight="700" letter-spacing="2" fill="#FBBF24">SOLAR SYSTEM · @${esc(profile.name||'StarLord').toUpperCase()}</text>
<g id="starfield">${starsBg}</g>
${cometSvg}
${orbitTracks}
<g transform="translate(${cx} ${cy})">
 <g id="sun-halo" data-sun="1"><circle r="78" fill="url(#sunCorona)"/></g>
 <g id="sun-core" data-sun="1">
  <circle r="44" fill="#FFA726" fill-opacity=".2"/>
  <circle r="40" fill="#0B1225" stroke="#FFE082" stroke-width="2.5"/>
  ${avatarSun}
 </g>
 <text y="62" text-anchor="middle" font-family="ui-monospace,monospace" font-size="11" font-weight="700" letter-spacing="1.6" fill="#FFE082">THE SUN // STARLORD</text>
</g>
${orbitPlanets}
<text x="24" y="500" font-family="ui-monospace,monospace" font-size="10" fill="#94A3B8">starlord.solar</text>
<text x="856" y="500" text-anchor="end" font-family="ui-monospace,monospace" font-size="10" fill="#94A3B8">planets = languages · moons = repos · comets = recent pushes</text>
</svg>`;

// --- Phase 2: THE SUN about card ---
const brandName=esc(profile.name||'StarLord');
const fullName='Venkata Nagarjuna Babu Chitturi';
const aboutAvatar=avatarDataUri
 ? `<image href="${avatarDataUri}" x="-40" y="-40" width="80" height="80" clip-path="url(#aboutAvatarClip)"/>`
 : `<circle r="30" fill="#FFD36A"/><text y="6" text-anchor="middle" font-family="Georgia,serif" font-size="16" font-weight="700" fill="#3A2A10">SL</text>`;
const aboutStars=Array.from({length:18},(_,i)=>{const x=(i*73.1)%860+10,y=(i*41.7)%170+10;return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i%5===0?1.1:0.5}" fill="#E2E8F0" opacity="${0.12+(i%3)*0.04}"/>`;}).join('');
const about=`<svg xmlns="http://www.w3.org/2000/svg" width="880" height="190" viewBox="0 0 880 190" fill="none">
<defs>
 <linearGradient id="aboutBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#060B1A"/><stop offset="1" stop-color="#0C1838"/></linearGradient>
 <radialGradient id="aboutNebula" cx="88%" cy="40%" r="40%"><stop stop-color="#F97316" stop-opacity=".2"/><stop offset="1" stop-color="#060B1A" stop-opacity="0"/></radialGradient>
 <radialGradient id="aboutSunCorona"><stop stop-color="#FFE082" stop-opacity=".95"/><stop offset=".45" stop-color="#FFA726" stop-opacity=".45"/><stop offset="1" stop-color="#030611" stop-opacity="0"/></radialGradient>
 <clipPath id="aboutAvatarClip"><circle cx="0" cy="0" r="40"/></clipPath>
</defs>
<rect width="880" height="190" rx="14" fill="url(#aboutBg)"/>
<rect width="880" height="190" rx="14" fill="url(#aboutNebula)"/>
<rect x=".5" y=".5" width="879" height="189" rx="13.5" stroke="#334155"/>
${aboutStars}
<text x="36" y="42" font-family="ui-monospace,monospace" font-size="12" font-weight="700" letter-spacing="2" fill="#FBBF24">THE SUN</text>
<text x="36" y="84" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="28" font-weight="800" fill="#F8FAFC">${esc(fullName)}</text>
<text x="36" y="112" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="13" fill="#CBD5E1">I turn real problems into polished software people can actually open and use.</text>
<text x="36" y="148" font-family="ui-monospace,monospace" font-size="12" fill="#94A3B8">Hyderabad · Student Developer · ${profile.followers||0} followers · ${profile.public_repos||repos.length+1} repositories</text>
<text x="36" y="170" font-family="ui-monospace,monospace" font-size="11" fill="#64748B">${brandName} · Android · Full-Stack · Developer Tools</text>
<g transform="translate(790 95)">
 <circle r="58" fill="url(#aboutSunCorona)"/>
 <circle r="42" fill="#0B1225" stroke="#FFA726" stroke-width="2"/>
 ${aboutAvatar}
</g>
</svg>`;

// --- Phase 3: Compact moon cards ---
const moonCards=featured.map((r,i)=>{
 const key=slug(r.name);const name=projectNames[key]||r.name;
 const lines=projectSummaries[key]||[r.description||'A public project from my orbit.','Built and iterated in the open.'];
 const tags=projectTags[key]||[r.language||'Code'];
 const lang=r.language||tags[0]||'Code';
 const color=palette[lang]||'#38BDF8';
 const previewMotif=key.includes('safe')
  ? `<path d="M0-28L22-18V6C22 20 10 30 0 36-10 30-22 20-22 6V-18Z" fill="${color}" fill-opacity=".2" stroke="${color}" stroke-width="2"/><path d="M-10 0L-2 8 14-8" fill="none" stroke="#F8FAFC" stroke-width="3" stroke-linecap="round"/>`
  : key.includes('knox')
  ? `<g stroke="${color}" stroke-width="2" fill="none"><path d="M-24-14L0-26 24-10 18 18 0 28-22 14Z"/><circle cx="0" cy="0" r="5" fill="${color}"/></g>`
  : key.includes('store')
  ? `<rect x="-26" y="-18" width="52" height="40" rx="6" fill="${color}" fill-opacity=".18" stroke="${color}" stroke-width="2"/><path d="M-14-4H14M-14 8H6" stroke="#F8FAFC" stroke-width="3" stroke-linecap="round"/>`
  : `<circle r="22" fill="${color}" fill-opacity=".15" stroke="${color}" stroke-width="2"/><circle cx="-10" cy="-6" r="7" fill="${color}"/><circle cx="10" cy="-6" r="7" fill="#94A3B8"/><circle cy="-16" r="8" fill="#E2E8F0"/>`;
 const art=`<svg xmlns="http://www.w3.org/2000/svg" width="430" height="150" viewBox="0 0 430 150" fill="none">
<rect width="430" height="150" rx="10" fill="#091024"/>
<rect x=".5" y=".5" width="429" height="149" rx="9.5" stroke="#1E2C4F"/>
<text x="18" y="24" font-family="ui-monospace,monospace" font-size="10" font-weight="700" letter-spacing="1.2" fill="#FBBF24">MOON 0${i+1}.</text>
<g transform="translate(392 28)">
 <ellipse rx="22" ry="10" transform="rotate(-28)" fill="none" stroke="#E2E8F0" stroke-opacity=".55" stroke-width="1.2"/>
 ${langBadge(lang,color,18)}
</g>
<text x="18" y="56" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="20" font-weight="800" fill="#F8FAFC">${esc(name)}</text>
<text x="18" y="80" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#94A3B8">${esc(lines[0])}</text>
<text x="18" y="96" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#64748B">${esc(lines[1]||'')}</text>
<g transform="translate(18 122)">
 <text y="0" font-family="ui-monospace,monospace" font-size="11" fill="#F8FAFC">★ ${r.stargazers_count}</text>
 <text x="58" y="0" font-family="ui-monospace,monospace" font-size="11" fill="#94A3B8">⑂ ${r.forks_count||0}</text>
 <g transform="translate(120 -10) scale(0.75)">${langBadge(lang,color,20)}</g>
 <text x="140" y="0" font-family="ui-monospace,monospace" font-size="11" fill="#CBD5E1">${esc(lang)}</text>
</g>
<g transform="translate(350 95)">${previewMotif}</g>
</svg>`;
 return {r,name,art};
});

// --- Phase 4: Planets stack ---
const maxPct=Math.max(1,...orbitLangs.map(p=>p.pct));
const stackH=56+orbitLangs.length*44;
const stackRows=orbitLangs.map((p,i)=>{
 const y=52+i*44;const bar=Math.max(12,420*(p.pct/maxPct));
 return `<g transform="translate(28 ${y})">
  <g transform="translate(10 0)">${langBadge(p.name,p.color,20)}</g>
  <text x="36" y="5" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="14" font-weight="700" fill="#F8FAFC">${esc(p.name)}</text>
  <rect x="170" y="-8" width="520" height="12" rx="6" fill="#0D1733"/>
  <rect x="170" y="-8" width="${bar}" height="12" rx="6" fill="${p.color}"/>
  <text x="710" y="5" text-anchor="end" font-family="ui-monospace,monospace" font-size="12" fill="#94A3B8">${esc(p.label)}</text>
 </g>`;
}).join('');
const stack=`<svg xmlns="http://www.w3.org/2000/svg" width="880" height="${stackH}" viewBox="0 0 880 ${stackH}" fill="none">
<defs><linearGradient id="stackBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#060B1A"/><stop offset="1" stop-color="#0C1838"/></linearGradient></defs>
<rect width="880" height="${stackH}" rx="14" fill="url(#stackBg)"/>
<rect x=".5" y=".5" width="879" height="${stackH-1}" rx="13.5" stroke="#334155"/>
<text x="28" y="30" font-family="ui-monospace,monospace" font-size="12" font-weight="700" letter-spacing="2" fill="#FBBF24">PLANETS</text>
${stackRows}
</svg>`;

const evidenceRows=orbitLangs.map((p,i)=>{
 const links=p.moons.length
  ? p.moons.map(r=>`[\`${esc(projectNames[slug(r.name)]||r.name)}\`](${r.html_url})`).join(', ')
  : '_exploring_';
 const band=i===0?'Inner':i===orbitLangs.length-1?'Outer':`Orbit ${i+1}`;
 return `| **Orbit ${i+1}** | **${esc(p.name)}** (${band}) | ${esc(p.domain)} | ${links} |`;
}).join('\n');

// --- Phase 5: Orbit log + transmission ---
const maxWeek=Math.max(1,...weekCounts);
const cells=weekCounts.map((n,i)=>{
 const x=28+i*31;const intensity=n/maxWeek;
 const fill=n===0?'#0D1733':`rgba(251,191,36,${(0.25+intensity*0.75).toFixed(2)})`;
 return `<rect x="${x}" y="58" width="24" height="40" rx="4" fill="${fill}" stroke="#1E2C4F"/>`;
}).join('');
const log=`<svg xmlns="http://www.w3.org/2000/svg" width="880" height="130" viewBox="0 0 880 130" fill="none">
<rect width="880" height="130" rx="12" fill="#091024"/>
<rect x=".5" y=".5" width="879" height="129" rx="11.5" stroke="#1E2C4F"/>
<text x="28" y="32" font-family="ui-monospace,monospace" font-size="12" font-weight="700" letter-spacing="2" fill="#FBBF24">ORBIT LOG · ${weeks} WEEKS</text>
<text x="852" y="32" text-anchor="end" font-family="ui-monospace,monospace" font-size="10" fill="#64748B">${repos.length} projects · ${stars} stars · ${allLangs.length} languages</text>
${cells}
<text x="28" y="118" font-family="ui-monospace,monospace" font-size="10" fill="#64748B">PUBLIC SIGNAL · PUSH / UPDATE INTENSITY</text>
</svg>`;

const footer=`<svg xmlns="http://www.w3.org/2000/svg" width="880" height="110" viewBox="0 0 880 110" fill="none">
<rect width="880" height="110" rx="12" fill="#091024"/>
<rect x=".5" y=".5" width="879" height="109" rx="11.5" stroke="#1E2C4F"/>
<text x="28" y="36" font-family="ui-monospace,monospace" font-size="12" font-weight="700" letter-spacing="2" fill="#FBBF24">TRANSMISSION</text>
<text x="28" y="70" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="24" font-weight="800" fill="#F8FAFC">Open a channel</text>
<text x="28" y="94" font-family="ui-monospace,monospace" font-size="11" fill="#94A3B8">GITHUB · EMAIL · BUILD WITH ME</text>
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
<img src="./assets/solar-log.svg" alt="Orbit Log — ${weeks} weeks of public signal" width="100%"/>
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
<sub>Solar System · planets are languages, moons are projects, comets are recent pushes · automatically refreshed</sub>
</div>
`;

const mapRepo=r=>({name:r.name,description:r.description,language:r.language,stars:r.stargazers_count,forks:r.forks_count||0,updated_at:r.updated_at,url:r.html_url});
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
 theme:'solar-system-gitskins-quality',
 profile:{login:profile.login,name:profile.name,avatar_url:profile.avatar_url,followers:profile.followers,public_repos:profile.public_repos},
 featuredRepositories:featured.map(mapRepo),
 publicRepositories:repos.map(mapRepo),
 languages:allLangs,
 orbitLanguages:orbitLangs.map(p=>({name:p.name,pct:p.pct,label:p.label,color:p.color,domain:p.domain,moons:p.moons.map(m=>m.name)})),
 weekCounts,
 totalStars:stars,
 totalForks:forks
},null,2));
console.log(`StarLord solar system generated: ${featured.length} moons / ${repos.length} repos / ${orbitLangs.length} planets / ${weeks} week log${offline?' (offline cache)':''}.`);
async function write(path,content){await fs.mkdir(path.split('/').slice(0,-1).join('/')||'.',{recursive:true});await fs.writeFile(path,content);}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
