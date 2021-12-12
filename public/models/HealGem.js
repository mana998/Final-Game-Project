if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
    // used on the server
    // eslint-disable-next-line global-require
    Gem = require('./Gem').Gem;
}

class HealGem extends Gem { // Dagmara
    constructor(x, y, width, height, value, affectsMe) {
      super(x, y, width, height, value, affectsMe, `Your health has increased by ${value}`);
      this.values = [0.5, 1, 2.5, 3, 4.5];
    }
  
    onCollect(player, position, affectsMe) {
      super.onCollect();
      if (this.affectsMe || affectsMe) { //force affectsMe value
        this.heal(player);
      } else {
        socket.emit('gemAffectsOthers', position);
      }
    }
  
    //heal player
    heal(player) {
      super.displayMessage();
      player.health += this.value;
      if (player.health >= 10) {
        player.health = 10;
      }
      let healthCutout = 4.54 - 4.1 * player.health * 0.1; //4.54 - 0.4 = max - min, full value * percentage of health + min value
      $('#healthFill').css('clip', `rect(${healthCutout}em, 5em, 5em, 0)`)
    }
}
  

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { HealGem };