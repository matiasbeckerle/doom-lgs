/**
 * The Networking manager that handles the interaction with the server.
 */
define(["io"], function (io) {
	
	var Networking = (function () {
		// The socket reference
		var socket = io();
		
		// The server send us an update of the current game state
		socket.on("update", function (updatedServerSnapshot) {
			// Check for changes
			if (updatedServerSnapshot.dirty) {
				Networking.update(updatedServerSnapshot);
			}
		});
	
		/**
		 * Communicate to the server that an enemy has been hit.
		 */
		function enemyHit(enemyId) {
			socket.emit("enemyHit", enemyId);
		}
	
		return {
			enemyHit: enemyHit,
			update: function (updatedServerSnapshot) {}
		};
	})();
	
	return Networking;
});
