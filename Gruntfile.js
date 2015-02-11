module.exports = function(grunt) {
  require('load-grunt-config')(grunt, {
    configPath: require('path').join(process.cwd(), 'tasks')
  });


  grunt.registerTask('default', 'build');


  grunt.registerTask(
    'build', "Build AMD package which is available as Bower component", ['build:amd', 'dist:amd']
  );

  grunt.registerTask('build:amd', [
    'clean:tmp',
    'copy:tmp',
    'rename:index',
    'transpile:amd',
    'concat:browser',
    'string-replace:dsclean'
  ]);

  grunt.registerTask('dist:amd', [
    'clean:dist',
    'copy:dist',
    'uglify:dist',
    'clean:tmp'
  ]);
};
