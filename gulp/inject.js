var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var _ = require('lodash');



gulp.task('inject', ['bower', 'scripts', 'styles'], function() {
	var injectJS = gulp.src([
		conf.paths.base + '/app.module.js',
		conf.paths.app + '/**/*.module.js',
		conf.paths.app + '/**/config/*.js',
		conf.paths.app + '/**/services/*.js',
		conf.paths.app + '/**/filters/*.js',
		conf.paths.app + '/**/controllers/*.controller.js',
		conf.paths.app + '/**/directives/**/*.js',
		conf.paths.app + '/**/directives/*.js'
		], { read: false });

	var injectCSS = gulp.src( [ conf.paths.assets + 'css/*.css' ], { read: false });

	var injectOption = { ignorePath: conf.paths.base };

	return gulp.src(conf.paths.base + 'index.html')
    	.pipe($.inject(injectJS, injectOption))
    	.pipe($.inject(injectCSS, injectOption))
    	.pipe(gulp.dest('./src'));
});