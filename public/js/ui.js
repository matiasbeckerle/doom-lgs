/**
 * The UI manager to handle the interactions between the game and the rendered DOM.
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