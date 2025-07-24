/**
 * Initializes overlays and game start logic once the DOM is fully loaded.
 */
window.addEventListener("DOMContentLoaded", () => {
  initOverlays();
  initStartGame();
  document
    .getElementById("mobileStartBtn")
    ?.addEventListener("click", startGameSequence);
  document
    .getElementById("mobileFullscreenBtn")
    ?.addEventListener("click", toggleFullscreen);
  checkOrientationAndToggleOverlay();
  window.addEventListener("resize", checkOrientationAndToggleOverlay);
  window.addEventListener(
    "orientationchange",
    checkOrientationAndToggleOverlay
  );
});

/**
 * Allows user to confirm the orientation and enters fullscreen mode.
 */
document
  .getElementById("rotateConfirmBtn")
  ?.addEventListener("click", async () => {
    document.getElementById("rotateOverlay").classList.add("hidden");

    // Try to enter fullscreen after user interaction
    const el = document.documentElement;
    if (el.requestFullscreen) {
      try {
        await el.requestFullscreen();
      } catch (err) {
        console.warn("Fullscreen failed:", err);
      }
    }
  });

/**
 * Sets up all overlay toggle functionality with their respective open and close buttons.
 */
function initOverlays() {
  setupOverlay(
    ["openStoryBtn", "mobileStoryBtn"],
    "OverlayStory",
    "closeStoryBtn"
  );
  setupOverlay(
    ["openControlsBtn", "mobileControlsBtn"],
    "OverlayControls",
    "closeControlsBtn"
  );
  setupOverlay(
    ["toggleSoundBtn", "mobileSoundBtn"],
    "OverlaySound",
    "closeSoundBtn"
  );
  setupOverlay(
    ["openImpressumBtn", "mobileImpressumBtn"],
    "OverlayImpressum",
    "closeImpressumBtn"
  );

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
  backgroundMusic.play();
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
  if (window.innerWidth <= 1050) {
    document.querySelector(".mobile-action-bar")?.classList.add("visible");
    document.querySelector("#mobile-controls")?.classList.add("visible");
  }
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
 * Adds a slight delay before enabling outside click to close the overlay.
 * This prevents immediate closure due to event bubbling.
 * @param {HTMLElement} overlay - The overlay element.
 * @param {HTMLElement} trigger - The button that triggered the overlay.
 */
function delayedCloseOnOutsideClick(overlay, trigger) {
  setTimeout(() => {
    closeOnOutsideClick(overlay, trigger);
  }, 100);
}

/**
 * Adds click listeners to one or more buttons to open the overlay.
 * @param {string[]|string|null} ids - One or more IDs of open buttons.
 * @param {HTMLElement} overlay - The overlay element to be shown.
 */
function addOpenButtonListeners(ids, overlay) {
  if (!ids) return;

  const buttonIds = Array.isArray(ids) ? ids : [ids];

  buttonIds.forEach((id) => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener("click", () => {
        showOverlay(overlay);
        delayedCloseOnOutsideClick(overlay, button);
      });
    }
  });
}

/**
 * Adds a click listener to the close button to hide the overlay.
 * Includes custom logic for the game over overlay.
 * @param {HTMLElement} overlay - The overlay element to be closed.
 * @param {string} closeId - The ID of the close button.
 */
function attachCloseButtonListener(overlay, closeId) {
  const closeBtn = document.getElementById(closeId);
  if (!closeBtn) return;

  closeBtn.addEventListener("click", () => {
    hideOverlay(overlay);

    // Special logic for game over overlay
    if (overlay.id === "gameOverOverlay") {
      hide("canvasWrapper");
      show("startScreenWrapper");
      gameStarted = false;
    }
  });
}

/**
 * Main function to wire up an overlay's open and close logic.
 * @param {string[]|string|null} openIds - Button(s) that open the overlay.
 * @param {string} overlayId - ID of the overlay element.
 * @param {string} closeId - ID of the close button.
 */
function setupOverlay(openIds, overlayId, closeId) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;

  addOpenButtonListeners(openIds, overlay);
  attachCloseButtonListener(overlay, closeId);

  // If no open buttons are specified, allow outside click to close
  if (!openIds) {
    closeOnOutsideClick(overlay, null);
  }
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

function checkOrientationAndToggleOverlay() {
  const overlay = document.getElementById("rotateOverlay");
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  const isMobile = window.innerWidth <= 1060;

  if (isMobile && isPortrait) {
    overlay.classList.remove("hidden");
  } else {
    overlay.classList.add("hidden");
  }
}

function resizeCanvasToWrapper() {
  const canvas = document.querySelector("canvas");
  const wrapper = document.getElementById("canvasWrapper");
  const rect = wrapper.getBoundingClientRect();

  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";
  canvas.width = rect.width;
  canvas.height = rect.height;
}

const menuToggle = document.getElementById("mobileMenuToggle");
const mobileMenu = document.querySelector(".mobile-menu");
const menuButtons = mobileMenu.querySelectorAll("button");

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("visible");
});

menuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    mobileMenu.classList.remove("visible");
  });
});
