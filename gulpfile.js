"use strict";

var path = require('path');
var gulp = require('gulp');
var run = require('run-sequence');
var browserSync = require('browser-sync');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');

var bs = browserSync.create();
var root = path.resolve(__dirname);
var paths = {
  src: path.join(root, 'src'),
  entry: path.join(root, 'src/index.html'),
  styles: path.join(root, 'src/styles/**/*.scss'),
  scripts: path.join(root, 'src/scripts/**/*.js'),
  images: path.join(root, 'src/assets/images/**'),
  fonts:path.join(root,'src/assets/fonts/**'),
  tmp: path.join(root, '.tmp'),
  tmpStyles: path.join(root, '.tmp/css'),
  tmpScripts: path.join(root, '.tmp/js'),
  tmpimg:path.join(root,'.tmp/img'),
  tmpfonts:path.join(root,'tmp/fonts'),
  build: path.join(root, 'build')
};

// Static server
gulp.task('serve', function() {
    bs.init({
        server: './.tmp'
    });

    gulp.watch(paths.styles, ['styles'])
    gulp.watch(paths.scripts, ['scripts'])
    gulp.watch(paths.entry, ['copy'], bs.reload);
    gulp.watch(paths.images,['copy'],bs.reload);
    gulp.watch(paths.fonts, ['copy'], bs.reload);
});

gulp.task('clean', function(cb) {
  return gulp.src([
    path.join(paths.tmpStyles, '**/*.js'),
    path.join(paths.tmpScripts, '**/*.js')
    ], { read: false })
    .pipe(clean());
});

gulp.task('copy', function() {
  return gulp.src(paths.entry)
    .pipe(gulp.dest(paths.tmp));
});
gulp.task('copy',function(){
  return gulp.src(paths.images)
  .pipe(gulp.dest(paths.tmpimg));
});
gulp.task('copy',function(){
  return gulp.src(paths.fonts)
  .pipe(gulp.dest(paths.tmpfonts));
});
gulp.task('styles', function() {
  return gulp.src(paths.styles)
    .pipe(sass())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.tmpStyles))
    .pipe(bs.stream());
});

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.tmpScripts))
    .pipe(bs.stream());
});

gulp.task('watch', function(cb) {
  run(['clean', 'copy', 'styles', 'scripts', 'serve'], cb);
});

gulp.task('default', ['watch']);