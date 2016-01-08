var gulp = require('gulp');
var conf = require('./conf');
var bower= require('main-bower-files');
var $    = require('gulp-load-plugins')();

gulp.task('build-template', function () {
	return gulp.src([ conf.paths.app + '/**/views/*.view.html',
	 		conf.paths.app + '/**/directives/**/*.view.html',
	 		conf.paths.app + '/**/directives/*.view.html' ])
	    .pipe($.minifyHtml({
	        empty: true,
	        spare: true,
	        quotes: true
	    }))
	    .pipe($.ngHtml2js({
	        moduleName: "mean",
	        prefix: 'app/'
	    }))
	    .pipe($.concat("mean.tpl.js"))
	    .pipe($.uglify())
	    .pipe($.size())
	    .pipe(gulp.dest(conf.paths.dist + 'scripts'));
});

gulp.task('build-css', ['build-css-vendor'], function () {
  return gulp.src(conf.paths.assets + '/css/app.css')
		.pipe($.replace('/assets/libs/font-awesome/fonts', '/demo/assets/fonts'))
		.pipe($.replace('/assets/libs/bootstrap-sass/assets/fonts/bootstrap/', '/demo/assets/fonts/'))
		.pipe($.minifyCss())
    	.pipe(gulp.dest(conf.paths.dist + 'styles'))
});

gulp.task('build-css-vendor', function () {
	return gulp.src(bower({ filter: /\.css/}))
		.pipe($.concat("vendor.css"))
		.pipe($.minifyCss())
    	.pipe(gulp.dest(conf.paths.dist + 'styles'));
})

gulp.task('build-js-vendor', function () {
	return gulp.src(bower({ filter: /\.js/}))
		.pipe($.plumber())
		.pipe($.concat("vendor.js"))
    	.pipe(gulp.dest(conf.paths.dist + 'scripts'));
});

gulp.task('build-js', ['build-js-vendor'], function () {
	var JS = gulp.src([
		conf.paths.base + '/app.module.js',
		conf.paths.app + '/**/*.module.js',
		conf.paths.app + '/**/config/*.js',
		conf.paths.app + '/**/services/*.js',
		conf.paths.app + '/**/filters/*.js',
		conf.paths.app + '/**/controllers/*.controller.js',
		conf.paths.app + '/**/directives/**/*.js',
		conf.paths.app + '/**/directives/*.js'
		]);

	return JS
		.pipe($.plumber())
		.pipe($.concat("app.js"))
		.pipe($.ngAnnotate())
		.pipe($.uglify())
		.pipe($.size())
	    .pipe(gulp.dest(conf.paths.dist + 'scripts'));
});

gulp.task('build-fonts', function () {
  	return gulp.src(conf.paths.assets + '/libs/**/*')
	  	.pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
	  	.pipe($.flatten())
	    .pipe(gulp.dest(conf.paths.dist + 'assets/fonts'));
});

gulp.task('build-html',['build-template', 'build-js', 'build-css'], function () {
	var injectJS = gulp.src([ conf.paths.dist + 'scripts/vendor.js', 
		conf.paths.dist + 'scripts/app.js',
		conf.paths.dist + 'scripts/mean.tpl.js' ], { read: false });
	var injectCSS = gulp.src(conf.paths.dist + 'styles/*.css', { read: false });

	var injectOption = { ignorePath: conf.paths.dist, removeTags: true, addRootSlash: false };

	return gulp.src(conf.paths.base + '/index.html')
    	.pipe($.inject(injectJS, injectOption))
    	.pipe($.inject(injectCSS, injectOption))
    	.pipe($.inject(gulp.src('.a', {read: false}), {
	    	name: 'bower',
	    	ignorePath: 'dist/',
	    	empty: true,
	    	removeTags: true,
	    	addRootSlash: false
	    }))
    	.pipe(gulp.dest(conf.paths.dist));
});

gulp.task('build-api', function() {
	return gulp.src(conf.paths.base + '/api/*.json')
	  	.pipe($.flatten())
	    .pipe(gulp.dest(conf.paths.dist + 'api'));
})

gulp.task('build', ['build-fonts', 'build-html', 'build-api']);
gulp.task('build:test', ['build', 'serve:dist', 'tdd:dist', 'protractor']);