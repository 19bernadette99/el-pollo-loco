/**
 * Generates a new level with enemies, background, and items.
 */
function generateLevel(config) {
  const enemies = createAllEnemies(config.enemies, config.endX);
  const clouds = [new Cloud(), new Cloud()];
  const background = generateBackground();
  const items = createLevelItems(config);

  return buildLevel(config, enemies, clouds, background, items);
}

/**
 * Creates all enemy instances (chickens + endbosses).
 */
function createAllEnemies(enemies, endX) {
  const chickens = createChickens(enemies, endX);
  const endbosses = createEndbosses(enemies);
  return [...chickens, ...endbosses];
}

/**
 * Creates all collectible items (coins + bottles).
 */
function createLevelItems(config) {
  const coins = createCoins(config.coins, config.endX);
  const salsaBottles = createSalsaBottles(config.bottles, config.endX);
  return { coins, salsaBottles };
}

/**
 * Builds and returns a Level instance.
 */
function buildLevel(config, enemies, clouds, background, items) {
  return new Level({
    enemies,
    clouds,
    backgroundObjects: background,
    coins: items.coins,
    salsaBottles: items.salsaBottles,
    maxCoins: config.coins,
    maxBottles: config.bottles,
    level_end_x: config.endX,
  });
}

/**
 * Creates coin instances across the level width.
 */
function createCoins(count, endX) {
  const arr = [];
  const startX = 300;
  const span = Math.max(1, endX - startX - 200);
  const step = Math.max(120, Math.floor(span / Math.max(1, count)));
  for (let i = 0; i < count; i++) {
    const x = startX + i * step + Math.random() * 40;
    const y = 120 + Math.random() * 60;
    arr.push(new Coin(x, y));
  }
  return arr;
}

/**
 * Creates bottle instances (ground-level).
 */
function createSalsaBottles(count, endX) {
  const arr = [];
  const startX = 350;
  const span = Math.max(1, endX - startX - 200);
  const step = Math.max(150, Math.floor(span / Math.max(1, count)));
  for (let i = 0; i < count; i++) {
    const x = startX + i * step + Math.random() * 40;
    const y = 180; // ground
    arr.push(new SalsaBottle(x, y));
  }
  return arr;
}

/**
 * Creates chicken enemies spaced along the level.
 */
function createChickens(enemies = [], endX) {
  const count = enemies.filter((e) => e === "C" || e === "CB").length;
  const world = { level: { level_end_x: endX } };
  return createSpacedChickens(count, world);
}

/**
 * Creates all endboss instances based on enemy data.
 */
function createEndbosses(enemies = []) {
  return enemies.filter((e) => e === "E").map(() => new Endboss());
}

/**
 * Places chickens at spaced intervals with slight randomness.
 */
function createSpacedChickens(count, world, startX = 500, spacing = 200) {
  const chickens = [];
  const minX = 500;
  startX = Math.max(startX, minX);
  for (let i = 0; i < count; i++) {
    const isLittle = i % 3 === 0;
    const chicken = new Chicken(isLittle);
    chicken.x = Math.max(startX + i * spacing + Math.random() * 50, minX);
    chicken.world = world;
    chickens.push(chicken);
  }
  return chickens;
}

/**
 * Generates layered background objects for the level.
 */
function generateBackground() {
  return [
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
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 720 * 3),
  ];
}
