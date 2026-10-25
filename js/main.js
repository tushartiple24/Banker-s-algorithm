/* main.js: Event wiring and start-up. */
$("solve").onclick=solve;
$("run").onclick=()=>{if(T2)return pause();if(S&&!S.over&&S.mode!="me"){T2=setInterval(advance,delay());$("run").textContent="Pause"}else start(true)};
$("step").onclick=()=>{if($("mode").value=="me")return start(false);if(!S||S.over)start(false);else pause();advance()};
$("rst").onclick=reset;$("mode").onchange=reset;$("spd").oninput=()=>{if(T2){clearInterval(T2);T2=setInterval(advance,delay())}};
$("size").onclick=resize;$("ex").onclick=()=>load([[0,1,0],[2,0,0],[3,0,2],[2,1,1],[0,0,2]],[[7,5,3],[3,2,2],[9,0,2],[2,2,2],[4,3,3]],[3,3,2]);
$("trap").onclick=()=>load([[3],[3],[2]],[[9],[4],[7]],[2]);$("rand").onclick=randomSc;
$("clr").onclick=()=>{alloc=Array.from({length:n},()=>z(m));max=Array.from({length:n},()=>z(m));avail=z(m);render()};
addEventListener("resize",size);refreshC();$("ex").onclick();size();draw();
