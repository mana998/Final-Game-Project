// control variable to check whether game is in-progress
let playing = false;

// setup socket
const socket = io()
const tryReconnect = () => {
  setTimeout(() => {
    socket.io.open((err) => {
      if (err) {
        tryReconnect();
      }
    });
  }, 2000);
}

socket.io.on("close", tryReconnect);
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
  $('#interactionForm').css('display', 'none');
  $('#difficultySelection').css('display', 'none');
  createUsernameScreen();
  $('#showHelp').css('display', 'block');
  $('#loggedInUserIcon').css('display', 'none');
}

function createUsernameScreen() {
  if (!$('#playMenu').children().length) {
      $('#playMenu').append(`
          <h1 class="gameTitle">GAME CODE: <span class="gameTitle" id = "displayGameCode"></span></h1>
          <div id="characters"></div>
          <form>
            <div id="usernameInputDiv" class="inputBigButton bigButton backgroundPicture">
              <input type="text" placeholder="USERNAME" class="inputButtonText brownText" id="usernameInput" pattern="^[a-zA-Z\d]{1,25}$" title="Please, use 1 to 25 characters from: A-Z and 0-9.">
            </div>
          </form>
          <button type="button" class="backgroundPicture bigButton" id="playGameButton" disabled><span class="buttonText orangeText">PLAY GAME</span></button></br>
          <button type="button" class="returnToMainMenuCharacterSelection backgroundPicture bigButton" id="removePlayerAndGoToMainMenu" onClick = "removePlayerAndGoToMainMenu()"><span class="buttonText grayText">MAIN MENU</span></button>
          <div id="lobby">
            <p id="lobbyText">IN LOBBY</p>
          </div>
      `);
      generateCharacterSelection();
      $('#usernameInput').on('change', handleCreateUsername);
      $('#playGameButton').on('click', playGame);
  } else {
      $('#playMenu').css('display', 'block');
  }
  
}

//Dagmara
function setNumberOfPlayersInTheRoom(numberOfPlayers) {
  numberOfPlayersInTheRoom = numberOfPlayers;
  if ($('#lobby').children().length === 2) {
    $('#lobby p.gameTitle').remove();
  }
  $('#lobby').append(`<p class="gameTitle">${numberOfPlayers}/4</p>`);
  
}

// Dagmara
// If username is invalid the user is promped to enter different username
function changeUsername(message = '') {
  if ($("#usernameMessage")){
    $("#usernameMessage").remove();
  }
  if (message) {
    $('#playMenu form').append('<span id="usernameMessage">Username already exists, input new username!</span>');
  }

}

// Dagmara
// creates the room and game state
function createGame(difficulty) {
  socket.emit('newGame', difficulty);
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
  socket.on('leaveBeforeGameStarts');
  showMainMenu();
}

// Dagmara
// starts the game for the user,
// changes it's state to ready to play and if all players are ready starts the game
function playGame() {
  if (!selectedCharacter) {
    selectCharacter(0)
  }
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
  //disable character selection
  $('.characterLabel').not(`#characterLabel-${selectedCharacter}`).addClass('fullyDisabled');
  $('.characterLabel').removeAttr('onClick');
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
  $('#loggedInUserIcon').css('display', 'none');
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
socket.on('numberOfPlayersInTheRoom', setNumberOfPlayersInTheRoom);

