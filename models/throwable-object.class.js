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

  breakingBottleSound = new Audio("audio/breakingBottle.mp3");

  /**
   * Creates and throws a new salsa bottle in the given direction.
   * @param {number} x - Starting X position.
   * @param {number} y - Starting Y position.
   * @param {boolean} otherDirection - Direction the bottle is thrown.
   */
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
    this.breakingBottleSound.preload = "auto";
    this.breakingBottleSound.load();
  }

  /**
   * Starts bottle movement, gravity, and collision detection.
   */
  throw() {
    if (soundEnabled) {
      const splashSound = this.breakingBottleSound.cloneNode();
      splashSound.volume = 0.5;
      splashSound.play();
    }
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

  /**
   * Starts the bottle rotation animation while flying.
   */
  animateThrow() {
    this.throwAnimationInterval = setInterval(() => {
      if (!this.hasSplashed) {
        this.playAnimation(this.BOTTLE_IMAGES);
      }
    }, 90);
  }

  /**
   * Handles bottle splash effect when it hits the ground.
   */
  splash() {
    this.hasSplashed = true;
    this.stopThrow();
    this.prepareSplashAnimation();
    this.startSplashAnimation();
    this.hideAfterSplash();
  }

  /**
   * Stops bottle movement and animation.
   */
  stopThrow() {
    clearInterval(this.throwInterval);
    clearInterval(this.throwAnimationInterval);
    this.speedY = 0;
  }

  /**
   * Loads splash images and prepares first frame.
   */
  prepareSplashAnimation() {
    this.loadImages(this.SPLASH_IMAGES);
    this.currentImage = 0;
    this.img = this.imageCache[this.SPLASH_IMAGES[0]];
  }

  /**
   * Starts the splash animation sequence.
   */
  startSplashAnimation() {
    this.splashInterval = setInterval(() => {
      this.playAnimation(this.SPLASH_IMAGES);
    }, 100);
  }

  /**
   * Hides the bottle after the splash animation ends.
   */
  hideAfterSplash() {
    setTimeout(() => {
      clearInterval(this.splashInterval);
      this.visible = false;
    }, 1000);
  }
}
