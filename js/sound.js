/**
 * Background music audio element.
 * @type {HTMLAudioElement}
 */
let backgroundMusic = new Audio('audio/backgroundMusic.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

/**
 * Indicates whether sound effects are enabled.
 * @type {boolean}
 */
let soundEnabled = true;

/**
 * Toggles the background music on or off.
 * 
 * @param {boolean} checked - If true, music will play; if false, music will pause.
 */
function toggleMusic(checked) {
  if (checked) {
    backgroundMusic.play();
  } else {
    backgroundMusic.pause();
  }
}

/**
 * Enables or disables sound effects globally.
 * 
 * @param {boolean} checked - If true, sound effects are enabled.
 */
function toggleSound(checked) {
  soundEnabled = checked;
}

/**
 * Plays a jump sound effect if sound effects are enabled.
 */
function playJumpSound() {
  if (!soundEnabled) return;
  const jumpSound = new Audio('audio/jump.mp3');
  jumpSound.volume = 0.5;
  jumpSound.play();
}

// Register event listeners for the music and sound toggle switches
document.getElementById('musicToggle').addEventListener('change', function () {
  toggleMusic(this.checked);
});

document.getElementById('soundToggle').addEventListener('change', function () {
  toggleSound(this.checked);
});

/**
 * Plays a generic button click sound if sound effects are enabled.
 */
function playButtonClickSound() {
  if (!soundEnabled) return;
  const clickSound = new Audio('audio/toggleBtnSound.mp3');
  clickSound.volume = 0.5;
  clickSound.play();
}

/**
 * Adds click sound to all buttons on the page.
 */
function registerButtonClickSounds() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      playButtonClickSound();
    });
  });
}

// Call this once after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  registerButtonClickSounds();
});
