/**
 * Our socket reference
 */
var socket = io();

/**
 * The Networking manager to handle the interaction with the server.
 */
var Networking = (function (params) {

	// The server recognizes us and provides the current game state
	socket.on("start", function (gameState) {
		Game.updateState(gameState);
	});
	
	// The server recognizes us and provides the current game state
	socket.on("playersChange", function (quantity) {
		UI.updatePlayersQuantity(quantity);
	});

	// An enemy was killed
	socket.on("enemyKilled", function (enemyId) {
		Game.killEnemy(enemyId);
	});

	// An enemy needs to be spawned
	socket.on("spawnEnemy", function (enemyN) {
		Game.spawnEnemy(enemyN);
	});

	// Communicate to the server that  enemy
	function onEnemyHit(enemyId) {
		socket.emit("enemyHit", enemyId);
	};

	return {
		onEnemyHit: onEnemyHit
	};

})();