var grunt = require('grunt');

module.exports = {
  browser: {
    src: [ 'tmp/transpiled/**/*.js' ],
    dest: 'tmp/ember-insights.amd.js'
  },
};
