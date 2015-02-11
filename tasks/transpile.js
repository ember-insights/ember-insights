module.exports = {
  amd: {
    type: 'amd',
    files: [
      {
        expand: true,
        cwd: 'tmp/addon/',
        src: [ '**/*.js', ],
        dest: 'tmp/transpiled/'
      }
    ]
  }
};
