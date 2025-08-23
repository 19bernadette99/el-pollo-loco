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

  breakingBottleSound = new Audio("audio/breakingBottle.mp3");

  hasSplashed = false;

  /**
   * Creates and throws a new salsa bottle in the given direction.
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
    this.breakingBottleSound.preload = "auto";
    this.breakingBottleSound.load();
    this.visible = true;
    this.throw();
  }

  /**
   * Starts bottle movement, gravity, and ground check.
   */
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
   * Returns true if the bottle is touching the ground line.
   */
  isOnGround(groundY = 350) {
    return this.y >= groundY;
  }

/**
 * Called when the bottle hits the Endboss.
 * Triggers splash visuals WITHOUT sound.
 */
onEndbossHit() {
  if (this.hasSplashed) return;
  this.splash(true); // mute sound on boss hit
}

/**
 * Called when the bottle hits a chicken (or any enemy).
 * Stops flight and triggers splash animation WITHOUT sound.
 * @param {MoveableObject} enemy - The enemy that was hit.
 */
onChickenHit(enemy) {
  if (this.hasSplashed) return;
  // keep a nice visual contact point, but silence the sound
  this.y = Math.min(this.y, enemy.y + enemy.height - this.height / 2);
  this.splash(true); // mute sound on enemy hit
}

/**
 * Handles bottle splash: stops movement, shows frames,
 * and optionally plays sound ONLY on real ground contact.
 */
splash(mute = false) {
  if (this.hasSplashed) return;
  this.hasSplashed = true;
  this.stopThrow();
  this.prepareSplashAnimation();
  if (
    !mute &&
    this.isOnGround(350) &&
    (typeof soundEnabled === "undefined" || soundEnabled)
  ) {
    try {
      const s = this.breakingBottleSound.cloneNode();
      s.volume = 0.5;
      s.currentTime = 0;
      s.play().catch(() => {});
    } catch {}
  }
  this.startSplashAnimation();
  this.hideAfterSplash();
}

  /**
   * Stops bottle movement and animations.
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
