var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

browserSync.use(browserSyncSpa({
    selector: "[ng-app]" // Only needed for angular apps
}));

gulp.task('serve', ['watch'], function () {
  browserSync.init({
      server: {
          baseDir: conf.paths.base
      }
  });
});

gulp.task('serve:tdd', ['serve', 'tdd:auto']);

gulp.task('serve:e2e', ['inject'], function() {
	browserSync.init({
      server: {
          baseDir: conf.paths.base
      }
  	});
});

gulp.task('serve:dist', function () {
  browserSync.init({
    server: {
      baseDir: conf.paths.dist
    }
  });
});