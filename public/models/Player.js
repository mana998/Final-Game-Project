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

  //Block types
        //0 path
        //1 wall
        //2 goal
        //3 player
    //Marianna
    //check for collision
    //based on player rotation check only adjecent tiles in correct direction
    //check based on tilemap
    //for future: instead of collision might just return tiletype if there is collision and based on that act
    isBlockCollision (map, direction, columnMovement, rowMovement){
      let collision = false;
      let x = this.x + columnMovement || this.x;
      let y = this.y + rowMovement || this.y;
      //row that the player is in
      let row = Math.floor(y / map.tileHeight);
      //column that the player is in
      let column = Math.floor(x / map.tileWidth);
      let onlyWallCollision = (columnMovement || rowMovement) ? 1 : 0; //check only for wall collision
      switch (direction) {
          case "up" :
                  collision = this.handleCollision(map.tiles[row - 1][column], row - 1, column, onlyWallCollision);
                  /*console.log('collision1',collision);
                  collision = this.handleCollision(map.tiles[row - 1][column + 1], row - 1, column + 1, onlyWallCollision) || collision;
                  console.log('collision2',collision);*/
                  break;
          case "down" :
              collision = this.handleCollision(map.tiles[row][column + 1], row, column + 1, onlyWallCollision);
              //collision = this.handleCollision(map.tiles[row][column ], row, column, onlyWallCollision) || collision;
              break;
          case "right" :
              collision = this.handleCollision(map.tiles[row][column + 1], row, column + 1, onlyWallCollision);
              //collision = this.handleCollision(map.tiles[row - 1][column + 1], row - 1, column + 1, onlyWallCollision) || collision;
              break;
          case "left" :
              collision = this.handleCollision( map.tiles[row][column], row, column, onlyWallCollision);
              /*console.log('collision1',collision);
              collision = this.handleCollision( map.tiles[row - 1][column], row - 1, column, onlyWallCollision) || collision;
              console.log('collision2',collision);*/
              break;
          default:
      }
      console.log('collision',collision);
      return collision;
    }

    handleCollision (block, row, column, onlyWallCollision) {
      //check only wall collisions
      if (block !== 1 && onlyWallCollision) block = '';
      block = String(block);
      switch (block) {
        case '1':
          //console.log("wall", row, column);
          return true;
        case '2':
          //console.log("goal", row, column);
          this.playerIsDone();
          break;
        case (block.match(/^4/)?.input):
          console.log("coin", row, column);
          this.handleCoinCollision(block, row, column);
          break;
        default:
      }
    }

    //Marianna
    //set score when player finished the game
    //show score of all players and move to spectator mode
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

    handleCoinCollision(block, row, column) {
      map.tiles[row][column] = 0;
      const blockValue = block.split('.');
      this.score += blockValue[1];
      console.log(map);
    }
}
