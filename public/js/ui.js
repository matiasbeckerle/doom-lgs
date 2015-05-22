/**
 * The UI manager that handles the interactions between the game and the rendered DOM.
 */
var UI = (function () {

	var playersQuantity = document.getElementById("playersQuantity");

	var updatePlayersQuantity = function (quantity) {
		playersQuantity.innerHTML = quantity;
	};

	return {
		updatePlayersQuantity: updatePlayersQuantity
	};

})();