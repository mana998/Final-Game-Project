if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  // used on the server
  // eslint-disable-next-line global-require
  Gem = require('./Gem').Gem;
}

class FreezeGem extends Gem { // Marianna
  constructor(x, y, width, height, value, affectsMe) {
    super(x, y, width, height, value, affectsMe, `You have been frozen for ${value / 1000} seconds`);
    this.values = [5000, 10000, 15000, 20000];
  }

  onCollect(player) {
    super.onCollect();
    if (this.affectsMe) {
      this.freezePlayer(player, this.value);
    } else {
      socket.emit('freezePlayer', this.value);
    }
  }

  //decide whether to reverse for current player or other players
  freezePlayer(player, value) {
    let originalSpeed = player.speed;
    player.speed = 0;
    //reverse back after period of time
    setTimeout ( () => {
      player.speed = originalSpeed;
    }, value);
  }
}


if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { FreezeGem };