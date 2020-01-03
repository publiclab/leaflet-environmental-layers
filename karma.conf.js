// Karma configuration
// Generated on Thu Jan 02 2020 17:00:05 GMT+0530 (India Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    plugins: [
      'karma-coverage',
      'karma-browserify',
      'karma-jasmine',
      'karma-jasmine-jquery',
      'karma-jasmine-ajax',
			'karma-phantomjs-launcher',
			'karma-firefox-launcher'],


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'jasmine-ajax', 'jasmine-jquery', 'jasmine'],


    // list of files / patterns to load in the browser
    files: [
      "node_modules/jquery/dist/jquery.js",
      "node_modules/leaflet/dist/leaflet.js",
      "node_modules/leaflet/dist/leaflet.css",
      "node_modules/leaflet-blurred-location/dist/Leaflet.BlurredLocation.js",
      // "node_modules/leaflet.blurred-location-display/dist/Leaflet.BlurredLocationDisplay.js",
      "node_modules/@fortawesome/fontawesome-free/css/all.min.css",
      'lib/leaflet-fullUrlHash.js',
      'src/util/embedControl.js',
      'dist/util/layersBrowser.js',
      "spec/javascripts/embedControl.spec.js",
      "spec/javascripts/layersBrowser.spec.js",
      {
        pattern: './spec/javascripts/fixtures/*.html',
        watched: true,
        included: false,
        served: true
      }
    
    ],


    // list of files / patterns to exclude
    exclude: [],

    proxies: {
			'/spec/javascripts/fixtures/': '/base/spec/javascripts/fixtures/'
		},


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'spec/**/*.html': [],
      'src/**/*.js': [ 'browserify' ],
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'PhantomJS', 
      // 'Firefox'
    ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    coverageReporter: {
      reporters: [
        {type: 'text', dir: '../coverage/', file: 'coverage.txt'},
        {type: 'lcovonly', dir: '../coverage/'},
        {type: 'html', dir: '../coverage/'},
      ],
    },
  })
}
