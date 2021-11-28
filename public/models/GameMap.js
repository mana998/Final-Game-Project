if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  // used on the server
  // eslint-disable-next-line global-require
  Img = require('./Img').Img;
  Coin = require('./Coin').Coin;
  Gem = require('./Gem').Gem;
  ReverseMovementGem = require('./ReverseMovementGem').ReverseMovementGem;
  HealGem = require('./HealGem').HealGem;
  Trap = require('./Trap').Trap;
  MovingTrap = require('./MovingTrap').MovingTrap;
}

const wall = new Img('./assets/images/game/wall.png', 0, 0, 0, 0, 0, 1);
const goal = new Img('./assets/images/game/goal.png', 0, 0, 0, 0, 0, 1);
const path = new Img('./assets/images/game/path.png', 0, 0, 0, 0, 0, 1);
const coin = new Img('./assets/images/game/coin.png', 0, 0, 0, 4, 5, 1);
const gem = new Img('./assets/images/game/gem.png', 0, 0, 0, 3, 5, 1);
//no animation
const trap = new Img('./assets/images/game/trap.png', 0, 0, 0, 0, 0, 1);
const movingTrap = new Img('./assets/images/game/ninjaStar.png', 0, 0, 0, 0, 0, 1);

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
    this.gemClasses = ['ReverseMovementGem', 'HealGem'];
    this.traps = traps || [];
    this.trapClasses = ['MovingTrap', 'Trap'];
  }

  // Marianna
  // draw map in relation to player
  draw(ctx, player, canvasWidth, canvasHeight) {
    //limit rendering to 5 blocks around player
    let rowStart = Math.floor(player.y / this.tileHeight - 5);
    if (rowStart < 0) rowStart = 0;
    let rowEnd = Math.floor(player.y / this.tileHeight + 5);
    if (rowEnd > this.tiles.length) rowEnd = this.tiles.length;
    let columnStart = Math.floor(player.x / this.tileWidth - 5);
    if (columnStart < 0) columnStart = 0;
    let columnEnd = Math.floor(player.x / this.tileWidth + 5);
    if (columnEnd > this.tiles[0].length) columnEnd = this.tiles[0].length;
    for (let row = rowStart; row < rowEnd; row++) {
      for (let column = columnStart; column < columnEnd; column++) {
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
            //draw all traps but only first occurence of moving trap
            if (String(this.tiles[row][column]).match(/^(6\.\d+|6\.\d+\.1)$/)) {
              const blockValue = this.tiles[row][column].split('.');
              map.traps[parseInt(blockValue[1])].draw(
                ctx,
                (canvasWidth - player.width) / 2 - player.x + (column * this.tileWidth),
                ((canvasHeight - player.height) / 2) - player.y + (row + 1) * this.tileHeight
              );
            }
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
      const gemTypeKey = this.gemClasses[Utils.getRandomNumber(0, this.gemClasses.length)];
      console.log(gemTypeKey);
      this.tiles[row][column] = `5.${i}`;
      let newGem = getNewGem(gemTypeKey, [0, 0]);
      console.log(newGem);
      const gemValue = newGem.values[Utils.getRandomNumber(0, newGem.values.length)];
      newGem.value = gemValue;
      newGem.affectsMe = Utils.getRandomNumber(0, 2);
      this.gems.push(newGem);
    }
  }

  generateTraps(amount) {
    // for every trp, for now trap size is one block but we can change it
    const trapValues = [1, 0.5, 2, 5, 9];
    for (let i = 0; i < amount; i++) {
      const trapTypeKey = this.trapClasses[Utils.getRandomNumber(0, this.trapClasses.length)];
      switch (trapTypeKey) {
        case 'MovingTrap':
          //trap should spread at least through 2 tiles so player can avoid it
          //it additionally needs  at least 2x2 area to not block paths with width 1
          const maxTries = 100; //try to find place 100 times before giving up 
          let tries = 0;
          let [startRow, endRow, startColumn, endColumn] = [-1, -1, -1, -1];
          do {
            //start row and collumn will have additional number in tilemap to trigger draw only once
            startRow = Utils.getRandomNumber(0, this.tiles.length);
            startColumn = Utils.getRandomNumber(0, this.tiles[startRow].length);
            // has to be empty block
            tries++;
          } while (tries < maxTries && (this.tiles[startRow][startColumn] !== 0 || //current block needs to be 0
            startRow + 1 >= this.tiles.length || startColumn + 1 >= this.tiles[startRow].length || //whether it is in te map
            this.tiles[startRow+1][startColumn] !== 0 || //block in next row needs to be 0
            this.tiles[startRow+1][startColumn + 1] || this.tiles[startRow+1][startColumn + 1] !== 0 || //block in next row and next collumn
            this.tiles[startRow][startColumn + 1] || this.tiles[startRow][startColumn + 1] !== 0) //block in next collumn
          );
          if (tries < maxTries) {
            endRow = startRow + 1;
            endColumn = startColumn + 1;
            //decide on direction of the trap
            const direction = Utils.getRandomNumber(0, 2);
            switch (direction) {
              case 0: //rows
                while (this.tiles[startRow - 1][startColumn] === 0 && this.tiles[startRow - 1][endColumn] === 0) {
                  startRow--;
                }
                //modify end row
                while (this.tiles[endRow + 1][startColumn] === 0 && this.tiles[endRow + 1][endColumn] === 0) {
                  endRow++;
                }
                break;
              case 1: //collumns
                while (this.tiles[startRow][startColumn - 1] === 0 && this.tiles[endRow][startColumn - 1] === 0) {
                  startColumn--;
                }
                //modify end row
                while (this.tiles[startRow][endColumn + 1] === 0 && this.tiles[endRow][endColumn + 1] === 0) {
                  endColumn++;
                }
                break;
            }
            //modify start column
            /*let expandColumn = true;
            while (expandColumn) {
              for (let row = startRow; row <= endRow; row++) {
                if (this.tiles[row][startColumn-1] !== 0) {
                  expandColumn = false;
                  break;
                }
              }
              startColumn--;
            }*/
            //console.log('startcolumn', startColumn);
            //modify end column
            /*expandColumn = true;
            while (expandColumn) {
              for (let row = startRow; row <= endRow; row++) {
                if (this.tiles[row][endColumn+1] !== 0) {
                  expandColumn = false;
                  break;
                }
              }
              endColumn++;
            }*/
            //add trap to the map
            let first = true;
            for (let row = startRow; row <= endRow; row++) {
              for (let column = startColumn; column <= endColumn; column++) {
                this.tiles[row][column] = `6.${i}`;
                if (first) {
                  this.tiles[row][column] += '.1';
                  first = false;
                } else {
                  this.tiles[row][column] += '.2';
                }
              }
            }
            //TO DO: change hardcoded values
            this.traps.push(new MovingTrap('', '', '', '', movingTrap, 10, 10));
            break;
          } // else it falls down to dafault case
        default:
          let [row, column] = [-1, -1];
          do {
            row = Utils.getRandomNumber(0, this.tiles.length);
            column = Utils.getRandomNumber(0, this.tiles[row].length);
            // has to be empty block
          } while (this.tiles[row][column] !== 0);
          this.tiles[row][column] = `6.${i}`;
          this.traps.push(new Trap(0, 0, 32, 32, trap, trapValues[Utils.getRandomNumber(0, trapValues.length)]));
          break;
      }
    }
  }
}

function getNewGem(type, parameters) {
  let gem;
  switch (type) {
    case 'ReverseMovementGem':
      gem = new ReverseMovementGem(0, 0, 0, 0, ...parameters);
      return gem;
      break;
    case 'HealGem':
      gem = new HealGem(0, 0, 0, 0, ...parameters);
      console.log(gem);
      return gem;
      break;
  }
}

function getNewTrap(type, parameters) {
  let trap;
  let image = new Img(parameters[0].src, parameters[0].startRow, parameters[0].startColumn, parameters[0].rows, parameters[0].columns, parameters[0].speed, parameters[0].size);
  parameters.shift();
  switch (type) {
    case 'MovingTrap':
      trap = new MovingTrap(0, 0, 16, 16, image, ...parameters);
      return trap;
    case 'Trap':
      trap = new Trap(0, 0, 32, 32, image, ...parameters);
      return trap;
  }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { GameMap };