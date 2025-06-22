class Character extends MoveableObject {
  height = 280;
  width = 140;
  // y = 155;
  y = 80;
  speed = 10; // Speed of the character
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

  isBeingHit = false;
  hasDied = false;
  isJumping = false;
  world;
  // walking_sound = new Audio("audio/walking.mp3");
  //jumpSound = new Audio("audio/jump.mp3");
  
  constructor(keyboard) {
    super();
    this.loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.applyGravity();
    this.animate();

    this.keyboard = keyboard;
  }

  animate() {
    setInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
        this.otherDirection = false;
      }
      if (this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
      }
      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.jump();
      }

      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);

    setInterval(() => {
      if (this.isBeingHit) {
        this.playAnimation(this.IMAGES_DEAD);
        if (this.currentImage >= this.IMAGES_DEAD.length) {
          this.isBeingHit = false;
          this.currentImage = 0;
        }
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.hasDied) {
        this.img =
          this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
      } else if (this.isAboveGround()) {
        this.animateJump();
      } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 50);
  }

  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 30;
      this.isJumping = true;
    }
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
}
