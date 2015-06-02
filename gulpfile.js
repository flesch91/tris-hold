var assets  = require('postcss-assets');
var autoprefixer = require('autoprefixer-core');
var es = require('event-stream');
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var postcss = require('gulp-postcss');
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

var handleError = function (err) {
  console.log(err.name, ' in ', err.plugin, ': ', err.message);
  console.log(err.getStack());
  process.exit(1);
};

// generates random string, to be used as a cache beater
var randomId = function () {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};


// Copy
gulp.task('copy', ['sass'], function () {
  return es.concat(
    // update index.html to work when built
    gulp.src(['source/index.html', 'source/page404.html'])
      .pipe(replace(/(bust=v)(\d*\.?)*/g, '$1' + randomId()))
      .pipe(gulp.dest('build')),

    // copy vendor files
    gulp.src(['source/vendor/**/*'])
      .pipe(gulp.dest('build/vendor')),

    // copy js files
    gulp.src(['source/js/**/*'])
      .pipe(gulp.dest('build/js')),

    // copy assets
    gulp.src(['source/assets/**/*'])
      .pipe(gulp.dest('build/assets')),
    gulp.src(['source/mocks/**/*'])
      .pipe(gulp.dest('build/assets'))
  );
});

// JavaScript
gulp.task('js', function () {
  return gulp.src(['source/js/main.js'])
    .pipe(uglify().on('error', handleError))
    .pipe(gulp.dest('build/js/'));
});

// Sass
gulp.task('sass', function () {
  var processors = [
    assets({
      basePath: 'source/',
      relativeTo: 'source/assets/css', // this relative path
      loadPaths: ['assets/fonts/', 'assets/images/']
    }),
    autoprefixer
  ];

  return gulp.src(['source/sass/*.scss', '!source/sass/_*.scss'])
    .pipe(sass({
      outputStyle: 'compressed', // :nested, :expanded, :compact, :compressed
      errLogToConsole: true
    }).on('error', handleError))
    .pipe(postcss(processors).on('error', handleError))
    .pipe(gulp.dest('source/assets/css'));
});


// Watch
gulp.task('watch', ['sass'], function () {

  gulp.watch('source/sass/**/*.scss', ['sass']);

  // enable Livereload
  livereload.listen();
  gulp.watch([
    'source/assets/*.css',
    'source/index.html',
    'source/js/**/*',
    '!source/js/**/*.spec.js'
  ]).on('change', livereload.changed);
});
