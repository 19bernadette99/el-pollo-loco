class Endboss extends MoveableObject {
  height = 350;
  width = 350;
  y = 90;
  percentage = 100;
  isHurt = false;
  isDead = false;
  hasStartedAttack = false;
  scale = 1;
  rotation = 0;
  isShrinking = false;
  shrinkStart = 0;
  shrinkDuration = 1000;

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
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
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.hasStartedAttack) {
        this.playAnimation(this.IMAGES_ATTACKING);
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200);
  }

  die() {
    this.isDead = true;
    this.isShrinking = true;
    this.shrinkStart = Date.now();
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
}
