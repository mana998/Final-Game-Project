const talkSound = new Sound('talk', 'soundfx');

function updateServerMap(tiles) {
  socket.emit('clientMapUpdated', tiles);
}

class Player extends GameObject { // Marianna
  constructor(x, y, width, height, img, username, message, socketId, playerId) {
    super(x, y, width, height, img);
    this.username = username;
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
      down: /^([sS]|ArrowDown)$/,
    };
    this.message = message || '';
    this.playerId = playerId || '';
  }

  // Block types
  // 0 path
  // 1 wall
  // 2 goal
  // Marianna
  // check for collision
  // based on player rotation check only adjecent tiles in correct direction
  // check based on tilemap
  isBlockCollision(map, direction, columnMovement, rowMovement) {
    let collision = false;
    const x = this.x + columnMovement || this.x;
    const y = this.y + rowMovement || this.y;
    // row that the player is in
    const row = Math.floor(y / map.tileHeight);
    // column that the player is in
    const column = Math.floor(x / map.tileWidth);
    const onlyWallCollision = (columnMovement || rowMovement) ? 1 : 0; // check only for wall collision
    switch (direction) {
      case 'up':
        collision = this.handleCollision(map.tiles[row - 1][column], row - 1, column, onlyWallCollision, map);
        if (x % map.tileWidth) {
          collision = this.handleCollision(map.tiles[row - 1][column + 1], row - 1, column + 1, onlyWallCollision, map) || collision;
        }
        break;
      case 'down':
        if (y % map.tileHeight) {
          collision = this.handleCollision(map.tiles[row][column], row, column, onlyWallCollision, map);
          if (x % map.tileWidth) {
            collision = this.handleCollision(map.tiles[row][column + 1], row, column + 1, onlyWallCollision, map) || collision;
          }
        } else {
          collision = this.handleCollision(map.tiles[row - 1][column], row - 1, column, onlyWallCollision, map);
          if (x % map.tileWidth) {
            collision = this.handleCollision(map.tiles[row - 1][column + 1], row - 1, column + 1, onlyWallCollision, map) || collision;
          }
        }
        break;
      case 'right':
        if (x % map.tileWidth) {
          collision = this.handleCollision(map.tiles[row - 1][column + 1], row - 1, column + 1, onlyWallCollision, map);
          if (y % map.tileHeight) {
            collision = this.handleCollision(map.tiles[row][column + 1], row, column + 1, onlyWallCollision, map) || collision;
          }
        } else {
          collision = this.handleCollision(map.tiles[row - 1][column], row - 1, column, onlyWallCollision, map);
          if (y % map.tileHeight) {
            collision = this.handleCollision(map.tiles[row][column], row, column, onlyWallCollision, map) || collision;
          }
        }
        break;
      case 'left':
        collision = this.handleCollision(map.tiles[row - 1][column], row - 1, column, onlyWallCollision, map);
        if (y % map.tileHeight) {
          collision = this.handleCollision(map.tiles[row][column], row, column, onlyWallCollision, map) || collision;
        }
        break;
      default:
    }
    return collision;
  }

  isMovingTrapCollision(map) {
    // row that the player is in
    const row = Math.floor(this.y / map.tileHeight);
    // column that the player is in
    const column = Math.floor(this.x / map.tileWidth);
    // need to check for all 4 blocks - row, row - 1, column, column + 1,
    if (String(map.tiles[row - 1][column]).match(/^6/)) {
      this.handleCollision(map.tiles[row - 1][column], row, column, '', map);
    }
    if (this.y % map.tileHeight && String(map.tiles[row][column]).match(/^6/)) {
      this.handleCollision(map.tiles[row][column], row, column, '', map);
    }
    if (this.x % map.tileWidth && String(map.tiles[row - 1][column + 1]).match(/^6/)) {
      this.handleCollision(map.tiles[row - 1][column + 1], row, column, '', map);
    }
    if (this.y % map.tileHeight && this.x % map.tileWidth && String(map.tiles[row][column + 1]).match(/^6/)) {
      this.handleCollision(map.tiles[row][column + 1], row, column, '', map);
    }
  }

  handleCollision(block, row, column, onlyWallCollision, map) {
    // check only wall collisions
    if (block !== 1 && onlyWallCollision) block = '';
    block = String(block);
    switch (block) {
      case '1':
        return true;
      case '2':
        this.playerIsDone();
        break;
      case (block.match(/^4/)?.input):
        this.handleCoinCollision(block, row, column, map);
        break;
      case (block.match(/^5/)?.input):
        this.handleGemCollision(block, row, column, map);
        break;
      case (block.match(/^6/)?.input):
        this.handleTrapCollision(block, map);
        break;
      default:
    }
    return false;
  }

  // Marianna
  // set score when player finished the game
  // show score of all players and move to spectator mode
  playerIsDone(dead) {
    this.isDone = true;
    // maximum time - elapsed time
    let timeScore = map.timeLimit - (new Date().getTime() - startTime);
    // if final number is negative, set it to 0;
    timeScore = timeScore > 0 ? timeScore : 0;
    this.score += timeScore;
    // reset score in case player dies
    if (dead) {
      this.score = 0;
    } else {
      if (map.difficulty === 0) {
        this.score /= 2;
      }
      this.score = Math.floor(this.score / 2);
      socket.emit('savePlayer', { score: this.score, playerId: this.playerId });
    }
    endScreen.setAttribute('style', 'display:block');
    socket.emit('playerFinished', this);
    updateServerPlayer();
    // playing false so movement keys get disabled
    playing = false;
    window.addEventListener('keyup', changeSpectator);
    showEndScreen();
  }

  handleCoinCollision(block, row, column, map) {
    map.tiles[row][column] = 0;
    updateServerMap(map.tiles);
    const blockValue = block.split('.');
    map.coins[parseInt(blockValue[1], 10)].onCollect(this);
  }

  handleGemCollision(block, row, column, map) {
    map.tiles[row][column] = 0;
    updateServerMap(map.tiles);
    const blockValue = block.split('.');
    map.gems[parseInt(blockValue[1], 10)].onCollect(this, parseInt(blockValue[1], 10));
  }

  handleTrapCollision(block, map) {
    const blockValue = block.split('.');
    if (map.traps[parseInt(blockValue[1], 10)].__proto__.constructor.name === 'MovingTrap') {
      // calculate actual trap position not in relation to center of the canvas
      const trapPlaceholder = {
        x: (map.traps[parseInt(blockValue[1], 10)].startColumn * map.tileWidth) + map.traps[parseInt(blockValue[1], 10)].x,
        y: ((map.traps[parseInt(blockValue[1], 10)].startRow + 1) * map.tileHeight) + map.traps[parseInt(blockValue[1], 10)].y,
        width: map.traps[parseInt(blockValue[1], 10)].width,
        height: map.traps[parseInt(blockValue[1], 10)].height,
      };
      // return if no collision
      if (!Utilities.checkCollision(player, trapPlaceholder)) {
        return;
      }
    }
    map.traps[parseInt(blockValue[1], 10)].onCollision(player);
    if (this.health <= 0) {
      if (!this.isDone) {
        this.playerIsDone(1);
      }
    }
  }

  // detect whether to initiate conversation
  isNearPlayers(players) {
    let isNear = false;
    players.map((gamePlayer) => {
      if (this.username !== gamePlayer.username) {
        if (!gamePlayer.isDone
              && Utilities.checkCollision(gamePlayer, {
                x: player.x - 2 * map.tileWidth,
                y: player.y - 2 * map.tileHeight,
                width: player.width * 5,
                height: player.height * 5,
              })) {
          isNear = true;
          return isNear;
        }
      }
    });
    return isNear;
  }

  // draw the player and display message while talking
  draw(ctx, x, y) {
    super.draw(ctx, x, y);
    displayText(this.message, x + player.width / 2, y - 10);
    if (this.message && talkSound.sound.paused) {
      talkSound.play();
    }
  }
}
