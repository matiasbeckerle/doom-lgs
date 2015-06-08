var socketio = require("socket.io");
var io;

var SocketManager = (function () {
	
	// To keep track of clients
	var clients = [];

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
	
	/**
	 * Sends an update to connected clients.
	 * @param {Snapshot} snapshot The current game status.
	 */
	var sendUpdate = function (snapshot) {
		io.emit("update", snapshot);
	};
	
	/**
	 * Adds a client in the list.
	 * @param {Socket} socket The recently connected client.
	 */
	function addClient(socket) {
		clients.push(socket);
		SocketManager.onAddClient();
	}

	/**
	 * Removes a client from the list.
	 * @param {Socket} socket The disconnected client.
	 */
	function removeClient(socket) {
		delete clients[clients.indexOf(socket)];
		SocketManager.onRemoveClient();
	}

	return {
		listen: listen,
		sendUpdate: sendUpdate,
		onAddClient: function () { },
		onRemoveClient: function () { },
		onEnemyHit: function (enemyId) { }
	};

})();
module.exports = SocketManager;