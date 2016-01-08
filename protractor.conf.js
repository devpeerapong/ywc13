var conf = require('./gulp/conf');

exports.config = {
  framework: 'jasmine2',
  rootElement: 'html',
  baseUrl: 'http://localhost:3000',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  capabilities: {
    'browserName': 'chrome'
  },
  onPrepare: function() {
      var SpecReporter = require('jasmine-spec-reporter');
      // add jasmine spec reporter
      jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
  },
  jasmineNodeOpts: {
    showColors: true,
    print: function() {},
    defaultTimeoutInterval: 30000
  }
}