// Karma configuration
// Generated on Fri Oct 02 2015 20:13:24 GMT+0700 (ICT)
var conf = require('./gulp/conf');

var bowerFiles = require('main-bower-files');
var _ = require('lodash');

function genFlies() {
    var bower = bowerFiles();
    var target = [
        conf.paths.base + '/app.module.js',
        conf.paths.app + '/**/*.module.js',
        conf.paths.app + '/**/config/*.js',
        conf.paths.app + '/**/services/*.js',
        conf.paths.app + '/**/filters/*.js',
        conf.paths.app + '/**/controllers/*.controller.js',
        conf.paths.app + '/**/directives/**/*.js',
        conf.paths.app + '/**/directives/*.js',
        conf.paths.app + '/**/tests/unit/*.spec.js'
    ];

    _.each(bower, function(n, key) {
        bower[key] = n.replace(__dirname + '/', '');
    });

    _.remove(bower, function(n) {
        var reg =  /\.js/g;
        return !reg.test(n);
    });

    return _.union(bower, target);
}

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: genFlies(),


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  })
}
