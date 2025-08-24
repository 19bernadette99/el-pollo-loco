let canvas;
let world;

/** 
 * Builds an effective rect from hitbox or legacy offset. 
*/
function getEffectiveRect(o) {
  if (o?.hitbox) {
    const { ox=0, oy=0, ow=0, oh=0 } = o.hitbox;
    return { x: o.x + ox, y: o.y + oy, w: o.width - ow, h: o.height - oh };
  }
  if (o?.offset) {
    const { left=0, right=0, top=0, bottom=0 } = o.offset;
    return { x: o.x + left, y: o.y + top, w: o.width - (left + right), h: o.height - (top + bottom) };
  }
  return { x: o.x, y: o.y, w: o.width, h: o.height };
}

/** 
 * Computes intersection metrics for two rects.
*/
function intersectRects(a, b) {
  const r1 = getEffectiveRect(a), r2 = getEffectiveRect(b);
  const ix = Math.max(0, Math.min(r1.x + r1.w, r2.x + r2.w) - Math.max(r1.x, r2.x));
  const iy = Math.max(0, Math.min(r1.y + r1.h, r2.y + r2.h) - Math.max(r1.y, r2.y));
  return { ix, iy, area: ix * iy, r1, r2 };
}

/** 
 * Picks class-based collision thresholds.
 *  */
function selectThreshold(a, b) {
  const is = (o, C) => typeof window[C] !== "undefined" && o instanceof window[C];
  if (is(a, "Coin") || is(b, "Coin")) return { minArea: 24, minFracX: 0.1, minFracY: 0.1 };
  if (is(a, "SalsaBottle") || is(b, "SalsaBottle")) return { minArea: 36, minFracX: 0.12, minFracY: 0.12 };
  if (is(a, "Endboss") || is(b, "Endboss")) return { minArea: 160, minFracX: 0.22, minFracY: 0.18 };
  if (is(a, "Chicken") || is(b, "Chicken")) { const s = o => is(o, "Chicken") && o.isLittle; return s(a) || s(b) ? 
    { minArea: 70, minFracX: 0.18, minFracY: 0.16 } : { minArea: 90, minFracX: 0.2, minFracY: 0.16 }; }
  return { minArea: 20, minFracX: 0.12, minFracY: 0.12 };
}

/** 
 * Overlap test with absolute and relative thresholds. 
 * */
function overlapsWithThreshold(a, b, t) {
  const { ix, iy, area, r1, r2 } = intersectRects(a, b);
  if (ix <= 0 || iy <= 0) return false;
  const minW = Math.min(r1.w, r2.w) || 1;
  const minH = Math.min(r1.h, r2.h) || 1;
  return area >= t.minArea && ix / minW >= t.minFracX && iy / minH >= t.minFracY;
}

/** 
 * Resolves common world collections across storage variants. 
 * */
function resolveWorldCollections(world) {
  const lvl = world?.level || world;
  const en = Array.isArray(lvl?.enemies) ? lvl.enemies : (world?.enemies || []);
  const coins = Array.isArray(lvl?.coins) ? lvl.coins : (world?.coins || []);
  const sb = Array.isArray(lvl?.salsaBottles) ? lvl.salsaBottles : (world?.salsaBottles || []);
  const chickens = en.filter(e => typeof Chicken !== "undefined" && e instanceof Chicken);
  const chickenLittles = en.filter(e => typeof ChickenLittle !== "undefined" && e instanceof ChickenLittle);
  const endbosses = en.filter(e => typeof Endboss !== "undefined" && e instanceof Endboss);
  return { character: world?.character, chickens, chickenLittles, endbosses, coins, salsaBottles: sb };
}

/** 
 * Applies default hitboxes once after level creation. 
 * */
function applyDefaultHitboxes(world) {
  const { character, chickens, chickenLittles, endbosses, coins, salsaBottles }
   = resolveWorldCollections(world);
  if (character) character.hitbox = { ox: 22, oy: 14, ow: 44, oh: 28 };
  chickenLittles.forEach(c => c.hitbox = { ox: 8, oy: 6, ow: 16, oh: 12 });
  chickens.forEach(c => c.hitbox = { ox: 12, oy: 8, ow: 24, oh: 16 });
  endbosses.forEach(e => e.hitbox = { ox: 70, oy: 48, ow: 140, oh: 96 });
  coins.forEach(c => c.hitbox = { ox: 10, oy: 10, ow: 20, oh: 20 });
  salsaBottles.forEach(b => b.hitbox = { ox: 12, oy: 18, ow: 24, oh: 32 });
}

/**
 *  Picks up coins on real overlap. 
 * */
function checkCoinPickup(world) {
  const { character: ch, coins } = resolveWorldCollections(world);
  if (!ch || !Array.isArray(coins)) return;
  let changed = false;
  for (const c of coins) if (!c.collected && ch.isColliding?.(c)) 
    { c.collected = true; changed = true; ch.collectedCoins = (ch.collectedCoins || 0) + 1; 
    world.statusBarCoins?.setCollected?.(ch.collectedCoins); world.audio?.play?.("pickupCoin"); }
  if (!changed) return;
  const lvl = world.level || world;
  if (Array.isArray(lvl.coins)) lvl.coins = lvl.coins.filter(c => !c.collected);
  if (Array.isArray(world.coins)) world.coins = world.coins.filter(c => !c.collected);
}

/** 
 * Picks up ground salsa bottles on real overlap. 
 * */
function checkGroundBottlePickup(world) {
  const { character: ch, salsaBottles } = resolveWorldCollections(world);
  if (!ch || !Array.isArray(salsaBottles)) return;
  let changed = false;
  for (const b of salsaBottles) 
    if (!b.collected && ch.isColliding?.(b)) 
      { b.collected = true; changed = true; ch.collectedBottles = (ch.collectedBottles || 0) + 1; 
        world.statusBarBottle?.setCollected?.(ch.collectedBottles); world.audio?.play?.("pickupBottle"); }
  if (!changed) return;
  const lvl = world.level || world;
  if (Array.isArray(lvl.salsaBottles)) lvl.salsaBottles = lvl.salsaBottles.filter(b => !b.collected);
  if (Array.isArray(world.salsaBottles)) world.salsaBottles = world.salsaBottles.filter(b => !b.collected);
}

/**
 *  Applies contact damage with strong overlap thresholds. 
 * */
function checkEnemyContacts(world) {
  const { character: ch, chickens, chickenLittles, endbosses } = resolveWorldCollections(world);
  if (!ch) return;
  const now = Date.now();
  if (ch.invulnerableUntil && ch.invulnerableUntil > now) return;
  const hitL = chickenLittles.some(e => !e.isDead && ch.isColliding?.(e));
  const hitC = chickens.some(e => !e.isDead && ch.isColliding?.(e));
  const hitB = endbosses.some(e => !e.isDead && ch.isColliding?.(e));
  if (!(hitL || hitC || hitB)) return;
  ch.takeDamage?.(hitB ? 20 : hitC ? 12 : 8);
  world.audio?.play?.("hitCharacter");
  ch.invulnerableUntil = now + 500;
}

/** 
 * Runs all collision checks once. 
 * */
function runCollisionChecks(world) {
  checkCoinPickup(world);
  checkGroundBottlePickup(world);
  checkEnemyContacts(world);
}

/** 
 * Hooks collision checks into world's update cycle. 
 * */
function hookCollisionChecksIntoWorldUpdate(world) {
  const hasUpd = typeof world.update === "function";
  if (hasUpd) {
    const o = world.update.bind(world);
    world.update = (...a) => { const r = o(...a); try
      { runCollisionChecks(world); } catch (e) { console.warn(e); } return r; };
  } else if (!world.__collisionInterval) {
    world.__collisionInterval = setInterval(() => 
      { if (!window.gamePaused) try { runCollisionChecks(world); } catch (e) { console.warn(e); } }
    , 1000 / 60);
  }
}

/**
 * Initializes the game world by connecting the canvas and keyboard,
 * and loading the current level into the world.
 */
function init() {
  canvas = document.getElementById("canvas");
  const keyboard = new keyboard();
  const levelTemplate = levels[currentLevelIndex];
  const freshLevel = createLevel(levelTemplate);
  world = new World(canvas, keyboard, freshLevel);
}

/**
 * Adds a CSS hook for touch devices as a robust fallback.
 * Does not show controls until the game actually starts.
 */
(function setTouchClass() {
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (isTouch) document.documentElement.classList.add("is-touch");
})();

/**
 * Resets all virtual key flags to false.
 * Use as a safety net (e.g., on blur/hidden) to avoid "stuck" inputs.
 */
const resetKeys = () =>
  Object.assign(keyboard, {
    LEFT: false,
    RIGHT: false,
    UP: false,
    DOWN: false,
    SPACE: false,
    D: false,
  });

/**
 * Binds pointer-safe press/release handlers to a control element.
 * Uses pointer capture and multiple end/cancel events to prevent "stuck" buttons.
 */
function bind(el, onDown, onUp) {
  if (!el) return;
  const block = e => { e.preventDefault(); e.stopPropagation(); };
  el.addEventListener('contextmenu', block, { passive:false });
  el.addEventListener('pointerdown', e => { block(e); el.setPointerCapture?.(e.pointerId); onDown(); });
  ['pointerup','pointercancel','lostpointercapture','pointerleave','pointerout']
    .forEach(t => el.addEventListener(t, onUp, { passive:false }));
}


/** 
 * Wires up mobile control buttons and global safety nets. 
 * */
function setupMobileControls() {
  bind(document.getElementById("btn-left"),  ()=>keyboard.LEFT=true,  ()=>keyboard.LEFT=false);
  bind(document.getElementById("btn-right"), ()=>keyboard.RIGHT=true, ()=>keyboard.RIGHT=false);
  bind(document.getElementById("btn-jump"),  ()=>{keyboard.UP=keyboard.SPACE=true;}, ()=>{keyboard.UP=keyboard.SPACE=false;});
  bind(document.getElementById("btn-throw"), ()=>keyboard.D=true, ()=>keyboard.D=false);
  window.addEventListener("blur", resetKeys, true);
  document.addEventListener("visibilitychange", ()=>document.hidden&&resetKeys(), true);
}

/** Hardens mobile controls against OS gestures/menus. */
function hardenMobileControls() {
  const root = document.getElementById('mobile-controls'); if (!root) return;
  const block = e => { e.preventDefault(); e.stopPropagation(); };
  ['contextmenu','selectstart','dragstart','gesturestart']
    .forEach(t => root.addEventListener(t, block, { passive:false }));
  root.querySelectorAll('button').forEach(b => {
    b.setAttribute('type','button'); b.setAttribute('tabindex','-1');
    b.addEventListener('dblclick', block, { passive:false });
  });
}

/**
 * Sets up the left and right movement buttons for mobile control.
 */
function setupDirectionalControls() {
  const btnLeft = document.getElementById("btn-left");
  const btnRight = document.getElementById("btn-right");

  btnLeft.addEventListener("touchstart", () => (keyboard.LEFT = true));
  btnLeft.addEventListener("touchend", () => (keyboard.LEFT = false));

  btnRight.addEventListener("touchstart", () => (keyboard.RIGHT = true));
  btnRight.addEventListener("touchend", () => (keyboard.RIGHT = false));
}

/**
 * Sets up the jump button for mobile control.
 * Triggers both UP and SPACE to ensure compatibility.
 */
function setupJumpControl() {
  const btnJump = document.getElementById("btn-jump");

  btnJump.addEventListener("touchstart", () => {
    keyboard.UP = true;
    keyboard.SPACE = true;
  });

  btnJump.addEventListener("touchend", () => {
    keyboard.UP = false;
    keyboard.SPACE = false;
  });
}

/**
 * Sets up the throw button for mobile control.
 * Activates the 'D' key for bottle throwing.
 */
function setupThrowControl() {
  const btnThrow = document.getElementById("btn-throw");

  btnThrow.addEventListener("touchstart", () => (keyboard.D = true));
  btnThrow.addEventListener("touchend", () => (keyboard.D = false));
}

/**
 * Event listener for keydown events. Updates the keyboard object
 * to reflect which keys are currently pressed.
 */
document.addEventListener("keydown", (e) => {
  if ([32, 37, 38, 39, 40].includes(e.keyCode)) e.preventDefault();
  document.activeElement?.blur();
  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }

  if (e.keyCode == 38) {
    keyboard.UP = true;
  }

  if (e.keyCode == 40) {
    keyboard.DOWN = true;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }

  if (e.keyCode == 68) {
    keyboard.D = true;
  }
});

/**
 * Event listener for keyup events. Updates the keyboard object
 * to reflect which keys have been released.
 *
 * @param {KeyboardEvent} e - The keyboard event triggered by user input.
 */
document.addEventListener("keyup", (e) => {
  if ([32, 37, 38, 39, 40].includes(e.keyCode)) e.preventDefault();
  document.activeElement?.blur();
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }

  if (e.keyCode == 38) {
    keyboard.UP = false;
  }

  if (e.keyCode == 40) {
    keyboard.DOWN = false;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }

  if (e.keyCode == 68) {
    keyboard.D = false;
  }
});

/** Global overlay flag; set true while any overlay is open. */
let overlayOpen = false;

/** Block all keyboard input while an overlay is open. Call once. */
function initOverlayKeyBlocker() {
  const block = (e) => {
    if (!overlayOpen) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
    return false;
  };
  window.addEventListener("keydown", block, true);
  window.addEventListener("keyup", block, true);
  window.addEventListener("keypress", block, true);
}

window.addEventListener("DOMContentLoaded", initOverlayKeyBlocker);
