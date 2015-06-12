var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);
var gameManager = require("../../server/gameManager.js");

describe("GameManager", function () {
	
	describe("#start()", function () {
		it("should instantiate two ticks", function (done) {
			// Arrange
			sinon.spy(global, "setInterval");
			
			// Act
			gameManager.start();
			
			// Assert
			expect(global.setInterval).to.have.been.calledTwice;
			
			// Free
			global.setInterval.restore();
			done();
		});
	});
	
	describe("#start()", function () {
		it("should reset the snapshot", function () {
			// Act
			gameManager.start();
			var snapshot = gameManager.getCurrentSnapshot();
			
			// Assert
			expect(snapshot.dirty).to.be.false;
			expect(snapshot.players).to.equal(0);
			expect(snapshot.enemies).to.eql({});
		});
	});
	
	describe("#addPlayer()", function () {
		it("should increase the quantity of players", function () {
			// Act
			gameManager.start();
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
			gameManager.start();
			gameManager.addPlayer();
			gameManager.addPlayer();
			
			// Act
			gameManager.removePlayer();
			var snapshot = gameManager.getCurrentSnapshot();
			
			// Assert
			expect(snapshot.players).to.equal(1);
		});
	});
	
	describe("#hitsEnemy()", function () {
		it("should...", function () {
			// Arrange
			var clock = sinon.useFakeTimers();
			gameManager.start();
			clock.tick(9000); // Simulates 9 seconds so we have 3 enemies instantiated
			
			// Act
			gameManager.hitsEnemy("EnemyN-1"); // Hit one of three
			var snapshot = gameManager.getCurrentSnapshot();
			
			// Assert
			expect(Object.keys(snapshot.enemies).length).to.equal(2); // 2 enemies left
		});
	});
	
	describe("#onUpdate()", function () {
		it("should be defined for overriding", function () {
			// Assert
			expect(gameManager.onUpdate).to.not.be.undefined;
		});
	});
	
});