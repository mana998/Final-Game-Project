function difficultyScreen () {
    $('#loginAndRegister').css('display', 'none');
    $('#menuOptions').css('display', 'block');
    $('#panel').css('display', 'none');
    $('#highscore').css('display', 'none');
    $('#gameScreen').css('display', 'none');
    $('#interactionForm').css('display', 'none');
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
    $('#difficultySelection').css('display', 'block');  
}

$('#joinGameButton').on('click', codeScreen);

$('#createNewGameButton').on('click', difficultyScreen);

