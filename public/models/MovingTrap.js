if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
    // used on the server
    // eslint-disable-next-line global-require
    Trap = require('./Trap').Trap;
  }

class MovingTrap extends Trap {
    constructor(x, y, width, height, img, value, speed) {
        super(x, y, width, height, img, value);
        this.speed = speed;
    }

    onCollision () {
        console.log("Ow no, moving trap!");
    }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { MovingTrap };

