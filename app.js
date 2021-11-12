//setup express Marianna
const express = require("express");
const { ClientRequest } = require("http");
const { SocketAddress } = require("net");
const app = express();

//setup static dir
app.use(express.static(__dirname + '/public'));

//setup socket server
const server = require('http').createServer(app);
const io = require('socket.io')(server);

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
    socket.on("newGame", handleNewGameCreation);
    socket.on("joinGame", handleJoinGame);
    socket.on("createUsername", handleCreateUsername);
    socket.on("playerCreated", addPlayerToGameObject);
    socket.on("playGame", startGame);
    socket.on("playGameButtonClicked", updatePlayerReadyToPlay);

    function updatePlayerReadyToPlay(username) {
        const roomName = playersRoomTable[socket.id];
        const gameState = games[roomName];
        //loop over game state and update player to have field ready

    }

    function handleNewGameCreation() {
        //what we want to do is: create socketIO room and client that joins the game have to add the code which is roomId 
        let roomName = makeId(8) //function which creates id, we pass length of the id

        //new game starts so the user is assigned to the room
        playersRoomTable[socket.id] = roomName;
        socket.emit("roomName", roomName);

        //create state of the game for the room
        games[roomName] = createGame(); //we don't have this function!!!!!
        socket.join(roomName); 
    }

    function addPlayerToGameObject() {
        //empty for now no game object;
        socket.emit("playerAddedToGame")
    }

    function handleCreateUsername(username) {
        console.log(username);
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
            console.log(gameState);
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
        //loop over game object to check if all players are reayd if yes start game interval
        startGameInterval(gameCode);
    }

    function startGameInterval (gameCode) {
        setInterval(() => {
            io.to(gameCode).emit('new frame');
        }, 1000 / FRAME_RATE);
    }

})
//just for testing if multiplayer works!!!!
function createGame() {
    console.log("new game state created");
    return {data: "new state"};
}
const PORT = process.env.PORT || 8080;
server.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", Number(PORT));
});