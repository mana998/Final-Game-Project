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
const clientRoomTable = {};

//global state that holds states of all posible rooms
const state = {};

io.on("connection", (socket) => {
    socket.on("newGame", handleNewGameCreation);
    socket.on("joinGame", handleJoinGame);

    function handleNewGameCreation() {
        //what we want to do is: create socketIO room and client that joins the game have to add the code which is roomId 
        let roomName = makeId(8) //function which creates id, we pass length of the id

        //new game starts so the user is assigned to the room
        clientRoomTable[socket.id] = roomName;
        console.log(clientRoomTable);
        socket.emit("roomName", roomName);

        //create state of the game for the room
        state[roomName] = createNewGameState(); //we don't have this function!!!!!
        socket.join(roomName);
        socket.number = 1;
        socket.emit("init", 1) // does nothing for now, we can use it to send player number to client 
    }

    function handleJoinGame(gameCode) {
        const desiredRoom = io.sockets.adapter.rooms.get(gameCode)//we grab the room by passign its name=id

        let playerNumber;
        if (desiredRoom) {
            playerNumber = desiredRoom.size;
        }

        if (playerNumber === 0) {
            socket.emit("EmptyRoom");
            return;
        }else if (playerNumber > 3) {
            socket.emit("FullRoom");
            return;
        }

        clientRoomTable[socket.id] = gameCode;
        socket.emit("roomName", gameCode);
        socket.join(gameCode);
        //socket.number = 
        //socket.emit("init", 1) // does nothing for now, we can use it to send player number to client 
        startGameInterval(gameCode);
    
    }

    function startGameInterval (gameCode) {
        setInterval(() => {
            io.emit('new frame');
        }, 1000 / FRAME_RATE);

        //this method should access the roomTable access the right room by gameCode and check if someone won the game 
    }

})
//just for testing if multiplayer works!!!!
function createNewGameState() {
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