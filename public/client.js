//control variable to check whether game is in-progress
let playing = false;

//setup socket
const socket = io();
socket.on("roomName", handleGameCodeDisplay);
socket.on("EmptyRoom", handleEmptyRoom);
socket.on("FullRoom", handleFullRoom);
socket.on("wrongCode", handleWrongCode);
socket.on("playerAddedToGame", enablePlayButton);
socket.on("playersNotReady", playersNotReady);
socket.on("playersReady", playersReady);

//menu
const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");

const createGameButton = document.getElementById("createNewGameButton");
const codeInput = document.getElementById("codeInput");
const joinGameButton = document.getElementById("joinGameButton");
const displayGameCode = document.getElementById("displayGameCode");
const usernameInput = document.getElementById("usernameInput");
const playGameButton = document.getElementById("playGameButton");
const changeUsernameMessage = document.getElementById("changeUsernameMessage");
const playMenu = document.getElementById("playMenu");

const container = document.getElementsByClassName("container")[0];

createGameButton.addEventListener("click", createGame);
usernameInput.addEventListener("change", addUsername);
joinGameButton.addEventListener("click", joinGame);
playGameButton.addEventListener("click", playGame);

//Dagmara
//creates the room and game state
function createGame() {
    socket.emit("newGame");
    init();
}

//Dagmara
//display message if the code is wrong
function handleWrongCode() {
    wrongGameCode.innerText = "Incorrect game code, the room doesn't exists";
}

//Dagmara
//if the room code is valid it allows player to join existing game
function joinGame() {
    const code = codeInput.value;
    socket.emit("joinGame", code);
}

//Dagmara
//starts the game for the user, changes it's state to ready to play and if all players are ready starts the game
function playGame() {
    player.readyToPlay = true;
    updateServer();
    //do something to activate only on click when everyone set login
    socket.emit("playGame", displayGameCode.innerText);
}

//Dagmara
//Checks if player can use the username
function addUsername() {
    username = usernameInput.value;
    socket.emit("createUsername", username);
    socket.on("usernameAccepted", acceptUsername);
    socket.on("usernameDeclined", changeUsername);
}

//Dagmara
//Adds player to the game object
function acceptUsername() {
    player = new Player(64, 64, 32, 32, new Img("./assets/images/test.png", 0, 0, 0, 2, 5, 1), username);
    socket.emit("playerCreated", player);
}

//Dagmara
//If players' username is valid the play game button is enabled
function enablePlayButton() {
    playGameButton.removeAttribute("disabled");
}

//Dagmara
//If username is invalid the user is promped to enter different username
function changeUsername() {
    changeUsernameMessage.innerText = "Username already exists, input new username!"
}

//Dagmara
//informs players that not all players are ready to play
function playersNotReady() {
    changeUsernameMessage.innerText = "Other players are still not ready, give them another minute!"
}

function playersReady() {
    playMenu.style.display = "none";
    playing = true;
    canvas.style.display = "block";
    container.style.border = "none";
}

//Dagmara
//hide game menu and show the game username input and play button
function init() {
    menuScreen.style.display = "none";
    gameScreen.style.display = "block";
}

//Dagmara
//Display game code
function handleGameCodeDisplay(gameCode) {
    init();
    displayGameCode.innerText = gameCode;
}

//Dagmara
//In case the room is empty notify and return to game menu
function handleEmptyRoom() {
    alert("The room doesn't exists!");
    showMenuScreen();
}

//Dagmara
//In case the room is full notify user and return to game menu
function handleFullRoom() {
    alert("This room is full");
    showMenuScreen();
}

//Dagmara
//Hides username input and show game menu
function showMenuScreen() {
    menuScreen.style.display = "block";
    gameScreen.style.display = "none";
}