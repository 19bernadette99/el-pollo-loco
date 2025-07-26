function generateLevel(config) {
  const dummyWorld = { level: { level_end_x: config.endX } };

  const startX = Math.max(500, 450);
  const chickens = createSpacedChickens(
    config.enemies.filter((e) => e === "C" || e === "CB").length,
    dummyWorld,
    startX
  );

  const endbosses = config.enemies
    .filter((e) => e === "E")
    .map(() => new Endboss());

  return new Level({
    enemies: [...chickens, ...endbosses],
    clouds: [new Cloud(), new Cloud()],
    backgroundObjects: generateBackground(),
    coinCount: config.coins,
    bottleCount: config.bottles,
    level_end_x: config.endX,
  });
}

function createSpacedChickens(count, world, startX = 500, spacing = 200) {
  const chickens = [];
  const minX = 460;

  startX = Math.max(startX, minX);

  for (let i = 0; i < count; i++) {
    const isLittle = i % 3 === 0;
    const chicken = new Chicken(isLittle);

    let x = startX + i * spacing + Math.random() * 50;
    chicken.x = Math.max(x, minX);

    chicken.world = world;

    chickens.push(chicken);
  }

  return chickens;
}

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
    new BackgroundObject(
      "img/5_background/layers/3_third_layer/1.png",
      720 * 2
    ),
    new BackgroundObject(
      "img/5_background/layers/2_second_layer/1.png",
      720 * 2
    ),
    new BackgroundObject(
      "img/5_background/layers/1_first_layer/1.png",
      720 * 2
    ),

    new BackgroundObject("img/5_background/layers/air.png", 720 * 3),
    new BackgroundObject(
      "img/5_background/layers/3_third_layer/2.png",
      720 * 3
    ),
    new BackgroundObject(
      "img/5_background/layers/2_second_layer/2.png",
      720 * 3
    ),
    new BackgroundObject(
      "img/5_background/layers/1_first_layer/2.png",
      720 * 3
    ),
  ];
}
