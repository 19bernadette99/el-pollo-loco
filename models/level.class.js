class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  salsaBottles;
  level_end_x;

  constructor({
    enemies = [],
    clouds = [],
    backgroundObjects = [],
    coinCount = 0,
    bottleCount = 0,
    level_end_x = 2200
  }) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = this.createRandomCoins(coinCount);
    this.salsaBottles = this.createSalsaBottles(bottleCount);
    this.level_end_x = level_end_x;
    this.maxCoins = coinCount;
  }

  createRandomCoins(amount) {
    let coins = [];

    let minX = 700;
    let maxX = 2000;
    let minY = 300;
    let maxY = 350;
    let sectorWidth = 200;

    let sectors = [];
    for (let s = minX; s < maxX; s += sectorWidth) {
      sectors.push({
        start: s,
        end: s + sectorWidth
      });
    }

    sectors = this.shuffle(sectors);

    for (let i = 0; i < amount && i < sectors.length; i++) {
      let sector = sectors[i];
      let x = Math.random() * (sector.end - sector.start) + sector.start;
      let y = Math.random() * (maxY - minY) + minY;
      coins.push(new Coin(x, y));
    }

    return coins;
  }

  createSalsaBottles(amount, spacing = 300, startX = 300) {
    let bottles = [];

    for (let i = 0; i < amount; i++) {
      let x = startX + i * spacing;
      let y = 360;
      bottles.push(new SalsaBottle(x, y));
    }

    return bottles;
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
