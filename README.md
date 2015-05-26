# DoomLGS

A multiplayer Node.js light gun shooter inspired on Doom. This is a proof of concept for a server/client game.

## Play

Currently available for play in [heroku](https://doom-lgs.herokuapp.com).

## Server

Runs on a [Node.js](https://nodejs.org) server and uses [socket.io](http://socket.io) library for communication. Sends snapshots of the game state to all the connected players several times per second, using a small structure to identify uniquely each instance of the game objects.

## Client

Uses [Pixi.js](http://www.pixijs.com) as a game engine and [socket.io](http://socket.io) library for communication. Consumes the snapshots provided by the server and handles all the game objects (populated with the game engine information) in the scene.

## Disclaimer

Assets being used on this proof of concept are property of their owners: *id Software*. The only purpose is to learn about networking, I'm not trying to sell anything. Thanks for all the inspiration, *id Software*: John Romero, John Carmack, Adrian Carmack, Kevin Cloud, Tom Hall, Sandy Petersen, Shawn Green, Robert Prince.
