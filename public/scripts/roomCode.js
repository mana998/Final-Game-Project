function codeScreen () {
    $('#loginAndRegister').css('display', 'none');
    $('#menuOptions').css('display', 'block');
    $('#panel').css('display', 'none');
    $('#highscore').css('display', 'none');
    $('#gameScreen').css('display', 'none');
    createRoomCodeScreen();
    $('#loggedInUserIcon').css('display', 'none');
}

function createRoomCodeScreen() {
    if (!$('#roomCodeScreen').children().length) {
        $('#roomCodeScreen').append(`
            <h1 class="gameTitle">ENTER ROOM CODE:</h1>
            <div class='' id="joinRoomToPlay">
            <form>
                <input type="text" placeholder="CODE" id="codeInput">
            </form>
                <span id="wrongGameCode"></span></br>
                <button type="button" class="btn" onClick="joinGame()" id="joinGameButtonAFterCodeInput">JOIN GAME</button>
            </div>
        `);
    } else {
        $('#roomCodeScreen').css('display', 'block');
    }
    
}

// Dagmara
// display message if the code is wrong
function handleWrongCode() {
    $('#wrongGameCode').text("Incorrect game code, the room doesn't exists");
}
// Dagmara
// In case the room is empty notify and return to game menu
function handleEmptyRoom() {
    alert("The room doesn't exists!");
    showMenuScreen();
}

// Dagmara
// In case the room is full notify user and return to game menu
function handleFullRoom() {
    alert('This room is full');
    showMenuScreen();
}

// Dagmara
// if the room code is valid it allows player to join existing game
function joinGame() {
    const code = $('#codeInput').val();
    socket.emit('joinGame', code);
}

socket.on('EmptyRoom', handleEmptyRoom);
socket.on('FullRoom', handleFullRoom);
socket.on('wrongCode', handleWrongCode);

$('#joinGameButton').on('click', codeScreen);

