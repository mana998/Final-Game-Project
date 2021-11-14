//setup canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


//global objects for map and player
let map;
let player;

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

socket.on("newFrame", (data) => {
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
    //stop if game is not in progress
    if (!playing) return;
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

function stopPlayer(e) {
    //stop if game is not in progress
    if (!playing) return;
    //update only if the key was for movement
    if (e.key.match(/^[aAdDsSwW]|Arrow(Up|Down|Right|Left)$/)){ 
        //ensure middle position
        player.img.startColumn += 1;
        player.img.currentColumn = player.img.startColumn;
        //stop animation movement
        player.img.rows = 0;
        player.img.columns = 0;
        player.direction = '';
        updateServer();
    }
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
    socket.emit('clientUpdated', {player: player, map: map})
}