// Dagmara
if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  // used on the server
  // eslint-disable-next-line global-require
  Trap = require('./Trap').Trap;
}

class OnOffTrap extends Trap {
  constructor(x, y, width, height, img, value, activeTime, isActive) {
    super(x, y, width, height, img, value);
    this.activeTime = activeTime;
    this.isActive = isActive;

    if (!(typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports)) {
      const trapValue = this.value;
      setInterval(() => {
        if (this.isActive) {
          this.value = 0;
          this.isActive = !this.isActive;
        } else {
          this.value = trapValue;
          this.isActive = !this.isActive;
        }
      }, this.activeTime);
    }
  }

  onCollision(player) {
    if (this.isActive) {
      super.onCollision(player);
    }
  }

  draw(ctx, initX, initY) {
    const x = initX;
    const y = initY;
    this.img.startColumn = 0;
    this.img.currentColumn = 0;
    // object values are equal to 0 so when the isActive is 0 turn off the trap
    if (!this.isActive) {
      this.img.startColumn = 1;
      this.img.currentColumn = 1;
    }
    this.img.draw(ctx, x, y, this.width, this.height);
  }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { OnOffTrap };
