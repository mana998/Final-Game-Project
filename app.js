//setup express Marianna
const express = require("express");
const app = express();

//setup static dir
app.use(express.static(__dirname + '/public'));

//setup socket server
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//import game class
const Game = require("./private/models/Game").Game;

//framerate
const FRAME_RATE = 60;

const games = {}
//hardcoded for now
games.room1 = new Game();


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

io.on("connection", (socket) => {

    socket.on('join', (data) => {
        if (games.room1.players.some((player) => player.username === data.player.username)){
            data.player.username += Math.random();
        }
        games.room1.players.push(data.player);
        //deleted when rooms added
        socket.emit('dummy username', data.player.username);
    })

    socket.on('player updated', (data) => {
        //needs to be adjusted for rooms
        //find player object with same username
        const updatedPlayer = games.room1.players.find(player => player.username === data.player.username);
        //update the player object with new data
        games.room1.players[games.room1.players.indexOf(updatedPlayer)] = data.player;
    })

    setInterval(() => {
        io.emit('new frame', (games.room1));
    }, 1000 / FRAME_RATE);

})

const PORT = process.env.PORT || 8080;
server.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", Number(PORT));
});