// Required modules
var _ = require("underscore");
var express = require("express");
var app = express();
var http = require("http").Server(app);
var config = require("./config.js");
var pathManager = require("./server/pathManager.js");
var gameManager = require("./server/gameManager.js");
var socketManager = require("./server/socketManager.js");

// Listening clients
http.listen(config.port, function () {
    console.log("Listening on *:" + config.port);
});

// Provide resources
app.use(express.static(pathManager.PUBLIC_BUILD));
app.get("/", function (req, res) {
    res.sendFile(pathManager.PUBLIC_BUILD + "/index.html");
});

// Start listening with socket io
socketManager.listen(http);

// Initialize game and attach callbacks
gameManager.start();
gameManager.onUpdate = function (snapshot) {
    socketManager.sendUpdate(snapshot);
};
socketManager.onAddClient = function () {
    gameManager.addPlayer();
};
socketManager.onRemoveClient = function () {
    gameManager.removePlayer();
};
socketManager.onEnemyHit = function (enemyId) {
    gameManager.onEnemyHit(enemyId);
};
