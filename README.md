# Space Shooter

2D arkádová hra v HTML5 / CSS3 / JavaScriptu. Sestřeluj padající meteority!

## Spuštění
Otevři `index.html` v prohlížeči (žádná instalace ani server nejsou potřeba).

## Ovládání
- **Šipky** – pohyb rakety
- **Mezerník** – střelba
- **Enter** – start / nová hra

## Pravidla
- Zásah meteoritu = +10 bodů
- Náraz meteoritu do rakety = −1 život (3 životy na začátku)
- Po ztrátě všech životů se zobrazí GAME OVER s možností hrát znovu
- Nejvyšší skóre se ukládá v prohlížeči (localStorage) a zůstane i po zavření stránky

## Bonusové meteority
Zlaté zářící meteority (asi každý 8.) jsou menší a za jejich sestřelení dostaneš náhodnou odměnu:
- **+50 bodů**
- **+1 život** (maximálně 5)
- **Štít** – 5 s nezranitelnosti
- **Trojitá střela** – 8 s střílíš tři střely do vějíře

Podrobný plán hry je v [PLAN.md](PLAN.md).
