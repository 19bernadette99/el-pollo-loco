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
   * Checks if the level is completed: only when at least one Endboss exists
   * and all Endbosses are dead.
   */
  checkLevelCompletion() {
    const bosses = this.enemies.filter((e) => e instanceof Endboss);
    if (bosses.length === 0) return false;
    return bosses.every((b) => b.isDead === true);
  }

  /**
   * Creates coins at randomized positions across shuffled sectors.
   */
  createRandomCoins(amount) {
    const sectors = this.getShuffledSectors(700, 2000, 200);
    return this.generateCoinsFromSectors(sectors, amount, 300, 350);
  }

  /**
   * Divides horizontal range into shuffled sectors.
   */
  getShuffledSectors(minX, maxX, width) {
    const sectors = [];
    for (let s = minX; s < maxX; s += width) {
      sectors.push({ start: s, end: s + width });
    }
    return this.shuffle(sectors);
  }

  /**
   * Creates coins at random Y positions within each sector.
   */
  generateCoinsFromSectors(sectors, amount, minY, maxY) {
    const coins = [];
    for (let i = 0; i < amount && i < sectors.length; i++) {
      const s = sectors[i];
      const x = Math.random() * (s.end - s.start) + s.start;
      const y = Math.random() * (maxY - minY) + minY;
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
