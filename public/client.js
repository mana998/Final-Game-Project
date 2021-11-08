//setup socket
const socket = io();

//setup canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const playerImg = new Img("./assets/images/test.png", 0, 0, 0, 2, 5, 1);
const player = new Player(0, 0, 32, 32, playerImg, "username")

//hardcoded animation values for now
let animations = {
    down: [0, 0],
    left: [1, 0],
    right: [2, 0],
    up: [3, 0]
}

socket.on("new frame", () => {
    draw();
})


function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx);
    //get data about other players from server
}

//event listener for start of the movement
window.addEventListener("keydown", movePlayer);

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

//change animation based on the direction of the player
function changeAnimation(direction) {
    player.img.startRow = animations[direction][0];
    player.img.startColumn = animations[direction][1];
}

