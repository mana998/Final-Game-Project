class Player extends GameObject { //Marianna
    constructor (x, y, width, height, img, username) {
        super(x, y, width, height, img);
        this.username = username;
        this.coins = 0;
        this.health = 10;
        this.score = 0;
        this.speed = 4;
        this.direction = 'down';
        this.readyToPlay = false;
        this.isDone = false;
    }

    //Block types
        //0 path
        //1 wall
        //2 goal
        //3 player
    isBlockCollision (map, direction, blockType, columnMovement, rowMovement){
        let collision = false;
        let x = this.x + columnMovement || this.x;
        let y = this.y + rowMovement || this.y;
        //row that the player is in
        let row = Math.floor(y / map.tileHeight);
        //column that the player is in
        let column = Math.floor(x / map.tileWidth);
        switch (direction) {
            case "up" :
                if ((y % map.tileHeight !== 0 && map.tiles[row - 1][column] === blockType) || (x % map.tileWidth!== 0 && map.tiles[row - 1][column + 1] === blockType)) collision = true;
                break;
            case "down" :
                if ((y % map.tileHeight !== 0 && map.tiles[row][column] === blockType) || (x % map.tileWidth !== 0 && map.tiles[row][column + 1] === blockType)) collision = true;
                break;
            case "right" :
                if ((x % map.tileWidth!== 0 && map.tiles[row-1][column + 1] === blockType) || (y % map.tileHeight !== 0 && map.tiles[row][column + 1] === blockType)) collision = true;
                break;
            case "left" :
                if ((x % map.tileWidth!== 0 && map.tiles[row-1][column] === blockType) || (y % map.tileHeight !== 0 && map.tiles[row ][column] === blockType)) collision = true;
                break;
        }
        return collision;
    }
}