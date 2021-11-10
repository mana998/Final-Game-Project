//setup socket
const socket = io();

//setup canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const playerImg = new Img("./assets/images/test.png", 0, 0, 0, 2, 5, 1);
const player2Img = new Img("./assets/images/test.png", 4, 0, 0, 2, 5, 1);
const player = new Player(0, 0, 32, 32, playerImg, "username")
const player2 = new Player(50, 50, 32, 32, player2Img, "username")


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

socket.on("new frame", () => {
    draw();
})


function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx, (canvas.width - player.width) / 2, (canvas.height - player.height) / 2);
    //get data about other players from server
    player2.draw(ctx, ((canvas.width - player.width) / 2) - player.x + player2.x, ((canvas.height - player.height) / 2) - player.y + player2.y);
}

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
            player.x -= 1 * player.speed;
            break;
        case "D":
        case "d":
        case "ArrowRight":
            changeAnimation("right");
            player.x += 1 * player.speed;
            break;
        case "W":
        case "w":
        case "ArrowUp":
            changeAnimation("up");
            player.y -= 1 * player.speed;
            break;
        case "S":
        case "s":
        case "ArrowDown":
            changeAnimation("down");
            player.y += 1 * player.speed;
            break;
        default:
            //no need to update server if player didn't move
            return;
    }
    //add update of server
}

function stopPlayer() {
    player.img.currentColumn = player.img.startColumn + 1; //ensure middle position
    //stop animation movement
    player.img.rows = 0;
    player.img.columns = 0;
    player.direction = '';
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

