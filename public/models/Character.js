if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
    // used on the server
    // eslint-disable-next-line global-require
    GameObject = require('./GameObject').GameObject;
  }
  
  class Character extends GameObject { // Dagmara
    constructor(x, y, width, height,  startRow, startColumn, rows, columns, speed, size, currentRow, currentColumn) {
      super(x, y, width, height, new Img('./assets/images/game/wall.png',  startRow, startColumn, rows, columns, speed, size, currentRow, currentColumn));
    }
  
  }
  
  if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) module.exports = { Collectible };
  