class Coin extends MoveableObject {
  height = 100;
  width = 100;
  collected = false;

  itemName = "collectCoin";
  coinInterval;

  offset = {
    top: 35,
    right: 35,
    bottom: 35,
    left: 35,
  };

  COIN_ANIMATION = [
    "img/8_coin/coin_1.png",
    "img/8_coin/coin_1.png",
    "img/8_coin/coin_1.png",
    "img/8_coin/coin_1.png",
    "img/8_coin/coin_1.png",
    "img/8_coin/coin_1.png",
    "img/8_coin/coin_1.png",
    "img/8_coin/coin_2.png",
    "img/8_coin/coin_2.png",
    "img/8_coin/coin_2.png",
    "img/8_coin/coin_2.png",
    "img/8_coin/coin_2.png",
    "img/8_coin/coin_2.png",
    "img/8_coin/coin_2.png",
  ];

  COLLECTED_COIN_ANIMATION = [
    "img/8_coin/coin_collect_2.png",
    "img/8_coin/coin_collect_3.png",
    "img/8_coin/coin_collect_4.png",
    "img/8_coin/coin_collect_5.png",
    "img/8_coin/coin_collect_6.png",
    "img/8_coin/coin_collect_7.png",
  ];

  /**
   * Creates an instance of a coin.
   * Loads animation frames and sets initial position.
   * Starts animation loop.
   *
   * @param {number} x - Initial horizontal position.
   * @param {number} y - Initial vertical position.
   */
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.loadImage(this.COIN_ANIMATION[0]); // initialer Frame
    this.loadImages(this.COIN_ANIMATION);
    this.loadImages(this.COLLECTED_COIN_ANIMATION);
    this.animate();
  }

  /**
   * Runs the coin animation.
   * Plays the spinning animation when not collected,
   * plays the collected animation and triggers upward movement after collection.
   */
  animate() {
    this.coinInterval = setInterval(() => {
      if (typeof gamePaused !== "undefined" && gamePaused) return;

      if (!this.collected) {
        this.playAnimation(this.COIN_ANIMATION);
      } else {
        this.playAnimation(this.COLLECTED_COIN_ANIMATION);
        this.collectMovement();
      }
    }, 30);
  }

  /**
   * Moves the coin upward during the collection animation.
   */
  collectMovement() {
    this.y -= 2;
  }
}
