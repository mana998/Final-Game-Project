const endScreen = document.getElementById('endScreen');

function addScoreToDisplay(player) {
  // might change to ajax
  endScreen.innerHTML += `<span class="playerEndScore">${player.username} : ${player.score}</span></br>`;
}

function changeSpectator(e) {
  if (e.key === 'Enter') {
    const username = (spectatingPlayer) ? spectatingPlayer.username : null;
    socket.emit('changeSpectator', username);
  }
}

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

socket.on('changeSpectating', changeSpectatingPlayer);
socket.on('addPlayerScore', addScoreToDisplay);
