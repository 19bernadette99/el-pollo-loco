class WorldCore {
  /**
   * Draws the whole frame: background, UI, and game objects.
   */
  draw() {
    if (!this.level) return;
    this.clearCanvas();
    this.drawBackgroundLayers();
    this.drawUI();
    this.drawGameObjects();
  }

  /**
   * Requests the next animation frame for drawing and stores the id.
   */
  scheduleNextFrame() {
    if (!this.level) return;
    this.animationFrameId = requestAnimationFrame(() => this.draw());
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
    if (this.level.backgroundObjects) this.addObjectsToMap(this.level.backgroundObjects);
    if (this.level.clouds) this.addObjectsToMap(this.level.clouds);
    if (this.level.coins) this.addObjectsToMap(this.level.coins);
    if (this.level.salsaBottles) this.addObjectsToMap(this.level.salsaBottles);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Draws status bars like health, bottles and coins.
   */
  drawUI() {
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarCoin);
    if (this.endbossIsVisible()) this.addToMap(this.statusBarEndboss);
  }

  /**
   * Draws player, enemies and throwable bottles.
   */
  drawGameObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.checkThrowObjects?.();
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.checkBottleHitsEndboss?.();
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Adds an array of objects to the canvas.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => { if (o) this.addToMap(o); });
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
   */
  endbossIsVisible() {
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (!endboss) return false;
    return this.camera_x * -1 + this.canvas.width >= endboss.x;
  }

  /**
   * Sets up the current level, enemies, status bars and character.
   */
  setLevel(level) {
    this.level = level;
    this.level.hadBossesAtStart = this.level.enemies.some(e => e instanceof Endboss);
    this.initializeEnemies();
    this.initializeStatusBars();
    this.initializeCharacter();
    this.initializeEndboss();
    this.statusBarEndboss = new StatusBarEndboss();
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
}
