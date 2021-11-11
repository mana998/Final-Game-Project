const wall = new Img("./assets/images/wall.png", 0, 0, 0, 0, 0, 1);

const tileWidth = 32;
const tileHeight = 32;

class GameMap {
    constructor (tiles) {
        //hardcoded map
        //0 path
        //1 wall
        //2 player
        this.tiles = tiles ||
        [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ]
    }

    draw (ctx, player, canvasWidth, canvasHeight) {
        for(let row = 0; row < this.tiles.length; row++) {
            for(let column = 0; column < this.tiles[row].length; column++) {
                console.log(this.tiles[row][column]);
                switch(this.tiles[row][column]) {
                    case 1:
                        wall.draw(ctx, 
                            (canvasWidth - player.width) / 2 - player.x + (column * tileWidth), 
                            ((canvasHeight - player.height) / 2) - player.y + (row + 1) * tileHeight, 
                            tileWidth, tileHeight
                        );
                        break;
                }
            }
        }
    }
}