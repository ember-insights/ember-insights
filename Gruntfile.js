module.exports = function(grunt) {
  require('load-grunt-config')(grunt, {
    configPath: require('path').join(process.cwd(), 'tasks')
  });

  grunt.registerTask('build', "Build to the 'tmp/'", [
    'clean:tmp',
    'copy:tmp',
    'rename:index',
    'transpile:amd',
    'concat:browser',
    'string-replace:dsclean'
  ]);

  grunt.registerTask('dist', "Copy to dist, minify", [
    'clean:dist',
    'copy:dist',
    'uglify:dist'
  ]);


  grunt.registerTask('default', "Build, Dist, and then clean tmp", [
    'build',
    'dist',
    'clean:tmp'
  ]);
};
