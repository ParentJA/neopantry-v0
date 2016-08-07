var gulp = require("gulp");
var addStream = require("add-stream");
var angularTemplateCache = require("gulp-angular-templatecache");
var concat = require("gulp-concat");

function prepareAppTemplates() {
  // Compile templates and write to dist.
  return gulp.src(["./app/src/**/*.html", "!./app/src/index.html"])
    .pipe(angularTemplateCache());
}

function prepareSiteTemplates() {
  // Compile templates and write to dist.
  return gulp.src(["./site/src/**/*.html", "!./site/src/index.html"])
    .pipe(angularTemplateCache());
}

gulp.task("app", function () {
  // Copy index to dist.
  return gulp.src("./app/src/app.html")
    .pipe(gulp.dest("app/dist/"));
});

gulp.task("site", function () {
  // Copy index to dist.
  return gulp.src("./site/src/site.html")
    .pipe(gulp.dest("site/dist/"));
});

gulp.task("app-styles", function () {
  // Compile styles and write to dist.
  return gulp.src(["./app/src/**/*.css", "./app/src/styles.css"])
    .pipe(concat("./app-styles.css"))
    .pipe(gulp.dest("./app/dist/styles/"));
});

gulp.task("site-styles", function () {
  // Compile styles and write to dist.
  return gulp.src(["./site/src/**/*.css", "./site/src/styles.css"])
    .pipe(concat("./site-styles.css"))
    .pipe(gulp.dest("./site/dist/styles/"));
});

gulp.task("vendor-styles", function () {
  // Compile styles and write to dist.
  return gulp.src([
      "./bower_components/bootswatch/lumen/bootstrap.css",
      "./bower_components/angular-bootstrap/ui-bootstrap-csp.css",
      "./bower_components/font-awesome/css/font-awesome.css"
    ])
    .pipe(concat("./vendor-styles.css"))
    .pipe(gulp.dest("./app/dist/styles/"));
});

gulp.task("app-scripts", function () {
  // Compile scripts and write to dist.
  return gulp.src("./app/src/**/*.js")
    .pipe(addStream.obj(prepareAppTemplates()))
    .pipe(concat("./app-scripts.js"))
    .pipe(gulp.dest("./app/dist/scripts/"));
});

gulp.task("site-scripts", function () {
  // Compile scripts and write to dist.
  return gulp.src("./site/src/**/*.js")
    .pipe(addStream.obj(prepareSiteTemplates()))
    .pipe(concat("./site-scripts.js"))
    .pipe(gulp.dest("./site/dist/scripts/"));
});

gulp.task("vendor-scripts", function () {
  // Compile scripts and write to dist.
  return gulp.src([
      "./bower_components/jquery/dist/jquery.js",
      "./bower_components/bootstrap/dist/js/bootstrap.js",
      "./bower_components/lodash/lodash.js",
      "./bower_components/moment/moment.js",
      "./bower_components/angular/angular.js",
      "./bower_components/angular-animate/angular-animate.js",
      "./bower_components/angular-cookies/angular-cookies.js",
      "./bower_components/angular-sanitize/angular-sanitize.js",
      "./bower_components/angular-ui-router/release/angular-ui-router.js",
      "./bower_components/example-accounts/example-accounts.js",
      "./bower_components/angular-bootstrap/ui-bootstrap.js",
      "./bower_components/angular-bootstrap/ui-bootstrap-tpls.js"
    ])
    .pipe(concat("./vendor-scripts.js"))
    .pipe(gulp.dest("./app/dist/scripts/"));
});

gulp.task("vendor-fonts", function () {
  // Copy fonts to dist.
  return gulp.src(["./bower_components/font-awesome/fonts/fontawesome-webfont.*"])
    .pipe(gulp.dest("./app/dist/fonts/"));
});

gulp.task("default", [
  "app",
  "site",
  "app-styles",
  "site-styles",
  "vendor-styles",
  "app-scripts",
  "site-scripts",
  "vendor-scripts",
  "vendor-fonts"
]);