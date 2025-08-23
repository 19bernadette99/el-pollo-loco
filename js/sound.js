/**
 * Global audio pool to track all created Audio instances.
 * @type {Set<HTMLAudioElement>}
 */
window.__AUDIO_POOL__ = window.__AUDIO_POOL__ || new Set();

(function () {
  const NativeAudio = window.Audio;
  /**
   * Override the global Audio constructor.
   * Ensures every created Audio element is stored in `window.__AUDIO_POOL__`.
   */
  window.Audio = function (...args) {
    const a = new NativeAudio(...args);
    try {
      window.__AUDIO_POOL__.add(a);
    } catch {}
    return a;
  };
  window.Audio.prototype = NativeAudio.prototype; 
})();

/**
 * hardKillFunction for stop snoring
 */
function hardKillSnore() {
  try { window.world?.character?.stopSnore?.(); } catch {}
  try {
    for (const a of (window.__AUDIO_POOL__ || [])) {
      if (!a) continue;
      const src = (a.src || "").toLowerCase();
      if (src.includes("audio/snore.mp3")) {
        a.pause();
        a.currentTime = 0;
        a.loop = false;
        a.muted = true; 
      }
    }
  } catch {}
}

/**
 * Chill background music for the start screen.
 * @type {HTMLAudioElement}
 */
let startScreenMusic = new Audio("audio/startScreenMusic.mp3");
startScreenMusic.loop = true;
startScreenMusic.volume = 0.4;

/**
 * Background music during gameplay.
 * @type {HTMLAudioElement}
 */
let backgroundMusic = new Audio("audio/backgroundMusic.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

/**
 * Whether background music is enabled.
 * @type {boolean}
 */
let musicEnabled = true;

/**
 * Whether sound effects are enabled.
 * @type {boolean}
 */
let soundEnabled = true;

/**
 * Sound effects collection indexed by name.
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
  applause: new Audio("audio/applauseSound.mp3"),
};

/**
 * Toggles background/start screen music and stores the preference.
 */
function toggleMusic(enabled) {
  musicEnabled = enabled;
  localStorage.setItem("musicEnabled", JSON.stringify(enabled));
  if (!enabled) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    startScreenMusic.pause();
    startScreenMusic.currentTime = 0;
  } else {
    const isStartScreen = document.getElementById("startScreenWrapper")?.classList.contains("visible");
    if (isStartScreen) {
      startScreenMusic.play().catch(() => {});
    }
  }
}

/**
 * Enables or disables all sound effects and stores the preference.
 * 
 * @param {boolean} enabled - Whether sound effects should be enabled.
 */
function toggleSound(enabled) {
  soundEnabled = enabled;
  localStorage.setItem("soundEnabled", JSON.stringify(enabled));
}

/**
 * Plays a sound effect by name from the soundEffects map.
 * 
 * @param {string} effectName - The key of the sound to play.
 */
function playSound(effectName) {
  if (effectName === "snore") return; 
  if (soundEnabled && soundEffects[effectName]) {
    const clone = soundEffects[effectName].cloneNode();
    clone.volume = 0.5;
    clone.play().catch(() => {});
  }
}

/**
 * Plays the jump sound if sound is enabled.
 */
function playJumpSound() {
  if (!soundEnabled) return;
  const jumpSound = new Audio("audio/jump.mp3");
  jumpSound.volume = 0.5;
  jumpSound.play();
}

/**
 * Plays a standard button click sound.
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
  buttons.forEach(btn => {
    btn.addEventListener("click", () => playButtonClickSound());
  });
}

/**
 * Restores saved music and sound settings from localStorage.
 */
function restoreAudioSettings() {
  const music = JSON.parse(localStorage.getItem("musicEnabled"));
  const sound = JSON.parse(localStorage.getItem("soundEnabled"));
  toggleMusic(music !== null ? music : true);
  toggleSound(sound !== null ? sound : true);
  const musicToggle = document.getElementById("musicToggle");
  const soundToggle = document.getElementById("soundToggle");
  if (musicToggle) musicToggle.checked = music !== null ? music : true;
  if (soundToggle) soundToggle.checked = sound !== null ? sound : true;
}

/**
 * Initializes audio toggle controls and button sounds.
 */
document.addEventListener("DOMContentLoaded", () => {
  registerButtonClickSounds();
  restoreAudioSettings();
  document.getElementById("musicToggle")?.addEventListener("change", function () {
    toggleMusic(this.checked);
  });
  document.getElementById("soundToggle")?.addEventListener("change", function () {
    toggleSound(this.checked);
  });
});
