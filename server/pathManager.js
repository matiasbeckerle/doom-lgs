var PathManager = (function () {
	
	var BASE = ".";
	var PUBLIC = BASE + "/public";
	
	return {
		BASE: BASE,
		SERVER: BASE + "/server",
		PUBLIC: PUBLIC,
		PUBLIC_ASSETS: PUBLIC + "/assets",
		PUBLIC_BUILD: PUBLIC + "/build",
		PUBLIC_CSS: PUBLIC + "/css",
		PUBLIC_LIB: PUBLIC + "/lib",
		PUBLIC_SCRIPTS: PUBLIC + "/scripts",
		TEST: BASE + "/test"
	};
	
})();
module.exports = PathManager;