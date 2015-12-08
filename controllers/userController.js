// Our requires
var config 			= require( '../config' )
	,cryptoFuncs	= require( '../modules/cryptoFuncs.js' )
	,userModel		= require( '../models/user.js' )
	,verifyUser		= require( '../modules/verifyUserLoggedIn' )
	,contactModels	= require( '../models/contact.js' )
	,async			= require( 'async' )
	,jade			= require( 'jade' );

var contactListModel = contactModels.contactListModel;

module.exports.controller = function( app ) {
	// Outputs the results to browser and ends the request
	function outputResults( res, data )
	{
		res.setHeader( 'Content-Type', 'application/json' );
		res.json( data );
		res.end();
	}

	// Handles the main url (spits out the main template that pulls in the rest of the javascript)
	app.get( '/contactmanager', function( req, res ) {
		// Build the config object that we will send to our jade template
		var jadeConfig = { isDev: false }
		if( config.env === 'dev' ) {
			jadeConfig.isDev = true;
		}

		jade.renderFile( 'jade/contactmanager.jade', jadeConfig, function( error, html ) {
			// If we didn't encounter an error, send the resulting html to the browser
			if( ! error && html ) {
				res.write( html );
			}
			else {
				res.write( 'error rendering page, please try again' );
			}

			res.end();
		} );
	} );

	// Handles signup requests
	app.post( '/signup', function( req, res ) {
		// An object to store our result messages (errors)
		var results = {
			errors: []
			,newuser: false
		};

		// Create and save a new user
		var newUser = new userModel( req.body );

		newUser.save( function( err ) {
			if( err )
			{
				// Check to see if we got the duplicate user error
				if( err.errmsg.indexOf( 'duplicate key' ) !== 0 )
				{
					results.errors.push( 'That user name already exists.' +
											' Please login or choose a different name' );
				}
				else
				{
					results.errors.push( 'Error creating user, please try again' );
				}
			}
			else
			{
				contactModels = require( '../models/contact.js' );

				var contactListModel = contactModels.contactListModel;

				// Create a contact list for the new user so it will be ready to add
				// contacts to.
				var contactList = new contactListModel( { 
						ownerId: newUser.id, 
						contacts: []
				} );

				contactListModel.create( contactList, function( err, contactList ) {
					if( err )
					{
						results.errors.push( 'Error creating contact list' );
					}

					// If there are no errors and if a user object exists
					if( results.errors.length == 0 )
					{
						var returnData = {
							status: 'success',
							statusMessage: 'User successfully created, please login'
						};
					}
					else
					{
						var errorMessages = '';
						for( var i in results.errors )
							errorMessages += results.errors[i] + ' ';

						var returnData = {
							status: 'failure',
							errorMessage: errorMessages
						};
					}

					outputResults( res, returnData );
				} );
			}
		} );
	} );

	// Handles signin requests
	app.post( '/login', function( req, res ) {
		// An object to hold any errors we need to show the user
		var errors = [];

		// If we have a username and a password
		if( ! req.body.name || req.body.name.length === 0 )
		{
			errors.push( 'You must enter a user name' );
		}
		else if( ! req.body.password || req.body.password.length === 0 )
		{
			errors.push( 'You must enter your password' );
		}

		// If we haven't encountered any errors
		if( errors.length === 0 )
		{
			// Pull the user's data based on their user name and then check to see if
			// the password the user entered on the form matches the password in the DB
			var findData = { 
				'name': req.body.name,
				'password': userModel.hashPlainTextPassword( req.body.password )
			};

			userModel.findOne( findData, function( err, user ) {
				if( err )
				{
					// Let the user know the login failed
					outputResults( res, {
						login: 'failed',
						statusMessage: errors.join( '. ' )
					} );
				}
				else if( user )
				{
					// Set the logged in cookie and redirect the user to contact manager main page
					res.cookie( 'user', cryptoFuncs.encrypt( user.id ), { signed: true } );
					outputResults( res, {
						status: 'success',
						statusMessage: 'Login successful, please wait while you are redirected'
					} );
				}
				else {
					// Otherwise, if both err and usr are null, meaning no logins were found
					errors.push( 'Unable to login, please try again' );
					outputResults( res, {
						status: 'failed',
						statusMessage: errors.join( '. ' )
					} );
				}
			} );
		}
		else
		{
			// Send the errors to the user
			outputResults( res, {
				login: 'failed',
				statusMessage: errors.join( '. ' )
			} );
		}
	} );

	// Lets the front end check to see if a user is logged in or not
	app.get( '/user/isloggedin', function( req, res ) {
		if( req.loggedUser )
		{
			var returnData = {
				isLoggedIn: 'true'
			};
		}
		else
		{
			var returnData = {
				isLoggedIn: 'false'
			};
		}

		outputResults( res, returnData );
	} );

	// Lets the user log out
	app.get( '/user/logout', function( req, res ) {
		res.clearCookie( 'user' );

		// Let the frontend know that the cookie was deleted
		var returnData = {
			loggedOut: true
		};

		outputResults( res, returnData );
	} );

	// Redirects the user to the signin page from /
	app.get( '/', function( req, res ) {
		res.writeHead( 301, {
			'Location': '/signin.html'
		} );

		res.end();
	} );

	// Logs the current user out and ddeletes them (this is mainly for my unit tests right now)
	app.delete( '/user', verifyUser, function( req, res ) {
		// The data that will be sent back to the user after deletion
		var returnData = {
			status: 'success',
			statusMessage: 'User deleted successfully'
		};

		// Delete the user's contacts and main document (row)
		var asyncTasks = [];

		// Delete the user document
		asyncTasks.push( function( callback ) {
			userModel.remove( { _id: req.loggedUser.id }, function( err ) {
				if( err ) {
					returnData.status = 'failure';
					returnData.statusMessage =  err;
				}

				callback();
			} );
		} );

		// Delete the user's contact list document
		asyncTasks.push( function( callback ) {
			contactListModel.remove( { ownerId: req.loggedUser.id }, function( err ) {
				if( err ) {
					returnData.status = 'failure';
					returnData.statusMessage = err;
				}

				callback();
			} );
		} );

		async.parallel( asyncTasks, function() {
			// If we where able to delete the logged in user successfully, delete their cookies
			if( returnData.status == 'success' ) {
				res.clearCookie( 'user' );
			}

			outputResults( res, returnData );
		} );
	} );
}
