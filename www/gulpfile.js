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
  return del(["./app/dist/scripts.js"]);
});

gulp.task("scripts", ["clean"], function () {
  gulp.src("./app/src/**/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("default"))
    //.pipe(concat("scripts.min.js"))
    //.pipe(uglify())
    .pipe(concat("scripts.js"))
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