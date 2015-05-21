// Require modules
var _ = require("underscore");
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var gameManager = require("./gameManager.js");

// Appropriate port number for Doom related, right?
var port = process.env.PORT || 666;

http.listen(port, function () {
    console.log("Listening on *:" + port);
});

// Provide resources
app.use(express.static(__dirname + "/public"));

// The public face
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

var clients = [];

io.sockets.on("connection", function (socket) {
    // Add a new client
    addClient(socket);

    // Someone kills an enemy, just propagate without verifying anything
    socket.on("enemyHit", function (enemyId) {
        gameManager.onEnemyHit(enemyId);
    });
    
    // Someone goes offline
    socket.on("disconnect", function () {
        removeClient(socket);
    });
});

function addClient(socket) {
    clients.push(socket);
    gameManager.addPlayer();
}

function removeClient(socket) {
    delete clients[clients.indexOf(socket)];
    gameManager.removePlayer();
}

gameManager.start();
gameManager.onUpdate = function (gameState) {
    io.emit("update", gameState);
};
