// Require our modules
var gulp = require( 'gulp' );
var sass = require( 'gulp-sass' );
var concat = require( 'gulp-concat');
var minifyCSS = require( 'gulp-minify-css' );
var minifyJS = require( 'gulp-minify' );
var jasmineNode = require( 'gulp-jasmine-node' );
var watch = require( 'gulp-watch' );
var nodemon = require( 'gulp-nodemon' );

// The list of all js files that we care about
var jsFiles = [
	'./public/js/angular.js'
	,'./public/js/angular-route.js'
	,'./public/js/contact_manager.js'
	,'./public/js/contact-manager-state.js'
];

// The list of all css files that we care about
var cssFiles = [
	'./public/css/contactmanager.scss'
];

// Process the scss file and creates min.css
gulp.task( 'sass', function() {
	return gulp.src( cssFiles)
			.pipe( sass() )
			.pipe( concat( 'min.css' ) )
			.pipe( minifyCSS() )
			.pipe( gulp.dest( './public/css/' ) );
} );


// Minify our javascript
gulp.task( 'minjs', function() {
	return gulp.src( jsFiles )
		.pipe( minifyJS( {
			mangle: false
		} ) )
		.pipe( concat( 'min.js' ) )
		.pipe( gulp.dest( './public/js/' ) );
} );


// Run the server side unit tests
gulp.task( 'server-test', function() {
	return gulp.src( './spec/server-spec.js' )
		.pipe( jasmineNode( {
			timeout: 10000
		} ) );
} );


// Set up our watch task to reminify the css and js files
gulp.task( 'dev', function() {
	gulp.watch( jsFiles, ['minjs'] );
	gulp.watch( cssFiles, ['sass'] );

	nodemon( {
		script: 'server.js',
		ext: 'js jade',
		ignore: [ './public/*', 'gulpfile.js' ]
	} );
} );


// Set up our default task
gulp.task( 'default', ['sass', 'minjs', 'server-test'] );