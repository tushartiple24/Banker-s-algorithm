/* canvas.js: Vault ring renderer (canvas, particles, theme colours). */
function refreshC(){const s=getComputedStyle(document.documentElement);["ink","ln","pn","hi","hot","on"].forEach(k=>C[k]=s.getPropertyValue("--"+k).trim())}
matchMedia("(prefers-color-scheme:dark)").addEventListener("change",refreshC);
/* ---- canvas ---- */
const cv=$("cv");
function size(){const d=devicePixelRatio||1,w=cv.clientWidth,h=Math.round(w*.88);cv.width=w*d;cv.height=h*d;cv.style.height=h+"px";cv.getContext("2d").setTransform(d,0,0,d,0,0);G={w,h}}
function pos(k){const{w,h}=G;if(k=="v")return[w/2,h/2];const r=Math.min(w,h)*.37,a=-Math.PI/2+2*Math.PI*k/n;return[w/2+r*Math.cos(a),h/2+r*Math.sin(a)]}
function draw(){
 const x=cv.getContext("2d"),{w,h}=G,st=S||{al:alloc,mx:max,av:avail,fin:[]},t=performance.now()/1000,cen=pos("v"),vr=w*.15,nr=Math.max(15,Math.min(28,w/(n*3)));
 x.clearRect(0,0,w,h);x.textAlign="center";x.textBaseline="middle";
 const fr=i=>{const a=sum(st.mx[i]);return a?Math.min(1,sum(st.al[i])/a):0};
 for(let i=0;i<n;i++){const p=pos(i),f=fr(i);x.strokeStyle=C.ink;x.globalAlpha=.15+.6*f;x.lineWidth=1+4*f;x.beginPath();x.moveTo(cen[0],cen[1]);x.lineTo(p[0],p[1]);x.stroke()}
 x.globalAlpha=1;
 if(A){x.strokeStyle=C.hi;x.lineWidth=3;for(let k=1;k<A.i;k++){const a=pos(A.seq[k-1]),b=pos(A.seq[k]),c=[(a[0]+b[0])/2,(a[1]+b[1])/2];c[0]+=(cen[0]-c[0])*.5;c[1]+=(cen[1]-c[1])*.5;x.beginPath();x.moveTo(a[0],a[1]);x.quadraticCurveTo(c[0],c[1],b[0],b[1]);x.stroke()}}
 x.fillStyle=C.pn;x.strokeStyle=C.ink;x.lineWidth=2;x.beginPath();x.arc(cen[0],cen[1],vr,0,7);x.fill();x.stroke();
 const wv=A?(A.i?A.steps[A.i-1].after:A.w0):st.av,fs=Math.round(vr*(m>4?.19:.24));
 x.fillStyle=C.ink;x.font=`500 ${Math.round(vr*.17)}px Instrument Sans,sans-serif`;x.fillText(A?"Work":"Available",cen[0],cen[1]-vr*.52);
 x.font=`700 ${fs}px Unbounded,sans-serif`;const L=[];for(let k=0;k<wv.length;k+=4)L.push(wv.slice(k,k+4).map((q,j)=>R(k+j)+" "+q).join("  "));
 L.forEach((s,i)=>x.fillText(s,cen[0],cen[1]-vr*.12+i*fs*1.5));
 for(let i=0;i<n;i++){const p=pos(i),f=fr(i),dn=S?S.fin[i]:A&&A.seq.slice(0,A.i).includes(i),
  bad=(S&&S.over=="lose"&&!S.fin[i])||(A&&!A.safe&&A.i>=A.steps.length&&A.stuck.includes(i)),pd=S&&S.pend&&S.pend.p==i;
  if(pd||bad){x.strokeStyle=bad?C.hot:C.hi;x.lineWidth=2;x.globalAlpha=.6+.4*Math.sin(t*6);x.beginPath();x.arc(p[0],p[1],nr+7+3*Math.sin(t*6),0,7);x.stroke();x.globalAlpha=1}
  x.fillStyle=dn?C.hi:C.pn;x.beginPath();x.arc(p[0],p[1],nr,0,7);x.fill();
  x.lineWidth=4;x.strokeStyle=C.ln;x.beginPath();x.arc(p[0],p[1],nr,0,7);x.stroke();
  if(f>0&&!dn){x.strokeStyle=bad?C.hot:C.hi;x.beginPath();x.arc(p[0],p[1],nr,-Math.PI/2,-Math.PI/2+f*6.2832);x.stroke()}
  x.fillStyle=dn?C.on:C.ink;x.font=`700 ${Math.round(nr*.62)}px Unbounded,sans-serif`;x.fillText("P"+i,p[0],p[1])}
 x.fillStyle=C.hi;P=P.filter(q=>(q.u+=.02)<1);
 for(const q of P)if(q.u>=0){const a=pos(q.f),b=pos(q.t),e=q.u*q.u*(3-2*q.u);x.beginPath();x.arc(a[0]+(b[0]-a[0])*e,a[1]+(b[1]-a[1])*e,3.5,0,7);x.fill()}
 requestAnimationFrame(draw)}
