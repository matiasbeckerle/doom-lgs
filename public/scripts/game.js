define(["underscore", "pixi", "ui", "networking", "enemy"], function (_, PIXI, UI, Networking, Enemy) {

	// Audio references for playback
	var audio = {
		fire: document.getElementById("audioFire")
	};

	var background = PIXI.Sprite.fromImage("/assets/background.jpg");

	var renderer = PIXI.autoDetectRenderer(800, 600, {
		backgroundColor: 0x1099bb
	});
	
	// Create the root of the scene graph
	var scene = new PIXI.Container();
	scene.addChild(background);
	scene.interactive = true;
	scene.on("mousedown", onSceneHit);
    scene.on("touchstart", onSceneHit);

	// The entire game state based on server
	var serverSnapshot = {};
	
	// Local reference for enemies
	var enemies = {};

	// Where the game begins!
	var start = function () {
		document.body.appendChild(renderer.view);
		
		// Start animating
		animate();
	};
	
	/**
	 * Update the game based on the last server snapshot.
	 */
	function update (updatedServerSnapshot) {
		// Save the new snapshot
		serverSnapshot = updatedServerSnapshot;

		UI.updatePlayersQuantity(serverSnapshot.players);

		var serverEnemies = _.keys(serverSnapshot.enemies);
		var localEnemies = _.keys(enemies);
		var enemiesToSpawn = _.difference(serverEnemies, localEnemies);
		var enemiesToKill = _.difference(localEnemies, serverEnemies);

		for (var i = 0; i < enemiesToKill.length; i++) {
			killEnemy(enemiesToKill[i]);
		}

		for (var i = 0; i < enemiesToSpawn.length; i++) {
			spawnEnemy(serverSnapshot.enemies[enemiesToSpawn[i]]);
		}
	}
	
	// Listen for updates
	Networking.update = function (updatedServerSnapshot) {
		update(updatedServerSnapshot);
	};

	/**
	 * Creates and instantiate an enemy in the scene.
	 * @param {EnemyN} enemyN The networking-related enemy object.
	 */
	function spawnEnemy(enemyN) {
		var enemy = new Enemy(enemyN);

		// Attach onHit event
		enemy.onHit = function (event) {
			Networking.enemyHit(enemy.id);
			
			// Local delete. This should be interpolated when the server sends the next snapshot.
			killEnemy(enemy.id);
		};

		// Keep a local reference
		enemies[enemy.id] = enemy;

		// Add it to the scene
		scene.addChild(enemy.sprite);
	}

	/**
	 * Removes an enemy from the scene and our local reference.
	 */
	function killEnemy(enemyId) {
		if (enemies[enemyId]) {
			scene.removeChild(enemies[enemyId].sprite);
			delete enemies[enemyId];
		}
	}

	/**
	 * A player hits the scene. In this game represents shooting. 
	 */
	function onSceneHit() {
		audio.fire.play();
	}

	/**
	 * Pixi.js cycle.
	 */
	function animate() {
		requestAnimationFrame(animate);

		// Render the container
		renderer.render(scene);
	}

	return {
		start: start
	};

});
