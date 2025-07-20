/**
 * An array containing all game levels in sequential order.
 * Each level is assumed to be a predefined object (e.g. level1, level2, etc.).
 * 
 * @type {Array<Object>}
 */
const levels = [
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
  level11,
  level12,
  level13,
  level14,
  level15
];

/**
 * Index of the currently active level within the `levels` array.
 * 
 * @type {number}
 */
let currentLevelIndex = 0;

/**
 * Checks if the current level is completed and switches to the next level if available.
 * If the last level is completed, the game shows a "Game Finished" overlay.
 *
 * @param {World} world - The current game world instance containing the active level.
 */
function checkAndSwitchLevel(world) {
  const level = world.level;
  if (level.checkLevelCompletion()) {
    showLevelUpOverlay(() => {
      currentLevelIndex++;
      if (currentLevelIndex < levels.length) {
        world.setLevel(levels[currentLevelIndex]);
      } else {
        console.log("🎉 Game finished! No more levels.");
        showGameFinishedOverlay();
      }
    });
  }
}
