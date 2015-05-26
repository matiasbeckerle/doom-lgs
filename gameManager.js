// Required modules
var _ = require("underscore");

var GameManager = (function () {

	var tickSnapshot; // Handles updates interval with the players
	var tickGame; // Handles the game interval

	// The whole game snapshot
	var snapshot = {
		dirty: false,
		players: 0,
		enemies: {}
	};

	/**
	 * Starts a game iteration keeping two different ticks:
	 *  - Snapshot will notify our players about the current game state.
	 *  - Game will keep alive our game creating enemies, etc.
	 */
	var start = function () {
		tickSnapshot = setInterval(updateSnapshot, 100);
		tickGame = setInterval(updateGame, 3000);
	};

	/**
	 * Adds a player to the game.
	 */
	var addPlayer = function () {
		snapshot.players++;
		snapshot.dirty = true;
	};

	/**
	 * Removes a player from the game.
	 */
	var removePlayer = function () {
		snapshot.players--;
		snapshot.dirty = true;
	};

	/**
	 * A player has hit an enemy.
	 * In an authoritative server this needs some kind of verification to ensure player actions are valid.
	 */
	var onEnemyHit = function (enemyId) {
		// Is still alive?
        if (snapshot.enemies[enemyId]) {
            freeSpawnPosition(snapshot.enemies[enemyId].position);
            delete snapshot.enemies[enemyId];
            snapshot.dirty = true;
        }
	};
	
	/**
	 * Sends a snapshot of the current game state to our players.
	 */
	function updateSnapshot() {
		GameManager.onUpdate(snapshot);
		snapshot.dirty = false;
	}
	
	/**
	 * Keeps alive our game creating enemies, etc.
	 */
	function updateGame() {
		if (Object.keys(snapshot.enemies).length < spawnPositions.length) {
			spawnEnemy();
		}
	}
	
	/**
	 * Creates a new enemy and share it to the whole world.
	 */
	function spawnEnemy() {
		var enemyN = new EnemyN();
		snapshot.enemies[enemyN.id] = enemyN;
		snapshot.dirty = true;
	}

	/**
	 * Pre-defined spawn positions.
	 */
	var spawnPositions = [
		{ x: 35, y: 195 },
		{ x: 105, y: 200 },
		{ x: 200, y: 210 },
		{ x: 410, y: 190 },
		{ x: 500, y: 200 },
		{ x: 605, y: 200 }
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
	 * Frees a spawn position after enemy kill.
	 */
	function freeSpawnPosition(position) {
		availableSpawnPositions.push(position);
	}

	return {
		addPlayer: addPlayer,
		removePlayer: removePlayer,
		start: start,
		onEnemyHit: onEnemyHit,
		onUpdate: function () {}
	};

})();
module.exports = GameManager;