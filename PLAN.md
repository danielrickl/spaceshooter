# Space Shooter – plán hry

2D arkádová hra v prohlížeči (HTML5 Canvas + CSS3 + čistý JavaScript, bez knihoven).

## 1. Popis hry

- Z horní části obrazovky padají meteority.
- Hráč ovládá raketu ve spodní části obrazovky.
- **Šipky** (← → ↑ ↓) = pohyb rakety, **mezerník** = střelba.
- Zásah meteoritu střelou = **+10 bodů**, meteorit i střela zmizí.
- Náraz meteoritu do rakety = **−1 život**, meteorit zmizí, raketa je krátce nezranitelná (blikání).
- Meteorit, který propadne dolů mimo obrazovku, zmizí (bez trestu).
- Při **0 životech** hra končí → obrazovka **GAME OVER** se skóre a tlačítkem **Hrát znovu** (reset).

## 2. Struktura souborů

```
spaceshooter/
├── index.html      # canvas, HUD, obrazovky (start / game over)
├── css/
│   └── style.css   # vzhled stránky, HUD, overlay obrazovky
└── js/
    ├── config.js   # konstanty (rychlosti, velikosti, počet životů…)
    ├── input.js    # obsluha klávesnice
    ├── player.js   # třída Player (raketa)
    ├── bullet.js   # třída Bullet (střela)
    ├── meteor.js   # třída Meteor
    ├── collision.js# detekce kolizí
    └── game.js     # herní smyčka, stav hry, skóre, životy, reset
```

Skripty se načítají jako ES moduly (`<script type="module" src="js/game.js">`).
Pozn.: moduly vyžadují spuštění přes lokální server (např. `npx serve` nebo VS Code Live Server).
Pokud chceme otevírat přímo `index.html` z disku, použijeme obyčejné `<script>` tagy ve správném pořadí.

## 3. Herní objekty

| Objekt  | Vlastnosti                                  | Chování |
|---------|---------------------------------------------|---------|
| Player  | `x, y, width, height, speed, lives, invulnerableTimer` | pohyb šipkami, omezení na hranice canvasu, cooldown střelby |
| Bullet  | `x, y, width, height, speed`                | letí nahoru, smaže se mimo obrazovku |
| Meteor  | `x, y, radius, speed, rotation`             | padá dolů, náhodná velikost/rychlost, smaže se mimo obrazovku |

## 4. Herní smyčka (`game.js`)

```
requestAnimationFrame(loop)
  dt = čas od posledního snímku (sekundy)
  update(dt):
    - pohyb hráče podle stisknutých kláves
    - střelba (mezerník + cooldown ~250 ms)
    - pohyb střel a meteoritů
    - spawn nových meteoritů (časovač, interval se postupně zkracuje)
    - kolize střela × meteorit  → skóre += 10
    - kolize meteorit × raketa  → lives -= 1 (pokud není nezranitelná)
    - lives == 0 → stav GAME_OVER
    - odstranění objektů mimo obrazovku
  render():
    - pozadí (hvězdy), raketa, střely, meteority
    - HUD: skóre, životy (ikony srdcí)
```

Pohyb počítáme s `dt`, aby hra běžela stejně rychle na 60 i 144 Hz monitorech.

## 5. Stavy hry

```
START  --(Enter / klik "Start")-->  PLAYING  --(lives = 0)-->  GAME_OVER
  ^                                                              |
  +-------------------(klik "Hrát znovu" / Enter)----------------+
```

**Reset** nastaví: `score = 0`, `lives = 3`, vyprázdní pole střel a meteoritů, vrátí raketu doprostřed, obnoví obtížnost.

## 6. Ovládání (`input.js`)

- Objekt `keys` s aktuálním stavem kláves (`keydown` / `keyup`).
- `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `Space`.
- `preventDefault()` pro šipky a mezerník, aby se stránka neposouvala.

## 7. Kolize (`collision.js`)

- Střela × meteorit: obdélník × kruh (nebo zjednodušeně kruh × kruh).
- Meteorit × raketa: kruh × kruh se zmenšeným „hitboxem“ rakety (férovější pocit).

## 8. Výchozí konstanty (`config.js`)

| Konstanta              | Hodnota |
|------------------------|---------|
| Velikost canvasu       | 800 × 600 px |
| Počet životů           | 3 |
| Body za zásah          | 10 |
| Rychlost rakety        | 300 px/s |
| Rychlost střely        | 500 px/s |
| Cooldown střelby       | 250 ms |
| Rychlost meteoritu     | 100–250 px/s (náhodně) |
| Poloměr meteoritu      | 15–40 px (náhodně) |
| Interval spawnu        | 1,2 s → postupně min. 0,4 s |
| Nezranitelnost po zásahu | 1,5 s |

## 9. Grafika a CSS

- Kreslení na canvas pomocí tvarů (raketa = trojúhelník, meteorit = nepravidelný mnohoúhelník), později lze nahradit obrázky (sprity).
- Pozadí: posouvající se hvězdy (paralaxa).
- CSS: vycentrovaný canvas, tmavé pozadí, HUD a overlay obrazovky (START / GAME OVER) jako HTML prvky nad canvasem.

## 10. Postup vývoje (milníky)

1. **Kostra** – `index.html`, `style.css`, canvas, prázdná herní smyčka.
2. **Raketa** – vykreslení a pohyb šipkami, hranice obrazovky.
3. **Střelba** – mezerník, střely letí nahoru, cooldown.
4. **Meteority** – náhodný spawn a pád.
5. **Kolize + skóre** – zásah = +10 bodů, HUD se skóre.
6. **Životy** – náraz = −1 život, nezranitelnost, ikony životů.
7. **Game Over + reset** – overlay obrazovka, tlačítko „Hrát znovu“.
8. **Úvodní obrazovka** – START.
9. **Ladění** – zvyšování obtížnosti, hvězdné pozadí.

## 11. Možná rozšíření (později)

- Nejvyšší skóre uložené v `localStorage`.
- Zvuky (střelba, výbuch, game over).
- Částicové výbuchy při zásahu.
- Pauza (klávesa `P`).
- Power-upy (štít, dvojitá střela, extra život).
- Rozpad velkých meteoritů na menší.
- Ovládání na mobilu (dotyková tlačítka).

## 12. Testování (checklist)

- [ ] Raketa nevyjede mimo obrazovku.
- [ ] Držení mezerníku nestřílí rychleji než cooldown.
- [ ] Zásah meteoritu přičte přesně 10 bodů.
- [ ] Jeden meteorit ubere maximálně jeden život.
- [ ] Při 0 životech se zobrazí GAME OVER a hra se zastaví.
- [ ] Reset vrátí skóre, životy i objekty do výchozího stavu.
- [ ] Šipky ani mezerník neposouvají stránku.
