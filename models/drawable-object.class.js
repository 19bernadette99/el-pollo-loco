class DrawableObject {
  img;
  imageCache = [];
  currentImage = 0;
  x = 120;
  y = 280;
  height = 150;
  width = 100;

  /**
   * Loads a single image from the given path.
   * @param {string} path - Path to the image file.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the current image on the canvas if visible.
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   */
  draw(ctx) {
    if (this.visible === false) return;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  // drawFrame(ctx) {
  //   if (this instanceof Character || this instanceof Chicken) {
  //     ctx.beginPath();
  //     ctx.lineWidth = 5;
  //     ctx.strokeStyle = "blue";
  //     ctx.rect(this.x, this.y, this.width, this.height);
  //     ctx.stroke();
  //   }
  // }

  /**
   * Loads multiple images and stores them in the cache.
   * @param {Array<string>} arr - Array of image paths.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Animates an object through given image paths.
   * @param {Array<string>} images - Array of image paths.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }
}
