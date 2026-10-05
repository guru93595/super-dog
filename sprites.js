// Cute chibi Shih Tzu sprites. Origin (0,0) = feet / shadow centre. Uses globals: ctx, pal
const INK = '#2b2222', EDGE = '#c9b793', BOW = '#ef7fa0';
function blob(x, y, rx, ry, fill, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const g = ctx.createRadialGradient(-rx * .3, -ry * .4, 1, 0, 0, Math.max(rx, ry) * 1.1);
  g.addColorStop(0, fill); g.addColorStop(1, fill === pal.fur ? pal.shade : pal.ear2);
  ctx.fillStyle = g; ctx.strokeStyle = EDGE; ctx.lineWidth = 1.1;
  const n = 14, r = Math.min(rx, ry) * 0.26;
  for (let i = 0; i < n; i++) { const a = i / n * 6.283; ctx.beginPath(); ctx.arc(Math.cos(a) * rx * .96, Math.sin(a) * ry * .96, r, 0, 6.283); ctx.fill(); }
  ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, 6.283); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, 0, rx * .98, ry * .98, 0, 0, 6.283); ctx.fill(); ctx.restore();
}
function dot(x, y, r, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); }
function oval(x, y, rx, ry, c, a = 1) { ctx.globalAlpha = a; ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; }
function arc(x, y, r, a0, a1, w = 1.5) { ctx.strokeStyle = INK; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); }
function shadow(rx) { oval(0, 0, rx, 6, '#444', .3); }
function eye(x, y, s = 1) { oval(x, y, 3.4 * s, 4.2 * s, INK); dot(x - 1.1 * s, y - 1.6 * s, 1.4 * s, '#fff'); dot(x + 1.2 * s, y + 1.3 * s, .7 * s, '#fff'); }
function bow(x, y) { ctx.fillStyle = BOW; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 8, y - 5); ctx.lineTo(x - 8, y + 5); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 8, y - 5); ctx.lineTo(x + 8, y + 5); ctx.closePath(); ctx.fill(); dot(x, y, 2.4, '#d9617f'); }
function nose(x, y, s = 1) { oval(x, y, 3.2 * s, 2.4 * s, '#1d1616'); dot(x - 1 * s, y - .8 * s, .8 * s, 'rgba(255,255,255,.6)'); }
function zzz(x, y, t) { ctx.fillStyle = '#6b7aa8'; ctx.font = 'bold 14px Segoe UI';
  for (let i = 0; i < 2; i++) { const p = (t * .5 + i * .5) % 1; ctx.globalAlpha = 1 - p; ctx.fillText('z', x + p * 10 + i * 6, y - p * 22); } ctx.globalAlpha = 1; }

function dogSide(t, o) {                          // facing right: run / walk / sniff
  const ph = t * 17, bob = o.run ? -Math.abs(Math.sin(ph)) * 2.2 : 0;
  shadow(30);
  [[-13, 0], [-5, Math.PI], [9, Math.PI], [17, 0]].forEach(([lx, p]) => {
    const lift = o.run ? Math.max(0, Math.sin(ph + p)) * 6 : 0; blob(lx, -4 - lift * .6, 4.6, 5.5, pal.fur); });
  ctx.save(); ctx.translate(-20, -26 + bob); ctx.rotate(-.7 + Math.sin(t * 13) * .3); blob(0, -4, 6, 10, pal.fur); ctx.restore();
  blob(-2, -17 + bob, 20, 11, pal.fur);
  const hx = o.down ? 22 : 17, hy = (o.down ? -16 : -31) + bob;
  blob(hx, hy, 17, 15, pal.fur); blob(hx + 11, hy + 6, 9, 7, pal.fur);
  blob(hx - 1, hy - 14, 6, 7, pal.ear); bow(hx - 1, hy - 18);
  eye(hx + 7, hy - 2); oval(hx + 11, hy + 6, 3, 2, '#f4a3b0', .5);
  nose(hx + 19, hy + 3);
  if (o.run) oval(hx + 15, hy + 11, 2.6, 4, '#f07f90');
  blob(hx - 7, hy + 5, 6, 12, pal.ear, .25 + (o.run ? Math.sin(ph) * .15 : 0));
}
function dogSit(t) {                              // front view, happy
  shadow(24); const br = Math.sin(t * 2) * .6;
  blob(0, -15, 14, 15 + br, pal.fur); blob(-7, -3, 5, 4, pal.fur); blob(7, -3, 5, 4, pal.fur);
  ctx.save(); ctx.translate(15, -9); ctx.rotate(.6 + Math.sin(t * 6) * .2); blob(0, 0, 4, 7, pal.fur); ctx.restore();
  blob(0, -40, 23, 19, pal.fur);
  blob(-13, -33, 9, 8, pal.fur); blob(13, -33, 9, 8, pal.fur); blob(0, -30, 11, 8, pal.fur);
  blob(0, -58, 7, 7, pal.ear); bow(0, -62);
  blob(-22, -33, 8, 16, pal.ear, .22); blob(22, -33, 8, 16, pal.ear, -.22);
  eye(-9, -42); eye(9, -42);
  oval(-15, -34, 4, 2.6, '#f4a3b0', .55); oval(15, -34, 4, 2.6, '#f4a3b0', .55);
  nose(0, -36); oval(0, -27.5, 3, 4, '#f07f90');
  arc(-2.4, -32.5, 2.6, .2, 2.9, 1.2); arc(2.4, -32.5, 2.6, .2, 2.9, 1.2);
}
function dogSleep(t) {                            // curled up asleep
  shadow(28); const br = Math.sin(t * 2) * .8;
  ctx.save(); ctx.translate(-22, -12); ctx.rotate(-.5); blob(0, 0, 5, 9, pal.fur); ctx.restore();
  blob(0, -9, 23, 9 + br, pal.fur);
  blob(17, -9, 13, 11, pal.fur); blob(26, -5, 8, 6, pal.fur);
  blob(14, -19, 5, 5, pal.ear); bow(14, -22);
  blob(12, -4, 6, 10, pal.ear, 1.15);
  arc(22, -10, 2.8, .1, 3.0, 1.4); nose(30, -6, .9);
  zzz(32, -24, t);
}
function drawHouse(x, y) {
  ctx.save(); ctx.translate(x, y); ctx.scale(.62, .62);
  ctx.fillStyle = '#7ca35a'; for (let i = -42; i < 43; i += 7) { ctx.beginPath(); ctx.moveTo(i, 4); ctx.lineTo(i + 3, -7); ctx.lineTo(i + 6, 4); ctx.fill(); }
  ctx.fillStyle = '#c23b28'; ctx.fillRect(-32, -50, 64, 52);
  ctx.strokeStyle = '#8f2a1c'; ctx.lineWidth = 1; for (let i = -50; i < 0; i += 8) { ctx.beginPath(); ctx.moveTo(-32, i); ctx.lineTo(32, i); ctx.stroke(); }
  ctx.fillStyle = '#7b3f2a'; ctx.beginPath(); ctx.moveTo(-43, -48); ctx.lineTo(0, -90); ctx.lineTo(43, -48); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#5a2c1c'; for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-43 + i * 6, -48 - i * 8.4); ctx.lineTo(43 - i * 6, -48 - i * 8.4); ctx.stroke(); }
  ctx.fillStyle = '#f6eedc'; ctx.fillRect(-9, -58, 18, 6); dot(-9, -55, 3.5, '#f6eedc'); dot(9, -55, 3.5, '#f6eedc');
  ctx.fillStyle = '#e9dcc0'; ctx.beginPath(); ctx.arc(0, 0, 18, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#2b1a12'; ctx.beginPath(); ctx.arc(0, 0, 14, Math.PI, 0); ctx.fill();
  ctx.restore();
}
function dogInHouse(x, y, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(.62, .62);
  blob(0, -12, 12, 9, pal.fur); blob(-9, -10, 5, 8, pal.ear, .2); blob(9, -10, 5, 8, pal.ear, -.2);
  arc(-4.5, -13, 2.4, .1, 3, 1.3); arc(4.5, -13, 2.4, .1, 3, 1.3); nose(0, -8, .8);
  zzz(24, -52, t); ctx.restore();
}
function drawBall(b) {
  oval(b.x, b.y + 3, 5, 2.2, '#444', .3); dot(b.x, b.y - 2, 5, '#d8322b'); dot(b.x - 1.5, b.y - 3.8, 1.5, 'rgba(255,255,255,.75)');
}
