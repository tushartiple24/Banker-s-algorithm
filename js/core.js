/* core.js: Shared helpers, global state and small vector utilities. */
const $=i=>document.getElementById(i),R=i=>String.fromCharCode(65+i),fmt=v=>"("+v.join(", ")+")";
const le=(a,b)=>a.every((x,i)=>x<=b[i]),add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),z=k=>Array(k).fill(0),rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),cp=M=>M.map(r=>r.slice()),sum=v=>v.reduce((s,x)=>s+x,0),needOf=(a,x)=>a.map((r,i)=>sub(x[i],r));
let n=5,m=3,alloc=[],max=[],avail=[],S=null,A=null,T1=null,T2=null,P=[],G={w:600,h:540},C={};
const delay=()=>1100-100*$("spd").value;
