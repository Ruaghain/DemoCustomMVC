'use strict';

module.exports = function(karma) {
  karma.set({

    frameworks: [ 'jasmine', 'browserify' ],

    files: [
		'src/**/*.js',
		'test/**/*.js'
    ],

    reporters: [ 'dots' ],

    preprocessors: {
      'src/**/*.js': ['browserify'],
	  'test/**/*.js': ['browserify'],
	  
    },

    browsers: [ 'Chrome' ],

    logLevel: 'LOG_DEBUG',

    singleRun: true,
    autoWatch: false,

    // browserify configuration
    browserify: {
      debug: true,
      transform: [ 'brfs', 'browserify-shim' ]
    }
  });
};