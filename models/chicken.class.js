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
   * Creates a big or small chicken, sets position and speed, and starts animation.
   */
  constructor(isLittle = false) {
    super();
    this.isLittle = isLittle;
    if (this.isLittle) this.littleChicken();
    else this.bigChicken();
    this.otherDirection = false;
    this.x = Math.max(this.x, 450);
    this.speed = 0.15 + Math.random() * 0.5;
    if (!this.walkInterval && !this.animationInterval) {
      this.animate();
    }
  }

  /** Sets up a small chicken with images, size, and ground position. */
  littleChicken() {
    this.loadImage(this.IMAGES_WALKING_LITTLE[0]);
    this.loadImages(this.IMAGES_WALKING_LITTLE);
    this.currentWalkingImages = this.IMAGES_WALKING_LITTLE;
    this.height = 40;
    this.width = 40;
    this.y = 390;
    this.x = 500;
  }

  /** Sets up a big chicken with images, size, and ground position. */
  bigChicken() {
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.currentWalkingImages = this.IMAGES_WALKING;
    this.height = 65;
    this.width = 65;
    this.y = 365;
    this.x = 500;
  }

  /** Moves the chicken left and sets facing to left. */
  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = false;
  }

  /** Moves the chicken right and sets facing to right. */
  moveRight() {
    this.x += this.speed;
    this.otherDirection = true;
  }

  /** Starts the movement and walking animation loops. */
  animate() {
    this.moveLoop();
    this.walkLoop();
  }

  /** Runs horizontal patrol logic at ~60 FPS, respecting world bounds. */
  moveLoop() {
    this.walkInterval = setInterval(() => {
      if (window.gamePaused || this.hasDied) return;
      if (this.otherDirection || this.x <= 10) this.moveRight();
      else if (this.x + this.width >= this.world.level.level_end_x - 10)
        this.moveLeft();
      else this.moveLeft();
    }, 1000 / 60);
  }

  /** Plays the walking animation while alive at a fixed cadence. */
  walkLoop() {
    this.animationInterval = setInterval(() => {
      if (window.gamePaused || this.hasDied) return;

      this.playAnimation(this.currentWalkingImages);
    }, 250);
  }

  /** Stops loops, shows death frame, and removes the sprite after a delay. */
  die() {
    this.hasDied = true;
    this.speed = 0;
    this.stopAllIntervals();
    this.showDeadImage();
    setTimeout(() => (this.y = 9999), 500);
  }

  /** Clears movement and animation intervals if set. */
  stopAllIntervals() {
    clearInterval(this.walkInterval);
    clearInterval(this.animationInterval);
  }

  /** Loads the correct dead sprite depending on chicken size. */
  showDeadImage() {
    const basePath = "img/3_enemies_chicken/";
    const type = this.isLittle ? "chicken_small" : "chicken_normal";
    this.loadImage(`${basePath}${type}/2_dead/dead.png`);
  }

  /**
   * Draws the chicken, horizontally flipped when facing left.
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
