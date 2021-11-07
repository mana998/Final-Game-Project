//setup express Marianna
const express = require("express");
const app = express();

//setup static dir
app.use(express.static(__dirname + '/public'));

//setup server
const server = require('http').createServer(app);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

const PORT = process.env.PORT || 8080;
server.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", Number(PORT));
});