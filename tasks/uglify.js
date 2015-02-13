module.exports = {
  options: {
    report: 'min',
    wrap: true
  },
  dist: {
    files: [{
      src: 'dist/ember-insights.amd.js',
      dest: 'dist/ember-insights.amd.min.js',
    }]
  }
};
