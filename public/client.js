//setup socket
const socket = io();
socket.on("roomName", handleGameCodeDisplay);
socket.on("EmptyRoom", handleEmptyRoom);
socket.on("FullRoom", handleFullRoom);
socket.on("playerAddedToGame", enablePlayButton);

//setup canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let map;
let player;

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


//change canvas size on resize
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})
//change canvas size onload
window.addEventListener("load", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

//hardcoded animation values for now
let animations = {
    //startRow, startColumn, rows, columns
    down: [0, 0, 0, 2],
    left: [1, 0, 0, 2],
    right: [2, 0, 0, 2],
    up: [3, 0, 0, 2]
}

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

socket.on("new frame", (data) => {
    draw(data);
})

function draw(data){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    data.players.map(gamePlayer => {
        if (player.username === gamePlayer.username) {
            player.draw(ctx, (canvas.width - player.width) / 2, (canvas.height - player.height) / 2);
        } else {
            //transform data into proper object
            gamePlayer = new Player(gamePlayer.x, gamePlayer.y, gamePlayer.width, gamePlayer.height, 
                new Img(gamePlayer.img.src, gamePlayer.img.startRow, gamePlayer.img.startColumn, gamePlayer.img.rows, gamePlayer.img.columns, gamePlayer.img.speed, '', gamePlayer.img.currentRow, gamePlayer.img.currentColumn),
                gamePlayer.username
            );
            //get data about other players from server
            gamePlayer.draw(ctx, ((canvas.width - player.width) / 2) - player.x + gamePlayer.x, ((canvas.height - player.height) / 2) - player.y + gamePlayer.y);
        }
    })
    //draw map
    map = new GameMap(data.map.tiles);
    map.draw(ctx, player, canvas.width, canvas.height);
}

//need to consider whether game started
//event listener for start of the movement
window.addEventListener("keydown", movePlayer);

//event listener for end of the movement
window.addEventListener("keyup", stopPlayer);

function movePlayer(e) {
    switch(e.key) {
        case "A":
        case "a":
        case "ArrowLeft":
            changeAnimation("left");
            if (!player.isWallCollision(map, "left", -player.speed, 0))
                player.x -= player.speed;
            break;
        case "D":
        case "d":
        case "ArrowRight":
            changeAnimation("right");
            if (!player.isWallCollision(map, "right", player.speed, 0))
                player.x += player.speed;
            break;
        case "W":
        case "w":
        case "ArrowUp":
            changeAnimation("up");
            if (!player.isWallCollision(map, "up", 0, -player.speed))
                player.y -= player.speed;
            break;
        case "S":
        case "s":
        case "ArrowDown":
            changeAnimation("down");
            if (!player.isWallCollision(map, "down", 0, player.speed))
                player.y += player.speed;
            break;
        default:
            //no need to update server if player didn't move
            return;
    }
    //add update of server
    updateServer();
}

function stopPlayer() {
    //ensure middle position
    player.img.startColumn += 1;
    player.img.currentColumn = player.img.startColumn;
    //stop animation movement
    player.img.rows = 0;
    player.img.columns = 0;
    player.direction = '';
    updateServer();
}

//change animation based on the direction of the player
function changeAnimation(direction) {
    //only change animation when direction changes
    if (player.direction !== direction) {
        player.img.rows = animations[direction][2];
        player.img.columns = animations[direction][3];
        player.img.startRow = animations[direction][0];
        player.img.startColumn = animations[direction][1];
        player.img.currentRow = animations[direction][0];
        player.img.currentColumn = animations[direction][1];
        player.direction = direction;
    }
}

function updateServer() {
    socket.emit('client updated', {player: player, map: map})
}
