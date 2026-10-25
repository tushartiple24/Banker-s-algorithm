/* simulation.js: Live bank: Banker AI, Reckless AI and play-as-banker modes. */
function start(auto){reset();const e=validate();if(e)return lg("bad",e);const mode=$("mode").value;
 S={al:cp(alloc),mx:cp(max),av:avail.slice(),fin:alloc.map(()=>false),tick:0,over:null,mode,score:0,pend:null};hud();
 if(mode=="safe"&&!safety(S.al,S.mx,S.av).safe)lg("wn","Heads up: this starting state is already unsafe.");
 if(mode=="me")return advance();
 if(auto){T2=setInterval(advance,delay());$("run").textContent="Pause"}}
function end(k,t){S.over=k;clearInterval(T2);T2=null;$("run").textContent="Run";$("ask").innerHTML="";lg(k=="win"?"ok":"bad",t+(S.mode=="me"?` Final score ${S.score}.`:""));hud()}
function advance(){
 if(!S||S.over)return;const live=S.fin.map((f,i)=>f?-1:i).filter(i=>i>=0);
 if(!live.length)return end("win","Every process finished.");
 const d=needOf(S.al,S.mx),f=live.find(i=>d[i].every(x=>!x));S.tick++;
 if(f!==undefined){spawn(f,"v",sum(S.al[f]));S.av=add(S.av,S.al[f]);lg("ok",`P${f} finished and returned ${fmt(S.al[f])}.`);S.al[f]=z(m);S.mx[f]=z(m);S.fin[f]=true;hud();return S.mode=="me"?advance():0}
 const cs=live.filter(i=>d[i].some((x,j)=>Math.min(x,S.av[j])>0));
 if(!cs.length)return end("lose",`Deadlock. ${live.map(i=>"P"+i).join(", ")} wait on each other with only ${fmt(S.av)} free.`);
 const p=cs[rnd(0,cs.length-1)],r=d[p].map((x,j)=>{const c=Math.min(x,S.av[j]);return rnd(0,Math.random()<.5?Math.ceil(c/2):c)});
 if(!sum(r)){const j=d[p].findIndex((x,k)=>Math.min(x,S.av[k])>0);r[j]=1}
 if(S.mode=="me"){S.pend={p,r};return ask()}
 decide(p,r,S.mode=="reck"||isSafe(p,r))}
function decide(p,r,ok){if(ok){S.al[p]=add(S.al[p],r);S.av=sub(S.av,r);spawn("v",p,sum(r));lg("ok",`P${p} asks ${fmt(r)}. Granted.`)}else lg("bad",`P${p} asks ${fmt(r)}. Denied, no safe order would remain.`);hud()}
function ask(){const{p,r}=S.pend;
 $("ask").innerHTML=`<div class="req"><p class="big">P${p} asks for ${fmt(r)}</p><p class="dim">Free right now: ${fmt(S.av)}</p><div class="row"><button id="gr">Grant</button><button class="g" id="dn">Deny</button><button class="g" id="ht">Ask the algorithm</button></div><p id="hint" class="dim"></p></div>`;
 $("gr").onclick=()=>me(true);$("dn").onclick=()=>me(false);$("ht").onclick=()=>$("hint").textContent=isSafe(p,r)?"Safe: a finishing order still exists.":"Unsafe: granting this could trap everyone.";hud()}
function me(g){const{p,r}=S.pend,ok=isSafe(p,r);S.pend=null;$("ask").innerHTML="";
 if(g){decide(p,r,true);if(ok)S.score+=10;else{S.score-=15;lg("bad","That grant made the state unsafe. There is no guaranteed way out now.")}}
 else{lg(ok?"wn":"ok",`P${p} denied. ${ok?"It was safe to grant, a bit cautious.":"Good call, that one was unsafe."}`);S.score+=ok?-3:10;S.tick++}
 hud();advance()}
