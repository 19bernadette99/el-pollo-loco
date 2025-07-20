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
  const mobileBtn = document.getElementById("mobileFullscreenBtn");

  if (desktopBtn) {
    desktopBtn.addEventListener("click", toggleFullscreen);
  }

  if (mobileBtn) {
    mobileBtn.addEventListener("click", toggleFullscreen);
  }
}


/**
 * Toggles fullscreen mode on or off depending on the current state.
 * If not in fullscreen, requests fullscreen on the entire document.
 * If already in fullscreen, exits fullscreen mode.
 */
function toggleFullscreen() {
  if (!isFullscreen()) {
    enterFullscreen(document.documentElement)
      .catch((err) => console.error("Fullscreen Error:", err));
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
 *
 * @param {HTMLElement} element - The HTML element to display in fullscreen mode.
 * @returns {Promise<void>|undefined} A Promise that resolves when fullscreen is entered,
 * or undefined if not supported.
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
 *
 * @returns {Promise<void>|undefined} A Promise that resolves when fullscreen is exited,
 * or undefined if not supported.
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
  const mobileBtn = document.getElementById("mobileFullscreenBtn");

  if (desktopBtn) {
    desktopBtn.textContent = isFullscreen() ? "Exit Fullscreen" : "Fullscreen";
  }

  if (mobileBtn) {
    mobileBtn.textContent = isFullscreen() ? "↙️" : "🖥️";
  }
}

