window.addEventListener("DOMContentLoaded", () => {
  initOverlay("openStoryBtn", "OverlayStory", "closeStoryBtn");
  initOverlay("openControlsBtn", "OverlayControls", "closeControlsBtn");
  initOverlay("toggleSoundBtn", "OverlaySound", "closeSoundBtn");
  initOverlay("openImpressumBtn", "OverlayImpressum", "closeImpressumBtn");

  const startBtn = document.getElementById("startGameBtn");
  const startWrapper = document.getElementById("startScreenWrapper");
  const canvasWrapper = document.getElementById("canvasWrapper");

  startBtn.addEventListener("click", () => {
    startWrapper.classList.add("hidden");
    canvasWrapper.classList.remove("hidden");
    init();
  });
});

function initOverlay(openBtnId, overlayId, closeBtnId) {
  const overlay = document.getElementById(overlayId);
  const openBtn = document.getElementById(openBtnId);
  const closeBtn = document.getElementById(closeBtnId);

  openBtn.addEventListener("click", () => {
    overlay.classList.remove("hidden");
  });

  closeBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
  });
}
