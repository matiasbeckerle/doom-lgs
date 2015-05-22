// Required modules
var _ = require("underscore");

var GameManager = (function () {

	var tickState; // Handles updates interval with the players
	var tickGame; // Handles the game interval

	// The whole game snapshot
	var state = {
		dirty: false,
		players: 0,
		enemies: {}
	};

	/**
	 * Starts a game iteration keeping two different ticks:
	 *  - State will notify our players about the current game state.
	 *  - Game will keep alive our game creating enemies, etc.
	 */
	var start = function () {
		tickState = setInterval(updateState, 100);
		tickGame = setInterval(updateGame, 3000);
	};

	/**
	 * Adds a player to the game.
	 */
	var addPlayer = function () {
		state.players++;
		state.dirty = true;
	};

	/**
	 * Removes a player from the game.
	 */
	var removePlayer = function () {
		state.players--;
		state.dirty = true;
	};

	/**
	 * A player has hit an enemy.
	 * In an authoritative server this needs some kind of verification to ensure player actions are valid.
	 */
	var onEnemyHit = function (enemyId) {
		// Is still alive?
        if (state.enemies[enemyId]) {
            freeSpawnPosition(state.enemies[enemyId].position);
            delete state.enemies[enemyId];
            state.dirty = true;
        }
	};
	
	/**
	 * Sends a snapshot of the current game state to our players.
	 */
	function updateState() {
		if (GameManager.onUpdate) {
			GameManager.onUpdate(state);
			state.dirty = false;
		}
	}
	
	/**
	 * Keeps alive our game creating enemies, etc.
	 */
	function updateGame() {
		if (Object.keys(state.enemies).length < spawnPositions.length) {
			spawnEnemy();
		}
	}
	
	/**
	 * Creates a new enemy and share it to the whole world.
	 */
	function spawnEnemy() {
		var enemyN = new EnemyN();
		state.enemies[enemyN.id] = enemyN;
		state.dirty = true;
	}

	/**
	 * Pre-defined spawn positions.
	 */
	var spawnPositions = [
		{ x: 100, y: 310 },
		{ x: 200, y: 310 },
		{ x: 400, y: 300 },
		{ x: 500, y: 310 },
		{ x: 600, y: 310 },
		{ x: 700, y: 310 }
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
	 * Frees a spawn position after enemy kill.
	 */
	function freeSpawnPosition(position) {
		availableSpawnPositions.push(position);
	}

	return {
		state: state,
		addPlayer: addPlayer,
		removePlayer: removePlayer,
		start: start,
		onEnemyHit: onEnemyHit
	};

})();
module.exports = GameManager;