// Dependencies
var pathManager = require("./pathManager.js");
var gulp = require("gulp");
var clean = require("gulp-clean");
var jshint = require("gulp-jshint");
var shell = require("gulp-shell");
var preprocess = require("gulp-preprocess");
var nodemon = require("gulp-nodemon");
var runSequence = require("run-sequence");
var mocha = require("gulp-mocha");

// Environment
var environment = {
	development: "development",
	production: "production"
};
var currentEnvironment = process.env.NODE_ENV === environment.production ? environment.production : environment.development;

// Clean
gulp.task("clean", function () {
    return gulp.src(pathManager.PUBLIC_BUILD, { read: false })
        .pipe(clean());
});

// Copy to build directory
gulp.task("copy", function () {
	gulp.src([pathManager.PUBLIC_ASSETS + "/**/*.*"]).pipe(gulp.dest(pathManager.PUBLIC_BUILD + "/assets"));
	gulp.src([pathManager.PUBLIC_CSS + "/**/*.*"]).pipe(gulp.dest(pathManager.PUBLIC_BUILD + "/css"));

	if (currentEnvironment != environment.production) {
		gulp.src([pathManager.PUBLIC_LIB + "/**/*.*"]).pipe(gulp.dest(pathManager.PUBLIC_BUILD + "/lib"));
		gulp.src([pathManager.PUBLIC_SCRIPTS + "/**/*.js"]).pipe(gulp.dest(pathManager.PUBLIC_BUILD + "/scripts"));
	} else {
		gulp.src([pathManager.PUBLIC_LIB + "/requirejs/require.js"]).pipe(gulp.dest(pathManager.PUBLIC_BUILD + "/lib/requirejs"));
	}
});

// Runs the r.js command
gulp.task("scripts", shell.task("r.js -o public/scripts/build.js"));

// HTML preprocessor
gulp.task("html", function () {
	gulp.src(pathManager.PUBLIC + "/index.html")
		.pipe(preprocess({ context: { NODE_ENV: currentEnvironment } }))
		.pipe(gulp.dest(pathManager.PUBLIC_BUILD));
});

// Starts node server
gulp.task("server", function () {
	nodemon({
		script: pathManager.BASE + "/server.js",
		watch: [
			pathManager.BASE + "/*.js"
		],
		ignore: [
			pathManager.PUBLIC + "/**/*.*",
			pathManager.TEST + "/**/*.js"
		]
	});
});

// Watch
gulp.task("watch", function () {
	gulp.watch([
		pathManager.BASE + "/*.js",
		pathManager.TEST + "/**/*.js",
		pathManager.PUBLIC + "/**/*.*",
		"!" + pathManager.PUBLIC_BUILD + "/**/*.*"
	], function () {
		runSequence("copy", "html", "lint", "test");
	});
});

// Lint
gulp.task("lint", function () {
	return gulp.src([
		pathManager.BASE + "/*.js",
		pathManager.PUBLIC_SCRIPTS + "/**/*.js",
		"!" + pathManager.PUBLIC_SCRIPTS + "/build.js",
		"!" + pathManager.PUBLIC_BUILD + "/main-built.js",
	])
	.pipe(jshint())
	.pipe(jshint.reporter("default"));
});

// Tests with mocha
gulp.task("test", function () {
	gulp.src(pathManager.TEST + "/**/*.js")
		.pipe(mocha());
});

// Environment tasks
gulp.task("development", function () {
	runSequence("clean", "copy", "html", ["server", "watch"]);
});
gulp.task("production", function () {
	runSequence("clean", "copy", "scripts", "html");
});
gulp.task("default", [currentEnvironment]);