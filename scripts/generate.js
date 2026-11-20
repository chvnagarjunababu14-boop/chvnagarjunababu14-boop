// Cedar & Stone — optimised editorial portfolio. Public repository data only.
async function main(){
const fs=await import('node:fs/promises');
const username=process.env.GITHUB_USERNAME||'chvnagarjunababu14-boop';
const headers={Accept:'application/vnd.github+json','User-Agent':'cedar-stone-profile'};
if(process.env.GITHUB_TOKEN)headers.Authorization='Bearer '+process.env.GITHUB_TOKEN;
async function api(url){const r=await fetch(url,{headers});if(!r.ok)throw new Error('GitHub API '+r.status+' at '+url);return r.json();}
function hydrateRepo(r){return{name:r.name,description:r.description||null,language:r.language||null,stargazers_count:r.stars??r.stargazers_count??0,forks_count:r.forks??r.forks_count??0,updated_at:r.updated_at,html_url:r.url||r.html_url,private:false,archived:false};}

let profile,repos,allLangs,offline=false;
try{
 profile=await api('https://api.github.com/users/'+username);
 const all=await api('https://api.github.com/users/'+username+'/repos?type=public&sort=updated&per_page=100');
 repos=all.filter(r=>!r.private&&!r.archived&&r.name.toLowerCase()!==username.toLowerCase()).slice(0,100);
 const langmaps=await Promise.all(repos.map(async r=>{try{return await api(r.languages_url);}catch{return r.language?{[r.language]:1}:{};}}));
 const totalsLive={};langmaps.forEach(m=>Object.entries(m).forEach(([k,v])=>totalsLive[k]=(totalsLive[k]||0)+v));
 if(!Object.keys(totalsLive).length)repos.forEach(r=>{if(r.language)totalsLive[r.language]=(totalsLive[r.language]||0)+1;});
 allLangs=Object.entries(totalsLive).sort((a,b)=>b[1]-a[1]);
}catch(err){
 console.warn('Live GitHub fetch failed ('+err.message+'); regenerating from assets/solar-data.json');
 const cached=JSON.parse(await fs.readFile('assets/solar-data.json','utf8'));
 offline=true;
 profile=cached.profile;
 repos=(cached.publicRepositories||[]).map(hydrateRepo);
 allLangs=cached.languages||[];
}

const langs=allLangs.slice(0,8);
const totals=Object.fromEntries(allLangs);
const palette={TypeScript:'#7FA88A',JavaScript:'#D7BD78',Python:'#6F9EAE',Java:'#D3A16F',Rust:'#C98260',Kotlin:'#A8899C',CSS:'#8C9BB0',HTML:'#CE9277',Go:'#85ADA6',C:'#9AA39A','C++':'#C88791',PHP:'#9B91B5',Shell:'#A6B18D',SQL:'#C49D69',PLpgSQL:'#A7B18D'};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const stars=repos.reduce((n,r)=>n+r.stargazers_count,0);
const followers=Number(profile.followers)||0;
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const featuredPriority=['safeher','knox','store-point','devcatalyst-community-crm'];
const ranked=[...repos].sort((a,b)=>(b.stargazers_count-a.stargazers_count)||new Date(b.updated_at)-new Date(a.updated_at));
const featured=[];
for(const key of featuredPriority){const hit=ranked.find(r=>slug(r.name)===key);if(hit)featured.push(hit);}
for(const r of ranked){if(featured.length>=4)break;if(!featured.includes(r))featured.push(r);}
const moreWork=ranked.filter(r=>!featured.includes(r));
const colors=['#C58E6A','#7FA88A','#D7BD78','#A6B39B'];
const cardBgs=['#14241C','#15241F','#1A261C','#162820'];
const projectSummaries={
 'safeher':'Privacy-first Android safety app with emergency SOS, check-ins and trusted guardian alerts.',
 'knox':'Rust knowledge graph that preserves project decisions and context for AI coding agents.',
 'store-point':'Offline-first retail POS with barcode checkout, inventory and multi-branch analytics.',
 'devcatalyst-community-crm':'Student-club CRM for projects, events, recruitment and a shared member directory.',
 'quantumshield-india':'Learning site for cybersecurity and quantum tech basics, with lessons and a sample quiz.',
 'feed-hyderabad':'Connects restaurants that have surplus food with nearby NGOs.',
 'fresh-circle':'Matches nearby produce vendors and buyers, with stock visibility and surplus discounts.'
};
const projectNames={'safeher':'SafeHer-Next','store-point':'StorePoint','devcatalyst-community-crm':'DevCatalyst CRM','quantumshield-india':'QuantumShield India','feed-hyderabad':'Feed Hyderabad','fresh-circle':'FreshLink'};
const projectTags={'knox':['Rust','Tauri'],'safeher':['Kotlin','Android'],'store-point':['TypeScript','POS'],'devcatalyst-community-crm':['TypeScript','CRM'],'quantumshield-india':['TypeScript','Python'],'fresh-circle':['TypeScript'],'feed-hyderabad':['TypeScript']};
const projectStatus={'safeher':'Featured','knox':'Active','store-point':'Active','devcatalyst-community-crm':'Featured'};

const leafMark=(fill,stroke)=>`<path d="M0-36C-18-8-20 14 0 36 20 14 18-8 0-36Z" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>`;
const tinyLeaf=(x,y,rot,fill,op=0.55)=>`<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0-14C-8-2-8 8 0 16 8 8 8-2 0-14Z" fill="${fill}" opacity="${op}"/></g>`;
const wrapLines=(text,maxChars,maxLines)=>{
 const words=String(text).split(/\s+/);const lines=[];let line='';
 for(const word of words){if(line&&(line+' '+word).length>maxChars){lines.push(line);line=word;}else line=(line+' '+word).trim();}
 if(line)lines.push(line);
 const visible=lines.slice(0,maxLines);
 if(lines.length>maxLines)visible[maxLines-1]=visible[maxLines-1].replace(/[.,;:]?$/,'')+'…';
 return visible;
};

function motifFor(keyword,color,langColor){
 if(keyword.includes('safe'))return `<g transform="translate(0 0)"><circle r="70" fill="none" stroke="${color}" stroke-opacity=".2"/><path d="M0-52L40-36V6C40 34 18 54 0 64-18 54-40 34-40 6V-36Z" fill="${color}" fill-opacity=".14" stroke="${color}" stroke-width="3"/><path d="M-18 2L-4 16 24-14" fill="none" stroke="#F1EBDD" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g>`;
 if(keyword.includes('knox')||keyword.includes('rust'))return `<g><g stroke="${color}" stroke-width="3.5" fill="none"><path d="M-52-30L0-52 50-24 42 34 0 54-48 28Z"/><path d="M-52-30L-12 0 50-24M-12 0L42 34M-12 0L0 54"/></g><circle cx="-12" cy="0" r="12" fill="${langColor}" stroke="#EDE7D8" stroke-width="2"/></g>`;
 if(keyword.includes('store')||keyword.includes('retail'))return `<g><path d="M-60-28L-44-54H44L60-28V-12H-60Z" fill="${color}" fill-opacity=".16" stroke="${color}" stroke-width="3"/><rect x="-48" y="-12" width="96" height="68" rx="8" fill="${color}" fill-opacity=".08" stroke="${color}" stroke-width="3"/><path d="M-28 8H28M-28 28H16" stroke="#EDE7D8" stroke-opacity=".8" stroke-width="5" stroke-linecap="round"/></g>`;
 if(keyword.includes('crm')||keyword.includes('catalyst'))return `<g><circle cx="-28" cy="-18" r="16" fill="${color}"/><circle cx="28" cy="-18" r="16" fill="${langColor}"/><circle cy="-38" r="18" fill="#E9E4D7"/><path d="M-56 48V24C-56 4-40-4-28-4S0 4 0 24V48ZM0 48V24C0 4 16-4 28-4S56 4 56 24V48Z" fill="${color}" fill-opacity=".16" stroke="${color}" stroke-width="3"/></g>`;
 if(keyword.includes('quantum')||keyword.includes('cyber'))return `<g><rect x="-42" y="-42" width="84" height="84" rx="14" fill="${color}" fill-opacity=".1" stroke="${color}" stroke-width="3"/><g fill="none" stroke="${langColor}" stroke-width="3"><ellipse rx="34" ry="14" transform="rotate(35)"/><ellipse rx="34" ry="14" transform="rotate(-35)"/></g><circle r="8" fill="#EDE7D8"/></g>`;
 if(keyword.includes('feed')||keyword.includes('food'))return `<g><path d="M-54-8H54L42 48H-42Z" fill="${color}" fill-opacity=".12" stroke="${color}" stroke-width="3"/><path d="M-34-8L-16-42H16L34-8" fill="none" stroke="${color}" stroke-width="4"/><path d="M0-58C-16-36-16-24 0-16 16-24 16-36 0-58Z" fill="${color}"/></g>`;
 if(keyword.includes('fresh')||keyword.includes('produce'))return `<g><circle r="62" fill="none" stroke="${color}" stroke-opacity=".25"/><path d="M-2 52C-10 4 6-32 48-54 52-10 32 28-2 52Z" fill="${color}" fill-opacity=".35" stroke="${color}" stroke-width="3"/><path d="M-2 52C-44 40-60 8-50-32-14-26 8 0-2 52Z" fill="${langColor}" fill-opacity=".28" stroke="${langColor}" stroke-width="3"/></g>`;
 return `<g><circle r="58" fill="none" stroke="${color}" stroke-opacity=".35"/><path d="M-34-6L0-44 34-6 0 44Z" fill="${color}" fill-opacity=".16" stroke="${color}" stroke-width="3"/><circle r="10" fill="#EDE7D8"/></g>`;
}

// --- Full-width featured project cards (readable at GitHub README width) ---
const projectArts=featured.map((r,i)=>{
 const color=colors[i%colors.length],langColor=palette[r.language]||color,bg=cardBgs[i%cardBgs.length];
 const key=slug(r.name);
 const labelName=projectNames[key]||r.name;
 const displayName=esc(labelName);
 const summary=projectSummaries[key]||r.description||('A '+(r.language||'software')+' project from my public repositories.');
 const lines=wrapLines(summary,52,3);
 const descSvg=lines.map((line,j)=>`<tspan x="44" dy="${j===0?0:28}">${esc(line)}</tspan>`).join('');
 const tags=projectTags[key]||[r.language||'Code'];
 const status=projectStatus[key]||'Public';
 const updated=new Date(r.updated_at).toISOString().slice(0,10);
 const motif=motifFor((r.name+' '+summary).toLowerCase(),color,langColor);
 const gid='c'+i;
 const tagPills=tags.slice(0,3).map((tag,ti)=>{
  const tx=44+ti*118;
  const fill=ti===0?langColor:color;
  return `<rect x="${tx}" y="198" width="108" height="32" rx="16" fill="${fill}" fill-opacity=".16" stroke="${fill}" stroke-opacity=".55"/><text x="${tx+54}" y="219" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" fill="#EDE7D8">${esc(tag)}</text>`;
 }).join('');
 const art=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="280" viewBox="0 0 1200 280" role="img">
<defs>
 <linearGradient id="${gid}Bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${bg}"/><stop offset="1" stop-color="${color}" stop-opacity=".2"/></linearGradient>
 <linearGradient id="${gid}Edge"><stop stop-color="${color}"/><stop offset="1" stop-color="#D7BD78" stop-opacity=".45"/></linearGradient>
</defs>
<rect width="1200" height="280" rx="22" fill="url(#${gid}Bg)"/>
<rect x="1" y="1" width="1198" height="278" rx="21" fill="none" stroke="url(#${gid}Edge)" stroke-opacity=".55"/>
<rect x="1" y="24" width="6" height="232" rx="3" fill="${color}"/>
<text x="44" y="48" font-family="Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="2.2" fill="${color}">0${i+1} / FEATURED PROJECT</text>
<text x="44" y="102" font-family="Georgia,Times New Roman,serif" font-size="40" font-weight="700" fill="#F1EBDD">${displayName}</text>
<text x="44" y="148" font-family="Arial,sans-serif" font-size="20" fill="#C5CEC1">${descSvg}</text>
${tagPills}
<rect x="44" y="246" width="92" height="22" rx="11" fill="${color}" fill-opacity=".18" stroke="${color}" stroke-opacity=".5"/>
<text x="90" y="262" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#EDE7D8">${esc(status)}</text>
<text x="152" y="262" font-family="Consolas,monospace" font-size="13" fill="#AEBBAA">★ ${r.stargazers_count}  ·  Updated ${updated}</text>
<text x="780" y="262" font-family="Arial,sans-serif" font-size="14" letter-spacing="1.2" fill="${color}">VIEW REPOSITORY ↗</text>
<g transform="translate(980 128)">${motif}</g>
</svg>`;
 return {r,key,labelName,art};
});

const projectCards=projectArts.map(p=>`<p align="center"><a href="${p.r.html_url}"><img src="./assets/projects/${slug(p.r.name)}.svg" width="100%" alt="${esc(p.labelName)} — featured project card"/></a></p>`).join('\n');

// Secondary project chips (theme-matched, not default blue links)
const moreChips=moreWork.map((r,i)=>{
 const key=slug(r.name);
 const label=projectNames[key]||r.name;
 const color=colors[(i+1)%colors.length];
 const lang=r.language||'Code';
 const blurb=wrapLines(projectSummaries[key]||r.description||lang,34,2);
 const gid='m'+i;
 const art=`<svg xmlns="http://www.w3.org/2000/svg" width="380" height="120" viewBox="0 0 380 120" role="img">
<defs><linearGradient id="${gid}Bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#14241C"/><stop offset="1" stop-color="${color}" stop-opacity=".18"/></linearGradient></defs>
<rect width="380" height="120" rx="16" fill="url(#${gid}Bg)" stroke="#6F8F72" stroke-opacity=".45"/>
<rect x="1" y="18" width="4" height="84" rx="2" fill="${color}"/>
${tinyLeaf(340,28,-25,color,0.5)}
<text x="22" y="40" font-family="Georgia,serif" font-size="20" font-weight="700" fill="#F1EBDD">${esc(label)}</text>
<text x="22" y="68" font-family="Arial,sans-serif" font-size="13" fill="#AFC0B0">${esc(blurb[0]||'')}</text>
<text x="22" y="88" font-family="Arial,sans-serif" font-size="13" fill="#8FA392">${esc(blurb[1]||lang)}</text>
<text x="22" y="108" font-family="Consolas,monospace" font-size="12" fill="${color}">${esc(lang)}  ·  Open ↗</text>
</svg>`;
 return {r,key,label,art};
});
const moreChipRows=[];
for(let i=0;i<moreChips.length;i+=3){
 const slice=moreChips.slice(i,i+3);
 const imgs=slice.map(c=>`<a href="${c.r.html_url}"><img src="./assets/projects/${c.key}.svg" width="31%" alt="${esc(c.label)} project"/></a>`).join(' &nbsp; ');
 moreChipRows.push(`<p align="center">${imgs}</p>`);
}
const moreWorkBlock=moreChips.length
 ? `<p align="center"><sub>Also in the grove</sub></p>\n${moreChipRows.join('\n')}`
 : '';

// Nav — order matches page flow while keeping required destinations
const navItems=[
 {id:'about',number:'01',label:'ABOUT',color:'#C58E6A'},
 {id:'selected-work',number:'02',label:'SELECTED WORK',color:'#91B8A8'},
 {id:'toolkit',number:'03',label:'TOOLKIT',color:'#D7BD78'},
 {id:'snapshot',number:'04',label:'SNAPSHOT',color:'#7FA88A'}
];
const navSvgs=navItems.map(item=>({...item,svg:`<svg xmlns="http://www.w3.org/2000/svg" width="280" height="64" viewBox="0 0 280 64"><defs><linearGradient id="n${item.id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#14241C"/><stop offset="1" stop-color="#1A2E24"/></linearGradient></defs><rect x="1" y="1" width="278" height="62" rx="12" fill="url(#n${item.id})" stroke="#6F8F72" stroke-opacity=".55" stroke-width="1.5"/><rect x="1" y="12" width="5" height="40" rx="2.5" fill="${item.color}"/><text x="20" y="26" font-family="Arial,sans-serif" font-size="11" font-weight="700" letter-spacing="1.6" fill="${item.color}">${item.number}</text><text x="20" y="48" font-family="Georgia,serif" font-size="16" font-weight="700" fill="#F1EBDD">${item.label}</text></svg>`}));
const navCards=navSvgs.map(item=>`<a href="#${item.id}"><img src="./assets/nav-${item.id}.svg" width="23%" alt="${item.number} ${item.label} section navigation"/></a>`).join(' ');

// Compact About — single panel + short prose
const aboutHeader=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="210" viewBox="0 0 1200 210" role="img">
<defs>
 <linearGradient id="aboutBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#14241C"/><stop offset="1" stop-color="#1A2E24"/></linearGradient>
 <linearGradient id="aboutRule" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#C58E6A"/><stop offset=".55" stop-color="#7FA88A"/><stop offset="1" stop-color="#7FA88A" stop-opacity="0"/></linearGradient>
</defs>
<rect width="1200" height="210" rx="20" fill="url(#aboutBg)"/>
<rect x=".5" y=".5" width="1199" height="209" rx="19.5" fill="none" stroke="#6F8F72" stroke-opacity=".45"/>
${tinyLeaf(1100,36,-25,'#7FA88A',0.5)}${tinyLeaf(1134,52,35,'#C58E6A',0.45)}
<text x="44" y="42" font-family="Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="2.4" fill="#C58E6A">01 / ABOUT</text>
<path d="M44 58H280" stroke="url(#aboutRule)" stroke-width="2"/>
<text x="44" y="100" font-family="Georgia,serif" font-size="34" font-weight="700" fill="#F1EBDD">Venkata Nagarjuna Babu Chitturi</text>
<text x="44" y="132" font-family="Arial,sans-serif" font-size="16" fill="#D7BD78">StarLord · Student developer · Hyderabad</text>
<text x="44" y="168" font-family="Arial,sans-serif" font-size="16" fill="#C5CEC1">Android apps · Full-stack web · Developer tools · Security, AI &amp; community platforms</text>
<text x="44" y="192" font-family="Arial,sans-serif" font-size="15" fill="#AFC0B0">I learn by building in public — ship early, refine carefully, keep growing.</text>
</svg>`;

const aboutSection=`<img src="./assets/about-header.svg" width="100%" alt="About Venkata Nagarjuna Babu Chitturi / StarLord — student developer in Hyderabad"/>`;

const workHeader=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="110" viewBox="0 0 1200 110">
<defs>
<linearGradient id="workBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#14241C"/><stop offset="1" stop-color="#172A24"/></linearGradient>
<linearGradient id="workEdge"><stop stop-color="#C58E6A"/><stop offset=".55" stop-color="#7FA88A"/><stop offset="1" stop-color="#7FA88A" stop-opacity=".2"/></linearGradient>
</defs>
<rect x="1" y="1" width="1198" height="108" rx="18" fill="url(#workBg)" stroke="url(#workEdge)" stroke-opacity=".55"/>
<rect x="1" y="16" width="6" height="78" rx="3" fill="#B47D58"/>
${tinyLeaf(1120,34,-20,'#7FA88A',0.45)}
<text x="36" y="40" font-family="Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="2.4" fill="#C58E6A">02 / SELECTED WORK</text>
<text x="36" y="78" font-family="Georgia,serif" font-size="32" font-weight="700" fill="#F1EBDD">Featured projects</text>
<text x="340" y="78" font-family="Arial,sans-serif" font-size="15" fill="#AFC0B0">${featured.length} featured · ${repos.length} public · Android, tools, security &amp; community</text>
</svg>`;

// Categorised toolkit using verified language stats + known project tags
const langSet=new Set(allLangs.map(([n])=>n));
const tagSet=new Set(Object.values(projectTags).flat());
const categories=[
 {title:'Programming Languages',items:['TypeScript','Kotlin','Python','Rust','JavaScript','Java','PLpgSQL'].filter(x=>langSet.has(x)||tagSet.has(x))},
 {title:'Frontend & Mobile',items:['Android','TypeScript','JavaScript','CSS','HTML','Kotlin'].filter((x,i,a)=>a.indexOf(x)===i&&(langSet.has(x)||tagSet.has(x)||x==='Android'))},
 {title:'Backend & Data',items:['TypeScript','Python','PLpgSQL','Rust'].filter(x=>langSet.has(x))},
 {title:'Tools & Emerging',items:['Tauri','POS','CRM','Android'].filter(x=>tagSet.has(x))}
].filter(c=>c.items.length);
const stackH=72+categories.length*70;
const stackRows=categories.map((cat,ci)=>{
 const y=58+ci*70;
 const pills=cat.items.slice(0,6).map((name,ni)=>{
  const color=palette[name]||colors[ni%colors.length];
  const x=250+ni*145;
  return `<rect x="${x}" y="${y-18}" width="132" height="36" rx="18" fill="${color}" fill-opacity=".14" stroke="${color}" stroke-opacity=".5"/><text x="${x+66}" y="${y+5}" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" fill="#EDE7D8">${esc(name)}</text>`;
 }).join('');
 return `<text x="36" y="${y+5}" font-family="Georgia,serif" font-size="16" fill="#D7BD78">${esc(cat.title)}</text>${pills}`;
}).join('');
const stackSvg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${stackH}" viewBox="0 0 1200 ${stackH}">
<defs><linearGradient id="stackPanel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#14241C"/><stop offset="1" stop-color="#172A24"/></linearGradient><linearGradient id="stackEdge"><stop stop-color="#C58E6A"/><stop offset="1" stop-color="#7FA88A"/></linearGradient></defs>
<rect x="5" y="5" width="1190" height="${stackH-10}" rx="18" fill="url(#stackPanel)" stroke="url(#stackEdge)" stroke-opacity=".4"/>
<text x="32" y="36" font-family="Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="2.2" fill="#C58E6A">03 / TOOLKIT</text>
<text x="1165" y="36" text-anchor="end" font-family="Consolas,monospace" font-size="11" fill="#93A492">VERIFIED FROM PUBLIC CODE</text>
${stackRows}
</svg>`;

const metricItems=[
 {value:repos.length,label:'PUBLIC PROJECTS',symbol:'✳',color:'#C58E6A'},
 {value:featured.length,label:'FEATURED PROJECTS',symbol:'◎',color:'#91B8A8'},
 {value:allLangs.length,label:'LANGUAGES USED',symbol:'⌘',color:'#7FA88A'},
 {value:stars,label:'REPOSITORY STARS',symbol:'★',color:'#D7BD78'},
 {value:followers,label:'FOLLOWERS',symbol:'◎',color:'#A8899C'}
];
const metricsSvg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="168" viewBox="0 0 1200 168"><defs><linearGradient id="metricBg" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#14241C"/><stop offset=".5" stop-color="#1A2E24"/><stop offset="1" stop-color="#152820"/></linearGradient><linearGradient id="metricEdge"><stop stop-color="#C58E6A"/><stop offset=".5" stop-color="#7FA88A"/><stop offset="1" stop-color="#86AAA2"/></linearGradient></defs><rect x="5" y="5" width="1190" height="158" rx="18" fill="url(#metricBg)" stroke="url(#metricEdge)" stroke-opacity=".5" stroke-width="1.5"/><text x="32" y="32" font-family="Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="2.2" fill="#C58E6A">04 / SNAPSHOT</text><text x="1165" y="32" text-anchor="end" font-family="Consolas,monospace" font-size="11" fill="#93A492">PUBLIC GITHUB DATA ONLY</text>${metricItems.map((m,i)=>{const x=95+i*220;return `<text x="${x}" y="92" text-anchor="middle" font-family="Georgia,serif" font-size="34" font-weight="700" fill="#F1EBDD">${m.value}</text><text x="${x}" y="122" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" letter-spacing="1.2" fill="${m.color}">${m.label}</text>`;}).join('')}</svg>`;

const footerCta=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="120" viewBox="0 0 1200 120" role="img">
<defs>
<linearGradient id="footerBg" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#14241C"/><stop offset=".55" stop-color="#1A2E24"/><stop offset="1" stop-color="#152820"/></linearGradient>
<linearGradient id="footerEdge"><stop stop-color="#B47D58"/><stop offset=".5" stop-color="#7FA88A"/><stop offset="1" stop-color="#7FA88A" stop-opacity=".35"/></linearGradient>
</defs>
<rect x="1" y="1" width="1198" height="118" rx="18" fill="url(#footerBg)" stroke="url(#footerEdge)" stroke-opacity=".62"/>
<rect x="1" y="16" width="6" height="88" rx="3" fill="#B47D58"/>
${tinyLeaf(1060,34,-25,'#7FA88A',0.45)}
<text x="36" y="42" font-family="Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="2.4" fill="#C58E6A">EXPLORE THE GROVE</text>
<text x="36" y="80" font-family="Georgia,serif" font-size="30" font-weight="700" fill="#F1EBDD">All public repositories</text>
<text x="400" y="80" font-family="Arial,sans-serif" font-size="15" fill="#AFC0B0">Browse every project and experiment · private work stays private</text>
<circle cx="1130" cy="60" r="28" fill="#7FA88A" fill-opacity=".1" stroke="#7FA88A" stroke-opacity=".55"/>
<path d="M1118 60H1140M1132 50L1142 60 1132 70" fill="none" stroke="#D7BD78" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// --- Nature hero (preserved falling-leaf animation markers) ---
const brandName=esc(profile.name||'StarLord');
const seedDots=Array.from({length:56},(_,i)=>{
 const x=(i*137.3)%1160+20,y=(i*71.9)%440+20,r=i%7===0?2.2:1;
 const fill=i%5===0?'#D7BD78':(i%3===0?'#A8C4A4':'#D6DCCB');
 return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${fill}" opacity="${(0.12+(i%4)*0.07).toFixed(2)}"/>`;
}).join('');
const fallFills=['#7FA88A','#A6B39B','#C58E6A','#D7BD78','#8EA68C','#B7A17A'];
const fallLeaf=(fill)=>`<path d="M0-22C-9-6-10 8 0 22 10 8 9-6 0-22Z" fill="${fill}"/><path d="M0-18V16" stroke="#F1EBDD" stroke-opacity=".45" stroke-width="1"/>`;
const fallingLeaves=Array.from({length:14},(_,i)=>{
 const x=55+i*48+(i%2)*14;
 const yStart=-40-(i%4)*22;
 const s=(0.55+(i%4)*0.08).toFixed(2);
 const rot=-25+(i%7)*8;
 const phase=(i*0.071)%1;
 const drift=(5+(i%3)*3)*(i%2===0?1:-1);
 const spin=(12+(i%4)*4)*(i%2===0?1:-1);
 const fill=fallFills[i%fallFills.length];
 return `<g data-fall="1" data-x0="${x}" data-y0="${yStart}" data-rot0="${rot}" data-scale="${s}" data-phase="${phase.toFixed(3)}" data-drift="${drift}" data-spin="${spin}" opacity="0.85" transform="translate(${x} ${yStart}) rotate(${rot}) scale(${s})">${fallLeaf(fill)}</g>`;
}).join('');
const groundFerns=Array.from({length:10},(_,i)=>{
 const x=70+i*110,y=430+(i%2)*8;
 return `<g transform="translate(${x} ${y})" opacity=".55"><path d="M0 0C-6-28 4-48 0-72" fill="none" stroke="#7FA88A" stroke-width="1.6"/><path d="M0-18C-16-22-22-12-8-8M0-36C16-40 22-28 8-24M0-54C-14-58-18-48-6-44" fill="none" stroke="#A8C4A4" stroke-width="1.3"/></g>`;
}).join('');

const hero=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="480" viewBox="0 0 1200 480" role="img" aria-labelledby="heroTitle">
<title id="heroTitle">StarLord — Cedar &amp; Stone nature banner</title>
<defs>
 <linearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0C1611"/><stop offset=".4" stop-color="#15241C"/><stop offset="1" stop-color="#0F221C"/></linearGradient>
 <radialGradient id="dawnGlow" cx="18%" cy="28%" r="42%"><stop stop-color="#D4A574" stop-opacity=".22"/><stop offset=".6" stop-color="#C58E6A" stop-opacity=".08"/><stop offset="1" stop-color="#0C1611" stop-opacity="0"/></radialGradient>
 <radialGradient id="mossGlow" cx="88%" cy="42%" r="36%"><stop stop-color="#5F8F6E" stop-opacity=".26"/><stop offset="1" stop-color="#0C1611" stop-opacity="0"/></radialGradient>
 <linearGradient id="mistSoft" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#C5D6C4" stop-opacity="0"/><stop offset=".75" stop-color="#C5D6C4" stop-opacity=".06"/><stop offset="1" stop-color="#C5D6C4" stop-opacity=".1"/></linearGradient>
 <linearGradient id="heroEdge"><stop stop-color="#C58E6A"/><stop offset=".45" stop-color="#7FA88A"/><stop offset="1" stop-color="#86AAA2"/></linearGradient>
 <linearGradient id="sunCore"><stop stop-color="#F1EBDD"/><stop offset="1" stop-color="#D7BD78"/></linearGradient>
</defs>
<rect width="1200" height="480" rx="28" fill="url(#heroBg)"/>
<rect width="1200" height="480" rx="28" fill="url(#dawnGlow)"/>
<rect width="1200" height="480" rx="28" fill="url(#mossGlow)"/>
<rect width="1200" height="480" rx="28" fill="url(#mistSoft)"/>
<g id="falling-leaves" opacity=".78">${fallingLeaves}</g>
<g>${seedDots}</g>
${groundFerns}
<path d="M0 390Q180 350 360 392T720 370T1200 400" fill="none" stroke="#7FA88A" stroke-opacity=".2" stroke-width="1.5"/>
<path d="M0 410Q220 375 440 412T880 388T1200 418" fill="none" stroke="#C58E6A" stroke-opacity=".14" stroke-width="1.2"/>
<g transform="translate(900 230)">
 <circle r="118" fill="none" stroke="#7FA88A" stroke-opacity=".16" stroke-width="1.2"/>
 <circle r="88" fill="#5F8F6E" fill-opacity=".10" stroke="#A8C4A4" stroke-opacity=".4"/>
 <circle r="58" fill="url(#sunCore)" fill-opacity=".92"/>
 <circle r="70" fill="none" stroke="#E5D9BD" stroke-opacity=".22"/>
 <g data-leaf="sage" data-px="-4" data-py="-8" transform="rotate(0 -4 -8)">
  <path d="M-4-8C-48-80-35-124 12-145 35-87 22-44-4-8Z" fill="#7FA88A" fill-opacity=".88" stroke="#C5D6C4" stroke-width="1.6"/>
  <path d="M-4-8L10-121" stroke="#EDE7D8" stroke-opacity=".75" stroke-width="2"/>
 </g>
 <g data-leaf="copper" data-px="-4" data-py="-8" transform="rotate(0 -4 -8)">
  <path d="M-4-8C-72-25-106 5-102 55-50 61-15 35-4-8Z" fill="#C58E6A" fill-opacity=".88" stroke="#E0B18C" stroke-width="1.6"/>
  <path d="M-4-8L-80 35" stroke="#EDE7D8" stroke-opacity=".75" stroke-width="2"/>
 </g>
 <g data-leaf="gold" data-px="18" data-py="-20" transform="rotate(0 18 -20)">
  <path d="M18-20C48-70 88-78 118-58 78-28 42-18 18-20Z" fill="#D7BD78" fill-opacity=".82" stroke="#EDE7D8" stroke-width="1.3"/>
  <path d="M18-20L95-55" stroke="#F1EBDD" stroke-opacity=".65" stroke-width="1.6"/>
 </g>
 <g data-leaf="moss" data-px="-20" data-py="12" transform="rotate(0 -20 12)">
  <path d="M-20 12C-70 8-98 42-88 82-42 72-22 42-20 12Z" fill="#5F8F6E" fill-opacity=".8" stroke="#A8C4A4" stroke-width="1.3"/>
  <path d="M-20 12L-75 58" stroke="#EDE7D8" stroke-opacity=".55" stroke-width="1.5"/>
 </g>
</g>
<g>
 <text x="72" y="72" font-family="Arial,sans-serif" font-size="13" letter-spacing="4.5" fill="#C5BDA8">CEDAR &amp; STONE  ·  ${new Date().getUTCFullYear()}</text>
 <text x="68" y="168" font-family="Georgia,Times New Roman,serif" font-size="86" font-weight="700" fill="#F1EBDD">${brandName}</text>
 <path d="M74 196H210" stroke="#C58E6A" stroke-width="3.2"/>
 <text x="72" y="244" font-family="Georgia,Times New Roman,serif" font-size="26" fill="#E4E1D4">Grown from real problems into living software.</text>
 <text x="74" y="292" font-family="Arial,sans-serif" font-size="16" letter-spacing="1.4" fill="#AFC0B0">STUDENT DEVELOPER  ·  HYDERABAD  ·  BUILDING IN THE OPEN</text>
 <text x="74" y="372" font-family="Consolas,monospace" font-size="12" letter-spacing="2.4" fill="#A6B39F">BUILD THOUGHTFULLY  /  KEEP GROWING</text>
</g>
<rect x="16" y="16" width="1168" height="448" rx="22" fill="none" stroke="url(#heroEdge)" stroke-opacity=".62" stroke-width="1.6"/>
</svg>`;

const mapRepo=r=>({name:r.name,description:r.description,language:r.language,stars:r.stargazers_count,updated_at:r.updated_at,url:r.html_url});
const readme=[
'<div align="center">',
'',
'<img src="./assets/profile-universe.gif" width="100%" alt="StarLord — Cedar & Stone nature banner with gently falling leaves"/>',
'',
'<p align="center">',
navCards,
'</p>',
'',
'<a id="about"></a>',
aboutSection,
'',
'<a id="selected-work"></a>',
'<img src="./assets/work-header.svg" width="100%" alt="Selected work — featured projects"/>',
'',
projectCards,
'',
moreWorkBlock,
'',
'<a id="toolkit"></a>',
'<img src="./assets/tech-stack-v2.svg" width="100%" alt="Toolkit — verified languages and technologies"/>',
'',
'<a id="snapshot"></a>',
'<img src="./assets/profile-metrics.svg" width="100%" alt="GitHub snapshot: public projects, featured work, languages, stars and followers"/>',
'',
`<p align="center"><sub>${featured.length} featured · ${repos.length} public projects · Android, tools, security and community.</sub></p>`,
'',
`<p align="center"><a href="https://github.com/${username}?tab=repositories"><img src="./assets/portfolio-footer.svg" width="100%" alt="Explore all public repositories"/></a></p>`,
'',
'<p align="center"><sub>A living grove of public work · Automatically refreshed · Private repositories stay private</sub></p>',
'',
'</div>'
].join('\n');

await write('README.md',readme);
await write('assets/profile-universe.svg',hero);
await write('assets/nebula-hero.svg',hero);
await write('assets/about-header.svg',aboutHeader);
await write('assets/profile-metrics.svg',metricsSvg);
await write('assets/tech-stack-v2.svg',stackSvg);
await write('assets/work-header.svg',workHeader);
await write('assets/portfolio-footer.svg',footerCta);
await Promise.all(navSvgs.map(item=>write('assets/nav-'+item.id+'.svg',item.svg)));
await Promise.all(projectArts.map(p=>write(`assets/projects/${slug(p.r.name)}.svg`,p.art)));
await Promise.all(moreChips.map(c=>write(`assets/projects/${c.key}.svg`,c.art)));
await write('assets/solar-data.json',JSON.stringify({
 username,
 theme:'cedar-stone-optimised',
 profile:{login:profile.login,name:profile.name,avatar_url:profile.avatar_url,followers:followers,public_repos:profile.public_repos},
 featuredRepositories:featured.map(mapRepo),
 publicRepositories:repos.map(mapRepo),
 languages:allLangs,
 totalStars:stars
},null,2));
console.log(`Cedar & Stone optimised profile: ${featured.length} featured / ${moreChips.length} secondary / ${repos.length} public / ${langs.length} languages${offline?' (offline cache)':''}.`);
async function write(path,content){await fs.mkdir(path.split('/').slice(0,-1).join('/')||'.',{recursive:true});await fs.writeFile(path,content);}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
