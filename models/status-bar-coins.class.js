class StatusBarCoin extends DrawableObject {
  IMAGES = [
    'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
  ];

  collected = 0;
  maxCoins = 10;

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setCollected(0);
  }

  setCollected(amount) {
    this.collected = amount;
    const percentage = this.getPercentage();
    const path = this.IMAGES[this.resolveImageIndex(percentage)];
    this.x = 40;
    this.y = 100;
    this.width = 200;
    this.height = 60;
    this.img = this.imageCache[path];
  }

  getPercentage() {
    return Math.min((this.collected / this.maxCoins) * 100, 100);
  }

  resolveImageIndex(percentage) {
    if (percentage === 100) return 5;
    if (percentage >= 80) return 4;
    if (percentage >= 60) return 3;
    if (percentage >= 40) return 2;
    if (percentage >= 20) return 1;
    return 0;
  }
}
