class MoveableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    return this.y < 150;
  }



  isColliding(mo) {
    return (
      this.x + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x + mo.width &&
      this.y < mo.y + mo.height
    );
  }

  hit() {
    this.energy -= 5;

    if (this.energy <= 0) {
      this.energy = 0;
      this.isBeingHit = true;
      this.hasDied = true;
    }

    this.lastHit = new Date().getTime();

    console.trace("Current energy:", this.energy);
  }

  isHurt() {
    if (!this.lastHit) return false;

    let timepassed = new Date().getTime() - this.lastHit;
    return timepassed < 1000 / 1;
  }

  isDead() {
    return this.energy == 0;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    // let i = 7 % 6; => 1, Rest 1
    // i = 0, 1, 2, 3, 4, 5, 0, 1, 2, ...
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 30;
  }
}
