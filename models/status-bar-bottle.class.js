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
   * Create a bottle status bar with a configurable max.
   */
  constructor(maxBottles = 5, initialCollected = 0) {
    super();
    this.loadImages(this.IMAGES);
    this.x = 40;
    this.y = 40;
    this.width = 200;
    this.height = 50;
    this.setMaxBottles(maxBottles);
    this.setCollected(initialCollected);
  }

  /**
   * Update the maximum number of bottles for this level.
   */
  setMaxBottles(max) {
    const safe = Math.max(1, Math.floor(max || 0));
    this.maxBottles = safe;
  }

  /**
   * Update the collected number and refresh the bar image.
   * Clamps between 0 and maxBottles.
   */
  setCollected(amount) {
    const clamped = Math.max(0, Math.min(this.maxBottles, Math.floor(amount || 0)));
    this.collected = clamped;
    const idx = this.resolveStepIndexByCount(this.collected, this.maxBottles);
    const path = this.IMAGES[idx];
    this.img = this.imageCache[path];
  }

  /**
   * Resolve which of the 6 images to show based on count and max.
   * Uses 6 discrete steps: 0..5 = 0%,20%,40%,60%,80%,100%.
   */
  resolveStepIndexByCount(count, max) {
    return Math.max(0, Math.min(5, Math.floor((count * 5) / Math.max(1, max))));
  }
}
