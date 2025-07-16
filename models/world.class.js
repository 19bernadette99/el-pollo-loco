class World {
  character;
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  statusBarBottle = new StatusBarBottle();
  statusBarCoin = new StatusBarCoin();
  statusBarEndboss = new StatusBarEndboss();
  collectedCoins = 0;

  throwableObjects;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.throwableObjects = [];
    this.statusBarCoin.maxCoins = this.level.coins.length;

    this.gameStarted = false;
    setTimeout(() => {
      this.gameStarted = true;
    }, 500);

    this.spawnClouds();
    this.setWorld();
    this.run();
    this.draw();
    this.endbossIsVisible();
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
    });
    this.loadGameOverImage();
  }

  setWorld() {
    this.character = new Character(this.keyboard);
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.character.checkEnemyCollisions();
      this.checkThrowObjects();
      this.checkCoinCollisions();
    }, 200);
  }

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

  checkCoinCollisions() {
    for (let i = this.level.coins.length - 1; i >= 0; i--) {
      let coin = this.level.coins[i];
      if (this.character.isColliding(coin)) {
        console.log("Coin getroffen bei:", coin.x, coin.y);
        this.level.coins.splice(i, 1);
        this.collectedCoins++;
        this.statusBarCoin.setCollected(this.collectedCoins);
      }
    }
  }

  draw() {
    if (this.character.hasDied) {
      this.showGameOverScreen();
      return;
    }

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

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      if (o) this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (!mo) return;

    if (mo.otherDirection) {
      this.flipImage(mo);
    } else {
      mo.draw(this.ctx);
    }

    // mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.x + mo.width, 0);
    this.ctx.scale(-1, 1);
    this.ctx.drawImage(mo.img, 0, mo.y, mo.width, mo.height);
    this.ctx.restore();
  }

  flipImageBack(mo) {
    mo.x = -mo.x * -1;
    this.ctx.restore();
  }

  spawnClouds() {
    setInterval(() => {
      const maxClouds = 2;
      if (this.level.clouds.length < maxClouds) {
        let newCloud = new Cloud(this.level.clouds);
        this.level.clouds.push(newCloud);
      }
    }, 5000);
  }

  endbossIsVisible() {
    let endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (!endboss) return false;
    return this.camera_x * -1 + this.canvas.width >= endboss.x;
  }

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


  loadGameOverImage() {
    this.gameOverImage = new Image();
    this.gameOverImage.src = "img/You won, you lost/Game Over.png";
  }

  showGameOverScreen() {
    const overlay = document.getElementById("gameOverOverlay");
    overlay.classList.remove("hidden");
  }
}
