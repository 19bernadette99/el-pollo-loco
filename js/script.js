let keyboard = new Keyboard();

/**
 * Starts the main loop if not already running.
 */
function startGameLoop() {
  if (loopActive) return;
  loopActive = true;
  function loop() {
    if (!gamePaused && world) {
      world.update?.();
      world.draw?.();
    }
    animationFrameId = requestAnimationFrame(loop);
  }
  animationFrameId = requestAnimationFrame(loop);
}

/**
 * Starts the game by initializing the world and showing the canvas.
 */
function startGame() {
  showLoadingScreen(() => {
    prepareStartAudio();
    prepareControlsAndMusic();
    const canvas = getCanvas();
    ensureKeyboardReady();
    createWorldWithFreshLevel(canvas);
    applySpawnProtection(world?.character, 2000);
    revealGameUI();
    finalizeStateAndLoop();
  });
}

/**
 * Pauses start screen music and resets its playhead.
 */
function prepareStartAudio() {
  startScreenMusic.pause();
  startScreenMusic.currentTime = 0;
}

/**
 * Sets up mobile controls and starts background music (if enabled).
 */
function prepareControlsAndMusic() {
  setupMobileControls();
  if (musicEnabled) backgroundMusic.play();
}

/**
 * Returns the main game canvas element.
 */
function getCanvas() {
  return document.getElementById("canvas");
}

/**
 * Ensures a single keyboard instance and clears its state if present.
 */
function ensureKeyboardReady() {
  if (!keyboard) {
    keyboard = new Keyboard();
  } else if (typeof keyboard.reset === "function") {
    keyboard.reset();
  }
}

/**
 * Creates a fresh level and instantiates a new world.
 */
function createWorldWithFreshLevel(canvas) {
  const freshLevel = generateLevel(levelConfigs[currentLevelIndex]);
  world = new World(canvas, keyboard, freshLevel);
}

/**
 * Grants temporary invulnerability to the player character.
 */
function applySpawnProtection(character, ms = 2000) {
  if (!character) return;
  character.isInvulnerable = true;
  setTimeout(() => {
    if (world?.character) world.character.isInvulnerable = false;
  }, ms);
}

/**
 * Reveals canvas and UI, then fits the canvas to its wrapper.
 */
function revealGameUI() {
  show("canvas");
  document.getElementById("backToStartBtn")?.classList.remove("hidden");
  showMobileUI();
  fitCanvas();
}

/**
 * Marks the game as running and starts the main loop.
 */
function finalizeStateAndLoop() {
  gamePaused = false;
  gameStarted = true;
  stopGameLoop();
  startGameLoop();
}

/**
 * Stops the main loop and clears the RAF handle.
 */
function stopGameLoop() {
  loopActive = false;
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
}

/**
 * Resets all pressed keys and mobile button states.
 */
function clearInputState() {
  if (keyboard?.reset) keyboard.reset();
  ["btn-left", "btn-right", "btn-jump", "btn-throw"].forEach((id) =>
    document.getElementById(id)?.classList.remove("active")
  );
}

/**
 * Initializes the game world and starts the loop.
 */
function init() {
  const canvas = document.getElementById("canvas");
  fitCanvas();
}

/**
 * Stops the game and returns to the start screen.
 */
function stopGameAndReturnToStart() {
  window.world?.character?.wakeUpPepe?.();
  hardKillSnore(); 
  window.world?.stop?.();
  gamePaused = true;
  gameStarted = false;
  stopGameLoop();
  clearInputState();
  clearAllIntervals();
  clearAllTimeouts();
  showStartScreen();
  hide("canvas");
  hide("backToStartBtn");
  document.querySelector("#mobile-controls")?.classList.remove("visible");
  resetWorldState();
  keyboard?.reset?.();
}


/**
 * Resets global variables to initial state.
 */
function resetWorldState() {
  world = null;
  currentLevelIndex = 0;
}

/**
 * Clears all active intervals.
 */
function clearAllIntervals() {
  for (let i = 1; i < 99999; i++) {
    clearInterval(i);
  }
}

/**
 * Clears all active timeouts.
 */
function clearAllTimeouts() {
  for (let i = 1; i < 99999; i++) {
    clearTimeout(i);
  }
}

/**
 * Scale canvas visually to match the screenContainer,
 * but keep internal buffer at 720x480.
 */
function fitCanvas() {
  const canvas = document.querySelector("canvas");
  const container = document.getElementById("screenContainer");
  if (!canvas || !container) return;
  const rect = container.getBoundingClientRect();
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";
}

/**
 * Adds click listener to the back-to-start button.
 */
window.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("backToStartBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
  window.world?.character?.wakeUpPepe?.();
    hardKillSnore(); 
      stopGameAndReturnToStart();
    });
  }
});

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
 * Shows element by ID.
 */
function show(id) {
  if (globalThis.isLoadingScreenActive && /overlay/i.test(String(id))) return;
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
 * Resumes game immediately.
 */
function resumeGame() {
  gamePaused = false;
}

/**
 * Resumes game after delay with visual countdown.
 * @param {number} delay
 */
function resumeGameAfterDelay(delay = 3000) {
  if (!gameStarted) return;
  createCountdownElementIfNeeded();

  startCountdown(3, delay / 3, () => {
    hideCountdownElement();
    resumeGame();
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
  countdownElement = document.getElementById("resumeCountdown");
  if (!countdownElement) {
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
}

/**
 * Hides countdown DOM element.
 */
function hideCountdownElement() {
  if (countdownElement) countdownElement.style.display = "none";
}
