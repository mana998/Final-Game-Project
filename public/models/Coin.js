if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  // used on the server
  // eslint-disable-next-line global-require
  Collectible = require('./Collectible').Collectible;
  Sound = require('./Sound').Sound;
}

const collectCoinSound = new Sound('coin', 'soundfx');
collectCoinSound.sound.volume = 0.2;

class Coin extends Collectible { // Marianna
  constructor(x, y, width, height, value) {
    super(x, y, width, height, value);
  }

  onCollect(player) {
    player.score += this.value;
    collectCoinSound.play();
    $('#scoreValue').text(player.score);
  }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { Coin };
