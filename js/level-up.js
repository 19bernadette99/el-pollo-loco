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
function checkAndSwitchLevel(world) {
  const level = world.level;

  if (level.checkLevelCompletion()) {
    showLevelUpOverlay(() => {
      currentLevelIndex++;

      if (currentLevelIndex < levels.length) {
        initNewLevel(currentLevelIndex);
      } else {
        console.log("Game finished! No more levels. :)");
        // TO DO: showGameFinishedOverlay();
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
  const keyboard = new Keyboard();

  world = new World(canvas, keyboard, levels[index]);
}
