if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
    // used on the server
    // eslint-disable-next-line global-require
    Gem = require('./Gem').Gem;
}

class SpeedGem extends Gem { // Dagmara
    constructor(x, y, width, height, value, affectsMe) {
      super(x, y, width, height, value, affectsMe, `Your speed has been changed for ${value / 1000} seconds`);
      this.values = [5000, 10000, 15000, 20000];
    }
  
    onCollect(player, position, affectsMe) {
      super.onCollect();
      if (this.affectsMe || affectsMe) { //force affectsMe value
        this.changePlayersSpeed(player, position, affectsMe);
      } else {
        socket.emit('gemAffectsOthers', position);
      }
    }
  
    //decide whether to heal current player or other players
    changePlayersSpeed(player, position, affectsMe) {
      this.speed(player);
      setTimeout(() => {
        player.speed = 4;
      },this.value)
    }
  
    //heal player
    speed(player) {
        super.displayMessage();
        const speedSign = Math.random() < 0.5;
        if (player.speed == 16 || player.speed == 2) {
            //message,: I can't change my speed!
        } else {
            player.speed = speedSign ? player.speed*2 : player.speed/2;
        }
      //
    }
}
  

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { SpeedGem };