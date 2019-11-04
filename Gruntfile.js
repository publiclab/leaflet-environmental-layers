module.exports = function(grunt) {

    "use strict";
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copy: {
          dist: {
            files: [
              // copy badge stylesheet
              {expand: true, src: ['src/css/badge.css'], dest: 'dist/css/', flatten: true, filter: 'isFile'}
        
            ],
          },
        },

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
          src: ['dist/LeafletEnvironmentalLayers.js'],
          options: {
            specs: "spec/javascripts/*spec.js",
            vendor: [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
            'node_modules/jasmine-ajax/lib/mock-ajax.js',
            'node_modules/leaflet-blurred-location/dist/Leaflet.BlurredLocation.js',
            'node_modules/leaflet/dist/leaflet.js',
            'node_modules/leaflet-blurred-location-display/dist/Leaflet.BlurredLocationDisplay.js'
            ],
            keepRunner: true,
            '--web-security' : false,
            '--local-to-remote-url-access' : true,
            '--ignore-ssl-errors' : true
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
    grunt.loadNpmTasks('grunt-contrib-copy');
    */

    /* Default (development): Watch files and build on change. */
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.registerTask("default", ["watch", "jasmine"]);
    grunt.registerTask("test", ["jshint", "jasmine"]);
    grunt.registerTask('build', [
        'copy',
        'browserify:dist'
    ]);

};
