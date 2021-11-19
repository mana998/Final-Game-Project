if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  // used on the server
  // eslint-disable-next-line global-require
  Img = require('./Img').Img;
}

const wall = new Img("./assets/images/game/wall.png", 0, 0, 0, 0, 0, 1);
const goal = new Img("./assets/images/game/goal.png", 0, 0, 0, 0, 0, 1);
const path = new Img("./assets/images/game/path.png", 0, 0, 0, 0, 0, 1);

let Utils;

class GameMap {
  constructor(tiles, timeLimit, Utilities) {
    // utils object - use new one if passed else keep the old one
    Utils = Utilities || Utils;
    // 0 path
    // 1 wall
    // 2 goal
    // 3 player
    this.tileWidth = 32;
    this.tileHeight = 32;
    this.tiles = tiles || [];
    this.goalRow = null;
    this.goalColumn = null;
    this.timeLimit = timeLimit || 0;
  }

    //Marianna
    //draw map in relation to player
    draw (ctx, player, canvasWidth, canvasHeight) {
        for(let row = 0; row < this.tiles.length; row++) {
            for(let column = 0; column < this.tiles[row].length; column++) {
                switch(this.tiles[row][column]) {
                    case 0:
                    //draw path under the player
                    case 3:
                        path.draw(ctx, 
                            (canvasWidth - player.width) / 2 - player.x + (column * this.tileWidth), 
                            ((canvasHeight - player.height) / 2) - player.y + (row + 1) * this.tileHeight, 
                            this.tileWidth, this.tileHeight
                        );
                        break;
                    case 1:
                        wall.draw(ctx, 
                            (canvasWidth - player.width) / 2 - player.x + (column * this.tileWidth), 
                            ((canvasHeight - player.height) / 2) - player.y + (row + 1) * this.tileHeight, 
                            this.tileWidth, this.tileHeight
                        );
                        break;
                    case 2:
                        goal.draw(ctx, 
                            (canvasWidth - player.width) / 2 - player.x + (column * this.tileWidth), 
                            ((canvasHeight - player.height) / 2) - player.y + (row + 1) * this.tileHeight, 
                            this.tileWidth, this.tileHeight
                        );
                        break;
                    default:
                }
            }
          }
    }

    //Marianna
    //load map from the file
    //set goal tile and time limit
    loadMap (data) {
        this.tiles = data.tiles;
        //get random position for goal
        let [row, column] = [-1, -1];
        do {
            row = Utils.getRandomNumber(0, this.tiles.length);
            column = Utils.getRandomNumber(0, this.tiles[row].length);
        } while (this.tiles[row][column] !== 0);
        this.tiles[row][column] = 2;
        this.goalRow = row;
        this.goalColumn = column;
        //set time limit based on size - 1 minute for 10x10
        this.timeLimit = 60 * 1000 * (this.tiles.length, this.tiles[0].length);;
    }

    //Marianna
    //place player on the map in relation to goal
    //at least 1/3 horizontally and vertically from the goal
    setPlayerStartPosition(player) {
        let [row, column] = [-1, -1];
        do {
            row = Utils.getRandomNumber(0, this.tiles.length);
            column = Utils.getRandomNumber(0, this.tiles[row].length);
            //at least third of the map away from the goal
        } while (Math.abs(row - this.goalRow) < this.tiles.length / 3 || Math.abs(column - this.goalColumn) < this.tiles[row].length / 3 || this.tiles[row][column] !== 0);
        this.tiles[row][column] = 3;
        player.x = column * this.tileWidth;
        player.y = row * this.tileHeight + this.tileHeight;
    }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { GameMap };
