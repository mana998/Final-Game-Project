let currentPage = 1;

function showHighscores() {
  $('#loginAndRegister').css('display', 'none');
  $('#menuOptions').css('display', 'block');
  $('#panel').css('display', 'none');
  $('#highscore').css('display', 'block');
  $('#gameScreen').css('display', 'none');
  $('#roomCodeScreen').css('display', 'none');
  $('#interactionForm').css('display', 'none');
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
