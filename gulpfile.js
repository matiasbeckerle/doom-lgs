// Dependencies
var gulp = require("gulp");
var clean = require("gulp-clean");
var jshint = require("gulp-jshint");
var shell = require("gulp-shell");
var preprocess = require("gulp-preprocess");

// Environment
var environment = {
	development: "development",
	production: "production"
};
var currentEnvironment = process.env.NODE_ENV === environment.production ? environment.production : environment.development;

// Clean
gulp.task("clean", function () {
    return gulp.src("./public/build", {read: false})
        .pipe(clean());
});

// Lint
gulp.task("lint", ["clean"], function() {
	return gulp.src([
			"./server.js",
			"./gameManager.js",
			"./public/scripts/**/*.js",
			"!./public/scripts/build.js",
			"!./public/build/main-built.js",
		])
		.pipe(jshint())
		.pipe(jshint.reporter("default"));
});

// Runs the r.js command
gulp.task("scripts", ["clean"], shell.task([currentEnvironment == environment.production ? "r.js -o public/scripts/build.js" : "r.js.cmd -o public/scripts/build.js"]));

// Copy to build directory
gulp.task("copy", ["clean"], function(){
	gulp.src(["./public/assets/**/*.*"]).pipe(gulp.dest("./public/build/assets"));
	gulp.src(["./public/css/**/*.*"]).pipe(gulp.dest("./public/build/css"));
	
	if (currentEnvironment != environment.production) {
		gulp.src(["./public/lib/**/*.*"]).pipe(gulp.dest("./public/build/lib"));
		gulp.src(["./public/scripts/**/*.*"]).pipe(gulp.dest("./public/build/scripts"));
	} else {
		gulp.src(["./public/lib/requirejs/require.js"]).pipe(gulp.dest("./public/build/lib/requirejs"));
	}
});

// HTML preprocessor
gulp.task("html", ["clean", "copy"], function() {
	gulp.src("./public/index.html")
    	.pipe(preprocess({context: { NODE_ENV: currentEnvironment }}))
    	.pipe(gulp.dest("./public/build"))
});

// Environment tasks
gulp.task("development", ["clean", "lint", "copy", "html"]);
gulp.task("production", ["clean", "scripts", "copy", "html"]);
gulp.task("default", [currentEnvironment]);