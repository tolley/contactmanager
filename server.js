// Requires
var express			= require( 'express' )
	,bodyParser		= require( 'body-parser' )
	,config			= require( './config')
	,cookieParser	= require( 'cookie-parser' )
	,loadLoggedUser	= require( './modules/loadLoggedUser' )
	,mongoose		= require( 'mongoose' );

// Initialize that object that will connect to the mongo database
mongoClient = require( 'mongodb' ).MongoClient;

// Create our http server object
var app = express();

// Tell our server to render static files from the public directory
app.use( express.static( './public' ) );

// Plug our middleware into express
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json( {} ) );
app.use( cookieParser( config.signedCookieSecret, {} ) );
app.use( loadLoggedUser() );

// Include/initialize our user controller
require( './controllers/userController.js' ).controller( app );

// Connect to the DB
mongoose.connect( 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/contactmanager' );

// Set up the http server so that it listen for requests
app.listen( config.server.port, function() {
	console.log( 'Webserver running on port ' + config.server.port );
} );

var userModel = require( './models/user.js' );

app.get( '/testLogin', function( req, res ) {
	userModel.getLoggedInUser( req, res, function( req, res ) {
		console.log( 'in server.js, req.loggedUser = ', req.loggedUser );
		res.end();
	} );
} );
