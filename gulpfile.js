// Require our modules
var gulp = require( 'gulp' );
var sass = require( 'gulp-sass' );
var concat = require( 'gulp-concat');
var minifyCSS = require( 'gulp-minify-css' );
var minifyJS = require( 'gulp-minify' );
var uglify = require( 'gulp-uglify' );
var jasmineNode = require( 'gulp-jasmine-node' );
var watch = require( 'gulp-watch' );
var nodemon = require( 'gulp-nodemon' );

// The list of all js files that we care about
var clientJSFiles = [
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
	return gulp.src( clientJSFiles )
		.pipe( concat( 'min.js' ) )
		.pipe( uglify( { mangle: false } ) )
		.pipe( gulp.dest( './public/js/' ) );
} );


// Run the server side unit tests
gulp.task( 'server-test', function() {
	return gulp.src( './spec/server-spec.js' )
		.pipe( jasmineNode( {
			timeout: 10000
		} ) );
} );


// Watch the client sided js files for changes and reminify when
// one is modified
gulp.task( 'watch-js', function() {
	return gulp.watch( clientJSFiles, ['minjs'] );
} );


// Watch the css files and reminify when reminify when one is modified
gulp.task( 'watch-css', function() {
	return gulp.watch( cssFiles, ['sass'] );
} );


// Watch the server side js files and restart the server when one
// is modified
gulp.task( 'watch-server', function() {
	return nodemon( {
		script: 'server.js',
		ext: 'js jade',
		ignore: [ 'public/*', 'gulpfile.js' ]
	} );
} );


// Set up our default task
gulp.task( 'default', ['sass', 'minjs'] );

// Set up our development task
gulp.task( 'dev', [ 'watch-server', 'watch-js', 'watch-css' ] );