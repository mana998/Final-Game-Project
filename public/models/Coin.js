if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
    // used on the server
    // eslint-disable-next-line global-require
    GameObject = require('./GameObject').GameObject;
}

class Coin extends GameObject { // Marianna
  constructor(x, y, width, height, value) {
    super(x, y, width, height, new Img('./assets/images/game/coin.png', 0, 0, 0, 4, 5, 1));
    this.value = value;
  }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { Coin };
