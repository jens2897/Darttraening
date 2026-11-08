'use strict';
const $=id=>document.getElementById(id);
const definitions={
 20:[['T20','Triple 20','triple',3],['S20 over T20','Single 20 · over','single',1],['S20 under T20','Single 20 · under','single',1],['5 over T5','Single 5 · over','neighbor',-1],['T5','Triple 5','neighbor',-1],['5 under T5','Single 5 · under','neighbor',-1],['1 over T1','Single 1 · over','neighbor',-1],['T1','Triple 1','neighbor',-1],['1 under T1','Single 1 · under','neighbor',-1]],
 19:[['T19','Triple 19','triple',3],['S19 over T19','Single 19 · over','single',1],['S19 under T19','Single 19 · under','single',1],['7 over T7','Single 7 · over','neighbor',-1],['T7','Triple 7','neighbor',-1],['7 under T7','Single 7 · under','neighbor',-1],['3 over T3','Single 3 · over','neighbor',-1],['T3','Triple 3','neighbor',-1],['3 under T3','Single 3 · under','neighbor',-1]],
 18:[['T18','Triple 18','triple',3],['S18 over T18','Single 18 · over','single',1],['S18 under T18','Single 18 · under','single',1],['1 over T1','Single 1 · over','neighbor',-1],['T1','Triple 1','neighbor',-1],['1 under T1','Single 1 · under','neighbor',-1],['4 over T4','Single 4 · over','neighbor',-1],['T4','Triple 4','neighbor',-1],['4 under T4','Single 4 · under','neighbor',-1]]
};
let field='20', target=100, throws=[], active=false, history=loadHistory();
function loadHistory(){try{return JSON.parse(localStorage.getItem('dart20_history')||'[]')}catch(e){return []}}
function saveHistory(){localStorage.setItem('dart20_history',JSON.stringify(history))}
function counts(){return definitions[field].map((d,i)=>throws.filter(x=>x===i).length)}
function score(){return throws.reduce((s,i)=>s+definitions[field][i][3],0)}
function pct(n){return throws.length?Math.round(n/throws.length*100):0}
function renderGrid(){
 $('hitGrid').innerHTML='';
 definitions[field].forEach((d,i)=>{
  const b=document.createElement('button');b.className='hit '+(d[2]==='neighbor'?'neighbor':'target')+(d[2]==='triple'?' triple':'');
  b.innerHTML=`<span class="main">${d[0]}</span><small>${d[3]>0?'+'+d[3]:d[3]} point · <span id="hitcount${i}">0</span></small>`;
  b.disabled=!active||throws.length>=target;b.addEventListener('click',()=>addThrow(i));$('hitGrid').appendChild(b);
 });
}
function render(){
 const c=counts();$('count').textContent=`${throws.length}/${target}`;$('points').textContent=score();$('remaining').textContent=Math.max(0,target-throws.length);$('bar').style.width=Math.min(100,throws.length/target*100)+'%';
 $('stats').innerHTML='';
 definitions[field].forEach((d,i)=>{const row=document.createElement('div');row.className='statrow';row.innerHTML=`<span class="name" title="${d[0]}">${d[0]}</span><b>${c[i]}</b><span class="muted">${pct(c[i])}%</span>`;$('stats').appendChild(row);});
 [...$('hitGrid').children].forEach((b,i)=>{b.disabled=!active||throws.length>=target;b.querySelector('small').innerHTML=`${definitions[field][i][3]>0?'+'+definitions[field][i][3]:definitions[field][i][3]} point · ${c[i]} stk.`});
 $('undoBtn').disabled=!active||throws.length===0;$('finishBtn').disabled=!active;$('field').disabled=active;$('target').disabled=active;
 $('notice').classList.toggle('hidden',!(active&&throws.length>=target));
 if(active&&throws.length>=target){$('notice').textContent='🎉 Målet er nået! Træningen er gemt.';finishSession(true)}
}
function addThrow(i){if(!active||throws.length>=target)return;throws.push(i);render();if(throws.length>=target){}}
function start(){if(active&&throws.length){if(!confirm('Den aktuelle træning afsluttes og gemmes, før en ny startes. Fortsæt?'))return;finishSession(false)}
 field=$('field').value;target=Math.max(1,Math.min(9999,parseInt($('target').value,10)||100));$('target').value=target;throws=[];active=true;$('notice').classList.add('hidden');renderGrid();render();}
function finishSession(auto=false){if(!active)return;if(throws.length===0){active=false;render();return}
 const c=counts(), total=throws.length, defs=definitions[field];
 const rec={id:Date.now(),date:new Date().toISOString(),field,throws:total,counts:c,labels:defs.map(d=>d[0]),percentages:c.map(n=>Math.round(n/total*1000)/10),points:score(),target,completed:total>=target};
 history.unshift(rec);saveHistory();active=false;renderGrid();render();
 if(auto||total>0){$('modalTitle').textContent=total>=target?'Træningsmål nået!':'Træning gemt';$('modalText').textContent=`${total} kast på ${field}-feltet · ${score()} point. Resultatet er gemt i din historik.`;$('modal').classList.remove('hidden')}
}
function reset(){if(throws.length&&!confirm('Vil du nulstille den aktuelle træning? Resultatet bliver ikke gemt.'))return;throws=[];active=false;$('notice').classList.add('hidden');renderGrid();render()}
function undo(){if(throws.length){throws.pop();render()}}
function showTab(tab){const train=tab==='train';$('trainView').classList.toggle('hidden',!train);$('historyView').classList.toggle('hidden',train);$('tabTrain').classList.toggle('active',train);$('tabHistory').classList.toggle('active',!train);if(!train)renderHistory()}
function fmtDate(s){return new Date(s).toLocaleString('da-DK',{dateStyle:'short',timeStyle:'short'})}
function renderHistory(){
 $('historyList').innerHTML='';
 if(!history.length){$('historyList').innerHTML='<p class="muted">Der er endnu ikke gemt nogen træninger.</p>';drawChart();return}
 history.forEach(r=>{const el=document.createElement('div');el.className='history-item';const left=document.createElement('div');left.innerHTML=`<strong>${fmtDate(r.date)} · ${r.field}-feltet</strong><small>${r.throws} kast · ${r.completed?'Mål nået':'Afsluttet før tid'}</small>`;const right=document.createElement('div');right.className='right';right.innerHTML=`<b>${r.points} point</b><button data-id="${r.id}">Detaljer</button>`;right.querySelector('button').onclick=()=>showDetails(r);el.append(left,right);$('historyList').appendChild(el)});
 drawChart();
}
function showDetails(r){const detail=r.labels.map((l,i)=>`${l}: ${r.counts[i]} (${r.percentages[i]}%)`).join('\n');$('modalTitle').textContent=`Detaljer · ${r.field}-feltet`;$('modalText').style.whiteSpace='pre-line';$('modalText').textContent=`${fmtDate(r.date)}\n${r.throws} kast · ${r.points} point\n\n${detail}`;$('modal').classList.remove('hidden')}
function csvExport(){if(!history.length){alert('Der er ingen træninger at eksportere endnu.');return}const headers=['Dato','Felt','Antal kast','Point','Mål'];const labels=[...new Set(history.flatMap(r=>r.labels))];const rows=[headers.concat(labels)];history.forEach(r=>{const vals=labels.map(l=>{const i=r.labels.indexOf(l);return i<0?'':r.counts[i]});rows.push([fmtDate(r.date),r.field,r.throws,r.points,r.target,...vals])});const csv='\ufeff'+rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(';')).join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='darttraening_historik.csv';a.click();URL.revokeObjectURL(url)}
function clearHistory(){if(!history.length)return;if(!confirm('Slet alle gemte træninger permanent fra denne enhed?'))return;history=[];saveHistory();renderHistory()}
function drawChart(){
 const canvas=$('chart');if(!canvas||$('historyView').classList.contains('hidden'))return;const rect=canvas.getBoundingClientRect();const dpr=window.devicePixelRatio||1;canvas.width=Math.max(1,rect.width*dpr);canvas.height=Math.max(1,rect.height*dpr);const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);const w=rect.width,h=rect.height;ctx.clearRect(0,0,w,h);
 const metric=$('chartMetric').value;const list=history.slice(0,20).reverse();if(!list.length){ctx.fillStyle='#aebdc7';ctx.fillText('Gem nogle træninger for at se udviklingen.',12,25);return}
 const vals=list.map(r=>{if(metric==='points')return r.points;let idx=r.labels.findIndex(l=>l.startsWith('T'+r.field));if(metric==='triple')return r.counts[idx]||0;if(metric==='single')return r.labels.reduce((s,l,i)=>s+(l.startsWith('S'+r.field)?r.counts[i]:0),0);if(metric==='neighbor')return r.counts.reduce((s,n,i)=>s+(r.labels[i].startsWith('T'+r.field)||r.labels[i].startsWith('S'+r.field)?0:n),0);return r.counts.reduce((s,n,i)=>s+(/over|under/.test(r.labels[i])?n:0),0)});
 const max=Math.max(1,...vals)*1.15,pad={l:28,r:8,t:12,b:28},cw=w-pad.l-pad.r,ch=h-pad.t-pad.b;ctx.strokeStyle='#3b4d59';ctx.lineWidth=1;for(let k=0;k<=4;k++){let y=pad.t+ch*k/4;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();ctx.fillStyle='#aebdc7';ctx.font='10px system-ui';ctx.fillText(String(Math.round(max*(1-k/4))),2,y+3)}
 const step=cw/Math.max(1,vals.length);ctx.strokeStyle='#e7b84b';ctx.lineWidth=2.5;ctx.beginPath();vals.forEach((v,i)=>{let x=pad.l+step*(i+.5),y=pad.t+ch*(1-v/max);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});ctx.stroke();vals.forEach((v,i)=>{let x=pad.l+step*(i+.5),y=pad.t+ch*(1-v/max);ctx.fillStyle='#e7b84b';ctx.beginPath();ctx.arc(x,y,3.5,0,Math.PI*2);ctx.fill()});ctx.fillStyle='#aebdc7';ctx.font='10px system-ui';ctx.fillText('Ældste',pad.l,h-7);ctx.fillText('Nyeste',Math.max(pad.l,w-48),h-7);
}
$('startBtn').onclick=start;$('undoBtn').onclick=undo;$('finishBtn').onclick=()=>finishSession(false);$('resetBtn').onclick=reset;$('field').onchange=()=>{field=$('field').value;renderGrid();render()};$('target').onchange=()=>{if(!active){target=Math.max(1,parseInt($('target').value,10)||100);render()}};$('tabTrain').onclick=()=>showTab('train');$('tabHistory').onclick=()=>showTab('history');$('modalClose').onclick=()=>$('modal').classList.add('hidden');$('csvBtn').onclick=csvExport;$('clearHistoryBtn').onclick=clearHistory;$('chartMetric').onchange=drawChart;window.addEventListener('resize',drawChart);
renderGrid();render();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
