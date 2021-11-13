
 if (typeof exports !== 'undefined'&& typeof module !== 'undefined' && module.exports) {
    //used on the server
    Img = require("./Img").Img;
}

const wall = new Img("./assets/images/wall.png", 0, 0, 0, 0, 0, 1);

class GameMap {
    constructor (tiles) {
        //hardcoded map
        //0 path
        //1 wall
        //2 player
        this.tileWidth = 32;
        this.tileHeight = 32;
        this.tiles = tiles || [];
    }

    draw (ctx, player, canvasWidth, canvasHeight) {
        for(let row = 0; row < this.tiles.length; row++) {
            for(let column = 0; column < this.tiles[row].length; column++) {
                switch(this.tiles[row][column]) {
                    case 1:
                        wall.draw(ctx, 
                            (canvasWidth - player.width) / 2 - player.x + (column * this.tileWidth), 
                            ((canvasHeight - player.height) / 2) - player.y + (row + 1) * this.tileHeight, 
                            this.tileWidth, this.tileHeight
                        );
                        break;
                }
            }
        }
    }
}

if (typeof exports !== 'undefined'&& typeof module !== 'undefined' && module.exports) module.exports = {GameMap};