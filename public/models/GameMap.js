/* eslint-disable global-require */
// Marianna & Dagmara
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

const Utilities = new Utils();

const wall = new Img('./assets/images/game/wall.png', 0, 0, 0, 0, 0, 1);
const goal = new Img('./assets/images/game/goal.png', 0, 0, 0, 0, 0, 1);
const path = new Img('./assets/images/game/path.png', 0, 0, 0, 0, 0, 1);
const coin = new Img('./assets/images/game/coin.png', 0, 0, 0, 4, 5, 1);
const gem = new Img('./assets/images/game/gem.png', 0, 0, 0, 3, 5, 1);
const trap = new Img('./assets/images/game/trap.png', 0, 0, 0, 0, 0, 1);
const movingTrap = new Img('./assets/images/game/ninjaStar.png', 0, 0, 0, 0, 0, 1);
const onOffTrap = new Img('./assets/images/game/onOffTrap.png', 0, 0, 0, 0, 0, 1);

function getNewGem(type, parameters) {
  let gemObject;
  switch (type) {
    case 'ReverseMovementGem':
      gemObject = new ReverseMovementGem(0, 0, 0, 0, ...parameters);
      break;
    case 'SpeedGem':
      gemObject = new SpeedGem(0, 0, 0, 0, ...parameters);
      break;
    case 'HealGem':
      gemObject = new HealGem(0, 0, 0, 0, ...parameters);
      break;
    case 'TeleportGem':
      gemObject = new TeleportGem(0, 0, 0, 0, ...parameters);
      break;
    case 'DoubleCoinsGem':
      gemObject = new DoubleCoinsGem(0, 0, 0, 0, ...parameters);
      break;
    case 'FreezeGem':
      gemObject = new FreezeGem(0, 0, 0, 0, ...parameters);
      break;
    default:
  }
  return gemObject;
}

function getNewTrap(type, parameters) {
  let trapObject;
  const image = new Img(
    parameters[4].src,
    parameters[4].startRow,
    parameters[4].startColumn,
    parameters[4].rows,
    parameters[4].columns,
    parameters[4].speed,
    parameters[4].size,
  );
  // remove first 1 values because they are hardcoded
  parameters.splice(0, 5);
  // remove values parameter
  parameters.splice(1, 1);
  switch (type) {
    case 'MovingTrap':
      trapObject = new MovingTrap(0, 0, 16, 16, image, ...parameters);
      break;
    case 'OnOffTrap':
      trapObject = new OnOffTrap(0, 0, 32, 32, image, ...parameters);
      break;
    default:
      break;
  }
  return trapObject;
}

class GameMap {
  constructor(tiles, timeLimit, coins, gems, traps, difficulty) {
    // 0 path
    // 1 wall
    // 2 goal
    // 3 player - not used
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
    // difficulty
    // 0 - easy
    // 1 - hard
    this.difficulty = difficulty || 0;
  }

  // Marianna
  // draw map in relation to player
  draw(ctx, player, canvasWidth, canvasHeight) {
    // limit rendering to 8 blocks around player
    let rowStart = Math.floor(player.y / this.tileHeight - 8);
    if (rowStart < 0) rowStart = 0;
    let rowEnd = Math.floor(player.y / this.tileHeight + 8);
    if (rowEnd > this.tiles.length) rowEnd = this.tiles.length;
    let columnStart = Math.floor(player.x / this.tileWidth - 8);
    if (columnStart < 0) columnStart = 0;
    let columnEnd = Math.floor(player.x / this.tileWidth + 8);
    if (columnEnd > this.tiles[0].length) columnEnd = this.tiles[0].length;
    // renders the path everywhere so than we can render objects on top of it
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
            coin.draw(
              ctx,
              (canvasWidth - player.width) / 2 - player.x + (column * this.tileWidth),
              ((canvasHeight - player.height) / 2) - player.y + (row + 1) * this.tileHeight,
              this.tileWidth,
              this.tileHeight,
            );
            break;
          case String(this.tiles[row][column]).match(/^5/)?.input:
            gem.draw(
              ctx,
              (canvasWidth - player.width) / 2 - player.x + (column * this.tileWidth),
              ((canvasHeight - player.height) / 2) - player.y + (row + 1) * this.tileHeight,
              this.tileWidth,
              this.tileHeight,
            );
            break;
          case String(this.tiles[row][column]).match(/^6/)?.input:
            // draw all traps but only first occurence of moving trap
            if (String(this.tiles[row][column]).match(/^(6\.\d+|6\.\d+\.1)$/)) {
              const blockValue = this.tiles[row][column].split('.');
              map.traps[parseInt(blockValue[1], 10)].draw(
                ctx,
                (canvasWidth - player.width) / 2 - player.x + (column * this.tileWidth),
                ((canvasHeight - player.height) / 2) - player.y + (row + 1) * this.tileHeight,
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
    this.timeLimit = (60 * 1000 * this.tiles.length * this.tiles[0].length) / 100;
    // generate coins
    // 5 coins per 10x10
    this.generateCoins((this.tiles.length * this.tiles[0].length) / 20);
    // generate gems
    // 3 gemper 10x10
    this.generateGems((this.tiles.length * this.tiles[0].length) / 30);
    // generate traps
    // 1 trap 10x10
    this.generateTraps((this.tiles.length * this.tiles[0].length) / 100);
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
    } while (Math.abs(row - this.goalRow) < this.tiles.length / 3
      || Math.abs(column - this.goalColumn) < this.tiles[row].length / 3
      || this.tiles[row][column] !== 0
    );
    // even though we don't use this value to draw/monitore player position on the map
    // it's useful to avoid rendering objects at the player start position
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
      // add random type based on keys in gemTypes
      // get gem type key
      const gemTypeKey = this.gemClasses[Utilities.getRandomNumber(0, this.gemClasses.length)];
      this.tiles[row][column] = `5.${i}`;
      // create new gem object method
      const newGem = getNewGem(gemTypeKey, [0, 0]);
      const gemValue = newGem.values[Utilities.getRandomNumber(0, newGem.values.length)];
      newGem.value = gemValue;
      newGem.affectsMe = Utilities.getRandomNumber(0, 2);
      this.gems.push(newGem);
    }
  }

  generateTraps(amount) {
    // for every trap, for now trap size is one block but we can change it
    const trapTime = [2000, 5000, 4000, 3000];
    const trapImages = [onOffTrap, trap];
    const maxTries = 100; // try to find place 100 times before giving up
    for (let i = 0; i < amount; i++) {
      const trapTypeKey = this.trapClasses[Utilities.getRandomNumber(0, this.trapClasses.length)];
      let tries = 0;
      let [startRow, endRow, startColumn, endColumn] = [-1, -1, -1, -1];
      switch (trapTypeKey) {
        case 'MovingTrap':
          // trap should spread at least through 2 tiles so player can avoid it
          // it additionally needs  at least 2x2 area to not block paths with width 1
          do {
            // start row and collumn will have additional number in tilemap to trigger draw only once
            [startRow, startColumn, tries] = this.tryGetTrapPosition(startRow, startColumn, tries);
            // has to be empty block
          } while (this.checkAvailableTrapTiles(startRow, startColumn, tries, maxTries, 1));
          if (tries < maxTries) {
            endRow = startRow + 1;
            endColumn = startColumn + 1;
            // decide on direction of the trap
            const direction = Utilities.getRandomNumber(0, 2);
            switch (direction) {
              case 0: // rows
                while (this.tiles[startRow - 1][startColumn] === 0 && this.tiles[startRow - 1][endColumn] === 0) {
                  startRow--;
                }
                // modify end row
                while (this.tiles[endRow + 1][startColumn] === 0 && this.tiles[endRow + 1][endColumn] === 0) {
                  endRow++;
                }
                // columns stay the same so reset them to 1 number
                endColumn = startColumn;
                break;
              case 1: // collumns
                while (this.tiles[startRow][startColumn - 1] === 0 && this.tiles[endRow][startColumn - 1] === 0) {
                  startColumn--;
                }
                // modify end row
                while (this.tiles[startRow][endColumn + 1] === 0 && this.tiles[endRow][endColumn + 1] === 0) {
                  endColumn++;
                }
                // rows stay the same so reset them to 1 number
                endRow = startRow;
                break;
              default:
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
            const newTrap = new MovingTrap('', '', '', '', movingTrap, 0, 1, '', startRow, endRow, startColumn, endColumn);
            newTrap.value = newTrap.values[Utilities.getRandomNumber(0, newTrap.values.length)];
            this.traps.push(newTrap);
            break;
          } // else it falls down to dafault case
        case 'OnOffTrap':
          const trapImg = trapImages[Utilities.getRandomNumber(0, trapImages.length)];
          // direction
          const direction = Utilities.getRandomNumber(0, 2);
          // how long th trap will be active
          const activeTime = trapTime[Utilities.getRandomNumber(0, trapTime.length)];
          // decide if the trap should appear on or off
          const isActive = Utilities.getRandomNumber(0, 2);
          switch (direction) {
            case 0: // rows
              do {
                [startRow, startColumn, tries] = this.tryGetTrapPosition(startRow, startColumn, tries);
              } while (this.checkAvailableTrapTiles(startRow, startColumn, tries, maxTries, 2));
              endRow = startRow + 1;
              endColumn = startColumn;
              break;
            case 1: // collumns
              do {
                [startRow, startColumn, tries] = this.tryGetTrapPosition(startRow, startColumn, tries);
              } while (this.checkAvailableTrapTiles(startRow, startColumn, tries, maxTries, 3));
              endRow = startRow;
              endColumn = startColumn + 1;
              break;
          }

          if (tries < maxTries) {
            for (let row = startRow; row <= endRow; row++) {
              for (let column = startColumn; column <= endColumn; column++) {
                this.tiles[row][column] = `6.${i}`;
              }
            }
            const newTrap = new OnOffTrap(0, 0, 32, 32, trapImg, '', activeTime, isActive);
            newTrap.value = newTrap.values[Utilities.getRandomNumber(0, newTrap.values.length)];
            this.traps.push(newTrap);
            break;
          }
        default:
          const singleTrapImg = trapImages[Utilities.getRandomNumber(0, trapImages.length)];
          [startRow, startColumn] = [-1, -1];
          const activeTrapTime = trapTime[Utilities.getRandomNumber(0, trapTime.length)];
          // decide if the trap should appear on or off
          const isTrapActive = Utilities.getRandomNumber(0, 2);
          do {
            [startRow, startColumn] = this.tryGetTrapPosition(startRow, startColumn);
          } while (this.checkAvailableTrapTiles(startRow, startColumn, tries, maxTries));
          this.tiles[startRow][startColumn] = `6.${i}`;
          const newTrap = new OnOffTrap(0, 0, 32, 32, singleTrapImg, '', activeTrapTime, isTrapActive);
          newTrap.value = newTrap.values[Utilities.getRandomNumber(0, newTrap.values.length)];
          this.traps.push(newTrap);
          break;
      }
    }
  }

  tryGetTrapPosition(startRow, startColumn, tries = 0) {
    startRow = Utilities.getRandomNumber(0, this.tiles.length);
    startColumn = Utilities.getRandomNumber(0, this.tiles[startRow].length);
    tries++;
    return [startRow, startColumn, tries];
  }

  // 0 - default
  // 1 - moving trap
  // 2 - on off trap - rows
  // 3 - on off trap - columns
  checkAvailableTrapTiles(startRow, startColumn, tries, maxTries, trapType = 0) {
    // condition for every trap
    let isAvailable = this.tiles[startRow][startColumn] !== 0; // current block needs to be 0
    // moving traps
    if (trapType === 1 && !isAvailable) {
      isAvailable = isAvailable
      || this.tiles[startRow + 1][startColumn + 1]
      || this.tiles[startRow + 1][startColumn + 1] !== 0 // block in next row and next collumn
      || this.tiles[startRow][startColumn + 1];
    }
    if ((trapType === 1 || trapType === 2) && !isAvailable) {
      isAvailable = isAvailable || startRow + 1 >= this.tiles.length
        || this.tiles[startRow + 1][startColumn] !== 0; // block in next row needs to be 0
      if (trapType === 2 && !isAvailable) {
        isAvailable = isAvailable || startRow - 1 >= this.tiles.length
          || this.tiles[startRow - 1][startColumn] !== 0;
      }
    }
    if ((trapType === 1 || trapType === 3) && !isAvailable) {
      isAvailable = isAvailable || startColumn + 1 >= this.tiles[startRow].length
        || this.tiles[startRow][startColumn + 1] !== 0; // block in next collumn
      if (trapType === 3 && !isAvailable) {
        isAvailable = isAvailable || startColumn - 1 >= this.tiles[startRow].length || this.tiles[startRow][startColumn - 1] !== 0;
      }
    }
    // everything except of default
    if (trapType) {
      isAvailable = isAvailable && tries < maxTries;
    }
    return isAvailable;
  }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { GameMap };
