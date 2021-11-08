//setup socket
const socket = io();

//setup canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const player = new Player(0, 0, 32, 32, new Img("./assets/images/test.png", 0, 0, 0, 2, 5, 1), "username")



socket.on("new frame", () => {
    draw();
})


function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx);
}

//event listener for start of the movement
window.addEventListener("keydown", movePlayer);

function movePlayer(e) {
    switch(e.key) {
        case "A":
        case "a":
        case "ArrowLeft":
            player.x -= 1 * player.speed;
            break;
        case "D":
        case "d":
        case "ArrowRight":
            player.x += 1 * player.speed;
            break;
        case "W":
        case "w":
        case "ArrowUp":
            player.y -= 1 * player.speed;
            break;
        case "S":
        case "s":
        case "ArrowDown":
            player.y += 1 * player.speed;
            break;
    }
}