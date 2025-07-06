class Cloud extends MoveableObject {
  width = 500;
  height = 250;

  constructor(existingClouds = []) {
    super().loadImage("img/5_background/layers/4_clouds/1.png");

    const cloudHeights = [10, 30, 50];

    this.y = this.calculateYPosition(existingClouds, cloudHeights);
    this.x = this.calculateXPosition(existingClouds);

    this.animate();
  }

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
