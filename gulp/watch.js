var bowerFiles = require('main-bower-files');
var browserSync = require('browser-sync');
var _ = require('lodash');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    scope: ['devDependencies']
});

var conf = require('./conf');
var bower = require('./bower');

gulp.task('watch', ['inject'], function() {
    var target = [
        conf.paths.app + '/**/*.module.js',
        conf.paths.app + '/**/config/*.js',
        conf.paths.app + '/**/services/*.js',
        conf.paths.app + '/**/controllers/*.controller.js',
        conf.paths.app + '/**/directives/**/*.js',
        conf.paths.app + '/**/filters/*.js'
    ];

    $.watch('bower.json', function() {
        gulp.start(['bower']);
    });

    $.watch([conf.paths.base + '/index.html',
            conf.paths.app + '/**/views/*.view.html',
            conf.paths.app + '/**/directives/**/*.view.html'
        ],
        function() {
            browserSync.reload();
        });

    $.watch(target)
        .on('add', function() {
            gulp.start('inject');
        })
        .on('unlink', function() {
            gulp.start('inject');
        })
        .on('change', function() {
            gulp.start('scripts');
        });

    $.watch([conf.paths.assets + '/scss/components/*.scss',
            conf.paths.assets + '/scss/app.scss'
        ])
        .on('add', function() {
            gulp.start('inject');
        })
        .on('unlink', function() {
            gulp.start('inject');
        })
        .on('change', function() {
            gulp.start('styles');
        });

});
