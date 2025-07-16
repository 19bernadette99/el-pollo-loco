class Endboss extends MoveableObject {
  height = 350;
  width = 350;
  y = 90;
  percentage = 100;
  isHurt = false;
  isDead = false;
  isAlert = true;
  isWalkingToPepe = false;

  hasStartedAttack = false;
  scale = 1;
  rotation = 0;
  isShrinking = false;
  shrinkStart = 0;
  shrinkDuration = 1000;
  currentWalkingImage = 0;
  currentAttackingImage = 0;
  currentHurtImage = 0;
  currentDeadImage = 0;
  currentAlertImage = 0;

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ATTACKING = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  constructor() {
    super().loadImage("img/4_enemie_boss_chicken/2_alert/G5.png");
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2400;
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.isDead) {
        this.playAnimation(this.IMAGES_DEAD, "dead");
      } else if (this.isHurt) {
        this.playAnimation(this.IMAGES_HURT, "hurt");
      } else if (this.isAlert) {
        this.playAnimation(this.IMAGES_ALERT, "alert");
      } else if (this.isWalkingToPepe) {
        let pepe = this.world.character;

        if (pepe.x < this.x) {
          this.otherDirection = false;
          this.x -= this.speed;
        } else {
          this.otherDirection = true;
          this.x += this.speed;
        }

        this.playAnimation(this.IMAGES_WALKING, "walking");

        let distance = Math.abs(this.x - pepe.x);
        if (distance < 150) {
          this.isWalkingToPepe = false;
          this.startAttack();
        }
      } else if (this.hasStartedAttack) {
        let pepe = this.world.character;

        if (pepe.x < this.x) {
          this.otherDirection = false;
        } else {
          this.otherDirection = true;
        }

        this.playAnimation(this.IMAGES_ATTACKING, "attacking");
      } else {
        this.playAnimation(this.IMAGES_WALKING, "walking");
      }
    }, 200);
  }

  playAnimation(images, animationType) {
    switch (animationType) {
      case "alert":
        this.img = this.imageCache[images[this.currentAlertImage]];
        this.currentAlertImage++;
        if (this.currentAlertImage >= images.length) {
          this.currentAlertImage = 0;
        }
        break;

      case "walking":
        this.img = this.imageCache[images[this.currentWalkingImage]];
        this.currentWalkingImage++;
        if (this.currentWalkingImage >= images.length) {
          this.currentWalkingImage = 0;
        }
        break;

      case "attacking":
        this.img = this.imageCache[images[this.currentAttackingImage]];
        this.currentAttackingImage++;
        if (this.currentAttackingImage >= images.length) {
          this.currentAttackingImage = 0;
        }
        break;

      case "hurt":
        this.img = this.imageCache[images[this.currentHurtImage]];
        this.currentHurtImage++;
        if (this.currentHurtImage >= images.length) {
          this.currentHurtImage = 0;
        }
        break;

      case "dead":
        this.img = this.imageCache[images[this.currentDeadImage]];
        this.currentDeadImage++;
        if (this.currentDeadImage >= images.length) {
          this.currentDeadImage = images.length - 1;
        }
        break;
    }
  }

  startAttack() {
    if (!this.hasStartedAttack) {
      this.hasStartedAttack = true;
      this.speed = 12;
    }
  }

  die() {
    this.isDead = true;
    this.isShrinking = true;
    this.shrinkStart = Date.now();

    if (this.moveInterval) {
      clearInterval(this.moveInterval);
    }

    this.animateShrink();
  }

  animateShrink() {
    const animate = () => {
      let elapsed = Date.now() - this.shrinkStart;
      let t = elapsed / this.shrinkDuration;

      if (t > 1) t = 1;

      this.rotation = 360 * t;

      this.scale = 1 - t;

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        this.removeFromWorld();
      }
    };

    requestAnimationFrame(animate);
  }

  draw(ctx) {
    if (this.isShrinking) {
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.scale(this.scale, this.scale);
      ctx.drawImage(
        this.img,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
      ctx.restore();
    } else {
      super.draw(ctx);
    }
  }

  removeFromWorld() {
    if (this.world) {
      let index = this.world.level.enemies.indexOf(this);
      if (index !== -1) {
        this.world.level.enemies.splice(index, 1);
      }
    }
  }

  hit(damage) {
    if (this.isDead) return;

    if (this.isAlert) {
      this.isAlert = false;
      this.isWalkingToPepe = true; // neu
      this.speed = 10;
    } else if (!this.hasStartedAttack && !this.isWalkingToPepe) {
      this.isWalkingToPepe = true;
      this.speed = 10;
    }

    this.percentage -= damage;

    if (this.percentage <= 0) {
      this.percentage = 0;
      this.die();
    } else {
      this.isHurt = true;
      setTimeout(() => {
        this.isHurt = false;
      }, 500);
    }
  }
}
