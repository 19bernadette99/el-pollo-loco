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

  constructor(keyboard) {
    super();
    this.keyboard = keyboard;
    this.loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_SLEEPING);
    this.applyGravity();
    this.animate();
  }

  animate() {
    setInterval(() => {
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

      this.world.camera_x = -this.x + 100;

      this.checkEnemyCollisions();
      this.checkBottleCollisions();
    }, 1000 / 60);

    setInterval(() => {
      const timeSinceLastAction = Date.now() - this.lastActionTime;

      if (this.isBeingHit) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.hasDied) {
        this.img =
          this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
      } else if (this.isAboveGround()) {
        this.animateJump();
      } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(this.IMAGES_WALKING);
      } else if (timeSinceLastAction > 5000) {
        this.animateSleeping();
      } else if (timeSinceLastAction > 2000) {
        this.animateIdle();
      } else {
        this.showStandingImage();
      }
    }, 50);
  }

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

  animateSleeping() {
    let now = Date.now();
    if (now - this.lastSleepFrameTime > this.sleepFrameDelay) {
      this.img = this.imageCache[this.IMAGES_SLEEPING[this.currentSleepImage]];
      this.currentSleepImage++;
      if (this.currentSleepImage >= this.IMAGES_SLEEPING.length) {
        this.currentSleepImage = 0;
      }
      this.lastSleepFrameTime = now;
    }
  }

  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 30;
      this.isJumping = true;
    }
  }

  showStandingImage() {
    this.img = this.imageCache[this.IMAGES_WALKING[0]];
  }

  animateJump() {
    if (!this.isJumping) {
      this.img = this.imageCache[this.IMAGES_JUMPING[2]];
      this.isJumping = true;
      return;
    }
    if (this.speedY >= 0.5 && !this.isHurt()) {
      this.img = this.imageCache[this.IMAGES_JUMPING[3]];
    } else if (this.isOnJumpPeak()) {
      this.img = this.imageCache[this.IMAGES_JUMPING[4]];
    } else if (this.speedY <= -0.2 && this.speedY >= -0.6 && !this.isHurt()) {
      this.img = this.imageCache[this.IMAGES_JUMPING[5]];
    } else if (this.speedY < -0.6 && !this.isHurt() && this.isAboveGround()) {
      this.img = this.imageCache[this.IMAGES_JUMPING[6]];
    } else {
      this.img = this.imageCache[this.IMAGES_JUMPING[7]];
      this.isJumping = false;
    }
  }

  isOnJumpPeak() {
    return (
      this.speedY < 0.5 &&
      this.speedY > -0.2 &&
      !this.isHurt() &&
      this.isAboveGround()
    );
  }

  checkEnemyCollisions() {
    this.world.level.enemies.forEach((enemy) => {
      if (this.isColliding(enemy) && !enemy.hasDied) {
        if (this.isJumpingOn(enemy)) {
          enemy.die();
          this.bounce();
        } else if (!this.isHurt()) {
          this.hit();
          this.world.statusBar.setPercentage(this.energy);
        }
      }
    });
  }

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

  checkBottleCollisions() {
    if (this.world?.level?.salsaBottles) {
      this.world.level.salsaBottles.forEach((bottle, index) => {
        if (this.isColliding(bottle)) {
          this.collectedBottles += 1;
          this.world.statusBarBottle.setCollected(
            this.world.statusBarBottle.collected + 1
          );
          this.world.level.salsaBottles.splice(index, 1);
        }
      });
    }
  }

  throwBottle() {
    const bottlesLeft = this.world.statusBarBottle.collected;
    if (bottlesLeft > 0) {
      let bottle = new ThrowableObject(this.x, this.y, this.otherDirection);
      this.world.throwableObjects.push(bottle);
      this.world.statusBarBottle.setCollected(bottlesLeft - 1);
    }
  }

  bounce() {
    this.speedY = 15;
  }
}
