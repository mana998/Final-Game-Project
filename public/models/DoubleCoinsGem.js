if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  // used on the server
  // eslint-disable-next-line global-require
  Gem = require('./Gem').Gem;
}

class DoubleCoinsGem extends Gem { // Marianna
  constructor(x, y, width, height, value, affectsMe) {
    super(x, y, width, height, value, affectsMe);
    this.values = [0];
  }

  onCollect(player) {
    //decide whether to reverse for current player or other players
    if (this.affectsMe) {
      this.doubleCoins(player);
      super.onCollect();
    } else {
      socket.emit('doubleCoins');
    }
  }

  //double player coins
  doubleCoins(player) {
    player.score *= 2;
  }
}


if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { DoubleCoinsGem };