/**
 * The Networking manager that handles the interaction with the server.
 */
define(["io"], function (io) {
	
	var Networking = (function () {
		// The socket reference
		var socket = io();
		
		// Flag to force an update besides dirty or not
		var forceUpdate;
		
		// The server send us an update of the current game state
		socket.on("update", function (updatedServerSnapshot) {
			// Check for changes
			if (updatedServerSnapshot.dirty || forceUpdate) {
				Networking.update(updatedServerSnapshot);
				forceUpdate = false;
			}
		});
		
		var forceAnUpdate = function () {
			forceUpdate = true;
		};
	
		/**
		 * Communicate to the server that an enemy has been hit.
		 */
		function enemyHit(enemyId) {
			socket.emit("enemyHit", enemyId);
		}
	
		return {
			enemyHit: enemyHit,
			forceAnUpdate: forceAnUpdate,
			update: function (updatedServerSnapshot) {}
		};
	})();
	
	return Networking;
});
