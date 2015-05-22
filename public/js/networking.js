// The socket reference
var socket = io();

/**
 * The Networking manager that handles the interaction with the server.
 */
var Networking = (function () {

	// The server send us an update of the current game state
	socket.on("update", function (updatedServerSnapshot) {
		// Check for changes
		if(updatedServerSnapshot.dirty) {
			Game.update(updatedServerSnapshot);
		}
	});

	/**
	 * Communicate to the server that an enemy has been hit.
	 */
	function onEnemyHit(enemyId) {
		socket.emit("enemyHit", enemyId);
	}

	return {
		onEnemyHit: onEnemyHit
	};

})();