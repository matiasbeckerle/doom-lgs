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
    dirty: false,
    enemies: {},
    players: 0
};

var clients = [];

io.sockets.on("connection", function(socket) {
    // Add a new client
    addClient(socket);

    // Someone kills an enemy, just propagate without verifying anything
    socket.on("enemyHit", function (enemyId) {
        // Is still alive?
        if (gameState.enemies[enemyId]) {
            addAvailableSpawnPosition(gameState.enemies[enemyId].position); // Free a not-used-anymore position
            delete gameState.enemies[enemyId];
            gameState.dirty = true;
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
    gameState.dirty = true;
}

function removeClient(socket) {
    delete clients[clients.indexOf(socket)];
    gameState.players--;
    gameState.dirty = true;
}



// The game...

var tickState;
var tickGame;

start();

/**
 * Starts a game iteration keeping two different ticks:
 *  - State will notify our clients about the current game state.
 *  - Game will keep alive our game creating enemies, etc.
 */
function start() {
    tickState = setInterval(updateState, 200);
    tickGame = setInterval(updateGame, 3000);
}

/**
 * Sends a picture of the current game state to our clients.
 */
function updateState() {
    io.emit("update", gameState);
    gameState.dirty = false;
}

/**
 * Keeps alive our game creating enemies, etc.
 */
function updateGame(params) {
    if (Object.keys(gameState.enemies).length < spawnPositions.length) {
        spawnEnemy();
    }
}

/**
 * Creates a new enemy and share it to the whole world
 */
function spawnEnemy() {
    var enemyN = new EnemyN();
    gameState.enemies[enemyN.id] = enemyN;
    gameState.dirty = true;
}

/**
 * Pre-defined spawn positions.
 */
var spawnPositions = [
    {x: 100, y: 310},
    {x: 200, y: 310},
    {x: 400, y: 300},
    {x: 500, y: 310},
    {x: 600, y: 310},
    {x: 700, y: 310}
];
var availableSpawnPositions = _.clone(spawnPositions);

/**
 * The EnemyN networking class that represents an Enemy in the server.
 * Used only for networking purposes.
 */
var EnemyN = function () {
    var self = this;
    
    self.id = _.uniqueId("EnemyN-");
    self.position = getAvailableSpawnPosition();
    
    return self;
};

/**
 * Gets a random spawn position.
 */
function getAvailableSpawnPosition() {
    var index = _.random(0, availableSpawnPositions.length - 1);
    var position = _.clone(availableSpawnPositions[index]);
    
    // The new position is not available anymore, remove it
    availableSpawnPositions.splice(index, 1);
    
    return position;
}

/**
 * Includes a free spawn position after enemy kill.
 */
function addAvailableSpawnPosition(position) {
    availableSpawnPositions.push(position);
}
