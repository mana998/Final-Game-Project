if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  // used on the server
  // eslint-disable-next-line global-require
  Gem = require('./Gem').Gem;
}

class ReverseMovementGem extends Gem { // Marianna
  constructor(x, y, width, height, value, affectsMe) {
    super(x, y, width, height, value, affectsMe);
    this.values = [5000, 10000, 15000, 20000];
  }

  onCollect(player) {
  }


}


if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { ReverseMovementGem };
