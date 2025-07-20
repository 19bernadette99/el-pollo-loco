let canvas;
let world;
let keyboard = new Keyboard();

/**
 * Initializes the game world by connecting the canvas and keyboard,
 * and loading the current level into the world.
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  world.setLevel(levels[currentLevelIndex]);

  console.log("My Character is", world.character);
}

/**
 * Event listener for keydown events. Updates the keyboard object
 * to reflect which keys are currently pressed.
 *
 * @param {KeyboardEvent} e - The keyboard event triggered by user input.
 */
document.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }

  if (e.keyCode == 38) {
    keyboard.UP = true;
  }

  if (e.keyCode == 40) {
    keyboard.DOWN = true;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }

  if (e.keyCode == 68) {
    keyboard.D = true;
  }
});

/**
 * Event listener for keyup events. Updates the keyboard object
 * to reflect which keys have been released.
 *
 * @param {KeyboardEvent} e - The keyboard event triggered by user input.
 */
document.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }

  if (e.keyCode == 38) {
    keyboard.UP = false;
  }

  if (e.keyCode == 40) {
    keyboard.DOWN = false;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }

  if (e.keyCode == 68) {
    keyboard.D = false;
  }
});
