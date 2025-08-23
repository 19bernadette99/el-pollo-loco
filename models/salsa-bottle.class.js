class SalsaBottle extends MoveableObject {
  IMAGES = [
    'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
  ];

  constructor(x, y) {
    super();
    this.loadImages(this.IMAGES);
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 60;
    this.setRandomImage();
    this.offset = { left: 8, right: 8, top: 6, bottom: 6 };
  }

  /**
   * Picks randomly one of the two bottle images
   */
  setRandomImage() {
    let index = Math.floor(Math.random() * this.IMAGES.length);
    this.loadImage(this.IMAGES[index]);
  }
}
