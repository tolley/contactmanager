// Requires
var express			= require( 'express' )
	,bodyParser		= require( 'body-parser' )
	,config			= require( './config')()
	,mongoose		= require( 'mongoose' )
	,userModel		= require( './models/user.js' )
	,userCtrl		= require( './controllers/userController.js' )
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

mongoose.connect( 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/contactmanager' );

// Create our routes and define the methods that will handle them
// Set up a route to handle signup requests
app.post( '/signup.html', function( req, res ) {
	console.log( 'in server.js, req.body = ', req.body );
	userCtrl.createNewUser( req, res );
} );

app.post( '/signin.html', function( req, res ) {
	userCtrl.signin( req, res );
} );

// Set up the http server so that it listen for requests
app.listen( config.port, function() {
	console.log( 'Webserver running on port ' + config.port );
} );
