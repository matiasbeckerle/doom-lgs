/**
 * The UI manager that handles the interactions between the game and the rendered DOM.
 */
define([], function () {
	var playersQuantity = document.getElementById("playersQuantity");
	var gameContainer = document.getElementById("gameContainer");
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

	return {
		updatePlayersQuantity: updatePlayersQuantity,
		showGame: showGame
	};
});
