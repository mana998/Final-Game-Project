if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  // used on the server
  // eslint-disable-next-line global-require
  GameObject = require('./GameObject').GameObject;
  Sound = require('./Sound').Sound;
}

const trapSound = new Sound('hit', 'soundfx');
trapSound.sound.volume = 0.2;

class Trap extends GameObject {
  constructor(x, y, width, height, img, value) {
    super(x, y, width, height, img);
    this.value = value;
    this.values = [0.01, 0.02, 0.1, 0.05, 0.25];
  }

  onCollision(player) {
    player.health -= this.value;
    const healthCutout = 4.54 - 4.14 * player.health * 0.1; // 4.54 - 0.4 = max - min, full value * percentage of health + min value
    $('#healthFill').css('clip', `rect(${healthCutout}em, 5em, 5em, 0)`);
    trapSound.play();
  }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { Trap };
