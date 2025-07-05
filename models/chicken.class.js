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

  constructor(isLittle = false) {
    super();

    this.isLittle = isLittle;

    if (this.isLittle) {
      this.littleChicken();
    } else {
      this.bigChicken();
    }

    this.x = 450 + Math.random() * 500;
    this.speed = 0.15 + Math.random() * 0.5;
    this.animate();
  }

  littleChicken() {
    this.loadImage(this.IMAGES_WALKING_LITTLE[0]);
    this.loadImages(this.IMAGES_WALKING_LITTLE);
    this.currentWalkingImages = this.IMAGES_WALKING_LITTLE;
    this.height = 40;
    this.width = 40;
    this.y = 390;
  }

  bigChicken() {
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.currentWalkingImages = this.IMAGES_WALKING;
    this.height = 65;
    this.width = 65;
    this.y = 365;
  }

  animate() {
    setInterval(() => {
      if (!this.hasDied) {
        this.moveLeft();
      }
    }, 1000 / 60);

    setInterval(() => {
      if (!this.hasDied) {
        this.playAnimation(this.currentWalkingImages);
      }
    }, 150);
  }

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
}
