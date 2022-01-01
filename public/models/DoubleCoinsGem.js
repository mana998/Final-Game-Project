if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  // used on the server
  // eslint-disable-next-line global-require
  Gem = require('./Gem').Gem;
}

class DoubleCoinsGem extends Gem { // Marianna
  constructor(x, y, width, height, value, affectsMe) {
    super(x, y, width, height, value, affectsMe, 'Your coins have been doubled');
    this.values = [];
  }

  onCollect(player, position, affectsMe) {
    super.onCollect();
    // decide whether to reverse for current player or other players
    if (this.affectsMe || affectsMe) { // force affectsMe value
      this.doubleCoins(player);
    } else {
      socket.emit('gemAffectsOthers', position);
    }
  }

  // double player coins
  doubleCoins(player) {
    super.displayMessage();
    player.score *= 2;
    $('#scoreValue').text(player.score);
  }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { DoubleCoinsGem };
