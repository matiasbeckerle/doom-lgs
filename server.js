// Required modules
var _ = require("underscore");
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var config = require("./config.js");
var pathManager = require("./pathManager.js");
var gameManager = require("./gameManager.js");

http.listen(config.port, function () {
    console.log("Listening on *:" + config.port);
});

// Provide resources
app.use(express.static(pathManager.PUBLIC_BUILD));
app.get("/", function (req, res) {
    res.sendFile(pathManager.PUBLIC_BUILD + "/index.html");
});

// To keep track of clients
var clients = [];

io.sockets.on("connection", function (socket) {
    // Add a new client
    addClient(socket);

    // Someone kills an enemy
    socket.on("enemyHit", function (enemyId) {
        gameManager.onEnemyHit(enemyId);
    });
    
    // Someone goes offline
    socket.on("disconnect", function () {
        removeClient(socket);
    });
});

/**
 * Adds a client in the list.
 */
function addClient(socket) {
    clients.push(socket);
    gameManager.addPlayer();
}

/**
 * Removes a client from the list.
 */
function removeClient(socket) {
    delete clients[clients.indexOf(socket)];
    gameManager.removePlayer();
}

// Start the game and send frequent updates to the clients
gameManager.start();
gameManager.onUpdate = function (snapshot) {
    io.emit("update", snapshot);
};
