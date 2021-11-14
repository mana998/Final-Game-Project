//control variable to check whether game is in-progress
let playing = false;

//setup socket
const socket = io();
socket.on("roomName", handleGameCodeDisplay);
socket.on("EmptyRoom", handleEmptyRoom);
socket.on("FullRoom", handleFullRoom);
socket.on("playerAddedToGame", enablePlayButton);
socket.on("startPlaying", () => playing = true);

//menu
const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");

const createGameButton = document.getElementById("createNewGameButton");
const codeInput = document.getElementById("codeInput");
const joinGameButton = document.getElementById("joinGameButton");
const dispalyGameCode = document.getElementById("dispalyGameCode");
const usernameInput = document.getElementById("usernameInput");
const playGameButton = document.getElementById("playGameButton");
const changeUsernameMessage = document.getElementById("changeUsernameMessage");

createGameButton.addEventListener("click", createGame);
usernameInput.addEventListener("change", addUsername);
joinGameButton.addEventListener("click", joinGame);
playGameButton.addEventListener("click", playGame);

function createGame() {
    socket.emit("newGame");
    init();
}


function joinGame() {
    const code = codeInput.value;
    socket.emit("joinGame", code);
    init();
}

function playGame() {
    const username = usernameInput.value;
    socket.on("playGameButtonClicked", username);
    //do something to activate only on click when everyone set login
    socket.emit("playGame", dispalyGameCode.innerText);
}

function addUsername() {
    const username = usernameInput.value;
    socket.emit("createUsername", username);
    socket.on("usernameAccepted", acceptUsername);
    socket.on("usernameDeclined", changeUsername);
}
function acceptUsername() {
    const username = usernameInput.value;
    player = new Player(64, 64, 32, 32, new Img("./assets/images/test.png", 0, 0, 0, 2, 5, 1), username);
    socket.emit("playerCreated", player);
}

function enablePlayButton() {
    playGameButton.removeAttribute("disabled");
}

function changeUsername() {
    changeUsernameMessage.innerText = "Username already exists, input new username!"
}

//this function should be probably changed BUT REMEMBER TO LEAVE DISPLAY CHANGE!!!
function init() {
    menuScreen.style.display = "none";
    gameScreen.style.display = "block";
}

function handleGameCodeDisplay(gameCode) {
    dispalyGameCode.innerText = gameCode;
}

function handleEmptyRoom() {
    alert("The room doesn't exists!");
    menuScreen.style.display = "block";
    gameScreen.style.display = "none";
}

function handleFullRoom() {
    alert("This room is full");
    menuScreen.style.display = "block";
    gameScreen.style.display = "none";
}