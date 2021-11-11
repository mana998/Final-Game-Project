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

    draw(ctx, x, y) {
        //if values aren't passed, use object ones
        x = x || this.x;
        y = y || this.y;
        this.img.draw(ctx, x, y, this.width, this.height);
    }
    
}