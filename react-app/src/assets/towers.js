export class Tower {
  constructor(type, attack, range, speed) {
    this.type = type;
    this.attack = attack;
    this.range = range;
    this.speed = speed;
  }
  getStats() {
    return {
      type: this.type,
      attack: this.attack,
      range: this.range,
      speed: this.speed
    };
  }
}
const basicTower = new Tower('basic', 5, 2, 1.0);
const fastTower = new Tower('fast', 1, 2, 5.0);
const closeTower = new Tower('close', 15, 1, 0.5);
const allTowers = {"basic": JSON.stringify(basicTower), "fast": JSON.stringify(fastTower), "close": JSON.stringify(closeTower)}

export default allTowers