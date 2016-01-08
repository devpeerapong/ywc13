var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {

	var injectFiles = gulp.src([
		conf.paths.assets + '/scss/components/*.scss'
	], { read: false });

	var injectOptions = {
		transform: function(filePath) {
			filePath = filePath.replace(conf.paths.assets + '/scss/', '');
			return '@import "' + filePath + '";';
	},
		starttag: '// injector',
		endtag: '// endinjector',
		addRootSlash: false
	};

  return gulp.src(conf.paths.assets + '/scss/app.scss')
		.pipe($.inject(injectFiles, injectOptions))
		.pipe($.sourcemaps.init())
		.pipe($.sass({ style: 'expanded' }).on('error', $.sass.logError))
		.pipe($.autoprefixer())
		.pipe($.sourcemaps.write())
    	.pipe(gulp.dest(conf.paths.assets + '/css'))
		.pipe(browserSync.reload({ stream: true }));
});