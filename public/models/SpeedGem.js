if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
    // used on the server
    // eslint-disable-next-line global-require
    Gem = require('./Gem').Gem;
    Utils = require('../../private/models/Utils').Utils;
}

class SpeedGem extends Gem { // Dagmara
    constructor(x, y, width, height, value, affectsMe) {
      super(x, y, width, height, value, affectsMe);
      this.values = [5000, 10000, 15000, 20000];
    }
  
    onCollect(player) {
      this.changePlayersSpeed(player);
      setTimeout(() => {
        player.speed = 4;
        console.log(player.speed);
      },this.value)
    }
  
    //decide whether to heal current player or other players
    changePlayersSpeed(player) {
      if (this.affectsMe) {
        this.speed(player);
      } else {
        socket.emit('changePlayersSpeed');
      }
    }
  
    //heal player
    speed(player) {
        const speedSign = Utils.getRandomNumber(0,1);
        console.log('speed');
        if (player.speed == 16 || player.speed == 0) {
            //message,: I can't change my speed!
        } else {
            player.speed = speedSign ? player.speed*2 : player.speed/2;
            console.log(player.speed);
        }
      //
    }
}
  

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { SpeedGem };