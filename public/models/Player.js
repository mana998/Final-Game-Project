class Player extends GameObject { //Marianna
    constructor (x, y, width, height, img, username, socketId) {
        super(x, y, width, height, img);
        this.username = username;
        this.coins = 0;
        this.health = 10;
        this.score = 0;
        this.speed = 4;
        this.direction = 'down';
        this.readyToPlay = false;
        this.socketId = socketId;
    }

    isWallCollision (map, direction, columnMovement, rowMovement){
        let collision = false;
        let x = this.x + columnMovement;
        let y = this.y + rowMovement
        //row that the player is in
        let row = Math.floor(y / map.tileHeight);
        //column that the player is in
        let column = Math.floor(x / map.tileWidth);
        switch (direction) {
            case "up" :
                if ((y % map.tileHeight !== 0 && map.tiles[row - 1][column] === 1) || (x % map.tileWidth!== 0 && map.tiles[row - 1][column + 1] === 1)) collision = true;
                break;
            case "down" :
                if ((y % map.tileHeight !== 0 && map.tiles[row][column] === 1) || (x % map.tileWidth !== 0 && map.tiles[row][column + 1] === 1)) collision = true;
                break;
            case "right" :
                if ((x % map.tileWidth!== 0 && map.tiles[row-1][column + 1] === 1) || (y % map.tileHeight !== 0 && map.tiles[row][column + 1] === 1)) collision = true;
                break;
            case "left" :
                if ((x % map.tileWidth!== 0 && map.tiles[row-1][column] === 1) || (y % map.tileHeight !== 0 && map.tiles[row ][column] === 1)) collision = true;
                break;
        }
        return collision;
    }
}