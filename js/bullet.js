class Bullet {
  constructor(x, y, vx = 0) {
    this.x = x;
    this.y = y;
    this.width = CONFIG.BULLET_WIDTH;
    this.height = CONFIG.BULLET_HEIGHT;
    this.speed = CONFIG.BULLET_SPEED;
    this.vx = vx; // vodorovná rychlost (šikmé střely u trojité střely)
    this.dead = false;
  }

  update(dt) {
    this.y -= this.speed * dt;
    this.x += this.vx * dt;
    if (this.y + this.height < 0 || this.x < -this.width || this.x > CONFIG.WIDTH) this.dead = true;
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
