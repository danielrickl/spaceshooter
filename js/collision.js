// Obdélník (střela) × kruh (meteorit)
function rectCircleCollide(rect, circle) {
  const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;
  return dx * dx + dy * dy < circle.radius * circle.radius;
}

// Kruh × kruh (raketa se zmenšeným hitboxem × meteorit)
function circleCircleCollide(x1, y1, r1, x2, y2, r2) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  const r = r1 + r2;
  return dx * dx + dy * dy < r * r;
}
