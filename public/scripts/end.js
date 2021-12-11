const endScreen = document.getElementById('endScreen');

// Marianna
// when player finishes, add their score to the display
function addScoreToDisplay(player) {
  walkingSound.pause();
  endScreen.innerHTML += `<span id="${player.playerId}" class="playerEndScore">${player.username} : ${player.score}</span></br>`;
}

function addMessageToScore(playerId) {
  $(`#${playerId}`).append(`<span class="playerEndScore"> | Score in top 100!</span>`);
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
  window.location.reload();
}

// Marianna
// stop interval even before all players leave if they are done
function handleGameEnded() {
  // stop interval
  socket.emit('stopInterval');
}

socket.on('addPlayerScore', addScoreToDisplay);
socket.on('changeSpectating', changeSpectatingPlayer);
socket.on('gameEnded', handleGameEnded);
socket.on('scoreMessage', addMessageToScore);
