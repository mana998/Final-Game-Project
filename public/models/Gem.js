if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  // used on the server
  // eslint-disable-next-line global-require
  Collectible = require('./Collectible').Collectible;
  Sound = require('./Sound').Sound;
}

const collectGemSound = new Sound('gem', 'soundfx');
collectGemSound.sound.volume = 0.2;

class Gem extends Collectible { // Marianna
  constructor(x, y, width, height, value, affectsMe, message) {
    super(x, y, width, height, value);
    this.affectsMe = affectsMe;
    this.message = message;
  }

  onCollect() {
    collectGemSound.play();
    $('#gemEffectMessage').text(this.message);
    setTimeout(() => {
      if ($('#gemEffectMessage').text() === this.message) {
        $('#gemEffectMessage').text('');
      }
    }, 5000)
  }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { Gem };
