/**
 * Initializes all necessary event listeners after the DOM has loaded.
 */
window.addEventListener("DOMContentLoaded", () => {
  setupFullscreenButton();
  setupFullscreenEvents();
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
 *
 * @returns {boolean} True if fullscreen is active; otherwise, false.
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
 * Toggles rotate overlay for portrait mobile mode. 
 */ 
function checkOrientationAndToggleOverlay() {
  const overlay = document.getElementById("rotateOverlay");
  const portrait = window.matchMedia("(orientation: portrait)").matches;
  const mobile = window.innerWidth <= 1060;
  overlay.classList.toggle("hidden", !(mobile && portrait));
}

/**
 * Tablet mode helper functions
 */

/**
 * Builds a device profile using touch, hover, iPadOS fixes and viewport width.
 * @returns {Object} Profile flags and screen dimensions.
 */
function getDeviceProfile() {
  const w = innerWidth, h = innerHeight, mt = navigator.maxTouchPoints || 0;
  const hasTouch = mt > 0 || "ontouchstart" in window, hasHover = matchMedia("(hover: hover)").matches;
  const isIPadLike = (navigator.platform === "MacIntel" && mt > 1) || /iPad/.test(navigator.userAgent);
  const isPhoneWidth = w < 768, isTabletWidth = w >= 768 && w <= 1366;
  const isPhone = hasTouch && !hasHover && isPhoneWidth && !isIPadLike;
  const isTablet = hasTouch && (!hasHover || isIPadLike) && (isTabletWidth || isIPadLike);
  const isDesktop = !isPhone && !isTablet;
  return { width: w, height: h, hasTouch, hasHover, isPhone, isTablet, isDesktop, isIPadLike };
}


/**
 * Shows or hides mobile UI elements depending on device profile.
 * Applies the "visible" class to mobile action bar and controls.
 */
function showMobileUI() {
  const p = getDeviceProfile();
  const useMobile = p.isPhone || p.isTablet;
  const bar = document.querySelector(".mobile-action-bar");
  const ctr = document.querySelector("#mobile-controls");
  bar?.classList.toggle("visible", useMobile);
  ctr?.classList.toggle("visible", useMobile);
}

/**
 * Toggles the rotate overlay only on phones and tablets in portrait orientation.
 * Overlay is hidden for desktop or landscape orientation.
 */
function checkOrientationAndToggleOverlay() {
  const p = getDeviceProfile();
  const overlay = document.getElementById("rotateOverlay");
  if (!overlay) return;
  const portrait = matchMedia("(orientation: portrait)").matches;
  const mobileLike = p.isPhone || p.isTablet;
  overlay.classList.toggle("hidden", !(mobileLike && portrait));
}

/**
 * Registers resize and orientationchange listeners.
 * Re-evaluates orientation and UI on every change.
 */
function setupResizeListeners() {
  const handler = () => {
    checkOrientationAndToggleOverlay();
    showMobileUI();
  };
  addEventListener("resize", handler, { passive: true });
  addEventListener("orientationchange", handler, { passive: true });
}
