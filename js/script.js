window.gamePaused = false;

/**
 * Main game loop using requestAnimationFrame.
 */
function gameLoop() {
  if (!gamePaused && world) {
    world.update?.();
    world.draw?.();

    checkAndSwitchLevel(world);
  }

  animationFrameId = requestAnimationFrame(gameLoop);
}

/**
 * Initializes the game world and starts the loop.
 */
function init() {
  const canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard, levels[0]);
  resizeCanvasToWrapper();
  gameLoop();
}

/**
 * Stops the game and returns to the start screen.
 */
function stopGameAndReturnToStart() {
  gamePaused = true;
  gameStarted = false;
  if (world?.stop) world.stop();
  cancelAnimationFrame(animationFrameId);
  clearAllIntervals();
  clearAllTimeouts();

  showStartScreen();
  hide("canvas");
  hide("backToStartBtn");
  document.querySelector("#mobile-controls")?.classList.remove("visible");
  resetWorldState();
}

/**
 * Resets global variables to initial state.
 */
function resetWorldState() {
  world = null;
  keyboard = null;
  currentLevelIndex = 0;
}

/**
 * Clears all active intervals.
 */
function clearAllIntervals() {
  for (let i = 1; i < 99999; i++) {
    clearInterval(i);
  }
}

/**
 * Clears all active timeouts.
 */
function clearAllTimeouts() {
  for (let i = 1; i < 99999; i++) {
    clearTimeout(i);
  }
}

/**
 * Resizes canvas to match wrapper dimensions.
 */
function resizeCanvasToWrapper() {
  const canvas = document.querySelector("canvas");
  const wrapper = document.getElementById("canvasWrapper");
  const rect = wrapper.getBoundingClientRect();
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";
  canvas.width = rect.width;
  canvas.height = rect.height;
}

/**
 * Adds click listener to the back-to-start button.
 */
window.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("backToStartBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      stopGameAndReturnToStart();
    });
  }
});
