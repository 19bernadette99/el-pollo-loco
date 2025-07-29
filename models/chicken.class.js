class Chicken extends MoveableObject {
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_WALKING_LITTLE = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  /**
   * Creates a big or small chicken, sets position and speed, starts animation.
   * @param {boolean} isLittle - Whether the chicken is small.
   */
  constructor(isLittle = false) {
    super();
    this.isLittle = isLittle;

    if (this.isLittle) this.littleChicken();
    else this.bigChicken();

    this.otherDirection = false;
    this.x = Math.max(this.x, 450);
    this.speed = 0.15 + Math.random() * 0.5;
    this.animate();
  }

  /**
   * Sets up a small chicken with image, size, and position.
   */
  littleChicken() {
    this.loadImage(this.IMAGES_WALKING_LITTLE[0]);
    this.loadImages(this.IMAGES_WALKING_LITTLE);
    this.currentWalkingImages = this.IMAGES_WALKING_LITTLE;
    this.height = 40;
    this.width = 40;
    this.y = 390;
  }

  /**
   * Sets up a big chicken with image, size, and position.
   */
  bigChicken() {
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.currentWalkingImages = this.IMAGES_WALKING;
    this.height = 65;
    this.width = 65;
    this.y = 365;
  }

  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = false;
  }

  moveRight() {
    this.x += this.speed;
    this.otherDirection = true;
  }

  /**
   * Starts movement and walk animation.
   */
  animate() {
    this.moveLoop();
    this.walkLoop();
  }

  /**
   * Handles left/right movement.
   */
  moveLoop() {
    this.walkInterval = setInterval(() => {
      if (window.gamePaused || this.hasDied) return;

      if (this.otherDirection || this.x <= 10) this.moveRight();
      else if (this.x + this.width >= this.world.level.level_end_x - 10)
        this.moveLeft();
      else this.moveLeft();
    }, 1000 / 60);
  }

  /**
   * Plays walk animation.
   */
  walkLoop() {
    this.animationInterval = setInterval(() => {
      if (window.gamePaused || this.hasDied) return;

      this.playAnimation(this.currentWalkingImages);
    }, 150);
  }

  /**
   * Stops movement/animation and triggers death image + removal.
   */
  die() {
    this.hasDied = true;
    this.speed = 0;
    this.stopAllIntervals();
    this.showDeadImage();
    setTimeout(() => (this.y = 9999), 500);
  }

  /**
   * Clears walking and animation intervals if active.
   */
  stopAllIntervals() {
    clearInterval(this.walkInterval);
    clearInterval(this.animationInterval);
  }

  /**
   * Loads correct death image based on enemy type.
   */
  showDeadImage() {
    const basePath = "img/3_enemies_chicken/";
    const type = this.isLittle ? "chicken_small" : "chicken_normal";
    this.loadImage(`${basePath}${type}/2_dead/dead.png`);
  }

  /**
   * Draws the object, flipped horizontally if facing left.
   */
  draw(ctx) {
    if (this.otherDirection) {
      ctx.save();
      ctx.translate(this.x + this.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(this.img, 0, this.y, this.width, this.height);
      ctx.restore();
    } else {
      super.draw(ctx);
    }
  }
}
