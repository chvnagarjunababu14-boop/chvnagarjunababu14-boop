// Nebula OS: dynamic GitHub profile generator. Public repository data only.
async function main(){
const username=process.env.GITHUB_USERNAME||'chvnagarjunababu14-boop';
const headers={Accept:'application/vnd.github+json','User-Agent':'nebula-profile'};
if(process.env.GITHUB_TOKEN)headers.Authorization='Bearer '+process.env.GITHUB_TOKEN;
async function api(url){const r=await fetch(url,{headers});if(!r.ok)throw new Error('GitHub API '+r.status+' at '+url);return r.json();}
const profile=await api('https://api.github.com/users/'+username);
const all=await api('https://api.github.com/users/'+username+'/repos?type=public&sort=updated&per_page=100');
const repos=all.filter(r=>!r.private&&!r.archived).slice(0,40);
const langmaps=await Promise.all(repos.map(r=>api(r.languages_url)));
const totals={};langmaps.forEach(m=>Object.entries(m).forEach(([k,v])=>totals[k]=(totals[k]||0)+v));
const langs=Object.entries(totals).sort((a,b)=>b[1]-a[1]).slice(0,8);
const palette={TypeScript:'#3178c6',JavaScript:'#f1e05a',Python:'#3572A5',Java:'#b07219',Rust:'#dea584',Kotlin:'#A97BFF',CSS:'#563d7c',HTML:'#e34c26',Go:'#00ADD8',C:'#555555','C++':'#f34b7d',PHP:'#4F5D95',Ruby:'#701516',Dart:'#00B4AB',Shell:'#89e051',SQL:'#e38c00'};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const stars=repos.reduce((n,r)=>n+r.stargazers_count,0);
const featured=[...repos].sort((a,b)=>(b.stargazers_count-a.stargazers_count)||new Date(b.updated_at)-new Date(a.updated_at)).slice(0,6);
const projectCards=featured.map((r,i)=>{const color=palette[r.language]||["#8b5cf6","#22d3ee","#f472b6","#fbbf24","#34d399","#60a5fa"][i%6];const bg={"TypeScript":"#10243d","Kotlin":"#251a3b","Python":"#132d42","Rust":"#2b2019","JavaScript":"#292719","CSS":"#211b39","Java":"#302018"}[r.language]||["#201832","#102b36","#301b2a","#302715","#153025","#17263a"][i%6];const badge="https://img.shields.io/badge/"+encodeURIComponent(r.language||"Multi--language").replace(/%20/g,"_")+"-"+color.replace("#","")+"?style=flat-square&logo="+encodeURIComponent((r.language||"code").toLowerCase())+"&logoColor=white";const desc=esc((r.description||("A "+(r.language||"software")+" project from my build universe.")).slice(0,100));return '<td width="50%" valign="top" bgcolor="'+bg+'"><table width="100%"><tr><td><sub><font color="'+color+'">✦ FEATURED BUILD / 0'+(i+1)+'</font></sub></td><td align="right"><sub><font color="'+color+'">● SIGNAL</font></sub></td></tr></table><h3><a href="'+r.html_url+'"><font color="'+color+'">'+esc(r.name)+'</font></a></h3><sub>'+desc+'</sub><br/><br/><img src="'+badge+'" alt="'+esc(r.language||"Multi-language")+'"/> <sub>★ '+r.stargazers_count+' &nbsp; · &nbsp; '+new Date(r.updated_at).toISOString().slice(0,10)+'</sub><br/><br/><font color="'+color+'">━━━━━━━━━━━━━━━━━━━━━━</font></td>';}).reduce((a,x,i)=>{if(i%2===0)a.push([x]);else a[a.length-1].push(x);return a;},[]).map(row=>'<tr>'+row.join('')+(row.length===1?'<td width="50%" bgcolor="#171a2b"></td>':'')+'</tr>').join('');const stack=langs.map(([l,b])=>{const percent=Math.round(b/Math.max(1,langs.reduce((s,x)=>s+x[1],0))*100);return '<img src="https://img.shields.io/badge/'+encodeURIComponent(l).replace(/%20/g,'_')+'-'+(palette[l]||'#8b5cf6').replace('#','')+'?style=flat-square&logo='+encodeURIComponent(l.toLowerCase())+'&logoColor=white" alt="'+esc(l)+'"/> <sub>'+percent+'%</sub>';}).join(' &nbsp; ');
const dots=Array.from({length:90},(_,i)=>{const x=(i*137.5)%1060+20,y=(i*79.3)%370+20,r=(i%7===0)?1.8:0.8;return '<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+r+'" fill="#b9d9ff" opacity="'+(0.12+(i%5)*.1)+'"/>';}).join('');
const hero='<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="470" viewBox="0 0 1100 470"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#050713"/><stop offset=".52" stop-color="#10172b"/><stop offset="1" stop-color="#071d2c"/></linearGradient><linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#8fa9ff" stop-opacity=".025"/></linearGradient><linearGradient id="aurora" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#8b5cf6" stop-opacity="0"/><stop offset=".45" stop-color="#8b5cf6" stop-opacity=".55"/><stop offset=".75" stop-color="#22d3ee" stop-opacity=".45"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/></linearGradient><radialGradient id="nebula"><stop stop-color="#8b5cf6" stop-opacity=".5"/><stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/></radialGradient><filter id="blur"><feGaussianBlur stdDeviation="34"/></filter></defs><rect width="1100" height="470" rx="30" fill="url(#bg)"/><circle cx="180" cy="90" r="250" fill="url(#nebula)" filter="url(#blur)"/><circle cx="930" cy="390" r="280" fill="#00c2ff" opacity=".09" filter="url(#blur)"/><g>'+dots+'</g><path d="M-50 210 C150 130 260 300 430 200 S790 120 1150 210" stroke="url(#aurora)" stroke-width="95" fill="none" opacity=".25"><animate attributeName="d" dur="14s" repeatCount="indefinite" values="M-50 210 C150 130 260 300 430 200 S790 120 1150 210;M-50 240 C150 290 260 120 430 240 S790 300 1150 180;M-50 210 C150 130 260 300 430 200 S790 120 1150 210"/></path><rect x="22" y="22" width="1056" height="426" rx="24" fill="url(#glass)" stroke="#b6caff" stroke-opacity=".23"/><g><circle cx="55" cy="55" r="5.5" fill="#ff6782"/><circle cx="75" cy="55" r="5.5" fill="#ffd166"/><circle cx="95" cy="55" r="5.5" fill="#61e7bd"/></g><text x="62" y="111" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" letter-spacing="5" fill="#91a9df">PERSONAL DEVELOPER UNIVERSE / 2026</text><text x="62" y="185" font-family="Arial,sans-serif" font-size="60" font-weight="700" fill="#f4f7ff">'+esc(profile.name||username)+'</text><text x="65" y="228" font-family="Arial,sans-serif" font-size="23" fill="#b8c8ef">Ideas into code. Curiosity into creations.</text><text x="65" y="270" font-family="Arial,sans-serif" font-size="16" fill="#93a9d5">'+esc(profile.bio||'Developer · Builder · Explorer')+'</text><g transform="translate(65 316)"><rect width="225" height="42" rx="21" fill="#8b5cf6" fill-opacity=".14" stroke="#b09aff" stroke-opacity=".35"/><text x="112" y="26" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" letter-spacing="1.4" fill="#ded5ff">⌘  EXPLORE MY WORK</text></g><g transform="translate(865 182)"><circle r="108" fill="none" stroke="#9caeff" stroke-opacity=".15" stroke-dasharray="2 9"/><circle r="84" fill="none" stroke="#9caeff" stroke-opacity=".18"/><circle r="62" fill="#8b5cf6" fill-opacity=".07" stroke="#b6a4ff" stroke-opacity=".3"/><circle r="42" fill="#7c5cff" fill-opacity=".13"/><text y="14" text-anchor="middle" font-size="44" fill="#e1d7ff">✦</text><circle cx="84" cy="0" r="7" fill="#5ee7ff"><animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="18s" repeatCount="indefinite"/></circle><circle cx="-64" cy="-60" r="4" fill="#f0abfc"><animate attributeName="opacity" values=".3;1;.3" dur="3.5s" repeatCount="indefinite"/></circle><circle cx="30" cy="100" r="4" fill="#60a5fa"><animate attributeName="opacity" values="1;.25;1" dur="2.8s" repeatCount="indefinite"/></circle></g><text x="62" y="409" font-family="Arial,sans-serif" font-size="11" letter-spacing="3" fill="#6f84b6">BUILD / EXPERIMENT / LEARN / REPEAT</text><text x="1020" y="409" text-anchor="end" font-family="JetBrains Mono,Consolas,monospace" font-size="11" fill="#6f84b6">[ SYSTEM ONLINE ]</text></svg>';
const readme=[
'<div align="center">',
'',
'<img src="./assets/profile-universe.svg" width="100%" alt="Animated nebula and developer electron universe"/>',
'',
'<h1>✦ '+esc(profile.name||username)+'</h1>',
'<p><b>Developer · Builder · Explorer</b></p>',
'<p>Turning curiosity into code—and ideas into things that work.</p>',
'',
'<a href="https://github.com/'+username+'?tab=repositories">⌁ Explore projects</a> &nbsp; · &nbsp; <a href="https://github.com/'+username+'">⌁ GitHub profile</a>',
'',
'</div>',
'',
'<div align="center"><table><tr><td align="center" bgcolor="#211631"><h2>✦ '+repos.length+'</h2><sub>PUBLIC PROJECTS</sub></td><td align="center" bgcolor="#10283b"><h2>★ '+stars+'</h2><sub>STARS EARNED</sub></td><td align="center" bgcolor="#18263b"><h2>⌁ '+langs.length+'</h2><sub>LANGUAGES</sub></td><td align="center" bgcolor="#2a1b2e"><h2>◉ '+profile.followers+'</h2><sub>FOLLOWERS</sub></td></tr></table></div>',
'',
'---',
'',
'<h2>🚀 &nbsp; Featured builds</h2>',
'<sub>Selected from public repositories · ranked by stars and recent activity</sub>',
'',
'<table width="100%">',
projectCards,
'</table>',
'',
'<div align="right"><a href="https://github.com/'+username+'?tab=repositories"><b>Explore all repositories ↗</b></a></div>',
'',
'---',
'',
'<h2>🧬 &nbsp; Languages in my orbit</h2>',
'<div align="center">',
stack,
'</div>',
'',
'---',
'',
'<h2>📡 &nbsp; GitHub telemetry</h2>',
'<div align="center">',
'<img src="https://github-readme-stats.vercel.app/api?username='+username+'&show_icons=true&hide_border=true&bg_color=080b16&title_color=c4b5fd&icon_color=67e8f9&text_color=cbd5e1&rank_icon=github" height="165"/>',
'<img src="https://github-readme-stats.vercel.app/api/top-langs/?username='+username+'&layout=compact&hide_border=true&bg_color=080b16&title_color=c4b5fd&text_color=cbd5e1" height="165"/>',
'</div>',
'',
'<div align="center">',
'<img src="https://github-readme-activity-graph.vercel.app/graph?username='+username+'&bg_color=080b16&color=c4b5fd&line=67e8f9&point=ffffff&area=true&hide_border=true" width="100%"/>',
'</div>',
'',
'<div align="center"><sub>✦ Automatically refreshed from public GitHub data · Built with curiosity</sub></div>'
].join('\n');
await write('README.md',readme);await write('assets/nebula-hero.svg',hero);await write('assets/solar-data.json',JSON.stringify({username,profile,publicRepositories:repos.map(r=>({name:r.name,description:r.description,language:r.language,stars:r.stargazers_count,updated_at:r.updated_at,url:r.html_url})),languages:langs,totalStars:stars},null,2));
console.log('Nebula profile generated for '+repos.length+' repositories and '+langs.length+' languages.');
async function write(path,content){const fs=await import('node:fs/promises');await fs.mkdir(path.split('/').slice(0,-1).join('/')||'.',{recursive:true});await fs.writeFile(path,content);}

}
main().catch(error=>{console.error(error);process.exitCode=1;});
