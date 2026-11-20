// Cedar & Stone — editorial GitHub profile. Public repository data only.
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

const palette={TypeScript:'#7FA88A',JavaScript:'#D7BD78',Python:'#6F9EAE',Java:'#D3A16F',Rust:'#C98260',Kotlin:'#A8899C',CSS:'#8C9BB0',HTML:'#CE9277',Go:'#85ADA6',C:'#9AA39A','C++':'#C88791',PHP:'#9B91B5',Shell:'#A6B18D',SQL:'#C49D69',PLpgSQL:'#A7B18D',Android:'#7FA88A',Tauri:'#C58E6A',Web:'#86AAA2',PostgreSQL:'#A7B18D'};
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
const projectTags={'knox':'Rust / Tauri','safeher':'Kotlin','store-point':'TypeScript','devcatalyst-community-crm':'TypeScript','quantumshield-india':'TypeScript / Python','fresh-circle':'TypeScript','feed-hyderabad':'TypeScript'};
const projectTagLists={'knox':['Rust','Tauri'],'safeher':['Kotlin','Android'],'store-point':['TypeScript','POS'],'devcatalyst-community-crm':['TypeScript','CRM'],'quantumshield-india':['TypeScript','Python'],'fresh-circle':['TypeScript'],'feed-hyderabad':['TypeScript']};

const tinyLeaf=(x,y,rot,fill,op=0.45)=>`<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0-12C-7-2-7 7 0 14 7 7 7-2 0-12Z" fill="${fill}" opacity="${op}"/></g>`;
const wrapLines=(text,maxLen,maxLines)=>{
 const words=String(text).split(/\s+/),lines=[];let line='';
 for(const word of words){if(line&&(line+' '+word).length>maxLen){lines.push(line);line=word;}else line=(line+' '+word).trim();}
 if(line)lines.push(line);
 const visible=lines.slice(0,maxLines);
 if(lines.length>maxLines)visible[maxLines-1]=visible[maxLines-1].replace(/[.,;:]?$/,'')+'…';
 return visible;
};
const pillWidth=label=>Math.max(88,Math.round(26+String(label).length*7.6));

// --- Featured project cards (classic 2×2) ---
const projectArts=featured.map((r,i)=>{
 const color=colors[i%colors.length],langColor=palette[r.language]||color,bg=cardBgs[i%cardBgs.length];
 const key=slug(r.name);
 const labelName=projectNames[key]||r.name;
 const rawName=labelName.length>25?labelName.slice(0,24)+'…':labelName;
 const displayName=esc(rawName);
 const titleSize=Math.min(40,Math.max(30,520/(rawName.length*0.55)));
 const summary=projectSummaries[key]||r.description||((r.language||'Software')+' project from public repositories.');
 const visibleLines=wrapLines(summary,38,3);
 const descSvg=visibleLines.map((line,j)=>`<tspan x="48" dy="${j===0?0:22}">${esc(line)}</tspan>`).join('');
 const lang=projectTags[key]||r.language||'Multi';
 const badgeW=pillWidth(lang)+24;
 const updated=new Date(r.updated_at).toISOString().slice(0,10);
 const repoStars=r.stargazers_count;
 const keyword=(r.name+' '+summary).toLowerCase();
 const motif=keyword.includes('safe')
  ? `<g transform="translate(700 158)"><circle r="100" fill="none" stroke="${color}" stroke-opacity=".16" stroke-width="1.4"/><path d="M0-76L58-52V6C58 46 26 76 0 90-26 76-58 46-58 6V-52Z" fill="${color}" fill-opacity=".12" stroke="${color}" stroke-width="2.6"/><path d="M-24 0L-6 18 30-24" fill="none" stroke="#F1EBDD" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>`
  :keyword.includes('knox')||keyword.includes('rust')
  ? `<g transform="translate(700 164)"><g stroke="${color}" stroke-width="3.4" fill="none"><path d="M-74-44L0-74 72-34 60 48 0 76-68 40Z"/><path d="M-74-44L-16 0 72-34M-16 0L60 48M-16 0L0 76"/></g><circle cx="-16" cy="0" r="16" fill="${langColor}" stroke="#EDE7D8" stroke-width="1.8"/></g>`
  :keyword.includes('store')||keyword.includes('retail')
  ? `<g transform="translate(700 165)"><path d="M-92-42L-70-84H70L92-42V-20H-92Z" fill="${color}" fill-opacity=".14" stroke="${color}" stroke-width="2.6"/><rect x="-74" y="-20" width="148" height="100" rx="8" fill="${color}" fill-opacity=".07" stroke="${color}" stroke-width="2.6"/></g>`
  :keyword.includes('crm')||keyword.includes('catalyst')
  ? `<g transform="translate(700 160)"><circle cx="-40" cy="-30" r="22" fill="${color}"/><circle cx="40" cy="-30" r="22" fill="${langColor}"/><circle cy="-58" r="24" fill="#E9E4D7"/><path d="M-80 70V38C-80 10-58 0-40 0S0 10 0 38V70ZM0 70V38C0 10 22 0 40 0S80 10 80 38V70Z" fill="${color}" fill-opacity=".14" stroke="${color}" stroke-width="2.6"/></g>`
  : `<g transform="translate(700 164)"><circle r="92" fill="none" stroke="${color}" stroke-opacity=".3"/><path d="M-50-8L0-66 50-8 0 66Z" fill="${color}" fill-opacity=".14" stroke="${color}" stroke-width="2.6"/><circle r="14" fill="#EDE7D8"/></g>`;
 const gid='c'+i;
 const art=`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="300" viewBox="0 0 900 300" role="img">
<defs>
 <linearGradient id="${gid}Bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${bg}"/><stop offset="1" stop-color="${color}" stop-opacity=".18"/></linearGradient>
 <linearGradient id="${gid}Line" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${color}" stop-opacity=".7"/><stop offset="1" stop-color="#D7BD78" stop-opacity=".25"/></linearGradient>
</defs>
<rect width="900" height="300" rx="18" fill="url(#${gid}Bg)"/>
<rect x="1" y="1" width="898" height="298" rx="17" fill="none" stroke="#D9D2C2" stroke-opacity=".14"/>
<path d="M0 258Q220 228 450 258T900 236" fill="none" stroke="url(#${gid}Line)" stroke-opacity=".28" stroke-width="1.4"/>
${tinyLeaf(842,36,-24,color,0.32)}
<text x="48" y="42" font-family="Arial,sans-serif" font-size="12" font-weight="700" letter-spacing="2" fill="${color}">${esc(lang).toUpperCase()}  ·  SELECTED WORK</text>
<text x="48" y="108" font-family="Georgia,Times New Roman,serif" font-size="${titleSize}" font-weight="700" fill="#F1EBDD">${displayName}</text>
<text x="48" y="140" font-family="Arial,sans-serif" font-size="18" fill="#B7C2B6">${descSvg}</text>
<rect x="48" y="214" width="${badgeW}" height="30" rx="15" fill="${langColor}" fill-opacity=".14" stroke="${langColor}" stroke-opacity=".5"/>
<text x="${48+badgeW/2}" y="234" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" fill="#EDE7D8">${esc(lang)}</text>
<text x="48" y="272" font-family="Consolas,monospace" font-size="13" fill="#9AAB98">★ ${repoStars}  ·  ${updated}</text>
${motif}
<text x="852" y="272" text-anchor="end" font-family="Arial,sans-serif" font-size="11" letter-spacing="1.4" fill="${color}">VIEW PROJECT ↗</text>
</svg>`;
 return {r,key,labelName,art};
});

const projectCards=projectArts.map(p=>`<a href="${p.r.html_url}"><img src="./assets/projects/${slug(p.r.name)}.svg" width="100%" alt="${esc(p.labelName)} — featured project card"/></a>`)
 .reduce((a,x,i)=>{if(i%2===0)a.push([x]);else a[a.length-1].push(x);return a;},[])
 .map(row=>`<p align="center">${row.map(x=>x.replace('width="100%"','width="47%"')).join(' &nbsp; ')}</p>`)
 .join('\n');

const moreWorkBlock=moreWork.length
 ? `<p align="center"><sub>Also: ${moreWork.map(r=>{const label=projectNames[slug(r.name)]||r.name;return `<a href="${r.html_url}">${esc(label)}</a>`;}).join(' · ')}</sub></p>`
 : '';

// Nav
const navItems=[
 {id:'about',number:'01',label:'About',color:'#C58E6A'},
 {id:'selected-work',number:'02',label:'Work',color:'#91B8A8'},
 {id:'toolkit',number:'03',label:'Toolkit',color:'#D7BD78'},
 {id:'snapshot',number:'04',label:'Snapshot',color:'#7FA88A'}
];
const navSvgs=navItems.map(item=>({...item,svg:`<svg xmlns="http://www.w3.org/2000/svg" width="260" height="56" viewBox="0 0 260 56">
<rect x="0.75" y="0.75" width="258.5" height="54.5" rx="12" fill="#14241C" stroke="#6F8F72" stroke-opacity=".4"/>
<rect x="0.75" y="14" width="4" height="28" rx="2" fill="${item.color}"/>
<text x="20" y="24" font-family="Arial,sans-serif" font-size="10" font-weight="700" letter-spacing="1.8" fill="${item.color}">${item.number}</text>
<text x="20" y="42" font-family="Georgia,serif" font-size="16" fill="#F1EBDD">${item.label}</text>
</svg>`}));
const navCards=navSvgs.map(item=>`<a href="#${item.id}"><img src="./assets/nav-${item.id}.svg" width="22%" alt="${item.number} ${item.label} section navigation"/></a>`).join(' ');

// About
const aboutHeader=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="176" viewBox="0 0 1200 176" role="img">
<defs>
 <linearGradient id="aboutBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#14241C"/><stop offset="1" stop-color="#182822"/></linearGradient>
</defs>
<rect width="1200" height="176" rx="16" fill="url(#aboutBg)"/>
<rect x="0.75" y="0.75" width="1198.5" height="174.5" rx="15.25" fill="none" stroke="#6F8F72" stroke-opacity=".38"/>
${tinyLeaf(1148,34,-20,'#7FA88A',0.4)}
<text x="40" y="38" font-family="Arial,sans-serif" font-size="12" font-weight="700" letter-spacing="2.2" fill="#C58E6A">01  /  ABOUT</text>
<path d="M40 52H220" stroke="#C58E6A" stroke-opacity=".55" stroke-width="1.5"/>
<text x="40" y="94" font-family="Georgia,serif" font-size="30" font-weight="700" fill="#F1EBDD">Venkata Nagarjuna Babu Chitturi</text>
<text x="40" y="126" font-family="Arial,sans-serif" font-size="15" fill="#D7BD78">StarLord · Student developer · Hyderabad</text>
<text x="40" y="154" font-family="Arial,sans-serif" font-size="15" fill="#AFC0B0">Android · full-stack web · developer tools · security &amp; community platforms</text>
</svg>`;
const aboutSection=`<img src="./assets/about-header.svg" width="100%" alt="About Venkata Nagarjuna Babu Chitturi / StarLord — student developer in Hyderabad"/>`;

// Work header
const workHeader=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="88" viewBox="0 0 1200 88">
<rect x="0.75" y="0.75" width="1198.5" height="86.5" rx="14" fill="#14241C" stroke="#6F8F72" stroke-opacity=".38"/>
<rect x="0.75" y="18" width="4" height="52" rx="2" fill="#C58E6A"/>
<text x="36" y="36" font-family="Arial,sans-serif" font-size="12" font-weight="700" letter-spacing="2.2" fill="#C58E6A">02  /  SELECTED WORK</text>
<text x="36" y="66" font-family="Georgia,serif" font-size="26" fill="#F1EBDD">Featured projects</text>
<text x="280" y="66" font-family="Arial,sans-serif" font-size="14" fill="#9AAB98">${featured.length} featured · ${repos.length} public</text>
</svg>`;

// Toolkit — languages / platforms / domains
const noiseLangs=new Set(['CSS','HTML','Shell','Batchfile','Makefile','PowerShell','Dockerfile','Procfile','MDX']);
const meaningfulLangs=allLangs.filter(([n])=>!noiseLangs.has(n));
const langSet=new Set(allLangs.map(([n])=>n));
const tagSet=new Set(Object.values(projectTagLists).flat());
const displayLang=n=>n==='PLpgSQL'?'SQL':n;
const langItems=meaningfulLangs.map(([n])=>displayLang(n)).slice(0,7);
const platformItems=['Android','Tauri','Web','PostgreSQL'].filter(x=>{
 if(x==='Android')return tagSet.has('Android');
 if(x==='Tauri')return tagSet.has('Tauri');
 if(x==='Web')return langSet.has('TypeScript')||langSet.has('JavaScript')||langSet.has('HTML')||langSet.has('CSS');
 if(x==='PostgreSQL')return langSet.has('PLpgSQL')||langSet.has('SQL');
 return false;
});
const domainItems=[
 tagSet.has('Android')?'Safety':null,
 tagSet.has('Tauri')?'Desktop':null,
 tagSet.has('POS')?'Retail':null,
 tagSet.has('CRM')?'Community':null,
 projectTagLists['quantumshield-india']?'Security':null,
 (projectTagLists['feed-hyderabad']||projectTagLists['fresh-circle'])?'Civic':null
].filter(Boolean).slice(0,5);
const categories=[
 {title:'Languages',items:langItems},
 {title:'Platforms',items:platformItems},
 {title:'Domains',items:domainItems}
].filter(c=>c.items.length);

const stackRows=categories.map((cat,ci)=>{
 const y=74+ci*56;
 let x=196;
 const pills=cat.items.map((name,ni)=>{
  const color=palette[name]||colors[ni%colors.length];
  const w=pillWidth(name);
  const px=x;x+=w+10;
  return `<rect x="${px}" y="${y-16}" width="${w}" height="32" rx="16" fill="${color}" fill-opacity=".13" stroke="${color}" stroke-opacity=".45"/><text x="${px+w/2}" y="${y+5}" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#E8E2D4">${esc(name)}</text>`;
 }).join('');
 return `<text x="40" y="${y+5}" font-family="Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="0.6" fill="#D7BD78">${esc(cat.title.toUpperCase())}</text>${pills}`;
}).join('');
const stackH=88+categories.length*56;
const stackSvg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${stackH}" viewBox="0 0 1200 ${stackH}" role="img">
<rect x="0.75" y="0.75" width="1198.5" height="${stackH-1.5}" rx="16" fill="#14241C" stroke="#6F8F72" stroke-opacity=".38"/>
<text x="40" y="36" font-family="Arial,sans-serif" font-size="12" font-weight="700" letter-spacing="2.2" fill="#C58E6A">03  /  TOOLKIT</text>
<text x="1160" y="36" text-anchor="end" font-family="Arial,sans-serif" font-size="12" fill="#8FA08E">From public repositories</text>
<path d="M40 50H260" stroke="#C58E6A" stroke-opacity=".45" stroke-width="1.4"/>
${stackRows}
</svg>`;

// Snapshot
const metricItems=[
 {value:repos.length,label:'PUBLIC',color:'#C58E6A'},
 {value:featured.length,label:'FEATURED',color:'#91B8A8'},
 {value:meaningfulLangs.length,label:'LANGUAGES',color:'#7FA88A'},
 {value:stars,label:'STARS',color:'#D7BD78'},
 {value:followers,label:'FOLLOWERS',color:'#A8899C'}
];
const metricsSvg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="132" viewBox="0 0 1200 132" role="img">
<rect x="0.75" y="0.75" width="1198.5" height="130.5" rx="16" fill="#14241C" stroke="#6F8F72" stroke-opacity=".38"/>
<text x="40" y="34" font-family="Arial,sans-serif" font-size="12" font-weight="700" letter-spacing="2.2" fill="#C58E6A">04  /  SNAPSHOT</text>
<text x="1160" y="34" text-anchor="end" font-family="Arial,sans-serif" font-size="12" fill="#8FA08E">Public GitHub data</text>
${metricItems.map((m,i)=>{
 const x=120+i*220;
 return `<text x="${x}" y="82" text-anchor="middle" font-family="Georgia,serif" font-size="34" font-weight="700" fill="#F1EBDD">${m.value}</text>
<text x="${x}" y="108" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" letter-spacing="1.6" fill="${m.color}">${m.label}</text>
${i<metricItems.length-1?`<path d="M${x+110} 58V112" stroke="#6F8F72" stroke-opacity=".28"/>`:''}`;
}).join('')}
</svg>`;

// Footer CTA
const footerCta=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="100" viewBox="0 0 1200 100" role="img">
<rect x="0.75" y="0.75" width="1198.5" height="98.5" rx="16" fill="#14241C" stroke="#6F8F72" stroke-opacity=".42"/>
<rect x="0.75" y="20" width="4" height="60" rx="2" fill="#C58E6A"/>
<text x="36" y="38" font-family="Arial,sans-serif" font-size="12" font-weight="700" letter-spacing="2.2" fill="#C58E6A">REPOSITORIES</text>
<text x="36" y="70" font-family="Georgia,serif" font-size="24" fill="#F1EBDD">Browse all public work</text>
<text x="340" y="70" font-family="Arial,sans-serif" font-size="14" fill="#9AAB98">${featured.length} featured · ${repos.length} public</text>
<circle cx="1136" cy="50" r="22" fill="none" stroke="#7FA88A" stroke-opacity=".5"/>
<path d="M1126 50H1144M1136 42L1146 50 1136 58" fill="none" stroke="#D7BD78" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// Nature hero (falling-leaf markers preserved for GIF)
const brandName=esc(profile.name||'StarLord');
const seedDots=Array.from({length:36},(_,i)=>{
 const x=(i*149.7)%1140+30,y=(i*83.1)%400+30,r=i%6===0?1.8:0.9;
 const fill=i%4===0?'#D7BD78':(i%3===0?'#A8C4A4':'#C5D0C0');
 return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${fill}" opacity="${(0.1+(i%3)*0.06).toFixed(2)}"/>`;
}).join('');
const fallFills=['#7FA88A','#A6B39B','#C58E6A','#D7BD78','#8EA68C','#B7A17A'];
const fallLeaf=fill=>`<path d="M0-20C-8-5-9 7 0 20 9 7 8-5 0-20Z" fill="${fill}"/><path d="M0-16V14" stroke="#F1EBDD" stroke-opacity=".4" stroke-width="1"/>`;
const fallingLeaves=Array.from({length:12},(_,i)=>{
 const x=60+i*52+(i%2)*12;
 const yStart=-36-(i%4)*18;
 const s=(0.52+(i%4)*0.07).toFixed(2);
 const rot=-22+(i%7)*7;
 const phase=((i*0.071)%1).toFixed(3);
 const drift=(4+(i%3)*3)*(i%2===0?1:-1);
 const spin=(10+(i%4)*3)*(i%2===0?1:-1);
 return `<g data-fall="1" data-x0="${x}" data-y0="${yStart}" data-rot0="${rot}" data-scale="${s}" data-phase="${phase}" data-drift="${drift}" data-spin="${spin}" opacity="0.82" transform="translate(${x} ${yStart}) rotate(${rot}) scale(${s})">${fallLeaf(fallFills[i%fallFills.length])}</g>`;
}).join('');
const groundFerns=Array.from({length:8},(_,i)=>{
 const x=90+i*130,y=428+(i%2)*6;
 return `<g transform="translate(${x} ${y})" opacity=".42"><path d="M0 0C-5-24 3-42 0-62" fill="none" stroke="#7FA88A" stroke-width="1.4"/><path d="M0-16C-14-20-18-10-6-8M0-32C14-36 18-26 6-22M0-48C-12-52-16-42-4-40" fill="none" stroke="#A8C4A4" stroke-width="1.2"/></g>`;
}).join('');

const hero=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="440" viewBox="0 0 1200 440" role="img" aria-labelledby="heroTitle">
<title id="heroTitle">StarLord — Cedar &amp; Stone</title>
<defs>
 <linearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0C1611"/><stop offset=".45" stop-color="#15241C"/><stop offset="1" stop-color="#0F221C"/></linearGradient>
 <radialGradient id="dawnGlow" cx="16%" cy="26%" r="40%"><stop stop-color="#D4A574" stop-opacity=".18"/><stop offset=".65" stop-color="#C58E6A" stop-opacity=".06"/><stop offset="1" stop-color="#0C1611" stop-opacity="0"/></radialGradient>
 <radialGradient id="mossGlow" cx="90%" cy="40%" r="34%"><stop stop-color="#5F8F6E" stop-opacity=".22"/><stop offset="1" stop-color="#0C1611" stop-opacity="0"/></radialGradient>
 <linearGradient id="mistSoft" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#C5D6C4" stop-opacity="0"/><stop offset="1" stop-color="#C5D6C4" stop-opacity=".08"/></linearGradient>
 <linearGradient id="heroEdge"><stop stop-color="#C58E6A"/><stop offset=".5" stop-color="#7FA88A"/><stop offset="1" stop-color="#86AAA2"/></linearGradient>
 <linearGradient id="sunCore"><stop stop-color="#F1EBDD"/><stop offset="1" stop-color="#D7BD78"/></linearGradient>
</defs>
<rect width="1200" height="440" rx="22" fill="url(#heroBg)"/>
<rect width="1200" height="440" rx="22" fill="url(#dawnGlow)"/>
<rect width="1200" height="440" rx="22" fill="url(#mossGlow)"/>
<rect width="1200" height="440" rx="22" fill="url(#mistSoft)"/>
<g id="falling-leaves" opacity=".74">${fallingLeaves}</g>
<g>${seedDots}</g>
${groundFerns}
<path d="M0 360Q200 328 400 362T800 348T1200 368" fill="none" stroke="#7FA88A" stroke-opacity=".18" stroke-width="1.3"/>
<path d="M0 378Q240 348 480 380T960 360T1200 384" fill="none" stroke="#C58E6A" stroke-opacity=".12" stroke-width="1.1"/>
<g transform="translate(920 210)">
 <circle r="104" fill="none" stroke="#7FA88A" stroke-opacity=".14" stroke-width="1.1"/>
 <circle r="78" fill="#5F8F6E" fill-opacity=".09" stroke="#A8C4A4" stroke-opacity=".35"/>
 <circle r="50" fill="url(#sunCore)" fill-opacity=".92"/>
 <circle r="60" fill="none" stroke="#E5D9BD" stroke-opacity=".18"/>
 <g data-leaf="sage" data-px="-4" data-py="-8" transform="rotate(0 -4 -8)">
  <path d="M-4-8C-42-70-30-108 10-126 30-76 18-38-4-8Z" fill="#7FA88A" fill-opacity=".88" stroke="#C5D6C4" stroke-width="1.4"/>
  <path d="M-4-8L8-105" stroke="#EDE7D8" stroke-opacity=".7" stroke-width="1.8"/>
 </g>
 <g data-leaf="copper" data-px="-4" data-py="-8" transform="rotate(0 -4 -8)">
  <path d="M-4-8C-62-22-92 4-88 48-44 52-14 30-4-8Z" fill="#C58E6A" fill-opacity=".88" stroke="#E0B18C" stroke-width="1.4"/>
  <path d="M-4-8L-70 30" stroke="#EDE7D8" stroke-opacity=".7" stroke-width="1.8"/>
 </g>
 <g data-leaf="gold" data-px="16" data-py="-18" transform="rotate(0 16 -18)">
  <path d="M16-18C42-60 76-68 102-50 68-26 36-16 16-18Z" fill="#D7BD78" fill-opacity=".82" stroke="#EDE7D8" stroke-width="1.2"/>
  <path d="M16-18L82-48" stroke="#F1EBDD" stroke-opacity=".6" stroke-width="1.4"/>
 </g>
 <g data-leaf="moss" data-px="-18" data-py="10" transform="rotate(0 -18 10)">
  <path d="M-18 10C-60 6-86 36-76 72-36 62-18 36-18 10Z" fill="#5F8F6E" fill-opacity=".8" stroke="#A8C4A4" stroke-width="1.2"/>
  <path d="M-18 10L-66 50" stroke="#EDE7D8" stroke-opacity=".5" stroke-width="1.3"/>
 </g>
</g>
<g>
 <text x="64" y="64" font-family="Arial,sans-serif" font-size="12" letter-spacing="3.8" fill="#C5BDA8">CEDAR &amp; STONE  ·  ${new Date().getUTCFullYear()}</text>
 <text x="60" y="156" font-family="Georgia,Times New Roman,serif" font-size="78" font-weight="700" fill="#F1EBDD">${brandName}</text>
 <path d="M66 180H188" stroke="#C58E6A" stroke-width="2.8"/>
 <text x="64" y="222" font-family="Georgia,Times New Roman,serif" font-size="22" fill="#E4E1D4">Software grown from real problems.</text>
 <text x="64" y="266" font-family="Arial,sans-serif" font-size="14" letter-spacing="1.5" fill="#AFC0B0">STUDENT DEVELOPER  ·  HYDERABAD  ·  BUILDING IN PUBLIC</text>
</g>
<rect x="12" y="12" width="1176" height="416" rx="16" fill="none" stroke="url(#heroEdge)" stroke-opacity=".55" stroke-width="1.4"/>
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
'<img src="./assets/tech-stack-v2.svg" width="100%" alt="Toolkit — languages, platforms and domains from public code"/>',
'',
'<a id="snapshot"></a>',
'<img src="./assets/profile-metrics.svg" width="100%" alt="GitHub snapshot: public projects, featured work, languages, stars and followers"/>',
'',
`<p align="center"><sub>${featured.length} featured · ${repos.length} public projects · Android, tools, security and community.</sub></p>`,
'',
`<p align="center"><a href="https://github.com/${username}?tab=repositories"><img src="./assets/portfolio-footer.svg" width="100%" alt="Browse all public repositories"/></a></p>`,
'',
'<p align="center"><sub>Refreshed from public GitHub data · Private repositories stay private</sub></p>',
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
await write('assets/solar-data.json',JSON.stringify({
 username,
 theme:'cedar-stone',
 profile:{login:profile.login,name:profile.name,avatar_url:profile.avatar_url,followers:followers,public_repos:profile.public_repos},
 featuredRepositories:featured.map(mapRepo),
 publicRepositories:repos.map(mapRepo),
 languages:allLangs,
 totalStars:stars
},null,2));
console.log(`Cedar & Stone profile: ${featured.length} featured / ${moreWork.length} secondary / ${repos.length} public / ${allLangs.length} languages${offline?' (offline cache)':''}.`);
async function write(path,content){await fs.mkdir(path.split('/').slice(0,-1).join('/')||'.',{recursive:true});await fs.writeFile(path,content);}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
