// Run with: node tests/algorithm.test.js
// Loads the same browser scripts into a bare VM (no DOM) and checks the safety algorithm.
const fs = require('fs'), vm = require('vm'), path = require('path'), assert = require('assert');
const ctx = vm.createContext({ Math, Array });
for (const f of ['core', 'algorithm']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js', f + '.js'), 'utf8'), ctx, { filename: f + '.js' });
}
const run = code => vm.runInContext(code, ctx);
let pass = 0;
const t = (name, fn) => { fn(); pass++; console.log('  ok  ' + name); };

t('textbook example is safe, first-fit order P1,P3,P0,P2,P4', () => {
  const r = run(`safety([[0,1,0],[2,0,0],[3,0,2],[2,1,1],[0,0,2]],[[7,5,3],[3,2,2],[9,0,2],[2,2,2],[4,3,3]],[3,3,2])`);
  assert.strictEqual(r.safe, true);
  assert.deepStrictEqual(Array.from(r.seq), [1, 3, 0, 2, 4]);
  assert.deepStrictEqual(Array.from(r.work), [10, 5, 7]);
});
t('deadlock-trap preset starts safe (only reckless granting dooms it)', () => {
  const r = run(`safety([[3],[3],[2]],[[9],[4],[7]],[2])`);
  assert.strictEqual(r.safe, true);
  assert.deepStrictEqual(Array.from(r.seq), [1, 2, 0]);
});
t('classic unsafe state: two processes each need more than is free', () => {
  const r = run(`safety([[1],[1]],[[5],[5]],[1])`);
  assert.strictEqual(r.safe, false);
  assert.deepStrictEqual(Array.from(r.stuck), [0, 1]);
});
t('single process that fits is safe', () => {
  assert.strictEqual(run(`safety([[1]],[[3]],[2])`).safe, true);
});
t('process needing more than ever available is unsafe', () => {
  assert.strictEqual(run(`safety([[1]],[[9]],[1])`).safe, false);
});
t('granting the textbook P1 request (1,0,2) stays safe', () => {
  const r = run(`safety([[0,1,0],[3,0,2],[3,0,2],[2,1,1],[0,0,2]],[[7,5,3],[3,2,2],[9,0,2],[2,2,2],[4,3,3]],[2,3,0])`);
  assert.strictEqual(r.safe, true);
});
t('after P1 is granted, P0 requesting (0,2,0) is unsafe (textbook)', () => {
  // state after P1 got (1,0,2): P1 alloc (3,0,2), Available (2,3,0); then P0 takes (0,2,0)
  const r = run(`safety([[0,3,0],[3,0,2],[3,0,2],[2,1,1],[0,0,2]],[[7,5,3],[3,2,2],[9,0,2],[2,2,2],[4,3,3]],[2,1,0])`);
  assert.strictEqual(r.safe, false);
});
t('safety() does not mutate its inputs', () => {
  const r = run(`(()=>{const a=[[0,1,0],[2,0,0]],x=[[7,5,3],[3,2,2]],v=[3,3,2];const s=JSON.stringify([a,x,v]);safety(a,x,v);return s===JSON.stringify([a,x,v])})()`);
  assert.strictEqual(r, true);
});
t('fuzz: a returned safe sequence always replays correctly', () => {
  for (let k = 0; k < 500; k++) {
    const n = 2 + Math.floor(Math.random() * 5), m = 1 + Math.floor(Math.random() * 3);
    const al = [], mx = [];
    for (let i = 0; i < n; i++) { al.push([]); mx.push([]); for (let j = 0; j < m; j++) { const a = Math.floor(Math.random() * 4); al[i].push(a); mx[i].push(a + Math.floor(Math.random() * 5)); } }
    const av = Array.from({ length: m }, () => Math.floor(Math.random() * 6));
    ctx.__in = { al, mx, av };
    const r = run(`safety(__in.al,__in.mx,__in.av)`);
    if (!r.safe) continue;
    let w = av.slice();
    for (const p of r.seq) {
      for (let j = 0; j < m; j++) assert.ok(mx[p][j] - al[p][j] <= w[j], 'sequence step not satisfiable');
      w = w.map((x, j) => x + al[p][j]);
    }
    assert.strictEqual(r.seq.length, n);
  }
});
console.log(`\n${pass} tests passed`);
