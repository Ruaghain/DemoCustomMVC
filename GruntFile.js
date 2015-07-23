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
                    bases: ['./dist']
                }
            }
        },
        // grunt-browserify will monitor the projects files, jsx transpile them and concatenate to the one file : app/js/dist/app.built.js
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
                dest: 'dist/js/main.js'
            }
        },
        // Apply several post-processors to your CSS using PostCSS
        // https://www.npmjs.com/package/grunt-postcss
        postcss: {
            options: {
                map: true, // inline sourcemaps

                // or
                map: {
                    inline: false, // save all sourcemaps as separate files...
                    annotation: 'dist/css/maps/' // ...to the specified directory
                },

                processors: [
                    require('autoprefixer-core')({
                        browsers: 'last 2 versions'
                    }), // add vendor prefixes
                    require('cssnano')() // minify the result
                ]
            },
            dist: {
                src: 'src/css/main.css',
                dest: 'dist/css/main.css'
            }
        },
        // grunt-watch will monitor the projects files
        // https://www.npmjs.com/package/grunt-contrib-watch
        watch: {
            all: {
                files: ['src/js/**/*.js', 'dist/index.html', 'src/css/**/*.css'],
                tasks: ['browserify', 'postcss'],
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
                cwd: "dist/vendor",
                src: ['dist/*.html']
            }
        }
    });
    grunt.registerTask('server', [
        'express',
        'browserify',
        'postcss',
        'open',
        'watch'
    ]);
    //wire in bower dependancies to index.html file
    grunt.registerTask('distdep', ['wiredep']);
};