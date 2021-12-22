let currentPage = 1;

function showHighscores() {
  $('#mainMenu').css('display', 'none');
  $('#returnToMainMenuButton').css('display', 'block');
  $('#returnToMainMenuButton').addClass('highscoreReturnToMainButton');
  $('#highscore').css('display', 'block');
  createHighscoreScreen();
}

function createHighscoreScreen() {
  if (!$('#highscore').children().length) {
      $('#highscore').append(`
      <div id="highscoreBody">
        <h1 id="highscoreHeadder" class="gameTitle">HIGHSCORE</h1>
        <table id="highscoreList" class="backgroundPicture bigTable brownText">
            <thead>
                <tr>
                    <th></th>
                    <th>USERNAME</th>
                    <th>SCORE</th>
                    <th>DATE</th>
                </tr>
            </thead>
            <tbody id="highscorestableBody">
            </tbody>
        </table>
        <div id = "pagesContainer">
            <div id = "pages"></div>
        </div>
      </div>
      `);
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
          $('#pages').append(`<button class="backgroundPicture squareButton" onclick = "changePage(${page})"><span class="buttonText orangeText">${page}</span></button>`);
        } 
        break;
      case result.pages:
        let startPage = currentPage-2;
        if (currentPage - visiblePageNumbers <= 0){
          startPage  = 1;
        }
        for (let page = startPage; page <= result.pages; page ++) {
          $('#pages').append(`<button class="backgroundPicture squareButton" onclick = "changePage(${page})"><span class="buttonText orangeText">${page}</span></button>`);
        }
        break;
      default:
        for (let page = currentPage; page < currentPage+visiblePageNumbers; page ++) {
          $('#pages').append(`<button class="backgroundPicture squareButton" onclick = "changePage(${page-1})"><span class="buttonText orangeText">${page-1}</span></button>`);
        }
    }
      
     
  } else {
    if (!$("#message").text()) {
      $('#highscoreBody form').append(`</br><span id="message">${result.message}</span>`);
    }
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