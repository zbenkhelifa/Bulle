/* =====================================================================
   MISSION BULLE — jeu de plateforme illustré (SNT, thème Réseaux sociaux)
   JavaScript pur, rendu canvas 2D. Aucune dépendance.
   ===================================================================== */

/* ---------- Contenus pédagogiques ---------- */
const INFOS = [
  {a:'Pseudo : Astro_77', ok:true, why:'Un pseudo protège ton vrai nom.'},
  {a:'Mon adresse : 12 rue des Lilas', ok:false, why:'ton adresse permet de te trouver chez toi.'},
  {a:'Passion : l’astronomie', ok:true, why:'Partager une passion ne dit pas où tu vis.'},
  {a:'Mon mot de passe', ok:false, why:'un mot de passe ne se partage jamais, avec personne.'},
  {a:'Photo de mon chat', ok:true, why:'Une photo sans visage ni lieu reconnaissable, ça va.'},
  {a:'Mon numéro de portable', ok:false, why:'n’importe qui pourrait t’appeler ou te harceler.'}
];
const ADS = ['Télescope -50 %, rien que pour toi !','Croquettes pour ton chat : promo !','Tu aimes les étoiles ? Clique ici !','Offre spéciale près de chez toi'];
const LEVERS = {
  loc:{on:'Localisation : activée', off:'Localisation : coupée', msg:'Localisation coupée : les traceurs GPS perdent ta trace.'},
  ads:{on:'Pubs personnalisées : oui', off:'Pubs personnalisées : non', msg:'Publicité personnalisée désactivée : tes centres d’intérêt ne servent plus à te cibler.'},
  priv:{on:'Compte privé : non', off:'Compte privé : oui', msg:'Compte privé activé : seules les personnes que tu acceptes voient tes publications.'}
};
const FRIENDS = {L:{name:'Léa',col:'#ff8fb1'}, I:{name:'Inès',col:'#ffd166'}, Y:{name:'Yanis',col:'#6fd3ff'}, C:{name:'Chloé',col:'#9be58f'},
                 S:{name:'Sam',col:'#ffb36b'}, M:{name:'Malik',col:'#c3a6ff'}, J:{name:'Jade',col:'#ff9a8a'}};
const FEDGES = [['L','I'],['I','Y'],['Y','C'],['C','S'],['Y','M'],['M','J']];
function eccOf(n){ const adj={}; Object.keys(FRIENDS).forEach(k=>adj[k]=[]); FEDGES.forEach(([a,b])=>{adj[a].push(b);adj[b].push(a);});
  const d={[n]:0}, q=[n]; while(q.length){ const u=q.shift(); adj[u].forEach(v=>{ if(!(v in d)){ d[v]=d[u]+1; q.push(v); } }); } return Math.max(...Object.values(d)); }
const ECC = Object.fromEntries(Object.keys(FRIENDS).map(k=>[k,eccOf(k)]));
const RADIUS = Math.min(...Object.values(ECC)), DIAM = Math.max(...Object.values(ECC));
const CENTRE = Object.keys(ECC).find(k=>ECC[k]===RADIUS);
const REFLEXES = [
  {t:'Ne pas répondre', ok:true, why:'Répondre sur le même ton alimente le harcèlement.'},
  {t:'Faire des captures d’écran', ok:true, why:'Garde des preuves : messages, dates, pseudos.'},
  {t:'Bloquer et signaler', ok:true, why:'Chaque réseau social permet de bloquer un compte et de signaler un message.'},
  {t:'En parler · 3018', ok:true, why:'Parles-en à un adulte de confiance. Le 3018 est le numéro national, gratuit et confidentiel, contre le cyberharcèlement.'},
  {t:'Répondre par une insulte', ok:false, why:'insulter en retour fait grossir la tempête et peut te mettre en tort.'},
  {t:'Partager la rumeur', ok:false, why:'partager une moquerie, c’est participer au harcèlement.'},
  {t:'Garder tout pour soi', ok:false, why:'rester seul face au harcèlement rend les choses plus dures : il faut en parler.'}
];
const RAIN = ['Haha nul !','Rumeur…','Moquerie','Exclu·e !','Photo gênante','Personne t’aime','Mème méchant'];

/* ---------- Personnages ---------- */
const HEROES = [
  {id:'lou',  name:'Lou',  role:'Voltigeuse', color:'--c-lou',  power:'Double saut',
   desc:'Peut <b>sauter une seconde fois</b> en plein vol.', say:'Toujours un saut d’avance.', speed:2.2, hearts:3, dj:true},
  {id:'zak',  name:'Zak',  role:'Sprinteur', color:'--c-zak', power:'Turbo',
   desc:'<b>Court 30 % plus vite</b> que les autres.', say:'Personne ne me rattrape.', speed:2.85, hearts:3, dj:false},
  {id:'mina', name:'Mina', role:'Gardienne', color:'--c-mina', power:'Blindage',
   desc:'Commence chaque chapitre avec <b>4 cœurs</b> au lieu de 3.', say:'Je garde la tête froide.', speed:2.2, hearts:4, dj:false}
];
const INK='#1d1a33';
const PAL_LIT={lou:'#8a6cff',zak:'#ff8a2a',mina:'#22b39a',guide:'#9aa3bd',eye:'#ffffff',pupil:INK,ink:INK};
const PAL_VAR={lou:'var(--c-lou)',zak:'var(--c-zak)',mina:'var(--c-mina)',guide:'var(--c-guide)',eye:'var(--eye)',pupil:'var(--pupil)',ink:'var(--avink)'};

function avatar(id, lit){
  const C=lit?PAL_LIT:PAL_VAR;
  const st=(fill,w=5)=>`style="fill:${fill};stroke:${C.ink};stroke-width:${w};stroke-linejoin:round"`;
  const line=(d,col,w=4)=>`<path d="${d}" style="fill:none;stroke:${C.ink};stroke-width:${w+5};stroke-linecap:round"/><path d="${d}" style="fill:none;stroke:${col};stroke-width:${w};stroke-linecap:round"/>`;
  const eyes=y=>`<circle cx="38" cy="${y}" r="7.5" ${st(C.eye,3)}/><circle cx="62" cy="${y}" r="7.5" ${st(C.eye,3)}/>
    <circle cx="39.5" cy="${y+1}" r="3.6" style="fill:${C.pupil}"/><circle cx="63.5" cy="${y+1}" r="3.6" style="fill:${C.pupil}"/>
    <circle cx="41" cy="${y-0.5}" r="1.2" style="fill:#fff"/><circle cx="65" cy="${y-0.5}" r="1.2" style="fill:#fff"/>`;
  const cheeks=y=>`<ellipse cx="26" cy="${y}" rx="5" ry="3" style="fill:#ff9eb5;opacity:.75"/><ellipse cx="74" cy="${y}" rx="5" ry="3" style="fill:#ff9eb5;opacity:.75"/>`;
  const mouth=y=>`<path d="M42 ${y} Q50 ${y+6} 58 ${y}" style="fill:none;stroke:${C.pupil};stroke-width:3.2;stroke-linecap:round"/>`;
  let s='';
  if(id==='guide'){
    s = `<circle cx="50" cy="60" r="34" ${st(C.guide)}/>` + eyes(58) + cheeks(70) + mouth(72)
      + `<path d="M20 36 L80 36 L73 16 L27 16 Z" ${st('#5b6ee1',4)}/><rect x="16" y="33" width="68" height="7" rx="3" ${st('#3f4fc0',3)}/>
         <circle cx="50" cy="25" r="6" ${st('#ffc93c',3)}/><path d="M47 25 L49.5 27.5 L53.5 22.5" style="fill:none;stroke:${C.pupil};stroke-width:2;stroke-linecap:round"/>`;
  } else {
    if(id==='zak') s += line('M2 56 H12','#ff8a2a',3)+line('M0 66 H11','#ff8a2a',3)+line('M4 76 H12','#ff8a2a',3);
    s += `<path d="M28 78 L14 98 L46 84 Z" ${st(C[id])}/><rect x="15" y="26" width="70" height="62" rx="22" ${st(C[id])}/>
          <path d="M26 38 Q34 30 44 31" style="fill:none;stroke:#fff;stroke-width:4;stroke-linecap:round;opacity:.5"/>`
       + eyes(58) + cheeks(70) + mouth(72);
    if(id==='lou') s += line('M22 50 Q50 4 78 50','#ff6b9a',5)+`<rect x="8" y="44" width="14" height="22" rx="6" ${st('#ff6b9a',4)}/><rect x="78" y="44" width="14" height="22" rx="6" ${st('#ff6b9a',4)}/>`;
    if(id==='zak') s += `<path d="M20 36 Q50 4 80 36 Z" ${st('#2a9d8f',4)}/><path d="M72 34 Q92 30 99 39 L76 40 Z" ${st('#2a9d8f',4)}/><circle cx="50" cy="14" r="4" ${st('#ffc93c',3)}/>`;
    if(id==='mina') s += `<circle cx="38" cy="58" r="11" style="fill:none;stroke:${C.ink};stroke-width:3.5"/><circle cx="62" cy="58" r="11" style="fill:none;stroke:${C.ink};stroke-width:3.5"/>
          <path d="M49 57 Q50 55 51 57" style="fill:none;stroke:${C.ink};stroke-width:3.5"/>
          <path d="M72 76 L75 83 L82 83 L76.5 87.5 L79 95 L72 90 L65 95 L67.5 87.5 L62 83 L69 83 Z" ${st('#ffc93c',3)}/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 108 108" width="100" height="100" aria-hidden="true">${s}</svg>`;
}
const inner = svg => svg.replace(/<\/?svg[^>]*>/g,'');

/* ---------- Outils de dessin ---------- */
const TAU=Math.PI*2;
function rng(seed){ let s=Math.floor(seed)%2147483647; if(s<=0) s+=2147483646; return ()=>(s=s*16807%2147483647)/2147483647; }
function rrp(g,x,y,w,h,r){
  const [a,b,c,d]=Array.isArray(r)?r:[r,r,r,r];
  g.beginPath(); g.moveTo(x+a,y); g.lineTo(x+w-b,y); if(b) g.arcTo(x+w,y,x+w,y+b,b);
  g.lineTo(x+w,y+h-c); if(c) g.arcTo(x+w,y+h,x+w-c,y+h,c);
  g.lineTo(x+d,y+h); if(d) g.arcTo(x,y+h,x,y+h-d,d);
  g.lineTo(x,y+a); if(a) g.arcTo(x,y,x+a,y,a); g.closePath();
}
function inked(g,fill,lw=1.6){ g.fillStyle=fill; g.fill(); g.strokeStyle=INK; g.lineWidth=lw; g.stroke(); }
function inkLine(g,pts,col,w){ g.beginPath(); pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));
  g.strokeStyle=INK; g.lineWidth=w+2.4; g.stroke(); g.strokeStyle=col; g.lineWidth=w; g.stroke(); }
function cloud(g,x,y,s,fill,edge){
  const c=[[0,0,1],[-1.1,.25,.72],[1.1,.3,.7],[-.45,-.45,.75],[.5,-.4,.68]];
  g.fillStyle=edge; c.forEach(([dx,dy,r])=>{ g.beginPath(); g.arc(x+dx*s,y+dy*s,r*s+1.6,0,TAU); g.fill(); });
  g.fillStyle=fill; c.forEach(([dx,dy,r])=>{ g.beginPath(); g.arc(x+dx*s,y+dy*s,r*s,0,TAU); g.fill(); });
  g.fillRect(x-1.6*s,y+.2*s,3.2*s,.6*s);
}
function starPath(g,x,y,R,r){ g.beginPath(); for(let k=0;k<10;k++){ const a=-Math.PI/2+k*Math.PI/5, rr=k%2?r:R; g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr); } g.closePath(); }
function heartPath(g,x,y,s){ g.beginPath(); g.moveTo(x,y+s*.9); g.bezierCurveTo(x-s*1.4,y,x-s*.7,y-s*1,x,y-s*.3); g.bezierCurveTo(x+s*.7,y-s*1,x+s*1.4,y,x,y+s*.9); g.closePath(); }
function gear(g,x,y,R,n,fill){
  g.beginPath(); for(let k=0;k<n*4;k++){ const a=k*TAU/(n*4), rr=(k%4<2)?R:R*.8; g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr); } g.closePath(); inked(g,fill,2);
  g.beginPath(); g.arc(x,y,R*.42,0,TAU); inked(g,'#20394a',1.8); g.beginPath(); g.arc(x,y,R*.16,0,TAU); inked(g,fill,1.4);
}

/* ---------- Décors peints ---------- */
function paintTownSky(g,w,h,r){
  const sx=w*.72, sy=52, gl=g.createRadialGradient(sx,sy,8,sx,sy,80);
  gl.addColorStop(0,'rgba(255,245,170,.9)'); gl.addColorStop(1,'rgba(255,245,170,0)'); g.fillStyle=gl; g.fillRect(sx-80,sy-80,160,160);
  g.beginPath(); g.arc(sx,sy,24,0,TAU); g.fillStyle='#fff3a6'; g.fill();
  for(let i=0;i<6;i++) cloud(g,60+i*160+r()*40,30+r()*70,11+r()*8,'#ffffff','rgba(90,140,200,.35)');
}
function paintTownHills(g,w,h,r){
  const hill=(base,a1,p1,a2,p2,ph,col)=>{ g.beginPath(); g.moveTo(0,h);
    for(let x=0;x<=w;x+=8) g.lineTo(x,base+a1*Math.sin(TAU*p1*x/w+ph)+a2*Math.sin(TAU*p2*x/w)); g.lineTo(w,h); g.closePath(); g.fillStyle=col; g.fill(); };
  hill(165,16,2,6,5,0,'#a8e0a4');
  hill(188,12,3,5,7,1,'#86cf86');
  for(let i=0;i<14;i++){ const x=30+i*(w-60)/13+(r()-.5)*14, y=190+12*Math.sin(TAU*3*x/w+1)+5*Math.sin(TAU*7*x/w);
    g.fillStyle='#6cbc72'; g.beginPath(); g.arc(x,y-7,6+r()*3,0,TAU); g.fill(); }
}
function paintTownPhones(g,w,h,r){
  const scr=[['#ffb3c7','#ffd6a5'],['#a0e7e5','#b4f8c8'],['#cdb4ff','#ffc8dd'],['#fbe7a1','#bde0fe']];
  const icons=['#ff6b6b','#ffc93c','#2bb58a','#5b82ff','#b46cff','#ff8fb1'];
  for(let i=0;i<4;i++){
    const pw=64+r()*20, ph=120+r()*40, x=40+i*240+r()*30, y=262-ph, [c1,c2]=scr[i%4];
    rrp(g,x,y,pw,ph,14); inked(g,'#f7f7ff',2.2);
    const gr=g.createLinearGradient(0,y,0,y+ph); gr.addColorStop(0,c1); gr.addColorStop(1,c2);
    rrp(g,x+5,y+12,pw-10,ph-20,7); g.fillStyle=gr; g.fill(); g.strokeStyle=INK; g.lineWidth=1.3; g.stroke();
    rrp(g,x+pw/2-9,y+4,18,4,2); g.fillStyle=INK; g.fill();
    for(let row=0;row<5;row++) for(let col=0;col<3;col++){ const ix=x+12+col*((pw-24)/3), iy=y+20+row*18; if(iy>y+ph-30) break;
      rrp(g,ix,iy,11,11,3); inked(g,icons[(r()*icons.length)|0],1); }
    if(i%2===0){ const bx=x+pw+44; inkLine(g,[[bx,262],[bx,184]],'#c9c6e4',2);
      rrp(g,bx-26,150,52,30,10); inked(g,'#ffffff',2); g.beginPath(); g.moveTo(bx-10,179); g.lineTo(bx-16,190); g.lineTo(bx-1,179); inked(g,'#ffffff',2);
      g.fillStyle='#ffffff'; g.fillRect(bx-11,176,11,4); heartPath(g,bx,166,7); inked(g,'#ff6b8a',1.4); }
    else { const tx=x+pw+40; g.fillStyle=INK; g.fillRect(tx-3,210,6,60); g.fillStyle='#8a5a3c'; g.fillRect(tx-2,211,4,60);
      [[0,196,18],[-11,208,13],[11,208,13]].forEach(([dx,dy,rr])=>{ g.beginPath(); g.arc(tx+dx,dy,rr+1.6,0,TAU); g.fillStyle=INK; g.fill(); });
      [[0,196,18],[-11,208,13],[11,208,13]].forEach(([dx,dy,rr])=>{ g.beginPath(); g.arc(tx+dx,dy,rr,0,TAU); g.fillStyle='#57b36b'; g.fill(); }); }
  }
}
function paintGears(g,w,h,r){
  g.fillStyle='#20394a'; g.fillRect(0,0,w,h);
  g.fillStyle='rgba(255,255,255,.04)'; for(let x=0;x<w;x+=40) g.fillRect(x,0,2,h);
  gear(g,90,80,46,10,'#c99a3c'); gear(g,158,150,30,8,'#8fb3c4'); gear(g,250,62,22,7,'#c99a3c'); gear(g,262,196,34,9,'#8fb3c4');
  gear(g,40,200,18,6,'#c99a3c'); gear(g,210,26,14,6,'#8fb3c4');
}
function paintSkyStars(g,w,h,r){
  for(let i=0;i<80;i++){ const x=r()*w, y=r()*170, s=r()<.15?2.4:1.2; g.fillStyle=r()<.2?'#ffe9a8':'#dfe4ff'; g.fillRect(x-s/2,y-s/2,s,s);
    if(s>2){ g.fillRect(x-4,y-.5,8,1); g.fillRect(x-.5,y-4,1,8); } }
  const mx=w*.25, my=46; g.beginPath(); g.arc(mx,my,18,0,TAU); g.fillStyle='#fff3c4'; g.fill();
  g.globalCompositeOperation='destination-out'; g.beginPath(); g.arc(mx+8,my-5,15,0,TAU); g.fill(); g.globalCompositeOperation='source-over';
}
function paintSkyAurora(g,w,h,r){
  [['rgba(120,255,200,.13)',70],['rgba(180,140,255,.12)',92],['rgba(120,200,255,.1)',112]].forEach(([c,base],k)=>{
    g.beginPath(); for(let x=0;x<=w;x+=8) g.lineTo(x,base+14*Math.sin(TAU*2*x/w+k)+6*Math.sin(TAU*5*x/w)); g.strokeStyle=c; g.lineWidth=18; g.stroke(); });
}
function paintSkyIslands(g,w,h,r){
  for(let i=0;i<5;i++){ const x=60+i*190+r()*40, y=150+r()*60, iw=50+r()*40;
    g.fillStyle='#3b3372'; g.beginPath(); g.moveTo(x,y); g.lineTo(x+iw,y); g.lineTo(x+iw*.6,y+30); g.lineTo(x+iw*.35,y+34); g.closePath(); g.fill();
    rrp(g,x-3,y-4,iw+6,7,3); g.fillStyle='#4f478c'; g.fill();
    g.fillStyle='#4a4290'; g.beginPath(); g.arc(x+iw*.3,y-9,6,0,TAU); g.arc(x+iw*.7,y-7,4,0,TAU); g.fill(); }
}
function paintStormClouds(g,w,h,r){
  for(let i=0;i<9;i++) cloud(g,40+i*110+r()*30,26+r()*30,18+r()*10,'#3f4468','rgba(10,10,30,.4)');
  for(let i=0;i<7;i++) cloud(g,80+i*130+r()*30,70+r()*30,13+r()*6,'#4b5278','rgba(10,10,30,.35)');
}
function paintStormCity(g,w,h,r){
  let x=10; while(x<w-40){ const bw=34+r()*40, bh=70+r()*90, y=h-bh;
    g.fillStyle='#262b45'; g.fillRect(x,y,bw,bh);
    for(let yy=y+8; yy<h-10; yy+=10) for(let xx=x+5; xx<x+bw-6; xx+=8) if(r()<.3){ g.fillStyle='rgba(255,209,102,.6)'; g.fillRect(xx,yy,4,5); }
    x+=bw+6+r()*14; }
}
function paintStormRoofs(g,w,h,r){
  for(let i=0;i<4;i++){
    const x=30+i*240+r()*40, rw=110+r()*40, top=175+r()*20;
    rrp(g,x,top,rw,100,2); inked(g,'#6a5a70',2);
    g.beginPath(); g.moveTo(x-8,top+2); g.lineTo(x+rw/2,top-30); g.lineTo(x+rw+8,top+2); g.closePath(); inked(g,'#8a4a4a',2);
    rrp(g,x+rw*.7,top-34,12,24,1); inked(g,'#7a5a5a',1.8);
    for(let k=0;k<3;k++){ rrp(g,x+14+k*(rw-40)/2,top+18,16,14,2); inked(g,r()<.6?'#ffd166':'#3a3f5e',1.6); }
    const ax=x+rw*.3, ay=top-22; inkLine(g,[[ax,ay+8],[ax,ay-16]],'#c9c6e4',1.6); inkLine(g,[[ax-9,ay-10],[ax+9,ay-10]],'#c9c6e4',1.6);
  }
}

const THEMES={
  town:{ sky:[[0,'#6fb8f0'],[.7,'#bfe6ff'],[1,'#e6f7ff']],
    ground:{body:'#9b6a45',spot:'#7d5236',top:'#6cc56b',top2:'#3e9a4f',deco:'grass'}, plat:'plank', door:'#fff1c9', spikes:'flame',
    layers:[{f:.06,w:960,paint:paintTownSky},{f:.16,w:960,paint:paintTownHills},{f:.42,w:960,paint:paintTownPhones,haze:'rgba(140,190,240,.25)'}]},
  settings:{ sky:[[0,'#16293a'],[1,'#20394a']],
    ground:{body:'#3f5f73',spot:'#2b4454',top:'#5fe0c8',deco:'metal'}, plat:'grate', door:'#9fc8d6', spikes:'flame',
    layers:[{f:.5,w:320,h:256,tile:true,paint:paintGears,haze:'rgba(14,26,38,.5)'}]},
  sky:{ sky:[[0,'#141238'],[.6,'#35297a'],[1,'#6a4aa8']],
    ground:{body:'#8d6a57',spot:'#6f5243',top:'#7fd08a',top2:'#4fa862',deco:'grass'}, plat:'cloud', door:'#fff1c9', spikes:'flame',
    layers:[{f:.05,w:960,paint:paintSkyStars},{f:.09,w:960,paint:paintSkyAurora},{f:.22,w:960,paint:paintSkyIslands}]},
  storm:{ sky:[[0,'#262a45'],[.6,'#454b73'],[1,'#6a6f96']],
    ground:{body:'#6e4a4a',spot:'#553636',top:'#d0664b',top2:'#9c4434',deco:'roof'}, plat:'plank', door:'#fff1c9', spikes:'flame', rain:true,
    layers:[{f:.05,w:960,paint:paintStormClouds},{f:.16,w:960,paint:paintStormCity},{f:.4,w:960,paint:paintStormRoofs,haze:'rgba(40,44,80,.3)'}]}
};

/* ---------- Niveaux ---------- */
const T=16, GRAV=0.42, JUMP=7.2, MAXFALL=8, VH=270;
function makeLevel(w,h){
  const g=Array.from({length:h},()=>Array(w).fill('.'));
  const L={w,h,g,ents:[],start:{x:2,y:h-4}};
  L.fill=(x0,y0,x1,y1,c='#')=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++) if(y>=0&&y<h&&x>=0&&x<w) g[y][x]=c;};
  L.ground=(x0,x1,top=14)=>L.fill(x0,top,x1,h-1,'#');
  L.plat=(x,y,len)=>L.fill(x,y,x+len-1,y,'-');
  L.spikes=(x0,x1,y=13)=>L.fill(x0,y,x1,y,'^');
  L.ent=(type,tx,ty,o={})=>L.ents.push(Object.assign({type,tx,ty},o));
  L.coins=(x,y,n)=>{for(let i=0;i<n;i++) L.ent('coin',x+i,y);};
  return L;
}
const LEVELS = [
{ name:'Mon profil', theme:'town', exitLabel:'Publier mon profil',
  rules:['Saute pour attraper les <b>infos que tu peux rendre publiques</b> sur ton profil.',
         'Les <b>données sensibles</b> (adresse, mot de passe, numéro…) te coûtent un cœur : saute par-dessus ou passe dessous.',
         'Le bouton « Publier » ne s’ouvre qu’avec les <b>3 bonnes infos</b>. Les trolls se modèrent en leur sautant dessus.'],
  hint:'Avant de toucher une info, demande-toi : est-ce que je la dirais à un inconnu dans la rue ?',
  init:()=>({good:0, bad:0}),
  build(){
    const L=makeLevel(112,17); L.start={x:2,y:13};
    L.ground(0,20); L.coins(6,11,3); L.ent('info',13,11,{info:INFOS[0]});
    L.ground(24,44); L.ent('troll',30,13); L.ent('info',35,13,{info:INFOS[1]});
    L.plat(38,11,5); L.ent('coin',38,10); L.ent('coin',42,10); L.ent('info',40,10,{info:INFOS[2]});
    L.ent('check',43,12);
    L.ground(47,60); L.spikes(50,52); L.ent('coin',54,12); L.ent('info',55,11,{info:INFOS[3]}); L.ent('coin',56,12);
    L.ground(64,86); L.ent('check',65,12); L.plat(67,11,3); L.coins(67,10,3); L.plat(71,8,3); L.coins(71,7,3);
    L.plat(75,5,3); L.ent('info',76,4,{info:INFOS[4]}); L.ent('troll',79,13); L.ent('info',83,13,{info:INFOS[5]});
    L.ground(90,111); L.coins(92,12,5); L.ent('troll',99,13); L.ent('exit',106,12);
    return L;
  },
  status:g=>`Infos publiables : <b>${g.good}/3</b>`,
  canExit:g=>g.good>=3?true:`Ton profil est incomplet : il manque ${3-g.good} info(s) publiable(s). Reviens en arrière !`,
  bonus:g=>[[`Données sensibles évitées (${3-g.bad}/3)`,(3-g.bad)*15]],
  lesson:'Ton identité numérique, c’est tout ce qu’on peut trouver sur toi en ligne. Ce que tu publies peut être vu, copié et conservé longtemps. Garde pour toi les données sensibles : adresse, téléphone, mots de passe.'
},
{ name:'Salle des réglages', theme:'settings', exitLabel:'Enregistrer',
  rules:['Des <b>traceurs GPS</b> te suivent et des <b>pubs ciblées</b> surgissent sans arrêt.',
         'Actionne les <b>3 interrupteurs</b> : couper la localisation, refuser la pub personnalisée, passer en compte privé.',
         'Chaque réglage a un effet immédiat. Les pubs se ferment en leur sautant dessus, pas les traceurs.'],
  hint:'Le premier interrupteur est tout près, en hauteur. Les traceurs ne lâchent pas tant que la localisation est activée !',
  init:()=>({flags:{}, adsOn:true, closed:0}),
  build(){
    const L=makeLevel(112,17); L.start={x:2,y:13};
    L.ground(0,24); L.coins(5,12,3); L.ent('tracker',15,9); L.plat(17,11,3); L.plat(21,8,3);
    L.ent('lever',22,6,{key:'loc'}); L.ent('coin',21,7); L.ent('coin',23,7);
    L.ground(28,50); L.ent('tracker',33,9); L.spikes(37,39); L.ent('troll',44,13); L.ent('tracker',47,8); L.ent('check',49,12);
    L.ground(54,78); L.plat(57,11,3); L.plat(61,8,3); L.coins(61,7,3); L.plat(65,5,3); L.ent('lever',66,3,{key:'ads'});
    L.ent('troll',62,13); L.spikes(72,74); L.ent('check',77,12);
    L.ground(82,111); L.plat(86,11,4); L.ent('lever',88,9,{key:'priv'}); L.ent('troll',96,13); L.coins(98,12,4); L.ent('exit',106,12);
    return L;
  },
  update(g){
    if(g.adsOn && g.t%150===75){
      const fromRight=Math.random()<.7, e=spawn({type:'popup',tx:0,ty:0});
      e.x=fromRight?g.cam.x+VW+12:g.cam.x-40; e.hy=Math.max(g.cam.y+24,g.p.y-24-Math.random()*50); e.y=e.hy;
      e.vx=fromRight?-1.05:1.05; e.life=560; e.txt=ADS[((g.t/150)|0)%ADS.length]; g.ents.push(e);
    }
  },
  status:g=>'Réglages : '+[['loc','Localisation'],['ads','Pubs'],['priv','Compte privé']].map(([k,l])=>`<span class="chip ${g.flags[k]?'on':''}">${l}</span>`).join(' '),
  canExit:g=>{ const n=['loc','ads','priv'].filter(k=>!g.flags[k]).length; return n===0?true:`Il reste ${n} réglage(s) de confidentialité à faire avant d’enregistrer.`; },
  bonus:g=>[['Réglages de confidentialité (3/3)',30],[`Pubs fermées (${g.closed})`,0]],
  lesson:'Les réseaux sociaux sont gratuits parce qu’ils vivent de la publicité ciblée : tes données (centres d’intérêt, localisation, contacts) servent à te montrer des pubs. Si c’est gratuit, c’est souvent toi le produit. Les paramètres de confidentialité limitent ce que tu partages, et avec qui.'
},
{ name:'Graphe des amis', theme:'sky', exitLabel:'Lancer l’invitation',
  rules:['Chaque île est une personne (un <b>sommet</b>), chaque fil lumineux une amitié (une <b>arête</b>).',
         'Touche un ami pour connaître son <b>excentricité</b> : la distance jusqu’à l’ami le plus éloigné de lui.',
         'Trouve le <b>centre du graphe</b> : la personne à la plus petite excentricité. La sortie s’ouvre alors chez Sam.'],
  hint:'La mini-carte en haut à droite montre le graphe. Compare les excentricités de chacun.',
  autoRespawn:true, minimap:true,
  init:()=>({rung:new Set(), rings:0, found:false}),
  build(){
    const L=makeLevel(72,17); L.start={x:3,y:11};
    L.fill(1,12,7,13); L.ent('friend',5,10,{node:'L'});
    L.plat(10,12,3); L.coins(10,11,3);
    L.fill(15,12,21,13); L.ent('friend',17,10,{node:'I'}); L.ent('troll',20,11);
    L.plat(24,12,3); L.coins(24,11,3);
    L.fill(29,12,35,13); L.ent('friend',31,10,{node:'Y'});
    L.plat(33,9,3);
    L.fill(37,6,43,7); L.ent('friend',40,4,{node:'M'});
    L.plat(45,4,3); L.coins(45,3,3);
    L.fill(49,3,55,4); L.ent('friend',52,1,{node:'J'});
    L.plat(38,12,3); L.plat(43,12,3);
    L.fill(48,12,54,13); L.ent('friend',50,10,{node:'C'}); L.ent('troll',53,11);
    L.plat(57,12,3); L.coins(57,11,3);
    L.fill(62,12,69,13); L.ent('friend',64,10,{node:'S'}); L.ent('exit',67,10);
    return L;
  },
  status:g=>`Amis sonnés : <b>${g.rung.size}/7</b> · ${g.found?'<b>centre trouvé !</b>':'centre : ?'}`,
  canExit:g=>g.found?true:'L’invitation doit partir du centre du graphe. Trouve-le d’abord !',
  bonus:g=>[[`Centre trouvé en ${g.rings} essai(s)`, Math.max(0,70-10*(g.rings-1))]],
  lesson:`Un réseau social se représente par un graphe : les sommets sont les personnes, les arêtes les liens d’amitié. La distance entre deux personnes est le plus petit nombre de liens qui les sépare. Le centre est la personne dont l’ami le plus éloigné est le plus proche : ici ${'{C}'}, avec une excentricité de ${RADIUS} (le rayon). La plus grande distance du graphe, ${DIAM}, est son diamètre. Dans le vrai monde, le « petit monde » de Milgram (1967) montre qu’environ 6 intermédiaires suffisent souvent pour relier deux inconnus.`
},
{ name:'Tempête dans le fil', theme:'storm', exitLabel:'Aide · 3018',
  rules:['Une <b>tempête de moqueries</b> s’abat sur le fil : évite les messages blessants qui tombent.',
         'Ramasse les <b>4 bons réflexes</b> : chacun calme la tempête. Les mauvais réflexes la font grossir et coûtent un cœur.',
         'L’aide, au bout du chemin, ne s’ouvre qu’avec les 4 bons réflexes.'],
  hint:'Lis chaque réflexe avant de le toucher. Est-ce que ça protège, ou est-ce que ça aggrave la situation ?',
  init:()=>({good:0, bad:0, storm:4}),
  build(){
    const L=makeLevel(110,17); L.start={x:2,y:13};
    L.ground(0,30); L.ent('reflex',8,13,{rf:REFLEXES[4]}); L.plat(13,11,4); L.ent('reflex',15,10,{rf:REFLEXES[0]}); L.ent('coin',13,10); L.ent('coin',16,10);
    L.ent('troll',21,13); L.plat(24,11,3); L.plat(27,8,3); L.ent('reflex',28,7,{rf:REFLEXES[1]});
    L.ground(34,60); L.ent('check',36,12); L.plat(39,11,3); L.plat(43,8,3); L.ent('reflex',44,7,{rf:REFLEXES[2]});
    L.spikes(48,51); L.coins(48,11,4); L.ent('reflex',55,13,{rf:REFLEXES[5]}); L.ent('troll',58,13);
    L.ground(64,109); L.ent('check',65,12); L.plat(68,11,3); L.ent('reflex',69,10,{rf:REFLEXES[3]});
    L.spikes(76,78); L.ent('reflex',84,13,{rf:REFLEXES[6]}); L.ent('troll',93,13); L.coins(96,12,4); L.ent('exit',104,12);
    return L;
  },
  update(g){
    if(g.storm>0 && g.t%Math.max(50,190-g.storm*30)===0){
      const e=spawn({type:'rain',tx:0,ty:0}); e.txt=RAIN[(Math.random()*RAIN.length)|0];
      e.w=Math.max(34,e.txt.length*5.2+10); e.h=13;
      e.x=Math.max(4,Math.min(g.W-e.w-4,g.p.x+(Math.random()-.5)*VW*.9)); e.y=g.cam.y-20; e.vy=0.9+Math.random()*.6; g.ents.push(e);
    }
    if(!RM && g.t%420===200) g.flash=1;
  },
  status:g=>`Bons réflexes : <b>${g.good}/4</b> · tempête <span class="storm">${'▮'.repeat(g.storm)}${'▯'.repeat(Math.max(0,6-g.storm))}</span>`,
  canExit:g=>g.good>=4?true:`L’aide est là, mais il te manque ${4-g.good} bon(s) réflexe(s).`,
  bonus:g=>[[`Mauvais réflexes évités (${3-g.bad}/3)`,(3-g.bad)*15]],
  lesson:'Le cyberharcèlement, ce sont des moqueries, rumeurs, insultes, photos partagées sans accord ou mises à l’écart répétées en ligne. C’est puni par la loi (article 222-33-2-2 du Code pénal). Les bons réflexes : ne pas répondre, garder des preuves, bloquer et signaler, en parler à un adulte ou appeler le 3018. Témoin ? Ne partage pas, soutiens la victime.'
}];
LEVELS[2].lesson=LEVELS[2].lesson.replace('{C}',FRIENDS[CENTRE].name);

/* ---------- État global ---------- */
const $=(s,r=document)=>r.querySelector(s);
const RM = typeof matchMedia==='function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const fresh=()=>({hero:null, img:null, score:0, levelStart:0, results:[], hurtTotal:0, restarts:0});
let S=fresh(), G=null, state='menu';
const K={left:false,right:false,jump:false,jumpPressed:false};
function add(p){ S.score=Math.max(0,S.score+p); $('#score').textContent=S.score; }
let toastTimer;
function toast(t,cls){ const el=$('#toast'); el.textContent=t; el.className='toast '+(cls||''); clearTimeout(toastTimer); toastTimer=setTimeout(()=>{el.textContent='';},6500); }
function drawChip(){
  const h=S.hero, c=$('#herochip'); if(!h){c.hidden=true;return;}
  c.hidden=false; c.innerHTML=`${avatar(h.id)}<div><b>${h.name}</b><span>${h.power}</span></div>`;
}
function mode(m){
  $('#panel').hidden = m==='game'; $('#game').hidden = m!=='game';
  if(m==='game') resize();
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ---------- Écrans du panneau ---------- */
const panel=$('#panel');
function select(){
  state='menu'; mode('panel');
  panel.innerHTML=`
    <p class="eyebrow">Prologue</p>
    <h2>Bienvenue sur Bulle, le réseau social de Réseauville. Tu viens d’y créer ton compte.</h2>
    <p class="brief">Profil, réglages, amis… et une tempête à affronter. Traverse les 4 chapitres en courant et en sautant pour apprendre à <b>maîtriser ta vie en ligne</b>. Choisis ton avatar :</p>
    <div class="heroes" id="heroes"></div>
    <ul class="controls">
      <li><b>Ordinateur</b> : <kbd>←</kbd> <kbd>→</kbd> ou <kbd>Q</kbd> <kbd>D</kbd> pour courir, <kbd>Espace</kbd> ou <kbd>↑</kbd> pour sauter.</li>
      <li><b>Tablette / téléphone</b> : boutons tactiles sous l’écran de jeu.</li>
      <li><b>Trolls</b> : saute-leur dessus pour les modérer, ne les touche pas de côté.</li>
    </ul>
    <button class="btn" id="go" disabled>Choisis un avatar</button>`;
  const box=$('#heroes'), go=$('#go');
  HEROES.forEach(h=>{
    const b=document.createElement('button'); b.type='button'; b.className='hero'; b.setAttribute('aria-pressed','false');
    b.style.setProperty('--hc',`var(${h.color})`);
    b.innerHTML=`${avatar(h.id)}<span class="role">${h.role}</span><span class="nm">${h.name}</span>
      <span class="pw"><b>${h.power}.</b> ${h.desc}</span><span class="pw">« ${h.say} »</span>`;
    b.onclick=()=>{
      box.querySelectorAll('.hero').forEach(x=>x.setAttribute('aria-pressed','false'));
      b.setAttribute('aria-pressed','true'); S.hero=h; drawChip();
      go.disabled=false; go.textContent=`Partir avec ${h.name}`;
    };
    box.append(b);
  });
  go.onclick=()=>{
    const img=new Image(); img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(avatar(S.hero.id,true)); S.img=img;
    story(0);
  };
}
const CHAPTERS=['Mon profil','Salle des réglages','Graphe des amis','Tempête dans le fil'];
const STORY=[
  [['g','Bienvenue sur Bulle, {n} ! Je suis Modo, le modérateur. Avant de publier quoi que ce soit, il faut créer ton profil.'],
   ['h','Je mets tout ? Mon adresse, mon numéro, ma passion…'],
   ['g','Surtout pas ! Ce que tu publies peut être vu, copié et gardé longtemps. Ramasse seulement les infos qu’on peut montrer à tout le monde.']],
  [['g','Profil publié ! Mais regarde : des traceurs GPS te suivent, et des pubs surgissent de partout.'],
   ['h','Une pub pour un télescope ? Comment ils savent que j’aime l’astronomie ?'],
   ['g','Bulle est gratuit parce qu’il vit de la publicité ciblée : tes données valent de l’argent. Va dans la salle des réglages et coupe ce qui n’a pas besoin d’être partagé.']],
  [['g','Tu as maintenant des amis sur Bulle ! Chaque personne est un sommet du graphe, chaque amitié une arête.'],
   ['h','Léa veut organiser une sortie. Qui doit lancer l’invitation pour qu’elle arrive vite à tout le monde ?'],
   ['g','La personne la plus centrale : celle dont l’ami le plus éloigné est le plus proche. Rends visite à chacun pour comparer, et trouve le centre du graphe.']],
  [['g','Alerte ! Une tempête de moqueries s’abat sur le fil. Quelqu’un s’en prend à Jade, encore et encore.'],
   ['h','Ça se répète, ça vise Jade… c’est du cyberharcèlement. Qu’est-ce que je peux faire ?'],
   ['g','Ramasse les bons réflexes pour calmer la tempête, évite les mauvais, et rejoins l’aide au bout du chemin.']]
];
function mapSVG(ch, allDone){
  const P=[[40,70],[140,34],[230,80],[330,40]];
  const seg=(a,b)=>{const [x0,y0]=P[a],[x,y]=P[b]; return ` C${x0+50} ${y0},${x-50} ${y},${x} ${y}`;};
  let d=`M${P[0][0]} ${P[0][1]}`; for(let i=1;i<4;i++) d+=seg(i-1,i);
  let w=`M${P[0][0]} ${P[0][1]}`; for(let i=1;i<=ch;i++) w+=seg(i-1,i);
  let h=`<path class="trail" d="${d}"/>${ch>0?`<path class="trail walked" d="${w}"/>`:''}`;
  P.forEach(([x,y],i)=>{
    const done=i<ch||allDone, cls=done?'done':i===ch?'here':'';
    h+=`<g class="stop ${cls}"><circle cx="${x}" cy="${y}" r="14"/><text class="num" x="${x}" y="${y}">${done?'✓':i+1}</text>
      <text x="${x}" y="${y+(y>60?-24:32)}">${CHAPTERS[i]}</text></g>`;
  });
  const [hx,hy]=P[ch];
  h+=`<g transform="translate(${hx-18},${hy-62}) scale(.36)">${inner(avatar(S.hero.id))}</g>`;
  return `<svg class="map" viewBox="0 -30 370 150" role="img" aria-label="Carte du parcours : chapitre ${ch+1} sur 4">${h}</svg>`;
}
function dialogLine(who,txt){
  const g=who==='g', d=document.createElement('div'); d.className='line'+(g?'':' me');
  d.innerHTML=`${avatar(g?'guide':S.hero.id)}<div class="bubble"><b>${g?'Modo':S.hero.name}</b><p>${txt.replace('{n}',S.hero.name)}</p></div>`;
  return d;
}
function story(i){
  state='menu'; mode('panel');
  const def=LEVELS[i], lines=STORY[i];
  panel.innerHTML=`
    <p class="eyebrow">Chapitre ${i+1} · ${def.name}</p>
    <div class="mapbox">${mapSVG(i)}</div>
    <div class="dialog" id="dlg" aria-live="polite"></div>
    <div id="rules"></div>
    <button class="btn" id="suite">Suite</button>`;
  let k=0; const dlg=$('#dlg'), btn=$('#suite');
  const say=()=>{ dlg.append(dialogLine(...lines[k])); k++;
    if(k===lines.length){
      $('#rules').innerHTML=`<div class="rules"><h3>Dans ce chapitre</h3><ul>${def.rules.map(r=>`<li>${r}</li>`).join('')}</ul></div>`;
      btn.textContent='Lancer le chapitre';
    }};
  say();
  btn.onclick=()=>{ if(k<lines.length) say(); else play(i); };
}
function clearScreen(i){
  state='menu'; mode('panel');
  const r=S.results[i], def=LEVELS[i];
  panel.innerHTML=`
    <p class="eyebrow">Chapitre ${i+1} réussi · ${def.name}</p>
    <h2>Ce que tu viens d’apprendre</h2>
    <p class="lesson">${def.lesson}</p>
    <table class="pts">${r.bonus.filter(([,v])=>v>0).map(([l,v])=>`<tr><td>${l}</td><td>+${v}</td></tr>`).join('')}
      <tr class="tot"><td>Points gagnés dans ce chapitre</td><td>${r.pts}</td></tr></table>
    <button class="btn" id="nx">${i<3?'Chapitre suivant':'Voir la fin'}</button>`;
  $('#nx').onclick=()=> i<3?story(i+1):ending();
}
function failScreen(i){
  state='menu'; mode('panel');
  panel.innerHTML=`
    <p class="eyebrow">Chapitre ${i+1} · ${LEVELS[i].name}</p>
    <h2>Plus de cœurs !</h2>
    <p class="brief">Trolls, flammes et chutes ont eu raison de toi. Tu recommences le chapitre avec tous tes cœurs.</p>
    <button class="btn" id="retry">Recommencer le chapitre</button>`;
  $('#retry').onclick=()=>{ S.score=S.levelStart; $('#score').textContent=S.score; S.restarts++; play(i); };
}
function ending(){
  state='menu'; mode('panel');
  const slips=S.hurtTotal+S.restarts*2;
  const grade=slips===0?'Expert·e de Bulle':slips<=4?'Utilisateur·rice averti·e':slips<=10?'Profil bien protégé':'Apprenti·e connecté·e';
  panel.innerHTML=`
    <p class="eyebrow">Épilogue</p>
    <div class="mapbox">${mapSVG(3,true)}</div>
    <div class="dialog" id="dlg"></div>
    <p class="big">${S.score}<span style="font-size:.4em;color:var(--muted);text-shadow:none"> points</span></p>
    <h2>Titre obtenu : ${grade}</h2>
    <ul class="recap">
      <li><b>Identité numérique</b> : ce que tu publies laisse des traces ; tes données sensibles restent privées.</li>
      <li><b>Modèle économique et confidentialité</b> : un réseau gratuit vit de la publicité ciblée grâce à tes données ; les paramètres limitent ce que tu partages.</li>
      <li><b>Graphes</b> : sommets, arêtes, distance, excentricité, centre, rayon, diamètre, et le « petit monde ».</li>
      <li><b>Cyberharcèlement</b> : puni par la loi ; ne pas répondre, garder des preuves, bloquer et signaler, en parler, 3018.</li>
    </ul>
    <p class="brief">Chutes et dégâts : ${S.hurtTotal} · chapitres recommencés : ${S.restarts}</p>
    <button class="btn" id="again">Rejouer avec un autre avatar</button>`;
  $('#dlg').append(dialogLine('g','La tempête est passée : Jade a été aidée, et tu sais maintenant te protéger sur les réseaux sociaux, {n} !'),
                   dialogLine('h','Profil maîtrisé, réglages faits, graphe compris… et plus jamais seul·e face au harcèlement.'));
  $('#again').onclick=()=>{ S=fresh(); G=null; $('#score').textContent=0; drawChip(); select(); };
}

/* =====================================================================
   MOTEUR
   ===================================================================== */
const cv=$('#cv'), ctx=cv.getContext('2d');
let VW=480, SC=1, RS=2;
function resize(){
  const scr=$('#screen'); if($('#game').hidden) return;
  const cw=scr.clientWidth; let ch;
  if(document.fullscreenElement){ const used=$('#game').scrollHeight-scr.offsetHeight; ch=Math.max(220,window.innerHeight-used-24); }
  else ch=Math.min(cw<640?cw*0.82:cw*9/16, window.innerHeight*0.72);
  scr.style.height=Math.round(ch)+'px';
  const dpr=Math.min(window.devicePixelRatio||1,2);
  cv.width=Math.round(cw*dpr); cv.height=Math.round(ch*dpr);
  SC=cv.height/VH; VW=cv.width/SC;
  if(G && G.art && Math.abs(Math.min(2.5,Math.max(1,SC))-G.art.rs)>0.35) buildArt();
}
window.addEventListener('resize',resize);
document.addEventListener('fullscreenchange',()=>{ $('#fsBtn').textContent=document.fullscreenElement?'Quitter le plein écran':'Plein écran'; setTimeout(resize,50); });

function cell(tx,ty){ const L=G.L; if(tx<0||tx>=L.w) return '#'; if(ty<0||ty>=L.h) return '.'; return L.g[ty][tx]; }
const isSolid=c=>c==='#'||c==='X';
const hit=(a,b)=>a.x<b.x+b.w && a.x+a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y;

function spawn(d){
  const e=Object.assign({},d,{dead:false,cool:0,t:Math.random()*100}), X=d.tx*T, Y=d.ty*T;
  const box={coin:[3,3,10,10], info:[2,2,12,12], lever:[0,0,16,32], tracker:[2,2,12,14], popup:[0,0,26,18], rain:[0,0,34,13],
             friend:[1,6,14,26], reflex:[1,1,14,14], check:[2,0,12,32], exit:[-4,0,24,32], troll:[1,4,14,12]}[d.type];
  Object.assign(e,{x:X+box[0], y:Y+box[1], w:box[2], h:box[3]});
  if(d.type==='troll'){ e.vx=-0.6; e.vy=0; e.squish=0; }
  if(d.type==='tracker'){ e.hx=e.x; e.hy=e.y; }
  return e;
}
function play(i){
  const def=LEVELS[i], L=def.build(), H=S.hero;
  S.levelStart=S.score;
  const p={x:L.start.x*T+2, y:(L.start.y+1)*T-14, w:12, h:14, vx:0, vy:0, onGround:false, coyote:0, buf:0, air:0, face:1, invul:0, knock:0, sq:0};
  G=Object.assign({i, def, th:THEMES[def.theme], L, W:L.w*T, Hh:L.h*T, p, ents:L.ents.map(spawn), parts:[], texts:[], t:0,
     hearts:H.hearts, hurtCount:0, respawn:{x:p.x,y:p.y}, cam:{x:0,y:0}, shake:0, flash:0, over:false, banner:150, art:null}, def.init());
  mode('game'); buildArt(); snapCam(); updateHUD();
  for(const k in K) K[k]=false;
  if(document.activeElement && document.activeElement.blur) document.activeElement.blur();
  toast(def.hint,'info');
  state='play'; $('#pauseBtn').textContent='Pause';
}
function updateHUD(){
  if(!G) return; const max=S.hero.hearts;
  const hs=$('#hearts'); hs.innerHTML=Array.from({length:max},(_,k)=>`<span class="${k<G.hearts?'':'off'}">♥</span>`).join('');
  hs.setAttribute('aria-label',`${G.hearts} cœur(s) sur ${max}`);
  $('#lvlname').textContent=`Chapitre ${G.i+1} · ${G.def.name}`;
  $('#status').innerHTML=G.def.status(G);
}
function camTarget(){ const p=G.p; return {x:p.x+p.w/2-VW/2+p.face*28, y:p.y-VH*0.55}; }
function clampCam(){
  const c=G.cam;
  c.x = G.W<=VW ? (G.W-VW)/2 : Math.max(0,Math.min(G.W-VW,c.x));
  c.y = G.Hh<=VH ? (G.Hh-VH) : Math.max(0,Math.min(G.Hh-VH,c.y));
}
function snapCam(){ const t=camTarget(); G.cam.x=t.x; G.cam.y=t.y; clampCam(); }

/* ---------- Effets ---------- */
function sparkle(x,y,c,n=10,kind){ for(let k=0;k<n;k++){ const a=Math.random()*TAU, v=0.8+Math.random()*2.2; G.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1,life:30+Math.random()*20,c,kind:kind||(k%3===0?'star':'dot')}); } }
function poof(x,y){ for(let k=0;k<7;k++) G.parts.push({x:x+(Math.random()-.5)*10,y:y+(Math.random()-.5)*8,vx:(Math.random()-.5)*.8,vy:-.3-Math.random()*.5,life:26,c:'rgba(255,255,255,.85)',kind:'smoke',s:3}); }
function floatText(x,y,text,c){ G.texts.push({x,y,text,c,life:60}); }
function updFx(){
  for(const q of G.parts){ q.x+=q.vx; q.y+=q.vy; if(q.kind==='smoke'){ q.vy*=0.98; q.s=(q.s||3)+0.08; } else q.vy+=0.08; q.life--; }
  G.parts=G.parts.filter(q=>q.life>0);
  for(const q of G.texts){ q.y-=0.5; q.life--; }
  G.texts=G.texts.filter(q=>q.life>0);
  if(G.shake>0) G.shake--;
  if(G.banner>0) G.banner--;
  if(G.flash>0.02) G.flash*=0.9; else G.flash=0;
}

/* ---------- Joueur ---------- */
function hurt(msg, srcX, force){
  const p=G.p; if(G.over) return;
  if(p.invul>0 && !force) return;
  G.hearts--; G.hurtCount++; S.hurtTotal++; p.invul=90; G.shake=12;
  toast(msg,'bad'); sparkle(p.x+6,p.y+7,'#ff5c5c',14);
  if(srcX!=null){ const d=Math.sign(p.x+p.w/2-srcX)||-p.face; p.vx=3*d; p.vy=-4.5; p.knock=14; }
  updateHUD();
  if(G.hearts<=0) failLevel();
}
function respawnPlayer(){ const p=G.p; p.x=G.respawn.x; p.y=G.respawn.y; p.vx=0; p.vy=0; p.knock=0; p.invul=Math.max(p.invul,70); snapCam(); }
function moveX(p){
  p.x+=p.vx;
  const t0=Math.floor(p.y/T), t1=Math.floor((p.y+p.h-0.01)/T);
  if(p.vx>0){ const tx=Math.floor((p.x+p.w-0.01)/T); for(let ty=t0;ty<=t1;ty++) if(isSolid(cell(tx,ty))){ p.x=tx*T-p.w; p.vx=0; break; } }
  else if(p.vx<0){ const tx=Math.floor(p.x/T); for(let ty=t0;ty<=t1;ty++) if(isSolid(cell(tx,ty))){ p.x=(tx+1)*T; p.vx=0; break; } }
}
function moveY(p){
  const prevBottom=p.y+p.h, wasGround=p.onGround, fall=p.vy;
  p.y+=p.vy; p.onGround=false;
  const l=Math.floor(p.x/T), r=Math.floor((p.x+p.w-0.01)/T);
  if(p.vy>0){
    const ty=Math.floor((p.y+p.h-0.01)/T);
    for(let tx=l;tx<=r;tx++){ const c=cell(tx,ty);
      if(isSolid(c) || (c==='-' && prevBottom<=ty*T+0.01)){ p.y=ty*T-p.h; p.vy=0; p.onGround=true;
        if(!wasGround&&fall>3){ p.sq=1; for(let k=0;k<5;k++) G.parts.push({x:p.x+6+(k-2)*3,y:p.y+p.h,vx:(k-2)*0.4,vy:-0.4,life:18,c:'rgba(255,255,255,.8)',kind:'smoke',s:2}); }
        break; } }
  } else if(p.vy<0){
    const ty=Math.floor(p.y/T);
    for(let tx=l;tx<=r;tx++) if(isSolid(cell(tx,ty))){ p.y=(ty+1)*T; p.vy=0; break; }
  }
}
function doJump(p,v){ p.vy=-v; p.buf=0; p.coyote=0; p.onGround=false; p.sq=-1; }
function step(){
  G.t++; updFx();
  if(G.over) return;
  const p=G.p, H=S.hero;
  const dir=(K.right?1:0)-(K.left?1:0);
  if(p.knock>0) p.knock--;
  else { const target=dir*H.speed, acc=p.onGround?0.4:0.25; p.vx+=Math.sign(target-p.vx)*Math.min(acc,Math.abs(target-p.vx)); }
  if(dir) p.face=dir;
  if(K.jumpPressed){ p.buf=7; K.jumpPressed=false; }
  if(p.onGround){ p.coyote=6; p.air=0; } else if(p.coyote>0) p.coyote--;
  if(p.buf>0 && p.coyote>0) doJump(p,JUMP);
  else if(p.buf>0 && H.dj && !p.onGround && p.air===0){ doJump(p,JUMP*0.92); p.air=1; sparkle(p.x+6,p.y+14,'#d8ccff',8,'star'); }
  if(p.buf>0) p.buf--;
  if(!K.jump && p.vy<-2.6) p.vy=-2.6;
  p.vy=Math.min(p.vy+GRAV,MAXFALL);
  moveX(p); moveY(p);
  if(p.invul>0) p.invul--;
  p.sq*=0.82;
  if(G.def.autoRespawn && p.onGround && isSolid(cell(Math.floor((p.x+p.w/2)/T),Math.floor((p.y+p.h+1)/T)))) G.respawn={x:p.x,y:p.y};
  const l=Math.floor(p.x/T), r=Math.floor((p.x+p.w-0.01)/T), t0=Math.floor(p.y/T), t1=Math.floor((p.y+p.h-0.01)/T);
  for(let ty=t0;ty<=t1;ty++) for(let tx=l;tx<=r;tx++)
    if(cell(tx,ty)==='^' && p.y+p.h>ty*T+8){ if(p.invul<=0){ hurt('Aïe, une guerre de commentaires enflammés ! Saute par-dessus les flammes.', tx*T+8); p.vy=-6.5; } }
  if(p.y>G.Hh+40){ hurt('Chute dans le vide ! Tu repars du dernier endroit sûr.', null, true); if(!G.over) respawnPlayer(); }
  updEnts();
  if(G.def.update && !G.over) G.def.update(G);
  const tg=camTarget(); G.cam.x+=(tg.x-G.cam.x)*0.12; G.cam.y+=(tg.y-G.cam.y)*0.1; clampCam();
}

/* ---------- Entités ---------- */
function updTroll(e){
  e.vy=Math.min(e.vy+GRAV,MAXFALL); e.y+=e.vy;
  const l=Math.floor(e.x/T), r=Math.floor((e.x+e.w-0.01)/T), by=Math.floor((e.y+e.h)/T);
  let ground=false;
  for(let tx=l;tx<=r;tx++){ const c=cell(tx,by);
    if((isSolid(c)||c==='-') && e.y+e.h-e.vy<=by*T+0.5){ e.y=by*T-e.h; e.vy=0; ground=true; break; } }
  if(e.y>G.Hh+50){ e.dead=true; return; }
  e.x+=e.vx;
  const front=e.vx>0?e.x+e.w:e.x-0.01, mid=Math.floor((e.y+e.h/2)/T);
  const below=cell(Math.floor((e.vx>0?e.x+e.w+1:e.x-1)/T), Math.floor((e.y+e.h+2)/T));
  if(isSolid(cell(Math.floor(front/T),mid)) || (ground && !(isSolid(below)||below==='-'))){ e.x-=e.vx; e.vx=-e.vx; }
}
function updEnts(){
  const p=G.p;
  for(const e of G.ents){
    e.t++; if(e.cool>0) e.cool--;
    if(e.type==='troll'){ if(e.dead){ if(e.squish>0) e.squish--; continue; } updTroll(e); }
    if(e.dead) continue;
    if(e.type==='tracker'){
      const dx=p.x-e.x, dy=p.y-e.y, d=Math.hypot(dx,dy)||1;
      if(d<180){ e.x+=dx/d*0.6; e.y+=dy/d*0.6; e.chase=true; }
      else { e.chase=false; e.x+=(e.hx-e.x)*0.02; e.y+=(e.hy+Math.sin(e.t/20)*4-e.y)*0.05; }
    }
    if(e.type==='popup'){ e.x+=e.vx; e.y=e.hy+Math.sin(e.t/14)*6; if(--e.life<=0){ e.dead=true; continue; } }
    if(e.type==='rain'){
      e.y+=e.vy; e.x+=Math.sin(e.t/18)*0.25;
      const c=cell(Math.floor((e.x+e.w/2)/T),Math.floor((e.y+e.h)/T));
      if(isSolid(c)||c==='-'){ e.dead=true; poof(e.x+e.w/2,e.y+e.h); continue; }
      if(e.y>G.Hh+20){ e.dead=true; continue; }
    }
    if(hit(p,e)) touch(e);
    if(G.over) return;
  }
  if(G.ents.length>160) G.ents=G.ents.filter(e=>!e.dead || (e.type==='troll'&&e.squish>0) || e.type==='friend');
}
function stomped(e){ const p=G.p; return p.vy>0.5 && p.y+p.h-p.vy<=e.y+6; }
function pushAway(e){ const p=G.p, d=Math.sign(p.x+p.w/2-(e.x+e.w/2))||-p.face; p.vx=3.2*d; p.vy=-3.5; p.knock=14; }
function touch(e){
  const p=G.p, cx=e.x+e.w/2, cy=e.y;
  switch(e.type){
    case 'coin': e.dead=true; add(5); sparkle(cx,e.y+5,'#ffd65c',6); break;
    case 'info':
      e.dead=true;
      if(e.info.ok){ G.good++; add(30); floatText(cx,cy,'+30','#4cd18f'); sparkle(cx,e.y+6,'#4cd18f',14); toast(`✓ « ${e.info.a} » peut être public. ${e.info.why}`,'good'); }
      else { G.bad++; sparkle(cx,e.y+6,'#ff5c5c',14); hurt(`✗ « ${e.info.a} » ne doit pas être public : ${e.info.why}`, cx); }
      updateHUD(); break;
    case 'lever':
      if(e.on) break;
      e.on=true; G.flags[e.key]=true; add(20); floatText(cx,cy,'+20','#4cd18f'); sparkle(cx,e.y+6,'#4cd18f',14);
      if(e.key==='loc') G.ents.forEach(t=>{ if(t.type==='tracker'&&!t.dead){ t.dead=true; poof(t.x+6,t.y+7); } });
      if(e.key==='ads'){ G.adsOn=false; G.ents.forEach(t=>{ if(t.type==='popup'&&!t.dead){ t.dead=true; poof(t.x+13,t.y+9); } }); }
      toast(LEVERS[e.key].msg,'good'); updateHUD(); break;
    case 'tracker': hurt('Un traceur GPS t’a rattrapé ! Coupe la localisation pour qu’il perde ta trace.', cx); break;
    case 'popup':
      if(stomped(e)){ e.dead=true; G.closed++; p.vy=K.jump?-7:-4.8; add(5); poof(cx,e.y+8); floatText(cx,cy,'+5','#ffd65c'); toast('Pub fermée… mais elle reviendra tant que la pub personnalisée est activée.','info'); }
      else hurt('Une pub ciblée t’a percuté ! Elle est calculée à partir de tes données : coupe la pub personnalisée.', cx);
      break;
    case 'rain': e.dead=true; poof(cx,e.y+6); hurt(`« ${e.txt} » : ce message blesse. Ramasse les bons réflexes pour calmer la tempête.`, cx); break;
    case 'friend': {
      if(e.cool>0) break; e.cool=120;
      const n=FRIENDS[e.node].name, first=!G.rung.has(e.node);
      if(first){ G.rung.add(e.node); if(!G.found) G.rings++; }
      if(e.node===CENTRE){
        if(!G.found){ G.found=true; add(40); floatText(cx,cy,'+40','#4cd18f'); sparkle(cx,e.y,'#ffd65c',24,'star'); }
        toast(`${n} est le centre du graphe : tout le monde est à ${ECC[e.node]} liens maximum (excentricité ${ECC[e.node]}). L’invitation peut partir, file chez Sam !`,'good');
      } else toast(`Chez ${n} : l’ami le plus éloigné est à ${ECC[e.node]} liens (excentricité ${ECC[e.node]}).${G.found?'':' Le centre a une excentricité plus petite…'}`,'info');
      updateHUD(); break; }
    case 'reflex':
      e.dead=true;
      if(e.rf.ok){ G.good++; G.storm=Math.max(0,G.storm-1); add(30); floatText(cx,cy,'+30','#4cd18f'); sparkle(cx,e.y+7,'#4cd18f',16,'star');
        toast(`✓ ${e.rf.t} : ${e.rf.why}`,'good');
        if(G.storm===0) G.ents.forEach(t=>{ if(t.type==='rain'&&!t.dead){ t.dead=true; poof(t.x+t.w/2,t.y+6); } }); }
      else { G.bad++; G.storm=Math.min(6,G.storm+1); sparkle(cx,e.y+7,'#ff5c5c',14); hurt(`✗ ${e.rf.t} : ${e.rf.why}`, cx); }
      updateHUD(); break;
    case 'check':
      if(!e.on){ G.ents.forEach(c=>{ if(c.type==='check') c.on=false; }); e.on=true; G.respawn={x:e.x, y:e.y+e.h-p.h}; sparkle(cx,e.y+4,'#4cd18f',8); toast('Point de reprise activé.','info'); }
      break;
    case 'exit': {
      const r=G.def.canExit(G);
      if(r===true) complete();
      else if(e.cool===0){ e.cool=150; toast(r,'bad'); }
      break; }
    case 'troll':
      if(stomped(e)){ e.dead=true; e.squish=24; p.vy=K.jump?-7:-4.8; add(10); floatText(cx,cy,'+10','#ffd65c'); sparkle(cx,e.y+6,'#b99cff',12); }
      else hurt('Un troll t’a bousculé ! Saute-lui sur la tête pour le modérer.', cx);
      break;
  }
}
function complete(){
  G.over=true;
  const b=G.def.bonus(G).concat([['Chapitre terminé',50]]);
  b.forEach(([,v])=>add(v));
  S.results[G.i]={pts:S.score-S.levelStart, bonus:b};
  sparkle(G.p.x+6,G.p.y,'#4cd18f',30); sparkle(G.p.x+6,G.p.y,'#ffd65c',20,'star');
  toast('Chapitre réussi !','good');
  setTimeout(()=>clearScreen(G.i),1100);
}
function failLevel(){ G.over=true; setTimeout(()=>failScreen(G.i),1300); }

/* =====================================================================
   ILLUSTRATION : pré-rendu des décors et du terrain
   ===================================================================== */
function off(w,h){ const c=document.createElement('canvas'); c.width=Math.ceil(w*RS); c.height=Math.ceil(h*RS);
  const g=c.getContext('2d'); g.setTransform(RS,0,0,RS,0,0); g.lineJoin='round'; g.lineCap='round'; return {c,g,w,h}; }
function buildArt(){
  RS=Math.min(2.5,Math.max(1,SC));
  const th=G.th;
  G.art={ rs:RS, terrain:buildTerrain(),
    layers:th.layers.map((l,k)=>{ const h=l.h||VH, o=off(l.w,h); l.paint(o.g,l.w,h,rng(1000+k*97+l.w));
      if(l.haze){ o.g.globalCompositeOperation='source-atop'; o.g.fillStyle=l.haze; o.g.fillRect(0,0,l.w,h); o.g.globalCompositeOperation='source-over'; }
      return {o,f:l.f,tile:!!l.tile}; }) };
}
function buildTerrain(){
  const L=G.L, th=G.th, gd=th.ground, o=off(G.W,G.Hh), g=o.g, r=rng(L.w*31+L.h*7);
  const sol=(x,y)=>{ if(x<0||x>=L.w) return true; if(y>=L.h) return !G.def.autoRespawn; if(y<0) return false; return isSolid(L.g[y][x]); };
  const R=5, rad=(x,y)=>{ const u=!sol(x,y-1), d=!sol(x,y+1), l=!sol(x-1,y), rt=!sol(x+1,y); return [u&&l?R:0,u&&rt?R:0,d&&rt?R:0,d&&l?R:0]; };
  const tiles=[]; for(let y=0;y<L.h;y++) for(let x=0;x<L.w;x++) if(isSolid(L.g[y][x])) tiles.push([x,y,rad(x,y)]);
  g.fillStyle=INK; for(const [x,y,rd] of tiles){ rrp(g,x*T-2,y*T-2,T+4,T+4,rd.map(v=>v?v+2:0)); g.fill(); }
  for(const [x,y,rd] of tiles){ g.fillStyle=gd.body; rrp(g,x*T,y*T,T,T,rd); g.fill(); }
  for(const [x,y,rd] of tiles){
    const X=x*T, Y=y*T, topOpen=!sol(x,y-1);
    g.save(); rrp(g,X,Y,T,T,rd); g.clip();
    if(gd.deco==='grass'){
      if(r()<.6){ g.fillStyle=gd.spot; g.beginPath(); g.ellipse(X+3+r()*10,Y+(topOpen?9:3)+r()*5,2+r()*1.5,1.3+r(),0,0,TAU); g.fill(); }
      if(topOpen){ g.fillStyle=gd.top2; g.fillRect(X,Y,T,7); for(let k=0;k<4;k++){ g.beginPath(); g.arc(X+2+k*4,Y+7,2.2,0,Math.PI); g.fill(); }
        g.fillStyle=gd.top; g.fillRect(X,Y,T,5); g.fillStyle='rgba(255,255,255,.35)'; g.fillRect(X,Y+1,T,1); }
    } else if(gd.deco==='metal'){
      g.fillStyle=gd.spot; g.fillRect(X,Y,1,T); g.fillRect(X,Y,T,1);
      g.fillStyle='#7fa3b8'; [[3,topOpen?9:3],[13,topOpen?9:3],[3,13],[13,13]].forEach(([a,b])=>{ g.beginPath(); g.arc(X+a,Y+b,1.3,0,TAU); g.fill(); });
      if(topOpen){ g.fillStyle='#ffd166'; g.fillRect(X,Y+3,T,3); g.fillStyle=INK; for(let k=-4;k<T;k+=6){ g.beginPath(); g.moveTo(X+k,Y+6); g.lineTo(X+k+3,Y+3); g.lineTo(X+k+6,Y+3); g.lineTo(X+k+3,Y+6); g.fill(); }
        g.fillStyle=gd.top; g.fillRect(X,Y,T,3); }
    } else if(gd.deco==='roof'){
      g.strokeStyle=gd.spot; g.lineWidth=1; g.beginPath();
      for(let k=0;k<2;k++){ const yy=Y+k*8, o2=((y*2+k)%2)*8; g.moveTo(X,yy+.5); g.lineTo(X+T,yy+.5); g.moveTo(X+o2+.5,yy); g.lineTo(X+o2+.5,yy+8); }
      g.stroke();
      if(topOpen){ g.fillStyle=gd.top2; g.fillRect(X,Y,T,9); g.fillStyle=gd.top; g.fillRect(X,Y,T,4);
        for(let k=0;k<2;k++){ g.beginPath(); g.arc(X+4+k*8,Y+4,4,0,Math.PI); g.fill(); g.strokeStyle='rgba(29,26,51,.5)'; g.lineWidth=1; g.stroke(); }
        g.fillStyle='rgba(255,255,255,.3)'; g.fillRect(X,Y+1,T,1); }
    }
    g.restore();
    if(gd.deco==='grass' && topOpen && L.g[y-1]&&L.g[y-1][x]==='.' && r()<.4){
      const bx=X+3+r()*9; g.beginPath(); g.moveTo(bx-3,Y+1); g.lineTo(bx-2,Y-4); g.lineTo(bx,Y+1); g.lineTo(bx+1,Y-5); g.lineTo(bx+2,Y+1); g.lineTo(bx+4,Y-3); g.lineTo(bx+4,Y+1); g.closePath(); inked(g,gd.top,1.1);
      if(r()<.3){ inkLine(g,[[bx+7,Y],[bx+7,Y-6]],gd.top2,1); g.beginPath(); g.arc(bx+7,Y-7,2.3,0,TAU); inked(g,r()<.5?'#ff8fb1':'#fff1a8',1); }
    }
  }
  for(let y=0;y<L.h;y++){ let x=0; while(x<L.w){ if(L.g[y][x]!=='-'){ x++; continue; } let e=x; while(e<L.w&&L.g[y][e]==='-') e++; drawPlatform(g,x*T,y*T,(e-x)*T,th.plat); x=e; } }
  return o;
}
function drawPlatform(g,x,y,w,kind){
  if(kind==='cloud'){
    const pts=[]; for(let k=5;k<=w-5;k+=7) pts.push(k); if(pts[pts.length-1]<w-5) pts.push(w-5);
    g.fillStyle=INK; pts.forEach(k=>{ g.beginPath(); g.arc(x+k,y+5,6.6,0,TAU); g.fill(); }); rrp(g,x-1.6,y+3,w+3.2,8.6,4); g.fill();
    g.fillStyle='#ffffff'; pts.forEach(k=>{ g.beginPath(); g.arc(x+k,y+5,5,0,TAU); g.fill(); }); rrp(g,x,y+4.6,w,5.4,3); g.fill();
    g.fillStyle='#dfe6ff'; g.fillRect(x+3,y+8,w-6,1.5); return;
  }
  if(kind==='grate'){ [x+4,x+w-7].forEach(sx=>{ rrp(g,sx,y+6,3,8,1); inked(g,'#5c7f93',1.2); }); }
  const fill={plank:'#d49a5e',grate:'#8fb3c4'}[kind];
  rrp(g,x,y,w,8,3); inked(g,fill,1.8);
  g.save(); rrp(g,x,y,w,8,3); g.clip();
  g.fillStyle='rgba(255,255,255,.35)'; g.fillRect(x,y+1,w,1.5);
  if(kind==='plank'){ g.fillStyle='rgba(29,26,51,.35)'; for(let k=x+16;k<x+w;k+=16) g.fillRect(k,y,1,8); g.fillStyle=INK; for(let k=x+4;k<x+w;k+=16) g.fillRect(k,y+4,1.2,1.2); }
  if(kind==='grate'){ g.fillStyle='rgba(29,26,51,.55)'; for(let k=x+3;k<x+w-2;k+=4) g.fillRect(k,y+3,2,3); }
  g.restore();
}

/* =====================================================================
   RENDU PAR IMAGE
   ===================================================================== */
const MONO='"JetBrains Mono", ui-monospace, monospace', SANS='"Atkinson Hyperlegible", system-ui, sans-serif', FUN='"Grandstander", "Trebuchet MS", sans-serif';
function sign(text,cx,bottom,o={}){
  ctx.font=o.font||`700 10px ${SANS}`;
  const w=Math.ceil(ctx.measureText(text).width)+12, h=16;
  const x=Math.max(2,Math.min(G.W-w-2,cx-w/2)), y=bottom-h;
  ctx.fillStyle=INK; rrp(ctx,x+1.6,y+1.6,w,h,5); ctx.fill();
  rrp(ctx,x,y,w,h,5); inked(ctx,o.fill||'#fffaf0',1.5);
  ctx.fillStyle=o.color||INK; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(text,x+w/2,y+h/2+0.5);
}
function drawLayers(){
  const th=G.th, gr=ctx.createLinearGradient(0,0,0,VH);
  th.sky.forEach(([s,c])=>gr.addColorStop(s,c)); ctx.fillStyle=gr; ctx.fillRect(0,0,VW,VH);
  for(const ly of G.art.layers){
    const lw=ly.o.w, lh=ly.o.h;
    let ox=-((G.cam.x*ly.f)%lw); if(ox>0) ox-=lw;
    let oy=ly.tile?-((G.cam.y*ly.f)%lh):VH-lh; if(ly.tile&&oy>0) oy-=lh;
    for(let y=oy; y<VH; y+=lh){ for(let x=ox; x<VW; x+=lw) ctx.drawImage(ly.o.c, x, y, lw+0.6, lh+(ly.tile?0.6:0)); if(!ly.tile) break; }
  }
}
function drawFlames(camX,camY){
  const L=G.L, x0=Math.max(0,Math.floor(camX/T)), x1=Math.min(L.w-1,Math.ceil((camX+VW)/T)), y0=Math.max(0,Math.floor(camY/T)), y1=Math.min(L.h-1,Math.ceil((camY+VH)/T));
  for(let ty=y0;ty<=y1;ty++) for(let tx=x0;tx<=x1;tx++){
    if(L.g[ty][tx]!=='^') continue; const X=tx*T, Y=ty*T+T;
    rrp(ctx,X+0.5,Y-4,T-1,4,2); inked(ctx,'#5a2a2a',1.2);
    for(let k=0;k<3;k++){ const fx=X+3+k*5, fh=7+3*Math.sin(G.t/5+tx*1.7+k*2.1);
      ctx.beginPath(); ctx.moveTo(fx-3,Y-3); ctx.quadraticCurveTo(fx-3.5,Y-fh*.6,fx,Y-3-fh); ctx.quadraticCurveTo(fx+3.5,Y-fh*.6,fx+3,Y-3); ctx.closePath(); inked(ctx,'#ff6b3d',1.2);
      ctx.beginPath(); ctx.moveTo(fx-1.5,Y-3); ctx.quadraticCurveTo(fx-1.6,Y-fh*.4,fx,Y-3-fh*.55); ctx.quadraticCurveTo(fx+1.6,Y-fh*.4,fx+1.5,Y-3); ctx.closePath(); ctx.fillStyle='#ffd166'; ctx.fill(); }
  }
}
function drawEdges(){
  const pos={}; G.ents.forEach(e=>{ if(e.type==='friend') pos[e.node]=[e.x+7,e.y+8]; });
  FEDGES.forEach(([a,b])=>{ if(!pos[a]||!pos[b]) return; const [x1,y1]=pos[a],[x2,y2]=pos[b];
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.quadraticCurveTo((x1+x2)/2,Math.max(y1,y2)+24,x2,y2);
    ctx.strokeStyle='rgba(29,26,51,.45)'; ctx.lineWidth=4; ctx.stroke();
    ctx.strokeStyle=`rgba(255,231,163,${0.55+0.25*Math.sin(G.t/20)})`; ctx.lineWidth=2; ctx.setLineDash([6,5]); ctx.lineDashOffset=-G.t*0.4; ctx.stroke(); ctx.setLineDash([]); ctx.lineDashOffset=0; });
}
function drawEnt(e){
  const cx=e.x+e.w/2;
  switch(e.type){
    case 'coin': { if(e.dead) return; const b=Math.sin(e.t/15)*1.2, sx=Math.abs(Math.cos(e.t/16));
      ctx.save(); ctx.translate(cx,e.y+5+b); ctx.scale(Math.max(.2,sx),1);
      starPath(ctx,0,0,6,2.7); inked(ctx,'#ffd23c',1.3); ctx.fillStyle='rgba(255,255,255,.7)'; ctx.fillRect(-1.5,-3,1.4,2.5);
      ctx.restore(); return; }
    case 'info': { if(e.dead) return; const y=e.y+Math.sin(e.t/18)*1.5;
      ctx.strokeStyle=INK; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(cx,y); ctx.lineTo(cx,y-5); ctx.stroke();
      rrp(ctx,e.x-1,y,14,11,2); inked(ctx,'#fff1c9',1.4);
      ctx.beginPath(); ctx.arc(e.x+3,y+4.5,2,0,TAU); ctx.fillStyle='#b8a6e6'; ctx.fill();
      ctx.fillStyle='#b8a6e6'; ctx.fillRect(e.x+6.5,y+3,4.5,1.3); ctx.fillRect(e.x+6.5,y+5.8,3.5,1.3); ctx.fillRect(e.x+1,y+8,10,1.3); return; }
    case 'lever': { const on=e.on;
      inkLine(ctx,[[cx,e.y+32],[cx,e.y+12]],'#c9d6e0',2);
      rrp(ctx,e.x-4,e.y+2,24,12,6); inked(ctx,on?'#2bb58a':'#ff6b6b',1.6);
      ctx.beginPath(); ctx.arc(on?e.x+14:e.x+2,e.y+8,4.2,0,TAU); inked(ctx,'#ffffff',1.3);
      if(!on && ((e.t/20)|0)%2){ ctx.strokeStyle='rgba(255,209,102,.9)'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(cx,e.y+8,17,0,TAU); ctx.stroke(); }
      return; }
    case 'tracker': { const y=e.y+Math.sin(e.t/10)*1.2;
      if(e.chase){ ctx.strokeStyle=`rgba(255,92,122,${0.5-0.5*((e.t%40)/40)})`; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(cx,y+5,6+14*((e.t%40)/40),0,TAU); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(cx,y+5,6.5,Math.PI*.8,Math.PI*.2); ctx.lineTo(cx,y+16); ctx.closePath(); inked(ctx,'#ff5c7a',1.5);
      ctx.beginPath(); ctx.arc(cx,y+5,3,0,TAU); inked(ctx,'#ffffff',1); ctx.fillStyle=INK; ctx.beginPath(); ctx.arc(cx+(G.p.x>e.x?1:-1),y+5,1.3,0,TAU); ctx.fill();
      return; }
    case 'popup': {
      rrp(ctx,e.x,e.y,26,18,3); inked(ctx,'#ffffff',1.5);
      ctx.save(); rrp(ctx,e.x,e.y,26,18,3); ctx.clip(); ctx.fillStyle='#5b82ff'; ctx.fillRect(e.x,e.y,26,5); ctx.restore();
      ctx.strokeStyle=INK; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(e.x,e.y+5); ctx.lineTo(e.x+26,e.y+5); ctx.stroke();
      ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.2; ctx.beginPath(); ctx.moveTo(e.x+20.5,e.y+1.2); ctx.lineTo(e.x+23,e.y+3.8); ctx.moveTo(e.x+23,e.y+1.2); ctx.lineTo(e.x+20.5,e.y+3.8); ctx.stroke();
      ctx.fillStyle='#e63946'; ctx.font=`800 6.5px ${FUN}`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('PROMO',cx,e.y+10.5);
      ctx.fillStyle='#ffc93c'; ctx.fillRect(e.x+7,e.y+14,12,2);
      return; }
    case 'rain': {
      ctx.beginPath(); ctx.moveTo(e.x+6,e.y+e.h); ctx.lineTo(e.x+3,e.y+e.h+5); ctx.lineTo(e.x+11,e.y+e.h); ctx.closePath(); inked(ctx,'#ffd6d6',1.2);
      rrp(ctx,e.x,e.y,e.w,e.h,5); inked(ctx,'#ffd6d6',1.4);
      ctx.fillStyle='#8a1f2e'; ctx.font=`700 8.5px ${SANS}`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(e.txt,cx,e.y+e.h/2+.5);
      return; }
    case 'friend': { const f=FRIENDS[e.node], bob=Math.sin(e.t/16+e.tx)*1, y=e.y+bob;
      ctx.fillStyle='rgba(29,26,51,.28)'; ctx.beginPath(); ctx.ellipse(cx,e.y+e.h,9,2,0,0,TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(e.x+2,y+19); ctx.lineTo(e.x-2,y+25); ctx.lineTo(e.x+7,y+20); ctx.closePath(); inked(ctx,f.col,1.4);
      rrp(ctx,e.x-2,y+4,18,17,7); inked(ctx,f.col,1.6);
      [e.x+3.5,e.x+10.5].forEach(ex=>{ ctx.beginPath(); ctx.arc(ex,y+11,2.2,0,TAU); inked(ctx,'#fff',.8); ctx.fillStyle=INK; ctx.beginPath(); ctx.arc(ex+.4,y+11.4,1.1,0,TAU); ctx.fill(); });
      ctx.strokeStyle=INK; ctx.lineWidth=1.2; ctx.beginPath(); ctx.arc(cx,y+14,2.6,0.2,Math.PI-0.2); ctx.stroke();
      if(e.node===CENTRE && G.found){ ctx.strokeStyle='#ffd23c'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(cx,y+12,14+Math.sin(G.t/8),0,TAU); ctx.stroke(); }
      return; }
    case 'reflex': { if(e.dead) return; const b=Math.sin(e.t/16)*1.5;
      ctx.beginPath(); ctx.arc(cx,e.y+7+b,7,0,TAU); inked(ctx,'#ffe27a',1.5);
      ctx.fillStyle=INK; ctx.font=`800 10px ${FUN}`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('?',cx,e.y+7.5+b); return; }
    case 'check': {
      inkLine(ctx,[[e.x+2,e.y+32],[e.x+2,e.y+3]],'#e0e4f2',1.6);
      ctx.beginPath(); ctx.arc(e.x+2,e.y+2,2.2,0,TAU); inked(ctx,'#ffc93c',1.1);
      const wv=Math.sin(e.t/9)*1.5; ctx.beginPath(); ctx.moveTo(e.x+3,e.y+4); ctx.quadraticCurveTo(e.x+9,e.y+2+wv,e.x+15,e.y+6); ctx.quadraticCurveTo(e.x+9,e.y+10-wv,e.x+3,e.y+13); ctx.closePath(); inked(ctx,e.on?'#2bb58a':'#ff6b4a',1.3); return; }
    case 'exit': { const open=G.def.canExit(G)===true, x=e.x-2, y=e.y-4, w=28, h=36;
      const arch=(ax,ay,aw,ah)=>{ ctx.beginPath(); ctx.moveTo(ax,ay+ah); ctx.lineTo(ax,ay+aw/2); ctx.arc(ax+aw/2,ay+aw/2,aw/2,Math.PI,0); ctx.lineTo(ax+aw,ay+ah); ctx.closePath(); };
      if(open){ const gl=ctx.createRadialGradient(x+w/2,y+h/2,4,x+w/2,y+h/2,34); gl.addColorStop(0,'rgba(255,240,160,.55)'); gl.addColorStop(1,'rgba(255,240,160,0)'); ctx.fillStyle=gl; ctx.fillRect(x-24,y-20,w+48,h+40); }
      arch(x,y,w,h); inked(ctx,G.th.door,1.8);
      arch(x+4,y+4,w-8,h-4); inked(ctx,open?'#fff3b0':'#8a5a3c',1.4);
      if(open){ ctx.beginPath(); ctx.moveTo(x+4,y+h); ctx.lineTo(x+4,y+14); ctx.lineTo(x+11,y+16); ctx.lineTo(x+11,y+h); ctx.closePath(); inked(ctx,'#8a5a3c',1.3); }
      else { ctx.strokeStyle='rgba(29,26,51,.45)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(x+w/2,y+6); ctx.lineTo(x+w/2,y+h); ctx.stroke(); ctx.beginPath(); ctx.arc(x+w/2+4,y+h/2+4,1.6,0,TAU); ctx.fillStyle='#ffc93c'; ctx.fill(); }
      ctx.beginPath(); ctx.arc(x+w/2,y-4,3.4,0,TAU); inked(ctx,open?'#4cd18f':(((e.t/15)|0)%2?'#ff5c5c':'#9a2e2e'),1.3);
      return; }
    case 'troll': {
      if(e.dead){ if(e.squish<=0) return; ctx.globalAlpha=e.squish/24; ctx.beginPath(); ctx.ellipse(cx,e.y+e.h-2,9,3,0,0,TAU); inked(ctx,'#9b7ae0',1.3); ctx.globalAlpha=1; return; }
      const bob=Math.sin(e.t/6), cy=e.y+6+bob*.6, d=e.vx>0?1:-1;
      ctx.fillStyle=INK; [-1,1].forEach(s=>{ ctx.beginPath(); ctx.ellipse(cx+s*3.5+(s*bob*1.2),e.y+e.h-1,2.8,1.8,0,0,TAU); ctx.fill(); });
      ctx.save(); ctx.translate(cx,cy); ctx.scale(1-bob*.04,1+bob*.05);
      [-1,1].forEach(s=>{ ctx.beginPath(); ctx.moveTo(s*2.5,-5); ctx.lineTo(s*6,-11); ctx.lineTo(s*6,-4); ctx.closePath(); inked(ctx,'#f3e6ff',1.1); });
      rrp(ctx,-7.5,-6,15,13,5.5); inked(ctx,'#9b7ae0',1.6);
      [-2.6,2.6].forEach(ex=>{ ctx.beginPath(); ctx.ellipse(ex,-1.2,2,2.2,0,0,TAU); inked(ctx,'#fff',.8); ctx.fillStyle=INK; ctx.beginPath(); ctx.arc(ex+d*.7,-.8,1,0,TAU); ctx.fill(); });
      ctx.strokeStyle=INK; ctx.lineWidth=1.3; ctx.beginPath(); ctx.moveTo(-4.6,-4.8); ctx.lineTo(-1.2,-3.4); ctx.moveTo(4.6,-4.8); ctx.lineTo(1.2,-3.4); ctx.stroke();
      rrp(ctx,-3,2,6,2.8,1); inked(ctx,'#ffffff',.9);
      ctx.restore(); return; }
  }
}
function drawLabels(e){
  if(e.dead) return;
  const cx=e.x+e.w/2;
  switch(e.type){
    case 'info': sign(e.info.a,cx,e.y-5+Math.sin(e.t/18)*1.5); break;
    case 'lever': { const s=LEVERS[e.key]; sign(e.on?s.off:s.on,cx,e.y,{fill:e.on?'#c8f5d9':'#ffd6d6'}); break; }
    case 'popup': sign(e.txt,cx,e.y-3,{font:`700 9px ${SANS}`, fill:'#ffe0f0'}); break;
    case 'friend': { const f=FRIENDS[e.node], known=G.rung.has(e.node);
      sign(known?`${f.name} · exc. ${ECC[e.node]}`:f.name,cx,e.y+1,{fill:(G.found&&e.node===CENTRE)?'#ffe27a':known?'#e6ebff':'#fffaf0'}); break; }
    case 'reflex': sign(e.rf.t,cx,e.y-4+Math.sin(e.t/16)*1.5); break;
    case 'exit': { const open=G.def.canExit(G)===true; sign((open?'Ouvert · ':'Fermé · ')+G.def.exitLabel,cx,e.y-13,{fill:open?'#c8f5d9':'#ffd6d6'}); break; }
  }
}
function drawPlayer(){
  const p=G.p, bx=p.x+p.w/2, by=p.y+p.h;
  if(p.onGround){ ctx.fillStyle='rgba(29,26,51,.28)'; ctx.beginPath(); ctx.ellipse(bx,by,8,2,0,0,TAU); ctx.fill(); }
  if(p.invul>0 && (p.invul>>2)%2) return;
  const run=p.onGround&&Math.abs(p.vx)>0.3, ph=Math.sin(G.t/3.2), air=!p.onGround;
  ctx.fillStyle=INK;
  [[-1,ph],[1,-ph]].forEach(([s,o])=>{ ctx.beginPath(); ctx.ellipse(bx+s*3.6+(run?o*2:0), by-1.2-(run&&o>0?1.4:0)+(air?1:0), 3.2, 2, 0, 0, TAU); ctx.fill(); });
  ctx.save(); ctx.translate(bx,by-2);
  const sq=p.sq; ctx.scale(p.face*(1+sq*0.18),1-sq*0.18);
  const bob=run?Math.abs(ph)*1.3:0;
  if(S.img && S.img.complete && S.img.naturalWidth) ctx.drawImage(S.img,-13,-25-bob,26,26);
  else { ctx.fillStyle=PAL_LIT[S.hero.id]; ctx.fillRect(-6,-14,12,14); }
  ctx.restore();
}
function drawParts(){
  for(const q of G.parts){
    ctx.globalAlpha=Math.min(1,q.life/20);
    if(q.kind==='smoke'){ ctx.fillStyle=q.c; ctx.beginPath(); ctx.arc(q.x,q.y,q.s||3,0,TAU); ctx.fill(); }
    else if(q.kind==='star'){ ctx.fillStyle=q.c; ctx.beginPath(); for(let k=0;k<8;k++){ const a=k*Math.PI/4, rr=k%2?1:3.2; ctx.lineTo(q.x+Math.cos(a)*rr,q.y+Math.sin(a)*rr); } ctx.closePath(); ctx.fill(); }
    else { ctx.beginPath(); ctx.arc(q.x,q.y,1.8,0,TAU); ctx.fillStyle=q.c; ctx.fill(); }
  }
  ctx.globalAlpha=1;
}
function drawMiniMap(){
  const w=128, h=74, x=VW-w-8, y=8;
  const P={L:[12,54],I:[36,54],Y:[60,54],C:[84,54],S:[110,54],M:[74,32],J:[98,20]};
  ctx.fillStyle=INK; rrp(ctx,x+2.5,y+2.5,w,h,10); ctx.fill(); rrp(ctx,x,y,w,h,10); inked(ctx,'#fff8e6',1.8);
  ctx.fillStyle=INK; ctx.font=`800 9px ${FUN}`; ctx.textAlign='left'; ctx.textBaseline='middle'; ctx.fillText('Graphe des amis',x+7,y+9);
  ctx.strokeStyle=INK; ctx.lineWidth=1.5; ctx.beginPath(); FEDGES.forEach(([a,b])=>{ ctx.moveTo(x+P[a][0],y+P[a][1]); ctx.lineTo(x+P[b][0],y+P[b][1]); }); ctx.stroke();
  Object.entries(P).forEach(([k,[px,py]])=>{
    if(G.found&&k===CENTRE){ ctx.strokeStyle='#e0a800'; ctx.lineWidth=2.2; ctx.beginPath(); ctx.arc(x+px,y+py,9.5,0,TAU); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(x+px,y+py,6.8,0,TAU); inked(ctx,FRIENDS[k].col,1.3);
    ctx.fillStyle=INK; ctx.font=`700 7.5px ${SANS}`; ctx.textAlign='center'; ctx.fillText(FRIENDS[k].name[0],x+px,y+py+.5);
    if(G.rung.has(k)){ ctx.font=`700 7px ${MONO}`; ctx.fillStyle='#5b3fc0'; ctx.fillText(String(ECC[k]),x+px+(k==='J'?-11:0),y+py+(k==='J'?0:12)); }
  });
}
function drawRain(){
  ctx.strokeStyle='rgba(205,218,255,.33)'; ctx.lineWidth=1; ctx.beginPath();
  for(let k=0;k<55;k++){ const x=((k*97.3+G.t*1.2)%(VW+40))-20, y=((k*61.7+G.t*6.5)%(VH+40))-20; ctx.moveTo(x,y); ctx.lineTo(x-2.5,y+9); }
  ctx.stroke();
}
function render(){
  if(!G||!G.art) return;
  ctx.setTransform(SC,0,0,SC,0,0);
  drawLayers();
  const sx=G.shake?(Math.random()-.5)*4:0, sy=G.shake?(Math.random()-.5)*4:0;
  const camX=Math.round(G.cam.x*SC)/SC, camY=Math.round(G.cam.y*SC)/SC;
  ctx.save(); ctx.translate(-camX+sx,-camY+sy);
  if(!G.def.autoRespawn){ const gy=14*T, pg=ctx.createLinearGradient(0,gy,0,G.Hh); pg.addColorStop(0,'rgba(29,26,51,.55)'); pg.addColorStop(.35,'#1d1a33'); ctx.fillStyle=pg; ctx.fillRect(camX-4,gy,VW+8,G.Hh-gy+40); }
  if(G.def.minimap) drawEdges();
  const tr=G.art.terrain, rs=G.art.rs, tx0=Math.max(0,camX), ty0=Math.max(0,camY);
  const tw=Math.min(VW+2,G.W-tx0), thh=Math.min(VH+2,G.Hh-ty0);
  if(tw>0&&thh>0) ctx.drawImage(tr.c, tx0*rs, ty0*rs, Math.min(tw*rs,tr.c.width-tx0*rs), Math.min(thh*rs,tr.c.height-ty0*rs), tx0, ty0, tw, thh);
  drawFlames(camX,camY);
  const vis=G.ents.filter(e=>e.x>camX-150 && e.x<camX+VW+150 && e.y>camY-90 && e.y<camY+VH+90);
  vis.forEach(drawEnt);
  drawPlayer(); drawParts();
  vis.forEach(drawLabels);
  for(const q of G.texts){ ctx.globalAlpha=Math.min(1,q.life/25); ctx.font=`800 13px ${FUN}`; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.strokeStyle=INK; ctx.lineWidth=3.2; ctx.lineJoin='round'; ctx.strokeText(q.text,q.x,q.y); ctx.fillStyle=q.c; ctx.fillText(q.text,q.x,q.y); }
  ctx.globalAlpha=1;
  ctx.restore();
  if(G.th.rain && G.storm>0) drawRain();
  if(G.flash>0){ ctx.fillStyle=`rgba(235,240,255,${G.flash*0.28})`; ctx.fillRect(0,0,VW,VH); }
  if(G.def.minimap) drawMiniMap();
  if(G.banner>0){
    ctx.globalAlpha=Math.min(1,G.banner/30);
    const bw=240, x=VW/2-bw/2, y=12;
    [[x-16,1],[x+bw+16,-1]].forEach(([tx,s])=>{ ctx.beginPath(); ctx.moveTo(tx,y+10); ctx.lineTo(tx+s*22,y+10); ctx.lineTo(tx+s*22,y+44); ctx.lineTo(tx,y+44); ctx.lineTo(tx+s*8,y+27); ctx.closePath(); inked(ctx,'#8a6cff',2); });
    ctx.fillStyle=INK; rrp(ctx,x+2.5,y+2.5,bw,44,10); ctx.fill(); rrp(ctx,x,y,bw,44,10); inked(ctx,'#fff4d1',2.2);
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillStyle='#e0552f'; ctx.font=`800 10px ${FUN}`; ctx.fillText(`CHAPITRE ${G.i+1}`,VW/2,y+13);
    ctx.fillStyle=INK; ctx.font=`800 18px ${FUN}`; ctx.fillText(G.def.name,VW/2,y+30);
    ctx.globalAlpha=1;
  }
  if(state==='pause'){
    ctx.fillStyle='rgba(20,18,40,.55)'; ctx.fillRect(0,0,VW,VH);
    const w=220,h=74,x=VW/2-w/2,y=VH/2-h/2;
    ctx.fillStyle=INK; rrp(ctx,x+3,y+3,w,h,14); ctx.fill(); rrp(ctx,x,y,w,h,14); inked(ctx,'#fff4d1',2.2);
    ctx.fillStyle=INK; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.font=`800 26px ${FUN}`; ctx.fillText('Pause',VW/2,y+28);
    ctx.font=`700 11px ${SANS}`; ctx.fillText('P ou « Reprendre » pour continuer',VW/2,y+54);
  }
}

/* =====================================================================
   BOUCLE & CONTRÔLES
   ===================================================================== */
let last=performance.now(), acc=0;
function frame(now){
  requestAnimationFrame(frame);
  const dt=Math.min(0.1,(now-last)/1000); last=now;
  if(!G || $('#game').hidden){ acc=0; return; }
  if(state==='play'){ acc+=dt; let n=0; while(acc>=1/60 && n<5){ step(); acc-=1/60; n++; } }
  else acc=0;
  render();
}
requestAnimationFrame(frame);

function setPause(on){
  if(!G || G.over) return;
  if(on && state==='play'){ state='pause'; for(const k in K) K[k]=false; document.querySelectorAll('.touch button').forEach(b=>b.classList.remove('on')); }
  else if(!on && state==='pause'){ state='play'; }
  $('#pauseBtn').textContent=state==='pause'?'Reprendre':'Pause';
}
$('#pauseBtn').onclick=()=>setPause(state!=='pause');
$('#fsBtn').onclick=()=>{
  try{
    if(document.fullscreenElement) document.exitFullscreen();
    else { const r=$('#game').requestFullscreen?.(); if(r&&r.catch) r.catch(()=>toast('Le plein écran n’est pas disponible ici.','info')); }
  }catch(err){ toast('Le plein écran n’est pas disponible ici.','info'); }
};
const KEYMAP={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'jump',KeyW:'jump',Space:'jump'};
window.addEventListener('keydown',e=>{
  if(state!=='play' && state!=='pause') return;
  if(e.code==='KeyP'||e.code==='Escape'){ e.preventDefault(); setPause(state!=='pause'); return; }
  const k=KEYMAP[e.code]; if(!k) return;
  e.preventDefault(); if(state!=='play') return;
  if(k==='jump' && !K.jump) K.jumpPressed=true;
  K[k]=true;
});
window.addEventListener('keyup',e=>{ const k=KEYMAP[e.code]; if(k){ K[k]=false; if(state==='play'||state==='pause') e.preventDefault(); } });
window.addEventListener('blur',()=>setPause(true));
document.addEventListener('visibilitychange',()=>{ if(document.hidden) setPause(true); });
document.querySelectorAll('.touch [data-k]').forEach(b=>{
  const k=b.dataset.k;
  const on=e=>{ e.preventDefault(); if(state==='pause') setPause(false); if(k==='jump'&&!K.jump) K.jumpPressed=true; K[k]=true; b.classList.add('on'); try{ b.setPointerCapture(e.pointerId); }catch(_){} };
  const off=()=>{ K[k]=false; b.classList.remove('on'); };
  b.addEventListener('pointerdown',on); b.addEventListener('pointerup',off); b.addEventListener('pointercancel',off); b.addEventListener('lostpointercapture',off);
  b.addEventListener('contextmenu',e=>e.preventDefault());
});
if(document.fonts && document.fonts.ready) document.fonts.ready.then(()=>{ if(G) render(); });

select();
