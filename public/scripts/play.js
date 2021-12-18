//Dagmara & Marianna
const walkingSound = new Sound('walk', 'soundfx');
walkingSound.sound.volume = 0.5;
walkingSound.sound.loop = true;
walkingSound.sound.setAttribute("id", "walk");

let displayMessageCount = -1;
const maxDisplayMessageCount = 60;

const healthOutline = new Img('./assets/images/game/healthOutline.png', 0, 0, 0, 0, 0, 1);
const healthFill = new Img('./assets/images/game/healthFill.png', 0, 0, 0, 0, 0, 1);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// global objects for map and player
let map;
let player;
let spectatingPlayer = {};
let startTime;

// change canvas size on resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// change canvas size onload
window.addEventListener('load', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

//Marianna
//entry values are for character with value 0 (red player)
let animations = {
  // startRow, startColumn, rows, columns value 
  down: [0, 0, 0, 2],
  left: [1, 0, 0, 2],
  right: [2, 0, 0, 2],
  up: [3, 0, 0, 2],
};

//Dagmara
//set right animaton for the character
function setAnimation (value) {
  //calculate the start position for each character
  let startColumnPosition = value * 3; 
  if (value > 3) {
    //calculate the start position for each character in second row
    startColumnPosition = (value - 4) *3;
    animations.down[0] = animations.down[0] + 4;
    animations.left[0] = animations.left[0] + 4;
    animations.right[0] = animations.right[0] + 4;
    animations.up[0] = animations.up[0] + 4;
  }
  animations.down[1] = startColumnPosition;
  animations.left[1] =  startColumnPosition;
  animations.right[1] =  startColumnPosition;
  animations.up[1] =  startColumnPosition;
}

// Marianna
// draw everything
function draw(data) {
  // clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // set player that will be centered
  // by default it's your player
  let compareToPlayer = player;
  // if your player is done it changes to another player to spectate
  if (player.isDone) {
    const username = (spectatingPlayer) ? spectatingPlayer.username : '';
    const tempPlayer = data.players.find((gamePlayer) => gamePlayer.username === username) || null;
    // if no player is defined to spectate, it asks server for next available one
    if (!tempPlayer || tempPlayer.isDone) {
      socket.emit('changeSpectator', (spectatingPlayer && tempPlayer) ? tempPlayer.username : '');
    } else { // else it sets the player
      spectatingPlayer = new Player(
        tempPlayer.x,
        tempPlayer.y,
        tempPlayer.width,
        tempPlayer.height,
        new Img(
          tempPlayer.img.src,
          tempPlayer.img.startRow,
          tempPlayer.img.startColumn,
          tempPlayer.img.rows,
          tempPlayer.img.columns,
          tempPlayer.img.speed,
          '',
          tempPlayer.img.currentRow,
          tempPlayer.img.currentColumn,
        ),
        tempPlayer.username,
        tempPlayer.message
      );
      compareToPlayer = spectatingPlayer;
    }
  } else {
    player.isMovingTrapCollision(map, canvas.height, canvas.width)
  }
  // draw map
  map.draw(ctx, compareToPlayer, canvas.width, canvas.height);
  // draw all players
  data.players.map((gamePlayer) => {
    if (player.username === gamePlayer.username) {
      // draw your player - center camera
      player.draw(ctx, (canvas.width - player.width) / 2, (canvas.height - player.height) / 2);
    } else if (spectatingPlayer && spectatingPlayer.username === gamePlayer.username) {
      // or draw spectating player - center camera
      spectatingPlayer.draw(ctx, (canvas.width - spectatingPlayer.width) / 2, (canvas.height - spectatingPlayer.height) / 2);
    } else if (!gamePlayer.isDone) {
      // or draw all other players in relation to spectating player
      // transform data into proper object
      gamePlayer = new Player(
        gamePlayer.x,
        gamePlayer.y,
        gamePlayer.width,
        gamePlayer.height,
        new Img(
          gamePlayer.img.src,
          gamePlayer.img.startRow,
          gamePlayer.img.startColumn,
          gamePlayer.img.rows,
          gamePlayer.img.columns,
          gamePlayer.img.speed,
          '',
          gamePlayer.img.currentRow,
          gamePlayer.img.currentColumn,
        ),
        gamePlayer.username,
        gamePlayer.message,
      );
      // get data about other players from server
      gamePlayer.draw(ctx, ((canvas.width - compareToPlayer.width) / 2) - compareToPlayer.x + gamePlayer.x, ((canvas.height - compareToPlayer.height) / 2) - compareToPlayer.y + gamePlayer.y);
    }
  });
  player.isNear = player.isNearPlayers(data.players);
  if (!player.isDone) {
    if (player.isNear) {
      $('#enterButton').css('display', 'block');
      if (!player.message && displayMessageCount === -1) socket.emit('getRandomMessage');
      displayMessageCount++
    }
    if (!player.isNear || displayMessageCount === maxDisplayMessageCount) {
      player.message = '';
      updateServerPlayer();
      displayMessageCount = 0;
      if (!player.isNear) {
        displayMessageCount = -1;
        $('#enterButton').css('display', 'none');
      }
    }
  };
}

// Marianna
// update server if something on the client changed
function updateServerPlayer() {
  socket.emit('clientPlayerUpdated', {player});
}

function handleMapUpdated(tiles) {
  map.tiles = tiles;
}

// Marianna
// Stop animation when player stops moving
function stopPlayer(e) {
  // stop if game is not in progress
  if (!playing || player.isDone) return;
  // update only if the key was for movement
  if (e.key.match(/^([aAdDsSwW]|Arrow(Up|Down|Right|Left))$/)) {
    // ensure middle position
    player.img.startColumn += 1;
    player.img.currentColumn = player.img.startColumn;
    // stop animation movement
    player.img.rows = 0;
    player.img.columns = 0;
    player.direction = '';
    walkingSound.pause();
    updateServerPlayer();
  }
}

// Marianna
// change animation based on the direction of the player
function changeAnimation(direction) {
  // only change animation when direction changes
  if (player.direction !== direction) {
    player.img.rows = animations[direction][2];
    player.img.columns = animations[direction][3];
    player.img.startRow = animations[direction][0];
    player.img.startColumn = animations[direction][1];
    player.img.currentRow = animations[direction][0];
    player.img.currentColumn = animations[direction][1];
    player.direction = direction;
  }
}

// Marianna
// key listeners to move the player
function movePlayer(e) {
  //! !!!THINK ABOUT STORING BLOCK TYPES IN SOME GLOBAL VARIABLES!!!!
  if (!playing || player.isDone) return;
  let currentSpeed = player.speed;
  //used when speed is dirrent that 4 so the player is not stuck on turns
  let denominator = 1;
  switch (e.key) {
    case (e.key.match(player.movement.left)?.input):
      changeAnimation('left');
      // check for wall collision
      do {
        currentSpeed = currentSpeed / denominator;
        if (!player.isBlockCollision(map, 'left','', '', -currentSpeed, 0)) {
          player.x -= currentSpeed;
          player.isBlockCollision(map, 'left', canvas.height, canvas.width);
        } else {
          denominator = 2;
        }
      }while (player.isBlockCollision(map, 'left','', '', -currentSpeed, 0));
      break;
    case (e.key.match(player.movement.right)?.input):
      changeAnimation('right');
      do {
        currentSpeed = currentSpeed / denominator;
        if (!player.isBlockCollision(map, 'right','', '', currentSpeed, 0)) {
          player.x += currentSpeed;
          player.isBlockCollision(map, 'right', canvas.height, canvas.width);
        } else {
          denominator = 2;
        }
      }while (player.isBlockCollision(map, 'right','', '', currentSpeed, 0));
      break;
    case (e.key.match(player.movement.up)?.input):
      changeAnimation('up');
      do {
        currentSpeed = currentSpeed / denominator
        if (!player.isBlockCollision(map, 'up','', '', 0, -currentSpeed)) {
          player.y -= currentSpeed;
          player.isBlockCollision(map, 'up', canvas.height, canvas.width);
        } else {
          denominator = 2;
        }
      }while (player.isBlockCollision(map, 'up','', '', 0, -currentSpeed));
      break;
    case (e.key.match(player.movement.down)?.input):
      changeAnimation('down');
      do {
        currentSpeed = currentSpeed / denominator;
        if (!player.isBlockCollision(map, 'down','', '', 0, currentSpeed)) {
          player.y += currentSpeed;
          player.isBlockCollision(map, 'down', canvas.height, canvas.width);
        } else {
          denominator = 2;
        }
      }while (player.isBlockCollision(map, 'down','', '', 0, currentSpeed));
      break;
    case "Enter":
      //player is near other players - we don't need to check for collision again
      if (player.isNear) {
        $('#interactionMenu').css('display', 'block');
      }
    default:
      // no need to update server if player didn't move
      return;
  }
  if (walkingSound.sound.paused) walkingSound.play();
  // add update of server
  updateServerPlayer();
}

//Marianna
function handleMapCreated(data) {
  map = new GameMap(data.gameMap.tiles, data.gameMap.timeLimit, data.gameMap.coins, data.gameMap.gems, data.gameMap.traps);
  for (let i = 0; i < data.gameMap.coins.length; i++) {
    map.coins[i] = new Coin(0, 0, 32, 32, data.gameMap.coins[i].value);
  }
  for (let i = 0; i < data.gameMap.gems.length; i++) {
      map.gems[i] = getNewGem(data.gemTypes[i], [data.gameMap.gems[i].value, data.gameMap.gems[i].affectsMe]);
  }
  for (let i = 0; i < data.gameMap.traps.length; i++) {
    map.traps[i] = getNewTrap(data.trapTypes[i], [data.gameMap.traps[i].img, data.gameMap.traps[i].value, data.gameMap.traps[i].speed, data.gameMap.traps[i].direction, data.gameMap.traps[i].startRow, data.gameMap.traps[i].endRow, data.gameMap.traps[i].startColumn, data.gameMap.traps[i].endColumn]);
  }
}

//Marianna
function displayText(text, x, y, align = 'center', color = 'white', size = 10, font = 'Helvetica') {
  ctx.font = `${size}px ${font}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

//Marianna
function handleChangePlayerMessage(message) {
  player.message = message;
  updateServerPlayer();
  displayMessageCount = 0;
  $('#interactionMenu').css('display', 'none');
}

// event listener for start of the movement
window.addEventListener('keydown', movePlayer);

// event listener for end of the movement
window.addEventListener('keyup', stopPlayer);

// Marianna
// update game
socket.on('newFrame', (data) => {
  draw(data);
});

//Marianna
//invoke gem effect based on index
socket.on('gemEffect', (position) => {
  map.gems[position].onCollect(player, position, 1);
});

socket.on('mapUpdated', handleMapUpdated)
socket.on('mapCreated', handleMapCreated)

socket.on('changePlayerMessage', handleChangePlayerMessage)

function selectInteraction(type) {
  socket.emit('getRandomMessage', type);
}
