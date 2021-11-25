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
        const userHighestScore = getUserHighestscore(result.playerId);
        return;
    }
    alert(result.message);
}

async function getUserHighestscore(playerId) {
    if (playerId) {
        const response = await fetch(`/api/highestscore/user/${playerId}`);
        result = await response.json();
        console.log(result);
        if (result.highestscore) {
            return result.highestscore;
        }
        document.getElementById('message').innerText = result.message;
        return;
    }
    showMainMenu();
}
/*
function displayHighscores() {
    response = await fetch('/api/highscores');
    result = await response.json();
    if (result.highscores) {
      result.highscores.foreach(position => 
        document.getElementById("highscoreList").append(`
        <tr>
            <td>${position.player_id}</td>
            <td>${position.username}</td>
            <td>${position.score}</td>
        </tr>
        `))
    } else {
        document.getElementById('#message').text(result.message);
    }
}
*/