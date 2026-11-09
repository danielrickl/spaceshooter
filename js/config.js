// Herní konstanty
const CONFIG = {
  WIDTH: 800,
  HEIGHT: 600,

  START_LIVES: 3,
  POINTS_PER_HIT: 10,

  PLAYER_WIDTH: 40,
  PLAYER_HEIGHT: 50,
  PLAYER_SPEED: 300,          // px/s
  PLAYER_HITBOX_RADIUS: 16,   // zmenšený hitbox pro férovější kolize
  INVULNERABLE_TIME: 1.5,     // s

  BULLET_WIDTH: 4,
  BULLET_HEIGHT: 14,
  BULLET_SPEED: 500,          // px/s
  SHOOT_COOLDOWN: 0.25,       // s

  METEOR_MIN_SPEED: 100,
  METEOR_MAX_SPEED: 250,
  METEOR_MIN_RADIUS: 15,
  METEOR_MAX_RADIUS: 40,

  SPAWN_INTERVAL_START: 1.2,  // s
  SPAWN_INTERVAL_MIN: 0.4,    // s
  SPAWN_INTERVAL_DECREASE: 0.02, // o kolik se zkrátí za každou sekundu hry
  SPEED_INCREASE: 3,          // o kolik px/s se zrychlí meteority za sekundu hry

  STAR_COUNT: 100,

  // Bonusové meteority
  BONUS_CHANCE: 0.12,         // pravděpodobnost, že nový meteorit bude bonusový
  BONUS_POINTS: 50,           // odměna "body navíc"
  MAX_LIVES: 5,               // víc životů se získat nedá
  SHIELD_TIME: 5,             // s – štít
  TRIPLE_SHOT_TIME: 8,        // s – trojitá střela

  HIGHSCORE_KEY: 'spaceshooter-highscore',
};

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}
