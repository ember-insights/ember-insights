module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    coffee:
      main:
        options:
          bare: true
        expand: true
        cwd: 'lib/'
        src: '*.coffee'
        dest: 'tmp'
        ext: '.js'

    transpile:
      main:
        type: 'amd'
        expand: true
        cwd: 'tmp/'
        src: '*.js'
        dest: 'tmp/transpiled'
        ext: '.amd.js'

    concat:
      main:
        src: 'tmp/transpiled/*.amd.js'
        dest: 'ember-insights.amd.js'

    clean:
      tmp: 'tmp/**/*.js'


  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-es6-module-transpiler'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-clean'


  grunt.registerTask 'default', ['clean', 'coffee', 'transpile', 'concat']
