if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
    // used on the server
    // eslint-disable-next-line global-require
    Trap = require('./Trap').Trap;
  }

class OnOffTrap extends Trap {
    constructor(x, y, width, height, img, value, activeTime, isActive) {
        super(x, y, width, height, img, value);
        this.value = value;
        this.values = [0.001, 0.002, 0.05, 0.005];
        this.direction = isActive;
        this.speed = activeTime;

        if (! (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports)) {
            const trapValue = this.value;
            setInterval(() => {
                if (this.direction) {
                    this.value = 0;
                    this.direction = !this.direction
                } else {
                    this.value = trapValue;
                    this.direction = !this.direction
                }
            }, this.speed);
        }
    }

    onCollision () {
        console.log("Ow no, on off trap!");
    }

    draw(ctx, initX, initY) {
        let x = initX;
        let y = initY;
        // object values are equal to 0 so when the direction is 0 turn off the trap
        if (!this.direction) {
            x = this.x;
            y = this.y;
        }
        this.img.draw(ctx, x, y, this.width, this.height);
    }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { OnOffTrap };

