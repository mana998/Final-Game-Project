if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  // used on the server
  // eslint-disable-next-line global-require
  GameObject = require('./GameObject').GameObject;
}

class Collectible extends GameObject { // Marianna
  constructor(x, y, width, height, value) {
    super(x, y, width, height);
    this.value = value;
  }

  onCollect() {
    // method stays for future implementations
  }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { Collectible };
