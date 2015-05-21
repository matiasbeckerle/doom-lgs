/**
 * Our socket reference
 */
var socket = io();

/**
 * The Networking manager to handle the interaction with the server.
 */
var Networking = (function (params) {

	// The server send us an update of the current game state
	socket.on("update", function (gameState) {
		// Check for changes
		if(gameState.dirty) {
			Game.updateState(gameState);
		}
	});

	// Communicate to the server that  enemy
	function onEnemyHit(enemyId) {
		socket.emit("enemyHit", enemyId);
	};

	return {
		onEnemyHit: onEnemyHit
	};

})();