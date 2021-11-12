//setup socket
const socket = io();
socket.on("roomName", handleGameCodeDisplay);
socket.on("EmptyRoom", handleEmptyRoom);
socket.on("FullRoom", handleFullRoom);
socket.on("init", init);

//setup canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//menu
const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");

const createGameButton = document.getElementById("createNewGameButton");
const codeInput = document.getElementById("codeInput");
const joinGameButton = document.getElementById("joinGameButton");
const dispalyGameCode = document.getElementById("dispalyGameCode");

createGameButton.addEventListener("click", createGame);
joinGameButton.addEventListener("click", joinGame);

function createGame() {
    socket.emit("newGame");
}

function joinGame() {
    const code = codeInput.value;
    socket.emit("joinGame", code);
    init();
}

//this function should be probably changed BUT REMEMBER TO LEAVE DISPLAY CHANGE!!!
function init() {
    menuScreen.style.display = "none";
    gameScreen.style.display = "block";
    const testPlayer = new Player(0, 0, 32, 32, new Img("./assets/images/test.png", 0, 0, 0, 2, 5, 1), "username")

    socket.on("new frame", () => {
        draw();
    })

    function draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        testPlayer.draw(ctx);
    }
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

