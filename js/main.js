import { init } from '/js/game.js';

window.addEventListener('DOMContentLoaded', () => {
  init();
});

export const state = {
  gameStarted: false,
  gamePaused: false,
  soundEnabled: true,
  resumeTimeout: null,
  countdownElement: null,
  nextLevelCallback: null,
  musicEnabled: true,
};

export function setGamePaused(value) {
  gamePaused = value;
}

export function setSoundEnabled(value) {
  soundEnabled = value;
}

import '/js/fullscreen.js';
import '/js/sound.js';
import '/js/script.js';
import '/js/game.js';

import '/js/level-data.js';
import '/js/level-factory.js';
import '/js/level-up.js';

import '/models/drawable-object.class.js';
import '/models/moveable-object.class.js';
import '/models/character-imgs.class.js';
import '/models/character.class.js';
import '/models/world.class.js';
import '/models/status-bar-health.class.js';
import '/models/status-bar-bottle.class.js';
import '/models/status-bar-coins.class.js';
import '/models/status-bar-endboss.class.js';
import '/models/salsa-bottle.class.js';
import '/models/chicken.class.js';
import '/models/cloud.class.js';
import '/models/background-object.class.js';
import '/models/keyboard.class.js';
import '/models/endboss.class.js';
import '/models/throwable-object.class.js';
import '/models/coin.class.js';
import '/models/level.class.js';
