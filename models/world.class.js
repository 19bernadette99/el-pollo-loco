class World {
  character;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  gamePaused = false;
  statusBarBottle;
  statusBarCoin;
  statusBar;
  statusBarEndboss;

  collectedCoins = 0;
  intervalId = null;
  cloudSpawnInterval = null;

  throwableObjects;

  collectCoinSound = new Audio("audio/collectingCoinsSound.mp3");

  /**
   * Initializes the world with canvas, keyboard input, and selected level.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   * @param {Keyboard} keyboard - Keyboard input handler.
   * @param {Level} level - The level to load.
   */
  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level;

    this.statusBar = new StatusBar();
    this.statusBarEndboss = new StatusBarEndboss();
    this.throwableObjects = [];

    this.setCharacter();

    this.camera_x = 0;
    this.gameStarted = false;
    setTimeout(() => {
      this.gameStarted = true;
    }, 500);
    this.setLevel(level);
    this.spawnClouds();
    this.run();
    this.draw();
    this.endbossIsVisible();

    const firstEndboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (firstEndboss) {
      firstEndboss.world = this;
      firstEndboss.activate();
    }
  }

  /**
   * Links the character to the current world instance.
   */
  setCharacter() {
    this.character = new Character(this.keyboard);
    this.character.world = this;
    this.character.x = 120;
    this.character.y = 210;
    this.character.speed = 10;
    this.character.isDead = false;
    this.character.lastActionTime = Date.now();
  }

  /**
   * Starts recurring checks (collision, input, progress).
   */
  run() {
    this.intervalId = setInterval(() => {
      if (!this.character) return;
      this.character.checkEnemyCollisions();
      this.checkThrowObjects();
      this.checkCoinCollisions();
      this.checkLevelProgress();
    }, 200);
  }

  /**
   * Checks if a bottle can be thrown and initiates the throw.
   */
  checkThrowObjects() {
    if (!this.canThrowBottle()) return;

    this.bottleThrown = true;
    this.spawnThrowable();
    this.updateBottleCount();

    setTimeout(() => (this.bottleThrown = false), 500);
  }

  /**
   * Returns true if bottle key is pressed, not on cooldown, and bottles are available.
   */
  canThrowBottle() {
    return (
      this.keyboard.D &&
      !this.bottleThrown &&
      this.statusBarBottle.collected > 0
    );
  }

  /**
   * Creates and adds a new throwable object near the character.
   */
  spawnThrowable() {
    const offsetX = this.character.otherDirection ? -30 : 60;
    const bottle = new ThrowableObject(
      this.character.x + offsetX,
      this.character.y + 100,
      this.character.otherDirection
    );
    this.throwableObjects.push(bottle);
  }

  /**
   * Decreases bottle count and updates status bar.
   */
  updateBottleCount() {
    this.character.collectedBottles--;
    this.statusBarBottle.setCollected(this.character.collectedBottles);
    this.character.lastActionTime = Date.now();
  }

  /**
   * Detects and processes coin pickups.
   */
  checkCoinCollisions() {
    for (let i = this.level.coins.length - 1; i >= 0; i--) {
      let coin = this.level.coins[i];
      if (this.character.isColliding(coin)) {
        this.level.coins.splice(i, 1);
        this.collectedCoins++;
        this.statusBarCoin.setCollected(this.collectedCoins);
        playSound("collectingCoins");
      }
    }
  }

  /**
   * Draws game world, UI, and characters per frame.
   */
  draw() {
    if (!this.level) return;

    this.clearCanvas();
    this.drawBackgroundLayers();
    this.drawUI();
    this.drawGameObjects();
    this.scheduleNextFrame();
  }

  /**
   * Clears the entire canvas before drawing.
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws background, clouds, coins and bottles with camera offset.
   */
  drawBackgroundLayers() {
    if (!this.level) return;
    this.ctx.translate(this.camera_x, 0);
    if (this.level.backgroundObjects) {
      this.addObjectsToMap(this.level.backgroundObjects);
    }
    if (this.level.clouds) {
      this.addObjectsToMap(this.level.clouds);
    }
    if (this.level.coins) {
      this.addObjectsToMap(this.level.coins);
    }
    if (this.level.salsaBottles) {
      this.addObjectsToMap(this.level.salsaBottles);
    }
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Draws status bars like health, bottles and coins.
   */
  drawUI() {
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarCoin);

    if (this.endbossIsVisible()) {
      this.addToMap(this.statusBarEndboss);
    }
  }

  /**
   * Draws player, enemies and throwable bottles.
   * Also checks for throw and collisions.
   */
  drawGameObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.checkThrowObjects();
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.checkBottleHitsEndboss();
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Requests the next animation frame for drawing.
   */
  scheduleNextFrame() {
    requestAnimationFrame(() => this.draw());
  }

  /**
   * Adds an array of objects to the canvas.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      if (o) this.addToMap(o);
    });
  }

  /**
   * Adds a single object to the canvas, handling flipping if needed.
   */
  addToMap(mo) {
    if (!mo) return;

    if (mo.otherDirection) {
      this.flipImage(mo);
    } else {
      mo.draw(this.ctx);
    }

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Mirrors the drawing context horizontally.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.x + mo.width, 0);
    this.ctx.scale(-1, 1);
    this.ctx.drawImage(mo.img, 0, mo.y, mo.width, mo.height);
    this.ctx.restore();
  }

  /**
   * Restores flipped image position after drawing.
   * @param {DrawableObject} mo
   */
  flipImageBack(mo) {
    mo.x = -mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Spawns clouds periodically if fewer than the max allowed.
   */
  spawnClouds() {
    this.cloudSpawnInterval = setInterval(() => {
      if (!this.level || !this.level.clouds) return;

      const maxClouds = 2;
      if (this.level.clouds.length < maxClouds) {
        let newCloud = new Cloud(this.level.clouds);
        this.level.clouds.push(newCloud);
      }
    }, 5000);
  }

  /**
   * Checks if the endboss is currently visible on screen.
   * @returns {boolean}
   */
  endbossIsVisible() {
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (!endboss) return false;
    return this.camera_x * -1 + this.canvas.width >= endboss.x;
  }

  /**
   * Detects if a bottle hits the endboss and applies damage.
   */
  checkBottleHitsEndboss() {
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (!endboss || endboss.isDead) return;

    this.throwableObjects.forEach((bottle, index) => {
      if (bottle.isColliding(endboss)) {
        endboss.hit(20);
        this.statusBarEndboss.setPercentage(endboss.percentage);
        this.throwableObjects.splice(index, 1);
      }
    });
  }

  /**
   * Displays the game-over overlay.
   */
  showGameOverScreen() {
    const overlay = document.getElementById("gameOverOverlay");
    overlay.classList.remove("hidden");
  }

  /**
   * Checks if the level is finished and triggers level-up.
   */
  checkLevelProgress() {
    const remainingEndbosses = this.level.enemies.filter(
      (enemy) => enemy instanceof Endboss && !enemy.isDead
    );

    if (remainingEndbosses.length === 0 && !this.levelUpTriggered) {
      this.levelUpTriggered = true;
      this.triggerLevelUp();
    }
    if (!this.level || !this.level.enemies || this.level.enemies.length === 0) {
      return;
    }
  }

  /**
   * Opens the level-up screen and prepares the next level.
   */
  triggerLevelUp() {
    showLevelUpOverlay(() => {
      if (currentLevelIndex + 1 < levels.length) {
        this.loadNextLevel();
      } else {
        show("gameOverOverlay");
      }
    });
  }

  /**
   * Loads the next level from the level list.
   */
  loadNextLevel() {
    if (currentLevelIndex + 1 < levels.length) {
      currentLevelIndex++;
      this.setLevel(levels[currentLevelIndex]);
      this.levelUpTriggered = false;
    } else {
      console.log("🎉 All levels completed!");
      show("gameOverOverlay");
    }
  }

  /**
   * Sets up the current level, enemies, status bars and character.
   */
  setLevel(level) {
    this.level = level;
    this.initializeEnemies();
    this.initializeStatusBars();
    this.initializeCharacter();
    this.initializeEndboss();
  }

  /**
   * Assigns the world reference to all enemies.
   */
  initializeEnemies() {
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
      enemy.animate?.();
    });
  }

  /**
   * Sets up coin and bottle status bars and resets counters.
   */
  initializeStatusBars() {
    this.statusBarCoin = new StatusBarCoin(this.level.maxCoins);
    this.statusBarBottle = new StatusBarBottle(this.level.maxBottles);
    this.collectedCoins = 0;
    this.throwableObjects = [];
  }

  /**
   * Sets character position and resets relevant states.
   */
  initializeCharacter() {
    if (!this.character) return;

    this.character.world = this;
    this.character.keyboard = this.keyboard; 
    this.character.x = 120;
    this.character.y = 210;
    this.character.speed = 10;
    this.character.isDead = false;
    this.character.isJumping = false;
    this.character.lastActionTime = Date.now();
    this.camera_x = 0;
  }

  /**
   * Finds and activates the first Endboss in the level.
   */
  initializeEndboss() {
    const firstEndboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (firstEndboss) {
      firstEndboss.world = this;
      firstEndboss.activate();
    }
  }

  /**
   * Updates world state: collisions, enemies, throwable objects.
   */
  update() {
    this.checkCollisions?.();
    this.updateEnemies?.();
    this.updateThrowableObjects?.();
  }

scheduleNextFrame() {
  if (!this.level) return;
  this.animationFrameId = requestAnimationFrame(() => this.draw());
}

  stop() {
    this.gameStarted = false;
    cancelAnimationFrame(this.animationFrameId);
    clearInterval(this.intervalId);
    clearInterval(this.cloudSpawnInterval);

    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;

    this.character?.stopMovementLoop?.();
    this.level?.enemies?.forEach((enemy) => enemy?.stopAnimation?.());
    this.throwableObjects?.forEach((obj) => clearInterval(obj?.moveInterval));

    this.throwableObjects = [];

    this.animationFrameId = null;
  }
}
