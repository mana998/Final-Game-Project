if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  // used on the server
  // eslint-disable-next-line global-require
  Img = require('./Img').Img;
  Coin = require('./Coin').Coin;
  Gem = require('./Gem').Gem;
  Trap = require('./Trap').Trap;
  ReverseMovementGem = require('./ReverseMovementGem').ReverseMovementGem;
}

const wall = new Img('./assets/images/game/wall.png', 0, 0, 0, 0, 0, 1);
const goal = new Img('./assets/images/game/goal.png', 0, 0, 0, 0, 0, 1);
const path = new Img('./assets/images/game/path.png', 0, 0, 0, 0, 0, 1);
const coin = new Img('./assets/images/game/coin.png', 0, 0, 0, 4, 5, 1);
const gem = new Img('./assets/images/game/coin.png', 0, 0, 0, 3, 5, 1);
//no animation
const trap = new Img('./assets/images/game/trap.png', 0, 0, 0, 0, 0, 1);

let Utils;

class GameMap {
  constructor(tiles, timeLimit, coins, gems, traps, Utilities) {
    // utils object - use new one if passed else keep the old one
    Utils = Utilities || Utils;
    // 0 path
    // 1 wall
    // 2 goal
    // 3 player
    // 4 coin
    // 5 gem
    // 6 trap
    this.tileWidth = 32;
    this.tileHeight = 32;
    this.tiles = tiles || [];
    this.goalRow = null;
    this.goalColumn = null;
    this.timeLimit = timeLimit || 0;
    this.coins = coins || [];
    this.gems = gems || [];
    this.gemTypes = {
      0 : new ReverseMovementGem()
    };
    this.traps = traps || [];
  }

  // Marianna
  // draw map in relation to player
  draw(ctx, player, canvasWidth, canvasHeight) {
    for (let row = 0; row < this.tiles.length; row++) {
      for (let column = 0; column < this.tiles[row].length; column++) {
        switch (this.tiles[row][column]) {
          case 0:
            // draw path under the player
          case 3:
            path.draw(
              ctx,
              (canvasWidth - player.width) / 2 - player.x + (column * this.tileWidth),
              ((canvasHeight - player.height) / 2) - player.y + (row + 1) * this.tileHeight,
              this.tileWidth,
              this.tileHeight,
            );
            break;
            // coin match
          case String(this.tiles[row][column]).match(/^4/)?.input:
            path.draw(
              ctx,
              (canvasWidth - player.width) / 2 - player.x + (column * this.tileWidth),
              ((canvasHeight - player.height) / 2) - player.y + (row + 1) * this.tileHeight,
              this.tileWidth,
              this.tileHeight,
            );
            // take one coin to draw as they are the same
            coin.draw(
              ctx,
              (canvasWidth - player.width) / 2 - player.x + (column * this.tileWidth),
              ((canvasHeight - player.height) / 2) - player.y + (row + 1) * this.tileHeight,
              this.tileWidth,
              this.tileHeight,
            );
            break;
          case String(this.tiles[row][column]).match(/^5/)?.input:
            path.draw(
              ctx,
              (canvasWidth - player.width) / 2 - player.x + (column * this.tileWidth),
              ((canvasHeight - player.height) / 2) - player.y + (row + 1) * this.tileHeight,
              this.tileWidth,
              this.tileHeight,
            );
            // take one gem to draw as they are the same
            gem.draw(
              ctx,
              (canvasWidth - player.width) / 2 - player.x + (column * this.tileWidth),
              ((canvasHeight - player.height) / 2) - player.y + (row + 1) * this.tileHeight,
              this.tileWidth,
              this.tileHeight,
            );
            break;
          case String(this.tiles[row][column]).match(/^6/)?.input:
            path.draw(
              ctx,
              (canvasWidth - player.width) / 2 - player.x + (column * this.tileWidth),
              ((canvasHeight - player.height) / 2) - player.y + (row + 1) * this.tileHeight,
              this.tileWidth,
              this.tileHeight,
            );
            // take one trap to draw as they are the same, the traps image will be different but for now only one img
            trap.draw(
              ctx,
              (canvasWidth - player.width) / 2 - player.x + (column * this.tileWidth),
              ((canvasHeight - player.height) / 2) - player.y + (row + 1) * this.tileHeight,
              this.tileWidth,
              this.tileHeight,
            );
            break;
          case 1:
            wall.draw(
              ctx,
              (canvasWidth - player.width) / 2 - player.x + (column * this.tileWidth),
              ((canvasHeight - player.height) / 2) - player.y + (row + 1) * this.tileHeight,
              this.tileWidth,
              this.tileHeight,
            );
            break;
          case 2:
            goal.draw(
              ctx,
              (canvasWidth - player.width) / 2 - player.x + (column * this.tileWidth),
              ((canvasHeight - player.height) / 2) - player.y + (row + 1) * this.tileHeight,
              this.tileWidth,
              this.tileHeight,
            );
            break;
          default:
        }
      }
    }
  }

  // Marianna
  // load map from the file
  // set goal tile and time limit
  loadMap(mapFile) {
    const fs = require('fs');
    const data = fs.readFileSync(mapFile);
    this.tiles = JSON.parse(data).tiles;
    // get random position for goal
    let [row, column] = [-1, -1];
    do {
      row = Utils.getRandomNumber(0, this.tiles.length);
      column = Utils.getRandomNumber(0, this.tiles[row].length);
    } while (this.tiles[row][column] !== 0);
    this.tiles[row][column] = 2;
    this.goalRow = row;
    this.goalColumn = column;
    // set time limit based on size - 1 minute for 10x10
    this.timeLimit = 60 * 1000 * (this.tiles.length * this.tiles[0].length / 100);
    // generate coins
    // 5 coins per 10x10
    this.generateCoins(this.tiles.length * this.tiles[0].length / 20);
    // generate gems
    // 1 gemper 10x10
    this.generateGems(this.tiles.length * this.tiles[0].length / 100);
    //generate traps
    //1 trap 10x10
    this.generateTraps(this.tiles.length * this.tiles[0].length / 100);
  }

  // Marianna
  // place player on the map in relation to goal
  // at least 1/3 horizontally and vertically from the goal
  setPlayerStartPosition(player) {
    let [row, column] = [-1, -1];
    do {
      row = Utils.getRandomNumber(0, this.tiles.length);
      column = Utils.getRandomNumber(0, this.tiles[row].length);
      // at least third of the map away from the goal
    } while (Math.abs(row - this.goalRow) < this.tiles.length / 3 || Math.abs(column - this.goalColumn) < this.tiles[row].length / 3 || this.tiles[row][column] !== 0);
    this.tiles[row][column] = 3;
    player.x = column * this.tileWidth;
    player.y = row * this.tileHeight + this.tileHeight;
  }

  generateCoins(amount) {
    const coinValues = [1000, 5000, 10000, 15000, 20000];
    // for every coin
    for (let i = 0; i < amount; i++) {
      let [row, column] = [-1, -1];
      do {
        row = Utils.getRandomNumber(0, this.tiles.length);
        column = Utils.getRandomNumber(0, this.tiles[row].length);
        // has to be empty block
      } while (this.tiles[row][column] !== 0);
      this.tiles[row][column] = `4.${i}`;
      this.coins.push(new Coin(0, 0, 32, 32, coinValues[Utils.getRandomNumber(0, coinValues.length)]));
    }
  }

  generateGems(amount) {
    // for every gem
    for (let i = 0; i < amount; i++) {
      let [row, column] = [-1, -1];
      do {
        row = Utils.getRandomNumber(0, this.tiles.length);
        column = Utils.getRandomNumber(0, this.tiles[row].length);
        // has to be empty block
      } while (this.tiles[row][column] !== 0);
      //add random type based on keys in gemTypes
      //get gem type key
      const gemTypeKey = Utils.getRandomNumber(0, Object.keys(this.gemTypes).length);
      this.tiles[row][column] = `5.${i}.${gemTypeKey}`;
      const gemValue = this.gemTypes[gemTypeKey].values[Utils.getRandomNumber(0, this.gemTypes[gemTypeKey].values.length)];
      this.gems.push(new Gem(0, 0, 32, 32, gemValue, Utils.getRandomNumber(0, 2)));
    }
  }

  generateTraps(amount) {
    // for every trp, for now trap size is one block but we can change it
    const trapValues = [1, 0.5, 2, 5, 9];
    for (let i = 0; i < amount; i++) {
      let [row, column] = [-1, -1];
      do {
        row = Utils.getRandomNumber(0, this.tiles.length);
        column = Utils.getRandomNumber(0, this.tiles[row].length);
        // has to be empty block
      } while (this.tiles[row][column] !== 0);
      this.tiles[row][column] = `6.${i}`;
      this.traps.push(new Trap(0, 0, 32, 32, '',trapValues[Utils.getRandomNumber(0, trapValues.length)]));
    }
  }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { GameMap };
