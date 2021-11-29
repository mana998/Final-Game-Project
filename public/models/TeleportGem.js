if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  // used on the server
  // eslint-disable-next-line global-require
  Gem = require('./Gem').Gem;
}

class TeleportGem extends Gem { // Marianna
  constructor(x, y, width, height, value, affectsMe) {
    super(x, y, width, height, value, affectsMe);
    this.values = [0];
  }

  onCollect(player) {
    //decide whether to reverse for current player or other players
    console.log('teleport', this.affectsMe);
    if (this.affectsMe) {
      this.teleport(player, map);
    } else {
      socket.emit('teleportPlayer');
    }
  }

  //swap movement for passed player
  teleport(player, map) {
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