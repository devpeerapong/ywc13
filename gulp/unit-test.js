var path   = require('path');
var conf   = require('./conf');
var gulp   = require('gulp');
var Server = require('karma').Server;

gulp.task('tdd', ['scripts'], function(done) {
	new Server({
	    configFile: __dirname + '/../karma.conf.js'
	  }, function() {
	  	done();
	  }).start();
});

gulp.task('tdd:auto', function(done) {
	new Server({
		configFile: __dirname + '/../karma.conf.js',
		singleRun: false,
		autoWatch: true
	  }, function() {
	  	done();
	  }).start();
});

gulp.task('tdd:dist', function(done) {
	new Server({
		configFile: __dirname + '/../karma.conf.js',
		files: [ conf.paths.dist + 'scripts/vendor.js', 
			conf.paths.dist + 'scripts/app.js', 
			conf.paths.dist + 'scripts/mean.tpl.js', 
			conf.paths.app + '/**/tests/unit/*.spec.js']
	}, function() {
		done();
	}).start();
});