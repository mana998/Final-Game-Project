if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  // used on the server
  // eslint-disable-next-line global-require
  Collectible = require('./Collectible').Collectible;
}

class Gem extends Collectible { // Marianna
  constructor(x, y, width, height, value, affectsMe) {
    super(x, y, width, height, value);
    this.affectsMe = affectsMe;
  }

  onCollect() {
    console.log('Better luck next time');
  }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { Gem };
