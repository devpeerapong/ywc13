var gulp = require('gulp');
var $    = require('gulp-load-plugins')();

var browserSync = require('browser-sync');

var conf = require('./conf');



gulp.task('scripts', function () {
    var target = gulp.src([
        conf.paths.base + '/app.module.js',
        conf.paths.app + '/**/*.module.js',
        conf.paths.app + '/**/config/*.js',
        conf.paths.app + '/**/services/*.js',
        conf.paths.app + '/**/filters/*.js',
        conf.paths.app + '/**/controllers/*.controller.js',
        conf.paths.app + '/**/directives/**/*.js',
        conf.paths.app + '/**/directives/*.js'
    ]);
    
    return target
        .pipe($.plumber())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe(browserSync.reload({ stream: true }))
        .pipe($.size());
});