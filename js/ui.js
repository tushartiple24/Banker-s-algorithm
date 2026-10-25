/* ui.js: Event log and status HUD. */
function lg(c,t){const li=document.createElement("li");li.className=c;li.textContent=t;$("log").prepend(li);while($("log").children.length>70)$("log").lastChild.remove()}
function pause(){clearInterval(T2);T2=null;$("run").textContent="Run"}
function reset(){clearInterval(T1);pause();S=null;A=null;P=[];$("ask").innerHTML="";$("log").innerHTML="";hud()}
function hud(){let h="";
 if(S){const sf=S.over?null:safety(S.al,S.mx,S.av).safe;
  h=`<div class="stat"><b>${S.fin.filter(Boolean).length}/${n}</b><span>finished</span></div><div class="stat"><b>${S.tick}</b><span>events</span></div>`+(S.mode=="me"?`<div class="stat"><b>${S.score}</b><span>score</span></div>`:"")+
  `<div class="light ${sf===false||S.over=="lose"?'bad':''}"><i></i>${S.over=="win"?"Books cleared":S.over=="lose"?"Deadlock":sf?"State safe":"State unsafe"}</div>`}
 else h=`<p class="dim">Press Solve for a safe sequence, or Run to start a live bank.</p>`;
 $("hud").innerHTML=h}
function spawn(f,t,c){c=Math.min(Math.max(c,3),14);for(let k=0;k<c;k++)P.push({f,t,u:-k*.1})}
