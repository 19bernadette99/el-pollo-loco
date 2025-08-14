// Generate all levels from config definitions
const levels = levelConfigs.map(config => generateLevel(config));

/**
 * Index of the currently active level within the `levels` array.
 * 
 * @type {number}
 */
let currentLevelIndex = 0;
let currentLevel = levels[currentLevelIndex];

/**
 * Checks if the current level is completed and switches to the next level.
 * If it's the last level, the game shows a "Game Finished" overlay.
 * 
 * @param {World} world - The current game world instance
 */
let levelTransitionInProgress = false;

function checkAndSwitchLevel(world) {
  const level = world.level;

  if (!levelTransitionInProgress && level.checkLevelCompletion()) {
    levelTransitionInProgress = true;

    showLevelUpOverlay(() => {
      currentLevelIndex++;

      if (currentLevelIndex < levels.length) {
        initNewLevel(currentLevelIndex);
        levelTransitionInProgress = false;
      } else {
        showGameFinishedOverlay
      }
    });
  }
}

/**
 * Initializes a new World with the level at the given index.
 * Resets canvas, keyboard, world and character.
 * 
 * @param {number} index - Index of the level to load
 */
function initNewLevel(index) {
  const canvas = document.getElementById("canvas");
  if (keyboard?.reset) keyboard.reset();
  world = new World(canvas, keyboard, levels[index]);
  resizeCanvasToWrapper();
  gamePaused = false;
  gameStarted = true;
  stopGameLoop();
  startGameLoop();
}
