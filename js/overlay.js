window.gamePaused = false;
let resumeTimeout = null;
let countdownElement = null;
let gameStarted = false;
let nextLevelCallback = null;
let animationFrameId = null;
let isLoadingScreenActive = false;

/**
 * Initializes overlays, UI, and listeners after DOM load.
 */
window.addEventListener("DOMContentLoaded", () => {
  initOverlays();
  initStartGame();
  setupFullscreenConfirm();
  setupMobileMenu();
  checkOrientationAndToggleOverlay();
  setupResizeListeners();
  setupMobileControls();
});

/**
 * Sets up resize and orientation change listeners.
 */
function setupResizeListeners() {
  window.addEventListener("resize", checkOrientationAndToggleOverlay);
  window.addEventListener(
    "orientationchange",
    checkOrientationAndToggleOverlay
  );
}

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
 * Shows mobile action bar and controls on small screens.
 */
function showMobileUI() {
  if (window.innerWidth <= 1050) {
    document.querySelector(".mobile-action-bar")?.classList.add("visible");
    document.querySelector("#mobile-controls")?.classList.add("visible");
  }
}

/**
 * Starts the game by initializing the world and showing the canvas.
 */
function startGame() {
  showLoadingScreen(() => {
    startScreenMusic.pause();
    startScreenMusic.currentTime = 0;
    setupMobileControls();
    if (musicEnabled) backgroundMusic.play();
    const canvas = document.getElementById("canvas");
    keyboard = new Keyboard();
    world = new World(canvas, keyboard, levels[currentLevelIndex]);

    show("canvas");
    document.getElementById("backToStartBtn")?.classList.remove("hidden");
    showMobileUI();
  });
}

/**
 * Shows and animates the loading screen.
 * @param {Function} callback - Called when finished
 */
function showLoadingScreen(callback) {
  isLoadingScreenActive = true;
  const loading = document.getElementById("loadingScreen");
  loading.classList.remove("hidden");
  document.querySelector("#mobile-controls")?.classList.add("hidden");
  document.querySelector(".mobile-action-bar")?.classList.add("hidden");
  resetProgressBar();
  fillProgressBar();
  setTimeout(() => {
    loading.classList.add("hidden");
    document.querySelector("#mobile-controls")?.classList.remove("hidden");
    document.querySelector(".mobile-action-bar")?.classList.remove("hidden");
    callback?.();
  }, 5000);
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
  const configs = [
    {
      open: ["openStoryBtn", "mobileStoryBtn"],
      id: "OverlayStory",
      close: "closeStoryBtn",
    },
    {
      open: ["openControlsBtn", "mobileControlsBtn"],
      id: "OverlayControls",
      close: "closeControlsBtn",
    },
    {
      open: ["toggleSoundBtn", "mobileSoundBtn"],
      id: "OverlaySound",
      close: "closeSoundBtn",
    },
    {
      open: ["openImpressumBtn", "mobileImpressumBtn"],
      id: "OverlayImpressum",
      close: "closeImpressumBtn",
    },
    { open: null, id: "gameOverOverlay", close: "closeGameOverOverlayBtn" },
    { open: null, id: "levelUpOverlay", close: "nextLevelBtn" },
    { open: null, id: "gameFinishedOverlay", close: null },
  ];
  configs.forEach(({ open, id, close }) => setupOverlay(open, id, close));
}

/**
 * Sets up one overlay with open and close logic.
 */
function setupOverlay(openIds, overlayId, closeId) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;
  addOpenButtonListeners(openIds, overlay);
  attachCloseButtonListener(overlay, closeId);
  if (!openIds) closeOnOutsideClick(overlay, null);
  setupPauseResumeOnOverlay(openIds, overlayId, closeId, overlay);
}

/**
 * Adds click listeners to open buttons for overlays.
 */
function addOpenButtonListeners(ids, overlay) {
  if (!ids) return;
  const btns = Array.isArray(ids) ? ids : [ids];
  btns.forEach((id) => {
    const btn = document.getElementById(id);
    btn?.addEventListener("click", () => {
      showOverlay(overlay);
      delayedCloseOnOutsideClick(overlay, btn);
    });
  });
}

/**
 * Closes overlay after outside click delay.
 */
function delayedCloseOnOutsideClick(overlay, trigger) {
  setTimeout(() => closeOnOutsideClick(overlay, trigger), 100);
}

/**
 * Adds outside click handler to close overlays.
 */
function closeOnOutsideClick(overlay, trigger) {
  document.addEventListener("click", (e) => {
    if (
      !overlay.contains(e.target) &&
      !overlay.classList.contains("hidden") &&
      e.target !== trigger
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
 * Pauses/resumes game based on overlay logic.
 */
function setupPauseResumeOnOverlay(openIds, id, closeId, overlay) {
  const btns = Array.isArray(openIds) ? openIds : [openIds];
  btns?.forEach((id) =>
    document.getElementById(id)?.addEventListener("click", () => {
      if (!isLoadingScreenActive) pauseGame();
    })
  );
  if (closeId) {
    document.getElementById(closeId)?.addEventListener("click", () => {
      if (
        !["gameOverOverlay", "levelUpOverlay"].includes(id) &&
        !isLoadingScreenActive
      ) {
        resumeGameAfterDelay(3000);
      }
    });
  }
}

/**
 * Shows given overlay and hides others.
 */
function showOverlay(overlay) {
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
function showLevelUpOverlay(callback) {
  nextLevelCallback = callback;
  show("levelUpOverlay");
}

/**
 * Continues to next level from overlay.
 */
function continueToNextLevel() {
  setTimeout(() => {
    nextLevelCallback?.();
    nextLevelCallback = null;
  }, 200);
}
document
  .getElementById("nextLevelBtn")
  ?.addEventListener("click", continueToNextLevel);

/**
 * Shows game over overlay with sound.
 */
function showGameOverOverlay() {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  document.getElementById("backToStartBtn")?.classList.add("hidden");
  document.querySelector("#mobile-controls")?.classList.add("hidden");
  if (soundEnabled) {
    const sound = new Audio("audio/GameOver.mp3");
    sound.volume = 0.8;
    sound.play();
  }

  show("gameOverOverlay");

  setTimeout(() => {
    hide("gameOverOverlay");
    showStartScreen();
  }, 3000);
}

/**
 * Displays the start screen.
 */
function showStartScreen() {
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
 * Shows element by ID.
 */
function show(id) {
  document.getElementById(id)?.classList.remove("hidden");
}

/**
 * Hides element by ID.
 */
function hide(id) {
  document.getElementById(id)?.classList.add("hidden");
}

/**
 * Pauses game rendering and updates.
 */
function pauseGame() {
  gamePaused = true;
}

/**
 * Resumes game after delay with visual countdown.
 */
function resumeGameAfterDelay(delay = 3000) {
  if (!gameStarted) return;

  createCountdownElementIfNeeded();
  startCountdown(3, delay / 3, () => {
    hideCountdownElement();
    gamePaused = false;
  });
}

/**
 * Starts countdown animation.
 */
function startCountdown(start, step, done) {
  let count = start;
  countdownElement.textContent = count;
  countdownElement.style.display = "block";
  const interval = setInterval(() => {
    count--;
    if (count <= 0) {
      clearInterval(interval);
      done();
    } else {
      countdownElement.textContent = count;
    }
  }, step);
}

/**
 * Creates countdown DOM element if not present.
 */
function createCountdownElementIfNeeded() {
  if (countdownElement) return;
  countdownElement = document.createElement("div");
  countdownElement.id = "resumeCountdown";
  Object.assign(countdownElement.style, {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "100px",
    color: "white",
    fontFamily: "Press Start 2P",
    zIndex: "9999",
    display: "none",
  });
  document.body.appendChild(countdownElement);
}

/**
 * Hides countdown DOM element.
 */
function hideCountdownElement() {
  if (countdownElement) countdownElement.style.display = "none";
}

/**
 * Toggles rotate overlay for portrait mobile mode.
 */
function checkOrientationAndToggleOverlay() {
  const overlay = document.getElementById("rotateOverlay");
  const portrait = window.matchMedia("(orientation: portrait)").matches;
  const mobile = window.innerWidth <= 1060;
  overlay.classList.toggle("hidden", !(mobile && portrait));
}

/**
 * Toggles the mobile menu panel.
 */
function setupMobileMenu() {
  const toggle = document.getElementById("mobileMenuToggle");
  const menu = document.getElementById("mobileMenu");
  const buttons = menu?.querySelectorAll("button") || [];

  toggle?.addEventListener("click", () => menu.classList.toggle("visible"));
  buttons.forEach((btn) =>
    btn.addEventListener("click", () => menu.classList.remove("visible"))
  );
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
