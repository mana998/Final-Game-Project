const highscoreButton = document.getElementById("highscoreButton");
highscoreButton.addEventListener("click", openHighscores)

function showHighscores() {
    document.getElementById("highscore").style.display = "block";
    document.getElementById("menuOptions").style.display = "block";
    document.getElementById("panel").style.display = "none";
    document.getElementById("loginAndRegister").style.display = "none";
    document.getElementById("gameScreen").style.display = "none";
}
async function openHighscores() {
    const result = await getSession();
    if (result.username && result.playerId) {
        showHighscores();
        const userHighestScore = await getUserHighestscore(result.playerId);
        displayHighscores(userHighestScore);
        return;
    }
    alert(result.message);
}

async function getUserHighestscore(playerId) {
    if (playerId) {
        const response = await fetch(`/api/highestscore/user/${playerId}`);
        result = await response.json();
        if (result.highestscore) {
            return result.highestscore;
        }
        document.getElementById('message').innerText = result.message;
        return;
    }
    showMainMenu();
}

async function displayHighscores(userHighestScore) {
    if (!userHighestScore) {
        document.getElementById('message').innerText = 'User does not have any saved score';
    }
    const response = await fetch(`/api/highscores/user/${userHighestScore}`);
    const result = await response.json();
    if (result.highscores) {
      $("#highscorestableBody").empty();
      result.highscores.forEach(record => 
        $("#highscorestableBody").append(`
        <tr>
            <th>${record.place}</th>
            <th>${record.username}</th>
            <th>${record.score}</th>
            <th>${record.dateTime}</th>
        </tr>
        `))
    } else {
        document.getElementById('message').innertext = result.message;
    }
}
