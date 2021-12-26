/* eslint-disable no-unused-vars, no-undef */

function createRoomCodeScreen() {
  if (!$('#roomCodeScreen').children().length) {
    $('#roomCodeScreen').append(`
            <h1 class="gameTitle">ENTER ROOM CODE:</h1>
            <div class='' id="joinRoomToPlay">
            <form>
                <div><input class="inputBigButton backgroundPicture bigButton brownText" type="text" placeholder="CODE" id="codeInput"></div>
            </form>
                <button type="button" class="backgroundPicture bigButton" onClick="joinGame()" id="joinGameButtonAfterCodeInput">
                  <span class="buttonText orangeText">JOIN GAME</span>
                </button>
            </div>
        `);
  }
}

// Dagmara
// display message if the code is wrong
function handleWrongCode(message) {
  if (!$('#wrongGameCode').text()) {
    $('#joinRoomToPlay form').append(`<span id='wrongGameCode'>${message}</span>`);
  }
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

// Dagmara
// if the room code is valid it allows player to join existing game
async function joinGame() {
  const roomName = $('#codeInput').val();
  const result = await getSession();
  if (result.username && result.playerId) {
    socket.emit('joinGame', { roomName, logged: result.username });
  } else {
    socket.emit('joinGame', { roomName });
  }
}

socket.on('EmptyRoom', handleEmptyRoom);
socket.on('FullRoom', handleFullRoom);
socket.on('wrongCode', handleWrongCode);

function showCodeScreen() {
  $('#codeInput').val('');
  $('#wrongGameCode').remove();
  $('#mainMenu').css('display', 'none');
  $('#returnToMainMenuButton').css('display', 'block');
  $('#roomCodeScreen').css('display', 'block');
  createRoomCodeScreen();
  $('#loggedInUserIcon').css('display', 'none');
}

$('#joinGameButton').on('click', showCodeScreen);
