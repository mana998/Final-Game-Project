if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
    // used on the server
    // eslint-disable-next-line global-require
    GameObject = require('./GameObject').GameObject;
    Sound = require('./Sound').Sound;
}

const trapSound = new Sound('hit', 'soundfx');
trapSound.sound.volume = 0.2;

class Trap extends GameObject {
    constructor(x, y, width, height, img, value) {
        super(x, y, width, height, img);
        this.value = value;
    }

    onCollision () {
        console.log("Ow no, trap!");
        trapSound.play();
    }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { Trap };

