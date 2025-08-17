let canvas;
let world;

/**
 * Initializes the game world by connecting the canvas and keyboard,
 * and loading the current level into the world.
 */
function init() {
  canvas = document.getElementById("canvas");
  const keyboard = new keyboard();
  const levelTemplate = levels[currentLevelIndex];
  const freshLevel = createLevel(levelTemplate);
  world = new World(canvas, keyboard, freshLevel);
}

/**
 * Sets up all mobile control buttons.
 */
function setupMobileControls() {
  setupDirectionalControls();
  setupJumpControl();
  setupThrowControl();
}

/**
 * Sets up the left and right movement buttons for mobile control.
 */
function setupDirectionalControls() {
  const btnLeft = document.getElementById("btn-left");
  const btnRight = document.getElementById("btn-right");

  btnLeft.addEventListener("touchstart", () => (keyboard.LEFT = true));
  btnLeft.addEventListener("touchend", () => (keyboard.LEFT = false));

  btnRight.addEventListener("touchstart", () => (keyboard.RIGHT = true));
  btnRight.addEventListener("touchend", () => (keyboard.RIGHT = false));
}

/**
 * Sets up the jump button for mobile control.
 * Triggers both UP and SPACE to ensure compatibility.
 */
function setupJumpControl() {
  const btnJump = document.getElementById("btn-jump");

  btnJump.addEventListener("touchstart", () => {
    keyboard.UP = true;
    keyboard.SPACE = true;
  });

  btnJump.addEventListener("touchend", () => {
    keyboard.UP = false;
    keyboard.SPACE = false;
  });
}

/**
 * Sets up the throw button for mobile control.
 * Activates the 'D' key for bottle throwing.
 */
function setupThrowControl() {
  const btnThrow = document.getElementById("btn-throw");

  btnThrow.addEventListener("touchstart", () => (keyboard.D = true));
  btnThrow.addEventListener("touchend", () => (keyboard.D = false));
}

/**
 * Event listener for keydown events. Updates the keyboard object
 * to reflect which keys are currently pressed.
 */
document.addEventListener("keydown", (e) => {
  if ([32, 37, 38, 39, 40].includes(e.keyCode)) e.preventDefault();
  document.activeElement?.blur();
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
  if ([32, 37, 38, 39, 40].includes(e.keyCode)) e.preventDefault();
  document.activeElement?.blur();
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

/** Global overlay flag; set true while any overlay is open. */
let overlayOpen = false;

/** Block all keyboard input while an overlay is open. Call once. */
function initOverlayKeyBlocker() {
  const block = (e) => {
    if (!overlayOpen) return;
    e.preventDefault();
    e.stopImmediatePropagation(); 
    e.stopPropagation();         
    return false;
  };
  window.addEventListener('keydown',  block, true);
  window.addEventListener('keyup',    block, true);
  window.addEventListener('keypress', block, true);
}

window.addEventListener('DOMContentLoaded', initOverlayKeyBlocker);
