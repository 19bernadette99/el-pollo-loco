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

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround()) { 
      this.y -= this.speedY;
      this.speedY -= this.acceleration; 
}
    }, 1000 / 25);
  }// Used for gravity in character class


  isAboveGround() {
    return this.y < 140;
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
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
    console.log("Move right");
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}
