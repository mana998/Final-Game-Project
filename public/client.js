// control variable to check whether game is in-progress
let playing = false;

// setup socket
const socket = io();

// menu
const menuScreen = document.getElementById('menuScreen');
const gameScreen = document.getElementById('gameScreen');

const createGameButton = document.getElementById('createNewGameButton');
const codeInput = document.getElementById('codeInput');
const joinGameButton = document.getElementById('joinGameButton');
const displayGameCode = document.getElementById('displayGameCode');
const usernameInput = document.getElementById('usernameInput');
const playGameButton = document.getElementById('playGameButton');
const usernameMessage = document.getElementById("usernameMessage");
const playMenu = document.getElementById('playMenu');
const viewBlock = document.getElementById('viewBlock');
const wrongGameCode = document.getElementById("wrongGameCode");
const container = document.getElementsByClassName('container')[0];

// Dagmara
// hide game menu and show the game username input and play button
function init() {
  menuScreen.style.display = 'none';
  gameScreen.style.display = 'block';
}

//Dagmara
//If username is invalid the user is promped to enter different username
function changeUsername(message="") {
  if (message) {
      usernameMessage.innerText = message;
      playGameButton.setAttribute("disabled","true");
      return;
  }
  usernameMessage.innerText = "Username already exists, input new username!"
}

// Dagmara
// Hides username input and show game menu
function showMenuScreen() {
  menuScreen.style.display = 'block';
  gameScreen.style.display = 'none';
}

// Dagmara
// creates the room and game state
function createGame() {
  socket.emit('newGame');
  init();
}

// Dagmara
// update player
function updatePlayer(updatedPlayer) {
  player.username = updatedPlayer.username;
}

// Dagmara
// display message if the code is wrong
function handleWrongCode() {
  wrongGameCode.innerText = "Incorrect game code, the room doesn't exists";
}

// Dagmara
// if the room code is valid it allows player to join existing game
function joinGame() {
  const code = codeInput.value;
  socket.emit('joinGame', code);
}

// Dagmara
// starts the game for the user,
// changes it's state to ready to play and if all players are ready starts the game
function playGame() {
    player.readyToPlay = true;
    usernameInput.setAttribute("disabled","true");
    updateServerPlayer();
    socket.emit("playGame", displayGameCode.innerText);
}

// Dagmara
// Checks if player can use the username
function handleCreateUsername() {
  username = usernameInput.value;
  socket.emit('createUsername', ({ player, username }));
  socket.on('usernameDeclined', changeUsername);
}

// Dagmara
// Adds player to the game object
function createPlayer(socketId) {
  player = new Player(64, 64, 32, 32, new Img('./assets/images/game/test.png', 0, 0, 0, 2, 5, 1), '', socketId);
  socket.emit('playerCreated', player);
}

// Dagmara
// If players' username is valid the play game button is enabled
function enablePlayButton() {
    usernameMessage.innerText = "";
    playGameButton.removeAttribute("disabled");
}

//Dagmara
//informs players that not all players are ready to play
function playersNotReady() {
    usernameMessage.innerText = "Other players are still not ready, give them another minute!";
}

//Marianna + Dagmara
//update necessary information when game starts
function playersReady(players) {
  playMenu.style.display = 'none';
  playing = true;
  // place player at random position on the map
  const currentPlayer = players.find((gamePlayer) => gamePlayer.username === player.username);
  player.x = currentPlayer.x;
  player.y = currentPlayer.y;
  // get start time for score tracking
  startTime = new Date().getTime();
  canvas.style.display = 'block';
  container.style.border = 'none';
  viewBlock.style.display = "block";
}

// Dagmara
// Display game code
function handleGameCodeDisplay(gameCode) {
  init();
  displayGameCode.innerText = gameCode;
}

// Dagmara
// In case the room is empty notify and return to game menu
function playerNotExists() {
  alert('Error the player does not exists, pls try again');
  showMenuScreen();
}

// Dagmara
// In case the room is empty notify and return to game menu
function handleEmptyRoom() {
  alert("The room doesn't exists!");
  showMenuScreen();
}

// Dagmara
// In case the room is full notify user and return to game menu
function handleFullRoom() {
  alert('This room is full');
  showMenuScreen();
}

socket.on('roomName', handleGameCodeDisplay);
socket.on('EmptyRoom', handleEmptyRoom);
socket.on('FullRoom', handleFullRoom);
socket.on('wrongCode', handleWrongCode);
socket.on('usernameAdded', enablePlayButton);
socket.on('playersNotReady', playersNotReady);
socket.on('playersReady', playersReady);
socket.on('createPlayer', createPlayer);
socket.on('noPlayer', playerNotExists);
socket.on('updatePlayer', updatePlayer);

createGameButton.addEventListener('click', createGame);
usernameInput.addEventListener('change', handleCreateUsername);
joinGameButton.addEventListener('click', joinGame);
playGameButton.addEventListener('click', playGame);
