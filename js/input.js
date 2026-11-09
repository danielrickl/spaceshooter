// Stav kláves
const keys = {};
const GAME_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'];

window.addEventListener('keydown', (e) => {
  if (GAME_KEYS.includes(e.code)) e.preventDefault(); // stránka se neposouvá
  keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

// Při ztrátě fokusu okna pustíme všechny klávesy
window.addEventListener('blur', () => {
  for (const k in keys) keys[k] = false;
});
