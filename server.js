// Requires
var express			= require( 'express' )
	,bodyParser		= require( 'body-parser' )
	,config			= require( './config')
	,mongoose		= require( 'mongoose' )
	,cookieParser	= require( 'cookie-parser' );

// Initialize that object that will connect to the mongo database
mongoClient = require( 'mongodb' ).MongoClient,

// Create our http server object
app = express();

// Tell our server to render static files from the public directory
app.use( express.static( './public' ) );

// Plug our middleware into express
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json( {} ) );
app.use( cookieParser( config.signedCookieSecret, {} ) );

// Include/initialize our user controller
require( './controllers/userController.js' ).controller( app );

mongoose.connect( 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/contactmanager' );

// Set up the http server so that it listen for requests
app.listen( config.server.port, function() {
	console.log( 'Webserver running on port ' + config.server.port );
} );

// Test cookies
app.get( '/cookietest', function( req, res ) {
	if( req.signedCookies['test'] )
	{
		console.log( 'cookie found: ' , req.signedCookies['test'] );
	}
	else
	{
		res.cookie( 'test', 'testing', {maxAge: 99999, signed: true} );
		console.log( 'setting cookie test' );
	}

	res.send( 'check the console and look for the test cookie');

	res.end();
} );
