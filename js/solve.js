/* solve.js: Animated safe-sequence solver. */
function solve(){reset();const e=validate();if(e)return lg("bad",e);
 const r=safety(alloc,max,avail);A={...r,i:0,w0:avail.slice()};lg("mu",`Work starts at ${fmt(avail)}.`);
 T1=setInterval(()=>{if(A.i<A.steps.length){const s=A.steps[A.i++];lg("ok",`P${s.p}: need ${fmt(s.need)} fits inside ${fmt(s.before)}. It finishes and Work becomes ${fmt(s.after)}.`);spawn(s.p,"v",sum(alloc[s.p]))}
  else{clearInterval(T1);lg(A.safe?"ok":"bad",A.safe?`Safe. Order: ${A.seq.map(p=>"P"+p).join(" → ")}`:`Unsafe. ${A.stuck.map(p=>"P"+p).join(", ")} cannot be guaranteed to finish with Work at ${fmt(A.work)}.`)}},delay())}
