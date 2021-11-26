function showHighscores() {
  $('#loginAndRegister').css('display', 'none');
  $('#menuOptions').css('display', 'block');
  $('#panel').css('display', 'none');
  $('#highscore').css('display', 'block');
  $('#gameScreen').css('display', 'none');
}

async function getUserHighestscore(playerId) {
  if (playerId) {
    const response = await fetch(`/api/highestscore/user/${playerId}`);
    const result = await response.json();
    if (result.highestscore) {
      return result.highestscore;
    }
    $('#message').text(result.message);
  } else {
    showMainMenu();
  }
}

async function displayHighscores(userHighestScore) {
  if (!userHighestScore) {
    $('#message').text('User does not have any saved score');
    return;
  }
  const response = await fetch(`/api/highscores/user/${userHighestScore}`);
  const result = await response.json();
  if (result.highscores) {
    $('#highscorestableBody').empty();
    result.highscores.forEach((record) => $('#highscorestableBody').append(`
        <tr>
            <th>${record.place}</th>
            <th>${record.username}</th>
            <th>${record.score}</th>
            <th>${record.dateTime}</th>
        </tr>
        `));
  } else {
    $('#message').text(result.message);
  }
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
