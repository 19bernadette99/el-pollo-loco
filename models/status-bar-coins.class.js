class StatusBarCoin extends DrawableObject {
  IMAGES = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];

  collected = 0;
  maxCoins = 10;

  constructor(maxCoins) {
    super();
    this.maxCoins = maxCoins;
    this.loadImages(this.IMAGES);
    this.setCollected(0);
  }

  setCollected(amount) {
    this.collected = amount;
    const path = this.IMAGES[this.resolveImageIndex(this.collected)];
    this.x = 40;
    this.y = 80;
    this.width = 200;
    this.height = 50;
    this.img = this.imageCache[path];
  }

  resolveImageIndex(collected) {
    let maxImages = this.IMAGES.length - 1;

    if (collected >= this.maxCoins) return maxImages;

    let ratio = collected / this.maxCoins;
    let index = Math.ceil(ratio * maxImages);

    if (index < 0) index = 0;
    return index;
  }
}
