//setup socket
const socket = io();
socket.on("roomName", handleGameCodeDisplay);
socket.on("EmptyRoom", handleEmptyRoom);
socket.on("FullRoom", handleFullRoom);
socket.on("playerAddedToGame", enablePlayButton);
socket.on("playersNotReady", playersNotReady);
socket.on("playersReady", playersReady);

//setup canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let map = new GameMap;
let player;
let username;

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
const playMenu = document.getElementById("playMenu");


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

//Dagmara
//creates the room and game state
function createGame() {
    socket.emit("newGame", map);
    init();
}

//Dagmara
//if the room code is valid it allows player to join existing the game
function joinGame() {
    const code = codeInput.value;
    socket.emit("joinGame", code);
    init();
}

//Dagmara
//starts the game for the user, changes it's state to ready to play and if all players are ready starts the game
function playGame() {
    player.readyToPlay = true;
    updateServer();
    //do something to activate only on click when everyone set login
    socket.emit("playGame", dispalyGameCode.innerText);
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
    dispalyGameCode.innerText = gameCode;
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
//Hides usewrname input and show game menu
function showMenuScreen() {
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
    if (player.direction !== undefined && player.direction !== direction) {
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
