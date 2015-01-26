module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-qunit');
    gruntConfig.qunit = {
        src: ['http://craighep.github.io/Dissertation/js/tests/tests.html']
    };
    grunt.registerTask('test', 'qunit:src');
 
};
