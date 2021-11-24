if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
    // used on the server
    // eslint-disable-next-line global-require
    GameObject = require('./GameObject').GameObject;
  }

class Trap extends GameObject {
    constructor(x, y, width, height, img, value) {
        super(x, y, width, height, img);
        this.value = value;
    }

    onCollision () {
        console.log("Ow no, trap!");
    }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { Trap };

