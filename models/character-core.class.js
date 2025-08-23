class CharacterCore extends MoveableObject {
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
}
