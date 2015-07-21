// Gruntfile with the configuration of grunt-express and grunt-open. No livereload yet!
var os = require("os");

module.exports = function(grunt) {
// Load Grunt tasks declared in the package.json file
require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
// Configure Grunt 
grunt.initConfig({
    // Grunt express - our webserver
    // https://www.npmjs.com/package/grunt-express
    express: {
        all: {
            options: {
                port: 9001,
                hostname: '0.0.0.0',
                bases: ['./build'], // Replace with the directory you want the files served from
                // Make sure you don't use `.` or `..` in the path as Express
                // is likely to return 403 Forbidden responses if you do
                // http://stackoverflow.com/questions/14594121/express-res-sendfile-throwing-forbidden-error
            }
        }
    },
    // grunt-browserify will monitor the projects files, jsx transpile them and concatenate to the one file : app/js/build/app.built.js
    // https://www.npmjs.com/package/grunt-browserify
    browserify: {
        options: {
            livereload: true,
            browserifyOptions: {
                debug: true
            }
        },
        client: {
            src: ['src/js/**/*.js'],
            dest: 'build/js/main.js'
        }
    },
    // grunt-watch will monitor the projects files
    // https://www.npmjs.com/package/grunt-contrib-watch
    watch: {
        all: {
            files: ['src/js/**/*.js', 'build/index.html', 'src/css/**/*.scss'],
            tasks: ['browserify'],
            options: {
                livereload: true,
                spawn: false
            }
        }
    },
    // grunt-open will open your browser at the project's URL
    // https://www.npmjs.com/package/grunt-open
    open: {
        all: {
            // Gets the port from the connect configuration
            path: 'http://localhost:<%= express.all.options.port%>'
        }
    },
    // Grunt Wiredep - dInject dependancies to index.html
    // https://www.npmjs.com/package/grunt-wiredep
    wiredep: {
        task: {
			cwd : "build/vendor",
            src: ['build/*.html']
        }
    },
    cache_control: {
        your_target: {
            source: "app/index.html",
            options: {
                version: "2.0",
                links: true,
                scripts: true,
                replace: false,
                outputDest: "app/index.html",
                dojoCacheBust: true
            }
        }
    }
});
// grunt-contrib-sass - Compile Sass to CSS  
// https://www.npmjs.com/package/grunt-contrib-sass
grunt.registerTask('server', [
    'express',
    'browserify',
    'open',
    'watch'
]);
//wire in bower dependancies to index.html file
grunt.registerTask('builddep', ['wiredep']);
};