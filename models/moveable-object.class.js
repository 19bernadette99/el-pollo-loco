class MoveableObject {
  x = 120;
  y = 280;
  img;
  height = 150;
  width = 100;
  imageCache = [];
  currentImage = 0;
  speed = 0.15;
  otherDirection = false; // Used for animations
  speedY = 0;
  acceleration = 2.5;
  energy = 100;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  } // Used for gravity in character class

  isAboveGround() {
    return this.y < 150;
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken) {
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  isColliding(mo) {
    return (
      this.x + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x + mo.width &&
      this.y < mo.y + mo.height
    );
  }

  // isColliding(mo) {
  //   return (
  //     this.x + this.width - this.offset.right > mo.x + mo.offset.left && // R -> L
  //     this.y + this.height - this.offset.bottom > mo.y + mo.offset.top && // T -> B
  //     this.x + this.offset.left < mo.x + mo.width - mo.offset.right && // L -> R
  //     this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
  //   ); // B -> T
  // }

  // offset = {
  //   top: 20,
  //   bottom: 30,
  //   left: 10,
  //   right: 10,
  // };

  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    }
    console.log("Hit! Energy left:", this.energy);
  }

  isDead() {
    return this.energy == 0;
  }

  // @param {Array} arr - {img/image1.png, img/image2.png}

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  playAnimation(images) {
    let i = this.currentImage % this.IMAGES_WALKING.length;
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
