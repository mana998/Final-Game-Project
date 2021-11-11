//setup socket
const socket = io();

//setup canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const testImage = new GameObject(0, 0, 16, 16, new Img("./assets/images/test.png", 0, 0, 0, 4, 3, 1))

socket.on("new frame", () => {
    draw();
})


function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    testImage.draw(ctx);
}