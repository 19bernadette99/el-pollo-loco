function createRandomCoins(amount) {
  let coins = [];

  let minX = 500;
  let maxX = 2500;
  let minY = 300;
  let maxY = 350;
  let sectorWidth = 200;

  let sectors = [];

  // Alle möglichen Sektoren berechnen
  for (let s = minX; s < maxX; s += sectorWidth) {
    sectors.push({
      start: s,
      end: s + sectorWidth
    });
  }

  // Mische die Sektoren
  sectors = shuffle(sectors);

  for (let i = 0; i < amount && i < sectors.length; i++) {
    let sector = sectors[i];
    let x = Math.random() * (sector.end - sector.start) + sector.start;
    let y = Math.random() * (maxY - minY) + minY;
    coins.push(new Coin(x, y));
  }

  return coins;
}

/**
 * Mischt ein Array zufällig durch (Fisher-Yates).
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


const level1 = new Level(
  [
    new Chicken(), 
    new Chicken(), 
    new Chicken(),
    new Chicken(true),
    new Chicken(true),
    new Chicken(true),
    new Endboss()
  ],
  [
    new Cloud(),
    new Cloud()
  ],
  [
    new BackgroundObject("img/5_background/layers/air.png", -720),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -720),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -720),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -720),
    new BackgroundObject("img/5_background/layers/air.png", 0),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/air.png", 720),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 720),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 720),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 720),
    new BackgroundObject("img/5_background/layers/air.png", 720 * 2),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 720 * 2),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 720 * 2),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 720 * 2),
    new BackgroundObject("img/5_background/layers/air.png", 720 * 3),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 720 * 3),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 720 * 3),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 720 * 3)
  ],
  createRandomCoins(10)
);



