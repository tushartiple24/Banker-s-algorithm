/* algorithm.js: Pure Banker's safety algorithm (no DOM). */
function safety(al,mx,av){const d=needOf(al,mx),done=al.map(()=>false),seq=[],steps=[];let w=av.slice();
 for(;;){let f=-1;for(let i=0;i<al.length;i++)if(!done[i]&&le(d[i],w)){f=i;break}if(f<0)break;
  const b=w.slice();w=add(w,al[f]);done[f]=true;seq.push(f);steps.push({p:f,need:d[f],before:b,after:w.slice()})}
 return{safe:seq.length==al.length,seq,steps,work:w,stuck:done.map((x,i)=>x?-1:i).filter(i=>i>=0)}}
const isSafe=(p,r)=>{const na=cp(S.al);na[p]=add(na[p],r);return safety(na,S.mx,sub(S.av,r)).safe};
