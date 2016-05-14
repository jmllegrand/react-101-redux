/**
 * Created by jmlegrand on 08/05/16.
 */

var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var babelify = require('babelify');
var babel = require('babel-core/register');
var watchify = require('watchify');
var notify = require('gulp-notify');

var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var buffer = require('vinyl-buffer');

var browserSync = require('browser-sync');
var reload = browserSync.reload;
var historyApiFallback = require('connect-history-api-fallback');


/*
 Browser Sync
 */
gulp.task('browser-sync', function() {
  browserSync({
    // we need to disable clicks and forms for when we test multiple rooms
    server : {},
    middleware : [ historyApiFallback() ],
    ghostMode: false
  });
});

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(file, watch) {
  var props = {
    entries: ['./src/increment/' + file],
    debug : true,
    cache: {},
    packageCache: {},
    transform:  [babelify.configure({ presets: ["es2015", "react"]})]
  };

  // watchify() if watch requested, otherwise run browserify() once
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  function rebundle() {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(file))
      .pipe(gulp.dest('./build/'))
      // If you also want to uglify it
      // .pipe(buffer())
      // .pipe(uglify())
      // .pipe(rename('app.min.js'))
      // .pipe(gulp.dest('./build'))
      .pipe(reload({stream:true}))
  }

  // listen for an update and run rebundle
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });

  // run it once the first time buildScript is called
  return rebundle();
}

gulp.task('scripts', function() {
  return buildScript('index.js', false); // this will run once because we set watch to false
});



// run 'scripts' task first, then watch for future changes
gulp.task('default', ['scripts','browser-sync'], function() {
  return buildScript('index.js', true); // browserify watch for JS changes
});

