/**
 * Generates a new level with enemies, background and items.
 * 
 * @param {Object} config - Configuration object
 * @param {number} config.endX - End position of the level
 * @param {string[]} config.enemies - Array of enemy types ("C", "CB", "E")
 * @param {number} config.coins - Total number of coins
 * @param {number} config.bottles - Total number of bottles
 * @returns {Level} A new level instance
 */
function generateLevel(config) {
  const chickens = createChickens(config.enemies, config.endX);
  const endbosses = createEndbosses(config.enemies);
  
  return new Level({
    enemies: [...chickens, ...endbosses],
    clouds: [new Cloud(), new Cloud()],
    backgroundObjects: generateBackground(),
    coinCount: config.coins,
    bottleCount: config.bottles,
    level_end_x: config.endX,
  });
}

/**
 * Creates chicken enemies spaced along the level.
 * 
 * @param {string[]} enemies - Array of enemy identifiers
 * @param {number} endX - Level end X position
 * @returns {Chicken[]} Array of chicken enemies
 */
function createChickens(enemies, endX) {
  const count = enemies.filter(e => e === "C" || e === "CB").length;
  const world = { level: { level_end_x: endX } };
  return createSpacedChickens(count, world);
}

/**
 * Creates all endboss instances based on enemy data.
 * 
 * @param {string[]} enemies - Array of enemy identifiers
 * @returns {Endboss[]} Array of endboss instances
 */
function createEndbosses(enemies) {
  return enemies.filter(e => e === "E").map(() => new Endboss());
}

/**
 * Places chickens at spaced intervals with slight randomness.
 * 
 * @param {number} count - Total chickens to create
 * @param {Object} world - Reference to the level world
 * @param {number} [startX=500] - Starting X position
 * @param {number} [spacing=200] - Distance between chickens
 * @returns {Chicken[]} Array of chicken objects
 */
function createSpacedChickens(count, world, startX = 500, spacing = 200) {
  const chickens = [];
  const minX = 460;
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
 * 
 * @returns {BackgroundObject[]} Array of background objects
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

