// Marianna & Dagmara
// control variable to check whether game is in-progress
let playing = false;

// Dagmara
// If username is invalid the user is promped to enter different username
function usernameMessage(message = '') {
  if ($('#usernameMessage')) {
    $('#usernameMessage').remove();
  }
  if (message) {
    $('#playMenu form').append(`<span id="usernameMessage">${message}</span>`);
    $('#playGameButton').attr('disabled', 'true');
  }
}

// Dagmara
// Checks if player can use the username
function handleCreateUsername() {
  username = $('#usernameInput').val();
  if (!username) {
    $('#playGameButton').attr('disabled', 'true');
  }
  socket.emit('createUsername', ({ player, username }));
  socket.on('usernameDeclined', usernameMessage);
}

function assignCharacterImageValue(position, value) {
  player.img[`start${position}`] = value;
  player.img[`current${position}`] = value;
}

function assignCharacterImageValues(rowValue, columnValue) {
  assignCharacterImageValue('Row', rowValue);
  assignCharacterImageValue('Column', columnValue);
}

// Dagmara
// starts the game for the user,
// changes it's state to ready to play and if all players are ready starts the game
function playGame() {
  if (!selectedCharacter) {
    selectCharacter(0);
  }
  if (selectedCharacter > 3) {
    assignCharacterImageValues(4, (selectedCharacter - 4) * 3);
  } else {
    assignCharacterImageValues(0, selectedCharacter * 3);
  }
  player.readyToPlay = true;
  // disable character selection
  $('.characterLabel').not(`#characterLabel-${selectedCharacter}`).addClass('fullyDisabled');
  $('.characterLabel').removeAttr('onClick');
  $('#usernameInput').attr('disabled', 'true');
  updateServerPlayer();
  const roomName = $('#displayGameCode').text();
  socket.emit('playGame', roomName);
  setAnimation(selectedCharacter);
  $('#viewBlock').css('display', 'none');
  $('#inGameElements').css('display', 'none');
  $('#backgroundMusicControl').css('display', 'none');
  $('#soundFxControl').css('display', 'none');
  $('#game').css('display', 'block');
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
    $('#usernameInput').on('input', handleCreateUsername);
    $('#playGameButton').on('click', playGame);
  } else {
    $('#usernameInput').removeAttr('disabled');
    $('#playGameButton').attr('disabled', 'true');
    $('#characters').empty();
    generateCharacterSelection();
    $('#usernameMessage').text('');
    $('#endScreen').empty();
  }
}

// Dagmara
function setNumberOfPlayersInTheRoom(numberOfPlayers) {
  if ($('#lobby').children().length === 2) {
    $('#lobby p.gameTitle').remove();
  }
  $('#lobby').append(`<p id = "lobbyCount" class="gameTitle">${numberOfPlayers}/4</p>`);
}

// Dagmara
// hide game menu and show the game username input and play button
function init() {
  $('#usernameInput').val('');
  $('#playMenu').css('display', 'block');
  $('#showHelp').css('display', 'block');
  $('#loggedInUserIcon').css('display', 'none');
  $('#roomCodeScreen').css('display', 'none');
  $('#difficultySelection').css('display', 'none');
  $('#returnToMainMenuButton').css('display', 'none');
  createUsernameScreen();
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

// Dagmara
// removes player from game object and changes interface back to main menu
function removePlayerAndGoToMainMenu() {
  socket.emit('updateLobby', Number($('#lobbyCount').text().split('/')[0]) - 1);
  socket.emit('removePlayerAndGoToMainMenu');
  showMainMenu();
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
  player = new Player(64, 64, 32, 32, new Img('./assets/images/game/characters.png', 0, 0, 0, 2, 5, 1), username, '', socketId, playerId);
  socket.emit('playerCreated', player);
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
  $('.container-fluid').css('display', 'none');
  // handle game difficulty
  if (map.difficulty === 0) {
    // change to easy mode
    $('#viewBlock').css('background', 'radial-gradient(circle at 50% 50%, transparent 200px, black calc(640px - 32px))');
  } else {
    // change to hard mode
    $('#viewBlock').css('background', 'radial-gradient(circle at 50% 50%,transparent 100px,black calc(320px - 32px))');
  }
  $('#viewBlock').css('display', 'block');
  $('#backgroundMusicControl').css('display', 'block');
  $('#soundFxControl').css('display', 'block');
  $('#inGameElements').css('display', 'block');
  startBackgroundMusic();
  startSoundFx();
  //set health to 100%
  $('#scoreValue').text("0");
  $('#healthFill').css('clip', `rect(0.4em, 5em, 5em, 0)`);
}

// Dagmara
// Display game code
function handleGameCodeDisplay(roomName) {
  init();
  $('#displayGameCode').text(roomName);
}

// Dagmara
// In case the room is empty notify and return to game menu
function playerNotExists() {
  alert('Error the player does not exists, pls try again');
  showMenuScreen();
}

socket.on('roomName', handleGameCodeDisplay);
socket.on('usernameAdded', enablePlayButton);
socket.on('playersNotReady', usernameMessage);
socket.on('playersReady', playersReady);
socket.on('createPlayer', createPlayer);
socket.on('noPlayer', playerNotExists);
socket.on('updatePlayer', updatePlayer);
socket.on('numberOfPlayersInTheRoom', setNumberOfPlayersInTheRoom);
