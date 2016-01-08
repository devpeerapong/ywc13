var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

// Downloads the selenium webdriver
gulp.task('webdriver-update', $.protractor.webdriver_update);

gulp.task('webdriver-standalone', ['webdriver-update'], $.protractor.webdriver_standalone);

gulp.task('protractor', function (done) {
	var m = process.argv.length > 3 ? process.argv.slice(3, 5) : ['**', '*'];
	var ml = m.length;

	for(var i = 0; i < ml; i++) {
		m[i] = m[i].replace('-', '');
	}

	var path = conf.paths.app + '/' + m[0] + '/tests/e2e/' + m[1] + '.spec.js'

	gulp.src([path])
	.pipe($.protractor.protractor({
      	configFile: 'protractor.conf.js',
      	specs: path
	}))
    .on('error', function(e) { throw e })
    .on('end', function () {
      done();
    });
});