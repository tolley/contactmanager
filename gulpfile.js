// Require our modules
var gulp = require( 'gulp' );
var sass = require( 'gulp-sass' );
var concat = require( 'gulp-concat');
var minifyCSS = require( 'gulp-minify-css' );
var minifyJS = require( 'gulp-minify' );
var jasmineNode = require( 'gulp-jasmine-node' );

// Process the scss file and creates min.css
gulp.task( 'sass', function() {
	return gulp.src( './public/css/contactmanager.scss' )
			.pipe( sass() )
			.pipe( concat( 'min.css' ) )
			.pipe( minifyCSS() )
			.pipe( gulp.dest( './public/css/' ) );
} );


// Minify our javascript
gulp.task( 'minjs', function() {
	return gulp.src( './public/js/*.js' )
		.pipe( minifyJS( {
			ignoreFiles: [ 'min.js', 'signin-app.js' ],
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


// Set up our default task
gulp.task( 'default', ['sass', 'minjs', 'server-test'] );