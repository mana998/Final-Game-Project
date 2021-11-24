if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  // used on the server
  // eslint-disable-next-line global-require
  Gem = require('./Gem').Gem;
}

class ReverseMovementGem extends Gem { // Marianna
  constructor(x, y, width, height, value, affectsMe) {
    super(x, y, width, height, value, affectsMe);
    this.values = [5000, 10000, 15000, 20000];
  }

  onCollect(player) {
    this.reverseMovement(player)
    //reverse back after period of time
    setTimeout ( () => {
      this.reverseMovement(player);
    }, this.value);
  }

  //decide whether to reverse for current player or other players
  reverseMovement(player) {
    if (this.affectsMe) {
      this.swapMovement(player);
    } else {
      socket.emit('reverseMovement');
    }
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