define(["underscore", "pixi", "ui", "networking", "enemy"], function (_, PIXI, UI, Networking, Enemy) {

	// Audio references for playback
	var audio = {
		fire: document.getElementById("audioFire")
	};

	var renderer = PIXI.autoDetectRenderer(640, 400, {
		backgroundColor: 0x000000
	});
	
	// Create the root of the scene graph
	var scene = new PIXI.Container();
	scene.interactive = true;
	scene.on("mousedown", onSceneHit);
    scene.on("touchstart", onSceneHit);

	// The entire game state based on server
	var serverSnapshot = {};
	
	// Local reference for enemies
	var enemies = {};

	// To keep track of reloading time
	var reloadingGun = false;

	// Where the game begins!
	var start = function () {
		PIXI.loader
			.add("background", "/assets/e2m2.png")
			.add("soldier", "/assets/enemy.png")
			.load(onAssetsLoaded);
			
		// The game is deployed using a free Heroku account. Due to certain limitations,
		// I have to remove the connection after 10 minutes to avoid excessive consumption.
		setTimeout(function() {
			location.href = "http://www.heroku.com";
		}, 600000);
	};

	function onAssetsLoaded(loader, resources) {
		// Add scene background
		scene.addChild(new PIXI.Sprite(resources.background.texture));
		
		// Append the view
		document.getElementById("game").appendChild(renderer.view);
		
		// Everything ready, force the first update
		Networking.forceAnUpdate();
		
		// Listen for updates
		Networking.update = function (updatedServerSnapshot) {
			update(updatedServerSnapshot);
		};

		UI.showGame();

		// Start animating
		animate();
	}
	
	/**
	 * Update the game based on the last server snapshot.
	 */
	function update(updatedServerSnapshot) {
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

		for (var j = 0; j < enemiesToSpawn.length; j++) {
			spawnEnemy(serverSnapshot.enemies[enemiesToSpawn[j]]);
		}
	}

	/**
	 * Creates and instantiate an enemy in the scene.
	 * @param {EnemyN} enemyN The networking-related enemy object.
	 */
	function spawnEnemy(enemyN) {
		var enemy = new Enemy(enemyN);

		// Attach onHit event
		enemy.onHit = function (event) {
			if(!reloadingGun) {
				Networking.enemyHit(enemy.id);
					
				// Local delete. This should be interpolated when the server sends the next snapshot.
				killEnemy(enemy.id);
			}
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
		if (!reloadingGun) {
			reloadingGun = true;
			UI.reloadingGun();
			audio.fire.play();
			
			setTimeout(function () {
				UI.gunReady();
				reloadingGun = false;
			}, 1000);
		}
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
