//how much time until the player can be affected by the trap again 
//PROBLEM WITH THE TRAP: reset trap effect to 0 when palayer stop touching the trap
//FOR WHOEVER WILL GOOD THE SPEED JEM, IT MIGHT BR GOOD TO CHANGE MAXTRAPTIME BASED ON SPEED
const maxTrapTime = 10;
let trapEffect = 0;

class Player extends GameObject { // Marianna
  constructor(x, y, width, height, img, username, socketId) {
    super(x, y, width, height, img);
    this.username = username;
    this.coins = 0;
    this.health = 10;
    this.score = 0;
    this.speed = 4;
    this.direction = 'down';
    this.readyToPlay = false;
    this.socketId = socketId;
    this.isDone = false;
    this.movement = {
      left: /^([aA]|ArrowLeft)$/,
      right: /^([dD]|ArrowRight)$/,
      up: /^([wW]|ArrowUp)$/,
      down: /^([sS]|ArrowDown)$/
    }
  }

  // Block types
  // 0 path
  // 1 wall
  // 2 goal
  // 3 player
  // Marianna
  // check for collision
  // based on player rotation check only adjecent tiles in correct direction
  // check based on tilemap
  // for future: instead of collision might just return tiletype if there is collision and based on that act
  isBlockCollision(map, direction, canvasHeight, canvasWidth, columnMovement, rowMovement) {
    let collision = false;
    const x = this.x + columnMovement || this.x;
    const y = this.y + rowMovement || this.y;
    // row that the player is in
    const row = Math.floor(y / map.tileHeight);
    // column that the player is in
    const column = Math.floor(x / map.tileWidth);
    const onlyWallCollision = (columnMovement || rowMovement) ? 1 : 0; // check only for wall collision
    // console.log('row', row, 'column', column, 'x', x, 'y', y);
    switch (direction) {
      case 'up':
        collision = this.handleCollision(map.tiles[row - 1][column], row - 1, column, onlyWallCollision, map, canvasHeight, canvasWidth);
        // console.log('check row', row - 1, 'column', column);
        if (x % map.tileWidth) {
          collision = this.handleCollision(map.tiles[row - 1][column + 1], row - 1, column + 1, onlyWallCollision, map, canvasHeight, canvasWidth) || collision;
          // console.log('check row', row - 1, 'column', column + 1);
        }
        break;
      case 'down':
        if (y % map.tileHeight) {
          collision = this.handleCollision(map.tiles[row][column], row, column, onlyWallCollision, map, canvasHeight, canvasWidth);
          // console.log('check row', row , 'column', column);
          if (x % map.tileWidth) {
            collision = this.handleCollision(map.tiles[row][column + 1], row, column + 1, onlyWallCollision, map, canvasHeight, canvasWidth) || collision;
            // console.log('check row', row, 'column', column + 1);
          }
        } else {
          collision = this.handleCollision(map.tiles[row - 1][column], row - 1, column, onlyWallCollision, map, canvasHeight, canvasWidth);
          // console.log('check row', row - 1, 'column', column);
          if (x % map.tileWidth) {
            collision = this.handleCollision(map.tiles[row - 1][column + 1], row - 1, column + 1, onlyWallCollision, map, canvasHeight, canvasWidth) || collision;
            // console.log('check row', row - 1, 'column', column + 1);
          }
        }
        break;
      case 'right':
        if (x % map.tileWidth) {
          collision = this.handleCollision(map.tiles[row - 1][column + 1], row - 1, column + 1, onlyWallCollision, map, canvasHeight, canvasWidth);
          // console.log('check row', row - 1, 'column', column + 1);
          if (y % map.tileHeight) {
            collision = this.handleCollision(map.tiles[row][column + 1], row, column + 1, onlyWallCollision, map, canvasHeight, canvasWidth) || collision;
            // console.log('check row', row, 'column', column + 1);
          }
        } else {
          collision = this.handleCollision(map.tiles[row - 1][column], row - 1, column, onlyWallCollision, map, canvasHeight, canvasWidth);
          // console.log('check row', row - 1, 'column', column);
          if (y % map.tileHeight) {
            collision = this.handleCollision(map.tiles[row][column], row, column, onlyWallCollision, map, canvasHeight, canvasWidth) || collision;
            // console.log('check row', row, 'column', column + 1);
          }
        }
        break;
      case 'left':
        collision = this.handleCollision(map.tiles[row - 1][column], row - 1, column, onlyWallCollision, map, canvasHeight, canvasWidth);
        // console.log('check row', row - 1, 'column', column);
        if (y % map.tileHeight) {
          collision = this.handleCollision(map.tiles[row][column], row, column, onlyWallCollision, map, canvasHeight, canvasWidth) || collision;
          // console.log('check row', row, 'column', column);
        }
        break;
      default:
    }
    return collision;
  }

  handleCollision(block, row, column, onlyWallCollision, map, canvasHeight, canvasWidth) {
    // check only wall collisions
    if (block !== 1 && onlyWallCollision) block = '';
    block = String(block);
    switch (block) {
      case '1':
        // console.log("wall", row, column);
        return true;
      case '2':
        // console.log("goal", row, column);
        this.playerIsDone();
        break;
      case (block.match(/^4/)?.input):
        // console.log("coin", row, column);
        this.handleCoinCollision(block, row, column, map);
        break;
      case (block.match(/^5/)?.input):
        this.handleGemCollision(block, row, column, map);
        break;
      case (block.match(/^6/)?.input):
        this.handleTrapCollision(block, map, canvasHeight, canvasWidth);
        break;
      default:
    }
  }

  // Marianna
  // set score when player finished the game
  // show score of all players and move to spectator mode
  playerIsDone() {
    this.isDone = true;
    // maximum time - elapsed time
    let timeScore = map.timeLimit - (new Date().getTime() - startTime);
    // if final number is negative, set it to 0;
    timeScore = timeScore > 0 ? timeScore : 0;
    this.score += timeScore;
    endScreen.setAttribute('style', 'display:block');
    socket.emit('playerFinished', this);
    this.draw = () => {};
    // playing false so movement keys get disabled
    playing = false;
    window.addEventListener('keyup', changeSpectator);
  }

  handleCoinCollision(block, row, column, map) {
    map.tiles[row][column] = 0;
    updateServerMap(map.tiles);
    const blockValue = block.split('.');
    this.score += map.coins[parseInt(blockValue[1])].value;
  }

  handleGemCollision(block, row, column, map) {
    map.tiles[row][column] = 0;
    updateServerMap(map.tiles);
    const blockValue = block.split('.');
    map.gems[parseInt(blockValue[1])].onCollect(this);
  }

  handleTrapCollision(block, map, canvasHeight, canvasWidth) {
    if (trapEffect === 0 ) {
      const blockValue = block.split('.');
      if (map.traps[parseInt(blockValue[1])].__proto__.constructor.name === 'MovingTrap') {
        //calculate actual player position not in relation to center of the canvas
        const playerPlaceholder = {
          x: (player.x * 2) / (canvasWidth - player.width),
          y: (player.y * 2) / (canvasHeight - player.height),
          width: player.width,
          height: player.height
        }
        //return if no collision
        if (!map.checkCollision(playerPlaceholder, map.traps[parseInt(blockValue[1])])) {
          return;
        }
      }
      this.health -= map.traps[parseInt(blockValue[1])].value;
      map.traps[parseInt(blockValue[1])].onCollision();
    }
    trapEffect += 1;
    if (trapEffect === maxTrapTime) {
      trapEffect = 0;
    }
    
  }
}

function updateServerMap(tiles) {
  socket.emit('clientMapUpdated', tiles);
}
