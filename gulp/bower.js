var gulp       = require('gulp');
var bowerFiles = require('main-bower-files');

var $ = require('gulp-load-plugins')();

var conf = require('./conf');
 
gulp.task('bower', function() {
  return gulp.src(conf.paths.base + '/index.html')
    .pipe($.inject(gulp.src(bowerFiles(), {read: false}), {
    	name: 'bower',
    	ignorePath: 'src/'
    }))
    .pipe(gulp.dest('./src'));
});