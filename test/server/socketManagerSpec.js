var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

var socketio = require("socket.io");
var socketManager = require("../../server/socketManager.js");

describe("SocketManager", function () {

	var ioMock = {
		sockets: {
			on: sinon.spy()
		},
		emit: sinon.spy()
	};

	beforeEach(function (done) {
		sinon.stub(socketio, "listen", function () {
			return ioMock;
		});
		done();
	});

	afterEach(function (done) {
		socketio.listen.restore();
		done();
	});

	describe("#listen()", function () {
		it("should starts to listen using socket.io and bind on connection", function () {
			// Act
			var http = { example: true };
			socketManager.listen(http);
			
			// Assert
			expect(socketio.listen).to.have.been.calledOnce;
			expect(socketio.listen).to.have.been.calledWith(http);
			expect(ioMock.sockets.on).to.have.been.called;
		});
	});

	describe("#sendUpdate()", function () {
		it("should emit a message with the current snapshot", function () {
			// Arrange
			socketManager.listen({});
			var snapshot = { example: true };
			
			// Act
			socketManager.sendUpdate(snapshot);
			
			// Assert
			expect(ioMock.emit).to.have.been.calledOnce;
			expect(ioMock.emit).to.have.been.calledWith("update", snapshot);
		});
	});

	describe("#onAddClient()", function () {
		it("should be defined for overriding", function () {
			// Assert
			expect(socketManager.onAddClient).to.not.be.undefined;
		});
	});

	describe("#onRemoveClient()", function () {
		it("should be defined for overriding", function () {
			// Assert
			expect(socketManager.onRemoveClient).to.not.be.undefined;
		});
	});

	describe("#onEnemyHit()", function () {
		it("should be defined for overriding", function () {
			// Assert
			expect(socketManager.onEnemyHit).to.not.be.undefined;
		});
	});
});