var expect = require("chai").expect;
var gameManager = require("../server/gameManager.js");

describe("GameManager", function () {

	beforeEach(function () {
		gameManager.start();
	});
	
	describe("#addPlayer()", function () {
		it("should increase the quantity of players", function () {
			// Act
			gameManager.addPlayer();
			gameManager.addPlayer();
			var snapshot = gameManager.getCurrentSnapshot();
			
			// Assert
			expect(snapshot.players).to.equal(2);
		});
	});
	
	describe("#removePlayer()", function () {
		it("should decrease the quantity of players", function () {
			// Arrange
			gameManager.addPlayer();
			gameManager.addPlayer();
			
			// Act
			gameManager.removePlayer();
			var snapshot = gameManager.getCurrentSnapshot();
			
			// Assert
			expect(snapshot.players).to.equal(1);
		});
	});
});