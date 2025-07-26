class World {
  character;
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  statusBarBottle;
  statusBarCoin;
  statusBarEndboss = new StatusBarEndboss();
  collectedCoins = 0;

  throwableObjects;

  collectCoinSound = new Audio("audio/collectingCoinsSound.mp3");


  /**
   * Initializes the world with canvas, keyboard input, and game objects.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   * @param {Keyboard} keyboard - Keyboard input handler.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.throwableObjects = [];

    this.gameStarted = false;
    setTimeout(() => {
      this.gameStarted = true;
    }, 500);

    this.spawnClouds();
    this.setWorld();
    this.run();
    this.draw();
    this.endbossIsVisible();
  }

  /**
   * Links the character to the current world instance.
   */
  setWorld() {
    this.character = new Character(this.keyboard);
    this.character.world = this;
  }

  /**
   * Starts recurring checks (collision, input, progress).
   */
  run() {
    setInterval(() => {
      this.character.checkEnemyCollisions();
      this.checkThrowObjects();
      this.checkCoinCollisions();
      this.checkLevelProgress();
    }, 200);
  }

  /**
   * Handles throwing bottles when 'D' key is pressed.
   */
  checkThrowObjects() {
    if (this.keyboard.D && !this.bottleThrown) {
      if (this.statusBarBottle.collected > 0) {
        this.bottleThrown = true;

        let offsetX = this.character.otherDirection ? -30 : 60;
        let bottle = new ThrowableObject(
          this.character.x + offsetX,
          this.character.y + 100,
          this.character.otherDirection
        );
        this.throwableObjects.push(bottle);

        this.character.collectedBottles -= 1;

        this.statusBarBottle.setCollected(this.character.collectedBottles);
        this.character.lastActionTime = Date.now();

        setTimeout(() => {
          this.bottleThrown = false;
        }, 500);
      }
    }
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
          playSound(this.collectCoinSound, 0.5); 
      }
    }
  }

  /**
   * Draws the game frame, UI, and characters continuously.
   */
  draw() {
     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.salsaBottles);

    this.ctx.translate(-this.camera_x, 0);

    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarCoin);

    if (this.endbossIsVisible()) {
      this.addToMap(this.statusBarEndboss);
    }

    this.ctx.translate(this.camera_x, 0);

    this.checkThrowObjects();

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.checkBottleHitsEndboss();

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Adds an array of objects to the canvas.
   * @param {DrawableObject[]} objects
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      if (o) this.addToMap(o);
    });
  }

  /**
   * Adds a single object to the canvas, handling flipping if needed.
   * @param {DrawableObject} mo
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
   * @param {DrawableObject} mo
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
    setInterval(() => {
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
  }

  /**
   * Opens the level-up screen and prepares the next level.
   */
  triggerLevelUp() {
    showLevelUpOverlay(() => {
      currentLevelIndex++;
      if (currentLevelIndex < levels.length) {
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
   * Sets the current level and updates all world references.
   * @param {Level} level - The level to load.
   */
  setLevel(level) {
    this.level = level;

    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
    });

    this.statusBarCoin = new StatusBarCoin(this.level.maxCoins);
    this.statusBarBottle = new StatusBarBottle(this.level.maxBottles);
    this.collectedCoins = 0;
    this.throwableObjects = [];

    if (this.character) {
      this.character.world = this;
    }
  }
}

