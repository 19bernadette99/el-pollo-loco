class Cloud extends MoveableObject {
  width = 500;
  height = 250;

  /**
   * Creates a new cloud with random X and Y position, then starts animation.
   * @param {Array<Cloud>} existingClouds - Other clouds already placed on screen.
   */
  constructor(existingClouds = []) {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    const cloudHeights = [10, 30, 50];
    this.y = this.calculateYPosition(existingClouds, cloudHeights);
    this.x = this.calculateXPosition(existingClouds);
    this.animate();
  }

  /**
   * Chooses a Y position not already used by other clouds if possible.
   * @param {Array<Cloud>} existingClouds
   * @param {number[]} cloudHeights
   * @returns {number} Chosen Y position
   */
  calculateYPosition(existingClouds, cloudHeights) {
    let usedHeights = existingClouds.map((c) => c.y);
    let availableHeights = cloudHeights.filter((h) => !usedHeights.includes(h));
    if (availableHeights.length === 0) {
      return cloudHeights[0];
    }
    return availableHeights[
      Math.floor(Math.random() * availableHeights.length)
    ];
  }

  /**
   * Chooses an X position that doesn't overlap too closely with existing clouds.
   * @param {Array<Cloud>} existingClouds
   * @returns {number} Chosen X position
   */
  calculateXPosition(existingClouds) {
    let minX = 0;
    let maxX = 1500;
    let minDistance = 500;
    let x;
    let tooClose;
    do {
      x = minX + Math.random() * (maxX - minX);
      tooClose = existingClouds.some((c) => Math.abs(c.x - x) < minDistance);
    } while (tooClose && existingClouds.length < 50);
    return x;
  }

  /**
   * Moves the cloud to the left, and resets its position once off screen.
   */
  animate() {
    const cloudHeights = [10, 30, 50];
    setInterval(() => {
      this.moveLeft();
      if (this.x + this.width < 0) {
        this.x = 720 + Math.random() * 500;
        this.y = cloudHeights[Math.floor(Math.random() * cloudHeights.length)];
      }
    }, 1000 / 60);
  }
}
