if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
    // used on the server
    // eslint-disable-next-line global-require
    Gem = require('./Gem').Gem;
}

class HealGem extends Gem { // Dagmara
    constructor(x, y, width, height, value, affectsMe) {
      super(x, y, width, height, value, affectsMe);
      this.values = [0.5, 1, 2.5, 3, 4.5];
    }
  
    onCollect(player) {
      console.log(player.health);
      this.healPlayer(player);
      console.log(player.health);
    }
  
    //decide whether to heal current player or other players
    healPlayer(player) {
      if (this.affectsMe) {
        this.heal(player);
      } else {
        socket.emit('healPlayer');
      }
    }
  
    //heal player
    heal(player) {
      let playerHealth = player.health;
      if (playerHealth === 10){
        //maybe the character will have a message above the head saying: My health is full. or smth like that
      } else {
        playerHealth += this.value;
      }
    }
}
  

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { HealGem };