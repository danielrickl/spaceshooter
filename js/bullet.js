class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = CONFIG.BULLET_WIDTH;
    this.height = CONFIG.BULLET_HEIGHT;
    this.speed = CONFIG.BULLET_SPEED;
    this.dead = false;
  }

  update(dt) {
    this.y -= this.speed * dt;
    if (this.y + this.height < 0) this.dead = true;
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = '#7ff';
    ctx.shadowColor = '#4ff';
    ctx.shadowBlur = 10;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}
