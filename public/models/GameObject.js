class GameObject {
    constructor (x, y, width, height, img) {
        //position
        this.x = x;
        this.y = y;
        //size
        this.width = width;
        this.height = height;
        //spritesheet image
        this.img = img;
    }

    draw(ctx) {
        this.img.draw(ctx, this.x, this.y, this.width, this.height);
    }
    
}