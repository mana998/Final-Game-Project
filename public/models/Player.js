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
  isBlockCollision(map, direction, blockType, columnMovement, rowMovement) {
    let collision = false;
    const x = this.x + columnMovement || this.x;
    const y = this.y + rowMovement || this.y;
    // row that the player is in
    const row = Math.floor(y / map.tileHeight);
    // column that the player is in
    const column = Math.floor(x / map.tileWidth);
    switch (direction) {
      case 'up':
        // eslint-disable-next-line max-len
        if ((y % map.tileHeight !== 0 && map.tiles[row - 1][column] === blockType) || (x % map.tileWidth !== 0 && map.tiles[row - 1][column + 1] === blockType)) collision = true;
        break;
      case 'down':
        // eslint-disable-next-line max-len
        if ((y % map.tileHeight !== 0 && map.tiles[row][column] === blockType) || (x % map.tileWidth !== 0 && map.tiles[row][column + 1] === blockType)) collision = true;
        break;
      case 'right':
        // eslint-disable-next-line max-len
        if ((x % map.tileWidth !== 0 && map.tiles[row - 1][column + 1] === blockType) || (y % map.tileHeight !== 0 && map.tiles[row][column + 1] === blockType)) { collision = true; }
        break;
      case 'left':
        // eslint-disable-next-line max-len
        if ((x % map.tileWidth !== 0 && map.tiles[row - 1][column] === blockType) || (y % map.tileHeight !== 0 && map.tiles[row][column] === blockType)) { collision = true; }
        break;
      default:
    }
    return collision;
  }
}
