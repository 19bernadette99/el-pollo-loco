class MoveableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;

  /**
   * Applies gravity effect to the object over time.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the object is above ground level.
   * @returns {boolean}
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 210;
    }
  }

  /**
   * Checks for collision with another moveable object.
   * @param {MoveableObject} mo - Another object to check against.
   * @returns {boolean}
   */
  isColliding(mo) {
    return (
      this.x + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x + mo.width &&
      this.y < mo.y + mo.height
    );
  }

  hit() {
    let now = Date.now();
    let timeSinceLastHit = now - (this.lastHit || 0);

    if (this.energy > 0 && timeSinceLastHit > 1000 && !this.hasDied) {
      this.energy = Math.max(this.energy - 20, 0);
      console.log("Energy after hit:", this.energy);

      this.world.statusBar.setPercentage(this.energy);
      this.lastHit = now;
      this.playHurtSound();
    }
  }

  isHurt() {
    let timePassed = Date.now() - this.lastHit;
    return timePassed < 1000;
  }

  /**
   * Returns whether the object has no energy left.
   * @returns {boolean}
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Plays the next frame in an animation loop.
   * @param {Array<string>} images - Array of image paths.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    // let i = 7 % 6; => 1, Rest 1
    // i = 0, 1, 2, 3, 4, 5, 0, 1, 2, ...
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Moves the object to the right.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Makes the object jump upward.
   */
  jump() {
    this.speedY = 30;
  }
}
