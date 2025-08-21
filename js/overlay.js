window.gamePaused = false;
let resumeTimeout = null;
let countdownElement = null;
let gameStarted = false;
let nextLevelCallback = null;
let animationFrameId = null;
globalThis.isLoadingScreenActive ??= false;
let loopActive = false;

/**
 * Initializes overlays, UI, and listeners after DOM load.
 */
window.addEventListener("DOMContentLoaded", () => {
  initOverlays();
  initStartGame();
  setupFullscreenConfirm();
  setupMobileMenu();
  setupMobileControls();
  checkOrientationAndToggleOverlay();
});

/**
 * Sets up fullscreen request when device is rotated.
 */
function setupFullscreenConfirm() {
  const btn = document.getElementById("rotateConfirmBtn");
  btn?.addEventListener("click", async () => {
    hide("rotateOverlay");
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.warn("Fullscreen failed:", err);
    }
  });
}

/**
 * Prepares the start game button for desktop and mobile.
 */
function initStartGame() {
  const desktopBtn = document.getElementById("startGameBtn");
  const mobileBtn = document.getElementById("mobileStartBtn");
  const handleStart = () => {
    if (musicEnabled) {
      startScreenMusic
        .play()
        .catch((e) => console.warn("Autoplay blocked:", e));
    }
    startGameSequence();
  };
  desktopBtn?.addEventListener("click", handleStart);
  mobileBtn?.addEventListener("click", handleStart);
}

/**
 * Starts game only once, then shows canvas & UI.
 */
function startGameSequence() {
  if (gameStarted) return;
  gameStarted = true;
  hide("startScreenWrapper");
  startGame();
  showMobileUI();
}

/**
 * Shows and animates the loading screen.
 */
function showLoadingScreen(callback) {
  activateLoadingUI();
  runLoadingAnimation();
  setTimeout(() => {
    deactivateLoadingUI();
    callback?.();
  }, 5000);
}

/**
 * Activates loading screen UI and hides controls.
 */
function activateLoadingUI() {
  globalThis.isLoadingScreenActive = true;
  document.getElementById("loadingScreen")?.classList.remove("hidden");
  document.querySelector("#mobile-controls")?.classList.add("hidden");
  document.querySelector(".mobile-action-bar")?.classList.add("hidden");
}

/**
 * Fills the loading bar.
 */
function runLoadingAnimation() {
  resetProgressBar();
  fillProgressBar();
}

/**
 * Deactivates loading screen UI and shows controls.
 */
function deactivateLoadingUI() {
  document.getElementById("loadingScreen")?.classList.add("hidden");
  document.querySelector("#mobile-controls")?.classList.remove("hidden");
  document.querySelector(".mobile-action-bar")?.classList.remove("hidden");
  globalThis.isLoadingScreenActive = false;
}

/**
 * Resets loading bar to 0%.
 */
function resetProgressBar() {
  document.querySelector(".progress-fill").style.width = "0%";
}

/**
 * Animates loading bar to 100%.
 */
function fillProgressBar() {
  const bar = document.querySelector(".progress-fill");
  void bar.offsetWidth;
  bar.style.width = "100%";
}

/**
 * Initializes all overlay configurations.
 */
function initOverlays() {
  getOverlayConfigs().forEach(({ open, id, close }) =>
    setupOverlay(open, id, close)
  );
}

/**
 * Returns all overlay configuration objects.
 */
function getOverlayConfigs() {
  return [
    createOverlayConfig(
      ["openStoryBtn", "mobileStoryBtn"],
      "OverlayStory",
      "closeStoryBtn"
    ),
    createOverlayConfig(
      ["openControlsBtn", "mobileControlsBtn"],
      "OverlayControls",
      "closeControlsBtn"
    ),
    createOverlayConfig(
      ["toggleSoundBtn", "mobileSoundBtn"],
      "OverlaySound",
      "closeSoundBtn"
    ),
    createOverlayConfig(
      ["openImpressumBtn", "mobileImpressumBtn"],
      "OverlayImpressum",
      "closeImpressumBtn"
    ),
    createOverlayConfig(null, "gameOverOverlay", "closeGameOverOverlayBtn"),
    createOverlayConfig(null, "levelUpOverlay", "nextLevelBtn"),
    createOverlayConfig(null, "gameFinishedOverlay", null),
  ];
}

/**
 * Creates a standardized overlay configuration object.
 */
function createOverlayConfig(open, id, close) {
  return { open, id, close };
}

/**
 * Sets up one overlay with open and close logic.
 */
function setupOverlay(openIds, overlayId, closeId) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;
  addOpenButtonListeners(openIds, overlay);
  attachCloseButtonListener(overlay, closeId);
  if (!openIds && overlayId !== "levelUpOverlay") {
    closeOnOutsideClick(overlay, null);
  }
  setupPauseResumeOnOverlay(openIds, overlayId, closeId, overlay);
}

/**
 * Adds click listeners to open buttons for overlays.
 */
function addOpenButtonListeners(ids, overlay) {
  if (!ids) {
    return;
  }
  const btns = Array.isArray(ids) ? ids : [ids];
  btns.forEach((id) => {
    const btn = document.getElementById(id);
    if (!btn) {
    } else {
      btn.addEventListener("click", () => {
        showOverlay(overlay);
        delayedCloseOnOutsideClick(overlay, btn);
      });
    }
  });
}

/**
 * Closes overlay after outside click delay.
 */
function delayedCloseOnOutsideClick(overlay, trigger) {
  setTimeout(() => closeOnOutsideClick(overlay, trigger), 100);
}

/**
 * Registers a document-level click handler to close the given overlay on outside clicks.
 */
function closeOnOutsideClick(overlay, trigger) {
  document.addEventListener("click", (e) =>
    handleDocumentClickForOverlay(e, overlay, trigger)
  );
}

/**
 * Handles the document click and delegates if the overlay should close.
 */
function handleDocumentClickForOverlay(e, overlay, trigger) {
  if (!shouldCloseOverlayOnClick(e, overlay, trigger)) return;
  processOverlayClose(overlay);
}

/**
 * Returns true if the click happened outside the overlay while it is visible.
 */
function shouldCloseOverlayOnClick(e, overlay, trigger) {
  return (
    !overlay.contains(e.target) &&
    !overlay.classList.contains("hidden") &&
    e.target !== trigger
  );
}

/**
 * Closes the overlay and handles special cases and resume logic.
 */
function processOverlayClose(overlay) {
  hideOverlay(overlay);
  if (overlay.id === "gameOverOverlay") {
    hide("canvasWrapper");
    show("startScreenWrapper");
    gameStarted = false;
    return;
  }
  if (gameStarted && !isLoadingScreenActive) {
    resumeGameAfterDelay(3000);
  }
}

/**
 * Adds close button logic to overlays.
 */
function attachCloseButtonListener(overlay, closeId) {
  const btn = document.getElementById(closeId);
  btn?.addEventListener("click", () => {
    hideOverlay(overlay);
    if (overlay.id === "gameOverOverlay") {
      hide("canvasWrapper");
      show("startScreenWrapper");
      gameStarted = false;
    }
  });
}

/**
 * Wires overlay pause/resume behavior by delegating to helper binders.
 */
function setupPauseResumeOnOverlay(openIds, id, closeId, overlay) {
  bindOpenButtonsForPause(openIds, overlay);
  bindCloseButtonForResume(closeId, id, overlay);
}

/**
 * Binds click listeners to all open buttons so they pause and show the overlay.
 */
function bindOpenButtonsForPause(openIds, overlay) {
  const btns = Array.isArray(openIds) ? openIds : [openIds];
  btns?.forEach((btnId) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener("click", () => handleOpenButtonClick(btnId, overlay));
  });
}

/**
 * Handles a single open-button click: pauses game, shows overlay, wires outside-close delay.
 */
function handleOpenButtonClick(btnId, overlay) {
  if (gameStarted && !isLoadingScreenActive) {
    pauseGame();
  }
  showOverlay(overlay);
  delayedCloseOnOutsideClick(overlay, document.getElementById(btnId));
}

/**
 * Binds the close button so that it resumes the game with countdown (if applicable) and hides the overlay.
 */
function bindCloseButtonForResume(closeId, id, overlay) {
  if (!closeId) return;
  const btn = document.getElementById(closeId);
  if (!btn) return;
  btn.addEventListener("click", () => {
    const exclude = [
      "gameOverOverlay",
      "levelUpOverlay",
      "gameFinishedOverlay",
    ];
    if (!exclude.includes(id) && gameStarted && !isLoadingScreenActive) {
      resumeGameAfterDelay(3000);
    }
    hideOverlay(overlay);
  });
}

/**
 * Shows given overlay and hides others.
 */
function showOverlay(overlay) {
  if (globalThis.isLoadingScreenActive) return;
  closeAllOverlays();
  overlay.classList.remove("hidden");
}

/**
 * Hides given overlay.
 */
function hideOverlay(overlay) {
  overlay.classList.add("hidden");
}

/**
 * Hides all main overlays.
 */
function closeAllOverlays() {
  const overlays = document.querySelectorAll(
    "#OverlayStory, #OverlayControls, #OverlaySound, #OverlayImpressum"
  );
  overlays.forEach((o) => o.classList.add("hidden"));
}

/**
 * Shows level up overlay with callback.
 */
function showLevelUpOverlay(onContinue) {
  overlayOpen = true;
  nextLevelCallback = onContinue; // <- merken
  show("levelUpOverlay");
}

/**
 * Continues to next level from overlay.
 */
function continueToNextLevel() {
  hide("levelUpOverlay");
  overlayOpen = false;
  setTimeout(() => {
    nextLevelCallback?.();
    nextLevelCallback = null;
  }, 0);
}

/**
 * Shows the game over overlay and handles UI and audio effects.
 */
function showGameOverOverlay() {
  overlayOpen = true;
  pauseGame();
  stopGameLoop();
  stopGameOverUIAndMusic();
  clearInputState?.();
  show("gameOverOverlay");
  setTimeout(() => {
    hide("gameOverOverlay");
    overlayOpen = false;
    showStartScreen();
  }, 3000);
}

/**
 * Stops background music, hides UI, and plays game over sound if enabled.
 */
function stopGameOverUIAndMusic() {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  document.getElementById("backToStartBtn")?.classList.add("hidden");
  document.querySelector("#mobile-controls")?.classList.add("hidden");
  if (soundEnabled) {
    const sound = new Audio("audio/GameOver.mp3");
    sound.volume = 0.8;
    sound.play();
  }
}

/**
 * Displays the start screen.
 */
function showStartScreen() {
  window.world?.character?.wakeUpPepe?.();
  hide("canvas");
  show("startScreenWrapper");
  gameStarted = false;
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  startScreenMusic.currentTime = 0;
  if (musicEnabled) {
    startScreenMusic.play().catch(() => {});
  }
}

/**
 * Shows the final overlay after all levels are completed.
 * Automatically returns to start screen after 10 seconds.
 */
function showGameFinishedOverlay() {
  document.getElementById("backToStartBtn")?.classList.add("hidden");
  document.querySelector("#mobile-controls")?.classList.add("hidden");
  show("gameFinishedOverlay");
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  if (soundEnabled) {
    playSound("applause");
  }
  setTimeout(() => {
    hide("gameFinishedOverlay");
    stopGameAndReturnToStart();
  }, 10000);
}
