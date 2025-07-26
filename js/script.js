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
  const overlayConfigs = [
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
  ];
  overlayConfigs.forEach(({ open, id, close }) =>
    setupOverlay(open, id, close)
  );
}

/**
 * Prepares the "Start Game" button with an event listener to start the game sequence.
 */
function initStartGame() {
  const btn = document.getElementById("startGameBtn");
  btn.addEventListener("click", () => {
    startScreenMusic.play().catch((e) => console.warn("Autoplay blocked:", e));
    startGameSequence();
  });
}

/**
 * Starts the game by showing the canvas and calling the main game initialization function.
 */
function startGame() {
  document.getElementById("canvas").classList.remove("hidden");
  startScreenMusic.pause();
  startScreenMusic.currentTime = 0;
  backgroundMusic.play();
  init();
}

let gameStarted = false;

/**
 * Starts the full game sequence.
 */
function startGameSequence() {
  if (gameStarted) return;
  gameStarted = true;
  hide("startScreenWrapper");
  startGame();
  if (window.innerWidth <= 1050) {
    document.querySelector(".mobile-action-bar")?.classList.add("visible");
    document.querySelector("#mobile-controls")?.classList.add("visible");
  }
}

function showStartScreen() {
  hide("canvasWrapper");
  show("startScreenWrapper");
  gameStarted = false;
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  startScreenMusic.currentTime = 0;
  startScreenMusic
    .play()
    .catch(() => console.warn("Startscreen music blocked."));
}

function show(id) {
  document.getElementById(id).classList.remove("hidden");
}

function hide(id) {
  document.getElementById(id).classList.add("hidden");
}

// function fillProgressBar() {
//   const bar = document.querySelector(".progress-fill");
//   void bar.offsetWidth;
//   bar.style.width = "100%";
// }

// function resetProgressBar() {
//   document.querySelector(".progress-fill").style.width = "0%";
// }

function delayedCloseOnOutsideClick(overlay, trigger) {
  setTimeout(() => {
    closeOnOutsideClick(overlay, trigger);
  }, 100);
}

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

function attachCloseButtonListener(overlay, closeId) {
  const closeBtn = document.getElementById(closeId);
  if (!closeBtn) return;
  closeBtn.addEventListener("click", () => {
    hideOverlay(overlay);
    if (overlay.id === "gameOverOverlay") {
      hide("canvasWrapper");
      show("startScreenWrapper");
      gameStarted = false;
    }
  });
}

function setupOverlay(openIds, overlayId, closeId) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;
  addOpenButtonListeners(openIds, overlay);
  attachCloseButtonListener(overlay, closeId);
  if (!openIds) closeOnOutsideClick(overlay, null);
}

let nextLevelCallback = null;

function showLevelUpOverlay(callback) {
  nextLevelCallback = callback;
  show("levelUpOverlay");
}

function continueToNextLevel() {
  hide("levelUpOverlay");
  if (typeof nextLevelCallback === "function") {
    nextLevelCallback();
    nextLevelCallback = null;
  }
}

document
  .getElementById("nextLevelBtn")
  ?.addEventListener("click", continueToNextLevel);

function showOverlay(overlay) {
  closeAllOverlays();
  overlay.classList.remove("hidden");
}

function showGameOverOverlay() {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  const gameOverSound = new Audio("audio/GameOver.mp3");
  gameOverSound.volume = 0.8;
  gameOverSound.play();
  const overlay = document.getElementById("gameOverOverlay");
  overlay.classList.remove("hidden");
  setTimeout(() => {
    overlay.classList.add("hidden");
    showStartScreen();
  }, 3000);
}

function hideOverlay(overlay) {
  overlay.classList.add("hidden");
}

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

function closeAllOverlays() {
  const overlays = document.querySelectorAll(
    "#OverlayStory, #OverlayControls, #OverlaySound, #OverlayImpressum"
  );
  overlays.forEach((overlay) => overlay.classList.add("hidden"));
}

function startLevel(levelIndex) {
  const canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard, levels[levelIndex]);
}

function checkOrientationAndToggleOverlay() {
  const overlay = document.getElementById("rotateOverlay");
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  const isMobile = window.innerWidth <= 1060;
  overlay.classList.toggle("hidden", !(isMobile && isPortrait));
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
