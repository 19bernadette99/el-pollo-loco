const MIN_ENEMY_SPAWN_X = 500;

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
    coinCount: config.coins,
    bottleCount: config.bottles,
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
  const usableSpan = Math.max(0, endX - MIN_ENEMY_SPAWN_X - 200);
  const spacing = Math.max(200, Math.floor(usableSpan / Math.max(1, count)));
  const world = { level: { level_end_x: endX } };
  const chickens = createSpacedChickens(count, world, MIN_ENEMY_SPAWN_X, spacing);
  return chickens.map((c, i) => {
    c.x = Math.max(c.x, MIN_ENEMY_SPAWN_X + i * 0); 
    return c;
  });
}

/**
 * Places chickens at spaced intervals with slight randomness.
 */
function createSpacedChickens(count, world, startX = MIN_ENEMY_SPAWN_X, spacing = 200) {
  const chickens = [];
  for (let i = 0; i < count; i++) {
    const isLittle = i % 3 === 0;
    const chicken = new Chicken(isLittle);

    const base = startX + i * spacing;
    chicken.x = Math.max(base + Math.random() * 50, startX);

    chicken.world = world;
    chickens.push(chicken);
  }
  return chickens;
}

/**
 * Creates all endboss instances based on enemy data.
 */
function createEndbosses(enemies = []) {
  return enemies.filter((e) => e === "E").map(() => new Endboss());
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
