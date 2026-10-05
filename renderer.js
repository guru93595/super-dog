const cv = document.getElementById('c'), ctx = cv.getContext('2d');
let W, H;
function fit() { const r = devicePixelRatio || 1; W = innerWidth; H = innerHeight;
  cv.width = W * r; cv.height = H * r; cv.style.width = W + 'px'; cv.style.height = H + 'px'; ctx.setTransform(r, 0, 0, r, 0, 0); }
addEventListener('resize', fit); fit();

const PAL = { white: { fur: '#fffaf2', shade: '#ece0c8', ear: '#ecdcb8', ear2: '#d9c597' }, gold: { fur: '#f1d9a6', shade: '#dcbd82', ear: '#d3a45c', ear2: '#b98842' }, bw: { fur: '#fffaf2', shade: '#ece0c8', ear: '#4a403e', ear2: '#2c2524' } };
let pal = PAL.white;
const S = 0.62;   // dog size: smaller number = smaller dog

// ---------- behaviour ----------
const dog = { x: 300, y: 300, dir: 1 };
let cur = { x: 300, y: 300 }, lastMove = performance.now();
let mode = 'follow', idleSince = null, ball = null, ballUntil = 0, house = null, stage = '', stageAt = 0, running = false;
const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);

function step(tx, ty, dt, boost = 1) {                  // returns true while moving
  const dx = tx - dog.x, dy = ty - dog.y, d = Math.hypot(dx, dy); if (d < 1) return false;
  const v = Math.min(560 * boost, 140 + d * 1.8) * dt, m = Math.min(v, d);
  dog.x += dx / d * m; dog.y += dy / d * m; if (Math.abs(dx) > 3) dog.dir = dx > 0 ? 1 : -1; return true;
}

pet.on('cursor', p => { if (dist(p.x, p.y, cur.x, cur.y) > 3) lastMove = performance.now(); cur = p; });
pet.on('pet', id => { pal = PAL[id] || PAL.white; });
pet.on('cmd', c => {
  const now = performance.now();
  if (c === 'call') { mode = 'follow'; house = null; ball = null; idleSince = null; }
  if (c === 'ball') { mode = 'ball'; house = null; ballUntil = now + 20000;
    ball = { x: Math.min(W - 40, Math.max(40, dog.x + (Math.random() < .5 ? -1 : 1) * 220)), y: Math.min(H - 60, Math.max(60, dog.y - 80)), vx: 0, vy: 0 }; }
  if (c === 'house') { mode = 'tied'; ball = null; house = { x: 110, y: H - 70 }; stage = 'toHouse'; }
  if (c === 'sleep') { mode = 'sleep'; ball = null; }
});

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now; const t = now / 1000;
  ctx.clearRect(0, 0, W, H);
  let pose = 'sit';

  if (mode === 'follow') {
    const d = dist(dog.x, dog.y, cur.x, cur.y);
    if (running ? d > 12 : d > 40) { running = true; idleSince = null; step(cur.x, cur.y, dt); pose = 'run'; }
    else { running = false; if (idleSince === null) idleSince = now;
      pose = now - idleSince > 3000 ? 'sleep' : 'sit'; }
  } else if (mode === 'ball') {
    if (ball) {
      ball.x += ball.vx * dt; ball.y += ball.vy * dt; ball.vx *= 0.985; ball.vy *= 0.985;
      if (ball.x < 20 || ball.x > W - 20) ball.vx *= -1; if (ball.y < 40 || ball.y > H - 30) ball.vy *= -1;
      ball.x = Math.min(W - 20, Math.max(20, ball.x)); ball.y = Math.min(H - 30, Math.max(40, ball.y));
      if (dist(dog.x, dog.y, ball.x, ball.y) < 30) { const a = Math.random() * 6.283; const s = 350 + Math.random() * 300; ball.vx = Math.cos(a) * s; ball.vy = Math.sin(a) * s * .6; }
      step(ball.x, ball.y, dt, 1.1); pose = 'run';
      if (now > ballUntil) { ball = null; mode = 'follow'; idleSince = null; }
    }
  } else if (mode === 'tied' && house) {
    if (stage === 'toHouse') { pose = 'run'; if (!step(house.x + 48, house.y, dt)) { stage = 'sniff'; stageAt = now; } }
    else if (stage === 'sniff') { pose = 'sniff'; dog.dir = -1; if (now - stageAt > 3000) stage = 'enter'; }
    else if (stage === 'enter') { pose = 'run'; if (!step(house.x, house.y - 2, dt)) { stage = 'sleep'; } }
    else pose = 'inHouse';
  } else if (mode === 'sleep') pose = 'sleep';

  if (house) drawHouse(house.x, house.y);
  if (ball) drawBall(ball);
  ctx.save(); ctx.translate(Math.round(dog.x), Math.round(dog.y)); ctx.scale(S, S);
  if (pose === 'inHouse') { ctx.restore(); dogInHouse(house.x, house.y, t); }
  else {
    if (pose === 'sit') dogSit(t);
    else { ctx.scale(dog.dir, 1);
      if (pose === 'sleep') dogSleep(t); else dogSide(t, { run: pose === 'run', down: pose === 'sniff' }); }
    ctx.restore();
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
