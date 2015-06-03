// Dependencies
var gulp = require("gulp");
var clean = require("gulp-clean");
var jshint = require("gulp-jshint");
var shell = require("gulp-shell");
var preprocess = require("gulp-preprocess");
var nodemon = require("gulp-nodemon");
var runSequence = require("run-sequence");

// Environment
var environment = {
	development: "development",
	production: "production"
};
var currentEnvironment = process.env.NODE_ENV === environment.production ? environment.production : environment.development;

// Clean
gulp.task("clean", function () {
    return gulp.src("./public/build", { read: false })
        .pipe(clean());
});

// Copy to build directory
gulp.task("copy", function () {
	gulp.src(["./public/assets/**/*.*"]).pipe(gulp.dest("./public/build/assets"));
	gulp.src(["./public/css/**/*.*"]).pipe(gulp.dest("./public/build/css"));

	if (currentEnvironment != environment.production) {
		gulp.src(["./public/lib/**/*.*"]).pipe(gulp.dest("./public/build/lib"));
		gulp.src(["./public/scripts/**/*.*"]).pipe(gulp.dest("./public/build/scripts"));
	} else {
		gulp.src(["./public/lib/requirejs/require.js"]).pipe(gulp.dest("./public/build/lib/requirejs"));
	}
});

// Runs the r.js command
gulp.task("scripts", shell.task([currentEnvironment == environment.production ? "r.js -o public/scripts/build.js" : "r.js.cmd -o public/scripts/build.js"]));

// HTML preprocessor
gulp.task("html", function () {
	gulp.src("./public/index.html")
		.pipe(preprocess({ context: { NODE_ENV: currentEnvironment } }))
		.pipe(gulp.dest("./public/build"));
});

// Starts node server
gulp.task("server", function () {
	nodemon({
		script: "server.js",
		watch: [
			"server.js",
			"gameManager.js"
		],
		ignore: [
			"public/**/*.*"
		]
	});
});

// Watch
gulp.task("watch", function () {
	gulp.watch([
		"./server.js",
		"./gameManager.js",
		"./public/**/*.*",
		"!./public/build/**/*.*"
	], function () {
		runSequence("copy", "html", "lint");
	});
});

// Lint
gulp.task("lint", function () {
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

// Environment tasks
gulp.task("development", function () {
	runSequence("clean", "copy", "html", ["server", "watch"]);
});
gulp.task("production", function () {
	runSequence("clean", "copy", "scripts", "html");
});
gulp.task("default", [currentEnvironment]);