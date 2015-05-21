var _ = require("underscore");

var GameManager = (function () {

	var tickState;
	var tickGame;

	// The whole game picture
	var state = {
		dirty: false,
		players: 0,
		enemies: {}
	};

	/**
	 * Starts a game iteration keeping two different ticks:
	 *  - State will notify our clients about the current game state.
	 *  - Game will keep alive our game creating enemies, etc.
	 */
	var start = function () {
		tickState = setInterval(updateState, 200);
		tickGame = setInterval(updateGame, 3000);
	};

	var addPlayer = function () {
		state.players++;
		state.dirty = true;
	};

	var removePlayer = function () {
		state.players--;
		state.dirty = true;
	};

	var onEnemyHit = function (enemyId) {
		// Is still alive?
        if (state.enemies[enemyId]) {
            freeSpawnPosition(state.enemies[enemyId].position);
            delete state.enemies[enemyId];
            state.dirty = true;
        }
	};
	
	/**
	 * Sends a picture of the current game state to our clients.
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
	 * Creates a new enemy and share it to the whole world
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
	 * Includes a free spawn position after enemy kill.
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