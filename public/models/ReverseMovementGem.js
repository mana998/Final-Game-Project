//Marianna
if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  // used on the server
  // eslint-disable-next-line global-require
  Gem = require('./Gem').Gem;
}

class ReverseMovementGem extends Gem { // Marianna
  constructor(x, y, width, height, value, affectsMe) {
    super(x, y, width, height, value, affectsMe, `Your movement has been reversed for ${value / 1000} seconds`);
    this.values = [5000, 10000, 15000, 20000];
  }

  onCollect(player, position, affectsMe) {
    super.onCollect();
    if (this.affectsMe || affectsMe) { //force affectsMe value
      this.reverseMovement(player)
    } else {
      socket.emit('gemAffectsOthers', position);
    }
  }

  //decide whether to reverse for current player or other players
  reverseMovement(player) {
    super.displayMessage();
    this.swapMovement(player);
    //reverse back after period of time
    setTimeout ( () => {
      this.swapMovement(player);
    }, this.value);
  }

  //swap movement for passed player
  swapMovement(player) {
    let temp = player.movement.left;
    player.movement.left = player.movement.right;
    player.movement.right = temp;
    temp = player.movement.up;
    player.movement.up = player.movement.down;
    player.movement.down = temp;
  }
}


if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { ReverseMovementGem };