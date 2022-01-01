// code taken from previous project
// Marianna
class Img {
  // size parameter might be deleted
  constructor(src, startRow, startColumn, rows, columns, speed, size, currentRow, currentColumn) {
    // src img
    this.src = src;
    this.img;
    if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
      // used on the server
      this.img = `<img src="${src}">`;
    } else {
      // used in client
      this.img = new Image();
      this.img.src = src;
    }
    // start position on spritesheet
    this.startRow = startRow;
    this.startColumn = startColumn;
    // length on spritesheet
    // how many rows/columns does the animation have
    this.rows = rows;
    this.columns = columns;
    // current animation frame
    // if it is the first time it is rendered, it takes the start positions
    this.currentRow = currentRow || startRow;
    this.currentColumn = currentColumn || startColumn;
    // animation speed
    // how many times does the function need to be called
    // in order to change to different animation frame from spritesheet
    // the higher the value the slower the animation
    this.speed = speed;
    // current value of speed - if it is smaller than desired speed, we don't load the next frame
    this.currentSpeed = 0;
    // size
    this.size = size || 1;
  }

  // Marianna
  // draw and change animation based on data in spritesheet
  draw(ctx, x, y, width, height) {
    // where on the spritesheet should we start - x and y coordinates
    // console.log(this.currentSpeed, this.speed);
    const startX = this.currentColumn * width;
    const startY = this.currentRow * height;
    if (this.speed > 0) {
      // increase the current speed value
      this.currentSpeed++;
      // if current speed value equals defined speed, then we change the animation frame
      if (this.currentSpeed === this.speed) {
        // increase the column - our animations go from left to right and then to the next line so firstly we increase columns
        this.currentColumn++;
        // reset currentSpeed to 0 again to be prepared for next call of the function
        this.currentSpeed = 0;
      }
      // if the value of currentColumn is higher than the last column, we reset it to 1st one and move to the next row
      if (this.currentColumn > this.startColumn + this.columns) {
        this.currentColumn = this.startColumn;
        this.currentRow++;
        // if current row is higher than the last row, we reset it to the first one
        if (this.currentRow > this.startRow + this.rows) {
          this.currentRow = this.startRow;
        }
      }
    }
    // draw the image (spritesheet IMG, start x on img, start y on img, width, height, x on canvas, y on canvas, width on canvas, height on canvas)
    ctx.drawImage(this.img, startX, startY, width, height, x, y, width * this.size, height * this.size);
  }
}

if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { Img };
