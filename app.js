// setup express
const express = require('express');

const app = express();

// setup static dir
app.use(express.static(`${__dirname}/public`));

const session = require('express-session');
app.use(session({
  secret: 'requiredSecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

app.use(express.json());

// allow to pass form data
app.use(express.urlencoded({ extended: true }));

const fetch = require('node-fetch');

// database setup
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const db = require('./database/connection').connection;

const handleSession = require('./private/session.js');
app.use(handleSession.router);

// setup socket server

// import game class
const { Game } = require('./private/models/Game');
// import utils class
const Utilities = require('./public/models/Utils').Utils;
// create utils object
const Utils = new Utilities();

// framerate
const FRAME_RATE = 30;

// user login and register
const userRouter = require('./private/user.js');
app.use(userRouter.router);

// highscore list
const highscoreListRouter = require('./private/highscoreList.js');
app.use(highscoreListRouter.router);

// user interactions
const interactionRouter = require('./private/interaction.js');
app.use(interactionRouter.router);

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

// variable that maps client id to the room name
const playersRoomTable = {};

// global state that holds states of all posible rooms
const games = {};

io.on('connection', (socket) => {
  async function handleNewGameCreation() {
    // create socketIO room and client that joins the game have to add the code which is roomId
    const roomName = Utils.createId(8); // function which creates id, we pass length of the id

    // new game starts so the user is assigned to the room
    playersRoomTable[socket.id] = roomName;
    socket.emit('roomName', roomName);

    // create state of the game for the room
    games[roomName] = new Game();

    // import map class
    // eslint-disable-next-line global-require
    const { GameMap } = require('./public/models/GameMap');
    const mapFile = `./private/assets/maps/map${Utils.getRandomNumber(1, 6)}.json`;
    const map = new GameMap('', '', '', '', '');
    // eslint-disable-next-line global-require
    map.loadMap(mapFile); // eslint-disable-line import/no-dynamic-require
    games[roomName].map = map;
    //get logged in player id
    let id = '';
    let response = await fetch(`${process.env.URL}getsession`);
    let result = await response.json();
    if (result.playerId) {
      id = result.playerId;
    }
    //load player interactions
    let url = `${process.env.URL}api/interaction`;
    if (id) url += `?player_id=${id}`;
    response = await fetch(url);
    result = await response.json();
    games[roomName].interactions = result;
    socket.join(roomName);
    socket.emit('createPlayer', socket.id);
  }

  function addPlayerToGameObject(player) {
    const newPlayer = player;
    newPlayer.socketId = socket.id;
    games[playersRoomTable[socket.id]].players.push(newPlayer);
  }

  function handleClientPlayerUpdate(data) {
    // update the player object with new data
    const updatedPlayer = games[playersRoomTable[socket.id]].players
      .find((player) => player.socketId === socket.id);
    const index = games[playersRoomTable[socket.id]].players.indexOf(updatedPlayer);

    if (index < 0) {
      socket.emit('noPlayer');
      return;
    }
    games[playersRoomTable[socket.id]].players[index] = data.player;
  }

  function handleClientMapUpdate(tiles) {
      games[playersRoomTable[socket.id]].map.tiles = tiles;
      io.to(playersRoomTable[socket.id]).emit('mapUpdated', tiles);
  }

  function handleCreateUsername(initialData) {
    const data = initialData;
    const usernameValid = Utils.checkStringCharacters(data.username);
    if (!usernameValid) {
      socket.emit('usernameDeclined', 'Please, use one or more characters from: A-Z and 0-9.');
      return;
    }
    const uniqueUsername = games[playersRoomTable[socket.id]].players
      .every((player) => player.username !== data.username);
    if (!uniqueUsername) {
      socket.emit('usernameDeclined');
      return;
    }
    data.player.username = data.username;
    handleClientPlayerUpdate(data);
    socket.emit('usernameAdded');
    socket.emit('updatePlayer', data.player);
  }

  function handleJoinGame(gameCode) {
    const desiredRoom = io.sockets.adapter.rooms.get(gameCode);
    if (!desiredRoom) {
      socket.emit('wrongCode');
      return;
    }

    const totalPlayersInRoom = desiredRoom.size;
    if (totalPlayersInRoom === 0) {
      socket.emit('EmptyRoom');
      return;
    } if (totalPlayersInRoom > 3) {
      socket.emit('FullRoom');
      return;
    }
    playersRoomTable[socket.id] = gameCode;
    socket.emit('roomName', gameCode);
    socket.join(gameCode);
    socket.emit('createPlayer', socket.id);
  }

  function startGameInterval(gameCode, gameState) {
    gameState.interval = setInterval(() => {
      io.to(gameCode).emit('newFrame', gameState);
    }, 1000 / FRAME_RATE);
  }

  function startGame(gameCode) {
    const gameState = games[gameCode];
    const allPlayerrsReadyToPlay = gameState.players.filter((player) => player.readyToPlay).length;
    if (allPlayerrsReadyToPlay === gameState.players.length) {
      //send map to each player
      const gemTypes = [];
      gameState.map.gems.map( gem => {
        gemTypes.push(gem.__proto__.constructor.name);
      })
      const trapTypes = [];
      gameState.map.traps.map( trap => {
        trapTypes.push(trap.__proto__.constructor.name);
      })
      io.to(gameCode).emit('mapCreated', {gameMap: gameState.map, gemTypes: gemTypes, trapTypes: trapTypes});
      gameState.playing = true;
      // send new player position to each player
      gameState.players.map((player) => gameState.map.setPlayerStartPosition(player));
      io.to(gameCode).emit('playersReady', gameState.players);
      startGameInterval(gameCode, gameState);
    } else {
      socket.emit('playersNotReady');
    }
  }

  // Marianna
  // when player finishes, update everyone in the room with their score
  function handlePlayerFinished(player) {
    io.to(playersRoomTable[socket.id]).emit('addPlayerScore', player);
    // give time till server updates with newest values
    setTimeout(() => {
      // check if all players finished to disable spectating mode
      if (games[playersRoomTable[socket.id]].players.every((player) => player.isDone === true)) {
        io.to(playersRoomTable[socket.id]).emit('gameEnded');
      }
    }, 100);
  }

  function changeSpectatingPlayer(username) {
    // get player list
    const { players } = games[playersRoomTable[socket.id]];
    // find current spectating player and index
    const player = players.find((player) => player.username === username);
    const playerPosition = players.indexOf(player);
    let position = playerPosition;
    // look for player who isn't done
    // stop if it gets back to current spectating player
    do {
      position++;
      if (players.length <= position) position = 0;
    } while (playerPosition !== -1 && players[position].isDone === true && position !== playerPosition);
    socket.emit('changeSpectating', players[position]);
  }

  // Marianna
  function handlePlayerDisconnect(beforeGameStart='false') {
    if (games[playersRoomTable[socket.id]]) {
      // remove player from room
      games[playersRoomTable[socket.id]].players = games[playersRoomTable[socket.id]].players.filter((player) => player.socketId !== socket.id);
      // empty room
      // remove data about room
      if (games[playersRoomTable[socket.id]].players.length === 0) {
        // stop timer
        clearInterval(games[playersRoomTable[socket.id]].interval);
        delete games[playersRoomTable[socket.id]];
      } else if (!games[playersRoomTable[socket.id]].playing) {
        startGame(playersRoomTable[socket.id]);
      }
      // remove data about player
      delete playersRoomTable[socket.id];
    }
  }

  function handleStopInterval() {
    clearInterval(games[playersRoomTable[socket.id]].interval);
  }

  function handleReverseMovement() {
    socket.broadcast.to(playersRoomTable[socket.id]).emit('reversePlayerMovement');
  }

  function handleHealPlayer() {
    socket.broadcast.to(playersRoomTable[socket.id]).emit('healPlayers');
  }

  function handleTeleportPlayer() {
    socket.broadcast.to(playersRoomTable[socket.id]).emit('teleportPlayer');
  }

  function handleDoubleCoins() {
    socket.broadcast.to(playersRoomTable[socket.id]).emit('doubleCoins');
  }

  function handleFreezePlayer(value) {
    socket.broadcast.to(playersRoomTable[socket.id]).emit('freezePlayer', value);
  }

  function handleGetRandomMessage(type) {
    const game = games[playersRoomTable[socket.id]];
    const types = Object.keys(game.interactions);
    //get random type
    if (!type) {
      type = types[Utils.getRandomNumber(0, types.length)];
    }
    //get random message
    const message = game.interactions[type][Utils.getRandomNumber(0, game.interactions[type].length)];
    socket.emit('changePlayerMessage', message);
  }

  async function handleSavePlayer(score) {
    let response = await fetch(`${process.env.URL}getsession`);
    let result = await response.json();
    console.log(result);
    if (true) {
        response = await fetch(`${process.env.URL}api/highestscores`, {
        method: 'POST',
        body: JSON.stringify({playerId: 5, score: score}),
        headers: { 'Content-Type': 'application/json' }
      });
      result = await response.json();
      console.log(result);
    }
  }

  socket.on('newGame', handleNewGameCreation);
  socket.on('joinGame', handleJoinGame);
  socket.on('createUsername', handleCreateUsername);
  socket.on('playerCreated', addPlayerToGameObject);
  socket.on('playGame', startGame);
  socket.on('clientPlayerUpdated', handleClientPlayerUpdate);
  socket.on('clientMapUpdated', handleClientMapUpdate);
  socket.on('playerFinished', handlePlayerFinished);
  socket.on('changeSpectator', changeSpectatingPlayer);
  socket.on('disconnect', handlePlayerDisconnect);
  socket.on('stopInterval', handleStopInterval);
  socket.on('reverseMovement', handleReverseMovement);
  socket.on('healPlayer', handleHealPlayer);
  socket.on('teleportPlayer', handleTeleportPlayer);
  socket.on('doubleCoins', handleDoubleCoins);
  socket.on('freezePlayer', handleFreezePlayer);
  socket.on('getRandomMessage', handleGetRandomMessage);
  socket.on('savePlayer', handleSavePlayer);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  }
  console.log('Server is running on port', Number(PORT));
});
