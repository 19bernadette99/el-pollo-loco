window.addEventListener("DOMContentLoaded", () => {
  setupOverlay("openStoryBtn", "OverlayStory", "closeStoryBtn");
  setupOverlay("openControlsBtn", "OverlayControls", "closeControlsBtn");
  setupOverlay("toggleSoundBtn", "OverlaySound", "closeSoundBtn");
  setupOverlay("openImpressumBtn", "OverlayImpressum", "closeImpressumBtn");
  setupStartGame();
});

function setupStartGame() {
  const btn = document.getElementById("startGameBtn");
  const screen = document.getElementById("startScreenWrapper");
  const canvas = document.getElementById("canvasWrapper");
  btn.addEventListener("click", () => {
    screen.classList.add("hidden");
    canvas.classList.remove("hidden");
    init();
  });
}

function setupOverlay(openBtnId, overlayId, closeBtnId) {
  const overlay = document.getElementById(overlayId);
  const openBtn = document.getElementById(openBtnId);
  const closeBtn = document.getElementById(closeBtnId);

  openBtn.addEventListener("click", () => {
    closeAllOverlays();
    overlay.classList.remove("hidden");
  });

  closeBtn.addEventListener("click", () => overlay.classList.add("hidden"));

  document.addEventListener("click", (e) => {
    if (
      !overlay.classList.contains("hidden") &&
      !overlay.contains(e.target) &&
      e.target !== openBtn
    ) {
      overlay.classList.add("hidden");
    }
  });
}

function closeAllOverlays() {
  const overlays = document.querySelectorAll(
    "#OverlayStory, #OverlayControls, #OverlaySound, #OverlayImpressum"
  );
  overlays.forEach((el) => el.classList.add("hidden"));
}
