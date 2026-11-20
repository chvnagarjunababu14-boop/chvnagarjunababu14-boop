// Cedar & Stone — pure-nature editorial portfolio. Public repository data only.
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
}

const langs=allLangs.slice(0,8);
const totals=Object.fromEntries(allLangs);
const palette={TypeScript:'#7FA88A',JavaScript:'#D7BD78',Python:'#6F9EAE',Java:'#D3A16F',Rust:'#C98260',Kotlin:'#A8899C',CSS:'#8C9BB0',HTML:'#CE9277',Go:'#85ADA6',C:'#9AA39A','C++':'#C88791',PHP:'#9B91B5',Shell:'#A6B18D',SQL:'#C49D69',PLpgSQL:'#A7B18D'};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const stars=repos.reduce((n,r)=>n+r.stargazers_count,0);
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const featuredPriority=['safeher','knox','store-point','devcatalyst-community-crm'];
const ranked=[...repos].sort((a,b)=>(b.stargazers_count-a.stargazers_count)||new Date(b.updated_at)-new Date(a.updated_at));
const featured=[];
for(const key of featuredPriority){const hit=ranked.find(r=>slug(r.name)===key);if(hit)featured.push(hit);}
for(const r of ranked){if(featured.length>=4)break;if(!featured.includes(r))featured.push(r);}
const moreWork=ranked.filter(r=>!featured.includes(r));
const colors=['#C58E6A','#7FA88A','#D7BD78','#A6B39B','#88A9A4','#BE8E89','#B7A17A'];
const cardBgs=['#14241C','#15241F','#1A261C','#162820','#172A24','#221F1A','#1C241C'];
const projectSummaries={
 'safeher':'Privacy-first Android safety app with emergency SOS, check-ins and trusted guardian alerts.',
 'knox':'Rust-based knowledge graph preserving project decisions and context for AI coding agents.',
 'store-point':'Offline-first retail POS with barcode checkout, inventory and multi-branch analytics.',
 'devcatalyst-community-crm':'Student-club CRM for projects, events, recruitment and member directory.',
 'quantumshield-india':'Early learning site for cybersecurity and quantum tech, with lessons and a sample quiz.',
 'feed-hyderabad':'Location-based platform connecting restaurants with surplus food to nearby NGOs.',
 'fresh-circle':'FreshLink matches nearby produce vendors and buyers, with stock and surplus discounts.'
};
const projectNames={'safeher':'SafeHer-Next','store-point':'StorePoint','devcatalyst-community-crm':'DevCatalyst CRM','quantumshield-india':'QuantumShield India','feed-hyderabad':'Feed Hyderabad','fresh-circle':'FreshLink'};
const projectTags={'knox':'Rust / Tauri','safeher':'Kotlin','store-point':'TypeScript','devcatalyst-community-crm':'TypeScript','quantumshield-india':'TypeScript / Python','fresh-circle':'TypeScript','feed-hyderabad':'TypeScript'};

const leafMark=(fill,stroke)=>`<path d="M0-36C-18-8-20 14 0 36 20 14 18-8 0-36Z" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>`;
const tinyLeaf=(x,y,rot,fill,op=0.55)=>`<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0-14C-8-2-8 8 0 16 8 8 8-2 0-14Z" fill="${fill}" opacity="${op}"/></g>`;

const projectArts=featured.map((r,i)=>{
 const color=colors[i%colors.length],langColor=palette[r.language]||color,bg=cardBgs[i%cardBgs.length];
 const labelName=projectNames[slug(r.name)]||r.name;const rawName=labelName.length>25?labelName.slice(0,24)+'…':labelName,displayName=esc(rawName),titleSize=Math.min(42,Math.max(30,540/(rawName.length*.56)));
 const summary=projectSummaries[slug(r.name)]||r.description||('A '+(r.language||'software')+' project from my public repositories.');
 const words=String(summary).split(/\s+/),lines=[];let line='';
 for(const word of words){if(line&&(line+' '+word).length>38){lines.push(line);line=word;}else line=(line+' '+word).trim();}
 if(line)lines.push(line);
 const visibleLines=lines.slice(0,3);if(lines.length>3)visibleLines[2]=visibleLines[2].replace(/[.,;:]?$/,'')+'…';
 const descSvg=visibleLines.map((line,j)=>'<tspan x="48" dy="'+(j===0?0:24)+'">'+esc(line)+'</tspan>').join('');
 const lang=esc(projectTags[slug(r.name)]||r.language||'Multi-stack'),updated=new Date(r.updated_at).toISOString().slice(0,10),repoStars=r.stargazers_count;
 const keyword=(r.name+' '+summary).toLowerCase();
 const motif=keyword.includes('safe')?
 '<g transform="translate(685 158)"><circle r="112" fill="none" stroke="'+color+'" stroke-opacity=".18" stroke-width="1.5"/><path d="M0-84L66-58V8C66 52 29 85 0 102-29 85-66 52-66 8V-58Z" fill="'+color+'" fill-opacity=".13" stroke="'+color+'" stroke-width="3"/><path d="M-28 0L-8 20 35-28" fill="none" stroke="#F1EBDD" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></g>'
 :keyword.includes('feed')||keyword.includes('food')||keyword.includes('hyderabad')?
 '<g transform="translate(685 162)"><path d="M-94-15H94L72 84H-72Z" fill="'+color+'" fill-opacity=".10" stroke="'+color+'" stroke-width="3"/><path d="M-62-15L-31-74H31L62-15" fill="none" stroke="'+color+'" stroke-width="5"/><path d="M0-100C-25-67-27-49 0-37 27-49 25-67 0-100Z" fill="'+color+'"/></g>'
 :keyword.includes('fresh')||keyword.includes('produce')||keyword.includes('circle')?
 '<g transform="translate(685 165)"><circle r="106" fill="none" stroke="'+color+'" stroke-opacity=".25"/><path d="M-5 88C-17 5 10-55 82-91 89-17 57 48-5 88Z" fill="'+color+'" fill-opacity=".35" stroke="'+color+'" stroke-width="3"/><path d="M-5 88C-76 67-105 11-88-55-26-45 13 0-5 88Z" fill="'+langColor+'" fill-opacity=".30" stroke="'+langColor+'" stroke-width="3"/></g>'
 :keyword.includes('store')||keyword.includes('retail')||keyword.includes('inventory')?
 '<g transform="translate(685 165)"><path d="M-104-48L-78-93H78L104-48V-24H-104Z" fill="'+color+'" fill-opacity=".16" stroke="'+color+'" stroke-width="3"/><rect x="-83" y="-24" width="166" height="116" rx="10" fill="'+color+'" fill-opacity=".08" stroke="'+color+'" stroke-width="3"/></g>'
 :keyword.includes('quantum')||keyword.includes('cyber')?
 '<g transform="translate(685 165)"><rect x="-72" y="-72" width="144" height="144" rx="22" fill="'+color+'" fill-opacity=".10" stroke="'+color+'" stroke-width="3"/><g fill="none" stroke="'+langColor+'" stroke-width="4"><ellipse rx="56" ry="24" transform="rotate(35)"/><ellipse rx="56" ry="24" transform="rotate(-35)"/></g><circle r="12" fill="#EDE7D8"/></g>'
 :keyword.includes('crm')||keyword.includes('community')||keyword.includes('catalyst')?
 '<g transform="translate(685 162)"><circle cx="-45" cy="-35" r="25" fill="'+color+'"/><circle cx="45" cy="-35" r="25" fill="'+langColor+'"/><circle cy="-65" r="28" fill="#E9E4D7"/><path d="M-90 78V43C-90 12-65 0-45 0S0 12 0 43V78ZM0 78V43C0 12 25 0 45 0S90 12 90 43V78Z" fill="'+color+'" fill-opacity=".16" stroke="'+color+'" stroke-width="3"/></g>'
 :keyword.includes('knox')||keyword.includes('rust')||keyword.includes('desktop')?
 '<g transform="translate(685 164)"><g stroke="'+color+'" stroke-width="4" fill="none"><path d="M-82-50L0-84 80-38 67 54 0 85-75 45Z"/><path d="M-82-50L-18 0 80-38M-18 0L67 54M-18 0L0 85"/></g><circle cx="-18" cy="0" r="19" fill="'+langColor+'" stroke="#EDE7D8" stroke-width="2"/></g>'
 :'<g transform="translate(685 164)"><circle r="104" fill="none" stroke="'+color+'" stroke-opacity=".35"/><path d="M-58-10L0-76 58-10 0 76Z" fill="'+color+'" fill-opacity=".16" stroke="'+color+'" stroke-width="3"/><circle r="17" fill="#EDE7D8"/></g>';
 const gid='c'+i;
 const art=`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="320" viewBox="0 0 900 320"><defs><linearGradient id="${gid}Bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${bg}"/><stop offset="1" stop-color="${color}" stop-opacity=".22"/></linearGradient><linearGradient id="${gid}Line" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${color}" stop-opacity=".85"/><stop offset="1" stop-color="#D7BD78" stop-opacity=".4"/></linearGradient></defs><rect width="900" height="320" rx="22" fill="url(#${gid}Bg)"/><rect x="8" y="8" width="884" height="304" rx="16" fill="none" stroke="#D9D2C2" stroke-opacity=".16"/><path d="M0 276Q220 236 440 278T900 252" fill="none" stroke="url(#${gid}Line)" stroke-opacity=".28" stroke-width="1.6"/>${tinyLeaf(820,40,-28,color,0.35)}${tinyLeaf(848,62,18,'#7FA88A',0.4)}<path d="M48 52H112" stroke="${color}" stroke-width="3"/><text x="48" y="40" font-family="Georgia,serif" font-size="16" letter-spacing="2.2" fill="${color}">${lang.toUpperCase()}  /  SELECTED WORK</text><text x="48" y="119" font-family="Georgia,Times New Roman,serif" font-size="${titleSize}" font-weight="700" fill="#F1EBDD">${displayName}</text><text x="48" y="148" font-family="Arial,sans-serif" font-size="24" fill="#C5CEC1">${descSvg}</text><rect x="48" y="226" width="180" height="36" rx="17" fill="${langColor}" fill-opacity=".15" stroke="${langColor}" stroke-opacity=".6"/><text x="138" y="249" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#EDE7D8">${lang}</text><text x="48" y="286" font-family="Consolas,monospace" font-size="15" letter-spacing=".5" fill="#AEBBAA">★ ${repoStars}   ·   UPDATED ${updated}</text>${motif}<text x="850" y="296" text-anchor="end" font-family="Arial,sans-serif" font-size="12" letter-spacing="1.5" fill="${color}">VIEW PROJECT ↗</text></svg>`;
 return {r,i,color,art};
});
const projectCards=projectArts.map(p=>{const label=projectNames[slug(p.r.name)]||p.r.name;return '<a href="'+p.r.html_url+'"><img src="./assets/projects/'+slug(p.r.name)+'.svg" width="100%" alt="'+esc(label)+' project card"/></a>'}).reduce((a,x,i)=>{if(i%2===0)a.push([x]);else a[a.length-1].push(x);return a;},[]).map(row=>'<p align="center">'+row.map(x=>x.replace('width="100%"','width="47%"')).join(' &nbsp; ')+'</p>').join('\n');
const moreWorkLine=moreWork.length
 ? '<p align="center"><sub>Also growing: '+moreWork.map(r=>{const label=projectNames[slug(r.name)]||r.name;return '<a href="'+r.html_url+'">'+esc(label)+'</a>';}).join(' · ')+'</sub></p>'
 : '';

const navItems=[
 {id:'about',number:'01',label:'ABOUT',color:'#C58E6A'},
 {id:'snapshot',number:'02',label:'SNAPSHOT',color:'#7FA88A'},
 {id:'toolkit',number:'03',label:'TOOLKIT',color:'#D7BD78'},
 {id:'selected-work',number:'04',label:'SELECTED WORK',color:'#91B8A8'}
];
const navSvgs=navItems.map(item=>({...item,svg:`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="72" viewBox="0 0 300 72"><defs><linearGradient id="n${item.id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#14241C"/><stop offset="1" stop-color="#1A2E24"/></linearGradient></defs><rect x="1" y="1" width="298" height="70" rx="14" fill="url(#n${item.id})" stroke="#6F8F72" stroke-opacity=".55" stroke-width="1.5"/><rect x="1" y="14" width="5" height="44" rx="2.5" fill="${item.color}"/>${tinyLeaf(268,18,-35,item.color,0.55)}<text x="22" y="28" font-family="Arial,sans-serif" font-size="11" font-weight="700" letter-spacing="2" fill="${item.color}">${item.number} / GROVE</text><text x="22" y="53" font-family="Georgia,serif" font-size="18" font-weight="700" letter-spacing=".6" fill="#F1EBDD">${item.label}</text></svg>`}));
const navCards=navSvgs.map(item=>'<a href="#'+item.id+'"><img src="./assets/nav-'+item.id+'.svg" width="22%" alt="'+item.number+' '+item.label+' section navigation"/></a>').join(' &nbsp; ');

const totalLanguageBytes=Object.values(totals).reduce((sum,n)=>sum+n,0)||1;
const metricItems=[
 {value:repos.length,label:'PUBLIC PROJECTS',symbol:'✳',color:'#C58E6A'},
 {value:stars,label:'TOTAL STARS',symbol:'★',color:'#D7BD78'},
 {value:allLangs.length,label:'LANGUAGES',symbol:'⌘',color:'#7FA88A'},
 {value:featured.length,label:'FEATURED WORK',symbol:'◎',color:'#A8899C'}
];
const metricsSvg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="178" viewBox="0 0 1200 178"><defs><linearGradient id="metricBg" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#14241C"/><stop offset=".5" stop-color="#1A2E24"/><stop offset="1" stop-color="#152820"/></linearGradient><linearGradient id="metricEdge"><stop stop-color="#C58E6A"/><stop offset=".5" stop-color="#7FA88A"/><stop offset="1" stop-color="#86AAA2"/></linearGradient></defs><rect x="5" y="5" width="1190" height="168" rx="20" fill="url(#metricBg)" stroke="url(#metricEdge)" stroke-opacity=".5" stroke-width="1.5"/>${tinyLeaf(1120,28,-20,'#7FA88A',0.45)}${tinyLeaf(1150,48,30,'#C58E6A',0.4)}<text x="32" y="31" font-family="Arial,sans-serif" font-size="12" font-weight="700" letter-spacing="2.2" fill="#C58E6A">02 / PROFILE AT A GLANCE</text><text x="1165" y="31" text-anchor="end" font-family="Consolas,monospace" font-size="11" letter-spacing="1" fill="#93A492">LIVING GARDEN · PUBLIC DATA</text>${metricItems.map((m,i)=>{const x=150+i*300;return (i?`<path d="M${i*300} 65V150" stroke="#B8C1B1" stroke-opacity=".16"/>`:'')+`<circle cx="${x-51}" cy="108" r="25" fill="${m.color}" fill-opacity=".12" stroke="${m.color}" stroke-opacity=".55"/><text x="${x-51}" y="116" text-anchor="middle" font-family="Georgia,serif" font-size="25" fill="${m.color}">${m.symbol}</text><text x="${x-10}" y="114" font-family="Georgia,serif" font-size="36" font-weight="700" fill="#F1EBDD">${m.value}</text><text x="${x-10}" y="139" font-family="Arial,sans-serif" font-size="11" letter-spacing="1.7" fill="#AAB8A8">${m.label}</text>`;}).join('')}</svg>`;

const stackItems=langs.map(([name,bytes],i)=>{const color=palette[name]||['#C58E6A','#7FA88A','#D7BD78','#A8899C'][i%4];const pct=totalLanguageBytes?bytes/totalLanguageBytes*100:0;const label=pct>0&&pct<1?'<1%':Math.round(pct)+'%';return {name,color,pct,label};});
const maxPct=Math.max(1,...stackItems.map(x=>x.pct));
const stackSvg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="232" viewBox="0 0 1200 232"><defs><linearGradient id="stackPanel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#14241C"/><stop offset="1" stop-color="#172A24"/></linearGradient><linearGradient id="stackEdge"><stop stop-color="#C58E6A"/><stop offset="1" stop-color="#7FA88A"/></linearGradient></defs><rect x="5" y="5" width="1190" height="222" rx="20" fill="url(#stackPanel)" stroke="url(#stackEdge)" stroke-opacity=".4"/><text x="32" y="39" font-family="Georgia,serif" font-size="18" font-weight="700" letter-spacing="1.3" fill="#C58E6A">03 / TOOLS &amp; LANGUAGES</text><text x="1165" y="38" text-anchor="end" font-family="Consolas,monospace" font-size="11" letter-spacing="1" fill="#93A492">TOP 8 · SHARE OF PUBLIC CODE</text>${stackItems.map((item,i)=>{const col=i%4,row=Math.floor(i/4),x=24+col*294,y=64+row*80,w=280;const bar=Math.max(item.pct>0?3:0,190*item.pct/maxPct);return `<rect x="${x}" y="${y}" width="${w}" height="66" rx="12" fill="#0E1A15" stroke="#A9B7A5" stroke-opacity=".18"/><rect x="${x}" y="${y}" width="3" height="66" rx="1.5" fill="${item.color}"/><circle cx="${x+23}" cy="${y+24}" r="4" fill="${item.color}"/><text x="${x+37}" y="${y+29}" font-family="Arial,sans-serif" font-size="15" font-weight="600" fill="#EDE8DA">${esc(item.name)}</text><text x="${x+w-13}" y="${y+28}" text-anchor="end" font-family="Consolas,monospace" font-size="12" fill="${item.color}">${esc(item.label)}</text><rect x="${x+17}" y="${y+46}" width="246" height="4" rx="2" fill="#2A3B32"/><rect x="${x+17}" y="${y+46}" width="${Math.min(246,bar)}" height="4" rx="2" fill="${item.color}"/>`;}).join('')}</svg>`;

// --- Nature hero: mist, canopy, swaying leaves ---
const brandName=esc(profile.name||'StarLord');
const seedDots=Array.from({length:56},(_,i)=>{
 const x=(i*137.3)%1160+20,y=(i*71.9)%440+20,r=i%7===0?2.2:1;
 const fill=i%5===0?'#D7BD78':(i%3===0?'#A8C4A4':'#D6DCCB');
 return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${fill}" opacity="${(0.12+(i%4)*0.07).toFixed(2)}"/>`;
}).join('');
const canopy=Array.from({length:18},(_,i)=>{
 const x=40+i*64,y=18+(i%3)*10,s=0.55+(i%4)*0.12,rot=-40+i*11;
 const fill=['#5F8F6E','#7FA88A','#8EA68C','#A6B39B'][i%4];
 return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s.toFixed(2)})">${leafMark(fill,'#C5D6C4')}</g>`;
}).join('');
const groundFerns=Array.from({length:10},(_,i)=>{
 const x=70+i*110,y=430+(i%2)*8;
 return `<g transform="translate(${x} ${y})" opacity=".55"><path d="M0 0C-6-28 4-48 0-72" fill="none" stroke="#7FA88A" stroke-width="1.6"/><path d="M0-18C-16-22-22-12-8-8M0-36C16-40 22-28 8-24M0-54C-14-58-18-48-6-44" fill="none" stroke="#A8C4A4" stroke-width="1.3"/></g>`;
}).join('');

const hero=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="480" viewBox="0 0 1200 480" role="img" aria-labelledby="heroTitle">
<title id="heroTitle">StarLord — Cedar &amp; Stone nature banner</title>
<defs>
 <linearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0C1611"/><stop offset=".4" stop-color="#15241C"/><stop offset="1" stop-color="#0F221C"/></linearGradient>
 <radialGradient id="dawnGlow" cx="22%" cy="30%" r="48%"><stop stop-color="#D4A574" stop-opacity=".38"/><stop offset=".55" stop-color="#C58E6A" stop-opacity=".12"/><stop offset="1" stop-color="#0C1611" stop-opacity="0"/></radialGradient>
 <radialGradient id="mossGlow" cx="82%" cy="55%" r="42%"><stop stop-color="#5F8F6E" stop-opacity=".34"/><stop offset="1" stop-color="#0C1611" stop-opacity="0"/></radialGradient>
 <radialGradient id="mistSoft" cx="50%" cy="80%" r="55%"><stop stop-color="#C5D6C4" stop-opacity=".10"/><stop offset="1" stop-color="#0C1611" stop-opacity="0"/></radialGradient>
 <linearGradient id="heroEdge"><stop stop-color="#C58E6A"/><stop offset=".45" stop-color="#7FA88A"/><stop offset="1" stop-color="#86AAA2"/></linearGradient>
 <linearGradient id="sunCore"><stop stop-color="#F1EBDD"/><stop offset="1" stop-color="#D7BD78"/></linearGradient>
</defs>
<rect width="1200" height="480" rx="28" fill="url(#heroBg)"/>
<rect width="1200" height="480" rx="28" fill="url(#dawnGlow)"/>
<rect width="1200" height="480" rx="28" fill="url(#mossGlow)"/>
<rect width="1200" height="480" rx="28" fill="url(#mistSoft)"/>
<g opacity=".7">${canopy}</g>
<g>${seedDots}</g>
${groundFerns}
<path d="M0 390Q180 350 360 392T720 370T1200 400" fill="none" stroke="#7FA88A" stroke-opacity=".2" stroke-width="1.5"/>
<path d="M0 410Q220 375 440 412T880 388T1200 418" fill="none" stroke="#C58E6A" stroke-opacity=".14" stroke-width="1.2"/>

<!-- Nature grove emblem -->
<g transform="translate(900 230)">
 <circle r="176" fill="none" stroke="#7FA88A" stroke-opacity=".18" stroke-width="1.4"/>
 <circle r="138" fill="none" stroke="#C58E6A" stroke-opacity=".32" stroke-width="1.5"/>
 <circle r="96" fill="#5F8F6E" fill-opacity=".10" stroke="#A8C4A4" stroke-opacity=".45"/>
 <circle r="58" fill="url(#sunCore)" fill-opacity=".92"/>
 <circle r="72" fill="none" stroke="#E5D9BD" stroke-opacity=".28"/>

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
 <circle cx="128" cy="-118" r="6" fill="#D7BD78"/>
 <circle cx="-148" cy="82" r="5" fill="#A8899C"/>
 <circle cx="96" cy="108" r="4" fill="#7FA88A"/>
</g>

<g>
 <text x="72" y="72" font-family="Arial,sans-serif" font-size="13" letter-spacing="4.5" fill="#C5BDA8">CEDAR &amp; STONE  ·  ${new Date().getUTCFullYear()}</text>
 <text x="68" y="168" font-family="Georgia,Times New Roman,serif" font-size="86" font-weight="700" fill="#F1EBDD">${brandName}</text>
 <path d="M74 196H210" stroke="#C58E6A" stroke-width="3.2"/>
 <text x="72" y="244" font-family="Georgia,Times New Roman,serif" font-size="26" fill="#E4E1D4">Grown from real problems into living software.</text>
 <text x="74" y="292" font-family="Arial,sans-serif" font-size="16" letter-spacing="1.4" fill="#AFC0B0">STUDENT DEVELOPER  ·  HYDERABAD  ·  BUILDING IN THE OPEN</text>
 <g transform="translate(74 360)" opacity=".9">${leafMark('#7FA88A','#C5D6C4')}<g transform="translate(28 6) rotate(55) scale(.7)">${leafMark('#C58E6A','#E0B18C')}</g><g transform="translate(52 2) rotate(-40) scale(.55)">${leafMark('#D7BD78','#EDE7D8')}</g></g>
 <text x="150" y="372" font-family="Consolas,monospace" font-size="12" letter-spacing="2.4" fill="#A6B39F">BUILD THOUGHTFULLY  /  KEEP GROWING</text>
</g>
<rect x="16" y="16" width="1168" height="448" rx="22" fill="none" stroke="url(#heroEdge)" stroke-opacity=".62" stroke-width="1.6"/>
</svg>`;

const aboutHeader=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="190" viewBox="0 0 1200 190" role="img">
<defs>
 <linearGradient id="aboutBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#14241C"/><stop offset="1" stop-color="#1A2E24"/></linearGradient>
 <linearGradient id="aboutRule" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#C58E6A"/><stop offset=".55" stop-color="#7FA88A"/><stop offset="1" stop-color="#7FA88A" stop-opacity="0"/></linearGradient>
</defs>
<rect width="1200" height="190" rx="20" fill="url(#aboutBg)"/>
<rect x=".5" y=".5" width="1199" height="189" rx="19.5" fill="none" stroke="#6F8F72" stroke-opacity=".45"/>
${tinyLeaf(1080,40,-25,'#7FA88A',0.5)}${tinyLeaf(1115,58,40,'#C58E6A',0.45)}${tinyLeaf(1145,36,-10,'#D7BD78',0.4)}
<text x="48" y="48" font-family="Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="2.8" fill="#C58E6A">01 / A LITTLE ABOUT ME</text>
<path d="M48 68H320" stroke="url(#aboutRule)" stroke-width="2"/>
<text x="48" y="120" font-family="Georgia,serif" font-size="42" font-weight="700" fill="#F1EBDD">Roots, craft &amp; curiosity</text>
<text x="48" y="156" font-family="Arial,sans-serif" font-size="16" fill="#AFC0B0">Student · developer · builder · lifelong learner</text>
</svg>`;

const aboutDivider=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="28" viewBox="0 0 1200 28" role="img">
<defs><linearGradient id="divLine" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#C58E6A" stop-opacity="0"/><stop offset=".2" stop-color="#C58E6A"/><stop offset=".5" stop-color="#7FA88A"/><stop offset=".8" stop-color="#D7BD78"/><stop offset="1" stop-color="#D7BD78" stop-opacity="0"/></linearGradient></defs>
<rect x="40" y="13" width="1120" height="2" rx="1" fill="url(#divLine)"/>
<g transform="translate(600 14)">
 <path d="M0-9C-5-2-5 4 0 10 5 4 5-2 0-9Z" fill="#D7BD78"/>
 <path d="M-18-2C-26 2-26 8-18 12-12 6-12 2-18-2Z" fill="#7FA88A" opacity=".85"/>
 <path d="M18-2C26 2 26 8 18 12 12 6 12 2 18-2Z" fill="#C58E6A" opacity=".85"/>
</g>
</svg>`;

const aboutSignoff=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="88" viewBox="0 0 1200 88" role="img">
<defs><linearGradient id="signBg" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#14241C"/><stop offset="1" stop-color="#1A2E24"/></linearGradient></defs>
<rect width="1200" height="88" rx="16" fill="url(#signBg)" stroke="#6F8F72" stroke-opacity=".4"/>
${tinyLeaf(48,44,-30,'#7FA88A',0.7)}${tinyLeaf(72,48,25,'#C58E6A',0.65)}${tinyLeaf(94,42,-15,'#D7BD78',0.6)}
<text x="130" y="52" font-family="Georgia,serif" font-size="22" fill="#F1EBDD">Build thoughtfully. Experiment boldly. Keep growing.</text>
</svg>`;

const aboutSection=`<img src="./assets/about-header.svg" width="100%" alt="A Little About Me — roots, craft and curiosity"/>

<div align="left">
<p>Hey, I’m <strong>Venkata Nagarjuna Babu Chitturi</strong> — known online as <strong>StarLord</strong>. I’m a student developer focused on turning real problems into polished, usable software.</p>

<p>I spend most of my time on <strong>Android apps</strong>, <strong>full-stack web products</strong>, and <strong>developer tools</strong>. On the side I explore security, AI, and community platforms — always with a bias toward shipping something people can actually open and use.</p>

<img src="./assets/about-divider.svg" width="100%" alt="Cedar and Stone leaf divider"/>

<h3>Where I Focus</h3>
<p><strong>Android</strong> — privacy-minded mobile tools with clear UX.<br/>
<strong>Full-stack web</strong> — practical products for retail, food systems, and student communities.<br/>
<strong>Developer tools</strong> — workflows and agents that keep context while you build.</p>

<img src="./assets/about-divider.svg" width="100%" alt="Cedar and Stone leaf divider"/>

<h3>How I Work</h3>
<p>I learn by building in public: start with a sharp problem, ship an early version, then refine. Curious collaborators and hard feedback welcome.</p>

<img src="./assets/about-signoff.svg" width="100%" alt="Build thoughtfully. Experiment boldly. Keep growing."/>
</div>`;

const workHeader=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="176" viewBox="0 0 1200 176">
<defs>
<linearGradient id="workBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#14241C"/><stop offset="1" stop-color="#172A24"/></linearGradient>
<linearGradient id="workEdge"><stop stop-color="#C58E6A"/><stop offset=".55" stop-color="#7FA88A"/><stop offset="1" stop-color="#7FA88A" stop-opacity=".2"/></linearGradient>
</defs>
<rect x="1" y="1" width="1198" height="174" rx="20" fill="url(#workBg)" stroke="url(#workEdge)" stroke-opacity=".58" stroke-width="1.5"/>
<rect x="1" y="18" width="6" height="140" rx="3" fill="#B47D58"/>
${tinyLeaf(1090,40,-20,'#7FA88A',0.5)}${tinyLeaf(1125,56,35,'#C58E6A',0.45)}
<text x="42" y="45" font-family="Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="2.8" fill="#C58E6A">04 / THE THINGS I GROW</text>
<text x="42" y="101" font-family="Georgia,serif" font-size="44" font-weight="700" fill="#F1EBDD">Selected Work</text>
<text x="44" y="137" font-family="Arial,sans-serif" font-size="17" fill="#AFC0B0">Four projects that best show how I think and ship.</text>
<g transform="translate(980 95)" opacity=".85">
 <g transform="rotate(-25)">${leafMark('#7FA88A','#C5D6C4')}</g>
 <g transform="translate(34 8) rotate(40) scale(.85)">${leafMark('#C58E6A','#E0B18C')}</g>
 <g transform="translate(62 -4) rotate(-50) scale(.7)">${leafMark('#D7BD78','#EDE7D8')}</g>
</g>
</svg>`;

const footerCta=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="142" viewBox="0 0 1200 142" role="img">
<defs>
<linearGradient id="footerBg" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#14241C"/><stop offset=".55" stop-color="#1A2E24"/><stop offset="1" stop-color="#152820"/></linearGradient>
<linearGradient id="footerEdge"><stop stop-color="#B47D58"/><stop offset=".5" stop-color="#7FA88A"/><stop offset="1" stop-color="#7FA88A" stop-opacity=".35"/></linearGradient>
</defs>
<rect x="1" y="1" width="1198" height="140" rx="20" fill="url(#footerBg)" stroke="url(#footerEdge)" stroke-opacity=".62" stroke-width="1.5"/>
<rect x="1" y="18" width="6" height="106" rx="3" fill="#B47D58"/>
${tinyLeaf(1040,36,-25,'#7FA88A',0.5)}${tinyLeaf(1070,52,30,'#C58E6A',0.45)}
<text x="42" y="43" font-family="Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="2.8" fill="#C58E6A">05 / THE FULL GROVE</text>
<text x="42" y="91" font-family="Georgia,serif" font-size="37" font-weight="700" fill="#F1EBDD">Explore all repositories</text>
<text x="44" y="119" font-family="Arial,sans-serif" font-size="16" fill="#AFC0B0">Browse every public project, experiment and work in progress.</text>
<circle cx="1135" cy="71" r="34" fill="#7FA88A" fill-opacity=".1" stroke="#7FA88A" stroke-opacity=".55"/>
<path d="M1120 71H1148M1138 60L1149 71 1138 82" fill="none" stroke="#D7BD78" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const mapRepo=r=>({name:r.name,description:r.description,language:r.language,stars:r.stargazers_count,updated_at:r.updated_at,url:r.html_url});
const readme=[
'<div align="center">',
'<img src="./assets/profile-universe.gif" width="100%" alt="StarLord — Cedar & Stone nature banner with gently swaying leaves"/>',
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
'<p align="center"><sub>A living grove of public work · Automatically refreshed · Private repositories stay private</sub></p>',
'</div>'
].join('\n');

await write('README.md',readme);
await write('assets/profile-universe.svg',hero);
await write('assets/nebula-hero.svg',hero);
await write('assets/about-header.svg',aboutHeader);
await write('assets/about-divider.svg',aboutDivider);
await write('assets/about-signoff.svg',aboutSignoff);
await write('assets/profile-metrics.svg',metricsSvg);
await write('assets/tech-stack-v2.svg',stackSvg);
await write('assets/work-header.svg',workHeader);
await write('assets/portfolio-footer.svg',footerCta);
await Promise.all(navSvgs.map(item=>write('assets/nav-'+item.id+'.svg',item.svg)));
await Promise.all(projectArts.map(p=>write('assets/projects/'+slug(p.r.name)+'.svg',p.art)));
await write('assets/solar-data.json',JSON.stringify({
 username,
 theme:'cedar-stone-nature',
 profile:{login:profile.login,name:profile.name,avatar_url:profile.avatar_url,followers:profile.followers,public_repos:profile.public_repos},
 featuredRepositories:featured.map(mapRepo),
 publicRepositories:repos.map(mapRepo),
 languages:allLangs,
 totalStars:stars
},null,2));
console.log(`Cedar & Stone nature profile generated: ${featured.length} featured / ${repos.length} repos / ${langs.length} languages${offline?' (offline cache)':''}.`);
async function write(path,content){await fs.mkdir(path.split('/').slice(0,-1).join('/')||'.',{recursive:true});await fs.writeFile(path,content);}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
