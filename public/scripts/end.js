const endScreen = document.getElementById("endScreen");

socket.on("addPlayerScore", addScoreToDisplay)

function addScoreToDisplay(player) {
    //might change to ajax
    endScreen.innerHTML += `<span>${player.username} : ${player.score}</span></br>`;
}