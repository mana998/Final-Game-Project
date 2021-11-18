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
    socket.on("playerFinished", handlePlayerFinished);
    socket.on('changeSpectator', changeSpectatingPlayer)
    socket.on('disconnect', handlePlayerDisconnect);
    socket.on('stopInterval', handleStopInterval);

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
        map = new GameMap('', '', Utils);
        map.loadMap(require(mapFile));
        games[roomName].map = map;
        socket.join(roomName); 
        socket.emit("createPlayer", socket.id);
    }

    function addPlayerToGameObject(player) {
        player.socketId = socket.id;
        games[playersRoomTable[socket.id]].players.push(player);
    }

    function handleCreateUsername(data) {
        const usernameValid = Utils.checkStringCharacters(data.username);
        if (!usernameValid) {
            socket.emit("usernameDeclined", "Please, use one or more characters from: A-Z and 0-9.");
            return;
        }
        const uniqueUsername = games[playersRoomTable[socket.id]].players.every(player => player.username !== data.username);
        if (!uniqueUsername) {
            socket.emit("usernameDeclined");
            return;
        }
        data.player.username = data.username;
        handleClientUpdate(data);
        socket.emit("usernameAdded");
        socket.emit("updatePlayer", data.player);
    }

    function handleJoinGame(gameCode) {
        const desiredRoom = io.sockets.adapter.rooms.get(gameCode);
        let totalPlayersInRoom;
        if (!desiredRoom) {
            socket.emit("wrongCode");
            return;
        }

        totalPlayersInRoom = desiredRoom.size;
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
        socket.emit("createPlayer", socket.id);
    }

    function startGame(gameCode) {
        const gameState = games[gameCode];
        const allPlayerrsReadyToPlay = gameState.players.filter(player => player.readyToPlay).length;
        if (allPlayerrsReadyToPlay === gameState.players.length){
            //send new player position to each player
            gameState.players.map(player => {
                gameState.map.setPlayerStartPosition(player);
            })
            io.to(gameCode).emit("playersReady", gameState.players);
            startGameInterval(gameCode, gameState);
        } else {
            socket.emit("playersNotReady");
            return;
        }
    }

    function startGameInterval (gameCode, gameState) {
        gameState.interval = setInterval(() => {
            io.to(gameCode).emit('newFrame', gameState);
        }, 1000 / FRAME_RATE);
    }

    function handleClientUpdate(data) {
        //update the player object with new data
        const updatedPlayer = games[playersRoomTable[socket.id]].players.find(player => player.socketId === socket.id);
        const index = games[playersRoomTable[socket.id]].players.indexOf(updatedPlayer);
        if ( index < 0) {
            socket.emit("noPlayer");
            return;
        }
        games[playersRoomTable[socket.id]].players[index] = data.player;
        //update map
        if (data.map) {
            games[playersRoomTable[socket.id]].map = data.map;
        }
    }

    //Marianna
    //when player finishes, update everyone in the room with their score
    function handlePlayerFinished(player) {
        io.to(playersRoomTable[socket.id]).emit("addPlayerScore", player)
        //give time till server updates with newest values
        setTimeout(() => {
            //check if all players finished to disable spectating mode
            if (games[playersRoomTable[socket.id]].players.every(player => player.isDone === true)) {
                io.to(playersRoomTable[socket.id]).emit("gameEnded");
            }
        }, 100);
    }

    //Marianna
    function changeSpectatingPlayer(username){
        //get player list
        let players = games[playersRoomTable[socket.id]].players;
        //find current spectating player and index
        let player = players.find(player => player.username === username)
        let playerPosition = players.indexOf(player);
        let position = playerPosition;
        //look for player who isn't done
        //stop if it gets back to current spectating player
        do {
            position++;
            if (players.length <= position) position = 0;
        } while (playerPosition !== -1 && players[position].isDone === true && position !== playerPosition);
        socket.emit('changeSpectating', players[position]);
    }

    //Marianna
    function handlePlayerDisconnect() {
        if (games[playersRoomTable[socket.id]]) {
            //remove player from room
            games[playersRoomTable[socket.id]].players = games[playersRoomTable[socket.id]].players.filter(player => player.socketId !== socket.id);
            //empty room
            //remove data about room
            if (games[playersRoomTable[socket.id]].players.length === 0) {
                //stop timer
                clearInterval(games[playersRoomTable[socket.id]].interval);
                delete games[playersRoomTable[socket.id]];
            }
            //remove data about player
            delete playersRoomTable[socket.id];
        }
    }

    function handleStopInterval() {
        clearInterval(games[playersRoomTable[socket.id]].interval);
    }
})

const PORT = process.env.PORT || 8080;
server.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", Number(PORT));
});