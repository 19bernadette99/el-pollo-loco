window.addEventListener("DOMContentLoaded", () => {
  setupAllOverlays();
  setupStartGame();
});

function setupAllOverlays() {
  setupOverlay("openStoryBtn", "OverlayStory", "closeStoryBtn");
  setupOverlay("openControlsBtn", "OverlayControls", "closeControlsBtn");
  setupOverlay("toggleSoundBtn", "OverlaySound", "closeSoundBtn");
  setupOverlay("openImpressumBtn", "OverlayImpressum", "closeImpressumBtn");
}

function setupStartGame() {
  const btn = document.getElementById("startGameBtn");
  btn.addEventListener("click", () => {
    toggleScreen("startScreenWrapper", false);
    toggleScreen("canvasWrapper", true);
    init();
  });
}

function setupOverlay(openBtnId, overlayId, closeBtnId) {
  const overlay = document.getElementById(overlayId);
  const openBtn = document.getElementById(openBtnId);
  const closeBtn = document.getElementById(closeBtnId);

  openBtn.addEventListener("click", () => showOverlay(overlay));
  closeBtn.addEventListener("click", () => hideOverlay(overlay));
  handleOutsideClick(overlay, openBtn);
}

function showOverlay(overlay) {
  closeAllOverlays();
  overlay.classList.remove("hidden");
}

function hideOverlay(overlay) {
  overlay.classList.add("hidden");
}

function handleOutsideClick(overlay, trigger) {
  document.addEventListener("click", (e) => {
    if (!overlay.classList.contains("hidden") &&
        !overlay.contains(e.target) &&
        e.target !== trigger) {
      hideOverlay(overlay);
    }
  });
}

function closeAllOverlays() {
  const overlays = document.querySelectorAll(
    "#OverlayStory, #OverlayControls, #OverlaySound, #OverlayImpressum"
  );
  overlays.forEach(el => el.classList.add("hidden"));
}

function toggleScreen(id, show) {
  document.getElementById(id).classList.toggle("hidden", !show);
}

function closeAllOverlays() {
  const overlays = document.querySelectorAll(
    "#OverlayStory, #OverlayControls, #OverlaySound, #OverlayImpressum"
  );
  overlays.forEach((el) => el.classList.add("hidden"));
}

window.addEventListener("DOMContentLoaded", () => {
  setupStartGame();
});

function setupStartGame() {
  const startBtn = document.getElementById("startGameBtn");
  startBtn.addEventListener("click", handleStartGame);
}

function handleStartGame() {
  hideStartScreen();
  showLoadingScreen();
  animateProgressBar();
  startGameAfterDelay(5000);
}

function hideStartScreen() {
  document.getElementById("startScreenWrapper").classList.add("hidden");
}

function showLoadingScreen() {
  document.getElementById("loadingScreen").classList.remove("hidden");
}

function animateProgressBar() {
  const progressFill = document.querySelector(".progress-fill");
  void progressFill.offsetWidth; 
  progressFill.style.width = "100%";
}

function startGameAfterDelay(delay) {
  setTimeout(() => {
    document.getElementById("loadingScreen").classList.add("hidden");
    document.getElementById("canvasWrapper").classList.remove("hidden");
    document.querySelector(".progress-fill").style.width = "0%";
    init();
  }, delay);
}

