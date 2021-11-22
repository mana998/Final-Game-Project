if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  // used on the server
  // eslint-disable-next-line global-require
  GameObject = require('./GameObject').GameObject;
}

class Gem extends GameObject { // Marianna
  constructor(x, y, width, height, value) {
    super(x, y, width, height);
  }

  onCollect() {
    console.log('Better luck next time');
  }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { Gem };
