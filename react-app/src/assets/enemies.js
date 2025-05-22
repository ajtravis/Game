export class Enemy {
  constructor(type, damage, health, speed) {
    this.type = type;
    this.damage = damage;
    this.health = health;
    this.speed = speed;
  }
  getStats() {
    return {
      type: this.type,
      damage: this.damage,
      health: this.health,
      speed: this.speed
    };
  }
};

const basicEnemy = new Enemy("basic", 1, 10, 1);
const fastEnemy = new Enemy("fast", 1, 5, 5);
const tankyEnemy = new Enemy("tanky", 5, 50, 0.5);

const enemiesObject = {
  basic: basicEnemy,
  fast: fastEnemy,
  tanky: tankyEnemy
};

export default enemysObject