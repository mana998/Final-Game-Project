//setup socket
const socket = io();

//setup canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const testPlayer = new Player(0, 0, 32, 32, new Img("./assets/images/test.png", 0, 0, 0, 2, 5, 1), "username")



socket.on("new frame", () => {
    draw();
})


function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    testPlayer.draw(ctx);
}