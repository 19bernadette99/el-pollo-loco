/**
 * Chill background music for the start screen.
 * @type {HTMLAudioElement}
 */
let startScreenMusic = new Audio("audio/startScreenMusic.mp3");
startScreenMusic.loop = true;
startScreenMusic.volume = 0.4;

/**
 * Background music during the game.
 * @type {HTMLAudioElement}
 */
let backgroundMusic = new Audio("audio/backgroundMusic.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

/**
 * Indicates whether music and sound effects are enabled.
 * @type {boolean}
 */
let musicEnabled = true;
let soundEnabled = true;

/**
 * Sound effects map for easy access.
 * @type {Object.<string, HTMLAudioElement>}
 */
const soundEffects = {
  hurt: new Audio("audio/hurtSound.mp3"),
  bottleClink: new Audio("audio/bottleClink.mp3"),
  breakingBottle: new Audio("audio/breakingBottle.mp3"),
  collectingCoins: new Audio("audio/collectingCoinsSound.mp3"),
  death: new Audio("audio/deathSound.mp3"),
  gameOver: new Audio("audio/GameOver.mp3"),
  toggle: new Audio("audio/toggleBtnSound.mp3"),
  walking: new Audio("audio/walkingSound.mp3"),
  chickenAlarm: new Audio("audio/chickenAlarm.mp3"),
};

/**
 * Toggles the background and start screen music.
 * @param {boolean} enabled - If true, music will play; if false, it will stop.
 */
function toggleMusic(enabled) {
  musicEnabled = enabled;
  if (enabled) {
  } else {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    startScreenMusic.pause();
    startScreenMusic.currentTime = 0;
  }
}

/**
 * Enables or disables all sound effects.
 * @param {boolean} enabled - If true, sound effects are enabled.
 */
function toggleSound(enabled) {
  soundEnabled = enabled;
}

/**
 * Plays a named sound effect if enabled.
 * @param {string} effectName - Key of the sound in the soundEffects map.
 */
function playSound(effectName) {
  if (soundEnabled && soundEffects[effectName]) {
    const clone = soundEffects[effectName].cloneNode();
    clone.volume = 0.5;
    clone.play().catch((e) => console.error("Playback failed:", e));
  }
}

/**
 * Plays a jump sound effect if sound effects are enabled.
 */
function playJumpSound() {
  if (!soundEnabled) return;
  const jumpSound = new Audio("audio/jump.mp3");
  jumpSound.volume = 0.5;
  jumpSound.play();
}

/**
 * Plays a generic button click sound if sound effects are enabled.
 */
function playButtonClickSound() {
  if (!soundEnabled) return;
  const clickSound = new Audio("audio/toggleBtnSound.mp3");
  clickSound.volume = 0.5;
  clickSound.play();
}

/**
 * Adds click sound to all buttons on the page.
 */
function registerButtonClickSounds() {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      playButtonClickSound();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  registerButtonClickSounds();

  document
    .getElementById("musicToggle")
    .addEventListener("change", function () {
      toggleMusic(this.checked);
    });

  document
    .getElementById("soundToggle")
    .addEventListener("change", function () {
      toggleSound(this.checked);
    });

  toggleMusic(document.getElementById("musicToggle").checked);
  toggleSound(document.getElementById("soundToggle").checked);
});
