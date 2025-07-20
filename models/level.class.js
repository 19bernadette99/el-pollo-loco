class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  salsaBottles;
  level_end_x = 2200;
  maxCoins;
  maxBottles;

  /**
   * Creates a new level with given objects and generates random coins and bottles.
   * @param {Object} options - Level configuration.
   */
  constructor({
    enemies = [],
    clouds = [],
    backgroundObjects = [],
    coinCount = 10,
    bottleCount = 5,
    level_end_x = 2200,
  }) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.level_end_x = level_end_x;

    this.maxCoins = coinCount;
    this.maxBottles = bottleCount;

    this.coins = this.createRandomCoins(coinCount);
    this.salsaBottles = this.createRandomBottles(bottleCount);
  }

  /**
   * Checks if all endbosses in the level have been defeated.
   * @returns {boolean} True if level is complete.
   */
  checkLevelCompletion() {
    const endbossesAlive = this.enemies.filter(
      (e) => e instanceof Endboss && !e.isDead
    );
    return endbossesAlive.length === 0;
  }

  /**
   * Creates a set of coins at randomized positions within horizontal sectors.
   * @param {number} amount - Number of coins to generate.
   * @returns {Coin[]} Array of Coin objects.
   */
  createRandomCoins(amount) {
    let coins = [];
    let minX = 700;
    let maxX = 2000;
    let minY = 300;
    let maxY = 350;
    let sectorWidth = 200;

    let sectors = [];
    for (let s = minX; s < maxX; s += sectorWidth) {
      sectors.push({ start: s, end: s + sectorWidth });
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

  /**
   * Creates a set of salsa bottles at random X positions.
   * @param {number} amount - Number of bottles to generate.
   * @returns {SalsaBottle[]} Array of SalsaBottle objects.
   */
  createRandomBottles(amount) {
    let bottles = [];
    for (let i = 0; i < amount; i++) {
      let x = Math.random() * (2000 - 300) + 300;
      bottles.push(new SalsaBottle(x, 360));
    }
    return bottles;
  }

  /**
   * Shuffles an array in-place using Fisher-Yates algorithm.
   * @param {Array} array - The array to shuffle.
   * @returns {Array} Shuffled array.
   */
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
