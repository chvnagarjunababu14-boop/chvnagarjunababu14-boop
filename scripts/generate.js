// Cedar & Stone — editorial portfolio generator. Public repository data only.
async function main(){
const username=process.env.GITHUB_USERNAME||'chvnagarjunababu14-boop';
const headers={Accept:'application/vnd.github+json','User-Agent':'cedar-stone-profile'};
if(process.env.GITHUB_TOKEN)headers.Authorization='Bearer '+process.env.GITHUB_TOKEN;
async function api(url){const r=await fetch(url,{headers});if(!r.ok)throw new Error('GitHub API '+r.status+' at '+url);return r.json();}
const profile=await api('https://api.github.com/users/'+username);
const all=await api('https://api.github.com/users/'+username+'/repos?type=public&sort=updated&per_page=100');
const repos=all.filter(r=>!r.private&&!r.archived&&r.name.toLowerCase()!==username.toLowerCase()).slice(0,100);
const langmaps=await Promise.all(repos.map(r=>api(r.languages_url)));
const totals={};langmaps.forEach(m=>Object.entries(m).forEach(([k,v])=>totals[k]=(totals[k]||0)+v));
const allLangs=Object.entries(totals).sort((a,b)=>b[1]-a[1]);
const langs=allLangs.slice(0,8);
const palette={TypeScript:'#91B8A8',JavaScript:'#D7BD78',Python:'#83AABB',Java:'#D3A16F',Rust:'#C98260',Kotlin:'#B994A8',CSS:'#8C9BB0',HTML:'#CE9277',Go:'#85ADA6',C:'#9AA39A','C++':'#C88791',PHP:'#9B91B5',Ruby:'#B77E7A',Dart:'#82AFA9',Shell:'#A6B18D',SQL:'#C49D69',PLpgSQL:'#A7B18D',Swift:'#D18F72'};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const stars=repos.reduce((n,r)=>n+r.stargazers_count,0);
const featured=[...repos].sort((a,b)=>(b.stargazers_count-a.stargazers_count)||new Date(b.updated_at)-new Date(a.updated_at));
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const colors=['#C58E6A','#8FA99A','#D1B675','#A6B39B','#88A9A4','#BE8E89','#B7A17A'];
const cardBgs=['#17241F','#172326','#22251D','#1C2822','#192A2B','#29221F','#23271F'];
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
 '<g transform="translate(685 158)"><circle r="112" fill="none" stroke="'+color+'" stroke-opacity=".18" stroke-width="1.5"/><path d="M0-84L66-58V8C66 52 29 85 0 102-29 85-66 52-66 8V-58Z" fill="'+color+'" fill-opacity=".13" stroke="'+color+'" stroke-width="3"/><path d="M-28 0L-8 20 35-28" fill="none" stroke="#F1EBDD" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M-92 88Q0 126 92 88" fill="none" stroke="'+color+'" stroke-opacity=".35"/></g>'
 :keyword.includes('feed')||keyword.includes('food')||keyword.includes('hyderabad')?
 '<g transform="translate(685 162)"><path d="M-94-15H94L72 84H-72Z" fill="'+color+'" fill-opacity=".10" stroke="'+color+'" stroke-width="3"/><path d="M-62-15L-31-74H31L62-15" fill="none" stroke="'+color+'" stroke-width="5"/><path d="M-42 18H42M-42 45H29" stroke="#E8E3D6" stroke-opacity=".85" stroke-width="7" stroke-linecap="round"/><path d="M0-100C-25-67-27-49 0-37 27-49 25-67 0-100Z" fill="'+color+'"/><path d="M0-81V-50" stroke="#F1EBDD" stroke-width="4"/></g>'
 :keyword.includes('fresh')||keyword.includes('produce')||keyword.includes('circle')?
 '<g transform="translate(685 165)"><circle r="106" fill="none" stroke="'+color+'" stroke-opacity=".25"/><path d="M-5 88C-17 5 10-55 82-91 89-17 57 48-5 88Z" fill="'+color+'" fill-opacity=".35" stroke="'+color+'" stroke-width="3"/><path d="M-5 88C-76 67-105 11-88-55-26-45 13 0-5 88Z" fill="'+langColor+'" fill-opacity=".30" stroke="'+langColor+'" stroke-width="3"/><path d="M-5 88L51-56M-5 88L-69-28" stroke="#EDE7D8" stroke-opacity=".8" stroke-width="3"/><path d="M-115 106Q0 132 115 106" fill="none" stroke="'+color+'" stroke-opacity=".4"/></g>'
 :keyword.includes('store')||keyword.includes('point of sale')||keyword.includes('retail')||keyword.includes('inventory')?
 '<g transform="translate(685 165)"><path d="M-104-48L-78-93H78L104-48V-24H-104Z" fill="'+color+'" fill-opacity=".16" stroke="'+color+'" stroke-width="3"/><rect x="-83" y="-24" width="166" height="116" rx="10" fill="'+color+'" fill-opacity=".08" stroke="'+color+'" stroke-width="3"/><path d="M-49-24V92M49-24V92" stroke="'+color+'" stroke-opacity=".35"/><circle cx="-32" cy="105" r="13" fill="'+color+'"/><circle cx="32" cy="105" r="13" fill="'+color+'"/><path d="M-45 18H45M-45 45H26" stroke="#EDE7D8" stroke-opacity=".8" stroke-width="7" stroke-linecap="round"/></g>'
 :keyword.includes('quantum')||keyword.includes('cyber')?
 '<g transform="translate(685 165)"><rect x="-72" y="-72" width="144" height="144" rx="22" fill="'+color+'" fill-opacity=".10" stroke="'+color+'" stroke-width="3"/><g stroke="'+color+'" stroke-width="4"><path d="M-105-42H-72M-105 0H-72M-105 42H-72M72-42H105M72 0H105M72 42H105M-42-105V-72M0-105V-72M42-105V-72M-42 72V105M0 72V105M42 72V105"/></g><g fill="none" stroke="'+langColor+'" stroke-width="4"><ellipse rx="56" ry="24" transform="rotate(35)"/><ellipse rx="56" ry="24" transform="rotate(-35)"/><ellipse rx="56" ry="24" transform="rotate(90)"/></g><circle r="12" fill="#EDE7D8"/></g>'
 :keyword.includes('crm')||keyword.includes('community')||keyword.includes('catalyst')?
 '<g transform="translate(685 162)"><circle cx="-45" cy="-35" r="25" fill="'+color+'"/><circle cx="45" cy="-35" r="25" fill="'+langColor+'"/><circle cy="-65" r="28" fill="#E9E4D7"/><path d="M-90 78V43C-90 12-65 0-45 0S0 12 0 43V78ZM0 78V43C0 12 25 0 45 0S90 12 90 43V78Z" fill="'+color+'" fill-opacity=".16" stroke="'+color+'" stroke-width="3"/><path d="M-37 78V21C-37-15 0-22 0-22S37-15 37 21V78Z" fill="'+langColor+'" fill-opacity=".2" stroke="'+langColor+'" stroke-width="3"/></g>'
 :keyword.includes('knox')||keyword.includes('knowledge graph')||keyword.includes('rust')||keyword.includes('desktop')?
 '<g transform="translate(685 164)"><g stroke="'+color+'" stroke-width="4" fill="none"><path d="M-82-50L0-84 80-38 67 54 0 85-75 45Z"/><path d="M-82-50L-18 0 80-38M-18 0L67 54M-18 0L0 85"/></g><g fill="'+langColor+'" stroke="#EDE7D8" stroke-width="2"><circle cx="-82" cy="-50" r="14"/><circle cx="0" cy="-84" r="14"/><circle cx="80" cy="-38" r="14"/><circle cx="67" cy="54" r="14"/><circle cx="0" cy="85" r="14"/><circle cx="-75" cy="45" r="14"/><circle cx="-18" cy="0" r="19"/></g></g>'
 :'<g transform="translate(685 164)"><circle r="104" fill="none" stroke="'+color+'" stroke-opacity=".35"/><circle r="70" fill="none" stroke="'+langColor+'" stroke-width="2" stroke-dasharray="3 9"/><path d="M-58-10L0-76 58-10 0 76Z" fill="'+color+'" fill-opacity=".16" stroke="'+color+'" stroke-width="3"/><circle r="17" fill="#EDE7D8"/></g>';
 const starsText='★ '+repoStars+'   ·   UPDATED '+updated;
 const art='<svg xmlns="http://www.w3.org/2000/svg" width="900" height="320" viewBox="0 0 900 320"><defs><linearGradient id="cardBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+bg+'"/><stop offset="1" stop-color="'+color+'" stop-opacity=".24"/></linearGradient><linearGradient id="cardLine" x1="0" y1="0" x2="1" y2="0"><stop stop-color="'+color+'" stop-opacity=".85"/><stop offset="1" stop-color="#D7BD78" stop-opacity=".45"/></linearGradient></defs><rect width="900" height="320" rx="20" fill="url(#cardBg)"/><rect x="8" y="8" width="884" height="304" rx="15" fill="none" stroke="#D9D2C2" stroke-opacity=".14"/><path d="M0 276Q220 236 440 278T900 252" fill="none" stroke="url(#cardLine)" stroke-opacity=".24" stroke-width="1.5"/><path d="M48 52H112" stroke="'+color+'" stroke-width="3"/><text x="48" y="40" font-family="Georgia,serif" font-size="16" letter-spacing="2.2" fill="'+color+'">'+lang.toUpperCase()+'  /  SELECTED WORK</text><text x="48" y="119" font-family="Georgia,Times New Roman,serif" font-size="'+titleSize+'" font-weight="700" fill="#F1EBDD">'+displayName+'</text><text x="48" y="148" font-family="Arial,sans-serif" font-size="24" fill="#C5CEC1">'+descSvg+'</text><rect x="48" y="226" width="180" height="36" rx="17" fill="'+langColor+'" fill-opacity=".15" stroke="'+langColor+'" stroke-opacity=".6"/><text x="138" y="249" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#EDE7D8">'+lang+'</text><text x="48" y="286" font-family="Consolas,monospace" font-size="15" letter-spacing=".5" fill="#AEBBAA">'+starsText+'</text>'+motif+'<text x="850" y="296" text-anchor="end" font-family="Arial,sans-serif" font-size="12" letter-spacing="1.5" fill="'+color+'">VIEW PROJECT ↗</text></svg>';
 return {r,i,color,art};
});
const projectCards=projectArts.map(p=>{const label=projectNames[slug(p.r.name)]||p.r.name;return '<a href="'+p.r.html_url+'"><img src="./assets/projects/'+slug(p.r.name)+'.svg" width="100%" alt="'+esc(label)+' project card"/></a>'}).reduce((a,x,i)=>{if(i%2===0)a.push([x]);else a[a.length-1].push(x);return a;},[]).map(row=>'<p align="center">'+row.map(x=>x.replace('width="100%"','width="47%"')).join(' &nbsp; ')+'</p>').join('\n');
const navItems=[
 {id:'about',number:'01',label:'ABOUT',color:'#C58E6A'},
 {id:'snapshot',number:'02',label:'SNAPSHOT',color:'#8EA68C'},
 {id:'toolkit',number:'03',label:'TOOLKIT',color:'#D7BD78'},
 {id:'selected-work',number:'04',label:'SELECTED WORK',color:'#91B8A8'}
];
const navSvgs=navItems.map(item=>({ ...item, svg:'<svg xmlns="http://www.w3.org/2000/svg" width="300" height="72" viewBox="0 0 300 72"><rect x="1" y="1" width="298" height="70" rx="12" fill="#18251F" stroke="#657765" stroke-opacity=".55" stroke-width="1.5"/><rect x="1" y="13" width="5" height="46" rx="2.5" fill="'+item.color+'"/><text x="22" y="28" font-family="Arial,sans-serif" font-size="11" font-weight="700" letter-spacing="2" fill="'+item.color+'">'+item.number+' / SECTION</text><text x="22" y="53" font-family="Arial,sans-serif" font-size="18" font-weight="700" letter-spacing=".8" fill="#F1EBDD">'+item.label+'</text><path d="M262 36H278M271 29L278 36 271 43" fill="none" stroke="'+item.color+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' }));
const navCards=navSvgs.map(item=>'<a href="#'+item.id+'"><img src="./assets/nav-'+item.id+'.svg" width="22%" alt="'+item.number+' '+item.label+' section navigation"/></a>').join(' &nbsp; ');
const totalLanguageBytes=Object.values(totals).reduce((sum,n)=>sum+n,0);
const metricItems=[
 {value:repos.length,label:'PUBLIC PROJECTS',symbol:'✳',color:'#C58E6A'},
 {value:stars,label:'TOTAL STARS',symbol:'★',color:'#D7BD78'},
 {value:allLangs.length,label:'LANGUAGES',symbol:'⌘',color:'#91B8A8'},
 {value:profile.followers,label:'FOLLOWERS',symbol:'◎',color:'#B994A8'}
];
const metricsSvg='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="178" viewBox="0 0 1200 178"><defs><linearGradient id="metricBg" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#18251F"/><stop offset=".52" stop-color="#1C2B24"/><stop offset="1" stop-color="#172725"/></linearGradient><linearGradient id="metricEdge"><stop stop-color="#C58E6A"/><stop offset=".48" stop-color="#A7B69A"/><stop offset="1" stop-color="#86AAA2"/></linearGradient></defs><rect x="5" y="5" width="1190" height="168" rx="18" fill="url(#metricBg)" stroke="url(#metricEdge)" stroke-opacity=".48" stroke-width="1.4"/><text x="32" y="31" font-family="Arial,sans-serif" font-size="12" font-weight="700" letter-spacing="2.2" fill="#C58E6A">02 / PROFILE AT A GLANCE</text><text x="1165" y="31" text-anchor="end" font-family="Consolas,monospace" font-size="11" letter-spacing="1" fill="#93A492">PUBLIC GITHUB DATA</text>'+metricItems.map((m,i)=>{const x=150+i*300;return (i?'<path d="M'+(i*300)+' 65V150" stroke="#B8C1B1" stroke-opacity=".18"/>':'')+'<circle cx="'+(x-51)+'" cy="108" r="25" fill="'+m.color+'" fill-opacity=".10" stroke="'+m.color+'" stroke-opacity=".54"/><text x="'+(x-51)+'" y="116" text-anchor="middle" font-family="Georgia,serif" font-size="25" fill="'+m.color+'">'+m.symbol+'</text><text x="'+(x-10)+'" y="114" font-family="Georgia,serif" font-size="36" font-weight="700" fill="#F1EBDD">'+m.value+'</text><text x="'+(x-10)+'" y="139" font-family="Arial,sans-serif" font-size="11" letter-spacing="1.7" fill="#AAB8A8">'+m.label+'</text>';}).join('')+'</svg>';
const stackItems=langs.map(([name,bytes],i)=>{const color=palette[name]||['#C58E6A','#91B8A8','#D7BD78','#B994A8'][i%4];const pct=totalLanguageBytes?bytes/totalLanguageBytes*100:0;const label=pct>0&&pct<1?'<1%':Math.round(pct)+'%';return {name,color,pct,label};});
const maxPct=Math.max(1,...stackItems.map(x=>x.pct));
const stackSvg='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="232" viewBox="0 0 1200 232"><defs><linearGradient id="stackPanel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#19271F"/><stop offset="1" stop-color="#172725"/></linearGradient><linearGradient id="stackEdge"><stop stop-color="#C58E6A"/><stop offset="1" stop-color="#91B8A8"/></linearGradient></defs><rect x="5" y="5" width="1190" height="222" rx="18" fill="url(#stackPanel)" stroke="url(#stackEdge)" stroke-opacity=".35"/><text x="32" y="39" font-family="Georgia,serif" font-size="18" font-weight="700" letter-spacing="1.3" fill="#C58E6A">03 / TOOLS &amp; LANGUAGES</text><text x="1165" y="38" text-anchor="end" font-family="Consolas,monospace" font-size="11" letter-spacing="1" fill="#93A492">TOP 8 · SHARE OF PUBLIC CODE</text>'+stackItems.map((item,i)=>{const col=i%4,row=Math.floor(i/4),x=24+col*294,y=64+row*80,w=280;const bar=Math.max(item.pct>0?3:0,190*item.pct/maxPct);return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="66" rx="11" fill="#101A18" stroke="#A9B7A5" stroke-opacity=".18"/><rect x="'+x+'" y="'+y+'" width="3" height="66" rx="1.5" fill="'+item.color+'"/><circle cx="'+(x+23)+'" cy="'+(y+24)+'" r="4" fill="'+item.color+'"/><text x="'+(x+37)+'" y="'+(y+29)+'" font-family="Arial,sans-serif" font-size="15" font-weight="600" fill="#EDE8DA">'+esc(item.name)+'</text><text x="'+(x+w-13)+'" y="'+(y+28)+'" text-anchor="end" font-family="Consolas,monospace" font-size="12" fill="'+item.color+'">'+esc(item.label)+'</text><rect x="'+(x+17)+'" y="'+(y+46)+'" width="246" height="4" rx="2" fill="#35443A"/><rect x="'+(x+17)+'" y="'+(y+46)+'" width="'+Math.min(246,bar)+'" height="4" rx="2" fill="'+item.color+'"/>';}).join('')+'</svg>';
const dots=Array.from({length:82},(_,i)=>{const x=(i*149.7)%1140+22,y=(i*83.9)%455+22,r=i%9===0?2:1;return '<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+r+'" fill="#D6DCCB" opacity="'+(.10+(i%4)*.08)+'"/>';}).join('');
const hero='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="480" viewBox="0 0 1200 480"><defs><linearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#111B17"/><stop offset=".52" stop-color="#1C2B22"/><stop offset="1" stop-color="#102321"/></linearGradient><radialGradient id="warmWash"><stop stop-color="#B47D58" stop-opacity=".30"/><stop offset="1" stop-color="#B47D58" stop-opacity="0"/></radialGradient><radialGradient id="sageWash"><stop stop-color="#8EA68C" stop-opacity=".23"/><stop offset="1" stop-color="#8EA68C" stop-opacity="0"/></radialGradient><linearGradient id="heroEdge"><stop stop-color="#C58E6A"/><stop offset=".48" stop-color="#A5B49A"/><stop offset="1" stop-color="#82A8A0"/></linearGradient></defs><rect width="1200" height="480" rx="26" fill="url(#heroBg)"/><circle cx="260" cy="160" r="330" fill="url(#warmWash)"/><circle cx="1000" cy="360" r="300" fill="url(#sageWash)"/><g>'+dots+'</g><path d="M640 0V480" stroke="#D5D8C9" stroke-opacity=".10"/><g transform="translate(900 218)"><circle r="164" fill="none" stroke="#91A993" stroke-opacity=".20" stroke-width="1.5"/><circle r="124" fill="none" stroke="#C58E6A" stroke-opacity=".38" stroke-width="1.5"/><circle r="83" fill="#91A993" fill-opacity=".08" stroke="#AFC0A8" stroke-opacity=".52"/><circle r="56" fill="#D7BD78" fill-opacity=".88"/><circle r="70" fill="none" stroke="#E5D9BD" stroke-opacity=".28" stroke-width="1"/><path d="M-4-8C-48-80-35-124 12-145 35-87 22-44-4-8Z" fill="#8EA68C" fill-opacity=".78" stroke="#B7C5A9" stroke-width="1.5"/><path d="M-4-8C-72-25-106 5-102 55-50 61-15 35-4-8Z" fill="#C58E6A" fill-opacity=".78" stroke="#E0B18C" stroke-width="1.5"/><path d="M-4-8L10-121M-4-8L-80 35" stroke="#EDE7D8" stroke-opacity=".72" stroke-width="2"/><circle cx="115" cy="-111" r="7" fill="#D7BD78"/><circle cx="-140" cy="77" r="5" fill="#B994A8"/></g><g><text x="72" y="76" font-family="Arial,sans-serif" font-size="14" letter-spacing="5" fill="#C5BDA8">A PERSONAL PORTFOLIO  /  '+new Date().getUTCFullYear()+'</text><text x="68" y="180" font-family="Georgia,Times New Roman,serif" font-size="84" font-weight="700" fill="#F1EBDD">'+esc(profile.name||username)+'</text><path d="M74 207H196" stroke="#C58E6A" stroke-width="3"/><text x="72" y="252" font-family="Georgia,Times New Roman,serif" font-size="29" fill="#E4E1D4">Ideas into code. Curiosity into creations.</text><text x="74" y="298" font-family="Arial,sans-serif" font-size="17" letter-spacing="1.2" fill="#AFC0B0">DEVELOPER  ·  BUILDER  ·  EXPLORER</text><text x="74" y="404" font-family="Consolas,monospace" font-size="12" letter-spacing="3" fill="#A6B39F">BUILD THOUGHTFULLY  /  MAKE IT USEFUL</text></g><rect x="18" y="18" width="1164" height="444" rx="21" fill="none" stroke="url(#heroEdge)" stroke-opacity=".6" stroke-width="1.5"/></svg>';
const aboutSection="<img src=\"./assets/about-header.svg\" width=\"100%\" alt=\"A Little About Me — student, developer, builder and lifelong learner\"/>\n\n<div align=\"left\">\n<p>Hey, I’m <strong>Venkata Nagarjuna Babu Chitturi</strong> — a student, developer and builder who enjoys turning curiosity into things people can actually use.</p>\n\n<p>My work moves between polished web experiences and Android apps, backend systems, developer tools, and experiments in cybersecurity, quantum technology and AI. I also enjoy tech events, meeting fellow builders and learning through collaboration.</p>\n\n<img src=\"./assets/about-divider.svg\" width=\"100%\" alt=\"Cedar and Stone decorative divider\"/>\n\n<h3>What I Enjoy Building</h3>\n<table width=\"100%\" cellpadding=\"13\" cellspacing=\"0\">\n<tr>\n<td width=\"50%\" valign=\"top\"><p><strong>📱 Mobile Applications</strong></p><p>Android apps and practical tools that solve everyday problems.</p></td>\n<td width=\"50%\" valign=\"top\"><p><strong>🌐 Web Experiences</strong></p><p>Responsive interfaces, full-stack apps and useful digital platforms.</p></td>\n</tr>\n<tr>\n<td width=\"50%\" valign=\"top\"><p><strong>⚙️ Developer Tools</strong></p><p>Desktop software, automation and workflows that make building easier.</p></td>\n<td width=\"50%\" valign=\"top\"><p><strong>🔐 Emerging Technology</strong></p><p>Cybersecurity, quantum computing and AI-powered experiments.</p></td>\n</tr>\n<tr>\n<td colspan=\"2\" align=\"center\"><p><strong>🤝 Community Projects</strong></p><p>Tools that bring people together and make collaboration easier.</p></td>\n</tr>\n</table>\n\n<img src=\"./assets/about-divider.svg\" width=\"100%\" alt=\"Cedar and Stone decorative divider\"/>\n\n<h3>My Approach</h3>\n<p>I learn best by building: trying ideas, stepping outside my comfort zone, and improving with every iteration. I’m always exploring what’s next — and looking for the next idea worth bringing to life.</p>\n\n<img src=\"./assets/about-signoff.svg\" width=\"100%\" alt=\"Build thoughtfully. Experiment boldly. Keep learning.\"/>\n</div>";

const workHeader=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="176" viewBox="0 0 1200 176">
<defs>
<linearGradient id="workBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#18251F"/><stop offset="1" stop-color="#172725"/></linearGradient>
<linearGradient id="workEdge"><stop stop-color="#C58E6A"/><stop offset=".55" stop-color="#8EA68C"/><stop offset="1" stop-color="#8EA68C" stop-opacity=".2"/></linearGradient>
</defs>
<rect x="1" y="1" width="1198" height="174" rx="18" fill="url(#workBg)" stroke="url(#workEdge)" stroke-opacity=".58" stroke-width="1.5"/>
<rect x="1" y="18" width="6" height="140" rx="3" fill="#B47D58"/>
<text x="42" y="45" font-family="Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="2.8" fill="#C58E6A">04 / THE THINGS I BUILD</text>
<text x="42" y="101" font-family="Georgia,serif" font-size="44" font-weight="700" fill="#F1EBDD">Selected Work</text>
<text x="44" y="137" font-family="Arial,sans-serif" font-size="17" fill="#AFC0B0">A few ideas turned into useful, evolving projects.</text>
<g transform="translate(1038 88)">
<rect x="-94" y="-54" width="68" height="68" rx="12" fill="#8EA68C" fill-opacity=".10" stroke="#8EA68C" stroke-opacity=".75" stroke-width="2"/>
<rect x="-13" y="-54" width="68" height="68" rx="12" fill="#B47D58" fill-opacity=".10" stroke="#B47D58" stroke-opacity=".75" stroke-width="2"/>
<rect x="-94" y="27" width="68" height="52" rx="12" fill="#D7BD78" fill-opacity=".09" stroke="#D7BD78" stroke-opacity=".68" stroke-width="2"/>
<rect x="-13" y="27" width="68" height="52" rx="12" fill="#8EA68C" fill-opacity=".08" stroke="#8EA68C" stroke-opacity=".55" stroke-width="2"/>
<g fill="none" stroke="#D7BD78" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
<path d="M-78-30L-60-43-42-30-60-17Z"/>
<path d="M6-31Q21-47 39-31Q21-15 6-31Z"/>
<path d="M-79 44H-43M-79 55H-52M-79 66H-61"/>
<path d="M6 54L17 43 28 54 39 43"/>
</g>
<circle cx="21" cy="-31" r="4" fill="#D7BD78"/>
</g>
</svg>`;
const footerCta="<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1200\" height=\"142\" viewBox=\"0 0 1200 142\" role=\"img\" aria-labelledby=\"title desc\">\n<title id=\"title\">Explore all repositories</title>\n<desc id=\"desc\">A Cedar and Stone call to action to browse every public project and experiment.</desc>\n<defs>\n<linearGradient id=\"footerBg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop stop-color=\"#17241F\"/><stop offset=\".55\" stop-color=\"#1C2B24\"/><stop offset=\"1\" stop-color=\"#172725\"/></linearGradient>\n<linearGradient id=\"footerEdge\"><stop stop-color=\"#B47D58\"/><stop offset=\".5\" stop-color=\"#8EA68C\"/><stop offset=\"1\" stop-color=\"#8EA68C\" stop-opacity=\".35\"/></linearGradient>\n</defs>\n<rect x=\"1\" y=\"1\" width=\"1198\" height=\"140\" rx=\"18\" fill=\"url(#footerBg)\" stroke=\"url(#footerEdge)\" stroke-opacity=\".62\" stroke-width=\"1.5\"/>\n<rect x=\"1\" y=\"18\" width=\"6\" height=\"106\" rx=\"3\" fill=\"#B47D58\"/>\n<text x=\"42\" y=\"43\" font-family=\"Arial,sans-serif\" font-size=\"13\" font-weight=\"700\" letter-spacing=\"2.8\" fill=\"#C58E6A\">05 / THE FULL COLLECTION</text>\n<text x=\"42\" y=\"91\" font-family=\"Georgia,serif\" font-size=\"37\" font-weight=\"700\" fill=\"#F1EBDD\">Explore all repositories</text>\n<text x=\"44\" y=\"119\" font-family=\"Arial,sans-serif\" font-size=\"16\" fill=\"#AFC0B0\">Browse every public project, experiment and work in progress.</text>\n<circle cx=\"1110\" cy=\"71\" r=\"38\" fill=\"#8EA68C\" fill-opacity=\".09\" stroke=\"#8EA68C\" stroke-opacity=\".55\" stroke-width=\"1.5\"/>\n<path d=\"M1094 71H1124M1113 59L1125 71 1113 83\" fill=\"none\" stroke=\"#D7BD78\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</svg>";
const readme=[
'<div align="center">',
'<img src="./assets/profile-universe.svg" width="100%" alt="StarLord — Cedar & Stone portfolio banner"/>',
'<p align="center">'+navCards+'</p>',
'<a id="about"></a>',
aboutSection,
'',
'<a id="snapshot"></a>',
'<img src="./assets/profile-metrics.svg" width="100%" alt="GitHub profile snapshot: public projects, stars, languages and followers"/>',
'',
'<a id="toolkit"></a>',
'<img src="./assets/tech-stack-v2.svg" width="100%" alt="Technology stack and language distribution"/>',
'',
'<a id="selected-work"></a>',
'<img src="./assets/work-header.svg" width="100%" alt="Selected work — projects shaped by curiosity"/>',
'<sub>'+featured.length+' public projects · mobile, developer tools, security and community.</sub>',
'',
projectCards,
'',
'<p align="center"><a href="https://github.com/'+username+'?tab=repositories"><img src="./assets/portfolio-footer.svg" width="100%" alt="Explore all repositories — browse every public project and experiment"/></a></p>',
'<p align="center"><sub>A living collection of public work · Automatically refreshed · Private repositories stay private</sub></p>',
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
await write('assets/solar-data.json',JSON.stringify({username,profile,publicRepositories:repos.map(r=>({name:r.name,description:r.description,language:r.language,stars:r.stargazers_count,updated_at:r.updated_at,url:r.html_url})),languages:allLangs,totalStars:stars},null,2));
console.log('Cedar & Stone profile generated for '+repos.length+' public repositories and '+langs.length+' languages.');
async function write(path,content){const fs=await import('node:fs/promises');await fs.mkdir(path.split('/').slice(0,-1).join('/')||'.',{recursive:true});await fs.writeFile(path,content);}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
