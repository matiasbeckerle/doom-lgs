/**
 * The UI manager that handles the interactions between the game and the rendered DOM.
 */
define([], function () {
	var playersQuantity = document.getElementById("playersQuantity");
	var gameContainer = document.getElementById("gameContainer");
	var game = document.getElementById("game");
	var loading = document.getElementById("loading");

	var updatePlayersQuantity = function (quantity) {
		playersQuantity.innerHTML = quantity;
	};
	
	/**
	 * Hides the loading indicator and shows the game elements.
	 */
	var showGame = function () {
		loading.className = "hide";
		gameContainer.className = "";
	};
	
	/**
	 * Sets wait cursor because the player isn't able to shoot.
	 */
	var reloadingGun = function () {
		game.className = "reloading";
	};
	
	/**
	 * The player is able to shoot again.
	 */
	var gunReady = function () {
		game.className = "";
	};

	return {
		updatePlayersQuantity: updatePlayersQuantity,
		showGame: showGame,
		reloadingGun: reloadingGun,
		gunReady: gunReady
	};
});
