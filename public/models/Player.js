class Player extends GameObject { //Marianna
    constructor (x, y, width, height, img, username) {
        super(x, y, width, height, img);
        this.username = username;
        this.coins = 0;
        this.health = 10;
        this.score = 0;
        this.speed = 5;
    }
   
}