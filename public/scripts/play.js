/* eslint-disable no-unused-vars, no-undef */
// Dagmara & Marianna
const walkingSound = new Sound('walk', 'soundfx');
walkingSound.sound.volume = 0.5;
walkingSound.sound.loop = true;
walkingSound.sound.setAttribute('id', 'walk');

let displayMessageCount = -1;
const maxDisplayMessageCount = 90;

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

// Marianna
// entry values are for character with value 0 (red player)
const animations = {
  // startRow, startColumn, rows, columns value
  down: [0, 0, 0, 2],
  left: [1, 0, 0, 2],
  right: [2, 0, 0, 2],
  up: [3, 0, 0, 2],
};

function setAnimationRow(value) {
  animations.down[0] = value;
  animations.left[0] = ++value;
  animations.right[0] = ++value;
  animations.up[0] = ++value;
}

// Dagmara
// set right animaton for the character
function setAnimation(value) {
  // calculate the start position for each character
  let startColumnPosition = value * 3;
  if (value > 3) {
    // calculate the start position for each character in second row
    startColumnPosition = (value - 4) * 3;
    setAnimationRow(4);
  } else {
    setAnimationRow(0);
  }
  animations.down[1] = startColumnPosition;
  animations.left[1] = startColumnPosition;
  animations.right[1] = startColumnPosition;
  animations.up[1] = startColumnPosition;
}

// Marianna
// update server if something on the client changed
function updateServerPlayer() {
  socket.emit('clientPlayerUpdated', { player });
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
        tempPlayer.message,
      );
      compareToPlayer = spectatingPlayer;
    }
  } else {
    player.isMovingTrapCollision(map);
  }
  // draw map for player or for player who you are spectating
  map.draw(ctx, compareToPlayer, canvas.width, canvas.height);
  // draw all players
  data.players.map((gamePlayer) => {
    if (!gamePlayer.isDone) {
      if (player.username === gamePlayer.username || (spectatingPlayer && spectatingPlayer.username === gamePlayer.username)) {
        // draw your player or the player you are spectating - center camera
        compareToPlayer.draw(ctx, (canvas.width - compareToPlayer.width) / 2, (canvas.height - compareToPlayer.height) / 2);
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
    }
  });
  player.isNear = player.isNearPlayers(data.players);
  if (!player.isDone) {
    if (player.isNear) {
      $('#enterButton').css('display', 'block');
      // if condition checks if the players just met
      if (!player.message && displayMessageCount === -1) socket.emit('getRandomMessage');
      displayMessageCount++;
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
  }
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

function handleMove(direction, currentSpeedX, currentSpeedY) {
  // used when speed is different that 4 so the player is not stuck on turns
  let denominator = 1;
  changeAnimation(direction);
  do {
    if (currentSpeedX === 0) {
      currentSpeedY /= denominator;
    } else {
      currentSpeedX /= denominator;
    }
    // check for wall collision
    if (!player.isBlockCollision(map, direction, currentSpeedX, currentSpeedY)) {
      if (currentSpeedX === 0) {
        player.y += currentSpeedY;
      } else {
        player.x += currentSpeedX;
      }
      player.isBlockCollision(map, direction);
    } else {
      denominator = 2;
    }
  } while (player.isBlockCollision(map, direction, currentSpeedX, currentSpeedY));
}

// Marianna
// key listeners to move the player
function movePlayer(e) {
  if (!playing || player.isDone) return;
  const currentSpeed = player.speed;
  switch (e.key) {
    case (e.key.match(player.movement.left)?.input):
      handleMove('left', -currentSpeed, 0);
      break;
    case (e.key.match(player.movement.right)?.input):
      handleMove('right', currentSpeed, 0);
      break;
    case (e.key.match(player.movement.up)?.input):
      handleMove('up', 0, -currentSpeed);
      break;
    case (e.key.match(player.movement.down)?.input):
      handleMove('down', 0, currentSpeed);
      break;
    case 'Enter':
      // player is near other players - we don't need to check for collision again
      if (player.isNear) {
        $('#interactionMenu').css('display', 'block');
      }
      break;
    default:
      // no need to update server if player didn't move
      return;
  }
  if (walkingSound.sound.paused) walkingSound.play();
  // add update of server
  updateServerPlayer();
}

// Marianna
function handleMapCreated(data) {
  map = new GameMap(data.gameMap.tiles, data.gameMap.timeLimit, data.gameMap.coins, data.gameMap.gems, data.gameMap.traps, data.gameMap.difficulty);
  for (let i = 0; i < data.gameMap.coins.length; i++) {
    map.coins[i] = new Coin(0, 0, 32, 32, data.gameMap.coins[i].value);
  }
  for (let i = 0; i < data.gameMap.gems.length; i++) {
    map.gems[i] = getNewGem(data.gemTypes[i], [data.gameMap.gems[i].value, data.gameMap.gems[i].affectsMe]);
  }
  for (let i = 0; i < data.gameMap.traps.length; i++) {
    const trapProperties = [];
    for (const property in data.gameMap.traps[i]) {
      trapProperties.push(data.gameMap.traps[i][property]);
    }
    map.traps[i] = getNewTrap(data.trapTypes[i], trapProperties);
  }
}

// Marianna
function displayText(text, x, y, align = 'center', color = 'white', size = 10, font = 'Helvetica') {
  ctx.font = `${size}px ${font}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

// Marianna
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

// Marianna
// invoke gem effect based on index
socket.on('gemEffect', (position) => {
  map.gems[position].onCollect(player, position, 1);
});

socket.on('mapUpdated', handleMapUpdated);
socket.on('mapCreated', handleMapCreated);

socket.on('changePlayerMessage', handleChangePlayerMessage);

function selectInteraction(type) {
  socket.emit('getRandomMessage', type);
}
