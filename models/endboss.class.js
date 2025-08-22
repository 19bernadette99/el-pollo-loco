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

  deathComplete = false;

  currentWalkingImage = 0;
  currentAttackingImage = 0;
  currentHurtImage = 0;
  currentDeadImage = 0;
  currentAlertImage = 0;

  _walkSpritesLoaded = false;
  _lastWalkFrameAt = 0;
  walkFrameDelay = 120; 

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
    super();
    this.loadImage("img/4_enemie_boss_chicken/2_alert/G5.png");
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALKING);
    this._walkSpritesLoaded = true;
    this.loadImages(this.IMAGES_ATTACKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2400;
    this.speed = 10;
  }

  isPepeInRange(range = 900) {
    const pepe = this.world?.character;
    if (!pepe) return false;
    return Math.abs(this.x - pepe.x) <= range;
  }

  activate() {
    this.isActive = true;
    this.isAlert = true;
    this.animate();
  }

  animate() {
    if (!this.isActive || this.isDead) return;
    this.animationInterval = setInterval(() => this.handleState(), 120);
  }

  handleState() {
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

  ensureWalkingSpritesLoaded() {
    if (this._walkSpritesLoaded) return;
    this.loadImages(this.IMAGES_WALKING);
    this._walkSpritesLoaded = true;
  }

  stepWalkingAnimation() {
    this.ensureWalkingSpritesLoaded();
    const now = performance.now();
    if (now - this._lastWalkFrameAt < this.walkFrameDelay) return;
    this.currentWalkingImage =
      (this.currentWalkingImage + 1) % this.IMAGES_WALKING.length;
    this.img = this.imageCache[this.IMAGES_WALKING[this.currentWalkingImage]];
    this._lastWalkFrameAt = now;
  }

  /**
   * Moves boss toward Pepe and switches to attack if close.
   */
  walkTowardsPepe() {
    const pepe = this.world.character;
    this.otherDirection = pepe.x > this.x;
    this.x += this.otherDirection ? this.speed : -this.speed;
    this.stepWalkingAnimation();
    if (Math.abs(this.x - pepe.x) < 150) {
      this.isWalkingToPepe = false;
      this.startAttack();
      this.currentWalkingImage = 0;
      this._lastWalkFrameAt = 0;
    }
  }

  playAttackAnimation() {
    this.otherDirection = this.world.character.x > this.x;
    if (!this._lastAttackFrameAt) this._lastAttackFrameAt = 0;
    if (Date.now() - this._lastAttackFrameAt < 200) return;
    this._lastAttackFrameAt = Date.now();
    this.playAnimation(this.IMAGES_ATTACKING, "attacking");
  }

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

  limitFrameIndex(indexName, max, type) {
    if (this[indexName] >= max) {
      this[indexName] = type === "dead" ? max - 1 : 0;
    }
  }

  startAttack() {
    if (!this.hasStartedAttack) {
      this.hasStartedAttack = true;
      this.speed = 12;
    }
  }

  /**
   * Damage handling
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

  triggerBehavior() {
    if (this.isAlert) {
      this.isAlert = false;
      this.isWalkingToPepe = true;
    } else if (!this.hasStartedAttack && !this.isWalkingToPepe) {
      this.isWalkingToPepe = true;
    }
  }

  reactToHit() {
    this.isHurt = true;
    playSound("chickenAlarm");
    setTimeout(() => (this.isHurt = false), 500);
  }

  /**
   * Death + shrink sequence. Level darf erst NACH shrink weitergehen.
   */
  die() {
    this.isDead = true;
    this.isShrinking = true;
    this.shrinkStart = Date.now();

    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }

    this._deadAnimInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_DEAD, "dead");
    }, 120);

    this.isActive = true;

    this.animateShrink();
  }

  animateShrink() {
    const step = () => {
      const elapsed = Date.now() - this.shrinkStart;
      const t = Math.min(1, elapsed / this.shrinkDuration);
      this.rotation = 360 * t;
      this.scale = 1 - t;

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        if (this._deadAnimInterval) {
          clearInterval(this._deadAnimInterval);
          this._deadAnimInterval = null;
        }
        this.deathComplete = true;
        this.removeFromWorld();
        this.triggerNextEndboss();
        this.world?.onEndbossDeathComplete?.(this);
      }
    };
    requestAnimationFrame(step);
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

  draw(ctx) {
    if (!this.isActive) return;
    if (this.isShrinking) {
      this.drawShrinking(ctx);
    } else {
      super.draw(ctx);
    }
  }

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

  removeFromWorld() {
    if (this.world) {
      const idx = this.world.level.enemies.indexOf(this);
      if (idx !== -1) {
        this.world.level.enemies.splice(idx, 1);
      }
    }
  }

  onBottleCollision(bottle, damage = 20) {
    if (!bottle?.hasSplashed) {
      bottle.onEndbossHit?.();
    }
    this.hit(damage);
  }

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
