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
   * Starts movement and walking animation intervals.
   */
  animate() {
    this.walkInterval = setInterval(() => {
      if (!this.hasDied) {
        if (this.otherDirection) {
          this.moveRight();
        } else {
          this.moveLeft();
        }

        if (this.x <= 10) {
          this.moveRight();
        } else if (this.x + this.width >= this.world.level.level_end_x - 10) {
          this.moveLeft();
        }
      }
    }, 1000 / 60);

    this.animationInterval = setInterval(() => {
      if (!this.hasDied) {
        this.playAnimation(this.currentWalkingImages);
      }
    }, 150);
  }

  /**
   * Triggers death logic, stops animation and moves off-screen.
   */
  die() {
    this.hasDied = true;
    this.speed = 0;

    if (this.walkInterval) {
      clearInterval(this.walkInterval);
    }
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }

    if (this.isLittle) {
      this.loadImage("img/3_enemies_chicken/chicken_small/2_dead/dead.png");
    } else {
      this.loadImage("img/3_enemies_chicken/chicken_normal/2_dead/dead.png");
    }

    setTimeout(() => {
      this.y = 9999;
    }, 500);
  }

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
