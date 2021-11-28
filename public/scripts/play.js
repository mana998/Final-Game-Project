// setup canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// global objects for map and player
let map;
let player;
let spectatingPlayer;
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

// hardcoded animation values for now
const animations = {
  // startRow, startColumn, rows, columns
  down: [0, 0, 0, 2],
  left: [1, 0, 0, 2],
  right: [2, 0, 0, 2],
  up: [3, 0, 0, 2],
};

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
      socket.emit('changeSpectator', (spectatingPlayer) ? tempPlayer.username : '');
    } else { // else it sets the player
      spectatingPlayer = new Player(
        tempPlayer.x,
        tempPlayer.y,
        tempPlayer.width,
        tempPlayer.height,
        new Img(tempPlayer.img.src, tempPlayer.img.startRow, tempPlayer.img.startColumn, tempPlayer.img.rows, tempPlayer.img.columns, tempPlayer.img.speed, '', tempPlayer.img.currentRow, tempPlayer.img.currentColumn),
        tempPlayer.username,
      );
      compareToPlayer = spectatingPlayer;
    }
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
        new Img(gamePlayer.img.src, gamePlayer.img.startRow, gamePlayer.img.startColumn, gamePlayer.img.rows, gamePlayer.img.columns, gamePlayer.img.speed, '', gamePlayer.img.currentRow, gamePlayer.img.currentColumn),
        gamePlayer.username,
      );
      // get data about other players from server
      gamePlayer.draw(ctx, ((canvas.width - compareToPlayer.width) / 2) - compareToPlayer.x + gamePlayer.x, ((canvas.height - compareToPlayer.height) / 2) - compareToPlayer.y + gamePlayer.y);
    }
  });
}

// event listener for start of the movement
window.addEventListener('keydown', movePlayer);

// event listener for end of the movement
window.addEventListener('keyup', stopPlayer);

// Marianna
// key listeners to move the player
function movePlayer(e) {
  //! !!!THINK ABOUT STORING BLOCK TYPES IN SOME GLOBAL VARIABLES!!!!
  // 3rd parameter in isBlockCollision
  if (!playing || player.isDone) return;
  switch (e.key) {
    case (e.key.match(player.movement.left)?.input):
      changeAnimation('left');
      // check for wall collision
      if (!player.isBlockCollision(map, 'left', '', '', -player.speed, 0)) {
        player.x -= player.speed;
        player.isBlockCollision(map, 'left', canvas.height, canvas.width);
      }
      break;
    case (e.key.match(player.movement.right)?.input):
      changeAnimation('right');
      if (!player.isBlockCollision(map, 'right', '', '', player.speed, 0)) {
        player.x += player.speed;
        player.isBlockCollision(map, 'right', canvas.height, canvas.width);
      }
      break;
    case (e.key.match(player.movement.up)?.input):
      changeAnimation('up');
      if (!player.isBlockCollision(map, 'up', '', '', 0, -player.speed)) {
        player.y -= player.speed;
        player.isBlockCollision(map, 'up', canvas.height, canvas.width);
      }
      break;
    case (e.key.match(player.movement.down)?.input):
      changeAnimation('down');
      if (!player.isBlockCollision(map, 'down', '', '', 0, player.speed)) {
        player.y += player.speed;
        player.isBlockCollision(map, 'down', canvas.height, canvas.width);
      }
      break;
    default:
      // no need to update server if player didn't move
      return;
  }
  // add update of server
  updateServerPlayer();
}

// Marianna
// Stop animation when player stops moving
function stopPlayer(e) {
  // stop if game is not in progress
  if (!playing || player.isDone) return;
  // update only if the key was for movement
  if (e.key.match(/^[aAdDsSwW]|Arrow(Up|Down|Right|Left)$/)) {
    // ensure middle position
    player.img.startColumn += 1;
    player.img.currentColumn = player.img.startColumn;
    // stop animation movement
    player.img.rows = 0;
    player.img.columns = 0;
    player.direction = '';
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
// update server if something on the client changed
function updateServerPlayer() {
  socket.emit('clientPlayerUpdated', {player});
}

function handleMapCreated(data) {
  map = new GameMap(data.gameMap.tiles, data.gameMap.timeLimit, data.gameMap.coins, data.gameMap.gems, data.gameMap.traps);
  data.gameMap.coins.map(coin => {
    coin = new Coin(0, 0, 32, 32, coin.value);
  })
  for (let i = 0; i < data.gameMap.gems.length; i++) {
      map.gems[i] = getNewGem(data.gemTypes[i], [data.gameMap.gems[i].value, data.gameMap.gems[i].affectsMe]);
  }
  for (let i = 0; i < data.gameMap.traps.length; i++) {
    map.traps[i] = getNewTrap(data.trapTypes[i], [data.gameMap.traps[i].img, data.gameMap.traps[i].value, data.gameMap.traps[i].speed, data.gameMap.traps[i].direction, data.gameMap.traps[i].startRow, data.gameMap.traps[i].endRow, data.gameMap.traps[i].startColumn, data.gameMap.traps[i].endColumn]);
  }
}

function handleMapUpdated(tiles) {
  map.tiles = tiles;
}

// Marianna
// update game
socket.on('newFrame', (data) => {
  draw(data);
});

//Marianna
//reverse movement
socket.on('reversePlayerMovement', () => {
  new ReverseMovementGem().swapMovement(player);
})

socket.on('mapUpdated', handleMapUpdated)
socket.on('mapCreated', handleMapCreated)
