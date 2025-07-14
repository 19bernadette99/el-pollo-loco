window.addEventListener("DOMContentLoaded", () => {
  initOverlays();
  initStartGame();
});

/**
 * Sets up all overlay toggle functionality.
 */
function initOverlays() {
  setupOverlay("openStoryBtn", "OverlayStory", "closeStoryBtn");
  setupOverlay("openControlsBtn", "OverlayControls", "closeControlsBtn");
  setupOverlay("toggleSoundBtn", "OverlaySound", "closeSoundBtn");
  setupOverlay("openImpressumBtn", "OverlayImpressum", "closeImpressumBtn");
  setupOverlay(null, "gameOverOverlay", "closeGameOverOverlayBtn");
}

/**
 * Prepares the start game button and listener.
 */
function initStartGame() {
  document
    .getElementById("startGameBtn")
    .addEventListener("click", startGameSequence);
}

/**
 * Starts the game and shows canvas.
 */
function startGame() {
  // hide("loadingScreen"); // Loading screen is disabled
  show("canvasWrapper");
  // resetProgressBar(); // Loading screen is disabled
  init(); // your game init function
}

let gameStarted = false; // Flag to track game start

/**
 * Starts game flow: hide screen, show loading, start after delay.
 */
function startGameSequence() {
  if (gameStarted) return;
  gameStarted = true;

  hide("startScreenWrapper");
  // show("loadingScreen"); // Loading screen is disabled
  // fillProgressBar(); // Loading screen is disabled

  // setTimeout(startGame, 5000); // Delay disabled
  startGame(); // Start game immediately
}

/**
 * Shows an overlay element.
 * @param {string} id - The element ID to show.
 */
function show(id) {
  document.getElementById(id).classList.remove("hidden");
}

/**
 * Hides an overlay element.
 * @param {string} id - The element ID to hide.
 */
function hide(id) {
  document.getElementById(id).classList.add("hidden");
}

/**
 * Animates the loading progress bar.
 */
// function fillProgressBar() {
//   const bar = document.querySelector(".progress-fill");
//   void bar.offsetWidth; // force reflow
//   bar.style.width = "100%";
// }

/**
 * Resets progress bar width after loading.
 */
// function resetProgressBar() {
//   document.querySelector(".progress-fill").style.width = "0%";
// }

/**
 * Attaches toggle logic for an overlay.
 * @param {string} openId - Button that opens the overlay.
 * @param {string} overlayId - Overlay element ID.
 * @param {string} closeId - Button that closes the overlay.
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
 * Shows one overlay and hides others.
 * @param {HTMLElement} overlay
 */
function showOverlay(overlay) {
  closeAllOverlays();
  overlay.classList.remove("hidden");
}

/**
 * Hides the given overlay.
 * @param {HTMLElement} overlay
 */
function hideOverlay(overlay) {
  overlay.classList.add("hidden");
}

/**
 * Closes overlay when clicking outside of it.
 * @param {HTMLElement} overlay
 * @param {HTMLElement} trigger
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
 * Hides all overlays.
 */
function closeAllOverlays() {
  const overlays = document.querySelectorAll(
    "#OverlayStory, #OverlayControls, #OverlaySound, #OverlayImpressum"
  );
  overlays.forEach((overlay) => overlay.classList.add("hidden"));
}
