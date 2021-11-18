const endScreen = document.getElementById("endScreen");

socket.on("addPlayerScore", addScoreToDisplay)
socket.on('changeSpectating', changeSpectatingPlayer);

//Marianna
//when player finishes, add their score to the display
function addScoreToDisplay(player) {
    //might change to ajax
    endScreen.innerHTML += `<span class="playerEndScore">${player.username} : ${player.score}</span></br>`;
}

//Marianna
//Ask server to send different player to spectate
function changeSpectator(e) {
    if (e.key === "Enter") {
        let username = (spectatingPlayer) ? spectatingPlayer.username : null;
        socket.emit('changeSpectator', username);
    }
}

//Marianna
//setup player to spectate based on data from server
function changeSpectatingPlayer(data) {
    spectatingPlayer = new Player(data.x, data.y, data.width, data.height, 
        new Img(data.img.src, data.img.startRow, data.img.startColumn, data.img.rows, data.img.columns, data.img.speed, '', data.img.currentRow, data.img.currentColumn),
        data.username
    );
}
