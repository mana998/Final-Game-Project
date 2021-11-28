let currentPage = 1;

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

//display 5 score before and after the users highest score
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

function changePage(pageNumber) {
  currentPage = pageNumber;
  displayAllHighscores();
}

//display highscore with pagination
async function displayAllHighscores() {
  const response = await fetch(`/api/highestscores/${currentPage}`);
  const result = await response.json();
  if (result.highscores && result.pages) {
    $('#highscorestableBody').empty();
    result.highscores.forEach((record) => $('#highscorestableBody').append(`
        <tr>
            <th>${record.place}</th>
            <th>${record.username}</th>
            <th>${record.score}</th>
            <th>${record.dateTime}</th>
        </tr>
        `));
    $('#pages').empty();
    let visiblePageNumbers = 3;
    switch(currentPage) {
      case 1:
        if (currentPage + 3 > result.pages){
          visiblePageNumbers = result.pages;
        }
        for (let page = currentPage; page <= visiblePageNumbers; page ++) {
          $('#pages').append(`<button onclick = "changePage(${page})">${page}</button>`);
        } 
        break;
      case result.pages:
        let startPage = currentPage-2;
        if (currentPage - visiblePageNumbers <= 0){
          startPage  = 1;
        }
        for (let page = startPage; page <= result.pages; page ++) {
          $('#pages').append(`<button onclick = "changePage(${page})">${page}</button>`);
        }
        break;
      default:
        for (let page = currentPage; page < currentPage+visiblePageNumbers; page ++) {
          $('#pages').append(`<button onclick = "changePage(${page-1})">${page-1}</button>`);
        }
    }
      
     
  } else {
    $('#message').text(result.message);
  }
}

async function openHighscores() {
  const result = await getSession();
  if (result.username && result.playerId) {
    showHighscores();
    displayAllHighscores();
    return;
  }
  alert(result.message);
}
