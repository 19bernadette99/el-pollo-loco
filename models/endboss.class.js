class Endboss extends MoveableObject {
  height = 350;
  width = 350;
  y = 90;
  percentage = 100;
  isHurt = false;
  isDead = false;
  isAlert = true;
  isWalkingToPepe = false;
  isActive = false;
  activateDistance = 1000; 

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

  /**
   * Creates the Endboss, loads all animations, and starts animation loop.
   */
  constructor() {
    super().loadImage("img/4_enemie_boss_chicken/2_alert/G5.png");
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2400;
    this.speed = 10;
  }

  /**
   * Quick proximity check to switch from alert to walking.
   */
  isPepeInRange(range = 900) {
    const pepe = this.world?.character;
    if (!pepe) return false;
    return Math.abs(this.x - pepe.x) <= range;
  }

  /**
   * Activates the boss and starts its animation logic.
   */
  activate() {
    this.isActive = true;
    this.isAlert = true;
    this.animate();
  }

  /**
   * Starts main animation loop if boss is alive and active.
   */
animate() {
  if (!this.isActive || this.isDead) return;
  this.animationInterval = setInterval(() => this.handleState(), 120);
}

  /**
   * Handles animation based on current state flags.
   * Walking is prioritized over alert to avoid sliding.
   */
  handleState() {
    // auto-switch from alert to walking if Pepe is close enough
    if (!this.isDead && !this.hasStartedAttack && this.isPepeInRange()) {
      this.isAlert = false;
      this.isWalkingToPepe = true;
    }
    if (this.isDead) return this.playAnimation(this.IMAGES_DEAD, "dead");
    if (this.isHurt) return this.playAnimation(this.IMAGES_HURT, "hurt");
    if (this.isWalkingToPepe) return this.walkTowardsPepe();
    if (this.isAlert) return this.playAnimation(this.IMAGES_ALERT, "alert");
    if (this.hasStartedAttack) return this.playAttackAnimation();

    this.playAnimation(this.IMAGES_WALKING, "walking");
  }

  /**
   * Moves boss toward Pepe and switches to attack if close.
   */
  walkTowardsPepe() {
    const pepe = this.world.character;
    this.otherDirection = pepe.x > this.x;
    this.x += this.otherDirection ? this.speed : -this.speed;

    this.playAnimation(this.IMAGES_WALKING, "walking");

    if (Math.abs(this.x - pepe.x) < 150) {
      this.isWalkingToPepe = false;
      this.startAttack();
      this.currentWalkingImage = 0; 
    }
  }

  /**
   * Handles attack animation facing towards Pepe.
   */
  playAttackAnimation() {
    this.otherDirection = this.world.character.x > this.x;
    this.playAnimation(this.IMAGES_ATTACKING, "attacking");
  }

  /**
   * Plays animation for the given type using the correct frame index..
   */
  playAnimation(images, type) {
    const map = {
      alert: "currentAlertImage",
      walking: "currentWalkingImage",
      attacking: "currentAttackingImage",
      hurt: "currentHurtImage",
      dead: "currentDeadImage",
    };
    const indexName = map[type];
    this.img = this.imageCache[images[this[indexName]]];
    this[indexName]++;
    this.limitFrameIndex(indexName, images.length, type);
  }

  /**
   * Limits animation index to avoid out-of-bounds errors.
   */
  limitFrameIndex(indexName, max, type) {
    if (this[indexName] >= max) {
      this[indexName] = type === "dead" ? max - 1 : 0;
    }
  }

  /**
   * Starts the boss's attack behavior.
   */
  startAttack() {
    if (!this.hasStartedAttack) {
      this.hasStartedAttack = true;
      this.speed = 12;
    }
  }

  /**
   * Applies damage and triggers boss reaction or death.
   * @param {number} damage - Amount of damage dealt.
   */
  hit(damage) {
    if (this.isDead) return;

    this.triggerBehavior();
    this.percentage -= damage;

    if (this.percentage <= 0) {
      this.percentage = 0;
      this.die();
    } else {
      this.reactToHit();
    }
  }

  /**
   * Updates boss behavior based on current state.
   */
  triggerBehavior() {
    if (this.isAlert) {
      this.isAlert = false;
      this.isWalkingToPepe = true;
    } else if (!this.hasStartedAttack && !this.isWalkingToPepe) {
      this.isWalkingToPepe = true;
    }
  }

  /**
   * Plays hurt reaction and resets hurt state after delay.
   */
  reactToHit() {
    this.isHurt = true;
    playSound("chickenAlarm");
    setTimeout(() => (this.isHurt = false), 500);
  }

  /**
   * Triggers the boss's death sequence and shrink animation.
   */
  die() {
    this.isDead = true;
    this.isShrinking = true;
    this.shrinkStart = Date.now();

    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }

    this.animateShrink();
  }

  /**
   * Shrinks and rotates the boss before removing it from the world.
   */
  animateShrink() {
    const animate = () => {
      const elapsed = Date.now() - this.shrinkStart;
      const t = Math.min(1, elapsed / this.shrinkDuration);
      this.rotation = 360 * t;
      this.scale = 1 - t;
      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        this.removeFromWorld();
        this.triggerNextEndboss();
      }
    };
    requestAnimationFrame(animate);
  }

  triggerNextEndboss() {
    if (!this.world) return;

    const next = this.world.level.enemies.find(
      (e) => e instanceof Endboss && !e.isDead && !e.isActive
    );
    if (next) {
      next.activate();
    }
  }

  /**
   * Draws the boss (shrinking if dying).
   */
  draw(ctx) {
    if (!this.isActive) return;

    if (this.isShrinking) {
      this.drawShrinking(ctx);
    } else {
      super.draw(ctx);
    }
  }

  /**
   * Draws boss with rotation and scale for shrinking effect.
   */
  drawShrinking(ctx) {
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
  }

  /**
   * Removes the boss from the world's enemy list.
   */
  removeFromWorld() {
    if (this.world) {
      const idx = this.world.level.enemies.indexOf(this);
      if (idx !== -1) {
        this.world.level.enemies.splice(idx, 1);
      }
    }
  }

  /**
   * Called when a thrown bottle collides with the Endboss.
   * Mutes bottle splash SFX and applies damage.
   */
  onBottleCollision(bottle, damage = 20) {
    if (!bottle?.hasSplashed) {
      bottle.onEndbossHit?.();
    }
    this.hit(damage);
  }

  /**
 * Auto-activates this boss when the player gets close.
 */
tryAutoActivate(world) {
  if (this.isDead || this.isActive) return;
  if (!world?.character) return;
  const enemies = world.level?.enemies || [];
  const anotherActive = enemies.some(
    (e) => e instanceof Endboss && e !== this && e.isActive && !e.isDead
  );
  if (anotherActive) return;
  const dist = Math.abs(this.x - world.character.x);
  if (dist <= (this.activateDistance ?? 1000)) {
    this.world = this.world || world;
    this.activate();
    this.isAlert = false;
    this.isWalkingToPepe = true;
  }
}
}
