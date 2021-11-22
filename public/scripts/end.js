const endScreen = document.getElementById('endScreen');

// Marianna
// when player finishes, add their score to the display
function addScoreToDisplay(player) {
  // might change to ajax
  endScreen.innerHTML += `<span class="playerEndScore">${player.username} : ${player.score}</span></br>`;
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
  spectatingPlayer = new Player(
    data.x,
    data.y,
    data.width,
    data.height,
    new Img(data.img.src, data.img.startRow, data.img.startColumn, data.img.rows, data.img.columns, data.img.speed, '', data.img.currentRow, data.img.currentColumn),
    data.username,
  );
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
