if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
    // used on the server
    // eslint-disable-next-line global-require
    Trap = require('./Trap').Trap;
  }

class MovingTrap extends Trap {
    constructor(x, y, width, height, img, value, speed, direction, startRow, endRow, startColumn, endColumn) {
        super(x, y, width, height, img, value);
        this.values = [0.001, 0.002, 0.05, 0.005];
        this.speed = speed;
        this.startRow = startRow;
        this.startColumn = startColumn;
        this.endRow = endRow;
        this.endColumn = endColumn;
        this.direction = direction;
        this.rows = this.endRow - this.startRow ;
        this.columns = this.endColumn - this.startColumn;
        if (!direction) {
            if (this.endRow - this.startRow >= 1) {
                this.direction = 'vertical';
                this.x += width/2;
            } else {
                this.direction = 'horizontal';
                this.y += height/2;
            }
            //center the object
        } else if (direction === 'vertical') {
            this.x += width/2;
        } else if (direction === 'horizontal') {
            this.y += height/2;
        }

        if (! (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports)) {
            setInterval(() => {
                if (this.direction === 'vertical') {
                    this.y += this.speed;
                    if (this.y === 0 || this.y === this.rows * 32 + this.height) {
                        this.speed = -this.speed;
                    }
                } else if (this.direction === 'horizontal') {
                    this.x += this.speed;
                    if (this.x === 0 || this.x === this.columns * 32 + this.width) {
                        this.speed = -this.speed;
                    }
                }
            }, 50);
        }
    }

    onCollision () {
        console.log("Ow no, moving this!");
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