module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    qunit: {
        all: {
            options: {
                urls: [
                    'http://craighep.github.io/Dissertation/js/tests/tests.html'
                ]
            }
        }
    },
  });
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.registerTask('test', ['qunit']);
};
