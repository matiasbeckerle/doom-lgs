// Required modules
var _ = require("underscore");
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var gameManager = require("./gameManager.js");
var kolog = require("./kolog.js");

// Appropriate port number for Doom related, right?
var port = process.env.PORT || 666;

http.listen(port, function () {
    kolog.info("Listening on *:" + port);
});

// Provide resources
app.use(express.static(__dirname + "/public"));
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

// To keep track of clients
var clients = [];

io.sockets.on("connection", function (socket) {
    // Add a new client
    addClient(socket);
    kolog.info("A player has joinned with ID " + socket.client.id + " and UA " + socket.request.headers["user-agent"]);

    // Someone kills an enemy
    socket.on("enemyHit", function (enemyId) {
        gameManager.onEnemyHit(enemyId);
        kolog.info("The player " + socket.client.id + " has killed an enemy.");
    });
    
    // Someone goes offline
    socket.on("disconnect", function () {
        removeClient(socket);
        kolog.info("The player " + socket.client.id + " leaves the game.");
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
