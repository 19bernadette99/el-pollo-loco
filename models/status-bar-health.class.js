class StatusBar extends DrawableObject {
  IMAGES = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
  ];

  /**
   * Initializes the health status bar at full (100%).
   */
  constructor(initialPercentage = 100) {
    super();
    this.x = 40;
    this.y = 0;
    this.width = 200;
    this.height = 50;

    this.loadImages(this.IMAGES);
    this.setPercentage(initialPercentage);
  }
  /**
   * Sets the health percentage and updates the status bar image.
   * @param {number} percentage - Current health value (0–100).
   */
  setPercentage(percentage) {
    this.percentage = Math.max(0, Math.min(100, Math.round(percentage)));
    const path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves the correct image index based on current percentage.
   * @returns {number} Index in the IMAGES array.
   */
  resolveImageIndex() {
    if (this.percentage === 100) {
      return 5;
    } else if (this.percentage >= 80) {
      return 4;
    } else if (this.percentage >= 60) {
      return 3;
    } else if (this.percentage >= 40) {
      return 2;
    } else if (this.percentage >= 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
