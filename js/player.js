class Player {
  constructor() {
    this.width = CONFIG.PLAYER_WIDTH;
    this.height = CONFIG.PLAYER_HEIGHT;
    this.speed = CONFIG.PLAYER_SPEED;
    this.reset();
  }

  reset() {
    this.x = CONFIG.WIDTH / 2 - this.width / 2;
    this.y = CONFIG.HEIGHT - this.height - 20;
    this.lives = CONFIG.START_LIVES;
    this.invulnerableTimer = 0;
    this.shootTimer = 0;
  }

  get centerX() { return this.x + this.width / 2; }
  get centerY() { return this.y + this.height / 2; }

  update(dt) {
    let dx = 0, dy = 0;
    if (keys.ArrowLeft) dx -= 1;
    if (keys.ArrowRight) dx += 1;
    if (keys.ArrowUp) dy -= 1;
    if (keys.ArrowDown) dy += 1;

    this.x += dx * this.speed * dt;
    this.y += dy * this.speed * dt;

    // hranice obrazovky
    this.x = Math.max(0, Math.min(CONFIG.WIDTH - this.width, this.x));
    this.y = Math.max(0, Math.min(CONFIG.HEIGHT - this.height, this.y));

    if (this.shootTimer > 0) this.shootTimer -= dt;
    if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;
  }

  canShoot() { return this.shootTimer <= 0; }

  shoot() {
    this.shootTimer = CONFIG.SHOOT_COOLDOWN;
    return new Bullet(this.centerX - CONFIG.BULLET_WIDTH / 2, this.y);
  }

  isInvulnerable() { return this.invulnerableTimer > 0; }

  hit() {
    this.lives--;
    this.invulnerableTimer = CONFIG.INVULNERABLE_TIME;
  }

  draw(ctx) {
    // blikání při nezranitelnosti
    if (this.isInvulnerable() && Math.floor(this.invulnerableTimer * 10) % 2 === 0) return;

    const { x, y, width: w, height: h } = this;
    ctx.save();

    // plamen motoru
    const flame = 10 + Math.random() * 8;
    ctx.fillStyle = '#ffa630';
    ctx.beginPath();
    ctx.moveTo(x + w * 0.35, y + h * 0.85);
    ctx.lineTo(x + w / 2, y + h * 0.85 + flame);
    ctx.lineTo(x + w * 0.65, y + h * 0.85);
    ctx.fill();

    // křídla
    ctx.fillStyle = '#d33';
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.9);
    ctx.lineTo(x + w * 0.3, y + h * 0.5);
    ctx.lineTo(x + w * 0.7, y + h * 0.5);
    ctx.lineTo(x + w, y + h * 0.9);
    ctx.closePath();
    ctx.fill();

    // trup
    ctx.fillStyle = '#e8eef7';
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w * 0.72, y + h * 0.85);
    ctx.lineTo(x + w * 0.28, y + h * 0.85);
    ctx.closePath();
    ctx.fill();

    // okénko
    ctx.fillStyle = '#4af';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h * 0.42, w * 0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
