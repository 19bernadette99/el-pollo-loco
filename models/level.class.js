class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  salsaBottles;
  level_end_x = 2200;

  constructor(enemies, clouds, backgroundObjects, coins, salsaBottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.salsaBottles = salsaBottles;
  }
}
