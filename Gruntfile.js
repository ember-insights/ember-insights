module.exports = function(grunt) {
  require('load-grunt-config')(grunt, {
    configPath: require('path').join(process.cwd(), 'tasks')
  });

  grunt.registerTask('build:amd', [
    'clean:tmp',
    'copy:tmp',
    'rename:index',
    'transpile:amd',
    'concat:browser',
    'string-replace:dsclean'
  ]);

  grunt.registerTask('dist', "Copy to /build, minify", [
    'clean:build',
    'copy:build',
    'uglify:build'
  ]);


  grunt.registerTask('default', "Build AMD package which is available as Bower component", [
    'build:amd',
    'dist',
    'clean:tmp'
  ]);
};
