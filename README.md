# DoomLGS

A multiplayer Node.js light gun shooter inspired on Doom. This is a proof of concept for a server/client game.

## Play

Currently available for play in [heroku](https://doom-lgs.herokuapp.com).

## Server

Runs on a [Node.js](https://nodejs.org) server and uses [socket.io](http://socket.io) library for communication. Sends snapshots of the game state to all the connected players several times per second, using a small structure to identify uniquely each instance of the game objects.

### Insights

Server scripts are placed in `/server` folder and the main or bootstraper `server.js` file is located at root. All dependencies are defined at `package.json` and managed by [NPM](https://www.npmjs.com).

Game session is managed by the `gameManager` wich starts a cycle when the game is deployed to the server.

From `server.js` script:
```
gameManager.start();
```

From `gameManager.js` script:
```
/**
 * Starts a game iteration keeping two different ticks:
 *  - Snapshot will notify our players about the current game state.
 *  - Game will keep alive our game creating enemies, etc.
 */
var start = function () {
    snapshot = {
        dirty: false,
        players: 0,
        enemies: {}
    };
    tickSnapshot = setInterval(updateSnapshot, 100);
    tickGame = setInterval(updateGame, 3000);
};
```

With that code in mind the players will receive updates each 100ms and after 3s an enemy could be spawned too. Simple, right? Perhaps you are wondering how you send that snapshot to the players. The answer is listening for a game update.

From `server.js` script:
```
gameManager.onUpdate = function (snapshot) {
    socketManager.sendUpdate(snapshot);
};
```

What about `socketManager`? Is necessary too! That class stablishes a communication with players and sometimes it also emits a message (our snapshot).

From `socketManager.js` script:
```
/**
 * Sends an update to connected clients.
 * @param {Snapshot} snapshot The current game status.
 */
var sendUpdate = function (snapshot) {
    io.emit("update", snapshot);
};
```

But wait... what about listening? If someone enters our game the server is ready to listen for connections, disconnections and also player events like hitting an enemy!

From `socketManager.js` script:
```
/**
 * Starts socket communication.
 * @param {Http} http The recently created server.
 */
var listen = function (http) {
    io = socketio.listen(http);

    io.sockets.on("connection", function (socket) {
        // Add a new client
        addClient(socket);

        // Someone kills an enemy
        socket.on("enemyHit", function (enemyId) {
            SocketManager.onEnemyHit(enemyId);
        });

        // Someone goes offline
        socket.on("disconnect", function () {
            removeClient(socket);
        });
    });
};
```

## Client

Uses [Pixi.js](http://www.pixijs.com) as a game engine and [socket.io](http://socket.io) library for communication. Consumes the snapshots provided by the server and handles all the game objects (populated with the game engine information) in the scene.

### Insights

All client source files are placed inside `/public`. The dependencies are defined at `bower.json` file and managed by [Bower](http://bower.io).

- `/assets` contains images and sound.
- `/build` is used for building only, no files should be modified inside this folder.
- `/css` contains the styles (not much to see here).
- `/lib` contains the 3rd party libraries.
- `/scripts` contains our game scripts.
- `index.html` the only HTML required file.

I chose [RequireJS](http://requirejs.org) for handling module loading because I'm familiar with. The boostrap file is `main.js` that defines some dependencies and starts the game.

From `main.js` script:
```
requirejs(["game"], function (Game) {
    Game.start();
});
```

Starting the game involves several things to consider. First of all there is the assets loading.

From `game.js` script:
```
// Where the game begins!
var start = function () {
    PIXI.loader
        .add("background", "/assets/e2m2.png")
        .add("soldier", "/assets/enemy.png")
        .load(onAssetsLoaded);

    ...
};
```

When the assets are loaded I proceed with mounting the scene and binding with networking in order to receive updates.

From `game.js` script:
```
function onAssetsLoaded(loader, resources) {
    // Add scene background
    scene.addChild(new PIXI.Sprite(resources.background.texture));

    // Append the view
    document.getElementById("game").appendChild(renderer.view);

    // Everything ready, force the first update
    Networking.forceAnUpdate();

    // Listen for updates
    Networking.update = function (updatedServerSnapshot) {
        update(updatedServerSnapshot);
    };

    UI.showGame();

    // Start animating
    animate();
}
```

There is the Pixi.js cycle too, similar to other game engines.

From `game.js` script:
```
/**
 * Pixi.js cycle.
 */
function animate() {
    requestAnimationFrame(animate);

    // Render the container
    renderer.render(scene);
}
```

Perhaps you are wondering what `Networking` does. That's right. Manages the communication with the server. An example is when the server sends a snapshot to the players.

From `networking.js` script:
```
// The server send us an update of the current game state
socket.on("update", function (updatedServerSnapshot) {
    // Check for changes
    if (updatedServerSnapshot.dirty || forceUpdate) {
        Networking.update(updatedServerSnapshot);
        forceUpdate = false;
    }
});
```

Another responsability of the `Networking` class is to notify about certain events. Suppose that a player hits an enemy, that needs to be reported to the server to validate because we are based on the *authoritative server* concept.

From `networking.js` script:
```
/**
 * Communicate to the server that an enemy has been hit.
 */
function enemyHit(enemyId) {
    socket.emit("enemyHit", enemyId);
}
```

## Networking

## Task runner

## Testing

## Disclaimer

Assets being used on this proof of concept are property of their owners: *id Software*. The only purpose is to learn about networking, I'm not trying to sell anything. Thanks for all the inspiration, *id Software*: John Romero, John Carmack, Adrian Carmack, Kevin Cloud, Tom Hall, Sandy Petersen, Shawn Green, Robert Prince.
