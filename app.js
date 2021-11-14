//setup express
const express = require("express");
const app = express();

//setup static dir
app.use(express.static(__dirname + '/public'));

//database setup
//const db = require("./database/connection").connection; 

//setup socket server
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const fs = require('fs');

//import game class
const Game = require("./private/models/Game").Game;
//import utils class
const Utilities = require("./private/models/Utils").Utils;
//create utils object
const Utils = new Utilities();

//framerate
const FRAME_RATE = 60;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

//variable that maps client id to the room name
const playersRoomTable = {};

//global state that holds states of all posible rooms
const games = {};

io.on("connection", (socket) => {

    socket.on("newGame", handleNewGameCreation);
    socket.on("joinGame", handleJoinGame);
    socket.on("createUsername", handleCreateUsername);
    socket.on("playerCreated", addPlayerToGameObject);
    socket.on("playGame", startGame);
    socket.on("clientUpdated", handleClientUpdate);

    function handleNewGameCreation(map) {
        //what we want to do is: create socketIO room and client that joins the game have to add the code which is roomId 
        let roomName = Utils.createId(8) //function which creates id, we pass length of the id

        //new game starts so the user is assigned to the room
        playersRoomTable[socket.id] = roomName;
        socket.emit("roomName", roomName);

        //create state of the game for the room
        games[roomName] = new Game();

        //import map class
        const GameMap = require("./public/models/GameMap").GameMap;
        const mapFile = `./private/assets/maps/map${Utils.getRandomNumber(1, 6)}.json`;
        map = new GameMap();
        map.loadMap(require(mapFile));
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
        } else if (totalPlayersInRoom > 3) {
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
        if (allPlayerrsReadyToPlay === gameState.players.length){
            io.to(gameCode).emit("playersReady");
            startGameInterval(gameCode, gameState);
        } else {
            socket.emit("playersNotReady");
            return;
        }
    }

    function startGameInterval (gameCode, gameState) {
        setInterval(() => {
            io.to(gameCode).emit('newFrame', gameState);
        }, 1000 / FRAME_RATE);
    }

    function handleClientUpdate(data) {
        //consider socket id instead of username
        //find player object with same username
        const updatedPlayer = games[playersRoomTable[socket.id]].players.find(player => player.username === data.player.username);
        //update the player object with new data
        games[playersRoomTable[socket.id]].players[games[playersRoomTable[socket.id]].players.indexOf(updatedPlayer)] = data.player;
        //update map
        if (data.map) {
            games[playersRoomTable[socket.id]].map = data.map;
        }
    }

})

const PORT = process.env.PORT || 8080;
server.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", Number(PORT));
});