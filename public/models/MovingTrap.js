if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
    // used on the server
    // eslint-disable-next-line global-require
    Trap = require('./Trap').Trap;
  }

class MovingTrap extends Trap {
    constructor(x, y, width, height, img, value, speed) {
        if (width !== 32) {
            x += width/2;
        }
        if (height !== 32) {
            y += height/2;
        }
        super(x, y, width, height, img, value);
        this.speed = speed;
    }

    onCollision () {
        console.log("Ow no, moving trap!");
    }

    draw(ctx, initX, initY) {
        let x = initX + this.x;
        let y = initY + this.y;
        // if values aren't passed, use object ones
        x = x || this.x;
        y = y || this.y;
        this.img.draw(ctx, x, y, this.width, this.height);
    }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { MovingTrap };

