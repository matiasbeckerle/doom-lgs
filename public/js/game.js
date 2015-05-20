var Game = (function () {
	
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

	// The server picture of the entire game
	var state = {};
	
	// Local reference for enemies
	var enemies = {};

	// Where the game begins!
	var start = function () {
		document.body.appendChild(renderer.view);
		
		// Start animating
		animate();
	};
	
	// Save the current server picture
	var updateState = function (gameState) {
		state = gameState;

		// Instantiate all the enemies already present in the game
		for (var enemyId in state.enemies) {
			spawnEnemy(state.enemies[enemyId]);
		}
	};

	// Creates and instantiate an enemy in the scene
	var spawnEnemy = function (enemyN) {
		var enemy = new Enemy(enemyN);

		// Attach onHit event
		enemy.onHit = function (event) {
			Networking.onEnemyHit(enemy.id);
		};

		// Add it to the scene
		scene.addChild(enemy.sprite);

		// Keep a local reference
		enemies[enemy.id] = enemy;
	};
	
	var killEnemy = function (enemyId) {
		scene.removeChild(enemies[enemyId].sprite);
		delete enemies[enemyId];
	};
	
	function onSceneHit() {
		audio.fire.play();
	}

	function animate() {
		requestAnimationFrame(animate);

		// Render the container
		renderer.render(scene);
	}

	return {
		start: start,
		updateState: updateState,
		spawnEnemy: spawnEnemy,
		killEnemy: killEnemy
	};

})();

Game.start();