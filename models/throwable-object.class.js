class ThrowableObject extends MoveableObject {
  constructor(x, y, otherDirection) {
    super();
    this.loadImage("img/6_salsa_bottle/salsa_bottle.png");
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 70;
    this.otherDirection = otherDirection;
    this.throw();
  }

  throw() {
    this.speedY = 25;
    this.applyGravity();
    this.throwInterval = setInterval(() => {
      if (this.otherDirection) {
        this.x -= 10;
      } else {
        this.x += 10;
      }
    }, 25);
  }
}
