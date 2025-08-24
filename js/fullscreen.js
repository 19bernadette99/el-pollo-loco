/**
 * Initializes all necessary event listeners after the DOM has loaded.
 */
window.addEventListener("DOMContentLoaded", () => {
  setupFullscreenButton();
  setupFullscreenEvents();
  initOrientationOverlay();
  showMobileUI();
  setupResizeListeners();
});

/**
 * Sets up the fullscreen toggle button.
 * Binds the click event that enters or exits fullscreen mode.
 */
function setupFullscreenButton() {
  const desktopBtn = document.getElementById("fullscreenBtn");
  if (desktopBtn) {
    desktopBtn.addEventListener("click", toggleFullscreen);
  }
}

/**
 * Toggles fullscreen mode on or off depending on the current state.
 * If not in fullscreen, requests fullscreen on the entire document.
 * If already in fullscreen, exits fullscreen mode.
 */
function toggleFullscreen() {
  if (!isFullscreen()) {
    enterFullscreen(document.documentElement).catch((err) =>
      console.error("Fullscreen Error:", err)
    );
  } else {
    exitFullscreen();
  }
}

/**
 * Checks if the browser is currently in fullscreen mode.
 * True if fullscreen is active; otherwise, false.
 */
function isFullscreen() {
  return !!document.fullscreenElement;
}

/**
 * Requests fullscreen mode on the given element.
 * Handles different browser vendor prefixes for compatibility.
 */
function enterFullscreen(element) {
  if (element.requestFullscreen) {
    return element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    return element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    return element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    return element.msRequestFullscreen();
  }
}

/**
 * Exits fullscreen mode if currently active.
 * Handles different browser vendor prefixes for compatibility.
 */
function exitFullscreen() {
  if (document.exitFullscreen) {
    return document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    return document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    return document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    return document.msExitFullscreen();
  }
}

/**
 * Sets up a listener for the `fullscreenchange` event,
 * which triggers whenever the browser enters or exits fullscreen mode.
 * Updates the fullscreen button label accordingly.
 */
function setupFullscreenEvents() {
  document.addEventListener("fullscreenchange", updateFullscreenButton);
}

/**
 * Updates the text label of the fullscreen toggle button
 * depending on whether fullscreen mode is currently active.
 */
function updateFullscreenButton() {
  const desktopBtn = document.getElementById("fullscreenBtn");
  if (desktopBtn) {
    desktopBtn.textContent = isFullscreen() ? "Exit Fullscreen" : "Fullscreen";
  }
}

/**
 * Builds a device profile using touch, hover, iPadOS fixes and viewport width.
 */
function getDeviceProfile() {
  const w = innerWidth, h = innerHeight, mt = navigator.maxTouchPoints || 0;
  const hasTouch = mt > 0 || "ontouchstart" in window;
  const hasHover = matchMedia("(hover: hover)").matches;
  const isIPadLike = (navigator.platform === "MacIntel" && mt > 1) || /iPad/.test(navigator.userAgent);
  const isPhoneWidth = w < 768;
  const isTabletWidth = w >= 768 && w <= 1366;
  const isPhone = hasTouch && !hasHover && isPhoneWidth && !isIPadLike;
  const isTablet = hasTouch && (!hasHover || isIPadLike) && (isTabletWidth || isIPadLike);
  const isDesktop = !isPhone && !isTablet;
  return { width: w, height: h, hasTouch, hasHover, isPhone, isTablet, isDesktop, isIPadLike };
}

/**
 * Shows or hides general mobile UI (but not the mobile controls).
 */
function showMobileUI() {
  const p = getDeviceProfile();
  const useMobile = p.isPhone || p.isTablet;
  const bar = document.querySelector('.mobile-action-bar');
  bar?.classList.toggle('visible', useMobile);
}

/**
 * Returns true when we should consider "mobile-like" UI (phone or tablet).
 */
function isMobileLike() {
  const p = getDeviceProfile();
  return p.isPhone || p.isTablet;
}

/**
 * Shows overlay only on mobile-like devices while in portrait orientation.
 */
function updateRotateOverlay() {
  const overlay = document.getElementById("rotateOverlay");
  if (!overlay) return;

  const portrait = window.matchMedia("(orientation: portrait)").matches;
  const show = isMobileLike() && portrait;
  overlay.classList.toggle("hidden", !show);
}

/**
 * Sets up listeners to keep rotate overlay in sync with orientation and layout.
 */
function initOrientationOverlay() {
  updateRotateOverlay();
  const mqPortrait = window.matchMedia("(orientation: portrait)");
  mqPortrait.addEventListener("change", updateRotateOverlay);
  window.addEventListener("resize", updateRotateOverlay, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") updateRotateOverlay();
  });
}

/**
 * Re-evaluates mobile UI on viewport/layout changes.
 * Orientation overlay is handled by initOrientationOverlay().
 */
function setupResizeListeners() {
  const handler = () => {
    showMobileUI();
  };
  window.addEventListener("resize", handler, { passive: true });
  window.addEventListener("orientationchange", handler, { passive: true });
}
