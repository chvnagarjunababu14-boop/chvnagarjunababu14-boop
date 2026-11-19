// Neon Developer Universe — dynamic profile generator. Public repository data only.
async function main(){
const username=process.env.GITHUB_USERNAME||'chvnagarjunababu14-boop';
const headers={Accept:'application/vnd.github+json','User-Agent':'neon-profile'};
if(process.env.GITHUB_TOKEN)headers.Authorization='Bearer '+process.env.GITHUB_TOKEN;
async function api(url){const r=await fetch(url,{headers});if(!r.ok)throw new Error('GitHub API '+r.status+' at '+url);return r.json();}
const profile=await api('https://api.github.com/users/'+username);
const all=await api('https://api.github.com/users/'+username+'/repos?type=public&sort=updated&per_page=100');
const repos=all.filter(r=>!r.private&&!r.archived).slice(0,40);
const langmaps=await Promise.all(repos.map(r=>api(r.languages_url)));
const totals={};langmaps.forEach(m=>Object.entries(m).forEach(([k,v])=>totals[k]=(totals[k]||0)+v));
const langs=Object.entries(totals).sort((a,b)=>b[1]-a[1]).slice(0,8);
const palette={TypeScript:'#3178c6',JavaScript:'#f1e05a',Python:'#3572A5',Java:'#b07219',Rust:'#dea584',Kotlin:'#A97BFF',CSS:'#563d7c',HTML:'#e34c26',Go:'#00ADD8',C:'#555555','C++':'#f34b7d',PHP:'#4F5D95',Ruby:'#701516',Dart:'#00B4AB',Shell:'#89e051',SQL:'#e38c00',Swift:'#F05138'};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const stars=repos.reduce((n,r)=>n+r.stargazers_count,0);
const featured=[...repos].sort((a,b)=>(b.stargazers_count-a.stargazers_count)||new Date(b.updated_at)-new Date(a.updated_at)).slice(0,6);
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const colors=['#ff4fd8','#42d9ff','#9b7bff','#ffc247','#35f0b5','#ff6b8a'];
const projectArts=featured.map((r,i)=>{
 const color=palette[r.language]||colors[i%colors.length],accent=colors[i%colors.length],bg=['#090d22','#091a2b','#100d25','#101827','#190d24','#081c25'][i%6];
 const name=esc(r.name.length>27?r.name.slice(0,26)+'…':r.name),desc=esc((r.description||('A '+(r.language||'multi-stack')+' project')).slice(0,90));
 const lang=esc(r.language||'Multi-stack'),updated=new Date(r.updated_at).toISOString().slice(0,10),stars=r.stargazers_count;
 const spark=Array.from({length:34},(_,j)=>'<circle cx="'+((j*71+23)%780)+'" cy="'+((j*43+19)%350)+'" r="'+(j%6===0?2:1)+'" fill="#b8d6ff" opacity="'+(.1+(j%5)*.08)+'"/>').join('');
 const motifs=[
 '<g transform="translate(650 185)"><rect x="-95" y="-66" width="190" height="132" rx="18" fill="#ff4fd8" fill-opacity=".08" stroke="#ff4fd8" stroke-opacity=".5"/><path d="M-75-42H75M-75-20H38M-75 4H62M-75 28H25" stroke="#ff4fd8" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/><circle cx="64" cy="35" r="18" fill="#ff4fd8" fill-opacity=".2" stroke="#ff4fd8"/><path d="M55 35l7 7 13-16" fill="none" stroke="#fff" stroke-width="4"/></g>',
 '<g transform="translate(650 180)"><rect x="-100" y="-75" width="200" height="150" rx="15" fill="#42d9ff" fill-opacity=".08" stroke="#42d9ff"/><rect x="-80" y="-55" width="160" height="110" rx="8" fill="#06152b" stroke="#42d9ff" stroke-opacity=".4"/><path d="M-55-30H-5M-55-8H-30M-55 14H18M-55 36H-18" stroke="#42d9ff" stroke-width="5" stroke-linecap="round"/><path d="M30-42L65-8 30 26" fill="none" stroke="#42d9ff" stroke-width="8"/></g>',
 '<g transform="translate(650 180)"><circle r="82" fill="#9b7bff" fill-opacity=".12" stroke="#9b7bff"/><circle r="58" fill="none" stroke="#9b7bff" stroke-width="2" stroke-dasharray="5 7"/><circle r="36" fill="#9b7bff" fill-opacity=".25"/><path d="M-24 0L0-34 24 0 0 34Z" fill="#dcd2ff"/><circle r="98" fill="none" stroke="#9b7bff" stroke-opacity=".2"/></g>',
 '<g transform="translate(650 180)"><circle r="74" fill="#ffc247" fill-opacity=".14" stroke="#ffc247"/><circle r="55" fill="#ffc247" fill-opacity=".15"/><g fill="#ffc247"><circle cx="-45" cy="-35" r="14"/><circle cx="45" cy="-35" r="14"/><circle cx="-45" cy="35" r="14"/><circle cx="45" cy="35" r="14"/></g><path d="M-20-28H20V28H-20Z" fill="#fff" fill-opacity=".85"/><path d="M-12-10H12M-12 4H12M-12 18H6" stroke="#ffc247" stroke-width="5"/></g>',
 '<g transform="translate(650 180)"><circle r="90" fill="#35f0b5" fill-opacity=".08" stroke="#35f0b5" stroke-opacity=".5"/><circle r="66" fill="none" stroke="#35f0b5" stroke-width="3" stroke-dasharray="7 9"/><circle r="40" fill="#35f0b5" fill-opacity=".18"/><path d="M-25-20L25 0-25 20Z" fill="#fff"/><circle r="105" fill="none" stroke="#35f0b5" stroke-opacity=".16"/></g>',
 '<g transform="translate(650 180)"><rect x="-78" y="-78" width="156" height="156" rx="20" fill="#ff6b8a" fill-opacity=".12" stroke="#ff6b8a"/><path d="M-52-52H52V52H-52Z" fill="#0a1020" stroke="#ff6b8a" stroke-width="3"/><g fill="#ff6b8a"><rect x="-34" y="-34" width="22" height="22"/><rect x="12" y="-34" width="22" height="22"/><rect x="-34" y="12" width="22" height="22"/><rect x="12" y="12" width="22" height="22"/></g><path d="M-52-90V-65M-20-90V-65M20-90V-65M52-90V-65M-52 65V90M-20 65V90M20 65V90M52 65V90" stroke="#ff6b8a" stroke-width="7"/></g>'
 ];
 const art='<svg xmlns="http://www.w3.org/2000/svg" width="900" height="350" viewBox="0 0 900 350"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+bg+'"/><stop offset="1" stop-color="'+color+'" stop-opacity=".22"/></linearGradient><radialGradient id="glow"><stop stop-color="'+color+'" stop-opacity=".45"/><stop offset="1" stop-color="'+color+'" stop-opacity="0"/></radialGradient><filter id="blur"><feGaussianBlur stdDeviation="22"/></filter></defs><rect width="900" height="350" rx="25" fill="url(#bg)"/><circle cx="670" cy="180" r="190" fill="url(#glow)" filter="url(#blur)"/>'+spark+'<path d="M0 300 Q220 235 420 290T900 245" fill="none" stroke="'+color+'" stroke-opacity=".13" stroke-width="2"/>'+motifs[i%motifs.length]+'<text x="44" y="46" font-family="Arial,sans-serif" font-size="13" letter-spacing="4" fill="'+accent+'">PROJECT / '+String(i+1).padStart(2,'0')+'</text><text x="44" y="126" font-family="Arial,sans-serif" font-size="38" font-weight="700" fill="#f4f6ff">'+name+'</text><text x="44" y="165" font-family="Arial,sans-serif" font-size="17" fill="#b8c5e2">'+desc+'</text><rect x="44" y="202" width="154" height="35" rx="17" fill="'+color+'" fill-opacity=".17" stroke="'+color+'" stroke-opacity=".6"/><text x="121" y="224" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#fff">'+lang+'</text><text x="44" y="292" font-family="Arial,sans-serif" font-size="12" letter-spacing="2" fill="#8393b7">★ '+stars+'  ·  UPDATED '+updated+'</text><text x="845" y="322" text-anchor="end" font-family="Arial,sans-serif" font-size="12" fill="'+color+'">OPEN PROJECT ↗</text></svg>';
 return {r,i,color,art};
});
const projectCards=projectArts.map(p=>'<a href="'+p.r.html_url+'"><img src="./assets/projects/'+slug(p.r.name)+'.svg" width="100%" alt="'+esc(p.r.name)+' illustrated project card"/></a>').reduce((a,x,i)=>{if(i%2===0)a.push([x]);else a[a.length-1].push(x);return a;},[]).map(row=>'<tr><td width="50%" valign="top">'+row[0]+'</td><td width="50%" valign="top">'+(row[1]||'')+'</td></tr>').join('');
const stack=langs.map(([l,b])=>{const percent=Math.round(b/Math.max(1,langs.reduce((s,x)=>s+x[1],0))*100);const color=palette[l]||'#8b5cf6';return '<img src="https://img.shields.io/badge/'+encodeURIComponent(l).replace(/%20/g,'_')+'-'+color.replace('#','')+'?style=for-the-badge&logo='+encodeURIComponent(l.toLowerCase())+'&logoColor=white" alt="'+esc(l)+'"/> <sub>'+percent+'%</sub>';}).join(' &nbsp; ');
const dots=Array.from({length:100},(_,i)=>{const x=(i*137.5)%1160+10,y=(i*79.3)%480+10,r=(i%7===0)?2:1;return '<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+r+'" fill="#c8dcff" opacity="'+(0.15+(i%5)*.1)+'"/>';}).join('');
const hero='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="500" viewBox="0 0 1200 500"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#050716"/><stop offset=".48" stop-color="#11112c"/><stop offset="1" stop-color="#071b2b"/></linearGradient><radialGradient id="nebula"><stop stop-color="#9b4dff" stop-opacity=".55"/><stop offset="1" stop-color="#9b4dff" stop-opacity="0"/></radialGradient><radialGradient id="cyan"><stop stop-color="#14d9ff" stop-opacity=".32"/><stop offset="1" stop-color="#14d9ff" stop-opacity="0"/></radialGradient><filter id="blur"><feGaussianBlur stdDeviation="30"/></filter><linearGradient id="edge"><stop stop-color="#ff4fd8"/><stop offset=".5" stop-color="#8b5cf6"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs><rect width="1200" height="500" rx="30" fill="url(#bg)"/><circle cx="250" cy="130" r="300" fill="url(#nebula)" filter="url(#blur)"/><circle cx="1020" cy="380" r="290" fill="url(#cyan)" filter="url(#blur)"/><g>'+dots+'</g><g transform="translate(890 190)"><circle r="150" fill="none" stroke="#8273ff" stroke-opacity=".15" stroke-width="2"/><circle r="108" fill="none" stroke="#8b5cf6" stroke-opacity=".25" stroke-width="2"/><circle r="70" fill="#6f50ff" fill-opacity=".13" stroke="#b69aff" stroke-opacity=".5"/><circle r="36" fill="#c5b8ff" fill-opacity=".9"/><circle r="48" fill="#b09aff" fill-opacity=".15"/><circle cx="105" cy="-110" r="9" fill="#22d3ee"><animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="15s" repeatCount="indefinite"/></circle><circle cx="-70" cy="125" r="6" fill="#f472b6"><animate attributeName="opacity" values=".3;1;.3" dur="3s" repeatCount="indefinite"/></circle></g><g><text x="70" y="72" font-family="Arial,sans-serif" font-size="16" letter-spacing="6" fill="#9eb6ed">PERSONAL DEVELOPER UNIVERSE / 2026</text><text x="70" y="162" font-family="Arial,sans-serif" font-size="76" font-weight="700" fill="#f5f2ff">'+esc(profile.name||username)+'</text><text x="70" y="212" font-family="Arial,sans-serif" font-size="28" fill="#d8e3ff">Ideas into code. Curiosity into creations.</text><text x="70" y="260" font-family="Arial,sans-serif" font-size="19" fill="#a9b7db">'+esc(profile.bio||'Developer · Builder · Explorer')+'</text><g transform="translate(70 315)"><rect width="220" height="54" rx="27" fill="#8b5cf6" fill-opacity=".22" stroke="#b49cff"/><text x="110" y="34" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#f3eaff">✦ Explore My Work</text></g><text x="70" y="435" font-family="Arial,sans-serif" font-size="13" letter-spacing="4" fill="#8093c2">BUILD / EXPERIMENT / LEARN / REPEAT</text></g><rect x="18" y="18" width="1164" height="464" rx="24" fill="none" stroke="url(#edge)" stroke-opacity=".55" stroke-width="2"/></svg>';
const readme=[
'<div align="center">',
'<img src="./assets/profile-universe.svg" width="100%" alt="Neon developer universe banner"/>',
'',
'<table width="100%"><tr><td align="center" bgcolor="#17132e"><h2>🌌 '+repos.length+'</h2><sub>PUBLIC REPOSITORIES</sub></td><td align="center" bgcolor="#111b34"><h2>⭐ '+stars+'</h2><sub>TOTAL STARS</sub></td><td align="center" bgcolor="#12243a"><h2>🧬 '+langs.length+'</h2><sub>LANGUAGES</sub></td><td align="center" bgcolor="#201331"><h2>👥 '+profile.followers+'</h2><sub>FOLLOWERS</sub></td></tr></table>',
'',
'<h2>🧰 &nbsp; TECH STACK</h2>',
stack,
'',
'<h2>🚀 &nbsp; FEATURED PROJECTS</h2>',
'<sub>Selected from public repositories · dynamically refreshed</sub>',
'',
'<table width="100%">',
projectCards,
'</table>',
'',
'<p align="center"><a href="https://github.com/'+username+'?tab=repositories"><b>Explore all repositories ↗</b></a></p>',
'',
'<h2 align="center">📊 &nbsp; GITHUB ANALYTICS</h2>',
'<div align="center"><img src="https://github-readme-stats.vercel.app/api?username='+username+'&show_icons=true&hide_border=true&bg_color=080b16&title_color=c4b5fd&icon_color=67e8f9&text_color=cbd5e1" height="165"/> <img src="https://github-readme-stats.vercel.app/api/top-langs/?username='+username+'&layout=compact&hide_border=true&bg_color=080b16&title_color=c4b5fd&text_color=cbd5e1" height="165"/></div>',
'',
'<div align="center"><img src="https://github-readme-activity-graph.vercel.app/graph?username='+username+'&bg_color=080b16&color=c4b5fd&line=67e8f9&point=ffffff&area=true&hide_border=true" width="100%"/></div>',
'',
'<p align="center"><sub>✨ Auto-generated from public GitHub data · Private repositories excluded</sub></p>',
'</div>'
].join('\n');
await write('README.md',readme);
await write('assets/profile-universe.svg',hero);
await write('assets/nebula-hero.svg',hero);
await Promise.all(projectArts.map(p=>write('assets/projects/'+slug(p.r.name)+'.svg',p.art)));
await write('assets/solar-data.json',JSON.stringify({username,profile,publicRepositories:repos.map(r=>({name:r.name,description:r.description,language:r.language,stars:r.stargazers_count,updated_at:r.updated_at,url:r.html_url})),languages:langs,totalStars:stars},null,2));
console.log('Neon profile generated for '+repos.length+' public repositories and '+langs.length+' languages.');
async function write(path,content){const fs=await import('node:fs/promises');await fs.mkdir(path.split('/').slice(0,-1).join('/')||'.',{recursive:true});await fs.writeFile(path,content);}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
