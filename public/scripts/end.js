// Marianna
// when player finishes, add their score to the display
function addScoreToDisplay(player) {
  walkingSound.pause();
  $("#currentScoresTable").append(`<tr>
  <td id="${player.playerId}" class="playerEndScore">${player.username}</td>
  <td id="${player.playerId}Score"> ${player.score}</td>
  <td id="${player.playerId}Highscore" class="highscoreText"></td>
  </tr>)`);
}

function addMessageToScore(playerId) {
  $(`#${playerId}Highscore`).html(`NEW<br>HIGHSCORE`);
}

// Marianna
// Ask server to send different player to spectate
function changeSpectator(e) {
  if (e.key === 'Enter') {
    const username = (spectatingPlayer) ? spectatingPlayer.username : null;
    socket.emit('changeSpectator', username);
  }
}

// Marianna
// setup player to spectate based on data from server
function changeSpectatingPlayer(data) {
  spectatingPlayer.username = data.username;
}

// Marianna
function leaveGame() {
  // reload the page to reset the socket
  socket.emit('removePlayerAndGoToMainMenu');
  showMainMenu();
}

// Marianna
// stop interval even before all players leave if they are done
function handleGameEnded() {
  // stop interval
  socket.emit('stopInterval');
}

function showEndScreen() {
  $("#endScreen").append(`<h1 id="currentScoresHeader" class="gameTitle">CURRENT SCORES:</h1>`);
  $("#endScreen").append(`<div id="currentScores" class="backgroundPicture brownText smallTable">
    <table id="currentScoresTable">
    </table>
  </div>`);
  $("#endScreen").append(`<span id="spectateAnotherPlayer">(Press enter to spectate another player)</span>`);
  $("#endScreen").append(`<button type="button" class="backgroundPicture smallButton" id="leaveGameButton" onClick="leaveGame()"><span class="buttonText grayText">MAIN MENU</span></button>`);
}

socket.on('addPlayerScore', addScoreToDisplay);
socket.on('changeSpectating', changeSpectatingPlayer);
socket.on('gameEnded', handleGameEnded);
socket.on('scoreMessage', addMessageToScore);
showEndScreen();