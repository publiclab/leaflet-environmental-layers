module.exports = function(grunt) {

    "use strict";
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
          files: ['<%= jshint.files %>'],
          tasks: ['jshint']  // test file can be added here
        },

        browserify: {
            dist: {
                src: ['node_modules/jquery/dist/jquery.min.js', 'node_modules/leaflet/dist/leaflet.js', 'src/leafletEnvironmentalLayers.js', 'src/util/*.js'],
                dest: 'dist/LeafletEnvironmentalLayers.js'
            }
        },

        jasmine: {
          src: "src/client/js/*.js",
          options: {
            specs: "spec/javascripts/*spec.js",
            vendor: ['node_modules/jquery/dist/jquery.js','dist/LeafletEnvironmentalLayers.js','node_modules/jasmine-jquery/lib/jasmine-jquery.js'],
          }
        },

        jshint: {
            // define the files to lint
          files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            // configure JSHint (documented at http://www.jshint.com/docs/)
          options: {
            // more options here if you want to override JSHint defaults
            globals: {
             jQuery: true,
             console: true,
             module: true
            }
          }
        },


    });

    /* // Using matchdep instead of these .
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    */

    /* Default (development): Watch files and build on change. */
    grunt.registerTask('build', [
        'browserify:dist'
    ]);
    grunt.registerTask('test', ['jshint', 'jasmine']);
    grunt.registerTask('build', ['browserify']);
};
