const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('gameover-screen');
const finalScoreEl = document.getElementById('final-score');
const highscoreEl = document.getElementById('highscore');
const startHighscoreEl = document.getElementById('start-highscore');
const finalHighscoreEl = document.getElementById('final-highscore');
const newRecordEl = document.getElementById('new-record');
const effectsEl = document.getElementById('effects');

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
  floatingTexts: [],
  highScore: loadHighScore(),
};

// ---------- Nejvyšší skóre (localStorage) ----------
function loadHighScore() {
  try {
    return parseInt(localStorage.getItem(CONFIG.HIGHSCORE_KEY), 10) || 0;
  } catch (e) {
    return 0; // např. soukromé okno nebo zablokované úložiště
  }
}

function saveHighScore(value) {
  try {
    localStorage.setItem(CONFIG.HIGHSCORE_KEY, String(value));
  } catch (e) { /* uložení se nepovedlo – hra běží dál */ }
}

// ---------- Plovoucí texty (odměny) ----------
function addFloatingText(text, x, y, color) {
  game.floatingTexts.push({ text, x, y, color, life: 1.2 });
}

function updateFloatingTexts(dt) {
  for (const t of game.floatingTexts) {
    t.y -= 40 * dt;
    t.life -= dt;
  }
  game.floatingTexts = game.floatingTexts.filter((t) => t.life > 0);
}

function drawFloatingTexts() {
  ctx.save();
  ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  for (const t of game.floatingTexts) {
    ctx.globalAlpha = Math.min(1, t.life);
    ctx.fillStyle = t.color;
    ctx.shadowColor = t.color;
    ctx.shadowBlur = 8;
    ctx.fillText(t.text, t.x, t.y);
  }
  ctx.restore();
}

// ---------- Odměny za bonusové meteority ----------
function applyBonus(meteor) {
  const player = game.player;
  const rewards = ['points', 'shield', 'triple'];
  if (player.lives < CONFIG.MAX_LIVES) rewards.push('life');
  const reward = rewards[Math.floor(Math.random() * rewards.length)];

  switch (reward) {
    case 'points':
      game.score += CONFIG.BONUS_POINTS;
      addFloatingText(`+${CONFIG.BONUS_POINTS} BODŮ`, meteor.x, meteor.y, '#ffd84d');
      break;
    case 'life':
      player.lives++;
      addFloatingText('+1 ŽIVOT', meteor.x, meteor.y, '#ff4d6d');
      break;
    case 'shield':
      player.shieldTimer = CONFIG.SHIELD_TIME;
      addFloatingText('ŠTÍT', meteor.x, meteor.y, '#5cf');
      break;
    case 'triple':
      player.tripleShotTimer = CONFIG.TRIPLE_SHOT_TIME;
      addFloatingText('TROJITÁ STŘELA', meteor.x, meteor.y, '#7f7');
      break;
  }
}

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
  game.floatingTexts = [];
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
  const isRecord = game.score > game.highScore;
  if (isRecord) {
    game.highScore = game.score;
    saveHighScore(game.highScore);
  }
  newRecordEl.classList.toggle('hidden', !isRecord);
  effectsEl.textContent = '';
  finalScoreEl.textContent = game.score;
  finalHighscoreEl.textContent = game.highScore;
  startHighscoreEl.textContent = game.highScore;
  gameOverScreen.classList.remove('hidden');
}

function updateHUD() {
  scoreEl.textContent = `Skóre: ${game.score}`;
  livesEl.textContent = '♥'.repeat(Math.max(0, game.player.lives));
  // rekord se v HUD aktualizuje živě, jakmile ho hráč překoná
  highscoreEl.textContent = `Rekord: ${Math.max(game.highScore, game.score)}`;

  const p = game.player;
  const effects = [];
  if (p.shieldTimer > 0) effects.push(`🛡 Štít ${Math.ceil(p.shieldTimer)}s`);
  if (p.tripleShotTimer > 0) effects.push(`✦ Trojitá střela ${Math.ceil(p.tripleShotTimer)}s`);
  effectsEl.textContent = effects.join('   ');
}

// ---------- Update ----------
function update(dt) {
  updateStars(dt);
  updateFloatingTexts(dt);
  if (game.state !== STATE.PLAYING) return;

  const player = game.player;
  game.elapsed += dt;

  // hráč a střelba
  player.update(dt);
  if (keys.Space && player.canShoot()) {
    game.bullets.push(...player.shoot());
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
        if (m.bonus) applyBonus(m);
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
  drawFloatingTexts();
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
startHighscoreEl.textContent = game.highScore;
updateHUD();
requestAnimationFrame(loop);
