var gulp = require('gulp');

// Loading Dependencies
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var browser = require('browser-sync');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var del = require('del');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var watchify = require('watchify');

// config variables
var isDev = false;
var isProduction = false;
var copyLocations = [
  {
    src: './src/assets/**/*.*',
    dest: './public/assets'
  },
  {
    src: './lib/**/*.js',
    dest: './public/lib'
  },
  {
    src: './src/*.html',
    dest: './public'
  }
];

var watchLocations = {
  sass: ['./src/sass/**/*.scss'],
  js: ['./src/js/*.js']
};

var destLocations = {
  sass: './public'
};

// error handling
var onError = function(err) {
  gutil.log(gutil.colors.red('ERROR', err.plugin), err.message);
  gutil.beep();
  new gutil.PluginError(err.plugin, err, {showStack: true});
  // this.emit('end');
};

// ////////////////////////////////////////////////
// CLEAN
// ////////////////////////////////////////////////
gulp.task('clean', function(cb) {
  del(['public/**/*'], cb);
});

// ////////////////////////////////////////////////
// COPY
// ////////////////////////////////////////////////
gulp.task('copy', function(cb) {
  var task;
  for (var i = 0; i < copyLocations.length; i++) {
    task = gulp.src(copyLocations[i].src)
    .pipe(plumber())
    .pipe(watch(copyLocations[i].src))
    .pipe(gulp.dest(copyLocations[i].dest))
    .pipe(connect.reload());
  }

  cb();
});
// ////////////////////////////////////////////////
// BROWSERIFY+WATCHIFY 
// ////////////////////////////////////////////////f
var bundler = browserify({
  basedir: './src/js/',
  entries: ['index.js'],
  debug: true
});

gulp.task('watchify', function() {
  var watcher = watchify(bundler);
  return watcher
  .on('error', gutil.log.bind(gutil, 'Browserify Error'))
  .on('update', function() {
    watcher.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/js'))
    .pipe(connect.reload());

    gutil.log('Updated Javascript sources');
  })
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./public/js'));
});

// ////////////////////////////////////////////////
// SCRIPTS
// ////////////////////////////////////////////////

gulp.task('scripts', function() {
  gulp.src('src/js/**.js')
      .pipe(plumber())
      .pipe(concat('/js/index.js'))
      .pipe(gulp.dest('./public'))
      .pipe(connect.reload());
});

gulp.task('scripts:watch', function() {
  watch(watchLocations.js, function() {
    gulp.start('scripts');
  });
});

// ////////////////////////////////////////////////
// SASS
// ////////////////////////////////////////////////
// Based on http://gotofritz.net/blog/geekery/how-to-prevent-sass-errors-stopping-gulp-watch/
gulp.task('sass', function() {
  gulp.src('src/sass/**/*.scss')
      .pipe(plumber())
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(gulp.dest('./public'))
      .pipe(connect.reload());
});

gulp.task('sass:watch', function() {
  watch(watchLocations.sass, function() {
    gulp.start('sass');
  });
});

// ////////////////////////////////////////////////
// SERVER
// ////////////////////////////////////////////////
gulp.task('server', function() {
  connect.server({
    root: ['public', 'node_modules'],
    port: 5000,
    livereload: true
  });
});

// ////////////////////////////////////////////////
// CONFIG TASKS
// ////////////////////////////////////////////////
gulp.task('config:dev', function() {
  // TODO add gulpif to dev-based tasks like sourcemaps
  isDev = true;
  return;
});

// ////////////////////////////////////////////////
// MAIN TASKS
// ////////////////////////////////////////////////
gulp.task('dev', ['config:dev', 'clean'], function() {
  gulp.start('copy');
  gulp.start('sass');
  gulp.start('sass:watch');
  gulp.start('scripts');
  gulp.start('scripts:watch');
  gulp.start('watchify');
  gulp.start('server');
});
