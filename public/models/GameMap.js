if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  // used on the server
  // eslint-disable-next-line global-require
  Img = require('./Img').Img;
  Coin = require('./Coin').Coin;
  Gem = require('./Gem').Gem;
  ReverseMovementGem = require('./ReverseMovementGem').ReverseMovementGem;
  SpeedGem = require('./SpeedGem').SpeedGem;
  HealGem = require('./HealGem').HealGem;
  TeleportGem = require('./TeleportGem').TeleportGem;
  DoubleCoinsGem = require('./DoubleCoinsGem').DoubleCoinsGem;
  FreezeGem = require('./FreezeGem').FreezeGem;
  Trap = require('./Trap').Trap;
  MovingTrap = require('./MovingTrap').MovingTrap;
  OnOffTrap = require('./OnOffTrap').OnOffTrap;
  Utils = require('./Utils').Utils;
}

let Utilities = new Utils();

const wall = new Img('./assets/images/game/wall.png', 0, 0, 0, 0, 0, 1);
const goal = new Img('./assets/images/game/goal.png', 0, 0, 0, 0, 0, 1);
const path = new Img('./assets/images/game/path.png', 0, 0, 0, 0, 0, 1);
const coin = new Img('./assets/images/game/coin.png', 0, 0, 0, 4, 5, 1);
const gem = new Img('./assets/images/game/gem.png', 0, 0, 0, 3, 5, 1);
//no animation
const trap = new Img('./assets/images/game/trap.png', 0, 0, 0, 0, 0, 1);
const movingTrap = new Img('./assets/images/game/ninjaStar.png', 0, 0, 0, 0, 0, 1);
//no animation
const onOffTrap = new Img('./assets/images/game/onOffTrap.png', 0, 0, 0, 0, 0, 1);

class GameMap {
  constructor(tiles, timeLimit, coins, gems, traps, difficulty) {
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
    this.gemClasses = ['ReverseMovementGem', 'HealGem', 'SpeedGem', 'TeleportGem', 'DoubleCoinsGem', 'FreezeGem'];
    this.traps = traps || [];
    this.trapClasses = ['MovingTrap', 'OnOffTrap', 'Trap'];
    //difficulty
    // 0 - easy
    // 1 - hard
    this.difficulty = difficulty || 0;
  }

  // Marianna
  // draw map in relation to player
  draw(ctx, player, canvasWidth, canvasHeight) {
    //limit rendering to 5 blocks around player
    let rowStart = Math.floor(player.y / this.tileHeight - 8);
    if (rowStart < 0) rowStart = 0;
    let rowEnd = Math.floor(player.y / this.tileHeight + 8);
    if (rowEnd > this.tiles.length) rowEnd = this.tiles.length;
    let columnStart = Math.floor(player.x / this.tileWidth - 8);
    if (columnStart < 0) columnStart = 0;
    let columnEnd = Math.floor(player.x / this.tileWidth + 8);
    if (columnEnd > this.tiles[0].length) columnEnd = this.tiles[0].length;
    //temporary solution to avoid making moving traps hidden behind the path
    for (let row = rowStart; row < rowEnd; row++) {
      for (let column = columnStart; column < columnEnd; column++) {
        path.draw(
          ctx,
          (canvasWidth - player.width) / 2 - player.x + (column * this.tileWidth),
          ((canvasHeight - player.height) / 2) - player.y + (row + 1) * this.tileHeight,
          this.tileWidth,
          this.tileHeight,
        );
      }
    }
    for (let row = rowStart; row < rowEnd; row++) {
      for (let column = columnStart; column < columnEnd; column++) {
        switch (this.tiles[row][column]) {
          case String(this.tiles[row][column]).match(/^4/)?.input:
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
            // take one trap to draw as they are the same, the traps image will be different but for now only one img
            //draw all traps but only first occurence of moving trap
            if (String(this.tiles[row][column]).match(/^(6\.\d+|6\.\d+\.1)$/)) {
              const blockValue = this.tiles[row][column].split('.');
              //console.log(blockValue);
              //console.log(this.tiles[row][column]);
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
      row = Utilities.getRandomNumber(0, this.tiles.length);
      column = Utilities.getRandomNumber(0, this.tiles[row].length);
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
    // 3 gemper 10x10
    this.generateGems(this.tiles.length * this.tiles[0].length / 30);
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
      row = Utilities.getRandomNumber(0, this.tiles.length);
      column = Utilities.getRandomNumber(0, this.tiles[row].length);
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
        row = Utilities.getRandomNumber(0, this.tiles.length);
        column = Utilities.getRandomNumber(0, this.tiles[row].length);
        // has to be empty block
      } while (this.tiles[row][column] !== 0);
      this.tiles[row][column] = `4.${i}`;
      this.coins.push(new Coin(0, 0, 32, 32, coinValues[Utilities.getRandomNumber(0, coinValues.length)]));
    }
  }

  generateGems(amount) {
    // for every gem
    for (let i = 0; i < amount; i++) {
      let [row, column] = [-1, -1];
      do {
        row = Utilities.getRandomNumber(0, this.tiles.length);
        column = Utilities.getRandomNumber(0, this.tiles[row].length);
        // has to be empty block
      } while (this.tiles[row][column] !== 0);
      //add random type based on keys in gemTypes
      //get gem type key
      const gemTypeKey = this.gemClasses[Utilities.getRandomNumber(0, this.gemClasses.length)];
      this.tiles[row][column] = `5.${i}`;
      let newGem = getNewGem(gemTypeKey, [0, 0]);
      const gemValue = newGem.values[Utilities.getRandomNumber(0, newGem.values.length)];
      newGem.value = gemValue;
      newGem.affectsMe = Utilities.getRandomNumber(0, 2);
      this.gems.push(newGem);
    }
  }

  generateTraps(amount) {
    // for every trp, for now trap size is one block but we can change it
    for (let i = 0; i < amount; i++) {
      const trapTypeKey = this.trapClasses[Utilities.getRandomNumber(0, this.trapClasses.length)];
      switch (trapTypeKey) {
        case 'MovingTrap':
          const maxTries = 100; //try to find place 100 times before giving up 
          let tries = 0;
          let [startRow, endRow, startColumn, endColumn] = [-1, -1, -1, -1];
          //trap should spread at least through 2 tiles so player can avoid it
          //it additionally needs  at least 2x2 area to not block paths with width 1
          do {
            //start row and collumn will have additional number in tilemap to trigger draw only once
            startRow = Utilities.getRandomNumber(0, this.tiles.length);
            startColumn = Utilities.getRandomNumber(0, this.tiles[startRow].length);
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
            const direction = Utilities.getRandomNumber(0, 2);
            switch (direction) {
              case 0: //rows
                while (this.tiles[startRow - 1][startColumn] === 0 && this.tiles[startRow - 1][endColumn] === 0) {
                  startRow--;
                }
                //modify end row
                while (this.tiles[endRow + 1][startColumn] === 0 && this.tiles[endRow + 1][endColumn] === 0) {
                  endRow++;
                }
                //columns stay the same so reset them to 1 number
                endColumn = startColumn;
                break;
              case 1: //collumns
                while (this.tiles[startRow][startColumn - 1] === 0 && this.tiles[endRow][startColumn - 1] === 0) {
                  startColumn--;
                }
                //modify end row
                while (this.tiles[startRow][endColumn + 1] === 0 && this.tiles[endRow][endColumn + 1] === 0) {
                  endColumn++;
                }
                //rows stay the same so reset them to 1 number
                endRow = startRow;
                break;
            }
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
            let newTrap = new MovingTrap('', '', '', '', movingTrap, 0, 1, '', startRow, endRow, startColumn, endColumn);
            newTrap.value = newTrap.values[Utilities.getRandomNumber(0, newTrap.values.length)];
            this.traps.push(newTrap);
            break;
          } // else it falls down to dafault case
        case 'OnOffTrap':
          const trapImg = [onOffTrap, trap][ Utilities.getRandomNumber(0, 2)];
          const maxTries2 = 100; //try to find place 100 times before giving up 
          let tries2 = 0;
          let [startRow2, endRow2, startColumn2, endColumn2] = [-1, -1, -1, -1];
          //direction
          const direction = Utilities.getRandomNumber(0, 2);
          //how long th trap will be active
          const time = [1000, 2000, 5000, 4000, 3000];
          const activeTime = time[Utilities.getRandomNumber(0, time.length)];
          //decide if the trap should appear on or off
          const isActive = Utilities.getRandomNumber(0,2);
          switch (direction) {
            case 0: //rows
              do {
                startRow2 = Utilities.getRandomNumber(0, this.tiles.length);
                startColumn2 = Utilities.getRandomNumber(0, this.tiles[startRow2].length);
                tries2++;
              } while (tries2 < maxTries2 && (
                this.tiles[startRow2][startColumn2] !== 0 || //current block needs to be 0
                startRow2 + 1 >= this.tiles.length ||  //whether it is in te map
                startRow2 - 1 >= this.tiles.length || 
                this.tiles[startRow2+1][startColumn2] !== 0 ||
                this.tiles[startRow2-1][startColumn2] !== 0)
              );
              endRow2 = startRow2 + 1;
              endColumn2 = startColumn2;
              break;
            case 1: //collumns
              do {
                startRow2 = Utilities.getRandomNumber(0, this.tiles.length);
                startColumn2 = Utilities.getRandomNumber(0, this.tiles[startRow2].length);
                tries2++;

              } while (tries2 < maxTries2 && (this.tiles[startRow2][startColumn2] !== 0 || //current block needs to be 0
                startColumn2 + 1 >= this.tiles[startRow2].length || 
                startColumn2 - 1 >= this.tiles[startRow2].length || 
                this.tiles[startRow2][startColumn2 + 1] !== 0 ||
                this.tiles[startRow2][startColumn2 - 1] !== 0)
              );
              endRow2 = startRow2;
              endColumn2 = startColumn2 + 1;
              break;
          }

          if (tries2 < maxTries2) {
            for (let row = startRow2; row <= endRow2; row++) {
              for (let column = startColumn2; column <= endColumn2; column++) {
                this.tiles[row][column] = `6.${i}`;
              }
            }
            let newTrap = new OnOffTrap(0, 0, 32, 32, trapImg, '',activeTime, isActive);
            newTrap.value = newTrap.values[Utilities.getRandomNumber(0, newTrap.values.length)];
            this.traps.push(newTrap);
            break;
          }
        default:
          const singleTrapImg = [onOffTrap, trap][ Utilities.getRandomNumber(0, 2)];
          const maxTries3 = 100; //try to find place 100 times before giving up 
          let tries3 = 0;
          let [startRow3, endRow3, startColumn3, endColumn3] = [-1, -1, -1, -1];
          const trapTime = [1000, 2000, 5000, 4000, 3000];
          const activeTrapTime = trapTime[Utilities.getRandomNumber(0, trapTime.length)];
          //decide if the trap should appear on or off
          const isTrapActive = Utilities.getRandomNumber(0,2);
          do {
            startRow3 = Utilities.getRandomNumber(0, this.tiles.length);
            startColumn3 = Utilities.getRandomNumber(0, this.tiles[startRow3].length);
          } while (
            this.tiles[startRow3][startColumn3] !== 0 //current block needs to be 0  
          );

          this.tiles[startRow3][startColumn3] = `6.${i}`;
          let newTrap = new OnOffTrap(0, 0, 32, 32, singleTrapImg, '',activeTrapTime, isTrapActive);
          newTrap.value = newTrap.values[Utilities.getRandomNumber(0, newTrap.values.length)];
          this.traps.push(newTrap);
          break;
      }
    }
  }

  checkCollision(obj1, obj2) {
    //console.log('obj1', obj1, 'obj2', obj2);
    return (obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.height + obj1.y > obj2.y)
  }
}

function getNewGem(type, parameters) {
  let gem;
  switch (type) {
    case 'ReverseMovementGem':
      gem = new ReverseMovementGem(0, 0, 0, 0, ...parameters);
      break;
    case 'SpeedGem':
      gem = new SpeedGem(0, 0, 0, 0, ...parameters);
      break;
    case 'HealGem':
      gem = new HealGem(0, 0, 0, 0, ...parameters);
      break;
    case 'TeleportGem':
      gem = new TeleportGem(0, 0, 0, 0, ...parameters);
      break;
    case 'DoubleCoinsGem':
      gem = new DoubleCoinsGem(0, 0, 0, 0, ...parameters);
      break;
    case 'FreezeGem':
      gem = new FreezeGem(0, 0, 0, 0, ...parameters);
      break;
    default:
  }
  return gem;
}

function getNewTrap(type, parameters) {
  let trap;
  let image = new Img(parameters[0].src, parameters[0].startRow, parameters[0].startColumn, parameters[0].rows, parameters[0].columns, parameters[0].speed, parameters[0].size);
  parameters.shift();
  switch (type) {
    case 'MovingTrap':
      trap = new MovingTrap(0, 0, 16, 16, image, ...parameters);
      return trap;
    case 'OnOffTrap':
      trap = new OnOffTrap(0, 0, 32, 32, image, ...parameters);
      return trap;
  }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { GameMap };