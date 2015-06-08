var PathManager = (function () {
	
	var self = this;
	
	self.BASE = ".";
	self.PUBLIC = self.BASE + "/public";
	
	return {
		BASE: self.BASE,
		PUBLIC: self.PUBLIC,
		PUBLIC_ASSETS: self.PUBLIC + "/assets",
		PUBLIC_BUILD: self.PUBLIC + "/build",
		PUBLIC_CSS: self.PUBLIC + "/css",
		PUBLIC_LIB: self.PUBLIC + "/lib",
		PUBLIC_SCRIPTS: self.PUBLIC + "/scripts",
		TEST: self.BASE + "/test"
	};
	
})();
module.exports = PathManager;