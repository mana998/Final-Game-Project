if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  // used on the server
  // eslint-disable-next-line global-require
  Collectible = require('./Collectible').Collectible;
  Sound = require('./Sound').Sound;
}

const collectGemSound = new Sound('gem');
collectGemSound.sound.volume = 0.2;

class Gem extends Collectible { // Marianna
  constructor(x, y, width, height, value, affectsMe) {
    super(x, y, width, height, value);
    this.affectsMe = affectsMe;
  }

  onCollect() {
    collectGemSound.play();
  }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { Gem };
