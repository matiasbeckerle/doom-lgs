var requirejs = require("requirejs");
var expect = require("chai").expect;

requirejs.config({
    baseUrl: "./public/scripts",
    nodeRequire: require,
    paths: {
		"squirejs": "../../node_modules/squirejs/src/Squire"
    }
});

var Squire = requirejs("squirejs");

describe("Enemy", function () {

	var injector;
	var Enemy;
    var pixiMock = {
        Sprite: function () { 
            return {
                scale: { x: 0, y: 0 },
                anchor: { x: 0, y: 0 },
                position: { x: 0, y: 0 },
                interactive: false,
                on: function () {}
            };
        },
        loader: {
            resources: {
                soldier: {
                    texture: ""
                }
            }
        }
    };

	beforeEach(function (done) {
		injector = new Squire();
		injector
			.mock("pixi", pixiMock)
			.require(["enemy"], function (enemy) {
			Enemy = enemy;
			done();
		});
	});

	describe("constructor", function () {
		it("should be able to create a new instance with server instructions", function () {
            // Act
            var enemy = new Enemy({ 
                id: 123,
                position: {
                    x: 5,
                    y: 6
                }
            });
            
            // Assert
            expect(enemy.id).to.equal(123);
            expect(enemy.sprite.position.x).to.equal(5);
            expect(enemy.sprite.position.y).to.equal(6);
		});
        
        it("should be able to create a new instance and set scale, anchor and interactive properties", function () {
            // Act
            var enemy = new Enemy({ 
                id: 123,
                position: {
                    x: 5,
                    y: 6
                }
            });
            
            // Assert
            expect(enemy.sprite.scale.x).to.equal(1.5);
            expect(enemy.sprite.scale.y).to.equal(1.5);
            expect(enemy.sprite.anchor.x).to.equal(0.5);
            expect(enemy.sprite.anchor.y).to.equal(0.5);
            expect(enemy.sprite.interactive).to.be.true;
		});
	});

});