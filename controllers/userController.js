// Our requires
var config 		= require( '../config' )
	,userModel	= require( '../models/user.js' )
	,cryptoFuncs = require( '../modules/cryptoFuncs.js' );

module.exports.controller = function( app ) {
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
				results.newuser = newUser;
			}

			// If there are no errors and if a user object exists
			if( results.errors.length == 0 && results.newuser )
			{
				var returnData = {
					statusMessage: 'User successfully created, please login'
				};
			}
			else
			{
				var errorMessages = '';
				for( var i in results.errors )
					errorMessages += results.errors[i] + ' ';

				var returnData = {
					errorMessage: errorMessages
				};
			}

			// Send the results to the browser
			res.setHeader( 'Content-Type', 'application/json' );
			res.json( returnData );
			res.end();
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
					errors.push( 'Unable to login, please try again' );
					res.setHeader( 'Content-Type', 'application/json' );
					res.json( errors );
					res.end();
				}
				else if( user )
				{
					// Set the logged in cookie and redirect the user to contact manager main page
					res.cookie( 'user', cryptoFuncs.encrypt( user.id ), { signed: true } );
					res.json( {
						login: 'successful',
						statusMessage: 'Login successful, please wait while you are redirected'
					} );

					res.end();
				}
			} );
		}
		else
		{
			// Send the errors to the user
			res.setHeader( 'Content-Type', 'application/json' );
			res.json( errors );
			res.end();
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

		res.setHeader( 'Content-Type', 'application/json' );
		res.json( returnData );
		res.end();
	} );
}
