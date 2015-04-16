/* jshint node: true */

module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json')
    , jshint: {
        all: [
            "Gruntfile.js"
          , "lib/**/*.js"
          , "spec/**/*.js"
        ]
      , options: {
          jshintrc: '.jshintrc'
        },
      }
    , jasmine: {
    src: 'assets/scripts/**/*.js',
    options: {
        specs: 'tests/*spec.js',
        template: require('grunt-template-jasmine-requirejs'),
        templateOptions: {
            requireConfig: {
                baseUrl: '/assets',
                paths: {
                'jquery': 'libs/jquery/dist/jquery'
                }
            }
        }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-contrib-jasmine')

  grunt.registerTask('test', ['jshint', 'jasmine'])
  grunt.registerTask('default', ['test'])
};