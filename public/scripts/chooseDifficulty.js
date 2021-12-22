function openDifficultyScreen () {
    $('#mainMenu').css('display', 'none');
    $('#returnToMainMenuButton').css('display', 'block');
    $('#difficultySelection').css('display', 'block'); 
    createDifficultyScreen();  
    $('#loggedInUserIcon').css('display', 'none');
}

function createDifficultyScreen() {
    if (!$('#difficultySelection').children().length) {
        $('#difficultySelection').append(`
            <h1 class="gameTitle">CHOOSE YOUR DIFFICULTY:</h1>
            <button type="button" class="difficultyButton backgroundPicture smallButton" onClick="createGame(0)"><span class="buttonText orangeText">EASY</span></button>
            <button type="button" class="difficultyButton backgroundPicture smallButton" onClick="createGame(1)"><span class="buttonText orangeText">HARD</span></button>
        `);
    } 
}

$('#createNewGameButton').on('click', openDifficultyScreen);

