// Require modules
var _ = require("underscore");
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

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

// The whole game picture
var gameState = {
    enemies: {},
    players: 0
};

var clients = [];

io.sockets.on("connection", function(socket) {
    // Add a new client
    addClient(socket);
    
    // Someone joined, give him the whole picture
    io.emit("start", gameState);

    // Someone kills an enemy, just propagate without verifying anything
    socket.on("enemyHit", function (enemyId) {
        // Is still alive?
        if (gameState.enemies[enemyId]) {
            delete gameState.enemies[enemyId];
            io.emit("enemyKilled", enemyId);
        }
    });
    
    // Someone goes offline
    socket.on("disconnect", function () {
        removeClient(socket);
    });
});

function addClient(socket) {
    clients.push(socket);
    gameState.players++;
    io.emit("playersChange", gameState.players);
}

function removeClient(socket) {
    delete clients[clients.indexOf(socket)];
    gameState.players--;
    io.emit("playersChange", gameState.players);
}

// Game iteration
// TODO: improve a lot...
setInterval(spawnEnemy, 5000);

// Creates a new enemy and share it to the whole world
function spawnEnemy() {
    var enemyN = new EnemyN();
    gameState.enemies[enemyN.id] = enemyN;
    io.emit("spawnEnemy", enemyN);
}

var spawnPositions = [
    {x: 100, y: 310},
    {x: 200, y: 310},
    {x: 400, y: 300},
    {x: 500, y: 310},
    {x: 600, y: 310},
    {x: 700, y: 310}
];

/**
 * The EnemyN networking class that represents an Enemy in the server.
 * Used only for networking purposes.
 */
var EnemyN = function () {
    var self = this;
    
    self.id = _.uniqueId("EnemyN-");
    self.position = spawnPositions[_.random(0, spawnPositions.length)];
    
    return self;
};
