var expect = require("chai").expect;
var pathManager = require("../server/pathManager.js");

describe("PathManager", function () {
	
	describe("BASE", function () {
		it("should be the path for root directory", function () {
			// Assert
			expect(pathManager.BASE).to.equal(".");
		});
	});
	
	describe("SERVER", function () {
		it("should be the path for 'server' directory", function () {
			// Assert
			expect(pathManager.SERVER).to.equal("./server");
		});
	});
	
	describe("PUBLIC", function () {
		it("should be the path for 'public' directory", function () {
			// Assert
			expect(pathManager.PUBLIC).to.equal("./public");
		});
	});
	
	describe("PUBLIC_ASSETS", function () {
		it("should be the path for public 'assets' directory", function () {
			// Assert
			expect(pathManager.PUBLIC_ASSETS).to.equal("./public/assets");
		});
	});
	
	describe("PUBLIC_BUILD", function () {
		it("should be the path for public 'build' directory", function () {
			// Assert
			expect(pathManager.PUBLIC_BUILD).to.equal("./public/build");
		});
	});
	
	describe("PUBLIC_CSS", function () {
		it("should be the path for public 'css' directory", function () {
			// Assert
			expect(pathManager.PUBLIC_CSS).to.equal("./public/css");
		});
	});
	
	describe("PUBLIC_LIB", function () {
		it("should be the path for public 'lib' directory", function () {
			// Assert
			expect(pathManager.PUBLIC_LIB).to.equal("./public/lib");
		});
	});
	
	describe("PUBLIC_SCRIPTS", function () {
		it("should be the path for public 'scripts' directory", function () {
			// Assert
			expect(pathManager.PUBLIC_SCRIPTS).to.equal("./public/scripts");
		});
	});
	
	describe("TEST", function () {
		it("should be the path for 'test' directory", function () {
			// Assert
			expect(pathManager.TEST).to.equal("./test");
		});
	});
	
});