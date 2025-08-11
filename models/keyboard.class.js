/**
 * Tracks the current state of keyboard inputs.
 */
class Keyboard {
  LEFT = false;
  RIGHT = false;
  UP = false;
  DOWN = false;
  SPACE = false;
  D = false;

  /**
   * Resets all pressed keys to false.
   */
  reset() {
    this.LEFT = this.RIGHT = this.UP = this.DOWN = false;
    this.SPACE = this.D = false;
  }
}
