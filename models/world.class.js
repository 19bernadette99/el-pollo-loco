class World extends WorldCore {
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
   */
  constructor(canvas, keyboard, level, options = {}) {
    super(); 
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level;
    this.level.hadBossesAtStart = this.level.enemies.some(e => e instanceof Endboss);
    this.throwableObjects = [];
    this.setCharacter();
    const carried = Math.max(0, Math.min(100, Math.floor(options.initialHealth ?? 100)));
    this.character.energy = carried;
    this.statusBar = new StatusBar(this.character.energy);
    this.statusBarEndboss = new StatusBarEndboss();
    this.camera_x = 0;
    this.gameStarted = false;
    setTimeout(() => { this.gameStarted = true; }, 500);
    this.setLevel(level);
    this.spawnClouds();
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
      this.character.checkEndbossCollisionSpecial?.();
      this.character.checkEnemyCollisionsExceptBoss?.();
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
   * Detects collisions between throwable bottles and any alive Endboss.
   */
  checkBottleHitsEndboss() {
    const bosses = this.level.enemies.filter(
      (e) => e instanceof Endboss && !e.deathComplete
    );
    if (bosses.length === 0) return;
    this.throwableObjects.forEach((bottle, index) => {
      const hitBoss = bosses.find((b) => bottle.isColliding(b));
      if (!hitBoss) return;
      hitBoss.onBottleCollision?.(bottle, 20);
      this.statusBarEndboss.setPercentage(hitBoss.percentage);
      this.throwableObjects.splice(index, 1);
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
    if (!this.level || this.levelUpTriggered) return;
    const hadBosses = !!this.level.hadBossesAtStart;
    if (!hadBosses) return;
    const anyBossNotDone = this.level.enemies.some(
      e => e instanceof Endboss && !e.deathComplete
    );
    if (anyBossNotDone) return;
    this.levelUpTriggered = true;
    setTimeout(() => this.triggerLevelUp(), 50);
  }

  /**
   * Opens the level-up screen and prepares the next level.
   */
  triggerLevelUp() {
    showLevelUpOverlay(() => {
      if (currentLevelIndex + 1 < levelConfigs.length) {
        this.loadNextLevel();
      } else {
        showGameFinishedOverlay();
      }
    });
  }

  /**
   * Loads the next level from the level list.
   */
  loadNextLevel() {
    if (currentLevelIndex + 1 < levelConfigs.length) {
      currentLevelIndex++;
      if (typeof window !== 'undefined') {
        window.overlayOpen = false;
        window.gamePaused = false;
      }
      this.gamePaused = false;
      this.setLevel(generateLevel(levelConfigs[currentLevelIndex]));
      this.levelUpTriggered = false;
      if (typeof window !== 'undefined' && !window.loopActive) {
        startGameLoop();
      }
    } else {
      showGameFinishedOverlay();
    }
  }

  /**
   * Updates world state. Called by the external game loop each frame.
   */
  update() {
    if (!this.character) return;
    this.level?.enemies?.forEach((e) => e.tryAutoActivate?.(this));
    this.character.checkEndbossCollisionSpecial?.();
    this.character.checkEnemyCollisionsExceptBoss?.();
    this.checkThrowObjects?.();
    this.checkCoinCollisions?.();
    this.checkLevelProgress?.();
    this.checkBottleHitsEndboss();
    this.checkBottleChickenCollisions();
    this.updateEnemies?.();
    this.updateThrowableObjects?.();
  }

  /**
   * Kills chickens that are hit by a flying salsa bottle.
   */
  checkBottleChickenCollisions() {
    const bottles = (this.throwableObjects || []).filter((b) => !b.hasSplashed);
    const chickens = (this.level?.enemies || []).filter(
      (e) => e instanceof Chicken && !e.hasDied
    );
    bottles.forEach((bottle) => {
      chickens.forEach((chicken) => {
        if (this.aabb(bottle, chicken)) {
          chicken.die();
          bottle.onChickenHit?.(chicken);
        }
      });
    });
  }

  /**
   * Checks whether two axis-aligned bounding boxes (AABB) overlap.
   */
  aabb(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  /**
   * Stops the game and resets all game state.
   */
  stop() {
    this.character?.wakeUpPepe?.();
    this.resetGameFlags();
    this.stopGameLoops();
    this.stopCharacterAndEnemies();
    this.resetAudio();
    this.clearGameObjects();
  }

  /**
   * Resets game state flags.
   */
  resetGameFlags() {
    this.gameStarted = false;
    this.levelUpTriggered = false;
  }

  /**
   * Stops all active animation and update loops.
   */
  stopGameLoops() {
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
    clearInterval(this.intervalId);
    clearInterval(this.cloudSpawnInterval);
    if (this.character?.gravityInterval) {
      clearInterval(this.character.gravityInterval);
      this.character.gravityInterval = null;
    }
  }

  /**
   * Stops character movement and enemy animations.
   */
  stopCharacterAndEnemies() {
    this.character?.stopMovementLoop?.();
    this.level?.enemies?.forEach((enemy) => enemy?.stopAnimation?.());
    this.throwableObjects?.forEach((obj) => clearInterval(obj?.moveInterval));
  }

  /**
   * Pauses and resets background music.
   */
  resetAudio() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  }

  /**
   * Clears all remaining game objects from memory.
   */
  clearGameObjects() {
    this.throwableObjects = [];
    this.level = null;
    this.character = null;
  }
}
