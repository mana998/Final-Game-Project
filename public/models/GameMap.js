if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  // used on the server
  // eslint-disable-next-line global-require
  Img = require('./Img').Img;
  Coin = require('./Coin').Coin;
}

const wall = new Img("./assets/images/game/wall.png", 0, 0, 0, 0, 0, 1);
const goal = new Img("./assets/images/game/goal.png", 0, 0, 0, 0, 0, 1);
const path = new Img("./assets/images/game/path.png", 0, 0, 0, 0, 0, 1);
const coin = new Img("./assets/images/game/coin.png", 0, 0, 0, 4, 5, 1);

let Utils;

class GameMap {
  constructor(tiles, timeLimit, coins, Utilities) {
    // utils object - use new one if passed else keep the old one
    Utils = Utilities || Utils;
    // 0 path
    // 1 wall
    // 2 goal
    // 3 player
    // 4 coin
    this.tileWidth = 32;
    this.tileHeight = 32;
    this.tiles = tiles || [];
    this.goalRow = null;
    this.goalColumn = null;
    this.timeLimit = timeLimit || 0;
    this.coins = coins || [];
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
                    //coin match
                    case String(this.tiles[row][column]).match(/^4/)?.input:
                        path.draw(ctx, 
                            (canvasWidth - player.width) / 2 - player.x + (column * this.tileWidth), 
                            ((canvasHeight - player.height) / 2) - player.y + (row + 1) * this.tileHeight, 
                            this.tileWidth, this.tileHeight
                        );
                        //take one coin to draw as they are the same
                        coin.draw(ctx, 
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
    loadMap (mapFile) {
        const fs = require('fs');
        let data = fs.readFileSync(mapFile);
        this.tiles = JSON.parse(data).tiles;
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
        this.timeLimit = 60 * 1000 * (this.tiles.length * this.tiles[0].length / 100);
        //generate coins
        //5 coins per 10x10 
        this.generateCoins(this.tiles.length * this.tiles[0].length / 20)
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

    generateCoins (amount) {
        const coinValues = [1000, 5000, 10000, 15000, 20000];
        //for every coin
        for (let i = 0; i < amount; i++) {
            let [row, column] = [-1, -1];
            do {
                row = Utils.getRandomNumber(0, this.tiles.length);
                column = Utils.getRandomNumber(0, this.tiles[row].length);
                //has to be empty block
            } while (this.tiles[row][column] !== 0);
            this.tiles[row][column] = `4.${i}`;
            this.coins.push(new Coin(0, 0, 32, 32, coinValues[Utils.getRandomNumber(0, coinValues.length)]));
        }
    }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { GameMap };
