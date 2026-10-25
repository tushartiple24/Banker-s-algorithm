/* ledger.js: Editable Allocation / Max / Available table and presets. */
function load(a,x,v){alloc=cp(a);max=cp(x);avail=v.slice();n=a.length;m=v.length;$("n").value=n;$("m").value=m;render()}
function randomSc(){const nn=rnd(3,6),mm=rnd(2,4),a=[],x=[],v=[];for(let i=0;i<nn;i++){a.push(z(mm));x.push(z(mm))}
 for(let j=0;j<mm;j++){let t=rnd(6,12);for(let i=0;i<nn;i++){x[i][j]=rnd(0,t);const g=Math.min(x[i][j],rnd(0,Math.ceil(t/nn)+1));a[i][j]=g;t-=g}v.push(t)}load(a,x,v)}
function resize(){const nn=Math.max(1,Math.min(10,+$("n").value||1)),mm=Math.max(1,Math.min(8,+$("m").value||1)),f=M=>Array.from({length:nn},(_,i)=>Array.from({length:mm},(_,j)=>(M[i]&&M[i][j])||0));
 alloc=f(alloc);max=f(max);avail=Array.from({length:mm},(_,j)=>avail[j]||0);n=nn;m=mm;render()}
function validate(){const d=needOf(alloc,max);for(let i=0;i<n;i++)for(let j=0;j<m;j++)if(d[i][j]<0)return`P${i} holds more of ${R(j)} than its Max.`;return null}
function render(){reset();const d=needOf(alloc,max);
 let h="<tr><th></th>"+["Allocation","Max","Need"].map(t=>`<th class="gl" colspan="${m}">${t}</th>`).join("")+"</tr><tr><th></th>";
 for(let k=0;k<3;k++)for(let j=0;j<m;j++)h+=`<th${j?'':' class="gl"'}>${R(j)}</th>`;h+="</tr>";
 for(let i=0;i<n;i++){h+=`<tr><td class="pn">P${i}</td>`;
  for(const[t,M]of[["a",alloc],["x",max]])for(let j=0;j<m;j++)h+=`<td${j?'':' class="gl"'}><input type="number" min="0" data-t="${t}" data-i="${i}" data-j="${j}" value="${M[i][j]}" aria-label="${t=='a'?'Allocation':'Max'} P${i} ${R(j)}"></td>`;
  for(let j=0;j<m;j++)h+=`<td class="nd${j?'':' gl'}" id="nd${i}_${j}">${d[i][j]}</td>`;h+="</tr>"}
 $("tbl").innerHTML=h;
 $("avl").innerHTML="<tr><th style='text-align:left'>Available</th>"+avail.map((_,j)=>`<th>${R(j)}</th>`).join("")+"</tr><tr><td></td>"+avail.map((v,j)=>`<td><input type="number" min="0" data-t="v" data-j="${j}" value="${v}" aria-label="Available ${R(j)}"></td>`).join("")+"</tr>"}
document.addEventListener("input",e=>{const t=e.target.dataset.t;if(!t)return;
 const v=Math.max(0,parseInt(e.target.value)||0),i=+e.target.dataset.i,j=+e.target.dataset.j;
 if(t=="a")alloc[i][j]=v;else if(t=="x")max[i][j]=v;else avail[j]=v;
 const d=needOf(alloc,max);for(let p=0;p<n;p++)for(let q=0;q<m;q++){const c=$(`nd${p}_${q}`);c.textContent=d[p][q]}reset()});
