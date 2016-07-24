// dependencies
var del = require('del');
var watchify = require('watchify');

// gulp dependencies
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var connect = require('gulp-connect');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var watch = require('gulp-watch');

var watchLocations = {
  sass: './sass/**/*.scss',
  template: './index.html'
};

var destLocations = {
  sass: './css'
};

/* ERROR HANDLER */
var onError = function(err) {
  gutil.log(gutil.colors.red('ERROR', err.plugin), err.message);
  gutil.beep();
  new gutil.PluginError(err.plugin, err, {showStack: true});
};

/* CLEAN */
gulp.task('clean', function(cb) {
  return del(['css'], cb);
});

/* SASS */
gulp.task('sass', function() {
  gulp.src('./sass/**/*.scss')
      .pipe(plumber())
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(gulp.dest('./css'))
      .pipe(connect.reload());
});

gulp.task('sass:watch', function() {
  watch(watchLocations.sass, function() {
    gulp.start('sass');
  });
});

gulp.task('template:watch', function() {
  watch(watchLocations.template, function() {
    gulp.src('./index.html')
        .pipe(connect.reload());
  });
});

/* SERVER */
gulp.task('server', function() {
  connect.server({
    root: './',
    port: 5000,
    livereload: true
  });
});

/* MAIN TASKS */
gulp.task('dev', ['clean'], function() {
  gulp.start('sass');
  gulp.start('sass:watch');
  gulp.start('template:watch');
  gulp.start('server');
});
