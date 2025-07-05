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
  throwableObjects;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.throwableObjects = [];

    this.setWorld();
    this.run();
    this.draw();
  }

  setWorld() {
    this.character = new Character(this.keyboard);
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.character.checkEnemyCollisions();
      this.checkThrowObjects();
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D && !this.bottleThrown) {
      this.bottleThrown = true;

      let offsetX = this.character.otherDirection ? -30 : 60;
      let bottle = new ThrowableObject(
        this.character.x + offsetX,
        this.character.y + 100,
        this.character.otherDirection
      );
      this.throwableObjects.push(bottle);
      this.character.lastActionTime = Date.now();
      setTimeout(() => {
        this.bottleThrown = false;
      }, 500);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);

    this.ctx.translate(-this.camera_x, 0);
    // -----Space for fixed objects-----
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarCoin);
    this.ctx.translate(this.camera_x, 0);

    this.checkThrowObjects();

    this.character.checkEnemyCollisions();

    this.addObjectsToMap(this.level.clouds);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);

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

  throwBottle() {
    let offsetX = this.character.otherDirection ? -50 : 50;
    let bottle = new ThrowableObject(
      this.character.x + offsetX,
      this.character.y + 100,
      this.character.otherDirection
    );
    let gravityCheck = setInterval(() => {
      if (this.y >= 350) {
        clearInterval(this.throwInterval);
        clearInterval(gravityCheck);
      }
    }, 50);

    this.throwableObjects.push(bottle);
  }
}
