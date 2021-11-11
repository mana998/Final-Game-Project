//setup express Marianna
const express = require("express");
const app = express();

//setup static dir
app.use(express.static(__dirname + '/public'));

//database setup
const db = require("./database/connection").connection; 

//setup socket server
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//framerate
const FRAME_RATE = 60;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

io.on("connection", (socket) => {
    setInterval(() => {
        io.emit('new frame');
    }, 1000 / FRAME_RATE);

})

const PORT = process.env.PORT || 8080;
server.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", Number(PORT));
});