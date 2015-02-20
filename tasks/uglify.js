module.exports = {
  options: {
    report: 'min',
    wrap: true
  },
  build: {
    files: [
      {
        src: 'build/ember-insights.amd.js',
        dest: 'build/ember-insights.amd.min.js',
      },
    ],
  }
};
