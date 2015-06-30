// Our requires
var config 			= require( '../config' )
	,cryptoFuncs	= require( '../modules/cryptoFuncs.js' )
	,userModel		= require( '../models/user.js' );

module.exports.controller = function( app ) {
	// Outputs the results to browser and ends the request
	function outputResults( res, data )
	{
		res.setHeader( 'Content-Type', 'application/json' );
		res.json( data );
		res.end();
	}

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
					errors.push( 'Unable to login, please try again' );
					outputResults( res, errors );
				}
				else if( user )
				{
					// Set the logged in cookie and redirect the user to contact manager main page
					res.cookie( 'user', cryptoFuncs.encrypt( user.id ), { signed: true } );
					outputResults( res, {
						login: 'successful',
						statusMessage: 'Login successful, please wait while you are redirected'
					} );
				}
			} );
		}
		else
		{
			// Send the errors to the user
			outputResults( res, errors );
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
}
