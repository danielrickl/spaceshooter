const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('gameover-screen');
const finalScoreEl = document.getElementById('final-score');

const STATE = { START: 'start', PLAYING: 'playing', GAME_OVER: 'gameover' };

const game = {
  state: STATE.START,
  player: new Player(),
  bullets: [],
  meteors: [],
  score: 0,
  spawnTimer: 0,
  spawnInterval: CONFIG.SPAWN_INTERVAL_START,
  elapsed: 0,
  stars: [],
};

// ---------- Hvězdné pozadí ----------
function createStars() {
  game.stars = [];
  for (let i = 0; i < CONFIG.STAR_COUNT; i++) {
    const layer = Math.random();
    game.stars.push({
      x: Math.random() * CONFIG.WIDTH,
      y: Math.random() * CONFIG.HEIGHT,
      size: layer * 2 + 0.5,
      speed: layer * 60 + 15,
    });
  }
}

function updateStars(dt) {
  for (const s of game.stars) {
    s.y += s.speed * dt;
    if (s.y > CONFIG.HEIGHT) {
      s.y = 0;
      s.x = Math.random() * CONFIG.WIDTH;
    }
  }
}

function drawStars() {
  ctx.fillStyle = '#fff';
  for (const s of game.stars) {
    ctx.globalAlpha = 0.4 + s.size / 5;
    ctx.fillRect(s.x, s.y, s.size, s.size);
  }
  ctx.globalAlpha = 1;
}

// ---------- Stav hry ----------
function resetGame() {
  game.player.reset();
  game.bullets = [];
  game.meteors = [];
  game.score = 0;
  game.spawnTimer = 0;
  game.spawnInterval = CONFIG.SPAWN_INTERVAL_START;
  game.elapsed = 0;
  updateHUD();
}

function startGame() {
  resetGame();
  game.state = STATE.PLAYING;
  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  if (document.activeElement) document.activeElement.blur(); // mezerník nesmí "kliknout" na tlačítko
}

function gameOver() {
  game.state = STATE.GAME_OVER;
  finalScoreEl.textContent = game.score;
  gameOverScreen.classList.remove('hidden');
}

function updateHUD() {
  scoreEl.textContent = `Skóre: ${game.score}`;
  livesEl.textContent = '♥'.repeat(Math.max(0, game.player.lives));
}

// ---------- Update ----------
function update(dt) {
  updateStars(dt);
  if (game.state !== STATE.PLAYING) return;

  const player = game.player;
  game.elapsed += dt;

  // hráč a střelba
  player.update(dt);
  if (keys.Space && player.canShoot()) {
    game.bullets.push(player.shoot());
  }

  // obtížnost – spawn se zrychluje
  game.spawnInterval = Math.max(
    CONFIG.SPAWN_INTERVAL_MIN,
    CONFIG.SPAWN_INTERVAL_START - game.elapsed * CONFIG.SPAWN_INTERVAL_DECREASE
  );
  game.spawnTimer -= dt;
  if (game.spawnTimer <= 0) {
    game.meteors.push(new Meteor(game.elapsed * CONFIG.SPEED_INCREASE));
    game.spawnTimer = game.spawnInterval;
  }

  for (const b of game.bullets) b.update(dt);
  for (const m of game.meteors) m.update(dt);

  // kolize střela × meteorit
  for (const m of game.meteors) {
    if (m.dead) continue;
    for (const b of game.bullets) {
      if (!b.dead && rectCircleCollide(b, m)) {
        b.dead = true;
        m.dead = true;
        game.score += CONFIG.POINTS_PER_HIT;
        break;
      }
    }
  }

  // kolize meteorit × raketa
  for (const m of game.meteors) {
    if (m.dead || player.isInvulnerable()) continue;
    if (circleCircleCollide(player.centerX, player.centerY, CONFIG.PLAYER_HITBOX_RADIUS, m.x, m.y, m.radius)) {
      m.dead = true;
      player.hit();
    }
  }

  // úklid
  game.bullets = game.bullets.filter((b) => !b.dead);
  game.meteors = game.meteors.filter((m) => !m.dead);

  updateHUD();

  if (player.lives <= 0) gameOver();
}

// ---------- Render ----------
function render() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
  drawStars();

  if (game.state === STATE.START) return;

  for (const m of game.meteors) m.draw(ctx);
  for (const b of game.bullets) b.draw(ctx);
  if (game.state === STATE.PLAYING) game.player.draw(ctx);
}

// ---------- Herní smyčka ----------
let lastTime = performance.now();

function loop(now) {
  // omezení dt, aby po přepnutí záložky objekty "neproskočily"
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  update(dt);
  render();
  requestAnimationFrame(loop);
}

// ---------- Ovládání obrazovek ----------
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);

window.addEventListener('keydown', (e) => {
  if (e.code === 'Enter' && game.state !== STATE.PLAYING) startGame();
});

createStars();
updateHUD();
requestAnimationFrame(loop);
