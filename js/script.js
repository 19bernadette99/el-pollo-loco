/**
 * Initializes overlays and game start logic once the DOM is fully loaded.
 */
window.addEventListener("DOMContentLoaded", () => {
  initOverlays();
  initStartGame();
  initMobileButtons();
});

/**
 * Sets up all overlay toggle functionality with their respective open and close buttons.
 */
function initOverlays() {
  setupOverlay("openStoryBtn", "OverlayStory", "closeStoryBtn");
  setupOverlay("openControlsBtn", "OverlayControls", "closeControlsBtn");
  setupOverlay("toggleSoundBtn", "OverlaySound", "closeSoundBtn");
  setupOverlay("openImpressumBtn", "OverlayImpressum", "closeImpressumBtn");
  setupOverlay(null, "gameOverOverlay", "closeGameOverOverlayBtn");
  setupOverlay(null, "levelUpOverlay", "nextLevelBtn");
}

/**
 * Prepares the "Start Game" button with an event listener to start the game sequence.
 */
function initStartGame() {
  document
    .getElementById("startGameBtn")
    .addEventListener("click", startGameSequence);
}

/**
 * Starts the game by showing the canvas and calling the main game initialization function.
 */
function startGame() {
  // hide("loadingScreen");
  document.getElementById("canvas").classList.remove("hidden");

  // resetProgressBar();
  init(); // your game init function
}

/**
 * Tracks whether the game has already started.
 * Prevents multiple initializations.
 *
 * @type {boolean}
 */
let gameStarted = false;

/**
 * Starts the full game sequence: hides the start screen, shows loading (optional),
 * and initializes the game after a delay (optional).
 */
function startGameSequence() {
  if (gameStarted) return;
  gameStarted = true;

  hide("startScreenWrapper");
  // show("loadingScreen");
  // fillProgressBar();

  // setTimeout(startGame, 5000);
  startGame(); // Start game immediately
}

/**
 * Shows an overlay element by removing the "hidden" class.
 *
 * @param {string} id - The ID of the HTML element to show.
 */
function show(id) {
  document.getElementById(id).classList.remove("hidden");
}

/**
 * Hides an overlay element by adding the "hidden" class.
 *
 * @param {string} id - The ID of the HTML element to hide.
 */
function hide(id) {
  document.getElementById(id).classList.add("hidden");
}

/**
 * Animates the loading progress bar by filling it.
 */
// function fillProgressBar() {
//   const bar = document.querySelector(".progress-fill");
//   void bar.offsetWidth; // force reflow
//   bar.style.width = "100%";
// }

/**
 * Resets the loading progress bar back to 0% width.
 */
// function resetProgressBar() {
//   document.querySelector(".progress-fill").style.width = "0%";
// }

/**
 * Sets up toggle logic for showing and hiding a specific overlay.
 *
 * @param {string|null} openId - ID of the button that opens the overlay. Pass null if not needed.
 * @param {string} overlayId - ID of the overlay element.
 * @param {string} closeId - ID of the button that closes the overlay.
 */
function setupOverlay(openId, overlayId, closeId) {
  const overlay = document.getElementById(overlayId);
  const closeBtn = document.getElementById(closeId);

  if (openId) {
    const openBtn = document.getElementById(openId);
    openBtn.addEventListener("click", () => showOverlay(overlay));
    closeOnOutsideClick(overlay, openBtn);
  } else {
    closeOnOutsideClick(overlay, null);
  }

  closeBtn.addEventListener("click", () => {
    hideOverlay(overlay);

    if (overlay.id === "gameOverOverlay") {
      hide("canvasWrapper");
      show("startScreenWrapper");
      gameStarted = false;
    }
  });
}

/**
 * Callback function to execute after level-up overlay is closed.
 *
 * @type {Function|null}
 */
let nextLevelCallback = null;

/**
 * Displays the level-up overlay and stores a callback to be triggered on "Next Level".
 *
 * @param {Function} callback - Function to be called after proceeding to the next level.
 */
function showLevelUpOverlay(callback) {
  nextLevelCallback = callback;
  show("levelUpOverlay");
}

/**
 * Continues to the next level after level-up overlay is closed.
 */
function continueToNextLevel() {
  hide("levelUpOverlay");
  if (typeof nextLevelCallback === "function") {
    nextLevelCallback();
    nextLevelCallback = null;
  }
}

// Set up the "Next Level" button if it exists
document
  .getElementById("nextLevelBtn")
  ?.addEventListener("click", continueToNextLevel);

/**
 * Shows one overlay and hides all others first.
 *
 * @param {HTMLElement} overlay - The overlay element to show.
 */
function showOverlay(overlay) {
  closeAllOverlays();
  overlay.classList.remove("hidden");
}

/**
 * Hides a specific overlay.
 *
 * @param {HTMLElement} overlay - The overlay element to hide.
 */
function hideOverlay(overlay) {
  overlay.classList.add("hidden");
}

/**
 * Adds logic to close an overlay when the user clicks outside of it.
 *
 * @param {HTMLElement} overlay - The overlay to monitor for outside clicks.
 * @param {HTMLElement|null} trigger - The button that triggered the overlay (to avoid closing on that click).
 */
function closeOnOutsideClick(overlay, trigger) {
  document.addEventListener("click", (e) => {
    if (
      !overlay.classList.contains("hidden") &&
      !overlay.contains(e.target) &&
      (trigger === null || e.target !== trigger)
    ) {
      hideOverlay(overlay);

      if (overlay.id === "gameOverOverlay") {
        hide("canvasWrapper");
        show("startScreenWrapper");
        gameStarted = false;
      }
    }
  });
}

/**
 * Hides all currently visible overlays (except special ones).
 */
function closeAllOverlays() {
  const overlays = document.querySelectorAll(
    "#OverlayStory, #OverlayControls, #OverlaySound, #OverlayImpressum"
  );
  overlays.forEach((overlay) => overlay.classList.add("hidden"));
}

/**
 * Starts a specific level by index.
 *
 * @param {number} levelIndex - The index of the level in the levels array.
 */
function startLevel(levelIndex) {
  const canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard, levels[levelIndex]);
}

/**
 * Adds event listeners for mobile action bar buttons to trigger the same logic as desktop buttons.
 */
function initMobileButtons() {
  document
    .getElementById("mobileStartBtn")
    ?.addEventListener("click", startGameSequence);
  document.getElementById("mobileStoryBtn")?.addEventListener("click", () => {
    showOverlay(document.getElementById("OverlayStory"));
  });
  document
    .getElementById("mobileControlsBtn")
    ?.addEventListener("click", () => {
      showOverlay(document.getElementById("OverlayControls"));
    });
  document.getElementById("mobileSoundBtn")?.addEventListener("click", () => {
    showOverlay(document.getElementById("OverlaySound"));
  });
  document
    .getElementById("mobileImpressumBtn")
    ?.addEventListener("click", () => {
      showOverlay(document.getElementById("OverlayImpressum"));
    });
  document
    .getElementById("mobileFullscreenBtn")
    ?.addEventListener("click", toggleFullscreen);
}
