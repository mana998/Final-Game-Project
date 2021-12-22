if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  // used on the server
  // eslint-disable-next-line global-require
  Gem = require('./Gem').Gem;
}

class TeleportGem extends Gem { // Marianna
  constructor(x, y, width, height, value, affectsMe) {
    super(x, y, width, height, value, affectsMe, `You have been teleported`);
    this.values = [];
  }

  onCollect(player, position, affectsMe) {
    super.onCollect();
    //decide whether to teleport current player or other players
    if (this.affectsMe || affectsMe) { //force affectsMe value
      this.teleport(player, map);
    } else {
      socket.emit('gemAffectsOthers', position);
    }
  }

  //swap movement for passed player
  teleport(player, map) {
    super.displayMessage();
    let [row, column] = [-1, -1];
    do {
      row = Utilities.getRandomNumber(0, map.tiles.length);
      column = Utilities.getRandomNumber(0, map.tiles[row].length);
    } while (map.tiles[row][column] !== 0);
    player.x = column * map.tileWidth;
    player.y = (row + 1) * map.tileHeight;
    updateServerPlayer();
  }
}


if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { TeleportGem };