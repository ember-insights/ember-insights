module.exports = {
  dsclean: {
    files: {
      'tmp/ember-insights.amd.js': 'tmp/ember-insights.amd.js'
    },
    options: {
      replacements: [{
        pattern: /\".\//ig,
        replacement: '\"'
      }]
    }
  }
};
