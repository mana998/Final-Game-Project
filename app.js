//setup express Marianna
const express = require("express");
const { ClientRequest } = require("http");
const { SocketAddress } = require("net");
const app = express();

//setup static dir
app.use(express.static(__dirname + '/public'));

//database setup
//const db = require("./database/connection").connection; 

//setup socket server
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//import game class
const Game = require("./private/models/Game").Game;

//framerate
const FRAME_RATE = 60;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

//get method for random id generation
const { makeId } = require('./public/utils');


//variable that maps client id to the room name
const playersRoomTable = {};

//global state that holds states of all posible rooms
const games = {};

io.on("connection", (socket) => {

    socket.on('client updated', (data) => {
        //UPDATE
        //needs to be adjusted for rooms
        //find player object with same username
        const updatedPlayer = games[playersRoomTable[socket.id]].players.find(player => player.username === data.player.username);
        //update the player object with new data
        games[playersRoomTable[socket.id]].map = data.map;
        games[playersRoomTable[socket.id]].players[games[playersRoomTable[socket.id]].players.indexOf(updatedPlayer)] = data.player;
    })

    socket.on("newGame", handleNewGameCreation);
    socket.on("joinGame", handleJoinGame);
    socket.on("createUsername", handleCreateUsername);
    socket.on("playerCreated", addPlayerToGameObject);
    socket.on("playGame", startGame);

    function handleNewGameCreation(map) {
        //what we want to do is: create socketIO room and client that joins the game have to add the code which is roomId 
        let roomName = makeId(8) //function which creates id, we pass length of the id

        //new game starts so the user is assigned to the room
        playersRoomTable[socket.id] = roomName;
        socket.emit("roomName", roomName);

        //create state of the game for the room
        games[roomName] = new Game();
        games[roomName].map = map;
        socket.join(roomName); 
    }

    function addPlayerToGameObject(player) {
        games[playersRoomTable[socket.id]].players.push(player);
        //empty for now no game object;
        socket.emit("playerAddedToGame");
    }

    function handleCreateUsername(username) {
        const roomName = playersRoomTable[socket.id];
        const desiredRoom = io.sockets.adapter.rooms.get(roomName);
        let totalPlayersInRoom;
        if (desiredRoom) {
            totalPlayersInRoom = desiredRoom.size;
        }

        if (totalPlayersInRoom === 1) {
            socket.emit("usernameAccepted");
        } else {
            const gameState = games[roomName];
            //check if username is not used by other users
            socket.emit("usernameAccepted");
        }
    }

    function handleJoinGame(gameCode) {
        const desiredRoom = io.sockets.adapter.rooms.get(gameCode)

        let totalPlayersInRoom;
        if (desiredRoom) {
            totalPlayersInRoom = desiredRoom.size;
        }

        if (totalPlayersInRoom === 0) {
            socket.emit("EmptyRoom");
            return;
        }else if (totalPlayersInRoom > 3) {
            socket.emit("FullRoom");
            return;
        }

        playersRoomTable[socket.id] = gameCode;
        socket.emit("roomName", gameCode);
        socket.join(gameCode);
    }

    function startGame(gameCode) {
        const gameState = games[gameCode];
        const allPlayerrsReadyToPlay = gameState.players.filter(player => player.readyToPlay).length;
        if (allPlayerrsReadyToPlay === 4){
            startGameInterval(gameCode, gameState);
        }else {
            socket.emit("playersNotReady");
            return;
        }
        
    }

    function startGameInterval (gameCode, gameState) {
        setInterval(() => {
            io.to(gameCode).emit('new frame', gameState);
        }, 1000 / FRAME_RATE);
    }

})

const PORT = process.env.PORT || 8080;
server.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", Number(PORT));
});