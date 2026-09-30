import fs from 'node:fs';
const source = fs.readFileSync('design-reference.txt','utf8');
const prefix = source.match(/const assetPathPrefix = "([^"]+)"/)[1];
const assets = Object.fromEntries([...source.matchAll(/const (\w+) = `\$\{assetPathPrefix\}\/([^`]+)`/g)].map(m=>[m[1],m[2]]));
fs.mkdirSync('assets',{recursive:true});
if(process.argv.includes('--assets')) {
  for (const name of Object.values(assets)) {
    if(fs.existsSync('assets/'+name)) continue;
    const r=await fetch(prefix+'/'+name); if(!r.ok) throw new Error('Asset '+r.status);
    fs.writeFileSync('assets/'+name,Buffer.from(await r.arrayBuffer()));
  }
}
const fixed = {'flex':'display:flex','block':'display:block','flex-col':'flex-direction:column','flex-wrap':'flex-wrap:wrap','relative':'position:relative','absolute':'position:absolute','items-start':'align-items:flex-start','items-center':'align-items:center','items-end':'align-items:flex-end','content-stretch':'align-content:stretch','content-start':'align-content:flex-start','justify-between':'justify-content:space-between','justify-center':'justify-content:center','shrink-0':'flex-shrink:0','overflow-clip':'overflow:clip','w-full':'width:100%','h-full':'height:100%','size-full':'width:100%;height:100%','min-w-full':'min-width:100%','min-w-px':'min-width:1px','min-h-px':'min-height:1px','max-w-none':'max-width:none','inset-0':'inset:0','h-0':'height:0','size-0':'width:0;height:0','mb-0':'margin-bottom:0','gap-px':'gap:1px','border':'border-width:1px','border-b':'border-bottom-width:1px','border-t':'border-top-width:1px','border-0':'border-width:0','border-solid':'border-style:solid','border-white':'border-color:white','text-white':'color:white','font-normal':'font-weight:400','font-medium':'font-weight:500','font-semibold':'font-weight:600','font-bold':'font-weight:700','font-extrabold':'font-weight:800','uppercase':'text-transform:uppercase','whitespace-nowrap':'white-space:nowrap','object-cover':'object-fit:cover','pointer-events-none':'pointer-events:none','[word-break:break-word]':'overflow-wrap:break-word'};
function css(token){
 if(fixed[token]) return fixed[token];
 if(token.startsWith('opacity-')) return 'opacity:'+Number(token.slice(8))/100;
 let m=token.match(/^([\w-]+)-\[(.*)\]$/); if(!m) throw Error(token);
 let [,key,v]=m; v=v.replaceAll('_',' ');
 if(key==='font') return 'font-family:'+ (v.includes('Lora')?'Lora,Georgia,serif':'Manrope,Arial,sans-serif');
 const prop={bg:'background',w:'width',h:'height','min-h':'min-height',gap:'gap',rounded:'border-radius',leading:'line-height',flex:'flex',border:'border-color',shadow:'box-shadow',right:'right',left:'left',top:'top',bottom:'bottom'}[key];
 if(prop) return prop+':'+v;
 if(key==='text') return (/^(#|rgb)/.test(v)?'color:':'font-size:')+v;
 if(key==='size') return 'width:'+v+';height:'+v;
 if(/^[pm][xytrbl]?$/.test(key)) { const root=key[0]==='p'?'padding':'margin'; const dirs={x:['left','right'],y:['top','bottom'],t:['top'],r:['right'],b:['bottom'],l:['left']}[key[1]]; return dirs?dirs.map(d=>root+'-'+d+':'+v).join(';'):root+':'+v; }
 throw Error(token);
}
let styles=[];
let html=source.slice(source.indexOf('    <div'),source.lastIndexOf('\n  );')).trim().replaceAll('className=','class=').replace(/src=\{(\w+)\}/g,(_,v)=>'src="assets/'+assets[v]+'"').replace(/class="([^"]+)"/g,(_,v)=>{ const name='d'+styles.length;styles.push('.'+name+'{'+v.split(' ').map(css).join(';')+'}');return 'class="'+name+'"';});
html=html.replace(/<div([^>]*?)\s*\/>/g,'<div$1></div>');
// Keep the source node identifiers so every design slot remains traceable.
fs.writeFileSync('index.html','<!doctype html>\n<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Берег — центр развития и нейрокоррекции для детей от 2 до 12 лет. Бережная поддержка ребёнка и семьи."><title>Берег — центр развития и нейрокоррекции</title><link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="responsive.css"><script src="app.js" defer></script></head><body><a class="skip-link" href="#directions">Перейти к содержанию</a>'+html+'</body></html>');
fs.writeFileSync('styles.css','@import url("https://fonts.googleapis.com/css2?family=Lora:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap");\n:root{--paper:#fffdf8;--sand:#f5f1e9;--ink:#233a36;--green:#315a50;--accent:#d76f52}*{box-sizing:border-box;border-width:0}body{margin:0;background:var(--sand);font-family:Manrope,Arial,sans-serif;color:var(--ink)}p,h1,h2,h3{margin:0}a{color:inherit;text-decoration:none}button,input,textarea{font:inherit}button,a,input,textarea{ -webkit-tap-highlight-color:transparent}img{display:block}'+styles.join('\n'));
console.log('Built HTML and CSS; '+Object.keys(assets).length+' assets.');
