module.exports = function( grunt ) {
	// Project configuration
	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today( "yyyy-mm-dd" ) %> */\n',
				mangle: false
			},
			build: {
				src: ['public/js/angular.js', 'public/js/angular-route.js', 'public/js/contact_manager.js'],
				dest: 'public/js/min.js'
			}
		},

		jshint: {
			all: ['public/js/contact_manager.js']
		},

		cssmin: {
			options: {
			},

			target: {
				files: {
					'public/css/min.css': 'public/css/contactmanager.css'
				}
			}
		}
	} );

	// Load the plugin that provides the uglify, jshint, and clean tasks
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );

	// Default task(s)
	grunt.registerTask( 'default', ['jshint', 'uglify', 'cssmin'] );
//	console.log( uglify.build.dest );
}