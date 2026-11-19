// Dynamic GitHub solar system profile generator
// Uses only public profile/repository endpoints. Private repositories are never requested.
const username = process.env.GITHUB_USERNAME || 'chvnagarjunababu14-boop';
const token = process.env.GITHUB_TOKEN;
const headers = { 'Accept': 'application/vnd.github+json', 'User-Agent': 'solar-profile-generator' };
if (token) headers.Authorization = `Bearer ${token}`;
async function api(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${url}`);
  return res.json();
}
const profile = await api(`https://api.github.com/users/${username}`);
const repos = await api(`https://api.github.com/users/${username}/repos?type=public&sort=updated&per_page=100`);
const publicRepos = repos.filter(r => !r.private && !r.archived).slice(0, 24);
const langsByRepo = await Promise.all(publicRepos.map(r => api(r.languages_url)));
const totals = {};
langsByRepo.forEach(obj => Object.entries(obj).forEach(([lang, bytes]) => totals[lang] = (totals[lang] || 0) + bytes));
const languages = Object.entries(totals).sort((a,b)=>b[1]-a[1]).slice(0,8);
const langColors = { JavaScript:'#f1e05a', TypeScript:'#3178c6', Python:'#3572A5', Java:'#b07219', C:'#555555', 'C++':'#f34b7d', Rust:'#dea584', Go:'#00ADD8', HTML:'#e34c26', CSS:'#563d7c', Kotlin:'#A97BFF', Swift:'#F05138', Shell:'#89e051', PHP:'#4F5D95', Ruby:'#701516', Dart:'#00B4AB', Lua:'#000080', 'Jupyter Notebook':'#DA5B0B', Vue:'#41b883', Svelte:'#ff3e00' };
const colors = ['#57d3ff','#8c7bff','#f6c85f','#ff7b91','#58e0b5','#ff9d57','#a6e86b','#d28cff'];
const planets = publicRepos.map((r,i)=>({r,lang:r.language||'Other',color:langColors[r.language]||colors[i%colors.length],orbit:115+(i%6)*38,size:6+Math.min(9,Math.log2(r.stargazers_count+1)*2),angle:(i*137.5)%360}));
const width=1000,height=760,cx=500,cy=380;
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="760" viewBox="0 0 1000 760"><defs><radialGradient id="bg"><stop offset="0" stop-color="#111d3c"/><stop offset="1" stop-color="#030611"/></radialGradient><radialGradient id="sun"><stop offset="0" stop-color="#fff8cc"/><stop offset=".35" stop-color="#ffdf67"/><stop offset="1" stop-color="#ff8d24"/></radialGradient><filter id="glow"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="1000" height="760" rx="22" fill="url(#bg)"/> <g fill="#fff"> `;
for(let i=0;i<150;i++){let x=(i*97.31)%1000,y=(i*53.79)%760,opacity=.25+((i*17)%75)/100;svg+=`<circle cx="${x}" cy="${y}" r="${i%7===0?1.5:0.8}" opacity="${opacity}"><animate attributeName="opacity" values="${opacity};${Math.min(1,opacity+.4)};${opacity}" dur="${2+(i%5)}s" repeatCount="indefinite"/></circle>`;}
svg+=`</g><circle cx="${cx}" cy="${cy}" r="55" fill="url(#sun)" filter="url(#glow)"/><circle cx="${cx}" cy="${cy}" r="62" fill="none" stroke="#ffcb58" opacity=".18"/><text x="${cx}" y="${cy+85}" fill="#fff" font-size="17" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold">${escapeXml(profile.login)}</text><text x="${cx}" y="${cy+106}" fill="#9bb8ef" font-size="12" text-anchor="middle" font-family="Arial,sans-serif">CENTRAL STAR</text>`;
planets.forEach(({r,lang,color,orbit,size,angle},i)=>{const x=cx+Math.cos(angle*Math.PI/180)*orbit,y=cy+Math.sin(angle*Math.PI/180)*orbit;svg+=`<ellipse cx="${cx}" cy="${cy}" rx="${orbit}" ry="${orbit*.68}" transform="rotate(-18 ${cx} ${cy})" fill="none" stroke="#647aa0" stroke-opacity=".23" stroke-width="1"/><g><circle cx="${x}" cy="${y}" r="${size}" fill="${color}" filter="url(#glow)"/><circle cx="${x}" cy="${y}" r="${size+3}" fill="none" stroke="${color}" opacity=".2"/><text x="${x}" y="${y-size-9}" text-anchor="middle" fill="#e6edff" font-family="Arial,sans-serif" font-size="11">${escapeXml(truncate(r.name,18))}</text><text x="${x}" y="${y+size+13}" text-anchor="middle" fill="${color}" font-family="Arial,sans-serif" font-size="9">${escapeXml(lang)} · ★ ${r.stargazers_count}</text></g>`;});
svg+=`<text x="500" y="40" fill="#c7d7ff" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="bold">THE ${escapeXml(username.toUpperCase())} SOLAR SYSTEM</text><text x="500" y="64" fill="#8299c7" text-anchor="middle" font-family="Arial,sans-serif" font-size="12">Public repositories: ${publicRepos.length} · Total stars: ${publicRepos.reduce((n,r)=>n+r.stargazers_count,0)} · Languages: ${languages.length}</text><text x="500" y="735" fill="#657a9f" text-anchor="middle" font-family="Arial,sans-serif" font-size="11">Projects positioned by generated orbital layout · Planet color = primary language</text></svg>`;
await writeFile('assets/solar-system.svg', svg);
await writeFile('assets/solar-data.json', JSON.stringify({username, profile, repositories: publicRepos.map(r=>({name:r.name, description:r.description, language:r.language, stars:r.stargazers_count, updated_at:r.updated_at, url:r.html_url})), languages: languages.map(([name,bytes])=>({name,bytes})), totalStars: publicRepos.reduce((n,r)=>n+r.stargazers_count,0)}, null, 2));
const projectLines = publicRepos.slice(0,12).map(r=>`- [${r.name}](${r.html_url}) — ${r.description||'Public project'} · ${r.language||'Mixed'} · ⭐ ${r.stargazers_count}`).join('\n') || 'No public projects found.';
const stackLine = languages.map(([l])=>`**${l}**`).join(' · ') || 'No language data available yet.';
await updateReadme('PROJECTS',projectLines);
await updateReadme('STACK',stackLine);
function escapeXml(s=''){return String(s).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&apos;'}[c]));}
function truncate(s,n){return s.length>n?s.slice(0,n-1)+'…':s;}
async function writeFile(path,content){await import('node:fs/promises').then(fs=>fs.mkdir(path.split('/').slice(0,-1).join('/')||'.',{recursive:true}));await import('node:fs/promises').then(fs=>fs.writeFile(path,content));}
async function updateReadme(section,content){const fs=await import('node:fs/promises');let md=await fs.readFile('README.md','utf8');const start=`<!-- ${section}:START -->`,end=`<!-- ${section}:END -->`;const re=new RegExp(start+'[\\s\\S]*?'+end);md=md.replace(re,`${start}\n${content}\n${end}`);await fs.writeFile('README.md',md);}
await writeFile('assets/glass-hero.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="420" viewBox="0 0 1000 420">
<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#070b18"/><stop offset="1" stop-color="#151b35"/></linearGradient><linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff" stop-opacity=".12"/><stop offset="1" stop-color="#8aa7ff" stop-opacity=".035"/></linearGradient><radialGradient id="glow"><stop stop-color="#7c5cff" stop-opacity=".55"/><stop offset="1" stop-color="#7c5cff" stop-opacity="0"/></radialGradient><filter id="blur"><feGaussianBlur stdDeviation="35"/></filter></defs>
<rect width="1000" height="420" rx="30" fill="url(#bg)"/><circle cx="190" cy="80" r="180" fill="url(#glow)" filter="url(#blur)"/><circle cx="820" cy="350" r="210" fill="#1a9dff" opacity=".12" filter="url(#blur)"/>
<g stroke="#9cb7ff" opacity=".1"><path d="M0 80H1000M0 160H1000M0 240H1000M0 320H1000M100 0V420M200 0V420M300 0V420M400 0V420M500 0V420M600 0V420M700 0V420M800 0V420M900 0V420"/></g>
<rect x="28" y="28" width="944" height="364" rx="24" fill="url(#glass)" stroke="#b7c8ff" stroke-opacity=".25"/>
<circle cx="78" cy="74" r="7" fill="#ff6e85"/><circle cx="100" cy="74" r="7" fill="#ffd166"/><circle cx="122" cy="74" r="7" fill="#64e7ba"/>
<text x="66" y="130" font-family="Arial,sans-serif" font-size="15" letter-spacing="5" fill="#8fa9e8">DEVELOPER PROFILE / SYSTEM ONLINE</text>
<text x="66" y="190" font-family="Arial,sans-serif" font-size="52" font-weight="700" fill="#f1f5ff">StarLord</text>
<text x="66" y="232" font-family="Arial,sans-serif" font-size="23" fill="#b9c8ef">Building software. Exploring ideas. Shipping projects.</text>
<text x="66" y="285" font-family="Arial,sans-serif" font-size="16" fill="#8fa4d1">Full-stack development · Data · Automation · AI</text>
<g transform="translate(66 330)"><rect width="172" height="34" rx="17" fill="#7c5cff" fill-opacity=".2" stroke="#9a84ff" stroke-opacity=".4"/><text x="86" y="22" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#d5cbff">GITHUB / ${username}</text></g>
<g transform="translate(810 140)"><circle r="66" fill="#ffffff" fill-opacity=".035" stroke="#9cb7ff" stroke-opacity=".25"/><circle r="54" fill="#7c5cff" fill-opacity=".15"/><text y="8" text-anchor="middle" font-family="Arial,sans-serif" font-size="42" fill="#d7d2ff">✦</text><circle r="86" fill="none" stroke="#9cb7ff" stroke-opacity=".12" stroke-dasharray="4 8"/><circle cx="86" cy="0" r="5" fill="#6be5ff"><animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="20s" repeatCount="indefinite"/></circle></g>
<text x="66" y="380" font-family="Arial,sans-serif" font-size="12" fill="#6f84b6">A LITTLE CURIOSITY. A LOT OF BUILDING.</text></svg>`);
console.log(`Generated glass profile for ${publicRepos.length} public repositories and ${languages.length} languages.`);
