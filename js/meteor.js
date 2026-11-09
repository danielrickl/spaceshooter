class Meteor {
  constructor(speedBonus = 0) {
    this.radius = randomBetween(CONFIG.METEOR_MIN_RADIUS, CONFIG.METEOR_MAX_RADIUS);
    this.x = randomBetween(this.radius, CONFIG.WIDTH - this.radius);
    this.y = -this.radius;
    this.speed = randomBetween(CONFIG.METEOR_MIN_SPEED, CONFIG.METEOR_MAX_SPEED) + speedBonus;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = randomBetween(-2, 2);
    this.dead = false;

    // nepravidelný tvar: body mnohoúhelníku s náhodnou vzdáleností od středu
    const points = 9 + Math.floor(Math.random() * 4);
    this.shape = [];
    for (let i = 0; i < points; i++) {
      this.shape.push(randomBetween(0.75, 1.1));
    }
  }

  update(dt) {
    this.y += this.speed * dt;
    this.rotation += this.rotationSpeed * dt;
    if (this.y - this.radius > CONFIG.HEIGHT) this.dead = true;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.fillStyle = '#7a6250';
    ctx.strokeStyle = '#4a3a2e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const n = this.shape.length;
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2;
      const r = this.radius * this.shape[i];
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // krátery
    ctx.fillStyle = '#5e4a3c';
    ctx.beginPath();
    ctx.arc(-this.radius * 0.3, -this.radius * 0.2, this.radius * 0.2, 0, Math.PI * 2);
    ctx.arc(this.radius * 0.35, this.radius * 0.3, this.radius * 0.14, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
