// setup express
const express = require('express');

const app = express();

// setup static dir
app.use(express.static(`${__dirname}/public`));

//set up session
const session = require('express-session');
app.use(session({
  secret: 'requiredSecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));
//allows to recognise incoming object as json object
app.use(express.json());

// allow to pass form data
app.use(express.urlencoded({ extended: true }));

const fetch = require('node-fetch');

//create server and set up the sockets on the server
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// database setup
const db = require('./database/connection').connection;

const handleSession = require('./private/session.js');
app.use(handleSession.router);

// import game class
const { Game } = require('./private/models/Game');
// import utils class
const Utilities = require('./public/models/Utils').Utils;
// create utils object
const Utils = new Utilities();

// framerate
const FRAME_RATE = 30;

// user login and register
const usersRouter = require('./private/users.js');
app.use(usersRouter.router);

// highscore list
const highscoreListRouter = require('./private/highscoreList.js');
app.use(highscoreListRouter.router);

// user interactions
const interactionsRouter = require('./private/interactions.js');
app.use(interactionsRouter.router);

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

// variable that maps client id to the room name
const playersRoomTable = {};

// global state that holds states of all posible rooms
const games = {};

io.on('connection', (socket) => {
  //Marianna & Dagmara
  async function handleNewGameCreation(difficulty) {
    // create socketIO room and client that joins the game have to add the code which is roomId
    const roomName = Utils.createId(8); // function which creates id, we pass length of the id

    // new game starts so the user is assigned to the room
    playersRoomTable[socket.id] = roomName;
    socket.emit('roomName', roomName);

    // create state of the game for the room
    games[roomName] = new Game();

    // import map class
    // eslint-disable-next-line global-require
    const {GameMap} = require('./public/models/GameMap');
    const mapFile = `./private/assets/maps/map${Utils.getRandomNumber(1, 6)}.json`;
    const map = new GameMap('', '', '', '', '', difficulty);
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
    let url = `${process.env.URL}api/interactions`;
    if (id) url += `?player_id=${id}`;
    response = await fetch(url);
    result = await response.json();
    games[roomName].interactions = result;
    socket.join(roomName);
    socket.emit('numberOfPlayersInTheRoom', 1);
    socket.emit('createPlayer', socket.id);
  }

  //Dagmara
  function addPlayerToGameObject(player) {
    const newPlayer = player;
    newPlayer.socketId = socket.id;
    games[playersRoomTable[socket.id]].players.push(newPlayer);
  }

  //Marianna
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

  //Marianna
  function handleClientMapUpdate(tiles) {
      games[playersRoomTable[socket.id]].map.tiles = tiles;
      io.to(playersRoomTable[socket.id]).emit('mapUpdated', tiles);
  }

  //Dagmara
  function handleCreateUsername(initialData) {
    const data = initialData;
    const usernameValid = Utils.checkStringCharacters(data.username);
    if (!usernameValid) {
      socket.emit('usernameDeclined');
      return;
    }
    const uniqueUsername = games[playersRoomTable[socket.id]].players
      .every((player) => player.username !== data.username);
    if (!uniqueUsername) {
      socket.emit('usernameDeclined', 'Username is already taken!');
      return;
    }
    data.player.username = data.username;
    handleClientPlayerUpdate(data);
    socket.emit('usernameAdded');
    socket.emit('updatePlayer', data.player);
  }

  //Dagmara
  function handleJoinGame(data) {
    const desiredRoom = io.sockets.adapter.rooms.get(data.roomName);
    if (!desiredRoom) {
      socket.emit('wrongCode', 'Invalid room code.');
      return;
    }

    const uniqueUsername = games[data.roomName].players
    .every((player) => player.username !== data.logged);

    if (!uniqueUsername) {
      socket.emit('wrongCode', 'Player with your username is already in the game!');
      return;
    }

    let totalPlayersInRoom = desiredRoom.size;
    if (totalPlayersInRoom === 0) {
      socket.emit('EmptyRoom');
      return;
    } if (totalPlayersInRoom > 3) {
      socket.emit('FullRoom');
      return;
    }
    playersRoomTable[socket.id] = data.roomName;
    socket.emit('roomName', data.roomName);
    socket.join(data.roomName);
    //send number of players in the room
    totalPlayersInRoom = desiredRoom.size;
    io.to(playersRoomTable[socket.id]).emit('numberOfPlayersInTheRoom', totalPlayersInRoom);
    socket.emit('createPlayer', socket.id);
  }

  function startGameInterval(roomName, gameState) {
    gameState.interval = setInterval(() => {
      io.to(roomName).emit('newFrame', gameState);
    }, 1000 / FRAME_RATE);
  }

  //Dagmara & Marianna
  function startGame(roomName) {
    const gameState = games[roomName];
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
      io.to(roomName).emit('mapCreated', {gameMap: gameState.map, gemTypes: gemTypes, trapTypes: trapTypes});
      gameState.playing = true;
      // send new player position to each player
      gameState.players.map((player) => gameState.map.setPlayerStartPosition(player));
      io.to(roomName).emit('playersReady', gameState.players);
      startGameInterval(roomName, gameState);
    } else {
      socket.emit('playersNotReady', 'Other players are still not ready, give them another minute!');
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

  //Marianna
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
  function handlePlayerDisconnect() {
    if (games[playersRoomTable[socket.id]]) {
      // remove player from room
      socket.leave(playersRoomTable[socket.id]);
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

  function handleGemAffectsOthers(value) {
    socket.broadcast.to(playersRoomTable[socket.id]).emit('gemEffect', value);
  }

  //Marianna
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

  //Dagmara
  //save player score to database
  async function handleSavePlayer(data) {
    if (data.playerId) {
        response = await fetch(`${process.env.URL}api/highestscores`, {
        method: 'POST',
        body: JSON.stringify({playerId: data.playerId, score: data.score}),
        headers: { 'Content-Type': 'application/json' }
      });
      result = await response.json();
      if (result.isSaved) {
        io.to(playersRoomTable[socket.id]).emit("scoreMessage", data.playerId);
      }
    }
  }

// Dagmara
//update lobby on player leave
function updateLobby(currentNumber) {
  io.to(playersRoomTable[socket.id]).emit("numberOfPlayersInTheRoom", currentNumber);
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
  socket.on('gemAffectsOthers', handleGemAffectsOthers);
  socket.on('getRandomMessage', handleGetRandomMessage);
  socket.on('savePlayer', handleSavePlayer);
  socket.on('updateLobby', updateLobby);
  socket.on('removePlayerAndGoToMainMenu', handlePlayerDisconnect);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  }
  console.log('Server is running on port', Number(PORT));
});
