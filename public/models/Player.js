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
  isBlockCollision(map, direction, columnMovement, rowMovement) {
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
        collision = this.handleCollision(map.tiles[row - 1][column], row - 1, column, onlyWallCollision, map);
        // console.log('check row', row - 1, 'column', column);
        if (x % map.tileWidth) {
          collision = this.handleCollision(map.tiles[row - 1][column + 1], row - 1, column + 1, onlyWallCollision, map) || collision;
          // console.log('check row', row - 1, 'column', column + 1);
        }
        break;
      case 'down':
        if (y % map.tileHeight) {
          collision = this.handleCollision(map.tiles[row][column], row, column, onlyWallCollision, map);
          // console.log('check row', row , 'column', column);
          if (x % map.tileWidth) {
            collision = this.handleCollision(map.tiles[row][column + 1], row, column + 1, onlyWallCollision, map) || collision;
            // console.log('check row', row, 'column', column + 1);
          }
        } else {
          collision = this.handleCollision(map.tiles[row - 1][column], row - 1, column, onlyWallCollision, map);
          // console.log('check row', row - 1, 'column', column);
          if (x % map.tileWidth) {
            collision = this.handleCollision(map.tiles[row - 1][column + 1], row - 1, column + 1, onlyWallCollision, map) || collision;
            // console.log('check row', row - 1, 'column', column + 1);
          }
        }
        break;
      case 'right':
        if (x % map.tileWidth) {
          collision = this.handleCollision(map.tiles[row - 1][column + 1], row - 1, column + 1, onlyWallCollision, map);
          // console.log('check row', row - 1, 'column', column + 1);
          if (y % map.tileHeight) {
            collision = this.handleCollision(map.tiles[row][column + 1], row, column + 1, onlyWallCollision, map) || collision;
            // console.log('check row', row, 'column', column + 1);
          }
        } else {
          collision = this.handleCollision(map.tiles[row - 1][column], row - 1, column, onlyWallCollision, map);
          // console.log('check row', row - 1, 'column', column);
          if (y % map.tileHeight) {
            collision = this.handleCollision(map.tiles[row][column], row, column, onlyWallCollision, map) || collision;
            // console.log('check row', row, 'column', column + 1);
          }
        }
        break;
      case 'left':
        collision = this.handleCollision(map.tiles[row - 1][column], row - 1, column, onlyWallCollision, map);
        // console.log('check row', row - 1, 'column', column);
        if (y % map.tileHeight) {
          collision = this.handleCollision(map.tiles[row][column], row, column, onlyWallCollision, map) || collision;
          // console.log('check row', row, 'column', column);
        }
        break;
      default:
    }
    return collision;
  }

  handleCollision(block, row, column, onlyWallCollision, map) {
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
    const blockValue = block.split('.');
    this.score += map.coins[parseInt(blockValue[1])].value;
  }

  handleGemCollision(block, row, column, map) {
    map.tiles[row][column] = 0;
    const blockValue = block.split('.');
    let gem = map.gems[parseInt(blockValue[1])];
    // based on additional value that will signal gem type
    // can be passed in the map as 5.index.type - where types will be mapped
    // for now just general gem
    gem = new Gem(0, 0, 0, 0, gem.value, gem.affectsMe);
    // call the action
    gem.onCollect();
  }
}
