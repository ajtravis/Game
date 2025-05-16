class Tower {
  constructor(attack, range, speed) {
    this.attack = attack;
    this.range = range;
    this.speed = speed;
  }
  getStats() {
    return {
      attack: this.attack,
      range: this.range,
      speed: this.speed
    };
  }
}
const basicTower = new Tower(5, 2, 1.0);
const fastTower = new Tower(1, 2, 5.0);
const closeTower = new Tower(15, 1, 0.5);
const allTowers = [basicTower, fastTower, closeTower]

export {Tower, allTowers}