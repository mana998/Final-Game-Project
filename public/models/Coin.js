if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  // used on the server
  // eslint-disable-next-line global-require
  Collectible = require('./Collectible').Collectible;
}

class Coin extends Collectible { // Marianna
  constructor(x, y, width, height, value) {
    super(x, y, width, height, value);
  }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { Coin };
