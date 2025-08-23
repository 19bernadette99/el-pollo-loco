class Character extends MoveableObject {
  height = 220;
  width = 110;
  y = 210;
  speed = 10;

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_SLEEPING = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  lastActionTime = Date.now();
  isBeingHit = false;
  hasDied = false;
  isJumping = false;
  world;

  idleFrameDelay = 120;
  sleepFrameDelay = 300;
  lastIdleFrameTime = 0;
  lastSleepFrameTime = 0;
  currentIdleImage = 0;
  currentSleepImage = 0;
  collectedBottles = 0;
  energy = 100;

  _moveLoopId = null;
  _animLoopId = null;
  _soundLoopId = null;

  walkSound = new Audio("audio/walkingSound.mp3");
  jumpSound = new Audio("audio/jumpSound.mp3");
  bottleClinkSound = new Audio("audio/bottleClink.mp3");
  collectCoinSound = new Audio("audio/collectingCoinsSound.mp3");
  snoreSound = new Audio("audio/snore.mp3");

  /**
   * Initializes character assets, physics, audio loops, and a tighter hitbox, then starts animation.
   */
  constructor(keyboard) {
    super();
    this.keyboard = keyboard;
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_SLEEPING);
    this.applyGravity();
    this.animate();
    this.stopSnore();
    this.playSounds();
    this.offset = { left: 12, right: 12, top: 40, bottom: 6 };
  }

  /**
   * Starts the continuous movement loop and the state-driven animation loop.
   */
  animate() {
    this.startMovementLoop();
    this.startAnimationLoop();
  }

  /**
   * Runs input, movement, camera follow, boss/enemy checks, and bottle pickups at ~60 FPS.
   */
  startMovementLoop() {
    if (this._moveLoopId) return;
    this._moveLoopId = setInterval(() => {
      if (gamePaused) return;
      this.handleMovementInput();
      this.world.camera_x = -this.x + 100;
      this.checkEndbossCollisionSpecial();
      this.checkEnemyCollisionsExceptBoss();
      this.checkBottleCollisions();
    }, 1000 / 60);
  }

  /**
   * Chooses and applies the appropriate sprite animation every 50 ms, handling death when energy is depleted.
   */
  startAnimationLoop() {
    if (this._animLoopId) return;
    this._animLoopId = setInterval(() => {
      if (gamePaused || this.hasDied) {
        this.stopSnore();
        return;
      }
      if (this.energy <= 0) return this.die();

      const idleTime = Date.now() - this.lastActionTime;
      this.handleAnimations(idleTime);
    }, 50);
  }

  /**
   * Processes left/right movement and jump input, updating facing and last action time.
   */
  handleMovementInput() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      this.lastActionTime = Date.now();
    }
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      this.lastActionTime = Date.now();
    }
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      this.lastActionTime = Date.now();
    }
  }

  /**
   * Immediately stops and rewinds the snore sound if it is playing.
   */
  stopSnore() {
    if (!this.snoreSound.paused) {
      this.snoreSound.pause();
      this.snoreSound.currentTime = 0;
    }
  }

  /**
   * Forces wake state by stopping snore, resetting timers, and showing the standing frame.
   */
  wakeUpPepe(reason = "manual") {
    this.stopSnore();
    this.lastActionTime = Date.now();
    this.currentSleepImage = 0;
    this.showStandingImage();
  }

  /**
   * Returns whether the character has been idle long enough to be sleeping.
   */
  get isSleeping() {
    const idleTime = Date.now() - this.lastActionTime;
    const isWalking = this.world?.keyboard?.RIGHT || this.world?.keyboard?.LEFT;
    return (
      idleTime > 6000 &&
      !this.isAboveGround() &&
      !isWalking &&
      !this.isHurt() &&
      !this.hasDied &&
      !gamePaused
    );
  }

  /**
   * Starts looping snore audio when sleeping and sound is enabled.
   */
  playSnoreIfNeeded() {
    if (!soundEnabled || !this.isSleeping) return;
    if (this.snoreSound.paused) {
      this.snoreSound.loop = true;
      this.snoreSound.volume = 0.5;
      this.snoreSound.play().catch(() => {});
    }
  }

  /**
   * Selects the current animation based on hurt state, air/ground, movement, and idle timers.
   */
  handleAnimations(idleTime) {
    if (this.isSleeping) {
      this.playSnoreIfNeeded();
      this.animateSleeping();
      return;
    }
    this.stopSnore();
    if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
      this.animateJump();
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    } else if (idleTime > 2000) {
      this.animateIdle();
    } else {
      this.showStandingImage();
    }
  }

  /**
   * Clears all character-owned intervals (movement, animation, sound) and stops snoring.
   */
  stopMovementLoop() {
    if (this._moveLoopId) {
      clearInterval(this._moveLoopId);
      this._moveLoopId = null;
    }
    if (this._animLoopId) {
      clearInterval(this._animLoopId);
      this._animLoopId = null;
    }
    if (this._soundLoopId) {
      clearInterval(this._soundLoopId);
      this._soundLoopId = null;
    }
    this.stopSnore();
  }

  /**
   * Starts a ~60 FPS sound loop to handle walking and jump audio cues.
   */
  playSounds() {
    if (this._soundLoopId) return;
    this._soundLoopId = setInterval(() => {
      if (!soundEnabled) return;
      this.handleWalkSound();
      this.handleJumpSound();
    }, 1000 / 60);
  }

  /**
   * Plays or resets the walking sound while moving on the ground.
   */
  handleWalkSound() {
    const right = this.world.keyboard.RIGHT;
    const left = this.world.keyboard.LEFT;
    if (!this.isAboveGround() && (right || left)) {
      if (this.walkSound.currentTime > 3.7) {
        this.walkSound.currentTime = 0;
      }
      this.walkSound.volume = 0.6;
      this.walkSound.play();
    } else {
      this.walkSound.pause();
      this.walkSound.currentTime = 0;
    }
  }

  /**
   * Plays a short jump sound when the jump key is pressed while grounded.
   */
  handleJumpSound() {
    const jump = this.world.keyboard.SPACE;
    if (jump && !this.isAboveGround()) {
      const jumpClone = this.jumpSound.cloneNode();
      jumpClone.volume = 0.5;
      jumpClone.play();
    }
  }

  /**
   * Plays the hurt sound effect if global sound is enabled.
   */
  playHurtSound() {
    if (!soundEnabled) return;
    const sound = new Audio("audio/hurtSound.mp3");
    sound.volume = 0.4;
    sound.play();
  }

  /**
   * Cycles through idle frames at a fixed delay after short inactivity.
   */
  animateIdle() {
    let now = Date.now();
    if (now - this.lastIdleFrameTime > this.idleFrameDelay) {
      this.img = this.imageCache[this.IMAGES_IDLE[this.currentIdleImage]];
      this.currentIdleImage++;
      if (this.currentIdleImage >= this.IMAGES_IDLE.length) {
        this.currentIdleImage = 0;
      }
      this.lastIdleFrameTime = now;
    }
  }

  /**
   * Cycles through sleeping frames at a fixed delay after long inactivity.
   */
  animateSleeping() {
    let now = Date.now();
    if (now - this.lastSleepFrameTime > this.sleepFrameDelay) {
      this.img = this.imageCache[this.IMAGES_SLEEPING[this.currentSleepImage]];
      this.currentSleepImage =
        (this.currentSleepImage + 1) % this.IMAGES_SLEEPING.length;
      this.lastSleepFrameTime = now;
    }
  }

  /**
   * Initiates a jump by setting vertical speed when grounded.
   */
  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 30;
      this.isJumping = true;
    }
  }

  /**
   * Displays the first walking frame as a neutral standing pose.
   */
  showStandingImage() {
    this.img = this.imageCache[this.IMAGES_WALKING[0]];
  }

  /**
   * Updates jump animation by phase or shows the start frame once.
   */
  animateJump() {
    if (this.startJumpFrame()) return;
    this.updateJumpFrame();
  }

  /**
   * Shows the initial jump frame and marks jumping, returning true when triggered.
   */
  startJumpFrame() {
    if (!this.isJumping) {
      this.img = this.imageCache[this.IMAGES_JUMPING[2]];
      this.isJumping = true;
      return true;
    }
    return false;
  }

  /**
   * Advances the jump/fall frame based on vertical speed and state.
   */
  updateJumpFrame() {
    if (this.isFallingFast()) {
      this.img = this.imageCache[this.IMAGES_JUMPING[6]];
    } else if (this.isFallingMid()) {
      this.img = this.imageCache[this.IMAGES_JUMPING[5]];
    } else if (this.isAtJumpPeak()) {
      this.img = this.imageCache[this.IMAGES_JUMPING[4]];
    } else if (this.isRising()) {
      this.img = this.imageCache[this.IMAGES_JUMPING[3]];
    } else {
      this.img = this.imageCache[this.IMAGES_JUMPING[7]];
      this.isJumping = false;
    }
  }

  /**
   * Returns true while ascending and not hurt.
   */
  isRising() {
    return this.speedY >= 0.5 && !this.isHurt();
  }

  /**
   * Returns true around the apex of the jump.
   */
  isAtJumpPeak() {
    return this.isOnJumpPeak();
  }

  /**
   * Returns true for moderate downward speed while not hurt.
   */
  isFallingMid() {
    return this.speedY <= -0.2 && this.speedY >= -0.6 && !this.isHurt();
  }

  /**
   * Returns true for fast downward movement while airborne and not hurt.
   */
  isFallingFast() {
    return this.speedY < -0.6 && !this.isHurt() && this.isAboveGround();
  }

  /**
   * Returns true when vertical speed is near zero at peak while airborne.
   */
  isOnJumpPeak() {
    return (
      this.speedY < 0.5 &&
      this.speedY > -0.2 &&
      !this.isHurt() &&
      this.isAboveGround()
    );
  }

  /**
   * Handles collision with the active Endboss, bouncing on stomp or taking damage otherwise.
   */
  checkEndbossCollisionSpecial() {
    const enemies = this.world?.level?.enemies || [];
    const boss = enemies.find(
      (e) => e instanceof Endboss && !e.isDead && !e.hasDied
    );
    if (!boss) return;
    if (!this.isColliding(boss)) return;
    if (this.isJumpingOn(boss)) {
      this.bounce();
    } else if (!this.isBeingHit) {
      this.hit();
    }
  }

  /**
   * Resolves collisions with non-boss enemies, stomping to kill or taking damage otherwise.
   */
  checkEnemyCollisionsExceptBoss() {
    const enemies = (this.world?.level?.enemies || []).filter(
      (e) => !(e instanceof Endboss)
    );
    enemies.forEach((enemy) => {
      if (this.isColliding(enemy) && !enemy.hasDied) {
        if (this.isJumpingOn(enemy)) {
          enemy.die?.();
          this.bounce();
        } else if (!this.isBeingHit) {
          this.hit();
        }
      }
    });
  }

  /**
   * Determines if the character is stomping an enemy from above based on overlap and vertical motion.
   */
  isJumpingOn(enemy) {
    const horizontallyOverlaps =
      this.x + this.width > enemy.x + enemy.width * 0.2 &&
      this.x < enemy.x + enemy.width * 0.8;
    const verticallyOverlaps =
      this.speedY < 0 &&
      this.y + this.height > enemy.y &&
      this.y < enemy.y &&
      this.y + this.height - enemy.y < enemy.height / 2;
    return horizontallyOverlaps && verticallyOverlaps;
  }

  /**
   * Collects ground bottles on collision, updates the UI counter, plays SFX, and removes the bottle.
   */
  checkBottleCollisions() {
    if (this.world?.level?.salsaBottles) {
      this.world.level.salsaBottles.forEach((bottle, index) => {
        if (this.isColliding(bottle)) {
          this.collectedBottles += 1;
          this.world.statusBarBottle.setCollected(
            this.world.statusBarBottle.collected + 1
          );
          playSound("bottleClink");
          this.world.level.salsaBottles.splice(index, 1);
        }
      });
    }
  }

  /**
   * Detects hits from thrown bottles on the active Endboss and delegates damage handling.
   */
  checkBottleHitsEndboss() {
    const enemies = this.world?.level?.enemies || [];
    const boss = enemies.find(
      (e) => e instanceof Endboss && e.isActive && !e.isDead
    );
    if (!boss) return;
    const bottles = this.world?.throwableObjects || [];
    bottles.forEach((bottle) => {
      if (!bottle || bottle.hasSplashed) return;
      if (bottle.isColliding?.(boss)) {
        boss.onBottleCollision?.(bottle, 20);
      }
    });
  }

  /**
   * Throws a bottle if available, spawning a throwable and decrementing the status bar count.
   */
  throwBottle() {
    const bottlesLeft = this.world.statusBarBottle.collected;
    if (bottlesLeft > 0) {
      let bottle = new ThrowableObject(this.x, this.y, this.otherDirection);
      this.world.throwableObjects = this.world.throwableObjects || [];
      this.world.throwableObjects.push(bottle);
      this.world.statusBarBottle.setCollected(bottlesLeft - 1);
    }
  }

  /**
   * Applies a small upward impulse after a stomp.
   */
  bounce() {
    this.speedY = 15;
  }

  /**
   * Runs the death animation sequence and schedules character removal.
   */
  die() {
    this.stopSnore();
    this.hasDied = true;
    this.speed = 0;
    let i = 0;
    const interval = setInterval(() => {
      if (i < this.IMAGES_DEAD.length) {
        this.img = this.imageCache[this.IMAGES_DEAD[i++]];
      } else {
        clearInterval(interval);
        setTimeout(() => this.removeCharacter(), 400);
      }
    }, 120);
  }

  /**
   * Removes the character from play and shows the game over overlay.
   */
  removeCharacter() {
    this.stopSnore();
    this.speed = 0;
    this.y = 1000;
    this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
    showGameOverOverlay();
  }

  /**
   * Throttles and plays a short walking sound clip if sound is enabled.
   */
  playWalkSound() {
    if (!soundEnabled) return;
    if (!this.lastWalkSoundTime || Date.now() - this.lastWalkSoundTime > 400) {
      const sound = this.walkSound.cloneNode();
      sound.volume = 0.4;
      sound.play();
      this.lastWalkSoundTime = Date.now();
    }
  }
}
