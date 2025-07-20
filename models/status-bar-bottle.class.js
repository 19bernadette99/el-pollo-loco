class StatusBarBottle extends DrawableObject {
  IMAGES = [
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
  ];

  collected = 0;
  maxBottles = 5;

  /**
   * Initializes the bottle status bar with default values and images.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setCollected(0);
  }

  /**
   * Updates the collected bottle count and changes the image accordingly.
   * @param {number} amount - The number of collected bottles.
   */
  setCollected(amount) {
    this.collected = amount;
    const percentage = this.getPercentage();
    const path = this.IMAGES[this.resolveImageIndex(percentage)];
    this.x = 40;
    this.y = 40;
    this.width = 200;
    this.height = 50;
    this.img = this.imageCache[path];
  }

  /**
   * Calculates the current percentage of bottles collected.
   * @returns {number} Percentage (0–100)
   */
  getPercentage() {
    return Math.min((this.collected / this.maxBottles) * 100, 100);
  }

  /**
   * Resolves which image index to use based on the percentage.
   * @param {number} percentage - Collected percentage.
   * @returns {number} Index in the IMAGES array.
   */
  resolveImageIndex(percentage) {
    if (percentage === 100) return 5;
    if (percentage >= 80) return 4;
    if (percentage >= 60) return 3;
    if (percentage >= 40) return 2;
    if (percentage >= 20) return 1;
    return 0;
  }
}
