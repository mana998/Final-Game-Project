// control variable to check whether game is in-progress
let playing = false;

// setup socket
const socket = io();

// Dagmara
// hide game menu and show the game username input and play button
function init() {
  $('#loginAndRegister').css('display', 'none');
  $('#menuOptions').css('display', 'block');
  $('#panel').css('display', 'none');
  $('#highscore').css('display', 'none');
  $('#gameScreen').css('display', 'block');
  $('#returnToMainMenuButton').css('display', 'none');
  $('#roomCodeScreen').css('display', 'none');
  createUsernameScreen();
}

function createUsernameScreen() {
  if (!$('#playMenu').children().length) {
      $('#playMenu').append(`
          <h1 class="gameTitle" id = "displayGameCode"></h1>
          <div id="characters"></div>
          <form>
            <input type="text" placeholder="USERNAME" id="usernameInput">
          </form>
          <span id = "usernameMessage">Please, use one or more characters from: A-Z and 0-9.</span></br>
          <button type="button" class="btn" id="playGameButton" disabled>PLAY GAME</button></br>
          <button type="button" class="btn" id="removePlayerAndGoToMainMenu" onClick = "removePlayerAndGoToMainMenu()">MAIN MENU</button>
      `);
      generateCharacterSelection();
  } else {
      $('#playMenu').css('display', 'block');
  }
  
}

// Dagmara
// If username is invalid the user is promped to enter different username
function changeUsername(message = '') {
  if (message) {
    $('#usernameMessage').text(message);
    $('#playGameButton').attr('disabled', 'true');
    return;
  }
  $('#usernameMessage').text('Username already exists, input new username!');
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


//Dagmara
//removes player from game object and changes interface back to main menu
function removePlayerAndGoToMainMenu() {
  leaveGame();
  showMainMenu();
}

// Dagmara
// starts the game for the user,
// changes it's state to ready to play and if all players are ready starts the game
function playGame() {
  if (selectedCharacter > 3) {
    player.img.currentRow = 4;
    player.img.startRow = 4;
    player.img.currentColumn = (selectedCharacter-4) * 3;
    player.img.startColumn = player.img.currentColumn
  } else {
    player.img.currentColumn = selectedCharacter * 3;
    player.img.startColumn = player.img.currentColumn
  }
  player.readyToPlay = true;
  $('#usernameInput').attr('disabled', 'true');
  updateServerPlayer();
  const gameCode = $('#displayGameCode').text();
  socket.emit('playGame', gameCode);
  setAnimation(selectedCharacter);
}

// Dagmara
// Checks if player can use the username
function handleCreateUsername() {
  username = $('#usernameInput').val();
  socket.emit('createUsername', ({ player, username }));
  socket.on('usernameDeclined', changeUsername);
}

// Dagmara
// If players' username is valid the play game button is enabled
function enablePlayButton() {
  $('#usernameMessage').text('');
  $('#playGameButton').removeAttr('disabled');
}

// Dagmara
// Adds player to the game object
async function createPlayer(socketId) {
  username = '';
  let playerId = '';
  const result = await getSession();
  if (result.username && result.playerId) {
    $('#usernameInput').val(result.username);
    $('#usernameInput').attr('disabled', 'true');
    username = result.username;
    playerId = result.playerId;
    enablePlayButton();
  }
  player = new Player(64, 64, 32, 32, new Img('./assets/images/game/test.png', 0, 0, 0, 2, 5, 1), username, '', socketId);
  player.playerId = playerId;
  socket.emit('playerCreated', player);
}

// Dagmara
// informs players that not all players are ready to play
function playersNotReady() {
  $('#usernameMessage').text('Other players are still not ready, give them another minute!');
}

// Marianna + Dagmara
// update necessary information when game starts
function playersReady(players) {
  $('#playMenu').css('display', 'none');
  playing = true;
  // place player at random position on the map
  const currentPlayer = players.find((gamePlayer) => gamePlayer.username === player.username);
  player.x = currentPlayer.x;
  player.y = currentPlayer.y;
  // get start time for score tracking
  startTime = new Date().getTime();
  canvas.style.display = 'block';
  $('#loggedInUser').css('display', 'none');
  $('.container').css('border', 'none');
  $('.container-fluid').css('display', 'none');
  $('#viewBlock').css('display', 'block');
  backgroundMusic.play();
  $('#backgroundMusicControl').css('display', 'block');
  $('#soundFxControl').css('display', 'block');
  $('#inGameElements').css('display', 'block');
}

// Dagmara
// Display game code
function handleGameCodeDisplay(gameCode) {
  init();
  $('#displayGameCode').text(gameCode);
}

// Dagmara
// In case the room is empty notify and return to game menu
function playerNotExists() {
  alert('Error the player does not exists, pls try again');
  showMenuScreen();
}

socket.on('roomName', handleGameCodeDisplay);
socket.on('usernameAdded', enablePlayButton);
socket.on('playersNotReady', playersNotReady);
socket.on('playersReady', playersReady);
socket.on('createPlayer', createPlayer);
socket.on('noPlayer', playerNotExists);
socket.on('updatePlayer', updatePlayer);

$('#createNewGameButton').on('click', createGame);
$('#usernameInput').on('change', handleCreateUsername);
$('#playGameButton').on('click', playGame);
