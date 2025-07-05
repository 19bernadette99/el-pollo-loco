class ThrowableObject extends MoveableObject {
  BOTTLE_IMAGES = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  SPLASH_IMAGES = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  hasSplashed = false;

  constructor(x, y, otherDirection) {
    super();
    this.loadImage("img/6_salsa_bottle/salsa_bottle.png");
    this.loadImages(this.BOTTLE_IMAGES);
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 60;
    this.otherDirection = otherDirection;
    this.throw();
  }

  throw() {
    this.speedY = 25;
    this.applyGravity();
    this.animateThrow();

    this.throwInterval = setInterval(() => {
      if (this.otherDirection) {
        this.x -= 10;
      } else {
        this.x += 10;
      }
      if (this.y >= 350 && !this.hasSplashed) {
        this.splash();
      }
    }, 25);
  }

  animateThrow() {
    this.throwAnimationInterval = setInterval(() => {
      if (!this.hasSplashed) {
        this.playAnimation(this.BOTTLE_IMAGES);
      }
    }, 90);
  }

  splash() {
    this.hasSplashed = true;
    this.stopThrow();
    this.prepareSplashAnimation();
    this.startSplashAnimation();
    this.hideAfterSplash();
  }

  stopThrow() {
    clearInterval(this.throwInterval);
    clearInterval(this.throwAnimationInterval);
    this.speedY = 0;
  }

  prepareSplashAnimation() {
    this.loadImages(this.SPLASH_IMAGES);
    this.currentImage = 0;
    this.img = this.imageCache[this.SPLASH_IMAGES[0]];
  }

  startSplashAnimation() {
    this.splashInterval = setInterval(() => {
      this.playAnimation(this.SPLASH_IMAGES);
    }, 100);
  }

  hideAfterSplash() {
    setTimeout(() => {
      clearInterval(this.splashInterval);
      this.visible = false;
    }, 1000);
  }
}
