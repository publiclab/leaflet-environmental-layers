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
              src: ['node_modules/leaflet/dist/leaflet.js', 'src/leafletEnvironmentalLayers.js', 'src/util/*.js'],
              dest: 'dist/LeafletEnvironmentalLayers.js'
          },
          babel: {
            files: {
              "dist/util/layersBrowser.js": "dist/util/layersBrowser_babel.js"
            }
          }
      },

        copy: {
          dist: {
            files: [
              {src: 'spec/javascripts/fixtures/info.json', dest: 'dist/info.json'},
            ],
          },
        },

        babel: {
          options: {
            sourceMaps: true,
            presets: ['@babel/preset-env'],
            plugins: [
              "transform-remove-strict-mode",
            ]        
          },
          dist: {
            files: {
              "dist/LeafletEnvironmentalLayers_babel.js": "dist/LeafletEnvironmentalLayers.js",
              "dist/util/layersBrowser_babel.js": "src/util/layersBrowser.js",
            }
          }
        },

        jasmine: {
          src: [
            'src/*.js',
            'src/util/*.js',
            'dist/*babel.js',
            'dist/util/*.js',
          ],
          options: {
            specs: "spec/javascripts/*spec.js",
            vendor: [
              'node_modules/jquery/dist/jquery.js',
              'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
              'node_modules/jasmine-ajax/lib/mock-ajax.js',
              'node_modules/leaflet-blurred-location/dist/Leaflet.BlurredLocation.js',
              'https://maps.googleapis.com/maps/api/js?key=AIzaSyAOLUQngEmJv0_zcG1xkGq-CXIPpLQY8iQ&libraries=places',
              'node_modules/leaflet-google-places-autocomplete/src/js/leaflet-gplaces-autocomplete.js',
              // 'node_modules/leaflet.blurred-location-display/dist/Leaflet.BlurredLocationDisplay.js',
              // 'node_modules/esri-leaflet/dist/esri-leaflet.js',
            ],
            keepRunner: true,
            polyfills: [
              'node_modules/jquery/dist/jquery.js',
              'node_modules/core-js/client/core.js',
            ],
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
    */

    /* Default (development): Watch files and build on change. */
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask("default", ["watch", "babel", "jasmine"]);
    grunt.registerTask('transpile', [ 'copy', 'babel', 'browserify:babel' ]);
    grunt.registerTask("test", ["jshint", "jasmine"]);
    grunt.registerTask('build', [
        'browserify:dist'
    ]);

};
