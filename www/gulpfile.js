var gulp = require("gulp");

var concat = require("gulp-concat");
var del = require("del");
var jshint = require("gulp-jshint");
var karma = require("karma");
var rename = require("gulp-rename");
var rimraf = require("gulp-rimraf");
var uglify = require("gulp-uglify");

var Server = karma.Server;

gulp.task("clean", function () {
  return del([
    // Delete site...
    "./dist/site-scripts.js",
    "./dist/site.html",
    // Delete app...
    "./dist/app-scripts.js",
    "./dist/app.html"
  ]);
});

gulp.task("copy", function () {
  // Copy site to dist...
  gulp.src("./site/src/site.html")
    .pipe(gulp.dest("./dist"));

  // Copy app to dist...
  gulp.src("./app/src/app.html")
    .pipe(gulp.dest("./dist"));
});

gulp.task("scripts", ["clean", "copy"], function () {
  // Create site scripts...
  gulp.src("./site/src/**/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("default"))
    //.pipe(concat("scripts.min.js"))
    //.pipe(uglify())
    .pipe(concat("site-scripts.js"))
    .pipe(gulp.dest("./dist"));

  // Create app scripts...
  gulp.src("./app/src/**/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("default"))
    //.pipe(concat("scripts.min.js"))
    //.pipe(uglify())
    .pipe(concat("app-scripts.js"))
    .pipe(gulp.dest("./dist"));
});

/*gulp.task("test", function (done) {
  new Server({
    configFile: __dirname + "/karma.conf.js",
    singleRun: true
  }, done).start();
});*/

gulp.task("default", ["scripts"]);
//gulp.task("default", ["scripts", "test"]);