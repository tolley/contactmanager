// Our requires
var config 		= require( '../config' )
	,userModel	= require( '../models/user.js' )
	,cryptoFuncs = require( '../modules/cryptoFuncs.js' );

module.exports.controller = function( app ) {
	// Handles signup requests
	app.post( '/signup.html', function( req, res ) {
		console.log( 'creating user with ', req.body );

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
	app.post( '/signin.html', function( req, res ) {
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
					console.log( 'Signin errored ', err );
				}
				else if( user )
				{
					res.cookie( 'user', cryptoFuncs.encrypt( user.id ), { signed: true } );
				}

				res.end();
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
}
