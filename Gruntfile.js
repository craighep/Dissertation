module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    qunit: {
      all: ['http://craighep.github.io/Dissertation/js/tests/*.html']
    },
  });
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.registerTask('test', ['qunit']);
};
