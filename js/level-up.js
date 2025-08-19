/** Build all levels from config. */
const levels = levelConfigs.map((c) => generateLevel(c));

/** Health carried across level switches (default 100). */
window.carriedHealth ??= 100;

/** Index of the currently active level in `levels`. */
let currentLevelIndex = 0;

/** Convenience pointer to the current level. */
let currentLevel = levels[currentLevelIndex];

/** True while a level transition is running. */
let levelTransitionInProgress = false;

/** Clamp health to [0,100] without upward rounding. */
const clampHealth = (v) => Math.max(0, Math.min(100, Math.floor(v)));

/**
 * Decide if a level switch should occur now.
 */
function shouldSwitch(level) {
  return !levelTransitionInProgress && level?.checkLevelCompletion?.();
}

/**
 * Read current health from world (character preferred).
 */
function readCurrentHealth(world) {
  return (
    world?.character?.energy ??
    world?.statusBar?.percentage ??
    world?.statusBarHealth?.percentage ??
    null
  );
}

/**
 * Update global carried health from world state.
 */
function updateCarriedHealth(world) {
  const h = readCurrentHealth(world);
  if (typeof h === "number") window.carriedHealth = clampHealth(h);
}

function areAllBossesDone(level) {
  const bosses = level.enemies.filter(e => e instanceof Endboss);
  return bosses.length > 0 && bosses.every(b => b.deathComplete);
}

/**
 * Advance level index and continue or finish.
 */
function proceedAfterOverlay() {
  currentLevelIndex++;
  if (currentLevelIndex < levels.length) {
    initNewLevel(currentLevelIndex);
    levelTransitionInProgress = false;
  } else {
    showGameFinishedOverlay();
  }
}

/**
 * Check completion and trigger level switch overlay.
 */
function checkAndSwitchLevel(world) {
  if (levelTransitionInProgress) return;
  if (!world?.level) return;

  if (areAllBossesDone(world.level)) {
    levelTransitionInProgress = true;
    showLevelUpOverlay(); // hier erst auslösen
  }
}

/**
 * Initialize a new World for the given level index.
 */
function initNewLevel(index) {
  const canvas = document.getElementById("canvas");
  keyboard?.reset?.();
  world = new World(canvas, keyboard, levels[index], {
    initialHealth: window.carriedHealth,
  });
  currentLevel = levels[index];
  gamePaused = false;
  gameStarted = true;
  stopGameLoop();
  startGameLoop();
}
